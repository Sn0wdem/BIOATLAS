from app.models import Specimen, GalleryItem, ExpertData
from app.database import upsert_specimen, init_db
import logging

logger = logging.getLogger(__name__)

SEED_SPECIMENS = [
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
        group_display="Biota Ediacarana",
        diet="filtrador",
        diet_display="Absorção Direta / Osmotrofia",
        habitat="bentonico",
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
                caption="Reconstrução em vida no leito oceânico ediacarano",
                type="life_restoration",
                author="Nobu Tamura"
            ),
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/DickinsoniaCostata.jpg/960px-DickinsoniaCostata.jpg",
                caption="Fóssil tipo preservado em arenito quartzítico da Austrália",
                type="fossil",
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
    Specimen(
        id="charnia",
        name="Charnia masoni",
        genus="Charnia",
        scientific_name="Charnia masoni (Ford, 1958)",
        era="precambriano",
        era_display="Pré-Cambriano",
        period="Ediacarano",
        epoch="Ediacarano Inferior a Superior",
        geological_range="570 a 555 Ma",
        group="ediacarano",
        group_display="Biota Ediacarana",
        diet="filtrador",
        diet_display="Osmotrofia / Filtrador Passivo",
        habitat="bentonico",
        length="15 cm a 2.0 m",
        height="Até 2.0 m ereto",
        weight="~300 g a 3 kg",
        speed="Séssil (Fixo ao substrato)",
        bite_force="Inexistente",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Charnia_masoni.jpg/960px-Charnia_masoni.jpg",
        image_caption="Representação em vida de Charnia ereta ancorada no fundo abissal",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Charnia_masoni.jpg/960px-Charnia_masoni.jpg",
                caption="Reconstrução artística de Charnia em vida no mar profundo",
                type="life_restoration",
                author="Nobu Tamura"
            )
        ],
        etymology="Nomeado em homenagem à floresta de Charnwood (Inglaterra) e ao estudante colegial Roger Mason, que descobriu o primeiro espécime em 1957.",
        bio="Charnia é um fóssil marco que revolucionou a paleontologia moderna: sua descoberta em Leicestershire provou pela primeira vez que formas de vida macroscópicas complexas existiram muito antes do período Cambriano. Com formato semelhante a uma fronde de samambaia, vivia ereta no fundo marinho, ancorada por um bulbo discoidal em águas profundas, muito abaixo da zona de penetração da luz solar, o que refuta que fosse uma planta ou alga fotossintetizante.",
        curiosities=[
            "Sua descoberta em 1957 por um garoto de 15 anos mudou a geologia mundial, demonstrando a existência de vida macroscópica no Pré-Cambriano.",
            "Vivia em ambientes marinhos afóticos profundos (onde a luz solar nunca chega), alimentando-se de nutrientes dissolvidos por osmotrofia passiva.",
            "Apresenta padrão de crescimento fractal auto-similar: cada ramo lateral replica a estrutura do ramo principal em miniatura.",
            "Alguns espécimes descobertos em Mistaken Point (Canadá) ultrapassam 2 metros de comprimento."
        ],
        expert=ExpertData(
            cladogram=["Biota Ediacarana", "Rangeomorpha", "Charniidae", "Charnia", "Charnia masoni"],
            osteology="Sem tecido mineralizado ou espículas calcárias/silicosas. Fronde quilar flexível com ramificações em 4 níveis de auto-similaridade fractal.",
            biomechanics="Morfologia hidrodinâmica projetada para minimizar arrasto de corrente laminar marinha profunda, maximizando área de superfície de absorção osmotrófica.",
            histology="Tafonomia do tipo 'Mistaken Point' (E-type): cinzas vulcânicas submarinas depositaram-se instantaneamente sobre os organismos vivos no fundo do oceano."
        ),
        occurrences_count=28,
        fossil_locations="Inglaterra (Charnwood Forest), Canadá (Mistaken Point, Terra Nova), Rússia"
    ),
    Specimen(
        id="spriggina",
        name="Spriggina floundersi",
        genus="Spriggina",
        scientific_name="Spriggina floundersi (Glaessner, 1958)",
        era="precambriano",
        era_display="Pré-Cambriano",
        period="Ediacarano",
        epoch="Ediacarano Superior",
        geological_range="555 Ma",
        group="ediacarano",
        group_display="Biota Ediacarana (Stem-Artrópode)",
        diet="filtrador",
        diet_display="Detritívoro / Microbívoro",
        habitat="bentonico",
        length="3 a 5 cm",
        height="~3 mm",
        weight="~5 a 15 g",
        speed="Rastejamento ativo bentônico",
        bite_force="Inexistente",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Spriggina_floundersi.jpg/960px-Spriggina_floundersi.jpg",
        image_caption="Representação em vida de Spriggina rastejando sobre as esteiras bacterianas",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Spriggina_floundersi.jpg/960px-Spriggina_floundersi.jpg",
                caption="Reconstrução em vida de Spriggina floundersi",
                type="life_restoration",
                author="Nobu Tamura"
            )
        ],
        etymology="Homenagem a Reginald Sprigg e ao colecionador Ben Flounders. Descrito por Martin Glaessner em 1958.",
        bio="Spriggina é uma das mais intrigantes criaturas do Ediacarano da Austrália do Sul. Com cerca de 3 a 5 cm, exibe um escudo cefálico anterior em formato de ferradura seguido por dezenas de segmentos corporais imbricados. Tradicionalmente considerada um dos primeiros animais bilaterais complexos móveis e um possível ancestral ou parente stem dos trilobitas e artrópodes.",
        curiosities=[
            "Foi um dos primeiros organismos da história da Terra a exibir cefalização (cabeça diferenciada do restante do corpo).",
            "Apresenta simetria de reflexão deslizante nos segmentos posteriores, similar a outros organismos ediacaranos.",
            "É o fóssil emblema oficial do estado da Austrália do Sul."
        ],
        expert=ExpertData(
            cladogram=["Biota Ediacarana", "Proarticulata", "Cephaloapiculata", "Sprigginidae", "Spriggina floundersi"],
            osteology="Escudo cefálico não mineralizado esclerotizado seguido por até 40 isômeros corporais com término afilado.",
            biomechanics="Locomoção por rastejamento ondular sobre substratos sedimentares cobertos por filmes microbianos.",
            histology="Preservação de moldes e contramoldes em arenitos de grão fino de Flinders Ranges."
        ),
        occurrences_count=22,
        fossil_locations="Austrália do Sul (Flinders Ranges, Ediacara Hills)"
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
                caption="Reconstrução em vida de Anomalocaris canadensis",
                type="life_restoration",
                author="Katrina Kenny"
            ),
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/20191203_Anomalocaris_canadensis.png/960px-20191203_Anomalocaris_canadensis.png",
                caption="Detalhe ventral mostrando apêndices raptoriais e lobos natatórios",
                type="life_restoration",
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
        fossil_locations="Canadá (Burgess Shale), Estados Unidos (Utah), China (Xisto de Maotianshan, Chengjiang)"
    ),
    Specimen(
        id="opabinia",
        name="Opabinia regalis",
        genus="Opabinia",
        scientific_name="Opabinia regalis (Walcott, 1912)",
        era="paleozoico",
        era_display="Paleozoico",
        period="Cambriano",
        epoch="Cambriano Médio",
        geological_range="505 Ma",
        group="artropode-invertebrado",
        group_display="Stem-Artrópode Enigmático",
        diet="carnivoro",
        diet_display="Predador Micro-Bentônico",
        habitat="aquatico",
        length="4 a 7 cm",
        height="1.5 cm",
        weight="~10 a 25 g",
        speed="10 km/h (Nado ondulatório)",
        bite_force="Pinça raptorial flexível",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Opabinia_regalis_life_restoration.png/960px-Opabinia_regalis_life_restoration.png",
        image_caption="Representação em vida de Opabinia com seus 5 olhos e probóscide flexível",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Opabinia_regalis_life_restoration.png/960px-Opabinia_regalis_life_restoration.png",
                caption="Reconstrução em vida de Opabinia regalis",
                type="life_restoration",
                author="Nobu Tamura"
            )
        ],
        etymology="Nomeado em homenagem a Opabin Pass e ao Monte Opabin, na Colúmbia Britânica (Canadá). Descrito por Charles Doolittle Walcott em 1912.",
        bio="Opabinia é uma das criaturas mais bizarras e famosas da Explosão Cambriana de Burgess Shale. Com corpo mole e segmentado, possuía CINCO olhos compostos pedunculados na cabeça para visão panorâmica em 360 graus e uma probóscide tubular flexível na frente da cabeça que terminava em uma pinça com garras, usada para capturar vermes e pequenas presas no lodo marinho e levá-las à boca voltada para trás sob a cabeça.",
        curiosities=[
            "Quando Charles Walcott descreveu Opabinia pela primeira vez, a comunidade científica achou que a reconstrução era uma piada de primeiro de abril devido à sua anatomia bizarra!",
            "Possuía exatamente 5 olhos na parte superior da cabeça.",
            "Sua probóscide longa e articulada funcionava como a tromba flexível de um elefante terminada em garras.",
            "Sua boca era voltada para trás sob o corpo, exigindo que a tromba dobrasse para alimentá-lo."
        ],
        expert=ExpertData(
            cladogram=["Panarthropoda", "Opabiniidae", "Opabinia", "Opabinia regalis"],
            osteology="Sem carapaça mineralizada. Corpo mole com 15 segmentos contendo lobos laterais e brânquias laminares dorsais. Probóscide pré-oral flexível.",
            biomechanics="Ondulação metacrônica de lobos laterais para propulsão pelágica e manipulação de presas por probóscide hidrostática.",
            histology="Preservação de Burgess Shale em filmes de carbono e aluminossilicato."
        ),
        occurrences_count=30,
        fossil_locations="Canadá (Burgess Shale, Colúmbia Britânica)"
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
                caption="Reconstrução em vida de Dunkleosteus terrelli",
                type="life_restoration",
                author="Katrina Kenny"
            ),
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Dunkleosteus_model.jpg/960px-Dunkleosteus_model.jpg",
                caption="Modelo anatômico da armadura cranial e placas cortantes",
                type="reconstruction",
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
    Specimen(
        id="tiktaalik",
        name="Tiktaalik roseae",
        genus="Tiktaalik",
        scientific_name="Tiktaalik roseae (Daeschler, Shubin & Jenkins, 2006)",
        era="paleozoico",
        era_display="Paleozoico",
        period="Devoniano",
        epoch="Devoniano Superior (Frasniano)",
        geological_range="375 Ma",
        group="peixe-primitivo",
        group_display="Sarcopterígeo / 'Peixápode' Transicional",
        diet="carnivoro",
        diet_display="Predador Anfíbio Piscívoro",
        habitat="anfibio",
        length="1.5 a 2.7 m",
        height="25 cm",
        weight="~40 a 70 kg",
        speed="15 km/h na água, rastejamento firme em terra",
        bite_force="1.200 N",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Tiktaalik_roseae_life_restoration.jpg/960px-Tiktaalik_roseae_life_restoration.jpg",
        image_caption="Representação em vida de Tiktaalik apoiando-se em terra com suas nadadeiras com pulsos",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Tiktaalik_roseae_life_restoration.jpg/960px-Tiktaalik_roseae_life_restoration.jpg",
                caption="Reconstrução em vida de Tiktaalik emergindo em margem fluvial devoniana",
                type="life_restoration",
                author="Zina Deretsky / National Science Foundation"
            )
        ],
        etymology="Da língua inuktitut: 'tiktaalik' significa 'peixe de água doce de grande porte (Lota lota)'. Descrito por Daeschler, Shubin e Jenkins em 2006.",
        bio="Tiktaalik é mundialmente celebrado como o fóssil de transição definitivo entre os peixes sarcopterígeos de nadadeiras lobadas e os primeiros tetrápodes terrestres de quatro patas. Encontrado na remota Ilha Ellesmere, no Ártico canadense, Tiktaalik possuía escamas e brânquias de peixe, mas apresentava inovações anatômicas revolucionárias: pescoço articulado móvel livre da cintura escapular, costelas robustas para suporte pulmonar e nadadeiras dianteiras com pulsos e dedos primitivos capazes de sustentar o corpo em terra firme.",
        curiosities=[
            "Foi o primeiro peixe na história da evolução a possuir pescoço articulado móvel, permitindo virar a cabeça sem mexer o resto do corpo.",
            "Possuía ossos homólogos ao nosso úmero, rádio, ulna e ossos do punho, permitindo realizar 'flexões de braço' no leito lamacento.",
            "Sua descoberta foi prevista com precisão matemática por Neil Shubin, que procurou exatamente em rochas fluviais de 375 Ma no Ártico.",
            "Respirava tanto por brânquias quanto por pulmões primitivos através de espiráculos dorsais na parte superior do crânio."
        ],
        expert=ExpertData(
            cladogram=["Sarcopterygii", "Tetrapodomorpha", "Elpistostegalia", "Tiktaalik", "Tiktaalik roseae"],
            osteology="Crânio achatado dorsoventralmente com perda do osso opérculo e extraescapular, conferindo pescoço móvel. Nadadeira peitoral com lepidotríquios envolvendo mesômeros homólogos a úmero, rádio, ulna e elementos carpais.",
            biomechanics="Nadadeiras peitorais capazes de adução e extensão com suporte de carga axial, permitindo propulsão bipedal anterior ou elevação do tronco acima da linha de água em águas rasas.",
            histology="Costelas expandidas imbricadas densamente osificadas, suportando cavidade celômica contra colapso sob gravidade em meio subaéreo."
        ),
        occurrences_count=18,
        fossil_locations="Canadá (Ilha Ellesmere, Nunavut - Formação Fram)"
    ),
    Specimen(
        id="meganeura",
        name="Meganeura monyi",
        genus="Meganeura",
        scientific_name="Meganeura monyi (Brongniart, 1885)",
        era="paleozoico",
        era_display="Paleozoico",
        period="Carbonífero",
        epoch="Carbonífero Superior (Gzheliano)",
        geological_range="305 a 299 Ma",
        group="artropode-invertebrado",
        group_display="Inseto Alado Meganeurídeo Gigante",
        diet="carnivoro",
        diet_display="Predador Alado de Invertebrados e Anfíbios",
        habitat="aereo",
        length="40 cm (corpo), 70 cm de envergadura",
        height="10 cm",
        weight="~450 g",
        speed="55 km/h (Voo acrobático)",
        bite_force="30 N (Mandíbulas mastigadoras)",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Meganeura_monyi.png/960px-Meganeura_monyi.png",
        image_caption="Representação em vida de Meganeura patrulhando as florestas do Carbonífero",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Meganeura_monyi.png/960px-Meganeura_monyi.png",
                caption="Reconstrução em vida de Meganeura monyi",
                type="life_restoration",
                author="Nobu Tamura"
            )
        ],
        etymology="Do grego 'megas' (grande) e 'neuron' (nervo/veia alar). Descrito por Charles Brongniart em 1885 em Commentry, França.",
        bio="Meganeura é o maior inseto predador alado de todos os tempos. Parente ancestral das libélulas modernas, sua envergadura ultrapassava 70 cm — o tamanho de um falcão moderno! Com olhos compostos gigantes e espinhos raptoriais nas pernas dianteiras, Meganeura caçava outros insetos, pequenos anfíbios e répteis primitivos em pleno ar sobre os pântanos do Carbonífero, beneficiando-se da altíssima densidade e dos 35% de oxigênio da época.",
        curiosities=[
            "Maior inseto predador alado já descoberto na história da Terra, com envergadura de 70 a 75 cm.",
            "Seu gigantismo foi impulsionado pelo oxigênio atmosférico de 35% no Carbonífero, facilitando a difusão gasosa através dos tubos traqueais.",
            "Caçava pequenos vertebrados tetrápodes além de insetos gigantes.",
            "Foi descoberta nas minas de carvão de Commentry, na França, em 1880."
        ],
        expert=ExpertData(
            cladogram=["Insecta", "Pterygota", "Odonatoptera", "Meganisoptera", "Meganeuridae", "Meganeura monyi"],
            osteology="Sem ossos internos. Exoesqueleto de quitina com asas rígidas reticuladas com venação densa de esclerotina.",
            biomechanics="Músculos de voo diretos ancorados à base das asas, operando batimentos assíncronos de alta potência com controle acrobático independente.",
            histology="Preservação de venação alar microscópica e lentes omatidiais em nódulos de siderita e folhelhos carbonosos."
        ),
        occurrences_count=20,
        fossil_locations="França (Commentry), Inglaterra, Estados Unidos"
    ),
    Specimen(
        id="arthropleura",
        name="Arthropleura armata",
        genus="Arthropleura",
        scientific_name="Arthropleura armata (Meyer, 1853)",
        era="paleozoico",
        era_display="Paleozoico",
        period="Carbonífero",
        epoch="Carbonífero Superior (Pensilvaniano)",
        geological_range="345 a 295 Ma",
        group="artropode-invertebrado",
        group_display="Miriápode Gigante",
        diet="herbivoro",
        diet_display="Detritívoro / Herbívoro de Licófitas",
        habitat="terrestre",
        length="2.5 a 2.6 m",
        height="40 cm",
        weight="~50 kg",
        speed="8 km/h",
        bite_force="800 N (Mandíbulas mastigadoras)",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Arthropleura_BW.jpg/960px-Arthropleura_BW.jpg",
        image_caption="Representação em vida de Arthropleura cruzando as florestas pantanosas de carvão",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Arthropleura_BW.jpg/960px-Arthropleura_BW.jpg",
                caption="Reconstrução em vida de Arthropleura gigante",
                type="life_restoration",
                author="Nobu Tamura"
            )
        ],
        etymology="Do grego: 'arthron' (articulado) e 'pleura' (lado/costela). Descrito por Hermann von Meyer em 1853.",
        bio="Arthropleura é o maior invertebrado terrestre que já caminhou sobre a Terra. Parente distante dos modernos piolhos-de-cobra e centopeias, este milípede descomunal alcançava mais de 2,6 metros de comprimento e pesava 50 kg. Prosperou nas imensas florestas equatoriais úmidas do Carbonífero, onde os níveis de oxigênio atmosférico chegavam a incríveis 35% (contra 21% atuais), permitindo que seu sistema respiratório traqueal sustentasse uma massa corporal gigantesca sem asfixia.",
        curiosities=[
            "Maior criatura invertebrada terrestre de toda a história da vida na Terra, com mais de 60 patas articuladas.",
            "Seu tamanho foi viabilizado pelos 35% de oxigênio atmosférico do Carbonífero e pela ausência de grandes predadores terrestres vertebrados.",
            "Pegadas fósseis de suas trilhas preservadas em rochas na Escócia chegam a 50 cm de largura de rastro contínuo.",
            "Extinguiu-se no início do Permiano quando o clima global secou e as florestas tropicais de carvão colapsaram."
        ],
        expert=ExpertData(
            cladogram=["Myriapoda", "Diplopoda", "Arthropleuridea", "Arthropleuridae", "Arthropleura", "Arthropleura armata"],
            osteology="Exoesqueleto cuticular composto de cerca de 30 tergitos dorsais trilobados, reforçados por compostos escleroproteicos e taninos orgânicos.",
            biomechanics="Locomoção multifásica através de dezenas de pares de pernas operando em ondas de propulsão metacrônicas coordenadas de baixo atrito.",
            histology="Estrutura de endocutícula densamente lamelada preservada em ambientes de sedimentação de pântanos carboníferos anóxicos."
        ),
        occurrences_count=35,
        fossil_locations="Inglaterra, Escócia, Alemanha, França, Estados Unidos (Pensilvânia e Novo México)"
    ),
    Specimen(
        id="dimetrodon",
        name="Dimetrodon grandis",
        genus="Dimetrodon",
        scientific_name="Dimetrodon grandis (Case, 1907)",
        era="paleozoico",
        era_display="Paleozoico",
        period="Permiano",
        epoch="Permiano Inferior (Cisuraliano)",
        geological_range="295 a 272 Ma",
        group="sinapsideo",
        group_display="Sinapsídeo / Ancestral dos Mamíferos",
        diet="carnivoro",
        diet_display="Superpredador Carnívoro",
        habitat="terrestre",
        length="3.5 a 4.0 m",
        height="1.6 m (com vela)",
        weight="250 kg",
        speed="25 km/h",
        bite_force="3.200 N",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Dimetrodon_TD.png/960px-Dimetrodon_TD.png",
        image_caption="Representação em vida de Dimetrodon caminhando sobre as planícies áridas do Permiano",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Dimetrodon_TD.png/960px-Dimetrodon_TD.png",
                caption="Reconstrução em vida de Dimetrodon grandis",
                type="life_restoration",
                author="Smokeybjb"
            ),
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Dimetrodon_grandis_3D_Model_Reconstruction.png/960px-Dimetrodon_grandis_3D_Model_Reconstruction.png",
                caption="Modelo anatômico 3D com postura de caminhada alta (high walk)",
                type="reconstruction",
                author="Museu de História Natural"
            )
        ],
        etymology="Do grego: 'duas medidas de dentes', aludindo à diferenciação de dentes caniniformes e pós-caninos. Descrito por Edward Drinker Cope em 1878.",
        bio="Embora seja frequentemente confundido com um dinossauro na cultura popular, Dimetrodon é na verdade um sinapsídeo pelicossauro, muito mais aparentado conosco, mamíferos, do que com os dinossauros ou lagartos! Sua característica mais marcante é a colossal vela dorsal sustentada por espinhas neurais alongadas irrigadas por vasos sanguíneos, que funcionava como um radiador biológico para termorregulação rápida, aquecendo-o sob o sol matinal para caçar presas ainda letárgicas.",
        curiosities=[
            "NÃO é um dinossauro! É um sinapsídeo primitivo pertencente à mesma linhagem que deu origem direta aos mamíferos.",
            "Possuía dentes diferenciados (incisivos, caninos rasgadores e trituradores), a primeira ocorrência evolutiva de heterodontia complexa.",
            "A grande vela dorsal continha rica rede vascular e canais que permitiam aquecer seu sangue sob o sol em tempo recorde.",
            "Viveu e foi extinto cerca de 40 milhões de anos ANTES do surgimento do primeiro dinossauro verdadeiro."
        ],
        expert=ExpertData(
            cladogram=["Synapsida", "Eupelycosauria", "Sphenacodontia", "Sphenacodontidae", "Dimetrodon", "Dimetrodon grandis"],
            osteology="Crânio alto e estreito com fenestra temporal única inferior. Espinhas neurais vertebrais hiperalongadas (até 1.5 m) com secção em haltere (figura de oito).",
            biomechanics="Mandíbula com dentes caniniformes serrilhados e côndilo articular mandibular rebaixado, conferindo mordida em tesoura veloz e cortante.",
            histology="Espinhas neurais com tecido ósseo vascular periosteal especializado sem canais de Havers lamelares, evidenciando função termorreguladora e de sinalização visual sexual."
        ),
        occurrences_count=112,
        fossil_locations="Estados Unidos (Texas - Red Beds, Oklahoma), Alemanha (Formação Tambach)"
    ),
    Specimen(
        id="gorgonops",
        name="Gorgonops torvus",
        genus="Gorgonops",
        scientific_name="Gorgonops torvus (Owen, 1876)",
        era="paleozoico",
        era_display="Paleozoico",
        period="Permiano",
        epoch="Permiano Superior (Lopingiano)",
        geological_range="260 a 254 Ma",
        group="sinapsideo",
        group_display="Terapsídeo Gorgonopsiano (Dente-de-Sabre do Permiano)",
        diet="carnivoro",
        diet_display="Superpredador Carnívoro Cursorial",
        habitat="terrestre",
        length="2.5 a 3.0 m",
        height="1.0 m",
        weight="250 a 300 kg",
        speed="35 km/h",
        bite_force="2.800 N + golpe de canino de 12 cm",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Gorgonops_torvus_life_restoration.png/960px-Gorgonops_torvus_life_restoration.png",
        image_caption="Representação em vida de Gorgonops torvus caçando nos desertos do Permiano Superior",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Gorgonops_torvus_life_restoration.png/960px-Gorgonops_torvus_life_restoration.png",
                caption="Reconstrução em vida de Gorgonops torvus",
                type="life_restoration",
                author="Dmitry Bogdanov"
            )
        ],
        etymology="Do grego 'Gorgona' (monstro mítico com olhar que petrifica) e 'ops' (face/olhar). Descrito por Richard Owen em 1876.",
        bio="Gorgonops foi o superpredador terrestre supremo do final do período Permiano, muito antes do surgimento dos dinossauros. Pertencente ao grupo dos terapsídeos (os chamados 'répteis parecidos com mamíferos'), foi o primeiro animal na história da evolução terrestre a desenvolver caninos gigantes em formato de sabre de até 12 cm. Suas patas dianteiras e traseiras eram dispostas quase verticalmente sob o corpo, conferindo uma postura ágil e marcha cursorial rápida para caçar répteis couraçados como Scutosaurus.",
        curiosities=[
            "Foi o primeiro predador da história da vida na Terra a desenvolver dentes de sabre, 250 milhões de anos antes do Smilodon!",
            "Já apresentava características mamíferas avançadas: postura mais ereta, mandíbula fundida e prováveis vibrissas sensoriais no focinho.",
            "Tinha caninos de 12 cm protegidos por flanges ósseas na mandíbula inferior quando a boca estava fechada.",
            "Foi extinto junto com 95% de todas as espécies marinhas e terrestres durante a Grande Extinção Permo-Triássica, a mais devastadora de todas."
        ],
        expert=ExpertData(
            cladogram=["Synapsida", "Therapsida", "Gorgonopsia", "Gorgonopsidae", "Gorgonops", "Gorgonops torvus"],
            osteology="Crânio alongado com fenestra temporal alargada para músculo adutor mandibular. Caninos maxilares hipertrofiados com bordas posteriores serrilhadas. Incisivos anteriores projetados para frente.",
            biomechanics="Articulação mandibular permitindo abertura oral de mais de 90 graus para ataque com sabres verticais por impacto cervical descendente.",
            histology="Osso fibrolamelar com vascularização densa nos ossos longos, indicando taxa metabólica elevada (endotermia intermediária/mesotermia)."
        ),
        occurrences_count=45,
        fossil_locations="África do Sul (Bacia do Karoo), Tanzânia, Zâmbia"
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
                caption="Reconstrução em vida de T. rex com tegumento moderno e lábios protetores",
                type="life_restoration",
                author="Mario Lanzas"
            ),
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Tyrannosaurus_Sue.jpg/960px-Tyrannosaurus_Sue.jpg",
                caption="Esqueleto fóssil completo de 'Sue' (FMNH PR 2081)",
                type="skeletal",
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
    Specimen(
        id="spinosaurus",
        name="Spinosaurus aegyptiacus",
        genus="Spinosaurus",
        scientific_name="Spinosaurus aegyptiacus (Stromer, 1915)",
        era="mesozoico",
        era_display="Mesozoico",
        period="Cretáceo",
        epoch="Cretáceo Superior (Cenomaniano)",
        geological_range="99 a 93.5 Ma",
        group="dinossauro",
        group_display="Dinossauro Terópode Semi-Aquático",
        diet="piscivoro",
        diet_display="Piscívoro & Carnívoro Oportunista",
        habitat="aquatico",
        length="14.0 a 15.0 m",
        height="4.5 m (com vela de 1.8 m)",
        weight="7.500 a 8.500 kg",
        speed="20 km/h (Propulsão por cauda natatória)",
        bite_force="19.000 N",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Spinosaurus_life_restoration_by_Emily_Willoughby_2020.png/960px-Spinosaurus_life_restoration_by_Emily_Willoughby_2020.png",
        image_caption="Representação em vida de Spinosaurus nadando nos deltas africanos",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Spinosaurus_life_restoration_by_Emily_Willoughby_2020.png/960px-Spinosaurus_life_restoration_by_Emily_Willoughby_2020.png",
                caption="Reconstrução em vida de Spinosaurus semi-aquático com cauda em remo",
                type="life_restoration",
                author="Emily Willoughby"
            )
        ],
        etymology="Do grego 'spinos' (espinha/espinho) e 'sauros' (lagarto), 'do Egito'. Descrito por Ernst Stromer em 1915.",
        bio="Spinosaurus foi o mais longo dinossauro carnívoro de todos os tempos e a primeira espécie comprovadamente adaptada a um estilo de vida semi-aquático predatório. Habitava o gigantesco sistema deltaico fluvial do norte da África no Cretáceo. Em 2020, a descoberta de fósseis de sua cauda revelou uma nadadeira vertical em remo propulsionada por espinhas ósseas alongadas, gerando empuxo de nado semelhante ao dos crocodilos modernos. Seu focinho estreito alongado possuía receptores neurovasculares sensíveis a vibrações de peixes gigantes.",
        curiosities=[
            "Mais longo que o Tyrannosaurus rex e o Giganotosaurus, alcançando 15 metros de comprimento total.",
            "Sua cauda possuía formato de remo largo e achatado lateralmente com grande flexibilidade para nado propulsivo.",
            "Os ossos eram densos e quase sem cavidade medular central (osteosclerose e paquiostose), funcionando como lastro de mergulho submarino.",
            "O fóssil holótipo original guardado em Munique foi completamente destruído em 1944 durante bombardeios da Segunda Guerra Mundial."
        ],
        expert=ExpertData(
            cladogram=["Dinosauria", "Theropoda", "Megalosauroidea", "Spinosauridae", "Spinosaurinae", "Spinosaurus aegyptiacus"],
            osteology="Rostro alongado subcônico com roseta premaxilar de dentes cônicos não serrilhados. Vértebras dorsais com espinhas neurais de até 1.8 m. Cauda com espinhas hemais hiperalongadas.",
            biomechanics="Centro de massa deslocado anteriormente sobre membros posteriores curtos, incompatível com cursorialismo bípede veloz mas adaptado para locomoção aquática.",
            histology="Microestrutura óssea com osteosclerose paquiostótica avançada em fêmur e costelas, mimetizando mamíferos marinhos semi-aquáticos modernos."
        ),
        occurrences_count=48,
        fossil_locations="Egito (Oásis de Bahariya), Marrocos (Leitos Kem Kem), Argélia, Níger"
    ),
    Specimen(
        id="triceratops",
        name="Triceratops horridus",
        genus="Triceratops",
        scientific_name="Triceratops horridus (Marsh, 1889)",
        era="mesozoico",
        era_display="Mesozoico",
        period="Cretáceo",
        epoch="Cretáceo Superior (Maastrichtiano)",
        geological_range="68 a 66 Ma",
        group="dinossauro",
        group_display="Dinossauro Ceratopsídeo",
        diet="herbivoro",
        diet_display="Herbívoro Fibroso Especializado",
        habitat="terrestre",
        length="8.5 a 9.0 m",
        height="3.0 m",
        weight="6.000 a 8.500 kg",
        speed="24 km/h (Carga defensiva)",
        bite_force="18.000 N (Bateria dental de cisalhamento)",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Triceratops_life_restoration_by_Julius_Csotonyi.jpg/960px-Triceratops_life_restoration_by_Julius_Csotonyi.jpg",
        image_caption="Representação em vida de Triceratops horridus pastando nas florestas de Hell Creek",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Triceratops_life_restoration_by_Julius_Csotonyi.jpg/960px-Triceratops_life_restoration_by_Julius_Csotonyi.jpg",
                caption="Reconstrução em vida de Triceratops em ambiente florestal",
                type="life_restoration",
                author="Julius T. Csotonyi"
            )
        ],
        etymology="Do grego 'tri' (três), 'keras' (chifre) e 'ops' (rosto), com o latim 'horridus' (áspero/rugoso). Descrito por Othniel Charles Marsh em 1889.",
        bio="Triceratops foi um dos mais abundantes e impressionantes mega-herbívoros do final do Cretáceo norte-americano. Seu crânio espetacular media até 2,5 metros — um terço do comprimento total do corpo —, coroado por um sólido escudo ósseo parietal-esquamosal sem fenestras e dois chifres supraorbitais de 1 metro revestidos por queratina afiada. Equipado com baterias de centenas de dentes que se substituíam continuamente em formato de tesoura mecânica, era capaz de cortar as mais duras samambaias e palmeiras.",
        curiosities=[
            "Seu crânio de 2,5 metros de comprimento é um dos maiores entre todos os animais terrestres de toda a história fóssil.",
            "Ao contrário de quase todos os outros ceratopsídeos, seu escudo de gola era de osso maciço contínuo, sem buracos ou aberturas (fenestras).",
            "Múltiplos crânios de Triceratops exibem ferimentos curados causados por mordidas de Tyrannosaurus rex e chifradas de outros Triceratops em disputas.",
            "Possuía baterias de 800 dentes encaixados em colunas verticais que se afiavam reciprocamente ao mastigar."
        ],
        expert=ExpertData(
            cladogram=["Dinosauria", "Ornithischia", "Ceratopsia", "Ceratopsidae", "Chasmosaurinae", "Triceratops horridus"],
            osteology="Crânio sincipital monóclino maciço com fusão precoce dos elementos esquamosais e parietais. Epoccipitais triangulares periféricos. Bico rostral edêntulo queratinizado.",
            biomechanics="Articulação occipital esférica ('ball-and-socket') com o atlas-axis, permitindo rotação e absorção de choques de impacto de mais de 25 toneladas de desaceleração.",
            histology="Osso fibrolamelar com remodelação haversiana densa nas margens dos chifres, demonstrando crescimento ontogenético contínuo e queratinização profunda."
        ),
        occurrences_count=210,
        fossil_locations="Estados Unidos (Hell Creek, Lance, Denver Formation), Canadá (Formação Frenchman)"
    ),
    Specimen(
        id="brachiosaurus",
        name="Brachiosaurus altithorax",
        genus="Brachiosaurus",
        scientific_name="Brachiosaurus altithorax (Riggs, 1903)",
        era="mesozoico",
        era_display="Mesozoico",
        period="Jurássico",
        epoch="Jurássico Superior (Kimmeridgiano ao Titoniano)",
        geological_range="154 a 150 Ma",
        group="dinossauro",
        group_display="Sauropodomorfo Macronário Gigante",
        diet="herbivoro",
        diet_display="Herbívoro de Copa Alta",
        habitat="terrestre",
        length="26.0 m",
        height="12.0 a 13.0 m (cabeça erguida)",
        weight="38.000 a 45.000 kg",
        speed="15 km/h",
        bite_force="8.000 N (Dentes espatulados arrancadores de folhas)",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Brachiosaurus_DB.jpg/960px-Brachiosaurus_DB.jpg",
        image_caption="Representação em vida de Brachiosaurus altithorax pastando nas copas das coníferas jurássicas",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Brachiosaurus_DB.jpg/960px-Brachiosaurus_DB.jpg",
                caption="Reconstrução em vida de Brachiosaurus altithorax",
                type="life_restoration",
                author="Dmitry Bogdanov"
            )
        ],
        etymology="Do grego 'brachion' (braço) e 'sauros' (lagarto), com 'altithorax' (tórax profundo/alto). Descrito por Elmer Riggs em 1903.",
        bio="Brachiosaurus foi um dos mais monumentais animais a caminhar sobre a Terra. Ao contrário da maioria dos outros sauropodes que mantinham o pescoço quase horizontal, o Brachiosaurus possuía membros dianteiros significativamente mais longos que os traseiros, conferindo um dorso inclinado como o de uma girafa que permitia que seu pescoço de 9 metros alcançasse as copas das mais altas coníferas e cicadáceas jurássicas a 13 metros de altura, onde nenhum outro herbivore conseguia alcançar.",
        curiosities=[
            "Seu coração precisava pesar cerca de 400 kg para bombear sangue oxigenado a mais de 10 metros de altura até o cérebro.",
            "Suas patas dianteiras eram maiores que as traseiras (daí seu nome 'lagarto braço').",
            "Suas vértebras cervicais eram hiper-pneumatizadas com cavidades de ar ligadas a sacos aéreos respiratórios semelhantes aos das aves modernas.",
            "Um humano adulto ficaria abaixo da altura do seu joelho dianteiro."
        ],
        expert=ExpertData(
            cladogram=["Dinosauria", "Saurischia", "Sauropoda", "Macronaria", "Titanosauriformes", "Brachiosauridae", "Brachiosaurus altithorax"],
            osteology="Vértebras com pleuroceles profundas e sistema trabecular interno reduzindo em até 60% a massa óssea cervical. Dentes em forma de espátula cinzelada de esmalte espesso.",
            biomechanics="Postura dorsal ascendente com escápula hiperalongada orientada a 55 graus em relação ao eixo horizontal axial, otimizando navegação vertical arbórea.",
            histology="Taxa metabólica com gigantotermia/homeotermia inercial sustentada por fluxo respiratório unidirecional através de sacos aéreos pulmonares extensos."
        ),
        occurrences_count=62,
        fossil_locations="Estados Unidos (Formação Morrison - Colorado, Utah, Wyoming, Oklahoma)"
    ),
    Specimen(
        id="velociraptor",
        name="Velociraptor mongoliensis",
        genus="Velociraptor",
        scientific_name="Velociraptor mongoliensis (Osborn, 1924)",
        era="mesozoico",
        era_display="Mesozoico",
        period="Cretáceo",
        epoch="Cretáceo Superior (Campaniano)",
        geological_range="75 a 71 Ma",
        group="dinossauro",
        group_display="Dromaeosaurídeo Emplumado",
        diet="carnivoro",
        diet_display="Predador Carnívoro Ágil",
        habitat="terrestre",
        length="2.07 m",
        height="50 cm nos quadris",
        weight="15 a 18 kg",
        speed="40 km/h",
        bite_force="600 N + golpe de foice no segundo dedo",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Velociraptor_restoration.png/960px-Velociraptor_restoration.png",
        image_caption="Representação em vida de Velociraptor mongoliensis totalmente emplumado",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Velociraptor_restoration.png/960px-Velociraptor_restoration.png",
                caption="Reconstrução em vida cientificamente acurada de Velociraptor com plumagem completa",
                type="life_restoration",
                author="Emily Willoughby"
            )
        ],
        etymology="Do latim 'velox' (veloz) e 'raptor' (ladrão/saqueador), 'da Mongólia'. Descrito por Henry Fairfield Osborn em 1924.",
        bio="Ao contrário do animal reptiliano sem penas popularizado nos filmes de Hollywood, o verdadeiro Velociraptor mongoliensis tinha o tamanho aproximado de um peru grande ou coiote, pesando cerca de 15 kg e completamente coberto por penas vanadas complexas idênticas às das aves modernas. Habitava as dunas de areia do deserto de Gobi. Sua arma letal era a famosa garra em forma de foice de 9 cm no segundo dedo do pé, mantida erguida fora do chão ao correr e usada para perfurar órgãos vitais e imobilizar presas como Protoceratops.",
        curiosities=[
            "Era completamente emplumado: em 2007, paleontólogos encontraram 'quill knobs' (papilas ulnárias onde as penas de voo se ancoravam no osso da ulna) no fóssil IGM 100/981.",
            "Tinha apenas cerca de 50 cm de altura nos quadris, pesando o mesmo que um cão de porte médio.",
            "O famoso fóssil 'Dinossauros Lutando' da Mongólia preservou um Velociraptor e um Protoceratops engalfinhados em combate mortal soterrados juntos por uma duna de areia.",
            "Sua cauda possuía hastes ósseas alongadas que a mantinham rígida como um leme aerodinâmico para curvas em alta velocidade."
        ],
        expert=ExpertData(
            cladogram=["Dinosauria", "Theropoda", "Coelurosauria", "Paraves", "Dromaeosauridae", "Eudromaeosauria", "Velociraptor mongoliensis"],
            osteology="Ulna com 6 a 8 papilas ulnárias para cálamo de penas rêmiges primárias. Segundo dedo pedioso com falange hipertrofiada e garra falciforme ungueal hiperestendida. Cauda com pré-zigapófises e cabos hemais fusionados.",
            biomechanics="Mecanismo de 'Raptor Prey Restraint' (RPR): pinçamento da presa com as garras foices sob o próprio peso do predador enquanto as asas batiam para estabilização postural.",
            histology="Ossos pneumáticos com trabéculas finas e taxas de aposição periosteal elevada compatíveis com endotermia aviária completa."
        ),
        occurrences_count=88,
        fossil_locations="Mongólia (Deserto de Gobi - Formação Djadochta), China (Mongólia Interior - Formação Bayan Mandahu)"
    ),
    Specimen(
        id="quetzalcoatlus",
        name="Quetzalcoatlus northropi",
        genus="Quetzalcoatlus",
        scientific_name="Quetzalcoatlus northropi (Lawson, 1975)",
        era="mesozoico",
        era_display="Mesozoico",
        period="Cretáceo",
        epoch="Cretáceo Superior (Maastrichtiano)",
        geological_range="68 a 66 Ma",
        group="pterossauro",
        group_display="Pterossauro Azhdarchídeo Gigante",
        diet="carnivoro",
        diet_display="Predador Carnívoro Terrestre",
        habitat="aereo",
        length="5.0 m de corpo, 10.5 a 11.0 m de envergadura",
        height="4.5 a 5.0 m (altura de girafa ereto)",
        weight="200 a 250 kg",
        speed="110 km/h (Voo térmico planar)",
        bite_force="3.500 N",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Quetzalcoatlus_life_restoration.png/960px-Quetzalcoatlus_life_restoration.png",
        image_caption="Representação em vida de Quetzalcoatlus empoleirado sobre o solo do Cretáceo",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Quetzalcoatlus_life_restoration.png/960px-Quetzalcoatlus_life_restoration.png",
                caption="Reconstrução em vida de Quetzalcoatlus northropi em caminhada quadrúpede",
                type="life_restoration",
                author="Mark Witton"
            )
        ],
        etymology="Homenagem à divindade asteca da serpente emplumada Quetzalcóatl e a John K. Northrop, pioneiro de asas voadoras da aviação. Descrito por Douglas Lawson em 1975.",
        bio="Quetzalcoatlus é um dos maiores animais alados de toda a história do planeta Terra. Com uma envergadura colossal de até 11 metros e altura de uma girafa moderna quando em pé no solo, este pterossauro azhdarchídeo quebrou os limites aerodinâmicos da biofísica do voo animal. Apesar de voar distâncias continentais aproveitando correntes térmicas ascendentes, era primariamente um predador terrestre quadrúpede, que caminhava ereto caçando filhotes de dinossauros com seu bico pontiagudo de 2 metros.",
        curiosities=[
            "Tinha a altura de uma girafa adulta quando estava de pé no chão, apoiado nas quatro patas.",
            "Seus ossos tinham paredes de apenas 1 a 2 milímetros de espessura reforçadas por suportes internos (trabéculas), tornando-o leve e incrivelmente resistente.",
            "Decolava do chão usando uma catapulta quadrúpede impulsiva com as patas dianteiras, gerando 3 vezes mais força do que um pássaro moderno.",
            "Podia voar sem parar por milhares de quilômetros cruzando continentes inteiros a 100 km/h com mínimo gasto calórico."
        ],
        expert=ExpertData(
            cladogram=["Pterosauria", "Pterodactyloidea", "Azhdarchoidea", "Azhdarchidae", "Quetzalcoatlus", "Quetzalcoatlus northropi"],
            osteology="Vértebras cervicais hiperalongadas tubulares sem forames pneumáticos laterais. Bico desprovido de dentes com secção em V. Quarto dedo alar hipertrofiado sustentando braquiopatágio.",
            biomechanics="Decolagem balística quadrupedal ('quadrupedal launch'): extensão explosiva simultânea dos membros anteriores sustentados pelos côndilos ulno-radiais e do músculo peitoral.",
            histology="Cortical óssea ultra-fina (t/R < 0.05) com reforços helicoidais internos trabeculados de fosfato de cálcio, otimizados para resistência à flexão e torção durante o voo."
        ),
        occurrences_count=32,
        fossil_locations="Estados Unidos (Texas - Formação Javelina, Big Bend National Park)"
    ),
    Specimen(
        id="mosasaurus",
        name="Mosasaurus hoffmannii",
        genus="Mosasaurus",
        scientific_name="Mosasaurus hoffmannii (Mantell, 1829)",
        era="mesozoico",
        era_display="Mesozoico",
        period="Cretáceo",
        epoch="Cretáceo Superior (Maastrichtiano)",
        geological_range="70 a 66 Ma",
        group="reptil-marinho",
        group_display="Réptil Marinho Escamado (Mosasaurídeo)",
        diet="carnivoro",
        diet_display="Superpredador Marinho Carnívoro",
        habitat="aquatico",
        length="13.0 a 17.0 m",
        height="3.0 m (tronco)",
        weight="10.000 a 15.000 kg",
        speed="45 km/h (Nado subcarangiforme)",
        bite_force="28.000 N",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Mosasaurus_hoffmanni_life_restoration.png/960px-Mosasaurus_hoffmanni_life_restoration.png",
        image_caption="Representação em vida de Mosasaurus hoffmannii patrulhando o mar cretáceo",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Mosasaurus_hoffmanni_life_restoration.png/960px-Mosasaurus_hoffmanni_life_restoration.png",
                caption="Reconstrução em vida de Mosasaurus hoffmannii",
                type="life_restoration",
                author="Dmitry Bogdanov"
            )
        ],
        etymology="Do latim 'Mosa' (Rio Mosa, Holanda) e grego 'sauros' (lagarto). Espécie homenageia o médico C. K. Hoffmann. Descrito em 1829.",
        bio="Mosasaurus foi o ápice incontestável das cadeias alimentares marinhas globais nos últimos milhões de anos do Cretáceo. Parente dos modernos lagartos-monitores e serpentes, este titânico predador adaptou-se com maestria à vida marinha pelágica: seus membros transformaram-se em nadadeiras hidrodinâmicas e sua cauda culminava em uma nadadeira bilobada propulsora em meia-lua. Possuía uma articulação intramandibular dupla e uma fileira secundária de dentes pterigóideos no céu da boca para impedir que presas escorregassem.",
        curiosities=[
            "NÃO era um dinossauro! Pertencia à ordem Squamata, sendo um parente marinho gigante dos lagartos-monitores modernos e das cobras.",
            "Possuía uma fileira de dentes extras pontiagudos no palato (céu da boca) que puxava presas em direção ao estômago sem mastigar.",
            "Tinha reprodução vivípara completa, dando à luz filhotes vivos diretamente em alto-mar, sem precisar botar ovos na terra.",
            "O crânio holótipo foi capturado pelas tropas revolucionárias francesas em 1794 em Maastricht e levado para Paris como tesouro de guerra."
        ],
        expert=ExpertData(
            cladogram=["Squamata", "Anguimorpha", "Mosasauroidea", "Mosasauridae", "Mosasaurinae", "Mosasaurus hoffmannii"],
            osteology="Crânio estreito com articulação intramandibular flexionável. Dentes facetais prismáticos bicarinados com raízes tecodontes profundas. Nadadeira caudal hypocercal com vértebras fletidas ventralmente.",
            biomechanics="Propulsão axial ondulatória carangiforme restrita aos 40% caudais distais, conferindo alta eficiência hidrodinâmica em nado prolongado em mar aberto.",
            histology="Ossos com densidade homogênea esponjosa vascularizada e canalículos de Sharpey adaptados para mergulhos profundos e descompressão rápida sem fraturas osteonecróticas."
        ),
        occurrences_count=130,
        fossil_locations="Holanda (Maastricht), Bélgica, Estados Unidos (Nova Jersey, Dakota do Sul), Marrocos"
    ),

    # =========================================================================
    # CENOZOICO (66 Ma ao Presente)
    # =========================================================================
    Specimen(
        id="titanoboa",
        name="Titanoboa cerrejonensis",
        genus="Titanoboa",
        scientific_name="Titanoboa cerrejonensis (Head et al., 2009)",
        era="cenozoico",
        era_display="Cenozoico",
        period="Paleógeno",
        epoch="Paleoceno Médio",
        geological_range="60 a 58 Ma",
        group="mamifero-megafauna",
        group_display="Serpente Boidídea Gigante",
        diet="carnivoro",
        diet_display="Predador Emboscador Carnívoro",
        habitat="aquatico",
        length="12.8 a 13.0 m",
        height="Diâmetro de 1.0 m",
        weight="1.135 a 1.200 kg",
        speed="20 km/h (Nado em pântano)",
        bite_force="Constrição esmagadora de 28 kg/cm²",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Titanoboa_Cerrejonensis.jpg/960px-Titanoboa_Cerrejonensis.jpg",
        image_caption="Representação em vida de Titanoboa emboscando crocodilomorfos nos pântanos do Paleoceno",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Titanoboa_Cerrejonensis.jpg/960px-Titanoboa_Cerrejonensis.jpg",
                caption="Reconstrução em vida de Titanoboa cerrejonensis",
                type="life_restoration",
                author="Smithsonian Institution"
            )
        ],
        etymology="Do grego 'titan' (titã) e 'boa' (serpente boidídea), 'de Cerrejón' (mina de carvão na Colômbia). Descrito por Jason Head et al. em 2009.",
        bio="Titanoboa é a maior serpente que já rastejou ou nadou na face da Terra. Descoberta na colossal mina de carvão a céu aberto de Cerrejón, no norte da Colômbia, este gigante de 13 metros de comprimento e mais de uma tonelada reinou supremo nas florestas tropicais equatoriais úmidas que surgiram logo após a extinção dos dinossauros. Seu gigantismo metabólico só foi possível porque a temperatura média equatorial do Paleoceno atingia tórridos 32 a 34 °C, aquecendo seu corpo de réptil ectotérmico a níveis nunca mais repetidos.",
        curiosities=[
            "Maior serpente da história da vida na Terra: pesava 1.135 kg e seu corpo tinha mais de 1 metro de diâmetro.",
            "Alimentava-se de crocodilomorfos gigantes (Cerrejonisuchus e Acherontisuchus) e tartarugas de 2 metros (Carbonemys).",
            "A temperatura tropical média de 32 a 34 °C da época permitiu seu gigantismo reptiliano ectotérmico.",
            "Podia engolir presas do tamanho de um crocodilo inteiro sem mastigar graças à elasticidade mandibular extrema das serpentes."
        ],
        expert=ExpertData(
            cladogram=["Squamata", "Serpentes", "Alethinophidia", "Boidae", "Boinae", "Titanoboa cerrejonensis"],
            osteology="Vértebras pré-caudais maciças (até 12 cm de largura transversal) com articulações zigantrum-zigofeno hipertrofiadas e forames paracotilares profundos.",
            biomechanics="Mecânica de constrição com força circular concêntrica calculada em mais de 2.800 kPa, gerando parada circulatória e colapso cardíaco imediato nas presas em segundos.",
            histology="Osso periosteal denso avascular com anéis de deposição concêntrica densa compatíveis com taxa metabólica ectotérmica e crescimento plurianual contínuo."
        ),
        occurrences_count=24,
        fossil_locations="Colômbia (Mina de Cerrejón, Formação Cerrejón, La Guajira)"
    ),
    Specimen(
        id="basilosaurus",
        name="Basilosaurus cetoides",
        genus="Basilosaurus",
        scientific_name="Basilosaurus cetoides (Owen, 1839)",
        era="cenozoico",
        era_display="Cenozoico",
        period="Paleógeno",
        epoch="Eoceno Superior",
        geological_range="40 a 34 Ma",
        group="mamifero-megafauna",
        group_display="Cetáceo Arqueoceto Predador Gigante",
        diet="carnivoro",
        diet_display="Superpredador Marinho Carnívoro",
        habitat="aquatico",
        length="18.0 a 20.0 m",
        height="2.5 m (corpo serpentiforme)",
        weight="14.000 a 16.000 kg",
        speed="30 km/h (Nado ondulatório axial)",
        bite_force="16.000 N",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Basilosaurus_cetoides.png/960px-Basilosaurus_cetoides.png",
        image_caption="Representação em vida de Basilosaurus cetoides patrulhando os mares do Eoceno",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Basilosaurus_cetoides.png/960px-Basilosaurus_cetoides.png",
                caption="Reconstrução em vida de Basilosaurus cetoides",
                type="life_restoration",
                author="Katrina Kenny"
            )
        ],
        etymology="Do grego 'basileus' (rei) e 'sauros' (lagarto) — batizado como réptil antes de se descobrir que era mamífero cetáceo — e 'cetoides' (parecido com baleia). Descrito por Richard Owen em 1839.",
        bio="Basilosaurus foi o primeiro cetáceo de proporções colossais a dominar os oceanos globais após o evento de extinção do Cretáceo. Apesar do seu nome ('lagarto rei', dado por ter sido inicialmente confundido com um réptil marinho fóssil), era uma baleia pré-histórica ancestral com corpo serpentiforme de quase 20 metros de comprimento. Retinha ainda membros posteriores vestigiais diminutos de 35 cm — evidência fóssil espetacular da transição dos mamíferos terrestres de quatro patas para o mar.",
        curiosities=[
            "Retinha patas traseiras completas com fêmur, tíbia e dedos, embora minúsculas (35 cm), vestígios diretos de seus ancestrais terrestres!",
            "Crânios de filhotes de Dorudon (outra baleia ancestral) encontrados no Egito exibem marcas de mordidas profundas de Basilosaurus.",
            "O vale fóssil de Wadi Al-Hitan (Egito) contém centenas de esqueletos intactos de Basilosaurus preservados na areia do deserto.",
            "Possuía dentes diferenciados com raízes duplas serrilhadas para cortar carne e esmagar cabeças de presas."
        ],
        expert=ExpertData(
            cladogram=["Mammalia", "Cetartiodactyla", "Cetacea", "Archaeoceti", "Basilosauridae", "Basilosaurus cetoides"],
            osteology="Vértebras lombares e caudais hiperalongadas pneumaticamente preenchidas com líquido sinovial medular. Membro pélvico vestigial não articulado com a coluna vertebral. Dentes heterodontes com molares multicuspidados.",
            biomechanics="Ondulação axial anguiliforme a subcarangiforme: nado sinusoidal serpentino horizontal em águas superficiais quentes costeiras do mar de Tétis.",
            histology="Tecido ósseo esponjoso vascularizado em vértebras reduzindo gravidade específica, associado a costelas compactas pachyostóticas atuando como lastro hidrostático."
        ),
        occurrences_count=60,
        fossil_locations="Egito (Wadi Al-Hitan - Vale das Baleias), Estados Unidos (Alabama, Louisiana, Mississipi), Jordânia"
    ),
    Specimen(
        id="smilodon",
        name="Smilodon populator",
        genus="Smilodon",
        scientific_name="Smilodon populator (Lund, 1842)",
        era="cenozoico",
        era_display="Cenozoico",
        period="Quaternário",
        epoch="Pleistoceno Superior",
        geological_range="1.0 Ma a 10.000 anos",
        group="mamifero-megafauna",
        group_display="Felídeo Maquerodontíneo (Dente-de-Sabre)",
        diet="carnivoro",
        diet_display="Superpredador Carnívoro de Emboscada",
        habitat="terrestre",
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
                caption="Reconstrução em vida de Smilodon mostrando musculatura anterior e sabres",
                type="life_restoration",
                author="Sergio de la Rosa"
            ),
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Smilodon_Knight.jpg/960px-Smilodon_Knight.jpg",
                caption="Paleoarte clássica histórica de Smilodon em caçada",
                type="life_restoration",
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
    ),
    Specimen(
        id="mammuthus",
        name="Mammuthus primigenius",
        genus="Mammuthus",
        scientific_name="Mammuthus primigenius (Blumenbach, 1799)",
        era="cenozoico",
        era_display="Cenozoico",
        period="Quaternário",
        epoch="Pleistoceno Superior a Holoceno",
        geological_range="400.000 a 4.000 anos",
        group="mamifero-megafauna",
        group_display="Proboscídeo da Megafauna Glacial",
        diet="herbivoro",
        diet_display="Herbívoro da Estepe Herbácea",
        habitat="terrestre",
        length="3.0 a 3.5 m",
        height="2.8 a 3.4 m nos ombros",
        weight="5.000 a 6.000 kg",
        speed="35 km/h",
        bite_force="12.000 N (Molares lamelares trituradores)",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Woolly_Mammoth_%28Mammuthus_primigenius%29_-_Mauricio_Ant%C3%B3n.jpg/960px-Woolly_Mammoth_%28Mammuthus_primigenius%29_-_Mauricio_Ant%C3%B3n.jpg",
        image_caption="Representação em vida de um grupo de mamutes-lanosos marchando pela tundra glacial",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Woolly_Mammoth_%28Mammuthus_primigenius%29_-_Mauricio_Ant%C3%B3n.jpg/960px-Woolly_Mammoth_%28Mammuthus_primigenius%29_-_Mauricio_Ant%C3%B3n.jpg",
                caption="Reconstrução em vida de mamute-lanoso adulto",
                type="life_restoration",
                author="Mauricio Antón"
            )
        ],
        etymology="Do tártaro siberiano 'mamma' (terra), pois acreditava-se que cavavam túneis no solo, e 'primigenius' (primitivo/original). Descrito por Johann Blumenbach em 1799.",
        bio="O mamute-lanoso é o ícone absoluto da última Idade do Gelo. Perfeitamente adaptado ao ambiente inóspito da gigantesca estepe dos mamutes — que se estendia da Europa Ocidental através da Sibéria até a América do Norte através da ponte de Beríngia —, possuía uma camada dupla de pelagem espessa com pelos de até 90 cm de comprimento, uma corcunda de gordura estocadora de energia e presas de marfim espirais curvadas de mais de 4 metros usadas para varrer a neve e expor pastagens nutritivas.",
        curiosities=[
            "Seus pelos externos impermeáveis alcançavam quase 1 metro de comprimento, sob os quais havia um subpelo denso de lã fina isolante.",
            "Possuía uma mutação específica na hemoglobina que permitia liberar oxigênio aos tecidos mesmo em temperaturas de -50 °C.",
            "As presas espirais de marfim cresciam em anéis diários de deposição que registravam sua idade, gestações e estações climáticas.",
            "A última população de mamutes-lanosos sobreviveu isolada na Ilha de Wrangel, no Ártico, até 1650 a.C. — quando as pirâmides do Egito já estavam construídas!"
        ],
        expert=ExpertData(
            cladogram=["Mammalia", "Proboscidea", "Elephantidae", "Mammuthus", "Mammuthus primigenius"],
            osteology="Crânio comprimido anteroposteriormente com vértex pontiagudo e cavidades pneumáticas expandidas. Molares hipselodontes com até 30 placas lamelares de esmalte por dente. Presas curvadas em espiral tridimensional.",
            biomechanics="Membros colunares graviportais com ossos pesados verticais e coxim plantar elástico espesso amortecedor de impacto em terrenos congelados de permafrost.",
            histology="DNA fóssil e tecidos moles excepcionalmente conservados em permafrost exibem adipócitos marrons ativos e preservação de queratina capilar rica em cistina."
        ),
        occurrences_count=320,
        fossil_locations="Rússia (Sibéria, Permafrost), Canadá (Yukon), Estados Unidos (Alasca), Alemanha, França, Ilha de Wrangel"
    ),
    Specimen(
        id="megalodon",
        name="Otodus megalodon",
        genus="Otodus",
        scientific_name="Otodus megalodon (Agassiz, 1835)",
        era="cenozoico",
        era_display="Cenozoico",
        period="Neógeno",
        epoch="Mioceno ao Plioceno",
        geological_range="23 a 3.6 Ma",
        group="reptil-marinho",
        group_display="Chondrichthyes (Tubarão Lamniforme Gigante)",
        diet="carnivoro",
        diet_display="Superpredador Pelágico Carnívoro",
        habitat="aquatico",
        length="16.0 a 20.0 m",
        height="4.5 m (dorso)",
        weight="50.000 a 65.000 kg",
        speed="35 km/h (com arrancadas de 50 km/h)",
        bite_force="108.000 a 182.000 N",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Carcharocles_megalodon.jpg/960px-Carcharocles_megalodon.jpg",
        image_caption="Representação em vida de Otodus megalodon caçando baleias no Mioceno",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Carcharocles_megalodon.jpg/960px-Carcharocles_megalodon.jpg",
                caption="Reconstrução em vida de Megalodon nadando em mar aberto",
                type="life_restoration",
                author="Karen Carr"
            )
        ],
        etymology="Do grego 'megas' (grande) e 'odous' (dente), 'dente gigante'. Classificado por Louis Agassiz em 1835.",
        bio="Otodus megalodon foi o maior e mais aterrador predador aquático macrófago da história do planeta Terra. Alcançando impressionantes 16 a 20 metros de comprimento e até 65 toneladas de massa corporal, este tubarão lamniforme dominou os oceanos tropicais e subtropicais de todo o globo durante o Mioceno e o Plioceno. Seus dentes de até 18 centímetros, triangulares e finamente serrilhados, entregavam uma força de mordida estarrecedora de até 182.000 Newtons, capaz de quebrar costelas e nadadeiras de baleias primitivas.",
        curiosities=[
            "Possuía a mordida mais poderosa de qualquer predador conhecido na história da vida animal: até 182.000 Newtons (18 toneladas de pressão).",
            "Seus dentes individuais triangulares podiam ultrapassar 18 centímetros de altura em diagonal.",
            "Um ser humano adulto conseguiria ficar facilmente de pé dentro de sua mandíbula aberta de 2,7 metros de largura.",
            "Alimentava-se rotineiramente de grandes baleias cetáceas, baleias-jubarte ancestrais e focas gigantes."
        ],
        expert=ExpertData(
            cladogram=["Chondrichthyes", "Elasmobranchii", "Lamniformes", "Otodontidae", "Otodus", "Otodus megalodon"],
            osteology="Esqueleto quase inteiramente cartilaginoso prismático calcificado. Dentes maciços de secção espessa em V com bourrelet lingual largo e serrilhas finas regulares. Vértebras com anéis de calcificação concêntrica (calcóforos).",
            biomechanics="Mecanismo de ataque por impacto contundente: investida de baixo para cima atingindo a caixa torácica e coração de cetáceos em alta velocidade, rompendo sustentação hidrodinâmica da presa.",
            histology="Isótopos estáveis de oxigênio (δ18O) e carbono em esmaltoide dental indicam endotermia regional (mesotermia), mantendo o corpo vários graus acima da temperatura da água do mar."
        ),
        occurrences_count=195,
        fossil_locations="Global (Estados Unidos - Carolina do Sul, Maryland, Marrocos, Peru, Chile, Austrália, Japão)"
    ),
    Specimen(
        id="purussaurus",
        name="Purussaurus brasiliensis",
        genus="Purussaurus",
        scientific_name="Purussaurus brasiliensis (Barbosa-Rodrigues, 1892)",
        era="cenozoico",
        era_display="Cenozoico",
        period="Neógeno",
        epoch="Mioceno Superior",
        geological_range="13 a 8 Ma",
        group="reptil-marinho",
        group_display="Crocodilomorfo Caimão Gigante",
        diet="carnivoro",
        diet_display="Superpredador Apex dos Rios Amazônicos",
        habitat="aquatico",
        length="11.5 a 12.5 m",
        height="1.8 m",
        weight="8.400 kg",
        speed="25 km/h na água",
        bite_force="69.000 N",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Purussaurus_brasiliensis_reconstruction.png/960px-Purussaurus_brasiliensis_reconstruction.png",
        image_caption="Representação em vida de Purussaurus brasiliensis no ecossistema pantanoso do Mioceno",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Purussaurus_brasiliensis_reconstruction.png/960px-Purussaurus_brasiliensis_reconstruction.png",
                caption="Reconstrução em vida de Purussaurus brasiliensis",
                type="life_restoration",
                author="Ghedoghedo"
            )
        ],
        etymology="Nomeado em homenagem ao Rio Purus, no Acre (Brasil), e 'brasiliensis' (do Brasil). Descrito pelo botânico João Barbosa Rodrigues em 1892.",
        bio="Purussaurus brasiliensis foi o maior caimão e um dos maiores crocodilianos de todos os tempos. Habitou o colossal sistema de megaprofundos lagos e pântanos de Pebas, que cobria grande parte da Amazônia ocidental brasileira, peruana e colombiana no Mioceno. Com crânio maciço de 1,4 metro e mandíbulas incrivelmente robustas, Purussaurus desenvolveu uma mordida de 69.000 Newtons — superando até mesmo a do T-Rex —, capaz de partir a carapaça de tartarugas gigantes como Stupendemys de 3 metros e devorar mamíferos ungulados miocênicos.",
        curiosities=[
            "Descoberto e batizado no Brasil (Acre) pelo renomado botânico brasileiro João Barbosa Rodrigues em 1892.",
            "Sua força de mordida chegava a impressionantes 69.000 Newtons (7 toneladas de pressão), superando a do próprio T. rex!",
            "Media até 12,5 metros de comprimento e pesava mais de 8 toneladas, dominando as águas pré-históricas da bacia amazônica.",
            "Conseguia estraçalhar a carapaça óssea de 3 metros de Stupendemys geographicus, a maior tartaruga aquática que já existiu."
        ],
        expert=ExpertData(
            cladogram=["Crocodylia", "Alligatoroidea", "Caimaninae", "Purussaurus", "Purussaurus brasiliensis"],
            osteology="Crânio extremamente largo e maciço com focinho rombudo e narinas externas gigantescas. Dentes cônicos grossos de base bulbosa curvada internamente com carenas serrilhadas anteriores e posteriores.",
            biomechanics="Mandíbula adaptada para rotação de morte ('death roll') em megafauna aquática associada à compressão dorsoventral máxima resistindo a torções maciças.",
            histology="Osteodermos dérmicos dorsais imbricados de alta espessura com canais vasculares profundos e osso lamelar denso protetor contra dentadas de outros Purussaurus."
        ),
        occurrences_count=45,
        fossil_locations="Brasil (Acre - Rio Purus, Rio Acre, Formação Solimões), Peru (Formação Pebas), Colômbia (La Venta)"
    ),
    Specimen(
        id="megatherium",
        name="Megatherium americanum",
        genus="Megatherium",
        scientific_name="Megatherium americanum (Cuvier, 1796)",
        era="cenozoico",
        era_display="Cenozoico",
        period="Quaternário",
        epoch="Pleistoceno",
        geological_range="2.5 Ma a 10.000 anos",
        group="mamifero-megafauna",
        group_display="Xenartro da Megafauna (Preguiça-Gigante)",
        diet="herbivoro",
        diet_display="Herbívoro Folívoro de Médio e Alto Porte",
        habitat="terrestre",
        length="6.0 m",
        height="3.5 a 4.0 m quando bípede",
        weight="3.800 a 4.000 kg",
        speed="12 km/h",
        bite_force="3.000 N",
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Megatherium_americanum_restoration.jpg/960px-Megatherium_americanum_restoration.jpg",
        image_caption="Representação em vida de Megatherium americanum em pé pastando copas de árvores",
        gallery=[
            GalleryItem(
                url="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Megatherium_americanum_restoration.jpg/960px-Megatherium_americanum_restoration.jpg",
                caption="Reconstrução em vida de Megatherium bípede",
                type="life_restoration",
                author="Nobu Tamura"
            )
        ],
        etymology="Do grego 'megas' (grande) e 'therion' (fera/besta), 'da América'. Descrito pelo pai da paleontologia Georges Cuvier em 1796.",
        bio="Megatherium americanum foi a titânica preguiça-gigante terrestre da América do Sul e um dos maiores mamíferos terrestres do Pleistoceno. Com 6 metros de comprimento e peso comparável ao de um elefante africano (4 toneladas), possuía garras curvas de até 30 cm de comprimento. Embora caminhasse apoiando os nós dos pés em postura quadrúpede, sua pelve extraordinariamente larga e cauda musculosa permitiam que ficasse ereto em postura tripoidal para derrubar galhos e folhas de copas arbóreas.",
        curiosities=[
            "Foi o primeiro fóssil de mamífero pré-histórico montado cientificamente em postura anatômica completa em 1795 em Madri.",
            "Podia ficar de pé sobre as duas patas traseiras e a cauda musculosa formando um tripé sólido de 4 metros de altura.",
            "Possuía garras curvas de 30 cm que serviam tanto para puxar árvores quanto para desferir golpes mortais defensivos contra Smilodon.",
            "Túneis fósseis subterrâneos gigantes chamados paleotocas, com até 4 metros de diâmetro encontrados no Brasil, foram escavados por preguiças-gigantes!"
        ],
        expert=ExpertData(
            cladogram=["Mammalia", "Xenarthra", "Pilosa", "Folivora", "Megatheriidae", "Megatherium americanum"],
            osteology="Pelve extremamente alargada transversalmente (até 2 m) com ílios expandidos. Fêmur achatado anteroposteriormente hiper-robusto. Dentes molares quadrangulares prismáticos de crescimento contínuo desprovidos de esmalte.",
            biomechanics="Postura tripoidal sustentada pelo centro de massa sobre o ísquio e a robusta série de vértebras caudais com grandes processos hemais chevron.",
            histology="Dentinóide ortodentínico e cemento vascularizado nos dentes prismáticos com resistência contínua à abrasão por fitólitos de gramíneas e sílica vegetal."
        ),
        occurrences_count=140,
        fossil_locations="Brasil (Minas Gerais, Bahia, Piauí, Rio Grande do Sul), Argentina (Pampas), Uruguai, Bolívia"
    )
]


def seed_database():
    """Initializes the database and seeds iconic specimens across all geological eras."""
    init_db()
    seeded_count = 0
    for specimen in SEED_SPECIMENS:
        upsert_specimen(specimen)
        seeded_count += 1
    logger.info(f"Database successfully initialized and seeded with {seeded_count} iconic specimens across all Earth eras.")
    return seeded_count


if __name__ == "__main__":
    count = seed_database()
    print(f"Banco de dados semeado com {count} espécimes de todas as eras geológicas!")
