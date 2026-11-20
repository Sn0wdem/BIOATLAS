import sqlite3
import json
import os
from typing import List, Dict, Any, Optional
from app.models import Specimen, GalleryItem, ExpertData

DB_PATH = os.path.join(os.path.dirname(__file__), "mesozoico.db")


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS specimens (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            genus TEXT NOT NULL,
            scientific_name TEXT,
            era TEXT NOT NULL,
            era_display TEXT NOT NULL,
            period TEXT NOT NULL,
            epoch TEXT,
            geological_range TEXT NOT NULL,
            group_type TEXT NOT NULL,
            group_display TEXT NOT NULL,
            diet TEXT NOT NULL,
            diet_display TEXT NOT NULL,
            habitat TEXT NOT NULL,
            length TEXT,
            height TEXT,
            weight TEXT,
            speed TEXT,
            bite_force TEXT,
            image_url TEXT NOT NULL,
            image_caption TEXT,
            gallery_json TEXT NOT NULL,
            etymology TEXT,
            bio TEXT,
            curiosities_json TEXT NOT NULL,
            expert_json TEXT NOT NULL,
            occurrences_count INTEGER DEFAULT 0,
            fossil_locations TEXT,
            is_custom_ingested INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_era ON specimens(era)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_period ON specimens(period)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_diet ON specimens(diet)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_group ON specimens(group_type)")
    conn.commit()
    conn.close()


def row_to_specimen(row: sqlite3.Row) -> Specimen:
    gallery_raw = json.loads(row["gallery_json"] or "[]")
    gallery = [GalleryItem(**item) if isinstance(item, dict) else GalleryItem(url=item) for item in gallery_raw]
    
    curiosities = json.loads(row["curiosities_json"] or "[]")
    expert_dict = json.loads(row["expert_json"] or "{}")
    expert = ExpertData(**expert_dict)

    return Specimen(
        id=row["id"],
        name=row["name"],
        genus=row["genus"],
        scientific_name=row["scientific_name"],
        era=row["era"],
        era_display=row["era_display"],
        period=row["period"],
        epoch=row["epoch"],
        geological_range=row["geological_range"],
        group=row["group_type"],
        group_display=row["group_display"],
        diet=row["diet"],
        diet_display=row["diet_display"],
        habitat=row["habitat"],
        length=row["length"] or "Desconhecido",
        height=row["height"] or "Desconhecido",
        weight=row["weight"] or "Desconhecido",
        speed=row["speed"] or "Desconhecido",
        bite_force=row["bite_force"] or "Desconhecido",
        image_url=row["image_url"],
        image_caption=row["image_caption"] or "Representação paleoartística em vida",
        gallery=gallery,
        etymology=row["etymology"] or "",
        bio=row["bio"] or "",
        curiosities=curiosities,
        expert=expert,
        occurrences_count=row["occurrences_count"] or 0,
        fossil_locations=row["fossil_locations"] or "",
        is_custom_ingested=bool(row["is_custom_ingested"])
    )


def get_all_specimens(
    era: Optional[str] = None,
    period: Optional[str] = None,
    diet: Optional[str] = None,
    group: Optional[str] = None,
    habitat: Optional[str] = None,
    search: Optional[str] = None
) -> List[Specimen]:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM specimens WHERE 1=1"
    params = []

    if era and era != "all":
        query += " AND (LOWER(era) = LOWER(?) OR LOWER(era_display) = LOWER(?))"
        params.extend([era, era])

    if period and period != "all":
        query += " AND (LOWER(period) LIKE LOWER(?) OR LOWER(epoch) LIKE LOWER(?))"
        params.extend([f"%{period}%", f"%{period}%"])

    if diet and diet != "all":
        query += " AND LOWER(diet) = LOWER(?)"
        params.append(diet)

    if group and group != "all":
        query += " AND (LOWER(group_type) = LOWER(?) OR LOWER(group_display) LIKE LOWER(?))"
        params.extend([group, f"%{group}%"])

    if habitat and habitat != "all":
        query += " AND LOWER(habitat) = LOWER(?)"
        params.append(habitat)

    if search and search.strip():
        s = f"%{search.strip().lower()}%"
        query += " AND (LOWER(name) LIKE ? OR LOWER(genus) LIKE ? OR LOWER(scientific_name) LIKE ? OR LOWER(bio) LIKE ?)"
        params.extend([s, s, s, s])

    query += " ORDER BY is_custom_ingested DESC, name ASC"
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return [row_to_specimen(r) for r in rows]


def get_specimen_by_id(specimen_id: str) -> Optional[Specimen]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM specimens WHERE LOWER(id) = LOWER(?) OR LOWER(name) = LOWER(?) OR LOWER(genus) = LOWER(?) LIMIT 1", 
                   (specimen_id, specimen_id, specimen_id))
    row = cursor.fetchone()
    conn.close()
    if row:
        return row_to_specimen(row)
    return None


def upsert_specimen(specimen: Specimen) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    gallery_json = json.dumps([g.model_dump() for g in specimen.gallery], ensure_ascii=False)
    curiosities_json = json.dumps(specimen.curiosities, ensure_ascii=False)
    expert_json = json.dumps(specimen.expert.model_dump(), ensure_ascii=False)

    cursor.execute("""
        INSERT INTO specimens (
            id, name, genus, scientific_name, era, era_display, period, epoch,
            geological_range, group_type, group_display, diet, diet_display, habitat,
            length, height, weight, speed, bite_force, image_url, image_caption,
            gallery_json, etymology, bio, curiosities_json, expert_json,
            occurrences_count, fossil_locations, is_custom_ingested
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?
        ) ON CONFLICT(id) DO UPDATE SET
            name=excluded.name,
            genus=excluded.genus,
            scientific_name=excluded.scientific_name,
            era=excluded.era,
            era_display=excluded.era_display,
            period=excluded.period,
            epoch=excluded.epoch,
            geological_range=excluded.geological_range,
            group_type=excluded.group_type,
            group_display=excluded.group_display,
            diet=excluded.diet,
            diet_display=excluded.diet_display,
            habitat=excluded.habitat,
            length=excluded.length,
            height=excluded.height,
            weight=excluded.weight,
            speed=excluded.speed,
            bite_force=excluded.bite_force,
            image_url=excluded.image_url,
            image_caption=excluded.image_caption,
            gallery_json=excluded.gallery_json,
            etymology=excluded.etymology,
            bio=excluded.bio,
            curiosities_json=excluded.curiosities_json,
            expert_json=excluded.expert_json,
            occurrences_count=excluded.occurrences_count,
            fossil_locations=excluded.fossil_locations,
            is_custom_ingested=excluded.is_custom_ingested
    """, (
        specimen.id, specimen.name, specimen.genus, specimen.scientific_name,
        specimen.era, specimen.era_display, specimen.period, specimen.epoch,
        specimen.geological_range, specimen.group, specimen.group_display,
        specimen.diet, specimen.diet_display, specimen.habitat,
        specimen.length, specimen.height, specimen.weight, specimen.speed, specimen.bite_force,
        specimen.image_url, specimen.image_caption,
        gallery_json, specimen.etymology, specimen.bio, curiosities_json, expert_json,
        specimen.occurrences_count, specimen.fossil_locations, 1 if specimen.is_custom_ingested else 0
    ))
    conn.commit()
    conn.close()
    return True


def get_stats() -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM specimens")
    total = cursor.fetchone()[0]
    
    cursor.execute("SELECT era, COUNT(*) FROM specimens GROUP BY era")
    era_counts = {r[0]: r[1] for r in cursor.fetchall()}
    
    cursor.execute("SELECT diet, COUNT(*) FROM specimens GROUP BY diet")
    diet_counts = {r[0]: r[1] for r in cursor.fetchall()}
    
    cursor.execute("SELECT group_type, COUNT(*) FROM specimens GROUP BY group_type")
    group_counts = {r[0]: r[1] for r in cursor.fetchall()}

    conn.close()
    return {
        "total_specimens": total,
        "by_era": era_counts,
        "by_diet": diet_counts,
        "by_group": group_counts
    }
