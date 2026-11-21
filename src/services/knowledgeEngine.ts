import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { GalleryItem, Occurrence, Specimen } from '../types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '..', '..', 'data');

interface RawCoordinate {
  lat: number;
  lng: number;
  locality?: string;
  country?: string;
  formation?: string;
  early_age?: number | null;
  late_age?: number | null;
  age_str?: string;
}

export interface KnownTaxonEntry {
  id: string;
  name: string;
  aliases?: string[];
  genus?: string;
  scientific_name?: string;
  era: string;
  era_display: string;
  period: string;
  epoch?: string;
  geological_range?: string;
  group: string;
  group_display: string;
  diet: string;
  diet_display: string;
  habitat?: string;
  skeletal_type?: string;
  skeletal_composition?: string;
  is_contemporary?: boolean;
  conservation_status?: string;
  length?: string;
  height?: string;
  weight?: string;
  speed?: string;
  bite_force?: string;
  image_url: string;
  image_caption?: string;
  gallery?: Array<Partial<GalleryItem> & { url: string }>;
  etymology?: string;
  bio?: string;
  curiosities?: string[];
  expert?: {
    cladogram?: string[];
    osteology?: string;
    biomechanics?: string;
    histology?: string;
  };
  occurrences_count?: number;
  fossil_locations?: string;
  coordinates?: RawCoordinate[];
}

export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .toLowerCase()
    .trim();
}

const POPULAR_TAXA: KnownTaxonEntry[] = fs.existsSync(
  path.join(DATA_DIR, 'popular_taxa.json')
)
  ? (JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, 'popular_taxa.json'), 'utf-8')
    ) as KnownTaxonEntry[])
  : [];

const COORDINATES_REGISTRY: Record<string, RawCoordinate[]> = fs.existsSync(
  path.join(DATA_DIR, 'coordinates_registry.json')
)
  ? (JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, 'coordinates_registry.json'), 'utf-8')
    ) as Record<string, RawCoordinate[]>)
  : {};

const TAXA_BY_ALIAS = new Map<string, KnownTaxonEntry>();
for (const entry of POPULAR_TAXA) {
  for (const alias of entry.aliases || []) {
    TAXA_BY_ALIAS.set(normalizeText(alias), entry);
  }
  TAXA_BY_ALIAS.set(normalizeText(entry.id), entry);
  TAXA_BY_ALIAS.set(normalizeText(entry.name), entry);
  if (entry.scientific_name) {
    TAXA_BY_ALIAS.set(normalizeText(entry.scientific_name), entry);
  }
}

export function findKnownTaxon(query: string): KnownTaxonEntry | null {
  const norm = normalizeText(query);
  if (!norm) return null;

  const exact = TAXA_BY_ALIAS.get(norm);
  if (exact) return exact;

  if (norm.length >= 3) {
    for (const [aliasNorm, entry] of TAXA_BY_ALIAS.entries()) {
      if (aliasNorm.includes(norm) || norm.includes(aliasNorm)) {
        return entry;
      }
    }
  }
  return null;
}

export function buildSpecimenFromKnown(data: KnownTaxonEntry): Specimen {
  const gallery: GalleryItem[] = (data.gallery || []).map((g) => ({
    url: g.url,
    caption: g.caption || 'Representação do espécime',
    type: g.type || 'living_specimen',
    category: g.category || 'life_view',
    author: g.author || 'Wikimedia Commons',
  }));

  return {
    id: data.id,
    name: data.name,
    genus: data.genus || data.name,
    scientific_name: data.scientific_name || data.name,
    era: data.era,
    era_display: data.era_display,
    period: data.period,
    epoch: data.epoch || '',
    geological_range: data.geological_range || data.period,
    group: data.group,
    group_display: data.group_display,
    diet: data.diet,
    diet_display: data.diet_display,
    habitat: data.habitat || 'terrestre',
    skeletal_type: data.skeletal_type || 'vertebrado',
    skeletal_composition: data.skeletal_composition || 'Osso e Cartilagem',
    is_contemporary: Boolean(data.is_contemporary),
    conservation_status: data.conservation_status || 'Espécie Vivente',
    length: data.length || 'Em estudo',
    height: data.height || 'Em estudo',
    weight: data.weight || 'Em estudo',
    speed: data.speed || 'Em estudo',
    bite_force: data.bite_force || 'Em estudo',
    image_url: data.image_url,
    image_caption: data.image_caption || data.name,
    gallery,
    etymology: data.etymology || '',
    bio: data.bio || '',
    curiosities: data.curiosities || [],
    expert: {
      cladogram: data.expert?.cladogram || [],
      osteology: data.expert?.osteology || '',
      biomechanics: data.expert?.biomechanics || '',
      histology: data.expert?.histology || '',
    },
    occurrences_count: data.occurrences_count ?? (data.coordinates?.length || 0),
    fossil_locations: data.fossil_locations || 'Distribuição Global',
    is_custom_ingested: true,
  };
}

export function estimateBiometricsByGroup(
  group: string,
  diet: string,
  habitat: string,
  name: string
): {
  length: string;
  height: string;
  weight: string;
  speed: string;
  bite_force: string;
} {
  const n = name.toLowerCase();
  if (n.includes('tubar')) {
    return {
      length: '3.5 – 5.0 m',
      height: '0.9 m',
      weight: '400 – 900 kg',
      speed: '35 – 45 km/h',
      bite_force: '3.500 – 6.000 N',
    };
  }
  if (n.includes('baleia')) {
    return {
      length: '14.0 – 22.0 m',
      height: '3.5 m',
      weight: '30.000 – 60.000 kg',
      speed: '25 – 35 km/h',
      bite_force:
        n.includes('azul') || n.includes('jubarte')
          ? 'Inofensivo (Filtrador)'
          : '18.000 N',
    };
  }
  if (n.includes('elefante') || n.includes('mamute')) {
    return {
      length: '5.5 – 7.0 m',
      height: '3.2 – 3.8 m',
      weight: '4.500 – 6.500 kg',
      speed: '35 – 40 km/h',
      bite_force: '2.500 N',
    };
  }
  if (
    n.includes('lobo') ||
    n.includes('cao') ||
    n.includes('cão') ||
    n.includes('cachorro')
  ) {
    return {
      length: '1.1 – 1.5 m',
      height: '0.7 – 0.85 m',
      weight: '30 – 60 kg',
      speed: '50 – 65 km/h',
      bite_force: '1.800 – 2.800 N',
    };
  }
  if (n.includes('gato') || n.includes('felino') || n.includes('lince')) {
    return {
      length: '0.6 – 0.9 m',
      height: '0.3 – 0.45 m',
      weight: '5 – 15 kg',
      speed: '45 – 55 km/h',
      bite_force: '450 – 800 N',
    };
  }
  if (
    n.includes('aguia') ||
    n.includes('águia') ||
    n.includes('gaviao') ||
    n.includes('gavião') ||
    n.includes('falcao') ||
    n.includes('falcão')
  ) {
    return {
      length: '0.7 – 0.95 m (Envergadura: 1.9 – 2.3 m)',
      height: '0.8 m',
      weight: '3.5 – 6.5 kg',
      speed: '160 – 300 km/h',
      bite_force: 'Garras: 2.500 – 3.500 N',
    };
  }
  if (n.includes('crocodilo') || n.includes('jacare') || n.includes('jacaré')) {
    return {
      length: '4.0 – 5.5 m',
      height: '0.6 m',
      weight: '400 – 750 kg',
      speed: '28 – 32 km/h (água)',
      bite_force: '18.000 – 25.000 N',
    };
  }
  if (
    group.includes('pterossauro') ||
    n.includes('pterodactilo') ||
    n.includes('pteranodon')
  ) {
    return {
      length: '1.5 – 3.0 m (Envergadura: 3.5 – 7.0 m)',
      height: '1.2 m',
      weight: '15 – 35 kg',
      speed: '65 – 85 km/h',
      bite_force: '350 – 800 N',
    };
  }
  if (group.includes('dinossauro')) {
    if (diet === 'carnivoro') {
      return {
        length: '8.0 – 11.5 m',
        height: '3.0 – 3.8 m',
        weight: '2.500 – 5.500 kg',
        speed: '30 – 40 km/h',
        bite_force: '12.000 – 25.000 N',
      };
    }
    return {
      length: '12.0 – 25.0 m',
      height: '4.5 – 10.0 m',
      weight: '10.000 – 35.000 kg',
      speed: '15 – 22 km/h',
      bite_force: '1.500 – 3.000 N',
    };
  }
  if (group.includes('micro') || n.includes('bacteri') || group.includes('protozo')) {
    return {
      length: '10 – 150 µm (micrômetros)',
      height: '5 – 40 µm',
      weight: '0.05 – 2 nanogramas',
      speed: '0.1 – 2.0 mm/s',
      bite_force: 'Fagocitose / Absorção osmótica',
    };
  }
  if (habitat === 'aquatico') {
    return {
      length: '1.2 – 2.5 m',
      height: '0.5 m',
      weight: '40 – 150 kg',
      speed: '30 – 45 km/h',
      bite_force: '800 – 2.000 N',
    };
  }
  return {
    length: '1.0 – 1.8 m',
    height: '0.6 – 1.1 m',
    weight: '35 – 95 kg',
    speed: '40 – 60 km/h',
    bite_force: '1.000 – 2.500 N',
  };
}

export function getCuratedOccurrences(taxonIdOrName: string): Occurrence[] {
  const norm = normalizeText(taxonIdOrName);
  const slug = norm.replace(/\s+/g, '-');

  const known = findKnownTaxon(norm);
  if (known && known.coordinates && known.coordinates.length > 0) {
    return known.coordinates.map((c) => ({
      lat: c.lat,
      lng: c.lng,
      country: c.country || 'Global',
      formation: c.formation || c.locality || 'Localidade',
      early_age: c.early_age ?? null,
      late_age: c.late_age ?? null,
      collection_name: c.age_str || 'Ocorrência catalogada',
      is_contemporary: Boolean(known.is_contemporary),
    }));
  }

  let rawList: RawCoordinate[] | undefined =
    COORDINATES_REGISTRY[norm] || COORDINATES_REGISTRY[slug];

  if (!rawList) {
    for (const [k, coords] of Object.entries(COORDINATES_REGISTRY)) {
      if (
        k.includes(norm) ||
        norm.includes(k) ||
        k.includes(slug) ||
        slug.includes(k)
      ) {
        rawList = coords;
        break;
      }
    }
  }

  if (rawList) {
    return rawList.map((c) => {
      const ageStr = (c.age_str || '').toLowerCase();
      return {
        lat: c.lat,
        lng: c.lng,
        country: c.country || 'Global',
        formation: c.formation || c.locality || 'Localidade',
        early_age: c.early_age ?? null,
        late_age: c.late_age ?? null,
        collection_name: c.age_str || 'Ocorrência catalogada',
        is_contemporary: ageStr.includes('vivente') || ageStr.includes('gbif'),
      };
    });
  }

  return [];
}
