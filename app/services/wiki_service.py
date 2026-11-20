import httpx
import re
from typing import Dict, Any, List, Optional
import logging

logger = logging.getLogger(__name__)

USER_AGENT = "MesozoicGlobalExplorer/2.0 (paleo@earthhistory.org; educational research)"


def clean_html(raw_html: str) -> str:
    """Removes HTML tags from strings."""
    if not raw_html:
        return ""
    clean = re.sub(r"<.*?>", "", raw_html)
    return clean.strip()


async def fetch_wikipedia_summary(taxon_name: str) -> Dict[str, Any]:
    """Fetches summary, etymology cues, and lead image from PT or EN Wikipedia."""
    headers = {"User-Agent": USER_AGENT}
    
    # 1. Try Portuguese Wikipedia
    pt_url = f"https://pt.wikipedia.org/api/rest_v1/page/summary/{taxon_name}"
    try:
        async with httpx.AsyncClient(headers=headers, timeout=10.0) as client:
            resp = await client.get(pt_url)
            if resp.status_code == 200:
                data = resp.json()
                extract = data.get("extract", "")
                if len(extract) > 40:
                    thumb = data.get("thumbnail", {}).get("source") or data.get("originalimage", {}).get("source")
                    return {
                        "title": data.get("title", taxon_name),
                        "description": data.get("description", ""),
                        "extract": extract,
                        "image_url": thumb,
                        "lang": "pt"
                    }
    except Exception as e:
        logger.warning(f"Error querying PT Wikipedia for {taxon_name}: {e}")

    # 2. Fallback to English Wikipedia
    en_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{taxon_name}"
    try:
        async with httpx.AsyncClient(headers=headers, timeout=10.0) as client:
            resp = await client.get(en_url)
            if resp.status_code == 200:
                data = resp.json()
                thumb = data.get("thumbnail", {}).get("source") or data.get("originalimage", {}).get("source")
                return {
                    "title": data.get("title", taxon_name),
                    "description": data.get("description", ""),
                    "extract": data.get("extract", ""),
                    "image_url": thumb,
                    "lang": "en"
                }
    except Exception as e:
        logger.warning(f"Error querying EN Wikipedia for {taxon_name}: {e}")

    return {
        "title": taxon_name,
        "description": "Espécime fóssil catalogado no acervo paleontológico",
        "extract": f"{taxon_name} é um gênero extinto registrado no registro geológico fossilífero.",
        "image_url": None,
        "lang": "pt"
    }


async def fetch_commons_life_restorations(taxon_name: str, limit: int = 8) -> List[Dict[str, str]]:
    """Searches Wikimedia Commons specifically for life restoration / paleoart images."""
    headers = {"User-Agent": USER_AGENT}
    url = "https://commons.wikimedia.org/w/api.php"
    
    search_queries = [
        f"{taxon_name} life restoration",
        f"{taxon_name} restoration",
        f"{taxon_name} paleoart",
        f"{taxon_name} reconstruction",
        taxon_name
    ]
    
    collected_images = []
    seen_urls = set()

    async with httpx.AsyncClient(headers=headers, timeout=12.0) as client:
        for query in search_queries:
            if len(collected_images) >= limit:
                break
            
            params = {
                "action": "query",
                "generator": "search",
                "gsrsearch": query,
                "gsrnamespace": "6",  # File: namespace
                "gsrlimit": str(limit),
                "prop": "imageinfo",
                "iiprop": "url|dimensions|extmetadata",
                "iiurlwidth": "960",
                "format": "json"
            }
            
            try:
                resp = await client.get(url, params=params)
                if resp.status_code != 200:
                    continue
                data = resp.json()
                pages = data.get("query", {}).get("pages", {})
                
                for pid, p in pages.items():
                    title = p.get("title", "")
                    
                    # Filter out non-image files or undesirable types
                    title_lower = title.lower()
                    if any(bad in title_lower for bad in [".svg", ".ogg", ".pdf", ".stl", "sound", "map", "loc.png", "cladogram"]):
                        continue
                    
                    imageinfo = p.get("imageinfo", [])
                    if not imageinfo:
                        continue
                    info = imageinfo[0]
                    thumb_url = info.get("thumburl") or info.get("url")
                    if not thumb_url or thumb_url in seen_urls:
                        continue
                    
                    seen_urls.add(thumb_url)
                    
                    # Determine image type & artist
                    img_type = "life_restoration"
                    if "skeleton" in title_lower or "skull" in title_lower or "fossil" in title_lower:
                        img_type = "skeletal"
                    elif "size" in title_lower or "scale" in title_lower:
                        img_type = "scale"
                    
                    meta = info.get("extmetadata", {})
                    artist = meta.get("Artist", {}).get("value", "")
                    artist = clean_html(artist) or "Acervo Paleontológico / Wikimedia Commons"
                    
                    caption = meta.get("ObjectName", {}).get("value") or title.replace("File:", "").replace(".jpg", "").replace(".png", "")
                    caption = clean_html(caption)
                    if len(caption) > 80:
                        caption = caption[:80] + "..."

                    collected_images.append({
                        "url": thumb_url,
                        "caption": f"Representação: {caption}",
                        "type": img_type,
                        "author": artist
                    })
                    
                    if len(collected_images) >= limit:
                        break
            except Exception as e:
                logger.warning(f"Error querying Commons for '{query}': {e}")
                continue

    return collected_images


def infer_taxonomy_and_ecology(taxon_name: str, pbdb_data: Optional[Dict[str, Any]], wiki_summary: Dict[str, Any]) -> Dict[str, Any]:
    """Infers diet, habitat, taxonomic group, and biometric defaults."""
    text = f"{taxon_name} {pbdb_data.get('class_name', '') if pbdb_data else ''} {pbdb_data.get('order_name', '') if pbdb_data else ''} {wiki_summary.get('extract', '')}".lower()
    
    # 1. Group
    group = "dinossauro"
    group_display = "Dinossauro"
    
    if any(k in text for k in ["pterosaur", "pterossauro", "flying reptile", "azhdarch"]):
        group = "pterossauro"
        group_display = "Pterossauro / Réptil Alado"
    elif any(k in text for k in ["plesiosaur", "pliosaur", "mosasaur", "ichthyosaur", "placoderm", "marinho", "marine", "aquatic", "peixe", "fish", "tubarão", "shark", "whale", "baleia", "cetacea"]):
        group = "reptil-marinho"
        group_display = "Fauna Marinha & Aquática"
    elif any(k in text for k in ["synapsid", "sinápsideo", "pelycosaur", "therapsid", "gorgonops", "dimetrodon", "sphenacodont"]):
        group = "sinapsideo"
        group_display = "Sinapsídeo / Pré-Mamífero"
    elif any(k in text for k in ["mammalia", "mamífero", "megafauna", "felidae", "smilodon", "mammut", "mammuthus", "sloth", "preguiça", "xenarthra", "rhinocerot"]):
        group = "mamifero-megafauna"
        group_display = "Mamífero & Megafauna"
    elif any(k in text for k in ["arthropod", "artrópode", "trilobite", "trilobita", "anomalocar", "eurypterid", "insecta", "escorpião", "milípede", "centopéia"]):
        group = "artropode-invertebrado"
        group_display = "Artrópode & Invertebrado Primitivo"
    elif any(k in text for k in ["ediacar", "dickinsonia", "charnia", "spriggina", "kimberella", "proterozoic"]):
        group = "ediacarano"
        group_display = "Biota Ediacarana"

    # 2. Diet
    diet = "carnivoro"
    diet_display = "Carnívoro"
    if any(k in text for k in ["herbivor", "herbívoro", "planta", "sauropod", "ceratops", "ornithisch", "sloth", "mammoth", "mastodon"]):
        diet = "herbivoro"
        diet_display = "Herbívoro"
    elif any(k in text for k in ["piscivor", "piscívoro", "peixes", "fish-eating"]):
        diet = "piscivoro"
        diet_display = "Piscívoro"
    elif any(k in text for k in ["filtrador", "filter-feed", "plâncton", "detritivoro", "bentônico"]):
        diet = "filtrador"
        diet_display = "Filtrador / Detritívoro"
    elif any(k in text for k in ["onivoro", "onívoro", "omnivor"]):
        diet = "onivoro"
        diet_display = "Onívoro"

    # 3. Habitat
    habitat = "terrestre"
    if group in ["reptil-marinho", "ediacarano"] or any(k in text for k in ["aquático", "marinho", "oceano", "mar", "rio"]):
        habitat = "aquatico"
    elif group == "pterossauro" or any(k in text for k in ["aéreo", "voo", "asas"]):
        habitat = "aereo"
    elif any(k in text for k in ["bentônico", "fundo do mar"]):
        habitat = "bentonico"

    return {
        "group": group,
        "group_display": group_display,
        "diet": diet,
        "diet_display": diet_display,
        "habitat": habitat
    }
