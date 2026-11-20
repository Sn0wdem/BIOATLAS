from fastapi import FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
import httpx
import re
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
from app.services.wiki_service import (
    fetch_wikipedia_summary, fetch_commons_life_restorations, infer_taxonomy_and_ecology, USER_AGENT
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mesozoico_api")

app = FastAPI(
    title="Enciclopédia Paleontológica Global da Vida na Terra",
    description="API com FastAPI e SQLite para exploração e ingestão de espécimes fósseis de todas as eras geológicas (Pré-Cambriano, Paleozoico, Mesozoico e Cenozoico).",
    version="2.0.0"
)

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure DB is initialized on startup
@app.on_event("startup")
async def startup_event():
    init_db()
    # Check if DB has specimens, if not seed it
    specs = get_all_specimens()
    if len(specs) < 10:
        seed_database()


# Geological eras metadata
ERAS_DATA = [
    EraMetadata(
        id="precambriano",
        name="Pré-Cambriano / Ediacarano",
        time_span="635 a 541 Ma",
        range_ma="635 - 541",
        icon="🦠",
        color="#06b6d4",
        bg_color="rgba(6, 182, 212, 0.15)",
        description="A alvorada da vida multicelular macroscópica na Terra: organismos enigmáticos de corpo mole e simetrias fascinantes nos mares primitivos.",
        periods=["Ediacarano"],
        iconic_creatures=["Dickinsonia", "Charnia", "Spriggina", "Kimberella"]
    ),
    EraMetadata(
        id="paleozoico",
        name="Paleozoico",
        time_span="541 a 252 Ma",
        range_ma="541 - 252",
        icon="🦐",
        color="#10b981",
        bg_color="rgba(16, 185, 129, 0.15)",
        description="A Explosão Cambriana, o surgimento dos primeiros vertebrados, a colonização da terra firme, artrópodes gigantes e os ancestrais sinapsídeos dos mamíferos.",
        periods=["Cambriano", "Ordoviciano", "Siluriano", "Devoniano", "Carbonífero", "Permiano"],
        iconic_creatures=["Anomalocaris", "Opabinia", "Dunkleosteus", "Tiktaalik", "Meganeura", "Arthropleura", "Dimetrodon", "Gorgonops"]
    ),
    EraMetadata(
        id="mesozoico",
        name="Mesozoico",
        time_span="252 a 66 Ma",
        range_ma="252 - 66",
        icon="🦖",
        color="#f59e0b",
        bg_color="rgba(245, 158, 11, 0.15)",
        description="A lendária 'Era dos Dinossauros': grandes répteis terrestres, répteis marinhos colossais nos oceanos e pterossauros gigantes dominando os céus.",
        periods=["Triássico", "Jurássico", "Cretáceo"],
        iconic_creatures=["Tyrannosaurus", "Spinosaurus", "Triceratops", "Velociraptor", "Brachiosaurus", "Quetzalcoatlus", "Mosasaurus"]
    ),
    EraMetadata(
        id="cenozoico",
        name="Cenozoico",
        time_span="66 Ma ao Presente",
        range_ma="66 - 0",
        icon="🦣",
        color="#38bdf8",
        bg_color="rgba(56, 189, 248, 0.15)",
        description="A 'Era dos Mamíferos': a explosão da megafauna pré-histórica, mamutes-lanosos, dentes-de-sabre, serpentes titânicas, caimões amazônicos e preguiças gigantes.",
        periods=["Paleógeno", "Neógeno", "Quaternário"],
        iconic_creatures=["Titanoboa", "Basilosaurus", "Purussaurus", "Otodus megalodon", "Smilodon", "Mammuthus", "Megatherium"]
    ),
]


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/api/eras", response_model=List[EraMetadata])
def get_eras():
    """Returns metadata for all 4 geological eras."""
    return ERAS_DATA


@app.get("/api/specimens", response_model=List[Specimen])
def list_specimens(
    era: Optional[str] = Query(None, description="Filtrar por era (precambriano, paleozoico, mesozoico, cenozoico)"),
    period: Optional[str] = Query(None, description="Filtrar por período geológico"),
    diet: Optional[str] = Query(None, description="Filtrar por dieta (carnivoro, herbivoro, piscivoro, etc)"),
    group: Optional[str] = Query(None, description="Filtrar por grupo taxonômico / habitat"),
    habitat: Optional[str] = Query(None, description="Filtrar por habitat"),
    search: Optional[str] = Query(None, description="Termo de busca textual"),
):
    """Returns specimens matching query parameters."""
    return get_all_specimens(
        era=era, period=period, diet=diet, group=group, habitat=habitat, search=search
    )


@app.get("/api/specimens/{identifier}", response_model=Specimen)
async def get_specimen_detail(identifier: str):
    """Returns full details of a specimen by ID, slug or genus name."""
    clean_id = identifier.lower().strip().replace(" ", "-")
    spec = get_specimen_by_id(clean_id)
    if not spec:
        spec = get_specimen_by_id(identifier.strip())
        
    if not spec:
        # If not found locally, attempt on-the-fly auto-ingestion
        logger.info(f"Specimen '{identifier}' not found in database. Attempting auto-ingestion...")
        try:
            ingested = await perform_auto_ingest(identifier)
            if ingested:
                return ingested
        except Exception as e:
            logger.error(f"Auto-ingest on query failed for '{identifier}': {e}")
            
        raise HTTPException(status_code=404, detail=f"Espécime fóssil '{identifier}' não encontrado no catálogo.")
    
    return spec


async def perform_auto_ingest(taxon_name: str, era_hint: Optional[str] = None) -> Optional[Specimen]:
    """Ingests any genus from PBDB and Wikipedia Commons into the database."""
    name_clean = taxon_name.strip()
    slug = name_clean.lower().replace(" ", "-")

    # Check if already present
    existing = get_specimen_by_id(slug)
    if existing:
        return existing

    # 1. Fetch PBDB data
    pbdb_data = await fetch_taxon_info(name_clean)
    
    # 2. Fetch Wikipedia Summary
    wiki_data = await fetch_wikipedia_summary(name_clean)

    # 3. Fetch Commons Life Restorations
    images = await fetch_commons_life_restorations(name_clean, limit=8)

    # Determine primary image URL
    primary_image = None
    if images:
        primary_image = images[0]["url"]
    elif wiki_data.get("image_url"):
        primary_image = wiki_data.get("image_url")
        images.append({
            "url": primary_image,
            "caption": f"Representação de {name_clean}",
            "type": "life_restoration",
            "author": "Wikimedia Commons"
        })
    else:
        # High quality generic paleo placeholder
        primary_image = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Tyrannosaurus_rex_by_mariolanzas.jpg/960px-Tyrannosaurus_rex_by_mariolanzas.jpg"

    # Infer era and stratigraphy
    if pbdb_data:
        era_key = pbdb_data.get("era", "mesozoico")
        era_name = pbdb_data.get("era_display", "Mesozoico")
        period_pt = pbdb_data.get("period", "Período Geológico Fóssil")
        geo_range = pbdb_data.get("geological_range", "Registro geológico fóssil")
    else:
        era_key, era_name = infer_era_from_ma(None, None, era_hint or "")
        period_pt = era_hint.capitalize() if era_hint else "Período Pré-Histórico"
        geo_range = "Registro fóssil paleontológico"

    # Infer ecology
    ecology = infer_taxonomy_and_ecology(name_clean, pbdb_data, wiki_data)

    # Format gallery
    gallery_items = [
        GalleryItem(
            url=img["url"],
            caption=img.get("caption", f"Representação em vida de {name_clean}"),
            type=img.get("type", "life_restoration"),
            author=img.get("author", "Wikimedia Commons")
        )
        for img in images
    ]

    # Generate expert details
    cladogram = [
        "Metazoa",
        pbdb_data.get("phylum") or "Chordata",
        pbdb_data.get("class_name") or ecology["group_display"],
        pbdb_data.get("order_name") or "Ordem fóssil extinta",
        pbdb_data.get("family_name") or f"{name_clean}idae",
        name_clean
    ]

    bio_text = wiki_data.get("extract") or f"{name_clean} é um gênero extinto do registro fóssil da Era {era_name}."
    
    curiosities = [
        f"Gênero fóssil identificado no registro estratigráfico como habitante da Era {era_name}.",
        f"Classificado no grupo {ecology['group_display']} com adaptação alimentar do tipo {ecology['diet_display']}.",
        f"Consome dados científicos integrados da Paleobiology Database (PBDB) e acervos abertos de paleoarte.",
        f"Apresenta distribuição fóssil catalogada em camadas sedimentares globais do período {period_pt}."
    ]

    expert_data = ExpertData(
        cladogram=cladogram,
        osteology=f"Morfologia esquelética adaptada ao nicho de {ecology['diet_display']} em ambiente {ecology['habitat']}. Crânio e apêndices exibem sinapomorfias diagnósticas de {ecology['group_display']}.",
        biomechanics=f"Biomecânica locomotora adaptada para movimentação em substrato {ecology['habitat']}, com cinemática compatível com seu porte anatômico.",
        histology=f"Osso laminar com taxas de aposição perióstea e linhas de crescimento arrestado características de vertebrados do período {period_pt}."
    )

    specimen = Specimen(
        id=slug,
        name=name_clean,
        genus=name_clean,
        scientific_name=f"{name_clean} sp.",
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
        length="Estimativa anatômica em estudo",
        height="Estimativa anatômica em estudo",
        weight="Estimativa biomecânica em estudo",
        speed="Estimativa locomotora em estudo",
        bite_force="Estimativa de força em estudo",
        image_url=primary_image,
        image_caption=f"Representação em vida de {name_clean}",
        gallery=gallery_items,
        etymology=f"Gênero científico descrito a partir de fósseis do período {period_pt}.",
        bio=bio_text,
        curiosities=curiosities,
        expert=expert_data,
        occurrences_count=10,
        fossil_locations=f"Camadas fossilíferas globais do período {period_pt}",
        is_custom_ingested=True
    )

    upsert_specimen(specimen)
    return specimen


@app.post("/api/ingest", response_model=IngestResponse)
async def ingest_specimen_endpoint(req: IngestRequest):
    """Ingests any specimen by name dynamically into the database."""
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
            message=f"Espécime '{specimen.name}' catalogado com sucesso no acervo da Era {specimen.era_display}!",
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
    """Fetches real georeferenced coordinates from PBDB for Leaflet mapping."""
    clean_name = taxon_name.strip()
    occs = await fetch_taxon_occurrences(clean_name, limit=limit)
    return occs


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
