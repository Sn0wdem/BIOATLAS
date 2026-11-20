import httpx
from typing import Dict, Any, List, Optional
import logging

logger = logging.getLogger(__name__)

USER_AGENT = "SuperWikiAnimalExplorer/3.0 (bio@earthwiki.org; educational research)"


async def match_gbif_species(query: str) -> Optional[Dict[str, Any]]:
    """Queries GBIF Backbone Taxonomy to identify any living or fossil species."""
    url = "https://api.gbif.org/v1/species/match"
    params = {"name": query, "verbose": "true"}
    headers = {"User-Agent": USER_AGENT}

    try:
        async with httpx.AsyncClient(headers=headers, timeout=12.0) as client:
            resp = await client.get(url, params=params)
            if resp.status_code != 200:
                return None
            data = resp.json()
            if data.get("matchType") == "NONE":
                # Try free text search fallback
                search_url = "https://api.gbif.org/v1/species/search"
                s_resp = await client.get(search_url, params={"q": query, "limit": 1})
                if s_resp.status_code == 200:
                    results = s_resp.json().get("results", [])
                    if results:
                        data = results[0]
                    else:
                        return None
                else:
                    return None

            phylum = data.get("phylum") or ""
            class_name = data.get("class") or ""
            order_name = data.get("order") or ""
            family_name = data.get("family") or ""
            genus_name = data.get("genus") or data.get("canonicalName") or query
            scientific_name = data.get("scientificName") or query

            # Vertebrate vs Invertebrate determination
            is_vertebrate = (phylum.lower() == "chordata") and (class_name.lower() not in ["ascidiacea", "thaliacea", "appendicularia"])
            skeletal_type = "vertebrado" if is_vertebrate else "invertebrado"

            # Structural / skeletal composition determination
            if is_vertebrate:
                if class_name.lower() in ["chondrichthyes", "elasmobranchii", "holocephali"]:
                    skeletal_comp = "Cartilagem Calcificada (Sem Ossos Verdadeiros)"
                elif class_name.lower() in ["aves"]:
                    skeletal_comp = "Endoesqueleto Ósseo Pneumatizado (Leve e Oco)"
                else:
                    skeletal_comp = "Endoesqueleto Ósseo Articulado e Cartilagem"
            else:
                if phylum.lower() == "arthropoda":
                    skeletal_comp = "Exoesqueleto Quitinoso Esclerotizado (Articulado)"
                elif phylum.lower() == "mollusca":
                    skeletal_comp = "Concha Calcária (Carbonato de Cálcio) ou Hidroesqueleto"
                elif phylum.lower() == "echinodermata":
                    skeletal_comp = "Endoesqueleto Dérmico de Placas Calcárias"
                elif phylum.lower() in ["cnidaria", "porifera"]:
                    skeletal_comp = "Espículas Silicosas/Calcárias ou Hidroesqueleto"
                else:
                    skeletal_comp = "Hidroesqueleto e Cutícula Flexível"

            # Build cladistic hierarchy
            cladogram = [
                data.get("kingdom", "Animalia"),
                phylum or ("Chordata" if is_vertebrate else "Invertebrata"),
                class_name or ("Vertebrata" if is_vertebrate else "Invertebrados"),
                order_name or "Ordem taxonômica",
                family_name or "Família biológica",
                genus_name,
                data.get("canonicalName") or scientific_name
            ]
            cladogram = [c for c in cladogram if c]

            return {
                "usage_key": data.get("usageKey") or data.get("key"),
                "scientific_name": scientific_name,
                "canonical_name": data.get("canonicalName") or genus_name,
                "genus": genus_name,
                "kingdom": data.get("kingdom"),
                "phylum": phylum,
                "class_name": class_name,
                "order_name": order_name,
                "family_name": family_name,
                "skeletal_type": skeletal_type,
                "skeletal_composition": skeletal_comp,
                "cladogram": cladogram,
                "rank": data.get("rank", "SPECIES")
            }
    except Exception as e:
        logger.error(f"Error querying GBIF for '{query}': {e}")
        return None


async def fetch_gbif_occurrences(taxon_key: int, limit: int = 40) -> List[Dict[str, Any]]:
    """Fetches modern georeferenced specimen occurrences from GBIF."""
    url = "https://api.gbif.org/v1/occurrence/search"
    params = {
        "taxonKey": str(taxon_key),
        "hasCoordinate": "true",
        "limit": str(limit)
    }
    headers = {"User-Agent": USER_AGENT}
    results = []

    try:
        async with httpx.AsyncClient(headers=headers, timeout=12.0) as client:
            resp = await client.get(url, params=params)
            if resp.status_code != 200:
                return []
            data = resp.json()
            for r in data.get("results", []):
                lat = r.get("decimalLatitude")
                lng = r.get("decimalLongitude")
                if lat is not None and lng is not None:
                    country = r.get("country") or "Global"
                    locality = r.get("locality") or r.get("stateProvince") or "Registro de observação natural"
                    results.append({
                        "lat": float(lat),
                        "lng": float(lng),
                        "country": country,
                        "formation": locality,
                        "early_age": 0.0,
                        "late_age": 0.0,
                        "collection_name": r.get("datasetName") or f"Registro de {r.get('scientificName', 'espécime')}",
                        "is_contemporary": True
                    })
    except Exception as e:
        logger.error(f"Error querying GBIF occurrences for taxonKey {taxon_key}: {e}")

    return results
