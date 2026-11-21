import type { GbifMatchResult } from './gbifService.ts';
import type { PbdbTaxonInfo } from './pbdbService.ts';

export const USER_AGENT =
  'BioAtlas/1.0 (https://bioatlas.app; contact@bioatlas.app)';

export interface WikiSummary {
  found: boolean;
  title: string;
  description: string;
  extract: string;
  image_url: string | null;
  scientific_name?: string | null;
  is_biological_taxon: boolean;
  is_non_biological: boolean;
  is_disambiguation?: boolean;
  lang: string;
}

export interface BioacousticRecording {
  url: string;
  title: string;
  author: string;
  mime: string;
  license?: string;
}

export interface MultiPerspectiveImage {
  url: string;
  caption: string;
  type: string;
  category: string;
  author: string;
}

export interface EcologyInference {
  group: string;
  group_display: string;
  diet: string;
  diet_display: string;
  habitat: string;
}

export function cleanHtml(rawHtml: string): string {
  if (!rawHtml) return '';
  return rawHtml.replace(/<[^>]*>/g, '').trim();
}

function upgradeWikiThumbTo960(rawUrl: string | null | undefined): string | null {
  if (!rawUrl) return null;
  const clean = rawUrl.replace(/[?&]utm_[^&]+/g, '');
  if (clean.includes('/wikipedia/commons/thumb/')) {
    return clean.replace(/\/(\d+)px-([^/?#]+)$/, '/960px-$2');
  }
  return clean;
}

interface WikidataBioProfile {
  scientificName: string | null;
  isBiologicalTaxon: boolean;
  isNonBiological: boolean;
}

// Wikidata QIDs that definitely indicate biological taxa/clades/organisms
const TAXON_INSTANCE_QIDS = new Set([
  'Q16521', // taxon
  'Q23038290', // fossil taxon
  'Q310890', // monotypic taxon
  'Q47487597', // monotypic fossil taxon
  'Q713623', // clade
  'Q55983715', // organisms known by a particular common name
  'Q2136103', // defunct taxon
  'Q17276484', // ichnotaxon
  'Q10857409', // parataxon
  'Q2568288', // ichnogenus
  'Q158791', // breed / animal breed
  'Q38829', // breed
  'Q7239', // organism
]);

// Wikidata QIDs that clearly indicate fictional characters, people, media, objects, places, or myths
const NON_BIO_INSTANCE_QIDS = new Set([
  'Q5', // human individual
  'Q95074', // fictional character
  'Q15632617', // fictional human
  'Q15773317', // television character
  'Q15773347', // film character
  'Q15711870', // animated character
  'Q80447738', // anime character
  'Q87576284', // manga character
  'Q1114461', // comics character
  'Q1569167', // video game character
  'Q188784', // superhero
  'Q3658341', // literary character
  'Q2239243', // mythical creature
  'Q24334685', // legendary creature
  'Q191067', // folklore / creature
  'Q25917154', // fictional animal
  'Q3542731', // fictional species
  'Q15707583', // fictional organism
  'Q4271324', // mythical character
  'Q178885', // deity
  'Q11424', // film
  'Q5398426', // television series
  'Q1107', // anime
  'Q8274', // manga
  'Q7889', // video game
  'Q7058673', // video game series
  'Q196600', // media franchise
  'Q7725634', // literary work
  'Q571', // book
  'Q482994', // album
  'Q7366', // song
  'Q215380', // musical group / band
  'Q4830453', // business / company
  'Q431289', // brand
  'Q515', // city
  'Q6256', // country
  'Q3184121', // municipality of Brazil
  'Q4167410', // Wikimedia disambiguation page
]);

const NON_BIO_TEXT_REGEX =
  /\b(personagem|fict[ií]ci[oa]s?|fictional|super[- ]?her[oó]i|superhero|anime|mang[aá]|pok[eé]mon|digimon|kaiju|desenho animado|s[eé]rie de televis[aã]o|television series|s[eé]rie animada|animated series|filme de|film directed|longa-metragem|jogo eletr[oô]nico|video game|videogame|quadrinhos|comic book|hist[oó]ria em quadrinhos|franquia de m[ií]dia|media franchise|criatura m[ií]tica|criatura lend[aá]ria|criatura mitol[oó]gica|mythical creature|legendary creature|mythological creature|folclore|folklore|cript[ií]deo|cryptid|futebolista|footballer|cantor(?:a)?|singer|rapper|ator|atriz|actor|actress|pol[ií]tic[oa]|politician|empres[aá]rio|munic[ií]pio brasileiro|cidade brasileira|banda de rock|[aá]lbum de est[uú]dio|studio album|can[cç][aã]o de|marca de autom[oó]veis|fabricante de|smartphone|console de|software|aplicativo|personagem de|fictional character|protagonista de|antagonista de|vil[aã]o de)\b/i;

const BIO_EXTRACT_REGEX =
  /\b(esp[eé]cie|species|g[eê]nero|genus|fam[ií]lia|family|ordem|order|filo|phylum|clado|clade|dinossauro|dinosaur|mam[ií]fero|mammal|r[eé]ptil|reptile|anf[ií]bio|amphibian|peixe|fish|ave|bird|inseto|insect|aracn[ií]deo|arachnid|molusco|mollusc|crust[aá]ceo|crustacean|invertebrado|invertebrate|vertebrado|vertebrate|bact[eé]ria|bacteria|arqueia|archaea|protozo[aá]rio|protozoa|v[ií]rus|virus|f[oó]ssil|fossil|extint[oa]|extinct|cet[aá]ceo|cetacean|tubar[aã]o|shark|pterossauro|pterosaur|trilobita|trilobite|animal marinho|marine animal|organismo|organism)\b/i;

async function fetchWikidataBioProfile(
  wikibaseItem: string
): Promise<WikidataBioProfile> {
  const empty: WikidataBioProfile = {
    scientificName: null,
    isBiologicalTaxon: false,
    isNonBiological: false,
  };
  if (!wikibaseItem || !/^Q\d+$/.test(wikibaseItem)) return empty;

  try {
    const resp = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wikibaseItem}&props=claims&format=json`,
      {
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(6500),
      }
    );
    if (!resp.ok) return empty;
    const data = (await resp.json()) as {
      entities?: Record<
        string,
        {
          claims?: Record<
            string,
            Array<{
              mainsnak?: {
                datavalue?: {
                  value?: string | { id?: string };
                };
              };
            }>
          >;
        }
      >;
    };

    const claims = data.entities?.[wikibaseItem]?.claims;
    if (!claims) return empty;

    // Scientific taxon name (P225)
    const p225Val = claims.P225?.[0]?.mainsnak?.datavalue?.value;
    const scientificName =
      typeof p225Val === 'string' && p225Val.trim().length > 1
        ? p225Val.trim()
        : null;

    // Collect P31 (instance of) QIDs
    const p31Ids: string[] = [];
    for (const stmt of claims.P31 || []) {
      const v = stmt?.mainsnak?.datavalue?.value;
      if (v && typeof v === 'object' && typeof v.id === 'string') {
        p31Ids.push(v.id);
      }
    }

    // Definitive biological taxon indicators in Wikidata:
    // P225 (taxon name), P105 (taxon rank), P171 (parent taxon), P846 (GBIF ID), P5257 (PBDB ID)
    const hasBioProperty = Boolean(
      scientificName ||
        claims.P105?.length ||
        claims.P171?.length ||
        claims.P846?.length ||
        claims.P5257?.length ||
        p31Ids.some((id) => TAXON_INSTANCE_QIDS.has(id))
    );

    if (hasBioProperty) {
      return {
        scientificName,
        isBiologicalTaxon: true,
        isNonBiological: false,
      };
    }

    // Explicitly non-biological entity (fictional character, human, film, game, city, myth, etc.)
    // Also any entity that has P31 claims (e.g. P31 = fictional pokemon species / TV episode / weapon / etc.)
    // without ANY biological taxon property is not a biological taxon.
    const hasExplicitNonBio =
      p31Ids.some((id) => NON_BIO_INSTANCE_QIDS.has(id)) ||
      Boolean(claims.P1441?.length) || // "present in work" (fictional characters/creatures)
      Boolean(claims.P1080?.length) || // "from narrative universe"
      Boolean(claims.P569?.length) || // "date of birth" (people)
      Boolean(claims.P170?.length); // "creator" (artworks/characters/franchises)

    return {
      scientificName: null,
      isBiologicalTaxon: false,
      isNonBiological: hasExplicitNonBio || p31Ids.length > 0,
    };
  } catch {
    return empty;
  }
}

interface RawRestSummary {
  type?: string;
  title?: string;
  description?: string;
  extract?: string;
  wikibase_item?: string;
  thumbnail?: { source?: string };
  originalimage?: { source?: string };
}

async function fetchSingleLangWikiSummary(
  lang: 'pt' | 'en',
  queryClean: string
): Promise<WikiSummary | null> {
  const headers = { 'User-Agent': USER_AGENT };

  const resolveAndFetch = async (
    term: string
  ): Promise<RawRestSummary | null> => {
    let resolvedTitle = term;
    try {
      const searchUrl = `https://${lang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(term)}&limit=1&namespace=0&format=json`;
      const sResp = await fetch(searchUrl, {
        headers,
        signal: AbortSignal.timeout(10000),
      });
      if (sResp.ok) {
        const sData = (await sResp.json()) as unknown[];
        const titles = Array.isArray(sData[1]) ? (sData[1] as string[]) : [];
        if (titles.length > 0) resolvedTitle = titles[0];
      }
    } catch {
      // ignore opensearch error
    }

    try {
      const restUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(resolvedTitle.replace(/\s+/g, '_'))}`;
      const resp = await fetch(restUrl, {
        headers,
        signal: AbortSignal.timeout(10000),
      });
      if (!resp.ok) return null;
      return (await resp.json()) as RawRestSummary;
    } catch {
      return null;
    }
  };

  let data = await resolveAndFetch(queryClean);
  if (!data) return null;

  // If the primary page is a disambiguation page, try animal/species-qualified title
  if (data.type === 'disambiguation') {
    const disambigSuffixes =
      lang === 'pt'
        ? ['(animal)', '(espécie)', '(gênero)']
        : ['(animal)', '(genus)', '(species)'];
    for (const suffix of disambigSuffixes) {
      const candidate = await resolveAndFetch(`${queryClean} ${suffix}`);
      if (candidate && candidate.type !== 'disambiguation' && (candidate.extract || '').length > 25) {
        data = candidate;
        break;
      }
    }
  }

  const isDisambig = data.type === 'disambiguation';
  const extract = data.extract || '';
  const description = data.description || '';
  if (extract.length <= 20 && !isDisambig) return null;

  const wdProfile = data.wikibase_item
    ? await fetchWikidataBioProfile(data.wikibase_item)
    : { scientificName: null, isBiologicalTaxon: false, isNonBiological: false };

  const textForCheck = `${description} ${extract.slice(0, 420)}`;
  const looksNonBioText = NON_BIO_TEXT_REGEX.test(textForCheck);
  const looksBioText = BIO_EXTRACT_REGEX.test(textForCheck);

  const isBiologicalTaxon = wdProfile.isBiologicalTaxon;
  const isNonBiological =
    !isBiologicalTaxon &&
    (looksNonBioText || (wdProfile.isNonBiological && !looksBioText));

  return {
    found: true,
    title: data.title || queryClean,
    description,
    extract,
    image_url: upgradeWikiThumbTo960(
      data.thumbnail?.source || data.originalimage?.source || null
    ),
    scientific_name: wdProfile.scientificName,
    is_biological_taxon: isBiologicalTaxon,
    is_non_biological: isNonBiological,
    is_disambiguation: isDisambig,
    lang,
  };
}

export async function fetchWikipediaSummary(
  taxonName: string
): Promise<WikiSummary> {
  const queryClean = taxonName.trim();

  // 1. Try PT Wikipedia first
  const ptSummary = await fetchSingleLangWikiSummary('pt', queryClean);
  if (ptSummary) {
    // If PT resolved to a confirmed biological taxon OR confirmed non-biological entity (e.g. "Naruto", "Batman", "Neymar"), return it directly
    if (ptSummary.is_biological_taxon || ptSummary.is_non_biological) {
      return ptSummary;
    }
    // If PT was disambiguation or uncertain, try EN to see if it resolves cleanly to a taxon
    const enCheck = await fetchSingleLangWikiSummary('en', queryClean);
    if (enCheck && (enCheck.is_biological_taxon || enCheck.is_non_biological)) {
      return enCheck;
    }
    if (!ptSummary.is_disambiguation) {
      return ptSummary;
    }
  }

  // 2. Fallback to EN Wikipedia
  const enSummary = await fetchSingleLangWikiSummary('en', queryClean);
  if (enSummary) {
    return enSummary;
  }

  return {
    found: false,
    title: taxonName,
    description: '',
    extract: '',
    image_url: null,
    scientific_name: null,
    is_biological_taxon: false,
    is_non_biological: false,
    is_disambiguation: false,
    lang: 'pt',
  };
}

function stripTrackingParams(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    parsed.searchParams.delete('utm_source');
    parsed.searchParams.delete('utm_campaign');
    parsed.searchParams.delete('utm_content');
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

function normalizeForMatch(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function extractDistinctiveTokens(taxonName: string): string[] {
  const stopWords = new Set([
    'common',
    'giant',
    'great',
    'white',
    'blue',
    'black',
    'red',
    'green',
    'african',
    'american',
    'asian',
    'european',
    'south',
    'north',
    'comum',
    'gigante',
    'grande',
    'branco',
    'azul',
    'preto',
    'vermelho',
    'verde',
  ]);
  return normalizeForMatch(taxonName)
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter((w) => w.length >= 4 && !stopWords.has(w));
}

interface CommonsPageEntry {
  title?: string;
  imageinfo?: Array<{
    thumburl?: string;
    url?: string;
    mime?: string;
    width?: number;
    height?: number;
    extmetadata?: {
      Artist?: { value?: string };
      ObjectName?: { value?: string };
      ImageDescription?: { value?: string };
    };
  }>;
}

const COMMONS_BAD_TITLE_KEYWORDS = [
  '.svg',
  '.ogg',
  '.ogv',
  '.webm',
  '.pdf',
  '.stl',
  '.tif',
  'sound',
  'audio',
  'map',
  'range',
  'distribution',
  'loc.png',
  'cladogram',
  'calavera',
  'catacomb',
  'ossuary',
  'cemetery',
  'human_skull',
  'homo_sapiens',
  'flag_of',
  'coat_of_arms',
  'logo',
  'icon',
  'stamp',
  'coin',
  'signature',
  'book_page',
  'frontispiece',
  'title_page',
  'qr_code',
];

function classifyCommonsImage(
  titleNorm: string,
  defaultCat: string,
  defaultType: string
): { category: string; type: string } {
  if (
    [
      'skeleton',
      'skull',
      'bone',
      'cranio',
      'esqueleto',
      'osteolog',
      'fossil',
      'mount',
      'holotype',
      'jaw',
      'teeth',
      'tooth',
      'vertebra',
      'cartilage',
      'carapace',
      'cast',
      'specimen',
    ].some((k) => titleNorm.includes(k))
  ) {
    const imgType =
      titleNorm.includes('skull') || titleNorm.includes('cranio') || titleNorm.includes('jaw') || titleNorm.includes('tooth') || titleNorm.includes('teeth')
        ? 'skull'
        : titleNorm.includes('fossil') || titleNorm.includes('holotype')
          ? 'fossil'
          : 'skeleton';
    return { category: 'skeletal_view', type: imgType };
  }
  if (
    [
      'anatomy',
      'dissection',
      'organ',
      'musculo',
      'muscle',
      'radiograph',
      'x-ray',
      'microscop',
      'sem_',
      'tem_',
      'cell',
    ].some((k) => titleNorm.includes(k))
  ) {
    return { category: 'anatomy_view', type: 'anatomy' };
  }
  if (['scale', 'size_comparison'].some((k) => titleNorm.includes(k))) {
    return { category: 'comparison_view', type: 'scale' };
  }
  return { category: defaultCat || 'life_view', type: defaultType || 'living_specimen' };
}

export async function fetchMultiPerspectiveImages(
  taxonName: string,
  limit = 12,
  fallbackTerms: string[] = []
): Promise<MultiPerspectiveImage[]> {
  const headers = { 'User-Agent': USER_AGENT };
  const baseUrl = 'https://commons.wikimedia.org/w/api.php';
  const cleanTaxon = taxonName.replace(/["()]/g, ' ').replace(/\s+/g, ' ').trim();
  const genusOnly = cleanTaxon.includes(' ') ? cleanTaxon.split(' ')[0] : '';

  const collected: MultiPerspectiveImage[] = [];
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();

  const processPages = (
    pages: CommonsPageEntry[],
    tokens: string[],
    defaultCat: string,
    defaultType: string,
    maxAdd: number,
    skipTokenGuard = false
  ): number => {
    let added = 0;
    for (const page of pages) {
      if (collected.length >= limit || added >= maxAdd) break;
      const title = page.title || '';
      const titleNorm = normalizeForMatch(title);
      if (!titleNorm || seenTitles.has(titleNorm)) continue;

      if (COMMONS_BAD_TITLE_KEYWORDS.some((bad) => titleNorm.includes(bad))) {
        continue;
      }

      const info = page.imageinfo?.[0];
      if (!info) continue;

      const mime = (info.mime || '').toLowerCase();
      if (
        !mime.startsWith('image/') ||
        mime.includes('svg') ||
        mime.includes('tiff') ||
        mime.includes('pdf')
      ) {
        continue;
      }
      if ((info.width || 0) < 250 || (info.height || 0) < 180) {
        continue;
      }

      const meta = info.extmetadata || {};
      const descNorm = normalizeForMatch(
        cleanHtml(meta.ImageDescription?.value || '') +
          ' ' +
          cleanHtml(meta.ObjectName?.value || '')
      );

      if (!skipTokenGuard && tokens.length > 0) {
        const matchesTaxon = tokens.some(
          (tok) => titleNorm.includes(tok) || descNorm.includes(tok)
        );
        if (!matchesTaxon) continue;
      }

      const rawThumb = info.thumburl || info.url;
      if (!rawThumb) continue;
      const thumbUrl = stripTrackingParams(rawThumb);
      if (seenUrls.has(thumbUrl)) continue;

      seenUrls.add(thumbUrl);
      seenTitles.add(titleNorm);

      const { category, type: imgType } = classifyCommonsImage(
        titleNorm,
        defaultCat,
        defaultType
      );

      const artist = cleanHtml(meta.Artist?.value || '') || 'Wikimedia Commons';
      let cleanCaption = cleanHtml(
        meta.ObjectName?.value ||
          title
            .replace(/^File:/i, '')
            .replace(/\.(jpe?g|png|webp|gif)$/i, '')
            .replace(/_/g, ' ')
      );
      if (cleanCaption.length > 90) {
        cleanCaption = `${cleanCaption.slice(0, 90)}...`;
      }

      collected.push({
        url: thumbUrl,
        caption: cleanCaption,
        type: imgType,
        category,
        author: artist,
      });
      added++;
    }
    return added;
  };

  const runSearch = async (
    queryPattern: string,
    tokens: string[],
    defaultCat: string,
    defaultType: string,
    maxAdd: number,
    gsrlimit = 16
  ) => {
    if (collected.length >= limit) return;
    const params = new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrsearch: queryPattern,
      gsrnamespace: '6',
      gsrlimit: String(gsrlimit),
      prop: 'imageinfo',
      iiprop: 'url|mime|size|extmetadata',
      iiurlwidth: '960',
      format: 'json',
    });
    try {
      const resp = await fetch(`${baseUrl}?${params.toString()}`, {
        headers,
        signal: AbortSignal.timeout(12000),
      });
      if (!resp.ok) return;
      const data = (await resp.json()) as {
        query?: { pages?: Record<string, CommonsPageEntry> };
      };
      processPages(
        Object.values(data.query?.pages || {}),
        tokens,
        defaultCat,
        defaultType,
        maxAdd
      );
    } catch (err) {
      console.warn(`[Commons] Error querying '${queryPattern}':`, err);
    }
  };

  const runCategory = async (categoryName: string, maxAdd: number) => {
    if (collected.length >= limit || !categoryName) return;
    const params = new URLSearchParams({
      action: 'query',
      generator: 'categorymembers',
      gcmtitle: `Category:${categoryName}`,
      gcmtype: 'file',
      gcmlimit: '24',
      prop: 'imageinfo',
      iiprop: 'url|mime|size|extmetadata',
      iiurlwidth: '960',
      format: 'json',
    });
    try {
      const resp = await fetch(`${baseUrl}?${params.toString()}`, {
        headers,
        signal: AbortSignal.timeout(12000),
      });
      if (!resp.ok) return;
      const data = (await resp.json()) as {
        query?: { pages?: Record<string, CommonsPageEntry> };
      };
      processPages(
        Object.values(data.query?.pages || {}),
        [],
        'life_view',
        'living_specimen',
        maxAdd,
        true
      );
    } catch {
      // ignore missing category
    }
  };

  // Phase 1: Diverse perspectives for primary taxon (balanced caps so skeleton/skull/fossil views always get room)
  const primaryTokens = extractDistinctiveTokens(cleanTaxon);
  const perStageCap = Math.max(3, Math.ceil(limit / 3));
  await runSearch(`"${cleanTaxon}"`, primaryTokens, 'life_view', 'living_specimen', perStageCap, 16);
  await runSearch(`"${cleanTaxon}" restoration`, primaryTokens, 'life_view', 'living_specimen', 3, 12);
  await runSearch(`"${cleanTaxon}" skeleton`, primaryTokens, 'skeletal_view', 'skeleton', 3, 12);
  await runSearch(`"${cleanTaxon}" skull`, primaryTokens, 'skeletal_view', 'skull', 3, 12);
  await runSearch(`"${cleanTaxon}" fossil`, primaryTokens, 'skeletal_view', 'fossil', 3, 12);

  // Phase 2: Direct Wikimedia Commons Category (exact taxon, then genus)
  if (collected.length < limit) {
    await runCategory(cleanTaxon, limit - collected.length);
  }
  if (collected.length < limit && genusOnly && genusOnly.length >= 4) {
    await runCategory(genusOnly, limit - collected.length);
  }

  // Phase 3: Broaden to genus or fallback biological terms (common name, family/order) until target limit is reached
  const extras = Array.from(
    new Set(
      [genusOnly, ...fallbackTerms]
        .map((t) => String(t || '').replace(/["()]/g, ' ').replace(/\s+/g, ' ').trim())
        .filter((t) => t.length >= 4 && normalizeForMatch(t) !== normalizeForMatch(cleanTaxon))
    )
  );

  for (const term of extras) {
    if (collected.length >= limit) break;
    const termTokens = extractDistinctiveTokens(term);
    await runSearch(`"${term}"`, termTokens, 'life_view', 'living_specimen', limit - collected.length, 20);
    if (collected.length < limit) {
      await runSearch(`"${term}" skeleton`, termTokens, 'skeletal_view', 'skeleton', 3, 10);
    }
    if (collected.length < limit) {
      await runSearch(`"${term}" fossil`, termTokens, 'skeletal_view', 'fossil', 3, 10);
    }
    if (collected.length < limit) {
      await runCategory(term, limit - collected.length);
    }
  }

  return collected.slice(0, limit);
}

function hasAnyWord(text: string, words: string[]): boolean {
  return words.some((w) => {
    const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(text);
  });
}

function hasAnyPrefix(text: string, prefixes: string[]): boolean {
  return prefixes.some((p) => {
    const escaped = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z0-9])${escaped}`, 'i').test(text);
  });
}

export function inferTaxonomyAndEcology(
  taxonName: string,
  pbdbData: PbdbTaxonInfo | null,
  wikiSummary: WikiSummary,
  gbifData: GbifMatchResult | null = null
): EcologyInference {
  const nameAndTaxon = normalizeForMatch(
    [
      taxonName,
      wikiSummary.title || '',
      gbifData?.class_name || '',
      gbifData?.order_name || '',
      gbifData?.family_name || '',
      pbdbData?.class_name || '',
      pbdbData?.order_name || '',
    ].join(' ')
  );

  const fullText = normalizeForMatch(
    [
      nameAndTaxon,
      wikiSummary.description || '',
      wikiSummary.extract || '',
    ].join(' ')
  );

  let group = 'mamifero-megafauna';
  let groupDisplay = 'Mamífero';

  if (
    hasAnyPrefix(fullText, ['tardigrad', 'rotifer', 'water bear']) ||
    fullText.includes("urso d'agua") ||
    fullText.includes('urso-d-agua')
  ) {
    group = 'micro-animal';
    groupDisplay = 'Micro-Animal Extremófilo';
  } else if (
    hasAnyPrefix(fullText, [
      'bacteri',
      'cianobacteri',
      'cyanobacteri',
      'stromatolit',
      'estromatolit',
      'archaea',
      'arquea',
      'escherichia',
      'procariont',
    ])
  ) {
    group = 'bacteria-cianobacteria';
    groupDisplay = 'Bactéria & Cianobactéria';
  } else if (
    hasAnyWord(fullText, ['virus', 'pithovirus', 'mimivirus', 'pandoravirus', 'megavirus'])
  ) {
    group = 'virus-gigante';
    groupDisplay = 'Vírus Gigante';
  } else if (
    hasAnyPrefix(fullText, [
      'protozo',
      'ameba',
      'amoeba',
      'paramecium',
      'euglena',
      'ciliat',
      'protista',
      'diatom',
      'foraminif',
      'nummulit',
    ])
  ) {
    group = 'protozoario-protista';
    groupDisplay = 'Protozoário & Protista';
  } else if (
    hasAnyPrefix(fullText, [
      'dinosaur',
      'dinossaur',
      'theropod',
      'teropod',
      'sauropod',
      'ceratops',
      'tyrannosaur',
      'tiranossaur',
      'velociraptor',
      'spinosaur',
      'espinossaur',
      'stegosaur',
      'estegossaur',
      'ankylosaur',
      'anquilossaur',
      'hadrosaur',
      'ornithopod',
      'allosaur',
      'alossaur',
      'carnotaur',
      'giganotosaur',
    ])
  ) {
    group = 'dinossauro';
    groupDisplay = 'Dinossauro';
  } else if (
    hasAnyPrefix(fullText, ['pterosaur', 'pterossaur', 'azhdarch', 'pteranodon', 'quetzalcoatlus'])
  ) {
    group = 'pterossauro';
    groupDisplay = 'Pterossauro / Réptil Alado';
  } else if (
    hasAnyWord(nameAndTaxon, ['aves', 'ave', 'bird', 'birds', 'falconiformes', 'accipitriformes', 'strigiformes', 'passeriformes', 'sphenisciformes']) ||
    hasAnyWord(fullText, ['ave', 'aves', 'passaro', 'aguia', 'falcao', 'coruja', 'gaviao', 'arara', 'tucano', 'pinguim', 'pelicano', 'condor', 'harpy', 'harpia', 'avestruz', 'beija-flor', 'eagle', 'owl', 'hawk', 'penguin', 'parrot', 'flamingo'])
  ) {
    group = 'ave';
    groupDisplay = 'Ave (Dinossauro Aviano)';
  } else if (
    hasAnyPrefix(nameAndTaxon, [
      'chondrichthyes',
      'actinopterygii',
      'elasmobranch',
      'cetacea',
      'cetace',
      'mosasaur',
      'plesiosaur',
      'ichthyosaur',
      'placoderm',
      'carcharodon',
      'otodus',
      'balaenopter',
    ]) ||
    hasAnyWord(fullText, [
      'shark',
      'tubarao',
      'raia',
      'peixe',
      'peixes',
      'fish',
      'whale',
      'baleia',
      'golfinho',
      'dolphin',
      'orca',
      'peixe-boi',
      'manatee',
      'mosassauro',
      'plesiossauro',
      'ictiossauro',
      'megalodonte',
      'megalodon',
    ])
  ) {
    group = 'reptil-marinho';
    groupDisplay = 'Fauna Marinha & Aquática';
  } else if (
    hasAnyWord(nameAndTaxon, ['amphibia', 'anura', 'caudata', 'crocodilia', 'testudines']) ||
    hasAnyWord(fullText, ['anfibio', 'sapo', 'ra', 'perereca', 'salamandra', 'axolote', 'crocodilo', 'jacare', 'aligator', 'caiman', 'tartaruga', 'frog', 'toad', 'salamander', 'axolotl', 'crocodile', 'alligator'])
  ) {
    group = 'reptil-marinho';
    groupDisplay = 'Réptil & Anfíbio';
  } else if (
    hasAnyPrefix(fullText, ['synapsid', 'sinapsid', 'dimetrodon', 'gorgonops', 'therapsid'])
  ) {
    group = 'sinapsideo';
    groupDisplay = 'Sinapsídeo';
  } else if (
    hasAnyPrefix(fullText, [
      'arthropod',
      'artropod',
      'insecta',
      'inseto',
      'arachnid',
      'aracnid',
      'trilobit',
      'crustace',
    ]) ||
    hasAnyWord(fullText, ['aranha', 'escorpiao', 'caranguejo', 'lagosta', 'camarao', 'formiga', 'abelha', 'borboleta', 'besouro', 'libelula', 'louva-a-deus', 'centopeia', 'spider', 'scorpion', 'crab', 'beetle', 'butterfly', 'ant', 'bee', 'dragonfly'])
  ) {
    group = 'artropode-invertebrado';
    groupDisplay = 'Artrópode Invertebrado';
  } else if (
    hasAnyPrefix(fullText, ['molusc', 'mollusc', 'cephalopod', 'cefalopod', 'cnidari']) ||
    hasAnyWord(fullText, ['polvo', 'octopus', 'lula', 'squid', 'caracol', 'lesma', 'agua-viva', 'medusa', 'coral', 'nautilus', 'ammonite', 'amonite', 'estrela-do-mar', 'jellyfish'])
  ) {
    group = 'artropode-invertebrado';
    groupDisplay = 'Molusco & Invertebrado Marinho';
  } else if (
    hasAnyPrefix(fullText, ['ediacar', 'dickinsonia', 'charnia', 'spriggina'])
  ) {
    group = 'ediacarano';
    groupDisplay = 'Biota Ediacarana';
  } else if (
    hasAnyWord(nameAndTaxon, ['mammalia', 'felidae', 'canidae', 'ursidae', 'elephantidae', 'primates', 'cetartiodactyla']) ||
    hasAnyWord(fullText, ['mamifero', 'mammal', 'felino', 'onca', 'leao', 'tigre', 'panthera', 'lobo', 'urso', 'raposa', 'elefante', 'girafa', 'rinoceronte', 'hipopotamo', 'gorila', 'chimpanze', 'orangotango', 'canguru', 'coala', 'panda', 'capivara', 'preguica', 'morcego', 'lion', 'tiger', 'wolf', 'bear', 'elephant', 'giraffe', 'gorilla'])
  ) {
    group = 'mamifero-megafauna';
    groupDisplay = 'Mamífero';
  }

  let diet = 'carnivoro';
  let dietDisplay = 'Carnívoro';
  if (
    hasAnyPrefix(fullText, ['herbivor', 'frugivor', 'folivor', 'sauropod', 'ceratops', 'hadrosaur']) ||
    hasAnyWord(fullText, ['vegetariano', 'elefante', 'girafa', 'panda', 'coala', 'veado', 'capivara', 'preguica', 'canguru', 'rinoceronte', 'hipopotamo', 'bambu'])
  ) {
    diet = 'herbivoro';
    dietDisplay = 'Herbívoro';
  } else if (
    hasAnyPrefix(fullText, ['piscivor']) ||
    hasAnyWord(fullText, ['lontra', 'pelicano', 'pinguim', 'garca'])
  ) {
    diet = 'piscivoro';
    dietDisplay = 'Piscívoro';
  } else if (
    hasAnyPrefix(fullText, ['filtrador', 'filter-feed', 'plancton', 'plankton', 'fotossintes', 'photosynth', 'autotrof']) ||
    hasAnyWord(fullText, ['krill', 'baleia-azul', 'tubarao-baleia'])
  ) {
    diet = 'filtrador';
    dietDisplay = 'Filtrador / Autotrófico';
  } else if (hasAnyPrefix(fullText, ['onivor', 'omnivor'])) {
    diet = 'onivoro';
    dietDisplay = 'Onívoro';
  }

  // Strict habitat classification with taxonomic precedence (zero false substring hits!)
  let habitat = 'terrestre';

  if (
    ['micro-animal', 'bacteria-cianobacteria', 'virus-gigante', 'protozoario-protista'].includes(
      group
    )
  ) {
    habitat = 'microbiologico';
  } else if (group === 'ediacarano') {
    habitat = 'bentonico';
  } else if (group === 'dinossauro') {
    if (
      hasAnyPrefix(nameAndTaxon, ['spinosaur', 'espinossaur', 'baryonyx', 'suchomimus', 'halszkaraptor']) ||
      hasAnyWord(fullText, ['semiaquatico', 'semi-aquatico', 'semi-aquatic'])
    ) {
      habitat = 'anfibio';
    } else {
      habitat = 'terrestre';
    }
  } else if (group === 'pterossauro') {
    habitat = 'aereo';
  } else if (group === 'ave') {
    if (hasAnyWord(fullText, ['pinguim', 'penguin', 'sphenisciformes'])) {
      habitat = 'aquatico';
    } else if (hasAnyWord(fullText, ['pato', 'cisne', 'pelicano', 'flamingo', 'garca', 'duck', 'swan'])) {
      habitat = 'anfibio';
    } else {
      habitat = 'aereo';
    }
  } else if (
    hasAnyWord(nameAndTaxon, ['amphibia', 'anura', 'caudata', 'crocodilia']) ||
    hasAnyWord(fullText, [
      'anfibio',
      'semiaquatico',
      'semi-aquatico',
      'semi-aquatic',
      'sapo',
      'ra',
      'perereca',
      'salamandra',
      'axolote',
      'crocodilo',
      'jacare',
      'aligator',
      'hipopotamo',
      'capivara',
      'lontra',
      'castor',
      'ornitorrinco',
      'foca',
      'leao-marinho',
      'morsa',
      'frog',
      'toad',
      'salamander',
      'axolotl',
      'crocodile',
      'alligator',
      'hippopotamus',
      'otter',
      'beaver',
      'platypus',
      'seal',
      'walrus',
    ])
  ) {
    habitat = 'anfibio';
  } else if (
    group === 'reptil-marinho' ||
    hasAnyWord(fullText, [
      'aquatico',
      'aquatica',
      'aquatic',
      'marinho',
      'marinha',
      'marine',
      'oceanico',
      'oceanica',
      'pelagico',
      'pelagic',
      'baleia',
      'whale',
      'golfinho',
      'dolphin',
      'orca',
      'tubarao',
      'shark',
      'polvo',
      'octopus',
      'lula',
      'squid',
      'peixe',
      'fish',
      'agua-viva',
      'jellyfish',
      'coral',
      'recife',
      'reef',
      'peixe-boi',
      'manatee',
      'tartaruga-marinha',
      'caranguejo',
      'lagosta',
      'camarao',
      'nautilus',
    ])
  ) {
    habitat = 'aquatico';
  } else if (
    hasAnyWord(fullText, ['morcego', 'bat', 'chiroptera', 'borboleta', 'libelula', 'abelha', 'vespa', 'mosquito', 'butterfly', 'dragonfly'])
  ) {
    habitat = 'aereo';
  } else if (
    hasAnyWord(fullText, ['bentonico', 'benthic', 'abissal', 'abyssal', 'fundo do mar', 'assoalho oceanico'])
  ) {
    habitat = 'bentonico';
  }

  return {
    group,
    group_display: groupDisplay,
    diet,
    diet_display: dietDisplay,
    habitat,
  };
}

export async function fetchBioacoustics(
  scientificOrCommon: string,
  extraQuery?: string
): Promise<BioacousticRecording[]> {
  const headers = { 'User-Agent': USER_AGENT };
  const baseUrl = 'https://commons.wikimedia.org/w/api.php';
  const cleanMain = scientificOrCommon
    .replace(/\(.*?\)/g, '')
    .replace(/["()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const cleanExtra = (extraQuery || '')
    .replace(/\(.*?\)/g, '')
    .replace(/["()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const queries = [
    `"${cleanMain}" filetype:audio`,
    cleanExtra && cleanExtra.toLowerCase() !== cleanMain.toLowerCase()
      ? `"${cleanExtra}" filetype:audio`
      : null,
  ].filter(Boolean) as string[];

  const tokens = extractDistinctiveTokens(`${cleanMain} ${cleanExtra}`);
  const results: BioacousticRecording[] = [];
  const seen = new Set<string>();

  for (const q of queries) {
    if (results.length >= 2) break;
    const params = new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrsearch: q,
      gsrnamespace: '6',
      gsrlimit: '6',
      prop: 'imageinfo',
      iiprop: 'url|mime|extmetadata',
      format: 'json',
    });

    try {
      const resp = await fetch(`${baseUrl}?${params.toString()}`, {
        headers,
        signal: AbortSignal.timeout(10000),
      });
      if (!resp.ok) continue;
      const data = (await resp.json()) as {
        query?: {
          pages?: Record<
            string,
            {
              title?: string;
              imageinfo?: Array<{
                url?: string;
                mime?: string;
                extmetadata?: {
                  Artist?: { value?: string };
                  LicenseShortName?: { value?: string };
                  ImageDescription?: { value?: string };
                };
              }>;
            }
          >;
        };
      };

      for (const page of Object.values(data.query?.pages || {})) {
        const title = page.title || '';
        const titleNorm = normalizeForMatch(title);
        // Skip spoken-word pronunciations (e.g., En-us-..., De-..., Fr-..., Nl-..., LL-Q...)
        if (
          /^(file:)?(en-|pt-|de-|fr-|es-|nl-|it-|ru-|pl-|ll-q|pronunciation)/i.test(
            titleNorm
          ) ||
          titleNorm.includes('pronunciation') ||
          titleNorm.includes('spoken') ||
          titleNorm.includes('wikipedia')
        ) {
          continue;
        }

        const info = page.imageinfo?.[0];
        if (!info?.url) continue;
        const mime = (info.mime || '').toLowerCase();
        if (
          !mime.includes('audio') &&
          !mime.includes('ogg') &&
          !/\.(ogg|oga|mp3|wav|flac)$/i.test(info.url)
        ) {
          continue;
        }

        const meta = info.extmetadata || {};
        const descNorm = normalizeForMatch(
          cleanHtml(meta.ImageDescription?.value || '')
        );
        if (
          tokens.length > 0 &&
          !tokens.some((tok) => titleNorm.includes(tok) || descNorm.includes(tok))
        ) {
          continue;
        }

        if (seen.has(info.url)) continue;
        seen.add(info.url);

        const cleanTitle = title
          .replace(/^File:/i, '')
          .replace(/\.(ogg|oga|mp3|wav|flac)$/i, '')
          .replace(/_/g, ' ');

        results.push({
          url: info.url,
          title: cleanTitle.slice(0, 90),
          author: cleanHtml(meta.Artist?.value || '') || 'Wikimedia Commons',
          mime: mime || 'audio/ogg',
          license: cleanHtml(meta.LicenseShortName?.value || '') || 'CC / Domínio Público',
        });

        if (results.length >= 2) break;
      }
    } catch {
      // ignore bioacoustic lookup errors
    }
  }

  return results;
}
