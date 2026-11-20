/**
 * Enciclopédia Paleontológica Global da Vida na Terra
 * Frontend Controller conectado à API FastAPI
 */

// Estado Global da Aplicação
const state = {
  currentEra: 'all',
  currentPeriod: 'all',
  currentGroup: 'all',
  currentDiet: 'all',
  searchQuery: '',
  isExpertMode: false,
  specimens: [],
  selectedSpecimen: null,
  lightboxImages: [],
  lightboxIndex: 0,
  leafletMap: null,
  mapMarkersGroup: null
};

// Placeholder SVG resiliente para paleoarte
const PLACEHOLDER_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22260%22%20viewBox%3D%220%200%20400%20260%22%3E%3Crect%20fill%3D%22%23121712%22%20width%3D%22400%22%20height%3D%22260%22%2F%3E%3Ctext%20fill%3D%22%234ade80%22%20font-family%3D%22system-ui%22%20font-size%3D%2246%22%20x%3D%2250%25%22%20y%3D%2245%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3E%F0%9F%A6%95%3C%2Ftext%3E%3Ctext%20fill%3D%22%238fa38f%22%20font-family%3D%22system-ui%22%20font-size%3D%2214%22%20x%3D%2250%25%22%20y%3D%2268%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3ERepresenta%C3%A7%C3%A3o%20em%20Vida%20(Paleoarte)%3C%2Ftext%3E%3C%2Fsvg%3E";

// Elementos do DOM
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const btnAutoIngest = document.getElementById('btnAutoIngest');
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
const tabBtnExpert = document.getElementById('tabBtnExpert');
const tabBtnMap = document.getElementById('tabBtnMap');

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
// INICIALIZAÇÃO DA APLICAÇÃO
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  await loadCatalog();
});


function setupEventListeners() {
  // Busca
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

  // Botão Subir Espécime
  btnAutoIngest.addEventListener('click', () => handleAutoIngestPrompt());

  // Filtros de Select
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

  // Seletor de Eras
  eraTabsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.era-tab-btn');
    if (!btn) return;
    
    document.querySelectorAll('.era-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    state.currentEra = btn.getAttribute('data-era');
    updatePeriodOptionsForEra(state.currentEra);
    loadCatalog();
  });

  // Modo Especialista Global
  globalExpertToggle.addEventListener('change', () => {
    state.isExpertMode = globalExpertToggle.checked;
    modalExpertToggle.checked = state.isExpertMode;
    toggleExpertModeDisplay();
  });

  // Modo Especialista dentro do Modal
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

  // Abas do Modal
  wikiTabsBar.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('.wiki-tab-btn');
    if (!tabBtn) return;
    const tabId = tabBtn.getAttribute('data-tab');
    switchWikiTab(tabId);
  });

  // Fechamento de Modais
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

  // Teclado
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

  // Botões de Descoberta Automática
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

  // Tags Rápidas
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
// CARREGAMENTO DO CATÁLOGO DE ESPÉCIMES VIA FASTAPI
// ============================================================================

async function loadCatalog() {
  showLoading('Consultando catálogo paleontológico...');
  
  const params = new URLSearchParams();
  if (state.currentEra && state.currentEra !== 'all') params.append('era', state.currentEra);
  if (state.currentPeriod && state.currentPeriod !== 'all') params.append('period', state.currentPeriod);
  if (state.currentGroup && state.currentGroup !== 'all') params.append('group', state.currentGroup);
  if (state.currentDiet && state.currentDiet !== 'all') params.append('diet', state.currentDiet);
  if (state.searchQuery) params.append('search', state.searchQuery);

  try {
    const res = await fetch(`/api/specimens?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    
    const specimens = await res.json();
    state.specimens = specimens;
    hideLoading();
    renderCards(specimens);
    updateStats(specimens.length);
  } catch (err) {
    console.error('Erro ao buscar espécimes:', err);
    hideLoading();
    resultsStats.textContent = 'Erro ao conectar ao servidor FastAPI. Verifique se o backend está em execução.';
  }
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

    // Mapeamento de cor do badge de era
    const eraClass = `badge-era-${spec.era}`;

    card.innerHTML = `
      <div class="card-media-wrap">
        <img 
          src="${spec.image_url}" 
          alt="${spec.name}" 
          class="card-img" 
          loading="lazy"
          referrerpolicy="no-referrer"
          onerror="handleCardImageError(this, '${spec.id}')"
        />
        <div class="card-media-overlay">
          <span class="badge-era ${eraClass}">${spec.era_display}</span>
          <span class="card-floating-badge">${spec.period}</span>
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
            <span class="mini-label">Comprimento</span>
            <span class="mini-val">${spec.length || '-'}</span>
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
          
          <button class="secondary-btn btn-quick-expert" data-id="${spec.id}" title="Ver detalhes complexos e cladística">
            🔬
          </button>
        </div>
      </div>
    `;

    // Event listeners
    card.querySelector('.btn-open-wiki').addEventListener('click', () => openWikiModal(spec.id, 'tab-overview'));
    card.querySelector('.btn-quick-expert').addEventListener('click', () => openWikiModal(spec.id, 'tab-expert'));
    card.querySelector('.card-media-wrap').addEventListener('click', () => openWikiModal(spec.id, 'tab-overview'));

    fragment.appendChild(card);
  });

  resultsGrid.appendChild(fragment);
}


function handleCardImageError(imgEl, specId) {
  imgEl.onerror = null;
  // Se falhar direto, tenta o proxy do FastAPI
  const originalSrc = imgEl.src;
  if (!originalSrc.includes('/api/proxy-image')) {
    imgEl.src = `/api/proxy-image?url=${encodeURIComponent(originalSrc)}`;
    imgEl.onerror = () => {
      imgEl.src = PLACEHOLDER_IMAGE;
    };
  } else {
    imgEl.src = PLACEHOLDER_IMAGE;
  }
}


// ============================================================================
// BUSCA E INGESTÃO AUTOMÁTICA
// ============================================================================

async function handleSearch() {
  const query = searchInput.value.trim();
  state.searchQuery = query;
  
  if (!query) {
    loadCatalog();
    return;
  }

  // Verifica se há resultados locais correspondentes
  showLoading(`Pesquisando por "${query}" no catálogo...`);
  const params = new URLSearchParams();
  if (state.currentEra && state.currentEra !== 'all') params.append('era', state.currentEra);
  params.append('search', query);

  try {
    const res = await fetch(`/api/specimens?${params.toString()}`);
    const results = await res.json();
    
    if (results && results.length > 0) {
      hideLoading();
      state.specimens = results;
      renderCards(results);
      updateStats(results.length);
      showToast(`Encontrado(s) ${results.length} espécime(s) para "${query}"`, '🔍');
    } else {
      // Se não encontrou, oferece ou executa ingestão automática
      hideLoading();
      showToast(`Gênero não catalogado localmente. Buscando na PBDB & Wikimedia...`, '⚡');
      await executeAutoIngest(query);
    }
  } catch (e) {
    hideLoading();
    console.error('Erro na busca:', e);
  }
}


async function handleAutoIngestPrompt() {
  const query = searchInput.value.trim();
  if (!query) {
    showToast('Digite o nome do gênero científico no campo de busca para subir!', '💡');
    searchInput.focus();
    return;
  }
  await executeAutoIngest(query);
}


async function executeAutoIngest(taxonName) {
  showLoading(`Minerando fósseis de "${taxonName}" na PBDB e imagens de paleoarte em vida...`);
  
  try {
    const res = await fetch('/api/ingest', {
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
      showToast(data.message, '🦖');
      // Recarrega e abre a wiki do novo espécime
      await loadCatalog();
      openWikiModal(data.specimen.id, 'tab-overview');
    } else {
      showToast(data.message || 'Não foi possível localizar o espécime.', '⚠️');
    }
  } catch (err) {
    hideLoading();
    console.error('Erro na ingestão:', err);
    showToast('Falha na comunicação com o serviço de ingestão.', '❌');
  }
}


async function openOrIngestSpecimen(name) {
  const cleanId = name.toLowerCase().replace(/ /g, '-');
  const found = state.specimens.find(s => s.id === cleanId || s.name.toLowerCase().includes(name.toLowerCase()) || s.genus.toLowerCase() === name.toLowerCase());
  
  if (found) {
    openWikiModal(found.id, 'tab-overview');
  } else {
    // Tenta carregar do backend ou ingere
    searchInput.value = name;
    clearBtn.classList.remove('hidden');
    await executeAutoIngest(name);
  }
}


async function discoverRandomSpecimen(era = 'all') {
  showLoading('Sorteando espécime no acervo global...');
  try {
    const url = era && era !== 'all' ? `/api/discover?era=${era}` : '/api/discover';
    const res = await fetch(url);
    const discoveries = await res.json();
    hideLoading();

    if (discoveries && discoveries.length > 0) {
      const lucky = discoveries[0];
      showToast(`Espécime sorteado: ${lucky.name} (${lucky.era_display})!`, '🎲');
      openWikiModal(lucky.id, 'tab-overview');
    }
  } catch (e) {
    hideLoading();
    console.error('Erro no sorteio:', e);
  }
}


// ============================================================================
// WIKI PALEONTOLÓGICA MODAL INTERATIVA
// ============================================================================

async function openWikiModal(specimenId, initialTab = 'tab-overview') {
  showLoading('Carregando dossiê paleontológico...');

  try {
    const res = await fetch(`/api/specimens/${specimenId}`);
    if (!res.ok) throw new Error('Espécime não encontrado');
    
    const spec = await res.json();
    state.selectedSpecimen = spec;
    hideLoading();

    // Cabeçalho
    document.getElementById('wikiTitle').textContent = spec.name;
    document.getElementById('wikiEtymology').textContent = spec.etymology || `${spec.genus} • Registro fóssil`;
    
    // Badges
    const eraBadge = document.getElementById('wikiEraBadge');
    eraBadge.textContent = spec.era_display;
    eraBadge.className = `badge-era badge-era-${spec.era}`;
    
    const periodBadge = document.getElementById('wikiPeriodBadge');
    periodBadge.textContent = spec.period;
    periodBadge.className = `card-floating-badge period-${spec.era}`;

    document.getElementById('wikiGroupBadge').textContent = spec.group_display;
    document.getElementById('wikiDietBadge').textContent = spec.diet_display;

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
    document.getElementById('wikiFeaturedCaption').textContent = spec.image_caption || 'Representação paleoartística em vida';

    // Miniaturas
    const thumbsContainer = document.getElementById('wikiGalleryThumbs');
    thumbsContainer.innerHTML = '';
    const galleryItems = spec.gallery && spec.gallery.length > 0 ? spec.gallery : [{ url: spec.image_url, caption: spec.image_caption }];
    
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
        document.getElementById('wikiFeaturedCaption').textContent = item.caption || 'Representação em vida';
      });

      thumbsContainer.appendChild(thumb);
    });

    // Detalhes Complexos (Aba Especialista)
    renderExpertTab(spec);

    // Galeria Completa (Aba Imagens)
    renderFullGalleryTab(spec);

    // Botão Google Imagens
    const googleBtn = document.getElementById('btnSearchGoogleImages');
    googleBtn.href = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(spec.name + ' paleoart life restoration')}`;

    // Abre modal e ativa aba inicial
    wikiModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    switchWikiTab(initialTab);

  } catch (err) {
    hideLoading();
    console.error('Erro ao abrir wiki:', err);
    showToast('Não foi possível carregar os detalhes do espécime.', '⚠️');
  }
}


function renderExpertTab(spec) {
  const expert = spec.expert || {};
  
  // Cladograma
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
    cladContainer.innerHTML = '<p class="text-muted">Árvore filogenética em refinamento taxonômico.</p>';
  }

  // Osteologia
  document.getElementById('expertOsteology').innerHTML = expert.osteology || '<p>Estrutura óssea em análise comparativa.</p>';

  // Biomecânica
  document.getElementById('expertBiomechanics').innerHTML = expert.biomechanics || '<p>Modelagem biomecânica em simulação computacional.</p>';

  // Histologia
  document.getElementById('expertHistology').innerHTML = expert.histology || '<p>Cortes histológicos e tafonomia sedimentar em catálogo.</p>';
}


function renderFullGalleryTab(spec) {
  const container = document.getElementById('fullGalleryGrid');
  container.innerHTML = '';

  const items = spec.gallery && spec.gallery.length > 0 ? spec.gallery : [{ url: spec.image_url, caption: spec.image_caption }];

  items.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.innerHTML = `
      <img src="${item.url}" alt="${item.caption || 'Paleoarte'}" loading="lazy" referrerpolicy="no-referrer" onerror="this.src='${PLACEHOLDER_IMAGE}'" />
      <div class="gallery-card-info">
        <span class="gallery-card-caption">${item.caption || 'Representação em vida'}</span>
        <small class="gallery-card-author">${item.author || 'Wikimedia Commons'}</small>
      </div>
    `;
    card.addEventListener('click', () => openLightbox(idx));
    container.appendChild(card);
  });
}


function switchWikiTab(tabId) {
  document.querySelectorAll('.wiki-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });

  document.querySelectorAll('.wiki-tab-content').forEach(content => {
    content.classList.toggle('active', content.id === tabId);
  });

  // Se abrir a aba de mapa, renderiza Leaflet
  if (tabId === 'tab-map') {
    renderFossilMap(state.selectedSpecimen);
  }
}


function closeWikiModal() {
  wikiModal.classList.add('hidden');
  document.body.style.overflow = '';
}


// ============================================================================
// MAPA FÓSSIL INTERATIVO COM LEAFLET (PBDB)
// ============================================================================

async function renderFossilMap(specimen) {
  if (!specimen) return;

  const mapContainer = document.getElementById('integratedFossilMap');
  const countBadge = document.getElementById('integratedMapCount');
  const loadingIndicator = document.getElementById('integratedMapLoading');

  loadingIndicator.classList.remove('hidden');

  // Inicializa mapa Leaflet se ainda não existir
  if (!state.leafletMap) {
    state.leafletMap = L.map('integratedFossilMap', {
      center: [20, 0],
      zoom: 2,
      minZoom: 1,
      maxZoom: 12
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(state.leafletMap);

    state.mapMarkersGroup = L.layerGroup().addTo(state.leafletMap);
  }

  // Limpa marcadores anteriores
  state.mapMarkersGroup.clearLayers();

  try {
    const res = await fetch(`/api/occurrences/${encodeURIComponent(specimen.genus || specimen.name)}`);
    const occurrences = await res.json();
    loadingIndicator.classList.add('hidden');

    if (!occurrences || occurrences.length === 0) {
      countBadge.textContent = '0 sítios mapeados';
      state.leafletMap.setView([20, 0], 2);
      return;
    }

    countBadge.textContent = `${occurrences.length} sítios fósseis plotados`;

    const bounds = [];

    occurrences.forEach(occ => {
      if (typeof occ.lat === 'number' && typeof occ.lng === 'number') {
        const marker = L.circleMarker([occ.lat, occ.lng], {
          radius: 7,
          fillColor: '#ea580c',
          color: '#ffffff',
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.85
        });

        marker.bindPopup(`
          <div style="font-family: sans-serif; color: #111;">
            <strong style="font-size: 14px; color: #d97706;">${specimen.name}</strong><br>
            <span style="font-size: 12px;"><strong>País:</strong> ${occ.country || 'Global'}</span><br>
            <span style="font-size: 12px;"><strong>Formação:</strong> ${occ.formation || 'Estrato fóssil'}</span><br>
            <span style="font-size: 11px; color: #666;">Idade: ${occ.early_age || ''} - ${occ.late_age || ''} Ma</span>
          </div>
        `);

        state.mapMarkersGroup.addLayer(marker);
        bounds.push([occ.lat, occ.lng]);
      }
    });

    // Redimensiona o mapa no DOM e ajusta bounds
    setTimeout(() => {
      state.leafletMap.invalidateSize();
      if (bounds.length > 0) {
        state.leafletMap.fitBounds(bounds, { padding: [30, 30], maxZoom: 6 });
      }
    }, 200);

  } catch (err) {
    loadingIndicator.classList.add('hidden');
    console.error('Erro ao renderizar mapa fóssil:', err);
    countBadge.textContent = 'Erro ao carregar sítios';
  }
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
  lightboxCaption.textContent = current.caption || 'Representação paleoartística em vida';
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
    showToast('Modo Paleontólogo Ativado: Detalhes Complexos & Cladística liberados!', '🔬');
    if (!wikiModal.classList.contains('hidden')) {
      switchWikiTab('tab-expert');
    }
  } else {
    showToast('Modo Padrão Ativado', 'ℹ️');
  }
}

function updatePeriodOptionsForEra(era) {
  // Ajusta opções do dropdown conforme a era selecionada
  const options = periodFilter.options;
  periodFilter.value = 'all';
  state.currentPeriod = 'all';
}

function resetAllFilters() {
  state.currentEra = 'all';
  state.currentPeriod = 'all';
  state.currentGroup = 'all';
  state.currentDiet = 'all';
  state.searchQuery = '';

  searchInput.value = '';
  clearBtn.classList.add('hidden');
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

function updateStats(count) {
  resultsStats.textContent = `Exibindo ${count} espécime(s) no acervo global`;
}

function showToast(text, icon = '🦖') {
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
