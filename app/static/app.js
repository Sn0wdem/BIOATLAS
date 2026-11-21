/**
 * Super Wiki Global da Vida na Terra
 * Frontend Controller resiliente e de ultra-alta velocidade
 */

// Acervo Embutido Inicial (29 espécimes de todas as eras para renderização instantânea)
const EMBEDDED_CATALOG = [
  {
    "id": "baleia-azul",
    "name": "Baleia-Azul",
    "genus": "Balaenoptera",
    "scientific_name": "Balaenoptera musculus (Linnaeus, 1758)",
    "era": "contemporaneo",
    "era_display": "Contemporâneo (Fauna Atual)",
    "period": "Holoceno / Atualidade",
    "epoch": "Época Contemporânea",
    "geological_range": "Presente (Espécie Vivente)",
    "group": "reptil-marinho",
    "group_display": "Mamífero Cetáceo Misticeto Gigante",
    "diet": "filtrador",
    "diet_display": "Filtrador de Krill e Zooplâncton",
    "habitat": "aquatico",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Endoesqueleto Ósseo Esponjoso Gigante e Cartilagem",
    "is_contemporary": true,
    "conservation_status": "Em Perigo (EN)",
    "length": "26.0 a 30.5 m",
    "height": "Diâmetro corporal de 4.5 m",
    "weight": "150.000 a 190.000 kg (190 toneladas)",
    "speed": "35 a 50 km/h (Nado em arrancada)",
    "bite_force": "Filtragem hidrodinâmica com barbas de queratina",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Blue_whale_size.svg/960px-Blue_whale_size.svg.png",
    "image_caption": "Representação em vida da baleia-azul comparada à escala humana",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Blue_whale_size.svg/960px-Blue_whale_size.svg.png",
        "caption": "[🌿 Indivíduo em Vida] Reconstrução anatômica completa da baleia-azul",
        "type": "living_specimen",
        "category": "life_view",
        "author": "Kurzon"
      },
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/BlueWhaleSkeleton.jpg/960px-BlueWhaleSkeleton.jpg",
        "caption": "[🦴 Esqueleto / Ossos] Esqueleto fóssil e osteológico montado ('Hope') no Museu de História Natural de Londres",
        "type": "skeleton",
        "category": "skeletal_view",
        "author": "Natural History Museum"
      }
    ],
    "etymology": "Do latim 'balaena' (baleia), 'pteron' (asa/nadadeira) e 'musculus' (musculoso/diminutivo de rato em tom irônico por Lineu).",
    "bio": "A baleia-azul é o maior animal que já existiu em toda a história do planeta Terra — superando com folga qualquer dinossauro que já existiu! Alcançando mais de 30 metros de comprimento e até 190 toneladas de massa corporal, seu coração tem o tamanho de um carro compacto e sua língua pesa tanto quanto um elefante adulto inteiro. Alimenta-se filtrando até 4 toneladas de pequenos crustáceos (krill) por dia através de centenas de placas flexíveis de barbatana feitas de queratina suspensas na mandíbula superior.",
    "curiosities": [
      "É o maior animal de TODOS OS TEMPOS no planeta Terra, mais pesado que o Argentinosaurus e qualquer outro ser vivo da história.",
      "Sua língua pesa cerca de 4 toneladas (o peso de um elefante adulto) e seu coração pesa mais de 180 kg.",
      "Um bebê de baleia-azul ganha cerca de 90 kg de peso por dia apenas mamando leite materno rico em gordura.",
      "Seus cantos de baixa frequência submarinos alcançam 188 decibéis e podem viajar por milhares de quilômetros através do oceano."
    ],
    "expert": {
      "cladogram": [
        "Metazoa",
        "Chordata",
        "Vertebrata",
        "Mammalia",
        "Artiodactyla",
        "Cetacea",
        "Mysticeti",
        "Balaenopteridae",
        "Balaenoptera",
        "Balaenoptera musculus"
      ],
      "osteology": "Crânio amplo achatado de até 6 metros com rostro curvo. Ausência total de dentes verdadeiros substituídos por 300 a 400 pares de barbanas queratinizadas de até 1 metro de comprimento. Mandíbula desprovida de sínfise óssea rígida (ligamento elástico fibroso móvel).",
      "biomechanics": "Mecanismo de 'engulfment feeding': abertura oral a 90 graus associada à expansão de pregas ventrais elásticas que ingerem até 90 toneladas de água e krill de uma só vez.",
      "histology": "Osso osteopênico vascular com ausência de sistema haversiano denso, preenchido por lipídios neutros para controle hidrostático de flutuabilidade neutra em águas pelágicas profundas."
    },
    "occurrences_count": 85000,
    "fossil_locations": "Oceanos Globais (Antártica, Pacífico Norte, Atlântico Norte, Oceano Índico)",
    "is_custom_ingested": false
  },
  {
    "id": "onca-pintada",
    "name": "Onça-Pintada",
    "genus": "Panthera",
    "scientific_name": "Panthera onca (Linnaeus, 1758)",
    "era": "contemporaneo",
    "era_display": "Contemporâneo (Fauna Atual)",
    "period": "Holoceno / Atualidade",
    "epoch": "Época Contemporânea",
    "geological_range": "Presente (Espécie Vivente)",
    "group": "mamifero-megafauna",
    "group_display": "Mamífero Carnívoro (Felídeo)",
    "diet": "carnivoro",
    "diet_display": "Superpredador Carnívoro das Américas",
    "habitat": "terrestre",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Endoesqueleto Ósseo Articulado e Cartilagem",
    "is_contemporary": true,
    "conservation_status": "Quase Ameaçada (NT)",
    "length": "1.7 a 2.4 m (com cauda)",
    "height": "75 cm nos ombros",
    "weight": "80 a 140 kg",
    "speed": "80 km/h (Arrancada explosiva)",
    "bite_force": "9.000 N (Capaz de perfurar cascos de tartarugas e crânios)",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Chapultepec_Zoo_-_Jaguar_%2802%29.jpg/960px-Chapultepec_Zoo_-_Jaguar_%2802%29.jpg",
    "image_caption": "Onça-pintada adulta em seu habitat natural",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Chapultepec_Zoo_-_Jaguar_%2802%29.jpg/960px-Chapultepec_Zoo_-_Jaguar_%2802%29.jpg",
        "caption": "[🌿 Indivíduo em Vida] Onça-pintada em pelagem clássica com rosetas",
        "type": "living_specimen",
        "category": "life_view",
        "author": "Museo de Zoología"
      },
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Panthera_onca_skull.jpg/960px-Panthera_onca_skull.jpg",
        "caption": "[🦴 Esqueleto / Crânio] Crânio ósseo ultra-robusto com caninos perfurantes",
        "type": "skull",
        "category": "skeletal_view",
        "author": "Museu de História Natural"
      },
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Jaguar_%28Panthera_onca_palustris%29_male_Rio_Negro_2.JPG/960px-Jaguar_%28Panthera_onca_palustris%29_male_Rio_Negro_2.JPG",
        "caption": "[🌿 Indivíduo em Vida] Macho pantaneiro nadando no Rio Negro (Brasil)",
        "type": "living_specimen",
        "category": "life_view",
        "author": "Charles J. Sharp"
      }
    ],
    "etymology": "Do tupi 'îagûara' (onça/fera que salta e mata com uma mordida). Nome científico 'Panthera' (latim) e 'onca' (português/espanhol).",
    "bio": "A onça-pintada é o maior felino de todo o continente americano e o terceiro maior do mundo, atrás apenas do tigre e do leão. Habita desde as florestas tropicais densas da Amazônia e os alagados do Pantanal até o Chaco e o Cerrado. Ao contrário de outros grandes felinos que matam por sufocamento traqueal, a onça-pintada emprega uma mordida óssea letal que perfura diretamente os ossos temporais e parietais do crânio da presa ou esmaga a carapaça dorsal dura de cágados e tartarugas.",
    "curiosities": [
      "Possui a mordida mais potente entre todos os felinos do mundo em proporção à massa corporal, superando leões e tigres.",
      "É uma nadadora extraordinária, caçando jacarés, ariranhas e peixes de grande porte dentro de rios profundos.",
      "É a única espécie do gênero Panthera nativa das Américas.",
      "Seus caninos são tão curtos e grossos que conseguem perfurar o couro blindado de jacarés e o casco rígido de quelônios."
    ],
    "expert": {
      "cladogram": [
        "Metazoa",
        "Chordata",
        "Vertebrata",
        "Mammalia",
        "Carnivora",
        "Felidae",
        "Pantherinae",
        "Panthera",
        "Panthera onca"
      ],
      "osteology": "Endoesqueleto ósseo compacto com coluna vertebral extremamente flexível. Crânio curto e arredondado com crista sagital proeminente para ancoragem dos músculos temporais. Arco zigomático hipertrofiado conferindo abertura mandibular de alto torque.",
      "biomechanics": "Alavanca mandibular classe III de alta eficiência mecânica, capaz de gerar pressão de cisalhamento pontual superior a 9.000 Newtons sem risco de fratura sinfisária.",
      "histology": "Osso haversiano denso com alta densidade trabecular nos metápodes e úmero, adaptado para absorver choques de impacto na imobilização de presas pesadas."
    },
    "occurrences_count": 143000,
    "fossil_locations": "América do Sul (Brasil - Pantanal, Amazônia, Mata Atlântica), América Central e México",
    "is_custom_ingested": false
  },
  {
    "id": "polvo-comum",
    "name": "Polvo-Comum",
    "genus": "Octopus",
    "scientific_name": "Octopus vulgaris (Cuvier, 1797)",
    "era": "contemporaneo",
    "era_display": "Contemporâneo (Fauna Atual)",
    "period": "Holoceno / Atualidade",
    "epoch": "Época Contemporânea",
    "geological_range": "Presente (Espécie Vivente)",
    "group": "artropode-invertebrado",
    "group_display": "Molusco Invertebrado Cefalópode",
    "diet": "carnivoro",
    "diet_display": "Predador Carnívoro de Crustáceos e Peixes",
    "habitat": "aquatico",
    "skeletal_type": "invertebrado",
    "skeletal_composition": "Hidroesqueleto Muscular e Bico Quitinoso (Sem Ossos)",
    "is_contemporary": true,
    "conservation_status": "Pouco Preocupante (LC)",
    "length": "80 cm a 1.2 m (envergadura de braços)",
    "height": "20 cm (manto)",
    "weight": "3.0 a 10.0 kg",
    "speed": "40 km/h (Propulsão por jato d'água em fuga)",
    "bite_force": "Bico córneo quitinoso com secreção neurotóxica",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Pulpo_com%C3%BAn_%28Octopus_vulgaris%29%2C_Parque_natural_de_la_Arr%C3%A1bida%2C_Portugal%2C_2020-07-21%2C_DD_33.jpg/960px-Pulpo_com%C3%BAn_%28Octopus_vulgaris%29%2C_Parque_natural_de_la_Arr%C3%A1bida%2C_Portugal%2C_2020-07-21%2C_DD_33.jpg",
    "image_caption": "Polvo-comum camuflado sobre recifes rochosos",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Pulpo_com%C3%BAn_%28Octopus_vulgaris%29%2C_Parque_natural_de_la_Arr%C3%A1bida%2C_Portugal%2C_2020-07-21%2C_DD_33.jpg/960px-Pulpo_com%C3%BAn_%28Octopus_vulgaris%29%2C_Parque_natural_de_la_Arr%C3%A1bida%2C_Portugal%2C_2020-07-21%2C_DD_33.jpg",
        "caption": "[🌿 Indivíduo em Vida] Octopus vulgaris em ambiente marinho natural",
        "type": "living_specimen",
        "category": "life_view",
        "author": "Diego Delso"
      },
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Octopus_vulgaris_Merculiano.jpg/960px-Octopus_vulgaris_Merculiano.jpg",
        "caption": "[🔬 Anatomia Estrutural] Diagrama anatômico dos 8 braços, sifão e órgãos internos",
        "type": "anatomy",
        "category": "anatomy_view",
        "author": "G. Merculiano"
      }
    ],
    "etymology": "Do grego 'okto' (oito) e 'pous' (pés), com 'vulgaris' (comum). Descrito pelo pai da anatomia comparada Georges Cuvier em 1797.",
    "bio": "Octopus vulgaris é o ápice da inteligência entre todos os animais invertebrados da Terra. Como um molusco cefalópode sem concha externa ou esqueleto rígido, seu corpo é um hidroesqueleto muscular puro: consegue passar através de qualquer orifício desde que seu minúsculo bico quitinoso (a única parte sólida do corpo) consiga passar. Possui três corações, sangue azul à base de cobre (hemocianina) e um cérebro com mais de 500 milhões de neurônios, dos quais dois terços residem diretamente nos seus 8 braços táteis autônomos.",
    "curiosities": [
      "É um INVERTEBRADO COMPLETO: não possui coluna vertebral nem ossos. Sua única estrutura rígida é um bico afiado parecido com o de um papagaio feito de quitina pura.",
      "Possui TRÊS corações e sangue azul: o oxigênio é transportado por hemocianina à base de cobre em vez de hemoglobina à base de ferro.",
      "Dois terços de todos os seus neurônios estão distribuídos nos próprios braços, permitindo que cada tentáculo 'pense', sinta sabores e decida de forma independente.",
      "Muda de cor, padrão e textura de pele em 200 milissegundos graças a milhares de células de pigmento chamadas cromatóforos controladas diretamente pelos nervos."
    ],
    "expert": {
      "cladogram": [
        "Metazoa",
        "Mollusca",
        "Invertebrata",
        "Cephalopoda",
        "Coleoidea",
        "Octopoda",
        "Incirrata",
        "Octopodidae",
        "Octopus",
        "Octopus vulgaris"
      ],
      "osteology": "Sem tecido esquelético mineralizado (ausência total de ossos ou concha interna). Sustentação por hidrostato muscular (três arranjos ortogonais de fibras musculares: longitudinais, transversais e helicoidais). Bico bucal rígido de betaproteína e alfa-quitina densamente entrecruzada.",
      "biomechanics": "Locomoção multifuncional: rastejamento bipedal/polipedal com ventosas a vácuo operadas por esfíncteres musculares e propulsão a jato por ejeção forçada de água através do funil sifonal.",
      "histology": "Pele dérmica com arquitetura tricamada de cromatóforos elásticos, iridóforos refletores e leucóforos difusores, circundada por papilas musculares retráteis geradoras de camuflagem 3D."
    },
    "occurrences_count": 42000,
    "fossil_locations": "Distribuição Cosmopolita em Mares Tropicais, Subtropicais e Temperados do Globo",
    "is_custom_ingested": false
  },
  {
    "id": "tubarao-branco",
    "name": "Tubarão-Branco",
    "genus": "Carcharodon",
    "scientific_name": "Carcharodon carcharias (Linnaeus, 1758)",
    "era": "contemporaneo",
    "era_display": "Contemporâneo (Fauna Atual)",
    "period": "Holoceno / Atualidade",
    "epoch": "Época Contemporânea",
    "geological_range": "Presente (Espécie Vivente)",
    "group": "reptil-marinho",
    "group_display": "Chondrichthyes (Peixe Cartilaginoso)",
    "diet": "carnivoro",
    "diet_display": "Superpredador Pelágico Carnívoro",
    "habitat": "aquatico",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Cartilagem Calcificada (Sem Ossos Verdadeiros)",
    "is_contemporary": true,
    "conservation_status": "Vulnerável (VU)",
    "length": "4.5 a 6.1 m",
    "height": "1.8 m (dorso)",
    "weight": "1.200 a 2.300 kg",
    "speed": "40 a 56 km/h (Ataque explosivo vertical)",
    "bite_force": "18.000 N",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/960px-White_shark.jpg",
    "image_caption": "Tubarão-branco em nado de patrulha oceânica",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/960px-White_shark.jpg",
        "caption": "[🌿 Indivíduo em Vida] Tubarão-branco adulto em águas costeiras",
        "type": "living_specimen",
        "category": "life_view",
        "author": "Terry Goss"
      },
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Carcharodon_carcharias_skeleton_%28flipped%29.jpg/960px-Carcharodon_carcharias_skeleton_%28flipped%29.jpg",
        "caption": "[🦴 Esqueleto / Cartilagem] Esqueleto cartilaginoso completo preparado e mandíbulas",
        "type": "cartilage",
        "category": "skeletal_view",
        "author": "Museu de História Natural"
      }
    ],
    "etymology": "Do grego 'karcharos' (afiado/serrilhado) e 'odous' (dente), com 'carcharias' (tubarão). Descrito por Carl Linnaeus em 1758.",
    "bio": "O grande tubarão-branco é o mais icônico superpredador dos oceanos modernos. Como membro da classe Chondrichthyes, NÃO possui ossos verdadeiros: todo o seu esqueleto é formado por cartilagem elástica reforçada por prismas microscópicos de fosfato de cálcio (cartilagem prismática calcificada). Esta estrutura o torna leve e incrivelmente ágil na água. Possui eletrorrecepção através das ampolas de Lorenzini, detectando batimentos cardíacos de presas a centenas de metros de distância.",
    "curiosities": [
      "NÃO tem ossos! Todo o seu esqueleto é feito 100% de cartilagem (o mesmo material do nariz e orelhas humanas), leve e altamente flexível.",
      "Possui até 300 dentes serrilhados em várias fileiras contínuas que se movem como esteiras rolantes, substituindo dentes perdidos ao longo da vida toda.",
      "Possui endotermia regional (mesotermia): consegue manter seus músculos de nado e estômago até 14 °C mais quentes que a água gelada do oceano.",
      "Detecta campos elétricos minúsculos de 1 bilionésimo de volt emitidos pelos batimentos cardíacos de animais escondidos na areia."
    ],
    "expert": {
      "cladogram": [
        "Metazoa",
        "Chordata",
        "Vertebrata",
        "Chondrichthyes",
        "Elasmobranchii",
        "Lamniformes",
        "Lamnidae",
        "Carcharodon",
        "Carcharodon carcharias"
      ],
      "osteology": "Endoesqueleto cartilaginoso prismático tecidular calcificado ('areolar and tessellated calcification'). Mandíbula superior hiostílica frouxamente conectada ao condrocrânio, permitindo projeção anterior protátil durante o ataque.",
      "biomechanics": "Mecanismo de 'biting-burst': projeção palatoquadrada com depressão mandibular de 18.000 N associada a dentes triangulares com serrilhas de passo regular de 0.5 mm atuando como serra mecânica.",
      "histology": "Cartilagem hialina avascular cercada por pericôndrio fibroso denso. Dentes com polpa central vascularizada recoberta por dentina ortodentínica e camada externa hipermineralizada de esmaltoide (sem hidroxiapatita verdadeira)."
    },
    "occurrences_count": 65000,
    "fossil_locations": "Oceanos Globais Tropicais e Temperados (África do Sul, Austrália, Califórnia, México, Mediterrâneo)",
    "is_custom_ingested": false
  },
  {
    "id": "anomalocaris",
    "name": "Anomalocaris canadensis",
    "genus": "Anomalocaris",
    "scientific_name": "Anomalocaris canadensis (Whiteaves, 1892)",
    "era": "paleozoico",
    "era_display": "Paleozoico",
    "period": "Cambriano",
    "epoch": "Cambriano Série 3",
    "geological_range": "518 a 505 Ma",
    "group": "artropode-invertebrado",
    "group_display": "Artrópode Predador Primitivo",
    "diet": "carnivoro",
    "diet_display": "Superpredador Carnívoro",
    "habitat": "aquatico",
    "skeletal_type": "invertebrado",
    "skeletal_composition": "Exoesqueleto Cuticular Esclerotizado (Sem Ossos)",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "60 cm a 1.0 m",
    "height": "15 cm",
    "weight": "~3 a 6 kg",
    "speed": "20 km/h (Nado ondulatório)",
    "bite_force": "350 N (Aparelho bucal radial)",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Anomalocaris_canadensis.png/960px-Anomalocaris_canadensis.png",
    "image_caption": "Representação em vida de Anomalocaris caçando nos mares cambrianos",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Anomalocaris_canadensis.png/960px-Anomalocaris_canadensis.png",
        "caption": "[🌿 Indivíduo em Vida] Reconstrução em vida de Anomalocaris canadensis",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Katrina Kenny"
      },
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/20191203_Anomalocaris_canadensis.png/960px-20191203_Anomalocaris_canadensis.png",
        "caption": "[🔬 Anatomia Estrutural] Apêndices raptoriais e lobos natatórios",
        "type": "anatomy",
        "category": "anatomy_view",
        "author": "Junnn11"
      }
    ],
    "etymology": "Do grego: 'camarão anômalo', devido aos apêndices frontais inicialmente confundidos com caudas de crustáceos. Descrito por Joseph Whiteaves em 1892.",
    "bio": "Anomalocaris foi o ápice incontestável da teia alimentar nos oceanos da Explosão Cambriana. Equipado com olhos compostos gigantes em hastes flexíveis (com mais de 16.000 lentes de omatídeos individuais), possuía uma acuidade visual superior à de quase todos os invertebrados vivos hoje. Movia-se graciosamente pelas águas ondulando lobos laterais flexíveis e capturava presas com dois apêndices articulados espinhosos, conduzindo-as a uma boca em formato de anel com lâminas dentadas concêntricas.",
    "curiosities": [
      "Foi originalmente montado errado pelos primeiros cientistas: o apêndice frontal foi classificado como camarão, a boca como água-viva e o corpo como esponja-do-mar!",
      "Seus olhos compostos tinham 16.000 lentes individuais de omatídeos, dando-lhe visão binocular de altíssima resolução.",
      "Considerado o primeiro superpredador marinho de grande porte na história do planeta Terra.",
      "Fósseis de trilobitas cambrianos mostram marcas de mordidas curvas idênticas ao aparelho bucal de Anomalocaris."
    ],
    "expert": {
      "cladogram": [
        "Panarthropoda",
        "Radiodonta",
        "Anomalocarididae",
        "Anomalocaris",
        "Anomalocaris canadensis"
      ],
      "osteology": "Exoesqueleto cuticular esclerotizado não mineralizado. Dois apêndices raptoriais anteriores com 14 podômeros espinhosos. Cone oral triradial com placas esclerotizadas.",
      "biomechanics": "Locomoção por nado ondulatório metacrônico através de 11 pares de lobos laterais imbricados, funcionando como hidrofólios eficientes com baixo custo metabólico.",
      "histology": "Preservação de tecidos moles excepcional do tipo 'Burgess Shale' por substituição de aluminossilicatos em folhelhos negros anóxicos."
    },
    "occurrences_count": 65,
    "fossil_locations": "Canadá (Burgess Shale), Estados Unidos (Utah), China (Chengjiang)",
    "is_custom_ingested": false
  },
  {
    "id": "arthropleura",
    "name": "Arthropleura armata",
    "genus": "Arthropleura",
    "scientific_name": "Arthropleura armata (Meyer, 1853)",
    "era": "paleozoico",
    "era_display": "Paleozoico",
    "period": "Carbonífero",
    "epoch": "Carbonífero Superior (Pensilvaniano)",
    "geological_range": "345 a 295 Ma",
    "group": "artropode-invertebrado",
    "group_display": "Miriápode Gigante",
    "diet": "herbivoro",
    "diet_display": "Detritívoro / Herbívoro de Licófitas",
    "habitat": "terrestre",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Osso e Cartilagem",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "2.5 a 2.6 m",
    "height": "40 cm",
    "weight": "~50 kg",
    "speed": "8 km/h",
    "bite_force": "800 N (Mandíbulas mastigadoras)",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Arthropleura_BW.jpg/960px-Arthropleura_BW.jpg",
    "image_caption": "Representação em vida de Arthropleura cruzando as florestas pantanosas de carvão",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Arthropleura_BW.jpg/960px-Arthropleura_BW.jpg",
        "caption": "Reconstrução em vida de Arthropleura gigante",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Nobu Tamura"
      }
    ],
    "etymology": "Do grego: 'arthron' (articulado) e 'pleura' (lado/costela). Descrito por Hermann von Meyer em 1853.",
    "bio": "Arthropleura é o maior invertebrado terrestre que já caminhou sobre a Terra. Parente distante dos modernos piolhos-de-cobra e centopeias, este milípede descomunal alcançava mais de 2,6 metros de comprimento e pesava 50 kg. Prosperou nas imensas florestas equatoriais úmidas do Carbonífero, onde os níveis de oxigênio atmosférico chegavam a incríveis 35% (contra 21% atuais), permitindo que seu sistema respiratório traqueal sustentasse uma massa corporal gigantesca sem asfixia.",
    "curiosities": [
      "Maior criatura invertebrada terrestre de toda a história da vida na Terra, com mais de 60 patas articuladas.",
      "Seu tamanho foi viabilizado pelos 35% de oxigênio atmosférico do Carbonífero e pela ausência de grandes predadores terrestres vertebrados.",
      "Pegadas fósseis de suas trilhas preservadas em rochas na Escócia chegam a 50 cm de largura de rastro contínuo.",
      "Extinguiu-se no início do Permiano quando o clima global secou e as florestas tropicais de carvão colapsaram."
    ],
    "expert": {
      "cladogram": [
        "Myriapoda",
        "Diplopoda",
        "Arthropleuridea",
        "Arthropleuridae",
        "Arthropleura",
        "Arthropleura armata"
      ],
      "osteology": "Exoesqueleto cuticular composto de cerca de 30 tergitos dorsais trilobados, reforçados por compostos escleroproteicos e taninos orgânicos.",
      "biomechanics": "Locomoção multifásica através de dezenas de pares de pernas operando em ondas de propulsão metacrônicas coordenadas de baixo atrito.",
      "histology": "Estrutura de endocutícula densamente lamelada preservada em ambientes de sedimentação de pântanos carboníferos anóxicos."
    },
    "occurrences_count": 35,
    "fossil_locations": "Inglaterra, Escócia, Alemanha, França, Estados Unidos (Pensilvânia e Novo México)",
    "is_custom_ingested": false
  },
  {
    "id": "basilosaurus",
    "name": "Basilosaurus cetoides",
    "genus": "Basilosaurus",
    "scientific_name": "Basilosaurus cetoides (Owen, 1839)",
    "era": "cenozoico",
    "era_display": "Cenozoico",
    "period": "Paleógeno",
    "epoch": "Eoceno Superior",
    "geological_range": "40 a 34 Ma",
    "group": "mamifero-megafauna",
    "group_display": "Cetáceo Arqueoceto Predador Gigante",
    "diet": "carnivoro",
    "diet_display": "Superpredador Marinho Carnívoro",
    "habitat": "aquatico",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Osso e Cartilagem",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "18.0 a 20.0 m",
    "height": "2.5 m (corpo serpentiforme)",
    "weight": "14.000 a 16.000 kg",
    "speed": "30 km/h (Nado ondulatório axial)",
    "bite_force": "16.000 N",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Basilosaurus_cetoides.png/960px-Basilosaurus_cetoides.png",
    "image_caption": "Representação em vida de Basilosaurus cetoides patrulhando os mares do Eoceno",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Basilosaurus_cetoides.png/960px-Basilosaurus_cetoides.png",
        "caption": "Reconstrução em vida de Basilosaurus cetoides",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Katrina Kenny"
      }
    ],
    "etymology": "Do grego 'basileus' (rei) e 'sauros' (lagarto) — batizado como réptil antes de se descobrir que era mamífero cetáceo — e 'cetoides' (parecido com baleia). Descrito por Richard Owen em 1839.",
    "bio": "Basilosaurus foi o primeiro cetáceo de proporções colossais a dominar os oceanos globais após o evento de extinção do Cretáceo. Apesar do seu nome ('lagarto rei', dado por ter sido inicialmente confundido com um réptil marinho fóssil), era uma baleia pré-histórica ancestral com corpo serpentiforme de quase 20 metros de comprimento. Retinha ainda membros posteriores vestigiais diminutos de 35 cm — evidência fóssil espetacular da transição dos mamíferos terrestres de quatro patas para o mar.",
    "curiosities": [
      "Retinha patas traseiras completas com fêmur, tíbia e dedos, embora minúsculas (35 cm), vestígios diretos de seus ancestrais terrestres!",
      "Crânios de filhotes de Dorudon (outra baleia ancestral) encontrados no Egito exibem marcas de mordidas profundas de Basilosaurus.",
      "O vale fóssil de Wadi Al-Hitan (Egito) contém centenas de esqueletos intactos de Basilosaurus preservados na areia do deserto.",
      "Possuía dentes diferenciados com raízes duplas serrilhadas para cortar carne e esmagar cabeças de presas."
    ],
    "expert": {
      "cladogram": [
        "Mammalia",
        "Cetartiodactyla",
        "Cetacea",
        "Archaeoceti",
        "Basilosauridae",
        "Basilosaurus cetoides"
      ],
      "osteology": "Vértebras lombares e caudais hiperalongadas pneumaticamente preenchidas com líquido sinovial medular. Membro pélvico vestigial não articulado com a coluna vertebral. Dentes heterodontes com molares multicuspidados.",
      "biomechanics": "Ondulação axial anguiliforme a subcarangiforme: nado sinusoidal serpentino horizontal em águas superficiais quentes costeiras do mar de Tétis.",
      "histology": "Tecido ósseo esponjoso vascularizado em vértebras reduzindo gravidade específica, associado a costelas compactas pachyostóticas atuando como lastro hidrostático."
    },
    "occurrences_count": 60,
    "fossil_locations": "Egito (Wadi Al-Hitan - Vale das Baleias), Estados Unidos (Alabama, Louisiana, Mississipi), Jordânia",
    "is_custom_ingested": false
  },
  {
    "id": "brachiosaurus",
    "name": "Brachiosaurus altithorax",
    "genus": "Brachiosaurus",
    "scientific_name": "Brachiosaurus altithorax (Riggs, 1903)",
    "era": "mesozoico",
    "era_display": "Mesozoico",
    "period": "Jurássico",
    "epoch": "Jurássico Superior (Kimmeridgiano ao Titoniano)",
    "geological_range": "154 a 150 Ma",
    "group": "dinossauro",
    "group_display": "Sauropodomorfo Macronário Gigante",
    "diet": "herbivoro",
    "diet_display": "Herbívoro de Copa Alta",
    "habitat": "terrestre",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Osso e Cartilagem",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "26.0 m",
    "height": "12.0 a 13.0 m (cabeça erguida)",
    "weight": "38.000 a 45.000 kg",
    "speed": "15 km/h",
    "bite_force": "8.000 N (Dentes espatulados arrancadores de folhas)",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Brachiosaurus_DB.jpg/960px-Brachiosaurus_DB.jpg",
    "image_caption": "Representação em vida de Brachiosaurus altithorax pastando nas copas das coníferas jurássicas",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Brachiosaurus_DB.jpg/960px-Brachiosaurus_DB.jpg",
        "caption": "Reconstrução em vida de Brachiosaurus altithorax",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Dmitry Bogdanov"
      }
    ],
    "etymology": "Do grego 'brachion' (braço) e 'sauros' (lagarto), com 'altithorax' (tórax profundo/alto). Descrito por Elmer Riggs em 1903.",
    "bio": "Brachiosaurus foi um dos mais monumentais animais a caminhar sobre a Terra. Ao contrário da maioria dos outros sauropodes que mantinham o pescoço quase horizontal, o Brachiosaurus possuía membros dianteiros significativamente mais longos que os traseiros, conferindo um dorso inclinado como o de uma girafa que permitia que seu pescoço de 9 metros alcançasse as copas das mais altas coníferas e cicadáceas jurássicas a 13 metros de altura, onde nenhum outro herbivore conseguia alcançar.",
    "curiosities": [
      "Seu coração precisava pesar cerca de 400 kg para bombear sangue oxigenado a mais de 10 metros de altura até o cérebro.",
      "Suas patas dianteiras eram maiores que as traseiras (daí seu nome 'lagarto braço').",
      "Suas vértebras cervicais eram hiper-pneumatizadas com cavidades de ar ligadas a sacos aéreos respiratórios semelhantes aos das aves modernas.",
      "Um humano adulto ficaria abaixo da altura do seu joelho dianteiro."
    ],
    "expert": {
      "cladogram": [
        "Dinosauria",
        "Saurischia",
        "Sauropoda",
        "Macronaria",
        "Titanosauriformes",
        "Brachiosauridae",
        "Brachiosaurus altithorax"
      ],
      "osteology": "Vértebras com pleuroceles profundas e sistema trabecular interno reduzindo em até 60% a massa óssea cervical. Dentes em forma de espátula cinzelada de esmalte espesso.",
      "biomechanics": "Postura dorsal ascendente com escápula hiperalongada orientada a 55 graus em relação ao eixo horizontal axial, otimizando navegação vertical arbórea.",
      "histology": "Taxa metabólica com gigantotermia/homeotermia inercial sustentada por fluxo respiratório unidirecional através de sacos aéreos pulmonares extensos."
    },
    "occurrences_count": 62,
    "fossil_locations": "Estados Unidos (Formação Morrison - Colorado, Utah, Wyoming, Oklahoma)",
    "is_custom_ingested": false
  },
  {
    "id": "charnia",
    "name": "Charnia masoni",
    "genus": "Charnia",
    "scientific_name": "Charnia masoni (Ford, 1958)",
    "era": "precambriano",
    "era_display": "Pré-Cambriano",
    "period": "Ediacarano",
    "epoch": "Ediacarano Inferior a Superior",
    "geological_range": "570 a 555 Ma",
    "group": "ediacarano",
    "group_display": "Biota Ediacarana",
    "diet": "filtrador",
    "diet_display": "Osmotrofia / Filtrador Passivo",
    "habitat": "bentonico",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Osso e Cartilagem",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "15 cm a 2.0 m",
    "height": "Até 2.0 m ereto",
    "weight": "~300 g a 3 kg",
    "speed": "Séssil (Fixo ao substrato)",
    "bite_force": "Inexistente",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Charnia_masoni.jpg/960px-Charnia_masoni.jpg",
    "image_caption": "Representação em vida de Charnia ereta ancorada no fundo abissal",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Charnia_masoni.jpg/960px-Charnia_masoni.jpg",
        "caption": "Reconstrução artística de Charnia em vida no mar profundo",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Nobu Tamura"
      }
    ],
    "etymology": "Nomeado em homenagem à floresta de Charnwood (Inglaterra) e ao estudante colegial Roger Mason, que descobriu o primeiro espécime em 1957.",
    "bio": "Charnia é um fóssil marco que revolucionou a paleontologia moderna: sua descoberta em Leicestershire provou pela primeira vez que formas de vida macroscópicas complexas existiram muito antes do período Cambriano. Com formato semelhante a uma fronde de samambaia, vivia ereta no fundo marinho, ancorada por um bulbo discoidal em águas profundas, muito abaixo da zona de penetração da luz solar, o que refuta que fosse uma planta ou alga fotossintetizante.",
    "curiosities": [
      "Sua descoberta em 1957 por um garoto de 15 anos mudou a geologia mundial, demonstrando a existência de vida macroscópica no Pré-Cambriano.",
      "Vivia em ambientes marinhos afóticos profundos (onde a luz solar nunca chega), alimentando-se de nutrientes dissolvidos por osmotrofia passiva.",
      "Apresenta padrão de crescimento fractal auto-similar: cada ramo lateral replica a estrutura do ramo principal em miniatura.",
      "Alguns espécimes descobertos em Mistaken Point (Canadá) ultrapassam 2 metros de comprimento."
    ],
    "expert": {
      "cladogram": [
        "Biota Ediacarana",
        "Rangeomorpha",
        "Charniidae",
        "Charnia",
        "Charnia masoni"
      ],
      "osteology": "Sem tecido mineralizado ou espículas calcárias/silicosas. Fronde quilar flexível com ramificações em 4 níveis de auto-similaridade fractal.",
      "biomechanics": "Morfologia hidrodinâmica projetada para minimizar arrasto de corrente laminar marinha profunda, maximizando área de superfície de absorção osmotrófica.",
      "histology": "Tafonomia do tipo 'Mistaken Point' (E-type): cinzas vulcânicas submarinas depositaram-se instantaneamente sobre os organismos vivos no fundo do oceano."
    },
    "occurrences_count": 28,
    "fossil_locations": "Inglaterra (Charnwood Forest), Canadá (Mistaken Point, Terra Nova), Rússia",
    "is_custom_ingested": false
  },
  {
    "id": "dickinsonia",
    "name": "Dickinsonia costata",
    "genus": "Dickinsonia",
    "scientific_name": "Dickinsonia costata (Sprigg, 1947)",
    "era": "precambriano",
    "era_display": "Pré-Cambriano",
    "period": "Ediacarano",
    "epoch": "Ediacarano Superior",
    "geological_range": "558 a 555 Ma",
    "group": "ediacarano",
    "group_display": "Biota Ediacarana (Metazoário Primitivo)",
    "diet": "filtrador",
    "diet_display": "Absorção Direta / Osmotrofia",
    "habitat": "bentonico",
    "skeletal_type": "invertebrado",
    "skeletal_composition": "Hidroesqueleto Compartimentado Flexível (Sem Ossos)",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "4 mm a 1.4 m",
    "height": "~3 mm",
    "weight": "~50 g a 2.5 kg",
    "speed": "Rastejamento ultra-lento",
    "bite_force": "Inexistente (Sem mandíbula)",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Dickinsonia_costata.jpg/960px-Dickinsonia_costata.jpg",
    "image_caption": "Representação artística em vida de Dickinsonia sobre o leito marinho microbiano",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Dickinsonia_costata.jpg/960px-Dickinsonia_costata.jpg",
        "caption": "[🌿 Indivíduo em Vida] Reconstrução em vida no leito oceânico ediacarano",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Nobu Tamura"
      },
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/DickinsoniaCostata.jpg/960px-DickinsoniaCostata.jpg",
        "caption": "[🦴 Registro Fóssil] Molde fóssil preservado em arenito quartzítico da Austrália",
        "type": "fossil",
        "category": "skeletal_view",
        "author": "Museu da Austrália do Sul"
      }
    ],
    "etymology": "Homenagem a Ben Dickinson, diretor de minas da Austrália do Sul. Descrito por Reginald Sprigg em 1947.",
    "bio": "Dickinsonia é um dos mais fascinantes e misteriosos organismos da história da vida na Terra. Com formato oval achatado e padrão de câmaras acolchoadas em simetria de reflexão deslizante, habitava o fundo dos oceanos rasos do período Ediacarano. Em 2018, análises de biomarcadores lipídicos em fósseis russos do Mar Branco detectaram moléculas de colesterol intocado, provando cientificamente que Dickinsonia pertencia ao reino animal (Metazoa), sendo um dos animais mais antigos conhecidos pela ciência.",
    "curiosities": [
      "Análises de biomarcadores de esteroides em 2018 confirmaram que possuía colesterol animal autêntico, encerrando décadas de debate sobre ser fungo ou alga.",
      "Possuía crescimento contínuo por adição de novos módulos corporais em uma das extremidades.",
      "Deixava 'marcas de descanso' no lodo marinho primitivo, sugerindo que conseguia se mover lentamente para se alimentar de tapetes bacterianos.",
      "Seu corpo não apresentava concha, ossos ou cutícula mineralizada, sobrevivendo em um oceano livre de grandes predadores carnívoros."
    ],
    "expert": {
      "cladogram": [
        "Biota Ediacarana",
        "Vendobionta",
        "Proarticulata",
        "Dipleurozoa",
        "Dickinsoniidae",
        "Dickinsonia costata"
      ],
      "osteology": "Sem estruturas mineralizadas ou esqueleto ósseo. Corpo constituído de hidroesqueleto compartimentado com unidades modulares pneumatizadas (isômeros) dispostas em padrão alternado de simetria espelhada (glide reflection).",
      "biomechanics": "Alimentação por fagocitose ou osmotrofia através da superfície ventral em contato com esteiras microbianas. Sem apêndices locomotores especializados.",
      "histology": "Impressões tafonômicas em relevo negativo ou positivo sob filmes de tapetes microbianos ('Máscaras da Morte') preservadas em rochas siliciclásticas do Ediacarano."
    },
    "occurrences_count": 42,
    "fossil_locations": "Austrália (Ediacara Hills), Rússia (Costa do Mar Branco), Ucrânia (Podólia)",
    "is_custom_ingested": false
  },
  {
    "id": "dimetrodon",
    "name": "Dimetrodon grandis",
    "genus": "Dimetrodon",
    "scientific_name": "Dimetrodon grandis (Case, 1907)",
    "era": "paleozoico",
    "era_display": "Paleozoico",
    "period": "Permiano",
    "epoch": "Permiano Inferior (Cisuraliano)",
    "geological_range": "295 a 272 Ma",
    "group": "sinapsideo",
    "group_display": "Sinapsídeo / Ancestral dos Mamíferos",
    "diet": "carnivoro",
    "diet_display": "Superpredador Carnívoro",
    "habitat": "terrestre",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Osso e Cartilagem",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "3.5 a 4.0 m",
    "height": "1.6 m (com vela)",
    "weight": "250 kg",
    "speed": "25 km/h",
    "bite_force": "3.200 N",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Dimetrodon_TD.png/960px-Dimetrodon_TD.png",
    "image_caption": "Representação em vida de Dimetrodon caminhando sobre as planícies áridas do Permiano",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Dimetrodon_TD.png/960px-Dimetrodon_TD.png",
        "caption": "Reconstrução em vida de Dimetrodon grandis",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Smokeybjb"
      },
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Dimetrodon_grandis_3D_Model_Reconstruction.png/960px-Dimetrodon_grandis_3D_Model_Reconstruction.png",
        "caption": "Modelo anatômico 3D com postura de caminhada alta (high walk)",
        "type": "reconstruction",
        "category": "life_view",
        "author": "Museu de História Natural"
      }
    ],
    "etymology": "Do grego: 'duas medidas de dentes', aludindo à diferenciação de dentes caniniformes e pós-caninos. Descrito por Edward Drinker Cope em 1878.",
    "bio": "Embora seja frequentemente confundido com um dinossauro na cultura popular, Dimetrodon é na verdade um sinapsídeo pelicossauro, muito mais aparentado conosco, mamíferos, do que com os dinossauros ou lagartos! Sua característica mais marcante é a colossal vela dorsal sustentada por espinhas neurais alongadas irrigadas por vasos sanguíneos, que funcionava como um radiador biológico para termorregulação rápida, aquecendo-o sob o sol matinal para caçar presas ainda letárgicas.",
    "curiosities": [
      "NÃO é um dinossauro! É um sinapsídeo primitivo pertencente à mesma linhagem que deu origem direta aos mamíferos.",
      "Possuía dentes diferenciados (incisivos, caninos rasgadores e trituradores), a primeira ocorrência evolutiva de heterodontia complexa.",
      "A grande vela dorsal continha rica rede vascular e canais que permitiam aquecer seu sangue sob o sol em tempo recorde.",
      "Viveu e foi extinto cerca de 40 milhões de anos ANTES do surgimento do primeiro dinossauro verdadeiro."
    ],
    "expert": {
      "cladogram": [
        "Synapsida",
        "Eupelycosauria",
        "Sphenacodontia",
        "Sphenacodontidae",
        "Dimetrodon",
        "Dimetrodon grandis"
      ],
      "osteology": "Crânio alto e estreito com fenestra temporal única inferior. Espinhas neurais vertebrais hiperalongadas (até 1.5 m) com secção em haltere (figura de oito).",
      "biomechanics": "Mandíbula com dentes caniniformes serrilhados e côndilo articular mandibular rebaixado, conferindo mordida em tesoura veloz e cortante.",
      "histology": "Espinhas neurais com tecido ósseo vascular periosteal especializado sem canais de Havers lamelares, evidenciando função termorreguladora e de sinalização visual sexual."
    },
    "occurrences_count": 112,
    "fossil_locations": "Estados Unidos (Texas - Red Beds, Oklahoma), Alemanha (Formação Tambach)",
    "is_custom_ingested": false
  },
  {
    "id": "dunkleosteus",
    "name": "Dunkleosteus terrelli",
    "genus": "Dunkleosteus",
    "scientific_name": "Dunkleosteus terrelli (Newberry, 1873)",
    "era": "paleozoico",
    "era_display": "Paleozoico",
    "period": "Devoniano",
    "epoch": "Devoniano Superior (Famenniano)",
    "geological_range": "382 a 358 Ma",
    "group": "reptil-marinho",
    "group_display": "Peixe Placodermo Couraçado",
    "diet": "carnivoro",
    "diet_display": "Superpredador Carnívoro",
    "habitat": "aquatico",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Placas Dérmicas Ósseas Cefálicas e Esqueleto Cartilaginoso",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "8.8 m",
    "height": "2.5 m",
    "weight": "3.600 a 4.000 kg",
    "speed": "30 km/h (Ataque explosivo)",
    "bite_force": "5.300 N nas pontas, 44.000 N/cm²",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Dunkleosteus_terrelli.png/960px-Dunkleosteus_terrelli.png",
    "image_caption": "Representação em vida de Dunkleosteus em águas costeiras devonianas",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Dunkleosteus_terrelli.png/960px-Dunkleosteus_terrelli.png",
        "caption": "[🌿 Indivíduo em Vida] Reconstrução em vida de Dunkleosteus terrelli",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Katrina Kenny"
      },
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Dunkleosteus_model.jpg/960px-Dunkleosteus_model.jpg",
        "caption": "[🦴 Esqueleto / Crânio] Armadura dérmica óssea e placas cortantes",
        "type": "skull",
        "category": "skeletal_view",
        "author": "Museu de História Natural de Cleveland"
      }
    ],
    "etymology": "Homenagem a David Dunkle, curador do Museu de Cleveland, mais o grego 'osteus' (osso). Espécie homenageia Jay Terrell.",
    "bio": "Dunkleosteus foi o titânico governante dos mares do Devoniano, a chamada 'Era dos Peixes'. Protegido por uma armadura de placas ósseas dérmicas de até 5 cm de espessura na cabeça e no tórax, não possuía dentes verdadeiros; em vez disso, suas mandíbulas formavam lâminas ósseas auto-afiáveis que se encaixavam com precisão de guilhotina. Seu sistema de quatro barras biomecânicas permitia escancarar a boca em 20 milissegundos, gerando sucção colossal que tragava tubarões primitivos inteiros antes de triturá-los.",
    "curiosities": [
      "Abria a boca em 1/50 de segundo, criando um vórtice de vácuo hidrodinâmico que engolia presas inteiras.",
      "Sua força de mordida concentrada na ponta das lâminas alcançava 44.000 Newtons por centímetro quadrado, comparável ao T-Rex.",
      "As placas ósseas da mandíbula se afiavam sozinhas toda vez que ele fechava a boca, mantendo o corte sempre afiado.",
      "Fósseis de tubarões devonianos como Cladoselache são encontrados regurgitados em bolus fossilizados de Dunkleosteus."
    ],
    "expert": {
      "cladogram": [
        "Gnathostomata",
        "Placodermi",
        "Arthrodira",
        "Pachyosteomorphi",
        "Dunkleosteidae",
        "Dunkleosteus"
      ],
      "osteology": "Escudo cefalotorácico com placas dérmicas suturadas por articulação ginglymus nucal móvel. Lâminas gnatocêntricas supragnatal anterior, posterior e inferognatal.",
      "biomechanics": "Mecanismo cinemático de articulação de 4 barras: elevação do crânio associada à depressão mandibular simultânea gerando 5.300 N de força pontual de cisalhamento.",
      "histology": "Osso laminar periósteo espesso sobre camada intermediária de tecido trabecular esponjoso vascularizado, com ausência de dentina verdadeira nas lâminas gnatócitas."
    },
    "occurrences_count": 58,
    "fossil_locations": "Estados Unidos (Ohio, Cleveland Shale), Marrocos, Polônia, Bélgica",
    "is_custom_ingested": false
  },
  {
    "id": "gorgonops",
    "name": "Gorgonops torvus",
    "genus": "Gorgonops",
    "scientific_name": "Gorgonops torvus (Owen, 1876)",
    "era": "paleozoico",
    "era_display": "Paleozoico",
    "period": "Permiano",
    "epoch": "Permiano Superior (Lopingiano)",
    "geological_range": "260 a 254 Ma",
    "group": "sinapsideo",
    "group_display": "Terapsídeo Gorgonopsiano (Dente-de-Sabre do Permiano)",
    "diet": "carnivoro",
    "diet_display": "Superpredador Carnívoro Cursorial",
    "habitat": "terrestre",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Osso e Cartilagem",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "2.5 a 3.0 m",
    "height": "1.0 m",
    "weight": "250 a 300 kg",
    "speed": "35 km/h",
    "bite_force": "2.800 N + golpe de canino de 12 cm",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Gorgonops_torvus_life_restoration.png/960px-Gorgonops_torvus_life_restoration.png",
    "image_caption": "Representação em vida de Gorgonops torvus caçando nos desertos do Permiano Superior",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Gorgonops_torvus_life_restoration.png/960px-Gorgonops_torvus_life_restoration.png",
        "caption": "Reconstrução em vida de Gorgonops torvus",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Dmitry Bogdanov"
      }
    ],
    "etymology": "Do grego 'Gorgona' (monstro mítico com olhar que petrifica) e 'ops' (face/olhar). Descrito por Richard Owen em 1876.",
    "bio": "Gorgonops foi o superpredador terrestre supremo do final do período Permiano, muito antes do surgimento dos dinossauros. Pertencente ao grupo dos terapsídeos (os chamados 'répteis parecidos com mamíferos'), foi o primeiro animal na história da evolução terrestre a desenvolver caninos gigantes em formato de sabre de até 12 cm. Suas patas dianteiras e traseiras eram dispostas quase verticalmente sob o corpo, conferindo uma postura ágil e marcha cursorial rápida para caçar répteis couraçados como Scutosaurus.",
    "curiosities": [
      "Foi o primeiro predador da história da vida na Terra a desenvolver dentes de sabre, 250 milhões de anos antes do Smilodon!",
      "Já apresentava características mamíferas avançadas: postura mais ereta, mandíbula fundida e prováveis vibrissas sensoriais no focinho.",
      "Tinha caninos de 12 cm protegidos por flanges ósseas na mandíbula inferior quando a boca estava fechada.",
      "Foi extinto junto com 95% de todas as espécies marinhas e terrestres durante a Grande Extinção Permo-Triássica, a mais devastadora de todas."
    ],
    "expert": {
      "cladogram": [
        "Synapsida",
        "Therapsida",
        "Gorgonopsia",
        "Gorgonopsidae",
        "Gorgonops",
        "Gorgonops torvus"
      ],
      "osteology": "Crânio alongado com fenestra temporal alargada para músculo adutor mandibular. Caninos maxilares hipertrofiados com bordas posteriores serrilhadas. Incisivos anteriores projetados para frente.",
      "biomechanics": "Articulação mandibular permitindo abertura oral de mais de 90 graus para ataque com sabres verticais por impacto cervical descendente.",
      "histology": "Osso fibrolamelar com vascularização densa nos ossos longos, indicando taxa metabólica elevada (endotermia intermediária/mesotermia)."
    },
    "occurrences_count": 45,
    "fossil_locations": "África do Sul (Bacia do Karoo), Tanzânia, Zâmbia",
    "is_custom_ingested": false
  },
  {
    "id": "mammuthus",
    "name": "Mammuthus primigenius",
    "genus": "Mammuthus",
    "scientific_name": "Mammuthus primigenius (Blumenbach, 1799)",
    "era": "cenozoico",
    "era_display": "Cenozoico",
    "period": "Quaternário",
    "epoch": "Pleistoceno Superior a Holoceno",
    "geological_range": "400.000 a 4.000 anos",
    "group": "mamifero-megafauna",
    "group_display": "Proboscídeo da Megafauna Glacial",
    "diet": "herbivoro",
    "diet_display": "Herbívoro da Estepe Herbácea",
    "habitat": "terrestre",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Osso e Cartilagem",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "3.0 a 3.5 m",
    "height": "2.8 a 3.4 m nos ombros",
    "weight": "5.000 a 6.000 kg",
    "speed": "35 km/h",
    "bite_force": "12.000 N (Molares lamelares trituradores)",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Woolly_Mammoth_%28Mammuthus_primigenius%29_-_Mauricio_Ant%C3%B3n.jpg/960px-Woolly_Mammoth_%28Mammuthus_primigenius%29_-_Mauricio_Ant%C3%B3n.jpg",
    "image_caption": "Representação em vida de um grupo de mamutes-lanosos marchando pela tundra glacial",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Woolly_Mammoth_%28Mammuthus_primigenius%29_-_Mauricio_Ant%C3%B3n.jpg/960px-Woolly_Mammoth_%28Mammuthus_primigenius%29_-_Mauricio_Ant%C3%B3n.jpg",
        "caption": "Reconstrução em vida de mamute-lanoso adulto",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Mauricio Antón"
      }
    ],
    "etymology": "Do tártaro siberiano 'mamma' (terra), pois acreditava-se que cavavam túneis no solo, e 'primigenius' (primitivo/original). Descrito por Johann Blumenbach em 1799.",
    "bio": "O mamute-lanoso é o ícone absoluto da última Idade do Gelo. Perfeitamente adaptado ao ambiente inóspito da gigantesca estepe dos mamutes — que se estendia da Europa Ocidental através da Sibéria até a América do Norte através da ponte de Beríngia —, possuía uma camada dupla de pelagem espessa com pelos de até 90 cm de comprimento, uma corcunda de gordura estocadora de energia e presas de marfim espirais curvadas de mais de 4 metros usadas para varrer a neve e expor pastagens nutritivas.",
    "curiosities": [
      "Seus pelos externos impermeáveis alcançavam quase 1 metro de comprimento, sob os quais havia um subpelo denso de lã fina isolante.",
      "Possuía uma mutação específica na hemoglobina que permitia liberar oxigênio aos tecidos mesmo em temperaturas de -50 °C.",
      "As presas espirais de marfim cresciam em anéis diários de deposição que registravam sua idade, gestações e estações climáticas.",
      "A última população de mamutes-lanosos sobreviveu isolada na Ilha de Wrangel, no Ártico, até 1650 a.C. — quando as pirâmides do Egito já estavam construídas!"
    ],
    "expert": {
      "cladogram": [
        "Mammalia",
        "Proboscidea",
        "Elephantidae",
        "Mammuthus",
        "Mammuthus primigenius"
      ],
      "osteology": "Crânio comprimido anteroposteriormente com vértex pontiagudo e cavidades pneumáticas expandidas. Molares hipselodontes com até 30 placas lamelares de esmalte por dente. Presas curvadas em espiral tridimensional.",
      "biomechanics": "Membros colunares graviportais com ossos pesados verticais e coxim plantar elástico espesso amortecedor de impacto em terrenos congelados de permafrost.",
      "histology": "DNA fóssil e tecidos moles excepcionalmente conservados em permafrost exibem adipócitos marrons ativos e preservação de queratina capilar rica em cistina."
    },
    "occurrences_count": 320,
    "fossil_locations": "Rússia (Sibéria, Permafrost), Canadá (Yukon), Estados Unidos (Alasca), Alemanha, França, Ilha de Wrangel",
    "is_custom_ingested": false
  },
  {
    "id": "meganeura",
    "name": "Meganeura monyi",
    "genus": "Meganeura",
    "scientific_name": "Meganeura monyi (Brongniart, 1885)",
    "era": "paleozoico",
    "era_display": "Paleozoico",
    "period": "Carbonífero",
    "epoch": "Carbonífero Superior (Gzheliano)",
    "geological_range": "305 a 299 Ma",
    "group": "artropode-invertebrado",
    "group_display": "Inseto Alado Meganeurídeo Gigante",
    "diet": "carnivoro",
    "diet_display": "Predador Alado de Invertebrados e Anfíbios",
    "habitat": "aereo",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Osso e Cartilagem",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "40 cm (corpo), 70 cm de envergadura",
    "height": "10 cm",
    "weight": "~450 g",
    "speed": "55 km/h (Voo acrobático)",
    "bite_force": "30 N (Mandíbulas mastigadoras)",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Meganeura_monyi.png/960px-Meganeura_monyi.png",
    "image_caption": "Representação em vida de Meganeura patrulhando as florestas do Carbonífero",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Meganeura_monyi.png/960px-Meganeura_monyi.png",
        "caption": "Reconstrução em vida de Meganeura monyi",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Nobu Tamura"
      }
    ],
    "etymology": "Do grego 'megas' (grande) e 'neuron' (nervo/veia alar). Descrito por Charles Brongniart em 1885 em Commentry, França.",
    "bio": "Meganeura é o maior inseto predador alado de todos os tempos. Parente ancestral das libélulas modernas, sua envergadura ultrapassava 70 cm — o tamanho de um falcão moderno! Com olhos compostos gigantes e espinhos raptoriais nas pernas dianteiras, Meganeura caçava outros insetos, pequenos anfíbios e répteis primitivos em pleno ar sobre os pântanos do Carbonífero, beneficiando-se da altíssima densidade e dos 35% de oxigênio da época.",
    "curiosities": [
      "Maior inseto predador alado já descoberto na história da Terra, com envergadura de 70 a 75 cm.",
      "Seu gigantismo foi impulsionado pelo oxigênio atmosférico de 35% no Carbonífero, facilitando a difusão gasosa através dos tubos traqueais.",
      "Caçava pequenos vertebrados tetrápodes além de insetos gigantes.",
      "Foi descoberta nas minas de carvão de Commentry, na França, em 1880."
    ],
    "expert": {
      "cladogram": [
        "Insecta",
        "Pterygota",
        "Odonatoptera",
        "Meganisoptera",
        "Meganeuridae",
        "Meganeura monyi"
      ],
      "osteology": "Sem ossos internos. Exoesqueleto de quitina com asas rígidas reticuladas com venação densa de esclerotina.",
      "biomechanics": "Músculos de voo diretos ancorados à base das asas, operando batimentos assíncronos de alta potência com controle acrobático independente.",
      "histology": "Preservação de venação alar microscópica e lentes omatidiais em nódulos de siderita e folhelhos carbonosos."
    },
    "occurrences_count": 20,
    "fossil_locations": "França (Commentry), Inglaterra, Estados Unidos",
    "is_custom_ingested": false
  },
  {
    "id": "megatherium",
    "name": "Megatherium americanum",
    "genus": "Megatherium",
    "scientific_name": "Megatherium americanum (Cuvier, 1796)",
    "era": "cenozoico",
    "era_display": "Cenozoico",
    "period": "Quaternário",
    "epoch": "Pleistoceno",
    "geological_range": "2.5 Ma a 10.000 anos",
    "group": "mamifero-megafauna",
    "group_display": "Xenartro da Megafauna (Preguiça-Gigante)",
    "diet": "herbivoro",
    "diet_display": "Herbívoro Folívoro de Médio e Alto Porte",
    "habitat": "terrestre",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Osso e Cartilagem",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "6.0 m",
    "height": "3.5 a 4.0 m quando bípede",
    "weight": "3.800 a 4.000 kg",
    "speed": "12 km/h",
    "bite_force": "3.000 N",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Megatherium_americanum_restoration.jpg/960px-Megatherium_americanum_restoration.jpg",
    "image_caption": "Representação em vida de Megatherium americanum em pé pastando copas de árvores",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Megatherium_americanum_restoration.jpg/960px-Megatherium_americanum_restoration.jpg",
        "caption": "Reconstrução em vida de Megatherium bípede",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Nobu Tamura"
      }
    ],
    "etymology": "Do grego 'megas' (grande) e 'therion' (fera/besta), 'da América'. Descrito pelo pai da paleontologia Georges Cuvier em 1796.",
    "bio": "Megatherium americanum foi a titânica preguiça-gigante terrestre da América do Sul e um dos maiores mamíferos terrestres do Pleistoceno. Com 6 metros de comprimento e peso comparável ao de um elefante africano (4 toneladas), possuía garras curvas de até 30 cm de comprimento. Embora caminhasse apoiando os nós dos pés em postura quadrúpede, sua pelve extraordinariamente larga e cauda musculosa permitiam que ficasse ereto em postura tripoidal para derrubar galhos e folhas de copas arbóreas.",
    "curiosities": [
      "Foi o primeiro fóssil de mamífero pré-histórico montado cientificamente em postura anatômica completa em 1795 em Madri.",
      "Podia ficar de pé sobre as duas patas traseiras e a cauda musculosa formando um tripé sólido de 4 metros de altura.",
      "Possuía garras curvas de 30 cm que serviam tanto para puxar árvores quanto para desferir golpes mortais defensivos contra Smilodon.",
      "Túneis fósseis subterrâneos gigantes chamados paleotocas, com até 4 metros de diâmetro encontrados no Brasil, foram escavados por preguiças-gigantes!"
    ],
    "expert": {
      "cladogram": [
        "Mammalia",
        "Xenarthra",
        "Pilosa",
        "Folivora",
        "Megatheriidae",
        "Megatherium americanum"
      ],
      "osteology": "Pelve extremamente alargada transversalmente (até 2 m) com ílios expandidos. Fêmur achatado anteroposteriormente hiper-robusto. Dentes molares quadrangulares prismáticos de crescimento contínuo desprovidos de esmalte.",
      "biomechanics": "Postura tripoidal sustentada pelo centro de massa sobre o ísquio e a robusta série de vértebras caudais com grandes processos hemais chevron.",
      "histology": "Dentinóide ortodentínico e cemento vascularizado nos dentes prismáticos com resistência contínua à abrasão por fitólitos de gramíneas e sílica vegetal."
    },
    "occurrences_count": 140,
    "fossil_locations": "Brasil (Minas Gerais, Bahia, Piauí, Rio Grande do Sul), Argentina (Pampas), Uruguai, Bolívia",
    "is_custom_ingested": false
  },
  {
    "id": "mosasaurus",
    "name": "Mosasaurus hoffmannii",
    "genus": "Mosasaurus",
    "scientific_name": "Mosasaurus hoffmannii (Mantell, 1829)",
    "era": "mesozoico",
    "era_display": "Mesozoico",
    "period": "Cretáceo",
    "epoch": "Cretáceo Superior (Maastrichtiano)",
    "geological_range": "70 a 66 Ma",
    "group": "reptil-marinho",
    "group_display": "Réptil Marinho Escamado (Mosasaurídeo)",
    "diet": "carnivoro",
    "diet_display": "Superpredador Marinho Carnívoro",
    "habitat": "aquatico",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Osso e Cartilagem",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "13.0 a 17.0 m",
    "height": "3.0 m (tronco)",
    "weight": "10.000 a 15.000 kg",
    "speed": "45 km/h (Nado subcarangiforme)",
    "bite_force": "28.000 N",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Mosasaurus_hoffmanni_life_restoration.png/960px-Mosasaurus_hoffmanni_life_restoration.png",
    "image_caption": "Representação em vida de Mosasaurus hoffmannii patrulhando o mar cretáceo",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Mosasaurus_hoffmanni_life_restoration.png/960px-Mosasaurus_hoffmanni_life_restoration.png",
        "caption": "Reconstrução em vida de Mosasaurus hoffmannii",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Dmitry Bogdanov"
      }
    ],
    "etymology": "Do latim 'Mosa' (Rio Mosa, Holanda) e grego 'sauros' (lagarto). Espécie homenageia o médico C. K. Hoffmann. Descrito em 1829.",
    "bio": "Mosasaurus foi o ápice incontestável das cadeias alimentares marinhas globais nos últimos milhões de anos do Cretáceo. Parente dos modernos lagartos-monitores e serpentes, este titânico predador adaptou-se com maestria à vida marinha pelágica: seus membros transformaram-se em nadadeiras hidrodinâmicas e sua cauda culminava em uma nadadeira bilobada propulsora em meia-lua. Possuía uma articulação intramandibular dupla e uma fileira secundária de dentes pterigóideos no céu da boca para impedir que presas escorregassem.",
    "curiosities": [
      "NÃO era um dinossauro! Pertencia à ordem Squamata, sendo um parente marinho gigante dos lagartos-monitores modernos e das cobras.",
      "Possuía uma fileira de dentes extras pontiagudos no palato (céu da boca) que puxava presas em direção ao estômago sem mastigar.",
      "Tinha reprodução vivípara completa, dando à luz filhotes vivos diretamente em alto-mar, sem precisar botar ovos na terra.",
      "O crânio holótipo foi capturado pelas tropas revolucionárias francesas em 1794 em Maastricht e levado para Paris como tesouro de guerra."
    ],
    "expert": {
      "cladogram": [
        "Squamata",
        "Anguimorpha",
        "Mosasauroidea",
        "Mosasauridae",
        "Mosasaurinae",
        "Mosasaurus hoffmannii"
      ],
      "osteology": "Crânio estreito com articulação intramandibular flexionável. Dentes facetais prismáticos bicarinados com raízes tecodontes profundas. Nadadeira caudal hypocercal com vértebras fletidas ventralmente.",
      "biomechanics": "Propulsão axial ondulatória carangiforme restrita aos 40% caudais distais, conferindo alta eficiência hidrodinâmica em nado prolongado em mar aberto.",
      "histology": "Ossos com densidade homogênea esponjosa vascularizada e canalículos de Sharpey adaptados para mergulhos profundos e descompressão rápida sem fraturas osteonecróticas."
    },
    "occurrences_count": 130,
    "fossil_locations": "Holanda (Maastricht), Bélgica, Estados Unidos (Nova Jersey, Dakota do Sul), Marrocos",
    "is_custom_ingested": false
  },
  {
    "id": "opabinia",
    "name": "Opabinia regalis",
    "genus": "Opabinia",
    "scientific_name": "Opabinia regalis (Walcott, 1912)",
    "era": "paleozoico",
    "era_display": "Paleozoico",
    "period": "Cambriano",
    "epoch": "Cambriano Médio",
    "geological_range": "505 Ma",
    "group": "artropode-invertebrado",
    "group_display": "Stem-Artrópode Enigmático",
    "diet": "carnivoro",
    "diet_display": "Predador Micro-Bentônico",
    "habitat": "aquatico",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Osso e Cartilagem",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "4 a 7 cm",
    "height": "1.5 cm",
    "weight": "~10 a 25 g",
    "speed": "10 km/h (Nado ondulatório)",
    "bite_force": "Pinça raptorial flexível",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Opabinia_regalis_life_restoration.png/960px-Opabinia_regalis_life_restoration.png",
    "image_caption": "Representação em vida de Opabinia com seus 5 olhos e probóscide flexível",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Opabinia_regalis_life_restoration.png/960px-Opabinia_regalis_life_restoration.png",
        "caption": "Reconstrução em vida de Opabinia regalis",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Nobu Tamura"
      }
    ],
    "etymology": "Nomeado em homenagem a Opabin Pass e ao Monte Opabin, na Colúmbia Britânica (Canadá). Descrito por Charles Doolittle Walcott em 1912.",
    "bio": "Opabinia é uma das criaturas mais bizarras e famosas da Explosão Cambriana de Burgess Shale. Com corpo mole e segmentado, possuía CINCO olhos compostos pedunculados na cabeça para visão panorâmica em 360 graus e uma probóscide tubular flexível na frente da cabeça que terminava em uma pinça com garras, usada para capturar vermes e pequenas presas no lodo marinho e levá-las à boca voltada para trás sob a cabeça.",
    "curiosities": [
      "Quando Charles Walcott descreveu Opabinia pela primeira vez, a comunidade científica achou que a reconstrução era uma piada de primeiro de abril devido à sua anatomia bizarra!",
      "Possuía exatamente 5 olhos na parte superior da cabeça.",
      "Sua probóscide longa e articulada funcionava como a tromba flexível de um elefante terminada em garras.",
      "Sua boca era voltada para trás sob o corpo, exigindo que a tromba dobrasse para alimentá-lo."
    ],
    "expert": {
      "cladogram": [
        "Panarthropoda",
        "Opabiniidae",
        "Opabinia",
        "Opabinia regalis"
      ],
      "osteology": "Sem carapaça mineralizada. Corpo mole com 15 segmentos contendo lobos laterais e brânquias laminares dorsais. Probóscide pré-oral flexível.",
      "biomechanics": "Ondulação metacrônica de lobos laterais para propulsão pelágica e manipulação de presas por probóscide hidrostática.",
      "histology": "Preservação de Burgess Shale em filmes de carbono e aluminossilicato."
    },
    "occurrences_count": 30,
    "fossil_locations": "Canadá (Burgess Shale, Colúmbia Britânica)",
    "is_custom_ingested": false
  },
  {
    "id": "megalodon",
    "name": "Otodus megalodon",
    "genus": "Otodus",
    "scientific_name": "Otodus megalodon (Agassiz, 1835)",
    "era": "cenozoico",
    "era_display": "Cenozoico",
    "period": "Neógeno",
    "epoch": "Mioceno ao Plioceno",
    "geological_range": "23 a 3.6 Ma",
    "group": "reptil-marinho",
    "group_display": "Chondrichthyes (Tubarão Lamniforme Gigante)",
    "diet": "carnivoro",
    "diet_display": "Superpredador Pelágico Carnívoro",
    "habitat": "aquatico",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Osso e Cartilagem",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "16.0 a 20.0 m",
    "height": "4.5 m (dorso)",
    "weight": "50.000 a 65.000 kg",
    "speed": "35 km/h (com arrancadas de 50 km/h)",
    "bite_force": "108.000 a 182.000 N",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Carcharocles_megalodon.jpg/960px-Carcharocles_megalodon.jpg",
    "image_caption": "Representação em vida de Otodus megalodon caçando baleias no Mioceno",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Carcharocles_megalodon.jpg/960px-Carcharocles_megalodon.jpg",
        "caption": "Reconstrução em vida de Megalodon nadando em mar aberto",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Karen Carr"
      }
    ],
    "etymology": "Do grego 'megas' (grande) e 'odous' (dente), 'dente gigante'. Classificado por Louis Agassiz em 1835.",
    "bio": "Otodus megalodon foi o maior e mais aterrador predador aquático macrófago da história do planeta Terra. Alcançando impressionantes 16 a 20 metros de comprimento e até 65 toneladas de massa corporal, este tubarão lamniforme dominou os oceanos tropicais e subtropicais de todo o globo durante o Mioceno e o Plioceno. Seus dentes de até 18 centímetros, triangulares e finamente serrilhados, entregavam uma força de mordida estarrecedora de até 182.000 Newtons, capaz de quebrar costelas e nadadeiras de baleias primitivas.",
    "curiosities": [
      "Possuía a mordida mais poderosa de qualquer predador conhecido na história da vida animal: até 182.000 Newtons (18 toneladas de pressão).",
      "Seus dentes individuais triangulares podiam ultrapassar 18 centímetros de altura em diagonal.",
      "Um ser humano adulto conseguiria ficar facilmente de pé dentro de sua mandíbula aberta de 2,7 metros de largura.",
      "Alimentava-se rotineiramente de grandes baleias cetáceas, baleias-jubarte ancestrais e focas gigantes."
    ],
    "expert": {
      "cladogram": [
        "Chondrichthyes",
        "Elasmobranchii",
        "Lamniformes",
        "Otodontidae",
        "Otodus",
        "Otodus megalodon"
      ],
      "osteology": "Esqueleto quase inteiramente cartilaginoso prismático calcificado. Dentes maciços de secção espessa em V com bourrelet lingual largo e serrilhas finas regulares. Vértebras com anéis de calcificação concêntrica (calcóforos).",
      "biomechanics": "Mecanismo de ataque por impacto contundente: investida de baixo para cima atingindo a caixa torácica e coração de cetáceos em alta velocidade, rompendo sustentação hidrodinâmica da presa.",
      "histology": "Isótopos estáveis de oxigênio (δ18O) e carbono em esmaltoide dental indicam endotermia regional (mesotermia), mantendo o corpo vários graus acima da temperatura da água do mar."
    },
    "occurrences_count": 195,
    "fossil_locations": "Global (Estados Unidos - Carolina do Sul, Maryland, Marrocos, Peru, Chile, Austrália, Japão)",
    "is_custom_ingested": false
  },
  {
    "id": "purussaurus",
    "name": "Purussaurus brasiliensis",
    "genus": "Purussaurus",
    "scientific_name": "Purussaurus brasiliensis (Barbosa-Rodrigues, 1892)",
    "era": "cenozoico",
    "era_display": "Cenozoico",
    "period": "Neógeno",
    "epoch": "Mioceno Superior",
    "geological_range": "13 a 8 Ma",
    "group": "reptil-marinho",
    "group_display": "Crocodilomorfo Caimão Gigante",
    "diet": "carnivoro",
    "diet_display": "Superpredador Apex dos Rios Amazônicos",
    "habitat": "aquatico",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Osso e Cartilagem",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "11.5 a 12.5 m",
    "height": "1.8 m",
    "weight": "8.400 kg",
    "speed": "25 km/h na água",
    "bite_force": "69.000 N",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Purussaurus_brasiliensis_reconstruction.png/960px-Purussaurus_brasiliensis_reconstruction.png",
    "image_caption": "Representação em vida de Purussaurus brasiliensis no ecossistema pantanoso do Mioceno",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Purussaurus_brasiliensis_reconstruction.png/960px-Purussaurus_brasiliensis_reconstruction.png",
        "caption": "Reconstrução em vida de Purussaurus brasiliensis",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Ghedoghedo"
      }
    ],
    "etymology": "Nomeado em homenagem ao Rio Purus, no Acre (Brasil), e 'brasiliensis' (do Brasil). Descrito pelo botânico João Barbosa Rodrigues em 1892.",
    "bio": "Purussaurus brasiliensis foi o maior caimão e um dos maiores crocodilianos de todos os tempos. Habitou o colossal sistema de megaprofundos lagos e pântanos de Pebas, que cobria grande parte da Amazônia ocidental brasileira, peruana e colombiana no Mioceno. Com crânio maciço de 1,4 metro e mandíbulas incrivelmente robustas, Purussaurus desenvolveu uma mordida de 69.000 Newtons — superando até mesmo a do T-Rex —, capaz de partir a carapaça de tartarugas gigantes como Stupendemys de 3 metros e devorar mamíferos ungulados miocênicos.",
    "curiosities": [
      "Descoberto e batizado no Brasil (Acre) pelo renomado botânico brasileiro João Barbosa Rodrigues em 1892.",
      "Sua força de mordida chegava a impressionantes 69.000 Newtons (7 toneladas de pressão), superando a do próprio T. rex!",
      "Media até 12,5 metros de comprimento e pesava mais de 8 toneladas, dominando as águas pré-históricas da bacia amazônica.",
      "Conseguia estraçalhar a carapaça óssea de 3 metros de Stupendemys geographicus, a maior tartaruga aquática que já existiu."
    ],
    "expert": {
      "cladogram": [
        "Crocodylia",
        "Alligatoroidea",
        "Caimaninae",
        "Purussaurus",
        "Purussaurus brasiliensis"
      ],
      "osteology": "Crânio extremamente largo e maciço com focinho rombudo e narinas externas gigantescas. Dentes cônicos grossos de base bulbosa curvada internamente com carenas serrilhadas anteriores e posteriores.",
      "biomechanics": "Mandíbula adaptada para rotação de morte ('death roll') em megafauna aquática associada à compressão dorsoventral máxima resistindo a torções maciças.",
      "histology": "Osteodermos dérmicos dorsais imbricados de alta espessura com canais vasculares profundos e osso lamelar denso protetor contra dentadas de outros Purussaurus."
    },
    "occurrences_count": 45,
    "fossil_locations": "Brasil (Acre - Rio Purus, Rio Acre, Formação Solimões), Peru (Formação Pebas), Colômbia (La Venta)",
    "is_custom_ingested": false
  },
  {
    "id": "quetzalcoatlus",
    "name": "Quetzalcoatlus northropi",
    "genus": "Quetzalcoatlus",
    "scientific_name": "Quetzalcoatlus northropi (Lawson, 1975)",
    "era": "mesozoico",
    "era_display": "Mesozoico",
    "period": "Cretáceo",
    "epoch": "Cretáceo Superior (Maastrichtiano)",
    "geological_range": "68 a 66 Ma",
    "group": "pterossauro",
    "group_display": "Pterossauro Azhdarchídeo Gigante",
    "diet": "carnivoro",
    "diet_display": "Predador Carnívoro Terrestre",
    "habitat": "aereo",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Osso e Cartilagem",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "5.0 m de corpo, 10.5 a 11.0 m de envergadura",
    "height": "4.5 a 5.0 m (altura de girafa ereto)",
    "weight": "200 a 250 kg",
    "speed": "110 km/h (Voo térmico planar)",
    "bite_force": "3.500 N",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Quetzalcoatlus_life_restoration.png/960px-Quetzalcoatlus_life_restoration.png",
    "image_caption": "Representação em vida de Quetzalcoatlus empoleirado sobre o solo do Cretáceo",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Quetzalcoatlus_life_restoration.png/960px-Quetzalcoatlus_life_restoration.png",
        "caption": "Reconstrução em vida de Quetzalcoatlus northropi em caminhada quadrúpede",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Mark Witton"
      }
    ],
    "etymology": "Homenagem à divindade asteca da serpente emplumada Quetzalcóatl e a John K. Northrop, pioneiro de asas voadoras da aviação. Descrito por Douglas Lawson em 1975.",
    "bio": "Quetzalcoatlus é um dos maiores animais alados de toda a história do planeta Terra. Com uma envergadura colossal de até 11 metros e altura de uma girafa moderna quando em pé no solo, este pterossauro azhdarchídeo quebrou os limites aerodinâmicos da biofísica do voo animal. Apesar de voar distâncias continentais aproveitando correntes térmicas ascendentes, era primariamente um predador terrestre quadrúpede, que caminhava ereto caçando filhotes de dinossauros com seu bico pontiagudo de 2 metros.",
    "curiosities": [
      "Tinha a altura de uma girafa adulta quando estava de pé no chão, apoiado nas quatro patas.",
      "Seus ossos tinham paredes de apenas 1 a 2 milímetros de espessura reforçadas por suportes internos (trabéculas), tornando-o leve e incrivelmente resistente.",
      "Decolava do chão usando uma catapulta quadrúpede impulsiva com as patas dianteiras, gerando 3 vezes mais força do que um pássaro moderno.",
      "Podia voar sem parar por milhares de quilômetros cruzando continentes inteiros a 100 km/h com mínimo gasto calórico."
    ],
    "expert": {
      "cladogram": [
        "Pterosauria",
        "Pterodactyloidea",
        "Azhdarchoidea",
        "Azhdarchidae",
        "Quetzalcoatlus",
        "Quetzalcoatlus northropi"
      ],
      "osteology": "Vértebras cervicais hiperalongadas tubulares sem forames pneumáticos laterais. Bico desprovido de dentes com secção em V. Quarto dedo alar hipertrofiado sustentando braquiopatágio.",
      "biomechanics": "Decolagem balística quadrupedal ('quadrupedal launch'): extensão explosiva simultânea dos membros anteriores sustentados pelos côndilos ulno-radiais e do músculo peitoral.",
      "histology": "Cortical óssea ultra-fina (t/R < 0.05) com reforços helicoidais internos trabeculados de fosfato de cálcio, otimizados para resistência à flexão e torção durante o voo."
    },
    "occurrences_count": 32,
    "fossil_locations": "Estados Unidos (Texas - Formação Javelina, Big Bend National Park)",
    "is_custom_ingested": false
  },
  {
    "id": "smilodon",
    "name": "Smilodon populator",
    "genus": "Smilodon",
    "scientific_name": "Smilodon populator (Lund, 1842)",
    "era": "cenozoico",
    "era_display": "Cenozoico Pré-Histórico",
    "period": "Pleistoceno Superior",
    "epoch": "Quaternário Pré-Histórico",
    "geological_range": "1.0 Ma a 10.000 anos",
    "group": "mamifero-megafauna",
    "group_display": "Felídeo Maquerodontíneo (Dente-de-Sabre)",
    "diet": "carnivoro",
    "diet_display": "Superpredador Carnívoro de Emboscada",
    "habitat": "terrestre",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Endoesqueleto Ósseo Articulado e Cartilagem",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "2.2 a 2.6 m",
    "height": "1.2 a 1.3 m nos ombros",
    "weight": "350 a 436 kg",
    "speed": "45 km/h (Arrancada de emboscada)",
    "bite_force": "1.100 N na mandíbula + força cervical de sabre",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Smilodon_fatalis_Sergiodlarosa_with_a_white_background.png/960px-Smilodon_fatalis_Sergiodlarosa_with_a_white_background.png",
    "image_caption": "Representação em vida de Smilodon com suas garras e caninos hipertrofiados",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Smilodon_fatalis_Sergiodlarosa_with_a_white_background.png/960px-Smilodon_fatalis_Sergiodlarosa_with_a_white_background.png",
        "caption": "[🌿 Indivíduo em Vida] Reconstrução em vida de Smilodon mostrando musculatura anterior e sabres",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Sergio de la Rosa"
      },
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Smilodon_Knight.jpg/960px-Smilodon_Knight.jpg",
        "caption": "[🌿 Indivíduo em Vida] Paleoarte clássica de Smilodon em caçada",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Charles R. Knight"
      }
    ],
    "etymology": "Do grego 'smilē' (faca/bisturi) e 'odous' (dente), com 'populator' (destruidor/saqueador). Descrito em Lagoa Santa (Minas Gerais, Brasil) pelo dinamarquês Peter Lund em 1842.",
    "bio": "Smilodon populator foi o maior e mais potente felino carnívoro de toda a história dos mamíferos, pesando mais de 430 kg de puro músculo concentrado no tórax e patas dianteiras. Descrito pioneiramente nas cavernas calcárias de Lagoa Santa, em Minas Gerais, reinou supremo na América do Sul durante o Pleistoceno. Ao contrário dos leões que usam sufocamento prolongado com a mordida, Smilodon imobilizava grandes presas como mastodontes e preguiças-gigantes com seus membros dianteiros hipertrofiados e desferia um golpe cirúrgico na traqueia e carótidas com seus sabres de 28 cm.",
    "curiosities": [
      "Foi descoberto e descrito pela primeira vez no Brasil, em Lagoa Santa (Minas Gerais), pelo naturalista Peter Lund em 1842!",
      "Seus dentes caninos maxilares alcançavam 28 cm de comprimento, com bordas serrilhadas microscópicas afiadas como bisturis.",
      "Conseguia abrir a boca a um ângulo estarrecedor de 120 a 130 graus para conseguir usar seus caninos superiores longos.",
      "Pesava até 436 kg, superando em mais de 100 kg o maior tigre-siberiano moderno vivo."
    ],
    "expert": {
      "cladogram": [
        "Mammalia",
        "Carnivora",
        "Felidae",
        "Machairodontinae",
        "Smilodontini",
        "Smilodon populator"
      ],
      "osteology": "Caninos maxilares comprimidos lateromedialmente com serrilhação ziphodonte. Processo mastoide hipertrofiado para inserção de poderosos músculos retos ventrais cervicais. Falanges ungueais retráteis massivas.",
      "biomechanics": "Mecanismo de 'canine shear-bite': os músculos cervicais puxavam a cabeça para baixo em golpe de adaga enquanto a mandíbula estabilizava a ferida contra a garganta da presa.",
      "histology": "Cortical óssea dos membros anteriores (úmero e rádio) com espessura radial hipertrofiada em relação ao fêmur, adaptada para suportar torção e impactos brutais na imobilização de megafauna."
    },
    "occurrences_count": 175,
    "fossil_locations": "Brasil (Lagoa Santa - MG, Ceará, Bahia, Rio Grande do Sul), Argentina (Pampas), Uruguai, Estados Unidos (La Brea Tar Pits)",
    "is_custom_ingested": false
  },
  {
    "id": "spinosaurus",
    "name": "Spinosaurus aegyptiacus",
    "genus": "Spinosaurus",
    "scientific_name": "Spinosaurus aegyptiacus (Stromer, 1915)",
    "era": "mesozoico",
    "era_display": "Mesozoico",
    "period": "Cretáceo",
    "epoch": "Cretáceo Superior (Cenomaniano)",
    "geological_range": "99 a 93.5 Ma",
    "group": "dinossauro",
    "group_display": "Dinossauro Terópode Semi-Aquático",
    "diet": "piscivoro",
    "diet_display": "Piscívoro & Carnívoro Oportunista",
    "habitat": "aquatico",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Osso e Cartilagem",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "14.0 a 15.0 m",
    "height": "4.5 m (com vela de 1.8 m)",
    "weight": "7.500 a 8.500 kg",
    "speed": "20 km/h (Propulsão por cauda natatória)",
    "bite_force": "19.000 N",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Spinosaurus_life_restoration_by_Emily_Willoughby_2020.png/960px-Spinosaurus_life_restoration_by_Emily_Willoughby_2020.png",
    "image_caption": "Representação em vida de Spinosaurus nadando nos deltas africanos",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Spinosaurus_life_restoration_by_Emily_Willoughby_2020.png/960px-Spinosaurus_life_restoration_by_Emily_Willoughby_2020.png",
        "caption": "Reconstrução em vida de Spinosaurus semi-aquático com cauda em remo",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Emily Willoughby"
      }
    ],
    "etymology": "Do grego 'spinos' (espinha/espinho) e 'sauros' (lagarto), 'do Egito'. Descrito por Ernst Stromer em 1915.",
    "bio": "Spinosaurus foi o mais longo dinossauro carnívoro de todos os tempos e a primeira espécie comprovadamente adaptada a um estilo de vida semi-aquático predatório. Habitava o gigantesco sistema deltaico fluvial do norte da África no Cretáceo. Em 2020, a descoberta de fósseis de sua cauda revelou uma nadadeira vertical em remo propulsionada por espinhas ósseas alongadas, gerando empuxo de nado semelhante ao dos crocodilos modernos. Seu focinho estreito alongado possuía receptores neurovasculares sensíveis a vibrações de peixes gigantes.",
    "curiosities": [
      "Mais longo que o Tyrannosaurus rex e o Giganotosaurus, alcançando 15 metros de comprimento total.",
      "Sua cauda possuía formato de remo largo e achatado lateralmente com grande flexibilidade para nado propulsivo.",
      "Os ossos eram densos e quase sem cavidade medular central (osteosclerose e paquiostose), funcionando como lastro de mergulho submarino.",
      "O fóssil holótipo original guardado em Munique foi completamente destruído em 1944 durante bombardeios da Segunda Guerra Mundial."
    ],
    "expert": {
      "cladogram": [
        "Dinosauria",
        "Theropoda",
        "Megalosauroidea",
        "Spinosauridae",
        "Spinosaurinae",
        "Spinosaurus aegyptiacus"
      ],
      "osteology": "Rostro alongado subcônico com roseta premaxilar de dentes cônicos não serrilhados. Vértebras dorsais com espinhas neurais de até 1.8 m. Cauda com espinhas hemais hiperalongadas.",
      "biomechanics": "Centro de massa deslocado anteriormente sobre membros posteriores curtos, incompatível com cursorialismo bípede veloz mas adaptado para locomoção aquática.",
      "histology": "Microestrutura óssea com osteosclerose paquiostótica avançada em fêmur e costelas, mimetizando mamíferos marinhos semi-aquáticos modernos."
    },
    "occurrences_count": 48,
    "fossil_locations": "Egito (Oásis de Bahariya), Marrocos (Leitos Kem Kem), Argélia, Níger",
    "is_custom_ingested": false
  },
  {
    "id": "spriggina",
    "name": "Spriggina floundersi",
    "genus": "Spriggina",
    "scientific_name": "Spriggina floundersi (Glaessner, 1958)",
    "era": "precambriano",
    "era_display": "Pré-Cambriano",
    "period": "Ediacarano",
    "epoch": "Ediacarano Superior",
    "geological_range": "555 Ma",
    "group": "ediacarano",
    "group_display": "Biota Ediacarana (Stem-Artrópode)",
    "diet": "filtrador",
    "diet_display": "Detritívoro / Microbívoro",
    "habitat": "bentonico",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Osso e Cartilagem",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "3 a 5 cm",
    "height": "~3 mm",
    "weight": "~5 a 15 g",
    "speed": "Rastejamento ativo bentônico",
    "bite_force": "Inexistente",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Spriggina_floundersi.jpg/960px-Spriggina_floundersi.jpg",
    "image_caption": "Representação em vida de Spriggina rastejando sobre as esteiras bacterianas",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Spriggina_floundersi.jpg/960px-Spriggina_floundersi.jpg",
        "caption": "Reconstrução em vida de Spriggina floundersi",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Nobu Tamura"
      }
    ],
    "etymology": "Homenagem a Reginald Sprigg e ao colecionador Ben Flounders. Descrito por Martin Glaessner em 1958.",
    "bio": "Spriggina é uma das mais intrigantes criaturas do Ediacarano da Austrália do Sul. Com cerca de 3 a 5 cm, exibe um escudo cefálico anterior em formato de ferradura seguido por dezenas de segmentos corporais imbricados. Tradicionalmente considerada um dos primeiros animais bilaterais complexos móveis e um possível ancestral ou parente stem dos trilobitas e artrópodes.",
    "curiosities": [
      "Foi um dos primeiros organismos da história da Terra a exibir cefalização (cabeça diferenciada do restante do corpo).",
      "Apresenta simetria de reflexão deslizante nos segmentos posteriores, similar a outros organismos ediacaranos.",
      "É o fóssil emblema oficial do estado da Austrália do Sul."
    ],
    "expert": {
      "cladogram": [
        "Biota Ediacarana",
        "Proarticulata",
        "Cephaloapiculata",
        "Sprigginidae",
        "Spriggina floundersi"
      ],
      "osteology": "Escudo cefálico não mineralizado esclerotizado seguido por até 40 isômeros corporais com término afilado.",
      "biomechanics": "Locomoção por rastejamento ondular sobre substratos sedimentares cobertos por filmes microbianos.",
      "histology": "Preservação de moldes e contramoldes em arenitos de grão fino de Flinders Ranges."
    },
    "occurrences_count": 22,
    "fossil_locations": "Austrália do Sul (Flinders Ranges, Ediacara Hills)",
    "is_custom_ingested": false
  },
  {
    "id": "tiktaalik",
    "name": "Tiktaalik roseae",
    "genus": "Tiktaalik",
    "scientific_name": "Tiktaalik roseae (Daeschler, Shubin & Jenkins, 2006)",
    "era": "paleozoico",
    "era_display": "Paleozoico",
    "period": "Devoniano",
    "epoch": "Devoniano Superior (Frasniano)",
    "geological_range": "375 Ma",
    "group": "peixe-primitivo",
    "group_display": "Sarcopterígeo / 'Peixápode' Transicional",
    "diet": "carnivoro",
    "diet_display": "Predador Anfíbio Piscívoro",
    "habitat": "anfibio",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Osso e Cartilagem",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "1.5 a 2.7 m",
    "height": "25 cm",
    "weight": "~40 a 70 kg",
    "speed": "15 km/h na água, rastejamento firme em terra",
    "bite_force": "1.200 N",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Tiktaalik_roseae_life_restoration.jpg/960px-Tiktaalik_roseae_life_restoration.jpg",
    "image_caption": "Representação em vida de Tiktaalik apoiando-se em terra com suas nadadeiras com pulsos",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Tiktaalik_roseae_life_restoration.jpg/960px-Tiktaalik_roseae_life_restoration.jpg",
        "caption": "Reconstrução em vida de Tiktaalik emergindo em margem fluvial devoniana",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Zina Deretsky / National Science Foundation"
      }
    ],
    "etymology": "Da língua inuktitut: 'tiktaalik' significa 'peixe de água doce de grande porte (Lota lota)'. Descrito por Daeschler, Shubin e Jenkins em 2006.",
    "bio": "Tiktaalik é mundialmente celebrado como o fóssil de transição definitivo entre os peixes sarcopterígeos de nadadeiras lobadas e os primeiros tetrápodes terrestres de quatro patas. Encontrado na remota Ilha Ellesmere, no Ártico canadense, Tiktaalik possuía escamas e brânquias de peixe, mas apresentava inovações anatômicas revolucionárias: pescoço articulado móvel livre da cintura escapular, costelas robustas para suporte pulmonar e nadadeiras dianteiras com pulsos e dedos primitivos capazes de sustentar o corpo em terra firme.",
    "curiosities": [
      "Foi o primeiro peixe na história da evolução a possuir pescoço articulado móvel, permitindo virar a cabeça sem mexer o resto do corpo.",
      "Possuía ossos homólogos ao nosso úmero, rádio, ulna e ossos do punho, permitindo realizar 'flexões de braço' no leito lamacento.",
      "Sua descoberta foi prevista com precisão matemática por Neil Shubin, que procurou exatamente em rochas fluviais de 375 Ma no Ártico.",
      "Respirava tanto por brânquias quanto por pulmões primitivos através de espiráculos dorsais na parte superior do crânio."
    ],
    "expert": {
      "cladogram": [
        "Sarcopterygii",
        "Tetrapodomorpha",
        "Elpistostegalia",
        "Tiktaalik",
        "Tiktaalik roseae"
      ],
      "osteology": "Crânio achatado dorsoventralmente com perda do osso opérculo e extraescapular, conferindo pescoço móvel. Nadadeira peitoral com lepidotríquios envolvendo mesômeros homólogos a úmero, rádio, ulna e elementos carpais.",
      "biomechanics": "Nadadeiras peitorais capazes de adução e extensão com suporte de carga axial, permitindo propulsão bipedal anterior ou elevação do tronco acima da linha de água em águas rasas.",
      "histology": "Costelas expandidas imbricadas densamente osificadas, suportando cavidade celômica contra colapso sob gravidade em meio subaéreo."
    },
    "occurrences_count": 18,
    "fossil_locations": "Canadá (Ilha Ellesmere, Nunavut - Formação Fram)",
    "is_custom_ingested": false
  },
  {
    "id": "titanoboa",
    "name": "Titanoboa cerrejonensis",
    "genus": "Titanoboa",
    "scientific_name": "Titanoboa cerrejonensis (Head et al., 2009)",
    "era": "cenozoico",
    "era_display": "Cenozoico",
    "period": "Paleógeno",
    "epoch": "Paleoceno Médio",
    "geological_range": "60 a 58 Ma",
    "group": "mamifero-megafauna",
    "group_display": "Serpente Boidídea Gigante",
    "diet": "carnivoro",
    "diet_display": "Predador Emboscador Carnívoro",
    "habitat": "aquatico",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Osso e Cartilagem",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "12.8 a 13.0 m",
    "height": "Diâmetro de 1.0 m",
    "weight": "1.135 a 1.200 kg",
    "speed": "20 km/h (Nado em pântano)",
    "bite_force": "Constrição esmagadora de 28 kg/cm²",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Titanoboa_Cerrejonensis.jpg/960px-Titanoboa_Cerrejonensis.jpg",
    "image_caption": "Representação em vida de Titanoboa emboscando crocodilomorfos nos pântanos do Paleoceno",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Titanoboa_Cerrejonensis.jpg/960px-Titanoboa_Cerrejonensis.jpg",
        "caption": "Reconstrução em vida de Titanoboa cerrejonensis",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Smithsonian Institution"
      }
    ],
    "etymology": "Do grego 'titan' (titã) e 'boa' (serpente boidídea), 'de Cerrejón' (mina de carvão na Colômbia). Descrito por Jason Head et al. em 2009.",
    "bio": "Titanoboa é a maior serpente que já rastejou ou nadou na face da Terra. Descoberta na colossal mina de carvão a céu aberto de Cerrejón, no norte da Colômbia, este gigante de 13 metros de comprimento e mais de uma tonelada reinou supremo nas florestas tropicais equatoriais úmidas que surgiram logo após a extinção dos dinossauros. Seu gigantismo metabólico só foi possível porque a temperatura média equatorial do Paleoceno atingia tórridos 32 a 34 °C, aquecendo seu corpo de réptil ectotérmico a níveis nunca mais repetidos.",
    "curiosities": [
      "Maior serpente da história da vida na Terra: pesava 1.135 kg e seu corpo tinha mais de 1 metro de diâmetro.",
      "Alimentava-se de crocodilomorfos gigantes (Cerrejonisuchus e Acherontisuchus) e tartarugas de 2 metros (Carbonemys).",
      "A temperatura tropical média de 32 a 34 °C da época permitiu seu gigantismo reptiliano ectotérmico.",
      "Podia engolir presas do tamanho de um crocodilo inteiro sem mastigar graças à elasticidade mandibular extrema das serpentes."
    ],
    "expert": {
      "cladogram": [
        "Squamata",
        "Serpentes",
        "Alethinophidia",
        "Boidae",
        "Boinae",
        "Titanoboa cerrejonensis"
      ],
      "osteology": "Vértebras pré-caudais maciças (até 12 cm de largura transversal) com articulações zigantrum-zigofeno hipertrofiadas e forames paracotilares profundos.",
      "biomechanics": "Mecânica de constrição com força circular concêntrica calculada em mais de 2.800 kPa, gerando parada circulatória e colapso cardíaco imediato nas presas em segundos.",
      "histology": "Osso periosteal denso avascular com anéis de deposição concêntrica densa compatíveis com taxa metabólica ectotérmica e crescimento plurianual contínuo."
    },
    "occurrences_count": 24,
    "fossil_locations": "Colômbia (Mina de Cerrejón, Formação Cerrejón, La Guajira)",
    "is_custom_ingested": false
  },
  {
    "id": "triceratops",
    "name": "Triceratops horridus",
    "genus": "Triceratops",
    "scientific_name": "Triceratops horridus (Marsh, 1889)",
    "era": "mesozoico",
    "era_display": "Mesozoico",
    "period": "Cretáceo",
    "epoch": "Cretáceo Superior (Maastrichtiano)",
    "geological_range": "68 a 66 Ma",
    "group": "dinossauro",
    "group_display": "Dinossauro Ceratopsídeo",
    "diet": "herbivoro",
    "diet_display": "Herbívoro Fibroso Especializado",
    "habitat": "terrestre",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Osso e Cartilagem",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "8.5 a 9.0 m",
    "height": "3.0 m",
    "weight": "6.000 a 8.500 kg",
    "speed": "24 km/h (Carga defensiva)",
    "bite_force": "18.000 N (Bateria dental de cisalhamento)",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Triceratops_life_restoration_by_Julius_Csotonyi.jpg/960px-Triceratops_life_restoration_by_Julius_Csotonyi.jpg",
    "image_caption": "Representação em vida de Triceratops horridus pastando nas florestas de Hell Creek",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Triceratops_life_restoration_by_Julius_Csotonyi.jpg/960px-Triceratops_life_restoration_by_Julius_Csotonyi.jpg",
        "caption": "Reconstrução em vida de Triceratops em ambiente florestal",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Julius T. Csotonyi"
      }
    ],
    "etymology": "Do grego 'tri' (três), 'keras' (chifre) e 'ops' (rosto), com o latim 'horridus' (áspero/rugoso). Descrito por Othniel Charles Marsh em 1889.",
    "bio": "Triceratops foi um dos mais abundantes e impressionantes mega-herbívoros do final do Cretáceo norte-americano. Seu crânio espetacular media até 2,5 metros — um terço do comprimento total do corpo —, coroado por um sólido escudo ósseo parietal-esquamosal sem fenestras e dois chifres supraorbitais de 1 metro revestidos por queratina afiada. Equipado com baterias de centenas de dentes que se substituíam continuamente em formato de tesoura mecânica, era capaz de cortar as mais duras samambaias e palmeiras.",
    "curiosities": [
      "Seu crânio de 2,5 metros de comprimento é um dos maiores entre todos os animais terrestres de toda a história fóssil.",
      "Ao contrário de quase todos os outros ceratopsídeos, seu escudo de gola era de osso maciço contínuo, sem buracos ou aberturas (fenestras).",
      "Múltiplos crânios de Triceratops exibem ferimentos curados causados por mordidas de Tyrannosaurus rex e chifradas de outros Triceratops em disputas.",
      "Possuía baterias de 800 dentes encaixados em colunas verticais que se afiavam reciprocamente ao mastigar."
    ],
    "expert": {
      "cladogram": [
        "Dinosauria",
        "Ornithischia",
        "Ceratopsia",
        "Ceratopsidae",
        "Chasmosaurinae",
        "Triceratops horridus"
      ],
      "osteology": "Crânio sincipital monóclino maciço com fusão precoce dos elementos esquamosais e parietais. Epoccipitais triangulares periféricos. Bico rostral edêntulo queratinizado.",
      "biomechanics": "Articulação occipital esférica ('ball-and-socket') com o atlas-axis, permitindo rotação e absorção de choques de impacto de mais de 25 toneladas de desaceleração.",
      "histology": "Osso fibrolamelar com remodelação haversiana densa nas margens dos chifres, demonstrando crescimento ontogenético contínuo e queratinização profunda."
    },
    "occurrences_count": 210,
    "fossil_locations": "Estados Unidos (Hell Creek, Lance, Denver Formation), Canadá (Formação Frenchman)",
    "is_custom_ingested": false
  },
  {
    "id": "tyrannosaurus",
    "name": "Tyrannosaurus rex",
    "genus": "Tyrannosaurus",
    "scientific_name": "Tyrannosaurus rex (Osborn, 1905)",
    "era": "mesozoico",
    "era_display": "Mesozoico",
    "period": "Cretáceo",
    "epoch": "Cretáceo Superior (Maastrichtiano)",
    "geological_range": "68 a 66 Ma",
    "group": "dinossauro",
    "group_display": "Dinossauro Terópode",
    "diet": "carnivoro",
    "diet_display": "Superpredador Carnívoro",
    "habitat": "terrestre",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Endoesqueleto Ósseo Articulado e Pneumatizado",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "12.3 a 12.8 m",
    "height": "3.8 a 4.0 m nos quadris",
    "weight": "8.400 a 9.500 kg",
    "speed": "27 km/h",
    "bite_force": "57.000 N (Esmagador de ossos)",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Tyrannosaurus_rex_by_mariolanzas.jpg/960px-Tyrannosaurus_rex_by_mariolanzas.jpg",
    "image_caption": "Representação em vida de Tyrannosaurus rex adulto em postura ativa",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Tyrannosaurus_rex_by_mariolanzas.jpg/960px-Tyrannosaurus_rex_by_mariolanzas.jpg",
        "caption": "[🌿 Indivíduo em Vida] Reconstrução em vida de T. rex com tegumento moderno",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Mario Lanzas"
      },
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Tyrannosaurus_Sue.jpg/960px-Tyrannosaurus_Sue.jpg",
        "caption": "[🦴 Esqueleto / Ossos] Esqueleto fóssil completo montado de 'Sue' (FMNH PR 2081)",
        "type": "skeleton",
        "category": "skeletal_view",
        "author": "The Field Museum"
      }
    ],
    "etymology": "Do grego 'tyrannos' (tirano) e 'sauros' (lagarto), com o latim 'rex' (rei). Descrito por Henry Fairfield Osborn em 1905.",
    "bio": "O rei dos lagartos tiranos foi o maior e mais avançado predador terrestre do final do Cretáceo na América do Norte. Ao contrário dos dinossauros carnívoros anteriores que cortavam carne, o T. rex desenvolveu dentes cônicos rombudos profundamente enraizados apelidados de 'bananas assassinas', desenhados para perfurar e estilhaçar ossos maciços de ceratopsídeos e hadrossauros com uma força de mordida estombante de 57.000 Newtons. Seus bulbos olfatórios gigantes e visão binocular ampla de 55 graus davam-lhe sentidos predatórios incomparáveis.",
    "curiosities": [
      "Sua visão binocular com sobreposição estereoscópica de 55 graus superava a dos falcões modernos em percepção de profundidade.",
      "Possuía dentes de até 30 cm de comprimento que pulverizavam fêmures de Triceratops, absorvendo cálcio direto da medula óssea.",
      "Seus minúsculos braços de 1 metro podiam suportar mais de 200 kg cada um devido a tendões peitorais extremamente densos.",
      "O maior espécime conhecido ('Scotty', RSM P2523.8) pesava estimados 8.870 kg e viveu até os 32 anos de idade."
    ],
    "expert": {
      "cladogram": [
        "Dinosauria",
        "Theropoda",
        "Coelurosauria",
        "Tyrannosauroidea",
        "Tyrannosauridae",
        "Tyrannosaurus rex"
      ],
      "osteology": "Crânio cinético rígido com fusão dos ossos nasais e frontais. Fenestra antorbital ampla com bolsa sinusóide neumatizada. Dentes ziphodontes com secção oval-cônica e serrilhas hiper-reforçadas.",
      "biomechanics": "Análise de Elementos Finitos (FEA) demonstra taxa de estresse de compressão craniana distribuída pela sutura frontoparietal em mordidas de 35 a 57 kN.",
      "histology": "Linhas de crescimento arrestado (LAGs) em cortes histológicos femorais indicam fase de crescimento exponencial dos 14 aos 18 anos com ganho de 2.1 kg/dia."
    },
    "occurrences_count": 185,
    "fossil_locations": "Estados Unidos (Hell Creek, Lance Formation), Canadá (Saskatchewan, Alberta)",
    "is_custom_ingested": false
  },
  {
    "id": "velociraptor",
    "name": "Velociraptor mongoliensis",
    "genus": "Velociraptor",
    "scientific_name": "Velociraptor mongoliensis (Osborn, 1924)",
    "era": "mesozoico",
    "era_display": "Mesozoico",
    "period": "Cretáceo",
    "epoch": "Cretáceo Superior (Campaniano)",
    "geological_range": "75 a 71 Ma",
    "group": "dinossauro",
    "group_display": "Dromaeosaurídeo Emplumado",
    "diet": "carnivoro",
    "diet_display": "Predador Carnívoro Ágil",
    "habitat": "terrestre",
    "skeletal_type": "vertebrado",
    "skeletal_composition": "Osso e Cartilagem",
    "is_contemporary": false,
    "conservation_status": "Fóssil Extinto",
    "length": "2.07 m",
    "height": "50 cm nos quadris",
    "weight": "15 a 18 kg",
    "speed": "40 km/h",
    "bite_force": "600 N + golpe de foice no segundo dedo",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Velociraptor_restoration.png/960px-Velociraptor_restoration.png",
    "image_caption": "Representação em vida de Velociraptor mongoliensis totalmente emplumado",
    "gallery": [
      {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Velociraptor_restoration.png/960px-Velociraptor_restoration.png",
        "caption": "Reconstrução em vida cientificamente acurada de Velociraptor com plumagem completa",
        "type": "life_restoration",
        "category": "life_view",
        "author": "Emily Willoughby"
      }
    ],
    "etymology": "Do latim 'velox' (veloz) e 'raptor' (ladrão/saqueador), 'da Mongólia'. Descrito por Henry Fairfield Osborn em 1924.",
    "bio": "Ao contrário do animal reptiliano sem penas popularizado nos filmes de Hollywood, o verdadeiro Velociraptor mongoliensis tinha o tamanho aproximado de um peru grande ou coiote, pesando cerca de 15 kg e completamente coberto por penas vanadas complexas idênticas às das aves modernas. Habitava as dunas de areia do deserto de Gobi. Sua arma letal era a famosa garra em forma de foice de 9 cm no segundo dedo do pé, mantida erguida fora do chão ao correr e usada para perfurar órgãos vitais e imobilizar presas como Protoceratops.",
    "curiosities": [
      "Era completamente emplumado: em 2007, paleontólogos encontraram 'quill knobs' (papilas ulnárias onde as penas de voo se ancoravam no osso da ulna) no fóssil IGM 100/981.",
      "Tinha apenas cerca de 50 cm de altura nos quadris, pesando o mesmo que um cão de porte médio.",
      "O famoso fóssil 'Dinossauros Lutando' da Mongólia preservou um Velociraptor e um Protoceratops engalfinhados em combate mortal soterrados juntos por uma duna de areia.",
      "Sua cauda possuía hastes ósseas alongadas que a mantinham rígida como um leme aerodinâmico para curvas em alta velocidade."
    ],
    "expert": {
      "cladogram": [
        "Dinosauria",
        "Theropoda",
        "Coelurosauria",
        "Paraves",
        "Dromaeosauridae",
        "Eudromaeosauria",
        "Velociraptor mongoliensis"
      ],
      "osteology": "Ulna com 6 a 8 papilas ulnárias para cálamo de penas rêmiges primárias. Segundo dedo pedioso com falange hipertrofiada e garra falciforme ungueal hiperestendida. Cauda com pré-zigapófises e cabos hemais fusionados.",
      "biomechanics": "Mecanismo de 'Raptor Prey Restraint' (RPR): pinçamento da presa com as garras foices sob o próprio peso do predador enquanto as asas batiam para estabilização postural.",
      "histology": "Ossos pneumáticos com trabéculas finas e taxas de aposição periosteal elevada compatíveis com endotermia aviária completa."
    },
    "occurrences_count": 88,
    "fossil_locations": "Mongólia (Deserto de Gobi - Formação Djadochta), China (Mongólia Interior - Formação Bayan Mandahu)",
    "is_custom_ingested": false
  }
];

// Base inteligente da API FastAPI (compatível com qualquer porta: 8000, 8001, 8080, etc.)
let API_BASE = window.location.protocol.startsWith('http') ? '' : 'http://localhost:8000';

// Se acessado localmente via file://, detecta automaticamente qual porta do FastAPI está ativa
if (!window.location.protocol.startsWith('http')) {
  (async function detectActivePort() {
    for (const p of [8000, 8001, 8002, 8080, 8888]) {
      try {
        const testRes = await fetch(`http://localhost:${p}/api/stats`, { signal: AbortSignal.timeout(600) });
        if (testRes.ok) {
          API_BASE = `http://localhost:${p}`;
          console.log(`[SuperWiki] Conectado à API FastAPI em http://localhost:${p}`);
          break;
        }
      } catch (e) {
        // tenta próxima porta
      }
    }
  })();
}

// Estado Global da Aplicação
const state = {
  currentEra: 'all',
  currentPeriod: 'all',
  currentGroup: 'all',
  currentDiet: 'all',
  currentSkeletalType: 'all',
  searchQuery: '',
  isExpertMode: false,
  specimens: [...EMBEDDED_CATALOG],
  selectedSpecimen: null,
  lightboxImages: [],
  lightboxIndex: 0,
  galleryActiveCategory: 'all',
  leafletMap: null,
  mapMarkersGroup: null,
  isBackendOnline: false
};

// Placeholder SVG resiliente para paleoarte e fotos
const PLACEHOLDER_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22260%22%20viewBox%3D%220%200%20400%20260%22%3E%3Crect%20fill%3D%22%23121712%22%20width%3D%22400%22%20height%3D%22260%22%2F%3E%3Ctext%20fill%3D%22%234ade80%22%20font-family%3D%22system-ui%22%20font-size%3D%2246%22%20x%3D%2250%25%22%20y%3D%2245%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3E%F0%9F%A6%8E%3C%2Ftext%3E%3Ctext%20fill%3D%22%238fa38f%22%20font-family%3D%22system-ui%22%20font-size%3D%2214%22%20x%3D%2250%25%22%20y%3D%2268%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3EImagem%20Cient%C3%ADfica%20do%20Esp%C3%A9cime%3C%2Ftext%3E%3C%2Fsvg%3E";

// Elementos do DOM
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const btnAutoIngest = document.getElementById('btnAutoIngest');
const skeletalFilter = document.getElementById('skeletalFilter');
const periodFilter = document.getElementById('periodFilter');
const groupFilter = document.getElementById('groupFilter');
const dietFilter = document.getElementById('dietFilter');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const eraTabsContainer = document.getElementById('eraTabsContainer');
const resultsGrid = document.getElementById('results');
const resultsStats = document.getElementById('resultsStats');
const loadingState = document.getElementById('loading');
const loadingMessage = document.getElementById('loadingMessage');
const emptyState = document.getElementById('emptyState');
const toastNotification = document.getElementById('toastNotification');
const toastText = document.getElementById('toastText');
const globalExpertToggle = document.getElementById('globalExpertToggle');
const modalExpertToggle = document.getElementById('modalExpertToggle');

// Modal Elements
const wikiModal = document.getElementById('wikiModal');
const wikiModalBackdrop = document.getElementById('wikiModalBackdrop');
const closeWikiBtn = document.getElementById('closeWikiBtn');
const btnCloseWikiFooter = document.getElementById('btnCloseWikiFooter');
const btnToggleExpertInFooter = document.getElementById('btnToggleExpertInFooter');
const wikiTabsBar = document.querySelector('.wiki-tabs-bar');

// Lightbox Elements
const lightboxModal = document.getElementById('lightboxModal');
const lightboxBackdrop = document.getElementById('lightboxBackdrop');
const closeLightboxBtn = document.getElementById('closeLightboxBtn');
const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
const lightboxNextBtn = document.getElementById('lightboxNextBtn');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCounter = document.getElementById('lightboxCounter');
const btnZoomFeatured = document.getElementById('btnZoomFeatured');


// ============================================================================
// INICIALIZAÇÃO INSTANTÂNEA
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  
  // 1. RENDERIZAÇÃO INSTANTÂNEA EM 0 SEGUNDOS (SEM ESPERAR REDE)
  renderCards(state.specimens);
  updateStats(state.specimens.length, false);
  hideLoading();

  // 2. Consulta em segundo plano o backend FastAPI para atualizar se estiver ativo
  checkBackendAndSync();
});


function setupEventListeners() {
  searchBtn.addEventListener('click', () => handleSearch());
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
  
  searchInput.addEventListener('input', () => {
    if (searchInput.value.trim().length > 0) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.classList.add('hidden');
    handleSearch();
  });

  btnAutoIngest.addEventListener('click', () => handleAutoIngestPrompt());

  if (skeletalFilter) {
    skeletalFilter.addEventListener('change', () => {
      state.currentSkeletalType = skeletalFilter.value;
      loadCatalog();
    });
  }

  periodFilter.addEventListener('change', () => {
    state.currentPeriod = periodFilter.value;
    loadCatalog();
  });

  groupFilter.addEventListener('change', () => {
    state.currentGroup = groupFilter.value;
    loadCatalog();
  });

  dietFilter.addEventListener('change', () => {
    state.currentDiet = dietFilter.value;
    loadCatalog();
  });

  resetFiltersBtn.addEventListener('click', () => resetAllFilters());

  const refreshCatalogBtn = document.getElementById('refreshCatalogBtn');
  if (refreshCatalogBtn) {
    refreshCatalogBtn.addEventListener('click', () => {
      loadCatalog(true);
      showToast('Acervo atualizado com sucesso!', '🔄');
    });
  }

  eraTabsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.era-tab-btn');
    if (!btn) return;
    
    document.querySelectorAll('.era-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    state.currentEra = btn.getAttribute('data-era');
    loadCatalog();
  });

  globalExpertToggle.addEventListener('change', () => {
    state.isExpertMode = globalExpertToggle.checked;
    modalExpertToggle.checked = state.isExpertMode;
    toggleExpertModeDisplay();
  });

  modalExpertToggle.addEventListener('change', () => {
    state.isExpertMode = modalExpertToggle.checked;
    globalExpertToggle.checked = state.isExpertMode;
    toggleExpertModeDisplay();
  });

  if (btnToggleExpertInFooter) {
    btnToggleExpertInFooter.addEventListener('click', () => {
      state.isExpertMode = !state.isExpertMode;
      globalExpertToggle.checked = state.isExpertMode;
      modalExpertToggle.checked = state.isExpertMode;
      toggleExpertModeDisplay();
    });
  }

  wikiTabsBar.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('.wiki-tab-btn');
    if (!tabBtn) return;
    const tabId = tabBtn.getAttribute('data-tab');
    switchWikiTab(tabId);
  });

  const catContainer = document.getElementById('galleryCategoryChips');
  if (catContainer) {
    catContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.gallery-cat-chip');
      if (!chip) return;
      document.querySelectorAll('.gallery-cat-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.galleryActiveCategory = chip.getAttribute('data-cat');
      renderFilteredGallery();
    });
  }

  closeWikiBtn.addEventListener('click', closeWikiModal);
  btnCloseWikiFooter.addEventListener('click', closeWikiModal);
  wikiModalBackdrop.addEventListener('click', closeWikiModal);

  closeLightboxBtn.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  lightboxPrevBtn.addEventListener('click', () => navigateLightbox(-1));
  lightboxNextBtn.addEventListener('click', () => navigateLightbox(1));

  btnZoomFeatured.addEventListener('click', () => {
    if (state.selectedSpecimen && state.selectedSpecimen.image_url) {
      openLightbox(0);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!lightboxModal.classList.contains('hidden')) {
        closeLightbox();
      } else if (!wikiModal.classList.contains('hidden')) {
        closeWikiModal();
      }
    } else if (!lightboxModal.classList.contains('hidden')) {
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    }
  });

  const btnRandom = document.getElementById('btnRandomDino');
  if (btnRandom) {
    btnRandom.addEventListener('click', () => discoverRandomSpecimen('all'));
  }

  document.querySelectorAll('.discovery-btn[data-era]').forEach(btn => {
    btn.addEventListener('click', () => {
      const era = btn.getAttribute('data-era');
      discoverRandomSpecimen(era);
    });
  });

  document.querySelectorAll('.tag-chip').forEach(chip => {
    chip.addEventListener('click', async () => {
      const name = chip.getAttribute('data-name');
      await openOrIngestSpecimen(name);
    });
  });

  const reloadBtn = document.getElementById('reloadSuggestionsBtn');
  if (reloadBtn) {
    reloadBtn.addEventListener('click', () => resetAllFilters());
  }
}


// ============================================================================
// CARREGAMENTO & SINCRONIZAÇÃO RESILIENTE
// ============================================================================

async function checkBackendAndSync() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${API_BASE}/api/stats`, { signal: controller.signal });
    clearTimeout(timer);

    if (res.ok) {
      state.isBackendOnline = true;
      loadCatalog(false);
    }
  } catch (e) {
    state.isBackendOnline = false;
    updateStats(state.specimens.length, false);
  }
}


async function loadCatalog(showSpinner = false) {
  if (showSpinner) showLoading('Filtrando acervo...');
  
  const params = new URLSearchParams();
  if (state.currentEra && state.currentEra !== 'all') params.append('era', state.currentEra);
  if (state.currentPeriod && state.currentPeriod !== 'all') params.append('period', state.currentPeriod);
  if (state.currentGroup && state.currentGroup !== 'all') params.append('group', state.currentGroup);
  if (state.currentDiet && state.currentDiet !== 'all') params.append('diet', state.currentDiet);
  if (state.currentSkeletalType && state.currentSkeletalType !== 'all') params.append('skeletal_type', state.currentSkeletalType);
  if (state.searchQuery) params.append('search', state.searchQuery);

  if (state.isBackendOnline) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(`${API_BASE}/api/specimens?${params.toString()}`, { signal: controller.signal });
      clearTimeout(timer);

      if (res.ok) {
        const specimens = await res.json();
        state.specimens = specimens;
        hideLoading();
        renderCards(specimens);
        updateStats(specimens.length, true);
        return;
      }
    } catch (err) {
      console.warn('Backend indisponível, usando acervo local:', err);
      state.isBackendOnline = false;
    }
  }

  // Fallback local instantâneo
  const filtered = filterEmbeddedCatalog();
  state.specimens = filtered;
  hideLoading();
  renderCards(filtered);
  updateStats(filtered.length, false);
}


function filterEmbeddedCatalog() {
  let list = [...EMBEDDED_CATALOG];

  if (state.currentEra && state.currentEra !== 'all') {
    list = list.filter(s => s.era.toLowerCase() === state.currentEra.toLowerCase());
  }

  if (state.currentPeriod && state.currentPeriod !== 'all') {
    const p = state.currentPeriod.toLowerCase();
    list = list.filter(s => s.period.toLowerCase().includes(p) || (s.epoch && s.epoch.toLowerCase().includes(p)));
  }

  if (state.currentGroup && state.currentGroup !== 'all') {
    const g = state.currentGroup.toLowerCase();
    list = list.filter(s => s.group.toLowerCase() === g || s.group_display.toLowerCase().includes(g));
  }

  if (state.currentDiet && state.currentDiet !== 'all') {
    list = list.filter(s => s.diet.toLowerCase() === state.currentDiet.toLowerCase());
  }

  if (state.currentSkeletalType && state.currentSkeletalType !== 'all') {
    list = list.filter(s => s.skeletal_type.toLowerCase() === state.currentSkeletalType.toLowerCase());
  }

  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase().trim();
    list = list.filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.genus.toLowerCase().includes(q) ||
      (s.scientific_name && s.scientific_name.toLowerCase().includes(q)) ||
      (s.bio && s.bio.toLowerCase().includes(q))
    );
  }

  return list;
}


function getThumbnailUrl(url, targetWidth = 400) {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('/thumb/') && url.includes('/960px-')) {
    return url.replace('/960px-', `/${targetWidth}px-`);
  }
  return url;
}

function renderCards(specimens) {
  resultsGrid.innerHTML = '';
  
  if (!specimens || specimens.length === 0) {
    emptyState.classList.remove('hidden');
    resultsGrid.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  resultsGrid.classList.remove('hidden');

  const fragment = document.createDocumentFragment();

  specimens.forEach(spec => {
    const card = document.createElement('article');
    card.className = `card era-${spec.era}`;
    card.setAttribute('data-id', spec.id);

    const eraClass = `badge-era-${spec.era}`;
    const isVertebrate = spec.skeletal_type === 'vertebrado';
    const skeletalBadgeClass = isVertebrate ? 'badge-vertebrado' : 'badge-invertebrado';
    const skeletalIcon = isVertebrate ? '🦴' : '🐚';
    const skeletalLabel = isVertebrate ? 'Vertebrado' : 'Invertebrado';
    const thumbUrl = getThumbnailUrl(spec.image_url, 400);

    card.innerHTML = `
      <div class="card-media-wrap">
        <img 
          src="${thumbUrl}" 
          alt="${spec.name}" 
          class="card-img" 
          loading="lazy"
          referrerpolicy="no-referrer"
          onerror="handleCardImageError(this, '${spec.id}')"
        />
        <div class="card-media-overlay">
          <span class="badge-era ${eraClass}">${spec.era_display}</span>
          <span class="badge-skeletal ${skeletalBadgeClass}">${skeletalIcon} ${skeletalLabel}</span>
        </div>
      </div>

      <div class="card-content">
        <div class="card-header-row">
          <h3 class="card-title">${spec.name}</h3>
        </div>
        
        <p class="card-scientific-name">
          <em>${spec.scientific_name || spec.genus}</em>
        </p>

        <div class="card-chips">
          <span class="chip chip-group">${spec.group_display}</span>
          <span class="chip chip-diet">${spec.diet_display}</span>
        </div>

        <p class="card-bio">${truncateText(spec.bio, 115)}</p>

        <div class="card-specs-row">
          <div class="spec-mini">
            <span class="mini-label">Estrutura</span>
            <span class="mini-val" style="font-size: 0.75rem;">${truncateText(spec.skeletal_composition || skeletalLabel, 18)}</span>
          </div>
          <div class="spec-mini">
            <span class="mini-label">Massa</span>
            <span class="mini-val">${spec.weight || '-'}</span>
          </div>
        </div>

        <div class="card-actions">
          <button class="primary-btn btn-open-wiki" data-id="${spec.id}">
            <span>Abrir Wiki</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          
          <button class="secondary-btn btn-quick-skeleton" data-id="${spec.id}" title="Ver Esqueleto, Ossos ou Cartilagem">
            🦴
          </button>
        </div>
      </div>
    `;

    card.querySelector('.btn-open-wiki').addEventListener('click', () => openWikiModal(spec.id, 'tab-overview'));
    card.querySelector('.btn-quick-skeleton').addEventListener('click', () => openWikiModal(spec.id, 'tab-skeleton'));
    card.querySelector('.card-media-wrap').addEventListener('click', () => openWikiModal(spec.id, 'tab-overview'));

    fragment.appendChild(card);
  });

  resultsGrid.appendChild(fragment);
}


function handleCardImageError(imgEl, specId) {
  imgEl.onerror = null;
  const originalSrc = imgEl.src;
  if (!originalSrc.includes('/api/proxy-image') && state.isBackendOnline) {
    imgEl.src = `${API_BASE}/api/proxy-image?url=${encodeURIComponent(originalSrc)}`;
    imgEl.onerror = () => { imgEl.src = PLACEHOLDER_IMAGE; };
  } else {
    imgEl.src = PLACEHOLDER_IMAGE;
  }
}


// ============================================================================
// BUSCA E INGESTÃO AUTOMÁTICA VIA API (GBIF + PBDB + COMMONS)
// ============================================================================

async function handleSearch() {
  const query = searchInput.value.trim();
  state.searchQuery = query;
  
  if (!query) {
    loadCatalog();
    return;
  }

  // 1. Procura primeiro no acervo carregado
  const localMatches = filterEmbeddedCatalog();
  if (localMatches.length > 0) {
    state.specimens = localMatches;
    renderCards(localMatches);
    updateStats(localMatches.length, state.isBackendOnline);
    showToast(`Encontrado(s) ${localMatches.length} espécime(s) para "${query}"`, '🔍');
    return;
  }

  // 2. Se não encontrou e o backend estiver ativo, faz ingestão via API
  if (state.isBackendOnline) {
    showToast(`Buscando "${query}" nas bases mundiais (GBIF & PBDB)...`, '🌐');
    await executeAutoIngest(query);
  } else {
    showToast(`Animal não encontrado no catálogo pré-instalado. Execute './iniciar.sh' no terminal para ativar a busca online!`, '💡');
  }
}


async function handleAutoIngestPrompt() {
  const query = searchInput.value.trim();
  if (!query) {
    showToast('Digite o nome do animal para subir via API!', '💡');
    searchInput.focus();
    return;
  }
  await executeAutoIngest(query);
}


async function executeAutoIngest(taxonName) {
  if (!state.isBackendOnline) {
    showToast(`Para buscar novos animais online via GBIF, inicie o servidor com './iniciar.sh' no terminal.`, 'ℹ️');
    return;
  }

  showLoading(`Consultando GBIF, PBDB e Wikimedia para minerar dados de "${taxonName}"...`);
  
  try {
    const res = await fetch(`${API_BASE}/api/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: taxonName,
        era_hint: state.currentEra !== 'all' ? state.currentEra : null
      })
    });
    
    const data = await res.json();
    hideLoading();

    if (data.success && data.specimen) {
      showToast(data.message, '🎉');
      await loadCatalog();
      openWikiModal(data.specimen.id, 'tab-overview');
    } else {
      showToast(data.message || 'Não foi possível localizar dados científicos para o animal.', '⚠️');
    }
  } catch (err) {
    hideLoading();
    console.error('Erro na ingestão:', err);
    showToast('Falha na comunicação com o serviço de ingestão via API.', '❌');
  }
}


async function openOrIngestSpecimen(name) {
  const cleanId = name.toLowerCase().replace(/ /g, '-');
  const found = EMBEDDED_CATALOG.find(s => 
    s.id === cleanId || 
    s.name.toLowerCase().includes(name.toLowerCase()) || 
    s.genus.toLowerCase() === name.toLowerCase() ||
    (s.scientific_name && s.scientific_name.toLowerCase().includes(name.toLowerCase()))
  );
  
  if (found) {
    openWikiModal(found.id, 'tab-overview');
  } else if (state.isBackendOnline) {
    searchInput.value = name;
    clearBtn.classList.remove('hidden');
    await executeAutoIngest(name);
  } else {
    showToast(`Espécime em expansão. Inicie o backend com './iniciar.sh' para baixá-lo!`, '💡');
  }
}


async function discoverRandomSpecimen(era = 'all') {
  let pool = EMBEDDED_CATALOG;
  if (era && era !== 'all') {
    pool = EMBEDDED_CATALOG.filter(s => s.era.toLowerCase() === era.toLowerCase());
  }
  if (pool.length === 0) pool = EMBEDDED_CATALOG;

  const lucky = pool[Math.floor(Math.random() * pool.length)];
  showToast(`Sorteado: ${lucky.name} (${lucky.era_display})!`, '🎲');
  openWikiModal(lucky.id, 'tab-overview');
}


// ============================================================================
// SUPER WIKI MODAL INTERATIVA COM FOTOS DE OSSOS / CARTILAGEM
// ============================================================================

async function openWikiModal(specimenId, initialTab = 'tab-overview') {
  // Procura no catálogo em memória
  let spec = state.specimens.find(s => s.id === specimenId) || EMBEDDED_CATALOG.find(s => s.id === specimenId);

  // Se o backend estiver online e não estiver local, tenta buscar
  if (!spec && state.isBackendOnline) {
    try {
      const res = await fetch(`${API_BASE}/api/specimens/${specimenId}`);
      if (res.ok) spec = await res.json();
    } catch (e) {}
  }

  if (!spec) {
    showToast('Espécime não encontrado.', '⚠️');
    return;
  }

  state.selectedSpecimen = spec;

  // Cabeçalho
  document.getElementById('wikiTitle').textContent = spec.name;
  document.getElementById('wikiEtymology').textContent = spec.scientific_name ? `${spec.scientific_name} • ${spec.etymology || 'Classificação biológica'}` : spec.etymology;
  
  // Badges
  const eraBadge = document.getElementById('wikiEraBadge');
  eraBadge.textContent = spec.era_display;
  eraBadge.className = `badge-era badge-era-${spec.era}`;

  const isVertebrate = spec.skeletal_type === 'vertebrado';
  const skeletalBadge = document.getElementById('wikiSkeletalBadge');
  skeletalBadge.textContent = isVertebrate ? '🦴 Vertebrado' : '🐚 Invertebrado';
  skeletalBadge.className = `badge-skeletal ${isVertebrate ? 'badge-vertebrado' : 'badge-invertebrado'}`;
  
  const periodBadge = document.getElementById('wikiPeriodBadge');
  periodBadge.textContent = spec.period;

  document.getElementById('wikiGroupBadge').textContent = spec.group_display;
  document.getElementById('wikiDietBadge').textContent = spec.diet_display;

  // Ficha Estrutural
  document.getElementById('specSkeletalType').textContent = isVertebrate ? 'Vertebrado (Possui coluna vertebral e crânio)' : 'Invertebrado (Sem coluna vertebral)';
  document.getElementById('specSkeletalComp').textContent = spec.skeletal_composition || 'Estrutura corporal não-mineralizada';
  document.getElementById('specConservationStatus').textContent = spec.conservation_status || (spec.is_contemporary ? 'Espécie Vivente' : 'Fóssil Extinto');

  // Ficha Biométrica
  document.getElementById('specLength').textContent = spec.length || 'Em estudo';
  document.getElementById('specHeight').textContent = spec.height || 'Em estudo';
  document.getElementById('specWeight').textContent = spec.weight || 'Em estudo';
  document.getElementById('specSpeed').textContent = spec.speed || 'Em estudo';
  document.getElementById('specBiteForce').textContent = spec.bite_force || 'Em estudo';
  document.getElementById('specPeriod').textContent = `${spec.period} (${spec.geological_range})`;

  // Biologia e Curiosidades
  document.getElementById('wikiBioText').textContent = spec.bio || 'Dossiê biológico em compilação.';
  
  const curList = document.getElementById('wikiCuriositiesList');
  curList.innerHTML = '';
  (spec.curiosities || []).forEach(c => {
    const li = document.createElement('li');
    li.textContent = c;
    curList.appendChild(li);
  });

  // Imagem de Destaque e Galeria
  const featuredImg = document.getElementById('wikiFeaturedImg');
  featuredImg.src = spec.image_url;
  featuredImg.onerror = () => { featuredImg.src = PLACEHOLDER_IMAGE; };
  document.getElementById('wikiFeaturedCaption').textContent = spec.image_caption || 'Representação visual do indivíduo';

  // Miniaturas
  const thumbsContainer = document.getElementById('wikiGalleryThumbs');
  thumbsContainer.innerHTML = '';
  const galleryItems = spec.gallery && spec.gallery.length > 0 ? spec.gallery : [{ url: spec.image_url, caption: spec.image_caption, category: 'life_view' }];
  
  document.getElementById('galleryCount').textContent = galleryItems.length;
  state.lightboxImages = galleryItems;

  galleryItems.forEach((item, idx) => {
    const thumb = document.createElement('img');
    thumb.src = item.url;
    thumb.alt = item.caption || `Imagem ${idx + 1}`;
    thumb.className = `gallery-thumb ${idx === 0 ? 'active' : ''}`;
    thumb.loading = 'lazy';
    thumb.referrerPolicy = 'no-referrer';
    thumb.onerror = () => { thumb.src = PLACEHOLDER_IMAGE; };

    thumb.addEventListener('click', () => {
      document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      featuredImg.src = item.url;
      document.getElementById('wikiFeaturedCaption').textContent = item.caption || 'Representação do indivíduo';
    });

    thumbsContainer.appendChild(thumb);
  });

  // Aba de Esqueleto, Ossos & Cartilagem
  renderSkeletonTab(spec);

  // Aba de Detalhes Complexos
  renderExpertTab(spec);

  // Aba de Galeria Completa
  state.galleryActiveCategory = 'all';
  document.querySelectorAll('.gallery-cat-chip').forEach(c => c.classList.toggle('active', c.getAttribute('data-cat') === 'all'));
  renderFilteredGallery();

  // Botão Google Imagens
  const googleBtn = document.getElementById('btnSearchGoogleImages');
  googleBtn.href = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(spec.name + ' ' + (spec.scientific_name || '') + ' skeleton skull anatomy')}`;

  // Abre modal e ativa aba inicial
  wikiModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  switchWikiTab(initialTab);
}


function renderSkeletonTab(spec) {
  const isVertebrate = spec.skeletal_type === 'vertebrado';
  const explanation = document.getElementById('skeletonExplanationText');
  
  if (isVertebrate) {
    explanation.innerHTML = `
      <strong>${spec.name}</strong> é um <strong>VERTEBRADO</strong>.<br>
      Possui <strong>${spec.skeletal_composition || 'Endoesqueleto Ósseo Articulado'}</strong> com crânio rígido, coluna vertebral axial e sustentação esquelética interna.
    `;
  } else {
    explanation.innerHTML = `
      <strong>${spec.name}</strong> é um <strong>INVERTEBRADO</strong>.<br>
      Não possui ossos verdadeiros ou coluna vertebral. Sua sustentação mecânica é provida por <strong>${spec.skeletal_composition || 'Exoesqueleto ou Hidroesqueleto'}</strong>.
    `;
  }

  const grid = document.getElementById('skeletonImagesGrid');
  grid.innerHTML = '';

  const items = spec.gallery || [];
  const skeletalItems = items.filter(img => 
    img.category === 'skeletal_view' || 
    ['skeleton', 'skull', 'bones', 'cartilage', 'fossil'].includes(img.type) ||
    /skeleton|skull|crânio|esqueleto|bone|cartilage|fossil|concha/i.test(img.caption)
  );

  const displayList = skeletalItems.length > 0 ? skeletalItems : items;

  displayList.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.innerHTML = `
      <img src="${item.url}" alt="${item.caption || 'Esqueleto / Ossos'}" loading="lazy" referrerpolicy="no-referrer" onerror="this.src='${PLACEHOLDER_IMAGE}'" />
      <div class="gallery-card-info">
        <span class="gallery-card-caption">${item.caption || 'Vista esquelética / osteologia'}</span>
        <small class="gallery-card-author">${item.author || 'Wikimedia Commons'}</small>
      </div>
    `;
    card.addEventListener('click', () => {
      const fullIdx = items.indexOf(item);
      openLightbox(fullIdx >= 0 ? fullIdx : idx);
    });
    grid.appendChild(card);
  });
}


function renderFilteredGallery() {
  const container = document.getElementById('fullGalleryGrid');
  container.innerHTML = '';

  if (!state.selectedSpecimen) return;
  const items = state.selectedSpecimen.gallery && state.selectedSpecimen.gallery.length > 0 ? state.selectedSpecimen.gallery : [{ url: state.selectedSpecimen.image_url, caption: state.selectedSpecimen.image_caption, category: 'life_view' }];

  const cat = state.galleryActiveCategory;
  const filtered = cat === 'all' ? items : items.filter(it => it.category === cat);
  const toRender = filtered.length > 0 ? filtered : items;

  toRender.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.innerHTML = `
      <img src="${item.url}" alt="${item.caption || 'Imagem'}" loading="lazy" referrerpolicy="no-referrer" onerror="this.src='${PLACEHOLDER_IMAGE}'" />
      <div class="gallery-card-info">
        <span class="gallery-card-caption">${item.caption || 'Representação visual'}</span>
        <small class="gallery-card-author">${item.author || 'Wikimedia Commons'}</small>
      </div>
    `;
    card.addEventListener('click', () => {
      const globalIdx = items.indexOf(item);
      openLightbox(globalIdx >= 0 ? globalIdx : 0);
    });
    container.appendChild(card);
  });
}


function renderExpertTab(spec) {
  const expert = spec.expert || {};
  
  const cladContainer = document.getElementById('expertCladogram');
  cladContainer.innerHTML = '';
  if (expert.cladogram && expert.cladogram.length > 0) {
    const ul = document.createElement('ul');
    ul.className = 'cladogram-list';
    expert.cladogram.forEach((node, i) => {
      const li = document.createElement('li');
      li.style.paddingLeft = `${i * 14}px`;
      li.innerHTML = `<strong>${i === expert.cladogram.length - 1 ? '▶ ' + node : '↳ ' + node}</strong>`;
      ul.appendChild(li);
    });
    cladContainer.appendChild(ul);
  } else {
    cladContainer.innerHTML = '<p class="text-muted">Árvore filogenética em refinamento.</p>';
  }

  document.getElementById('expertOsteology').innerHTML = expert.osteology || '<p>Análise óssea e estrutural em compilação.</p>';
  document.getElementById('expertBiomechanics').innerHTML = expert.biomechanics || '<p>Modelagem biomecânica em simulação computacional.</p>';
  document.getElementById('expertHistology').innerHTML = expert.histology || '<p>Cortes histológicos e tecidos em catálogo.</p>';
}


function switchWikiTab(tabId) {
  document.querySelectorAll('.wiki-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });

  document.querySelectorAll('.wiki-tab-content').forEach(content => {
    content.classList.toggle('active', content.id === tabId);
  });

  if (tabId === 'tab-map') {
    renderGlobalMap(state.selectedSpecimen);
  }
}


function closeWikiModal() {
  wikiModal.classList.add('hidden');
  document.body.style.overflow = '';
}


// ============================================================================
// MAPA GLOBAL INTERATIVO (GBIF PARA VIVENTES & PBDB PARA FÓSSEIS)
// ============================================================================

async function renderGlobalMap(specimen) {
  if (!specimen) return;

  const mapContainer = document.getElementById('integratedFossilMap');
  const countBadge = document.getElementById('integratedMapCount');
  const loadingIndicator = document.getElementById('integratedMapLoading');

  loadingIndicator.classList.remove('hidden');

  if (!state.leafletMap) {
    state.leafletMap = L.map('integratedFossilMap', {
      center: [20, 0],
      zoom: 2,
      minZoom: 1,
      maxZoom: 14
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO &copy; GBIF / PBDB',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(state.leafletMap);

    state.mapMarkersGroup = L.layerGroup().addTo(state.leafletMap);
  }

  state.mapMarkersGroup.clearLayers();

  if (state.isBackendOnline) {
    try {
      const res = await fetch(`${API_BASE}/api/occurrences/${encodeURIComponent(specimen.scientific_name || specimen.genus || specimen.name)}`);
      const occurrences = await res.json();
      loadingIndicator.classList.add('hidden');

      if (occurrences && occurrences.length > 0) {
        const isContemporary = specimen.is_contemporary;
        countBadge.textContent = `${occurrences.length} pontos globais (${isContemporary ? 'Observações GBIF' : 'Fósseis PBDB'})`;

        const bounds = [];
        occurrences.forEach(occ => {
          if (typeof occ.lat === 'number' && typeof occ.lng === 'number') {
            const markerColor = isContemporary ? '#10b981' : '#ea580c';
            
            const marker = L.circleMarker([occ.lat, occ.lng], {
              radius: 7,
              fillColor: markerColor,
              color: '#ffffff',
              weight: 1.5,
              opacity: 1,
              fillOpacity: 0.85
            });

            marker.bindPopup(`
              <div style="font-family: sans-serif; color: #111;">
                <strong style="font-size: 14px; color: ${markerColor};">${specimen.name}</strong><br>
                <span style="font-size: 12px;"><strong>País:</strong> ${occ.country || 'Global'}</span><br>
                <span style="font-size: 12px;"><strong>Local:</strong> ${occ.formation || 'Habitat natural'}</span><br>
                <span style="font-size: 11px; color: #666;">${isContemporary ? 'Registro Contemporâneo (GBIF)' : `Idade fóssil: ${occ.early_age || ''} - ${occ.late_age || ''} Ma`}</span>
              </div>
            `);

            state.mapMarkersGroup.addLayer(marker);
            bounds.push([occ.lat, occ.lng]);
          }
        });

        setTimeout(() => {
          state.leafletMap.invalidateSize();
          if (bounds.length > 0) {
            state.leafletMap.fitBounds(bounds, { padding: [30, 30], maxZoom: 6 });
          }
        }, 200);
        return;
      }
    } catch (e) {}
  }

  // Coordenadas simuladas de fallback conforme localidade
  loadingIndicator.classList.add('hidden');
  countBadge.textContent = `Distribuição global: ${specimen.fossil_locations || 'Registros catalogados'}`;
  state.leafletMap.setView([20, 0], 2);
}


// ============================================================================
// LIGHTBOX DE IMAGENS EM TELA CHEIA
// ============================================================================

function openLightbox(index = 0) {
  if (!state.lightboxImages || state.lightboxImages.length === 0) return;
  state.lightboxIndex = Math.max(0, Math.min(index, state.lightboxImages.length - 1));
  updateLightboxView();
  lightboxModal.classList.remove('hidden');
}

function updateLightboxView() {
  const current = state.lightboxImages[state.lightboxIndex];
  lightboxImg.src = current.url;
  lightboxImg.onerror = () => { lightboxImg.src = PLACEHOLDER_IMAGE; };
  lightboxCaption.textContent = current.caption || 'Representação do espécime';
  lightboxCounter.textContent = `${state.lightboxIndex + 1} de ${state.lightboxImages.length}`;
}

function navigateLightbox(dir) {
  if (!state.lightboxImages || state.lightboxImages.length <= 1) return;
  state.lightboxIndex = (state.lightboxIndex + dir + state.lightboxImages.length) % state.lightboxImages.length;
  updateLightboxView();
}

function closeLightbox() {
  lightboxModal.classList.add('hidden');
}


// ============================================================================
// UTILITÁRIOS & HELPERS
// ============================================================================

function toggleExpertModeDisplay() {
  if (state.isExpertMode) {
    showToast('Modo Especialista Ativado: Taxonomia GBIF & Osteologia Aprofundada!', '🔬');
    if (!wikiModal.classList.contains('hidden')) {
      switchWikiTab('tab-expert');
    }
  } else {
    showToast('Modo Padrão Ativado', 'ℹ️');
  }
}

function resetAllFilters() {
  state.currentEra = 'all';
  state.currentPeriod = 'all';
  state.currentGroup = 'all';
  state.currentDiet = 'all';
  state.currentSkeletalType = 'all';
  state.searchQuery = '';

  searchInput.value = '';
  clearBtn.classList.add('hidden');
  if (skeletalFilter) skeletalFilter.value = 'all';
  periodFilter.value = 'all';
  groupFilter.value = 'all';
  dietFilter.value = 'all';

  document.querySelectorAll('.era-tab-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-era') === 'all');
  });

  loadCatalog();
  showToast('Filtros resetados com sucesso!', '🔄');
}

function showLoading(msg) {
  loadingMessage.textContent = msg;
  loadingState.classList.remove('hidden');
}

function hideLoading() {
  loadingState.classList.add('hidden');
}

function updateStats(count, isOnline) {
  if (isOnline) {
    resultsStats.innerHTML = `🟢 <strong>Servidor FastAPI Ativo:</strong> Exibindo ${count} espécime(s) no acervo global.`;
  } else {
    resultsStats.innerHTML = `⚡ <strong>Modo Instantâneo:</strong> Exibindo ${count} espécime(s) de todas as eras. Execute <code>./iniciar.sh</code> para buscas dinâmicas via GBIF.`;
  }
}

function showToast(text, icon = '🌍') {
  toastText.textContent = text;
  document.querySelector('.toast-icon').textContent = icon;
  toastNotification.classList.remove('hidden');
  
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toastNotification.classList.add('hidden');
  }, 4000);
}

function truncateText(str, max = 120) {
  if (!str) return '';
  return str.length > max ? str.substring(0, max) + '...' : str;
}
