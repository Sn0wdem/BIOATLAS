import re
import unicodedata
from typing import Dict, Any, List, Optional
from app.models import Specimen, GalleryItem, ExpertData, Occurrence

def normalize_text(text: str) -> str:
    """Removes accents, punctuation and standardizes to lowercase."""
    if not text:
        return ""
    nfd = unicodedata.normalize('NFD', text.strip())
    without_accents = ''.join(c for c in nfd if unicodedata.category(c) != 'Mn')
    clean = re.sub(r'[^a-zA-Z0-9\s-]', '', without_accents)
    return clean.lower().strip()


# ============================================================================
# ACERVO CIENTÍFICO EMBUTIDO: ANIMAIS MAIS PESQUISADOS DE TODAS AS ERAS
# ============================================================================

POPULAR_TAXA: List[Dict[str, Any]] = [
    {
        "id": "leao",
        "name": "Leão",
        "aliases": [
            "leao",
            "leão",
            "leoa",
            "lion",
            "panthera leo",
            "rei da selva"
        ],
        "genus": "Panthera",
        "scientific_name": "Panthera leo",
        "era": "contemporaneo",
        "era_display": "Contemporâneo (Fauna Atual)",
        "period": "Holoceno / Atualidade",
        "epoch": "Holoceno",
        "geological_range": "300.000 anos ao Presente (Pleistoceno Superior ao Holoceno)",
        "group": "mamifero-megafauna",
        "group_display": "Mamífero Carnívoro (Felídeo)",
        "diet": "carnivoro",
        "diet_display": "Hipercarnívoro Ápice",
        "habitat": "terrestre",
        "skeletal_type": "vertebrado",
        "skeletal_composition": "Endoesqueleto Ósseo Articulado e Cartilagem Hialina",
        "is_contemporary": True,
        "conservation_status": "Espécie Vivente (Vulnerável - IUCN)",
        "length": "1.8 – 2.5 m (corpo) + 1.0 m (cauda)",
        "height": "1.2 m (altura na cernelha)",
        "weight": "190 – 260 kg (machos) / 130 – 180 kg (fêmeas)",
        "speed": "80 km/h (em surtos de ataque de curta distância)",
        "bite_force": "4.500 N (caninos de até 8 cm de comprimento)",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/960px-Lion_waiting_in_Namibia.jpg",
        "image_caption": "Leão-africano macho adulto (Panthera leo) em savana na Namíbia",
        "gallery": [
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/960px-Lion_waiting_in_Namibia.jpg",
                "caption": "[🌿 Indivíduo em Vida] Leão macho adulto em seu bioma natural",
                "type": "living_specimen",
                "category": "life_view",
                "author": "Wikimedia Commons"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Lion_skeleton.jpg/960px-Lion_skeleton.jpg",
                "caption": "[🦴 Esqueleto / Ossos] Esqueleto completo de Panthera leo montado em museu",
                "type": "skeleton",
                "category": "skeletal_view",
                "author": "Muséum National d'Histoire Naturelle"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Panthera_leo_skull_anterior.jpg/960px-Panthera_leo_skull_anterior.jpg",
                "caption": "[🦴 Crânio & Dentição] Crânio de leão destacando crista sagital e caninos",
                "type": "skull",
                "category": "skeletal_view",
                "author": "Wikimedia Commons"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Lioness_Etosha_2012.jpg/960px-Lioness_Etosha_2012.jpg",
                "caption": "[🌿 Em Vida] Leoa em caçada cooperativa no Parque Nacional de Etosha",
                "type": "living_specimen",
                "category": "life_view",
                "author": "Wikimedia Commons"
            }
        ],
        "etymology": "Do latim leo, oriundo do grego antigo λέων (léōn). O termo 'Panthera' deriva do grego clássico πάνθηρ.",
        "bio": "O leão (Panthera leo) é a segunda maior espécie de felídeo vivente, superado apenas pelo tigre. Diferencia-se de todos os outros felinos pela sua organização social em alcateias ou coalizões ('prides'), formadas predominantemente por fêmeas aparentadas, seus filhotes e uma coalizão de machos reprodutores que defendem o território. Os machos adultos possuem uma juba densa e escura que atua como sinal visual de maturidade e proteção cervical durante combates intraespecíficos.",
        "curiosities": [
            "É o único felino verdadeiramente social do planeta, caçando em emboscadas coordenadas de alta eficiência.",
            "O rugido de um leão macho pode atingir 114 decibéis e ser ouvido a até 8 quilômetros de distância.",
            "Embora popularmente apelidado de 'rei da selva', seu habitat primário são savanas abertas, estepes e semidesertos, evitando florestas densas.",
            "A cor e a densidade da juba do leão estão diretamente correlacionadas aos seus níveis de testosterona e aptidão física."
        ],
        "expert": {
            "cladogram": [
                "Chordata",
                "Mammalia",
                "Carnivora",
                "Felidae",
                "Pantherinae",
                "Panthera",
                "Panthera leo"
            ],
            "osteology": "Crânio robusto com arco zigomático amplamente expandido e crista sagital pronunciada para inserção do músculo temporal. Fórmula dentária I 3/3, C 1/1, P 3/2, M 1/1, com dentes carniceiros (P4 superior e M1 inferior) hipertrofiados formando uma tesoura óssea eficiente.",
            "biomechanics": "Alavanca mandibular de classe III operando com torque estático nos caninos de 4.500 N. Ombros com clavícula vestigial embutida em fáscia muscular permitindo grande amplitude de passada e absorção de choques em presas pesadas.",
            "histology": "Fibras musculares esqueléticas tipo IIb (glicolíticas de contração rápida) compondo mais de 65% da musculatura locomotora, otimizadas para aceleração explosiva."
        },
        "occurrences_count": 48000,
        "fossil_locations": "Savanas da África Subsaariana (Serengeti, Kruger, Etosha) e Floresta de Gir (Índia)",
        "coordinates": [
            {
                "lat": -2.33,
                "lng": 34.83,
                "locality": "Parque Nacional do Serengeti",
                "country": "Tanzânia",
                "formation": "Savana / Bioma Africano",
                "age_str": "Vivente (GBIF)"
            },
            {
                "lat": -24.01,
                "lng": 31.48,
                "locality": "Parque Nacional Kruger",
                "country": "África do Sul",
                "formation": "Savana de Transval",
                "age_str": "Vivente (GBIF)"
            },
            {
                "lat": 21.13,
                "lng": 70.8,
                "locality": "Parque Nacional da Floresta de Gir",
                "country": "Índia (Gujarat)",
                "formation": "Floresta Seca Decídua (Leão-asiático)",
                "age_str": "Vivente (GBIF)"
            }
        ]
    },
    {
        "id": "gato",
        "name": "Gato Doméstico",
        "aliases": [
            "gato",
            "gata",
            "gatinho",
            "cat",
            "felis catus",
            "felis silvestris catus"
        ],
        "genus": "Felis",
        "scientific_name": "Felis catus",
        "era": "contemporaneo",
        "era_display": "Contemporâneo (Fauna Atual)",
        "period": "Holoceno / Atualidade",
        "epoch": "Holoceno",
        "geological_range": "10.000 anos ao Presente (Domesticado no Neolítico)",
        "group": "mamifero-megafauna",
        "group_display": "Mamífero Carnívoro (Pequeno Felídeo)",
        "diet": "carnivoro",
        "diet_display": "Carnívoro Estrito (Obligado)",
        "habitat": "terrestre",
        "skeletal_type": "vertebrado",
        "skeletal_composition": "Endoesqueleto Ósseo Ultra-Flexível e Cartilagem",
        "is_contemporary": True,
        "conservation_status": "Espécie Vivente Domesticada (População Global Estável)",
        "length": "0.46 – 0.51 m (corpo) + 0.3 m (cauda)",
        "height": "0.23 – 0.25 m",
        "weight": "3.5 – 5.5 kg",
        "speed": "48 km/h (velocidade máxima em sprint)",
        "bite_force": "300 N (caninos adaptados para deslocamento cervical de roedores)",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Cat_poster_1.jpg/960px-Cat_poster_1.jpg",
        "image_caption": "Gato doméstico europeu (Felis catus) exibindo padrão pelagem malhado",
        "gallery": [
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Cat_poster_1.jpg/960px-Cat_poster_1.jpg",
                "caption": "[🌿 Indivíduo em Vida] Felis catus exibindo vibrissas e pupila vertical",
                "type": "living_specimen",
                "category": "life_view",
                "author": "Wikimedia Commons"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Cat_skeleton.jpg/960px-Cat_skeleton.jpg",
                "caption": "[🦴 Esqueleto / Osteologia] Esqueleto felino mostrando a coluna de 30 vértebras",
                "type": "skeleton",
                "category": "skeletal_view",
                "author": "Wikimedia Commons"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Felis_catus_skull.jpg/960px-Felis_catus_skull.jpg",
                "caption": "[🦴 Crânio & Dentição] Crânio de Felis catus com órbitas frontais binoculares",
                "type": "skull",
                "category": "skeletal_view",
                "author": "Wikimedia Commons"
            }
        ],
        "etymology": "Do latim vulgar cattus (gato), possivelmente derivado do afro-asiático. O nome de gênero Felis refere-se aos felinos menores.",
        "bio": "O gato doméstico (Felis catus) é um mamífero carnívoro de pequeno porte da família dos felídeos. Descende do gato-selvagem-africano (Felis lybica), tendo sido domesticado no Crescente Fértil há cerca de 9.500 anos associado aos primeiros depósitos agrícolas de grãos. É um predador solitário com reflexo de endireitamento extremamente desenvolvido, visão noturna seis vezes superior à humana e audição de até 64.000 Hz.",
        "curiosities": [
            "Possui uma clavícula livre flutuante ligada apenas por músculos, permitindo espremer o corpo em qualquer espaço por onde passe a cabeça.",
            "Sua coluna vertebral tem vértebras adicionais com amortecedores discais espessos que lhe conferem o 'reflexo de endireitamento aéreo'.",
            "É um carnívoro obrigatório: seu organismo é incapaz de sintetizar taurina e vitamina A por vias vegetais.",
            "O ronronar felino ocorre em frequências de 25 a 150 Hz, faixa comprovada por acelerar a regeneração óssea e tecidual."
        ],
        "expert": {
            "cladogram": [
                "Chordata",
                "Mammalia",
                "Carnivora",
                "Felidae",
                "Felinae",
                "Felis",
                "Felis catus"
            ],
            "osteology": "Coluna vertebral composta por 7 vértebras cervicais, 13 torácicas, 7 lombares, 3 sacrais e 20 a 23 caudais. Garras retráteis ancoradas nas falanges distais mantidas por ligamentos elásticos dorsais.",
            "biomechanics": "Articulação escapular desprovida de acrômio rígido, agindo como pistão biológico de amortecimento em saltos de até 6 vezes sua altura.",
            "histology": "Tapetum lucidum retiniano altamente refletivo composto por camadas celulares de guanina, amplificando fótons em baixa luminosidade."
        },
        "occurrences_count": 120000,
        "fossil_locations": "Cosmopolita Global (Originário do Oriente Médio / Egito)",
        "coordinates": [
            {
                "lat": 31.95,
                "lng": 35.23,
                "locality": "Crescente Fértil / Levante",
                "country": "Oriente Médio (Sítio de Shillourokambos)",
                "formation": "Sítios Neolíticos de Domesticação",
                "age_str": "9.500 anos"
            },
            {
                "lat": 29.97,
                "lng": 31.13,
                "locality": "Gizé / Vale do Nilo",
                "country": "Egito",
                "formation": "Registros Históricos Dinásticos",
                "age_str": "Holoceno"
            },
            {
                "lat": -23.55,
                "lng": -46.63,
                "locality": "São Paulo",
                "country": "Brasil",
                "formation": "Distribuição Urbana Global",
                "age_str": "Contemporâneo (GBIF)"
            }
        ]
    },
    {
        "id": "elefante",
        "name": "Elefante-Africano",
        "aliases": [
            "elefante",
            "elefante africano",
            "elephant",
            "loxodonta africana",
            "loxodonta"
        ],
        "genus": "Loxodonta",
        "scientific_name": "Loxodonta africana",
        "era": "contemporaneo",
        "era_display": "Contemporâneo (Fauna Atual)",
        "period": "Holoceno / Atualidade",
        "epoch": "Holoceno",
        "geological_range": "1.5 Ma ao Presente (Pleistoceno ao Holoceno)",
        "group": "mamifero-megafauna",
        "group_display": "Mamífero Proboscídeo (Megafauna Terrestre)",
        "diet": "herbivoro",
        "diet_display": "Herbívoro Generalista",
        "habitat": "terrestre",
        "skeletal_type": "vertebrado",
        "skeletal_composition": "Endoesqueleto Graviportal Maciço (Ossos Densos Anti-Cisalhamento)",
        "is_contemporary": True,
        "conservation_status": "Espécie Vivente (Em Perigo - IUCN)",
        "length": "6.0 – 7.5 m",
        "height": "3.3 – 4.0 m (maior animal terrestre vivente)",
        "weight": "4.000 – 7.000 kg (machos chegam a 7 toneladas)",
        "speed": "40 km/h (marcha rápida contínua sem fase aérea)",
        "bite_force": "2.800 N (molares gigantes de lamelas de esmalte para triturar madeira)",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/960px-African_Bush_Elephant.jpg",
        "image_caption": "Elefante-africano da savana (Loxodonta africana) exibindo tromba e presas",
        "gallery": [
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/960px-African_Bush_Elephant.jpg",
                "caption": "[🌿 Indivíduo em Vida] Loxodonta africana em savana aberta",
                "type": "living_specimen",
                "category": "life_view",
                "author": "Wikimedia Commons"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Loxodonta_africana_skeleton.jpg/960px-Loxodonta_africana_skeleton.jpg",
                "caption": "[🦴 Esqueleto Graviportal] Esqueleto colunar adaptado para sustentação de 7 toneladas",
                "type": "skeleton",
                "category": "skeletal_view",
                "author": "Muséum National d'Histoire Naturelle"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/African_elephant_skull.jpg/960px-African_elephant_skull.jpg",
                "caption": "[🦴 Crânio Pneumatizado] Crânio com cavidades de ar celulares para reduzir peso",
                "type": "skull",
                "category": "skeletal_view",
                "author": "Wikimedia Commons"
            }
        ],
        "etymology": "Do grego loxos (oblíquo) e odous (dente), referente ao padrão losangular de esmalte em seus molares.",
        "bio": "O elefante-africano (Loxodonta africana) é o maior animal terrestre vivo no planeta Terra. Possui uma probóscide (tromba) muscular com mais de 40.000 feixes musculares individuais sem ossos, atuando como órgão respiratório, olfativo, táctil e manipulador de precisão milimétrica. Suas orelhas gigantescas funcionam como radiadores de dissipação térmica vascularizada, permitindo controle homeotérmico sob o calor da África.",
        "curiosities": [
            "A tromba do elefante é capaz de levantar toras de 350 kg e, ao mesmo tempo, colher uma única semente de gramínea do chão.",
            "Possui osso esponjoso pneumatizado no crânio que atua como favo de mel, permitindo volume gigante para cérebro e tromba sem sobrecarregar o pescoço.",
            "Comunica-se por infrassom (15 a 35 Hz) que viaja dezenas de quilômetros pelo solo e é captado por receptores nas solas de suas patas.",
            "Consome diariamente até 200 kg de matéria vegetal e bebe mais de 150 litros de água."
        ],
        "expert": {
            "cladogram": [
                "Chordata",
                "Mammalia",
                "Afrotheria",
                "Proboscidea",
                "Elephantidae",
                "Loxodonta",
                "Loxodonta africana"
            ],
            "osteology": "Membros pilares perfeitamente alinhados verticalmente (postura graviportal), minimizando estresse mecânico de flexão sobre os ossos longos. As presas de marfim são incisivos superiores de crescimento contínuo formados por dentina hipermineralizada.",
            "biomechanics": "Almofada fibroelástica adiposa plantar que se expande sob compressão de 6 toneladas, absorvendo 80% do choque de cada passada.",
            "histology": "Osso cortical extremamente denso com canais haversianos múltiplos entrelaçados para neutralizar microfraturas por fadiga gravitacional."
        },
        "occurrences_count": 35000,
        "fossil_locations": "Savanas e Florestas da África Central, Oriental e Austral",
        "coordinates": [
            {
                "lat": -2.33,
                "lng": 34.83,
                "locality": "Serengeti / Mara",
                "country": "Tanzânia / Quênia",
                "formation": "Savana / Parque Nacional",
                "age_str": "Vivente (GBIF)"
            },
            {
                "lat": -18.66,
                "lng": 24.47,
                "locality": "Parque Nacional Chobe",
                "country": "Botsuana",
                "formation": "Bacia do Rio Chobe",
                "age_str": "Vivente (GBIF)"
            },
            {
                "lat": -19.03,
                "lng": 22.95,
                "locality": "Delta do Okavango",
                "country": "Botsuana",
                "formation": "Zonas Úmidas do Kalahari",
                "age_str": "Vivente (GBIF)"
            }
        ]
    },
    {
        "id": "aguia",
        "name": "Águia-Real",
        "aliases": [
            "aguia",
            "águia",
            "aguia-real",
            "águia real",
            "golden eagle",
            "aquila chrysaetos"
        ],
        "genus": "Aquila",
        "scientific_name": "Aquila chrysaetos",
        "era": "contemporaneo",
        "era_display": "Contemporâneo (Fauna Atual)",
        "period": "Holoceno / Atualidade",
        "epoch": "Holoceno",
        "geological_range": "Pleistoceno ao Presente (Dinossauro Aviano Vivente)",
        "group": "ave",
        "group_display": "Ave de Rapina (Dinossauro Aviano)",
        "diet": "carnivoro",
        "diet_display": "Carnívoro Predador Aéreo",
        "habitat": "aereo",
        "skeletal_type": "vertebrado",
        "skeletal_composition": "Endoesqueleto Ósseo Pneumatizado (Oco e Ultraleve)",
        "is_contemporary": True,
        "conservation_status": "Espécie Vivente (Pouco Preocupante - IUCN)",
        "length": "0.75 – 1.0 m (Envergadura: 2.0 – 2.3 m)",
        "height": "0.85 m",
        "weight": "3.5 – 6.5 kg",
        "speed": "240 – 320 km/h (em mergulho picado de ataque)",
        "bite_force": "Pressão de Garras: 3.000 N (400 psi) capaz de esmagar vértebras cervicais",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Aquila_chrysaetos_Flickr.jpg/960px-Aquila_chrysaetos_Flickr.jpg",
        "image_caption": "Águia-real (Aquila chrysaetos) em voo planado exibindo penas de voo primárias",
        "gallery": [
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Aquila_chrysaetos_Flickr.jpg/960px-Aquila_chrysaetos_Flickr.jpg",
                "caption": "[🌿 Indivíduo em Vida] Aquila chrysaetos com envergadura de mais de 2 metros",
                "type": "living_specimen",
                "category": "life_view",
                "author": "Wikimedia Commons"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Aquila_chrysaetos_skeleton.jpg/960px-Aquila_chrysaetos_skeleton.jpg",
                "caption": "[🦴 Esqueleto Pneumatizado] Esqueleto oco com quilha esternal avantajada",
                "type": "skeleton",
                "category": "skeletal_view",
                "author": "Wikimedia Commons"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Golden_eagle_skull.jpg/960px-Golden_eagle_skull.jpg",
                "caption": "[🦴 Crânio e Bico] Bico adunco córneo queratinizado e anel esclerótico ocular",
                "type": "skull",
                "category": "skeletal_view",
                "author": "Wikimedia Commons"
            }
        ],
        "etymology": "Do latim aquila (águia), derivado de aquilo (vento do norte). Chrysaetos vem do grego chrysos (dourado) e aetos (águia).",
        "bio": "A águia-real (Aquila chrysaetos) é uma das aves de rapina mais poderosas do Hemisfério Norte. Dotada de visão estereoscópica oito vezes mais aguçada que a do ser humano, é capaz de avistar uma lebre a mais de 3 quilômetros de distância. Durante o ataque aéreo, fecha as asas e atinge mergulhos verticais de até 320 km/h, matando presas como marmotas, lebres e até filhotes de cabra montesa pelo impacto avassalador de suas garras retráteis.",
        "curiosities": [
            "Biólogos e paleontólogos classificam as aves como dinossauros terópodes avianos verdadeiros que sobreviveram à grande extinção K-Pg.",
            "Possui anéis escleróticos ósseos no interior dos globos oculares para manter a forma da córnea sob a pressão do ar a 300 km/h.",
            "Seus ossos pneumatizados possuem suportes trabeculares internos semelhantes a vigas de aço aeronáuticas, conferindo rigidez com massa reduzida.",
            "Seus ninhos ('ayries') são reutilizados por gerações, podendo atingir 2 metros de diâmetro e mais de 1 tonelada de peso."
        ],
        "expert": {
            "cladogram": [
                "Chordata",
                "Dinosauria",
                "Theropoda",
                "Aves",
                "Accipitriformes",
                "Accipitridae",
                "Aquila chrysaetos"
            ],
            "osteology": "Fusão esquelética adaptada ao voo: vértebras lombares fundidas em sinsacro, fúrcula elástica ('osso da sorte') e grande quilha esternal para fixação dos músculos peitorais.",
            "biomechanics": "Garras recurvadas travadas por tendões digitais flexores automáticos ('ratchet mechanism') que mantêm pressão de 3.000 N sem gasto de energia muscular ativa.",
            "histology": "Retina com fovea dupla com mais de 1.000.000 de fotorreceptores por milímetro quadrado, permitindo ampliação óptica binocular e detecção de ultravioleta."
        },
        "occurrences_count": 52000,
        "fossil_locations": "Montanhas e Falésias da América do Norte, Europa, Ásia e Norte da África",
        "coordinates": [
            {
                "lat": 44.42,
                "lng": -110.58,
                "locality": "Yellowstone / Montanhas Rochosas",
                "country": "Estados Unidos (Wyoming)",
                "formation": "Falésias Alpinas",
                "age_str": "Vivente (GBIF)"
            },
            {
                "lat": 46.81,
                "lng": 8.22,
                "locality": "Alpes Suíços",
                "country": "Suíça / Europa",
                "formation": "Cadeia Alpina",
                "age_str": "Vivente (GBIF)"
            },
            {
                "lat": 48.01,
                "lng": 102.5,
                "locality": "Montes Altai",
                "country": "Mongólia",
                "formation": "Estepes e Montanhas Centrais",
                "age_str": "Vivente (GBIF)"
            }
        ]
    },
    {
        "id": "tubarao-martelo",
        "name": "Tubarão-Martelo-Gigante",
        "aliases": [
            "tubarao-martelo",
            "tubarão-martelo",
            "tubarao martelo",
            "hammerhead shark",
            "sphyrna mokarran"
        ],
        "genus": "Sphyrna",
        "scientific_name": "Sphyrna mokarran",
        "era": "contemporaneo",
        "era_display": "Contemporâneo (Fauna Atual)",
        "period": "Holoceno / Atualidade",
        "epoch": "Holoceno",
        "geological_range": "20 Ma ao Presente (Mioceno ao Holoceno)",
        "group": "reptil-marinho",
        "group_display": "Fauna Marinha (Peixe Cartilaginoso)",
        "diet": "carnivoro",
        "diet_display": "Carnívoro Piscívoro (Especialista em Raias)",
        "habitat": "aquatico",
        "skeletal_type": "vertebrado",
        "skeletal_composition": "Endoesqueleto de Cartilagem Prismática Calcificada",
        "is_contemporary": True,
        "conservation_status": "Criticamente em Perigo (IUCN)",
        "length": "4.5 – 6.1 m",
        "height": "1.2 m (barbatana dorsal de até 1 metro)",
        "weight": "450 – 580 kg",
        "speed": "40 km/h (alta manobrabilidade hidrodinâmica)",
        "bite_force": "3.800 N (dentes triangulares serrilhados oblíquos)",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Sphyrna_mokarran_2.jpg/960px-Sphyrna_mokarran_2.jpg",
        "image_caption": "Tubarão-martelo-gigante (Sphyrna mokarran) exibindo cabeça em cefalofólio",
        "gallery": [
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Sphyrna_mokarran_2.jpg/960px-Sphyrna_mokarran_2.jpg",
                "caption": "[🌿 Indivíduo em Vida] Tubarão-martelo navegando sobre recifes de coral",
                "type": "living_specimen",
                "category": "life_view",
                "author": "Wikimedia Commons"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Hammerhead_shark_skeleton.jpg/960px-Hammerhead_shark_skeleton.jpg",
                "caption": "[🦴 Esqueleto Cartilaginoso] Condrocrânio expandido lateralmente em forma de martelo",
                "type": "skeleton",
                "category": "skeletal_view",
                "author": "Wikimedia Commons"
            }
        ],
        "etymology": "Do grego sphyrna (martelo), aludindo à anatomia craniana cefalofólica.",
        "bio": "O tubarão-martelo-gigante (Sphyrna mokarran) é o maior membro da família Sphyrnidae. A projeção lateral de sua cabeça, chamada 'cefalofólio', atua como um aerofólio hidrodinâmico submarino conferindo-lhe agilidade de curva superior a qualquer outro tubarão de grande porte. Ao mesmo tempo, distribui seus sensores de eletrorrecepção (Ampolas de Lorenzini) em uma área muito mais ampla, permitindo escanear o fundo arenoso em busca de raias soterradas.",
        "curiosities": [
            "Os olhos situados nas extremidades do martelo proporcionam visão estereoscópica panorâmica de 360 graus no plano vertical.",
            "Usa a cabeça em forma de martelo como uma marreta biológica para prensar raias peçonhentas contra o fundo marinho antes de desferir a mordida.",
            "Possui imunidade fisiológica ao veneno dos ferrões das raias, tendo sido encontrados indivíduos com mais de 50 ferrões cravados na mandíbula sem infecção.",
            "Não possui ossos verdadeiros: seu esqueleto inteiro é feito de cartilagem com prismas minerais de apatita ('areolar calcification')."
        ],
        "expert": {
            "cladogram": [
                "Chordata",
                "Chondrichthyes",
                "Elasmobranchii",
                "Carcharhiniformes",
                "Sphyrnidae",
                "Sphyrna",
                "Sphyrna mokarran"
            ],
            "osteology": "Condrocrânio cartilaginoso alargado com lâminas pré-orbitais e pós-orbitais estendidas. Ausência de osso esponjoso vascular, reduzindo o peso hidrostático em 50% frente aos teleósteos.",
            "biomechanics": "Cefalofólio gera sustentação hidrodinâmica positiva, compensando a flutuabilidade negativa sem necessidade de bexiga natatória.",
            "histology": "Ampolas de Lorenzini conectadas a poros dérmicos preenchidos por gel semicondutor de glicoproteína com condutividade de 0.005 microvolts/cm."
        },
        "occurrences_count": 28000,
        "fossil_locations": "Oceanos Tropicais e Temperados Globais (Caribe, Flórida, Havaí, Austrália)",
        "coordinates": [
            {
                "lat": 24.55,
                "lng": -81.78,
                "locality": "Key West / Flórida",
                "country": "Estados Unidos",
                "formation": "Águas Costeiras e Canais",
                "age_str": "Vivente (GBIF)"
            },
            {
                "lat": -18.28,
                "lng": 147.69,
                "locality": "Grande Barreira de Corais",
                "country": "Austrália",
                "formation": "Recifes Oceânicos",
                "age_str": "Vivente (GBIF)"
            },
            {
                "lat": 5.53,
                "lng": -87.05,
                "locality": "Ilha Cocos",
                "country": "Costa Rica",
                "formation": "Monte Submarino Pelágico",
                "age_str": "Vivente (GBIF)"
            }
        ]
    },
    {
        "id": "pterodactilo",
        "name": "Pterodáctilo",
        "aliases": [
            "pterodactilo",
            "pterodáctilo",
            "pterodactyl",
            "pterodactylus",
            "pterodactylus antiquus"
        ],
        "genus": "Pterodactylus",
        "scientific_name": "Pterodactylus antiquus",
        "era": "mesozoico",
        "era_display": "Mesozoico",
        "period": "Jurássico Superior",
        "epoch": "Tithoniano",
        "geological_range": "150.8 – 148.5 Ma (Jurássico Superior)",
        "group": "pterossauro",
        "group_display": "Pterossauro (Réptil Voador Mesozoico)",
        "diet": "carnivoro",
        "diet_display": "Piscívoro & Insetívoro",
        "habitat": "aereo",
        "skeletal_type": "vertebrado",
        "skeletal_composition": "Endoesqueleto Ósseo Oco com Paredes Finas como Casca de Ovo",
        "is_contemporary": False,
        "conservation_status": "Extinto no Registro Fóssil",
        "length": "0.5 – 1.0 m (Envergadura de asas: 1.04 m)",
        "height": "0.35 m",
        "weight": "2.0 – 4.5 kg",
        "speed": "55 km/h (voo batido e planado)",
        "bite_force": "200 N (mandíbula estreita com 90 dentes cônicos pontiagudos)",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Pterodactylus_antiquus_fossil.jpg/960px-Pterodactylus_antiquus_fossil.jpg",
        "image_caption": "Fóssil holótipo de Pterodactylus antiquus preservado no Calcário de Solnhofen",
        "gallery": [
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Pterodactylus_antiquus_reconstruction.png/960px-Pterodactylus_antiquus_reconstruction.png",
                "caption": "[🌿 Em Vida] Reconstrução paleoartística em vida com pelagem de picnofibras e crista membranosa",
                "type": "life_restoration",
                "category": "life_view",
                "author": "Nobu Tamura / Wikimedia Commons"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Pterodactylus_antiquus_holotype_Bspg.jpg/960px-Pterodactylus_antiquus_holotype_Bspg.jpg",
                "caption": "[⛏️ Holótipo] Fóssil holótipo histórico descrito por Cosimo Collini em 1784 nos calcários de Solnhofen",
                "type": "fossil",
                "category": "fossil_view",
                "author": "Bavarian State Collection for Paleontology"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Pterodactylus_Solnhofen_slab.jpg/960px-Pterodactylus_Solnhofen_slab.jpg",
                "caption": "[🦴 Esqueleto] Esqueleto esmagado em laje de calcário litográfico finíssimo preservando cada vértebra",
                "type": "skeleton",
                "category": "skeletal_view",
                "author": "Museum für Naturkunde Berlin"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Pterodactylus_wing_membrane.jpg/960px-Pterodactylus_wing_membrane.jpg",
                "caption": "[⛏️ Membrana] Detalhe de tecidos moles preservados com fibras estruturais de actinofibras na asa",
                "type": "fossil",
                "category": "fossil_view",
                "author": "Bavarian State Museum"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Pterodactylus_skull_dentition.jpg/960px-Pterodactylus_skull_dentition.jpg",
                "caption": "[💀 Crânio] Rostro reto fino com dentes cônicos pontiagudos restringidos à ponta mandibular",
                "type": "skull",
                "category": "skull_view",
                "author": "Jura Museum Eichstätt"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Pterodactylus_scale.svg/960px-Pterodactylus_scale.svg.png",
                "caption": "[⛏️ Escala] Comparativo de escala: envergadura de asas de 1.04 metro comparada ao humano",
                "type": "fossil",
                "category": "fossil_view",
                "author": "Wikimedia Commons"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Pterodactylus_flying_restoration.jpg/960px-Pterodactylus_flying_restoration.jpg",
                "caption": "[🌿 Em Vida] Voo planado e batido costeiro sobre lagoas tropicais do arquipélago jurássico europeu",
                "type": "life_restoration",
                "category": "life_view",
                "author": "Mark Witton / Paleoarte"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Pterodactylus_feet_pycnofibers.jpg/960px-Pterodactylus_feet_pycnofibers.jpg",
                "caption": "[🦴 Membros] Quarto dígito manual hiperalongado que sustentava a asa de tecido membranoso",
                "type": "skeleton",
                "category": "skeletal_view",
                "author": "Natural History Museum London"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Pterodactylus_juvenile_specimen.jpg/960px-Pterodactylus_juvenile_specimen.jpg",
                "caption": "[⛏️ Fóssil] Exemplar fóssil juvenil articulado com esqueleto preservado em duas metades",
                "type": "fossil",
                "category": "fossil_view",
                "author": "Teylers Museum"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Solnhofen_quarry_fossil_dig.jpg/960px-Solnhofen_quarry_fossil_dig.jpg",
                "caption": "[⛏️ Estrato] Estratos de calcário de Solnhofen na Baviera alemã onde os fósseis foram extraídos",
                "type": "fossil",
                "category": "fossil_view",
                "author": "Wikimedia Commons"
            }
        ],
        "etymology": "Do grego antigo πτεροδάκτυλος (pterodaktylos), formado por pteron (asa) e daktylos (dedo) — 'dedo alado'.",
        "bio": "O Pterodáctilo (Pterodactylus antiquus) foi o primeiro réptil alado descoberto e identificado pela ciência, descrito pelo naturalista italiano Cosimo Collini em 1784. Não era um dinossauro, mas sim um pterossauro arcossauro aparentado. Suas asas eram formadas por uma membrana complexa de pele e músculos (quirorpatágio) sustentada por um quarto dedo hipertrofiado extremamente longo. Vivia ao redor de lagoas litorâneas quentes da Europa jurássica, alimentando-se de peixes e pequenos invertebrados aquáticos.",
        "curiosities": [
            "Pterossauros NÃO são dinossauros: são répteis voadores irmãos dos dinossauros dentro do clado Avemetatarsalia.",
            "Foi o primeiro vertebrado voador fóssil batizado e compreendido pela humanidade.",
            "Exames de luz ultravioleta revelaram que possuía uma crista mole carnosa na nuca e era coberto por penugem isolante chamada 'picnofibras'.",
            "Suas asas eram preenchidas por actinofibrilas — feixes microscópicos que impediam o patágio de flutuar descontrolado durante o voo."
        ],
        "expert": {
            "cladogram": [
                "Chordata",
                "Archosauromorpha",
                "Pterosauromorpha",
                "Pterosauria",
                "Pterodactyloidea",
                "Pterodactylus",
                "Pterodactylus antiquus"
            ],
            "osteology": "Paredes corticais ósseas com espessura submilimétrica reforçadas por traves internas helicoidais. O quarto metacarpal sustenta quatro falanges alares com o rádio e a ulna formando a borda de ataque.",
            "biomechanics": "Decolagem quadrúpede explosiva: usava os membros anteriores como alavancas com os músculos peitorais gerando impulso de lançamento superior ao das aves modernas.",
            "histology": "Picnofibras com queratina filamentar e melanossomos preservados, demonstrando endotermia ativa e regulação térmica avançada."
        },
        "occurrences_count": 85,
        "fossil_locations": "Alemanha (Calcário Litográfico de Solnhofen - Baviera)",
        "coordinates": [
            {
                "lat": 48.89,
                "lng": 11.0,
                "locality": "Solnhofen / Eichstätt",
                "country": "Alemanha (Baviera)",
                "formation": "Calcário de Solnhofen (Lagerstätte)",
                "age_str": "150 Ma (Jurássico)"
            },
            {
                "lat": 48.98,
                "lng": 11.23,
                "locality": "Pedreira de Schernfeld",
                "country": "Alemanha",
                "formation": "Camadas Plattenkalk",
                "age_str": "151 Ma (Jurássico)"
            }
        ]
    },
    {
        "id": "alossauro",
        "name": "Alossauro",
        "aliases": [
            "alossauro",
            "allosaurus",
            "allosaurus fragilis",
            "aloossauro"
        ],
        "genus": "Allosaurus",
        "scientific_name": "Allosaurus fragilis",
        "era": "mesozoico",
        "era_display": "Mesozoico",
        "period": "Jurássico Superior",
        "epoch": "Kimmeridgiano - Tithoniano",
        "geological_range": "155 – 145 Ma (Jurássico Superior)",
        "group": "dinossauro",
        "group_display": "Dinossauro Terópode Carnívoro",
        "diet": "carnivoro",
        "diet_display": "Hipercarnívoro Ápice (Caçador de Saurópodes)",
        "habitat": "terrestre",
        "skeletal_type": "vertebrado",
        "skeletal_composition": "Endoesqueleto Ósseo Articulado com Vértebras Pneumatizadas",
        "is_contemporary": False,
        "conservation_status": "Extinto no Registro Fóssil",
        "length": "8.5 – 10.0 m (exemplares gigantes como A. jimmadseni atingem 12 m)",
        "height": "3.2 m (altura nos quadris)",
        "weight": "2.000 – 3.000 kg",
        "speed": "35 km/h",
        "bite_force": "8.500 N (ataque estilo 'machado' operado pelos músculos do pescoço)",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Allosaurus_SDNHM.jpg/960px-Allosaurus_SDNHM.jpg",
        "image_caption": "Esqueleto fóssil completo de Allosaurus fragilis no Museu de História Natural de San Diego",
        "gallery": [
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Allosaurus_SDNHM.jpg/960px-Allosaurus_SDNHM.jpg",
                "caption": "[🦴 Esqueleto] Montagem fóssil completa de Allosaurus fragilis em postura dinâmica de ataque",
                "type": "skeleton",
                "category": "skeletal_view",
                "author": "San Diego Natural History Museum"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Allosaurus_BW.jpg/960px-Allosaurus_BW.jpg",
                "caption": "[🌿 Em Vida] Reconstituição em vida destacando cristas lacrimais avermelhadas e garras em foice",
                "type": "life_restoration",
                "category": "life_view",
                "author": "Nobu Tamura / Wikimedia Commons"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Allosaurus_fragilis_skull.jpg/960px-Allosaurus_fragilis_skull.jpg",
                "caption": "[💀 Crânio] Crânio com mobilidade cinética interna e dentes comprimidos serrilhados de 10 cm",
                "type": "skull",
                "category": "skull_view",
                "author": "Wikimedia Commons"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Allosaurus_hand_claws.jpg/960px-Allosaurus_hand_claws.jpg",
                "caption": "[⛏️ Garras] Braços fortes com três dígitos terminando em garras recurvadas de 25 cm",
                "type": "fossil",
                "category": "fossil_view",
                "author": "Utah Field House of Natural History"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Allosaurus_vs_Stegosaurus.jpg/960px-Allosaurus_vs_Stegosaurus.jpg",
                "caption": "[🦴 Museu] Montagem em combate fóssil comprovado com o blindado Stegosaurus",
                "type": "skeleton",
                "category": "skeletal_view",
                "author": "Denver Museum of Nature & Science"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Allosaurus_size_comparison.svg/960px-Allosaurus_size_comparison.svg.png",
                "caption": "[⛏️ Escala] Comparativo anatômico de tamanho em relação ao ser humano (9.5 metros)",
                "type": "fossil",
                "category": "fossil_view",
                "author": "Wikimedia Commons"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Cleveland_Lloyd_Allosaurus_Quarry.jpg/960px-Cleveland_Lloyd_Allosaurus_Quarry.jpg",
                "caption": "[⛏️ Escavação] Pedreira fóssil de Cleveland-Lloyd em Utah onde dezenas de Allosaurus foram escavados",
                "type": "fossil",
                "category": "fossil_view",
                "author": "Bureau of Land Management"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Allosaurus_braincase_cast.jpg/960px-Allosaurus_braincase_cast.jpg",
                "caption": "[💀 Caixa Craniana] Endocasto fóssil revelando estrutura de bulbos olfatórios e audição",
                "type": "skull",
                "category": "skull_view",
                "author": "University of Utah"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Allosaurus_jimmadseni_skull.jpg/960px-Allosaurus_jimmadseni_skull.jpg",
                "caption": "[💀 Crânio] Crânio completo da espécie gigante Allosaurus jimmadseni",
                "type": "skull",
                "category": "skull_view",
                "author": "Natural History Museum of Utah"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Allosaurus_foot_claws.jpg/960px-Allosaurus_foot_claws.jpg",
                "caption": "[⛏️ Fóssil] Articulação dos dígitos posteriores pesados de bípede carnívoro",
                "type": "fossil",
                "category": "fossil_view",
                "author": "Smithsonian Institution"
            }
        ],
        "etymology": "Do grego allos (diferente/estranho) e sauros (lagarto) — 'lagarto diferente', por suas vértebras côncavas.",
        "bio": "O Alossauro (Allosaurus fragilis) foi o maior e mais temido predador terrestre do período Jurássico Superior na América do Norte. Com membros posteriores maciços, braços de três garras afiadas em foice de 25 cm e um crânio com mobilidade cinética interna, caçava dinossauros como Stegosaurus e jovens saurópodes. Seu método de caça envolvia usar a mandíbula superior como um machado de cisalhamento impulsionado pelos poderosos músculos do pescoço contra a carne da presa.",
        "curiosities": [
            "Marcas fósseis comprovam combates mortais entre o Alossauro e o Estegossauro (espinho caudal de estegossauro alojado em vértebra de alossauro).",
            "Sua mandíbula conseguia abrir em um ângulo impressionante de até 92 graus para aplicar o ataque em machadada.",
            "É o fóssil oficial do estado de Utah, onde milhares de ossos foram escavados na famosa pedreira de Cleveland-Lloyd.",
            "Substituía os dentes continuamente ao longo da vida: quando um dente quebrava, outro já emergia por baixo."
        ],
        "expert": {
            "cladogram": [
                "Chordata",
                "Dinosauria",
                "Theropoda",
                "Avetheropoda",
                "Carnosauria",
                "Allosauroidea",
                "Allosaurus"
            ],
            "osteology": "Crânio estreito e profundo com junções intracranianas móveis cinéticas. Vértebras cervicais opistocélicas com sacos aéreos respiratórios de fluxo contínuo semelhantes aos das aves.",
            "biomechanics": "Apesar de ter força de mordida menor que a do T-Rex, seu crânio suportava cargas verticais de impacto 15 vezes maiores que o próprio peso de sua cabeça.",
            "histology": "Crescimento osteocítico com anéis de LAGs (Lines of Arrested Growth) indicando que atingia o tamanho adulto por volta dos 15 a 18 anos."
        },
        "occurrences_count": 210,
        "fossil_locations": "Estados Unidos (Formação Morrison - Utah, Colorado, Wyoming) e Portugal",
        "coordinates": [
            {
                "lat": 39.32,
                "lng": -110.85,
                "locality": "Cleveland-Lloyd Dinosaur Quarry",
                "country": "Estados Unidos (Utah)",
                "formation": "Formação Morrison",
                "age_str": "152 Ma (Jurássico)"
            },
            {
                "lat": 44.49,
                "lng": -108.05,
                "locality": "Big Horn Basin",
                "country": "Estados Unidos (Wyoming)",
                "formation": "Formação Morrison",
                "age_str": "150 Ma (Jurássico)"
            },
            {
                "lat": 39.17,
                "lng": -9.37,
                "locality": "Lourinhã",
                "country": "Portugal",
                "formation": "Formação da Lourinhã",
                "age_str": "150 Ma (Jurássico)"
            }
        ]
    },
    {
        "id": "leviatan-melvillei",
        "name": "Livyatan melvillei",
        "aliases": [
            "leviatan",
            "livyatan",
            "leviatan melvillei",
            "livyatan melvillei",
            "baleia predadora",
            "cachalote assassino"
        ],
        "genus": "Livyatan",
        "scientific_name": "Livyatan melvillei",
        "era": "cenozoico",
        "era_display": "Cenozoico",
        "period": "Neógeno (Mioceno)",
        "epoch": "Tortoniano",
        "geological_range": "9.9 – 8.9 Ma (Mioceno Superior)",
        "group": "reptil-marinho",
        "group_display": "Fauna Marinha (Cachalote Macrorraptor)",
        "diet": "carnivoro",
        "diet_display": "Hipercarnívoro Ápice (Predador de Baleias)",
        "habitat": "aquatico",
        "skeletal_type": "vertebrado",
        "skeletal_composition": "Endoesqueleto Ósseo Hidrodinâmico com Mandíbula Hipermineralizada",
        "is_contemporary": False,
        "conservation_status": "Extinto no Registro Fóssil",
        "length": "13.5 – 17.5 m (comparável ao cachalote moderno)",
        "height": "3.5 m",
        "weight": "45.000 – 57.000 kg (cerca de 50 toneladas)",
        "speed": "38 km/h",
        "bite_force": "36.000 N (dentes de 36 cm — os maiores dentes funcionais de corte de qualquer animal já existente!)",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Livyatan_melvillei_skull.jpg/960px-Livyatan_melvillei_skull.jpg",
        "image_caption": "Crânio fóssil de Livyatan melvillei de 3 metros no Museu de História Natural de Lima",
        "gallery": [
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Livyatan_melvillei_skull.jpg/960px-Livyatan_melvillei_skull.jpg",
                "caption": "[🦴 Crânio Fóssil de 3 Metros] Crânio de Livyatan com dentes cônicos gigantescos",
                "type": "skull",
                "category": "skeletal_view",
                "author": "Museo de Historia Natural de Lima"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Livyatan_BW.jpg/960px-Livyatan_BW.jpg",
                "caption": "[🌿 Paleoarte em Vida] Reconstituição de Livyatan caçando uma baleia de barbatana",
                "type": "life_restoration",
                "category": "life_view",
                "author": "Nobu Tamura / Wikimedia Commons"
            }
        ],
        "etymology": "Do monstro marinho bíblico Leviatã (Livyatan em hebraico). O epíteto melvillei homenageia Herman Melville, autor de Moby Dick.",
        "bio": "Livyatan melvillei foi uma espécie colossal de cachalote predador macrorraptor que viveu nos oceanos do Mioceno. Ao contrário dos cachalotes modernos (que só têm dentes na mandíbula inferior e comem lulas), o Livyatan possuía dentes funcionais gigantes de até 36 centímetros tanto na mandíbula superior quanto na inferior. Compartilhou os oceanos com o lendário tubarão Megalodonte (Otodus megalodon), disputando com ele o topo da cadeia alimentar marinha através da caça de outras baleias de médio porte.",
        "curiosities": [
            "Seus dentes de 36 cm são os maiores dentes de alimentação de qualquer animal conhecido na história da Terra (excluindo presas de elefantes).",
            "Possuía uma bacia supracraniana maciça que abrigava um órgão de espermacete gigante usado para ecolocalização de longo alcance e arremetidas de impacto frontal.",
            "Dividia os mares com o tubarão Megalodonte, formando o ecossistema oceânico de predadores mais formidável de todos os tempos.",
            "O fóssil holótipo foi descoberto no deserto costeiro de Pisco, no Peru, pelo paleontólogo holandês Klaas Post em 2008."
        ],
        "expert": {
            "cladogram": [
                "Chordata",
                "Mammalia",
                "Cetartiodactyla",
                "Cetacea",
                "Odontoceti",
                "Physeteroidea",
                "Livyatan melvillei"
            ],
            "osteology": "Crânio de 3 metros com rostro largo e robusto, sem a constrição apical dos cachalotes comedores de lula. Alvéolos dentários profundos com trabéculas de fixação para suportar choques de mordida extrema.",
            "biomechanics": "Músculos temporais colossais originados em fossas temporais expandidas gerando mordida de 36.000 N, suficiente para quebrar costelas e crânios de baleias misticetas.",
            "histology": "Esmalte dentário com bandas de Hunter-Schreger espessas e decussadas para prevenir fratura por estresse ao morder ossos."
        },
        "occurrences_count": 18,
        "fossil_locations": "Peru (Deserto de Ica - Formação Pisco)",
        "coordinates": [
            {
                "lat": -14.07,
                "lng": -75.73,
                "locality": "Deserto de Ocucaje / Cerro Colorado",
                "country": "Peru (Ica)",
                "formation": "Formação Pisco",
                "age_str": "9.9 Ma (Mioceno)"
            }
        ]
    },
    {
        "id": "estegossauro",
        "name": "Estegossauro",
        "genus": "Stegosaurus",
        "scientific_name": "Stegosaurus stenops (Marsh, 1887)",
        "era": "mesozoico",
        "era_display": "Mesozoico",
        "period": "Jurássico",
        "epoch": "Jurássico Superior",
        "geological_range": "155 a 150 Ma",
        "group": "dinossauro",
        "group_display": "Tireóforo Blindado Herbívoro",
        "diet": "herbivoro",
        "diet_display": "Herbívoro Rasteiro (Pteridófitas & Cicadáceas)",
        "habitat": "terrestre",
        "skeletal_type": "vertebrado",
        "skeletal_composition": "Endoesqueleto Ósseo com Placas Dérmicas",
        "is_contemporary": False,
        "conservation_status": "Fóssil Extinto",
        "length": "9.0 m",
        "height": "4.0 m até o topo das placas",
        "weight": "4.500 a 5.000 kg",
        "speed": "12 km/h",
        "bite_force": "2.800 N",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Stegosaurus_stenops_life_restoration.png/960px-Stegosaurus_stenops_life_restoration.png",
        "image_caption": "Representação em vida de Stegosaurus stenops com placas dorsais",
        "gallery": [
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Stegosaurus_stenops_life_restoration.png/960px-Stegosaurus_stenops_life_restoration.png",
                "caption": "[🌿 Em Vida] Reconstituição com placas dorsais dérmicas vascularizadas e espinhos caudais",
                "type": "life_restoration",
                "category": "life_view",
                "author": "Nobu Tamura / Wikimedia Commons"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Stegosaurus_Sophie_NHM.jpg/960px-Stegosaurus_Sophie_NHM.jpg",
                "caption": "[🦴 Esqueleto] 'Sophie' (NHMUK PV R36730), o espécime de Stegosaurus mais completo do mundo em Londres",
                "type": "skeleton",
                "category": "skeletal_view",
                "author": "Natural History Museum London"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Stegosaurus_skull_cast.jpg/960px-Stegosaurus_skull_cast.jpg",
                "caption": "[💀 Crânio] Crânio proporcionalmente diminuto com caixa craniana de cérebro do tamanho de uma noz",
                "type": "skull",
                "category": "skull_view",
                "author": "Smithsonian Institution"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Stegosaurus_thagomizer_spikes.jpg/960px-Stegosaurus_thagomizer_spikes.jpg",
                "caption": "[⛏️ Defesa] 'Thagomizer': 4 espinhos ósseos afiados de 90 cm na extremidade da cauda",
                "type": "fossil",
                "category": "fossil_view",
                "author": "Denver Museum of Nature & Science"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Stegosaurus_dorsal_plate_vascular.jpg/960px-Stegosaurus_dorsal_plate_vascular.jpg",
                "caption": "[🦴 Placas] Placa dérmica óssea pentagonal gigante com sulcos de vasos sanguíneos termorreguladores",
                "type": "skeleton",
                "category": "skeletal_view",
                "author": "Carnegie Museum of Natural History"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Stegosaurus_scale.svg/960px-Stegosaurus_scale.svg.png",
                "caption": "[⛏️ Escala] Proporções corporais volumétricas de Stegosaurus comparado ao humano (9 m)",
                "type": "fossil",
                "category": "fossil_view",
                "author": "Wikimedia Commons"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Stegosaurus_gular_armor_ossicles.jpg/960px-Stegosaurus_gular_armor_ossicles.jpg",
                "caption": "[⛏️ Armadura] Cota de malha dérmica com centenas de ossículos protegia a garganta vulnerável",
                "type": "fossil",
                "category": "fossil_view",
                "author": "Yale Peabody Museum"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Stegosaurus_Denver_Museum.jpg/960px-Stegosaurus_Denver_Museum.jpg",
                "caption": "[🦴 Museu] Montagem esquelética clássica no Denver Museum of Nature & Science",
                "type": "skeleton",
                "category": "skeletal_view",
                "author": "Denver Museum"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Stegosaurus_tooth_fossil.jpg/960px-Stegosaurus_tooth_fossil.jpg",
                "caption": "[💀 Dente] Dente diminuto em formato de folha serrilhada para triturar pteridófitas e samambaias",
                "type": "skull",
                "category": "skull_view",
                "author": "Museum of the Rockies"
            },
            {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Stegosaurus_Garden_Park_Quarry.jpg/960px-Stegosaurus_Garden_Park_Quarry.jpg",
                "caption": "[⛏️ Escavação] Sítio fóssil de Garden Park no Colorado de onde o holótipo de Marsh foi escavado",
                "type": "fossil",
                "category": "fossil_view",
                "author": "US Geological Survey"
            }
        ],
        "etymology": "Do grego 'stegos' (teto/telhado) e 'sauros' (lagarto) — 'lagarto telhado'.",
        "bio": "O Estegossauro é um dos dinossauros mais inconfundíveis da história da vida na Terra, famoso pela fileira dupla de placas ósseas triangulares verticais dispostas ao longo da coluna vertebral e pelos quatro espinhos de 90 cm ('thagomizer') na cauda usados para defesa mortal.",
        "curiosities": [
            "Seu cérebro pesava apenas cerca de 80 gramas, equivalente ao tamanho de uma noz.",
            "As placas ósseas dorsais não estavam ligadas à coluna, mas sim ancoradas na pele espessa do dorso.",
            "A cauda flexível com 4 espinhos pontiagudos perfurava ossos de carnívoros como o Alossauro.",
            "Sua garganta era protegida por uma 'cota de malha' de centenas de pequenos ossículos redondos."
        ],
        "expert": {
            "cladogram": [
                "Dinosauria",
                "Ornithischia",
                "Thyreophora",
                "Stegosauria",
                "Stegosaurus"
            ],
            "osteology": "Placas dérmicas achatadas sulcadas por leitos vasculares para termorregulação e exibição.",
            "biomechanics": "Vértebras caudais com grande amplitude lateral capazes de desferir golpes letais de mais de 40 km/h.",
            "histology": "Tecido ósseo esponjoso no interior das placas dérmicas com córtex mineralizado externo."
        },
        "occurrences_count": 55,
        "fossil_locations": "Estados Unidos (Colorado, Utah, Wyoming), Portugal",
        "is_custom_ingested": False
    }
]

# Mapeamento rápido por aliases normalizados
TAXA_BY_ALIAS: Dict[str, Dict[str, Any]] = {}
for entry in POPULAR_TAXA:
    for alias in entry.get("aliases", []):
        TAXA_BY_ALIAS[normalize_text(alias)] = entry
    TAXA_BY_ALIAS[normalize_text(entry["id"])] = entry
    TAXA_BY_ALIAS[normalize_text(entry["name"])] = entry
    if entry.get("scientific_name"):
        TAXA_BY_ALIAS[normalize_text(entry["scientific_name"])] = entry

def find_known_taxon(query: str) -> Optional[Dict[str, Any]]:
    """Finds matching pre-curated taxon by normalized query or fuzzy alias."""
    norm = normalize_text(query)
    if not norm:
        return None
    
    # 1. Exact alias match
    if norm in TAXA_BY_ALIAS:
        return TAXA_BY_ALIAS[norm]
    
    # 2. Substring match
    for alias_norm, entry in TAXA_BY_ALIAS.items():
        if len(norm) >= 3 and (norm in alias_norm or alias_norm in norm):
            return entry
            
    return None


def build_specimen_from_known(data: Dict[str, Any]) -> Specimen:
    """Instantiates a complete, verified Specimen from curated data."""
    gallery_objs = [
        GalleryItem(
            url=g["url"],
            caption=g.get("caption", "Representação do espécime"),
            type=g.get("type", "living_specimen"),
            category=g.get("category", "life_view"),
            author=g.get("author", "Wikimedia Commons")
        )
        for g in data.get("gallery", [])
    ]

    expert_raw = data.get("expert", {})
    expert_obj = ExpertData(
        cladogram=expert_raw.get("cladogram", []),
        osteology=expert_raw.get("osteology", ""),
        biomechanics=expert_raw.get("biomechanics", ""),
        histology=expert_raw.get("histology", "")
    )

    return Specimen(
        id=data["id"],
        name=data["name"],
        genus=data.get("genus", data["name"]),
        scientific_name=data.get("scientific_name", data["name"]),
        era=data["era"],
        era_display=data["era_display"],
        period=data["period"],
        epoch=data.get("epoch", ""),
        geological_range=data.get("geological_range", data["period"]),
        group=data["group"],
        group_display=data["group_display"],
        diet=data["diet"],
        diet_display=data["diet_display"],
        habitat=data.get("habitat", "terrestre"),
        skeletal_type=data.get("skeletal_type", "vertebrado"),
        skeletal_composition=data.get("skeletal_composition", "Osso e Cartilagem"),
        is_contemporary=data.get("is_contemporary", False),
        conservation_status=data.get("conservation_status", "Espécie Vivente"),
        length=data.get("length", "Em estudo"),
        height=data.get("height", "Em estudo"),
        weight=data.get("weight", "Em estudo"),
        speed=data.get("speed", "Em estudo"),
        bite_force=data.get("bite_force", "Em estudo"),
        image_url=data["image_url"],
        image_caption=data.get("image_caption", data["name"]),
        gallery=gallery_objs,
        etymology=data.get("etymology", ""),
        bio=data.get("bio", ""),
        curiosities=data.get("curiosities", []),
        expert=expert_obj,
        occurrences_count=data.get("occurrences_count", len(data.get("coordinates", []))),
        fossil_locations=data.get("fossil_locations", "Distribuição Global"),
        is_custom_ingested=True
    )


def estimate_biometrics_by_group(group: str, diet: str, habitat: str, name: str) -> Dict[str, str]:
    """Provides realistic anatomical measurements for any animal group when specific numbers are missing."""
    n = name.lower()
    if "tubar" in n:
        return {"length": "3.5 – 5.0 m", "height": "0.9 m", "weight": "400 – 900 kg", "speed": "35 – 45 km/h", "bite_force": "3.500 – 6.000 N"}
    if "baleia" in n:
        return {"length": "14.0 – 22.0 m", "height": "3.5 m", "weight": "30.000 – 60.000 kg", "speed": "25 – 35 km/h", "bite_force": "Inofensivo (Filtrador)" if ("azul" in n or "jubarte" in n) else "18.000 N"}
    if "elefante" in n or "mamute" in n:
        return {"length": "5.5 – 7.0 m", "height": "3.2 – 3.8 m", "weight": "4.500 – 6.500 kg", "speed": "35 – 40 km/h", "bite_force": "2.500 N"}
    if "lobo" in n or "cao" in n or "cão" in n or "cachorro" in n:
        return {"length": "1.1 – 1.5 m", "height": "0.7 – 0.85 m", "weight": "30 – 60 kg", "speed": "50 – 65 km/h", "bite_force": "1.800 – 2.800 N"}
    if "gato" in n or "felino" in n or "lince" in n:
        return {"length": "0.6 – 0.9 m", "height": "0.3 – 0.45 m", "weight": "5 – 15 kg", "speed": "45 – 55 km/h", "bite_force": "450 – 800 N"}
    if "aguia" in n or "águia" in n or "gaviao" in n or "gavião" in n or "falcao" in n or "falcão" in n:
        return {"length": "0.7 – 0.95 m (Envergadura: 1.9 – 2.3 m)", "height": "0.8 m", "weight": "3.5 – 6.5 kg", "speed": "160 – 300 km/h", "bite_force": "Garras: 2.500 – 3.500 N"}
    if "crocodilo" in n or "jacare" in n or "jacaré" in n:
        return {"length": "4.0 – 5.5 m", "height": "0.6 m", "weight": "400 – 750 kg", "speed": "28 – 32 km/h (água)", "bite_force": "18.000 – 25.000 N"}
    if "pterossauro" in group or "pterodactilo" in n or "pteranodon" in n:
        return {"length": "1.5 – 3.0 m (Envergadura: 3.5 – 7.0 m)", "height": "1.2 m", "weight": "15 – 35 kg", "speed": "65 – 85 km/h", "bite_force": "350 – 800 N"}
    if "dinossauro" in group:
        if diet == "carnivoro":
            return {"length": "8.0 – 11.5 m", "height": "3.0 – 3.8 m", "weight": "2.500 – 5.500 kg", "speed": "30 – 40 km/h", "bite_force": "12.000 – 25.000 N"}
        else:
            return {"length": "12.0 – 25.0 m", "height": "4.5 – 10.0 m", "weight": "10.000 – 35.000 kg", "speed": "15 – 22 km/h", "bite_force": "1.500 – 3.000 N"}
    if "micro" in group or "bacteri" in n or "protozo" in group:
        return {"length": "10 – 150 µm (micrômetros)", "height": "5 – 40 µm", "weight": "0.05 – 2 nanogramas", "speed": "0.1 – 2.0 mm/s", "bite_force": "Fagocitose / Absorção osmótica"}
    
    if habitat == "aquatico":
        return {"length": "1.2 – 2.5 m", "height": "0.5 m", "weight": "40 – 150 kg", "speed": "30 – 45 km/h", "bite_force": "800 – 2.000 N"}
    return {"length": "1.0 – 1.8 m", "height": "0.6 – 1.1 m", "weight": "35 – 95 kg", "speed": "40 – 60 km/h", "bite_force": "1.000 – 2.500 N"}


COORDINATES_REGISTRY: Dict[str, List[Dict[str, Any]]] = {
    "leao": [
        {
            "lat": -2.33,
            "lng": 34.83,
            "locality": "Parque Nacional do Serengeti",
            "country": "Tanzânia",
            "formation": "Savana Africana",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": 21.12,
            "lng": 70.82,
            "locality": "Parque Nacional da Floresta de Gir (Leão-asiático)",
            "country": "Índia (Gujarat)",
            "formation": "Santuário de Vida Selvagem",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": -24.01,
            "lng": 31.49,
            "locality": "Parque Nacional Kruger",
            "country": "África do Sul",
            "formation": "Savana e Bosques",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": -19.25,
            "lng": 23.35,
            "locality": "Delta do Okavango",
            "country": "Botsuana",
            "formation": "Zonas Húmidas do Kalahari",
            "age_str": "Vivente (GBIF)"
        }
    ],
    "gato": [
        {
            "lat": 31.2,
            "lng": 30.0,
            "locality": "Delta do Baixo Nilo (Berço da Domesticação)",
            "country": "Egito",
            "formation": "Bacia do Mediterrâneo",
            "age_str": "Vivente Cosmopolita"
        },
        {
            "lat": 35.15,
            "lng": 33.3,
            "locality": "Shillourokambos (Sítio Neolítico)",
            "country": "Chipre",
            "formation": "Associação Pré-Histórica com Humanos",
            "age_str": "9.500 anos atrás"
        },
        {
            "lat": -23.55,
            "lng": -46.63,
            "locality": "Habitats Urbanos e Domésticos",
            "country": "Brasil / Global",
            "formation": "Ecossistema Cosmopolita Antropogênico",
            "age_str": "Vivente Cosmopolita"
        }
    ],
    "elefante": [
        {
            "lat": -18.6,
            "lng": 24.5,
            "locality": "Parque Nacional de Chobe (Maior Densidade de Elefantes)",
            "country": "Botsuana",
            "formation": "Bacia do Rio Zambeze",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": -3.35,
            "lng": 38.0,
            "locality": "Parque Nacional Tsavo Leste/Oeste",
            "country": "Quênia",
            "formation": "Savanas Semiáridas",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": -24.0,
            "lng": 31.5,
            "locality": "Parque Nacional Kruger",
            "country": "África do Sul",
            "formation": "Savana Arbórea",
            "age_str": "Vivente (GBIF)"
        }
    ],
    "aguia-real": [
        {
            "lat": 56.5,
            "lng": -4.5,
            "locality": "Terras Altas da Escócia (Highlands)",
            "country": "Reino Unido",
            "formation": "Falésias e Montanhas Caledonianas",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": 44.42,
            "lng": -110.58,
            "locality": "Parque Nacional de Yellowstone",
            "country": "Estados Unidos (Wyoming)",
            "formation": "Montanhas Rochosas",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": 46.5,
            "lng": 8.5,
            "locality": "Cordilheira dos Alpes Centrais",
            "country": "Suíça / Áustria",
            "formation": "Picos e Maciços Alpinos",
            "age_str": "Vivente (GBIF)"
        }
    ],
    "tubarao-martelo": [
        {
            "lat": 0.6,
            "lng": -90.5,
            "locality": "Arco de Darwin & Ilha Wolf (Grandes Cardumes)",
            "country": "Equador (Galápagos)",
            "formation": "Montes Submarinos Oceânicos",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": 5.53,
            "lng": -87.05,
            "locality": "Parque Nacional Ilha do Coco",
            "country": "Costa Rica",
            "formation": "Cordilheira Submarina do Coco",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": -23.8,
            "lng": 35.5,
            "locality": "Praia do Tofo",
            "country": "Moçambique",
            "formation": "Corredor Pelágico do Canal de Moçambique",
            "age_str": "Vivente (GBIF)"
        }
    ],
    "alossauro": [
        {
            "lat": 39.32,
            "lng": -110.85,
            "locality": "Cleveland-Lloyd Dinosaur Quarry",
            "country": "Estados Unidos (Utah)",
            "formation": "Formação Morrison",
            "age_str": "152 Ma (Jurássico)"
        },
        {
            "lat": 44.5,
            "lng": -108.0,
            "locality": "Bighorn Basin (Howe Quarry)",
            "country": "Estados Unidos (Wyoming)",
            "formation": "Formação Morrison",
            "age_str": "150 Ma (Jurássico)"
        },
        {
            "lat": 40.44,
            "lng": -109.3,
            "locality": "Dinosaur National Monument",
            "country": "Estados Unidos (Utah/Colorado)",
            "formation": "Formação Morrison",
            "age_str": "151 Ma (Jurássico)"
        },
        {
            "lat": 39.2,
            "lng": -9.3,
            "locality": "Lourinhã (Allosaurus europaeus)",
            "country": "Portugal",
            "formation": "Formação Lourinhã",
            "age_str": "150 Ma (Jurássico Superior)"
        }
    ],
    "pterodactilo": [
        {
            "lat": 48.9,
            "lng": 11.2,
            "locality": "Solnhofen Limestone (Eichstätt & Solnhofen)",
            "country": "Alemanha (Baviera)",
            "formation": "Formação Altmühltal",
            "age_str": "150.8 – 148.5 Ma (Jurássico Superior)"
        },
        {
            "lat": 48.8,
            "lng": 11.45,
            "locality": "Kelheim / Nusplingen",
            "country": "Alemanha (Baviera)",
            "formation": "Calcário Litográfico Solnhofen",
            "age_str": "150 Ma (Jurássico Superior)"
        }
    ],
    "crocodilo-do-nilo": [
        {
            "lat": -27.8,
            "lng": 32.5,
            "locality": "Parque de Zonas Húmidas de iSimangaliso",
            "country": "África do Sul",
            "formation": "Estuário de Santa Lúcia",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": 24.0,
            "lng": 32.9,
            "locality": "Lago Nasser / Rio Nilo",
            "country": "Egito",
            "formation": "Bacia Hidrográfica do Nilo",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": -1.3,
            "lng": 35.1,
            "locality": "Rio Mara (Travessia da Grande Migração)",
            "country": "Quênia (Masai Mara)",
            "formation": "Bacia do Rio Mara",
            "age_str": "Vivente (GBIF)"
        }
    ],
    "livyatan-melvillei": [
        {
            "lat": -14.1,
            "lng": -75.7,
            "locality": "Cerro Colorado (Deserto de Ocucaje)",
            "country": "Peru (Bacia de Pisco)",
            "formation": "Formação Pisco",
            "age_str": "9.9 – 8.9 Ma (Mioceno)"
        }
    ],
    "estegossauro": [
        {
            "lat": 40.44,
            "lng": -109.3,
            "locality": "Dinosaur Quarry (Dinosaur National Monument)",
            "country": "Estados Unidos (Utah)",
            "formation": "Formação Morrison",
            "age_str": "155 – 150 Ma (Jurássico)"
        },
        {
            "lat": 39.5,
            "lng": -105.2,
            "locality": "Morrison (Garden Park Quarry)",
            "country": "Estados Unidos (Colorado)",
            "formation": "Formação Morrison",
            "age_str": "152 Ma (Jurássico)"
        }
    ],
    "lobo": [
        {
            "lat": 44.42,
            "lng": -110.58,
            "locality": "Parque Nacional de Yellowstone (Alcateias Reintroduzidas)",
            "country": "Estados Unidos (Wyoming)",
            "formation": "Ecorregião das Rochosas do Norte",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": 62.0,
            "lng": 15.0,
            "locality": "Taiga Escandinava",
            "country": "Suécia / Noruega",
            "formation": "Floresta Boreal",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": 42.0,
            "lng": -6.5,
            "locality": "Serra da Culebra (Lobo-ibérico)",
            "country": "Espanha (Castela e Leão)",
            "formation": "Bosques e Matagais Mediterrânicos",
            "age_str": "Vivente (GBIF)"
        }
    ],
    "baleia-azul": [
        {
            "lat": -64.8,
            "lng": -63.5,
            "locality": "Península Antártica",
            "country": "Oceano Austral",
            "formation": "Zona Pelágica",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": 50.2,
            "lng": -128.5,
            "locality": "Ilha de Vancouver",
            "country": "Canadá / Pacífico Norte",
            "formation": "Águas Costeiras",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": 66.5,
            "lng": -18.2,
            "locality": "Costa da Islândia",
            "country": "Atlântico Norte",
            "formation": "Águas Subpolares",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": -32.0,
            "lng": 115.0,
            "locality": "Perth Canyon",
            "country": "Austrália Ocidental",
            "formation": "Oceano Índico",
            "age_str": "Vivente (GBIF)"
        }
    ],
    "onca-pintada": [
        {
            "lat": -16.5,
            "lng": -56.5,
            "locality": "Pantanal Norte (Poconé)",
            "country": "Brasil (Mato Grosso)",
            "formation": "Bioma Pantanal",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": -3.1,
            "lng": -60.0,
            "locality": "Bacia do Rio Negro",
            "country": "Brasil (Amazonas)",
            "formation": "Floresta Amazônica",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": -25.6,
            "lng": -54.4,
            "locality": "Parque Nacional do Iguaçu",
            "country": "Brasil (Paraná)",
            "formation": "Mata Atlântica",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": 18.5,
            "lng": -89.5,
            "locality": "Reserva de Calakmul",
            "country": "México (Campeche)",
            "formation": "Selva Maia",
            "age_str": "Vivente (GBIF)"
        }
    ],
    "polvo-comum": [
        {
            "lat": 36.5,
            "lng": -6.3,
            "locality": "Golfo de Cádis",
            "country": "Espanha / Mediterrâneo",
            "formation": "Zona Bentônica Costeira",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": -23.0,
            "lng": -44.3,
            "locality": "Baía de Ilha Grande",
            "country": "Brasil (Rio de Janeiro)",
            "formation": "Recifes e Costões",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": 34.5,
            "lng": 135.0,
            "locality": "Mar Interior de Seto",
            "country": "Japão",
            "formation": "Substrato Rochoso",
            "age_str": "Vivente (GBIF)"
        }
    ],
    "tubarao-branco": [
        {
            "lat": -34.6,
            "lng": 19.4,
            "locality": "Gansbaai / Dyer Island",
            "country": "África do Sul",
            "formation": "Águas Costeiras Temperadas",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": -35.1,
            "lng": 136.1,
            "locality": "Ilhas Neptune",
            "country": "Austrália do Sul",
            "formation": "Plataforma Continental",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": 37.8,
            "lng": -123.0,
            "locality": "Ilhas Farallon",
            "country": "Estados Unidos (Califórnia)",
            "formation": "Pacífico Oriental",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": 29.0,
            "lng": -118.3,
            "locality": "Ilha Guadalupe",
            "country": "México (Baja California)",
            "formation": "Águas Oceânicas Claras",
            "age_str": "Vivente (GBIF)"
        }
    ],
    "anomalocaris": [
        {
            "lat": 51.4,
            "lng": -116.5,
            "locality": "Burgess Shale (Fossil Ridge)",
            "country": "Canadá (Colúmbia Britânica)",
            "formation": "Formação Stephen",
            "age_str": "508 Ma (Cambriano)"
        },
        {
            "lat": 39.3,
            "lng": -113.3,
            "locality": "House Range",
            "country": "Estados Unidos (Utah)",
            "formation": "Formação Wheeler",
            "age_str": "505 Ma (Cambriano)"
        },
        {
            "lat": 24.8,
            "lng": 102.9,
            "locality": "Biota de Chengjiang",
            "country": "China (Yunnan)",
            "formation": "Folhelho Maotianshan",
            "age_str": "518 Ma (Cambriano)"
        }
    ],
    "arthropleura": [
        {
            "lat": 55.9,
            "lng": -3.2,
            "locality": "Craigentinny & Edimburgo",
            "country": "Escócia",
            "formation": "Midland Valley Coal",
            "age_str": "315 Ma (Carbonífero)"
        },
        {
            "lat": 50.4,
            "lng": 3.8,
            "locality": "Bacia Huller / Nord-Pas-de-Calais",
            "country": "França / Bélgica",
            "formation": "Camadas de Carvão",
            "age_str": "310 Ma (Carbonífero)"
        },
        {
            "lat": 41.3,
            "lng": -88.3,
            "locality": "Mazon Creek",
            "country": "Estados Unidos (Illinois)",
            "formation": "Formação Francis Creek",
            "age_str": "307 Ma (Carbonífero)"
        }
    ],
    "basilosaurus": [
        {
            "lat": 29.3,
            "lng": 30.0,
            "locality": "Wadi Al-Hitan (Vale das Baleias)",
            "country": "Egito (Faiyum)",
            "formation": "Formação Birket Qarun",
            "age_str": "40 - 35 Ma (Eoceno)"
        },
        {
            "lat": 31.8,
            "lng": -88.2,
            "locality": "Condado de Choctaw",
            "country": "Estados Unidos (Alabama)",
            "formation": "Formação Jackson",
            "age_str": "38 Ma (Eoceno)"
        },
        {
            "lat": 32.3,
            "lng": -90.2,
            "locality": "Bacia do Rio Pearl",
            "country": "Estados Unidos (Mississippi)",
            "formation": "Formação Moodys Branch",
            "age_str": "37 Ma (Eoceno)"
        }
    ],
    "brachiosaurus": [
        {
            "lat": 39.1,
            "lng": -108.6,
            "locality": "Grand River Valley (Fruita)",
            "country": "Estados Unidos (Colorado)",
            "formation": "Formação Morrison",
            "age_str": "154 - 150 Ma (Jurássico)"
        },
        {
            "lat": 40.4,
            "lng": -109.3,
            "locality": "Dinosaur National Monument",
            "country": "Estados Unidos (Utah)",
            "formation": "Formação Morrison",
            "age_str": "152 Ma (Jurássico)"
        },
        {
            "lat": 42.8,
            "lng": -106.3,
            "locality": "Como Bluff / Bone Cabin Quarry",
            "country": "Estados Unidos (Wyoming)",
            "formation": "Formação Morrison",
            "age_str": "150 Ma (Jurássico)"
        }
    ],
    "charnia": [
        {
            "lat": 52.7,
            "lng": -1.3,
            "locality": "Floresta de Charnwood",
            "country": "Inglaterra (Leicestershire)",
            "formation": "Formação Bradgate",
            "age_str": "570 - 560 Ma (Ediacarano)"
        },
        {
            "lat": 46.6,
            "lng": -53.2,
            "locality": "Mistaken Point",
            "country": "Canadá (Terra Nova)",
            "formation": "Formação Drook / Conception",
            "age_str": "565 Ma (Ediacarano)"
        },
        {
            "lat": 65.5,
            "lng": 39.5,
            "locality": "Costa de Zimnii Bereg (Mar Branco)",
            "country": "Rússia (Arkhangelsk)",
            "formation": "Formação Ust-Pinega",
            "age_str": "555 Ma (Ediacarano)"
        }
    ],
    "dickinsonia": [
        {
            "lat": -31.4,
            "lng": 138.4,
            "locality": "Ediacara Hills (Nilpena)",
            "country": "Austrália do Sul",
            "formation": "Arenito Pound",
            "age_str": "555 Ma (Ediacarano)"
        },
        {
            "lat": 65.6,
            "lng": 40.2,
            "locality": "Península de Onega",
            "country": "Rússia (Mar Branco)",
            "formation": "Formação Erga",
            "age_str": "558 Ma (Ediacarano)"
        },
        {
            "lat": 51.2,
            "lng": 27.5,
            "locality": "Podolia",
            "country": "Ucrânia",
            "formation": "Série Mogilev",
            "age_str": "550 Ma (Ediacarano)"
        }
    ],
    "dimetrodon": [
        {
            "lat": 33.8,
            "lng": -99.4,
            "locality": "Seymour / Red Beds",
            "country": "Estados Unidos (Texas)",
            "formation": "Grupo Clear Fork",
            "age_str": "285 Ma (Permiano)"
        },
        {
            "lat": 35.2,
            "lng": -97.5,
            "locality": "Condado de Cleveland",
            "country": "Estados Unidos (Oklahoma)",
            "formation": "Formação Garber",
            "age_str": "280 Ma (Permiano)"
        },
        {
            "lat": 50.8,
            "lng": 10.5,
            "locality": "Bromacker Quarry (Floresta da Turíngia)",
            "country": "Alemanha",
            "formation": "Formação Tambach",
            "age_str": "290 Ma (Permiano)"
        }
    ],
    "dunkleosteus": [
        {
            "lat": 41.5,
            "lng": -81.7,
            "locality": "Cleveland / Rocky River",
            "country": "Estados Unidos (Ohio)",
            "formation": "Folhelho Cleveland",
            "age_str": "360 Ma (Devoniano)"
        },
        {
            "lat": 31.2,
            "lng": -4.3,
            "locality": "Tafilalt / Bacia de Draa",
            "country": "Marrocos",
            "formation": "Estratos Kellwasser",
            "age_str": "365 Ma (Devoniano)"
        },
        {
            "lat": 50.7,
            "lng": 7.2,
            "locality": "Maciço Renano",
            "country": "Alemanha",
            "formation": "Calcário de Bergisch Gladbach",
            "age_str": "365 Ma (Devoniano)"
        }
    ],
    "gorgonops": [
        {
            "lat": -32.3,
            "lng": 22.5,
            "locality": "Bacia do Karoo (Beaufort West)",
            "country": "África do Sul",
            "formation": "Grupo Beaufort (Zona Tropidostoma)",
            "age_str": "255 Ma (Permiano)"
        },
        {
            "lat": -9.5,
            "lng": 34.0,
            "locality": "Bacia do Rio Ruhuhu",
            "country": "Tanzânia",
            "formation": "Formação Usili",
            "age_str": "256 Ma (Permiano)"
        },
        {
            "lat": -13.1,
            "lng": 31.8,
            "locality": "Vale do Rio Luangwa",
            "country": "Zâmbia",
            "formation": "Formação Madumabisa Mudstone",
            "age_str": "255 Ma (Permiano)"
        }
    ],
    "mammuthus": [
        {
            "lat": 71.0,
            "lng": 149.0,
            "locality": "Península de Yamal / Rio Kolyma",
            "country": "Rússia (Sibéria)",
            "formation": "Permafrost / Pleistoceno",
            "age_str": "40.000 - 4.000 anos"
        },
        {
            "lat": 71.2,
            "lng": -179.5,
            "locality": "Ilha de Wrangel",
            "country": "Rússia (Ártico)",
            "formation": "Refúgio Holoceno Tardio",
            "age_str": "4.000 anos (Extinção)"
        },
        {
            "lat": 64.0,
            "lng": -139.4,
            "locality": "Dawson City (Klondike)",
            "country": "Canadá (Yukon)",
            "formation": "Camadas de Cascalho Dourado",
            "age_str": "30.000 anos"
        },
        {
            "lat": 43.4,
            "lng": -103.5,
            "locality": "Mammoth Site (Hot Springs)",
            "country": "Estados Unidos (Dakota do Sul)",
            "formation": "Depósito de Sinkhole",
            "age_str": "26.000 anos"
        }
    ],
    "meganeura": [
        {
            "lat": 46.2,
            "lng": 2.9,
            "locality": "Commentry",
            "country": "França (Allier)",
            "formation": "Terreno Carbonífero de Commentry",
            "age_str": "300 Ma (Carbonífero)"
        },
        {
            "lat": 53.0,
            "lng": -2.2,
            "locality": "North Staffordshire Coalfield",
            "country": "Inglaterra",
            "formation": "Upper Coal Measures",
            "age_str": "305 Ma (Carbonífero)"
        }
    ],
    "megatherium": [
        {
            "lat": -19.6,
            "lng": -43.9,
            "locality": "Grutas de Lagoa Santa",
            "country": "Brasil (Minas Gerais)",
            "formation": "Depósito Cársico Pleistocênico",
            "age_str": "12.000 anos"
        },
        {
            "lat": -38.0,
            "lng": -57.5,
            "locality": "Mar del Plata / Rio Quequén",
            "country": "Argentina (Pampas)",
            "formation": "Formação Miramar",
            "age_str": "100.000 anos"
        },
        {
            "lat": -8.8,
            "lng": -42.5,
            "locality": "Serra da Capivara",
            "country": "Brasil (Piauí)",
            "formation": "Grutas e Abrigamentos",
            "age_str": "15.000 anos"
        },
        {
            "lat": -30.0,
            "lng": -51.2,
            "locality": "Uruguaiana / Touro Passo",
            "country": "Brasil (Rio Grande do Sul)",
            "formation": "Formação Touro Passo",
            "age_str": "13.000 anos"
        }
    ],
    "mosasaurus": [
        {
            "lat": 50.8,
            "lng": 5.7,
            "locality": "Monte São Pedro (Maastricht)",
            "country": "Holanda / Bélgica",
            "formation": "Formação Maastricht",
            "age_str": "66 Ma (Cretáceo)"
        },
        {
            "lat": 40.3,
            "lng": -74.2,
            "locality": "Condado de Monmouth",
            "country": "Estados Unidos (Nova Jersey)",
            "formation": "Formação Navesink",
            "age_str": "68 Ma (Cretáceo)"
        },
        {
            "lat": 32.2,
            "lng": -7.9,
            "locality": "Bacia de Ganntour (Benguerir)",
            "country": "Marrocos",
            "formation": "Fosfatos Cretáceos",
            "age_str": "67 Ma (Cretáceo)"
        }
    ],
    "opabinia": [
        {
            "lat": 51.4,
            "lng": -116.5,
            "locality": "Burgess Shale (Walcott Quarry)",
            "country": "Canadá (Colúmbia Britânica)",
            "formation": "Formação Stephen",
            "age_str": "508 Ma (Cambriano)"
        }
    ],
    "megalodon": [
        {
            "lat": 32.8,
            "lng": -79.9,
            "locality": "Charleston / Cooper River",
            "country": "Estados Unidos (Carolina do Sul)",
            "formation": "Formação Hawthorne",
            "age_str": "15 Ma (Mioceno)"
        },
        {
            "lat": 38.5,
            "lng": -76.5,
            "locality": "Calvert Cliffs",
            "country": "Estados Unidos (Maryland)",
            "formation": "Formação Calvert",
            "age_str": "14 Ma (Mioceno)"
        },
        {
            "lat": 36.7,
            "lng": -6.0,
            "locality": "Bacia do Guadalquivir",
            "country": "Espanha (Andaluzia)",
            "formation": "Depósitos Neógenos",
            "age_str": "10 Ma (Mioceno)"
        },
        {
            "lat": -21.8,
            "lng": 114.1,
            "locality": "Península de North West Cape",
            "country": "Austrália Ocidental",
            "formation": "Calcário Cape Range",
            "age_str": "12 Ma (Mioceno)"
        },
        {
            "lat": 35.5,
            "lng": 139.5,
            "locality": "Chiba / Banto River",
            "country": "Japão",
            "formation": "Grupo Miura",
            "age_str": "8 Ma (Mioceno)"
        }
    ],
    "purussaurus": [
        {
            "lat": -9.9,
            "lng": -67.8,
            "locality": "Rio Acre / Rio Purus",
            "country": "Brasil (Acre)",
            "formation": "Formação Solimões",
            "age_str": "8 Ma (Mioceno Superior)"
        },
        {
            "lat": -7.5,
            "lng": -72.7,
            "locality": "Alto Rio Juruá",
            "country": "Brasil (Acre)",
            "formation": "Formação Solimões",
            "age_str": "8 Ma (Mioceno)"
        },
        {
            "lat": -3.7,
            "lng": -73.2,
            "locality": "Iquitos / Rio Amazonas",
            "country": "Peru (Loreto)",
            "formation": "Formação Pebas",
            "age_str": "10 Ma (Mioceno)"
        },
        {
            "lat": 10.7,
            "lng": -70.7,
            "locality": "Urumaco",
            "country": "Venezuela (Falcón)",
            "formation": "Formação Urumaco",
            "age_str": "9 Ma (Mioceno)"
        }
    ],
    "quetzalcoatlus": [
        {
            "lat": 29.3,
            "lng": -103.3,
            "locality": "Big Bend National Park",
            "country": "Estados Unidos (Texas)",
            "formation": "Formação Javelina",
            "age_str": "68 Ma (Cretáceo)"
        },
        {
            "lat": 30.1,
            "lng": -103.8,
            "locality": "Brewster County",
            "country": "Estados Unidos (Texas)",
            "formation": "Formação Javelina",
            "age_str": "67 Ma (Cretáceo)"
        }
    ],
    "smilodon": [
        {
            "lat": -19.6,
            "lng": -44.0,
            "locality": "Gruta da Lapinha (Peter Lund)",
            "country": "Brasil (Minas Gerais)",
            "formation": "Depósitos Cársicos de Lagoa Santa",
            "age_str": "10.000 anos"
        },
        {
            "lat": -34.6,
            "lng": -58.4,
            "locality": "Rio Luján / Pampas",
            "country": "Argentina (Buenos Aires)",
            "formation": "Formação Luján",
            "age_str": "12.000 anos"
        },
        {
            "lat": 34.1,
            "lng": -118.4,
            "locality": "Rancho La Brea Tar Pits",
            "country": "Estados Unidos (Califórnia)",
            "formation": "Poços de Asfalto La Brea",
            "age_str": "15.000 anos"
        },
        {
            "lat": -5.0,
            "lng": -39.0,
            "locality": "Quixeramobim / Ceará",
            "country": "Brasil (Ceará)",
            "formation": "Tanques Paleontológicos",
            "age_str": "11.000 anos"
        }
    ],
    "spinosaurus": [
        {
            "lat": 28.3,
            "lng": 28.9,
            "locality": "Oásis de Bahariya",
            "country": "Egito (Deserto Ocidental)",
            "formation": "Formação Bahariya",
            "age_str": "95 Ma (Cretáceo)"
        },
        {
            "lat": 31.0,
            "lng": -3.9,
            "locality": "Leitos Kem Kem (Taouz)",
            "country": "Marrocos (Tafilalt)",
            "formation": "Formação Kem Kem",
            "age_str": "95 Ma (Cretáceo)"
        },
        {
            "lat": 33.1,
            "lng": 10.4,
            "locality": "Chenini / Tataouine",
            "country": "Tunísia",
            "formation": "Formação Chenini",
            "age_str": "100 Ma (Cretáceo)"
        }
    ],
    "spriggina": [
        {
            "lat": -31.4,
            "lng": 138.4,
            "locality": "Ediacara Hills (Flinders Ranges)",
            "country": "Austrália do Sul",
            "formation": "Arenito Pound",
            "age_str": "550 Ma (Ediacarano)"
        },
        {
            "lat": 65.5,
            "lng": 39.5,
            "locality": "Rio Zimnaya Zolotitsa",
            "country": "Rússia (Mar Branco)",
            "formation": "Formação Verkhovka",
            "age_str": "555 Ma (Ediacarano)"
        }
    ],
    "tiktaalik": [
        {
            "lat": 76.8,
            "lng": -83.0,
            "locality": "Ilha Ellesmere (Nunavut)",
            "country": "Canadá (Ártico)",
            "formation": "Formação Fram",
            "age_str": "375 Ma (Devoniano)"
        }
    ],
    "titanoboa": [
        {
            "lat": 11.1,
            "lng": -72.6,
            "locality": "Mina de Carvão de Cerrejón",
            "country": "Colômbia (La Guajira)",
            "formation": "Formação Cerrejón",
            "age_str": "60 - 58 Ma (Paleoceno)"
        }
    ],
    "triceratops": [
        {
            "lat": 47.5,
            "lng": -106.2,
            "locality": "Hell Creek (Jordan)",
            "country": "Estados Unidos (Montana)",
            "formation": "Formação Hell Creek",
            "age_str": "68 - 66 Ma (Cretáceo)"
        },
        {
            "lat": 43.5,
            "lng": -104.5,
            "locality": "Lance Creek",
            "country": "Estados Unidos (Wyoming)",
            "formation": "Formação Lance",
            "age_str": "67 Ma (Cretáceo)"
        },
        {
            "lat": 51.5,
            "lng": -112.7,
            "locality": "Drumheller / Red Deer River",
            "country": "Canadá (Alberta)",
            "formation": "Formação Scollard",
            "age_str": "66 Ma (Cretáceo)"
        },
        {
            "lat": 39.7,
            "lng": -105.0,
            "locality": "Denver Basin (Golden)",
            "country": "Estados Unidos (Colorado)",
            "formation": "Formação Denver",
            "age_str": "68 Ma (Cretáceo)"
        }
    ],
    "tyrannosaurus": [
        {
            "lat": 47.5,
            "lng": -106.2,
            "locality": "Hell Creek (Garfield County)",
            "country": "Estados Unidos (Montana)",
            "formation": "Formação Hell Creek (Holótipo)",
            "age_str": "68 - 66 Ma (Cretáceo)"
        },
        {
            "lat": 43.5,
            "lng": -104.5,
            "locality": "Niobrara County (Lance Creek)",
            "country": "Estados Unidos (Wyoming)",
            "formation": "Formação Lance",
            "age_str": "67 Ma (Cretáceo)"
        },
        {
            "lat": 45.4,
            "lng": -101.4,
            "locality": "Faith (Sue Holótipo)",
            "country": "Estados Unidos (Dakota do Sul)",
            "formation": "Formação Hell Creek",
            "age_str": "67 Ma (Cretáceo)"
        },
        {
            "lat": 49.0,
            "lng": -106.0,
            "locality": "Frenchman River (Scotty)",
            "country": "Canadá (Saskatchewan)",
            "formation": "Formação Frenchman",
            "age_str": "66 Ma (Cretáceo)"
        }
    ],
    "velociraptor": [
        {
            "lat": 44.1,
            "lng": 103.7,
            "locality": "Flaming Cliffs (Bayn Dzak)",
            "country": "Mongólia (Deserto de Gobi)",
            "formation": "Formação Djadochta",
            "age_str": "75 - 71 Ma (Cretáceo)"
        },
        {
            "lat": 43.5,
            "lng": 101.5,
            "locality": "Tugriken Shireh (Fóssil Lutador)",
            "country": "Mongólia (Deserto de Gobi)",
            "formation": "Formação Djadochta",
            "age_str": "73 Ma (Cretáceo)"
        },
        {
            "lat": 41.8,
            "lng": 107.0,
            "locality": "Baía Mandahu (Mongólia Interior)",
            "country": "China",
            "formation": "Formação Bayan Mandahu",
            "age_str": "75 Ma (Cretáceo)"
        }
    ],
    "tardigrado": [
        {
            "lat": -77.8,
            "lng": 166.7,
            "locality": "McMurdo Dry Valleys",
            "country": "Antártica",
            "formation": "Sedimentos Criogênicos Polares",
            "age_str": "Vivente Cosmopolita"
        },
        {
            "lat": 28.0,
            "lng": 86.9,
            "locality": "Himalaia (Acima de 6.000m)",
            "country": "Nepal",
            "formation": "Musgos e Liquens Alpinos",
            "age_str": "Vivente Cosmopolita"
        },
        {
            "lat": 11.3,
            "lng": 142.2,
            "locality": "Fossa das Marianas (10.000m)",
            "country": "Oceano Pacífico",
            "formation": "Zona Hadal Abissal",
            "age_str": "Vivente Cosmopolita"
        },
        {
            "lat": -3.1,
            "lng": -60.0,
            "locality": "Dossel da Amazônia",
            "country": "Brasil",
            "formation": "Biofilmes e Briófitas",
            "age_str": "Vivente Cosmopolita"
        }
    ],
    "estromatolito-cianobacteria": [
        {
            "lat": -26.1,
            "lng": 114.2,
            "locality": "Shark Bay (Hamelin Pool)",
            "country": "Austrália Ocidental",
            "formation": "Estromatólitos Vivos / Hipersalinos",
            "age_str": "Vivente Contemporâneo"
        },
        {
            "lat": -21.3,
            "lng": 119.8,
            "locality": "Cráton de Pilbara (Apex Chert)",
            "country": "Austrália",
            "formation": "Formação Dresser",
            "age_str": "3.480 Ma (Arqueano)"
        },
        {
            "lat": 65.1,
            "lng": -50.0,
            "locality": "Cinturão de Rochas Verdes de Isua",
            "country": "Groenlândia",
            "formation": "Formação Isua",
            "age_str": "3.700 Ma (Arqueano)"
        },
        {
            "lat": -25.8,
            "lng": 31.0,
            "locality": "Cinturão de Barberton",
            "country": "África do Sul",
            "formation": "Supergrupo Swaziland",
            "age_str": "3.200 Ma (Arqueano)"
        }
    ],
    "paramecium": [
        {
            "lat": 51.5,
            "lng": -0.1,
            "locality": "Bacias e Lagoas de Água Doce",
            "country": "Inglaterra / Europa",
            "formation": "Ecossistema Límnico",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": 40.7,
            "lng": -74.0,
            "locality": "Zonas Úmidas Continentais",
            "country": "Estados Unidos",
            "formation": "Sedimento Orgânico",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": -23.5,
            "lng": -46.6,
            "locality": "Represas e Riachos",
            "country": "Brasil (São Paulo)",
            "formation": "Plâncton de Água Doce",
            "age_str": "Vivente (GBIF)"
        }
    ],
    "ameba-proteus": [
        {
            "lat": 45.4,
            "lng": 9.2,
            "locality": "Charcos e Sedimentos Límnicos",
            "country": "Itália / Europa",
            "formation": "Biofilme de Detritos Orgânicos",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": -15.8,
            "lng": -47.9,
            "locality": "Veredas e Lagoas do Cerrado",
            "country": "Brasil (Distrito Federal)",
            "formation": "Vegetação Aquática",
            "age_str": "Vivente (GBIF)"
        },
        {
            "lat": 35.7,
            "lng": 139.7,
            "locality": "Lagos e Charcos de Água Doce",
            "country": "Japão",
            "formation": "Substrato Límnico",
            "age_str": "Vivente (GBIF)"
        }
    ],
    "nummulites": [
        {
            "lat": 29.98,
            "lng": 31.13,
            "locality": "Platô de Gizé (Calcário das Pirâmides)",
            "country": "Egito",
            "formation": "Formação Mokattam",
            "age_str": "45 Ma (Eoceno)"
        },
        {
            "lat": 48.85,
            "lng": 2.35,
            "locality": "Bacia de Paris",
            "country": "França",
            "formation": "Calcário Lutetiano Grossier",
            "age_str": "48 Ma (Eoceno)"
        },
        {
            "lat": 42.0,
            "lng": 2.0,
            "locality": "Pireneus Catalães (Vic)",
            "country": "Espanha",
            "formation": "Margas e Calcários Eocênicos",
            "age_str": "42 Ma (Eoceno)"
        }
    ],
    "diatomacea": [
        {
            "lat": -54.8,
            "lng": -68.3,
            "locality": "Canal de Beagle / Antártica",
            "country": "Argentina / Chile",
            "formation": "Fitoplâncton Marinho Frígido",
            "age_str": "Vivente Cosmopolita"
        },
        {
            "lat": 37.0,
            "lng": -122.0,
            "locality": "Baía de Monterey",
            "country": "Estados Unidos (Pacífico)",
            "formation": "Depósitos de Diatomita",
            "age_str": "Mioceno ao Vivente"
        },
        {
            "lat": -12.0,
            "lng": -77.0,
            "locality": "Ressurgência de Humboldt",
            "country": "Peru",
            "formation": "Sedimentos Biogênicos Sílicos",
            "age_str": "Vivente (GBIF)"
        }
    ],
    "pithovirus": [
        {
            "lat": 69.5,
            "lng": 161.5,
            "locality": "Bacia do Rio Kolyma (Aneykovsky Yar)",
            "country": "Rússia (Nordeste da Sibéria)",
            "formation": "Permafrost Yedoma (30m de profundidade)",
            "age_str": "30.000 anos (Pleistoceno Superior)"
        }
    ]
}

def get_curated_occurrences(taxon_id_or_name: str) -> List[Occurrence]:
    """Returns real 3D coordinates for the specimen from known taxa or the global coordinates registry."""
    norm = normalize_text(taxon_id_or_name)
    slug = norm.replace(" ", "-")

    # 1. Check known taxa first
    known = find_known_taxon(norm)
    if known and "coordinates" in known:
        return [
            Occurrence(
                lat=c["lat"],
                lng=c["lng"],
                country=c.get("country", "Global"),
                formation=c.get("formation", c.get("locality", "Localidade")),
                early_age=c.get("early_age"),
                late_age=c.get("late_age"),
                collection_name=c.get("age_str", "Ocorrência catalogada"),
                is_contemporary=known.get("is_contemporary", False)
            )
            for c in known["coordinates"]
        ]

    # 2. Check COORDINATES_REGISTRY
    raw_list = COORDINATES_REGISTRY.get(norm) or COORDINATES_REGISTRY.get(slug)
    if not raw_list:
        for k, coords in COORDINATES_REGISTRY.items():
            if k in norm or norm in k or k in slug or slug in k:
                raw_list = coords
                break

    if raw_list:
        return [
            Occurrence(
                lat=c["lat"],
                lng=c["lng"],
                country=c.get("country", "Global"),
                formation=c.get("formation", c.get("locality", "Localidade")),
                early_age=c.get("early_age"),
                late_age=c.get("late_age"),
                collection_name=c.get("age_str", "Ocorrência catalogada"),
                is_contemporary="vivente" in c.get("age_str", "").lower() or "gbif" in c.get("age_str", "").lower()
            )
            for c in raw_list
        ]

    return []
