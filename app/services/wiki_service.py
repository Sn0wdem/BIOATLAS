import httpx
import re
from typing import Dict, Any, List, Optional
import logging

logger = logging.getLogger(__name__)

USER_AGENT = "SuperWikiAnimalExplorer/3.0 (bio@earthwiki.org; educational research)"


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
        "description": "Espécime zoológico catalogado no acervo global",
        "extract": f"{taxon_name} é um espécime biológico catalogado na biodiversidade da Terra.",
        "image_url": None,
        "lang": "pt"
    }


async def fetch_multi_perspective_images(taxon_name: str, limit: int = 10) -> List[Dict[str, str]]:
    """Searches Wikimedia Commons for both living representations AND bones/skeleton/cartilage/anatomy."""
    headers = {"User-Agent": USER_AGENT}
    url = "https://commons.wikimedia.org/w/api.php"
    
    # Dual search queries: living representations vs skeletal/bones/cartilage
    search_configs = [
        # (query, default_category, default_type)
        (f"{taxon_name} (skeleton OR skull OR bones OR osteology OR fossil OR cartilage OR carapace)", "skeletal_view", "skeleton"),
        (f"{taxon_name} (life restoration OR paleoart OR living OR in nature OR photo)", "life_view", "living_specimen"),
        (f"{taxon_name}", "life_view", "living_specimen")
    ]
    
    collected_images = []
    seen_urls = set()

    async with httpx.AsyncClient(headers=headers, timeout=12.0) as client:
        for query_pattern, default_cat, default_type in search_configs:
            if len(collected_images) >= limit:
                break
            
            params = {
                "action": "query",
                "generator": "search",
                "gsrsearch": query_pattern,
                "gsrnamespace": "6",  # File: namespace
                "gsrlimit": "6",
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
                    
                    # Categorize image view
                    category = default_cat
                    img_type = default_type
                    
                    if any(k in title_lower for k in ["skeleton", "skull", "bone", "crânio", "esqueleto", "osteolog", "fossil", "cartilage", "carapace"]):
                        category = "skeletal_view"
                        img_type = "skeleton" if "skeleton" in title_lower or "esqueleto" in title_lower else "skull"
                    elif any(k in title_lower for k in ["anatomy", "dissection", "organ", "músculo", "muscle", "radiograph", "x-ray", "ct"]):
                        category = "anatomy_view"
                        img_type = "anatomy"
                    elif any(k in title_lower for k in ["scale", "size", "comparison"]):
                        category = "comparison_view"
                        img_type = "scale"
                    else:
                        category = "life_view"
                        img_type = "living_specimen"

                    meta = info.get("extmetadata", {})
                    artist = meta.get("Artist", {}).get("value", "")
                    artist = clean_html(artist) or "Wikimedia Commons"
                    
                    clean_caption = meta.get("ObjectName", {}).get("value") or title.replace("File:", "").replace(".jpg", "").replace(".png", "")
                    clean_caption = clean_html(clean_caption)
                    if len(clean_caption) > 85:
                        clean_caption = clean_caption[:85] + "..."

                    # Friendly category label in Portuguese
                    cat_labels = {
                        "skeletal_view": "🦴 Esqueleto / Ossos / Cartilagem",
                        "life_view": "🌿 Indivíduo em Vida",
                        "anatomy_view": "🔬 Anatomia Estrutural",
                        "comparison_view": "📏 Escala de Tamanho"
                    }
                    display_caption = f"[{cat_labels.get(category, 'Visualização')}] {clean_caption}"

                    collected_images.append({
                        "url": thumb_url,
                        "caption": display_caption,
                        "type": img_type,
                        "category": category,
                        "author": artist
                    })
                    
                    if len(collected_images) >= limit:
                        break
            except Exception as e:
                logger.warning(f"Error querying Commons for '{query_pattern}': {e}")
                continue

    return collected_images


def infer_taxonomy_and_ecology(
    taxon_name: str,
    pbdb_data: Optional[Dict[str, Any]],
    wiki_summary: Dict[str, Any],
    gbif_data: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Infers diet, habitat, taxonomic group, and biometric defaults for both contemporary and prehistoric animals."""
    combined_text = f"{taxon_name} {gbif_data.get('class_name', '') if gbif_data else ''} {gbif_data.get('order_name', '') if gbif_data else ''} {pbdb_data.get('class_name', '') if pbdb_data else ''} {wiki_summary.get('extract', '')}".lower()
    
    # 1. Group determination
    group = "mamifero-megafauna"
    group_display = "Mamífero"

    if any(k in combined_text for k in ["dinosaur", "dinossauro", "theropod", "sauropod", "ceratops"]):
        group = "dinossauro"
        group_display = "Dinossauro"
    elif any(k in combined_text for k in ["pterosaur", "pterossauro", "azhdarch"]):
        group = "pterossauro"
        group_display = "Pterossauro / Réptil Alado"
    elif any(k in combined_text for k in ["ave", "bird", "passerine", "falcon", "aquila", "águia", "coruja", "gavião"]):
        group = "ave"
        group_display = "Ave (Dinossauro Aviano)"
    elif any(k in combined_text for k in ["shark", "tubarão", "raia", "chondrichthyes", "carcharodon", "otodus", "peixe", "fish", "placoderm", "whale", "baleia", "golfinho", "cetace"]):
        group = "reptil-marinho"
        group_display = "Fauna Marinha & Aquática"
    elif any(k in combined_text for k in ["felidae", "felino", "onça", "leão", "tigre", "panthera", "lobo", "urso", "canis", "elefante", "mammalia", "mamífero"]):
        group = "mamifero-megafauna"
        group_display = "Mamífero"
    elif any(k in combined_text for k in ["synapsid", "sinápsideo", "dimetrodon", "gorgonops"]):
        group = "sinapsideo"
        group_display = "Sinapsídeo"
    elif any(k in combined_text for k in ["arthropod", "artrópode", "insecta", "inseto", "aracnídeo", "caranguejo", "crab", "trilobite", "centopeia"]):
        group = "artropode-invertebrado"
        group_display = "Artrópode Invertebrado"
    elif any(k in combined_text for k in ["molusco", "mollusca", "polvo", "octopus", "lula", "squid", "caracol"]):
        group = "artropode-invertebrado"
        group_display = "Molusco Invertebrado"
    elif any(k in combined_text for k in ["ediacar", "dickinsonia", "charnia", "spriggina"]):
        group = "ediacarano"
        group_display = "Biota Ediacarana"

    # 2. Diet determination
    diet = "carnivoro"
    diet_display = "Carnívoro"
    if any(k in combined_text for k in ["herbivor", "herbívoro", "vegetariano", "planta", "folhas", "grama", "elefante", "veado", "sauropod"]):
        diet = "herbivoro"
        diet_display = "Herbívoro"
    elif any(k in combined_text for k in ["piscivor", "piscívoro", "peixes", "tubarão", "lontra"]):
        diet = "piscivoro"
        diet_display = "Piscívoro"
    elif any(k in combined_text for k in ["filtrador", "filter-feed", "plâncton", "krill", "baleia-azul"]):
        diet = "filtrador"
        diet_display = "Filtrador / Microbívoro"
    elif any(k in combined_text for k in ["onivoro", "onívoro", "omnivor"]):
        diet = "onivoro"
        diet_display = "Onívoro"

    # 3. Habitat determination
    habitat = "terrestre"
    if group in ["reptil-marinho"] or any(k in combined_text for k in ["aquático", "marinho", "oceano", "mar", "rio", "baleia", "tubarão", "polvo"]):
        habitat = "aquatico"
    elif group in ["pterossauro", "ave"] or any(k in combined_text for k in ["aéreo", "voo", "asas"]):
        habitat = "aereo"
    elif group == "ediacarano" or any(k in combined_text for k in ["bentônico", "fundo do mar"]):
        habitat = "bentonico"

    return {
        "group": group,
        "group_display": group_display,
        "diet": diet,
        "diet_display": diet_display,
        "habitat": habitat
    }
