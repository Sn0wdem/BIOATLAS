/**
 * Enciclopédia & Wiki da Era Mesozoica
 * Sistema próprio e 100% interativo de Dossiês Paleontológicos,
 * Galerias de Imagens com Pop-up (Lightbox) e Mapeamento PBDB via Leaflet.
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

// Elementos do Modal da Wiki Própria
const wikiModal = document.getElementById('wikiModal');
const wikiModalBackdrop = document.getElementById('wikiModalBackdrop');
const closeWikiBtn = document.getElementById('closeWikiBtn');
const wikiTitle = document.getElementById('wikiTitle');
const wikiEtymology = document.getElementById('wikiEtymology');
const wikiPeriodBadge = document.getElementById('wikiPeriodBadge');
const wikiGroupBadge = document.getElementById('wikiGroupBadge');
const wikiDietBadge = document.getElementById('wikiDietBadge');
const wikiFeaturedImg = document.getElementById('wikiFeaturedImg');
const wikiFeaturedCaption = document.getElementById('wikiFeaturedCaption');
const wikiGalleryThumbs = document.getElementById('wikiGalleryThumbs');
const galleryCount = document.getElementById('galleryCount');
const btnZoomFeatured = document.getElementById('btnZoomFeatured');
const btnOpenMapFromWiki = document.getElementById('btnOpenMapFromWiki');

// Ficha técnica da Wiki
const specLength = document.getElementById('specLength');
const specHeight = document.getElementById('specHeight');
const specWeight = document.getElementById('specWeight');
const specSpeed = document.getElementById('specSpeed');
const specPeriod = document.getElementById('specPeriod');
const specLocation = document.getElementById('specLocation');
const wikiBioText = document.getElementById('wikiBioText');
const wikiCuriositiesList = document.getElementById('wikiCuriositiesList');

// Elementos do Modal Lightbox de Imagens
const lightboxModal = document.getElementById('lightboxModal');
const lightboxBackdrop = document.getElementById('lightboxBackdrop');
const closeLightboxBtn = document.getElementById('closeLightboxBtn');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
const lightboxNextBtn = document.getElementById('lightboxNextBtn');

// Elementos do Modal do Mapa
const mapModal = document.getElementById('mapModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const mapLoading = document.getElementById('mapLoading');
const mapOccurrencesCount = document.getElementById('mapOccurrencesCount');

// Estado interno do Lightbox e do Mapa
let currentGallery = [];
let currentImageIndex = 0;
let currentActiveCreature = null;
let leafletMap = null;
let leafletMarkersLayer = null;

// Placeholder SVG resiliente caso alguma imagem falhe
const PLACEHOLDER_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22260%22%20viewBox%3D%220%200%20400%20260%22%3E%3Crect%20fill%3D%22%23161c16%22%20width%3D%22400%22%20height%3D%22260%22%2F%3E%3Ctext%20fill%3D%22%234ade80%22%20font-family%3D%22system-ui%22%20font-size%3D%2246%22%20x%3D%2250%25%22%20y%3D%2245%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3E%F0%9F%A6%95%3C%2Ftext%3E%3Ctext%20fill%3D%22%238fa38f%22%20font-family%3D%22system-ui%22%20font-size%3D%2214%22%20x%3D%2250%25%22%20y%3D%2268%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3EIlustra%C3%A7%C3%A3o%20Paleontol%C3%B3gica%3C%2Ftext%3E%3C%2Fsvg%3E";

// ==========================================================================
// ACERVO CIENTÍFICO CURADO (WIKI PALEONTOLÓGICA EMBUTIDA)
// ==========================================================================
const MESOZOIC_WIKI_DATABASE = [
  {
    name: 'Tyrannosaurus',
    species: 'Tyrannosaurus rex',
    commonName: 'Tiranossauro Rex',
    etymology: 'Do grego: "Rei dos lagartos tiranos" • Descrito em 1905 por Henry Fairfield Osborn',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Superior (68 – 66 Ma)',
    group: 'dinossauro',
    groupName: 'Terópode Terrestre',
    diet: 'carnivoro',
    dietName: 'Carnívoro de Topo',
    length: '12,3 a 12,8 metros',
    height: '3,7 a 4,0 metros (quadris)',
    weight: '8,4 a 14 toneladas',
    speed: '20 a 27 km/h',
    location: 'América do Norte (Hell Creek, Lance, Scollard)',
    bio: 'O Tyrannosaurus rex é um dos maiores predadores terrestres de todos os tempos. Possuía uma mordida com força estimada entre 35.000 e 57.000 Newtons, suficiente para estraçalhar ossos de ceratopsídeos e hadrossauros. Seus dentes serrilhados mediam até 30 cm de comprimento com as raízes. Apresentava olfato altamente desenvolvido e visão binocular superior à da maioria dos carnívoros.',
    curiosities: [
      'A mordida do T-Rex exercia a maior pressão craniana já registrada entre todos os animais terrestres conhecidos.',
      'Apesar de seus braços parecerem desproporcionais, eram extremamente fortes e podiam erguer mais de 200 kg cada.',
      'O fóssil mais completo já encontrado é apelidado de "Sue", medindo 12,3 metros e preservando mais de 90% do esqueleto original.',
      'Evidências fósseis indicam que os jovens eram esguios e velozes, assumindo nichos de caça diferentes dos espécimes adultos mais robustos.'
    ],
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Tyrannosaurus_rex_mmartyniuk.png/800px-Tyrannosaurus_rex_mmartyniuk.png',
        caption: 'Reconstituição paleoartística em vida do espécime adulto'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Tyrannosaurus_rex_Sue_at_The_Field_Museum_02.jpg/800px-Tyrannosaurus_rex_Sue_at_The_Field_Museum_02.jpg',
        caption: 'Esqueleto completo de "Sue" em exibição no Field Museum de Chicago'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Tyrannosaurus_skull.jpg/800px-Tyrannosaurus_skull.jpg',
        caption: 'Crânio maciço com dentição especializada em perfurar e esmagar ossos'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/T-rex_scale.svg/800px-T-rex_scale.svg.png',
        caption: 'Diagrama científico de comparação de escala com um ser humano'
      }
    ]
  },
  {
    name: 'Spinosaurus',
    species: 'Spinosaurus aegyptiacus',
    commonName: 'Espinossauro',
    etymology: 'Do grego: "Lagarto com espinhos" • Descrito em 1915 por Ernst Stromer',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Superior (99 – 93 Ma)',
    group: 'dinossauro',
    groupName: 'Dinossauro Semiaquático',
    diet: 'carnivoro',
    dietName: 'Carnívoro / Piscívoro',
    length: '14,0 a 16,0 metros',
    height: '4,5 a 5,4 metros (vela)',
    weight: '7,0 a 9,0 toneladas',
    speed: '15 km/h (terra) / 25 km/h (água)',
    location: 'Norte da África (Egito e Marrocos - Kem Kem)',
    bio: 'O Spinosaurus é o mais longo dinossauro carnívoro conhecido, superando até mesmo o T-Rex e o Giganotosaurus. Caracterizado por uma monumental vela dorsal de espinhos ósseos que chegavam a 1,8 metro de altura, possuía focinho alongado como o de um crocodilo e dentes cônicos lisos ideais para capturar grandes peixes pré-históricos como Onchopristis. Descobertas recentes de sua cauda em forma de remo confirmam sua adaptação à propulsão aquática.',
    curiosities: [
      'Foi o primeiro dinossauro confirmado com fortes adaptações semiaquáticas e cauda adaptada para natação.',
      'Os fósseis originais descritos por Ernst Stromer em Munique foram destruídos durante bombardeios da Segunda Guerra Mundial em 1944.',
      'Possuía receptores de pressão neurovasculares no focinho semelhantes aos dos crocodilianos para detectar movimentos na água lamacenta.',
      'Sua vela dorsal provavelmente auxiliava na termorregulação, cortejo e intimidação visual contra outros grandes predadores.'
    ],
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Spinosaurus_life_restoration.png/800px-Spinosaurus_life_restoration.png',
        caption: 'Reconstituição atualizada do Spinosaurus com sua cauda natatória em remo'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Spinosaurus_mount.jpg/800px-Spinosaurus_mount.jpg',
        caption: 'Montagem esquelética completa demonstrando a postura aquática'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Spinosaurus_scale.svg/800px-Spinosaurus_scale.svg.png',
        caption: 'Comparativo de escala métrica entre o Spinosaurus e o ser humano'
      }
    ]
  },
  {
    name: 'Triceratops',
    species: 'Triceratops horridus',
    commonName: 'Tricerátops',
    etymology: 'Do grego: "Face com três chifres" • Descrito em 1889 por Othniel Charles Marsh',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Superior (68 – 66 Ma)',
    group: 'dinossauro',
    groupName: 'Ceratopsídeo Terrestre',
    diet: 'herbivoro',
    dietName: 'Herbívoro Quadrúpede',
    length: '8,0 a 9,0 metros',
    height: '2,9 a 3,0 metros',
    weight: '6,0 a 10,0 toneladas',
    speed: '25 a 30 km/h',
    location: 'América do Norte (Hell Creek, Lance, Frenchman)',
    bio: 'O Triceratops ostentava um dos maiores crânios de qualquer animal terrestre, atingindo até 2,5 metros de comprimento. Possuía dois longos chifres sobre os olhos de até 1 metro e um chifre menor sobre o nariz, além de um escudo ósseo maciço e sólido na nuca. Sua mandíbula contava com baterias de centenas de dentes cortantes continuamente renovados para mastigar vegetação fibrosa de cicadáceas e palmeiras.',
    curiosities: [
      'Marcas de mordidas curadas de T-Rex já foram encontradas em escudos de Triceratops, comprovando que travaram combates épicos.',
      'Diferente de outros ceratopsídeos que tinham aberturas no escudo ósseo, o escudo do Triceratops era completamente maciço e denso.',
      'O paleontólogo O. C. Marsh pensou inicialmente que o primeiro par de chifres descoberto pertencia a um bisão pré-histórico extinto.',
      'Seu bico córneo estreito e pontiagudo era perfeito para cortar folhagens resistentes rente ao solo.'
    ],
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Triceratops_prorsus_clean.png/800px-Triceratops_prorsus_clean.png',
        caption: 'Reconstituição paleoartística do Triceratops em seu ecossistema florestal'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Triceratops_BW.jpg/800px-Triceratops_BW.jpg',
        caption: 'Esqueleto completo montado no Museu Americano de História Natural'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Triceratops_scale.svg/800px-Triceratops_scale.svg.png',
        caption: 'Proporção de escala do espécime adulto em relação a um humano médio'
      }
    ]
  },
  {
    name: 'Velociraptor',
    species: 'Velociraptor mongoliensis',
    commonName: 'Velociraptor',
    etymology: 'Do latim: "Ladrão veloz" • Descrito em 1924 por Henry Fairfield Osborn',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Superior (75 – 71 Ma)',
    group: 'dinossauro',
    groupName: 'Dromeossaurídeo Emplumado',
    diet: 'carnivoro',
    dietName: 'Carnívoro Ágil',
    length: '1,8 a 2,0 metros',
    height: '0,5 metros (quadril)',
    weight: '15 a 20 kg',
    speed: '35 a 40 km/h',
    location: 'Deserto de Gobi (Mongólia e China - Djadochta)',
    bio: 'Contrariando as representações cinematográficas do cinema que o retratam do tamanho de um homem, o Velociraptor real tinha aproximadamente o porte de um peru grande ou lobo pequeno, com o corpo coberto por plumagem aerodinâmica e asas nas patas dianteiras. A sua arma mais letal era uma garra curvada em forma de foice de 7 cm no segundo dedo de cada pata traseira, usada para perfurar traqueias e artérias de suas presas.',
    curiosities: [
      'Em 2007, cientistas descobriram papilas ulnares (marcas onde penas se conectavam aos ossos) em fósseis de Velociraptor.',
      'O espécime mais célebre é o fóssil dos "Dinossauros em Combate", preservado junto a um Protoceratops em luta mortal sob uma duna desabada.',
      'Possuía cauda rígida com tendões ossificados que funcionava como contrapeso para curvas rápidas em alta velocidade.',
      'Tinha cérebro proporcionalmente grande para um réptil, sugerindo inteligência, sentidos apurados e capacidade de emboscada.'
    ],
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Velociraptor_restoration.jpg/800px-Velociraptor_restoration.jpg',
        caption: 'Reconstituição científica moderna do Velociraptor com plumagem real'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Velociraptor_skeleton.png/800px-Velociraptor_skeleton.png',
        caption: 'Esqueleto fóssil destacando a garra curva retrátil do pé traseiro'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Velociraptor_scale.svg/800px-Velociraptor_scale.svg.png',
        caption: 'Escala real do Velociraptor comparado ao tamanho de um humano'
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
    dietName: 'Herbívoro Rasteiro',
    length: '9,0 metros',
    height: '4,0 metros (até as placas)',
    weight: '4,5 a 7,0 toneladas',
    speed: '12 a 15 km/h',
    location: 'América do Norte e Portugal (Morrison Formation)',
    bio: 'O Stegosaurus é famoso pela fileira alternada de até 17 placas ósseas triangulares verticais que percorriam seu dorso e pelo "tagomizador" na ponta da cauda — quatro espinhos pontiagudos de até 90 cm capazes de desferir golpes fatais em predadores como o Allosaurus. Seu cérebro tinha o volume de uma noz (cerca de 80 gramas), mas o animal era altamente adaptado a seu ecossistema jurássico.',
    curiosities: [
      'O termo "tagomizador" para os espinhos da cauda foi cunhado em 1982 por uma tirinha do cartunista Gary Larson e depois adotado pela ciência oficial.',
      'Placas do dorso possuíam canais para vasos sanguíneos, sugerindo que serviam para termorregulação ou mudança de cor no cortejo.',
      'Sua cabeça ficava posicionada a menos de 1 metro do solo, permitindo alimentar-se de samambaias, cavalinhas e musgos jurássicos.',
      'Fósseis de Allosaurus já foram encontrados com vértebras perfuradas exatamente no formato de um espinho de Stegosaurus.'
    ],
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Stegosaurus_stenops_life_restoration.png/800px-Stegosaurus_stenops_life_restoration.png',
        caption: 'Reconstituição paleoartística do Stegosaurus com suas placas ósseas dorsais'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Stegosaurus_skeleton.jpg/800px-Stegosaurus_skeleton.jpg',
        caption: 'Montagem esquelética completa do espécime "Sophie" no Museu de História Natural de Londres'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Stegosaurus_scale.svg/800px-Stegosaurus_scale.svg.png',
        caption: 'Comparação de tamanho e escala entre o Stegosaurus e um humano'
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
    groupName: 'Saurópode Gigante',
    diet: 'herbivoro',
    dietName: 'Herbívoro de Copa Alta',
    length: '26 a 30 metros',
    height: '12 a 13 metros (cabeça)',
    weight: '30 a 50 toneladas',
    speed: '10 a 15 km/h',
    location: 'América do Norte (Morrison) e África',
    bio: 'O Brachiosaurus se destacava dos demais saurópodes por possuir as patas dianteiras substancialmente mais longas que as traseiras, conferindo-lhe uma postura inclinada semelhante à de uma girafa colossal. Isso lhe permitia pastar nas copas das coníferas e cicadáceas a até 13 metros do solo sem precisar erguer os quadris. Seu coração gigantesco pesava mais de 200 kg para conseguir bombear sangue até a cabeça.',
    curiosities: [
      'Suas narinas ficavam situadas no topo da cabeça, o que antigamente fez paleontólogos cogitarem erroneamente que ele vivia submerso.',
      'Consumia até 400 kg de folhagens por dia para sustentar seu colossal metabolismo de gigantotermia.',
      'Seus ossos continham sacos aéreos internos que reduziam o peso total do esqueleto sem comprometer a resistência mecânica.',
      'Engolia gastrólitos (pedras estomacais) para ajudar na trituração das folhas duras ingeridas inteiras sem mastigação prévia.'
    ],
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Brachiosaurus_DB.jpg/800px-Brachiosaurus_DB.jpg',
        caption: 'Reconstituição paleoartística do Brachiosaurus alimentando-se nas copas altas'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Brachiosaurus_skeleton_Berlin.jpg/800px-Brachiosaurus_skeleton_Berlin.jpg',
        caption: 'O maior esqueleto montado do mundo no Museu de História Natural de Berlim'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Brachiosaurus_scale.svg/800px-Brachiosaurus_scale.svg.png',
        caption: 'Comparativo monumental de altura com um ser humano'
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
    groupName: 'Terópode Terrestre',
    diet: 'carnivoro',
    dietName: 'Carnívoro de Topo Jurássico',
    length: '8,5 a 10 metros',
    height: '3,0 a 3,3 metros',
    weight: '2,0 a 2,5 toneladas',
    speed: '30 a 40 km/h',
    location: 'América do Norte (Morrison Formation) e Portugal',
    bio: 'O Allosaurus era o predador dominante indiscutível das planícies do período Jurássico Superior. Seu crânio levemente construído possuía articulações cinéticas que permitiam uma ampla abertura de mandíbula, funcionando como um machado de corte para golpear carnes macias de saurópodes e estegossauros. Suas garras dianteiras de três dedos eram grandes e curvas para agarrar presas em movimento.',
    curiosities: [
      'No sítio fóssil de Cleveland-Lloyd em Utah (EUA), mais de 12.000 ossos de Allosaurus foram desenterrados juntos em uma antiga armadilha de lama.',
      'Possuía duas pequenas cristas ósseas acima dos olhos que provavelmente eram coloridas em vida para exibição e acasalamento.',
      'Suas mandíbulas abriam em um ângulo impressionante de até 92 graus, superior à de quase todos os predadores terrestres.',
      'Constantes quebras e cicatrizações nos ossos de Allosaurus revelam que ele vivia em disputas violentas e caçadas brutais.'
    ],
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Allosaurus_fragilis_life_restoration.png/800px-Allosaurus_fragilis_life_restoration.png',
        caption: 'Reconstituição do Allosaurus fragilis em caçada ativa'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Allosaurus_skeleton.jpg/800px-Allosaurus_skeleton.jpg',
        caption: 'Esqueleto completo de Allosaurus no Museu de História Natural de San Diego'
      }
    ]
  },
  {
    name: 'Mosasaurus',
    species: 'Mosasaurus hoffmannii',
    commonName: 'Mossassauro',
    etymology: 'Do latim/grego: "Lagarto do Rio Mosa" • Descrito em 1822 por William Daniel Conybeare',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Superior (82 – 66 Ma)',
    group: 'reptil-marinho',
    groupName: 'Réptil Marinho Gigante',
    diet: 'carnivoro',
    dietName: 'Superpredador Oceânico',
    length: '14 a 17 metros',
    height: 'Corpo serpentino hidrodinâmico',
    weight: '10 a 15 toneladas',
    speed: '35 a 45 km/h',
    location: 'Oceanos globais (Europa, América do Norte e África)',
    bio: 'O Mosasaurus não era um dinossauro, mas sim um parente ancestral aquático dos lagartos monitores modernos (como o Dragão de Comodo) e das serpentes. Reinou como o governante absoluto dos mares do Cretáceo Superior. Possuía nadadeiras em forma de remo, cauda bilobada semelhante à de tubarões e uma segunda fileira de dentes no céu da boca (dentes pterigóideos) que impedia presas escorregadias de escaparem.',
    curiosities: [
      'Foi um dos primeiros grandes animais fósseis já descobertos pela ciência moderna, encontrado em Maastricht (Holanda) em 1764.',
      'Fósseis preservam conchas de amonites com marcas perfeitas de perfuração causadas pela mordida do Mosasaurus.',
      'Respirava ar atmosférico e precisava subir à superfície periodicamente para encher os pulmões, dando à luz filhotes vivos na água.',
      'Sua mandíbula inferior possuía articulação intramandibular flexível como a das cobras para engolir animais de grande porte.'
    ],
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Mosasaurus_hoffmanni.png/800px-Mosasaurus_hoffmanni.png',
        caption: 'Reconstituição científica do Mosasaurus caçando nos oceanos do Cretáceo'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Mosasaurus_beaugi.jpg/800px-Mosasaurus_beaugi.jpg',
        caption: 'Crânio fóssil de Mosasaurus revelando a dupla fileira de dentes de retenção'
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
    groupName: 'Pterossauro Voador',
    diet: 'piscivoro',
    dietName: 'Piscívoro Oceânico',
    length: 'Envergadura de 6 a 7 metros',
    height: '1,8 metro (pousado)',
    weight: '20 a 35 kg',
    speed: '60 a 80 km/h (planar)',
    location: 'América do Norte (Niobrara Chalk Formation)',
    bio: 'O Pteranodon era um réptil voador colossal do grupo dos pterossauros (não um dinossauro). Com uma envergadura alar de até 7 metros, possuía ossos pneumáticos ocos e finos como papel para manter peso mínimo. Planava por centenas de quilômetros sobre o Mar Interior Ocidental da América do Norte, mergulhando o bico afiado desprovido de dentes para capturar peixes e lulas pré-históricas.',
    curiosities: [
      'Sua longa crista óssea na parte posterior da cabeça funcionava tanto como leme aerodinâmico quanto como exibição sexual nos machos adultos.',
      'Não possuía nenhum dente no bico córneo; engolia suas presas inteiras, como os pelicanos e albatrozes modernos.',
      'Mais de 1.100 espécimes fósseis de Pteranodon já foram catalogados, tornando-o um dos pterossauros mais bem conhecidos da paleontologia.',
      'Apesar de sua envergadura gigantesca equivalente à de uma aeronave leve, pesava pouco mais de 30 kg graças ao esqueleto ultra-leve.'
    ],
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Pteranodon_longiceps_mmartyniuk.png/800px-Pteranodon_longiceps_mmartyniuk.png',
        caption: 'Reconstituição do Pteranodon sobrevoando os litorais cretáceos'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Pteranodon_skeleton.jpg/800px-Pteranodon_skeleton.jpg',
        caption: 'Esqueleto fóssil suspenso em posição de voo planar'
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
    location: 'América do Norte (Hell Creek, Lance, Scollard)',
    bio: 'Apelidado de "tanque vivo do Cretáceo", o Ankylosaurus era totalmente revestido por osteodermas — placas ósseas fundidas à pele reforçadas com queratina — que cobriam até suas pálpebras. Na ponta de sua cauda rígida havia uma massa óssea maciça de até 60 kg com poder de impacto suficiente para fraturar os ossos da perna de qualquer predador, inclusive o T-Rex.',
    curiosities: [
      'Sua única fraqueza vulnerável era o abdômen sem carapaça; para feri-lo, predadores precisavam tentar virá-lo de cabeça para baixo.',
      'Possuía passagens nasais complexas em espiral que resfriavam o ar inalado e apuravam sua capacidade olfativa no ambiente cretáceo.',
      'A clava da cauda era sustentada por vértebras posteriores totalmente fundidas em uma haste de suporte indeformável.',
      'Dentes pequenos e em formato de folha eram usados para raspar vegetações tenras, arbustos e raízes próximas ao solo.'
    ],
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Ankylosaurus_magniventris.png/800px-Ankylosaurus_magniventris.png',
        caption: 'Reconstituição da couraça óssea impenetrável do Ankylosaurus'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Ankylosaurus_scale.svg/800px-Ankylosaurus_scale.svg.png',
        caption: 'Proporção de altura e largura comparada a um ser humano'
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
    groupName: 'Abelissaurídeo Terrestre',
    diet: 'carnivoro',
    dietName: 'Carnívoro Veloz',
    length: '7,5 a 9,0 metros',
    height: '2,8 a 3,0 metros',
    weight: '1,5 a 2,0 toneladas',
    speed: '48 a 55 km/h',
    location: 'Patagônia, Argentina (La Colonia Formation)',
    bio: 'Descoberto na Argentina pelo paleontólogo José Bonaparte, o Carnotaurus é um dos terópodes mais singulares já encontrados. Ostentava dois robustos chifres ósseos frontais voltados para cima e para fora. Suas patas dianteiras eram extremamente atrofiadas (menores que as do T-Rex), mas suas patas traseiras e musculatura caudal (caudofemoralis) eram hipertrofiadas, fazendo dele o "guepardo" dos dinossauros do Cretáceo.',
    curiosities: [
      'Foi o primeiro grande terópode encontrado com impressões fósseis de pele preservada quase por completo, revelando escamas e nódulos.',
      'Seus chifres eram revestidos por uma bainha de queratina espessa e podiam ser usados em disputas de cabeçadas entre machos da espécie.',
      'Estudos biomecânicos apontam que ele conseguia acelerar em linha reta a mais de 50 km/h graças à hipertrofia do músculo caudofemoral.',
      'Seus braços diminutos não possuíam articulação de punho funcional e tinham 4 pequenos dedos imóveis.'
    ],
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Carnotaurus_sastrei_life_restoration.png/800px-Carnotaurus_sastrei_life_restoration.png',
        caption: 'Reconstituição artística do Carnotauro patagônico com seus chifres frontais'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Carnotaurus_skeleton.jpg/800px-Carnotaurus_skeleton.jpg',
        caption: 'Esqueleto fóssil original em exibição no Museu Argentino de Ciências Naturais'
      }
    ]
  },
  {
    name: 'Plesiosaurus',
    species: 'Plesiosaurus dolichodeirus',
    commonName: 'Plesiossauro',
    etymology: 'Do grego: "Próximo a lagarto" • Descrito em 1821 por Henry De la Beche e William Conybeare',
    periodKey: 'Jurassic',
    periodName: 'Jurássico Inferior (199 – 175 Ma)',
    group: 'reptil-marinho',
    groupName: 'Plesiossauro Aquático',
    diet: 'piscivoro',
    dietName: 'Piscívoro Marinho',
    length: '3,5 a 4,5 metros',
    height: 'Pescoço longo com 40 vértebras',
    weight: '400 a 500 kg',
    speed: '15 a 20 km/h',
    location: 'Inglaterra e Europa Ocidental (Lyme Regis)',
    bio: 'O Plesiosaurus é o réptil marinho que inspirou o mito moderno do Monstro do Lago Ness. Possuía um pescoço esguio extraordinariamente longo com cerca de 40 vértebras cervicais, cabeça pequena e quatro grandes nadadeiras em forma de asa que realizavam movimento de "voo subaquático" simétrico semelhante ao dos pinguins e tartarugas marinhas modernas.',
    curiosities: [
      'O primeiro esqueleto completo de Plesiosaurus foi desenterrado em 1823 pela célebre paleontóloga pioneira Mary Anning nos penhascos de Dorset.',
      'Diferente do mito popular, a estrutura de seu pescoço não lhe permitia erguê-lo fora da água em formato de cisne.',
      'Seus dentes afiados e entrelaçados formavam uma armadilha perfeita para capturar peixes rápidos e cefalópodes pré-históricos.',
      'Engolia pedras arredondadas (gastrólitos) que serviam como lastro para controlar a flutuabilidade nas diferentes profundidades marinhas.'
    ],
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Plesiosaurus_dolichodeirus.png/800px-Plesiosaurus_dolichodeirus.png',
        caption: 'Reconstituição do nado subaquático do Plesiosaurus'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Plesiosaurus_skeleton.jpg/800px-Plesiosaurus_skeleton.jpg',
        caption: 'Fóssil histórico descoberto por Mary Anning no Museu de História Natural de Londres'
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
    groupName: 'Dinossauro Primitivo',
    diet: 'carnivoro',
    dietName: 'Carnívoro Bípede',
    length: '2,5 a 3,0 metros',
    height: '1,0 metro',
    weight: '15 a 25 kg',
    speed: '40 a 50 km/h',
    location: 'América do Norte (Ghost Ranch, Novo México)',
    bio: 'Um dos mais antigos e bem-sucedidos dinossauros do início da Era Mesozoica. O Coelophysis possuía corpo esguio, ossos ocos e pernas longas adaptadas para corridas ágeis. Caçava pequenos répteis, anfíbios e insetos durante o árido período Triássico Superior, representando a alvorada do domínio dos dinossauros sobre o planeta.',
    curiosities: [
      'Em 1947, paleontólogos descobriram milhares de esqueletos de Coelophysis fossilizados juntos em Ghost Ranch (Novo México).',
      'Um crânio de Coelophysis foi levado ao espaço a bordo do ônibus espacial Endeavour em 1998.',
      'Durante décadas acreditou-se que praticavam canibalismo, mas análises de 2006 revelaram que os ossos em seus estômagos eram de crocodilomorfos primitivos.',
      'Suas mãos tinham 4 dedos com garras afiadas, mostrando características de transição dos arcossauros basais.'
    ],
    gallery: [
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Coelophysis_bauri.png/800px-Coelophysis_bauri.png',
        caption: 'Reconstituição do Coelophysis bauri bípede e veloz'
      }
    ]
  }
];

// Cache em memória para requisições de espécimes pesquisados
const dynamicCache = new Map();

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
 * busque um espécime fora do acervo pré-curado, montando uma ficha própria.
 */
async function fetchCustomSpecimenData(query) {
  if (dynamicCache.has(query.toLowerCase())) {
    return dynamicCache.get(query.toLowerCase());
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
      console.warn('PBDB offline ou inacessível:', e);
    }

    // 2. Consulta resumo na Wikipedia PT (com fallback EN)
    let wikiData = null;
    let wikiRes = await fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
    if (wikiRes.ok) {
      wikiData = await wikiRes.json();
    }
    if (!wikiData || !wikiData.extract) {
      wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
      if (wikiRes.ok) {
        wikiData = await wikiRes.json();
      }
    }

    if (!wikiData && !taxon) return null;

    // 3. Monta galeria inicial com thumbnail
    const mainImg = wikiData?.thumbnail?.source || wikiData?.originalimage?.source || PLACEHOLDER_IMAGE;
    const gallery = [
      {
        url: mainImg,
        caption: 'Registro visual catalogado do espécime'
      }
    ];

    // Tenta enriquecer a galeria buscando lista de mídias da página
    try {
      const mediaRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(query)}`);
      if (mediaRes.ok) {
        const mediaJson = await mediaRes.json();
        if (mediaJson.items && mediaJson.items.length > 0) {
          mediaJson.items.slice(0, 4).forEach(item => {
            if (item.type === 'image' && item.srcset && item.srcset.length > 0) {
              const bestSrc = item.srcset[item.srcset.length - 1].src;
              const fullUrl = bestSrc.startsWith('//') ? `https:${bestSrc}` : bestSrc;
              if (fullUrl !== mainImg) {
                gallery.push({
                  url: fullUrl,
                  caption: item.caption?.text || 'Fotografia fóssil / Reconstituição artística'
                });
              }
            }
          });
        }
      }
    } catch (err) {
      console.warn('Não foi possível carregar mídias adicionais:', err);
    }

    // Normaliza período
    let periodKey = 'Mesozoic';
    let periodName = taxon?.tei ? `${taxon.tei} ${taxon.tli && taxon.tli !== taxon.tei ? `a ${taxon.tli}` : ''}` : 'Era Mesozoica';
    const lowerPeriod = periodName.toLowerCase();
    if (lowerPeriod.includes('trias') || lowerPeriod.includes('triáss')) periodKey = 'Triassic';
    else if (lowerPeriod.includes('juras') || lowerPeriod.includes('juráss')) periodKey = 'Jurassic';
    else if (lowerPeriod.includes('cretac') || lowerPeriod.includes('cretác')) periodKey = 'Cretaceous';

    const compiledData = {
      name: taxon?.nam || wikiData?.title || query,
      species: `${taxon?.nam || query} sp.`,
      commonName: wikiData?.title || query,
      etymology: `Gênero paleontológico catalogado no registro da PBDB (${taxon?.rnk || 'gênero'})`,
      periodKey: periodKey,
      periodName: periodName,
      group: 'dinossauro',
      groupName: 'Espécime Fóssil Catalogado',
      diet: 'desconhecido',
      dietName: 'Estudo Paleontológico',
      length: 'Consulte literatura fóssil',
      height: 'Variável por espécime',
      weight: 'Sob análise de estirpe',
      speed: 'Em estudo biomecânico',
      location: 'Sítios fósseis mundiais (ver mapa)',
      bio: wikiData?.extract || 'Espécime da Era Mesozoica catalogado com ocorrências geológicas registradas.',
      curiosities: [
        `Gênero classificado na Paleobiology Database sob o registro taxonômico oficial.`,
        `Possui ocorrências fósseis georreferenciadas mapeadas pela comunidade científica internacional.`
      ],
      gallery: gallery
    };

    dynamicCache.set(query.toLowerCase(), compiledData);
    return compiledData;
  } catch (error) {
    console.error('Erro na compilação do espécime customizado:', error);
    return null;
  }
}

/**
 * Retorna dados completos do espécime (ou do acervo curado ou dinâmico)
 */
async function getCreature(query) {
  const found = MESOZOIC_WIKI_DATABASE.find(
    c => c.name.toLowerCase() === query.toLowerCase() ||
         c.commonName.toLowerCase() === query.toLowerCase() ||
         c.species.toLowerCase().includes(query.toLowerCase())
  );
  if (found) return found;
  return await fetchCustomSpecimenData(query);
}

// ==========================================================================
// RENDERIZAÇÃO DE CARDS DA PÁGINA
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
        ${imageCount} foto${imageCount > 1 ? 's' : ''}
      </span>
    </div>

    <div class="card-content">
      <div class="card-title-row">
        <h3 class="card-title">${item.name}</h3>
        <span class="card-rank">${item.groupName}</span>
      </div>
      
      <div class="card-meta-chips">
        <span class="chip">🍖 ${item.dietName}</span>
        <span class="chip">⏳ ${item.periodName}</span>
      </div>

      <p class="card-desc">${item.bio}</p>

      <div class="card-actions">
        <button class="btn-card-dossier" data-creature="${item.name}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          Abrir Dossiê & Fotos
        </button>

        <button class="btn-card-map" data-creature="${item.name}">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
            <line x1="8" y1="2" x2="8" y2="18"></line>
            <line x1="16" y1="6" x2="16" y2="22"></line>
          </svg>
          Fósseis no Mapa
        </button>
      </div>
    </div>
  `;

  // Ações de clique para abrir a Wiki Própria
  const openWiki = () => openWikiModal(item);
  card.querySelector('.card-image-wrap').addEventListener('click', openWiki);
  card.querySelector('.card-title').addEventListener('click', openWiki);
  card.querySelector('.btn-card-dossier').addEventListener('click', openWiki);

  // Ação de clique para o mapa
  card.querySelector('.btn-card-map').addEventListener('click', (e) => {
    e.stopPropagation();
    openFossilMap(item.name);
  });

  resultsContainer.appendChild(card);
}

// ==========================================================================
// WIKI INTERATIVA PROPRIA: MODAL DO DOSSIÊ DO ESPÉCIME
// ==========================================================================

function openWikiModal(creature) {
  currentActiveCreature = creature;
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

  // Ficha técnica
  specLength.textContent = creature.length || '-';
  specHeight.textContent = creature.height || '-';
  specWeight.textContent = creature.weight || '-';
  specSpeed.textContent = creature.speed || '-';
  specPeriod.textContent = creature.periodName || '-';
  specLocation.textContent = creature.location || '-';

  // Biologia & Anatomia
  wikiBioText.textContent = creature.bio || 'Dados paleontológicos sob atualização científica.';

  // Curiosidades
  wikiCuriositiesList.innerHTML = '';
  if (creature.curiosities && creature.curiosities.length > 0) {
    creature.curiosities.forEach(curiosity => {
      const li = document.createElement('li');
      li.textContent = curiosity;
      wikiCuriositiesList.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'Espécime com novas publicações e achados fósseis em andamento.';
    wikiCuriositiesList.appendChild(li);
  }

  // Galeria de Miniaturas
  renderGalleryThumbnails();

  // Exibe o modal
  wikiModal.classList.remove('hidden');
}

function renderGalleryThumbnails() {
  galleryCount.textContent = currentGallery.length;
  wikiGalleryThumbs.innerHTML = '';

  // Exibe a imagem ativa no quadro principal
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

function closeWikiModal() {
  wikiModal.classList.add('hidden');
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
  lightboxCaption.textContent = item.caption || (currentActiveCreature ? currentActiveCreature.name : 'Registro fóssil');
  lightboxCounter.textContent = `Foto ${currentImageIndex + 1} de ${currentGallery.length}`;
}

function nextLightboxImage() {
  currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
  showLightboxImage();
  updateFeaturedImage(currentImageIndex);
}

function prevLightboxImage() {
  currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
  showLightboxImage();
  updateFeaturedImage(currentImageIndex);
}

function closeLightbox() {
  lightboxModal.classList.add('hidden');
}

// ==========================================================================
// MAPA LEAFLET DE OCORRÊNCIAS FÓSSEIS (PBDB)
// ==========================================================================

async function openFossilMap(creatureName) {
  modalTitle.textContent = `Ocorrências Fósseis: ${creatureName}`;
  modalSubtitle.textContent = `Consultando coordenadas georreferenciadas na Paleobiology Database...`;
  mapOccurrencesCount.textContent = 'Buscando sítios fósseis...';
  mapModal.classList.remove('hidden');
  mapLoading.classList.remove('hidden');

  if (!leafletMap) {
    leafletMap = L.map('fossilMap').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | PBDB',
      maxZoom: 18
    }).addTo(leafletMap);
    leafletMarkersLayer = L.layerGroup().addTo(leafletMap);
  } else {
    leafletMarkersLayer.clearLayers();
    leafletMap.setView([20, 0], 2);
    setTimeout(() => leafletMap.invalidateSize(), 200);
  }

  try {
    const url = `https://paleobiodb.org/data1.2/occs/list.json?base_name=${encodeURIComponent(creatureName)}&show=coords,loc&limit=60`;
    const res = await fetch(url);
    const data = res.ok ? await res.json() : { records: [] };
    const occurrences = data.records || [];

    mapLoading.classList.add('hidden');

    if (occurrences.length === 0) {
      modalSubtitle.textContent = `Nenhum sítio georreferenciado aberto retornado na PBDB para "${creatureName}".`;
      mapOccurrencesCount.textContent = '0 locais de escavação';
      return;
    }

    modalSubtitle.textContent = `Exibindo ${occurrences.length} locais de escavação georreferenciados no registro fóssil`;
    mapOccurrencesCount.textContent = `${occurrences.length} fósseis plotados`;

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
        const interval = occ.eag && occ.lag ? `<br><strong>Idade:</strong> ${occ.eag} a ${occ.lag} Ma` : '';

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
    console.error('Erro no mapa PBDB:', err);
    mapLoading.classList.add('hidden');
    modalSubtitle.textContent = 'Não foi possível carregar as coordenadas da PBDB no momento.';
  }
}

function closeMapModal() {
  mapModal.classList.add('hidden');
}

// ==========================================================================
// FILTROS E BUSCA
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
    const data = await getCreature(name);
    if (!data) continue;

    // Filtro por Período
    const matchesPeriod = 
      selectedPeriod === 'all' || 
      data.periodKey.toLowerCase() === selectedPeriod.toLowerCase() ||
      data.periodName.toLowerCase().includes(selectedPeriod.toLowerCase());

    // Filtro por Grupo / Habitat
    const matchesGroup = 
      selectedGroup === 'all' || 
      data.group === selectedGroup;

    // Filtro por Dieta
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
  // Busca por botão
  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      performSearch([query]);
    } else {
      performSearch(MESOZOIC_WIKI_DATABASE.map(c => c.name));
    }
  });

  // Busca por Enter
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      searchBtn.click();
    }
  });

  // Botão de limpar
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
    performSearch(MESOZOIC_WIKI_DATABASE.map(c => c.name));
  });

  // Filtros em tempo real
  [periodFilter, groupFilter, dietFilter].forEach(filter => {
    filter.addEventListener('change', () => {
      const query = searchInput.value.trim();
      if (query) {
        performSearch([query]);
      } else {
        performSearch(MESOZOIC_WIKI_DATABASE.map(c => c.name));
      }
    });
  });

  // Reset de filtros
  resetFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.classList.add('hidden');
    periodFilter.value = 'all';
    groupFilter.value = 'all';
    dietFilter.value = 'all';
    quickTags.forEach(t => t.classList.remove('active'));
    performSearch(MESOZOIC_WIKI_DATABASE.map(c => c.name));
  });

  reloadSuggestionsBtn.addEventListener('click', () => {
    resetFiltersBtn.click();
  });

  // Chips de tags rápidas
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

  // Eventos do Modal da Wiki
  closeWikiBtn.addEventListener('click', closeWikiModal);
  wikiModalBackdrop.addEventListener('click', closeWikiModal);
  btnZoomFeatured.addEventListener('click', () => openLightbox(currentImageIndex));
  btnOpenMapFromWiki.addEventListener('click', () => {
    if (currentActiveCreature) {
      openFossilMap(currentActiveCreature.name);
    }
  });

  // Eventos do Lightbox (Pop-up de Imagens)
  closeLightboxBtn.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  lightboxNextBtn.addEventListener('click', nextLightboxImage);
  lightboxPrevBtn.addEventListener('click', prevLightboxImage);

  // Eventos do Modal do Mapa
  closeModalBtn.addEventListener('click', closeMapModal);
  modalBackdrop.addEventListener('click', closeMapModal);

  // Navegação por teclado global (ESC, Seta Direita e Seta Esquerda)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!lightboxModal.classList.contains('hidden')) {
        closeLightbox();
      } else if (!wikiModal.classList.contains('hidden')) {
        closeWikiModal();
      } else if (!mapModal.classList.contains('hidden')) {
        closeMapModal();
      }
    } else if (!lightboxModal.classList.contains('hidden')) {
      if (e.key === 'ArrowRight') nextLightboxImage();
      if (e.key === 'ArrowLeft') prevLightboxImage();
    }
  });
}

// Inicialização ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  performSearch(MESOZOIC_WIKI_DATABASE.map(c => c.name));
});
