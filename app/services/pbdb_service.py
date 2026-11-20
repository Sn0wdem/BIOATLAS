import httpx
from typing import Dict, Any, List, Optional
import logging

logger = logging.getLogger(__name__)

USER_AGENT = "MesozoicGlobalExplorer/2.0 (paleo@earthhistory.org; educational research)"


def infer_era_from_ma(max_ma: Optional[float], min_ma: Optional[float], interval: Optional[str] = "") -> tuple[str, str]:
    """Infers era key and display name based on millions of years ago or interval string."""
    interval_lower = (interval or "").lower()
    
    # Check by period / interval keywords first
    if any(k in interval_lower for k in ["ediacaran", "ediacarano", "precambrian", "pré-cambriano", "proterozoic"]):
        return "precambriano", "Pré-Cambriano"
    if any(k in interval_lower for k in ["cambrian", "cambriano", "ordovician", "ordoviciano", "silurian", "siluriano", "devonian", "devoniano", "carboniferous", "carbonífero", "permian", "permiano", "paleozoic"]):
        return "paleozoico", "Paleozoico"
    if any(k in interval_lower for k in ["triassic", "triássico", "jurassic", "jurássico", "cretaceous", "cretáceo", "mesozoic"]):
        return "mesozoico", "Mesozoico"
    if any(k in interval_lower for k in ["paleogene", "paleógeno", "neogene", "neógeno", "quaternary", "quaternário", "pleistocene", "pleistoceno", "holocene", "eocene", "miocene", "cenozoic"]):
        return "cenozoico", "Cenozoico"

    # Fallback by numerical age (Ma)
    age = max_ma if max_ma is not None else min_ma
    if age is not None:
        if age > 541:
            return "precambriano", "Pré-Cambriano"
        elif age >= 251.9:
            return "paleozoico", "Paleozoico"
        elif age >= 66.0:
            return "mesozoico", "Mesozoico"
        else:
            return "cenozoico", "Cenozoico"

    return "mesozoico", "Mesozoico"


def translate_interval_to_pt(interval: Optional[str]) -> str:
    """Translates common PBDB intervals to Portuguese."""
    if not interval:
        return "Desconhecido"
    
    mapping = {
        "Ediacaran": "Ediacarano",
        "Cambrian": "Cambriano",
        "Ordovician": "Ordoviciano",
        "Silurian": "Siluriano",
        "Devonian": "Devoniano",
        "Carboniferous": "Carbonífero",
        "Permian": "Permiano",
        "Triassic": "Triássico",
        "Jurassic": "Jurássico",
        "Cretaceous": "Cretáceo",
        "Paleogene": "Paleógeno",
        "Neogene": "Neógeno",
        "Quaternary": "Quaternário",
        "Pleistocene": "Pleistoceno",
        "Pliocene": "Plioceno",
        "Miocene": "Mioceno",
        "Oligocene": "Oligoceno",
        "Eocene": "Eoceno",
        "Paleocene": "Paleoceno",
        "Late Cretaceous": "Cretáceo Superior",
        "Early Cretaceous": "Cretáceo Inferior",
        "Late Jurassic": "Jurássico Superior",
        "Early Jurassic": "Jurássico Inferior",
        "Late Triassic": "Triássico Superior",
    }
    for k, v in mapping.items():
        if k.lower() in interval.lower():
            return v
    return interval


async def fetch_taxon_info(taxon_name: str) -> Optional[Dict[str, Any]]:
    """Fetches taxonomic and stratigraphic information from PBDB."""
    url = f"https://paleobiodb.org/data1.2/taxa/single.json?name={taxon_name}&vocab=pbdb"
    headers = {"User-Agent": USER_AGENT}
    try:
        async with httpx.AsyncClient(headers=headers, timeout=12.0) as client:
            resp = await client.get(url)
            if resp.status_code != 200:
                logger.warning(f"PBDB taxon returned status {resp.status_code} for {taxon_name}")
                return None
            data = resp.json()
            records = data.get("records", [])
            if not records:
                return None
            
            rec = records[0]
            max_ma = rec.get("early_age") or rec.get("max_ma")
            min_ma = rec.get("late_age") or rec.get("min_ma")
            interval = rec.get("early_interval") or rec.get("interval") or ""
            
            era_key, era_name = infer_era_from_ma(max_ma, min_ma, interval)
            period_pt = translate_interval_to_pt(interval)
            
            range_str = f"{max_ma:.1f} a {min_ma:.1f} Ma" if (max_ma and min_ma) else "Tempo geológico indeterminado"
            
            return {
                "taxon_name": rec.get("taxon_name", taxon_name),
                "phylum": rec.get("phylum_name"),
                "class_name": rec.get("class_name"),
                "order_name": rec.get("order_name"),
                "family_name": rec.get("family_name"),
                "era": era_key,
                "era_display": era_name,
                "period": period_pt,
                "max_ma": max_ma,
                "min_ma": min_ma,
                "geological_range": range_str,
                "attribution": rec.get("attribution", "")
            }
    except Exception as e:
        logger.error(f"Error querying PBDB for taxon {taxon_name}: {e}")
        return None


async def fetch_taxon_occurrences(taxon_name: str, limit: int = 40) -> List[Dict[str, Any]]:
    """Fetches real georeferenced fossil occurrences from PBDB."""
    url = f"https://paleobiodb.org/data1.2/occs/list.json?base_name={taxon_name}&show=coords,loc,time,stratext&limit={limit}"
    headers = {"User-Agent": USER_AGENT}
    results = []
    try:
        async with httpx.AsyncClient(headers=headers, timeout=12.0) as client:
            resp = await client.get(url)
            if resp.status_code != 200:
                return []
            data = resp.json()
            records = data.get("records", [])
            for r in records:
                lat = r.get("lat")
                lng = r.get("lng")
                if lat is not None and lng is not None:
                    results.append({
                        "lat": float(lat),
                        "lng": float(lng),
                        "country": r.get("cc", "Global"),
                        "formation": r.get("sfm") or r.get("gfn") or "Formação sedimentar fóssil",
                        "early_age": r.get("eag"),
                        "late_age": r.get("lag"),
                        "collection_name": r.get("cn") or r.get("nam") or f"Registro de {taxon_name}"
                    })
    except Exception as e:
        logger.error(f"Error querying PBDB occurrences for {taxon_name}: {e}")
    return results
