export interface GalleryItem {
  url: string;
  caption: string;
  type: string;
  category: string;
  author?: string;
}

export interface ExpertData {
  cladogram: string[];
  osteology: string;
  biomechanics: string;
  histology: string;
}

export interface Specimen {
  id: string;
  name: string;
  genus: string;
  scientific_name?: string | null;
  era: string;
  era_display: string;
  period: string;
  epoch?: string;
  geological_range: string;
  group: string;
  group_display: string;
  diet: string;
  diet_display: string;
  habitat: string;
  skeletal_type: string;
  skeletal_composition: string;
  is_contemporary: boolean;
  conservation_status?: string | null;
  length: string;
  height: string;
  weight: string;
  speed: string;
  bite_force: string;
  image_url: string;
  image_caption: string;
  gallery: GalleryItem[];
  etymology: string;
  bio: string;
  curiosities: string[];
  expert: ExpertData;
  occurrences_count: number;
  fossil_locations: string;
  is_custom_ingested: boolean;
}

export interface IngestRequest {
  name: string;
  era_hint?: string | null;
}

export interface IngestResponse {
  success: boolean;
  message: string;
  specimen: Specimen | null;
}

export interface EraMetadata {
  id: string;
  name: string;
  time_span: string;
  range_ma: string;
  icon: string;
  color: string;
  bg_color: string;
  description: string;
  periods: string[];
  iconic_creatures: string[];
}

export interface Occurrence {
  lat: number;
  lng: number;
  country?: string;
  formation?: string;
  early_age?: number | null;
  late_age?: number | null;
  collection_name?: string | null;
  is_contemporary: boolean;
}

export interface SpecimenFilter {
  era?: string;
  period?: string;
  diet?: string;
  group?: string;
  habitat?: string;
  skeletal_type?: string;
  search?: string;
}

export interface CatalogStats {
  total_specimens: number;
  by_era: Record<string, number>;
  by_diet: Record<string, number>;
  by_group: Record<string, number>;
  by_skeletal_type: Record<string, number>;
}
