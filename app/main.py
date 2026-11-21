from fastapi import FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import httpx
import os
import random
import logging
from typing import List, Optional

from app.models import (
    Specimen, SpecimenSummary, IngestRequest, IngestResponse,
    EraMetadata, Occurrence, GalleryItem, ExpertData
)
from app.database import (
    init_db, get_all_specimens, get_specimen_by_id, upsert_specimen, get_stats
)
from app.seed_data import seed_database
from app.services.pbdb_service import fetch_taxon_info, fetch_taxon_occurrences, infer_era_from_ma
from app.services.gbif_service import match_gbif_species, fetch_gbif_occurrences
from app.services.wiki_service import (
    fetch_wikipedia_summary, fetch_multi_perspective_images, infer_taxonomy_and_ecology, USER_AGENT
)
from app.services.knowledge_engine import (
    find_known_taxon, build_specimen_from_known, get_curated_occurrences, normalize_text, estimate_biometrics_by_group
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("superwiki_api")

app = FastAPI(
    title="Super Wiki Global da Vida na Terra",
    description="Enciclopédia universal com FastAPI, GBIF, PBDB e Wikimedia Commons cobrindo animais de todas as eras, contemporâneos e fósseis, vertebrados e invertebrados.",
    version="3.0.0"
)

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_db()
    specs = get_all_specimens()
    if len(specs) < 35:
        seed_database()


# Metadata for all Geological and Contemporary Eras
ERAS_DATA = [
    EraMetadata(
        id="contemporaneo",
        name="Era Contemporânea / Fauna Atual",
        time_span="Holoceno ao Presente (0 Ma)",
        range_ma="Atual",
        icon="🌍",
        color="#10b981",
        bg_color="rgba(16, 185, 129, 0.15)",
        description="A espetacular biodiversidade vivente no Planeta Terra: vertebrados mamíferos, aves, répteis, anfíbios, peixes ósseos e cartilaginosos, além de artrópodes e moluscos invertebrados.",
        periods=["Holoceno / Atualidade"],
        iconic_creatures=["Panthera onca", "Balaenoptera musculus", "Carcharodon carcharias", "Octopus vulgaris", "Loxodonta africana", "Varanus komodoensis"]
    ),
    EraMetadata(
        id="cenozoico",
        name="Cenozoico Pré-Histórico",
        time_span="66 Ma a 10.000 anos",
        range_ma="66 - 0.01",
        icon="🦣",
        color="#38bdf8",
        bg_color="rgba(56, 189, 248, 0.15)",
        description="A Era dos Mamíferos Gigantes e Megafauna fóssil: dentes-de-sabre, mamutes-lanosos, preguiças-gigantes, serpentes colossais e o maior tubarão da história.",
        periods=["Paleógeno", "Neógeno", "Pleistoceno"],
        iconic_creatures=["Titanoboa", "Basilosaurus", "Otodus megalodon", "Purussaurus", "Smilodon", "Mammuthus", "Megatherium"]
    ),
    EraMetadata(
        id="mesozoico",
        name="Mesozoico",
        time_span="252 a 66 Ma",
        range_ma="252 - 66",
        icon="🦖",
        color="#f59e0b",
        bg_color="rgba(245, 158, 11, 0.15)",
        description="A lendária 'Era dos Dinossauros': grandes terópodes, saurópodes titânicos, ceratopsídeos, pterossauros alados e répteis marinhos mosassauros.",
        periods=["Triássico", "Jurássico", "Cretáceo"],
        iconic_creatures=["Tyrannosaurus", "Spinosaurus", "Triceratops", "Velociraptor", "Brachiosaurus", "Quetzalcoatlus", "Mosasaurus"]
    ),
    EraMetadata(
        id="paleozoico",
        name="Paleozoico",
        time_span="541 a 252 Ma",
        range_ma="541 - 252",
        icon="🦐",
        color="#14b8a6",
        bg_color="rgba(20, 184, 166, 0.15)",
        description="A Explosão Cambriana, os primeiros animais com conchas e carapaças, peixes placodermos blindados, libélulas gigantes e os ancestrais sinapsídeos dos mamíferos.",
        periods=["Cambriano", "Devoniano", "Carbonífero", "Permiano"],
        iconic_creatures=["Anomalocaris", "Opabinia", "Dunkleosteus", "Tiktaalik", "Meganeura", "Arthropleura", "Dimetrodon", "Gorgonops"]
    ),
    EraMetadata(
        id="precambriano",
        name="Pré-Cambriano / Ediacarano",
        time_span="635 a 541 Ma",
        range_ma="635 - 541",
        icon="🦠",
        color="#06b6d4",
        bg_color="rgba(6, 182, 212, 0.15)",
        description="A alvorada da vida animal macroscópica na Terra: os primeiros seres multicelulares enigmáticos de corpo mole no leito marinho primitivo.",
        periods=["Ediacarano"],
        iconic_creatures=["Dickinsonia", "Charnia", "Spriggina", "Kimberella"]
    ),
    EraMetadata(
        id="microbiologico",
        name="Vida Microbiológica Universal",
        time_span="3.800 Ma ao Presente",
        range_ma="3800 - 0",
        icon="🔬",
        color="#06b6d4",
        bg_color="rgba(6, 182, 212, 0.15)",
        description="A base universal de toda a árvore da vida: bactérias e cianobactérias arqueanas, protistas ciliados, amebas, foraminíferos de concha mineral, diatomáceas de vidro, megavírus e micro-animais extremófilos (tardígrados).",
        periods=["Arqueano", "Proterozoico", "Paleozoico", "Mesozoico", "Cenozoico", "Holoceno"],
        iconic_creatures=["Milnesium tardigradum", "Cyanobacteria", "Paramecium caudatum", "Amoeba proteus", "Nummulites", "Navicula", "Pithovirus sibericum"]
    )
]


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/api/eras", response_model=List[EraMetadata])
def get_eras():
    """Returns metadata for all eras (contemporary and prehistoric)."""
    return ERAS_DATA


@app.get("/api/specimens", response_model=List[Specimen])
def list_specimens(
    era: Optional[str] = Query(None, description="Filtrar por era (contemporaneo, cenozoico, mesozoico, paleozoico, precambriano)"),
    period: Optional[str] = Query(None, description="Filtrar por período geológico ou Holoceno"),
    diet: Optional[str] = Query(None, description="Filtrar por dieta (carnivoro, herbivoro, piscivoro, etc)"),
    group: Optional[str] = Query(None, description="Filtrar por grupo taxonômico"),
    habitat: Optional[str] = Query(None, description="Filtrar por habitat"),
    skeletal_type: Optional[str] = Query(None, description="Filtrar por vertebrado ou invertebrado"),
    search: Optional[str] = Query(None, description="Termo de busca textual"),
):
    """Returns specimens matching query parameters."""
    return get_all_specimens(
        era=era, period=period, diet=diet, group=group, habitat=habitat,
        skeletal_type=skeletal_type, search=search
    )


@app.get("/api/specimens/{identifier}", response_model=Specimen)
async def get_specimen_detail(identifier: str):
    """Returns full details of a specimen by ID, slug, common name or scientific name."""
    clean_id = identifier.lower().strip().replace(" ", "-")
    spec = get_specimen_by_id(clean_id)
    if not spec:
        spec = get_specimen_by_id(identifier.strip())
        
    if not spec:
        # Automatic live ingestion on demand if not present in SQLite!
        logger.info(f"Specimen '{identifier}' not found in database. Performing automated API ingestion...")
        try:
            ingested = await perform_auto_ingest(identifier)
            if ingested:
                return ingested
        except Exception as e:
            logger.error(f"Auto-ingest on query failed for '{identifier}': {e}")
            
        raise HTTPException(status_code=404, detail=f"Espécime '{identifier}' não encontrado no acervo.")
    
    return spec


async def perform_auto_ingest(taxon_name: str, era_hint: Optional[str] = None) -> Optional[Specimen]:
    """Dynamically ingests any animal species (contemporary or extinct) via curated knowledge + GBIF, Wikipedia, Commons & PBDB."""
    name_clean = taxon_name.strip()
    slug = name_clean.lower().replace(" ", "-")

    # 0. Check pre-curated scientific knowledge engine FIRST (guarantees real biometrics & images)
    known = find_known_taxon(name_clean)
    if known:
        specimen = build_specimen_from_known(known)
        upsert_specimen(specimen)
        return specimen

    # Check local cache
    existing = get_specimen_by_id(slug)
    if existing:
        return existing

    # 1. Query Wikipedia (PT) first to resolve Portuguese vernacular name to formal title & scientific binomial
    wiki_data = await fetch_wikipedia_summary(name_clean)
    wiki_title = wiki_data.get("title", name_clean)
    wiki_extract = wiki_data.get("extract", "")

    # Extract scientific candidate from text (e.g. "(Panthera pardus)")
    scientific_candidate = None
    sc_match = re.search(r'\((?:[a-z]{2}:\s*)?([A-Z][a-z]+ [a-z]+)\)', wiki_extract)
    if sc_match:
        scientific_candidate = sc_match.group(1)

    # 2. Query GBIF Backbone Taxonomy using scientific candidate or cleaned name
    gbif_query = scientific_candidate or wiki_title
    gbif_data = await match_gbif_species(gbif_query)
    if not gbif_data and scientific_candidate:
        gbif_data = await match_gbif_species(name_clean)

    canonical = gbif_data.get("canonical_name", wiki_title) if gbif_data else wiki_title
    scientific = gbif_data.get("scientific_name", scientific_candidate or canonical) if gbif_data else (scientific_candidate or canonical)

    # 3. Query PBDB to see if it's a prehistoric fossil taxon
    pbdb_data = await fetch_taxon_info(scientific_candidate or canonical)

    # 4. Determine Era & Contemporary status with intelligent text keywords
    combined_lower = f"{name_clean} {canonical} {scientific} {wiki_extract}".lower()
    
    is_prehistoric_dino = any(k in combined_lower for k in [
        "dinossauro", "dinosaur", "pterossauro", "pterosaur", "sauropod", "theropod", "ceratops",
        "hadrosaur", "jurássico", "jurassico", "cretáceo", "cretaceo", "triássico", "triassico", "mesozoico", "mesozóico"
    ])
    is_paleozoic = any(k in combined_lower for k in [
        "paleozoico", "paleozóico", "permiano", "carbonífero", "carbonifero", "devoniano", "siluriano",
        "ordoviciano", "cambriano", "trilobita", "trilobite"
    ])
    is_cenozoic_fossil = any(k in combined_lower for k in [
        "pleistoceno", "mioceno", "eoceno", "oligoceno", "paleoceno", "megafauna extinta", "smilodon", "mamute", "mammuthus"
    ])

    if era_hint == "contemporaneo" and not (is_prehistoric_dino or is_paleozoic):
        is_contemporary = True
        era_key = "contemporaneo"
        era_name = "Contemporâneo (Fauna Atual)"
        period_pt = "Holoceno / Atualidade"
        geo_range = "Época Atual (Holoceno - Presente)"
        conservation_status = "Espécie Vivente"
    elif pbdb_data and (pbdb_data.get("max_ma", 0) > 0.01):
        is_contemporary = False
        era_key = pbdb_data.get("era", "mesozoico")
        era_name = pbdb_data.get("era_display", "Mesozoico")
        period_pt = pbdb_data.get("period", "Período Fóssil")
        geo_range = pbdb_data.get("geological_range", "Registro fóssil paleontológico")
        conservation_status = "Extinto no Registro Fóssil"
    elif is_prehistoric_dino:
        is_contemporary = False
        era_key = "mesozoico"
        era_name = "Mesozoico"
        period_pt = "Jurássico / Cretáceo"
        geo_range = "Era Mesozoica (252 a 66 Ma)"
        conservation_status = "Extinto no Registro Fóssil"
    elif is_paleozoic:
        is_contemporary = False
        era_key = "paleozoico"
        era_name = "Paleozoico"
        period_pt = "Paleozoico Superior"
        geo_range = "Era Paleozoica (541 a 252 Ma)"
        conservation_status = "Extinto no Registro Fóssil"
    elif is_cenozoic_fossil:
        is_contemporary = False
        era_key = "cenozoico"
        era_name = "Cenozoico"
        period_pt = "Neógeno / Pleistoceno"
        geo_range = "Fóssil Cenozoico (66 Ma ao Pleistoceno)"
        conservation_status = "Extinto no Registro Fóssil"
    else:
        is_contemporary = True
        era_key = "contemporaneo"
        era_name = "Contemporâneo (Fauna Atual)"
        period_pt = "Holoceno / Atualidade"
        geo_range = "Época Atual (Holoceno - Presente)"
        conservation_status = "Espécie Vivente da Fauna Global"

    # 5. Vertebrate vs Invertebrate & Skeletal Composition
    if gbif_data:
        skeletal_type = gbif_data.get("skeletal_type", "vertebrado")
        skeletal_comp = gbif_data.get("skeletal_composition", "Endoesqueleto Ósseo e Cartilagem")
        cladogram = gbif_data.get("cladogram", [])
    else:
        is_micro = any(k in canonical.lower() for k in ["tardigrad", "bacteri", "cianobact", "ameba", "amoeba", "paramecium", "diatom", "foraminif", "nummulite", "virus", "vírus", "protist"])
        if is_micro:
            skeletal_type = "microbiologico"
            skeletal_comp = "Parede Celular / Membrana Plasmática / Cutícula Acelular"
            cladogram = ["Biota", "Microbiologia", canonical]
        else:
            is_inv = any(k in combined_lower for k in ["invertebrad", "artrópode", "inseto", "aracnídeo", "molusco", "polvo", "caracol", "verme", "cnidário", "água-viva", "crustáceo"])
            skeletal_type = "invertebrado" if is_inv else "vertebrado"
            skeletal_comp = "Exoesqueleto Quitinoso ou Concha Calcária" if is_inv else "Endoesqueleto Ósseo e Cartilagem"
            cladogram = ["Metazoa", "Chordata" if not is_inv else "Invertebrata", canonical]

    # 6. Infer ecology and habitat
    ecology = infer_taxonomy_and_ecology(canonical, pbdb_data, wiki_data, gbif_data)

    # 7. Extract realistic biometrics (Length, Height, Weight, Speed, Bite force)
    len_match = re.search(r'(\d+(?:[.,]\d+)?\s*(?:a\s*\d+(?:[.,]\d+)?)?\s*(?:metros?|m|centímetros?|cm|milímetros?|mm))\b', wiki_extract, re.I)
    wt_match = re.search(r'(\d+(?:[.,]\d+)?\s*(?:a\s*\d+(?:[.,]\d+)?)?\s*(?:quilogramas?|kg|toneladas?|t|gramas?|g))\b', wiki_extract, re.I)
    spd_match = re.search(r'(\d+(?:[.,]\d+)?\s*(?:a\s*\d+(?:[.,]\d+)?)?\s*km/h)\b', wiki_extract, re.I)

    # Compute intelligent physical ranges according to animal group
    defaults = estimate_biometrics_by_group(ecology["group"], ecology["diet"], ecology["habitat"], name_clean)
    spec_length = len_match.group(1) if len_match else defaults["length"]
    spec_weight = wt_match.group(1) if wt_match else defaults["weight"]
    spec_speed = spd_match.group(1) if spd_match else defaults["speed"]
    spec_height = defaults["height"]
    spec_bite = defaults["bite_force"]

    # 8. Fetch multi-perspective images using both scientific and english terms
    search_term = scientific_candidate or canonical
    images = await fetch_multi_perspective_images(search_term, limit=8)
    if not images and search_term != name_clean:
        images = await fetch_multi_perspective_images(name_clean, limit=6)

    # Primary image selection
    primary_image = None
    life_imgs = [img for img in images if img.get("category") == "life_view"]
    if life_imgs:
        primary_image = life_imgs[0]["url"]
    elif images:
        primary_image = images[0]["url"]
    elif wiki_data.get("image_url"):
        primary_image = wiki_data.get("image_url")
        images.append({
            "url": primary_image,
            "caption": f"Representação de {canonical}",
            "type": "living_specimen",
            "category": "life_view",
            "author": "Wikimedia Commons"
        })
    else:
        # High-res SVG group placeholder (never purussaurus!)
        primary_image = f"data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22400%22%20viewBox%3D%220%200%20600%20400%22%3E%3Crect%20fill%3D%22%230d1510%22%20width%3D%22600%22%20height%3D%22400%22%2F%3E%3Ctext%20fill%3D%22%2310b981%22%20font-family%3D%22system-ui%22%20font-size%3D%2264%22%20x%3D%2250%25%22%20y%3D%2242%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3E%F0%9F%A6%AC%3C%2Ftext%3E%3Ctext%20fill%3D%22%23ffffff%22%20font-family%3D%22system-ui%22%20font-weight%3D%22bold%22%20font-size%3D%2222%22%20x%3D%2250%25%22%20y%3D%2262%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3E{name_clean}%3C%2Ftext%3E%3Ctext%20fill%3D%22%2394a3b8%22%20font-family%3D%22system-ui%22%20font-size%3D%2214%22%20x%3D%2250%25%22%20y%3D%2272%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3E{scientific}%3C%2Ftext%3E%3C%2Fsvg%3E"

    gallery_items = [
        GalleryItem(
            url=img["url"],
            caption=img.get("caption", f"Representação de {canonical}"),
            type=img.get("type", "living_specimen"),
            category=img.get("category", "life_view"),
            author=img.get("author", "Wikimedia Commons")
        )
        for img in images
    ]

    bio_text = wiki_data.get("extract") or f"{canonical} ({scientific}) é um organismo da história biológica do planeta Terra."

    curiosities = [
        f"Classificação Estrutural: {skeletal_type.capitalize()} ({skeletal_comp}).",
        f"Pertence ao grupo taxonômico {ecology['group_display']} com hábito alimentar {ecology['diet_display']}.",
        f"Consome dados científicos integrados da GBIF, PBDB e acervos abertos de anatomia.",
        f"Status e Época Geológica: {era_name} ({period_pt})."
    ]

    expert_data = ExpertData(
        cladogram=cladogram,
        osteology=f"Organização esquelética do tipo {skeletal_type.upper()}: {skeletal_comp}. Morfologia adaptada ao nicho de {ecology['diet_display']} em habitat {ecology['habitat']}.",
        biomechanics=f"Cinemática e sustentação física adaptadas ao meio {ecology['habitat']}, com suporte mecânico por {skeletal_comp.lower()}.",
        histology=f"Estrutura tecidual com densidade celular típica de organismos do grupo {ecology['group_display']}."
    )

    specimen = Specimen(
        id=slug,
        name=wiki_title,
        genus=gbif_data.get("genus", canonical) if gbif_data else canonical,
        scientific_name=scientific,
        era=era_key,
        era_display=era_name,
        period=period_pt,
        epoch=period_pt,
        geological_range=geo_range,
        group=ecology["group"],
        group_display=ecology["group_display"],
        diet=ecology["diet"],
        diet_display=ecology["diet_display"],
        habitat=ecology["habitat"],
        skeletal_type=skeletal_type,
        skeletal_composition=skeletal_comp,
        is_contemporary=is_contemporary,
        conservation_status=conservation_status,
        length=spec_length,
        height=spec_height,
        weight=spec_weight,
        speed=spec_speed,
        bite_force=spec_bite,
        image_url=primary_image,
        image_caption=f"Representação de {canonical}",
        gallery=gallery_items,
        etymology=f"Táxon descrito cientificamente como {scientific}.",
        bio=bio_text,
        curiosities=curiosities,
        expert=expert_data,
        occurrences_count=18,
        fossil_locations="Distribuição biogeográfica global" if is_contemporary else f"Estratos fósseis do período {period_pt}",
        is_custom_ingested=True
    )

    upsert_specimen(specimen)
    return specimen


@app.post("/api/ingest", response_model=IngestResponse)
async def ingest_specimen_endpoint(req: IngestRequest):
    """Dynamic ingestion endpoint taking any animal name (common in Portuguese or scientific)."""
    name = req.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Nome do espécime não pode ser vazio.")
    
    try:
        specimen = await perform_auto_ingest(name, req.era_hint)
        if not specimen:
            return IngestResponse(
                success=False,
                message=f"Não foi possível localizar dados científicos suficientes para '{name}'.",
                specimen=None
            )
        return IngestResponse(
            success=True,
            message=f"Espécime '{specimen.name}' ({specimen.skeletal_type.capitalize()}) catalogado com sucesso na Super Wiki!",
            specimen=specimen
        )
    except Exception as e:
        logger.error(f"Error during ingestion of '{name}': {e}", exc_info=True)
        return IngestResponse(
            success=False,
            message=f"Erro interno durante a ingestão do espécime: {str(e)}",
            specimen=None
        )


@app.get("/api/discover")
def discover_specimens(era: Optional[str] = None):
    """Returns random discovery suggestions from any era or specific era."""
    all_specs = get_all_specimens(era=era if era != "all" else None)
    if not all_specs:
        all_specs = get_all_specimens()
    
    selected = random.sample(all_specs, min(len(all_specs), 4))
    return selected


@app.get("/api/occurrences/{taxon_name}", response_model=List[Occurrence])
async def get_occurrences(taxon_name: str, limit: int = 40):
    """Fetches real georeferenced coordinates from GBIF (living species), PBDB (fossil species) or curated knowledge."""
    clean_name = taxon_name.strip()
    
    # 0. Check pre-curated high-accuracy coordinates
    curated = get_curated_occurrences(clean_name)
    if curated:
        return curated
    
    # Check if specimen exists in database to check its name / scientific_name / id
    spec = get_specimen_by_id(clean_name.lower().replace(" ", "-")) or get_specimen_by_id(clean_name)
    if spec:
        for candidate in [spec.id, spec.name, spec.scientific_name, spec.genus]:
            if candidate:
                c = get_curated_occurrences(candidate)
                if c:
                    return c

    # 1. Check if specimen is contemporary
    if spec and spec.is_contemporary:
        # Query GBIF for live coordinates
        query_target = spec.scientific_name or spec.genus or clean_name
        gbif_match = await match_gbif_species(query_target)
        if gbif_match and gbif_match.get("usage_key"):
            occs = await fetch_gbif_occurrences(gbif_match["usage_key"], limit=limit)
            if occs:
                return occs
    
    # 2. Fallback / Fossil: Query PBDB
    query_target = (spec.scientific_name or spec.genus or clean_name) if spec else clean_name
    occs = await fetch_taxon_occurrences(query_target, limit=limit)
    if occs:
        return occs

    # 3. Try GBIF as fallback even for fossils
    gbif_match = await match_gbif_species(clean_name)
    if gbif_match and gbif_match.get("usage_key"):
        occs = await fetch_gbif_occurrences(gbif_match["usage_key"], limit=limit)
        if occs:
            return occs

    return []


@app.get("/api/proxy-image")
async def proxy_image(url: str = Query(..., description="URL direta da imagem a ser transmitida")):
    """Caches and streams remote Wikimedia images safely bypassing browser adblockers / referrers."""
    headers = {"User-Agent": USER_AGENT}
    try:
        async with httpx.AsyncClient(headers=headers, timeout=12.0) as client:
            resp = await client.get(url)
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail="Falha ao carregar imagem remota.")
            
            content_type = resp.headers.get("content-type", "image/jpeg")
            return Response(
                content=resp.content,
                media_type=content_type,
                headers={"Cache-Control": "public, max-age=604800"}
            )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Erro ao transmitir imagem: {e}")


@app.get("/api/stats")
def stats_endpoint():
    """Returns database statistics."""
    return get_stats()


# Mount static files at root
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

    @app.get("/style.css")
    def serve_style():
        return FileResponse(os.path.join(STATIC_DIR, "style.css"), media_type="text/css")

    @app.get("/app.js")
    def serve_app_js():
        return FileResponse(os.path.join(STATIC_DIR, "app.js"), media_type="application/javascript")

    @app.get("/favicon.ico", include_in_schema=False)
    def serve_favicon():
        return Response(
            content='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌍</text></svg>',
            media_type="image/svg+xml"
        )

    @app.get("/")
    def serve_index():
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))
