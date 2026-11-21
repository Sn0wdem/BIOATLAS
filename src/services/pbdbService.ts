import type { Occurrence } from '../types.ts';

const USER_AGENT =
  'MesozoicGlobalExplorer/2.0 (paleo@earthhistory.org; educational research)';

export interface PbdbTaxonInfo {
  taxon_name: string;
  phylum?: string;
  class_name?: string;
  order_name?: string;
  family_name?: string;
  era: string;
  era_display: string;
  period: string;
  max_ma?: number;
  min_ma?: number;
  geological_range: string;
  attribution: string;
}

export function inferEraFromMa(
  maxMa?: number | null,
  minMa?: number | null,
  interval = ''
): [string, string] {
  const intervalLower = (interval || '').toLowerCase();

  if (
    ['ediacaran', 'ediacarano', 'precambrian', 'pré-cambriano', 'proterozoic'].some(
      (k) => intervalLower.includes(k)
    )
  ) {
    return ['precambriano', 'Pré-Cambriano'];
  }
  if (
    [
      'cambrian',
      'cambriano',
      'ordovician',
      'ordoviciano',
      'silurian',
      'siluriano',
      'devonian',
      'devoniano',
      'carboniferous',
      'carbonífero',
      'permian',
      'permiano',
      'paleozoic',
    ].some((k) => intervalLower.includes(k))
  ) {
    return ['paleozoico', 'Paleozoico'];
  }
  if (
    [
      'triassic',
      'triássico',
      'jurassic',
      'jurássico',
      'cretaceous',
      'cretáceo',
      'mesozoic',
    ].some((k) => intervalLower.includes(k))
  ) {
    return ['mesozoico', 'Mesozoico'];
  }
  if (
    [
      'paleogene',
      'paleógeno',
      'neogene',
      'neógeno',
      'quaternary',
      'quaternário',
      'pleistocene',
      'pleistoceno',
      'holocene',
      'eocene',
      'miocene',
      'cenozoic',
    ].some((k) => intervalLower.includes(k))
  ) {
    return ['cenozoico', 'Cenozoico'];
  }

  const age = maxMa ?? minMa;
  if (typeof age === 'number') {
    if (age > 541) return ['precambriano', 'Pré-Cambriano'];
    if (age >= 251.9) return ['paleozoico', 'Paleozoico'];
    if (age >= 66.0) return ['mesozoico', 'Mesozoico'];
    return ['cenozoico', 'Cenozoico'];
  }

  return ['mesozoico', 'Mesozoico'];
}

export function translateIntervalToPt(interval?: string | null): string {
  if (!interval) return 'Desconhecido';
  const mapping: Record<string, string> = {
    'Late Cretaceous': 'Cretáceo Superior',
    'Early Cretaceous': 'Cretáceo Inferior',
    'Late Jurassic': 'Jurássico Superior',
    'Early Jurassic': 'Jurássico Inferior',
    'Late Triassic': 'Triássico Superior',
    Ediacaran: 'Ediacarano',
    Cambrian: 'Cambriano',
    Ordovician: 'Ordoviciano',
    Silurian: 'Siluriano',
    Devonian: 'Devoniano',
    Carboniferous: 'Carbonífero',
    Permian: 'Permiano',
    Triassic: 'Triássico',
    Jurassic: 'Jurássico',
    Cretaceous: 'Cretáceo',
    Paleogene: 'Paleógeno',
    Neogene: 'Neógeno',
    Quaternary: 'Quaternário',
    Pleistocene: 'Pleistoceno',
    Pliocene: 'Plioceno',
    Miocene: 'Mioceno',
    Oligocene: 'Oligoceno',
    Eocene: 'Eoceno',
    Paleocene: 'Paleoceno',
  };
  const lower = interval.toLowerCase();
  for (const [k, v] of Object.entries(mapping)) {
    if (lower.includes(k.toLowerCase())) return v;
  }
  return interval;
}

export async function fetchTaxonInfo(
  taxonName: string
): Promise<PbdbTaxonInfo | null> {
  const url = `https://paleobiodb.org/data1.2/taxa/single.json?name=${encodeURIComponent(taxonName)}&vocab=pbdb`;
  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(12000),
    });
    if (!resp.ok) return null;
    const data = (await resp.json()) as { records?: Record<string, unknown>[] };
    const records = data.records || [];
    if (records.length === 0) return null;

    const rec = records[0];
    const maxMa =
      typeof rec.early_age === 'number'
        ? rec.early_age
        : typeof rec.max_ma === 'number'
          ? rec.max_ma
          : undefined;
    const minMa =
      typeof rec.late_age === 'number'
        ? rec.late_age
        : typeof rec.min_ma === 'number'
          ? rec.min_ma
          : undefined;
    const interval = String(rec.early_interval || rec.interval || '');

    const [eraKey, eraName] = inferEraFromMa(maxMa, minMa, interval);
    const periodPt = translateIntervalToPt(interval);
    const rangeStr =
      maxMa !== undefined && minMa !== undefined
        ? `${maxMa.toFixed(1)} a ${minMa.toFixed(1)} Ma`
        : 'Tempo geológico indeterminado';

    return {
      taxon_name: String(rec.taxon_name || taxonName),
      phylum: rec.phylum_name ? String(rec.phylum_name) : undefined,
      class_name: rec.class_name ? String(rec.class_name) : undefined,
      order_name: rec.order_name ? String(rec.order_name) : undefined,
      family_name: rec.family_name ? String(rec.family_name) : undefined,
      era: eraKey,
      era_display: eraName,
      period: periodPt,
      max_ma: maxMa,
      min_ma: minMa,
      geological_range: rangeStr,
      attribution: String(rec.attribution || ''),
    };
  } catch (err) {
    console.error(`[PBDB] Error querying taxon ${taxonName}:`, err);
    return null;
  }
}

export async function fetchTaxonOccurrences(
  taxonName: string,
  limit = 40
): Promise<Occurrence[]> {
  const url = `https://paleobiodb.org/data1.2/occs/list.json?base_name=${encodeURIComponent(taxonName)}&show=coords,loc,time,stratext&limit=${encodeURIComponent(String(limit))}`;
  const results: Occurrence[] = [];

  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(12000),
    });
    if (!resp.ok) return [];
    const data = (await resp.json()) as { records?: Record<string, unknown>[] };
    for (const r of data.records || []) {
      const lat = r.lat;
      const lng = r.lng;
      if (lat !== undefined && lng !== undefined && lat !== null && lng !== null) {
        const latNum = Number(lat);
        const lngNum = Number(lng);
        if (!Number.isNaN(latNum) && !Number.isNaN(lngNum)) {
          results.push({
            lat: latNum,
            lng: lngNum,
            country: String(r.cc || 'Global'),
            formation: String(r.sfm || r.gfn || 'Formação sedimentar fóssil'),
            early_age: typeof r.eag === 'number' ? r.eag : null,
            late_age: typeof r.lag === 'number' ? r.lag : null,
            collection_name: String(
              r.cn || r.nam || `Registro de ${taxonName}`
            ),
            is_contemporary: false,
          });
        }
      }
    }
  } catch (err) {
    console.error(`[PBDB] Error querying occurrences for ${taxonName}:`, err);
  }
  return results;
}
