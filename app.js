/**
 * Explorador da Era Mesozoica
 * Consome:
 * 1. Paleobiology Database (PBDB) API - Taxonomia e Ocorrências Fósseis
 * 2. Wikipedia REST API (PT / EN fallback) - Resumos e Imagens
 * 3. Leaflet.js - Mapa mundial de escavações
 */

// Elementos da interface
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

// Elementos do Modal do Mapa
const mapModal = document.getElementById('mapModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const mapLoading = document.getElementById('mapLoading');
const mapOccurrencesCount = document.getElementById('mapOccurrencesCount');

// Instância do Leaflet Map
let leafletMap = null;
let leafletMarkersLayer = null;

// Placeholder SVG resiliente caso a Wikipedia não tenha foto
const PLACEHOLDER_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22240%22%20viewBox%3D%220%200%20400%20240%22%3E%3Crect%20fill%3D%22%23161c16%22%20width%3D%22400%22%20height%3D%22240%22%2F%3E%3Ctext%20fill%3D%22%234ade80%22%20font-family%3D%22system-ui%22%20font-size%3D%2244%22%20x%3D%2250%25%22%20y%3D%2245%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3E%F0%9F%A6%95%3C%2Ftext%3E%3Ctext%20fill%3D%22%238fa38f%22%20font-family%3D%22system-ui%22%20font-size%3D%2214%22%20x%3D%2250%25%22%20y%3D%2268%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3ERegistro%20F%C3%B3ssil%20(Sem%20Imagem)%3C%2Ftext%3E%3C%2Fsvg%3E";

// Base curada de espécimes da Era Mesozoica (Triássico, Jurássico e Cretáceo)
const CURATED_CREATURES = [
  {
    name: 'Tyrannosaurus',
    commonName: 'Tiranossauro Rex',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Tardio',
    group: 'dinossauro',
    groupName: 'Dinossauro Terrestre',
    diet: 'carnivoro',
    dietName: 'Carnívoro'
  },
  {
    name: 'Triceratops',
    commonName: 'Tricerátops',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Tardio',
    group: 'dinossauro',
    groupName: 'Dinossauro Terrestre',
    diet: 'herbivoro',
    dietName: 'Herbívoro'
  },
  {
    name: 'Velociraptor',
    commonName: 'Velociraptor',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Tardio',
    group: 'dinossauro',
    groupName: 'Dinossauro Terrestre',
    diet: 'carnivoro',
    dietName: 'Carnívoro'
  },
  {
    name: 'Spinosaurus',
    commonName: 'Espinossauro',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo',
    group: 'dinossauro',
    groupName: 'Dinossauro Semiaquático',
    diet: 'carnivoro',
    dietName: 'Carnívoro / Piscívoro'
  },
  {
    name: 'Stegosaurus',
    commonName: 'Estegossauro',
    periodKey: 'Jurassic',
    periodName: 'Jurássico Tardio',
    group: 'dinossauro',
    groupName: 'Dinossauro Terrestre',
    diet: 'herbivoro',
    dietName: 'Herbívoro'
  },
  {
    name: 'Brachiosaurus',
    commonName: 'Braquiossauro',
    periodKey: 'Jurassic',
    periodName: 'Jurássico Tardio',
    group: 'dinossauro',
    groupName: 'Dinossauro Saurópode',
    diet: 'herbivoro',
    dietName: 'Herbívoro'
  },
  {
    name: 'Allosaurus',
    commonName: 'Alossauro',
    periodKey: 'Jurassic',
    periodName: 'Jurássico Tardio',
    group: 'dinossauro',
    groupName: 'Dinossauro Terrestre',
    diet: 'carnivoro',
    dietName: 'Carnívoro'
  },
  {
    name: 'Pteranodon',
    commonName: 'Pteranodonte',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Tardio',
    group: 'pterossauro',
    groupName: 'Pterossauro Aéreo',
    diet: 'piscivoro',
    dietName: 'Piscívoro'
  },
  {
    name: 'Mosasaurus',
    commonName: 'Mossassauro',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Tardio',
    group: 'reptil-marinho',
    groupName: 'Réptil Marinho',
    diet: 'carnivoro',
    dietName: 'Carnívoro'
  },
  {
    name: 'Ankylosaurus',
    commonName: 'Anquilossauro',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Tardio',
    group: 'dinossauro',
    groupName: 'Dinossauro Blindado',
    diet: 'herbivoro',
    dietName: 'Herbívoro'
  },
  {
    name: 'Plesiosaurus',
    commonName: 'Plesiossauro',
    periodKey: 'Jurassic',
    periodName: 'Jurássico Inferior',
    group: 'reptil-marinho',
    groupName: 'Réptil Marinho',
    diet: 'piscivoro',
    dietName: 'Piscívoro'
  },
  {
    name: 'Coelophysis',
    commonName: 'Celófise',
    periodKey: 'Triassic',
    periodName: 'Triássico Tardio',
    group: 'dinossauro',
    groupName: 'Dinossauro Terrestre',
    diet: 'carnivoro',
    dietName: 'Carnívoro'
  },
  {
    name: 'Plateosaurus',
    commonName: 'Plateossauro',
    periodKey: 'Triassic',
    periodName: 'Triássico Tardio',
    group: 'dinossauro',
    groupName: 'Prosaurópode',
    diet: 'herbivoro',
    dietName: 'Herbívoro'
  },
  {
    name: 'Ichthyosaurus',
    commonName: 'Ictiossauro',
    periodKey: 'Jurassic',
    periodName: 'Jurássico Inferior',
    group: 'reptil-marinho',
    groupName: 'Réptil Marinho',
    diet: 'piscivoro',
    dietName: 'Piscívoro'
  },
  {
    name: 'Carnotaurus',
    commonName: 'Carnotauro',
    periodKey: 'Cretaceous',
    periodName: 'Cretáceo Tardio',
    group: 'dinossauro',
    groupName: 'Dinossauro Terrestre',
    diet: 'carnivoro',
    dietName: 'Carnívoro'
  }
];

// Cache em memória para evitar requisições repetidas
const cache = {
  wiki: new Map(),
  pbdbTaxon: new Map(),
  pbdbOccurrences: new Map()
};

/**
 * Normaliza classificação do período para filtro
 */
function normalizePeriodKey(periodStr = '') {
  const p = periodStr.toLowerCase();
  if (p.includes('trias') || p.includes('triáss') || p.includes('carnian') || p.includes('norian') || p.includes('rhaetian')) {
    return 'Triassic';
  }
  if (p.includes('juras') || p.includes('juráss') || p.includes('oxfordian') || p.includes('kimmeridgian') || p.includes('tithonian')) {
    return 'Jurassic';
  }
  if (p.includes('cretac') || p.includes('cretác') || p.includes('maastrichtian') || p.includes('campanian') || p.includes('cenomanian')) {
    return 'Cretaceous';
  }
  return 'Mesozoic';
}

/**
 * Retorna classe CSS para o badge de período
 */
function getPeriodBadgeClass(periodKey) {
  switch (periodKey) {
    case 'Triassic': return 'period-triassic';
    case 'Jurassic': return 'period-jurassic';
    case 'Cretaceous': return 'period-cretaceous';
    default: return 'period-mesozoic';
  }
}

/**
 * Busca taxonomia na PBDB API com timeout
 */
async function fetchPBDBTaxon(name) {
  if (cache.pbdbTaxon.has(name)) {
    return cache.pbdbTaxon.get(name);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const url = `https://paleobiodb.org/data1.2/taxa/single.json?name=${encodeURIComponent(name)}&show=attr`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const data = await res.json();
    const record = data.records && data.records[0] ? data.records[0] : null;
    cache.pbdbTaxon.set(name, record);
    return record;
  } catch (err) {
    clearTimeout(timeoutId);
    return null;
  }
}

/**
 * Busca dados da Wikipedia (PT com fallback para EN)
 */
async function fetchWikipediaData(name) {
  if (cache.wiki.has(name)) {
    return cache.wiki.get(name);
  }

  try {
    // 1. Tenta Wikipedia em Português
    let url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`;
    let res = await fetch(url);
    let data = res.ok ? await res.json() : null;

    // 2. Se falhar ou não tiver resumo, tenta Wikipedia em Inglês
    if (!data || !data.extract) {
      url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`;
      res = await fetch(url);
      if (res.ok) {
        data = await res.json();
      }
    }

    if (data && data.extract) {
      const result = {
        title: data.title,
        extract: data.extract,
        image: data.thumbnail?.source || data.originalimage?.source || PLACEHOLDER_IMAGE,
        url: data.content_urls?.desktop?.page || data.content_urls?.mobile?.page || `https://pt.wikipedia.org/wiki/${encodeURIComponent(name)}`
      };
      cache.wiki.set(name, result);
      return result;
    }

    return null;
  } catch (err) {
    console.warn(`Aviso: Falha ao carregar Wikipedia para "${name}":`, err);
    return null;
  }
}

/**
 * Agrega dados completos de uma criatura
 */
async function getCreatureFullData(query) {
  const curated = CURATED_CREATURES.find(
    c => c.name.toLowerCase() === query.toLowerCase() ||
         c.commonName.toLowerCase() === query.toLowerCase()
  );

  const searchScientificName = curated ? curated.name : query;

  // Busca paralela na PBDB e Wikipedia
  const [taxon, wiki] = await Promise.all([
    fetchPBDBTaxon(searchScientificName),
    fetchWikipediaData(searchScientificName)
  ]);

  if (!wiki && !curated && !taxon) {
    return null;
  }

  // Define período
  let periodText = 'Era Mesozoica';
  let periodKey = 'Mesozoic';

  if (curated) {
    periodText = curated.periodName;
    periodKey = curated.periodKey;
  } else if (taxon && taxon.tei) {
    periodText = taxon.tli && taxon.tli !== taxon.tei ? `${taxon.tei} a ${taxon.tli}` : taxon.tei;
    periodKey = normalizePeriodKey(periodText);
  }

  return {
    scientificName: taxon ? taxon.nam : (curated ? curated.name : (wiki ? wiki.title : query)),
    displayName: curated ? `${curated.name} (${curated.commonName})` : (wiki ? wiki.title : query),
    description: wiki?.extract || 'Espécime fóssil catalogado na base paleontológica global da Era Mesozoica.',
    image: wiki?.image || PLACEHOLDER_IMAGE,
    period: periodText,
    periodKey: periodKey,
    group: curated ? curated.group : 'dinossauro',
    groupName: curated ? curated.groupName : 'Espécime Fóssil',
    diet: curated ? curated.diet : 'desconhecido',
    dietName: curated ? curated.dietName : 'Estudo Paleontológico',
    rank: taxon?.rnk ? `Rank PBDB: ${taxon.rnk}` : 'Gênero Paleontológico',
    url: wiki?.url || `https://pt.wikipedia.org/wiki/${encodeURIComponent(query)}`
  };
}

/**
 * Renderiza um card no container de resultados
 */
function renderCard(item) {
  const card = document.createElement('article');
  card.className = 'card';
  const badgeClass = getPeriodBadgeClass(item.periodKey);

  card.innerHTML = `
    <div class="card-image-wrap">
      <img src="${item.image}" alt="${item.scientificName}" loading="lazy" onerror="this.onerror=null; this.src='${PLACEHOLDER_IMAGE}';">
      <span class="card-floating-badge ${badgeClass}">${item.period}</span>
    </div>
    <div class="card-content">
      <div class="card-title-row">
        <h3 class="card-title">${item.scientificName}</h3>
        <span class="card-rank">${item.rank}</span>
      </div>
      
      <div class="card-meta-chips">
        <span class="chip">🏛️ ${item.groupName}</span>
        <span class="chip">🍖 ${item.dietName}</span>
      </div>

      <p class="card-desc">${item.description}</p>

      <div class="card-actions">
        <button class="btn-card-map" data-creature="${item.scientificName}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
            <line x1="8" y1="2" x2="8" y2="18"></line>
            <line x1="16" y1="6" x2="16" y2="22"></line>
          </svg>
          Ver Fósseis no Mapa
        </button>

        <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="btn-card-wiki">
          Artigo completo &rarr;
        </a>
      </div>
    </div>
  `;

  // Listener para abrir o mapa
  const mapBtn = card.querySelector('.btn-card-map');
  mapBtn.addEventListener('click', () => {
    openFossilMap(item.scientificName);
  });

  resultsContainer.appendChild(card);
}

/**
 * Executa a busca e aplica os filtros
 */
async function performSearch(queryNames) {
  resultsContainer.innerHTML = '';
  emptyState.classList.add('hidden');
  loading.classList.remove('hidden');

  const selectedPeriod = periodFilter.value;
  const selectedGroup = groupFilter.value;
  const selectedDiet = dietFilter.value;

  let renderedCount = 0;

  for (const name of queryNames) {
    const data = await getCreatureFullData(name);
    if (!data) continue;

    // Filtro por Período
    const matchesPeriod = 
      selectedPeriod === 'all' || 
      data.periodKey.toLowerCase() === selectedPeriod.toLowerCase() ||
      data.period.toLowerCase().includes(selectedPeriod.toLowerCase());

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
    resultsStats.textContent = 'Nenhum espécime encontrado com os filtros atuais.';
  } else {
    resultsStats.textContent = `Exibindo ${renderedCount} ser(es) da Era Mesozoica catalogado(s)`;
  }
}

/**
 * Inicia ou atualiza o mapa Leaflet com ocorrências fósseis da PBDB
 */
async function openFossilMap(creatureName) {
  modalTitle.textContent = `Ocorrências Fósseis: ${creatureName}`;
  modalSubtitle.textContent = `Carregando coordenadas de escavação na Paleobiology Database...`;
  mapOccurrencesCount.textContent = 'Consultando PBDB...';
  mapModal.classList.remove('hidden');
  mapLoading.classList.remove('hidden');

  // Inicializa o mapa do Leaflet se ainda não foi criado
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
    // Dispara recálculo do tamanho do contêiner
    setTimeout(() => leafletMap.invalidateSize(), 200);
  }

  try {
    let occurrences = [];
    if (cache.pbdbOccurrences.has(creatureName)) {
      occurrences = cache.pbdbOccurrences.get(creatureName);
    } else {
      const url = `https://paleobiodb.org/data1.2/occs/list.json?base_name=${encodeURIComponent(creatureName)}&show=coords,loc&limit=60`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        occurrences = data.records || [];
        cache.pbdbOccurrences.set(creatureName, occurrences);
      }
    }

    mapLoading.classList.add('hidden');

    if (occurrences.length === 0) {
      modalSubtitle.textContent = `Nenhuma coordenada georreferenciada aberta encontrada na PBDB para "${creatureName}".`;
      mapOccurrencesCount.textContent = '0 locais de escavação';
      return;
    }

    modalSubtitle.textContent = `Exibindo até ${occurrences.length} sítios de escavação georreferenciados na PBDB`;
    mapOccurrencesCount.textContent = `${occurrences.length} locais encontrados`;

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

        const locationDesc = occ.cc2 ? `País: ${occ.cc2}` : 'Local não especificado';
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
    console.error('Erro ao buscar ocorrências no mapa:', err);
    mapLoading.classList.add('hidden');
    modalSubtitle.textContent = 'Não foi possível carregar as coordenadas da PBDB no momento.';
  }
}

function closeModal() {
  mapModal.classList.add('hidden');
}

/**
 * Event Listeners
 */
function setupEventListeners() {
  // Disparo de busca pelo botão
  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      performSearch([query]);
    } else {
      performSearch(CURATED_CREATURES.map(c => c.name));
    }
  });

  // Disparo ao teclar Enter
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      searchBtn.click();
    }
  });

  // Controle de visibilidade do botão limpar
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
    performSearch(CURATED_CREATURES.map(c => c.name));
  });

  // Filtros dinâmicos automáticos
  [periodFilter, groupFilter, dietFilter].forEach(filter => {
    filter.addEventListener('change', () => {
      const query = searchInput.value.trim();
      if (query) {
        performSearch([query]);
      } else {
        performSearch(CURATED_CREATURES.map(c => c.name));
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
    performSearch(CURATED_CREATURES.map(c => c.name));
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

  // Modal fechamento
  closeModalBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mapModal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

// Inicialização da aplicação
window.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  performSearch(CURATED_CREATURES.map(c => c.name));
});
