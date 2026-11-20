from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class GalleryItem(BaseModel):
    url: str
    caption: str = "Representação paleoartística em vida"
    type: str = "life_restoration"  # life_restoration, reconstruction, skeletal, fossil
    author: Optional[str] = "Acervo Científico / Wikimedia Commons"


class ExpertData(BaseModel):
    cladogram: List[str] = Field(default_factory=list)
    osteology: str = ""
    biomechanics: str = ""
    histology: str = ""


class Specimen(BaseModel):
    id: str
    name: str
    genus: str
    scientific_name: Optional[str] = None
    era: str  # "precambriano", "paleozoico", "mesozoico", "cenozoico"
    era_display: str
    period: str
    epoch: Optional[str] = ""
    geological_range: str
    group: str
    group_display: str
    diet: str
    diet_display: str
    habitat: str = "terrestre"
    length: str = "Desconhecido"
    height: str = "Desconhecido"
    weight: str = "Desconhecido"
    speed: str = "Desconhecido"
    bite_force: str = "Desconhecido"
    image_url: str
    image_caption: str = "Representação paleoartística em vida"
    gallery: List[GalleryItem] = Field(default_factory=list)
    etymology: str = ""
    bio: str = ""
    curiosities: List[str] = Field(default_factory=list)
    expert: ExpertData = Field(default_factory=ExpertData)
    occurrences_count: int = 0
    fossil_locations: str = ""
    is_custom_ingested: bool = False


class SpecimenSummary(BaseModel):
    id: str
    name: str
    genus: str
    era: str
    era_display: str
    period: str
    geological_range: str
    group: str
    group_display: str
    diet: str
    diet_display: str
    length: str
    weight: str
    image_url: str
    image_caption: str
    curiosities_count: int = 0


class IngestRequest(BaseModel):
    name: str
    era_hint: Optional[str] = None


class IngestResponse(BaseModel):
    success: bool
    message: str
    specimen: Optional[Specimen] = None


class EraMetadata(BaseModel):
    id: str
    name: str
    time_span: str
    range_ma: str
    icon: str
    color: str
    bg_color: str
    description: str
    periods: List[str]
    iconic_creatures: List[str]


class Occurrence(BaseModel):
    lat: float
    lng: float
    country: Optional[str] = "Não especificado"
    formation: Optional[str] = "Não especificada"
    early_age: Optional[float] = None
    late_age: Optional[float] = None
    collection_name: Optional[str] = None
