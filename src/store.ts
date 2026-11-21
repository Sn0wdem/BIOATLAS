import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeText } from './services/knowledgeEngine.ts';
import type { CatalogStats, Specimen, SpecimenFilter } from './types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '..', 'data');

const specimensMap = new Map<string, Specimen>();

function extractBinomial(name?: string | null): string {
  if (!name) return '';
  const cleaned = normalizeText(name.replace(/\(.*?\)/g, ''));
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]} ${parts[1]}`;
  return parts[0] || '';
}

function normalizeSpecimen(
  raw: Partial<Specimen> & { id: string; name: string }
): Specimen {
  return {
    id: raw.id,
    name: raw.name,
    genus: raw.genus || raw.name,
    scientific_name: raw.scientific_name ?? null,
    era: raw.era || 'contemporaneo',
    era_display: raw.era_display || 'Contemporâneo (Fauna Atual)',
    period: raw.period || 'Holoceno / Atualidade',
    epoch: raw.epoch ?? '',
    geological_range: raw.geological_range || 'Presente',
    group: raw.group || 'mamifero-megafauna',
    group_display: raw.group_display || 'Mamífero',
    diet: raw.diet || 'carnivoro',
    diet_display: raw.diet_display || 'Carnívoro',
    habitat: raw.habitat || 'terrestre',
    skeletal_type: raw.skeletal_type || 'vertebrado',
    skeletal_composition: raw.skeletal_composition || 'Osso e Cartilagem',
    is_contemporary: Boolean(raw.is_contemporary),
    conservation_status: raw.conservation_status ?? 'Fóssil Extinto',
    length: raw.length || 'Desconhecido',
    height: raw.height || 'Desconhecido',
    weight: raw.weight || 'Desconhecido',
    speed: raw.speed || 'Desconhecido',
    bite_force: raw.bite_force || 'Desconhecido',
    image_url: raw.image_url || '',
    image_caption: raw.image_caption || 'Representação visual do indivíduo',
    gallery: Array.isArray(raw.gallery)
      ? raw.gallery.map((g) => ({
          url: g.url,
          caption: g.caption || 'Representação visual do espécime',
          type: g.type || 'living_specimen',
          category: g.category || 'life_view',
          author: g.author || 'Acervo Científico / Wikimedia Commons',
        }))
      : [],
    etymology: raw.etymology || '',
    bio: raw.bio || '',
    curiosities: Array.isArray(raw.curiosities) ? raw.curiosities : [],
    expert: {
      cladogram: raw.expert?.cladogram ?? [],
      osteology: raw.expert?.osteology ?? '',
      biomechanics: raw.expert?.biomechanics ?? '',
      histology: raw.expert?.histology ?? '',
    },
    occurrences_count: raw.occurrences_count ?? 0,
    fossil_locations: raw.fossil_locations || '',
    is_custom_ingested: Boolean(raw.is_custom_ingested),
  };
}

export function initStore(): number {
  const catalogPath = path.join(DATA_DIR, 'embedded_catalog.json');
  if (!fs.existsSync(catalogPath)) {
    console.warn(`[BioAtlas] Seed catalog not found at ${catalogPath}`);
    return 0;
  }
  const rawList = JSON.parse(fs.readFileSync(catalogPath, 'utf-8')) as Array<
    Partial<Specimen> & { id: string; name: string }
  >;
  for (const item of rawList) {
    const spec = normalizeSpecimen(item);
    specimensMap.set(spec.id.toLowerCase(), spec);
  }
  return specimensMap.size;
}

export function upsertSpecimen(specimen: Specimen): boolean {
  const normalized = normalizeSpecimen(specimen);
  specimensMap.set(normalized.id.toLowerCase(), normalized);
  return true;
}

export function getSpecimenById(identifier: string): Specimen | null {
  const target = normalizeText(identifier);
  const slug = target.replace(/\s+/g, '-');
  if (!target) return null;

  const direct =
    specimensMap.get(identifier.trim().toLowerCase()) ||
    specimensMap.get(slug);
  if (direct) return direct;

  for (const spec of specimensMap.values()) {
    if (
      normalizeText(spec.id) === target ||
      normalizeText(spec.id) === slug ||
      normalizeText(spec.name) === target ||
      normalizeText(spec.genus) === target ||
      (spec.scientific_name && normalizeText(spec.scientific_name) === target)
    ) {
      return spec;
    }
  }
  return null;
}

const SPECIMEN_ALIASES: Record<string, string[]> = {
  tyrannosaurus: ['tiranossauro', 'tiranossauro rex', 't-rex', 't rex', 'trex', 'tyrannosaurus'],
  spinosaurus: ['espinossauro', 'spinosaurus'],
  triceratops: ['triceratopo', 'triceratops', 'triceratopes'],
  brachiosaurus: ['braquiossauro', 'brachiosaurus'],
  velociraptor: ['velociraptor'],
  mosasaurus: ['mosassauro', 'mosasaurus'],
  megalodon: ['megalodonte', 'megalodon', 'otodus megalodon'],
  mammuthus: ['mamute', 'mamute lanoso', 'mammuthus', 'woolly mammoth'],
  smilodon: ['tigre dente de sabre', 'dente de sabre', 'smilodon', 'sabertooth'],
  megatherium: ['preguica gigante', 'megaterio', 'megatherium'],
  basilosaurus: ['basilossauro', 'basilosaurus'],
  purussaurus: ['purussauro', 'purussaurus'],
  quetzalcoatlus: ['quetzalcoatlus'],
  dimetrodon: ['dimetrodonte', 'dimetrodon'],
  dunkleosteus: ['dunkleosteus'],
  titanoboa: ['titanoboa'],
  'baleia-azul': ['baleia azul', 'blue whale', 'balaenoptera musculus'],
  'onca-pintada': ['onca pintada', 'jaguar', 'panthera onca'],
  'tubarao-branco': ['tubarao branco', 'great white shark', 'carcharodon carcharias'],
  'polvo-comum': ['polvo comum', 'common octopus', 'octopus vulgaris'],
  tardigrado: ['tardigrado', 'urso dagua', 'urso d agua', 'water bear', 'milnesium tardigradum'],
  'ameba-proteus': ['ameba proteus', 'amoeba proteus'],
  paramecium: ['paramecio', 'paramecium caudatum'],
  diatomacea: ['diatomacea', 'alga de vidro', 'diatom'],
  'estromatolito-cianobacteria': ['estromatolito', 'estromatolitos', 'stromatolite'],
  pithovirus: ['pithovirus', 'pithovirus sibericum'],
};

function resolveAliasSpecimenId(query: string): string | null {
  const norm = normalizeText(query);
  if (!norm) return null;
  for (const [specId, aliases] of Object.entries(SPECIMEN_ALIASES)) {
    if (aliases.some((alias) => alias === norm)) {
      return specId;
    }
  }
  return null;
}

/**
 * Deduplication lookup: checks if a specimen with the same scientific binomial,
 * genus, alias, canonical name, or normalized slug already exists.
 */
export function findExistingSpecimenByTaxon(candidates: {
  id?: string;
  name?: string;
  canonical?: string;
  scientific_name?: string;
}): Specimen | null {
  const targetBinomials = new Set<string>();
  const targetNames = new Set<string>();
  const targetGenera = new Set<string>();

  for (const raw of [
    candidates.scientific_name,
    candidates.canonical,
    candidates.name,
  ]) {
    if (!raw) continue;
    const aliasId = resolveAliasSpecimenId(raw);
    if (aliasId) {
      const aliasSpec = specimensMap.get(aliasId);
      if (aliasSpec) return aliasSpec;
    }
    const norm = normalizeText(raw);
    if (norm) targetNames.add(norm);
    const bin = extractBinomial(raw);
    if (bin && bin.includes(' ')) {
      targetBinomials.add(bin);
    } else if (bin && bin.length >= 5) {
      targetGenera.add(bin);
    }
  }

  if (candidates.id) {
    const direct = getSpecimenById(candidates.id);
    if (direct) return direct;
  }

  for (const spec of specimensMap.values()) {
    const specNormName = normalizeText(spec.name);
    const specNormSci = normalizeText(spec.scientific_name || '');
    const specNormGenus = normalizeText(spec.genus || '').split(/\s+/)[0] || '';
    const specBinomial = extractBinomial(spec.scientific_name);

    if (targetNames.has(specNormName) || (specNormSci && targetNames.has(specNormSci))) {
      return spec;
    }
    if (specBinomial && targetBinomials.has(specBinomial)) {
      return spec;
    }
    if (specNormGenus && targetGenera.has(specNormGenus)) {
      return spec;
    }
  }

  return null;
}

export function getAllSpecimens(
  filters: SpecimenFilter & { clade?: string } = {}
): Specimen[] {
  const { era, period, diet, group, habitat, skeletal_type, search, clade } =
    filters;

  const eraNorm = era && era !== 'all' ? normalizeText(era) : null;
  const periodNorm = period && period !== 'all' ? normalizeText(period) : null;
  const dietNorm = diet && diet !== 'all' ? normalizeText(diet) : null;
  const groupNorm = group && group !== 'all' ? normalizeText(group) : null;
  const habitatNorm =
    habitat && habitat !== 'all' ? normalizeText(habitat) : null;
  const skeletalNorm =
    skeletal_type && skeletal_type !== 'all'
      ? normalizeText(skeletal_type)
      : null;
  const searchNorm = search && search.trim() ? normalizeText(search) : null;
  const cladeNorm = clade && clade.trim() ? normalizeText(clade) : null;

  const results: Specimen[] = [];
  for (const spec of specimensMap.values()) {
    if (
      eraNorm &&
      normalizeText(spec.era) !== eraNorm &&
      !normalizeText(spec.era_display).includes(eraNorm)
    ) {
      continue;
    }
    if (
      periodNorm &&
      !normalizeText(spec.period).includes(periodNorm) &&
      !normalizeText(spec.epoch || '').includes(periodNorm) &&
      !normalizeText(spec.geological_range || '').includes(periodNorm)
    ) {
      continue;
    }
    if (dietNorm && normalizeText(spec.diet) !== dietNorm) {
      continue;
    }
    if (
      groupNorm &&
      normalizeText(spec.group) !== groupNorm &&
      !normalizeText(spec.group_display).includes(groupNorm)
    ) {
      continue;
    }
    if (habitatNorm) {
      if (habitatNorm === 'microbiologico') {
        if (normalizeText(spec.skeletal_type) !== 'microbiologico') continue;
      } else if (normalizeText(spec.habitat) !== habitatNorm) {
        continue;
      }
    }
    if (skeletalNorm && normalizeText(spec.skeletal_type) !== skeletalNorm) {
      continue;
    }
    if (cladeNorm) {
      const cladogram = spec.expert?.cladogram || [];
      const matchesClade = cladogram.some(
        (node) => normalizeText(node) === cladeNorm || normalizeText(node).includes(cladeNorm)
      );
      if (!matchesClade) continue;
    }
    if (searchNorm) {
      const aliases = SPECIMEN_ALIASES[spec.id.toLowerCase()] || [];
      const haystack = normalizeText(
        [
          spec.name,
          spec.genus,
          spec.scientific_name || '',
          spec.bio,
          spec.group_display,
          spec.etymology || '',
          spec.period || '',
          ...aliases,
          ...(spec.expert?.cladogram || []),
        ].join(' ')
      );
      if (!haystack.includes(searchNorm)) {
        continue;
      }
    }
    results.push(spec);
  }

  results.sort((a, b) => {
    if (a.is_contemporary !== b.is_contemporary) {
      return a.is_contemporary ? -1 : 1;
    }
    if (a.is_custom_ingested !== b.is_custom_ingested) {
      return a.is_custom_ingested ? -1 : 1;
    }
    return a.name.localeCompare(b.name, 'pt-BR');
  });

  return results;
}

export function getStats(): CatalogStats {
  const by_era: Record<string, number> = {};
  const by_diet: Record<string, number> = {};
  const by_group: Record<string, number> = {};
  const by_skeletal_type: Record<string, number> = {};

  for (const spec of specimensMap.values()) {
    by_era[spec.era] = (by_era[spec.era] || 0) + 1;
    by_diet[spec.diet] = (by_diet[spec.diet] || 0) + 1;
    by_group[spec.group] = (by_group[spec.group] || 0) + 1;
    by_skeletal_type[spec.skeletal_type] =
      (by_skeletal_type[spec.skeletal_type] || 0) + 1;
  }

  return {
    total_specimens: specimensMap.size,
    by_era,
    by_diet,
    by_group,
    by_skeletal_type,
  };
}
