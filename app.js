/**
 * Enciclopédia Paleontológica da Era Mesozoica
 * Wiki própria com:
 * 1. Dossiê Científico Geral e Curiosidades
 * 2. Modo Especialista com Detalhes Complexos (Cladística, Osteologia, FEA e Histologia)
 * 3. Busca Interativa de Imagens na Web / Google Imagens
 * 4. Mapa Fóssil Mundial Georreferenciado (PBDB + Leaflet) Integrado
 * 5. Lightbox Pop-up de Imagens em Tela Cheia
 */

// ==========================================================================
// ELEMENTOS DO DOM
// ==========================================================================
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const periodFilter = document.getElementById('periodFilter');
const groupFilter = document.getElementById('groupFilter');
const dietFilter = document.getElementById('dietFilter');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const reloadSuggestionsBtn = document.getElementById('reloadSuggestionsBtn');
const resultsContainer = document.getElementById('results');
const loading = document.getElementById('loading');
const emptyState = document.getElementById('emptyState');
const resultsStats = document.getElementById('resultsStats');
const quickTags = document.querySelectorAll('.tag-chip');

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

// Estado interno
let isExpertMode = false;
let currentCreature = null;
let currentGallery = [];
let currentImageIndex = 0;
let leafletMap = null;
let leafletMarkersLayer = null;

// Placeholder resiliente
const PLACEHOLDER_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22260%22%20viewBox%3D%220%200%20400%20260%22%3E%3Crect%20fill%3D%22%23121712%22%20width%3D%22400%22%20height%3D%22260%22%2F%3E%3Ctext%20fill%3D%22%234ade80%22%20font-family%3D%22system-ui%22%20font-size%3D%2246%22%20x%3D%2250%25%22%20y%3D%2245%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3E%F0%9F%A6%95%3C%2Ftext%3E%3Ctext%20fill%3D%22%238fa38f%22%20font-family%3D%22system-ui%22%20font-size%3D%2214%22%20x%3D%2250%25%22%20y%3D%2268%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3ERegistro%20Paleontol%C3%B3gico%3C%2Ftext%3E%3C%2Fsvg%3E";

// ==========================================================================
// ACERVO CIENTÍFICO COM DOSSIÊ GERAL E DETALHES COMPLEXOS (MODO ESPECIALISTA)
// ==========================================================================
const PALEONTOLOGY_DATABASE = [
  {
    name: 'Tyrannosaurus',
    species: 'Tyrannosaurus rex',
    commonName: 'Tiranossauro Rex',
    etymology: 'Do grego: τύραννος (tyrannos, "tirano") + σαῦρος (sauros, "lagarto") + rex ("rei") • Descrito em 1905 por Henry Fairfield Osborn',
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
    bio: 'O Tyrannosaurus rex é o ápice evolutivo dos terópodes predadores da Laurasia. Possuía visão binocular ampla (campo estereoscópico de 55°, superando o do falcão moderno), olfato hiperdesenvolvido com bulbos olfativos avantajados e ossos nasais fusionados em abóbada para absorver o impacto das mordidas mastodônticas. Sua dentição heterodonte apresentava dentes com secção em "D" na frente e lâminas em formato de banana de até 30 cm de comprimento com raízes.',
    curiosities: [
      'Análises de coprólitos (fezes fossilizadas) provam que o T-Rex esmagava e digeria ossos inteiros de Triceratops e Edmontosaurus.',
      'O maior espécime com massa estimada é "Scotty" (RSM P2523.8), descoberto no Canadá, com peso calculado em cerca de 8.870 kg.',
      'Apesar de seus membros anteriores terem apenas dois dedos funcionais, o osso úmero era extremamente espesso e suportava cargas de mais de 200 kg.',
      'Marcas de cicatrização no crânio indicam que os tiranossauros adultos mordiam a face uns dos outros em disputas territoriais e de acasalamento.'
    ],
    // DADOS DO MODO ESPECIALISTA
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
      osteology: `
        <p><span class="expert-metric-badge">Crânio:</span> Diapsida arquossauriano com fenestras antorbitais ampliadas para alívio de massa. Ossos nasais e frontais com sinostose precoce, impedindo torção durante a estocada predatória.</p>
        <p><span class="expert-metric-badge">Esqueleto Axial:</span> 10 vértebras cervicais opistocélicas com forte curvatura em "S", reforçadas pelo músculo complexus. Sistema pneumático pulmonar com divertículos invadindo vértebras e costelas cervicodorsais (homólogo às aves).</p>
        <p><span class="expert-metric-badge">Membros:</span> Redução dos carpais e metacarpos I e II funcionais; metacarpo III atrofiado como vestígio ósseo sem falange. Pelve com bota púbica hipertrofiada servindo de ancoragem para os músculos puboisquiofemorais.</p>
      `,
      biomechanics: `
        <p><span class="expert-metric-badge">Análise FEA (Elementos Finitos):</span> O palato secundário e o arco jugal rígido distribuem as tensões de compressão diretamente para o neurocrânio, gerando uma pressão de contato na ponta dental superior a 430 MPa (suficiente para pulverizar esmalte e osso cortical).</p>
        <p><span class="expert-metric-badge">Locomoção & Dinâmica:</span> Centro de massa localizado ligeiramente anterior à articulação acetabular (~0,35 m). O músculo caudofemoralis longus massivo ancorava no quarto trocânter do fêmur. Modelagens biomecânicas indicam que o estresse ósseo nos ossos metatarsais impedia corridas verdadeiras acima de 28 km/h, favorecendo uma marcha rápida e eficiente de passadas largas.</p>
      `,
      histology: `
        <p><span class="expert-metric-badge">LAGs (Linhas de Parada de Crescimento):</span> A análise histológica de fêmures e tíbias (Erickson et al.) revela que o T-Rex atingia a maturidade esquelética aos 28–30 anos. A fase exponencial de crescimento ("adolescência") ocorria entre 14 e 18 anos, quando o animal ganhava até 2,1 kg de massa corporal por dia.</p>
        <p><span class="expert-metric-badge">Tafonomia:</span> Fóssil B-rex (MOR 1125) preservou estruturas microvasculares flexíveis e matriz orgânica de colágeno no interior desmineralizado da cavidade medular, além de osso medular comprovando tratar-se de uma fêmea grávida em fase de ovulação.</p>
      `
    },
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Tyrannosaurus_rex_mmartyniuk.png/800px-Tyrannosaurus_rex_mmartyniuk.png',
        caption: 'Reconstituição paleoartística anatômica em vida do T-Rex adulto'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Tyrannosaurus_rex_Sue_at_The_Field_Museum_02.jpg/800px-Tyrannosaurus_rex_Sue_at_The_Field_Museum_02.jpg',
        caption: 'Esqueleto completo de "Sue" (FMNH PR 2081) em Chicago'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Tyrannosaurus_skull.jpg/800px-Tyrannosaurus_skull.jpg',
        caption: 'Crânio fóssil exibindo abóbada nasal fundida e dentes robustos'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/T-rex_scale.svg/800px-T-rex_scale.svg.png',
        caption: 'Diagrama métrico comparativo com a estatura humana'
      }
    ]
  },
  {
    name: 'Spinosaurus',
    species: 'Spinosaurus aegyptiacus',
    commonName: 'Espinossauro',
    etymology: 'Do grego: σπῖνος (spinos, "espinha") + σαῦρος (sauros, "lagarto") • Descrito em 1915 por Ernst Freiherr Stromer von Reichenbach',
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
    bio: 'O Spinosaurus representa o terópode mais longo de todos os tempos geológicos. Adaptado para nichos fluviais e costeiros de mangues cretáceos, possuía osteosclerose (ossos hiperdensos sem canal medular amplo para atuar como lastro de mergulho), cauda propulsora em forma de remo com espinhas neurais hiperalongadas e focinho estreito repleto de forames neurovasculares para detectar vibrações na água.',
    curiosities: [
      'A cauda em forma de nadadeira foi descoberta apenas em 2020 pela equipe de Nizar Ibrahim, redefinindo o modelo locomotor do animal.',
      'Seus dentes cônicos lisos e sem serrilhas eram ideais para perfurar peixes recobertos de escamas duras, como o celacanto Mawsonia e o peixe-serra Onchopristis.',
      'Os fósseis holótipos originais de 1915 foram reduzidos a cinzas no bombardeio de Munique pela RAF em 24 de abril de 1944.',
      'Possuía centro de gravidade recuado em direção às pernas traseiras curtas, o que limitava sua agilidade bípede em terra seca.'
    ],
    expertData: {
      cladogram: [
        'Dinosauria (Owen, 1842)',
        '└── Saurischia (Seeley, 1887)',
        '    └── Theropoda (Marsh, 1881)',
        '        └── Megalosauroidea (Fitzinger, 1843)',
        '            └── Spinosauridae (Stromer, 1915)',
        '                └── Spinosaurinae (Sereno et al., 1998)',
        '                    └── Spinosaurus aegyptiacus (Stromer, 1915)'
      ],
      osteology: `
        <p><span class="expert-metric-badge">Vela Dorsal:</span> Processos espinhosos nas vértebras dorsais de até 1,82 metro de comprimento, ancorados por ligamentos colagenosos espessos, sem evidência de corcova de gordura.</p>
        <p><span class="expert-metric-badge">Cauda Natatória:</span> Vértebras caudais com zigapófises frouxas e arcos hemais alongados que formavam uma nadadeira vertical flexível impulsionada lateralmente.</p>
        <p><span class="expert-metric-badge">Focinho Rostral:</span> Pré-maxilas expandidas em roseta terminal interdigitada com dentes cônicos não serrilhados de substituição rápida contínua.</p>
      `,
      biomechanics: `
        <p><span class="expert-metric-badge">Hidrodinâmica:</span> Coeficiente de arrasto hidrodinâmico (Cd) calculado entre 0,045 e 0,058 em modelagem de dinâmica de fluidos computacional (CFD). A cauda gerava 8 vezes mais empuxo do que as caudas de outros terópodes.</p>
        <p><span class="expert-metric-badge">Densidade Óssea:</span> Índice de osteosclerose extrema nas costelas e tíbias para combater a flutuabilidade positiva induzida pelo sistema respiratório sacular das aves/terópodes.</p>
      `,
      histology: `
        <p><span class="expert-metric-badge">Pactosteose:</span> Ausência quase total de cavidade medular livre em ossos longos adultos, com deposição concêntrica de tecido lamelar periosteal contínuo.</p>
        <p><span class="expert-metric-badge">Isótopos de Oxigênio (δ18O):</span> Análises isotópicas no esmalte dental (Amiot et al.) revelam valores idênticos aos de tartarugas aquáticas e crocodilianos contemporâneos, comprovando ecologia aquática estrita.</p>
      `
    },
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Spinosaurus_life_restoration.png/800px-Spinosaurus_life_restoration.png',
        caption: 'Reconstituição do Spinosaurus demonstrando a cauda em remo'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Spinosaurus_mount.jpg/800px-Spinosaurus_mount.jpg',
        caption: 'Esqueleto fóssil montado em postura natatória'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Spinosaurus_scale.svg/800px-Spinosaurus_scale.svg.png',
        caption: 'Comparativo métrico de envergadura com o corpo humano'
      }
    ]
  },
  {
    name: 'Triceratops',
    species: 'Triceratops horridus',
    commonName: 'Tricerátops',
    etymology: 'Do grego: τρία (tria, "três") + κέρας (kéras, "chifre") + ὤψ (ōps, "face") + horridus ("áspero/temível") • Descrito em 1889 por Othniel Charles Marsh',
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
    location: 'América do Norte (Formações Hell Creek, Lance, Frenchman e Evanston)',
    bio: 'O Triceratops ostentava um dos maiores crânios entre todos os tetrápodes terrestres, atingindo até 2,5 metros do bico à borda do escudo parietal. Apresentava um escudo ósseo occipital compacto e sólido (sem fenestras parietais abertas, diferentemente de quase todos os outros ceratópsios) e dois chifres pós-orbitais de mais de 1 metro que eram revestidos por bainhas duras de queratina afiadas.',
    curiosities: [
      'Possuía até 800 dentes organizados em baterias contínuas que agiam como tesouras automáticas para cortar palmeiras e cicadáceas duras.',
      'Crânios fósseis de Triceratops mostram perfurações por chifres curadas, indicando combates frontais frequentes entre indivíduos da mesma espécie.',
      'A articulação esferoide única entre a cabeça e a primeira vértebra cervical (côndilo occipital em bola) permitia girar a cabeça em quase 360° com incrível facilidade.',
      'Representa mais de 40% de todos os fósseis de dinossauros desenterrados na Formação Hell Creek, provando que era extremamente abundante.'
    ],
    expertData: {
      cladogram: [
        'Dinosauria (Owen, 1842)',
        '└── Ornithischia (Seeley, 1887)',
        '    └── Ceratopsia (Marsh, 1890)',
        '        └── Ceratopsidae (Marsh, 1888)',
        '            └── Chasmosaurinae (Lambe, 1915)',
        '                └── Triceratops horridus (Marsh, 1889)'
      ],
      osteology: `
        <p><span class="expert-metric-badge">Escudo Frill:</span> Fusão dos ossos esquamosais e parietais em um bloco compacto laminar vascularizado por sulcos arteriais superficiais profundos.</p>
        <p><span class="expert-metric-badge">Bateria Dental:</span> Cada coluna continha de 3 a 5 dentes de substituição vertical com esmalte assimétrico, mantendo autoafiamento constante através do atrito oclusal.</p>
        <p><span class="expert-metric-badge">Cíngulo Peitoral:</span> Escápula longa e coracoide fusionados em âncora para os músculos tríceps e peitoral maior, suportando mais de 60% da massa corporal anterior.</p>
      `,
      biomechanics: `
        <p><span class="expert-metric-badge">Cinemática Mandibular:</span> Movimento de propalatia e ortal (elevação vertical com translação póstero-anterior), produzindo torque de cisalhamento capaz de fatiar vegetação lenhosa com teor de sílica elevado.</p>
        <p><span class="expert-metric-badge">Resistência do Chifre:</span> O núcleo de osso trabecular com capa externa de queratina apresentava módulo de elasticidade gradiente, absorvendo energias de impacto de até 25 kJ sem fratura catastrófica.</p>
      `,
      histology: `
        <p><span class="expert-metric-badge">Ontogenia dos Chifres:</span> Chifres juvenis curvavam-se para trás; durante a puberdade, o remodelamento osteoclástico invertia a curvatura para frente em pontas de aríete agressivas (Horner & Goodwin).</p>
      `
    },
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Triceratops_prorsus_clean.png/800px-Triceratops_prorsus_clean.png',
        caption: 'Reconstituição paleoartística anatômica do Triceratops'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Triceratops_BW.jpg/800px-Triceratops_BW.jpg',
        caption: 'Esqueleto completo montado no Museu Americano de História Natural'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Triceratops_scale.svg/800px-Triceratops_scale.svg.png',
        caption: 'Escala métrica de porte do espécime adulto comparado ao humano'
      }
    ]
  },
  {
    name: 'Velociraptor',
    species: 'Velociraptor mongoliensis',
    commonName: 'Velociraptor',
    etymology: 'Do latim: velox ("veloz") + raptor ("ladrão/saqueador") • Descrito em 1924 por Henry Fairfield Osborn',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Superior (Campaniano, 75 – 71 Ma)',
    group: 'dinossauro',
    groupName: 'Dromeossaurídeo Maniraptor',
    diet: 'carnivoro',
    dietName: 'Carnívoro Ágil / Predador de Emboscada',
    length: '1,8 a 2,07 metros',
    height: '0,5 metros (quadril)',
    weight: '15 a 20 kg',
    speed: '38 a 45 km/h',
    biteForce: '1.200 N (~122 kgf)',
    location: 'Deserto de Gobi (Formação Djadochta, Mongólia e Mongólia Interior, China)',
    bio: 'O Velociraptor é um paraviano avançado intimamente aparentado às aves modernas. Seu corpo era integralmente revestido de penas penáceas e asas aerodinâmicas bem desenvolvidas nos antebraços. Sua maior adaptação era a garra falciforme hipertrofiada no segundo dígito do pé traseiro (híper-extensível a mais de 100°), utilizada para imobilizar e perfurar presas (modelo RPR - Raptor Prey Restraint).',
    curiosities: [
      'Possuía papilas ulnares fósseis na ulna idênticas às das aves voadoras atuais, onde se fixavam as penas de voo secundárias.',
      'O clássico fóssil dos "Dinossauros em Combate" preservou um Velociraptor com sua garra falciforme cravada no pescoço de um Protoceratops.',
      'A cauda continha bastonetes ósseos pré-zigapofisários que a tornavam completamente rígida, funcionando como leme de precisão em curvas fechadas.',
      'Apesar das asas nas patas dianteiras, seu peso e proporções mecânicas não permitiam voo ativo batido.'
    ],
    expertData: {
      cladogram: [
        'Dinosauria (Owen, 1842)',
        '└── Theropoda (Marsh, 1881)',
        '    └── Coelurosauria (Huene, 1914)',
        '        └── Maniraptora (Gauthier, 1986)',
        '            └── Dromaeosauridae (Matthew & Brown, 1922)',
        '                └── Velociraptorinae (Barsbold, 1983)',
        '                    └── Velociraptor mongoliensis (Osborn, 1924)'
      ],
      osteology: `
        <p><span class="expert-metric-badge">Garra Falciforme:</span> Ungueal falciforme no dígito pedal II articulado em gínglimo com tróclea assimétrica, mantida erguida do solo para preservar o fio cortante afiado.</p>
        <p><span class="expert-metric-badge">Clavícula & Fúrcula:</span> Fúrcula em formato de bumerangue fusionada (homóloga ao "osso da sorte" das aves modernas), servindo de fixação para os músculos peitorais.</p>
      `,
      biomechanics: `
        <p><span class="expert-metric-badge">Modelo RPR (Raptor Prey Restraint):</span> Estudos de Fowler et al. (2011) demonstram que a garra não agia como faca de estripamento contra peles grossas, mas sim como gancho perfurante de fixação gravitacional para pinçar a presa enquanto batia as asas para equilíbrio (mantling).</p>
      `,
      histology: `
        <p><span class="expert-metric-badge">Integumento Plumoso:</span> Penas assimétricas de contorno e plumagem tectriz com cálamo e raque queratinizados com melanossomos preservados indicando padrões de camuflagem terrosa.</p>
      `
    },
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Velociraptor_restoration.jpg/800px-Velociraptor_restoration.jpg',
        caption: 'Reconstituição científica moderna emplumada do Velociraptor'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Velociraptor_skeleton.png/800px-Velociraptor_skeleton.png',
        caption: 'Esqueleto destacando a garra curva do pé e a fúrcula'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Velociraptor_scale.svg/800px-Velociraptor_scale.svg.png',
        caption: 'Proporção real de tamanho em relação ao ser humano'
      }
    ]
  },
  {
    name: 'Stegosaurus',
    species: 'Stegosaurus stenops',
    commonName: 'Estegossauro',
    etymology: 'Do grego: στέγος (stegos, "telhado") + σαῦρος (sauros, "lagarto") • Descrito em 1877 por Othniel Charles Marsh',
    periodKey: 'Jurassic',
    periodName: 'Jurássico Superior (Kimmeridgiano – Titoniano, 155 – 150 Ma)',
    group: 'dinossauro',
    groupName: 'Tireóforo Estegossaurídeo',
    diet: 'herbivoro',
    dietName: 'Herbívoro de Sub-bosque',
    length: '9,0 metros',
    height: '4,0 metros (até as placas)',
    weight: '4,5 a 7,0 toneladas',
    speed: '12 a 15 km/h',
    biteForce: '1.400 N (dentes em folha para raspar musgos)',
    location: 'América do Norte (Formação Morrison, EUA) e Portugal',
    bio: 'O Stegosaurus é o mais célebre representante dos tireóforos jurássicos. Caracterizado por duas fileiras alternadas de até 17 osteodermas dérmicos eretos em formato de placas foliáceas vascularizadas e por quatro espinhos caudais cilíndricos na extremidade posterior (o tagomizador), o animal compensava a cabeça minúscula com um corpo blindado e poderosa cauda defensiva articulada.',
    curiosities: [
      'As placas dorsais não eram fundidas à espinha dorsal, mas sim incrustadas na pele espessa dérmica, sustentadas por tecido conjuntivo denso.',
      'Possuía osteodermas gulares (uma malha de pequenos botões ósseos) que protegiam sua garganta vulnerável de botes inferiores de terópodes.',
      'O "segundo cérebro" no quadril era na verdade uma expansão do canal sacral que abrigava um corpo glicogênico, semelhante ao das aves modernas.',
      'Uma vértebra caudal de Allosaurus foi encontrada com uma perfuração óssea curada que coincide perfeitamente com o diâmetro de um espinho de Stegosaurus.'
    ],
    expertData: {
      cladogram: [
        'Dinosauria (Owen, 1842)',
        '└── Ornithischia (Seeley, 1887)',
        '    └── Thyreophora (Nopcsa, 1915)',
        '        └── Stegosauria (Marsh, 1877)',
        '            └── Stegosauridae (Marsh, 1880)',
        '                └── Stegosaurus stenops (Marsh, 1887)'
      ],
      osteology: `
        <p><span class="expert-metric-badge">Osteodermas Dorsais:</span> Placas com matriz esponjosa vascular interna revestida por córtex ósseo denso laminado, percorrida por canais nutritivos para termorregulação e exibição.</p>
        <p><span class="expert-metric-badge">Tagomizador:</span> 4 espinhos cônicos apicais (osteodermas caudais) implantados em ângulo horizontal de ~45° na cauda terminal móvel.</p>
      `,
      biomechanics: `
        <p><span class="expert-metric-badge">Impacto Defensivo:</span> Simulações de colisão balística estimam que a cauda flexível alcançava velocidade de impacto de até 70 km/h, gerando energia cinética de 2.000 Joules focada na ponta do espinho.</p>
      `,
      histology: `
        <p><span class="expert-metric-badge">Histologia das Placas:</span> Revestimento de queratina sobreposto a tecido ósseo trabecular ativo metabolicamente com alta taxa de vascularização superficial.</p>
      `
    },
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Stegosaurus_stenops_life_restoration.png/800px-Stegosaurus_stenops_life_restoration.png',
        caption: 'Reconstituição do Stegosaurus com suas placas dérmicas'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Stegosaurus_skeleton.jpg/800px-Stegosaurus_skeleton.jpg',
        caption: 'Esqueleto completo do espécime "Sophie" em Londres'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Stegosaurus_scale.svg/800px-Stegosaurus_scale.svg.png',
        caption: 'Comparativo de altura e escala com o ser humano'
      }
    ]
  },
  {
    name: 'Brachiosaurus',
    species: 'Brachiosaurus altithorax',
    commonName: 'Braquiossauro',
    etymology: 'Do grego: βραχίων (brachion, "braço") + σαῦρος (sauros, "lagarto") • Descrito em 1903 por Elmer S. Riggs',
    periodKey: 'Jurassic',
    periodName: 'Jurássico Superior (Kimmeridgiano – Titoniano, 154 – 150 Ma)',
    group: 'dinossauro',
    groupName: 'Macronário Saurópode',
    diet: 'herbivoro',
    dietName: 'Herbívoro de Dossel Arbóreo',
    length: '26 a 30 metros',
    height: '12 a 13 metros (cabeça)',
    weight: '35 a 55 toneladas',
    speed: '12 a 15 km/h',
    biteForce: '4.500 N (dentes em colher para desfolhar galhos)',
    location: 'América do Norte (Formação Morrison, Colorado e Utah)',
    bio: 'O Brachiosaurus revolucionou o entendimento da morfologia dos saurópodes por apresentar os membros anteriores sensivelmente mais longos que os posteriores (daí o nome "lagarto com braços"). Essa postura naturalmente inclinada elevava sua cintura escapular e pescoço colunar diretamente para as copas altas das coníferas jurássicas (Araucariaceae e Ginkgoales), a mais de 12 metros do chão.',
    curiosities: [
      'Seu coração devia pesar mais de 200 kg para gerar pressão sistólica acima de 300 mmHg, necessária para bombear sangue até o cérebro.',
      'Possuía narinas no topo do crânio com fenestras confluentes, hoje atribuídas à ancoragem de tecidos moles ressonadores ou termorreguladores.',
      'As vértebras cervicais e dorsais continham "câmaras de ar" internas (pleurocelos) que eliminavam até 60% do peso do esqueleto sem perder suporte.',
      'Não mastigava o alimento: ingeria anualmente toneladas de folhas duras com auxílio de gastrólitos no estômago muscular moedor.'
    ],
    expertData: {
      cladogram: [
        'Dinosauria (Owen, 1842)',
        '└── Saurischia (Seeley, 1887)',
        '    └── Sauropodomorpha (Huene, 1932)',
        '        └── Titanosauriformes (Salgado et al., 1997)',
        '            └── Brachiosauridae (Riggs, 1904)',
        '                └── Brachiosaurus altithorax (Riggs, 1903)'
      ],
      osteology: `
        <p><span class="expert-metric-badge">Úmero vs Fêmur:</span> Razão úmero/fêmur de ~1,05 a 1,12, invertendo a condição padrão dos diplodocídeos e transferindo o centro de gravidade para a frente.</p>
        <p><span class="expert-metric-badge">Pneumatização:</span> Pleurocelos cavernosos e fossas centrais que reduziam o peso total do pescoço de 13 metros para menos de 1,2 tonelada de osso e músculo.</p>
      `,
      biomechanics: `
        <p><span class="expert-metric-badge">Gigantotermia & Homeotermia:</span> Relação superfície/volume extremamente baixa que permitia retenção térmica constante de 36–38 °C sem necessitar de taxa metabólica mamaliana extrema.</p>
      `,
      histology: `
        <p><span class="expert-metric-badge">Tecido Fibrolamelar:</span> Osteócitos densos e canais de Havers primários longitudinais confirmando taxas de crescimento aceleradas contínuas sem diapausa estacional prolongada.</p>
      `
    },
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Brachiosaurus_DB.jpg/800px-Brachiosaurus_DB.jpg',
        caption: 'Reconstituição paleoartística do Brachiosaurus no dossel'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Brachiosaurus_skeleton_Berlin.jpg/800px-Brachiosaurus_skeleton_Berlin.jpg',
        caption: 'O monumental esqueleto montado no Museu de Berlim'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Brachiosaurus_scale.svg/800px-Brachiosaurus_scale.svg.png',
        caption: 'Diagrama métrico monumental em relação à escala humana'
      }
    ]
  },
  {
    name: 'Allosaurus',
    species: 'Allosaurus fragilis',
    commonName: 'Alossauro',
    etymology: 'Do grego: ἄλλος (allos, "diferente") + σαῦρος (sauros, "lagarto") • Descrito em 1877 por Othniel Charles Marsh',
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
    biteForce: '8.000 a 12.000 N (golpe de machado craniano)',
    location: 'América do Norte (Formação Morrison) e Portugal (Lourinhã)',
    bio: 'O predador ápice dos ecossistemas jurássicos da América do Norte e Península Ibérica. Com crânio levemente construído articulado cineticamente e musculatura cervical ventral poderosa, o Allosaurus utilizava a mandíbula superior como um machado contra carnes moles de grandes saurópodes e estegossauros.',
    curiosities: [
      'Mais de 70 indivíduos de todas as idades foram achados acumulados na pedreira fóssil de Cleveland-Lloyd em Utah.',
      'Possuía duas pequenas cristas ósseas acima dos olhos cobertas de queratina colorida para cortejo e reconhecimento.',
      'Suas mandíbulas abriam em um ângulo impressionante de até 92 graus, superior à de quase todos os predadores terrestres.',
      'Marcas de mordida em fósseis indicam que praticava canibalismo durante secas prolongadas no Jurássico.'
    ],
    expertData: {
      cladogram: [
        'Dinosauria > Saurischia > Theropoda > Tetanurae > Carnosauria > Allosauroidea > Allosauridae > Allosaurus'
      ],
      osteology: '<p>Vértebras com pleurocelos avançados; crânio streptostílico cinético com mobilidade intramandibular lateral.</p>',
      biomechanics: '<p>Modelo "axe-bite" de Rayfield (2001): crânio adaptado para resistir a forças verticais massivas de estocada rápida.</p>',
      histology: '<p>Maturação esquelética rápida aos 12–15 anos; presença de fraturas por estresse em fêmures e tíbias curadas por calo ósseo.</p>'
    },
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Allosaurus_fragilis_life_restoration.png/800px-Allosaurus_fragilis_life_restoration.png',
        caption: 'Reconstituição do Allosaurus fragilis em caçada'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Allosaurus_skeleton.jpg/800px-Allosaurus_skeleton.jpg',
        caption: 'Esqueleto fóssil completo em postura predatória'
      }
    ]
  },
  {
    name: 'Mosasaurus',
    species: 'Mosasaurus hoffmannii',
    commonName: 'Mossassauro',
    etymology: 'Do latim: Mosa (rio Mosa, Holanda) + σαῦρος (sauros, "lagarto") • Descrito em 1822 por William Daniel Conybeare',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Superior (Campaniano – Maastrichtiano, 82 – 66 Ma)',
    group: 'reptil-marinho',
    groupName: 'Esquamatado Marinho Gigante',
    diet: 'carnivoro',
    dietName: 'Superpredador Pelágico',
    length: '14,0 a 17,5 metros',
    height: 'Corpo serpentino fusiforme',
    weight: '10 a 15 toneladas',
    speed: '35 a 45 km/h',
    biteForce: '28.000 a 40.000 N',
    location: 'Oceanos mundiais (Europa, América do Norte, África e Antártica)',
    bio: 'Parente evolutivo dos lagartos monitores modernos (Varanoidea) e serpentes, o Mosasaurus reinou soberano nos mares do final do Cretáceo. Possuía nadadeiras hidrodinâmicas, cauda hipocerca bilobada propulsora como a dos tubarões e uma segunda arcada de dentes pterigóideos no céu da boca para prender presas escorregadias.',
    curiosities: [
      'Foi um dos primeiros grandes animais fósseis desenterrados pela ciência moderna, encontrado em Maastricht em 1764.',
      'Possuía dentes pterigóideos no céu da boca que impediam peixes, lulas e amonites de escaparem para fora.',
      'Dava à luz filhotes vivos na água (viviparidade confirmada por fósseis de mosassaurídeos gravídicos).',
      'Fósseis de tartarugas marinhas Archelon com carapaças perfuradas mostram a força esmagadora de suas mandíbulas.'
    ],
    expertData: {
      cladogram: [
        'Squamata > Toxicofera > Anguimorpha > Mosasauroidea > Mosasauridae > Mosasaurinae > Mosasaurus'
      ],
      osteology: '<p>Articulação intramandibular flexível streptostílica; vértebras caudais com arcos hemais hipertrofiados para sustentar o lobo inferior da cauda.</p>',
      biomechanics: '<p>Propulsão axial carangiforme eficiente com ondulação caudal lateral acoplada a nadadeiras de direção peitoral.</p>',
      histology: '<p>Homeotermia marinha confirmada por isótopos de oxigênio com temperatura corporal interna sustentada de ~35–39 °C.</p>'
    },
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Mosasaurus_hoffmanni.png/800px-Mosasaurus_hoffmanni.png',
        caption: 'Reconstituição científica do Mosasaurus pelágico'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Mosasaurus_beaugi.jpg/800px-Mosasaurus_beaugi.jpg',
        caption: 'Crânio fóssil exibindo a arcada de dentes carnívoros'
      }
    ]
  },
  {
    name: 'Pteranodon',
    species: 'Pteranodon longiceps',
    commonName: 'Pteranodonte',
    etymology: 'Do grego: πτερόν (pteron, "asa") + ἀνόδους (anodous, "desprovido de dentes") • Descrito em 1876 por Othniel Charles Marsh',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Superior (Coniaciano – Campaniano, 86 – 84 Ma)',
    group: 'pterossauro',
    groupName: 'Pterodactiloide Voador',
    diet: 'piscivoro',
    dietName: 'Piscívoro Planador Oceânico',
    length: 'Envergadura de 6,5 a 7,2 metros',
    height: '1,8 metro (pousado)',
    weight: '20 a 35 kg',
    speed: '60 a 85 km/h (planar dinâmico)',
    biteForce: 'Bico córneo adaptado para capturar peixes',
    location: 'América do Norte (Niobrara Chalk e Pierre Shale Formations)',
    bio: 'O Pteranodon era um réptil voador dos pterossauros com envergadura equivalente à de um avião planador monomotor leve. Possuía ossos ocos de paredes milimétricas, bico córneo desdentado longo e uma majestosa crista óssea occipital que equilibrava o peso do bico durante o voo e atuava como leme aerodinâmico.',
    curiosities: [
      'Apesar de medir mais de 7 metros de ponta a ponta das asas, pesava apenas ~30 kg graças ao esqueleto pneumatizado.',
      'Praticava o voo dinâmico por gradiente de vento sobre ondas marinhas, similar aos albatrozes modernos.',
      'Possuía o quarto dígito da mão hiperalongado para sustentar a membrana alar elástica de tecido queratinoso (quirópatagio).',
      'Mais de 1.100 espécimes fósseis já foram desenterrados no Mar Interior Ocidental norte-americano.'
    ],
    expertData: {
      cladogram: [
        'Pterosauria > Pterodactyloidea > Ornithocheiroidea > Pteranodontia > Pteranodontidae > Pteranodon'
      ],
      osteology: '<p>Notarium (vértebras dorsais fundidas) ancorando a escápula e coracoide; pré-maxilas desdentadas revestidas por ranfoteca afiada.</p>',
      biomechanics: '<p>Carga alar excepcionalmente baixa (~8 kg/m²); decolagem quadrúpede explosiva impulsionada pelas patas dianteiras.</p>',
      histology: '<p>Córtex ósseo submilimétrico sustentado por trabéculas em treliça interna aeroespacial tridimensional.</p>'
    },
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Pteranodon_longiceps_mmartyniuk.png/800px-Pteranodon_longiceps_mmartyniuk.png',
        caption: 'Reconstituição do voo planar do Pteranodon'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Pteranodon_skeleton.jpg/800px-Pteranodon_skeleton.jpg',
        caption: 'Esqueleto fóssil suspenso em posição de voo'
      }
    ]
  },
  {
    name: 'Ankylosaurus',
    species: 'Ankylosaurus magniventris',
    commonName: 'Anquilossauro',
    etymology: 'Do grego: ἀγκύλος (ankylos, "fundido/curvo") + σαῦρος (sauros, "lagarto") • Descrito em 1908 por Barnum Brown',
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
    biteForce: '1.800 N (mastigação por bateria rasteira)',
    location: 'América do Norte (Formações Hell Creek, Lance e Scollard)',
    bio: 'O "tanque vivo" do Cretáceo Superior. Seu corpo era blindado por milhares de osteodermas dérmicos ossificados recobertos por queratina, que protegiam inclusive suas pálpebras superiores. Sua cauda terminava em uma clava óssea maciça de até 60 kg ancorada por vértebras posteriores fundidas rígidas, capaz de fraturar fêmures de predadores como o T-Rex.',
    curiosities: [
      'Sua única área vulnerável sem couraça óssea era o ventre mole inferior.',
      'Possuía seios nasais complexos em formato de caracol que condicionavam a temperatura do ar inalado e apuravam o olfato.',
      'As osteodermas da cabeça fundiam-se totalmente aos ossos cranianos em um escudo impenetrável.',
      'A clava caudal era sustentada por ossificação de tendões longitudinais que transformavam a cauda em um martelo balístico.'
    ],
    expertData: {
      cladogram: [
        'Dinosauria > Ornithischia > Thyreophora > Ankylosauria > Ankylosauridae > Ankylosaurus'
      ],
      osteology: '<p>Craniofusion total; vértebras caudais terminais fundidas em uma haste de suporte rígida ("handle") com ossos dérmicos apicais ("knob").</p>',
      biomechanics: '<p>Impacto caudal de até 14.000 Newtons na colisão, gerando fratura cortical óssea instantânea em terópodes bípedes.</p>',
      histology: '<p>Osteodermas estruturadas com fibras colágenas entrelaçadas em "sanduíche", similar a coletes à prova de balas modernos.</p>'
    },
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Ankylosaurus_magniventris.png/800px-Ankylosaurus_magniventris.png',
        caption: 'Reconstituição da couraça e clava do Ankylosaurus'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Ankylosaurus_scale.svg/800px-Ankylosaurus_scale.svg.png',
        caption: 'Comparativo de largura e escala com o ser humano'
      }
    ]
  },
  {
    name: 'Carnotaurus',
    species: 'Carnotaurus sastrei',
    commonName: 'Carnotauro',
    etymology: 'Do latim: carno ("carne") + taurus ("touro") • Descrito em 1985 por José Fernando Bonaparte',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Superior (Campaniano – Maastrichtiano, 72 – 69 Ma)',
    group: 'dinossauro',
    groupName: 'Abelissaurídeo Patagônico',
    diet: 'carnivoro',
    dietName: 'Carnívoro Cursorial de Ataque Rápido',
    length: '7,5 a 9,0 metros',
    height: '2,8 a 3,0 metros',
    weight: '1,5 a 2,0 toneladas',
    speed: '48 a 56 km/h',
    biteForce: '3.500 a 5.000 N (ataques rápidos cinéticos)',
    location: 'Patagônia, Argentina (Formação La Colonia)',
    bio: 'Famoso pelos dois chifres ósseos pontiagudos frontais e pelas patas dianteiras quase vestigiais sem punho funcional, o Carnotaurus era o velocista máximo dos grandes terópodes. Sua musculatura caudal (músculo caudofemoralis longus) representava mais de 15% do seu peso total, impulsionando-o a mais de 50 km/h em perseguições em linha reta pelas planícies sul-americanas.',
    curiosities: [
      'Foi o primeiro grande terópode encontrado com impressões fósseis de pele preservada quase por completo, revelando escamas e nódulos.',
      'Seus chifres eram revestidos por uma bainha de queratina espessa e podiam ser usados em disputas de cabeçadas entre machos da espécie.',
      'Estudos biomecânicos apontam que ele conseguia acelerar em linha reta a mais de 50 km/h graças à hipertrofia do músculo caudofemoral.',
      'Seus braços diminutos não possuíam articulação de punho funcional e tinham 4 pequenos dedos imóveis.'
    ],
    expertData: {
      cladogram: [
        'Dinosauria > Theropoda > Ceratosauria > Abelisauridae > Carnotaurinae > Carnotaurus'
      ],
      osteology: '<p>Crânio braquicefálico encurtado; chifres frontais espessos; vértebras caudais com costelas caudais fundidas voltadas para cima que abrigavam o músculo caudofemoral hipertrofiado.</p>',
      biomechanics: '<p>Maior razão de massa caudofemoral/fêmur entre os dinossauros cursoriais; baixa capacidade de manobra lateral em alta velocidade.</p>',
      histology: '<p>Fósseis dérmicos com nódulos poligonais cônicos não sobrepostos sem evidência de plumagem filamentosa na linhagem dos abelissaurídeos.</p>'
    },
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Carnotaurus_sastrei_life_restoration.png/800px-Carnotaurus_sastrei_life_restoration.png',
        caption: 'Reconstituição do Carnotauro com seus chifres'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Carnotaurus_skeleton.jpg/800px-Carnotaurus_skeleton.jpg',
        caption: 'Esqueleto original no Museu de Ciências Naturais de Buenos Aires'
      }
    ]
  },
  {
    name: 'Plesiosaurus',
    species: 'Plesiosaurus dolichodeirus',
    commonName: 'Plesiossauro',
    etymology: 'Do grego: πλησίος (plesios, "próximo") + σαῦρος (sauros, "lagarto") • Descrito em 1821 por De la Beche e Conybeare',
    periodKey: 'Jurassic',
    periodName: 'Jurássico Inferior (Hettangiano – Sinemuriano, 199 – 175 Ma)',
    group: 'reptil-marinho',
    groupName: 'Plesiossauro Pelágico',
    diet: 'piscivoro',
    dietName: 'Piscívoro Hidrodinâmico',
    length: '3,5 a 4,5 metros',
    height: 'Pescoço esguio com ~40 vértebras',
    weight: '400 a 500 kg',
    speed: '15 a 20 km/h',
    biteForce: 'Dentes em agulha para aprisionamento rápido',
    location: 'Europa Ocidental (Lyme Regis, Dorset, Inglaterra e Alemanha)',
    bio: 'O clássico réptil marinho de pescoço comprido desenterrado pioneiramente por Mary Anning no século XIX. Possuía quatro grandes nadadeiras hiperfalângicas que realizavam voo subaquático coordinado e pescoço flexível adaptado para golpear cardumes de belemnites e peixes jurássicos sem movimentar a massa pesada do tronco.',
    curiosities: [
      'O esqueleto mais famoso foi achado em 1823 por Mary Anning, revolucionando a paleontologia europeia.',
      'Engolia gastrólitos que serviam como lastro e para macerar cascas duras de crustáceos e conchas de cefalópodes.',
      'Sua locomoção utilizava as nadadeiras anteriores e posteriores em batimentos síncronos alternados.',
      'Diferente do mito do Lago Ness, o animal não conseguia projetar o pescoço em postura de cisne para fora da água.'
    ],
    expertData: {
      cladogram: [
        'Sauropterygia > Pistosauria > Plesiosauria > Plesiosauroidea > Plesiosauridae > Plesiosaurus'
      ],
      osteology: '<p>Cinturas escapular e pélvica transformadas em placas ventrais maciças; falanges multiplicadas em pás natatórias rígidas.</p>',
      biomechanics: '<p>Hidrofólio simétrico com perfil NACA; sustentação gerada pela inclinação das pás durante a descida e subida do ciclo natatório.</p>',
      histology: '<p>Estrutura óssea densa periosteal nas costelas e gastrália para controle hidrostático de flutuabilidade.</p>'
    },
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Plesiosaurus_dolichodeirus.png/800px-Plesiosaurus_dolichodeirus.png',
        caption: 'Reconstituição do Plesiosaurus em seu habitat marinho'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Plesiosaurus_skeleton.jpg/800px-Plesiosaurus_skeleton.jpg',
        caption: 'Fóssil histórico descoberto por Mary Anning'
      }
    ]
  },
  {
    name: 'Coelophysis',
    species: 'Coelophysis bauri',
    commonName: 'Celófise',
    etymology: 'Do grego: κοῖλος (koilos, "oco") + φύσις (physis, "forma") • Descrito em 1889 por Edward Drinker Cope',
    periodKey: 'Triassic',
    periodName: 'Triássico Superior (Noriano – Rhaetiano, 216 – 196 Ma)',
    group: 'dinossauro',
    groupName: 'Terópode Basal Triássico',
    diet: 'carnivoro',
    dietName: 'Carnívoro Ágil / Pequenos Répteis',
    length: '2,5 a 3,0 metros',
    height: '1,0 metro',
    weight: '15 a 25 kg',
    speed: '40 a 50 km/h',
    biteForce: '600 N (dentes em lâmina serrilhada)',
    location: 'América do Norte (Ghost Ranch, Formação Chinle, Novo México)',
    bio: 'Um dos dinossauros pioneiros mais bem-sucedidos da história. Surgido no árido Triássico Superior, o Coelophysis possuía ossos pneumatizados ultra-leves e pernas compridas que lhe permitiam correr em alta velocidade caçando esfenodontes primitivos, cinodontes e insetos, iniciando o reinado dos dinossauros.',
    curiosities: [
      'Em 1947, Edwin Colbert desenterrou milhares de esqueletos de Coelophysis juntos em Ghost Ranch (Novo México).',
      'Um crânio de Coelophysis viajou para o espaço a bordo do ônibus espacial Endeavour em 1998.',
      'Possuía olhos grandes com anéis escleróticos circulares adaptados para visão crepuscular e noturna.',
      'Mãos com 4 dedos, dos quais apenas 3 eram funcionais e armados de garras curvas agudas.'
    ],
    expertData: {
      cladogram: [
        'Dinosauria > Saurischia > Theropoda > Coelophysoidea > Coelophysidae > Coelophysis'
      ],
      osteology: '<p>Ossos com paredes corticais extremamente finas; fúrcula primitiva em "U"; vértebras sacrais com fusão incompleta.</p>',
      biomechanics: '<p>Adaptação cursorial extrema com metatarsos longos e compressão digitígrada de alta economia metabólica.</p>',
      histology: '<p>Dimorfismo sexual craniométrico marcado entre formas "robustas" e "gráceis" preservadas no mesmo leito fóssil.</p>'
    },
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Coelophysis_bauri.png/800px-Coelophysis_bauri.png',
        caption: 'Reconstituição paleoartística do Coelophysis bauri'
      }
    ]
  }
];

// Cache dinâmico para buscas customizadas
const dynamicSearchCache = new Map();

// ==========================================================================
// FUNÇÕES DE DADOS E FORMATAÇÃO
// ==========================================================================

function getPeriodBadgeClass(periodKey) {
  switch (periodKey) {
    case 'Triassic': return 'period-triassic';
    case 'Jurassic': return 'period-jurassic';
    case 'Cretaceous': return 'period-cretaceous';
    default: return 'period-mesozoic';
  }
}

/**
 * Busca dados da Wikipedia e da Paleobiology Database caso o usuário
 * busque um espécime fora do acervo pré-curado, montando uma ficha própria completa.
 */
async function fetchCustomSpecimenData(query) {
  if (dynamicSearchCache.has(query.toLowerCase())) {
    return dynamicSearchCache.get(query.toLowerCase());
  }

  try {
    // 1. Consulta taxonômica na Paleobiology Database
    let taxon = null;
    try {
      const pbdbRes = await fetch(`https://paleobiodb.org/data1.2/taxa/single.json?name=${encodeURIComponent(query)}&show=attr`);
      if (pbdbRes.ok) {
        const pbdbJson = await pbdbRes.json();
        taxon = pbdbJson.records && pbdbJson.records[0] ? pbdbJson.records[0] : null;
      }
    } catch (e) {
      console.warn('PBDB inacessível:', e);
    }

    // 2. Consulta resumo na Wikipedia PT (com fallback EN)
    let wikiData = null;
    let wikiRes = await fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
    if (wikiRes.ok) wikiData = await wikiRes.json();
    if (!wikiData || !wikiData.extract) {
      wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
      if (wikiRes.ok) wikiData = await wikiRes.json();
    }

    if (!wikiData && !taxon) return null;

    const mainImg = wikiData?.thumbnail?.source || wikiData?.originalimage?.source || PLACEHOLDER_IMAGE;
    const gallery = [
      {
        url: mainImg,
        caption: 'Registro paleontológico catalogado'
      }
    ];

    // Busca mídias extras da Wikipedia
    try {
      const mediaRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(query)}`);
      if (mediaRes.ok) {
        const mediaJson = await mediaRes.json();
        if (mediaJson.items && mediaJson.items.length > 0) {
          mediaJson.items.slice(0, 5).forEach(item => {
            if (item.type === 'image' && item.srcset && item.srcset.length > 0) {
              const bestSrc = item.srcset[item.srcset.length - 1].src;
              const fullUrl = bestSrc.startsWith('//') ? `https:${bestSrc}` : bestSrc;
              if (fullUrl !== mainImg) {
                gallery.push({
                  url: fullUrl,
                  caption: item.caption?.text || 'Fotografia fóssil / Reconstituição científica'
                });
              }
            }
          });
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar galeria extra:', e);
    }

    let periodKey = 'Mesozoic';
    let periodName = taxon?.tei ? `${taxon.tei} ${taxon.tli && taxon.tli !== taxon.tei ? `a ${taxon.tli}` : ''}` : 'Era Mesozoica';
    const lowerPeriod = periodName.toLowerCase();
    if (lowerPeriod.includes('trias') || lowerPeriod.includes('triáss')) periodKey = 'Triassic';
    else if (lowerPeriod.includes('juras') || lowerPeriod.includes('juráss')) periodKey = 'Jurassic';
    else if (lowerPeriod.includes('cretac') || lowerPeriod.includes('cretác')) periodKey = 'Cretaceous';

    const compiled = {
      name: taxon?.nam || wikiData?.title || query,
      species: `${taxon?.nam || query} sp.`,
      commonName: wikiData?.title || query,
      etymology: `Gênero catalogado no registro paleontológico internacional da PBDB (${taxon?.rnk || 'gênero'})`,
      periodKey: periodKey,
      periodName: periodName,
      group: 'dinossauro',
      groupName: 'Espécime Fóssil Catalogado',
      diet: 'desconhecido',
      dietName: 'Estudo Paleontológico',
      length: 'Consulte registros de campo',
      height: 'Variável por exemplar',
      weight: 'Sob análise alométrica',
      speed: 'Em estudo biomecânico',
      biteForce: 'Em análise computacional',
      location: 'Sítios fósseis mundiais (ver mapa)',
      bio: wikiData?.extract || 'Espécime fóssil da Era Mesozoica catalogado com ocorrências registradas na literatura científica.',
      curiosities: [
        'Catalogado com registros oficiais de taxonomia na Paleobiology Database.',
        'Possui sítios fósseis georreferenciados disponíveis para exploração no mapa integrado.'
      ],
      expertData: {
        cladogram: [
          'Dinosauria (Owen, 1842)',
          `└── ${taxon?.nam || query} (Registro Paleobiológico PBDB)`
        ],
        osteology: `<p>Morfologia óssea catalogada sob a identificação taxonômica PBDB: ${taxon?.nam || query}.</p>`,
        biomechanics: '<p>Parâmetros biomecânicos e alometria sob contínuo estudo paleontológico.</p>',
        histology: '<p>Tafonomia e datação estratigráfica compatíveis com os estratos geológicos do período.</p>'
      },
      gallery: gallery
    };

    dynamicSearchCache.set(query.toLowerCase(), compiled);
    return compiled;
  } catch (error) {
    console.error('Erro ao compilar espécime:', error);
    return null;
  }
}

async function getCreatureData(query) {
  const found = PALEONTOLOGY_DATABASE.find(
    c => c.name.toLowerCase() === query.toLowerCase() ||
         c.commonName.toLowerCase() === query.toLowerCase() ||
         c.species.toLowerCase().includes(query.toLowerCase())
  );
  if (found) return found;
  return await fetchCustomSpecimenData(query);
}

// ==========================================================================
// RENDERIZAÇÃO DE CARDS NA PÁGINA
// ==========================================================================

function renderCard(item) {
  const card = document.createElement('article');
  card.className = 'card';
  const badgeClass = getPeriodBadgeClass(item.periodKey);
  const featuredImage = item.gallery[0]?.url || PLACEHOLDER_IMAGE;
  const imageCount = item.gallery.length;

  card.innerHTML = `
    <div class="card-image-wrap" title="Clique para abrir a Wiki do ${item.name}">
      <img src="${featuredImage}" alt="${item.name}" loading="lazy" onerror="this.onerror=null; this.src='${PLACEHOLDER_IMAGE}';">
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

      <!-- Linha exibida somente quando o Modo Especialista está ativo -->
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

  // Ações de clique
  const openWiki = () => openWikiModal(item);
  card.querySelector('.card-image-wrap').addEventListener('click', openWiki);
  card.querySelector('.card-title').addEventListener('click', openWiki);
  card.querySelector('.btn-card-dossier').addEventListener('click', openWiki);

  card.querySelector('.btn-card-map').addEventListener('click', (e) => {
    e.stopPropagation();
    openWikiModal(item);
    switchWikiTab('tab-map');
  });

  resultsContainer.appendChild(card);
}

// ==========================================================================
// WIKI INTERATIVA PROPRIA COM ABAS E MODO ESPECIALISTA
// ==========================================================================

function openWikiModal(creature) {
  currentCreature = creature;
  currentGallery = creature.gallery && creature.gallery.length > 0 ? creature.gallery : [{ url: PLACEHOLDER_IMAGE, caption: 'Sem imagem adicional' }];
  currentImageIndex = 0;

  // Cabeçalho da Wiki
  wikiTitle.textContent = creature.species || creature.name;
  wikiEtymology.textContent = creature.etymology || 'Espécime Fóssil da Era Mesozoica';
  
  // Badges
  wikiPeriodBadge.className = `card-floating-badge ${getPeriodBadgeClass(creature.periodKey)}`;
  wikiPeriodBadge.textContent = creature.periodName;
  wikiGroupBadge.textContent = `🏛️ ${creature.groupName}`;
  wikiDietBadge.textContent = `🍖 ${creature.dietName}`;

  // Sincroniza toggle do modal com o estado do modo especialista
  modalExpertToggle.checked = isExpertMode;

  // Preenche Aba 1: Dossiê Geral
  specLength.textContent = creature.length || '-';
  specHeight.textContent = creature.height || '-';
  specWeight.textContent = creature.weight || '-';
  specSpeed.textContent = creature.speed || '-';
  specBiteForce.textContent = creature.biteForce || '-';
  specPeriod.textContent = creature.periodName || '-';
  wikiBioText.textContent = creature.bio || 'Dados sob constante atualização científica.';

  // Curiosidades
  wikiCuriositiesList.innerHTML = '';
  if (creature.curiosities && creature.curiosities.length > 0) {
    creature.curiosities.forEach(curiosity => {
      const li = document.createElement('li');
      li.textContent = curiosity;
      wikiCuriositiesList.appendChild(li);
    });
  }

  // Preenche Miniaturas da Aba 1
  renderGalleryThumbnails();

  // Preenche Aba 2: Modo Especialista (Detalhes Complexos)
  renderExpertTab(creature);

  // Preenche Aba 3: Galeria Expandida & Link Google Imagens
  renderFullGalleryGrid(currentGallery);
  btnSearchGoogleImages.href = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(creature.name + ' dinosaur fossil paleontology')}`;
  webImageSearchInput.value = '';

  // Configura a aba inicial
  if (isExpertMode) {
    switchWikiTab('tab-expert');
  } else {
    switchWikiTab('tab-overview');
  }

  // Exibe o modal
  wikiModal.classList.remove('hidden');
}

function renderGalleryThumbnails() {
  galleryCount.textContent = currentGallery.length;
  wikiGalleryThumbs.innerHTML = '';

  updateFeaturedImage(0);

  currentGallery.forEach((item, index) => {
    const thumb = document.createElement('div');
    thumb.className = `thumb-item ${index === 0 ? 'active' : ''}`;
    thumb.innerHTML = `<img src="${item.url}" alt="${item.caption}" onerror="this.onerror=null; this.src='${PLACEHOLDER_IMAGE}';">`;
    
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
  const item = currentGallery[index];
  wikiFeaturedImg.src = item.url;
  wikiFeaturedCaption.textContent = item.caption || 'Registro fotográfico / reconstituição';
}

function renderExpertTab(creature) {
  const expert = creature.expertData || {};

  // Cladograma
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

  // Osteologia
  expertOsteology.innerHTML = expert.osteology || '<p>Análise osteológica detalhada indisponível para este gênero.</p>';

  // Biomecânica
  expertBiomechanics.innerHTML = expert.biomechanics || '<p>Modelagem biomecânica em análise computacional.</p>';

  // Histologia
  expertHistology.innerHTML = expert.histology || '<p>Dados histológicos e taxas de crescimento com amostragem fóssil em andamento.</p>';
}

function renderFullGalleryGrid(images) {
  fullGalleryGrid.innerHTML = '';
  images.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.innerHTML = `
      <img src="${item.url}" alt="${item.caption}" loading="lazy" onerror="this.onerror=null; this.src='${PLACEHOLDER_IMAGE}';">
      <div class="gallery-card-caption">${item.caption}</div>
    `;
    card.addEventListener('click', () => openLightbox(index));
    fullGalleryGrid.appendChild(card);
  });
}

function switchWikiTab(targetTabId) {
  wikiTabs.forEach(tab => {
    if (tab.getAttribute('data-tab') === targetTabId) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  wikiTabContents.forEach(content => {
    if (content.id === targetTabId) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });

  // Se a aba do mapa foi ativada, inicializa ou redimensiona o Leaflet
  if (targetTabId === 'tab-map' && currentCreature) {
    initOrUpdateIntegratedMap(currentCreature.name);
  }
}

function closeWikiModal() {
  wikiModal.classList.add('hidden');
}

// ==========================================================================
// CONTROLE DO MODO ESPECIALISTA (TOGGLE)
// ==========================================================================

function setExpertMode(enabled) {
  isExpertMode = enabled;
  globalExpertToggle.checked = enabled;
  modalExpertToggle.checked = enabled;

  if (enabled) {
    document.body.classList.add('expert-mode-active');
    btnToggleExpertInFooter.textContent = 'Desativar Modo Especialista';
  } else {
    document.body.classList.remove('expert-mode-active');
    btnToggleExpertInFooter.textContent = 'Ativar Modo Especialista';
  }
}

// ==========================================================================
// BUSCA INTERATIVA DE IMAGENS NA WEB (COMMONS API & CHIPS)
// ==========================================================================

async function searchWebImages(keyword) {
  if (!currentCreature) return;
  webImagesLoading.classList.remove('hidden');

  try {
    const searchTerm = `${currentCreature.name} ${keyword || ''}`.trim();
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchTerm)}&gsrlimit=12&prop=imageinfo&iiprop=url|extmetadata&format=json&origin=*`;
    
    const res = await fetch(url);
    const data = res.ok ? await res.json() : null;
    webImagesLoading.classList.add('hidden');

    const newImages = [];

    if (data?.query?.pages) {
      Object.values(data.query.pages).forEach(page => {
        const info = page.imageinfo && page.imageinfo[0];
        if (info && info.url && (info.url.endsWith('.jpg') || info.url.endsWith('.png') || info.url.endsWith('.jpeg') || info.url.endsWith('.svg'))) {
          const desc = info.extmetadata?.ObjectName?.value || info.extmetadata?.ImageDescription?.value || page.title.replace('File:', '');
          const cleanDesc = desc.replace(/<[^>]*>?/gm, '').substring(0, 100);
          newImages.push({
            url: info.url,
            caption: cleanDesc || 'Fotografia fóssil / Reconstituição artística'
          });
        }
      });
    }

    if (newImages.length > 0) {
      renderFullGalleryGrid(newImages);
      // Atualiza a galeria ativa para navegação no lightbox
      currentGallery = newImages;
    } else {
      fullGalleryGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 2rem;">Nenhuma imagem adicional encontrada para o termo "${keyword}". Tente o botão acima para abrir o Google Imagens.</p>`;
    }
  } catch (err) {
    console.warn('Erro ao pesquisar imagens:', err);
    webImagesLoading.classList.add('hidden');
  }
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

  // Garante que o Leaflet recalcule o tamanho do container visível na aba
  setTimeout(() => leafletMap.invalidateSize(), 150);

  try {
    const url = `https://paleobiodb.org/data1.2/occs/list.json?base_name=${encodeURIComponent(creatureName)}&show=coords,loc&limit=80`;
    const res = await fetch(url);
    const data = res.ok ? await res.json() : { records: [] };
    const occurrences = data.records || [];

    integratedMapLoading.classList.add('hidden');

    if (occurrences.length === 0) {
      integratedMapSubtitle.textContent = `Nenhuma coordenada georreferenciada aberta retornada na PBDB para "${creatureName}".`;
      integratedMapCount.textContent = '0 locais';
      return;
    }

    integratedMapSubtitle.textContent = `Exibindo ${occurrences.length} locais de escavação georreferenciados no registro fóssil`;
    integratedMapCount.textContent = `${occurrences.length} sítios plotados`;

    const bounds = [];

    occurrences.forEach(occ => {
      if (occ.lat && occ.lng) {
        const marker = L.circleMarker([occ.lat, occ.lng], {
          radius: 7,
          fillColor: '#ea580c',
          color: '#ffffff',
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.85
        });

        const locationDesc = occ.cc2 ? `País: ${occ.cc2}` : 'Local fóssil';
        const formation = occ.sfm || occ.gfn ? `<br><strong>Formação:</strong> ${occ.sfm || occ.gfn}` : '';
        const interval = occ.eag && occ.lag ? `<br><strong>Datação:</strong> ${occ.eag} a ${occ.lag} Ma` : '';

        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 0.85rem;">
            <strong style="color: #ea580c; font-size: 0.95rem;">${creatureName}</strong><br>
            <span>${locationDesc}</span>
            ${formation}
            ${interval}
          </div>
        `);

        leafletMarkersLayer.addLayer(marker);
        bounds.push([occ.lat, occ.lng]);
      }
    });

    if (bounds.length > 0) {
      leafletMap.fitBounds(bounds, { padding: [30, 30], maxZoom: 5 });
    }
  } catch (err) {
    console.error('Erro no mapa PBDB integrado:', err);
    integratedMapLoading.classList.add('hidden');
    integratedMapSubtitle.textContent = 'Não foi possível carregar as coordenadas da PBDB no momento.';
  }
}

// ==========================================================================
// LIGHTBOX POP-UP DE IMAGENS EM TELA CHEIA
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
  lightboxCaption.textContent = item.caption || (currentCreature ? currentCreature.name : 'Registro fóssil');
  lightboxCounter.textContent = `Foto ${currentImageIndex + 1} de ${currentGallery.length}`;
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
// FILTROS E BUSCA PRINCIPAL
// ==========================================================================

async function performSearch(queryNames) {
  resultsContainer.innerHTML = '';
  emptyState.classList.add('hidden');
  loading.classList.remove('hidden');

  const selectedPeriod = periodFilter.value;
  const selectedGroup = groupFilter.value;
  const selectedDiet = dietFilter.value;

  let renderedCount = 0;

  for (const name of queryNames) {
    const data = await getCreatureData(name);
    if (!data) continue;

    // Filtros
    const matchesPeriod = 
      selectedPeriod === 'all' || 
      data.periodKey.toLowerCase() === selectedPeriod.toLowerCase() ||
      data.periodName.toLowerCase().includes(selectedPeriod.toLowerCase());

    const matchesGroup = 
      selectedGroup === 'all' || 
      data.group === selectedGroup;

    const matchesDiet = 
      selectedDiet === 'all' || 
      data.diet === selectedDiet ||
      (selectedDiet === 'carnivoro' && data.diet.includes('carnivoro'));

    if (matchesPeriod && matchesGroup && matchesDiet) {
      renderCard(data);
      renderedCount++;
    }
  }

  loading.classList.add('hidden');

  if (renderedCount === 0) {
    emptyState.classList.remove('hidden');
    resultsStats.textContent = 'Nenhum espécime encontrado com os filtros selecionados.';
  } else {
    resultsStats.textContent = `Exibindo ${renderedCount} ser(es) da Era Mesozoica no acervo`;
  }
}

// ==========================================================================
// REGISTRO DE EVENTOS (LISTENERS)
// ==========================================================================

function setupEventListeners() {
  // Toggle do Modo Especialista
  globalExpertToggle.addEventListener('change', (e) => setExpertMode(e.target.checked));
  modalExpertToggle.addEventListener('change', (e) => setExpertMode(e.target.checked));
  btnToggleExpertInFooter.addEventListener('click', () => setExpertMode(!isExpertMode));

  // Abas da Wiki
  wikiTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      switchWikiTab(target);
    });
  });

  // Busca de espécimes na página inicial
  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      performSearch([query]);
    } else {
      performSearch(PALEONTOLOGY_DATABASE.map(c => c.name));
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchBtn.click();
  });

  searchInput.addEventListener('input', () => {
    if (searchInput.value.trim()) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.classList.add('hidden');
    searchInput.focus();
    performSearch(PALEONTOLOGY_DATABASE.map(c => c.name));
  });

  // Filtros dinâmicos
  [periodFilter, groupFilter, dietFilter].forEach(filter => {
    filter.addEventListener('change', () => {
      const query = searchInput.value.trim();
      if (query) {
        performSearch([query]);
      } else {
        performSearch(PALEONTOLOGY_DATABASE.map(c => c.name));
      }
    });
  });

  resetFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.classList.add('hidden');
    periodFilter.value = 'all';
    groupFilter.value = 'all';
    dietFilter.value = 'all';
    quickTags.forEach(t => t.classList.remove('active'));
    performSearch(PALEONTOLOGY_DATABASE.map(c => c.name));
  });

  reloadSuggestionsBtn.addEventListener('click', () => {
    resetFiltersBtn.click();
  });

  // Chips de espécimes rápidos
  quickTags.forEach(tag => {
    tag.addEventListener('click', () => {
      quickTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      const creature = tag.getAttribute('data-name');
      searchInput.value = creature;
      clearBtn.classList.remove('hidden');
      performSearch([creature]);
    });
  });

  // Pesquisa de imagens na web
  btnSearchWebImages.addEventListener('click', () => {
    const term = webImageSearchInput.value.trim();
    searchWebImages(term);
  });

  webImageSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      btnSearchWebImages.click();
    }
  });

  // Chips de termos de imagem
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

  // Eventos de fechar o Modal da Wiki
  closeWikiBtn.addEventListener('click', closeWikiModal);
  btnCloseWikiFooter.addEventListener('click', closeWikiModal);
  wikiModalBackdrop.addEventListener('click', closeWikiModal);

  // Botão de zoom na imagem de destaque
  btnZoomFeatured.addEventListener('click', () => openLightbox(currentImageIndex));

  // Lightbox
  closeLightboxBtn.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  lightboxNextBtn.addEventListener('click', nextLightboxImage);
  lightboxPrevBtn.addEventListener('click', prevLightboxImage);

  // Atalhos de teclado globais
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

// Inicialização da aplicação
window.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  performSearch(PALEONTOLOGY_DATABASE.map(c => c.name));
});
