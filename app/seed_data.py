from app.models import Specimen, GalleryItem, ExpertData
from app.database import upsert_specimen, init_db
import logging

logger = logging.getLogger(__name__)

SEED_SPECIMENS = [
    # =========================================================================
    # ERA CONTEMPORÂNEA / FAUNA ATUAL (Holoceno - Presente)
    # =========================================================================
    Specimen(
        id="onca-pintada",
        name="Onça-Pintada",
        genus="Panthera",
        scientific_name="Panthera onca (Linnaeus, 1758)",
        era="contemporaneo",
        era_display="Contemporâneo (Fauna Atual)",
        period="Holoceno / Atualidade",
        epoch="Época Contemporânea",
        geological_range="Presente (Espécie Vivente)",
        group="mamifero-megafauna",
        group_display="Mamífero Carnívoro (Felídeo)",
        diet="carnivoro",
        diet_display="Superpredador Carnívoro das Américas",
        habitat="terrestre",
        skeletal_type="vertebrado",
        skeletal_composition="Endoesqueleto Ósseo Articulado e Cartilagem",
        is_contemporary=True,
        conservation_status="Quase Ameaçada (NT)",
        length="1.7 a 2.4 m (com cauda)",
        height="75 cm nos ombros",
        weight="80 a 140 kg",
        speed="80 km/h (Arrancada explosiva)",
        bite_force="9.000 N (Capaz de perfurar cascos de tartarugas e crânios)",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Chapultepec_Zoo_-_Jaguar_%2802%29.jpg/960px-Chapultepec_Zoo_-_Jaguar_%2802%29.jpg",
        image_caption="Onça-pintada adulta em seu habitat natural",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Chapultepec_Zoo_-_Jaguar_%2802%29.jpg/960px-Chapultepec_Zoo_-_Jaguar_%2802%29.jpg",
                caption="[🌿 Indivíduo em Vida] Onça-pintada em pelagem clássica com rosetas",
                type="living_specimen",
                category="life_view",
                author="Museo de Zoología"
            ),
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Panthera_onca_skull.jpg/960px-Panthera_onca_skull.jpg",
                caption="[🦴 Esqueleto / Crânio] Crânio ósseo ultra-robusto com caninos perfurantes",
                type="skull",
                category="skeletal_view",
                author="Museu de História Natural"
            ),
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Jaguar_%28Panthera_onca_palustris%29_male_Rio_Negro_2.JPG/960px-Jaguar_%28Panthera_onca_palustris%29_male_Rio_Negro_2.JPG",
                caption="[🌿 Indivíduo em Vida] Macho pantaneiro nadando no Rio Negro (Brasil)",
                type="living_specimen",
                category="life_view",
                author="Charles J. Sharp"
            )
        ],
        etymology="Do tupi 'îagûara' (onça/fera que salta e mata com uma mordida). Nome científico 'Panthera' (latim) e 'onca' (português/espanhol).",
        bio="A onça-pintada é o maior felino de todo o continente americano e o terceiro maior do mundo, atrás apenas do tigre e do leão. Habita desde as florestas tropicais densas da Amazônia e os alagados do Pantanal até o Chaco e o Cerrado. Ao contrário de outros grandes felinos que matam por sufocamento traqueal, a onça-pintada emprega uma mordida óssea letal que perfura diretamente os ossos temporais e parietais do crânio da presa ou esmaga a carapaça dorsal dura de cágados e tartarugas.",
        curiosities=[
            "Possui a mordida mais potente entre todos os felinos do mundo em proporção à massa corporal, superando leões e tigres.",
            "É uma nadadora extraordinária, caçando jacarés, ariranhas e peixes de grande porte dentro de rios profundos.",
            "É a única espécie do gênero Panthera nativa das Américas.",
            "Seus caninos são tão curtos e grossos que conseguem perfurar o couro blindado de jacarés e o casco rígido de quelônios."
        ],
        expert=ExpertData(
            cladogram=["Metazoa", "Chordata", "Vertebrata", "Mammalia", "Carnivora", "Felidae", "Pantherinae", "Panthera", "Panthera onca"],
            osteology="Endoesqueleto ósseo compacto com coluna vertebral extremamente flexível. Crânio curto e arredondado com crista sagital proeminente para ancoragem dos músculos temporais. Arco zigomático hipertrofiado conferindo abertura mandibular de alto torque.",
            biomechanics="Alavanca mandibular classe III de alta eficiência mecânica, capaz de gerar pressão de cisalhamento pontual superior a 9.000 Newtons sem risco de fratura sinfisária.",
            histology="Osso haversiano denso com alta densidade trabecular nos metápodes e úmero, adaptado para absorver choques de impacto na imobilização de presas pesadas."
        ),
        occurrences_count=143000,
        fossil_locations="América do Sul (Brasil - Pantanal, Amazônia, Mata Atlântica), América Central e México"
    ),
    Specimen(
        id="baleia-azul",
        name="Baleia-Azul",
        genus="Balaenoptera",
        scientific_name="Balaenoptera musculus (Linnaeus, 1758)",
        era="contemporaneo",
        era_display="Contemporâneo (Fauna Atual)",
        period="Holoceno / Atualidade",
        epoch="Época Contemporânea",
        geological_range="Presente (Espécie Vivente)",
        group="reptil-marinho",
        group_display="Mamífero Cetáceo Misticeto Gigante",
        diet="filtrador",
        diet_display="Filtrador de Krill e Zooplâncton",
        habitat="aquatico",
        skeletal_type="vertebrado",
        skeletal_composition="Endoesqueleto Ósseo Esponjoso Gigante e Cartilagem",
        is_contemporary=True,
        conservation_status="Em Perigo (EN)",
        length="26.0 a 30.5 m",
        height="Diâmetro corporal de 4.5 m",
        weight="150.000 a 190.000 kg (190 toneladas)",
        speed="35 a 50 km/h (Nado em arrancada)",
        bite_force="Filtragem hidrodinâmica com barbas de queratina",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Blue_whale_size.svg/960px-Blue_whale_size.svg.png",
        image_caption="Representação em vida da baleia-azul comparada à escala humana",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Blue_whale_size.svg/960px-Blue_whale_size.svg.png",
                caption="[🌿 Indivíduo em Vida] Reconstrução anatômica completa da baleia-azul",
                type="living_specimen",
                category="life_view",
                author="Kurzon"
            ),
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/BlueWhaleSkeleton.jpg/960px-BlueWhaleSkeleton.jpg",
                caption="[🦴 Esqueleto / Ossos] Esqueleto fóssil e osteológico montado ('Hope') no Museu de História Natural de Londres",
                type="skeleton",
                category="skeletal_view",
                author="Natural History Museum"
            )
        ],
        etymology="Do latim 'balaena' (baleia), 'pteron' (asa/nadadeira) e 'musculus' (musculoso/diminutivo de rato em tom irônico por Lineu).",
        bio="A baleia-azul é o maior animal que já existiu em toda a história do planeta Terra — superando com folga qualquer dinossauro que já existiu! Alcançando mais de 30 metros de comprimento e até 190 toneladas de massa corporal, seu coração tem o tamanho de um carro compacto e sua língua pesa tanto quanto um elefante adulto inteiro. Alimenta-se filtrando até 4 toneladas de pequenos crustáceos (krill) por dia através de centenas de placas flexíveis de barbatana feitas de queratina suspensas na mandíbula superior.",
        curiosities=[
            "É o maior animal de TODOS OS TEMPOS no planeta Terra, mais pesado que o Argentinosaurus e qualquer outro ser vivo da história.",
            "Sua língua pesa cerca de 4 toneladas (o peso de um elefante adulto) e seu coração pesa mais de 180 kg.",
            "Um bebê de baleia-azul ganha cerca de 90 kg de peso por dia apenas mamando leite materno rico em gordura.",
            "Seus cantos de baixa frequência submarinos alcançam 188 decibéis e podem viajar por milhares de quilômetros através do oceano."
        ],
        expert=ExpertData(
            cladogram=["Metazoa", "Chordata", "Vertebrata", "Mammalia", "Artiodactyla", "Cetacea", "Mysticeti", "Balaenopteridae", "Balaenoptera", "Balaenoptera musculus"],
            osteology="Crânio amplo achatado de até 6 metros com rostro curvo. Ausência total de dentes verdadeiros substituídos por 300 a 400 pares de barbanas queratinizadas de até 1 metro de comprimento. Mandíbula desprovida de sínfise óssea rígida (ligamento elástico fibroso móvel).",
            biomechanics="Mecanismo de 'engulfment feeding': abertura oral a 90 graus associada à expansão de pregas ventrais elásticas que ingerem até 90 toneladas de água e krill de uma só vez.",
            histology="Osso osteopênico vascular com ausência de sistema haversiano denso, preenchido por lipídios neutros para controle hidrostático de flutuabilidade neutra em águas pelágicas profundas."
        ),
        occurrences_count=85000,
        fossil_locations="Oceanos Globais (Antártica, Pacífico Norte, Atlântico Norte, Oceano Índico)"
    ),
    Specimen(
        id="tubarao-branco",
        name="Tubarão-Branco",
        genus="Carcharodon",
        scientific_name="Carcharodon carcharias (Linnaeus, 1758)",
        era="contemporaneo",
        era_display="Contemporâneo (Fauna Atual)",
        period="Holoceno / Atualidade",
        epoch="Época Contemporânea",
        geological_range="Presente (Espécie Vivente)",
        group="reptil-marinho",
        group_display="Chondrichthyes (Peixe Cartilaginoso)",
        diet="carnivoro",
        diet_display="Superpredador Pelágico Carnívoro",
        habitat="aquatico",
        skeletal_type="vertebrado",
        skeletal_composition="Cartilagem Calcificada (Sem Ossos Verdadeiros)",
        is_contemporary=True,
        conservation_status="Vulnerável (VU)",
        length="4.5 a 6.1 m",
        height="1.8 m (dorso)",
        weight="1.200 a 2.300 kg",
        speed="40 a 56 km/h (Ataque explosivo vertical)",
        bite_force="18.000 N",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/960px-White_shark.jpg",
        image_caption="Tubarão-branco em nado de patrulha oceânica",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/960px-White_shark.jpg",
                caption="[🌿 Indivíduo em Vida] Tubarão-branco adulto em águas costeiras",
                type="living_specimen",
                category="life_view",
                author="Terry Goss"
            ),
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Carcharodon_carcharias_skeleton_%28flipped%29.jpg/960px-Carcharodon_carcharias_skeleton_%28flipped%29.jpg",
                caption="[🦴 Esqueleto / Cartilagem] Esqueleto cartilaginoso completo preparado e mandíbulas",
                type="cartilage",
                category="skeletal_view",
                author="Museu de História Natural"
            )
        ],
        etymology="Do grego 'karcharos' (afiado/serrilhado) e 'odous' (dente), com 'carcharias' (tubarão). Descrito por Carl Linnaeus em 1758.",
        bio="O grande tubarão-branco é o mais icônico superpredador dos oceanos modernos. Como membro da classe Chondrichthyes, NÃO possui ossos verdadeiros: todo o seu esqueleto é formado por cartilagem elástica reforçada por prismas microscópicos de fosfato de cálcio (cartilagem prismática calcificada). Esta estrutura o torna leve e incrivelmente ágil na água. Possui eletrorrecepção através das ampolas de Lorenzini, detectando batimentos cardíacos de presas a centenas de metros de distância.",
        curiosities=[
            "NÃO tem ossos! Todo o seu esqueleto é feito 100% de cartilagem (o mesmo material do nariz e orelhas humanas), leve e altamente flexível.",
            "Possui até 300 dentes serrilhados em várias fileiras contínuas que se movem como esteiras rolantes, substituindo dentes perdidos ao longo da vida toda.",
            "Possui endotermia regional (mesotermia): consegue manter seus músculos de nado e estômago até 14 °C mais quentes que a água gelada do oceano.",
            "Detecta campos elétricos minúsculos de 1 bilionésimo de volt emitidos pelos batimentos cardíacos de animais escondidos na areia."
        ],
        expert=ExpertData(
            cladogram=["Metazoa", "Chordata", "Vertebrata", "Chondrichthyes", "Elasmobranchii", "Lamniformes", "Lamnidae", "Carcharodon", "Carcharodon carcharias"],
            osteology="Endoesqueleto cartilaginoso prismático tecidular calcificado ('areolar and tessellated calcification'). Mandíbula superior hiostílica frouxamente conectada ao condrocrânio, permitindo projeção anterior protátil durante o ataque.",
            biomechanics="Mecanismo de 'biting-burst': projeção palatoquadrada com depressão mandibular de 18.000 N associada a dentes triangulares com serrilhas de passo regular de 0.5 mm atuando como serra mecânica.",
            histology="Cartilagem hialina avascular cercada por pericôndrio fibroso denso. Dentes com polpa central vascularizada recoberta por dentina ortodentínica e camada externa hipermineralizada de esmaltoide (sem hidroxiapatita verdadeira)."
        ),
        occurrences_count=65000,
        fossil_locations="Oceanos Globais Tropicais e Temperados (África do Sul, Austrália, Califórnia, México, Mediterrâneo)"
    ),
    Specimen(
        id="polvo-comum",
        name="Polvo-Comum",
        genus="Octopus",
        scientific_name="Octopus vulgaris (Cuvier, 1797)",
        era="contemporaneo",
        era_display="Contemporâneo (Fauna Atual)",
        period="Holoceno / Atualidade",
        epoch="Época Contemporânea",
        geological_range="Presente (Espécie Vivente)",
        group="artropode-invertebrado",
        group_display="Molusco Invertebrado Cefalópode",
        diet="carnivoro",
        diet_display="Predador Carnívoro de Crustáceos e Peixes",
        habitat="aquatico",
        skeletal_type="invertebrado",
        skeletal_composition="Hidroesqueleto Muscular e Bico Quitinoso (Sem Ossos)",
        is_contemporary=True,
        conservation_status="Pouco Preocupante (LC)",
        length="80 cm a 1.2 m (envergadura de braços)",
        height="20 cm (manto)",
        weight="3.0 a 10.0 kg",
        speed="40 km/h (Propulsão por jato d'água em fuga)",
        bite_force="Bico córneo quitinoso com secreção neurotóxica",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Pulpo_com%C3%BAn_%28Octopus_vulgaris%29%2C_Parque_natural_de_la_Arr%C3%A1bida%2C_Portugal%2C_2020-07-21%2C_DD_33.jpg/960px-Pulpo_com%C3%BAn_%28Octopus_vulgaris%29%2C_Parque_natural_de_la_Arr%C3%A1bida%2C_Portugal%2C_2020-07-21%2C_DD_33.jpg",
        image_caption="Polvo-comum camuflado sobre recifes rochosos",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Pulpo_com%C3%BAn_%28Octopus_vulgaris%29%2C_Parque_natural_de_la_Arr%C3%A1bida%2C_Portugal%2C_2020-07-21%2C_DD_33.jpg/960px-Pulpo_com%C3%BAn_%28Octopus_vulgaris%29%2C_Parque_natural_de_la_Arr%C3%A1bida%2C_Portugal%2C_2020-07-21%2C_DD_33.jpg",
                caption="[🌿 Indivíduo em Vida] Octopus vulgaris em ambiente marinho natural",
                type="living_specimen",
                category="life_view",
                author="Diego Delso"
            ),
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Octopus_vulgaris_Merculiano.jpg/960px-Octopus_vulgaris_Merculiano.jpg",
                caption="[🔬 Anatomia Estrutural] Diagrama anatômico dos 8 braços, sifão e órgãos internos",
                type="anatomy",
                category="anatomy_view",
                author="G. Merculiano"
            )
        ],
        etymology="Do grego 'okto' (oito) e 'pous' (pés), com 'vulgaris' (comum). Descrito pelo pai da anatomia comparada Georges Cuvier em 1797.",
        bio="Octopus vulgaris é o ápice da inteligência entre todos os animais invertebrados da Terra. Como um molusco cefalópode sem concha externa ou esqueleto rígido, seu corpo é um hidroesqueleto muscular puro: consegue passar através de qualquer orifício desde que seu minúsculo bico quitinoso (a única parte sólida do corpo) consiga passar. Possui três corações, sangue azul à base de cobre (hemocianina) e um cérebro com mais de 500 milhões de neurônios, dos quais dois terços residem diretamente nos seus 8 braços táteis autônomos.",
        curiosities=[
            "É um INVERTEBRADO COMPLETO: não possui coluna vertebral nem ossos. Sua única estrutura rígida é um bico afiado parecido com o de um papagaio feito de quitina pura.",
            "Possui TRÊS corações e sangue azul: o oxigênio é transportado por hemocianina à base de cobre em vez de hemoglobina à base de ferro.",
            "Dois terços de todos os seus neurônios estão distribuídos nos próprios braços, permitindo que cada tentáculo 'pense', sinta sabores e decida de forma independente.",
            "Muda de cor, padrão e textura de pele em 200 milissegundos graças a milhares de células de pigmento chamadas cromatóforos controladas diretamente pelos nervos."
        ],
        expert=ExpertData(
            cladogram=["Metazoa", "Mollusca", "Invertebrata", "Cephalopoda", "Coleoidea", "Octopoda", "Incirrata", "Octopodidae", "Octopus", "Octopus vulgaris"],
            osteology="Sem tecido esquelético mineralizado (ausência total de ossos ou concha interna). Sustentação por hidrostato muscular (três arranjos ortogonais de fibras musculares: longitudinais, transversais e helicoidais). Bico bucal rígido de betaproteína e alfa-quitina densamente entrecruzada.",
            biomechanics="Locomoção multifuncional: rastejamento bipedal/polipedal com ventosas a vácuo operadas por esfíncteres musculares e propulsão a jato por ejeção forçada de água através do funil sifonal.",
            histology="Pele dérmica com arquitetura tricamada de cromatóforos elásticos, iridóforos refletores e leucóforos difusores, circundada por papilas musculares retráteis geradoras de camuflagem 3D."
        ),
        occurrences_count=42000,
        fossil_locations="Distribuição Cosmopolita em Mares Tropicais, Subtropicais e Temperados do Globo"
    ),

    # =========================================================================
    # PRÉ-CAMBRIANO / EDIACARANO (635 a 541 Ma)
    # =========================================================================
    Specimen(
        id="dickinsonia",
        name="Dickinsonia costata",
        genus="Dickinsonia",
        scientific_name="Dickinsonia costata (Sprigg, 1947)",
        era="precambriano",
        era_display="Pré-Cambriano",
        period="Ediacarano",
        epoch="Ediacarano Superior",
        geological_range="558 a 555 Ma",
        group="ediacarano",
        group_display="Biota Ediacarana (Metazoário Primitivo)",
        diet="filtrador",
        diet_display="Absorção Direta / Osmotrofia",
        habitat="bentonico",
        skeletal_type="invertebrado",
        skeletal_composition="Hidroesqueleto Compartimentado Flexível (Sem Ossos)",
        is_contemporary=False,
        conservation_status="Fóssil Extinto",
        length="4 mm a 1.4 m",
        height="~3 mm",
        weight="~50 g a 2.5 kg",
        speed="Rastejamento ultra-lento",
        bite_force="Inexistente (Sem mandíbula)",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Dickinsonia_costata.jpg/960px-Dickinsonia_costata.jpg",
        image_caption="Representação artística em vida de Dickinsonia sobre o leito marinho microbiano",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Dickinsonia_costata.jpg/960px-Dickinsonia_costata.jpg",
                caption="[🌿 Indivíduo em Vida] Reconstrução em vida no leito oceânico ediacarano",
                type="life_restoration",
                category="life_view",
                author="Nobu Tamura"
            ),
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/DickinsoniaCostata.jpg/960px-DickinsoniaCostata.jpg",
                caption="[🦴 Registro Fóssil] Molde fóssil preservado em arenito quartzítico da Austrália",
                type="fossil",
                category="skeletal_view",
                author="Museu da Austrália do Sul"
            )
        ],
        etymology="Homenagem a Ben Dickinson, diretor de minas da Austrália do Sul. Descrito por Reginald Sprigg em 1947.",
        bio="Dickinsonia é um dos mais fascinantes e misteriosos organismos da história da vida na Terra. Com formato oval achatado e padrão de câmaras acolchoadas em simetria de reflexão deslizante, habitava o fundo dos oceanos rasos do período Ediacarano. Em 2018, análises de biomarcadores lipídicos em fósseis russos do Mar Branco detectaram moléculas de colesterol intocado, provando cientificamente que Dickinsonia pertencia ao reino animal (Metazoa), sendo um dos animais mais antigos conhecidos pela ciência.",
        curiosities=[
            "Análises de biomarcadores de esteroides em 2018 confirmaram que possuía colesterol animal autêntico, encerrando décadas de debate sobre ser fungo ou alga.",
            "Possuía crescimento contínuo por adição de novos módulos corporais em uma das extremidades.",
            "Deixava 'marcas de descanso' no lodo marinho primitivo, sugerindo que conseguia se mover lentamente para se alimentar de tapetes bacterianos.",
            "Seu corpo não apresentava concha, ossos ou cutícula mineralizada, sobrevivendo em um oceano livre de grandes predadores carnívoros."
        ],
        expert=ExpertData(
            cladogram=["Biota Ediacarana", "Vendobionta", "Proarticulata", "Dipleurozoa", "Dickinsoniidae", "Dickinsonia costata"],
            osteology="Sem estruturas mineralizadas ou esqueleto ósseo. Corpo constituído de hidroesqueleto compartimentado com unidades modulares pneumatizadas (isômeros) dispostas em padrão alternado de simetria espelhada (glide reflection).",
            biomechanics="Alimentação por fagocitose ou osmotrofia através da superfície ventral em contato com esteiras microbianas. Sem apêndices locomotores especializados.",
            histology="Impressões tafonômicas em relevo negativo ou positivo sob filmes de tapetes microbianos ('Máscaras da Morte') preservadas em rochas siliciclásticas do Ediacarano."
        ),
        occurrences_count=42,
        fossil_locations="Austrália (Ediacara Hills), Rússia (Costa do Mar Branco), Ucrânia (Podólia)"
    ),

    # =========================================================================
    # PALEOZOICO (541 a 252 Ma)
    # =========================================================================
    Specimen(
        id="anomalocaris",
        name="Anomalocaris canadensis",
        genus="Anomalocaris",
        scientific_name="Anomalocaris canadensis (Whiteaves, 1892)",
        era="paleozoico",
        era_display="Paleozoico",
        period="Cambriano",
        epoch="Cambriano Série 3",
        geological_range="518 a 505 Ma",
        group="artropode-invertebrado",
        group_display="Artrópode Predador Primitivo",
        diet="carnivoro",
        diet_display="Superpredador Carnívoro",
        habitat="aquatico",
        skeletal_type="invertebrado",
        skeletal_composition="Exoesqueleto Cuticular Esclerotizado (Sem Ossos)",
        is_contemporary=False,
        conservation_status="Fóssil Extinto",
        length="60 cm a 1.0 m",
        height="15 cm",
        weight="~3 a 6 kg",
        speed="20 km/h (Nado ondulatório)",
        bite_force="350 N (Aparelho bucal radial)",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Anomalocaris_canadensis.png/960px-Anomalocaris_canadensis.png",
        image_caption="Representação em vida de Anomalocaris caçando nos mares cambrianos",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Anomalocaris_canadensis.png/960px-Anomalocaris_canadensis.png",
                caption="[🌿 Indivíduo em Vida] Reconstrução em vida de Anomalocaris canadensis",
                type="life_restoration",
                category="life_view",
                author="Katrina Kenny"
            ),
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/20191203_Anomalocaris_canadensis.png/960px-20191203_Anomalocaris_canadensis.png",
                caption="[🔬 Anatomia Estrutural] Apêndices raptoriais e lobos natatórios",
                type="anatomy",
                category="anatomy_view",
                author="Junnn11"
            )
        ],
        etymology="Do grego: 'camarão anômalo', devido aos apêndices frontais inicialmente confundidos com caudas de crustáceos. Descrito por Joseph Whiteaves em 1892.",
        bio="Anomalocaris foi o ápice incontestável da teia alimentar nos oceanos da Explosão Cambriana. Equipado com olhos compostos gigantes em hastes flexíveis (com mais de 16.000 lentes de omatídeos individuais), possuía uma acuidade visual superior à de quase todos os invertebrados vivos hoje. Movia-se graciosamente pelas águas ondulando lobos laterais flexíveis e capturava presas com dois apêndices articulados espinhosos, conduzindo-as a uma boca em formato de anel com lâminas dentadas concêntricas.",
        curiosities=[
            "Foi originalmente montado errado pelos primeiros cientistas: o apêndice frontal foi classificado como camarão, a boca como água-viva e o corpo como esponja-do-mar!",
            "Seus olhos compostos tinham 16.000 lentes individuais de omatídeos, dando-lhe visão binocular de altíssima resolução.",
            "Considerado o primeiro superpredador marinho de grande porte na história do planeta Terra.",
            "Fósseis de trilobitas cambrianos mostram marcas de mordidas curvas idênticas ao aparelho bucal de Anomalocaris."
        ],
        expert=ExpertData(
            cladogram=["Panarthropoda", "Radiodonta", "Anomalocarididae", "Anomalocaris", "Anomalocaris canadensis"],
            osteology="Exoesqueleto cuticular esclerotizado não mineralizado. Dois apêndices raptoriais anteriores com 14 podômeros espinhosos. Cone oral triradial com placas esclerotizadas.",
            biomechanics="Locomoção por nado ondulatório metacrônico através de 11 pares de lobos laterais imbricados, funcionando como hidrofólios eficientes com baixo custo metabólico.",
            histology="Preservação de tecidos moles excepcional do tipo 'Burgess Shale' por substituição de aluminossilicatos em folhelhos negros anóxicos."
        ),
        occurrences_count=65,
        fossil_locations="Canadá (Burgess Shale), Estados Unidos (Utah), China (Chengjiang)"
    ),
    Specimen(
        id="dunkleosteus",
        name="Dunkleosteus terrelli",
        genus="Dunkleosteus",
        scientific_name="Dunkleosteus terrelli (Newberry, 1873)",
        era="paleozoico",
        era_display="Paleozoico",
        period="Devoniano",
        epoch="Devoniano Superior (Famenniano)",
        geological_range="382 a 358 Ma",
        group="reptil-marinho",
        group_display="Peixe Placodermo Couraçado",
        diet="carnivoro",
        diet_display="Superpredador Carnívoro",
        habitat="aquatico",
        skeletal_type="vertebrado",
        skeletal_composition="Placas Dérmicas Ósseas Cefálicas e Esqueleto Cartilaginoso",
        is_contemporary=False,
        conservation_status="Fóssil Extinto",
        length="8.8 m",
        height="2.5 m",
        weight="3.600 a 4.000 kg",
        speed="30 km/h (Ataque explosivo)",
        bite_force="5.300 N nas pontas, 44.000 N/cm²",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Dunkleosteus_terrelli.png/960px-Dunkleosteus_terrelli.png",
        image_caption="Representação em vida de Dunkleosteus em águas costeiras devonianas",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Dunkleosteus_terrelli.png/960px-Dunkleosteus_terrelli.png",
                caption="[🌿 Indivíduo em Vida] Reconstrução em vida de Dunkleosteus terrelli",
                type="life_restoration",
                category="life_view",
                author="Katrina Kenny"
            ),
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Dunkleosteus_model.jpg/960px-Dunkleosteus_model.jpg",
                caption="[🦴 Esqueleto / Crânio] Armadura dérmica óssea e placas cortantes",
                type="skull",
                category="skeletal_view",
                author="Museu de História Natural de Cleveland"
            )
        ],
        etymology="Homenagem a David Dunkle, curador do Museu de Cleveland, mais o grego 'osteus' (osso). Espécie homenageia Jay Terrell.",
        bio="Dunkleosteus foi o titânico governante dos mares do Devoniano, a chamada 'Era dos Peixes'. Protegido por uma armadura de placas ósseas dérmicas de até 5 cm de espessura na cabeça e no tórax, não possuía dentes verdadeiros; em vez disso, suas mandíbulas formavam lâminas ósseas auto-afiáveis que se encaixavam com precisão de guilhotina. Seu sistema de quatro barras biomecânicas permitia escancarar a boca em 20 milissegundos, gerando sucção colossal que tragava tubarões primitivos inteiros antes de triturá-los.",
        curiosities=[
            "Abria a boca em 1/50 de segundo, criando um vórtice de vácuo hidrodinâmico que engolia presas inteiras.",
            "Sua força de mordida concentrada na ponta das lâminas alcançava 44.000 Newtons por centímetro quadrado, comparável ao T-Rex.",
            "As placas ósseas da mandíbula se afiavam sozinhas toda vez que ele fechava a boca, mantendo o corte sempre afiado.",
            "Fósseis de tubarões devonianos como Cladoselache são encontrados regurgitados em bolus fossilizados de Dunkleosteus."
        ],
        expert=ExpertData(
            cladogram=["Gnathostomata", "Placodermi", "Arthrodira", "Pachyosteomorphi", "Dunkleosteidae", "Dunkleosteus"],
            osteology="Escudo cefalotorácico com placas dérmicas suturadas por articulação ginglymus nucal móvel. Lâminas gnatocêntricas supragnatal anterior, posterior e inferognatal.",
            biomechanics="Mecanismo cinemático de articulação de 4 barras: elevação do crânio associada à depressão mandibular simultânea gerando 5.300 N de força pontual de cisalhamento.",
            histology="Osso laminar periósteo espesso sobre camada intermediária de tecido trabecular esponjoso vascularizado, com ausência de dentina verdadeira nas lâminas gnatócitas."
        ),
        occurrences_count=58,
        fossil_locations="Estados Unidos (Ohio, Cleveland Shale), Marrocos, Polônia, Bélgica"
    ),

    # =========================================================================
    # MESOZOICO (252 a 66 Ma)
    # =========================================================================
    Specimen(
        id="tyrannosaurus",
        name="Tyrannosaurus rex",
        genus="Tyrannosaurus",
        scientific_name="Tyrannosaurus rex (Osborn, 1905)",
        era="mesozoico",
        era_display="Mesozoico",
        period="Cretáceo",
        epoch="Cretáceo Superior (Maastrichtiano)",
        geological_range="68 a 66 Ma",
        group="dinossauro",
        group_display="Dinossauro Terópode",
        diet="carnivoro",
        diet_display="Superpredador Carnívoro",
        habitat="terrestre",
        skeletal_type="vertebrado",
        skeletal_composition="Endoesqueleto Ósseo Articulado e Pneumatizado",
        is_contemporary=False,
        conservation_status="Fóssil Extinto",
        length="12.3 a 12.8 m",
        height="3.8 a 4.0 m nos quadris",
        weight="8.400 a 9.500 kg",
        speed="27 km/h",
        bite_force="57.000 N (Esmagador de ossos)",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Tyrannosaurus_rex_by_mariolanzas.jpg/960px-Tyrannosaurus_rex_by_mariolanzas.jpg",
        image_caption="Representação em vida de Tyrannosaurus rex adulto em postura ativa",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Tyrannosaurus_rex_by_mariolanzas.jpg/960px-Tyrannosaurus_rex_by_mariolanzas.jpg",
                caption="[🌿 Indivíduo em Vida] Reconstrução em vida de T. rex com tegumento moderno",
                type="life_restoration",
                category="life_view",
                author="Mario Lanzas"
            ),
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Tyrannosaurus_Sue.jpg/960px-Tyrannosaurus_Sue.jpg",
                caption="[🦴 Esqueleto / Ossos] Esqueleto fóssil completo montado de 'Sue' (FMNH PR 2081)",
                type="skeleton",
                category="skeletal_view",
                author="The Field Museum"
            )
        ],
        etymology="Do grego 'tyrannos' (tirano) e 'sauros' (lagarto), com o latim 'rex' (rei). Descrito por Henry Fairfield Osborn em 1905.",
        bio="O rei dos lagartos tiranos foi o maior e mais avançado predador terrestre do final do Cretáceo na América do Norte. Ao contrário dos dinossauros carnívoros anteriores que cortavam carne, o T. rex desenvolveu dentes cônicos rombudos profundamente enraizados apelidados de 'bananas assassinas', desenhados para perfurar e estilhaçar ossos maciços de ceratopsídeos e hadrossauros com uma força de mordida estombante de 57.000 Newtons. Seus bulbos olfatórios gigantes e visão binocular ampla de 55 graus davam-lhe sentidos predatórios incomparáveis.",
        curiosities=[
            "Sua visão binocular com sobreposição estereoscópica de 55 graus superava a dos falcões modernos em percepção de profundidade.",
            "Possuía dentes de até 30 cm de comprimento que pulverizavam fêmures de Triceratops, absorvendo cálcio direto da medula óssea.",
            "Seus minúsculos braços de 1 metro podiam suportar mais de 200 kg cada um devido a tendões peitorais extremamente densos.",
            "O maior espécime conhecido ('Scotty', RSM P2523.8) pesava estimados 8.870 kg e viveu até os 32 anos de idade."
        ],
        expert=ExpertData(
            cladogram=["Dinosauria", "Theropoda", "Coelurosauria", "Tyrannosauroidea", "Tyrannosauridae", "Tyrannosaurus rex"],
            osteology="Crânio cinético rígido com fusão dos ossos nasais e frontais. Fenestra antorbital ampla com bolsa sinusóide neumatizada. Dentes ziphodontes com secção oval-cônica e serrilhas hiper-reforçadas.",
            biomechanics="Análise de Elementos Finitos (FEA) demonstra taxa de estresse de compressão craniana distribuída pela sutura frontoparietal em mordidas de 35 a 57 kN.",
            histology="Linhas de crescimento arrestado (LAGs) em cortes histológicos femorais indicam fase de crescimento exponencial dos 14 aos 18 anos com ganho de 2.1 kg/dia."
        ),
        occurrences_count=185,
        fossil_locations="Estados Unidos (Hell Creek, Lance Formation), Canadá (Saskatchewan, Alberta)"
    ),

    # =========================================================================
    # CENOZOICO PRÉ-HISTÓRICO (66 Ma a 10.000 anos)
    # =========================================================================
    Specimen(
        id="smilodon",
        name="Smilodon populator",
        genus="Smilodon",
        scientific_name="Smilodon populator (Lund, 1842)",
        era="cenozoico",
        era_display="Cenozoico Pré-Histórico",
        period="Pleistoceno Superior",
        epoch="Quaternário Pré-Histórico",
        geological_range="1.0 Ma a 10.000 anos",
        group="mamifero-megafauna",
        group_display="Felídeo Maquerodontíneo (Dente-de-Sabre)",
        diet="carnivoro",
        diet_display="Superpredador Carnívoro de Emboscada",
        habitat="terrestre",
        skeletal_type="vertebrado",
        skeletal_composition="Endoesqueleto Ósseo Articulado e Cartilagem",
        is_contemporary=False,
        conservation_status="Fóssil Extinto",
        length="2.2 a 2.6 m",
        height="1.2 a 1.3 m nos ombros",
        weight="350 a 436 kg",
        speed="45 km/h (Arrancada de emboscada)",
        bite_force="1.100 N na mandíbula + força cervical de sabre",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Smilodon_fatalis_Sergiodlarosa_with_a_white_background.png/960px-Smilodon_fatalis_Sergiodlarosa_with_a_white_background.png",
        image_caption="Representação em vida de Smilodon com suas garras e caninos hipertrofiados",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Smilodon_fatalis_Sergiodlarosa_with_a_white_background.png/960px-Smilodon_fatalis_Sergiodlarosa_with_a_white_background.png",
                caption="[🌿 Indivíduo em Vida] Reconstrução em vida de Smilodon mostrando musculatura anterior e sabres",
                type="life_restoration",
                category="life_view",
                author="Sergio de la Rosa"
            ),
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Smilodon_Knight.jpg/960px-Smilodon_Knight.jpg",
                caption="[🌿 Indivíduo em Vida] Paleoarte clássica de Smilodon em caçada",
                type="life_restoration",
                category="life_view",
                author="Charles R. Knight"
            )
        ],
        etymology="Do grego 'smilē' (faca/bisturi) e 'odous' (dente), com 'populator' (destruidor/saqueador). Descrito em Lagoa Santa (Minas Gerais, Brasil) pelo dinamarquês Peter Lund em 1842.",
        bio="Smilodon populator foi o maior e mais potente felino carnívoro de toda a história dos mamíferos, pesando mais de 430 kg de puro músculo concentrado no tórax e patas dianteiras. Descrito pioneiramente nas cavernas calcárias de Lagoa Santa, em Minas Gerais, reinou supremo na América do Sul durante o Pleistoceno. Ao contrário dos leões que usam sufocamento prolongado com a mordida, Smilodon imobilizava grandes presas como mastodontes e preguiças-gigantes com seus membros dianteiros hipertrofiados e desferia um golpe cirúrgico na traqueia e carótidas com seus sabres de 28 cm.",
        curiosities=[
            "Foi descoberto e descrito pela primeira vez no Brasil, em Lagoa Santa (Minas Gerais), pelo naturalista Peter Lund em 1842!",
            "Seus dentes caninos maxilares alcançavam 28 cm de comprimento, com bordas serrilhadas microscópicas afiadas como bisturis.",
            "Conseguia abrir a boca a um ângulo estarrecedor de 120 a 130 graus para conseguir usar seus caninos superiores longos.",
            "Pesava até 436 kg, superando em mais de 100 kg o maior tigre-siberiano moderno vivo."
        ],
        expert=ExpertData(
            cladogram=["Mammalia", "Carnivora", "Felidae", "Machairodontinae", "Smilodontini", "Smilodon populator"],
            osteology="Caninos maxilares comprimidos lateromedialmente com serrilhação ziphodonte. Processo mastoide hipertrofiado para inserção de poderosos músculos retos ventrais cervicais. Falanges ungueais retráteis massivas.",
            biomechanics="Mecanismo de 'canine shear-bite': os músculos cervicais puxavam a cabeça para baixo em golpe de adaga enquanto a mandíbula estabilizava a ferida contra a garganta da presa.",
            histology="Cortical óssea dos membros anteriores (úmero e rádio) com espessura radial hipertrofiada em relação ao fêmur, adaptada para suportar torção e impactos brutais na imobilização de megafauna."
        ),
        occurrences_count=175,
        fossil_locations="Brasil (Lagoa Santa - MG, Ceará, Bahia, Rio Grande do Sul), Argentina (Pampas), Uruguai, Estados Unidos (La Brea Tar Pits)"
    )
]


def seed_database():
    """Initializes the database and seeds iconic specimens across contemporary, geological and microbiological eras."""
    init_db()
    catalog_path = os.path.join(os.path.dirname(__file__), "static", "embedded_catalog.json")
    if os.path.exists(catalog_path):
        import json
        with open(catalog_path, "r", encoding="utf-8") as f:
            specs = json.load(f)
        for s in specs:
            upsert_specimen(Specimen(**s))
        logger.info(f"Database successfully seeded with {len(specs)} specimens from embedded_catalog.json.")
        return len(specs)
    else:
        seeded_count = 0
        for specimen in SEED_SPECIMENS:
            upsert_specimen(specimen)
            seeded_count += 1
        logger.info(f"Database successfully seeded with {seeded_count} specimens.")
        return seeded_count


if __name__ == "__main__":
    count = seed_database()
    print(f"Banco de dados semeado com {count} espécimes de todas as eras (incluindo contemporâneos)!")
