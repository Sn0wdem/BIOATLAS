/**
 * Enciclopédia Paleontológica da Era Mesozoica
 * 
 * Sistema Inteligente com:
 * 1. Ingestão Automática de QUALQUER Espécime Mesozoico (PBDB + Wikipedia)
 * 2. Mineração e Seleção de Representações Visuais em Vida (Paleoarte Colorida)
 * 3. Dossiê Científico e Modo Especialista (Cladística, Osteologia, FEA e LAGs)
 * 4. Mapa Fóssil Mundial Georreferenciado Integrado (PBDB + Leaflet)
 * 5. Lightbox Pop-up de Imagens em Tela Cheia
 */

// ==========================================================================
// ELEMENTOS DO DOM
// ==========================================================================
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const btnAutoIngest = document.getElementById('btnAutoIngest');
const periodFilter = document.getElementById('periodFilter');
const groupFilter = document.getElementById('groupFilter');
const dietFilter = document.getElementById('dietFilter');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const reloadSuggestionsBtn = document.getElementById('reloadSuggestionsBtn');
const resultsContainer = document.getElementById('results');
const loading = document.getElementById('loading');
const loadingMessage = document.getElementById('loadingMessage');
const emptyState = document.getElementById('emptyState');
const resultsStats = document.getElementById('resultsStats');
const quickTags = document.querySelectorAll('.tag-chip');

// Botões de Descoberta Automática PBDB
const btnRandomDino = document.getElementById('btnRandomDino');
const discoveryBtns = document.querySelectorAll('.discovery-btn[data-group]');
const toastNotification = document.getElementById('toastNotification');
const toastText = document.getElementById('toastText');

// Toggles do Modo Especialista
const globalExpertToggle = document.getElementById('globalExpertToggle');
const modalExpertToggle = document.getElementById('modalExpertToggle');
const btnToggleExpertInFooter = document.getElementById('btnToggleExpertInFooter');
const tabBtnExpert = document.getElementById('tabBtnExpert');

// Modal da Wiki Própria
const wikiModal = document.getElementById('wikiModal');
const wikiModalBackdrop = document.getElementById('wikiModalBackdrop');
const closeWikiBtn = document.getElementById('closeWikiBtn');
const btnCloseWikiFooter = document.getElementById('btnCloseWikiFooter');
const wikiTabs = document.querySelectorAll('.wiki-tab-btn');
const wikiTabContents = document.querySelectorAll('.wiki-tab-content');

// Cabeçalho da Wiki
const wikiTitle = document.getElementById('wikiTitle');
const wikiEtymology = document.getElementById('wikiEtymology');
const wikiPeriodBadge = document.getElementById('wikiPeriodBadge');
const wikiGroupBadge = document.getElementById('wikiGroupBadge');
const wikiDietBadge = document.getElementById('wikiDietBadge');

// Aba 1: Dossiê Geral
const wikiFeaturedImg = document.getElementById('wikiFeaturedImg');
const wikiFeaturedCaption = document.getElementById('wikiFeaturedCaption');
const wikiGalleryThumbs = document.getElementById('wikiGalleryThumbs');
const galleryCount = document.getElementById('galleryCount');
const btnZoomFeatured = document.getElementById('btnZoomFeatured');
const specLength = document.getElementById('specLength');
const specHeight = document.getElementById('specHeight');
const specWeight = document.getElementById('specWeight');
const specSpeed = document.getElementById('specSpeed');
const specBiteForce = document.getElementById('specBiteForce');
const specPeriod = document.getElementById('specPeriod');
const wikiBioText = document.getElementById('wikiBioText');
const wikiCuriositiesList = document.getElementById('wikiCuriositiesList');

// Aba 2: Modo Especialista (Detalhes Complexos)
const expertCladogram = document.getElementById('expertCladogram');
const expertOsteology = document.getElementById('expertOsteology');
const expertBiomechanics = document.getElementById('expertBiomechanics');
const expertHistology = document.getElementById('expertHistology');

// Aba 3: Imagens & Busca na Web
const btnSearchGoogleImages = document.getElementById('btnSearchGoogleImages');
const webImageSearchInput = document.getElementById('webImageSearchInput');
const btnSearchWebImages = document.getElementById('btnSearchWebImages');
const imageSearchChips = document.querySelectorAll('.image-chip');
const fullGalleryGrid = document.getElementById('fullGalleryGrid');
const webImagesLoading = document.getElementById('webImagesLoading');

// Aba 4: Mapa Integrado
const tabBtnMap = document.getElementById('tabBtnMap');
const integratedMapSubtitle = document.getElementById('integratedMapSubtitle');
const integratedMapCount = document.getElementById('integratedMapCount');
const integratedMapLoading = document.getElementById('integratedMapLoading');

// Modal Lightbox de Imagens
const lightboxModal = document.getElementById('lightboxModal');
const lightboxBackdrop = document.getElementById('lightboxBackdrop');
const closeLightboxBtn = document.getElementById('closeLightboxBtn');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
const lightboxNextBtn = document.getElementById('lightboxNextBtn');

// Estado da Aplicação
let isExpertMode = false;
let currentCreature = null;
let currentGallery = [];
let currentImageIndex = 0;
let leafletMap = null;
let leafletMarkersLayer = null;
let activeCatalog = [];

// Placeholder SVG resiliente
const PLACEHOLDER_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22260%22%20viewBox%3D%220%200%20400%20260%22%3E%3Crect%20fill%3D%22%23121712%22%20width%3D%22400%22%20height%3D%22260%22%2F%3E%3Ctext%20fill%3D%22%234ade80%22%20font-family%3D%22system-ui%22%20font-size%3D%2246%22%20x%3D%2250%25%22%20y%3D%2245%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3E%F0%9F%A6%95%3C%2Ftext%3E%3Ctext%20fill%3D%22%238fa38f%22%20font-family%3D%22system-ui%22%20font-size%3D%2214%22%20x%3D%2250%25%22%20y%3D%2268%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3ERepresenta%C3%A7%C3%A3o%20em%20Vida%20(Paleoarte)%3C%2Ftext%3E%3C%2Fsvg%3E";

// Lista curada de 60+ gêneros mesozoicos para o botão de sorteio / autodescoberta
const FAMOUS_MESOZOIC_GENERA = [
  'Therizinosaurus', 'Argentinosaurus', 'Giganotosaurus', 'Deinonychus', 'Dilophosaurus',
  'Pachycephalosaurus', 'Baryonyx', 'Quetzalcoatlus', 'Tapejara', 'Liopleurodon',
  'Herrerasaurus', 'Majungasaurus', 'Amargasaurus', 'Yutyrannus', 'Oxalaia',
  'Microraptor', 'Sauroposeidon', 'Carcharodontosaurus', 'Troodon', 'Oviraptor',
  'Kentrosaurus', 'Pterodactylus', 'Elasmosaurus', 'Ichthyosaurus', 'Sarcosuchus',
  'Deinosuchus', 'Mamenchisaurus', 'Plateosaurus', 'Staurikosaurus', 'Buriolestes',
  'Psittacosaurus', 'Edmontosaurus', 'Corythosaurus', 'Parasaurolophus', 'Lambeosaurus',
  'Euoplocephalus', 'Suchomimus', 'Ceratosaurus', 'Torvosaurus', 'Sinraptor',
  'Cryolophosaurus', 'Rhamphorhynchus', 'Dimorphodon', 'Tupandactylus', 'Shonisaurus',
  'Kronosaurus', 'Tylosaurus', 'Dsungaripterus', 'Carnotaurus', 'Ankylosaurus'
];

// ==========================================================================
// ACERVO INICIAL BASE COM REPRESENTAÇÕES VISUAIS EM VIDA (PALEOARTE)
// ==========================================================================
// ==========================================================================
// RESILIÊNCIA DE IMAGENS & MAPEAMENTO DE GÊNEROS (PORTUGUÊS / SINÔNIMOS)
// ==========================================================================

// Fallback multi-nível para imagens
window.handleImageFallback = function(imgEl) {
  try {
    const raw = imgEl.getAttribute('data-fallbacks');
    if (raw) {
      const fallbacks = JSON.parse(raw);
      let idx = parseInt(imgEl.getAttribute('data-img-index') || '0', 10);
      if (idx < fallbacks.length) {
        imgEl.setAttribute('data-img-index', (idx + 1).toString());
        imgEl.src = fallbacks[idx];
        return;
      }
    }
  } catch (e) {}
  imgEl.onerror = null;
  imgEl.src = PLACEHOLDER_IMAGE;
};

// Mapeamento de termos e nomes populares em português para o gênero taxonômico científico
const GENUS_NAME_MAP = {
  't-rex': 'Tyrannosaurus',
  'trex': 'Tyrannosaurus',
  't rex': 'Tyrannosaurus',
  'tiranossauro': 'Tyrannosaurus',
  'tiranossauro rex': 'Tyrannosaurus',
  'tyranno': 'Tyrannosaurus',
  'tyrannossauro': 'Tyrannosaurus',
  'tyrannosaurus rex': 'Tyrannosaurus',
  'espinossauro': 'Spinosaurus',
  'spino': 'Spinosaurus',
  'triceratopo': 'Triceratops',
  'triceratops': 'Triceratops',
  'trike': 'Triceratops',
  'velociraptor': 'Velociraptor',
  'veloci': 'Velociraptor',
  'raptor': 'Velociraptor',
  'estegossauro': 'Stegosaurus',
  'stego': 'Stegosaurus',
  'braquiossauro': 'Brachiosaurus',
  'brachio': 'Brachiosaurus',
  'alossauro': 'Allosaurus',
  'allo': 'Allosaurus',
  'pteranodonte': 'Pteranodon',
  'pterodactilo': 'Pteranodon',
  'pterodáctilo': 'Pteranodon',
  'mosassauro': 'Mosasaurus',
  'mossassauro': 'Mosasaurus',
  'carnotauro': 'Carnotaurus',
  'anquilossauro': 'Ankylosaurus',
  'anquilosauro': 'Ankylosaurus',
  'plesiossauro': 'Plesiosaurus',
  'plesiosauro': 'Plesiosaurus',
  'celofise': 'Coelophysis',
  'celófise': 'Coelophysis',
  'terizinossauro': 'Therizinosaurus',
  'terizinosauro': 'Therizinosaurus',
  'argentinossauro': 'Argentinosaurus',
  'argentinosauro': 'Argentinosaurus',
  'giganotossauro': 'Giganotosaurus',
  'giganotosauro': 'Giganotosaurus',
  'deinonico': 'Deinonychus',
  'dilofossauro': 'Dilophosaurus',
  'dilofosauro': 'Dilophosaurus',
  'paquicefalossauro': 'Pachycephalosaurus',
  'barionix': 'Baryonyx',
  'quetzalcoatl': 'Quetzalcoatlus',
  'quetzalcoatlus': 'Quetzalcoatlus',
  'tapejara': 'Tapejara',
  'tupandactilo': 'Tupandactylus',
  'amargassauro': 'Amargasaurus',
  'majungassauro': 'Majungasaurus',
  'sauroposeidon': 'Sauroposeidon',
  'carcharodontossauro': 'Carcharodontosaurus',
  'dromeossauro': 'Dromaeosaurus',
  'iguanodonte': 'Iguanodon',
  'parassaurolofo': 'Parasaurolophus',
  'coritossauro': 'Corythosaurus',
  'edmontossauro': 'Edmontosaurus',
  'microraptor': 'Microraptor',
  'liopleurodonte': 'Liopleurodon',
  'ictiossauro': 'Ichthyosaurus',
  'sarcosuco': 'Sarcosuchus',
  'deinossuco': 'Deinosuchus'
};

const BASE_PALEONTOLOGY_DATABASE = [
  {
    name: 'Tyrannosaurus',
    species: 'Tyrannosaurus rex',
    commonName: 'Tiranossauro Rex',
    etymology: 'Do grego: "Rei dos lagartos tiranos" • Descrito em 1905 por Henry Fairfield Osborn',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Superior (Maastrichtiano, 68 – 66 Ma)',
    group: 'dinossauro',
    groupName: 'Terópode Celurssauro',
    diet: 'carnivoro',
    dietName: 'Carnívoro de Topo / Osteófago',
    length: '12,3 a 12,8 metros',
    height: '3,7 a 4,0 metros (quadris)',
    weight: '8,4 a 14 toneladas',
    speed: '20 a 27 km/h',
    biteForce: '35.000 a 57.000 N (~5.800 kgf)',
    location: 'América do Norte (Formações Hell Creek, Lance, Scollard e Ferris)',
    bio: 'O Tyrannosaurus rex é o ápice evolutivo dos terópodes da Laurasia. Possuía visão binocular ampla (campo estereoscópico de 55°, superando o do falcão moderno), olfato hiperdesenvolvido com bulbos olfativos avantajados e ossos nasais fusionados em abóbada para absorver o impacto de mordidas mastodônticas. Sua dentição heterodonte apresentava dentes com secção em "D" na frente e lâminas em formato de banana de até 30 cm de comprimento com raízes.',
    curiosities: [
      'Análises de coprólitos provam que o T-Rex esmagava e digeria ossos inteiros de Triceratops e Edmontosaurus.',
      'O maior espécime com massa estimada é "Scotty" (RSM P2523.8), descoberto no Canadá, com peso calculado em cerca de 8.870 kg.',
      'Apesar de seus membros anteriores terem apenas dois dedos funcionais, o osso úmero era extremamente espesso e suportava cargas de mais de 200 kg.',
      'Marcas de cicatrização no crânio indicam que os tiranossauros adultos mordiam a face uns dos outros em disputas territoriais.'
    ],
    expertData: {
      cladogram: [
        'Dinosauria (Owen, 1842)',
        '└── Saurischia (Seeley, 1887)',
        '    └── Theropoda (Marsh, 1881)',
        '        └── Coelurosauria (Huene, 1914)',
        '            └── Tyrannosauroidea (Walker, 1964)',
        '                └── Tyrannosauridae (Osborn, 1906)',
        '                    └── Tyrannosaurinae (Osborn, 1906)',
        '                        └── Tyrannosaurus rex (Osborn, 1905)'
      ],
      osteology: '<p>Crânio com fenestras antorbitais ampliadas para alívio de massa. Ossos nasais e frontais com sinostose precoce impedindo torção durante a estocada predatória.</p>',
      biomechanics: '<p>Análise FEA: O palato secundário distribui as tensões de compressão para o neurocrânio, gerando pressão de contato dental superior a 430 MPa.</p>',
      histology: '<p>LAGs: Análise histológica revela maturidade esquelética aos 28–30 anos. Na adolescência (14-18 anos), ganhava até 2,1 kg de massa por dia.</p>'
    },
    gallery: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Tyrannosaurus_rex_mmartyniuk.png/500px-Tyrannosaurus_rex_mmartyniuk.png?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
        caption: 'Representação paleoartística em vida com plumagem parcial (Martyniuk)'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/Tyrannosaurus_Rex%2C_Expo_Dinosaurios_2023_-_A740976.jpg/500px-Tyrannosaurus_Rex%2C_Expo_Dinosaurios_2023_-_A740976.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Tyrannosaurus em vida'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/Tyrannosaurus_mcraeensis.png/500px-Tyrannosaurus_mcraeensis.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Tyrannosaurus em vida'
      }
    ]
  },
  {
    name: 'Spinosaurus',
    species: 'Spinosaurus aegyptiacus',
    commonName: 'Espinossauro',
    etymology: 'Do grego: "Lagarto com espinhos" • Descrito em 1915 por Ernst Stromer',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Superior (Cenomaniano, 99 – 93 Ma)',
    group: 'dinossauro',
    groupName: 'Espinossaurídeo Semiaquático',
    diet: 'carnivoro',
    dietName: 'Carnívoro / Piscívoro Especialista',
    length: '14,0 a 16,0 metros',
    height: '4,5 a 5,4 metros (topo da vela)',
    weight: '7,4 a 9,0 toneladas',
    speed: '15 km/h (terra) / 25 km/h (água)',
    biteForce: '19.000 a 25.000 N (~2.500 kgf)',
    location: 'Norte da África (Kem Kem Beds no Marrocos, Formação Bahariya no Egito)',
    bio: 'O Spinosaurus é o terópode mais longo conhecido. Adaptado para nichos fluviais e costeiros de mangues cretáceos, possuía osteosclerose (ossos hiperdensos sem canal medular amplo para atuar como lastro de mergulho), cauda propulsora em forma de remo com espinhas neurais hiperalongadas e focinho estreito com forames neurovasculares para detectar vibrações na água.',
    curiosities: [
      'A cauda em forma de nadadeira foi descoberta em 2020 por Nizar Ibrahim, comprovando seu modelo locomotor natatório.',
      'Seus dentes cônicos lisos eram perfeitos para perfurar peixes recobertos de escamas duras como Mawsonia e Onchopristis.',
      'Os fósseis originais de 1915 foram destruídos durante o bombardeio de Munique na Segunda Guerra Mundial em 1944.',
      'Possuía centro de gravidade recuado em direção às pernas traseiras curtas para natação eficiente.'
    ],
    expertData: {
      cladogram: [
        'Dinosauria > Theropoda > Megalosauroidea > Spinosauridae > Spinosaurinae > Spinosaurus'
      ],
      osteology: '<p>Processos espinhosos nas vértebras dorsais de até 1,82 metro; vértebras caudais com arcos hemais alongados que formavam uma nadadeira vertical.</p>',
      biomechanics: '<p>Dinâmica de fluidos computacional (CFD): cauda gerava 8 vezes mais empuxo que a de outros terópodes.</p>',
      histology: '<p>Osteosclerose extrema nas costelas e tíbias para combater flutuabilidade positiva induzida pelos sacos aéreos.</p>'
    },
    gallery: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Spinosaurus_aegyptiacus_life_reconstruction.png/500px-Spinosaurus_aegyptiacus_life_reconstruction.png?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
        caption: 'Representação paleoartística em vida nadando com vela e cauda em remo'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9b/Life_reconstruction_of_Spinosaurus_aegyptiacus.png/500px-Life_reconstruction_of_Spinosaurus_aegyptiacus.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Spinosaurus em vida'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/Spinosaurus_life_restoration_based_on_fossil_reconstruction.png/500px-Spinosaurus_life_restoration_based_on_fossil_reconstruction.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Spinosaurus em vida'
      }
    ]
  },
  {
    name: 'Triceratops',
    species: 'Triceratops horridus',
    commonName: 'Tricerátops',
    etymology: 'Do grego: "Face com três chifres" • Descrito em 1889 por Othniel Charles Marsh',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Superior (Maastrichtiano, 68 – 66 Ma)',
    group: 'dinossauro',
    groupName: 'Ceratopsídeo Quadrúpede',
    diet: 'herbivoro',
    dietName: 'Herbívoro Fibrorredutor',
    length: '8,0 a 9,0 metros',
    height: '2,9 a 3,0 metros',
    weight: '6,0 a 10,0 toneladas',
    speed: '25 a 30 km/h',
    biteForce: '18.000 N (cisalhamento na bateria dental)',
    location: 'América do Norte (Formações Hell Creek, Lance e Frenchman)',
    bio: 'O Triceratops ostentava um dos maiores crânios entre todos os tetrápodes terrestres, atingindo até 2,5 metros de comprimento. Apresentava um escudo ósseo occipital compacto e sólido e dois chifres pós-orbitais de mais de 1 metro revestidos por bainhas duras de queratina afiadas.',
    curiosities: [
      'Possuía até 800 dentes organizados em baterias contínuas que agiam como tesouras automáticas para cortar vegetação resistente.',
      'Crânios fósseis mostram perfurações por chifres curadas, indicando combates frontais territoriais com rivais.',
      'O côndilo occipital em bola permitia girar a cabeça com ampla agilidade defensiva.',
      'Representa mais de 40% de todos os dinossauros desenterrados na Formação Hell Creek.'
    ],
    expertData: {
      cladogram: ['Dinosauria > Ornithischia > Ceratopsia > Ceratopsidae > Chasmosaurinae > Triceratops'],
      osteology: '<p>Escudo frill maciço sem fenestras parietais; baterias dentais com 3 a 5 dentes de substituição vertical contínua.</p>',
      biomechanics: '<p>Movimento ortal e propalatal produzindo torque de cisalhamento capaz de fatiar vegetação com alto teor de sílica.</p>',
      histology: '<p>Chifres com núcleo trabecular e capa de queratina com módulo de elasticidade gradiente absorvendo impactos de 25 kJ.</p>'
    },
    gallery: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Juvenile_reconstruction_of_Triceratops.png/500px-Juvenile_reconstruction_of_Triceratops.png?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
        caption: 'Representação paleoartística em vida do Triceratops em seu habitat'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Triceratops_TD.png/500px-Triceratops_TD.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Triceratops em vida'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Triceratops_horridus.png/500px-Triceratops_horridus.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Triceratops em vida'
      }
    ]
  },
  {
    name: 'Velociraptor',
    species: 'Velociraptor mongoliensis',
    commonName: 'Velociraptor',
    etymology: 'Do latim: "Ladrão veloz" • Descrito em 1924 por Henry Fairfield Osborn',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Superior (Campaniano, 75 – 71 Ma)',
    group: 'dinossauro',
    groupName: 'Dromeossaurídeo Maniraptor',
    diet: 'carnivoro',
    dietName: 'Carnívoro Ágil Emplumado',
    length: '1,8 a 2,07 metros',
    height: '0,5 metros (quadril)',
    weight: '15 a 20 kg',
    speed: '38 a 45 km/h',
    biteForce: '1.200 N (~122 kgf)',
    location: 'Deserto de Gobi (Formação Djadochta, Mongólia e China)',
    bio: 'O Velociraptor é um paraviano intimamente aparentado às aves modernas. Seu corpo era integralmente revestido de penas penáceas e asas aerodinâmicas bem desenvolvidas nos antebraços. Sua maior arma era a garra falciforme hipertrofiada no segundo dígito do pé traseiro (híper-extensível), utilizada para imobilizar presas sob seu peso corporal.',
    curiosities: [
      'Possuía papilas ulnares fósseis onde se inseriam penas de voo secundárias idênticas às das aves atuais.',
      'O fóssil dos "Dinossauros em Combate" preservou um Velociraptor lutando com um Protoceratops sob duna desabada.',
      'A cauda com bastonetes ósseos funcionava como leme rígido para manobras em alta velocidade.',
      'Apesar das asas nas patas dianteiras, seu peso não permitia voo ativo batido.'
    ],
    expertData: {
      cladogram: ['Dinosauria > Theropoda > Coelurosauria > Maniraptora > Dromaeosauridae > Velociraptor'],
      osteology: '<p>Garra falciforme articulada em gínglimo; fúrcula fusionada homóloga ao "osso da sorte" das aves.</p>',
      biomechanics: '<p>Modelo RPR (Fowler et al.): garra agia como gancho de retenção enquanto batia as asas para equilíbrio.</p>',
      histology: '<p>Penas com melanossomos preservados indicando padrões de camuflagem terrosa adaptada ao deserto.</p>'
    },
    gallery: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/55/Velociraptor_Restoration.png/500px-Velociraptor_Restoration.png?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
        caption: 'Representação paleoartística em vida com plumagem realista e asas'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/55/Velociraptor_Restoration.png/500px-Velociraptor_Restoration.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Velociraptor em vida'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cc/Velociraptor_TD.png/500px-Velociraptor_TD.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Velociraptor em vida'
      }
    ]
  },
  {
    name: 'Stegosaurus',
    species: 'Stegosaurus stenops',
    commonName: 'Estegossauro',
    etymology: 'Do grego: "Lagarto telhado" • Descrito em 1877 por Othniel Charles Marsh',
    periodKey: 'Jurassic',
    periodName: 'Jurássico Superior (155 – 150 Ma)',
    group: 'dinossauro',
    groupName: 'Tireóforo Blindado',
    diet: 'herbivoro',
    dietName: 'Herbívoro de Sub-bosque',
    length: '9,0 metros',
    height: '4,0 metros (até as placas)',
    weight: '4,5 a 7,0 toneladas',
    speed: '12 a 15 km/h',
    biteForce: '1.400 N',
    location: 'América do Norte (Formação Morrison) e Portugal',
    bio: 'Caracterizado por placas ósseas triangulares dorsais vascularizadas e pelo tagomizador na ponta da cauda (quatro espinhos de até 90 cm), o Stegosaurus usava sua couraça e flexibilidade caudal como defesa intransponível contra predadores jurássicos.',
    curiosities: [
      'As placas não eram fundidas à espinha dorsal, mas sim incrustadas na pele dérmica espessa.',
      'Possuía pequenos botões ósseos na garganta para protegê-la de mordidas por baixo.',
      'O tagomizador gerava impacto suficiente para perfurar vértebras de Allosaurus.',
      'Alimentava-se de samambaias e cavalinhas rente ao solo jurássico.'
    ],
    expertData: {
      cladogram: ['Dinosauria > Ornithischia > Thyreophora > Stegosauria > Stegosauridae > Stegosaurus'],
      osteology: '<p>Osteodermas dorsais alternados com canais nutritivos para termorregulação e cortejo.</p>',
      biomechanics: '<p>Cauda flexível alcançava velocidade de impacto de até 70 km/h com 2.000 Joules focados nos espinhos.</p>',
      histology: '<p>Revestimento de queratina sobre osso trabecular de alta vascularização superficial.</p>'
    },
    gallery: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d8/Stegosaurus_stenops_Life_Reconstruction.png/500px-Stegosaurus_stenops_Life_Reconstruction.png?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
        caption: 'Representação paleoartística em vida do Stegosaurus com placas e tagomizador'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/Stegosaurus_TD.png/500px-Stegosaurus_TD.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Stegosaurus em vida'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Stegosaurus_stenops.png/500px-Stegosaurus_stenops.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Stegosaurus em vida'
      }
    ]
  },
  {
    name: 'Brachiosaurus',
    species: 'Brachiosaurus altithorax',
    commonName: 'Braquiossauro',
    etymology: 'Do grego: "Lagarto com braços" • Descrito em 1903 por Elmer S. Riggs',
    periodKey: 'Jurassic',
    periodName: 'Jurássico Superior (154 – 150 Ma)',
    group: 'dinossauro',
    groupName: 'Macronário Saurópode',
    diet: 'herbivoro',
    dietName: 'Herbívoro de Dossel Arbóreo',
    length: '26 a 30 metros',
    height: '12 a 13 metros (cabeça)',
    weight: '35 a 55 toneladas',
    speed: '12 a 15 km/h',
    biteForce: '4.500 N',
    location: 'América do Norte (Formação Morrison, EUA)',
    bio: 'Destacava-se por possuir as patas dianteiras mais longas que as traseiras, conferindo postura inclinada para alcançar o topo das coníferas jurássicas a mais de 12 metros do chão sem precisar empinar o corpo.',
    curiosities: [
      'Seu coração pesava mais de 200 kg para conseguir bombear sangue até a cabeça elevada.',
      'Vértebras com pleurocelos internos eliminavam até 60% do peso ósseo.',
      'Consumia até 400 kg de vegetação diariamente.',
      'Utilizava gastrólitos estomacais para triturar folhas ingeridas inteiras.'
    ],
    expertData: {
      cladogram: ['Dinosauria > Saurischia > Sauropodomorpha > Titanosauriformes > Brachiosauridae > Brachiosaurus'],
      osteology: '<p>Razão úmero/fêmur > 1,0 transferindo o centro de massa para a frente; pleurocelos cavernosos de alívio.</p>',
      biomechanics: '<p>Gigantotermia com retenção térmica constante de 36–38 °C devido à baixa razão área/volume.</p>',
      histology: '<p>Tecido fibrolamelar com deposição óssea contínua sem paradas sazonais prolongadas.</p>'
    },
    gallery: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Brachiosaurus_altithorax_side_profile.png/500px-Brachiosaurus_altithorax_side_profile.png?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
        caption: 'Representação paleoartística em vida em perfil completo'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Brachiosaurus_TD.png/500px-Brachiosaurus_TD.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Brachiosaurus em vida'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Brachiosaurus_altithorax_%28d%C3%A9tour%C3%A9%29.png/500px-Brachiosaurus_altithorax_%28d%C3%A9tour%C3%A9%29.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Brachiosaurus em vida'
      }
    ]
  },
  {
    name: 'Allosaurus',
    species: 'Allosaurus fragilis',
    commonName: 'Alossauro',
    etymology: 'Do grego: "Lagarto diferente" • Descrito em 1877 por Othniel Charles Marsh',
    periodKey: 'Jurassic',
    periodName: 'Jurássico Superior (155 – 145 Ma)',
    group: 'dinossauro',
    groupName: 'Carnosauro Terópode',
    diet: 'carnivoro',
    dietName: 'Carnívoro de Topo Jurássico',
    length: '8,5 a 10 metros',
    height: '3,0 a 3,3 metros',
    weight: '2,0 a 2,5 toneladas',
    speed: '30 a 40 km/h',
    biteForce: '8.000 a 12.000 N',
    location: 'América do Norte (Formação Morrison) e Portugal',
    bio: 'Predador dominante do Jurássico. Utilizava o crânio cinético como um machado de corte rápido contra grandes presas herbívoras.',
    curiosities: [
      'Mais de 70 esqueletos foram encontrados juntos na pedreira de Cleveland-Lloyd.',
      'Mandíbulas abriam em ângulo de até 92 graus.',
      'Possuía cristas pré-oculares coloridas para comunicação visual.',
      'Marcas ósseas comprovam caçadas ativas contra estegossauros.'
    ],
    expertData: {
      cladogram: ['Dinosauria > Theropoda > Carnosauria > Allosauroidea > Allosauridae > Allosaurus'],
      osteology: '<p>Crânio com mobilidade intramandibular lateral; vértebras com pleurocelos avançados.</p>',
      biomechanics: '<p>Modelo "axe-bite": adaptação craniana para impactos verticais massivos de alta velocidade.</p>',
      histology: '<p>Crescimento rápido com maturação aos 12–15 anos; presença de fraturas ósseas curadas.</p>'
    },
    gallery: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Allosaurus_Juvenile_Reconstruction.jpg/500px-Allosaurus_Juvenile_Reconstruction.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
        caption: 'Representação paleoartística em vida do Allosaurus em caçada ativa'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Allosaurus_Jaws_Steveoc86.jpg/500px-Allosaurus_Jaws_Steveoc86.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Allosaurus em vida'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Allosaurus_Life_Restoration.jpg/500px-Allosaurus_Life_Restoration.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Allosaurus em vida'
      }
    ]
  },
  {
    name: 'Pteranodon',
    species: 'Pteranodon longiceps',
    commonName: 'Pteranodonte',
    etymology: 'Do grego: "Asa sem dentes" • Descrito em 1876 por Othniel Charles Marsh',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Superior (86 – 84 Ma)',
    group: 'pterossauro',
    groupName: 'Pterodactiloide Voador',
    diet: 'piscivoro',
    dietName: 'Piscívoro Planador Oceânico',
    length: 'Envergadura de 6,5 a 7,2 metros',
    height: '1,8 metro (pousado)',
    weight: '20 a 35 kg',
    speed: '60 a 85 km/h',
    biteForce: 'Bico córneo adaptado para peixes',
    location: 'América do Norte (Niobrara Chalk)',
    bio: 'Pterossauro gigante que planava por centenas de quilômetros sobre oceanos cretáceos utilizando correntes de vento oceânicas com bico córneo sem dentes.',
    curiosities: [
      'Pesava apenas ~30 kg apesar dos 7 metros de asa devido ao esqueleto aerado.',
      'Longa crista óssea occipital funcionava como leme aerodinâmico.',
      'Mergulhava o bico em rasantes para capturar peixes e cefalópodes.',
      'Mais de 1.100 espécimes fósseis já foram documentados pela ciência.'
    ],
    expertData: {
      cladogram: ['Pterosauria > Pterodactyloidea > Ornithocheiroidea > Pteranodontidae > Pteranodon'],
      osteology: '<p>Notarium fundido ancorando a escápula; quarto dígito hiperalongado sustentando o quirópatagio.</p>',
      biomechanics: '<p>Carga alar extremamente baixa (~8 kg/m²) e decolagem quadrúpede impulsiva.</p>',
      histology: '<p>Córtex ósseo milimétrico reforçado por treliças trabeculares tridimensionais.</p>'
    },
    gallery: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Pteranodon_longiceps_mmartyniuk_wiki.png/330px-Pteranodon_longiceps_mmartyniuk_wiki.png?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
        caption: 'Representação paleoartística em vida do Pteranodon em pleno voo'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9b/Pteranodon_TD.png/500px-Pteranodon_TD.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Pteranodon em vida'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/Pteranodon_cranial_anatomy.jpg/500px-Pteranodon_cranial_anatomy.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Pteranodon em vida'
      }
    ]
  },
  {
    name: 'Mosasaurus',
    species: 'Mosasaurus hoffmannii',
    commonName: 'Mossassauro',
    etymology: 'Do latim: "Lagarto do rio Mosa" • Descrito em 1822 por William Conybeare',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Superior (82 – 66 Ma)',
    group: 'reptil-marinho',
    groupName: 'Esquamatado Marinho Gigante',
    diet: 'carnivoro',
    dietName: 'Superpredador Pelágico',
    length: '14,0 a 17,5 metros',
    height: 'Corpo serpentino fusiforme',
    weight: '10 a 15 toneladas',
    speed: '35 a 45 km/h',
    biteForce: '28.000 a 40.000 N',
    location: 'Oceanos mundiais (Europa, América, África e Antártica)',
    bio: 'Parente evolutivo dos lagartos monitores modernos e cobras. Soberano dos mares cretáceos com nadadeiras hidrodinâmicas, cauda propulsora em leque e dentes pterigóideos no céu da boca.',
    curiosities: [
      'Foi um dos primeiros grandes fósseis achados pela ciência moderna (1764).',
      'Possuía dentes extras no palato para segurar presas marinhas escorregadias.',
      'Dava à luz filhotes vivos na água (viviparidade comprovada).',
      'Esmagava conchas de amonites e carapaças de tartarugas marinhas gigantes.'
    ],
    expertData: {
      cladogram: ['Squamata > Toxicofera > Anguimorpha > Mosasauridae > Mosasaurus'],
      osteology: '<p>Articulação intramandibular flexível; vértebras caudais com arcos hemais hipertrofiados.</p>',
      biomechanics: '<p>Propulsão axial carangiforme com ondulação caudal e nadadeiras estabilizadoras.</p>',
      histology: '<p>Isótopos de oxigênio confirmam endotermia/homeotermia com 35–39 °C corporais.</p>'
    },
    gallery: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/Mosasaurus_hoffmanni_life.jpg/500px-Mosasaurus_hoffmanni_life.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
        caption: 'Representação paleoartística em vida do Mosasaurus caçando no oceano'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/Mosasaurus_hoffmanni_life.jpg/500px-Mosasaurus_hoffmanni_life.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Mosasaurus em vida'
      }
    ]
  },
  {
    name: 'Carnotaurus',
    species: 'Carnotaurus sastrei',
    commonName: 'Carnotauro',
    etymology: 'Do latim: "Touro carnívoro" • Descrito em 1985 por José Bonaparte',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Superior (72 – 69 Ma)',
    group: 'dinossauro',
    groupName: 'Abelissaurídeo Patagônico',
    diet: 'carnivoro',
    dietName: 'Carnívoro Cursorial Veloz',
    length: '7,5 a 9,0 metros',
    height: '2,8 a 3,0 metros',
    weight: '1,5 a 2,0 toneladas',
    speed: '48 a 56 km/h',
    biteForce: '3.500 a 5.000 N',
    location: 'Patagônia, Argentina (Formação La Colonia)',
    bio: 'Conhecido pelos dois chifres ósseos frontais e patas dianteiras atrofiadas. Sua musculatura caudal caudofemoralis massiva impulsionava-o a mais de 50 km/h em perseguições em linha reta.',
    curiosities: [
      'Preservou impressões de pele quase completas com escamas e nódulos.',
      'Chifres eram usados em combates de cabeçadas entre machos.',
      'Alcançava aceleração impressionante com baixa manobrabilidade lateral.',
      'Braços vestigiais menores que os do T-Rex sem punho articulado.'
    ],
    expertData: {
      cladogram: ['Dinosauria > Theropoda > Ceratosauria > Abelisauridae > Carnotaurus'],
      osteology: '<p>Crânio encurtado braquicefálico; vértebras caudais com lâminas que abrigavam o músculo locomotor.</p>',
      biomechanics: '<p>Maior razão caudofemoral/fêmur entre terópodes bípedes de grande porte.</p>',
      histology: '<p>Fósseis dérmicos comprovam ausência de penas em abelissaurídeos sul-americanos.</p>'
    },
    gallery: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Carnotaurus_Reconstruction_%282022%29.png/500px-Carnotaurus_Reconstruction_%282022%29.png?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
        caption: 'Representação paleoartística em vida atualizada com chifres frontais'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Carnotaurus_Reconstruction_%282022%29.png/500px-Carnotaurus_Reconstruction_%282022%29.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Carnotaurus em vida'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Carnotaurus_TD.png/500px-Carnotaurus_TD.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Carnotaurus em vida'
      }
    ]
  },
  {
    name: 'Ankylosaurus',
    species: 'Ankylosaurus magniventris',
    commonName: 'Anquilossauro',
    etymology: 'Do grego: "Lagarto fundido" • Descrito em 1908 por Barnum Brown',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Superior (68 – 66 Ma)',
    group: 'dinossauro',
    groupName: 'Tireóforo Blindado',
    diet: 'herbivoro',
    dietName: 'Herbívoro Rasteiro',
    length: '6,5 a 8,0 metros',
    height: '1,7 a 2,0 metros',
    weight: '5,0 a 8,0 toneladas',
    speed: '10 a 12 km/h',
    biteForce: '1.800 N',
    location: 'América do Norte (Hell Creek, Lance, Scollard)',
    bio: 'O tanque blindado definitivo do Cretáceo com carapaça de osteodermas dérmicos e clava óssea caudal de impacto de até 60 kg.',
    curiosities: [
      'Ventre inferior desprovido de couraça era sua única área vulnerável.',
      'Seios nasais em espiral condicionavam o ar inalado e apuravam o olfato.',
      'Clava caudal quebrava fêmures de predadores que tentassem atacá-lo.',
      'Osteodermas da cabeça fundiam-se totalmente aos ossos cranianos.'
    ],
    expertData: {
      cladogram: ['Dinosauria > Ornithischia > Thyreophora > Ankylosauria > Ankylosauridae > Ankylosaurus'],
      osteology: '<p>Craniofusion completa; vértebras caudais terminais fundidas na haste rígida da clava.</p>',
      biomechanics: '<p>Impacto caudal de até 14.000 N gerando fratura óssea instantânea na canela do predador.</p>',
      histology: '<p>Fibras de colágeno entrelaçadas em padrão multicamada resistente a perfurações.</p>'
    },
    gallery: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Ankylosaurus_magniventris_by_sphenaphinae.png/500px-Ankylosaurus_magniventris_by_sphenaphinae.png?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
        caption: 'Representação paleoartística em vida com blindagem e clava caudal'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/202007_Ankylosaurus_magniventris.svg/500px-202007_Ankylosaurus_magniventris.svg.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Ankylosaurus em vida'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/Ankylosaurus_2026.jpg/500px-Ankylosaurus_2026.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Ankylosaurus em vida'
      }
    ]
  },
  {
    name: 'Plesiosaurus',
    species: 'Plesiosaurus dolichodeirus',
    commonName: 'Plesiossauro',
    etymology: 'Do grego: "Próximo a lagarto" • Descrito em 1821 por De la Beche e Conybeare',
    periodKey: 'Jurassic',
    periodName: 'Jurássico Inferior (199 – 175 Ma)',
    group: 'reptil-marinho',
    groupName: 'Plesiossauro Pelágico',
    diet: 'piscivoro',
    dietName: 'Piscívoro Hidrodinâmico',
    length: '3,5 a 4,5 metros',
    height: 'Pescoço longo com 40 vértebras',
    weight: '400 a 500 kg',
    speed: '15 a 20 km/h',
    biteForce: 'Dentes em agulha para aprisionamento',
    location: 'Europa Ocidental (Lyme Regis, Inglaterra)',
    bio: 'Descoberto por Mary Anning no século XIX, possuía quatro nadadeiras alares e pescoço esguio ágil para caçar cardumes nos mares jurássicos.',
    curiosities: [
      'Primeiro esqueleto completo achado por Mary Anning em 1823.',
      'Engolia pedras gastrólitos como lastro de profundidade marinha.',
      'Realizava voo subaquático simétrico com suas quatro pás natatórias.',
      'Pescoço não se erguia fora da água como cisne devido à anatomia vertebral.'
    ],
    expertData: {
      cladogram: ['Sauropterygia > Pistosauria > Plesiosauria > Plesiosauroidea > Plesiosaurus'],
      osteology: '<p>Cinturas pélvica e escapular transformadas em placas ventrais de suporte rígidas.</p>',
      biomechanics: '<p>Perfil de hidrofólio com sustentação gerada pela inclinação das pás no ciclo natatório.</p>',
      histology: '<p>Paquiosclerose nas costelas para controle hidrostático de flutuação.</p>'
    },
    gallery: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Plesiosaurus_dolichodeirus.png/500px-Plesiosaurus_dolichodeirus.png?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
        caption: 'Representação paleoartística em vida nadando com pescoço esguio'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/In_the_Days_of_the_Sea_Monsters_Plesiosaurus_and_Ichthyosaurus_b1072272_018_tif_9s161666b.tif/lossless-page1-500px-In_the_Days_of_the_Sea_Monsters_Plesiosaurus_and_Ichthyosaurus_b1072272_018_tif_9s161666b.tif.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Plesiosaurus em vida'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Plesiosaurus_dolichodeirus.png/500px-Plesiosaurus_dolichodeirus.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Plesiosaurus em vida'
      }
    ]
  },
  {
    name: 'Coelophysis',
    species: 'Coelophysis bauri',
    commonName: 'Celófise',
    etymology: 'Do grego: "Forma oca" • Descrito em 1889 por Edward Drinker Cope',
    periodKey: 'Triassic',
    periodName: 'Triássico Superior (216 – 196 Ma)',
    group: 'dinossauro',
    groupName: 'Terópode Basal Triássico',
    diet: 'carnivoro',
    dietName: 'Carnívoro Ágil Bípede',
    length: '2,5 a 3,0 metros',
    height: '1,0 metro',
    weight: '15 a 25 kg',
    speed: '40 a 50 km/h',
    biteForce: '600 N',
    location: 'América do Norte (Ghost Ranch, Novo México)',
    bio: 'Pioneiro do início da Era Mesozoica com ossos pneumatizados ocos e pernas longas que deram início à dominância dos dinossauros no Triássico.',
    curiosities: [
      'Milhares de fósseis foram desenterrados juntos em Ghost Ranch.',
      'Um crânio viajou ao espaço a bordo do ônibus espacial Endeavour em 1998.',
      'Visão adaptada para caçadas no crepúsculo triássico.',
      'Patas dianteiras com 3 garras funcionais afiadas.'
    ],
    expertData: {
      cladogram: ['Dinosauria > Saurischia > Theropoda > Coelophysoidea > Coelophysis'],
      osteology: '<p>Paredes ósseas corticais extremamente finas com fúrcula primitiva em "U".</p>',
      biomechanics: '<p>Adaptação cursorial extrema com metatarsos longos e compressão digitígrada veloz.</p>',
      histology: '<p>Dimorfismo sexual craniométrico marcado entre formas robustas e gráceis.</p>'
    },
    gallery: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Coelophysis_Jeff_Martz.jpg/500px-Coelophysis_Jeff_Martz.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail',
        caption: 'Representação paleoartística em vida do corredor triássico (Jeff Martz)'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6a/Coelophysis_TD.png/500px-Coelophysis_TD.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Coelophysis em vida'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Coelophysis_fossilized_position_038.JPG/500px-Coelophysis_fossilized_position_038.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
        caption: 'Reconstrução de Coelophysis em vida'
      }
    ]
  }
];

// ==========================================================================
// MOTOR DE INGESTÃO AUTOMÁTICA DE QUALQUER ESPÉCIME MESOZOICO
// ==========================================================================

/**
 * Minera a melhor representação visual em vida (paleoarte colorida)
 * a partir da lista de mídias da Wikipedia ou Commons.
 */

/**
 * Minera representações visuais em vida diretamente da Wikimedia Commons Action API
 * usando thumbnail padronizado de 500px (seguro contra 429 e restrições de tamanho).
 */
async function fetchCommonsLifeRestorations(genusName) {
  try {
    const queries = [
      `${genusName} life restoration`,
      `${genusName} paleoart`,
      `${genusName} reconstruction`
    ];
    const results = [];
    const seen = new Set();

    for (const q of queries) {
      const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=6&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=500&format=json&origin=*`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      const pages = data.query?.pages || {};

      for (const page of Object.values(pages)) {
        const info = page.imageinfo && page.imageinfo[0];
        const thumbUrl = info?.thumburl || (info?.responsiveUrls && info.responsiveUrls['2']);
        if (thumbUrl && !seen.has(thumbUrl)) {
          seen.add(thumbUrl);
          const desc = info.extmetadata?.ObjectName?.value || info.extmetadata?.ImageDescription?.value || page.title.replace('File:', '');
          const cleanDesc = desc.replace(/<[^>]*>?/gm, '').replace(/_/g, ' ').substring(0, 100);
          results.push({
            url: thumbUrl,
            caption: cleanDesc || `Reconstituição paleoartística em vida de ${genusName}`
          });
        }
      }
      if (results.length >= 3) break;
    }
    return results;
  } catch (err) {
    console.warn('Erro ao consultar Commons:', err);
    return [];
  }
}

/**
 * Minera a melhor representação visual em vida (paleoarte colorida)
 * a partir da lista de mídias da Wikipedia ou Commons.
 */
function extractBestLifeRestoration(mediaItems, genusName) {
  if (!mediaItems || mediaItems.length === 0) return null;

  let bestCandidate = null;
  let highestScore = -999;

  for (const item of mediaItems) {
    if (item.type !== 'image') continue;

    const title = (item.title || '').toLowerCase();
    const caption = (item.caption?.text || '').toLowerCase();
    const srcs = item.srcset || [];
    if (srcs.length === 0) continue;

    let score = 0;

    // Pontuação forte para Representações em Vida (Paleoarte)
    if (title.includes('restoration') || caption.includes('restoration')) score += 20;
    if (title.includes('reconstruction') || caption.includes('reconstruction')) score += 18;
    if (title.includes('life') || caption.includes('life')) score += 15;
    if (title.includes('paleoart') || caption.includes('paleoart')) score += 15;
    if (title.includes('profile') || caption.includes('profile')) score += 8;
    if (title.includes('model') || caption.includes('model')) score += 6;
    if (title.includes('in life') || caption.includes('in life') || caption.includes('em vida')) score += 20;

    // Penalizações para fósseis, ossos isolados, diagramas e mapas
    if (title.includes('skelet') || caption.includes('skelet')) score -= 12;
    if (title.includes('skull') || caption.includes('skull')) score -= 10;
    if (title.includes('fossil') || caption.includes('fossil')) score -= 12;
    if (title.includes('bone') || caption.includes('bone')) score -= 14;
    if (title.includes('teeth') || caption.includes('teeth')) score -= 14;
    if (title.includes('diagram') || title.includes('chart') || title.includes('map') || title.includes('cladogram')) score -= 30;
    if (title.includes('.svg') && !title.includes('life')) score -= 5;

    if (score > highestScore) {
      highestScore = score;
      let chosenSrc = srcs.find(s => s.src.includes('/500px-') || s.src.includes('/320px-')) || srcs[0];
      let url = chosenSrc.src;
      if (url.startsWith('//')) url = 'https:' + url;

      const cleanCaption = item.caption?.text || item.title?.replace('File:', '').replace(/_/g, ' ') || `Representação paleoartística de ${genusName}`;
      bestCandidate = {
        url: url,
        caption: cleanCaption
      };
    }
  }

  return bestCandidate;
}

/**
 * Normaliza classificação do período a partir de dados geológicos da PBDB
 */
function deducePeriodFromPBDB(tei = '', tli = '') {
  const str = `${tei} ${tli}`.toLowerCase();
  if (str.includes('trias') || str.includes('triáss') || str.includes('carnian') || str.includes('norian') || str.includes('rhaetian') || str.includes('ladinian') || str.includes('anisian')) {
    return { key: 'Triassic', name: 'Triássico' };
  }
  if (str.includes('juras') || str.includes('juráss') || str.includes('oxfordian') || str.includes('kimmeridgian') || str.includes('tithonian') || str.includes('callovian') || str.includes('bathonian') || str.includes('bajocian') || str.includes('toarcian')) {
    return { key: 'Jurassic', name: 'Jurássico' };
  }
  return { key: 'Cretaceous', name: 'Cretáceo' };
}

/**
 * Deduz o grupo/habitat a partir da taxonomia
 */
function deduceGroupFromTaxon(taxon) {
  const t = JSON.stringify(taxon || {}).toLowerCase();
  if (t.includes('pterosaur') || t.includes('pterodactyl')) {
    return { group: 'pterossauro', name: 'Pterossauro Aéreo' };
  }
  if (t.includes('plesiosaur') || t.includes('mosasaur') || t.includes('ichthyosaur') || t.includes('sauropterygia')) {
    return { group: 'reptil-marinho', name: 'Réptil Marinho' };
  }
  return { group: 'dinossauro', name: 'Dinossauro Mesozoico' };
}

/**
 * INGESTÃO AUTOMÁTICA DE QUALQUER ESPÉCIME
 * Consulta Commons Action API, PBDB, Wikipedia PT/EN e Media-List para minerar representações visuais em vida.
 */
async function ingestAnySpecimen(rawQuery) {
  const inputQuery = rawQuery.trim();
  if (!inputQuery) return null;

  // Normaliza nome comum em português para o gênero taxonômico científico
  const query = GENUS_NAME_MAP[inputQuery.toLowerCase()] || inputQuery;

  // 1. Verifica se já existe no catálogo carregado
  const existing = activeCatalog.find(c => 
    c.name.toLowerCase() === query.toLowerCase() || 
    c.name.toLowerCase() === inputQuery.toLowerCase() ||
    (c.commonName && c.commonName.toLowerCase().includes(inputQuery.toLowerCase()))
  );
  if (existing) {
    showToast(`O espécime "${existing.name}" já está no catálogo!`, '🦕');
    periodFilter.value = 'all';
    groupFilter.value = 'all';
    dietFilter.value = 'all';
    renderAllCards(activeCatalog.filter(c => c.name.toLowerCase() === existing.name.toLowerCase()));
    highlightExistingCard(existing.name);
    return existing;
  }

  showToast(`Escavando e minerando reconstituição em vida de "${query}"...`, '⛏️');
  loading.classList.remove('hidden');
  loadingMessage.textContent = `Buscando paleoarte e registros fósseis de ${query}...`;

  try {
    // 2. Consulta paralela: Commons Action API (garante foto 500px), PBDB Taxon, Wikipedia PT/EN e Media List
    const [commonsImgs, pbdbRes, wikiPtRes, wikiEnRes, mediaListRes] = await Promise.allSettled([
      fetchCommonsLifeRestorations(query),
      fetch(`https://paleobiodb.org/data1.2/taxa/single.json?name=${encodeURIComponent(query)}&show=attr,app`),
      fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`),
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`),
      fetch(`https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(query)}`)
    ]);

    let taxon = null;
    if (pbdbRes.status === 'fulfilled' && pbdbRes.value.ok) {
      const data = await pbdbRes.value.json();
      taxon = data.records && data.records[0] ? data.records[0] : null;
    }

    let wikiData = null;
    if (wikiPtRes.status === 'fulfilled' && wikiPtRes.value.ok) {
      wikiData = await wikiPtRes.value.json();
    }
    if ((!wikiData || !wikiData.extract) && wikiEnRes.status === 'fulfilled' && wikiEnRes.value.ok) {
      wikiData = await wikiEnRes.value.json();
    }

    let mediaItems = [];
    if (mediaListRes.status === 'fulfilled' && mediaListRes.value.ok) {
      const mediaJson = await mediaListRes.value.json();
      mediaItems = mediaJson.items || [];
    }

    const verifiedCommons = commonsImgs.status === 'fulfilled' ? commonsImgs.value : [];

    if (!wikiData && !taxon && verifiedCommons.length === 0) {
      loading.classList.add('hidden');
      showToast(`Gênero "${inputQuery}" não encontrado na PBDB ou enciclopédia. Verifique a grafia.`, '⚠️');
      return null;
    }

    // 3. Mineração e ranking da galeria de representações visuais em vida
    const gallery = [];
    const seenUrls = new Set();

    // Prioridade 1: Imagens de Paleoarte mineradas da Commons Action API (garantidas 500px)
    verifiedCommons.forEach(img => {
      if (!seenUrls.has(img.url)) {
        seenUrls.add(img.url);
        gallery.push(img);
      }
    });

    // Prioridade 2: Melhor restauração em vida da Media-List da Wikipedia
    const bestLifeRestoration = extractBestLifeRestoration(mediaItems, query);
    if (bestLifeRestoration && !seenUrls.has(bestLifeRestoration.url)) {
      seenUrls.add(bestLifeRestoration.url);
      gallery.unshift(bestLifeRestoration);
    }

    // Prioridade 3: Thumbnail da página da Wikipedia
    const wikiThumb = wikiData?.thumbnail?.source;
    if (wikiThumb && !seenUrls.has(wikiThumb)) {
      seenUrls.add(wikiThumb);
      gallery.push({
        url: wikiThumb,
        caption: `Representação visual de ${wikiData?.title || query}`
      });
    }

    // Prioridade 4: Se ainda não tiver imagem, adiciona o placeholder resiliente
    if (gallery.length === 0) {
      gallery.push({
        url: PLACEHOLDER_IMAGE,
        caption: `Representação visual de ${wikiData?.title || query}`
      });
    }

    // 4. Dedução de metadados geológicos e ecológicos
    const periodData = deducePeriodFromPBDB(taxon?.tei, taxon?.tli);
    const groupData = deduceGroupFromTaxon(taxon);
    const periodName = taxon?.tei ? `${periodData.name} (${taxon.tei} ${taxon.tli && taxon.tli !== taxon.tei ? `a ${taxon.tli}` : ''})` : `Era Mesozoica (${periodData.name})`;

    const newSpecimen = {
      name: taxon?.nam || wikiData?.title || query,
      species: `${taxon?.nam || query} sp.`,
      commonName: wikiData?.title || query,
      etymology: `Gênero catalogado no registro internacional da Paleobiology Database (Rank: ${taxon?.rnk || 'gênero'})`,
      periodKey: periodData.key,
      periodName: periodName,
      group: groupData.group,
      groupName: groupData.name,
      diet: 'carnivoro',
      dietName: 'Carnívoro / Em estudo',
      length: 'Consulte registros osteológicos',
      height: 'Variável por espécime',
      weight: 'Estimativa alométrica em análise',
      speed: 'Em estudo biomecânico',
      biteForce: 'Em modelagem computacional',
      location: 'Sítios fósseis mundiais (ver mapa integrado)',
      bio: wikiData?.extract || 'Espécime fóssil catalogado com ocorrências registradas na literatura científica.',
      curiosities: [
        `Gênero validado cientificamente com registros oficiais na Paleobiology Database.`,
        `Possui coordenadas georreferenciadas mapeadas mundialmente por paleontólogos.`,
        `Representação artística em vida minerada diretamente dos arquivos científicos abertos.`
      ],
      expertData: {
        cladogram: [
          'Dinosauria (Owen, 1842)',
          `└── ${groupData.name}`,
          `    └── ${taxon?.nam || query} (Registro PBDB Oficial)`
        ],
        osteology: `<p>Morfologia osteológica documentada no registro PBDB sob o espécime tipo de ${taxon?.nam || query}.</p>`,
        biomechanics: '<p>Cinemática e resistência mecânica craniana sob modelagem de elementos finitos.</p>',
        histology: '<p>Tafonomia e datação estratigráfica compatíveis com os estratos fossilíferos do período.</p>'
      },
      gallery: gallery,
      isAutoIngested: true
    };

    // 5. Adiciona ao catálogo e exibe na tela
    activeCatalog.unshift(newSpecimen);
    saveCatalogToLocalStorage();
    loading.classList.add('hidden');
    periodFilter.value = 'all';
    groupFilter.value = 'all';
    dietFilter.value = 'all';
    renderAllCards(activeCatalog.filter(c => c.name.toLowerCase() === newSpecimen.name.toLowerCase()));
    highlightExistingCard(newSpecimen.name);

    showToast(`"${newSpecimen.name}" subido e catalogado com sucesso!`, '🦖');
    return newSpecimen;
  } catch (error) {
    console.error('Erro na ingestão automática do espécime:', error);
    loading.classList.add('hidden');
    showToast(`Falha ao ingerir "${query}". Tente novamente.`, '❌');
    return null;
  }
}

/**
 * Autodescoberta em massa na PBDB por Grupo e Intervalo
 */
async function autoDiscoverPBDB(groupName, intervalName) {
  showToast(`Descobrindo novos gêneros de ${groupName} (${intervalName}) na PBDB...`, '⚡');
  loading.classList.remove('hidden');
  loadingMessage.textContent = `Consultando base taxonômica da PBDB para ${groupName}...`;

  try {
    const url = `https://paleobiodb.org/data1.2/taxa/list.json?base_name=${encodeURIComponent(groupName)}&interval=${encodeURIComponent(intervalName)}&rank=genus&show=attr&limit=8`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha na resposta da PBDB');
    const data = await res.json();
    const records = data.records || [];

    let addedCount = 0;
    for (const rec of records) {
      if (rec.nam && !activeCatalog.some(c => c.name.toLowerCase() === rec.nam.toLowerCase())) {
        await ingestAnySpecimen(rec.nam);
        addedCount++;
        if (addedCount >= 3) break;
      }
    }

    loading.classList.add('hidden');
    if (addedCount === 0) {
      showToast(`Gêneros retornados já estavam no acervo. Experimente o botão aleatório!`, 'ℹ️');
    }
  } catch (err) {
    console.error('Erro na autodescoberta:', err);
    loading.classList.add('hidden');
    showToast('Não foi possível conectar à PBDB no momento.', '⚠️');
  }
}

/**
 * Sorteia e ingere um gênero mesozoico aleatório
 */
async function discoverRandomSpecimen() {
  const uncataloged = FAMOUS_MESOZOIC_GENERA.filter(
    g => !activeCatalog.some(c => c.name.toLowerCase() === g.toLowerCase())
  );

  const genusToIngest = uncataloged.length > 0
    ? uncataloged[Math.floor(Math.random() * uncataloged.length)]
    : FAMOUS_MESOZOIC_GENERA[Math.floor(Math.random() * FAMOUS_MESOZOIC_GENERA.length)];

  await ingestAnySpecimen(genusToIngest);
}

// ==========================================================================
// BUSCA E FILTROS INTELIGENTES NO ACERVO
// ==========================================================================

/**
 * Pesquisa no acervo por nome científico, nome popular em português, espécie, grupo ou dieta
 */
function searchCatalog(query) {
  const q = query.trim().toLowerCase();
  if (!q) return activeCatalog;
  const mapped = GENUS_NAME_MAP[q] || q;

  return activeCatalog.filter(c => {
    const n = c.name.toLowerCase();
    const cn = (c.commonName || '').toLowerCase();
    const sp = (c.species || '').toLowerCase();
    const grp = (c.groupName || '').toLowerCase();
    const grpKey = (c.group || '').toLowerCase();
    const dt = (c.dietName || '').toLowerCase();
    const dtKey = (c.diet || '').toLowerCase();
    const per = (c.periodName || '').toLowerCase();
    const perKey = (c.periodKey || '').toLowerCase();

    return n.includes(q) || n.includes(mapped.toLowerCase()) ||
           cn.includes(q) || sp.includes(q) ||
           grp.includes(q) || grpKey.includes(q) ||
           dt.includes(q) || dtKey.includes(q) ||
           per.includes(q) || perKey.includes(q);
  });
}

/**
 * Handler central do buscador principal
 */
async function handleMainSearch(forceIngest = false) {
  const rawQuery = searchInput.value.trim();
  if (!rawQuery) {
    renderAllCards(activeCatalog);
    return;
  }

  // 1. Procura primeiro no catálogo já carregado
  const matches = searchCatalog(rawQuery);
  if (matches.length > 0 && !forceIngest) {
    periodFilter.value = 'all';
    groupFilter.value = 'all';
    dietFilter.value = 'all';
    renderAllCards(matches);
    highlightExistingCard(matches[0].name);
    showToast(`Encontrado: ${matches[0].name} (${matches.length} resultado(s))`, '🔍');
    return;
  }

  // 2. Não encontrado ou forçado: Ingerir novo espécime automaticamente!
  const mapped = GENUS_NAME_MAP[rawQuery.toLowerCase()] || rawQuery;
  const newSpecimen = await ingestAnySpecimen(mapped);
  if (newSpecimen) {
    periodFilter.value = 'all';
    groupFilter.value = 'all';
    dietFilter.value = 'all';
    renderAllCards(activeCatalog.filter(c => c.name.toLowerCase() === newSpecimen.name.toLowerCase()));
    highlightExistingCard(newSpecimen.name);
  }
}

// ==========================================================================
// PERSISTÊNCIA LOCAL (LOCALSTORAGE)
// ==========================================================================

function saveCatalogToLocalStorage() {
  try {
    const customOnly = activeCatalog.filter(c => c.isAutoIngested);
    localStorage.setItem('mesozoic_custom_catalog_v2', JSON.stringify(customOnly));
  } catch (e) {
    console.warn('Falha ao salvar no localStorage:', e);
  }
}

function loadCatalogFromLocalStorage() {
  activeCatalog = [...BASE_PALEONTOLOGY_DATABASE];
  try {
    const saved = localStorage.getItem('mesozoic_custom_catalog_v2') || localStorage.getItem('mesozoic_custom_catalog');
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.forEach(item => {
        const hasValidImage = item.gallery && item.gallery.length > 0 && item.gallery[0].url && !item.gallery[0].url.startsWith('data:image/svg+xml');
        if (hasValidImage && !activeCatalog.some(c => c.name.toLowerCase() === item.name.toLowerCase())) {
          activeCatalog.unshift(item);
        }
      });
    }
  } catch (e) {
    console.warn('Falha ao ler localStorage:', e);
  }
}

// ==========================================================================
// RENDERIZAÇÃO DOS CARDS COM MULTI-FALLBACK DE IMAGENS
// ==========================================================================

function renderCard(item) {
  const card = document.createElement('article');
  card.className = 'card';
  const cleanId = item.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  card.id = `card-${cleanId}`;
  const badgeClass = getPeriodBadgeClass(item.periodKey);

  const galleryUrls = (item.gallery || []).map(g => g.url).filter(Boolean);
  const featuredImage = galleryUrls[0] || PLACEHOLDER_IMAGE;
  const fallbacksJson = JSON.stringify(galleryUrls.slice(1)).replace(/"/g, '&quot;');
  const imageCount = galleryUrls.length;

  card.innerHTML = `
    <div class="card-image-wrap" title="Clique para abrir a Wiki do ${item.name}">
      <img src="${featuredImage}" alt="${item.name}" loading="lazy" referrerpolicy="no-referrer" data-img-index="0" data-fallbacks="${fallbacksJson}" onerror="window.handleImageFallback(this)">
      <span class="card-floating-badge ${badgeClass}">${item.periodName.split(' ')[0]}</span>
      <span class="card-image-hint">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        ${imageCount} fotos
      </span>
    </div>

    <div class="card-content">
      <div class="card-title-row">
        <h3 class="card-title">${item.name}</h3>
        <span class="card-rank">${item.groupName}</span>
      </div>
      
      <div class="card-meta-chips">
        <span class="chip">🍖 ${item.dietName}</span>
        <span class="chip">⏳ ${item.periodName.split('(')[0]}</span>
      </div>

      <!-- Linha do Modo Especialista -->
      <div class="card-expert-row">
        🔬 <strong>Mordida:</strong> ${item.biteForce} | <strong>Velocidade:</strong> ${item.speed}
      </div>

      <p class="card-desc">${item.bio}</p>

      <div class="card-actions">
        <button class="btn-card-dossier" data-creature="${item.name}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          Abrir Wiki & Fotos
        </button>

        <button class="btn-card-map" data-creature="${item.name}">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
            <line x1="8" y1="2" x2="8" y2="18"></line>
            <line x1="16" y1="6" x2="16" y2="22"></line>
          </svg>
          Mapa Fóssil
        </button>
      </div>
    </div>
  `;

  // Listeners
  const openWiki = () => openWikiModal(item);
  card.querySelector('.card-image-wrap').addEventListener('click', openWiki);
  card.querySelector('.card-title').addEventListener('click', openWiki);
  card.querySelector('.btn-card-dossier').addEventListener('click', openWiki);

  card.querySelector('.btn-card-map').addEventListener('click', (e) => {
    e.stopPropagation();
    openWikiModal(item);
    switchWikiTab('tab-map');
  });

  return card;
}

function renderAllCards(creatureList) {
  resultsContainer.innerHTML = '';

  const selectedPeriod = periodFilter.value;
  const selectedGroup = groupFilter.value;
  const selectedDiet = dietFilter.value;

  let renderedCount = 0;

  creatureList.forEach(item => {
    const matchesPeriod = selectedPeriod === 'all' || item.periodKey.toLowerCase() === selectedPeriod.toLowerCase();
    const matchesGroup = selectedGroup === 'all' || item.group === selectedGroup;
    const matchesDiet = selectedDiet === 'all' || item.diet === selectedDiet || (selectedDiet === 'carnivoro' && item.diet.includes('carnivoro'));

    if (matchesPeriod && matchesGroup && matchesDiet) {
      const cardEl = renderCard(item);
      resultsContainer.appendChild(cardEl);
      renderedCount++;
    }
  });

  if (renderedCount === 0) {
    emptyState.classList.remove('hidden');
    resultsStats.textContent = 'Nenhum espécime correspondente aos filtros atuais.';
  } else {
    emptyState.classList.add('hidden');
    resultsStats.textContent = `Exibindo ${renderedCount} ser(es) da Era Mesozoica no acervo`;
  }
}

function highlightExistingCard(name) {
  const cleanId = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const card = document.getElementById(`card-${cleanId}`);
  if (card) {
    card.classList.add('card-just-added');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => card.classList.remove('card-just-added'), 3000);
  }
}

function getPeriodBadgeClass(periodKey) {
  switch (periodKey) {
    case 'Triassic': return 'period-triassic';
    case 'Jurassic': return 'period-jurassic';
    case 'Cretaceous': return 'period-cretaceous';
    default: return 'period-mesozoic';
  }
}

// ==========================================================================
// WIKI INTERATIVA PROPRIA COM ABAS E MODO ESPECIALISTA
// ==========================================================================

function openWikiModal(creature) {
  currentCreature = creature;
  currentGallery = creature.gallery && creature.gallery.length > 0 ? creature.gallery : [{ url: PLACEHOLDER_IMAGE, caption: 'Sem imagem adicional' }];
  currentImageIndex = 0;

  // Cabeçalho
  wikiTitle.textContent = creature.species || creature.name;
  wikiEtymology.textContent = creature.etymology || 'Espécime da Era Mesozoica';
  wikiPeriodBadge.className = `card-floating-badge ${getPeriodBadgeClass(creature.periodKey)}`;
  wikiPeriodBadge.textContent = creature.periodName;
  wikiGroupBadge.textContent = `🏛️ ${creature.groupName}`;
  wikiDietBadge.textContent = `🍖 ${creature.dietName}`;

  modalExpertToggle.checked = isExpertMode;

  // Aba 1: Dossiê Geral
  specLength.textContent = creature.length || '-';
  specHeight.textContent = creature.height || '-';
  specWeight.textContent = creature.weight || '-';
  specSpeed.textContent = creature.speed || '-';
  specBiteForce.textContent = creature.biteForce || '-';
  specPeriod.textContent = creature.periodName || '-';
  wikiBioText.textContent = creature.bio || 'Dados paleontológicos sob contínua revisão científica.';

  // Curiosidades
  wikiCuriositiesList.innerHTML = '';
  if (creature.curiosities && creature.curiosities.length > 0) {
    creature.curiosities.forEach(curiosity => {
      const li = document.createElement('li');
      li.textContent = curiosity;
      wikiCuriositiesList.appendChild(li);
    });
  }

  // Miniaturas
  renderGalleryThumbnails();

  // Aba 2: Modo Especialista
  renderExpertTab(creature);

  // Aba 3: Galeria
  renderFullGalleryGrid(currentGallery);
  btnSearchGoogleImages.href = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(creature.name + ' life restoration paleoart')}`;
  webImageSearchInput.value = '';

  // Aba inicial
  switchWikiTab(isExpertMode ? 'tab-expert' : 'tab-overview');

  wikiModal.classList.remove('hidden');
}

function renderGalleryThumbnails() {
  galleryCount.textContent = currentGallery.length;
  wikiGalleryThumbs.innerHTML = '';
  updateFeaturedImage(0);

  currentGallery.forEach((item, index) => {
    const thumb = document.createElement('div');
    thumb.className = `thumb-item ${index === 0 ? 'active' : ''}`;
    thumb.innerHTML = `<img src="${item.url}" alt="${item.caption}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='${PLACEHOLDER_IMAGE}';">`;
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      updateFeaturedImage(index);
    });
    wikiGalleryThumbs.appendChild(thumb);
  });
}

function updateFeaturedImage(index) {
  currentImageIndex = index;
  const item = currentGallery[index] || { url: PLACEHOLDER_IMAGE, caption: 'Representação em vida' };
  wikiFeaturedImg.src = item.url;
  wikiFeaturedImg.onerror = () => { wikiFeaturedImg.onerror = null; wikiFeaturedImg.src = PLACEHOLDER_IMAGE; };
  wikiFeaturedCaption.textContent = item.caption || 'Representação paleoartística em vida';
}

function renderExpertTab(creature) {
  const expert = creature.expertData || {};

  expertCladogram.innerHTML = '';
  if (expert.cladogram && expert.cladogram.length > 0) {
    expert.cladogram.forEach((line, idx) => {
      const node = document.createElement('div');
      node.className = `cladogram-node cladogram-level-${Math.min(idx + 1, 4)}`;
      node.textContent = line;
      expertCladogram.appendChild(node);
    });
  } else {
    expertCladogram.textContent = 'Cladograma sob revisão filogenética.';
  }

  expertOsteology.innerHTML = expert.osteology || '<p>Morfologia osteológica catalogada na literatura científica.</p>';
  expertBiomechanics.innerHTML = expert.biomechanics || '<p>Modelagem biomecânica de forças sob análise computacional.</p>';
  expertHistology.innerHTML = expert.histology || '<p>Dados histológicos e taxas de crescimento com amostragem fóssil em andamento.</p>';
}

function renderFullGalleryGrid(images) {
  fullGalleryGrid.innerHTML = '';
  images.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.innerHTML = `
      <img src="${item.url}" alt="${item.caption}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='${PLACEHOLDER_IMAGE}';">
      <div class="gallery-card-caption">${item.caption}</div>
    `;
    card.addEventListener('click', () => openLightbox(index));
    fullGalleryGrid.appendChild(card);
  });
}

function switchWikiTab(targetTabId) {
  wikiTabs.forEach(tab => {
    tab.classList.toggle('active', tab.getAttribute('data-tab') === targetTabId);
  });
  wikiTabContents.forEach(content => {
    content.classList.toggle('active', content.id === targetTabId);
  });

  if (targetTabId === 'tab-map' && currentCreature) {
    initOrUpdateIntegratedMap(currentCreature.name);
  }
}

function closeWikiModal() {
  wikiModal.classList.add('hidden');
}

function setExpertMode(enabled) {
  isExpertMode = enabled;
  globalExpertToggle.checked = enabled;
  modalExpertToggle.checked = enabled;
  document.body.classList.toggle('expert-mode-active', enabled);
  btnToggleExpertInFooter.textContent = enabled ? 'Desativar Modo Especialista' : 'Ativar Modo Especialista';
}

// ==========================================================================
// BUSCA INTERATIVA DE IMAGENS NA WEB (COMMONS ACTION API COM IIURLWIDTH=500)
// ==========================================================================

async function searchWebImages(keyword) {
  if (!currentCreature) return;
  webImagesLoading.classList.remove('hidden');

  try {
    const searchTerm = `${currentCreature.name} ${keyword || 'life restoration'}`.trim();
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchTerm)}&gsrnamespace=6&gsrlimit=16&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=500&format=json&origin=*`;
    
    const res = await fetch(url);
    const data = res.ok ? await res.json() : null;
    webImagesLoading.classList.add('hidden');

    const newImages = [];
    if (data?.query?.pages) {
      Object.values(data.query.pages).forEach(page => {
        const info = page.imageinfo && page.imageinfo[0];
        if (info) {
          const safeUrl = info.thumburl || (info.responsiveUrls && info.responsiveUrls['2']) || info.url;
          if (safeUrl) {
            const desc = info.extmetadata?.ObjectName?.value || info.extmetadata?.ImageDescription?.value || page.title.replace('File:', '');
            const cleanDesc = desc.replace(/<[^>]*>?/gm, '').replace(/_/g, ' ').substring(0, 120);
            newImages.push({
              url: safeUrl,
              caption: cleanDesc || `Reconstituição paleoartística de ${currentCreature.name}`
            });
          }
        }
      });
    }

    if (newImages.length > 0) {
      renderFullGalleryGrid(newImages);
      currentGallery = newImages;
    } else {
      fullGalleryGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 2rem;">Nenhuma paleoarte encontrada para "${keyword}". Clique no botão acima para abrir o Google Imagens.</p>`;
    }
  } catch (err) {
    console.warn('Erro na busca de imagens:', err);
    webImagesLoading.classList.add('hidden');
  }
}

function anyImageExtension(url) {
  const l = url.toLowerCase();
  return l.endsWith('.png') || l.endsWith('.jpg') || l.endsWith('.jpeg') || l.endsWith('.webp');
}

// ==========================================================================
// MAPA LEAFLET INTEGRADO À WIKI (PBDB)
// ==========================================================================

async function initOrUpdateIntegratedMap(creatureName) {
  integratedMapSubtitle.textContent = `Consultando sítios de escavação na Paleobiology Database para "${creatureName}"...`;
  integratedMapCount.textContent = 'Carregando...';
  integratedMapLoading.classList.remove('hidden');

  if (!leafletMap) {
    leafletMap = L.map('integratedFossilMap').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | PBDB',
      maxZoom: 18
    }).addTo(leafletMap);
    leafletMarkersLayer = L.layerGroup().addTo(leafletMap);
  } else {
    leafletMarkersLayer.clearLayers();
    leafletMap.setView([20, 0], 2);
  }

  setTimeout(() => leafletMap.invalidateSize(), 150);

  try {
    const url = `https://paleobiodb.org/data1.2/occs/list.json?base_name=${encodeURIComponent(creatureName)}&show=coords,loc&limit=80`;
    const res = await fetch(url);
    const data = res.ok ? await res.json() : { records: [] };
    const occurrences = data.records || [];

    integratedMapLoading.classList.add('hidden');

    if (occurrences.length === 0) {
      integratedMapSubtitle.textContent = `Nenhum sítio georreferenciado aberto retornado na PBDB para "${creatureName}".`;
      integratedMapCount.textContent = '0 locais';
      return;
    }

    integratedMapSubtitle.textContent = `Sítios fósseis georreferenciados catalogados pela Paleobiology Database:`;
    integratedMapCount.textContent = `${occurrences.length} ocorrências mapeadas`;

    const bounds = [];

    occurrences.forEach(occ => {
      if (occ.lat && occ.lng) {
        const lat = parseFloat(occ.lat);
        const lng = parseFloat(occ.lng);
        bounds.push([lat, lng]);

        const markerColor = '#e67e22';
        const markerHtml = `
          <div style="background-color: ${markerColor}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 0 8px rgba(0,0,0,0.6);"></div>
        `;

        const customIcon = L.divIcon({
          className: 'custom-fossil-pin',
          html: markerHtml,
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });

        const marker = L.marker([lat, lng], { icon: customIcon });
        marker.bindPopup(`
          <div style="font-family: inherit; color: #1a1d1a; padding: 4px; max-width: 240px;">
            <strong style="color: #2e7d32; font-size: 1.05rem;">⛏️ ${occ.tna || creatureName}</strong><br>
            <span style="font-size: 0.85rem; color: #555;">📍 <strong>Local:</strong> ${occ.cc || ''} ${occ.stp || ''} (${occ.cny || 'Estrato fóssil'})</span><br>
            <span style="font-size: 0.85rem; color: #555;">⏳ <strong>Idade Geológica:</strong> ${occ.eag || ''} a ${occ.lag || ''} Ma</span><br>
            <small style="color: #888;">Registro PBDB # ${occ.oid || 'N/A'}</small>
          </div>
        `);
        leafletMarkersLayer.addLayer(marker);
      }
    });

    if (bounds.length > 0) {
      leafletMap.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 });
    }
  } catch (err) {
    console.error('Erro ao plotar mapa na Wiki:', err);
    integratedMapLoading.classList.add('hidden');
    integratedMapSubtitle.textContent = 'Falha temporária ao conectar com os servidores da PBDB.';
  }
}

// ==========================================================================
// LIGHTBOX MODAL
// ==========================================================================

function openLightbox(index = 0) {
  if (!currentGallery || currentGallery.length === 0) return;
  currentImageIndex = index;
  showLightboxImage();
  lightboxModal.classList.remove('hidden');
}

function showLightboxImage() {
  const item = currentGallery[currentImageIndex];
  lightboxImg.src = item.url;
  lightboxImg.onerror = () => { lightboxImg.onerror = null; lightboxImg.src = PLACEHOLDER_IMAGE; };
  lightboxCaption.textContent = item.caption || 'Representação paleoartística em vida';
  lightboxCounter.textContent = `${currentImageIndex + 1} de ${currentGallery.length}`;
}

function nextLightboxImage() {
  currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
  showLightboxImage();
}

function prevLightboxImage() {
  currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
  showLightboxImage();
}

function closeLightbox() {
  lightboxModal.classList.add('hidden');
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================

function showToast(message, icon = '🦖') {
  if (!toastNotification) return;
  toastText.textContent = `${icon} ${message}`;
  toastNotification.classList.remove('hidden');
  toastNotification.classList.add('visible');

  clearTimeout(toastNotification._timer);
  toastNotification._timer = setTimeout(() => {
    toastNotification.classList.remove('visible');
    setTimeout(() => toastNotification.classList.add('hidden'), 300);
  }, 4000);
}

// ==========================================================================
// EVENT LISTENERS
// ==========================================================================

function setupEventListeners() {
  // Toggle Especialista
  globalExpertToggle.addEventListener('change', (e) => setExpertMode(e.target.checked));
  modalExpertToggle.addEventListener('change', (e) => setExpertMode(e.target.checked));
  btnToggleExpertInFooter.addEventListener('click', () => setExpertMode(!isExpertMode));

  // Abas da Wiki
  wikiTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchWikiTab(tab.getAttribute('data-tab'));
    });
  });

  // Busca e Filtro na Página
  searchBtn.addEventListener('click', () => handleMainSearch());

  // Botão explícito de Subir Qualquer Espécime
  btnAutoIngest.addEventListener('click', () => {
    const val = searchInput.value.trim();
    if (!val) {
      showToast('Digite o nome de qualquer gênero fóssil no campo antes de subir!', '💡');
      searchInput.focus();
    } else {
      handleMainSearch(true);
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleMainSearch();
    }
  });

  // Busca em tempo real ao digitar (2+ caracteres)
  searchInput.addEventListener('input', () => {
    const val = searchInput.value.trim();
    clearBtn.classList.toggle('hidden', !val);

    if (val.length >= 2) {
      const matches = searchCatalog(val);
      if (matches.length > 0) {
        renderAllCards(matches);
      }
    } else if (val.length === 0) {
      renderAllCards(activeCatalog);
    }
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.classList.add('hidden');
    searchInput.focus();
    renderAllCards(activeCatalog);
  });

  // Filtros dinâmicos
  [periodFilter, groupFilter, dietFilter].forEach(filter => {
    filter.addEventListener('change', () => {
      const query = searchInput.value.trim();
      const baseList = query ? searchCatalog(query) : activeCatalog;
      renderAllCards(baseList);
    });
  });

  resetFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.classList.add('hidden');
    periodFilter.value = 'all';
    groupFilter.value = 'all';
    dietFilter.value = 'all';
    quickTags.forEach(t => t.classList.remove('active'));
    renderAllCards(activeCatalog);
  });

  reloadSuggestionsBtn.addEventListener('click', () => resetFiltersBtn.click());

  // Chips de autodescoberta na PBDB
  btnRandomDino.addEventListener('click', discoverRandomSpecimen);

  discoveryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.getAttribute('data-group');
      const interval = btn.getAttribute('data-interval');
      autoDiscoverPBDB(group, interval);
    });
  });

  // Chips de espécimes famosos
  quickTags.forEach(tag => {
    tag.addEventListener('click', async () => {
      quickTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      const creatureName = tag.getAttribute('data-name');
      searchInput.value = creatureName;
      clearBtn.classList.remove('hidden');

      const mapped = GENUS_NAME_MAP[creatureName.toLowerCase()] || creatureName;
      const exists = activeCatalog.find(c => c.name.toLowerCase() === mapped.toLowerCase() || c.name.toLowerCase() === creatureName.toLowerCase());
      if (exists) {
        periodFilter.value = 'all';
        groupFilter.value = 'all';
        dietFilter.value = 'all';
        renderAllCards(activeCatalog.filter(c => c.name.toLowerCase() === exists.name.toLowerCase()));
        highlightExistingCard(exists.name);
        openWikiModal(exists);
      } else {
        const ingested = await ingestAnySpecimen(mapped);
        if (ingested) openWikiModal(ingested);
      }
    });
  });

  // Busca de Imagens na Web dentro da Wiki
  btnSearchWebImages.addEventListener('click', () => {
    searchWebImages(webImageSearchInput.value.trim());
  });

  webImageSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btnSearchWebImages.click();
  });

  imageSearchChips.forEach(chip => {
    chip.addEventListener('click', () => {
      imageSearchChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const term = chip.getAttribute('data-term');
      if (term === 'all') {
        renderFullGalleryGrid(currentCreature.gallery);
      } else {
        searchWebImages(term);
      }
    });
  });

  // Modais
  closeWikiBtn.addEventListener('click', closeWikiModal);
  btnCloseWikiFooter.addEventListener('click', closeWikiModal);
  wikiModalBackdrop.addEventListener('click', closeWikiModal);
  btnZoomFeatured.addEventListener('click', () => openLightbox(currentImageIndex));

  // Lightbox
  closeLightboxBtn.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  lightboxNextBtn.addEventListener('click', nextLightboxImage);
  lightboxPrevBtn.addEventListener('click', prevLightboxImage);

  // Teclado
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!lightboxModal.classList.contains('hidden')) {
        closeLightbox();
      } else if (!wikiModal.classList.contains('hidden')) {
        closeWikiModal();
      }
    } else if (!lightboxModal.classList.contains('hidden')) {
      if (e.key === 'ArrowRight') nextLightboxImage();
      if (e.key === 'ArrowLeft') prevLightboxImage();
    }
  });
}

// Inicialização
window.addEventListener('DOMContentLoaded', () => {
  loadCatalogFromLocalStorage();
  setupEventListeners();
  renderAllCards(activeCatalog);
});
