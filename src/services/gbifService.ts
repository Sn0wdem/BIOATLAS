import type { Occurrence } from '../types.ts';

const USER_AGENT =
  'SuperWikiAnimalExplorer/3.0 (bio@earthwiki.org; educational research)';

export interface GbifMatchResult {
  usage_key?: number;
  scientific_name: string;
  canonical_name: string;
  genus: string;
  kingdom?: string;
  phylum: string;
  class_name: string;
  order_name: string;
  family_name: string;
  skeletal_type: string;
  skeletal_composition: string;
  cladogram: string[];
  rank: string;
}

export interface GbifIucnResult {
  code: string;
  label: string;
}

const IUCN_LABELS: Record<string, string> = {
  LC: 'Pouco Preocupante (LC)',
  NT: 'Quase Ameaçada (NT)',
  VU: 'Vulnerável (VU)',
  EN: 'Em Perigo (EN)',
  CR: 'Criticamente em Perigo (CR)',
  EW: 'Extinta na Natureza (EW)',
  EX: 'Extinta (EX)',
  DD: 'Dados Insuficientes (DD)',
};

export async function fetchGbifIucnStatus(
  usageKey: number
): Promise<GbifIucnResult | null> {
  try {
    const resp = await fetch(
      `https://api.gbif.org/v1/species/${encodeURIComponent(String(usageKey))}/iucnRedListCategory`,
      {
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!resp.ok) return null;
    const data = (await resp.json()) as { code?: string; category?: string };
    const code = String(data.code || data.category || '').toUpperCase().trim();
    if (!code || !IUCN_LABELS[code]) return null;
    return { code, label: IUCN_LABELS[code] };
  } catch {
    return null;
  }
}

function normTaxonToken(str: string): string {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function candidateMatchesQueryStrictly(
  c: Record<string, unknown>,
  rawQuery: string
): boolean {
  const qNorm = normTaxonToken(rawQuery);
  if (!qNorm || qNorm.length < 3) return false;

  const canonical = normTaxonToken(String(c.canonicalName || ''));
  const genus = normTaxonToken(String(c.genus || ''));
  const sci = normTaxonToken(String(c.scientificName || ''));

  // Exact match on canonical name, genus, or scientific name prefix
  if (canonical === qNorm || genus === qNorm || sci.startsWith(`${qNorm} `)) {
    return true;
  }

  // Exact match on any official vernacular name registered in GBIF
  const vernaculars = Array.isArray(c.vernacularNames)
    ? (c.vernacularNames as Array<{ vernacularName?: string }>)
    : [];
  for (const v of vernaculars) {
    const vNorm = normTaxonToken(v?.vernacularName || '');
    if (vNorm && vNorm === qNorm) {
      return true;
    }
  }

  return false;
}

export async function matchGbifSpecies(
  query: string
): Promise<GbifMatchResult | null> {
  const cleanQuery = query.trim();
  if (!cleanQuery || cleanQuery.length < 2) return null;

  const url = `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(cleanQuery)}&verbose=true`;
  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(12000),
    });
    if (!resp.ok) return null;

    let data = (await resp.json()) as Record<string, unknown>;
    const matchType = String(data.matchType || 'NONE').toUpperCase();
    const confidence = Number(data.confidence || 0);
    const rankStr = String(data.rank || '').toUpperCase();

    const isAcceptableDirectMatch =
      (matchType === 'EXACT' &&
        rankStr !== 'KINGDOM' &&
        rankStr !== '' &&
        Boolean(data.canonicalName)) ||
      (matchType === 'FUZZY' &&
        confidence >= 92 &&
        ['SPECIES', 'SUBSPECIES', 'GENUS', 'FAMILY', 'ORDER', 'CLASS'].includes(rankStr) &&
        Boolean(data.canonicalName));

    const isBroadHigherRank =
      matchType === 'HIGHERRANK' &&
      !['SPECIES', 'GENUS', 'SUBSPECIES'].includes(rankStr);

    if (!isAcceptableDirectMatch) {
      // Only fall back to GBIF species search if we strictly verify scientific or exact vernacular match
      const speciesSearchUrl = `https://api.gbif.org/v1/species/search?q=${encodeURIComponent(cleanQuery)}&rank=SPECIES&status=ACCEPTED&limit=10`;
      const sResp = await fetch(speciesSearchUrl, {
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(12000),
      });
      let matchedCandidate: Record<string, unknown> | null = null;
      if (sResp.ok) {
        const sData = (await sResp.json()) as {
          results?: Record<string, unknown>[];
        };
        const candidates = (sData.results || []).filter((c) =>
          candidateMatchesQueryStrictly(c, cleanQuery)
        );
        matchedCandidate =
          candidates.find(
            (c) =>
              String(c.kingdom || '').toLowerCase() === 'animalia' &&
              typeof c.canonicalName === 'string' &&
              c.canonicalName.includes(' ')
          ) ||
          candidates.find(
            (c) =>
              typeof c.canonicalName === 'string' &&
              c.canonicalName.includes(' ')
          ) ||
          candidates[0] ||
          null;
      }

      if (matchedCandidate) {
        data = matchedCandidate;
      } else if (
        isBroadHigherRank &&
        ['PHYLUM', 'CLASS', 'ORDER', 'FAMILY'].includes(rankStr) &&
        normTaxonToken(String(data.canonicalName || '')) === normTaxonToken(cleanQuery)
      ) {
        // Accept explicit clade searches like "Cetacea" or "Carnivora"
      } else {
        return null;
      }
    }

    const phylum = String(data.phylum || '');
    const className = String(data.class || '');
    const orderName = String(data.order || '');
    const familyName = String(data.family || '');
    const genusName = String(data.genus || data.canonicalName || query);
    const scientificName = String(data.scientificName || query);
    const kingdomName = String(data.kingdom || '');
    const canonicalName = String(data.canonicalName || genusName);

    const qLower = query.toLowerCase();
    const pLower = phylum.toLowerCase();
    const cLower = className.toLowerCase();
    const kLower = kingdomName.toLowerCase();

    const isMicrobiological =
      ['bacteria', 'archaea', 'viruses', 'chromista', 'protozoa'].includes(kLower) ||
      [
        'tardigrada',
        'rotifera',
        'nematoda',
        'ciliophora',
        'amoebozoa',
        'bacillariophyta',
        'foraminifera',
        'cyanobacteria',
      ].includes(pLower) ||
      [
        'tardigrad',
        'bactéri',
        'bacteria',
        'ameba',
        'amoeba',
        'paramecium',
        'estromatolito',
        'diatom',
        'foraminif',
        'virus',
        'vírus',
      ].some((k) => qLower.includes(k));

    const isVertebrate =
      pLower === 'chordata' &&
      !['ascidiacea', 'thaliacea', 'appendicularia'].includes(cLower);

    const skeletalType = isMicrobiological
      ? 'microbiologico'
      : isVertebrate
        ? 'vertebrado'
        : 'invertebrado';

    let skeletalComp: string;
    if (isMicrobiological) {
      if (pLower === 'tardigrada' || qLower.includes('tardigrad')) {
        skeletalComp =
          'Cutícula Quitinosa Acelular e Hidroesqueleto Microscópico';
      } else if (
        ['bacteria', 'cyanobacteria'].includes(kLower) ||
        qLower.includes('bacteri') ||
        qLower.includes('estromatolito')
      ) {
        skeletalComp =
          'Parede Celular de Peptidoglicano e Membrana Plasmática';
      } else if (kLower === 'archaea') {
        skeletalComp =
          'Parede Celular de Pseudopeptidoglicano e Monocamada Lipídica';
      } else if (pLower === 'bacillariophyta' || qLower.includes('diatom')) {
        skeletalComp = 'Frústula Bivalve Rígida de Sílica Biogênica (SiO2)';
      } else if (
        pLower === 'foraminifera' ||
        qLower.includes('foraminif') ||
        qLower.includes('nummulite')
      ) {
        skeletalComp =
          'Testa (Concha) Mineralizada Multilocular de Carbonato de Cálcio (CaCO3)';
      } else if (
        ['ciliophora', 'amoebozoa'].includes(pLower) ||
        ['paramecium', 'ameba', 'amoeba'].some((k) => qLower.includes(k))
      ) {
        skeletalComp =
          'Película Protéica Ciliar ou Citoesqueleto Dinâmico de Actina';
      } else if (
        kLower === 'viruses' ||
        qLower.includes('virus') ||
        qLower.includes('vírus')
      ) {
        skeletalComp =
          'Capsídeo Proteico Icosaédrico/Ovóide com Tegumento Espesso';
      } else {
        skeletalComp =
          'Parede Celular ou Membrana Plasmática e Citoesqueleto';
      }
    } else if (isVertebrate) {
      if (['chondrichthyes', 'elasmobranchii', 'holocephali'].includes(cLower)) {
        skeletalComp = 'Cartilagem Calcificada (Sem Ossos Verdadeiros)';
      } else if (cLower === 'aves') {
        skeletalComp = 'Endoesqueleto Ósseo Pneumatizado (Leve e Oco)';
      } else {
        skeletalComp = 'Endoesqueleto Ósseo Articulado e Cartilagem';
      }
    } else {
      if (pLower === 'arthropoda') {
        skeletalComp = 'Exoesqueleto Quitinoso Esclerotizado (Articulado)';
      } else if (pLower === 'mollusca') {
        skeletalComp = 'Concha Calcária (Carbonato de Cálcio) ou Hidroesqueleto';
      } else if (pLower === 'echinodermata') {
        skeletalComp = 'Endoesqueleto Dérmico de Placas Calcárias';
      } else if (['cnidaria', 'porifera'].includes(pLower)) {
        skeletalComp = 'Espículas Silicosas/Calcárias ou Hidroesqueleto';
      } else {
        skeletalComp = 'Hidroesqueleto e Cutícula Flexível';
      }
    }

    const cladogram = [
      kingdomName || 'Animalia',
      phylum || (isVertebrate ? 'Chordata' : 'Invertebrata'),
      className || (isVertebrate ? 'Vertebrata' : 'Invertebrados'),
      orderName || 'Ordem taxonômica',
      familyName || 'Família biológica',
      genusName,
      canonicalName || scientificName,
    ].filter(Boolean);

    const usageKey =
      typeof data.usageKey === 'number'
        ? data.usageKey
        : typeof data.key === 'number'
          ? data.key
          : undefined;

    return {
      usage_key: usageKey,
      scientific_name: scientificName,
      canonical_name: canonicalName,
      genus: genusName,
      kingdom: kingdomName || undefined,
      phylum,
      class_name: className,
      order_name: orderName,
      family_name: familyName,
      skeletal_type: skeletalType,
      skeletal_composition: skeletalComp,
      cladogram,
      rank: String(data.rank || 'SPECIES'),
    };
  } catch (err) {
    console.error(`[GBIF] Error querying species for '${query}':`, err);
    return null;
  }
}

export async function fetchGbifOccurrences(
  taxonKey: number,
  limit = 40
): Promise<Occurrence[]> {
  const url = `https://api.gbif.org/v1/occurrence/search?taxonKey=${encodeURIComponent(String(taxonKey))}&hasCoordinate=true&limit=${encodeURIComponent(String(limit))}`;
  const results: Occurrence[] = [];

  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(12000),
    });
    if (!resp.ok) return [];
    const data = (await resp.json()) as { results?: Record<string, unknown>[] };
    for (const r of data.results || []) {
      const lat = r.decimalLatitude;
      const lng = r.decimalLongitude;
      if (typeof lat === 'number' && typeof lng === 'number') {
        results.push({
          lat,
          lng,
          country: String(r.country || 'Global'),
          formation: String(
            r.locality || r.stateProvince || 'Registro de observação natural'
          ),
          early_age: 0.0,
          late_age: 0.0,
          collection_name: String(
            r.datasetName ||
              `Registro de ${String(r.scientificName || 'espécime')}`
          ),
          is_contemporary: true,
        });
      }
    }
  } catch (err) {
    console.error(
      `[GBIF] Error querying occurrences for taxonKey ${taxonKey}:`,
      err
    );
  }
  return results;
}
