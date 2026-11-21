import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ERAS_DATA } from './src/eras.ts';
import {
  findExistingSpecimenByTaxon,
  getAllSpecimens,
  getSpecimenById,
  getStats,
  initStore,
  upsertSpecimen,
} from './src/store.ts';
import {
  buildSpecimenFromKnown,
  estimateBiometricsByGroup,
  findKnownTaxon,
  getCuratedOccurrences,
  normalizeText,
} from './src/services/knowledgeEngine.ts';
import {
  fetchGbifIucnStatus,
  fetchGbifOccurrences,
  matchGbifSpecies,
} from './src/services/gbifService.ts';
import {
  fetchTaxonInfo,
  fetchTaxonOccurrences,
} from './src/services/pbdbService.ts';
import {
  fetchBioacoustics,
  fetchMultiPerspectiveImages,
  fetchWikipediaSummary,
  inferTaxonomyAndEcology,
  USER_AGENT,
  type BioacousticRecording,
} from './src/services/wikiService.ts';
import {
  ApiTtlCache,
  imageProxyCache,
  isAllowedImageUrl,
  MAX_PROXY_IMAGE_BYTES,
} from './src/services/imageProxyCache.ts';
import type {
  GalleryItem,
  IngestRequest,
  IngestResponse,
  Occurrence,
  Specimen,
} from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, 'public');

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  year: number | null;
  journal: string;
  doi: string;
  url: string;
  cited_by_count: number;
  is_oa: boolean;
  open_access_url: string;
  source: 'OpenAlex' | 'Crossref';
}

const occurrencesCache = new ApiTtlCache<Occurrence[]>(30 * 60 * 1000, 200);
const bioacousticsCache = new ApiTtlCache<BioacousticRecording[]>(60 * 60 * 1000, 200);
const researchPapersCache = new ApiTtlCache<ResearchPaper[]>(60 * 60 * 1000, 200);

// Initialize in-memory catalog from embedded_catalog.json
const seededCount = initStore();
console.log(
  `[BioAtlas] In-memory catalog initialized with ${seededCount} specimens.`
);

type ProgressCallback = (step: {
  stage: 'cache' | 'wiki' | 'gbif' | 'pbdb' | 'commons' | 'done';
  percent: number;
  label: string;
}) => void;

async function performAutoIngest(
  taxonName: string,
  eraHint?: string | null,
  onProgress?: ProgressCallback
): Promise<{ specimen: Specimen | null; deduplicated: boolean; reason?: string }> {
  const nameClean = taxonName.trim().slice(0, 120);
  const slug = normalizeText(nameClean).replace(/\s+/g, '-') || 'especime';

  onProgress?.({
    stage: 'cache',
    percent: 10,
    label: `Verificando acervo e base científica para "${nameClean}"...`,
  });

  // 0. Check pre-curated scientific knowledge engine first
  const known = findKnownTaxon(nameClean);
  if (known) {
    const existing = findExistingSpecimenByTaxon({
      id: known.id,
      name: known.name,
      scientific_name: known.scientific_name,
    });
    if (existing) {
      onProgress?.({
        stage: 'done',
        percent: 100,
        label: `Espécime "${existing.name}" já catalogado no acervo!`,
      });
      return { specimen: existing, deduplicated: true };
    }
    const specimen = buildSpecimenFromKnown(known);
    upsertSpecimen(specimen);
    onProgress?.({
      stage: 'done',
      percent: 100,
      label: `Dados curados de "${specimen.name}" carregados com sucesso!`,
    });
    return { specimen, deduplicated: false };
  }

  // Check local in-memory cache (by id/name/scientific_name)
  const existingDirect = findExistingSpecimenByTaxon({
    id: slug,
    name: nameClean,
  });
  if (existingDirect) {
    onProgress?.({
      stage: 'done',
      percent: 100,
      label: `Espécime "${existingDirect.name}" localizado no acervo (sem duplicação).`,
    });
    return { specimen: existingDirect, deduplicated: true };
  }

  // 1. Query Wikipedia (PT/EN)
  onProgress?.({
    stage: 'wiki',
    percent: 28,
    label: `1/4 • Consultando Wikipédia (PT/EN) para "${nameClean}"...`,
  });
  const wikiData = await fetchWikipediaSummary(nameClean);
  const wikiTitle = wikiData.title || nameClean;
  const wikiExtract = wikiData.extract || '';

  // Validation Gate 1: Immediately reject entities positively identified by Wikidata/Wikipedia as non-biological
  // (fictional characters, superheroes, anime/games, mythological creatures, humans/celebrities, cities, brands, objects)
  if (wikiData.found && wikiData.is_non_biological && !wikiData.is_biological_taxon) {
    return {
      specimen: null,
      deduplicated: false,
      reason: `"${nameClean}" não corresponde a uma espécie biológica ou fóssil real (identificado como personagem, obra, pessoa, lugar ou termo fora da biologia). O BioAtlas cataloga apenas seres vivos e fósseis reais.`,
    };
  }

  let scientificCandidate: string | null = wikiData.scientific_name || null;
  if (!scientificCandidate && wikiData.is_biological_taxon) {
    const scMatch = wikiExtract.match(
      /\((?:[a-z]{2}:\s*)?([A-Z][a-z]+ [a-z]+)\)/
    );
    if (scMatch) {
      scientificCandidate = scMatch[1];
    }
  }

  // 2. Query GBIF Backbone Taxonomy
  onProgress?.({
    stage: 'gbif',
    percent: 52,
    label: `2/4 • Validando taxonomia na GBIF (${scientificCandidate || wikiTitle})...`,
  });
  const gbifQuery = scientificCandidate || (wikiData.is_biological_taxon ? wikiTitle : nameClean);
  let gbifData = await matchGbifSpecies(gbifQuery);
  if (!gbifData && scientificCandidate && scientificCandidate !== nameClean) {
    gbifData = await matchGbifSpecies(nameClean);
  }

  const canonical =
    scientificCandidate &&
    scientificCandidate.includes(' ') &&
    (!gbifData?.canonical_name || !gbifData.canonical_name.includes(' '))
      ? scientificCandidate
      : gbifData?.canonical_name || scientificCandidate || wikiTitle;
  const scientific =
    gbifData?.scientific_name && gbifData.scientific_name.includes(' ')
      ? gbifData.scientific_name
      : scientificCandidate || gbifData?.scientific_name || canonical;

  // Deduplication check AFTER resolving formal scientific binomial (e.g. "Tigre" == "Panthera tigris")
  const existingByScientific = findExistingSpecimenByTaxon({
    name: wikiTitle,
    canonical,
    scientific_name: scientific,
  });
  if (existingByScientific) {
    onProgress?.({
      stage: 'done',
      percent: 100,
      label: `Identificado como "${existingByScientific.name}" (${existingByScientific.scientific_name || canonical}) — evitando duplicata!`,
    });
    return { specimen: existingByScientific, deduplicated: true };
  }

  // 3. Query PBDB for fossil taxon info
  onProgress?.({
    stage: 'pbdb',
    percent: 72,
    label: `3/4 • Consultando registros fósseis e eras na PBDB (${canonical})...`,
  });
  const pbdbData = await fetchTaxonInfo(scientificCandidate || canonical);

  // Validation Gate 2: Require verified biological proof from at least ONE scientific database
  // (Wikidata biological taxon claim, strict GBIF taxonomy match, or Paleobiology Database fossil taxon)
  const hasScientificVerification = Boolean(
    wikiData.is_biological_taxon || gbifData || pbdbData
  );
  if (!hasScientificVerification) {
    return {
      specimen: null,
      deduplicated: false,
      reason: `"${nameClean}" não foi reconhecido como uma espécie ou fóssil real nas bases científicas (GBIF, PBDB e Wikidata Taxonomia). Tente o nome popular ou científico de um animal, fóssil ou microrganismo real.`,
    };
  }

  // 4. Determine era & contemporary status
  const combinedLower =
    `${nameClean} ${canonical} ${scientific} ${wikiExtract}`.toLowerCase();

  const isPrehistoricDino = [
    'dinossauro',
    'dinosaur',
    'pterossauro',
    'pterosaur',
    'sauropod',
    'theropod',
    'ceratops',
    'hadrosaur',
    'jurássico',
    'jurassico',
    'cretáceo',
    'cretaceo',
    'triássico',
    'triassico',
    'mesozoico',
    'mesozóico',
  ].some((k) => combinedLower.includes(k));

  const isPaleozoic = [
    'paleozoico',
    'paleozóico',
    'permiano',
    'carbonífero',
    'carbonifero',
    'devoniano',
    'siluriano',
    'ordoviciano',
    'cambriano',
    'trilobita',
    'trilobite',
  ].some((k) => combinedLower.includes(k));

  const isCenozoicFossil = [
    'pleistoceno',
    'mioceno',
    'eoceno',
    'oligoceno',
    'paleoceno',
    'megafauna extinta',
    'smilodon',
    'mamute',
    'mammuthus',
  ].some((k) => combinedLower.includes(k));

  let isContemporary: boolean;
  let eraKey: string;
  let eraName: string;
  let periodPt: string;
  let geoRange: string;
  let conservationStatus: string;

  if (eraHint === 'contemporaneo' && !isPrehistoricDino && !isPaleozoic) {
    isContemporary = true;
    eraKey = 'contemporaneo';
    eraName = 'Contemporâneo (Fauna Atual)';
    periodPt = 'Holoceno / Atualidade';
    geoRange = 'Época Atual (Holoceno - Presente)';
    conservationStatus = 'Espécie Vivente';
  } else if (pbdbData && (pbdbData.max_ma ?? 0) > 0.01) {
    isContemporary = false;
    eraKey = pbdbData.era || 'mesozoico';
    eraName = pbdbData.era_display || 'Mesozoico';
    periodPt = pbdbData.period || 'Período Fóssil';
    geoRange = pbdbData.geological_range || 'Registro fóssil paleontológico';
    conservationStatus = 'Extinto no Registro Fóssil';
  } else if (isPrehistoricDino) {
    isContemporary = false;
    eraKey = 'mesozoico';
    eraName = 'Mesozoico';
    periodPt = 'Jurássico / Cretáceo';
    geoRange = 'Era Mesozoica (252 a 66 Ma)';
    conservationStatus = 'Extinto no Registro Fóssil';
  } else if (isPaleozoic) {
    isContemporary = false;
    eraKey = 'paleozoico';
    eraName = 'Paleozoico';
    periodPt = 'Paleozoico Superior';
    geoRange = 'Era Paleozoica (541 a 252 Ma)';
    conservationStatus = 'Extinto no Registro Fóssil';
  } else if (isCenozoicFossil) {
    isContemporary = false;
    eraKey = 'cenozoico';
    eraName = 'Cenozoico';
    periodPt = 'Neógeno / Pleistoceno';
    geoRange = 'Fóssil Cenozoico (66 Ma ao Pleistoceno)';
    conservationStatus = 'Extinto no Registro Fóssil';
  } else {
    isContemporary = true;
    eraKey = 'contemporaneo';
    eraName = 'Contemporâneo (Fauna Atual)';
    periodPt = 'Holoceno / Atualidade';
    geoRange = 'Época Atual (Holoceno - Presente)';
    conservationStatus = 'Espécie Vivente da Fauna Global';
  }

  // 4b. Enrich contemporary species with official IUCN Red List status from GBIF
  if (isContemporary && gbifData?.usage_key) {
    const iucn = await fetchGbifIucnStatus(gbifData.usage_key);
    if (iucn) {
      conservationStatus = iucn.label;
    }
  }

  // 5. Vertebrate vs Invertebrate vs Microbiological
  let skeletalType: string;
  let skeletalComp: string;
  let cladogram: string[];

  if (gbifData) {
    skeletalType = gbifData.skeletal_type || 'vertebrado';
    skeletalComp =
      gbifData.skeletal_composition || 'Endoesqueleto Ósseo e Cartilagem';
    cladogram = gbifData.cladogram || [];
  } else {
    const isMicro = [
      'tardigrad',
      'bacteri',
      'cianobact',
      'ameba',
      'amoeba',
      'paramecium',
      'diatom',
      'foraminif',
      'nummulite',
      'virus',
      'vírus',
      'protist',
    ].some((k) => canonical.toLowerCase().includes(k));

    if (isMicro) {
      skeletalType = 'microbiologico';
      skeletalComp =
        'Parede Celular / Membrana Plasmática / Cutícula Acelular';
      cladogram = ['Biota', 'Microbiologia', canonical];
    } else {
      const isInv = [
        'invertebrad',
        'artrópode',
        'inseto',
        'aracnídeo',
        'molusco',
        'polvo',
        'caracol',
        'verme',
        'cnidário',
        'água-viva',
        'crustáceo',
      ].some((k) => combinedLower.includes(k));
      skeletalType = isInv ? 'invertebrado' : 'vertebrado';
      skeletalComp = isInv
        ? 'Exoesqueleto Quitinoso ou Concha Calcária'
        : 'Endoesqueleto Ósseo e Cartilagem';
      cladogram = ['Metazoa', isInv ? 'Invertebrata' : 'Chordata', canonical];
    }
  }

  // 6. Infer ecology and habitat
  const ecology = inferTaxonomyAndEcology(
    canonical,
    pbdbData,
    wikiData,
    gbifData
  );

  // 7. Extract realistic biometrics
  const lenMatch = wikiExtract.match(
    /(\d+(?:[.,]\d+)?\s*(?:a\s*\d+(?:[.,]\d+)?)?\s*(?:metros?|m|centímetros?|cm|milímetros?|mm))\b/i
  );
  const wtMatch = wikiExtract.match(
    /(\d+(?:[.,]\d+)?\s*(?:a\s*\d+(?:[.,]\d+)?)?\s*(?:quilogramas?|kg|toneladas?|t|gramas?|g))\b/i
  );
  const spdMatch = wikiExtract.match(
    /(\d+(?:[.,]\d+)?\s*(?:a\s*\d+(?:[.,]\d+)?)?\s*km\/h)\b/i
  );

  const defaults = estimateBiometricsByGroup(
    ecology.group,
    ecology.diet,
    ecology.habitat,
    nameClean
  );

  // 8. Fetch multi-perspective images (target 10-12 verified photos: life, restorations, skeletons, skulls, fossils)
  onProgress?.({
    stage: 'commons',
    percent: 88,
    label: `4/4 • Coletando galeria completa (10+ fotos em vida, crânios e esqueletos) na Wikimedia Commons...`,
  });
  const searchTerm = scientificCandidate || canonical;
  const fallbackImageTerms = [
    gbifData?.genus || '',
    wikiTitle,
    nameClean,
    gbifData?.family_name || pbdbData?.family_name || '',
    gbifData?.order_name || pbdbData?.order_name || '',
  ].filter(Boolean);
  let images = await fetchMultiPerspectiveImages(searchTerm, 12, fallbackImageTerms);

  // Always include Wikipedia's verified lead image if valid (non-SVG) and not already present
  const cleanWikiLead =
    wikiData.image_url && !/\.svg(\?|$)/i.test(wikiData.image_url)
      ? wikiData.image_url.replace(/[?&]utm_[^&]+/g, '')
      : null;

  if (cleanWikiLead && !images.some((img) => img.url === cleanWikiLead)) {
    images.unshift({
      url: cleanWikiLead,
      caption: `${wikiTitle} — Fotografia / referência principal (Wikipédia)`,
      type: 'living_specimen',
      category: 'life_view',
      author: 'Wikimedia Commons / Wikipédia',
    });
  }
  if (images.length > 12) {
    images = images.slice(0, 12);
  }

  let primaryImage: string;
  const lifeImgs = images.filter((img) => img.category === 'life_view');
  if (lifeImgs.length > 0) {
    primaryImage = lifeImgs[0].url;
  } else if (images.length > 0) {
    primaryImage = images[0].url;
  } else if (cleanWikiLead) {
    primaryImage = cleanWikiLead;
  } else {
    const safeName = encodeURIComponent(nameClean);
    const safeSci = encodeURIComponent(scientific);
    primaryImage = `data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22400%22%20viewBox%3D%220%200%20600%20400%22%3E%3Crect%20fill%3D%22%230d1510%22%20width%3D%22600%22%20height%3D%22400%22%2F%3E%3Ctext%20fill%3D%22%2310b981%22%20font-family%3D%22system-ui%22%20font-size%3D%2264%22%20x%3D%2250%25%22%20y%3D%2242%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3E%F0%9F%A6%AC%3C%2Ftext%3E%3Ctext%20fill%3D%22%23ffffff%22%20font-family%3D%22system-ui%22%20font-weight%3D%22bold%22%20font-size%3D%2222%22%20x%3D%2250%25%22%20y%3D%2262%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3E${safeName}%3C%2Ftext%3E%3Ctext%20fill%3D%22%2394a3b8%22%20font-family%3D%22system-ui%22%20font-size%3D%2214%22%20x%3D%2250%25%22%20y%3D%2272%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3E${safeSci}%3C%2Ftext%3E%3C%2Fsvg%3E`;
  }

  const galleryItems: GalleryItem[] = images.slice(0, 12).map((img) => ({
    url: img.url,
    caption: img.caption || `Representação de ${canonical}`,
    type: img.type || 'living_specimen',
    category: img.category || 'life_view',
    author: img.author || 'Wikimedia Commons',
  }));

  const canonicalSlug =
    normalizeText(canonical).replace(/\s+/g, '-') || slug;
  const skeletalCap =
    skeletalType.charAt(0).toUpperCase() + skeletalType.slice(1);

  const specimen: Specimen = {
    id: canonicalSlug.slice(0, 120),
    name: wikiTitle,
    genus: gbifData?.genus || canonical,
    scientific_name: scientific,
    era: eraKey,
    era_display: eraName,
    period: periodPt,
    epoch: periodPt,
    geological_range: geoRange,
    group: ecology.group,
    group_display: ecology.group_display,
    diet: ecology.diet,
    diet_display: ecology.diet_display,
    habitat: ecology.habitat,
    skeletal_type: skeletalType,
    skeletal_composition: skeletalComp,
    is_contemporary: isContemporary,
    conservation_status: conservationStatus,
    length: lenMatch ? lenMatch[1] : defaults.length,
    height: defaults.height,
    weight: wtMatch ? wtMatch[1] : defaults.weight,
    speed: spdMatch ? spdMatch[1] : defaults.speed,
    bite_force: defaults.bite_force,
    image_url: primaryImage,
    image_caption: `Representação de ${canonical}`,
    gallery: galleryItems,
    etymology: `Táxon descrito cientificamente como ${scientific}.`,
    bio:
      wikiExtract ||
      `${canonical} (${scientific}) é um organismo da história biológica do planeta Terra.`,
    curiosities: [
      `Classificação Estrutural: ${skeletalCap} (${skeletalComp}).`,
      `Pertence ao grupo taxonômico ${ecology.group_display} com hábito alimentar ${ecology.diet_display}.`,
      'Consome dados científicos integrados da GBIF, PBDB e acervos abertos de anatomia.',
      `Status e Época Geológica: ${eraName} (${periodPt}).`,
    ],
    expert: {
      cladogram,
      osteology: `Organização esquelética do tipo ${skeletalType.toUpperCase()}: ${skeletalComp}. Morfologia adaptada ao nicho de ${ecology.diet_display} em habitat ${ecology.habitat}.`,
      biomechanics: `Cinemática e sustentação física adaptadas ao meio ${ecology.habitat}, com suporte mecânico por ${skeletalComp.toLowerCase()}.`,
      histology: `Estrutura tecidual com densidade celular típica de organismos do grupo ${ecology.group_display}.`,
    },
    occurrences_count: 18,
    fossil_locations: isContemporary
      ? 'Distribuição biogeográfica global'
      : `Estratos fósseis do período ${periodPt}`,
    is_custom_ingested: true,
  };

  upsertSpecimen(specimen);
  onProgress?.({
    stage: 'done',
    percent: 100,
    label: `"${specimen.name}" catalogado com sucesso!`,
  });
  return { specimen, deduplicated: false };
}

// ============================================================================
// REST API ENDPOINTS
// ============================================================================

app.get('/api/eras', (_req, res) => {
  res.json(ERAS_DATA);
});

app.get('/api/specimens', (req, res) => {
  const query = req.query as Record<string, string | undefined>;
  const results = getAllSpecimens({
    era: query.era,
    period: query.period,
    diet: query.diet,
    group: query.group,
    habitat: query.habitat,
    skeletal_type: query.skeletal_type,
    search: query.search,
    clade: query.clade,
  });
  res.json(results);
});

// Hydrate custom specimens loaded from Firestore into the active server catalog
app.post('/api/specimens/sync', (req, res) => {
  const items = Array.isArray(req.body?.specimens)
    ? (req.body.specimens as Specimen[])
    : [];
  let synced = 0;
  for (const item of items.slice(0, 100)) {
    if (item && typeof item.id === 'string' && typeof item.name === 'string') {
      const existing = findExistingSpecimenByTaxon({
        id: item.id,
        name: item.name,
        scientific_name: item.scientific_name || undefined,
      });
      if (!existing) {
        upsertSpecimen({ ...item, is_custom_ingested: true });
        synced++;
      }
    }
  }
  res.json({ synced, total: getStats().total_specimens });
});

app.get('/api/specimens/:identifier', async (req, res) => {
  const identifier = req.params.identifier;
  const cleanId = identifier.toLowerCase().trim().replace(/\s+/g, '-');
  let spec = getSpecimenById(cleanId) || getSpecimenById(identifier.trim());

  if (!spec) {
    try {
      const resIngest = await performAutoIngest(identifier);
      spec = resIngest.specimen;
    } catch (err) {
      console.error(`[BioAtlas] Auto-ingest failed for '${identifier}':`, err);
    }
  }

  if (!spec) {
    res
      .status(404)
      .json({ detail: `Espécime '${identifier}' não encontrado no acervo.` });
    return;
  }

  res.json(spec);
});

app.post('/api/ingest', async (req, res) => {
  const body = (req.body || {}) as Partial<IngestRequest>;
  const name = (body.name || '').trim();
  if (!name || name.length > 120) {
    res.status(400).json({
      detail: 'Nome do espécime deve ter entre 1 e 120 caracteres.',
    });
    return;
  }

  try {
    const { specimen, deduplicated, reason } = await performAutoIngest(
      name,
      body.era_hint
    );
    if (!specimen) {
      const response: IngestResponse = {
        success: false,
        message:
          reason ||
          `Não foi possível localizar dados científicos suficientes para '${name}'.`,
        specimen: null,
      };
      res.json(response);
      return;
    }

    const skeletalCap =
      specimen.skeletal_type.charAt(0).toUpperCase() +
      specimen.skeletal_type.slice(1);
    const response: IngestResponse = {
      success: true,
      message: deduplicated
        ? `Espécime '${specimen.name}' (${specimen.scientific_name || specimen.genus}) já estava no acervo — duplicata evitada!`
        : `Espécime '${specimen.name}' (${skeletalCap}) catalogado com sucesso no BioAtlas!`,
      specimen,
    };
    res.json(response);
  } catch (err) {
    console.error(`[BioAtlas] Error during ingestion of '${name}':`, err);
    const response: IngestResponse = {
      success: false,
      message: `Erro interno durante a ingestão do espécime: ${err instanceof Error ? err.message : String(err)}`,
      specimen: null,
    };
    res.json(response);
  }
});

// Real-time Server-Sent Events (SSE) endpoint for multi-stage ingestion progress
app.get('/api/ingest-stream', async (req, res) => {
  const name =
    typeof req.query.name === 'string' ? req.query.name.trim() : '';
  const eraHint =
    typeof req.query.era_hint === 'string' ? req.query.era_hint : null;

  if (!name || name.length > 120) {
    res
      .status(400)
      .json({ detail: 'Nome do espécime deve ter entre 1 e 120 caracteres.' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const sendEvent = (eventName: string, payload: unknown) => {
    res.write(`event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`);
  };

  try {
    const { specimen, deduplicated, reason } = await performAutoIngest(
      name,
      eraHint,
      (step) => {
        sendEvent('progress', step);
      }
    );

    if (!specimen) {
      sendEvent('result', {
        success: false,
        message:
          reason ||
          `Não foi possível localizar dados científicos suficientes para '${name}'.`,
        specimen: null,
      });
    } else {
      const skeletalCap =
        specimen.skeletal_type.charAt(0).toUpperCase() +
        specimen.skeletal_type.slice(1);
      sendEvent('result', {
        success: true,
        deduplicated,
        message: deduplicated
          ? `Espécime '${specimen.name}' já estava no acervo — duplicata evitada!`
          : `Espécime '${specimen.name}' (${skeletalCap}) catalogado com sucesso no BioAtlas!`,
        specimen,
      });
    }
  } catch (err) {
    sendEvent('result', {
      success: false,
      message: `Erro durante a ingestão: ${err instanceof Error ? err.message : String(err)}`,
      specimen: null,
    });
  } finally {
    res.end();
  }
});

app.get('/api/discover', (req, res) => {
  const era = typeof req.query.era === 'string' ? req.query.era : undefined;
  let allSpecs = getAllSpecimens({
    era: era && era !== 'all' ? era : undefined,
  });
  if (allSpecs.length === 0) {
    allSpecs = getAllSpecimens();
  }

  const pool = [...allSpecs];
  const count = Math.min(pool.length, 4);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  res.json(pool.slice(0, count));
});

app.get('/api/occurrences/:taxon_name', async (req, res) => {
  const cleanName = req.params.taxon_name.trim();
  const limitRaw = Number(req.query.limit);
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 60) : 40;
  const cacheKey = `${normalizeText(cleanName)}:${limit}`;

  const cached = occurrencesCache.get(cacheKey);
  if (cached) {
    res.setHeader('X-Cache', 'HIT');
    res.json(cached);
    return;
  }

  // 0. Check pre-curated high-accuracy coordinates
  const curated = getCuratedOccurrences(cleanName);
  if (curated.length > 0) {
    occurrencesCache.set(cacheKey, curated);
    res.json(curated);
    return;
  }

  const spec =
    getSpecimenById(cleanName.toLowerCase().replace(/\s+/g, '-')) ||
    getSpecimenById(cleanName);
  if (spec) {
    const candidates = [spec.id, spec.name, spec.scientific_name, spec.genus];
    for (const candidate of candidates) {
      if (candidate) {
        const c = getCuratedOccurrences(candidate);
        if (c.length > 0) {
          occurrencesCache.set(cacheKey, c);
          res.json(c);
          return;
        }
      }
    }
  }

  // 1. Contemporary species -> GBIF
  if (spec && spec.is_contemporary) {
    const queryTarget = spec.scientific_name || spec.genus || cleanName;
    const gbifMatch = await matchGbifSpecies(queryTarget);
    if (gbifMatch?.usage_key) {
      const occs = await fetchGbifOccurrences(gbifMatch.usage_key, limit);
      if (occs.length > 0) {
        occurrencesCache.set(cacheKey, occs);
        res.json(occs);
        return;
      }
    }
  }

  // 2. Fossil / Fallback -> PBDB
  const pbdbTarget = spec
    ? spec.scientific_name || spec.genus || cleanName
    : cleanName;
  const pbdbOccs = await fetchTaxonOccurrences(pbdbTarget, limit);
  if (pbdbOccs.length > 0) {
    occurrencesCache.set(cacheKey, pbdbOccs);
    res.json(pbdbOccs);
    return;
  }

  // 3. Final fallback -> GBIF
  const gbifMatch = await matchGbifSpecies(cleanName);
  if (gbifMatch?.usage_key) {
    const occs = await fetchGbifOccurrences(gbifMatch.usage_key, limit);
    if (occs.length > 0) {
      occurrencesCache.set(cacheKey, occs);
      res.json(occs);
      return;
    }
  }

  res.json([]);
});

function normalizeWikimediaThumbUrl(rawUrl: string): string {
  if (!rawUrl.includes('/wikipedia/commons/thumb/')) return rawUrl;
  return rawUrl.replace(/\/(\d+)px-([^/?#]+)(\?.*)?$/, (_, wStr, rest, qs = '') => {
    const w = Number(wStr);
    let target = 960;
    if (w <= 330) target = 330;
    else if (w <= 500) target = 500;
    else if (w <= 960) target = 960;
    else target = 1280;
    return `/${target}px-${rest}${qs}`;
  });
}

function getOriginalWikimediaUrl(thumbUrl: string): string | null {
  if (!thumbUrl.includes('/wikipedia/commons/thumb/')) return null;
  const clean = thumbUrl.split('?')[0];
  const stripped = clean
    .replace('https://thumb.wikimedia.org/', 'https://upload.wikimedia.org/')
    .replace('/wikipedia/commons/thumb/', '/wikipedia/commons/')
    .replace(/\/[^/]+$/, '');
  return stripped !== clean ? stripped : null;
}

const inFlightProxyFetches = new Map<
  string,
  Promise<{ status: number; buffer?: Buffer; contentType?: string; error?: string }>
>();

const MAX_UPSTREAM_IMAGE_CONCURRENCY = 6;
let activeUpstreamImageFetches = 0;
const upstreamImageQueue: Array<() => void> = [];

async function withUpstreamImageSlot<T>(task: () => Promise<T>): Promise<T> {
  if (activeUpstreamImageFetches >= MAX_UPSTREAM_IMAGE_CONCURRENCY) {
    await new Promise<void>((resolve) => upstreamImageQueue.push(resolve));
  }
  activeUpstreamImageFetches++;
  try {
    return await task();
  } finally {
    activeUpstreamImageFetches--;
    const next = upstreamImageQueue.shift();
    if (next) next();
  }
}

async function fetchImageUpstream(
  targetUrl: string
): Promise<{ status: number; buffer?: Buffer; contentType?: string; error?: string }> {
  return withUpstreamImageSlot(async () => {
    const candidates = [normalizeWikimediaThumbUrl(targetUrl)];
    const orig = getOriginalWikimediaUrl(targetUrl);
    if (orig && !candidates.includes(orig)) candidates.push(orig);

    let lastStatus = 502;
    for (const candidate of candidates) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const resp = await fetch(candidate, {
            headers: {
              'User-Agent': USER_AGENT,
              Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
            },
            signal: AbortSignal.timeout(12000),
          });
          lastStatus = resp.status;
          if (resp.status === 429 && attempt === 0) {
            await new Promise((r) => setTimeout(r, 800));
            continue;
          }
          if (!resp.ok) break;

          const contentType = resp.headers.get('content-type') || 'image/jpeg';
          if (!contentType.toLowerCase().startsWith('image/')) {
            return { status: 415, error: 'O recurso remoto não é uma imagem.' };
          }

          const arrayBuffer = await resp.arrayBuffer();
          if (arrayBuffer.byteLength > MAX_PROXY_IMAGE_BYTES) {
            return { status: 413, error: 'Imagem excede o limite de tamanho.' };
          }

          return {
            status: 200,
            buffer: Buffer.from(arrayBuffer),
            contentType,
          };
        } catch (err) {
          if (attempt === 1) {
            return {
              status: 502,
              error: `Erro ao transmitir imagem: ${err instanceof Error ? err.message : String(err)}`,
            };
          }
        }
      }
    }
    return { status: lastStatus, error: 'Falha ao carregar imagem remota.' };
  });
}

// Secure image proxy with domain allowlist + LRU cache + in-flight deduplication
app.get('/api/proxy-image', async (req, res) => {
  const url = typeof req.query.url === 'string' ? req.query.url.trim() : '';
  const check = isAllowedImageUrl(url);
  if (!check.allowed) {
    res.status(403).json({
      detail: check.reason || 'URL de imagem não permitida pelo proxy.',
    });
    return;
  }

  const normalizedUrl = normalizeWikimediaThumbUrl(url);
  const cached = imageProxyCache.get(normalizedUrl);
  if (cached) {
    res.setHeader('Content-Type', cached.contentType);
    res.setHeader('Cache-Control', 'public, max-age=604800');
    res.setHeader('X-Cache', 'HIT');
    res.send(cached.buffer);
    return;
  }

  let pending = inFlightProxyFetches.get(normalizedUrl);
  if (!pending) {
    pending = fetchImageUpstream(normalizedUrl).finally(() => {
      inFlightProxyFetches.delete(normalizedUrl);
    });
    inFlightProxyFetches.set(normalizedUrl, pending);
  }

  const result = await pending;
  if (result.status !== 200 || !result.buffer || !result.contentType) {
    res.status(result.status).json({ detail: result.error || 'Falha ao carregar imagem remota.' });
    return;
  }

  imageProxyCache.set(normalizedUrl, result.buffer, result.contentType);
  res.setHeader('Content-Type', result.contentType);
  res.setHeader('Cache-Control', 'public, max-age=604800');
  res.setHeader('X-Cache', 'MISS');
  res.send(result.buffer);
});

// Real Bioacoustics lookup via Wikimedia Commons (CC-licensed vocalizations)
app.get('/api/bioacoustics/:taxon_name', async (req, res) => {
  const rawTaxon = req.params.taxon_name.trim();
  const extra = typeof req.query.extra === 'string' ? req.query.extra.trim() : '';
  const cacheKey = normalizeText(`${rawTaxon}|${extra}`);

  const cached = bioacousticsCache.get(cacheKey);
  if (cached) {
    res.setHeader('X-Cache', 'HIT');
    res.json(cached);
    return;
  }

  const recordings = await fetchBioacoustics(rawTaxon, extra || undefined);
  bioacousticsCache.set(cacheKey, recordings);
  res.json(recordings);
});

// Secure audio proxy for Wikimedia Commons bioacoustic recordings
app.get('/api/proxy-audio', async (req, res) => {
  const url = typeof req.query.url === 'string' ? req.query.url.trim() : '';
  const check = isAllowedImageUrl(url);
  if (!check.allowed) {
    res.status(403).json({ detail: 'URL de áudio não permitida pelo proxy.' });
    return;
  }

  try {
    const headers: Record<string, string> = { 'User-Agent': USER_AGENT };
    if (typeof req.headers.range === 'string') {
      headers.Range = req.headers.range;
    }
    const resp = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(15000),
    });
    if (!resp.ok && resp.status !== 206) {
      res.status(resp.status).json({ detail: 'Falha ao carregar áudio remoto.' });
      return;
    }

    const contentType = resp.headers.get('content-type') || 'audio/ogg';
    if (
      !contentType.toLowerCase().includes('audio') &&
      !contentType.toLowerCase().includes('ogg') &&
      !contentType.toLowerCase().includes('octet-stream')
    ) {
      res.status(415).json({ detail: 'Recurso remoto não é um arquivo de áudio.' });
      return;
    }

    res.status(resp.status);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=604800');
    const contentRange = resp.headers.get('content-range');
    if (contentRange) res.setHeader('Content-Range', contentRange);
    const contentLength = resp.headers.get('content-length');
    if (contentLength) res.setHeader('Content-Length', contentLength);

    const buf = Buffer.from(await resp.arrayBuffer());
    res.send(buf);
  } catch (err) {
    res.status(502).json({
      detail: `Erro ao transmitir áudio: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
});

// Real peer-reviewed scientific literature via OpenAlex + Crossref fallback
app.get('/api/research/:taxon_name', async (req, res) => {
  const rawTaxon = req.params.taxon_name.trim().slice(0, 140);
  const sortMode = req.query.sort === 'recent' ? 'recent' : 'cited';
  if (!rawTaxon) {
    res.json([]);
    return;
  }

  // Strip taxonomic authority/year suffixes like "Tyrannosaurus Osborn, 1905" -> "Tyrannosaurus"
  const cleanTaxon = rawTaxon
    .replace(/\([^)]*\)/g, ' ')
    .replace(/,\s*\d{4}.*$/i, '')
    .replace(/\s+[A-Z][a-z]+\s*,\s*\d{4}.*$/, '')
    .replace(/\s+\d{4}.*$/, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 2)
    .join(' ');

  const cacheKey = `${normalizeText(cleanTaxon)}:${sortMode}`;
  const cached = researchPapersCache.get(cacheKey);
  if (cached) {
    res.setHeader('X-Cache', 'HIT');
    res.json(cached);
    return;
  }

  const papers: ResearchPaper[] = [];

  // 1. Primary: OpenAlex Open Scientific Graph API (title match to guarantee biological relevance)
  try {
    const oaSort = sortMode === 'recent' ? 'publication_year:desc' : 'cited_by_count:desc';
    const oaUrl = `https://api.openalex.org/works?filter=title.search:${encodeURIComponent(cleanTaxon)},type:article&sort=${oaSort}&per-page=10&mailto=bioatlas@research.org`;
    const oaRes = await fetch(oaUrl, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      signal: AbortSignal.timeout(9000),
    });
    if (oaRes.ok) {
      const data = (await oaRes.json()) as {
        results?: Array<{
          id?: string;
          title?: string;
          display_name?: string;
          publication_year?: number;
          doi?: string;
          cited_by_count?: number;
          open_access?: { is_oa?: boolean; oa_url?: string };
          primary_location?: {
            source?: { display_name?: string };
            landing_page_url?: string;
          };
          authorships?: Array<{ author?: { display_name?: string } }>;
        }>;
      };
      for (const w of data.results || []) {
        const title = String(w.display_name || w.title || '').trim();
        if (!title) continue;
        const doiRaw = String(w.doi || '').replace(/^https?:\/\/doi\.org\//i, '').trim();
        const url =
          (doiRaw ? `https://doi.org/${doiRaw}` : '') ||
          w.open_access?.oa_url ||
          w.primary_location?.landing_page_url ||
          String(w.id || '');
        const authors = (w.authorships || [])
          .map((a) => a.author?.display_name || '')
          .filter(Boolean)
          .slice(0, 5);
        papers.push({
          id: String(w.id || doiRaw || title),
          title,
          authors,
          year: typeof w.publication_year === 'number' ? w.publication_year : null,
          journal: w.primary_location?.source?.display_name || 'Periódico Científico',
          doi: doiRaw,
          url,
          cited_by_count: Number(w.cited_by_count) || 0,
          is_oa: Boolean(w.open_access?.is_oa),
          open_access_url: w.open_access?.oa_url || '',
          source: 'OpenAlex',
        });
      }
    }
  } catch {
    // fallback to Crossref below
  }

  // 2. Fallback: Crossref API (title match)
  if (papers.length === 0) {
    try {
      const crSort = sortMode === 'recent' ? 'published' : 'is-referenced-by-count';
      const crUrl = `https://api.crossref.org/works?query.title=${encodeURIComponent(cleanTaxon)}&rows=8&sort=${crSort}&order=desc`;
      const crRes = await fetch(crUrl, {
        headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
        signal: AbortSignal.timeout(9000),
      });
      if (crRes.ok) {
        const data = (await crRes.json()) as {
          message?: {
            items?: Array<{
              DOI?: string;
              title?: string[];
              author?: Array<{ given?: string; family?: string }>;
              'container-title'?: string[];
              issued?: { 'date-parts'?: number[][] };
              'is-referenced-by-count'?: number;
              URL?: string;
            }>;
          };
        };
        for (const item of data.message?.items || []) {
          const title = String(item.title?.[0] || '').trim();
          if (!title) continue;
          const doi = String(item.DOI || '').trim();
          const year = item.issued?.['date-parts']?.[0]?.[0] ?? null;
          const authors = (item.author || [])
            .map((a) => [a.given, a.family].filter(Boolean).join(' ').trim())
            .filter(Boolean)
            .slice(0, 5);
          papers.push({
            id: doi || title,
            title,
            authors,
            year: typeof year === 'number' ? year : null,
            journal: item['container-title']?.[0] || 'Periódico Científico',
            doi,
            url: doi ? `https://doi.org/${doi}` : String(item.URL || ''),
            cited_by_count: Number(item['is-referenced-by-count']) || 0,
            is_oa: false,
            open_access_url: '',
            source: 'Crossref',
          });
        }
      }
    } catch {
      // return empty list gracefully
    }
  }

  researchPapersCache.set(cacheKey, papers);
  res.json(papers);
});

app.get('/api/stats', (_req, res) => {
  res.json({
    ...getStats(),
    proxy_cache: imageProxyCache.stats(),
  });
});

// ============================================================================
// STATIC FRONTEND SERVING
// ============================================================================

app.use('/static', express.static(PUBLIC_DIR));
app.use(express.static(PUBLIC_DIR));

app.get('/favicon.ico', (_req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌍</text></svg>'
  );
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`BioAtlas Node.js server listening on http://${HOST}:${PORT}`);
});
