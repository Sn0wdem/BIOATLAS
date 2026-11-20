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
    if len(specs) < 15:
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
    """Dynamically ingests any animal species (contemporary or extinct) via GBIF, Wikipedia, Commons & PBDB."""
    name_clean = taxon_name.strip()
    slug = name_clean.lower().replace(" ", "-")

    # Check local cache first
    existing = get_specimen_by_id(slug)
    if existing:
        return existing

    # 1. Query GBIF Backbone Taxonomy for global classification
    gbif_data = await match_gbif_species(name_clean)
    canonical = gbif_data.get("canonical_name", name_clean) if gbif_data else name_clean
    scientific = gbif_data.get("scientific_name", f"{name_clean}") if gbif_data else name_clean

    # 2. Query Wikipedia (PT/EN) for Portuguese summary & lead image
    wiki_data = await fetch_wikipedia_summary(canonical)

    # 3. Query PBDB to see if it's a prehistoric fossil taxon
    pbdb_data = await fetch_taxon_info(canonical)

    # 4. Determine Era & Contemporary status
    is_contemporary = False
    conservation_status = "Fóssil Extinto"

    if era_hint == "contemporaneo":
        is_contemporary = True
        era_key = "contemporaneo"
        era_name = "Contemporâneo (Fauna Atual)"
        period_pt = "Holoceno / Atualidade"
        geo_range = "Época Atual (Holoceno - Presente)"
        conservation_status = "Espécie Vivente"
    elif pbdb_data and (pbdb_data.get("max_ma", 0) > 0.01):
        # Definitely a fossil taxon
        era_key = pbdb_data.get("era", "mesozoico")
        era_name = pbdb_data.get("era_display", "Mesozoico")
        period_pt = pbdb_data.get("period", "Período Fóssil")
        geo_range = pbdb_data.get("geological_range", "Registro fóssil paleontológico")
        conservation_status = "Extinto no Registro Fóssil"
    else:
        # If PBDB didn't match as a fossil, check if it's contemporary fauna
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
        skeletal_type = "vertebrado"
        skeletal_comp = "Endoesqueleto Ósseo e Cartilagem"
        cladogram = ["Metazoa", "Chordata", "Vertebrata", canonical]

    # 6. Infer ecology and habitat
    ecology = infer_taxonomy_and_ecology(canonical, pbdb_data, wiki_data, gbif_data)

    # 7. Fetch multi-perspective images (Living individual + Bones/Skeleton/Cartilage + Anatomy)
    images = await fetch_multi_perspective_images(canonical, limit=10)

    # Determine primary lead image
    primary_image = None
    # Prefer living view for main card
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
        primary_image = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Purussaurus_brasiliensis_reconstruction.png/960px-Purussaurus_brasiliensis_reconstruction.png"

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

    bio_text = wiki_data.get("extract") or f"{canonical} ({scientific}) é um espécime zoológico da biodiversidade da Terra."
    
    curiosities = [
        f"Classificação Estrutural: {skeletal_type.capitalize()} ({skeletal_comp}).",
        f"Pertence ao grupo taxonômico {ecology['group_display']} com hábito alimentar {ecology['diet_display']}.",
        f"Consome dados científicos abertos integrados da GBIF, PBDB e acervos mundiais de anatomia.",
        f"Status e Época: {era_name} ({period_pt})."
    ]

    expert_data = ExpertData(
        cladogram=cladogram,
        osteology=f"Organização esquelética do tipo {skeletal_type.upper()}: {skeletal_comp}. Morfologia adaptada ao nicho de {ecology['diet_display']} em habitat {ecology['habitat']}.",
        biomechanics=f"Cinemática e biofísica de locomoção adaptadas ao meio {ecology['habitat']}, com sustentação mecânica proporcionada por {skeletal_comp.lower()}.",
        histology=f"Estrutura tecidual com densidade celular e matriz extracelular típica de espécimes da classe {gbif_data.get('class_name', ecology['group_display']) if gbif_data else ecology['group_display']}."
    )

    specimen = Specimen(
        id=slug,
        name=wiki_data.get("title", canonical),
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
        length="Estimativa anatômica em estudo",
        height="Estimativa anatômica em estudo",
        weight="Estimativa biomecânica em estudo",
        speed="Estimativa locomotora em estudo",
        bite_force="Estimativa de força em estudo",
        image_url=primary_image,
        image_caption=f"Representação de {canonical}",
        gallery=gallery_items,
        etymology=f"Táxon descrito cientificamente na classe {gbif_data.get('class_name', '') if gbif_data else ''}.",
        bio=bio_text,
        curiosities=curiosities,
        expert=expert_data,
        occurrences_count=15,
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
    """Fetches real georeferenced coordinates from GBIF (living species) or PBDB (fossil species)."""
    clean_name = taxon_name.strip()
    
    # Check if specimen is contemporary
    spec = get_specimen_by_id(clean_name.lower().replace(" ", "-")) or get_specimen_by_id(clean_name)
    
    if spec and spec.is_contemporary:
        # Query GBIF for live coordinates
        gbif_match = await match_gbif_species(clean_name)
        if gbif_match and gbif_match.get("usage_key"):
            occs = await fetch_gbif_occurrences(gbif_match["usage_key"], limit=limit)
            if occs:
                return occs
    
    # Fallback / Fossil: Query PBDB
    occs = await fetch_taxon_occurrences(clean_name, limit=limit)
    if not occs:
        # Try GBIF as fallback even for fossils
        gbif_match = await match_gbif_species(clean_name)
        if gbif_match and gbif_match.get("usage_key"):
            occs = await fetch_gbif_occurrences(gbif_match["usage_key"], limit=limit)

    return occs or []


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

    @app.get("/")
    def serve_index():
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))
