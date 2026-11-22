/* ==========================================================================
   BioAtlas v12 — Living Habitat Themes · Dual-Audience (Explorer / Researcher)
   Firebase Auth & Firestore · SSE 4-Stage Ingestion · Interactive Timeline
   Biometric Comparator · Tree of Life · Explorer Quiz · Bioacoustics · IUCN
   Field Notes · Scientific Export (PDF/ABNT/BibTeX/CSV/JSON) · Shareable URLs
   ========================================================================== */

'use strict';

const API_BASE = '';

const STORAGE_KEYS = {
  favorites: 'bioatlas_favorites_v1',
  collections: 'bioatlas_collections_v1',
  notes: 'bioatlas_notes_v1',
  quizStats: 'bioatlas_quiz_stats_v1',
};

// ============================================================================
// SISTEMA DE HABITATS / BIOMAS (CORES, DESCRIÇÕES E FALLBACKS TEMÁTICOS)
// ============================================================================

const HABITAT_META = {
  all: {
    id: 'all',
    shortLabel: 'Todos os Biomas',
    label: 'Todos os Habitats da Terra',
    description:
      'Cada criatura herda a atmosfera visual do seu ambiente natural — selecione um bioma para transformar a experiência.',
    bgHex: '#0b1420',
    accentHex: '#38bdf8',
  },
  aquatico: {
    id: 'aquatico',
    shortLabel: 'Aquático',
    label: 'Oceano & Águas',
    description:
      'Tema azul oceânico ativo: explore baleias, tubarões, cefalópodes e grandes predadores marinhos atuais e pré-históricos.',
    bgHex: '#061a30',
    accentHex: '#38bdf8',
  },
  terrestre: {
    id: 'terrestre',
    shortLabel: 'Terrestre',
    label: 'Florestas & Savanas',
    description:
      'Atmosfera botânica terrestre: grandes felinos, megafauna da Era do Gelo e dinossauros que dominaram os continentes.',
    bgHex: '#0c1c13',
    accentHex: '#4ade80',
  },
  aereo: {
    id: 'aereo',
    shortLabel: 'Aéreo',
    label: 'Céus & Altitude',
    description:
      'Horizonte atmosférico celeste: aves de rapina, pterossauros colossais e os primeiros artrópodes alados.',
    bgHex: '#0d1933',
    accentHex: '#60a5fa',
  },
  anfibio: {
    id: 'anfibio',
    shortLabel: 'Anfíbio',
    label: 'Rios, Mangues & Costas',
    description:
      'Paleta costeira turquesa: espécies adaptadas à fronteira evolutiva entre a água e a terra firme.',
    bgHex: '#071f21',
    accentHex: '#2dd4bf',
  },
  bentonico: {
    id: 'bentonico',
    shortLabel: 'Abissal',
    label: 'Fundo Marinho & Primordial',
    description:
      'Safira abissal profunda: organismos bentônicos e a misteriosa biota marinha do Pré-Cambriano.',
    bgHex: '#051328',
    accentHex: '#22d3ee',
  },
  microbiologico: {
    id: 'microbiologico',
    shortLabel: 'Microscópico',
    label: 'Mundo Microscópico',
    description:
      'Óptica de microscopia científica: extremófilos, protozoários, algas de sílica, cianobactérias e megavírus.',
    bgHex: '#101530',
    accentHex: '#818cf8',
  },
};

function resolveSpecimenHabitat(spec) {
  if (!spec) return 'terrestre';
  if (spec.skeletal_type === 'microbiologico') return 'microbiologico';
  const raw = normalizeStr(spec.habitat || '');
  if (raw === 'aquatico' || raw.includes('marin') || raw.includes('ocean') || raw.includes('agua')) {
    return 'aquatico';
  }
  if (raw === 'aereo' || raw.includes('ar') || raw.includes('voo') || spec.group === 'pterossauro') {
    return 'aereo';
  }
  if (raw === 'anfibio' || raw.includes('costa') || raw.includes('estuario')) {
    return 'anfibio';
  }
  if (raw === 'bentonico' || raw.includes('abissal') || spec.group === 'ediacarano') {
    return 'bentonico';
  }
  if (spec.group === 'reptil-marinho') {
    return 'aquatico';
  }
  return 'terrestre';
}

function getHabitatPlaceholder(habitat) {
  const meta = HABITAT_META[habitat] || HABITAT_META.all;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect fill="${meta.bgHex}" width="400" height="300"/>
    <circle cx="200" cy="128" r="46" fill="none" stroke="${meta.accentHex}" stroke-width="2.5" stroke-opacity="0.45"/>
    <circle cx="200" cy="128" r="22" fill="${meta.accentHex}" fill-opacity="0.18"/>
    <text fill="${meta.accentHex}" font-family="system-ui,sans-serif" font-size="13" font-weight="600" x="50%" y="206" text-anchor="middle">${meta.label}</text>
    <text fill="#94a3b8" font-family="system-ui,sans-serif" font-size="11" x="50%" y="228" text-anchor="middle">Registro visual científico</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

// ============================================================================
// DEFINIÇÕES DA LINHA DO TEMPO GEOLÓGICA & 5 EXTINÇÕES EM MASSA
// ============================================================================

const MASS_EXTINCTIONS = {
  ordovician: {
    id: 'ordovician',
    title: 'Extinção do Ordoviciano-Siluriano (444 Ma)',
    sliderVal: 28,
    era: 'paleozoico',
    period: 'all',
    loss: '~85% das espécies marinhas extintas',
    summary:
      'Glaciação intensa em Gondwana e queda abrupta do nível dos oceanos reduziram drasticamente a biota marinha paleozoica primitiva.',
  },
  devonian: {
    id: 'devonian',
    title: 'Extinção do Devoniano Tardio (372 Ma)',
    sliderVal: 36,
    era: 'paleozoico',
    period: 'Devoniano',
    loss: '~75% das espécies extintas (peixes placodermos e recifes)',
    summary:
      'Anóxia oceânica generalizada e resfriamento global atingiram predadores blindados como Dunkleosteus e abriram espaço para os primeiros tetrápodes.',
  },
  permian: {
    id: 'permian',
    title: 'A Grande Morte — Permiano-Triássico (252 Ma)',
    sliderVal: 48,
    era: 'paleozoico',
    period: 'Permiano',
    loss: '~96% das espécies marinhas e ~70% dos vertebrados terrestres',
    summary:
      'Maior extinção em massa da história da Terra, desencadeada pelo vulcanismo das Armadilhas Siberianas, aquecimento extremo e acidificação dos oceanos.',
  },
  triassic: {
    id: 'triassic',
    title: 'Extinção do Triássico-Jurássico (201 Ma)',
    sliderVal: 60,
    era: 'mesozoico',
    period: 'Jurássico',
    loss: '~80% das espécies extintas — ascensão total dos dinossauros',
    summary:
      'A fragmentação inicial da Pangeia liberou imensos volumes de CO₂ vulcânico, eliminando grandes pseudossúquios e permitindo o domínio dos dinossauros no Jurássico.',
  },
  kpg: {
    id: 'kpg',
    title: 'Extinção Cretáceo-Paleógeno / K-Pg (66 Ma)',
    sliderVal: 74,
    era: 'mesozoico',
    period: 'Cretáceo',
    loss: '~76% das espécies extintas (fim dos dinossauros não-avianos)',
    summary:
      'Impacto do asteroide de Chicxulub combinado ao vulcanismo do Decã encerrou a Era Mesozoica e abriu caminho para a radiação dos mamíferos no Cenozoico.',
  },
};

function mapSliderToGeologicalSlice(val) {
  const v = Number(val);
  if (v <= 10) return { label: 'Arqueano / Origem da Vida (3.500 Ma)', era: 'precambriano', period: 'Arqueano' };
  if (v <= 22) return { label: 'Ediacarano / Pré-Cambriano (635 – 541 Ma)', era: 'precambriano', period: 'all' };
  if (v <= 31) return { label: 'Cambriano (541 – 485 Ma)', era: 'paleozoico', period: 'Cambriano' };
  if (v <= 40) return { label: 'Devoniano (419 – 359 Ma)', era: 'paleozoico', period: 'Devoniano' };
  if (v <= 49) return { label: 'Carbonífero & Permiano (359 – 252 Ma)', era: 'paleozoico', period: 'all' };
  if (v <= 62) return { label: 'Triássico & Jurássico (252 – 145 Ma)', era: 'mesozoico', period: 'Jurássico' };
  if (v <= 74) return { label: 'Cretáceo (145 – 66 Ma)', era: 'mesozoico', period: 'Cretáceo' };
  if (v <= 84) return { label: 'Paleógeno / Eoceno (66 – 23 Ma)', era: 'cenozoico', period: 'Eoceno' };
  if (v <= 92) return { label: 'Pleistoceno / Idade do Gelo (2,6 Ma – 11 ka)', era: 'cenozoico', period: 'Pleistoceno' };
  return { label: 'Holoceno / Fauna Contemporânea (Presente)', era: 'contemporaneo', period: 'Holoceno' };
}

// ============================================================================
// ESTADO GLOBAL DA APLICAÇÃO
// ============================================================================

const state = {
  allCatalog: [],
  specimens: [],
  currentHabitat: 'all',
  currentEra: 'all',
  currentPeriod: 'all',
  currentGroup: 'all',
  currentDiet: 'all',
  currentSkeletalType: 'all',
  currentClade: '',
  favoritesOnly: false,
  activeCollectionId: null,
  searchQuery: '',
  audienceMode: 'explorer', // 'explorer' | 'researcher'
  isExpertMode: false,
  selectedSpecimen: null,
  lightboxImages: [],
  lightboxIndex: 0,
  lightboxCategory: 'all',
  lightboxFilteredImages: [],
  lightboxSpecimen: null,
  galleryActiveCategory: 'all',
  isBackendOnline: true,
  compareIds: [],
  currentUser: null,
  favoritesSet: new Set(),
  collections: [],
  fieldNotes: {},
  quizStats: {
    totalRounds: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    bestScore: 0,
    badges: [],
    selectedDifficulty: 'facil',
    unlockedLevels: { facil: 1, medio: 1, dificil: 1, especialista: 1 },
    completedLevels: { facil: 0, medio: 0, dificil: 0, especialista: 0 },
    levelStars: {},
  },
  quizView: 'map',
  quizAchievementsDiff: null,
  assignSpecimenForCollection: null,
  unsubFavorites: null,
  unsubCollections: null,
  unsubNotes: null,
  autocompleteIndex: -1,
  autocompleteItems: [],
  quizSession: null,
  pendingQuizEmailDraft: null,
  pendingQuizEmailSession: null,
  isSendingQuizEmail: false,
  exportContext: null,
  bioacousticsReqId: 0,
  researcherPanel: 'allometry', // 'allometry' | 'matrix' | 'mrca'
  researcherCatalogView: 'cards', // 'cards' | 'table'
  researcherTableSort: { col: 'weight', dir: 'desc' },
  currentSpecimenOccurrences: [],
  currentSpecimenOccSource: '',
  currentSpecimenPapers: [],
  expertPapersSort: 'cited',
  expertPapersReqId: 0,
};

// ============================================================================
// UTILITÁRIOS SEGUROS
// ============================================================================

function normalizeStr(str) {
  if (!str || typeof str !== 'string') return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function truncateText(str, max = 120) {
  if (!str) return '';
  return str.length > max ? str.substring(0, max) + '...' : str;
}

function showToast(text, icon = '') {
  const toastEl = document.getElementById('toastNotification');
  const textEl = document.getElementById('toastText');
  const iconEl = toastEl ? toastEl.querySelector('.toast-icon') : null;
  if (!toastEl || !textEl) return;

  textEl.textContent = text;
  if (iconEl) iconEl.textContent = icon;
  toastEl.classList.remove('hidden');

  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toastEl.classList.add('hidden');
  }, 4000);
}

function showLoading(msg, showStepper = false) {
  const loadingState = document.getElementById('loading');
  const loadingMessage = document.getElementById('loadingMessage');
  const stepper = document.getElementById('ingestStepper');
  if (loadingMessage) loadingMessage.textContent = msg;
  if (stepper) {
    stepper.classList.toggle('hidden', !showStepper);
    if (showStepper) updateIngestStepper(1);
  }
  if (loadingState) loadingState.classList.remove('hidden');
}

function hideLoading() {
  const loadingState = document.getElementById('loading');
  const stepper = document.getElementById('ingestStepper');
  if (loadingState) loadingState.classList.add('hidden');
  if (stepper) stepper.classList.add('hidden');
}

function updateIngestStepper(activeStep) {
  document.querySelectorAll('#ingestStepper .ingest-step').forEach((el) => {
    const stepNum = Number(el.getAttribute('data-step'));
    el.classList.remove('active', 'done');
    if (stepNum < activeStep) el.classList.add('done');
    else if (stepNum === activeStep) el.classList.add('active');
  });
}

function findSpecimenById(id) {
  return (
    state.specimens.find((s) => s.id === id) ||
    state.allCatalog.find((s) => s.id === id) ||
    null
  );
}

// ============================================================================
// TEMA DINÂMICO DE HABITAT & MODO EXPLORADOR / PESQUISADOR
// ============================================================================

function applyHabitatTheme(habitat) {
  const key = HABITAT_META[habitat] ? habitat : 'all';
  state.currentHabitat = key;
  document.body.setAttribute('data-theme-habitat', key);

  document.querySelectorAll('#habitatPortalBar .habitat-card-tab').forEach((btn) => {
    const active = btn.getAttribute('data-habitat') === key;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', String(active));
  });

  const descEl = document.getElementById('habitatContextDescription');
  if (descEl) {
    descEl.textContent = HABITAT_META[key].description;
  }
  const metaTheme = document.getElementById('metaThemeColor');
  if (metaTheme) {
    const themeHexMap = {
      all: '#0F141B',
      aquatico: '#0A1522',
      terrestre: '#0C1713',
      aereo: '#0D1524',
      anfibio: '#0A181A',
      bentonico: '#0B1320',
      microbiologico: '#131324',
    };
    metaTheme.setAttribute('content', themeHexMap[key] || '#0F141B');
  }

  syncUrlParams();
}

function setAudienceMode(mode, notify = false) {
  const normalized = mode === 'researcher' ? 'researcher' : 'explorer';
  state.audienceMode = normalized;
  state.isExpertMode = normalized === 'researcher';
  document.body.setAttribute('data-audience-mode', normalized);

  const btnExp = document.getElementById('btnModeExplorer');
  const btnRes = document.getElementById('btnModeResearcher');
  const mobExp = document.getElementById('mobileSheetModeExplorer');
  const mobRes = document.getElementById('mobileSheetModeResearcher');
  const modalToggle = document.getElementById('modalExpertToggle');
  if (btnExp) btnExp.classList.toggle('active', normalized === 'explorer');
  if (btnRes) btnRes.classList.toggle('active', normalized === 'researcher');
  if (mobExp) mobExp.classList.toggle('active', normalized === 'explorer');
  if (mobRes) mobRes.classList.toggle('active', normalized === 'researcher');
  if (modalToggle) modalToggle.checked = state.isExpertMode;

  syncUrlParams();
  renderResearcherWorkbench();
  syncResearcherCatalogPresentation();

  if (notify) {
    if (state.isExpertMode) {
      showToast('Modo Pesquisador ativo: bancada alométrica, tabela morfométrica, MRCA e literatura científica liberados.');
      const wm = document.getElementById('wikiModal');
      if (wm && !wm.classList.contains('hidden')) {
        switchWikiTab('tab-expert');
      }
    } else {
      showToast('Modo Explorador ativo: curiosidades rápidas e visualização por bioma em destaque.');
    }
  }
}

function buildFriendlyScaleNote(spec) {
  const hab = resolveSpecimenHabitat(spec);
  const habMeta = HABITAT_META[hab] || HABITAT_META.terrestre;
  const meters = parseMetricNumber(spec.length, 'length_m');

  let scalePhrase = `Habita ambientes de ${habMeta.label.toLowerCase()}.`;
  if (meters && Number.isFinite(meters)) {
    if (meters >= 18) {
      const buses = (meters / 12).toFixed(1).replace('.', ',');
      scalePhrase = `Com cerca de ${formatLengthDisplay(meters, spec.length)}, equivale a aproximadamente ${buses} ônibus escolares enfileirados.`;
    } else if (meters >= 3.5) {
      const humans = (meters / 1.75).toFixed(1).replace('.', ',');
      scalePhrase = `Com cerca de ${formatLengthDisplay(meters, spec.length)}, é aproximadamente ${humans}× maior que uma pessoa adulta de 1,75 m.`;
    } else if (meters >= 0.4) {
      scalePhrase = `Comprimento aproximado de ${formatLengthDisplay(meters, spec.length)} — comparável à escala humana (${((meters / 1.75) * 100).toFixed(0)}% da altura de um adulto).`;
    } else if (meters < 0.01) {
      scalePhrase = `Organismo microscópico (${formatLengthDisplay(meters, spec.length)}) — invisível a olho nu e observado apenas com microscopia científica.`;
    }
  }

  const firstCuriosity = Array.isArray(spec.curiosities) && spec.curiosities[0] ? spec.curiosities[0] : '';
  return firstCuriosity ? `${scalePhrase} ${firstCuriosity}` : scalePhrase;
}

// ============================================================================
// PERSISTÊNCIA LOCAL & FIREBASE BRIDGE
// ============================================================================

function loadLocalPersonalData() {
  try {
    const favRaw = localStorage.getItem(STORAGE_KEYS.favorites);
    if (favRaw) {
      const parsed = JSON.parse(favRaw);
      if (Array.isArray(parsed)) state.favoritesSet = new Set(parsed);
    }
  } catch {}

  try {
    const colRaw = localStorage.getItem(STORAGE_KEYS.collections);
    if (colRaw) {
      const parsed = JSON.parse(colRaw);
      if (Array.isArray(parsed)) state.collections = parsed;
    }
  } catch {}

  try {
    const notesRaw = localStorage.getItem(STORAGE_KEYS.notes);
    if (notesRaw) {
      const parsed = JSON.parse(notesRaw);
      if (parsed && typeof parsed === 'object') state.fieldNotes = parsed;
    }
  } catch {}

  try {
    const quizRaw = localStorage.getItem(STORAGE_KEYS.quizStats);
    if (quizRaw) {
      const parsed = JSON.parse(quizRaw);
      if (parsed && typeof parsed === 'object') {
        state.quizStats = normalizeQuizStats(parsed);
      }
    }
  } catch {}

  updatePersonalBadges();
  updateQuizFooterStats();
}

function saveLocalPersonalData() {
  try {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(Array.from(state.favoritesSet)));
    localStorage.setItem(STORAGE_KEYS.collections, JSON.stringify(state.collections));
    localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(state.fieldNotes));
    localStorage.setItem(STORAGE_KEYS.quizStats, JSON.stringify(state.quizStats));
  } catch {}
}

function updatePersonalBadges() {
  const favBadge = document.getElementById('favoritesCountBadge');
  const colBadge = document.getElementById('collectionsCountBadge');
  const favCount = state.favoritesSet.size;
  const colCount = state.collections.length;
  if (favBadge) favBadge.textContent = String(favCount);
  if (colBadge) colBadge.textContent = String(colCount);

  const favBtn = document.getElementById('btnFavoritesFilter');
  if (favBtn) favBtn.classList.toggle('active', state.favoritesOnly);

  const mobFavBadge = document.getElementById('mobileFavBadge');
  const mobColBadge = document.getElementById('mobileColBadge');
  if (mobFavBadge) {
    mobFavBadge.textContent = favCount > 99 ? '99+' : String(favCount);
    mobFavBadge.classList.toggle('hidden', favCount === 0);
  }
  if (mobColBadge) {
    mobColBadge.textContent = colCount > 99 ? '99+' : String(colCount);
    mobColBadge.classList.toggle('hidden', colCount === 0);
  }

  const mobFavBtn = document.getElementById('mobileNavFavorites');
  const mobExploreBtn = document.getElementById('mobileNavExplore');
  if (mobFavBtn) mobFavBtn.classList.toggle('active', state.favoritesOnly);
  if (mobExploreBtn && state.favoritesOnly) mobExploreBtn.classList.remove('active');
}

function initFirebaseIntegration() {
  const fb = window.BioAtlasFirebase;
  if (!fb) {
    loadLocalPersonalData();
    return;
  }

  fb.loadPublicCustomSpecimens()
    .then(async (customList) => {
      if (Array.isArray(customList) && customList.length > 0) {
        try {
          await fetch(`${API_BASE}/api/specimens/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ specimens: customList }),
          });
          await loadCatalog(false);
          renderTreeOfLife();
        } catch (err) {
          console.warn('Falha ao sincronizar espécimes do Firestore:', err);
        }
      }
    })
    .catch((err) => {
      console.warn('Leitura pública do Firestore indisponível no momento:', err);
    });

  fb.subscribeAuth((user) => {
    state.currentUser = user;
    updateAuthHeaderUI(user);

    if (typeof state.unsubFavorites === 'function') {
      state.unsubFavorites();
      state.unsubFavorites = null;
    }
    if (typeof state.unsubCollections === 'function') {
      state.unsubCollections();
      state.unsubCollections = null;
    }
    if (typeof state.unsubNotes === 'function') {
      state.unsubNotes();
      state.unsubNotes = null;
    }

    if (user) {
      state.unsubFavorites = fb.subscribeFavorites((favs) => {
        state.favoritesSet = new Set(favs.map((f) => f.specimenId));
        updatePersonalBadges();
        renderCards(state.specimens);
        syncModalToolButtons();
      });

      state.unsubCollections = fb.subscribeCollections((cols) => {
        state.collections = cols;
        updatePersonalBadges();
        renderCollectionsModalContent();
      });

      if (typeof fb.subscribeNotes === 'function') {
        state.unsubNotes = fb.subscribeNotes((notesMap) => {
          state.fieldNotes = notesMap || {};
          if (state.selectedSpecimen) {
            syncFieldNoteEditor(state.selectedSpecimen);
          }
        });
      }

      if (typeof fb.loadQuizStats === 'function') {
        fb.loadQuizStats()
          .then((cloudStats) => {
            if (cloudStats) {
              state.quizStats = normalizeQuizStats(cloudStats);
              updateQuizFooterStats();
              const qm = document.getElementById('quizModal');
              if (qm && !qm.classList.contains('hidden') && state.quizView !== 'playing') {
                renderQuizModalView();
              }
            }
          })
          .catch((err) => console.warn('Falha ao carregar estatísticas do Quiz:', err));
      }
    } else {
      loadLocalPersonalData();
      renderCards(state.specimens);
      syncModalToolButtons();
      renderCollectionsModalContent();
      if (state.selectedSpecimen) {
        syncFieldNoteEditor(state.selectedSpecimen);
      }
    }

    const qm = document.getElementById('quizModal');
    if (qm && !qm.classList.contains('hidden') && state.quizView !== 'playing') {
      renderQuizModalView();
    }
  });
}

function updateAuthHeaderUI(user) {
  const signInBtn = document.getElementById('btnGoogleSignIn');
  const userPill = document.getElementById('authUserPill');
  const avatar = document.getElementById('authUserAvatar');
  const nameEl = document.getElementById('authUserName');

  if (!signInBtn || !userPill) return;

  if (user) {
    signInBtn.classList.add('hidden');
    userPill.classList.remove('hidden');
    if (nameEl) nameEl.textContent = user.displayName || 'Explorador';
    if (avatar) {
      avatar.src = user.photoURL || getHabitatPlaceholder('all');
      avatar.onerror = () => {
        avatar.src = getHabitatPlaceholder('all');
      };
    }
  } else {
    signInBtn.classList.remove('hidden');
    userPill.classList.add('hidden');
  }
}

async function handleSignInGoogle() {
  const fb = window.BioAtlasFirebase;
  if (!fb) {
    showToast('Autenticação em nuvem indisponível nesta sessão.');
    return;
  }
  try {
    const user = await fb.signInWithGoogle();
    if (user) {
      showToast(`Bem-vindo(a), ${user.displayName}. Favoritos e coleções agora sincronizam na nuvem.`);
    }
  } catch (err) {
    console.error('Erro no login Google:', err);
    showToast('Login cancelado ou bloqueado pelo navegador.');
  }
}

async function handleSignOutGoogle() {
  const fb = window.BioAtlasFirebase;
  if (!fb) return;
  try {
    await fb.signOutUser();
    showToast('Sessão encerrada. Modo local restaurado.');
  } catch (err) {
    console.error('Erro ao sair:', err);
  }
}

// ============================================================================
// INICIALIZAÇÃO PRINCIPAL
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
  loadLocalPersonalData();
  setupEventListeners();
  await bootstrapCatalog();
  renderTreeOfLife();
  await applyInitialUrlParams();
  initFirebaseIntegration();
});

async function bootstrapCatalog() {
  showLoading('Carregando acervo universal de biodiversidade e paleontologia...');
  try {
    const res = await fetch(`${API_BASE}/api/specimens`);
    if (res.ok) {
      const data = await res.json();
      state.allCatalog = Array.isArray(data) ? data : [];
      state.specimens = [...state.allCatalog];
      state.isBackendOnline = true;
      hideLoading();
      renderCards(state.specimens);
      updateStats(state.specimens.length, true);
      return;
    }
  } catch (err) {
    console.warn('Falha ao buscar /api/specimens, tentando fallback JSON:', err);
  }

  try {
    const res = await fetch('/embedded_catalog.json');
    if (res.ok) {
      const data = await res.json();
      state.allCatalog = Array.isArray(data) ? data : [];
      state.specimens = [...state.allCatalog];
      state.isBackendOnline = false;
      hideLoading();
      renderCards(state.specimens);
      updateStats(state.specimens.length, false);
      return;
    }
  } catch {}

  hideLoading();
  renderCards([]);
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function setupEventListeners() {
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
  const habitatPortalBar = document.getElementById('habitatPortalBar');
  const modalExpertToggle = document.getElementById('modalExpertToggle');

  // Auth & Topbar
  const btnGoogleSignIn = document.getElementById('btnGoogleSignIn');
  const btnGoogleSignOut = document.getElementById('btnGoogleSignOut');
  const btnFavoritesFilter = document.getElementById('btnFavoritesFilter');
  const btnOpenCollections = document.getElementById('btnOpenCollections');
  const btnOpenQuiz = document.getElementById('btnOpenQuiz');

  if (btnGoogleSignIn) btnGoogleSignIn.addEventListener('click', handleSignInGoogle);
  if (btnGoogleSignOut) btnGoogleSignOut.addEventListener('click', handleSignOutGoogle);
  if (btnOpenQuiz) btnOpenQuiz.addEventListener('click', openQuizModal);
  if (btnFavoritesFilter) {
    btnFavoritesFilter.addEventListener('click', () => {
      state.favoritesOnly = !state.favoritesOnly;
      if (state.favoritesOnly) state.activeCollectionId = null;
      updatePersonalBadges();
      loadCatalog();
      const catEl = document.getElementById('catalogo');
      if (catEl) catEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  if (btnOpenCollections) {
    btnOpenCollections.addEventListener('click', () => openCollectionsModal(null));
  }

  // Portal de Habitats / Biomas (Muda o tema visual da plataforma!)
  if (habitatPortalBar) {
    habitatPortalBar.addEventListener('click', (e) => {
      const tab = e.target.closest('.habitat-card-tab');
      if (!tab) return;
      const habitat = tab.getAttribute('data-habitat') || 'all';
      applyHabitatTheme(habitat);
      loadCatalog();
    });
  }

  // Alternador de Perfil: Explorador vs Pesquisador
  const btnModeExplorer = document.getElementById('btnModeExplorer');
  const btnModeResearcher = document.getElementById('btnModeResearcher');
  if (btnModeExplorer) btnModeExplorer.addEventListener('click', () => setAudienceMode('explorer', true));
  if (btnModeResearcher) btnModeResearcher.addEventListener('click', () => setAudienceMode('researcher', true));
  if (modalExpertToggle) {
    modalExpertToggle.addEventListener('change', () => {
      setAudienceMode(modalExpertToggle.checked ? 'researcher' : 'explorer', true);
    });
  }
  const btnToggleExpertInFooter = document.getElementById('btnToggleExpertInFooter');
  if (btnToggleExpertInFooter) {
    btnToggleExpertInFooter.addEventListener('click', () => {
      setAudienceMode(state.isExpertMode ? 'explorer' : 'researcher', true);
    });
  }

  setupResearcherModeListeners();

  // Gaveta Retrátil de Filtros Avançados
  const btnToggleFilters = document.getElementById('btnToggleFiltersDrawer');
  const advancedPanel = document.getElementById('advancedFiltersPanel');
  if (btnToggleFilters && advancedPanel) {
    btnToggleFilters.addEventListener('click', () => {
      const willOpen = advancedPanel.classList.contains('hidden');
      advancedPanel.classList.toggle('hidden', !willOpen);
      btnToggleFilters.setAttribute('aria-expanded', String(willOpen));
      btnToggleFilters.classList.toggle('active', willOpen);
    });
  }

  // Busca, Autocomplete com Miniaturas & Ingestão
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      hideSearchAutocomplete();
      handleSearch();
    });
  }
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      const ac = document.getElementById('searchAutocomplete');
      const acVisible = ac && !ac.classList.contains('hidden') && state.autocompleteItems.length > 0;
      if (e.key === 'ArrowDown' && acVisible) {
        e.preventDefault();
        moveAutocompleteSelection(1);
        return;
      }
      if (e.key === 'ArrowUp' && acVisible) {
        e.preventDefault();
        moveAutocompleteSelection(-1);
        return;
      }
      if (e.key === 'Escape' && acVisible) {
        e.preventDefault();
        hideSearchAutocomplete();
        return;
      }
      if (e.key === 'Enter') {
        if (acVisible && state.autocompleteIndex >= 0) {
          e.preventDefault();
          selectAutocompleteItem(state.autocompleteIndex);
          return;
        }
        hideSearchAutocomplete();
        handleSearch();
      }
    });
    searchInput.addEventListener('input', () => {
      const val = searchInput.value.trim();
      if (clearBtn) clearBtn.classList.toggle('hidden', val.length === 0);
      updateSearchAutocomplete(val);
    });
    searchInput.addEventListener('focus', () => {
      const val = searchInput.value.trim();
      if (val.length >= 2) updateSearchAutocomplete(val);
    });
  }
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.command-input-wrap')) {
      hideSearchAutocomplete();
    }
  });
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      clearBtn.classList.add('hidden');
      hideSearchAutocomplete();
      state.searchQuery = '';
      loadCatalog();
    });
  }
  if (btnAutoIngest) {
    btnAutoIngest.addEventListener('click', () => {
      hideSearchAutocomplete();
      handleAutoIngestPrompt();
    });
  }

  // Filtros Padrão
  if (skeletalFilter) {
    skeletalFilter.addEventListener('change', () => {
      state.currentSkeletalType = skeletalFilter.value;
      loadCatalog();
    });
  }
  if (periodFilter) {
    periodFilter.addEventListener('change', () => {
      state.currentPeriod = periodFilter.value;
      loadCatalog();
    });
  }
  if (groupFilter) {
    groupFilter.addEventListener('change', () => {
      state.currentGroup = groupFilter.value;
      loadCatalog();
    });
  }
  if (dietFilter) {
    dietFilter.addEventListener('change', () => {
      state.currentDiet = dietFilter.value;
      loadCatalog();
    });
  }
  if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', () => resetAllFilters());

  const refreshCatalogBtn = document.getElementById('refreshCatalogBtn');
  if (refreshCatalogBtn) {
    refreshCatalogBtn.addEventListener('click', async () => {
      await loadCatalog(true);
      showToast('Acervo atualizado.');
    });
  }

  // Abas de Eras
  if (eraTabsContainer) {
    eraTabsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.era-tab-btn');
      if (!btn) return;
      document.querySelectorAll('.era-tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentEra = btn.getAttribute('data-era');
      clearExtinctionHighlight();
      loadCatalog();
    });
  }

  // Linha do Tempo Geológica & 5 Extinções em Massa
  const timelineSlider = document.getElementById('geologicalTimelineSlider');
  const btnClearTimeline = document.getElementById('btnClearTimeline');
  const extinctionsRow = document.getElementById('extinctionsRow');
  const btnCloseExtinctionBanner = document.getElementById('btnCloseExtinctionBanner');

  if (timelineSlider) {
    timelineSlider.addEventListener('input', () => {
      const slice = mapSliderToGeologicalSlice(timelineSlider.value);
      const readout = document.getElementById('timelineCurrentReadout');
      if (readout) readout.textContent = slice.label;
      if (btnClearTimeline) btnClearTimeline.classList.remove('hidden');
    });
    timelineSlider.addEventListener('change', () => {
      const slice = mapSliderToGeologicalSlice(timelineSlider.value);
      applyTimelineFilter(slice.era, slice.period, slice.label);
    });
  }

  if (btnClearTimeline) {
    btnClearTimeline.addEventListener('click', () => {
      state.currentEra = 'all';
      state.currentPeriod = 'all';
      if (periodFilter) periodFilter.value = 'all';
      document.querySelectorAll('.era-tab-btn').forEach((b) =>
        b.classList.toggle('active', b.getAttribute('data-era') === 'all')
      );
      clearExtinctionHighlight();
      const readout = document.getElementById('timelineCurrentReadout');
      if (readout) readout.textContent = 'Todas as Eras (3.800 Ma – Presente)';
      btnClearTimeline.classList.add('hidden');
      loadCatalog();
    });
  }

  if (extinctionsRow) {
    extinctionsRow.addEventListener('click', (e) => {
      const chip = e.target.closest('.extinction-btn');
      if (!chip) return;
      const extKey = chip.getAttribute('data-extinction');
      const ext = MASS_EXTINCTIONS[extKey];
      if (!ext) return;

      document.querySelectorAll('.extinction-btn').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');

      if (timelineSlider) timelineSlider.value = String(ext.sliderVal);
      if (btnClearTimeline) btnClearTimeline.classList.remove('hidden');

      const banner = document.getElementById('extinctionInfoBanner');
      const bannerText = document.getElementById('extinctionInfoText');
      if (banner && bannerText) {
        bannerText.innerHTML = `<strong>${escapeHtml(ext.title)}</strong> — <em>${escapeHtml(ext.loss)}</em><br>${escapeHtml(ext.summary)}`;
        banner.classList.remove('hidden');
      }

      applyTimelineFilter(ext.era, ext.period, ext.title);
    });
  }

  if (btnCloseExtinctionBanner) {
    btnCloseExtinctionBanner.addEventListener('click', () => {
      const banner = document.getElementById('extinctionInfoBanner');
      if (banner) banner.classList.add('hidden');
    });
  }

  // Abas do Modal Wiki
  const wikiTabsBar = document.querySelector('.wiki-tabs-bar');
  if (wikiTabsBar) {
    wikiTabsBar.addEventListener('click', (e) => {
      const tabBtn = e.target.closest('.wiki-tab-btn');
      if (!tabBtn) return;
      switchWikiTab(tabBtn.getAttribute('data-tab'));
    });
  }

  // Ações rápidas no cabeçalho do Modal Wiki
  const btnModalFavorite = document.getElementById('btnModalFavorite');
  const btnModalAddCollection = document.getElementById('btnModalAddCollection');
  const btnModalCompare = document.getElementById('btnModalCompare');
  const btnModalShareLink = document.getElementById('btnModalShareLink');
  const btnModalExport = document.getElementById('btnModalExport');

  if (btnModalFavorite) {
    btnModalFavorite.addEventListener('click', () => {
      if (state.selectedSpecimen) toggleFavorite(state.selectedSpecimen);
    });
  }
  if (btnModalAddCollection) {
    btnModalAddCollection.addEventListener('click', () => {
      if (state.selectedSpecimen) openCollectionsModal(state.selectedSpecimen);
    });
  }
  if (btnModalCompare) {
    btnModalCompare.addEventListener('click', () => {
      if (state.selectedSpecimen) toggleCompareSpecimen(state.selectedSpecimen.id);
    });
  }
  if (btnModalShareLink) {
    btnModalShareLink.addEventListener('click', () => copyShareableSpecimenLink());
  }
  if (btnModalExport) {
    btnModalExport.addEventListener('click', () => {
      if (state.selectedSpecimen) openExportModalForSpecimen(state.selectedSpecimen);
    });
  }

  // Caderno de Campo (Notas por Espécime)
  const fieldNoteTextarea = document.getElementById('fieldNoteTextarea');
  const btnSaveFieldNote = document.getElementById('btnSaveFieldNote');
  const btnDeleteFieldNote = document.getElementById('btnDeleteFieldNote');
  if (fieldNoteTextarea) {
    fieldNoteTextarea.addEventListener('input', () => {
      const counter = document.getElementById('fieldNoteCharCount');
      if (counter) counter.textContent = `${fieldNoteTextarea.value.length} / 3000`;
    });
  }
  if (btnSaveFieldNote) btnSaveFieldNote.addEventListener('click', saveCurrentFieldNote);
  if (btnDeleteFieldNote) btnDeleteFieldNote.addEventListener('click', clearCurrentFieldNote);

  // Árvore da Vida Interativa (Expandir / Recolher)
  const btnExpandAllTree = document.getElementById('btnExpandAllTree');
  const btnCollapseAllTree = document.getElementById('btnCollapseAllTree');
  if (btnExpandAllTree) {
    btnExpandAllTree.addEventListener('click', () => {
      document.querySelectorAll('#treeOfLifeContainer details.tree-branch').forEach((d) => {
        d.open = true;
      });
    });
  }
  if (btnCollapseAllTree) {
    btnCollapseAllTree.addEventListener('click', () => {
      document.querySelectorAll('#treeOfLifeContainer details.tree-branch').forEach((d) => {
        d.open = false;
      });
    });
  }

  // Filtros da Galeria
  const catContainer = document.getElementById('galleryCategoryChips');
  if (catContainer) {
    catContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.gallery-cat-chip');
      if (!chip) return;
      document.querySelectorAll('.gallery-cat-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      state.galleryActiveCategory = chip.getAttribute('data-cat');
      renderFilteredGallery();
    });
  }

  // Fechar Wiki Modal
  ['closeWikiBtn', 'btnCloseWikiFooter', 'wikiModalBackdrop'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', closeWikiModal);
  });

  // Lightbox
  ['closeLightboxBtn', 'lightboxBackdrop'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', closeLightbox);
  });
  const lbPrev = document.getElementById('lightboxPrevBtn');
  const lbNext = document.getElementById('lightboxNextBtn');
  if (lbPrev) lbPrev.addEventListener('click', () => navigateLightbox(-1));
  if (lbNext) lbNext.addEventListener('click', () => navigateLightbox(1));

  const btnZoomFeatured = document.getElementById('btnZoomFeatured');
  if (btnZoomFeatured) {
    btnZoomFeatured.addEventListener('click', () => {
      if (state.selectedSpecimen) openLightbox(0, 'all');
    });
  }
  const btnOpenFullGallery = document.getElementById('btnOpenFullGalleryPopup');
  if (btnOpenFullGallery) {
    btnOpenFullGallery.addEventListener('click', () => {
      if (state.selectedSpecimen) openLightbox(0, 'all');
    });
  }
  const lightboxCategoryNav = document.getElementById('lightboxCategoryNav');
  if (lightboxCategoryNav) {
    lightboxCategoryNav.addEventListener('click', (e) => {
      const btn = e.target.closest('.lightbox-cat-btn');
      if (!btn) return;
      switchLightboxCategory(btn.getAttribute('data-cat'));
    });
  }

  // Comparador Dock & Modal
  const btnClearCompare = document.getElementById('btnClearCompare');
  const btnOpenCompareModal = document.getElementById('btnOpenCompareModal');
  if (btnClearCompare) {
    btnClearCompare.addEventListener('click', () => {
      state.compareIds = [];
      renderCompareDock();
      renderCards(state.specimens);
      syncModalToolButtons();
    });
  }
  if (btnOpenCompareModal) btnOpenCompareModal.addEventListener('click', openCompareModal);
  ['closeCompareBtn', 'btnCloseCompareFooter', 'compareBackdrop'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', closeCompareModal);
  });

  // Coleções Modal
  ['closeCollectionsBtn', 'btnCloseCollectionsFooter', 'collectionsBackdrop'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', closeCollectionsModal);
  });
  const createColForm = document.getElementById('createCollectionForm');
  if (createColForm) createColForm.addEventListener('submit', handleCreateCollectionSubmit);

  // Quiz Modal
  ['closeQuizBtn', 'btnCloseQuizFooter', 'quizBackdrop'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', closeQuizModal);
  });
  const btnRestartQuiz = document.getElementById('btnRestartQuiz');
  if (btnRestartQuiz) {
    btnRestartQuiz.addEventListener('click', () => {
      if (state.quizView === 'playing' || state.quizView === 'summary' || state.quizView === 'achievements') {
        state.quizView = 'map';
        state.quizSession = null;
        renderQuizModalView();
      } else {
        const diff = getActivePlayableDifficulty();
        const nextLvl = getUnlockedLevelForDiff(diff);
        startQuizLevel(diff, nextLvl);
      }
    });
  }

  // Exportação Científica Modal
  ['closeExportBtn', 'btnCloseExportFooter', 'exportBackdrop'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', closeExportModal);
  });

  // Atalhos de Teclado
  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightboxModal');
    const wm = document.getElementById('wikiModal');
    const cm = document.getElementById('compareModal');
    const colm = document.getElementById('collectionsModal');
    const qm = document.getElementById('quizModal');
    const em = document.getElementById('exportModal');
    const ms = document.getElementById('mobileMenuSheet');

    if (e.key === 'Escape') {
      if (lb && !lb.classList.contains('hidden')) closeLightbox();
      else if (ms && !ms.classList.contains('hidden')) closeMobileMenuSheet();
      else if (em && !em.classList.contains('hidden')) closeExportModal();
      else if (qm && !qm.classList.contains('hidden')) closeQuizModal();
      else if (cm && !cm.classList.contains('hidden')) closeCompareModal();
      else if (colm && !colm.classList.contains('hidden')) closeCollectionsModal();
      else if (wm && !wm.classList.contains('hidden')) closeWikiModal();
    } else if (lb && !lb.classList.contains('hidden')) {
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    }
  });

  // Descoberta & Destaques Rápidos
  const btnRandom = document.getElementById('btnRandomDino');
  if (btnRandom) btnRandom.addEventListener('click', () => discoverRandomSpecimen('all'));

  document.querySelectorAll('.discovery-btn[data-era]').forEach((btn) => {
    btn.addEventListener('click', () => discoverRandomSpecimen(btn.getAttribute('data-era')));
  });

  document.querySelectorAll('.quick-link-btn[data-name]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await openOrIngestSpecimen(btn.getAttribute('data-name'));
    });
  });

  const reloadBtn = document.getElementById('reloadSuggestionsBtn');
  if (reloadBtn) reloadBtn.addEventListener('click', () => resetAllFilters());

  setupMobileExperience();
}

function setMobileActiveTab(tabKey) {
  document.querySelectorAll('#mobileBottomNav .mobile-tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-mobile-tab') === tabKey);
  });
}

function openMobileMenuSheet() {
  const sheet = document.getElementById('mobileMenuSheet');
  const menuBtn = document.getElementById('mobileNavMenu');
  if (!sheet) return;
  sheet.classList.remove('hidden');
  document.body.classList.add('mobile-sheet-open');
  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
  setMobileActiveTab('menu');
}

function closeMobileMenuSheet() {
  const sheet = document.getElementById('mobileMenuSheet');
  const menuBtn = document.getElementById('mobileNavMenu');
  if (!sheet) return;
  sheet.classList.add('hidden');
  document.body.classList.remove('mobile-sheet-open');
  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  setMobileActiveTab(state.favoritesOnly ? 'favorites' : 'explore');
}

function setupMobileExperience() {
  const mobExplore = document.getElementById('mobileNavExplore');
  const mobQuiz = document.getElementById('mobileNavQuiz');
  const mobFavs = document.getElementById('mobileNavFavorites');
  const mobCols = document.getElementById('mobileNavCollections');
  const mobMenu = document.getElementById('mobileNavMenu');

  if (mobExplore) {
    mobExplore.addEventListener('click', () => {
      closeMobileMenuSheet();
      if (state.favoritesOnly) {
        state.favoritesOnly = false;
        updatePersonalBadges();
        loadCatalog();
      }
      setMobileActiveTab('explore');
      const catEl = document.getElementById('catalogo');
      if (catEl) catEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (mobQuiz) {
    mobQuiz.addEventListener('click', () => {
      closeMobileMenuSheet();
      setMobileActiveTab('quiz');
      openQuizModal();
    });
  }

  if (mobFavs) {
    mobFavs.addEventListener('click', () => {
      closeMobileMenuSheet();
      state.favoritesOnly = !state.favoritesOnly;
      if (state.favoritesOnly) state.activeCollectionId = null;
      updatePersonalBadges();
      setMobileActiveTab(state.favoritesOnly ? 'favorites' : 'explore');
      loadCatalog();
      const catEl = document.getElementById('catalogo');
      if (catEl) catEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (mobCols) {
    mobCols.addEventListener('click', () => {
      closeMobileMenuSheet();
      setMobileActiveTab('collections');
      openCollectionsModal(null);
    });
  }

  if (mobMenu) {
    mobMenu.addEventListener('click', () => {
      const sheet = document.getElementById('mobileMenuSheet');
      if (sheet && !sheet.classList.contains('hidden')) {
        closeMobileMenuSheet();
      } else {
        openMobileMenuSheet();
      }
    });
  }

  ['btnCloseMobileSheet', 'mobileSheetBackdrop'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', closeMobileMenuSheet);
  });

  const mobExp = document.getElementById('mobileSheetModeExplorer');
  const mobRes = document.getElementById('mobileSheetModeResearcher');
  if (mobExp) {
    mobExp.addEventListener('click', () => {
      setAudienceMode('explorer', true);
      closeMobileMenuSheet();
    });
  }
  if (mobRes) {
    mobRes.addEventListener('click', () => {
      setAudienceMode('researcher', true);
      closeMobileMenuSheet();
    });
  }

  const mobTimeline = document.getElementById('mobileActionTimeline');
  if (mobTimeline) {
    mobTimeline.addEventListener('click', () => {
      closeMobileMenuSheet();
      const el = document.getElementById('linha-do-tempo');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  const mobTree = document.getElementById('mobileActionTree');
  if (mobTree) {
    mobTree.addEventListener('click', () => {
      closeMobileMenuSheet();
      const el = document.getElementById('arvore-da-vida');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  const mobFilters = document.getElementById('mobileActionFilters');
  if (mobFilters) {
    mobFilters.addEventListener('click', () => {
      closeMobileMenuSheet();
      const panel = document.getElementById('advancedFiltersPanel');
      const toggleBtn = document.getElementById('btnToggleFiltersDrawer');
      if (panel) panel.classList.remove('hidden');
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', 'true');
        toggleBtn.classList.add('active');
      }
      const catEl = document.getElementById('catalogo');
      if (catEl) catEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  const mobRandom = document.getElementById('mobileActionRandom');
  if (mobRandom) {
    mobRandom.addEventListener('click', () => {
      closeMobileMenuSheet();
      discoverRandomSpecimen('all');
    });
  }

  const mobTop = document.getElementById('mobileActionTop');
  if (mobTop) {
    mobTop.addEventListener('click', () => {
      closeMobileMenuSheet();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 320);
      }
    });
  }

  // Gesto de swipe horizontal no Lightbox para navegação fluida por toque
  const lbStage = document.querySelector('#lightboxModal .lightbox-main-stage');
  if (lbStage) {
    let swipeStartX = 0;
    let swipeStartY = 0;
    lbStage.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches.length !== 1) return;
        swipeStartX = e.touches[0].clientX;
        swipeStartY = e.touches[0].clientY;
      },
      { passive: true }
    );
    lbStage.addEventListener(
      'touchend',
      (e) => {
        if (!e.changedTouches || e.changedTouches.length !== 1) return;
        const dx = e.changedTouches[0].clientX - swipeStartX;
        const dy = e.changedTouches[0].clientY - swipeStartY;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.25) {
          navigateLightbox(dx < 0 ? 1 : -1);
        }
      },
      { passive: true }
    );
  }
}

function applyTimelineFilter(era, period, label) {
  state.currentEra = era || 'all';
  state.currentPeriod = period || 'all';

  document.querySelectorAll('.era-tab-btn').forEach((b) =>
    b.classList.toggle('active', b.getAttribute('data-era') === state.currentEra)
  );
  const periodFilter = document.getElementById('periodFilter');
  if (periodFilter) {
    const hasOption = Array.from(periodFilter.options).some((o) => o.value === state.currentPeriod);
    periodFilter.value = hasOption ? state.currentPeriod : 'all';
  }
  const readout = document.getElementById('timelineCurrentReadout');
  if (readout) readout.textContent = label;

  loadCatalog();
}

function clearExtinctionHighlight() {
  document.querySelectorAll('.extinction-btn').forEach((c) => c.classList.remove('active'));
  const banner = document.getElementById('extinctionInfoBanner');
  if (banner) banner.classList.add('hidden');
}

// ============================================================================
// CARREGAMENTO & FILTRAGEM DO CATÁLOGO
// ============================================================================

async function loadCatalog(showSpinner = false) {
  if (showSpinner) showLoading('Filtrando acervo...');

  const params = new URLSearchParams();
  if (state.currentHabitat && state.currentHabitat !== 'all') {
    params.append('habitat', state.currentHabitat);
  }
  if (state.currentEra && state.currentEra !== 'all') {
    if (state.currentEra === 'microbiologico') {
      params.append('skeletal_type', 'microbiologico');
    } else {
      params.append('era', state.currentEra);
    }
  }
  if (state.currentPeriod && state.currentPeriod !== 'all') params.append('period', state.currentPeriod);
  if (state.currentGroup && state.currentGroup !== 'all') params.append('group', state.currentGroup);
  if (state.currentDiet && state.currentDiet !== 'all') params.append('diet', state.currentDiet);
  if (state.currentSkeletalType && state.currentSkeletalType !== 'all') params.append('skeletal_type', state.currentSkeletalType);
  if (state.currentClade) params.append('clade', state.currentClade);
  if (state.searchQuery) params.append('search', state.searchQuery);

  let list = [];
  if (state.isBackendOnline) {
    try {
      const res = await fetch(`${API_BASE}/api/specimens?${params.toString()}`);
      if (res.ok) {
        list = await res.json();
        if (params.toString() === '') {
          state.allCatalog = [...list];
        } else {
          list.forEach((item) => {
            if (!state.allCatalog.some((c) => c.id === item.id)) {
              state.allCatalog.push(item);
            }
          });
        }
      } else {
        list = filterLocalCatalog();
      }
    } catch {
      list = filterLocalCatalog();
    }
  } else {
    list = filterLocalCatalog();
  }

  if (state.favoritesOnly) {
    list = list.filter((s) => state.favoritesSet.has(s.id));
  } else if (state.activeCollectionId) {
    const col = state.collections.find((c) => c.id === state.activeCollectionId);
    if (col) {
      const idSet = new Set(col.specimenIds || []);
      list = list.filter((s) => idSet.has(s.id));
    }
  }

  state.specimens = list;
  hideLoading();
  renderCards(list);
  updateStats(list.length, state.isBackendOnline);
  renderActiveSpecialFilters();
  syncUrlParams();
}

function filterLocalCatalog() {
  let list = [...state.allCatalog];

  if (state.currentHabitat && state.currentHabitat !== 'all') {
    list = list.filter((s) => resolveSpecimenHabitat(s) === state.currentHabitat);
  }
  if (state.currentEra && state.currentEra !== 'all') {
    if (state.currentEra === 'microbiologico') {
      list = list.filter((s) => s.skeletal_type === 'microbiologico');
    } else {
      list = list.filter((s) => normalizeStr(s.era) === normalizeStr(state.currentEra));
    }
  }
  if (state.currentPeriod && state.currentPeriod !== 'all') {
    const p = normalizeStr(state.currentPeriod);
    list = list.filter((s) => normalizeStr(s.period).includes(p) || normalizeStr(s.epoch).includes(p));
  }
  if (state.currentGroup && state.currentGroup !== 'all') {
    const g = normalizeStr(state.currentGroup);
    list = list.filter((s) => normalizeStr(s.group) === g || normalizeStr(s.group_display).includes(g));
  }
  if (state.currentDiet && state.currentDiet !== 'all') {
    list = list.filter((s) => normalizeStr(s.diet) === normalizeStr(state.currentDiet));
  }
  if (state.currentSkeletalType && state.currentSkeletalType !== 'all') {
    list = list.filter((s) => normalizeStr(s.skeletal_type) === normalizeStr(state.currentSkeletalType));
  }
  if (state.currentClade) {
    const cl = normalizeStr(state.currentClade);
    list = list.filter(
      (s) =>
        Array.isArray(s.expert?.cladogram) &&
        s.expert.cladogram.some((node) => normalizeStr(node).includes(cl))
    );
  }
  if (state.searchQuery) {
    const q = normalizeStr(state.searchQuery);
    list = list.filter(
      (s) =>
        normalizeStr(s.name).includes(q) ||
        normalizeStr(s.genus).includes(q) ||
        normalizeStr(s.scientific_name).includes(q) ||
        normalizeStr(s.bio).includes(q) ||
        normalizeStr(s.group_display).includes(q) ||
        normalizeStr(s.etymology).includes(q)
    );
  }
  return list;
}

function renderActiveSpecialFilters() {
  const wrap = document.getElementById('activeSpecialFilters');
  if (!wrap) return;
  wrap.innerHTML = '';

  if (state.currentClade) {
    const pill = document.createElement('span');
    pill.className = 'special-filter-pill';
    pill.innerHTML = `Clado: <strong>${escapeHtml(state.currentClade)}</strong> <button type="button" aria-label="Remover filtro de clado">&times;</button>`;
    pill.querySelector('button').addEventListener('click', () => {
      state.currentClade = '';
      loadCatalog();
    });
    wrap.appendChild(pill);
  }

  if (state.favoritesOnly) {
    const pill = document.createElement('span');
    pill.className = 'special-filter-pill';
    pill.innerHTML = `Apenas Favoritos <button type="button" aria-label="Remover filtro de favoritos">&times;</button>`;
    pill.querySelector('button').addEventListener('click', () => {
      state.favoritesOnly = false;
      updatePersonalBadges();
      loadCatalog();
    });
    wrap.appendChild(pill);
  }

  if (state.activeCollectionId) {
    const col = state.collections.find((c) => c.id === state.activeCollectionId);
    if (col) {
      const pill = document.createElement('span');
      pill.className = 'special-filter-pill';
      pill.innerHTML = `Coleção: <strong>${escapeHtml(col.name)}</strong> <button type="button" aria-label="Sair da coleção">&times;</button>`;
      pill.querySelector('button').addEventListener('click', () => {
        state.activeCollectionId = null;
        loadCatalog();
      });
      wrap.appendChild(pill);
    }
  }
}

// ============================================================================
// RENDERIZAÇÃO DE CARDS COM TEMA INDIVIDUAL DE HABITAT (ZERO-PILL METADATA)
// ============================================================================

function renderCards(specimens) {
  const resultsGrid = document.getElementById('results');
  const emptyState = document.getElementById('emptyState');
  if (!resultsGrid || !emptyState) return;

  resultsGrid.innerHTML = '';

  if (!specimens || specimens.length === 0) {
    const emptyTitle = document.getElementById('emptyTitle');
    const emptyDesc = document.getElementById('emptyDesc');
    if (emptyTitle) emptyTitle.textContent = 'Nenhum espécime encontrado para este recorte';
    if (emptyDesc) {
      emptyDesc.innerHTML =
        'Você pode catalogar qualquer animal vivo, fóssil ou microrganismo real digitando o nome na barra de busca acima e clicando em <strong>Catalogar via API</strong>.';
    }
    emptyState.classList.remove('hidden');
    resultsGrid.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  resultsGrid.classList.remove('hidden');

  const fragment = document.createDocumentFragment();

  specimens.forEach((spec) => {
    const habitatKey = resolveSpecimenHabitat(spec);
    const habitatInfo = HABITAT_META[habitatKey] || HABITAT_META.terrestre;

    const card = document.createElement('article');
    card.className = 'specimen-card';
    card.setAttribute('data-id', spec.id);
    card.setAttribute('data-habitat', habitatKey);

    const skeletalLabel =
      spec.skeletal_type === 'microbiologico'
        ? 'Microbiológico'
        : spec.skeletal_type === 'vertebrado'
        ? 'Vertebrado'
        : 'Invertebrado';

    const anatomyBtnLabel =
      spec.skeletal_type === 'microbiologico'
        ? 'Citologia'
        : spec.skeletal_type === 'vertebrado'
        ? 'Esqueleto'
        : 'Anatomia';

    const galleryCount = (spec.gallery && spec.gallery.length) || 1;
    const isFav = state.favoritesSet.has(spec.id);
    const isCmp = state.compareIds.includes(spec.id);

    const curiosityTeaser =
      Array.isArray(spec.curiosities) && spec.curiosities[0]
        ? truncateText(spec.curiosities[0], 92)
        : truncateText(spec.bio, 92);

    const cladePath =
      Array.isArray(spec.expert?.cladogram) && spec.expert.cladogram.length > 0
        ? spec.expert.cladogram.slice(-4).join(' › ')
        : spec.skeletal_composition || skeletalLabel;

    const iucn = parseIucnStatus(spec);
    const iucnInlineHtml = iucn
      ? ` · <span class="card-iucn-inline iucn-${iucn.code}" title="Lista Vermelha IUCN: ${escapeHtml(iucn.label)}">IUCN ${iucn.code}</span>`
      : '';

    card.innerHTML = `
      <div class="card-media-wrap">
        <img
          src="${escapeHtml(resolveDisplayImageUrl(spec.image_url, habitatKey))}"
          alt="${escapeHtml(spec.name)}"
          class="card-img"
          loading="lazy"
          decoding="async"
        />
        <div class="card-media-scrim" aria-hidden="true"></div>

        <div class="card-top-tools">
          <button type="button" class="card-icon-action btn-card-fav ${isFav ? 'is-favorited' : ''}" title="${isFav ? 'Remover dos favoritos' : 'Favoritar espécime'}" aria-label="${isFav ? 'Remover dos favoritos' : 'Favoritar espécime'}">
            ${isFav ? '★' : '☆'}
          </button>
          <button type="button" class="card-icon-action btn-card-cmp ${isCmp ? 'is-compared' : ''}" title="${isCmp ? 'Remover do comparador' : 'Adicionar ao comparador'}" aria-label="Comparar espécime">
            ⚖
          </button>
        </div>

        <div class="card-media-footer">
          <span class="card-habitat-kicker">
            <span class="card-habitat-accent-text">${escapeHtml(habitatInfo.shortLabel)}</span>
            <span class="meta-sep" aria-hidden="true">·</span>
            <span>${escapeHtml(spec.era_display)}</span>
          </span>
          ${
            galleryCount > 1
              ? `<button type="button" class="card-photo-trigger" data-id="${escapeHtml(spec.id)}">${galleryCount} fotos</button>`
              : ''
          }
        </div>
      </div>

      <div class="card-content">
        <h3 class="card-title">${escapeHtml(spec.name)}</h3>
        <p class="card-scientific-name">${escapeHtml(spec.scientific_name || spec.genus)}</p>

        <p class="card-meta-line">
          ${escapeHtml(skeletalLabel)} · ${escapeHtml(spec.diet_display)} · ${escapeHtml(spec.period)}${iucnInlineHtml}
        </p>

        <p class="card-bio">${escapeHtml(truncateText(spec.bio, 125))}</p>

        <div class="card-audience-insight insight-explorer">
          <strong>Você sabia?</strong> ${escapeHtml(curiosityTeaser)}
        </div>
        <div class="card-audience-insight insight-researcher">
          <strong>Clado:</strong> ${escapeHtml(cladePath)}
        </div>

        <div class="card-specs-strip">
          <div class="spec-mini">
            <span class="mini-label">Comprimento</span>
            <span class="mini-val">${escapeHtml(spec.length || 'Em estudo')}</span>
          </div>
          <div class="spec-mini">
            <span class="mini-label">Massa</span>
            <span class="mini-val">${escapeHtml(spec.weight || 'Em estudo')}</span>
          </div>
        </div>

        <div class="card-actions">
          <button type="button" class="btn-card-open" data-id="${escapeHtml(spec.id)}">
            Explorar Dossiê →
          </button>
          <button type="button" class="btn-card-anatomy" data-id="${escapeHtml(spec.id)}" title="Abrir aba estrutural e anatômica">
            ${escapeHtml(anatomyBtnLabel)}
          </button>
        </div>
      </div>
    `;

    const imgEl = card.querySelector('.card-img');
    imgEl.addEventListener('error', () => handleImageFallback(imgEl, spec.image_url, habitatKey));

    card.querySelector('.btn-card-fav').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(spec);
    });
    card.querySelector('.btn-card-cmp').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleCompareSpecimen(spec.id);
    });
    card.querySelector('.btn-card-open').addEventListener('click', () => openWikiModal(spec.id, 'tab-overview'));
    card.querySelector('.btn-card-anatomy').addEventListener('click', () => openWikiModal(spec.id, 'tab-skeleton'));
    card.querySelector('.card-media-wrap').addEventListener('click', (e) => {
      if (e.target.closest('.card-photo-trigger')) {
        e.stopPropagation();
        openLightboxForSpecimen(spec.id);
        return;
      }
      if (e.target.closest('.card-top-tools')) return;
      openWikiModal(spec.id, 'tab-overview');
    });

    fragment.appendChild(card);
  });

  resultsGrid.appendChild(fragment);
  renderResearcherWorkbench();
  syncResearcherCatalogPresentation();
}

function resolveDisplayImageUrl(rawUrl, habitatKey = 'all') {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return getHabitatPlaceholder(habitatKey);
  }
  if (rawUrl.startsWith('data:') || rawUrl.startsWith('/') || rawUrl.includes('/api/proxy-image')) {
    return rawUrl;
  }
  if (
    state.isBackendOnline &&
    /^https:\/\/(upload|thumb|commons)\.wikimedia\.org\//i.test(rawUrl)
  ) {
    return `${API_BASE}/api/proxy-image?url=${encodeURIComponent(rawUrl)}`;
  }
  return rawUrl;
}

function handleImageFallback(imgEl, originalUrl, habitatKey = 'all') {
  if (!imgEl || imgEl.dataset.fallbackStage === 'placeholder') return;

  const isCurrentlyProxied = (imgEl.currentSrc || imgEl.src || '').includes('/api/proxy-image');

  if (
    isCurrentlyProxied &&
    imgEl.dataset.fallbackStage !== 'direct' &&
    originalUrl &&
    originalUrl.startsWith('https://')
  ) {
    imgEl.dataset.fallbackStage = 'direct';
    imgEl.referrerPolicy = 'no-referrer';
    imgEl.src = originalUrl;
  } else if (
    !isCurrentlyProxied &&
    imgEl.dataset.fallbackStage !== 'proxy' &&
    originalUrl &&
    originalUrl.startsWith('https://') &&
    !originalUrl.includes('/api/proxy-image')
  ) {
    imgEl.dataset.fallbackStage = 'proxy';
    imgEl.src = `${API_BASE}/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
  } else {
    imgEl.dataset.fallbackStage = 'placeholder';
    imgEl.src = getHabitatPlaceholder(habitatKey);
  }
}

// ============================================================================
// BUSCA & INGESTÃO AUTOMÁTICA COM PROGRESSO EM ETAPAS (SSE + FALLBACK POST)
// ============================================================================

async function handleSearch() {
  const searchInput = document.getElementById('searchInput');
  const query = searchInput ? searchInput.value.trim() : '';
  state.searchQuery = query;

  if (!query) {
    await loadCatalog();
    return;
  }

  await loadCatalog(false);
  if (state.specimens.length > 0) {
    showToast(`Encontrado(s) ${state.specimens.length} espécime(s) para "${query}".`);
    return;
  }

  if (state.isBackendOnline) {
    showToast(`Buscando "${query}" nas bases científicas (Wikipédia, GBIF, PBDB e Wikimedia)...`);
    await executeAutoIngest(query);
  }
}

async function handleAutoIngestPrompt() {
  const searchInput = document.getElementById('searchInput');
  const query = searchInput ? searchInput.value.trim() : '';
  if (!query) {
    showToast('Digite o nome de um animal ou organismo para catalogar via API.');
    if (searchInput) searchInput.focus();
    return;
  }
  await executeAutoIngest(query);
}

async function executeAutoIngest(taxonName) {
  showLoading(`Iniciando consulta científica para "${taxonName}"...`, true);
  const eraHint =
    state.currentEra && state.currentEra !== 'all' && state.currentEra !== 'microbiologico'
      ? state.currentEra
      : '';

  const result = await ingestWithSseProgress(taxonName, eraHint);
  hideLoading();

  if (result && result.success && result.specimen) {
    state.isBackendOnline = true;
    showToast(result.message || `Espécime "${result.specimen.name}" catalogado com sucesso.`);

    const idxAll = state.allCatalog.findIndex((s) => s.id === result.specimen.id);
    if (idxAll >= 0) state.allCatalog[idxAll] = result.specimen;
    else state.allCatalog.unshift(result.specimen);

    const idxCur = state.specimens.findIndex((s) => s.id === result.specimen.id);
    if (idxCur >= 0) state.specimens[idxCur] = result.specimen;
    else state.specimens.unshift(result.specimen);

    renderCards(state.specimens);
    renderTreeOfLife();
    updateStats(state.specimens.length, true);
    openWikiModal(result.specimen.id, 'tab-overview');

    if (result.specimen.is_custom_ingested && window.BioAtlasFirebase && state.currentUser) {
      window.BioAtlasFirebase.saveCustomSpecimen(result.specimen)
        .then((saved) => {
          if (saved) showToast(`"${result.specimen.name}" salvo permanentemente na nuvem.`);
        })
        .catch((err) => {
          console.warn('Não foi possível salvar no Firestore:', err);
        });
    }
  } else {
    const rejectMsg =
      (result && result.message) ||
      'Não foi possível validar este termo como uma espécie ou fóssil real nas bases científicas.';
    showToast(rejectMsg);
    const emptyTitle = document.getElementById('emptyTitle');
    const emptyDesc = document.getElementById('emptyDesc');
    const emptyState = document.getElementById('emptyState');
    if (emptyTitle) emptyTitle.textContent = `"${taxonName}" não é um organismo biológico catalogável`;
    if (emptyDesc) emptyDesc.textContent = rejectMsg;
    if (emptyState && state.specimens.length === 0) {
      emptyState.classList.remove('hidden');
    }
  }
}

function ingestWithSseProgress(taxonName, eraHint) {
  return new Promise((resolve) => {
    if (typeof EventSource === 'undefined') {
      fallbackPostIngest(taxonName, eraHint).then(resolve);
      return;
    }

    const params = new URLSearchParams({ name: taxonName });
    if (eraHint) params.set('era_hint', eraHint);

    let settled = false;
    const es = new EventSource(`${API_BASE}/api/ingest-stream?${params.toString()}`);

    const finish = (payload) => {
      if (settled) return;
      settled = true;
      es.close();
      resolve(payload);
    };

    const stageToStep = {
      cache: 1,
      wikipedia: 1,
      gbif: 2,
      pbdb: 3,
      wikimedia: 4,
      done: 5,
    };

    es.addEventListener('progress', (ev) => {
      try {
        const data = JSON.parse(ev.data);
        const msgEl = document.getElementById('loadingMessage');
        const text = data.label || data.message;
        if (msgEl && text) msgEl.textContent = text;
        const step = data.step || stageToStep[data.stage];
        if (step) updateIngestStepper(Number(step));
      } catch {}
    });

    es.addEventListener('result', (ev) => {
      try {
        updateIngestStepper(5);
        finish(JSON.parse(ev.data));
      } catch {
        finish({ success: false, message: 'Resposta inesperada do servidor.' });
      }
    });

    es.addEventListener('error', () => {
      if (!settled) {
        es.close();
        settled = true;
        fallbackPostIngest(taxonName, eraHint).then(resolve);
      }
    });
  });
}

async function fallbackPostIngest(taxonName, eraHint) {
  try {
    const res = await fetch(`${API_BASE}/api/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: taxonName, era_hint: eraHint || null }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Erro na ingestão POST:', err);
    return { success: false, message: 'Falha ao consultar as APIs científicas no momento.' };
  }
}

async function openOrIngestSpecimen(name) {
  const norm = normalizeStr(name);
  const cleanId = norm.replace(/\s+/g, '-');
  const pool = [...state.specimens, ...state.allCatalog];
  const found = pool.find((s) => {
    const sId = normalizeStr(s.id);
    const sName = normalizeStr(s.name);
    const sGenus = normalizeStr(s.genus);
    const sSci = normalizeStr(s.scientific_name);
    return (
      sId === cleanId ||
      sName === norm ||
      sName.includes(norm) ||
      norm.includes(sName) ||
      sGenus === norm ||
      (sSci && sSci.includes(norm))
    );
  });

  if (found) {
    openWikiModal(found.id, 'tab-overview');
  } else {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearBtn');
    if (searchInput) searchInput.value = name;
    if (clearBtn) clearBtn.classList.remove('hidden');
    await executeAutoIngest(name);
  }
}

function discoverRandomSpecimen(era = 'all') {
  let pool = state.allCatalog.length > 0 ? state.allCatalog : state.specimens;
  if (era && era !== 'all') {
    if (era === 'microbiologico') {
      pool = pool.filter((s) => s.skeletal_type === 'microbiologico');
    } else {
      pool = pool.filter((s) => normalizeStr(s.era) === normalizeStr(era));
    }
  }
  if (pool.length === 0) pool = state.allCatalog;
  if (pool.length === 0) return;

  const lucky = pool[Math.floor(Math.random() * pool.length)];
  showToast(`Sorteado: ${lucky.name} (${lucky.era_display}).`);
  openWikiModal(lucky.id, 'tab-overview');
}

// ============================================================================
// FAVORITOS & COLEÇÕES
// ============================================================================

async function toggleFavorite(spec) {
  const isCurrentlyFav = state.favoritesSet.has(spec.id);
  const nextState = !isCurrentlyFav;

  if (nextState) state.favoritesSet.add(spec.id);
  else state.favoritesSet.delete(spec.id);

  updatePersonalBadges();
  renderCards(state.specimens);
  syncModalToolButtons();

  if (state.currentUser && window.BioAtlasFirebase) {
    try {
      await window.BioAtlasFirebase.setFavorite(spec, nextState);
    } catch (err) {
      console.error('Erro ao salvar favorito no Firestore:', err);
    }
  } else {
    saveLocalPersonalData();
  }

  showToast(
    nextState ? `"${spec.name}" adicionado aos favoritos.` : `"${spec.name}" removido dos favoritos.`
  );
}

function openCollectionsModal(specimenToAssign = null) {
  state.assignSpecimenForCollection = specimenToAssign;
  renderCollectionsModalContent();
  const modal = document.getElementById('collectionsModal');
  if (modal) modal.classList.remove('hidden');
}

function closeCollectionsModal() {
  const modal = document.getElementById('collectionsModal');
  if (modal) modal.classList.add('hidden');
  state.assignSpecimenForCollection = null;
  setMobileActiveTab(state.favoritesOnly ? 'favorites' : 'explore');
}

function renderCollectionsModalContent() {
  const banner = document.getElementById('collectionsSyncBanner');
  const assignBox = document.getElementById('collectionAssignContext');
  const container = document.getElementById('collectionsListContainer');
  if (!container) return;

  if (banner) {
    if (state.currentUser) {
      banner.innerHTML = `<span>Conectado como <strong>${escapeHtml(state.currentUser.displayName)}</strong> — coleções sincronizadas em tempo real.</span>`;
    } else {
      banner.innerHTML = `
        <span>Modo local ativo. Entre com sua conta Google para sincronizar coleções na nuvem.</span>
        <button type="button" id="btnSignInFromCollections" class="btn-primary-sm">Entrar com Google</button>
      `;
      const btn = banner.querySelector('#btnSignInFromCollections');
      if (btn) btn.addEventListener('click', handleSignInGoogle);
    }
  }

  if (assignBox) {
    if (state.assignSpecimenForCollection) {
      assignBox.classList.remove('hidden');
      assignBox.innerHTML = `Escolha uma coleção abaixo (ou crie uma nova) para salvar <strong>${escapeHtml(state.assignSpecimenForCollection.name)}</strong>.`;
    } else {
      assignBox.classList.add('hidden');
    }
  }

  container.innerHTML = '';

  if (state.collections.length === 0) {
    container.innerHTML = `
      <div class="collection-item-card">
        <div class="collection-item-info">
          <h4>Nenhuma coleção criada ainda</h4>
          <p>Use o formulário acima para montar coleções temáticas (ex.: "Gigantes dos Oceanos", "Dinossauros do Cretáceo").</p>
        </div>
      </div>
    `;
    return;
  }

  state.collections.forEach((col) => {
    const ids = Array.isArray(col.specimenIds) ? col.specimenIds : [];
    const targetSpec = state.assignSpecimenForCollection;
    const hasTarget = targetSpec ? ids.includes(targetSpec.id) : false;

    const card = document.createElement('div');
    card.className = 'collection-item-card';
    card.innerHTML = `
      <div class="collection-item-info">
        <h4>${escapeHtml(col.name)} <small class="tabular-num" style="color:var(--accent);">(${ids.length})</small></h4>
        <p>${escapeHtml(col.description || 'Coleção personalizada do BioAtlas')}</p>
      </div>
      <div class="collection-item-actions">
        ${
          targetSpec
            ? `<button type="button" class="${hasTarget ? 'btn-outline-sm' : 'btn-primary-sm'} btn-toggle-assign">
                 ${hasTarget ? 'Salvo (Remover)' : 'Adicionar aqui'}
               </button>`
            : ''
        }
        <button type="button" class="btn-outline-sm btn-view-collection">Filtrar catálogo</button>
        <button type="button" class="btn-outline-sm btn-export-collection">Exportar</button>
        <button type="button" class="danger-btn btn-delete-collection">Excluir</button>
      </div>
    `;

    const assignBtn = card.querySelector('.btn-toggle-assign');
    if (assignBtn && targetSpec) {
      assignBtn.addEventListener('click', async () => {
        const nextIds = hasTarget ? ids.filter((id) => id !== targetSpec.id) : [...ids, targetSpec.id];
        await updateCollectionIds(col.id, nextIds);
        showToast(
          hasTarget
            ? `"${targetSpec.name}" removido de "${col.name}".`
            : `"${targetSpec.name}" salvo em "${col.name}".`
        );
      });
    }

    card.querySelector('.btn-view-collection').addEventListener('click', () => {
      state.activeCollectionId = col.id;
      state.favoritesOnly = false;
      closeCollectionsModal();
      closeWikiModal();
      updatePersonalBadges();
      loadCatalog();
      showToast(`Exibindo coleção "${col.name}".`);
    });

    card.querySelector('.btn-export-collection').addEventListener('click', () => {
      openExportModalForCollection(col);
    });

    card.querySelector('.btn-delete-collection').addEventListener('click', async () => {
      await removeCollection(col.id);
      showToast(`Coleção "${col.name}" excluída.`);
    });

    container.appendChild(card);
  });
}

async function handleCreateCollectionSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById('newCollectionName');
  const descInput = document.getElementById('newCollectionDesc');
  const name = nameInput ? nameInput.value.trim() : '';
  const description = descInput ? descInput.value.trim() : '';
  if (!name) return;

  const initialIds = state.assignSpecimenForCollection ? [state.assignSpecimenForCollection.id] : [];

  if (state.currentUser && window.BioAtlasFirebase) {
    try {
      await window.BioAtlasFirebase.createCollection(name, description, initialIds);
      showToast(`Coleção "${name}" criada na nuvem.`);
    } catch (err) {
      console.error('Erro ao criar coleção:', err);
      showToast('Erro ao salvar coleção na nuvem.');
    }
  } else {
    state.collections.unshift({
      id: `local-${Date.now().toString(36)}`,
      name,
      description,
      specimenIds: initialIds,
      ownerId: 'local',
    });
    saveLocalPersonalData();
    updatePersonalBadges();
    renderCollectionsModalContent();
    showToast(`Coleção "${name}" criada localmente.`);
  }

  if (nameInput) nameInput.value = '';
  if (descInput) descInput.value = '';
}

async function updateCollectionIds(collectionId, nextIds) {
  if (state.currentUser && window.BioAtlasFirebase) {
    await window.BioAtlasFirebase.updateCollectionSpecimens(collectionId, nextIds);
  } else {
    const col = state.collections.find((c) => c.id === collectionId);
    if (col) col.specimenIds = Array.from(new Set(nextIds));
    saveLocalPersonalData();
    renderCollectionsModalContent();
  }
}

async function removeCollection(collectionId) {
  if (state.activeCollectionId === collectionId) {
    state.activeCollectionId = null;
    loadCatalog();
  }
  if (state.currentUser && window.BioAtlasFirebase) {
    await window.BioAtlasFirebase.deleteCollection(collectionId);
  } else {
    state.collections = state.collections.filter((c) => c.id !== collectionId);
    saveLocalPersonalData();
    updatePersonalBadges();
    renderCollectionsModalContent();
  }
}

// ============================================================================
// COMPARADOR CIENTÍFICO LADO A LADO (ESCALA HUMANA SVG + BIOMETRIA)
// ============================================================================

function toggleCompareSpecimen(specId) {
  const idx = state.compareIds.indexOf(specId);
  if (idx >= 0) {
    state.compareIds.splice(idx, 1);
  } else {
    if (state.compareIds.length >= 3) {
      showToast('Limite de 3 espécimes no comparador. Remova um para adicionar outro.');
      return;
    }
    state.compareIds.push(specId);
  }
  renderCompareDock();
  renderCards(state.specimens);
  syncModalToolButtons();
}

function renderCompareDock() {
  const dock = document.getElementById('compareDock');
  const countEl = document.getElementById('compareDockCount');
  const chipsEl = document.getElementById('compareDockChips');
  const openBtn = document.getElementById('btnOpenCompareModal');
  if (!dock || !countEl || !chipsEl || !openBtn) return;

  if (state.compareIds.length === 0) {
    dock.classList.add('hidden');
    return;
  }

  dock.classList.remove('hidden');
  countEl.textContent = String(state.compareIds.length);
  openBtn.disabled = state.compareIds.length < 2;
  openBtn.textContent =
    state.compareIds.length < 2 ? 'Selecione +1 espécime' : `Comparar (${state.compareIds.length})`;

  chipsEl.innerHTML = '';
  state.compareIds.forEach((id) => {
    const spec = findSpecimenById(id);
    if (!spec) return;
    const chip = document.createElement('span');
    chip.className = 'compare-chip';
    chip.innerHTML = `<span>${escapeHtml(spec.name)}</span><button type="button" aria-label="Remover">&times;</button>`;
    chip.querySelector('button').addEventListener('click', () => toggleCompareSpecimen(id));
    chipsEl.appendChild(chip);
  });
}

function parseMetricNumber(raw, mode) {
  if (!raw || typeof raw !== 'string') return null;
  const s = raw.replace(/\./g, '').replace(',', '.');
  const matches = s.match(/(\d+(?:\.\d+)?)/g);
  if (!matches || matches.length === 0) return null;
  const nums = matches.map(Number).filter((n) => Number.isFinite(n));
  if (nums.length === 0) return null;
  const val = Math.max(...nums);
  const lower = raw.toLowerCase();

  if (mode === 'length_m') {
    if (lower.includes('µm') || lower.includes('um') || lower.includes('micr')) return val * 1e-6;
    if (lower.includes('nm')) return val * 1e-9;
    if (lower.includes('mm')) return val * 1e-3;
    if (lower.includes('cm')) return val * 0.01;
    return val;
  }
  if (mode === 'weight_kg') {
    if (lower.includes('tonelada') || /\b\d[\d.,\s]*t\b/.test(lower)) return val * 1000;
    if (lower.includes('mg')) return val * 1e-6;
    if (lower.includes('grama') || /\bg\b/.test(lower)) return val * 0.001;
    return val;
  }
  if (mode === 'speed_kmh') return val;
  if (mode === 'bite_n') {
    if (lower.includes('kn')) return val * 1000;
    if (lower.includes('tonelada')) return val * 9800;
    return val;
  }
  return val;
}

function formatLengthDisplay(meters, fallbackStr) {
  if (!meters || !Number.isFinite(meters)) return fallbackStr || 'N/D';
  if (meters >= 1) return `${meters.toFixed(meters >= 10 ? 1 : 2)} m`;
  if (meters >= 0.01) return `${(meters * 100).toFixed(1)} cm`;
  if (meters >= 0.001) return `${(meters * 1000).toFixed(1)} mm`;
  return `${(meters * 1e6).toFixed(0)} µm`;
}

function buildHumanScaleSvg(specs) {
  const humanHeightM = 1.75;

  const items = specs.map((s) => {
    const hab = resolveSpecimenHabitat(s);
    const meta = HABITAT_META[hab] || HABITAT_META.all;
    return {
      name: s.name,
      lengthM: parseMetricNumber(s.length, 'length_m') || 0,
      rawLength: s.length || '-',
      color: meta.accentHex,
    };
  });

  const maxM = Math.max(humanHeightM, ...items.map((it) => it.lengthM), 2);
  const svgW = 860;
  const svgH = 225;
  const baseLineY = 185;
  const leftMargin = 95;
  const maxBarWidth = svgW - leftMargin - 55;

  const pxPerMeter = maxBarWidth / maxM;
  const humanPxH = Math.max(18, Math.min(110, (humanHeightM / Math.min(maxM, 14)) * 120));

  let rowsSvg = '';
  items.forEach((it, idx) => {
    const barW = it.lengthM > 0 ? Math.max(10, it.lengthM * pxPerMeter) : 14;
    const y = 34 + idx * 46;
    const labelLen = formatLengthDisplay(it.lengthM, it.rawLength);

    rowsSvg += `
      <g>
        <text x="${leftMargin}" y="${y - 6}" fill="#e2e8f0" font-size="12" font-weight="700">${escapeHtml(it.name)} (${escapeHtml(labelLen)})</text>
        <rect x="${leftMargin}" y="${y}" width="${barW.toFixed(1)}" height="22" rx="11" fill="${it.color}" fill-opacity="0.28" stroke="${it.color}" stroke-width="2" />
        <circle cx="${(leftMargin + barW).toFixed(1)}" cy="${y + 11}" r="4.5" fill="${it.color}" />
      </g>
    `;
  });

  const humanBarW = Math.max(6, humanHeightM * pxPerMeter);

  return `
    <svg viewBox="0 0 ${svgW} ${svgH}" width="100%" height="${svgH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Comparação visual de escala com ser humano de 1,75 m">
      <line x1="${leftMargin}" y1="${baseLineY}" x2="${svgW - 25}" y2="${baseLineY}" stroke="rgba(255,255,255,0.22)" stroke-width="1.5" />
      <line x1="${(leftMargin + humanBarW).toFixed(1)}" y1="16" x2="${(leftMargin + humanBarW).toFixed(1)}" y2="${baseLineY}" stroke="#fca5a5" stroke-dasharray="4 4" stroke-width="1.2" />

      <g transform="translate(38, ${(baseLineY - humanPxH).toFixed(1)})">
        <circle cx="14" cy="${(humanPxH * 0.14).toFixed(1)}" r="${Math.max(4, humanPxH * 0.11).toFixed(1)}" fill="#f8fafc" />
        <rect x="8" y="${(humanPxH * 0.28).toFixed(1)}" width="12" height="${(humanPxH * 0.38).toFixed(1)}" rx="4" fill="#f8fafc" />
        <line x1="11" y1="${(humanPxH * 0.65).toFixed(1)}" x2="9" y2="${humanPxH.toFixed(1)}" stroke="#f8fafc" stroke-width="3.2" stroke-linecap="round" />
        <line x1="17" y1="${(humanPxH * 0.65).toFixed(1)}" x2="19" y2="${humanPxH.toFixed(1)}" stroke="#f8fafc" stroke-width="3.2" stroke-linecap="round" />
      </g>
      <text x="52" y="${baseLineY + 18}" text-anchor="middle" fill="#fca5a5" font-size="11" font-weight="700">Humano</text>
      <text x="52" y="${baseLineY + 32}" text-anchor="middle" fill="#94a3b8" font-size="10">1,75 m</text>

      <rect x="${leftMargin}" y="${baseLineY - 12}" width="${humanBarW.toFixed(1)}" height="8" rx="4" fill="#fca5a5" fill-opacity="0.7" />
      <text x="${(leftMargin + humanBarW + 8).toFixed(1)}" y="${baseLineY - 4}" fill="#fca5a5" font-size="10.5" font-weight="600">Ref. 1,75 m</text>

      ${rowsSvg}

      <text x="${leftMargin}" y="${baseLineY + 20}" fill="#94a3b8" font-size="10.5">0 m</text>
      <text x="${svgW - 30}" y="${baseLineY + 20}" text-anchor="end" fill="#94a3b8" font-size="10.5">${formatLengthDisplay(maxM, '')} (máx.)</text>
    </svg>
  `;
}

function buildMetricBarsCard(title, specs, mode, unitFormatter) {
  const vals = specs.map((s) => {
    const hab = resolveSpecimenHabitat(s);
    const meta = HABITAT_META[hab] || HABITAT_META.all;
    const raw =
      mode === 'weight_kg' ? s.weight : mode === 'speed_kmh' ? s.speed : s.bite_force;
    return {
      name: s.name,
      raw: raw || 'Em estudo',
      num: parseMetricNumber(raw, mode),
      color: meta.accentHex,
    };
  });

  const maxVal = Math.max(...vals.map((v) => v.num || 0), 1);

  const rows = vals
    .map((v) => {
      const pct = v.num ? Math.max(8, Math.round((v.num / maxVal) * 100)) : 0;
      const displayVal = v.num ? unitFormatter(v.num, v.raw) : v.raw;
      return `
        <div class="compare-bar-row">
          <div class="compare-bar-label">
            <span>${escapeHtml(v.name)}</span>
            <strong class="tabular-num">${escapeHtml(displayVal)}</strong>
          </div>
          <div class="compare-bar-track">
            <div class="compare-bar-fill" style="width:${pct}%; background:${v.color};"></div>
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <div class="compare-metric-card">
      <h4>${escapeHtml(title)}</h4>
      ${rows}
    </div>
  `;
}

function openCompareModal() {
  const specs = state.compareIds.map(findSpecimenById).filter(Boolean);
  if (specs.length < 2) {
    showToast('Selecione pelo menos 2 espécimes para comparar.');
    return;
  }

  const body = document.getElementById('compareModalBody');
  const modal = document.getElementById('compareModal');
  if (!body || !modal) return;

  const scaleSvg = buildHumanScaleSvg(specs);
  const weightCard = buildMetricBarsCard('Massa Corporal Estimada', specs, 'weight_kg', (kg) =>
    kg >= 1000 ? `${(kg / 1000).toFixed(1)} t` : kg >= 1 ? `${kg.toFixed(0)} kg` : `${(kg * 1000).toFixed(1)} g`
  );
  const speedCard = buildMetricBarsCard('Velocidade Máxima', specs, 'speed_kmh', (v) => `${v.toFixed(0)} km/h`);
  const biteCard = buildMetricBarsCard('Força de Mordida', specs, 'bite_n', (n) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)} kN` : `${n.toFixed(0)} N`
  );

  const tableRows = [
    { label: 'Nome Científico', fn: (s) => `<em>${escapeHtml(s.scientific_name || s.genus)}</em>` },
    { label: 'Habitat', fn: (s) => escapeHtml((HABITAT_META[resolveSpecimenHabitat(s)] || HABITAT_META.terrestre).label) },
    { label: 'Era & Período', fn: (s) => `${escapeHtml(s.era_display)} · ${escapeHtml(s.period)}` },
    { label: 'Estrutura Corporal', fn: (s) => escapeHtml(s.skeletal_composition || s.skeletal_type) },
    { label: 'Dieta / Nutrição', fn: (s) => escapeHtml(s.diet_display) },
    { label: 'Comprimento', fn: (s) => `<span class="tabular-num">${escapeHtml(s.length || '-')}</span>` },
    { label: 'Altura', fn: (s) => `<span class="tabular-num">${escapeHtml(s.height || '-')}</span>` },
    { label: 'Massa Estimada', fn: (s) => `<span class="tabular-num">${escapeHtml(s.weight || '-')}</span>` },
    { label: 'Velocidade', fn: (s) => `<span class="tabular-num">${escapeHtml(s.speed || '-')}</span>` },
    { label: 'Força de Mordida', fn: (s) => `<span class="tabular-num">${escapeHtml(s.bite_force || '-')}</span>` },
    { label: 'Status / Conservação', fn: (s) => escapeHtml(s.conservation_status || '-') },
    { label: 'Distribuição / Fósseis', fn: (s) => escapeHtml(s.fossil_locations || '-') },
  ];

  body.innerHTML = `
    <div class="scale-visual-card">
      <h3>Comparação Proporcional de Comprimento (Escala vs. Humano 1,75 m)</h3>
      <p>Cores alinhadas ao habitat natural de cada organismo.</p>
      <div class="scale-svg-wrap">${scaleSvg}</div>
    </div>

    <div class="compare-bars-grid">
      ${weightCard}
      ${speedCard}
      ${biteCard}
    </div>

    <div class="compare-table-wrap">
      <table class="compare-table">
        <thead>
          <tr>
            <th>Critério Científico</th>
            ${specs
              .map(
                (s) => `
              <th>
                <div class="compare-head-cell">
                  <img src="${escapeHtml(resolveDisplayImageUrl(s.image_url, resolveSpecimenHabitat(s)))}" alt="${escapeHtml(s.name)}" onerror="this.src='${getHabitatPlaceholder(resolveSpecimenHabitat(s))}'">
                  <div>
                    <div>${escapeHtml(s.name)}</div>
                    <small style="color:var(--text-secondary);font-weight:500;">${escapeHtml(s.group_display)}</small>
                  </div>
                </div>
              </th>
            `
              )
              .join('')}
          </tr>
        </thead>
        <tbody>
          ${tableRows
            .map(
              (r) => `
            <tr>
              <td><strong>${escapeHtml(r.label)}</strong></td>
              ${specs.map((s) => `<td>${r.fn(s)}</td>`).join('')}
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeCompareModal() {
  const modal = document.getElementById('compareModal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// ============================================================================
// DOSSIÊ INTERATIVO ADAPTADO AO HABITAT DO ESPÉCIME
// ============================================================================

function syncModalToolButtons() {
  const spec = state.selectedSpecimen;
  if (!spec) return;

  const btnFav = document.getElementById('btnModalFavorite');
  const btnCmp = document.getElementById('btnModalCompare');
  if (btnFav) {
    const isFav = state.favoritesSet.has(spec.id);
    btnFav.classList.toggle('active', isFav);
    btnFav.textContent = isFav ? '★ Favoritado' : 'Favoritar';
  }
  if (btnCmp) {
    const isCmp = state.compareIds.includes(spec.id);
    btnCmp.classList.toggle('active', isCmp);
    btnCmp.textContent = isCmp ? 'No Comparador' : 'Comparar';
  }
}

async function openWikiModal(specimenId, initialTab = 'tab-overview') {
  let spec = findSpecimenById(specimenId);

  if (!spec && state.isBackendOnline) {
    try {
      const res = await fetch(`${API_BASE}/api/specimens/${encodeURIComponent(specimenId)}`);
      if (res.ok) spec = await res.json();
    } catch {}
  }

  if (!spec) {
    showToast('Espécime não encontrado.');
    return;
  }

  state.selectedSpecimen = spec;
  const habitatKey = resolveSpecimenHabitat(spec);
  const habitatMeta = HABITAT_META[habitatKey] || HABITAT_META.terrestre;

  const wikiModal = document.getElementById('wikiModal');
  if (wikiModal) {
    wikiModal.setAttribute('data-habitat', habitatKey);
  }

  syncModalToolButtons();

  const habLabelEl = document.getElementById('wikiHabitatLabel');
  if (habLabelEl) habLabelEl.textContent = `Habitat ${habitatMeta.label}`;

  const specHabitatDetail = document.getElementById('specHabitatDetail');
  if (specHabitatDetail) specHabitatDetail.textContent = habitatMeta.label;

  document.getElementById('wikiTitle').textContent = spec.name;
  document.getElementById('wikiEtymology').textContent = spec.scientific_name
    ? `${spec.scientific_name} · ${spec.etymology || 'Classificação biológica'}`
    : spec.etymology || '';

  const eraBadge = document.getElementById('wikiEraBadge');
  if (eraBadge) eraBadge.textContent = spec.era_display;

  const isMicro = spec.skeletal_type === 'microbiologico';
  const isVertebrate = spec.skeletal_type === 'vertebrado';
  const skeletalBadge = document.getElementById('wikiSkeletalBadge');

  if (isMicro) {
    if (skeletalBadge) skeletalBadge.textContent = 'Microbiológico';
    document.getElementById('specSkeletalType').textContent =
      'Microbiológico (Unicelular / Acelular / Micro-invertebrado)';
  } else if (isVertebrate) {
    if (skeletalBadge) skeletalBadge.textContent = 'Vertebrado';
    document.getElementById('specSkeletalType').textContent =
      'Vertebrado (Coluna vertebral e crânio)';
  } else {
    if (skeletalBadge) skeletalBadge.textContent = 'Invertebrado';
    document.getElementById('specSkeletalType').textContent =
      'Invertebrado (Sem coluna vertebral)';
  }

  const tabSkeletonBtn = document.getElementById('tabBtnSkeleton');
  if (tabSkeletonBtn) {
    tabSkeletonBtn.textContent = isMicro
      ? 'Estrutura Celular & Citologia'
      : 'Esqueleto, Ossos & Cartilagem';
  }

  document.getElementById('wikiPeriodBadge').textContent = spec.period;
  document.getElementById('wikiGroupBadge').textContent = spec.group_display;
  document.getElementById('wikiDietBadge').textContent = spec.diet_display;

  document.getElementById('specSkeletalComp').textContent =
    spec.skeletal_composition || 'Estrutura corporal não-mineralizada';
  const statusEl = document.getElementById('specConservationStatus');
  if (statusEl) {
    statusEl.innerHTML = renderIucnStatusHtml(spec);
  }

  document.getElementById('specLength').textContent = spec.length || 'Em estudo';
  document.getElementById('specHeight').textContent = spec.height || 'Em estudo';
  document.getElementById('specWeight').textContent = spec.weight || 'Em estudo';
  document.getElementById('specSpeed').textContent = spec.speed || 'Em estudo';
  document.getElementById('specBiteForce').textContent = spec.bite_force || 'Em estudo';
  document.getElementById('specPeriod').textContent = `${spec.period} (${spec.geological_range})`;
  document.getElementById('wikiBioText').textContent = spec.bio || 'Dossiê biológico em compilação.';

  const quickScaleEl = document.getElementById('explorerQuickScaleText');
  if (quickScaleEl) {
    quickScaleEl.textContent = buildFriendlyScaleNote(spec);
  }
  renderVisualScaleSvg(spec);
  syncFieldNoteEditor(spec);
  loadSpecimenBioacoustics(spec);

  const curList = document.getElementById('wikiCuriositiesList');
  curList.innerHTML = '';
  (spec.curiosities || []).forEach((c) => {
    const li = document.createElement('li');
    li.textContent = c;
    curList.appendChild(li);
  });

  // Imagem de Destaque
  const featuredImg = document.getElementById('wikiFeaturedImg');
  featuredImg.dataset.fallbackStage = '';
  featuredImg.src = resolveDisplayImageUrl(spec.image_url, habitatKey);
  featuredImg.onerror = () => handleImageFallback(featuredImg, spec.image_url, habitatKey);
  document.getElementById('wikiFeaturedCaption').textContent =
    spec.image_caption || 'Representação visual do espécime';

  // Miniaturas
  const thumbsContainer = document.getElementById('wikiGalleryThumbs');
  thumbsContainer.innerHTML = '';
  const galleryItems =
    spec.gallery && spec.gallery.length > 0
      ? spec.gallery
      : [{ url: spec.image_url, caption: spec.image_caption, category: 'life_view' }];

  document.getElementById('galleryCount').textContent = String(galleryItems.length);
  state.lightboxImages = galleryItems;

  galleryItems.slice(0, 8).forEach((item, idx) => {
    const thumb = document.createElement('img');
    thumb.src = resolveDisplayImageUrl(item.url, habitatKey);
    thumb.alt = item.caption || `Imagem ${idx + 1}`;
    thumb.className = `gallery-thumb ${idx === 0 ? 'active' : ''}`;
    thumb.loading = 'lazy';
    thumb.onerror = () => handleImageFallback(thumb, item.url, habitatKey);

    thumb.addEventListener('click', () => {
      document.querySelectorAll('.gallery-thumb').forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
      featuredImg.dataset.fallbackStage = '';
      featuredImg.src = resolveDisplayImageUrl(item.url, habitatKey);
      featuredImg.onerror = () => handleImageFallback(featuredImg, item.url, habitatKey);
      document.getElementById('wikiFeaturedCaption').textContent =
        item.caption || 'Representação do espécime';
    });

    thumbsContainer.appendChild(thumb);
  });

  const btnOpenFullGallery = document.getElementById('btnOpenFullGalleryPopup');
  const popupBtnTitle = document.getElementById('popupBtnTitle');
  if (btnOpenFullGallery) {
    if (galleryItems.length > 4) {
      btnOpenFullGallery.classList.remove('hidden');
      if (popupBtnTitle) {
        popupBtnTitle.textContent = `Abrir galeria completa (${galleryItems.length} fotos)`;
      }
    } else {
      btnOpenFullGallery.classList.add('hidden');
    }
  }

  renderSkeletonTab(spec, habitatKey);
  renderExpertTab(spec);

  state.galleryActiveCategory = 'all';
  document.querySelectorAll('.gallery-cat-chip').forEach((c) =>
    c.classList.toggle('active', c.getAttribute('data-cat') === 'all')
  );
  renderFilteredGallery();

  const googleBtn = document.getElementById('btnSearchGoogleImages');
  if (googleBtn) {
    googleBtn.href = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
      `${spec.name} ${spec.scientific_name || ''} skeleton skull anatomy`
    )}`;
  }

  wikiModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  switchWikiTab(initialTab);
  syncUrlParams(spec.id);

  loadOccurrencesAndRenderGlobe(spec);
}

async function loadOccurrencesAndRenderGlobe(spec) {
  let occurrences = [];
  let sourceLabel = spec.is_contemporary ? 'GBIF Vivente' : 'Fóssil PBDB';

  try {
    const queryTaxon = encodeURIComponent(spec.id || spec.genus || spec.name);
    const res = await fetch(`${API_BASE}/api/occurrences/${queryTaxon}`);
    if (res.ok) {
      const data = await res.json();
      const rawList = Array.isArray(data)
        ? data
        : Array.isArray(data?.occurrences)
        ? data.occurrences
        : [];
      if (rawList.length > 0) {
        occurrences = rawList;
        if (!Array.isArray(data) && data?.source) {
          sourceLabel = data.source;
        }
      }
    }
  } catch {}

  if (occurrences.length === 0) {
    occurrences = generateFallbackOccurrences(spec);
  }

  state.currentSpecimenOccurrences = occurrences;
  state.currentSpecimenOccSource = sourceLabel;
  renderExpertOccurrencesTable(spec, occurrences, sourceLabel);

  if (window.BioAtlasGlobe3D) {
    await window.BioAtlasGlobe3D.updateForSpecimen(spec, occurrences, sourceLabel);
  }
}

function generateFallbackOccurrences(specimen) {
  const text = `${specimen.fossil_locations || ''} ${specimen.bio || ''}`;
  const list = [];
  if (/brasil|brazil|amazônia|pantanal|acre|minas gerais/i.test(text))
    list.push({ lat: -14.2, lng: -51.9, locality: 'América do Sul', country: 'Brasil' });
  if (/estados unidos|eua|montana|wyoming|texas|califórnia/i.test(text))
    list.push({ lat: 45.5, lng: -105.0, locality: 'América do Norte', country: 'Estados Unidos' });
  if (/canadá|canada|alberta|burgess/i.test(text))
    list.push({ lat: 51.5, lng: -115.0, locality: 'América do Norte', country: 'Canadá' });
  if (/egito|marrocos|áfrica|africa|tanzânia/i.test(text))
    list.push({ lat: 25.0, lng: 20.0, locality: 'Continente Africano', country: 'África' });
  if (/china|mongólia|ásia|japão/i.test(text))
    list.push({ lat: 42.0, lng: 105.0, locality: 'Ásia Central', country: 'Ásia' });
  if (/europa|alemanha|frança|inglaterra|holanda/i.test(text))
    list.push({ lat: 50.0, lng: 10.0, locality: 'Europa Ocidental', country: 'Europa' });
  if (/austrália|australia/i.test(text))
    list.push({ lat: -25.0, lng: 135.0, locality: 'Oceania', country: 'Austrália' });
  if (/rússia|sibéria/i.test(text))
    list.push({ lat: 65.0, lng: 120.0, locality: 'Norte da Eurásia', country: 'Rússia' });

  if (list.length === 0) {
    list.push({ lat: 20.0, lng: 0.0, locality: specimen.fossil_locations || 'Registro Global', country: 'Global' });
  }
  return list;
}

function renderSkeletonTab(spec, habitatKey) {
  const isVertebrate = spec.skeletal_type === 'vertebrado';
  const isMicro = spec.skeletal_type === 'microbiologico';
  const explanation = document.getElementById('skeletonExplanationText');

  if (isMicro) {
    explanation.innerHTML = `<strong>${escapeHtml(spec.name)}</strong> é um organismo microbiológico cuja sustentação celular baseia-se em <strong>${escapeHtml(
      spec.skeletal_composition || 'parede celular, membrana plasmática e citoesqueleto'
    )}</strong>.`;
  } else if (isVertebrate) {
    explanation.innerHTML = `<strong>${escapeHtml(spec.name)}</strong> é um vertebrado com <strong>${escapeHtml(
      spec.skeletal_composition || 'endoesqueleto ósseo articulado'
    )}</strong>, crânio estruturado e coluna vertebral axial.`;
  } else {
    explanation.innerHTML = `<strong>${escapeHtml(spec.name)}</strong> é um invertebrado sustentado por <strong>${escapeHtml(
      spec.skeletal_composition || 'exoesqueleto ou hidroesqueleto'
    )}</strong>, sem coluna vertebral óssea.`;
  }

  const grid = document.getElementById('skeletonImagesGrid');
  grid.innerHTML = '';

  const items = spec.gallery || [];
  const skeletalItems = items.filter(
    (img) =>
      img.category === 'skeletal_view' ||
      ['skeleton', 'skull', 'bones', 'cartilage', 'fossil'].includes(img.type) ||
      /skeleton|skull|crânio|esqueleto|bone|cartilage|fossil|concha/i.test(img.caption || '')
  );

  const displayList = skeletalItems.length > 0 ? skeletalItems : items;
  displayList.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.innerHTML = `
      <img src="${escapeHtml(resolveDisplayImageUrl(item.url, habitatKey))}" alt="${escapeHtml(item.caption || 'Esqueleto / Ossos')}" loading="lazy" decoding="async" />
      <div class="gallery-card-info">
        <span class="gallery-card-caption">${escapeHtml(item.caption || 'Vista estrutural')}</span>
        <small class="gallery-card-author">${escapeHtml(item.author || 'Wikimedia Commons')}</small>
      </div>
    `;
    const img = card.querySelector('img');
    img.addEventListener('error', () => handleImageFallback(img, item.url, habitatKey));
    card.addEventListener('click', () => {
      const fullIdx = items.indexOf(item);
      openLightbox(fullIdx >= 0 ? fullIdx : idx);
    });
    grid.appendChild(card);
  });
}

function renderFilteredGallery() {
  const container = document.getElementById('fullGalleryGrid');
  if (!container || !state.selectedSpecimen) return;
  container.innerHTML = '';

  const habitatKey = resolveSpecimenHabitat(state.selectedSpecimen);
  const items =
    state.selectedSpecimen.gallery && state.selectedSpecimen.gallery.length > 0
      ? state.selectedSpecimen.gallery
      : [
          {
            url: state.selectedSpecimen.image_url,
            caption: state.selectedSpecimen.image_caption,
            category: 'life_view',
          },
        ];

  const cat = state.galleryActiveCategory;
  const filtered = cat === 'all' ? items : items.filter((it) => it.category === cat);
  const toRender = filtered.length > 0 ? filtered : items;

  toRender.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.innerHTML = `
      <img src="${escapeHtml(resolveDisplayImageUrl(item.url, habitatKey))}" alt="${escapeHtml(item.caption || 'Imagem')}" loading="lazy" decoding="async" />
      <div class="gallery-card-info">
        <span class="gallery-card-caption">${escapeHtml(item.caption || 'Representação visual')}</span>
        <small class="gallery-card-author">${escapeHtml(item.author || 'Wikimedia Commons')}</small>
      </div>
    `;
    const img = card.querySelector('img');
    img.addEventListener('error', () => handleImageFallback(img, item.url, habitatKey));
    card.addEventListener('click', () => {
      const globalIdx = items.indexOf(item);
      openLightbox(globalIdx >= 0 ? globalIdx : 0);
    });
    container.appendChild(card);
  });
}

// ============================================================================
// CLADOGRAMA INTERATIVO CLICÁVEL
// ============================================================================

function findCatalogRelativesByClade(cladeName) {
  const norm = normalizeStr(cladeName);
  return state.allCatalog.filter(
    (s) =>
      Array.isArray(s.expert?.cladogram) &&
      s.expert.cladogram.some((node) => normalizeStr(node) === norm || normalizeStr(node).includes(norm))
  );
}

function renderExpertTab(spec) {
  const expert = spec.expert || {};
  const cladContainer = document.getElementById('expertCladogram');
  const relativesBox = document.getElementById('cladeRelativesBox');

  cladContainer.innerHTML = '';
  if (relativesBox) {
    relativesBox.classList.add('hidden');
    relativesBox.innerHTML = '';
  }

  if (Array.isArray(expert.cladogram) && expert.cladogram.length > 0) {
    const ul = document.createElement('ul');
    ul.className = 'cladogram-list';

    expert.cladogram.forEach((node, i) => {
      const li = document.createElement('li');
      li.style.paddingLeft = `${Math.min(i * 12, 96)}px`;

      const matches = findCatalogRelativesByClade(node);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cladogram-node-btn';
      btn.innerHTML = `
        <span>${i === expert.cladogram.length - 1 ? '▶ ' : '↳ '}${escapeHtml(node)}</span>
        <span class="cladogram-count-tag">${matches.length}</span>
      `;

      btn.addEventListener('click', () => {
        ul.querySelectorAll('.cladogram-node-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        showCladeRelativesDrawer(node, matches, spec.id);
      });

      li.appendChild(btn);
      ul.appendChild(li);
    });

    cladContainer.appendChild(ul);
  } else {
    cladContainer.innerHTML = '<p style="color:var(--text-muted);">Árvore filogenética em refinamento.</p>';
  }

  document.getElementById('expertOsteology').textContent =
    expert.osteology || 'Análise óssea e estrutural em compilação.';
  document.getElementById('expertBiomechanics').textContent =
    expert.biomechanics || 'Modelagem biomecânica em simulação computacional.';
  document.getElementById('expertHistology').textContent =
    expert.histology || 'Cortes histológicos e tecidos em catálogo.';

  // Módulos Científicos Avançados do Modo Pesquisador
  renderExpertTaxonomyAndLinks(spec);
  renderExpertRadarChart(spec);
  renderExpertBiophysicsAndSim(spec);
  renderExpertEcologySummary(spec);
  loadExpertResearchPapers(spec, state.expertPapersSort || 'cited');
}

// ============================================================================
// MODO PESQUISADOR AVANÇADO: BANCADA DO CATÁLOGO + DOSSIÊ CIENTÍFICO COMPLETO
// ============================================================================

function setupResearcherModeListeners() {
  // Alternar sub-painéis da Bancada (Alometria | Matriz | MRCA)
  document.querySelectorAll('[data-rw-panel]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const panel = btn.getAttribute('data-rw-panel') || 'allometry';
      state.researcherPanel = panel;
      document.querySelectorAll('[data-rw-panel]').forEach((b) => {
        const active = b.getAttribute('data-rw-panel') === panel;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', String(active));
      });
      const map = {
        allometry: 'rwPanelAllometry',
        matrix: 'rwPanelMatrix',
        mrca: 'rwPanelMrca',
      };
      Object.entries(map).forEach(([key, id]) => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('active', key === panel);
      });
      renderResearcherWorkbench();
    });
  });

  // Alternar Grade Visual vs Tabela Morfométrica
  document.querySelectorAll('[data-catalog-view]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-catalog-view') === 'table' ? 'table' : 'cards';
      state.researcherCatalogView = view;
      document.querySelectorAll('[data-catalog-view]').forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-catalog-view') === view);
      });
      syncResearcherCatalogPresentation();
    });
  });

  // Ordenação da Tabela Morfométrica
  document.querySelectorAll('.rw-sort-btn[data-sort-col]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const col = btn.getAttribute('data-sort-col') || 'name';
      if (state.researcherTableSort.col === col) {
        state.researcherTableSort.dir = state.researcherTableSort.dir === 'asc' ? 'desc' : 'asc';
      } else {
        state.researcherTableSort = {
          col,
          dir: ['name', 'era', 'habitat'].includes(col) ? 'asc' : 'desc',
        };
      }
      renderResearcherDataTable(state.specimens);
    });
  });

  // Exportações da Bancada (CSV / TSV / JSON)
  const btnCsv = document.getElementById('btnRwExportCsv');
  if (btnCsv) {
    btnCsv.addEventListener('click', () => {
      if (!state.specimens.length) return showToast('Nenhum táxon no recorte atual para exportar.');
      downloadBlobFile(specsToCsv(state.specimens), 'bioatlas-recorte-pesquisa.csv', 'text/csv;charset=utf-8');
      showToast(`CSV exportado (${state.specimens.length} táxons).`);
    });
  }
  const btnJson = document.getElementById('btnRwExportJson');
  if (btnJson) {
    btnJson.addEventListener('click', () => {
      if (!state.specimens.length) return showToast('Nenhum táxon no recorte atual para exportar.');
      downloadBlobFile(
        JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            count: state.specimens.length,
            filters: {
              habitat: state.currentHabitat,
              era: state.currentEra,
              period: state.currentPeriod,
              group: state.currentGroup,
              diet: state.currentDiet,
              clade: state.currentClade,
            },
            specimens: state.specimens,
          },
          null,
          2
        ),
        'bioatlas-recorte-pesquisa.json',
        'application/json;charset=utf-8'
      );
      showToast(`Dataset JSON exportado (${state.specimens.length} táxons).`);
    });
  }
  const btnTsv = document.getElementById('btnRwCopyTsv');
  if (btnTsv) {
    btnTsv.addEventListener('click', async () => {
      if (!state.specimens.length) return showToast('Nenhum táxon no recorte atual.');
      const header = [
        'id',
        'name',
        'scientific_name',
        'era',
        'habitat',
        'length_m',
        'height_m',
        'weight_kg',
        'speed_kmh',
        'bite_n',
        'occurrences',
        'status',
      ].join('\t');
      const rows = state.specimens.map((s) =>
        [
          s.id,
          s.name,
          s.scientific_name || s.genus || '',
          s.era,
          resolveSpecimenHabitat(s),
          parseMetricNumber(s.length, 'length_m') ?? '',
          parseMetricNumber(s.height, 'length_m') ?? '',
          parseMetricNumber(s.weight, 'weight_kg') ?? '',
          parseMetricNumber(s.speed, 'speed_kmh') ?? '',
          parseMetricNumber(s.bite_force, 'bite_n') ?? '',
          Number(s.occurrences_count) || 0,
          s.conservation_status || '',
        ].join('\t')
      );
      await copyTextSafe(`${header}\n${rows.join('\n')}`, `Matriz TSV (${state.specimens.length} linhas) copiada para Excel/R/Python.`);
    });
  }

  // Botão limpar filtro da matriz
  const btnResetMatrix = document.getElementById('btnRwResetMatrixFilter');
  if (btnResetMatrix) {
    btnResetMatrix.addEventListener('click', () => {
      resetAllFilters();
      showToast('Filtros da matriz Era × Habitat limpos.');
    });
  }

  // Calculadora MRCA
  const btnRunMrca = document.getElementById('btnRwRunMrca');
  if (btnRunMrca) btnRunMrca.addEventListener('click', runRwMrcaAnalysis);
  const selA = document.getElementById('rwMrcaSelectA');
  const selB = document.getElementById('rwMrcaSelectB');
  if (selA) selA.addEventListener('change', runRwMrcaAnalysis);
  if (selB) selB.addEventListener('change', runRwMrcaAnalysis);

  // Botões rápidos de citação no Dossiê Científico (#tab-expert)
  const btnAbnt = document.getElementById('btnExpertCopyAbnt');
  if (btnAbnt) {
    btnAbnt.addEventListener('click', () => {
      if (!state.selectedSpecimen) return;
      copyTextSafe(buildAbntCitation(state.selectedSpecimen), 'Citação ABNT copiada.');
    });
  }
  const btnApa = document.getElementById('btnExpertCopyApa');
  if (btnApa) {
    btnApa.addEventListener('click', () => {
      if (!state.selectedSpecimen) return;
      copyTextSafe(buildApaCitation(state.selectedSpecimen), 'Citação APA (7ª ed.) copiada.');
    });
  }
  const btnBib = document.getElementById('btnExpertCopyBibtex');
  if (btnBib) {
    btnBib.addEventListener('click', () => {
      if (!state.selectedSpecimen) return;
      copyTextSafe(buildBibtexCitation(state.selectedSpecimen), 'Registro BibTeX copiado.');
    });
  }

  // Exportação de ocorrências do espécime (CSV / GeoJSON)
  const btnOccCsv = document.getElementById('btnExportOccCsv');
  if (btnOccCsv) {
    btnOccCsv.addEventListener('click', () => exportCurrentOccurrences('csv'));
  }
  const btnOccGeo = document.getElementById('btnExportOccGeoJson');
  if (btnOccGeo) {
    btnOccGeo.addEventListener('click', () => exportCurrentOccurrences('geojson'));
  }

  // Ordenação da Literatura Científica (OpenAlex / Crossref)
  document.querySelectorAll('[data-paper-sort]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sortMode = btn.getAttribute('data-paper-sort') === 'recent' ? 'recent' : 'cited';
      state.expertPapersSort = sortMode;
      document.querySelectorAll('[data-paper-sort]').forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-paper-sort') === sortMode);
      });
      if (state.selectedSpecimen) {
        loadExpertResearchPapers(state.selectedSpecimen, sortMode);
      }
    });
  });

  // Simulador Isométrico Quadrado-Cubo no Dossiê
  const scaleSlider = document.getElementById('expertScaleSlider');
  if (scaleSlider) {
    scaleSlider.addEventListener('input', () => {
      if (state.selectedSpecimen) {
        updateExpertScaleSimulator(state.selectedSpecimen, Number(scaleSlider.value) || 100);
      }
    });
  }
}

function downloadBlobFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function copyTextSafe(text, successMsg) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMsg || 'Copiado para a área de transferência.');
  } catch {
    showToast('Não foi possível acessar a área de transferência.');
  }
}

function computeMedian(values) {
  const nums = values.filter((v) => typeof v === 'number' && Number.isFinite(v) && v > 0).sort((a, b) => a - b);
  if (nums.length === 0) return null;
  const mid = Math.floor(nums.length / 2);
  return nums.length % 2 === 0 ? (nums[mid - 1] + nums[mid]) / 2 : nums[mid];
}

function formatMassCompact(kg) {
  if (kg === null || kg === undefined || !Number.isFinite(kg)) return 'N/D';
  if (kg >= 1000) return `${(kg / 1000).toFixed(kg >= 10000 ? 1 : 2).replace('.', ',')} t`;
  if (kg >= 1) return `${kg.toFixed(kg >= 100 ? 0 : 1).replace('.', ',')} kg`;
  if (kg >= 0.001) return `${(kg * 1000).toFixed(1).replace('.', ',')} g`;
  return `${(kg * 1e6).toFixed(1).replace('.', ',')} mg`;
}

function formatCompactNumber(n) {
  if (!Number.isFinite(n)) return '0';
  return Math.round(n).toLocaleString('pt-BR');
}

function syncResearcherCatalogPresentation() {
  const resultsGrid = document.getElementById('results');
  const tableWrap = document.getElementById('researcherDataTableWrap');
  const emptyState = document.getElementById('emptyState');
  if (!resultsGrid || !tableWrap) return;

  const hasData = Array.isArray(state.specimens) && state.specimens.length > 0;
  const showTable = state.audienceMode === 'researcher' && state.researcherCatalogView === 'table' && hasData;

  if (showTable) {
    resultsGrid.classList.add('hidden');
    tableWrap.classList.remove('hidden');
    if (emptyState) emptyState.classList.add('hidden');
    renderResearcherDataTable(state.specimens);
  } else {
    tableWrap.classList.add('hidden');
    if (hasData) {
      resultsGrid.classList.remove('hidden');
    }
  }
}

function renderResearcherWorkbench() {
  const wb = document.getElementById('researcherWorkbench');
  if (!wb) return;
  if (state.audienceMode !== 'researcher') return;

  const list = Array.isArray(state.specimens) ? state.specimens : [];
  renderRwKpiStrip(list);

  if (state.researcherPanel === 'allometry') {
    renderRwAllometryChart(list);
  } else if (state.researcherPanel === 'matrix') {
    renderRwHeatmapMatrix(state.allCatalog);
  } else if (state.researcherPanel === 'mrca') {
    populateRwMrcaSelectors();
    runRwMrcaAnalysis();
  }

  if (state.researcherCatalogView === 'table') {
    renderResearcherDataTable(list);
  }
}

function renderRwKpiStrip(list) {
  const strip = document.getElementById('rwKpiStrip');
  if (!strip) return;

  const total = list.length;
  const contemporary = list.filter((s) => s.is_contemporary).length;
  const extinct = total - contemporary;
  const medLen = computeMedian(list.map((s) => parseMetricNumber(s.length, 'length_m')));
  const medMass = computeMedian(list.map((s) => parseMetricNumber(s.weight, 'weight_kg')));
  const totalOcc = list.reduce((acc, s) => acc + (Number(s.occurrences_count) || 0), 0);
  const cladeSet = new Set();
  list.forEach((s) => {
    if (Array.isArray(s.expert?.cladogram)) {
      s.expert.cladogram.forEach((c) => cladeSet.add(c));
    }
  });

  strip.innerHTML = `
    <div class="rw-kpi-cell">
      <span class="rw-kpi-label">Táxons no Recorte</span>
      <strong class="rw-kpi-value tabular-num">${total}</strong>
      <span class="rw-kpi-sub tabular-num">${contemporary} viventes · ${extinct} fósseis</span>
    </div>
    <div class="rw-kpi-cell">
      <span class="rw-kpi-label">Mediana Comprimento</span>
      <strong class="rw-kpi-value tabular-num">${medLen ? formatLengthDisplay(medLen) : 'N/D'}</strong>
      <span class="rw-kpi-sub">Eixo axial principal</span>
    </div>
    <div class="rw-kpi-cell">
      <span class="rw-kpi-label">Mediana Massa</span>
      <strong class="rw-kpi-value tabular-num">${formatMassCompact(medMass)}</strong>
      <span class="rw-kpi-sub">Distribuição empírica</span>
    </div>
    <div class="rw-kpi-cell">
      <span class="rw-kpi-label">Ocorrências Indexadas</span>
      <strong class="rw-kpi-value tabular-num">${formatCompactNumber(totalOcc)}</strong>
      <span class="rw-kpi-sub">GBIF &amp; PBDB combinados</span>
    </div>
    <div class="rw-kpi-cell">
      <span class="rw-kpi-label">Clados Representados</span>
      <strong class="rw-kpi-value tabular-num">${cladeSet.size}</strong>
      <span class="rw-kpi-sub">Nós filogenéticos únicos</span>
    </div>
  `;
}

function getEraColorHex(era) {
  if (era === 'contemporaneo') return '#38bdf8';
  if (era === 'mesozoico') return '#f59e0b';
  if (era === 'cenozoico') return '#a78bfa';
  return '#34d399';
}

function renderRwAllometryChart(list) {
  const wrap = document.getElementById('rwAllometrySvgWrap');
  const formulaEl = document.getElementById('rwRegressionFormula');
  const extremesEl = document.getElementById('rwAllometryExtremes');
  if (!wrap) return;

  const pts = list
    .map((s) => {
      const lengthM = parseMetricNumber(s.length, 'length_m');
      const weightKg = parseMetricNumber(s.weight, 'weight_kg');
      if (!lengthM || !weightKg || lengthM <= 0 || weightKg <= 0) return null;
      return {
        spec: s,
        lengthM,
        weightKg,
        logL: Math.log10(lengthM),
        logM: Math.log10(weightKg),
        color: getEraColorHex(s.era),
      };
    })
    .filter(Boolean);

  if (pts.length < 2) {
    wrap.innerHTML = '<div class="rw-empty-chart">Selecione pelo menos 2 táxons com comprimento e massa catalogados para calcular a regressão alométrica.</div>';
    if (formulaEl) formulaEl.textContent = 'Amostra insuficiente (n < 2) no recorte atual.';
    if (extremesEl) extremesEl.innerHTML = '';
    return;
  }

  // Ordinary Least Squares in log10 space: log10(M) = alpha + b * log10(L)
  const n = pts.length;
  const meanX = pts.reduce((a, p) => a + p.logL, 0) / n;
  const meanY = pts.reduce((a, p) => a + p.logM, 0) / n;
  let ssXY = 0;
  let ssXX = 0;
  let ssYY = 0;
  pts.forEach((p) => {
    const dx = p.logL - meanX;
    const dy = p.logM - meanY;
    ssXY += dx * dy;
    ssXX += dx * dx;
    ssYY += dy * dy;
  });
  const slope = ssXX > 0 ? ssXY / ssXX : 3;
  const intercept = meanY - slope * meanX;
  const r2 = ssXX > 0 && ssYY > 0 ? Math.pow(ssXY, 2) / (ssXX * ssYY) : 0;
  const coeffA = Math.pow(10, intercept);

  if (formulaEl) {
    formulaEl.textContent = `Ajuste empírico (n = ${n}): M ≈ ${coeffA.toFixed(2)} · L^${slope.toFixed(2)}  |  R² = ${r2.toFixed(3)}  |  Referência isométrica: L^3,00`;
  }

  const minX = Math.floor(Math.min(...pts.map((p) => p.logL)) - 0.3);
  const maxX = Math.ceil(Math.max(...pts.map((p) => p.logL)) + 0.3);
  const minY = Math.floor(Math.min(...pts.map((p) => p.logM)) - 0.4);
  const maxY = Math.ceil(Math.max(...pts.map((p) => p.logM)) + 0.4);

  const W = 680;
  const H = 290;
  const padL = 62;
  const padR = 24;
  const padT = 18;
  const padB = 42;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const xScale = (lx) => padL + ((lx - minX) / Math.max(0.01, maxX - minX)) * plotW;
  const yScale = (ly) => padT + plotH - ((ly - minY) / Math.max(0.01, maxY - minY)) * plotH;

  let gridSvg = '';
  for (let gx = Math.ceil(minX); gx <= Math.floor(maxX); gx += 1) {
    const px = xScale(gx);
    gridSvg += `<line x1="${px.toFixed(1)}" y1="${padT}" x2="${px.toFixed(1)}" y2="${H - padB}" stroke="rgba(148,163,184,0.14)" stroke-width="1" />`;
    gridSvg += `<text x="${px.toFixed(1)}" y="${H - padB + 16}" fill="#94a3b8" font-size="10" font-family="JetBrains Mono, monospace" text-anchor="middle">10^${gx}</text>`;
  }
  const yStep = maxY - minY > 8 ? 2 : 1;
  for (let gy = Math.ceil(minY); gy <= Math.floor(maxY); gy += yStep) {
    const py = yScale(gy);
    gridSvg += `<line x1="${padL}" y1="${py.toFixed(1)}" x2="${W - padR}" y2="${py.toFixed(1)}" stroke="rgba(148,163,184,0.14)" stroke-width="1" />`;
    gridSvg += `<text x="${padL - 8}" y="${(py + 3.5).toFixed(1)}" fill="#94a3b8" font-size="10" font-family="JetBrains Mono, monospace" text-anchor="end">10^${gy}</text>`;
  }

  // Regression line endpoints clamped to visible box
  const regX1 = minX;
  const regY1 = intercept + slope * regX1;
  const regX2 = maxX;
  const regY2 = intercept + slope * regX2;

  const dotsSvg = pts
    .map((p, idx) => {
      const cx = xScale(p.logL).toFixed(1);
      const cy = yScale(p.logM).toFixed(1);
      return `<circle class="rw-scatter-dot" data-pt-idx="${idx}" cx="${cx}" cy="${cy}" r="5.5" fill="${p.color}" fill-opacity="0.82" stroke="#0b1220" stroke-width="1.4" tabindex="0"><title>${escapeHtml(p.spec.name)}: ${formatLengthDisplay(p.lengthM)} · ${formatMassCompact(p.weightKg)}</title></circle>`;
    })
    .join('');

  wrap.innerHTML = `
    <div class="rw-svg-container">
      <svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" role="img" aria-label="Gráfico alométrico Log-Log de comprimento por massa">
        <defs>
          <clipPath id="rwPlotClip">
            <rect x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" />
          </clipPath>
        </defs>
        ${gridSvg}
        <rect x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" fill="none" stroke="rgba(148,163,184,0.28)" stroke-width="1" />
        <g clip-path="url(#rwPlotClip)">
          <line x1="${xScale(regX1).toFixed(1)}" y1="${yScale(regY1).toFixed(1)}" x2="${xScale(regX2).toFixed(1)}" y2="${yScale(regY2).toFixed(1)}" stroke="#38bdf8" stroke-dasharray="5 4" stroke-width="1.6" stroke-opacity="0.85" />
          ${dotsSvg}
        </g>
        <text x="${(padL + plotW / 2).toFixed(1)}" y="${H - 8}" fill="#cbd5e1" font-size="11" font-family="JetBrains Mono, monospace" text-anchor="middle">Comprimento (m, escala log₁₀)</text>
        <text x="15" y="${(padT + plotH / 2).toFixed(1)}" fill="#cbd5e1" font-size="11" font-family="JetBrains Mono, monospace" text-anchor="middle" transform="rotate(-90 15 ${(padT + plotH / 2).toFixed(1)})">Massa (kg, escala log₁₀)</text>
      </svg>
      <div id="rwScatterHud" class="rw-scatter-hud tabular-num">Passe o cursor sobre um táxon para inspecionar coordenadas (L, M).</div>
    </div>
  `;

  const hud = wrap.querySelector('#rwScatterHud');
  wrap.querySelectorAll('.rw-scatter-dot').forEach((dot) => {
    const idx = Number(dot.getAttribute('data-pt-idx'));
    const p = pts[idx];
    if (!p) return;
    const showPoint = () => {
      const predictedM = Math.pow(10, intercept + slope * p.logL);
      const ratio = predictedM > 0 ? p.weightKg / predictedM : 1;
      const residText = ratio >= 1 ? `+${((ratio - 1) * 100).toFixed(0)}% acima da curva` : `${((ratio - 1) * 100).toFixed(0)}% abaixo da curva`;
      if (hud) {
        hud.innerHTML = `<strong>${escapeHtml(p.spec.name)}</strong> (${escapeHtml(p.spec.scientific_name || p.spec.genus)}) · L = ${formatLengthDisplay(p.lengthM)} · M = ${formatMassCompact(p.weightKg)} · ${residText} · Clique para abrir dossiê`;
      }
    };
    dot.addEventListener('mouseenter', showPoint);
    dot.addEventListener('focus', showPoint);
    dot.addEventListener('click', () => openWikiModal(p.spec.id, 'tab-expert'));
  });

  // Extremos empíricos no painel lateral
  if (extremesEl) {
    const longest = [...pts].sort((a, b) => b.lengthM - a.lengthM)[0];
    const heaviest = [...pts].sort((a, b) => b.weightKg - a.weightKg)[0];
    const fastest = list
      .map((s) => ({ spec: s, v: parseMetricNumber(s.speed, 'speed_kmh') || 0 }))
      .filter((x) => x.v > 0)
      .sort((a, b) => b.v - a.v)[0];
    const strongestBite = list
      .map((s) => ({ spec: s, v: parseMetricNumber(s.bite_force, 'bite_n') || 0 }))
      .filter((x) => x.v > 0)
      .sort((a, b) => b.v - a.v)[0];

    const rows = [
      longest && { label: 'Maior Comprimento', name: longest.spec.name, val: formatLengthDisplay(longest.lengthM), id: longest.spec.id },
      heaviest && { label: 'Maior Massa', name: heaviest.spec.name, val: formatMassCompact(heaviest.weightKg), id: heaviest.spec.id },
      fastest && { label: 'Maior Velocidade', name: fastest.spec.name, val: `${fastest.v.toLocaleString('pt-BR')} km/h`, id: fastest.spec.id },
      strongestBite && { label: 'Maior Mordida', name: strongestBite.spec.name, val: `${strongestBite.v.toLocaleString('pt-BR')} N`, id: strongestBite.spec.id },
    ].filter(Boolean);

    extremesEl.innerHTML = rows
      .map(
        (r) => `
        <button type="button" class="rw-extreme-row" data-open-id="${escapeHtml(r.id)}">
          <span class="rw-extreme-label">${escapeHtml(r.label)}</span>
          <strong class="rw-extreme-name">${escapeHtml(r.name)}</strong>
          <span class="rw-extreme-val tabular-num">${escapeHtml(r.val)}</span>
        </button>
      `
      )
      .join('');

    extremesEl.querySelectorAll('[data-open-id]').forEach((btn) => {
      btn.addEventListener('click', () => openWikiModal(btn.getAttribute('data-open-id'), 'tab-expert'));
    });
  }
}

function renderRwHeatmapMatrix(catalog) {
  const wrap = document.getElementById('rwHeatmapWrap');
  if (!wrap) return;

  const eras = [
    { key: 'contemporaneo', label: 'Contemporâneo' },
    { key: 'cenozoico', label: 'Cenozoico' },
    { key: 'mesozoico', label: 'Mesozoico' },
    { key: 'paleozoico', label: 'Paleozoico' },
    { key: 'precambriano', label: 'Pré-Cambriano' },
    { key: 'microbiologico', label: 'Microbiológico' },
  ];
  const habitats = [
    { key: 'terrestre', label: 'Terrestre' },
    { key: 'aquatico', label: 'Aquático' },
    { key: 'aereo', label: 'Aéreo' },
    { key: 'anfibio', label: 'Anfíbio' },
    { key: 'bentonico', label: 'Abissal' },
    { key: 'microbiologico', label: 'Microscópico' },
  ];

  const counts = {};
  let maxCell = 1;
  (catalog || []).forEach((s) => {
    const eKey = s.era || 'contemporaneo';
    const hKey = resolveSpecimenHabitat(s);
    const k = `${eKey}|${hKey}`;
    counts[k] = (counts[k] || 0) + 1;
    if (counts[k] > maxCell) maxCell = counts[k];
  });

  const headerCells = habitats.map((h) => `<th>${escapeHtml(h.label)}</th>`).join('');
  const bodyRows = eras
    .map((e) => {
      let rowTotal = 0;
      const cells = habitats
        .map((h) => {
          const c = counts[`${e.key}|${h.key}`] || 0;
          rowTotal += c;
          const intensity = c > 0 ? 0.16 + (c / maxCell) * 0.64 : 0;
          const isSelected = state.currentEra === e.key && state.currentHabitat === h.key;
          return `
            <td>
              <button
                type="button"
                class="rw-heat-cell tabular-num ${c === 0 ? 'is-zero' : ''} ${isSelected ? 'is-selected' : ''}"
                data-heat-era="${e.key}"
                data-heat-hab="${h.key}"
                style="${c > 0 ? `background: rgba(56, 189, 248, ${intensity.toFixed(2)});` : ''}"
                ${c === 0 ? 'disabled' : ''}
                title="${c} táxon(s) em ${e.label} · ${h.label}"
              >
                ${c}
              </button>
            </td>
          `;
        })
        .join('');
      return `<tr><th class="rw-heat-row-label">${escapeHtml(e.label)}</th>${cells}<td class="rw-heat-total tabular-num">${rowTotal}</td></tr>`;
    })
    .join('');

  wrap.innerHTML = `
    <div class="rw-table-scroll">
      <table class="rw-heatmap-table">
        <thead>
          <tr>
            <th>Era \\ Habitat</th>
            ${headerCells}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </div>
    <div class="rw-heat-legend tabular-num">
      <span>Escala de densidade: 0</span>
      <span class="rw-heat-ramp" aria-hidden="true"></span>
      <span>${maxCell} táxons</span>
    </div>
  `;

  wrap.querySelectorAll('.rw-heat-cell:not(:disabled)').forEach((btn) => {
    btn.addEventListener('click', () => {
      const era = btn.getAttribute('data-heat-era');
      const hab = btn.getAttribute('data-heat-hab');
      state.currentEra = era;
      state.currentHabitat = hab;
      document.querySelectorAll('.era-tab-btn').forEach((b) =>
        b.classList.toggle('active', b.getAttribute('data-era') === era)
      );
      selectHabitatPortal(hab, false);
      loadCatalog();
      showToast(`Recorte aplicado: ${era} × ${HABITAT_META[hab]?.shortLabel || hab}.`);
    });
  });
}

function populateRwMrcaSelectors() {
  const selA = document.getElementById('rwMrcaSelectA');
  const selB = document.getElementById('rwMrcaSelectB');
  if (!selA || !selB) return;

  const sorted = [...(state.allCatalog || [])].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  if (sorted.length < 2) return;

  const prevA = selA.value;
  const prevB = selB.value;

  const optsHtml = sorted
    .map((s) => `<option value="${escapeHtml(s.id)}">${escapeHtml(s.name)} (${escapeHtml(s.scientific_name || s.genus)})</option>`)
    .join('');
  selA.innerHTML = optsHtml;
  selB.innerHTML = optsHtml;

  if (prevA && sorted.some((s) => s.id === prevA)) {
    selA.value = prevA;
  } else {
    const defA = sorted.find((s) => s.id === 'tyrannosaurus') || sorted[0];
    selA.value = defA.id;
  }

  if (prevB && sorted.some((s) => s.id === prevB) && prevB !== selA.value) {
    selB.value = prevB;
  } else {
    const defB = sorted.find((s) => s.id === 'velociraptor' || s.id === 'balaenoptera-musculus') || sorted[1];
    selB.value = defB.id === selA.value ? sorted.find((s) => s.id !== selA.value).id : defB.id;
  }
}

function runRwMrcaAnalysis() {
  const selA = document.getElementById('rwMrcaSelectA');
  const selB = document.getElementById('rwMrcaSelectB');
  const out = document.getElementById('rwMrcaOutput');
  if (!selA || !selB || !out) return;

  const specA = state.allCatalog.find((s) => s.id === selA.value);
  const specB = state.allCatalog.find((s) => s.id === selB.value);
  if (!specA || !specB) {
    out.innerHTML = '<p class="rw-side-hint">Selecione dois táxons válidos.</p>';
    return;
  }

  const cladA = Array.isArray(specA.expert?.cladogram) ? specA.expert.cladogram : [];
  const cladB = Array.isArray(specB.expert?.cladogram) ? specB.expert.cladogram : [];
  const normB = cladB.map((n) => normalizeStr(n));

  let mrcaNode = 'LUCA (Ancestral Celular Universal)';
  let sharedIdxA = -1;
  let sharedIdxB = -1;
  const sharedNodes = [];

  cladA.forEach((node, i) => {
    const j = normB.indexOf(normalizeStr(node));
    if (j !== -1) {
      sharedNodes.push(node);
      sharedIdxA = i;
      sharedIdxB = j;
      mrcaNode = node;
    }
  });

  const stepsA = sharedIdxA >= 0 ? Math.max(0, cladA.length - 1 - sharedIdxA) : cladA.length;
  const stepsB = sharedIdxB >= 0 ? Math.max(0, cladB.length - 1 - sharedIdxB) : cladB.length;
  const cladisticDist = stepsA + stepsB;
  const unionSize = new Set([...cladA.map(normalizeStr), ...cladB.map(normalizeStr)]).size;
  const overlapPct = unionSize > 0 ? Math.round((sharedNodes.length / unionSize) * 100) : 0;

  const lenA = parseMetricNumber(specA.length, 'length_m');
  const lenB = parseMetricNumber(specB.length, 'length_m');
  const massA = parseMetricNumber(specA.weight, 'weight_kg');
  const massB = parseMetricNumber(specB.weight, 'weight_kg');
  const lenRatio = lenA && lenB ? `${(lenA / lenB).toFixed(2).replace('.', ',')}×` : 'N/D';
  const massRatio = massA && massB ? `${(massA / massB >= 100 ? Math.round(massA / massB).toLocaleString('pt-BR') : (massA / massB).toFixed(2).replace('.', ','))}×` : 'N/D';

  const branchA = sharedIdxA >= 0 ? cladA.slice(sharedIdxA + 1) : cladA;
  const branchB = sharedIdxB >= 0 ? cladB.slice(sharedIdxB + 1) : cladB;

  out.innerHTML = `
    <div class="rw-mrca-grid">
      <div class="rw-mrca-metric">
        <span class="rw-kpi-label">Ancestral Comum Mais Recente (MRCA)</span>
        <strong class="rw-mrca-highlight">${escapeHtml(mrcaNode)}</strong>
        <span class="rw-kpi-sub">${sharedNodes.length} clado(s) compartilhado(s)</span>
      </div>
      <div class="rw-mrca-metric">
        <span class="rw-kpi-label">Distância Cladística</span>
        <strong class="rw-kpi-value tabular-num">${cladisticDist} nós</strong>
        <span class="rw-kpi-sub tabular-num">Sobreposição taxonômica: ${overlapPct}%</span>
      </div>
      <div class="rw-mrca-metric">
        <span class="rw-kpi-label">Razão Morfométrica (A / B)</span>
        <strong class="rw-kpi-value tabular-num">L: ${lenRatio} · M: ${massRatio}</strong>
        <span class="rw-kpi-sub">${escapeHtml(specA.era_display)} vs. ${escapeHtml(specB.era_display)}</span>
      </div>
    </div>

    <div class="rw-mrca-branches">
      <div class="rw-mrca-branch-box">
        <span class="rw-kpi-label">Linhagem Compartilhada</span>
        <div class="rw-mrca-path">${sharedNodes.length ? sharedNodes.map((n) => escapeHtml(n)).join(' → ') : 'Divergência basal (domínios/ramos profundos distintos)'}</div>
      </div>
      <div class="rw-mrca-split-cols">
        <div class="rw-mrca-branch-box">
          <div class="rw-mrca-branch-head">
            <strong>Ramo A · ${escapeHtml(specA.name)}</strong>
            <button type="button" class="btn-ghost-sm" data-mrca-open="${escapeHtml(specA.id)}">Abrir Dossiê</button>
          </div>
          <div class="rw-mrca-path">${branchA.length ? branchA.map((n) => escapeHtml(n)).join(' → ') : 'Mesmo nó terminal'}</div>
        </div>
        <div class="rw-mrca-branch-box">
          <div class="rw-mrca-branch-head">
            <strong>Ramo B · ${escapeHtml(specB.name)}</strong>
            <button type="button" class="btn-ghost-sm" data-mrca-open="${escapeHtml(specB.id)}">Abrir Dossiê</button>
          </div>
          <div class="rw-mrca-path">${branchB.length ? branchB.map((n) => escapeHtml(n)).join(' → ') : 'Mesmo nó terminal'}</div>
        </div>
      </div>
    </div>
  `;

  out.querySelectorAll('[data-mrca-open]').forEach((btn) => {
    btn.addEventListener('click', () => openWikiModal(btn.getAttribute('data-mrca-open'), 'tab-expert'));
  });
}

function renderResearcherDataTable(specimens) {
  const tbody = document.getElementById('researcherDataTableBody');
  if (!tbody) return;

  const { col, dir } = state.researcherTableSort || { col: 'weight', dir: 'desc' };
  const mult = dir === 'asc' ? 1 : -1;

  document.querySelectorAll('.rw-sort-btn[data-sort-col]').forEach((btn) => {
    const c = btn.getAttribute('data-sort-col');
    btn.classList.toggle('is-sorted', c === col);
    btn.dataset.sortDir = c === col ? dir : '';
  });

  const sorted = [...(specimens || [])].sort((a, b) => {
    if (col === 'name') return a.name.localeCompare(b.name, 'pt-BR') * mult;
    if (col === 'era') return String(a.era_display || '').localeCompare(String(b.era_display || ''), 'pt-BR') * mult;
    if (col === 'habitat') return resolveSpecimenHabitat(a).localeCompare(resolveSpecimenHabitat(b), 'pt-BR') * mult;
    const valMap = {
      length: (s) => parseMetricNumber(s.length, 'length_m') ?? -1,
      height: (s) => parseMetricNumber(s.height, 'length_m') ?? -1,
      weight: (s) => parseMetricNumber(s.weight, 'weight_kg') ?? -1,
      speed: (s) => parseMetricNumber(s.speed, 'speed_kmh') ?? -1,
      bite: (s) => parseMetricNumber(s.bite_force, 'bite_n') ?? -1,
      occurrences: (s) => Number(s.occurrences_count) || 0,
    };
    const fn = valMap[col];
    return fn ? (fn(a) - fn(b)) * mult : 0;
  });

  tbody.innerHTML = sorted
    .map((s) => {
      const len = parseMetricNumber(s.length, 'length_m');
      const hgt = parseMetricNumber(s.height, 'length_m');
      const mass = parseMetricNumber(s.weight, 'weight_kg');
      const spd = parseMetricNumber(s.speed, 'speed_kmh');
      const bite = parseMetricNumber(s.bite_force, 'bite_n');
      const occ = Number(s.occurrences_count) || 0;
      const hab = (HABITAT_META[resolveSpecimenHabitat(s)] || HABITAT_META.terrestre).shortLabel;
      const inCompare = state.compareIds.includes(s.id);

      return `
        <tr>
          <td>
            <button type="button" class="rw-table-taxon-link" data-tbl-open="${escapeHtml(s.id)}">
              <strong>${escapeHtml(s.name)}</strong>
              <em>${escapeHtml(s.scientific_name || s.genus || '')}</em>
            </button>
          </td>
          <td>${escapeHtml(s.era_display)} <span class="rw-table-sub">· ${escapeHtml(s.period)}</span></td>
          <td>${escapeHtml(hab)}</td>
          <td class="num-col tabular-num">${len !== null ? formatLengthDisplay(len) : '—'}</td>
          <td class="num-col tabular-num">${hgt !== null ? formatLengthDisplay(hgt) : '—'}</td>
          <td class="num-col tabular-num">${mass !== null ? formatMassCompact(mass) : '—'}</td>
          <td class="num-col tabular-num">${spd !== null ? `${spd.toLocaleString('pt-BR')}` : '—'}</td>
          <td class="num-col tabular-num">${bite !== null ? `${bite.toLocaleString('pt-BR')}` : '—'}</td>
          <td class="num-col tabular-num">${occ > 0 ? occ.toLocaleString('pt-BR') : '—'}</td>
          <td>${escapeHtml(s.is_contemporary ? (s.conservation_status || 'Vivente') : 'Extinto (Fóssil)')}</td>
          <td class="rw-table-actions-cell">
            <button type="button" class="btn-ghost-sm" data-tbl-open="${escapeHtml(s.id)}">Dossiê</button>
            <button type="button" class="btn-ghost-sm ${inCompare ? 'is-active' : ''}" data-tbl-compare="${escapeHtml(s.id)}">${inCompare ? '✓ Comp.' : '+ Comp.'}</button>
          </td>
        </tr>
      `;
    })
    .join('');

  tbody.querySelectorAll('[data-tbl-open]').forEach((btn) => {
    btn.addEventListener('click', () => openWikiModal(btn.getAttribute('data-tbl-open'), 'tab-expert'));
  });
  tbody.querySelectorAll('[data-tbl-compare]').forEach((btn) => {
    btn.addEventListener('click', () => {
      toggleCompareSpecimen(btn.getAttribute('data-tbl-compare'));
      renderResearcherDataTable(state.specimens);
    });
  });
}

// ============================================================================
// DOSSIÊ CIENTÍFICO AVANÇADO (#tab-expert)
// ============================================================================

function buildApaCitation(spec) {
  const year = new Date().getFullYear();
  const sci = spec.scientific_name || spec.genus || spec.name;
  const link = buildSpecimenShareUrl(spec.id);
  return `BioAtlas. (${year}). ${spec.name} (${sci}) [Dossiê taxonômico e morfométrico]. Plataforma BioAtlas (GBIF, PBDB & Wikimedia Commons). ${link}`;
}

function cleanTaxonQueryName(spec) {
  const raw = String(spec.scientific_name || spec.genus || spec.name || '').trim();
  return raw
    .replace(/\([^)]*\)/g, ' ')
    .replace(/,\s*\d{4}.*$/i, '')
    .replace(/\s+[A-Z][a-z]+\s*,\s*\d{4}.*$/, '')
    .replace(/\s+\d{4}.*$/, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 2)
    .join(' ');
}

function renderExpertTaxonomyAndLinks(spec) {
  const matrixEl = document.getElementById('expertTaxonomyMatrix');
  const linksEl = document.getElementById('expertExternalDbLinks');
  const clad = Array.isArray(spec.expert?.cladogram) ? spec.expert.cladogram : [];
  const taxonQuery = cleanTaxonQueryName(spec);

  if (linksEl) {
    const q = encodeURIComponent(taxonQuery);
    linksEl.innerHTML = `
      <a href="https://www.gbif.org/species/search?q=${q}" target="_blank" rel="noopener noreferrer" class="expert-db-link">GBIF ↗</a>
      <a href="https://paleobiodb.org/classic/checkTaxonInfo?taxon_name=${q}" target="_blank" rel="noopener noreferrer" class="expert-db-link">PBDB ↗</a>
      <a href="https://www.catalogueoflife.org/data/search?q=${q}" target="_blank" rel="noopener noreferrer" class="expert-db-link">Catalogue of Life ↗</a>
      <a href="https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?name=${q}" target="_blank" rel="noopener noreferrer" class="expert-db-link">NCBI Taxonomy ↗</a>
      <a href="https://www.iucnredlist.org/search?query=${q}" target="_blank" rel="noopener noreferrer" class="expert-db-link">IUCN ↗</a>
      <a href="https://scholar.google.com/scholar?q=${q}" target="_blank" rel="noopener noreferrer" class="expert-db-link">Google Scholar ↗</a>
    `;
  }

  if (matrixEl) {
    const cladLower = clad.map((c) => normalizeStr(c));
    const domain = cladLower.some((c) => c.includes('virus'))
      ? 'Varidnaviria / Vírus'
      : cladLower.some((c) => c.includes('bacteria') || c.includes('cyanobacter'))
      ? 'Bacteria'
      : cladLower.some((c) => c.includes('archaea'))
      ? 'Archaea'
      : 'Eukaryota';

    const kingdom = clad[0] || (domain === 'Bacteria' ? 'Bacteria' : 'Animalia');
    const phylum = clad[1] || (spec.skeletal_type === 'vertebrado' ? 'Chordata' : 'Em classificação');
    const superClade = clad[2] || spec.group_display || '—';
    const orderClade = clad[Math.min(3, Math.max(0, clad.length - 2))] || spec.group_display || '—';
    const familyClade = clad.length >= 2 ? clad[clad.length - 2] : spec.group_display || '—';

    const cells = [
      { k: 'Domínio', v: domain },
      { k: 'Reino / Clado Basal', v: kingdom },
      { k: 'Filo / Divisão', v: phylum },
      { k: 'Subfilo / Classe', v: superClade },
      { k: 'Ordem / Clado', v: orderClade },
      { k: 'Família / Ramo', v: familyClade },
      { k: 'Gênero', v: spec.genus || '—' },
      { k: 'Nome Científico', v: spec.scientific_name || spec.genus || spec.name, italic: true },
      { k: 'Intervalo Geológico', v: `${spec.period} (${spec.geological_range || spec.era_display})` },
      { k: 'Status Biológico', v: spec.is_contemporary ? (spec.conservation_status || 'Espécie Vivente') : 'Extinto no Registro Fóssil' },
    ];

    matrixEl.innerHTML = cells
      .map(
        (c) => `
        <div class="expert-tax-cell">
          <span class="expert-tax-rank">${escapeHtml(c.k)}</span>
          <strong class="expert-tax-val ${c.italic ? 'is-italic' : ''}">${escapeHtml(c.v)}</strong>
        </div>
      `
      )
      .join('');
  }
}

function computeCatalogPercentile(val, allVals) {
  if (val === null || val === undefined || !Number.isFinite(val) || val <= 0) return 0;
  const sorted = allVals.filter((n) => typeof n === 'number' && Number.isFinite(n) && n > 0).sort((a, b) => a - b);
  if (sorted.length <= 1) return 50;
  let lessOrEq = 0;
  for (const n of sorted) {
    if (n <= val) lessOrEq += 1;
  }
  return Math.max(6, Math.min(100, Math.round((lessOrEq / sorted.length) * 100)));
}

function renderExpertRadarChart(spec) {
  const wrap = document.getElementById('expertRadarWrap');
  if (!wrap) return;

  const catalog = state.allCatalog.length ? state.allCatalog : [spec];
  const axes = [
    {
      label: 'Comprimento',
      val: parseMetricNumber(spec.length, 'length_m'),
      raw: spec.length || 'N/D',
      pct: computeCatalogPercentile(
        parseMetricNumber(spec.length, 'length_m'),
        catalog.map((s) => parseMetricNumber(s.length, 'length_m'))
      ),
    },
    {
      label: 'Massa',
      val: parseMetricNumber(spec.weight, 'weight_kg'),
      raw: spec.weight || 'N/D',
      pct: computeCatalogPercentile(
        parseMetricNumber(spec.weight, 'weight_kg'),
        catalog.map((s) => parseMetricNumber(s.weight, 'weight_kg'))
      ),
    },
    {
      label: 'Velocidade',
      val: parseMetricNumber(spec.speed, 'speed_kmh'),
      raw: spec.speed || 'N/D',
      pct: computeCatalogPercentile(
        parseMetricNumber(spec.speed, 'speed_kmh'),
        catalog.map((s) => parseMetricNumber(s.speed, 'speed_kmh'))
      ),
    },
    {
      label: 'Mordida',
      val: parseMetricNumber(spec.bite_force, 'bite_n'),
      raw: spec.bite_force || 'N/D',
      pct: computeCatalogPercentile(
        parseMetricNumber(spec.bite_force, 'bite_n'),
        catalog.map((s) => parseMetricNumber(s.bite_force, 'bite_n'))
      ),
    },
    {
      label: 'Ocorrências',
      val: Number(spec.occurrences_count) || 0,
      raw: (Number(spec.occurrences_count) || 0).toLocaleString('pt-BR'),
      pct: computeCatalogPercentile(
        Number(spec.occurrences_count) || 0,
        catalog.map((s) => Number(s.occurrences_count) || 0)
      ),
    },
  ];

  const cx = 175;
  const cy = 128;
  const R = 84;
  const count = axes.length;

  const ptAt = (idx, ratio) => {
    const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / count;
    return [cx + Math.cos(angle) * R * ratio, cy + Math.sin(angle) * R * ratio];
  };

  const rings = [0.25, 0.5, 0.75, 1]
    .map((r) => {
      const pts = axes.map((_, i) => ptAt(i, r).map((v) => v.toFixed(1)).join(',')).join(' ');
      return `<polygon points="${pts}" fill="none" stroke="${r === 0.5 ? 'rgba(245,158,11,0.38)' : 'rgba(148,163,184,0.18)'}" stroke-dasharray="${r === 0.5 ? '3 3' : ''}" stroke-width="1" />`;
    })
    .join('');

  const spokes = axes
    .map((ax, i) => {
      const [x2, y2] = ptAt(i, 1);
      const [lx, ly] = ptAt(i, 1.24);
      const anchor = lx < cx - 12 ? 'end' : lx > cx + 12 ? 'start' : 'middle';
      return `
        <line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="rgba(148,163,184,0.22)" stroke-width="1" />
        <text x="${lx.toFixed(1)}" y="${(ly + 3).toFixed(1)}" fill="#cbd5e1" font-size="10" font-family="JetBrains Mono, monospace" text-anchor="${anchor}">${escapeHtml(ax.label)} (${ax.pct}%)</text>
      `;
    })
    .join('');

  const specPolyPts = axes.map((ax, i) => ptAt(i, ax.pct / 100).map((v) => v.toFixed(1)).join(',')).join(' ');
  const specDots = axes
    .map((ax, i) => {
      const [x, y] = ptAt(i, ax.pct / 100);
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.8" fill="#38bdf8" stroke="#0b1220" stroke-width="1.2"><title>${escapeHtml(ax.label)}: ${escapeHtml(ax.raw)} (percentil ${ax.pct}%)</title></circle>`;
    })
    .join('');

  wrap.innerHTML = `
    <svg viewBox="0 0 350 256" width="100%" height="236" role="img" aria-label="Gráfico radar de percentis morfométricos">
      ${rings}
      ${spokes}
      <polygon points="${specPolyPts}" fill="rgba(56, 189, 248, 0.22)" stroke="#38bdf8" stroke-width="2" />
      ${specDots}
    </svg>
    <div class="expert-radar-legend tabular-num">
      <span><i style="background:#38bdf8"></i>Percentil do espécime</span>
      <span><i style="background:#f59e0b"></i>Mediana do acervo (50%)</span>
    </div>
  `;
}

function getMetabolicModelForSpecimen(spec) {
  const text = normalizeStr(`${(spec.expert?.cladogram || []).join(' ')} ${spec.group || ''} ${spec.group_display || ''}`);
  if (text.includes('mammalia') || text.includes('mamifero') || text.includes('aves') || text.includes('ave')) {
    return { label: 'Endotérmico (Kleiber)', coeffKcal: 70 };
  }
  if (text.includes('dinosaur') || text.includes('pterosaur') || text.includes('lamn') || text.includes('cetacea')) {
    return { label: 'Mesotérmico (Grady et al.)', coeffKcal: 28 };
  }
  return { label: 'Ectotérmico padrão', coeffKcal: 7 };
}

function renderExpertBiophysicsAndSim(spec) {
  const grid = document.getElementById('expertBiophysicsGrid');
  const slider = document.getElementById('expertScaleSlider');
  if (!grid) return;

  const lengthM = parseMetricNumber(spec.length, 'length_m');
  const weightKg = parseMetricNumber(spec.weight, 'weight_kg');
  const speedKmh = parseMetricNumber(spec.speed, 'speed_kmh');
  const model = getMetabolicModelForSpecimen(spec);

  // Kleiber Basal Metabolic Rate: BMR = coeff * M^0.75 (kcal/day)
  let bmrText = 'N/D';
  let bmrWattsText = 'Massa insuficiente para estimativa';
  if (weightKg && weightKg > 0) {
    const kcalDay = model.coeffKcal * Math.pow(weightKg, 0.75);
    const watts = kcalDay * 0.04843;
    bmrText = kcalDay >= 1000 ? `${Math.round(kcalDay).toLocaleString('pt-BR')} kcal/dia` : `${kcalDay.toFixed(kcalDay >= 10 ? 1 : 3)} kcal/dia`;
    bmrWattsText = `${watts >= 10 ? watts.toFixed(1) : watts.toFixed(3)} W · ${model.label}`;
  }

  // Maximum Kinetic Energy: Ek = 0.5 * m * v^2
  let ekText = 'N/D';
  let ekSub = 'Velocidade ou massa não disponível';
  if (weightKg && weightKg > 0 && speedKmh && speedKmh > 0) {
    const vMs = speedKmh / 3.6;
    const joules = 0.5 * weightKg * vMs * vMs;
    if (joules >= 1e6) {
      ekText = `${(joules / 1e6).toFixed(2).replace('.', ',')} MJ`;
    } else if (joules >= 1000) {
      ekText = `${(joules / 1000).toFixed(1).replace('.', ',')} kJ`;
    } else {
      ekText = `${joules.toFixed(1).replace('.', ',')} J`;
    }
    ekSub = `v = ${vMs.toFixed(1).replace('.', ',')} m/s · Momento p = ${Math.round(weightKg * vMs).toLocaleString('pt-BR')} kg·m/s`;
  }

  // Robustness index: M / L^3 (kg/m^3)
  let robText = 'N/D';
  let robSub = 'Proporção massa / volume cúbico';
  if (weightKg && lengthM && lengthM > 0) {
    const rho = weightKg / Math.pow(lengthM, 3);
    robText = `${rho >= 100 ? Math.round(rho).toLocaleString('pt-BR') : rho.toFixed(2).replace('.', ',')} kg/m³`;
    robSub = rho > 25 ? 'Morfotipo compacto / robusto' : rho > 8 ? 'Morfotipo balanceado' : 'Morfotipo longilíneo / esguio';
  }

  grid.innerHTML = `
    <div class="expert-biophys-cell">
      <span class="expert-tax-rank">Taxa Metabólica Basal (BMR)</span>
      <strong class="expert-biophys-val tabular-num">${escapeHtml(bmrText)}</strong>
      <span class="expert-biophys-sub">${escapeHtml(bmrWattsText)}</span>
    </div>
    <div class="expert-biophys-cell">
      <span class="expert-tax-rank">Energia Cinética Máxima (Eₖ)</span>
      <strong class="expert-biophys-val tabular-num">${escapeHtml(ekText)}</strong>
      <span class="expert-biophys-sub tabular-num">${escapeHtml(ekSub)}</span>
    </div>
    <div class="expert-biophys-cell">
      <span class="expert-tax-rank">Índice de Robustez (M / L³)</span>
      <strong class="expert-biophys-val tabular-num">${escapeHtml(robText)}</strong>
      <span class="expert-biophys-sub">${escapeHtml(robSub)}</span>
    </div>
  `;

  if (slider) {
    slider.value = '100';
  }
  updateExpertScaleSimulator(spec, 100);
}

function updateExpertScaleSimulator(spec, pctInt) {
  const factorLabel = document.getElementById('expertScaleFactorLabel');
  const resEl = document.getElementById('expertScaleSimResults');
  if (!resEl) return;

  const k = Math.max(0.5, Math.min(2.0, (Number(pctInt) || 100) / 100));
  if (factorLabel) {
    factorLabel.textContent = `${k.toFixed(2).replace('.', ',')}× (${Math.round(k * 100)}%)`;
  }

  const lengthM = parseMetricNumber(spec.length, 'length_m');
  const weightKg = parseMetricNumber(spec.weight, 'weight_kg');
  const model = getMetabolicModelForSpecimen(spec);

  const scaledL = lengthM ? formatLengthDisplay(lengthM * k) : `L × ${k.toFixed(2)}`;
  const scaledM = weightKg ? formatMassCompact(weightKg * Math.pow(k, 3)) : `M × ${Math.pow(k, 3).toFixed(2)}`;
  const areaFactor = Math.pow(k, 2);
  const bmrFactor = Math.pow(k, 2.25);
  const scaledBmr =
    weightKg && weightKg > 0
      ? `${Math.round(model.coeffKcal * Math.pow(weightKg * Math.pow(k, 3), 0.75)).toLocaleString('pt-BR')} kcal/dia`
      : `×${bmrFactor.toFixed(2)}`;

  resEl.innerHTML = `
    <div><span>Comprimento (×k)</span><strong>${escapeHtml(scaledL)}</strong></div>
    <div><span>Massa (×k³)</span><strong>${escapeHtml(scaledM)}</strong></div>
    <div><span>Seção Óssea (×k²)</span><strong>${areaFactor.toFixed(2).replace('.', ',')}×</strong></div>
    <div><span>Estresse Estrutural</span><strong>${k.toFixed(2).replace('.', ',')}×</strong></div>
    <div><span>Demanda Metabólica</span><strong>${escapeHtml(scaledBmr)}</strong></div>
  `;
}

function renderExpertEcologySummary(spec) {
  const box = document.getElementById('expertEcologySummary');
  if (!box) return;
  const hab = HABITAT_META[resolveSpecimenHabitat(spec)] || HABITAT_META.terrestre;
  box.innerHTML = `
    <div class="expert-eco-grid">
      <div><span>Nicho Trófico</span><strong>${escapeHtml(spec.diet_display || 'Em estudo')}</strong></div>
      <div><span>Bioma / Ambiente</span><strong>${escapeHtml(hab.label)}</strong></div>
      <div><span>Sistema Estrutural</span><strong>${escapeHtml(spec.skeletal_composition || spec.skeletal_type || 'N/D')}</strong></div>
      <div><span>Localidades / Formações</span><strong>${escapeHtml(spec.fossil_locations || 'Distribuição global')}</strong></div>
    </div>
  `;
}

function renderExpertOccurrencesTable(spec, occurrences, sourceLabel) {
  const metaEl = document.getElementById('expertOccurrencesMeta');
  const latStrip = document.getElementById('expertLatitudinalSummary');
  const tableWrap = document.getElementById('expertOccurrencesTableWrap');
  if (!tableWrap) return;

  const list = Array.isArray(occurrences) ? occurrences : [];
  if (metaEl) {
    metaEl.textContent = `${list.length} registro(s) georreferenciado(s) carregado(s) · Fonte: ${sourceLabel} · Total indexado na ficha: ${(Number(spec.occurrences_count) || list.length).toLocaleString('pt-BR')}`;
  }

  const validCoords = list.filter((o) => Number.isFinite(Number(o.lat)) && Number.isFinite(Number(o.lng)));
  if (latStrip) {
    if (validCoords.length > 0) {
      const lats = validCoords.map((o) => Number(o.lat));
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const span = maxLat - minLat;
      const meanLat = lats.reduce((a, b) => a + b, 0) / lats.length;
      const hemi = meanLat > 5 ? 'Hemisfério Norte' : meanLat < -5 ? 'Hemisfério Sul' : 'Faixa Equatorial';
      latStrip.innerHTML = `
        <div class="expert-lat-cell"><span>Lat. Mínima</span><strong class="tabular-num">${minLat.toFixed(2)}°</strong></div>
        <div class="expert-lat-cell"><span>Lat. Máxima</span><strong class="tabular-num">${maxLat.toFixed(2)}°</strong></div>
        <div class="expert-lat-cell"><span>Amplitude Latitudinal</span><strong class="tabular-num">${span.toFixed(2)}°</strong></div>
        <div class="expert-lat-cell"><span>Centroide Latitudinal</span><strong class="tabular-num">${meanLat.toFixed(2)}° (${hemi})</strong></div>
      `;
    } else {
      latStrip.innerHTML = '';
    }
  }

  if (list.length === 0) {
    tableWrap.innerHTML = '<p class="rw-side-hint">Nenhuma coordenada pontual retornada para este táxon.</p>';
    return;
  }

  const rowsHtml = list
    .slice(0, 30)
    .map((o, idx) => {
      const lat = Number.isFinite(Number(o.lat)) ? Number(o.lat).toFixed(4) : '—';
      const lng = Number.isFinite(Number(o.lng)) ? Number(o.lng).toFixed(4) : '—';
      const loc = o.locality || o.formation || o.stateProvince || 'Registro de campo';
      const country = o.country || o.cc || '—';
      const interval = o.interval || o.early_interval || o.year || spec.period || '—';
      const src = o.source || sourceLabel;
      return `
        <tr>
          <td class="tabular-num">${idx + 1}</td>
          <td class="tabular-num">${lat}</td>
          <td class="tabular-num">${lng}</td>
          <td>${escapeHtml(loc)}</td>
          <td>${escapeHtml(country)}</td>
          <td>${escapeHtml(interval)}</td>
          <td>${escapeHtml(src)}</td>
        </tr>
      `;
    })
    .join('');

  tableWrap.innerHTML = `
    <div class="rw-table-scroll expert-occ-scroll">
      <table class="rw-data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Localidade / Formação</th>
            <th>País / Região</th>
            <th>Intervalo / Ano</th>
            <th>Fonte</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>
  `;
}

function exportCurrentOccurrences(format) {
  const spec = state.selectedSpecimen;
  const occs = state.currentSpecimenOccurrences || [];
  if (!spec || occs.length === 0) {
    showToast('Nenhuma ocorrência carregada para exportar.');
    return;
  }
  const safeSlug = String(spec.id || 'especime').replace(/[^a-z0-9_-]/gi, '-');
  if (format === 'geojson') {
    const geojson = {
      type: 'FeatureCollection',
      name: `${spec.name} (${spec.scientific_name || spec.genus})`,
      features: occs
        .filter((o) => Number.isFinite(Number(o.lat)) && Number.isFinite(Number(o.lng)))
        .map((o) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [Number(o.lng), Number(o.lat)],
          },
          properties: {
            taxon: spec.scientific_name || spec.name,
            locality: o.locality || o.formation || '',
            country: o.country || '',
            interval: o.interval || spec.period || '',
            source: o.source || state.currentSpecimenOccSource || '',
          },
        })),
    };
    downloadBlobFile(JSON.stringify(geojson, null, 2), `bioatlas-ocorrencias-${safeSlug}.geojson`, 'application/geo+json;charset=utf-8');
    showToast(`GeoJSON exportado (${geojson.features.length} pontos para QGIS/R).`);
    return;
  }

  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [
    'taxon,latitude,longitude,localidade,pais,intervalo,fonte',
    ...occs.map((o) =>
      [
        spec.scientific_name || spec.name,
        o.lat ?? '',
        o.lng ?? '',
        o.locality || o.formation || '',
        o.country || '',
        o.interval || spec.period || '',
        o.source || state.currentSpecimenOccSource || '',
      ]
        .map(esc)
        .join(',')
    ),
  ];
  downloadBlobFile(`\uFEFF${lines.join('\n')}`, `bioatlas-ocorrencias-${safeSlug}.csv`, 'text/csv;charset=utf-8');
  showToast(`CSV de ocorrências exportado (${occs.length} registros).`);
}

function buildPaperAbnt(paper) {
  const authors = paper.authors && paper.authors.length ? paper.authors.join('; ') : 'AUTOR DESCONHECIDO';
  const year = paper.year || 's.d.';
  const doiPart = paper.doi ? ` DOI: https://doi.org/${paper.doi}.` : '';
  return `${authors}. ${paper.title}. ${paper.journal}, ${year}.${doiPart}`;
}

function buildPaperBibtex(paper) {
  const firstAuthor = (paper.authors?.[0] || 'author').split(' ').slice(-1)[0].replace(/[^a-z0-9]/gi, '').toLowerCase() || 'ref';
  const year = paper.year || 'nd';
  const key = `${firstAuthor}${year}`;
  return `@article{${key},\n  author  = {${(paper.authors || ['Unknown']).join(' and ')}},\n  title   = {${paper.title}},\n  journal = {${paper.journal}},\n  year    = {${year}},\n  doi     = {${paper.doi || ''}}\n}`;
}

async function loadExpertResearchPapers(spec, sortMode = 'cited') {
  const listEl = document.getElementById('expertPapersList');
  const metaEl = document.getElementById('expertPapersMeta');
  if (!listEl) return;

  const reqId = ++state.expertPapersReqId;
  const queryTaxon = cleanTaxonQueryName(spec);
  if (metaEl) {
    metaEl.textContent = `Consultando literatura científica real para "${queryTaxon}"...`;
  }
  listEl.innerHTML = '<div class="expert-papers-loading">Buscando publicações indexadas em OpenAlex &amp; Crossref...</div>';

  try {
    const res = await fetch(`${API_BASE}/api/research/${encodeURIComponent(queryTaxon)}?sort=${encodeURIComponent(sortMode)}`);
    if (reqId !== state.expertPapersReqId) return;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const papers = await res.json();
    state.currentSpecimenPapers = Array.isArray(papers) ? papers : [];

    if (!state.currentSpecimenPapers.length) {
      if (metaEl) metaEl.textContent = `Nenhuma publicação indexada retornada para "${queryTaxon}".`;
      listEl.innerHTML = '<p class="rw-side-hint">Experimente consultar diretamente no Google Scholar pelo botão acima.</p>';
      return;
    }

    if (metaEl) {
      metaEl.textContent = `${state.currentSpecimenPapers.length} artigos revisados por pares para "${queryTaxon}" · Fonte: ${state.currentSpecimenPapers[0].source} · Ordenação: ${sortMode === 'recent' ? 'Mais Recentes' : 'Mais Citados'}`;
    }

    listEl.innerHTML = state.currentSpecimenPapers
      .map((p, idx) => {
        const authorsStr = p.authors && p.authors.length ? p.authors.join(', ') : 'Autores não listados';
        const metaParts = [
          p.year ? String(p.year) : 's.d.',
          p.journal,
          `${(Number(p.cited_by_count) || 0).toLocaleString('pt-BR')} citações`,
          p.is_oa ? 'Acesso Aberto (OA)' : null,
        ].filter(Boolean);

        return `
          <article class="expert-paper-item">
            <div class="expert-paper-main">
              <a href="${escapeHtml(p.url || '#')}" target="_blank" rel="noopener noreferrer" class="expert-paper-title">
                ${escapeHtml(p.title)} ↗
              </a>
              <div class="expert-paper-authors">${escapeHtml(authorsStr)}</div>
              <div class="expert-paper-meta tabular-num">${metaParts.map((m) => escapeHtml(m)).join(' · ')}</div>
            </div>
            <div class="expert-paper-actions">
              <button type="button" class="btn-ghost-sm" data-paper-abnt="${idx}">ABNT</button>
              <button type="button" class="btn-ghost-sm" data-paper-bib="${idx}">BibTeX</button>
            </div>
          </article>
        `;
      })
      .join('');

    listEl.querySelectorAll('[data-paper-abnt]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const p = state.currentSpecimenPapers[Number(btn.getAttribute('data-paper-abnt'))];
        if (p) copyTextSafe(buildPaperAbnt(p), 'Citação ABNT do artigo copiada.');
      });
    });
    listEl.querySelectorAll('[data-paper-bib]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const p = state.currentSpecimenPapers[Number(btn.getAttribute('data-paper-bib'))];
        if (p) copyTextSafe(buildPaperBibtex(p), 'BibTeX do artigo copiado.');
      });
    });
  } catch (err) {
    if (reqId !== state.expertPapersReqId) return;
    if (metaEl) metaEl.textContent = 'Consulta temporariamente indisponível para a base de artigos.';
    listEl.innerHTML = '<p class="rw-side-hint">Use os links diretos do Google Scholar ou GBIF no cabeçalho acima.</p>';
  }
}

function showCladeRelativesDrawer(cladeName, matches, currentSpecId) {
  const box = document.getElementById('cladeRelativesBox');
  if (!box) return;

  box.classList.remove('hidden');
  box.innerHTML = `
    <div class="clade-relatives-header">
      <strong>Parentes em "${escapeHtml(cladeName)}" (${matches.length} no catálogo)</strong>
      <button type="button" class="btn-outline-sm" id="btnFilterGridByClade">Filtrar catálogo</button>
    </div>
    <div class="clade-relatives-chips" id="cladeRelativesChips"></div>
  `;

  box.querySelector('#btnFilterGridByClade').addEventListener('click', () => {
    state.currentClade = cladeName;
    state.currentEra = 'all';
    state.favoritesOnly = false;
    state.activeCollectionId = null;
    document.querySelectorAll('.era-tab-btn').forEach((b) =>
      b.classList.toggle('active', b.getAttribute('data-era') === 'all')
    );
    closeWikiModal();
    loadCatalog();
    showToast(`Catálogo filtrado pelo clado "${cladeName}".`);
  });

  const chipsWrap = box.querySelector('#cladeRelativesChips');
  if (matches.length === 0) {
    chipsWrap.innerHTML = '<small style="color:var(--text-muted);">Nenhum outro representante catalogado ainda neste clado.</small>';
    return;
  }

  matches.slice(0, 14).forEach((rel) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'clade-relative-chip';
    chip.textContent = rel.id === currentSpecId ? `${rel.name} (atual)` : rel.name;
    chip.addEventListener('click', () => {
      if (rel.id !== currentSpecId) {
        openWikiModal(rel.id, 'tab-overview');
      }
    });
    chipsWrap.appendChild(chip);
  });
}

function switchWikiTab(tabId) {
  document.querySelectorAll('.wiki-tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });
  document.querySelectorAll('.wiki-tab-content').forEach((content) => {
    content.classList.toggle('active', content.id === tabId);
  });

  if (tabId === 'tab-overview' && window.BioAtlasGlobe3D) {
    setTimeout(() => window.BioAtlasGlobe3D.resize(), 60);
  }
}

function closeWikiModal() {
  const wikiModal = document.getElementById('wikiModal');
  if (wikiModal) wikiModal.classList.add('hidden');
  document.body.style.overflow = '';
  resetBioacousticsPlayer();
  syncUrlParams(null);
  if (window.BioAtlasGlobe3D) {
    window.BioAtlasGlobe3D.pause();
  }
}

// ============================================================================
// LIGHTBOX EM TELA CHEIA
// ============================================================================

function openLightboxForSpecimen(specId) {
  const spec = findSpecimenById(specId);
  if (!spec) return;
  state.selectedSpecimen = spec;
  state.lightboxSpecimen = spec;
  state.lightboxImages =
    spec.gallery && spec.gallery.length > 0
      ? spec.gallery
      : [{ url: spec.image_url, caption: spec.image_caption, category: 'life_view' }];
  openLightbox(0, 'all');
}

function openLightbox(index = 0, category = 'all') {
  if (!state.lightboxImages || state.lightboxImages.length === 0) return;
  state.lightboxCategory = category;
  state.lightboxSpecimen = state.selectedSpecimen;

  const titleEl = document.getElementById('lightboxSpecimenTitle');
  if (titleEl && state.lightboxSpecimen) {
    titleEl.textContent = `${state.lightboxSpecimen.name} (${
      state.lightboxSpecimen.scientific_name || state.lightboxSpecimen.genus
    })`;
  }

  updateLightboxCategoryCounts();
  filterLightboxImages(category);
  state.lightboxIndex = Math.max(0, Math.min(index, state.lightboxFilteredImages.length - 1));

  updateLightboxView();
  renderLightboxFilmstrip();

  const lb = document.getElementById('lightboxModal');
  if (lb) lb.classList.remove('hidden');
}

function updateLightboxCategoryCounts() {
  const allImgs = state.lightboxImages || [];
  const counts = {
    lbCatAllCount: allImgs.length,
    lbCatLifeCount: allImgs.filter(
      (img) => img.category === 'life_view' || img.type === 'life_restoration' || img.type === 'living_specimen'
    ).length,
    lbCatSkelCount: allImgs.filter((img) => img.category === 'skeletal_view' || img.type === 'skeleton').length,
    lbCatSkullCount: allImgs.filter(
      (img) => img.category === 'skull_view' || img.type === 'skull' || /crânio|skull|dente|tooth/i.test(img.caption || '')
    ).length,
    lbCatFossilCount: allImgs.filter(
      (img) =>
        img.category === 'fossil_view' ||
        img.type === 'fossil' ||
        /fóssil|escala|garra|quarry|holótipo/i.test(img.caption || '')
    ).length,
  };

  Object.entries(counts).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val);
  });

  document.querySelectorAll('.lightbox-cat-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-cat') === state.lightboxCategory);
  });
}

function filterLightboxImages(category) {
  const allImgs = state.lightboxImages || [];
  if (category === 'all') {
    state.lightboxFilteredImages = [...allImgs];
  } else if (category === 'life_view') {
    state.lightboxFilteredImages = allImgs.filter(
      (img) => img.category === 'life_view' || img.type === 'life_restoration' || img.type === 'living_specimen'
    );
  } else if (category === 'skeletal_view') {
    state.lightboxFilteredImages = allImgs.filter((img) => img.category === 'skeletal_view' || img.type === 'skeleton');
  } else if (category === 'skull_view') {
    state.lightboxFilteredImages = allImgs.filter(
      (img) => img.category === 'skull_view' || img.type === 'skull' || /crânio|skull|dente|tooth/i.test(img.caption || '')
    );
  } else if (category === 'fossil_view') {
    state.lightboxFilteredImages = allImgs.filter(
      (img) =>
        img.category === 'fossil_view' ||
        img.type === 'fossil' ||
        /fóssil|escala|garra|quarry|holótipo/i.test(img.caption || '')
    );
  }

  if (state.lightboxFilteredImages.length === 0) {
    state.lightboxFilteredImages = [...allImgs];
  }
}

function switchLightboxCategory(category) {
  state.lightboxCategory = category;
  filterLightboxImages(category);
  state.lightboxIndex = 0;

  document.querySelectorAll('.lightbox-cat-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-cat') === category);
  });

  updateLightboxView();
  renderLightboxFilmstrip();
}

function updateLightboxView() {
  const list = state.lightboxFilteredImages || state.lightboxImages;
  if (!list || list.length === 0) return;

  const current = list[state.lightboxIndex] || list[0];
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  const cnt = document.getElementById('lightboxCounter');
  const catBadge = document.getElementById('lightboxCategoryBadge');
  const habKey = resolveSpecimenHabitat(state.lightboxSpecimen);

  if (img) {
    img.dataset.fallbackStage = '';
    img.src = resolveDisplayImageUrl(current.url, habKey);
    img.onerror = () => handleImageFallback(img, current.url, habKey);
  }
  if (cap) cap.textContent = current.caption || 'Representação do espécime';
  if (cnt) cnt.textContent = `${state.lightboxIndex + 1} de ${list.length}`;

  if (catBadge) {
    let catLabel = 'Em Vida';
    if (current.category === 'skeletal_view' || current.type === 'skeleton') catLabel = 'Esqueleto & Museu';
    else if (current.category === 'skull_view' || current.type === 'skull') catLabel = 'Crânio & Dentes';
    else if (current.category === 'fossil_view' || current.type === 'fossil') catLabel = 'Fóssil & Escavação';
    catBadge.textContent = catLabel;
  }

  document.querySelectorAll('.filmstrip-thumb').forEach((thumb, idx) => {
    thumb.classList.toggle('active', idx === state.lightboxIndex);
    if (idx === state.lightboxIndex) {
      thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  });
}

function renderLightboxFilmstrip() {
  const filmstrip = document.getElementById('lightboxFilmstrip');
  if (!filmstrip) return;
  filmstrip.innerHTML = '';

  const habKey = resolveSpecimenHabitat(state.lightboxSpecimen);
  const list = state.lightboxFilteredImages || state.lightboxImages || [];
  list.forEach((item, idx) => {
    const thumb = document.createElement('img');
    thumb.src = resolveDisplayImageUrl(item.url, habKey);
    thumb.alt = item.caption || `Foto ${idx + 1}`;
    thumb.className = `filmstrip-thumb ${idx === state.lightboxIndex ? 'active' : ''}`;
    thumb.loading = 'lazy';
    thumb.onerror = () => handleImageFallback(thumb, item.url, habKey);
    thumb.addEventListener('click', () => {
      state.lightboxIndex = idx;
      updateLightboxView();
    });
    filmstrip.appendChild(thumb);
  });
}

function navigateLightbox(dir) {
  const list = state.lightboxFilteredImages || state.lightboxImages;
  if (!list || list.length <= 1) return;
  state.lightboxIndex = (state.lightboxIndex + dir + list.length) % list.length;
  updateLightboxView();
}

function closeLightbox() {
  const lb = document.getElementById('lightboxModal');
  if (lb) lb.classList.add('hidden');
}

// ============================================================================
// RESET & ESTATÍSTICAS
// ============================================================================

function resetAllFilters() {
  state.currentHabitat = 'all';
  state.currentEra = 'all';
  state.currentPeriod = 'all';
  state.currentGroup = 'all';
  state.currentDiet = 'all';
  state.currentSkeletalType = 'all';
  state.currentClade = '';
  state.favoritesOnly = false;
  state.activeCollectionId = null;
  state.searchQuery = '';

  applyHabitatTheme('all');

  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearBtn');
  const skeletalFilter = document.getElementById('skeletalFilter');
  const periodFilter = document.getElementById('periodFilter');
  const groupFilter = document.getElementById('groupFilter');
  const dietFilter = document.getElementById('dietFilter');
  const timelineSlider = document.getElementById('geologicalTimelineSlider');
  const btnClearTimeline = document.getElementById('btnClearTimeline');
  const readout = document.getElementById('timelineCurrentReadout');

  if (searchInput) searchInput.value = '';
  if (clearBtn) clearBtn.classList.add('hidden');
  hideSearchAutocomplete();
  if (skeletalFilter) skeletalFilter.value = 'all';
  if (periodFilter) periodFilter.value = 'all';
  if (groupFilter) groupFilter.value = 'all';
  if (dietFilter) dietFilter.value = 'all';
  if (timelineSlider) timelineSlider.value = '100';
  if (btnClearTimeline) btnClearTimeline.classList.add('hidden');
  if (readout) readout.textContent = 'Todas as Eras (3.800 Ma – Presente)';

  clearExtinctionHighlight();
  updatePersonalBadges();

  document.querySelectorAll('.era-tab-btn').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-era') === 'all');
  });

  loadCatalog();
  syncUrlParams(null);
  showToast('Filtros limpos.');
}

function updateStats(count) {
  const resultsStats = document.getElementById('resultsStats');
  if (!resultsStats) return;
  const habLabel =
    state.currentHabitat !== 'all'
      ? ` · Bioma ${HABITAT_META[state.currentHabitat]?.label || state.currentHabitat}`
      : '';
  resultsStats.innerHTML = `<strong class="tabular-num">${count}</strong> ${
    count === 1 ? 'espécime encontrado' : 'espécimes encontrados'
  }${escapeHtml(habLabel)}`;
}

// ============================================================================
// 1. SELO OFICIAL DA LISTA VERMELHA (IUCN)
// ============================================================================

const IUCN_META = {
  LC: 'Pouco Preocupante',
  NT: 'Quase Ameaçada',
  VU: 'Vulnerável',
  EN: 'Em Perigo',
  CR: 'Criticamente em Perigo',
  EW: 'Extinta na Natureza',
  EX: 'Extinta',
  DD: 'Dados Insuficientes',
};

function parseIucnStatus(spec) {
  if (!spec || !spec.is_contemporary) return null;
  const raw = String(spec.conservation_status || '');
  const parenMatch = raw.match(/\b(LC|NT|VU|EN|CR|EW|EX|DD)\b/);
  if (parenMatch) {
    const code = parenMatch[1];
    return { code, label: IUCN_META[code] || raw };
  }
  const norm = normalizeStr(raw);
  if (norm.includes('criticamente')) return { code: 'CR', label: IUCN_META.CR };
  if (norm.includes('em perigo')) return { code: 'EN', label: IUCN_META.EN };
  if (norm.includes('vulneravel')) return { code: 'VU', label: IUCN_META.VU };
  if (norm.includes('quase ameac')) return { code: 'NT', label: IUCN_META.NT };
  if (norm.includes('pouco preocupante')) return { code: 'LC', label: IUCN_META.LC };
  if (norm.includes('dados insuficientes')) return { code: 'DD', label: IUCN_META.DD };
  return null;
}

function renderIucnStatusHtml(spec) {
  const iucn = parseIucnStatus(spec);
  if (iucn) {
    return `<span class="iucn-badge" title="Categoria oficial da Lista Vermelha IUCN"><span class="iucn-code iucn-${iucn.code}">${iucn.code}</span><span>${escapeHtml(iucn.label)} (IUCN)</span></span>`;
  }
  const fallback = spec.conservation_status || (spec.is_contemporary ? 'Espécie Vivente' : 'Fóssil Extinto');
  return escapeHtml(fallback);
}

// ============================================================================
// 2. COMPARADOR VISUAL DE ESCALA EM SILHUETA (SVG)
// ============================================================================

function renderVisualScaleSvg(spec) {
  const stage = document.getElementById('visualScaleStage');
  if (!stage || !spec) return;

  const hab = resolveSpecimenHabitat(spec);
  const meta = HABITAT_META[hab] || HABITAT_META.all;
  const accent = meta.accentHex;
  const meters = parseMetricNumber(spec.length, 'length_m');

  if (!meters || !Number.isFinite(meters)) {
    stage.innerHTML = `<div class="visual-scale-caption-row"><span>Dimensão: ${escapeHtml(spec.length || 'Em estudo')}</span><span>Ref.: Humano 1,75 m</span></div>`;
    return;
  }

  // Modo Microscopia Óptica (< 5 mm)
  if (meters < 0.005 || spec.skeletal_type === 'microbiologico') {
    const microns = meters * 1e6;
    const hairMicrons = 70;
    const maxUm = Math.max(microns, hairMicrons, 10);
    const specBar = Math.max(12, Math.min(240, (microns / maxUm) * 240));
    const hairBar = Math.max(12, Math.min(240, (hairMicrons / maxUm) * 240));

    stage.innerHTML = `
      <svg class="visual-scale-svg" viewBox="0 0 320 92" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Comparação microscópica com fio de cabelo humano (70 micrômetros)">
        <line x1="16" y1="74" x2="304" y2="74" stroke="rgba(148,163,184,0.3)" stroke-width="1" />
        <text x="16" y="18" fill="#cbd5e1" font-size="10" font-weight="600">${escapeHtml(truncateText(spec.name, 26))} (${escapeHtml(formatLengthDisplay(meters, spec.length))})</text>
        <rect x="16" y="24" width="${specBar.toFixed(1)}" height="14" rx="7" fill="${accent}" fill-opacity="0.35" stroke="${accent}" stroke-width="1.5" />
        <text x="16" y="54" fill="#94a3b8" font-size="9.5">Fio de cabelo humano (70 µm)</text>
        <rect x="16" y="59" width="${hairBar.toFixed(1)}" height="9" rx="4.5" fill="#f8fafc" fill-opacity="0.35" stroke="#cbd5e1" stroke-width="1" />
      </svg>
      <div class="visual-scale-caption-row">
        <span>Escala microscópica</span>
        <span class="tabular-num">${escapeHtml(formatLengthDisplay(meters, spec.length))} vs. 70 µm</span>
      </div>
    `;
    return;
  }

  // Selecionar objeto de referência macroscópico: Humano (1,75m), Carro (4,5m) ou Ônibus Escolar (12m)
  let refLabel = 'Humano (1,75 m)';
  let refLength = 1.75;
  let refIconType = 'human';

  if (meters >= 14) {
    refLabel = 'Ônibus escolar (12 m)';
    refLength = 12;
    refIconType = 'bus';
  } else if (meters >= 5) {
    refLabel = 'Carro médio (4,5 m)';
    refLength = 4.5;
    refIconType = 'car';
  }

  const maxM = Math.max(meters, refLength, 2);
  const trackW = 268;
  const specW = Math.max(16, (meters / maxM) * trackW);
  const refW = Math.max(14, (refLength / maxM) * trackW);

  let refGlyph = '';
  if (refIconType === 'human') {
    refGlyph = `
      <g transform="translate(18, 48)">
        <circle cx="5" cy="4" r="3" fill="#e2e8f0" />
        <rect x="2.5" y="8" width="5" height="9" rx="2" fill="#e2e8f0" />
        <line x1="3.5" y1="17" x2="2.5" y2="24" stroke="#e2e8f0" stroke-width="1.8" stroke-linecap="round" />
        <line x1="6.5" y1="17" x2="7.5" y2="24" stroke="#e2e8f0" stroke-width="1.8" stroke-linecap="round" />
      </g>`;
  } else if (refIconType === 'car') {
    refGlyph = `
      <g transform="translate(16, 54)">
        <path d="M2 12 L4 6 L13 6 L16 12 Z" fill="#e2e8f0" />
        <rect x="0" y="11" width="22" height="5" rx="2" fill="#e2e8f0" />
        <circle cx="5" cy="17" r="2.2" fill="#94a3b8" />
        <circle cx="17" cy="17" r="2.2" fill="#94a3b8" />
      </g>`;
  } else {
    refGlyph = `
      <g transform="translate(16, 52)">
        <rect x="0" y="4" width="26" height="12" rx="2.5" fill="#fbbf24" fill-opacity="0.85" />
        <rect x="3" y="6.5" width="4" height="4" rx="0.8" fill="#0f172a" />
        <rect x="9" y="6.5" width="4" height="4" rx="0.8" fill="#0f172a" />
        <rect x="15" y="6.5" width="4" height="4" rx="0.8" fill="#0f172a" />
        <circle cx="6" cy="17.5" r="2.2" fill="#94a3b8" />
        <circle cx="20" cy="17.5" r="2.2" fill="#94a3b8" />
      </g>`;
  }

  const ratio = (meters / refLength).toFixed(1).replace('.', ',');

  stage.innerHTML = `
    <svg class="visual-scale-svg" viewBox="0 0 320 96" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Comparação proporcional de tamanho entre ${escapeHtml(spec.name)} e ${refLabel}">
      <line x1="16" y1="84" x2="304" y2="84" stroke="rgba(148,163,184,0.28)" stroke-width="1" />
      <text x="16" y="16" fill="#f8fafc" font-size="10.5" font-weight="700">${escapeHtml(truncateText(spec.name, 25))}</text>
      <text x="304" y="16" text-anchor="end" fill="${accent}" font-size="10" font-weight="700">${escapeHtml(formatLengthDisplay(meters, spec.length))}</text>
      <rect x="16" y="22" width="${specW.toFixed(1)}" height="16" rx="8" fill="${accent}" fill-opacity="0.32" stroke="${accent}" stroke-width="1.6" />
      <circle cx="${(16 + specW).toFixed(1)}" cy="30" r="3.5" fill="${accent}" />

      ${refGlyph}
      <text x="48" y="56" fill="#cbd5e1" font-size="9.5" font-weight="600">${refLabel}</text>
      <rect x="48" y="62" width="${Math.min(248, refW).toFixed(1)}" height="10" rx="5" fill="#e2e8f0" fill-opacity="0.3" stroke="#cbd5e1" stroke-width="1" />
    </svg>
    <div class="visual-scale-caption-row">
      <span>Proporção visual</span>
      <span class="tabular-num">≈ ${ratio}× ${escapeHtml(refLabel.split(' ')[0].toLowerCase())}</span>
    </div>
  `;
}

// ============================================================================
// 3. BIOACÚSTICA · SONS REAIS DA NATUREZA (WIKIMEDIA COMMONS)
// ============================================================================

function resetBioacousticsPlayer() {
  state.bioacousticsReqId += 1;
  const box = document.getElementById('bioacousticsBox');
  const audio = document.getElementById('bioacousticsAudio');
  if (audio) {
    try {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    } catch {}
  }
  if (box) box.classList.add('hidden');
}

async function loadSpecimenBioacoustics(spec) {
  resetBioacousticsPlayer();
  if (!spec || !spec.is_contemporary || !state.isBackendOnline) return;
  if (spec.skeletal_type === 'microbiologico') return;

  const reqId = state.bioacousticsReqId;
  const taxon = spec.scientific_name || spec.genus || spec.name;
  if (!taxon) return;

  try {
    const url = `${API_BASE}/api/bioacoustics/${encodeURIComponent(taxon)}?extra=${encodeURIComponent(spec.name || '')}`;
    const res = await fetch(url);
    if (!res.ok || reqId !== state.bioacousticsReqId) return;
    const data = await res.json();
    if (reqId !== state.bioacousticsReqId) return;

    const list = Array.isArray(data)
      ? data
      : Array.isArray(data.recordings)
      ? data.recordings
      : [];
    if (list.length === 0) return;

    const rec = list[0];
    const box = document.getElementById('bioacousticsBox');
    const titleEl = document.getElementById('bioacousticsTitle');
    const licEl = document.getElementById('bioacousticsLicense');
    const authorEl = document.getElementById('bioacousticsAuthor');
    const audioEl = document.getElementById('bioacousticsAudio');

    if (!box || !audioEl) return;
    if (titleEl) titleEl.textContent = truncateText(rec.title || `Vocalização de ${spec.name}`, 72);
    if (licEl) licEl.textContent = rec.license || 'CC / Wikimedia';
    if (authorEl) {
      const dur = rec.duration ? ` · ${Math.round(rec.duration)}s` : '';
      authorEl.textContent = `Registro: ${rec.author || 'Wikimedia Commons'}${dur}`;
    }

    audioEl.src = `${API_BASE}/api/proxy-audio?url=${encodeURIComponent(rec.url)}`;
    box.classList.remove('hidden');
  } catch {
    // Silencioso: apenas oculta o player se não houver gravação disponível
  }
}

// ============================================================================
// 4. CADERNO DE CAMPO & NOTAS POR ESPÉCIME
// ============================================================================

function getSpecimenNoteContent(specimenId) {
  const rec = state.fieldNotes[specimenId];
  if (!rec) return '';
  return typeof rec === 'string' ? rec : String(rec.content || '');
}

function updateNotesTabIndicator(specimenId) {
  const btn = document.getElementById('tabBtnNotes');
  if (!btn) return;
  const hasNote = getSpecimenNoteContent(specimenId).trim().length > 0;
  btn.innerHTML = hasNote
    ? 'Caderno de Campo <span class="tab-note-indicator">●</span>'
    : 'Caderno de Campo';
}

function syncFieldNoteEditor(spec) {
  if (!spec) return;
  const nameEl = document.getElementById('fieldNoteSpecimenName');
  const textarea = document.getElementById('fieldNoteTextarea');
  const counter = document.getElementById('fieldNoteCharCount');
  const syncHint = document.getElementById('fieldNotesSyncHint');

  const content = getSpecimenNoteContent(spec.id);
  if (nameEl) nameEl.textContent = spec.name;
  if (textarea) textarea.value = content;
  if (counter) counter.textContent = `${content.length} / 3000`;
  if (syncHint) {
    syncHint.textContent = state.currentUser
      ? `Sincronizado na conta ${state.currentUser.displayName}. Suas anotações também são incluídas nas exportações em JSON e CSV.`
      : 'Salvo localmente neste navegador (entre com Google para sincronizar na nuvem). Suas anotações são incluídas na exportação do dossiê.';
  }
  updateNotesTabIndicator(spec.id);
}

async function saveCurrentFieldNote() {
  const spec = state.selectedSpecimen;
  const textarea = document.getElementById('fieldNoteTextarea');
  if (!spec || !textarea) return;

  const content = textarea.value.trim().slice(0, 3000);

  if (content) {
    state.fieldNotes[spec.id] = {
      specimenId: spec.id,
      specimenName: spec.name,
      content,
      ownerId: state.currentUser ? state.currentUser.uid : 'local',
    };
  } else {
    delete state.fieldNotes[spec.id];
  }

  updateNotesTabIndicator(spec.id);

  if (state.currentUser && window.BioAtlasFirebase && typeof window.BioAtlasFirebase.saveFieldNote === 'function') {
    try {
      await window.BioAtlasFirebase.saveFieldNote(spec.id, spec.name, content);
      showToast(content ? `Anotação de "${spec.name}" salva na nuvem.` : 'Anotação removida.');
      return;
    } catch (err) {
      console.error('Erro ao salvar anotação no Firestore:', err);
    }
  }

  saveLocalPersonalData();
  showToast(content ? `Anotação de "${spec.name}" salva localmente.` : 'Anotação removida.');
}

async function clearCurrentFieldNote() {
  const spec = state.selectedSpecimen;
  const textarea = document.getElementById('fieldNoteTextarea');
  if (!spec || !textarea) return;

  textarea.value = '';
  const counter = document.getElementById('fieldNoteCharCount');
  if (counter) counter.textContent = '0 / 3000';

  delete state.fieldNotes[spec.id];
  updateNotesTabIndicator(spec.id);

  if (state.currentUser && window.BioAtlasFirebase && typeof window.BioAtlasFirebase.deleteFieldNote === 'function') {
    try {
      await window.BioAtlasFirebase.deleteFieldNote(spec.id);
    } catch (err) {
      console.warn('Erro ao limpar nota na nuvem:', err);
    }
  } else {
    saveLocalPersonalData();
  }
  showToast(`Nota de "${spec.name}" limpa.`);
}

// ============================================================================
// 5. EXPORTAÇÃO CIENTÍFICA & CITAÇÕES (PDF/IMPRESSÃO, ABNT, BIBTEX, JSON, CSV)
// ============================================================================

async function copyTextToClipboard(text, successMsg) {
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      showToast(successMsg);
      return true;
    }
  } catch {}
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(successMsg);
    return true;
  } catch {
    showToast('Não foi possível copiar automaticamente.');
    return false;
  }
}

function triggerTextDownload(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function buildSpecimenShareUrl(specId) {
  const u = new URL(window.location.href);
  u.searchParams.set('especime', specId);
  return u.toString();
}

function buildAbntCitation(spec) {
  const now = new Date();
  const months = ['jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];
  const accessDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  const sci = spec.scientific_name || spec.genus || spec.name;
  const link = buildSpecimenShareUrl(spec.id);
  return `BIOATLAS. ${spec.name} (${sci}): dossiê taxonômico, biométrico e georreferenciado. Base integrada GBIF, Paleobiology Database (PBDB) e Wikimedia Commons, ${now.getFullYear()}. Disponível em: <${link}>. Acesso em: ${accessDate}.`;
}

function buildBibtexCitation(spec) {
  const year = new Date().getFullYear();
  const key = `bioatlas_${String(spec.id || 'specimen').replace(/[^a-z0-9_]/gi, '_')}_${year}`;
  const sci = spec.scientific_name || spec.genus || spec.name;
  const link = buildSpecimenShareUrl(spec.id);
  return `@misc{${key},\n  author       = {{BioAtlas — Global Biodiversity \\& Paleontology Platform}},\n  title        = {${spec.name} (${sci}): Dossiê Biológico e Paleontológico},\n  year         = {${year}},\n  howpublished = {\\url{${link}}},\n  note         = {Fontes integradas: GBIF, PBDB e Wikimedia Commons}\n}`;
}

function specsToCsv(specs) {
  const headers = [
    'id',
    'nome',
    'nome_cientifico',
    'habitat',
    'era',
    'periodo',
    'grupo',
    'estrutura_esqueletica',
    'dieta',
    'comprimento',
    'altura',
    'massa',
    'velocidade',
    'status_conservacao_iucn',
    'localidades',
    'anotacao_caderno_de_campo',
  ];
  const escCsv = (val) => `"${String(val ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
  const rows = specs.map((s) =>
    [
      s.id,
      s.name,
      s.scientific_name || s.genus,
      (HABITAT_META[resolveSpecimenHabitat(s)] || HABITAT_META.terrestre).label,
      s.era_display,
      s.period,
      s.group_display,
      s.skeletal_composition || s.skeletal_type,
      s.diet_display,
      s.length,
      s.height,
      s.weight,
      s.speed,
      s.conservation_status,
      s.fossil_locations,
      getSpecimenNoteContent(s.id),
    ]
      .map(escCsv)
      .join(',')
  );
  return `\uFEFF${headers.join(',')}\n${rows.join('\n')}`;
}

function openExportModalForSpecimen(spec) {
  const modal = document.getElementById('exportModal');
  const body = document.getElementById('exportModalBody');
  const titleEl = document.getElementById('exportModalTitle');
  if (!modal || !body || !spec) return;

  state.exportContext = { type: 'specimen', specimen: spec };
  if (titleEl) titleEl.textContent = `Exportar: ${spec.name}`;

  const abnt = buildAbntCitation(spec);
  const bibtex = buildBibtexCitation(spec);
  const queryTaxon = encodeURIComponent(spec.scientific_name || spec.genus || spec.name);
  const gbifUrl = `https://www.gbif.org/species/search?q=${queryTaxon}`;
  const pbdbUrl = `https://paleobiodb.org/classic/basicTaxonInfo?taxon_name=${queryTaxon}`;
  const wikiUrl = `https://pt.wikipedia.org/wiki/Special:Search?search=${queryTaxon}`;

  body.innerHTML = `
    <div class="export-actions-grid">
      <button type="button" class="export-action-card" id="btnExportPrintPdf">
        <strong>Imprimir / Salvar PDF</strong>
        <small>Layout editorial limpo do dossiê</small>
      </button>
      <button type="button" class="export-action-card" id="btnExportDownloadJson">
        <strong>Baixar JSON</strong>
        <small>Dados estruturados + nota de campo</small>
      </button>
      <button type="button" class="export-action-card" id="btnExportDownloadCsv">
        <strong>Baixar CSV (Excel)</strong>
        <small>Planilha biométrica e taxonômica</small>
      </button>
      <button type="button" class="export-action-card" id="btnExportCopyLink">
        <strong>Copiar Link Direto</strong>
        <small>Compartilhe esta ficha exata</small>
      </button>
    </div>

    <div class="citation-section">
      <div class="citation-section-header">
        <strong>Referência ABNT</strong>
        <button type="button" class="btn-outline-sm" id="btnCopyAbnt">Copiar ABNT</button>
      </div>
      <div class="citation-code-box">${escapeHtml(abnt)}</div>
    </div>

    <div class="citation-section">
      <div class="citation-section-header">
        <strong>Citação BibTeX (LaTeX)</strong>
        <button type="button" class="btn-outline-sm" id="btnCopyBibtex">Copiar BibTeX</button>
      </div>
      <div class="citation-code-box">${escapeHtml(bibtex)}</div>
    </div>

    <div class="export-links-row">
      <a href="${gbifUrl}" target="_blank" rel="noopener noreferrer" class="btn-outline-sm">Abrir no GBIF ↗</a>
      <a href="${pbdbUrl}" target="_blank" rel="noopener noreferrer" class="btn-outline-sm">Abrir no PBDB ↗</a>
      <a href="${wikiUrl}" target="_blank" rel="noopener noreferrer" class="btn-outline-sm">Wikipédia ↗</a>
    </div>
  `;

  body.querySelector('#btnExportPrintPdf').addEventListener('click', () => {
    closeExportModal();
    setTimeout(() => window.print(), 120);
  });
  body.querySelector('#btnExportDownloadJson').addEventListener('click', () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      source: 'BioAtlas',
      specimen: spec,
      fieldNote: getSpecimenNoteContent(spec.id) || null,
    };
    triggerTextDownload(`bioatlas-${spec.id}.json`, JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
    showToast(`JSON de "${spec.name}" baixado.`);
  });
  body.querySelector('#btnExportDownloadCsv').addEventListener('click', () => {
    triggerTextDownload(`bioatlas-${spec.id}.csv`, specsToCsv([spec]), 'text/csv;charset=utf-8');
    showToast(`Planilha CSV de "${spec.name}" baixada.`);
  });
  body.querySelector('#btnExportCopyLink').addEventListener('click', () => copyShareableSpecimenLink(spec));
  body.querySelector('#btnCopyAbnt').addEventListener('click', () => copyTextToClipboard(abnt, 'Referência ABNT copiada!'));
  body.querySelector('#btnCopyBibtex').addEventListener('click', () => copyTextToClipboard(bibtex, 'Entrada BibTeX copiada!'));

  modal.classList.remove('hidden');
}

function openExportModalForCollection(col) {
  const modal = document.getElementById('exportModal');
  const body = document.getElementById('exportModalBody');
  const titleEl = document.getElementById('exportModalTitle');
  if (!modal || !body || !col) return;

  const ids = Array.isArray(col.specimenIds) ? col.specimenIds : [];
  const specs = ids.map(findSpecimenById).filter(Boolean);
  if (specs.length === 0) {
    showToast('Esta coleção ainda não possui espécimes para exportar.');
    return;
  }

  state.exportContext = { type: 'collection', collection: col, specs };
  if (titleEl) titleEl.textContent = `Exportar Coleção: ${col.name}`;

  const abntList = specs.map((s) => buildAbntCitation(s)).join('\n\n');
  const bibtexList = specs.map((s) => buildBibtexCitation(s)).join('\n\n');
  const safeSlug = normalizeStr(col.name).replace(/[^a-z0-9]+/g, '-') || 'colecao';

  body.innerHTML = `
    <div class="export-actions-grid">
      <button type="button" class="export-action-card" id="btnExportColJson">
        <strong>Baixar Coleção JSON</strong>
        <small>${specs.length} espécime(s) + notas de campo</small>
      </button>
      <button type="button" class="export-action-card" id="btnExportColCsv">
        <strong>Baixar Planilha CSV</strong>
        <small>Ideal para Excel, R e aulas</small>
      </button>
    </div>

    <div class="citation-section">
      <div class="citation-section-header">
        <strong>Referências ABNT da Coleção (${specs.length})</strong>
        <button type="button" class="btn-outline-sm" id="btnCopyColAbnt">Copiar todas</button>
      </div>
      <div class="citation-code-box">${escapeHtml(abntList)}</div>
    </div>

    <div class="citation-section">
      <div class="citation-section-header">
        <strong>BibTeX da Coleção</strong>
        <button type="button" class="btn-outline-sm" id="btnCopyColBibtex">Copiar BibTeX</button>
      </div>
      <div class="citation-code-box">${escapeHtml(bibtexList)}</div>
    </div>
  `;

  body.querySelector('#btnExportColJson').addEventListener('click', () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      collection: { name: col.name, description: col.description || '' },
      count: specs.length,
      specimens: specs.map((s) => ({ ...s, fieldNote: getSpecimenNoteContent(s.id) || null })),
    };
    triggerTextDownload(`bioatlas-colecao-${safeSlug}.json`, JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
    showToast(`JSON da coleção "${col.name}" baixado.`);
  });
  body.querySelector('#btnExportColCsv').addEventListener('click', () => {
    triggerTextDownload(`bioatlas-colecao-${safeSlug}.csv`, specsToCsv(specs), 'text/csv;charset=utf-8');
    showToast(`CSV da coleção "${col.name}" baixado.`);
  });
  body.querySelector('#btnCopyColAbnt').addEventListener('click', () => copyTextToClipboard(abntList, 'Referências ABNT da coleção copiadas!'));
  body.querySelector('#btnCopyColBibtex').addEventListener('click', () => copyTextToClipboard(bibtexList, 'BibTeX da coleção copiado!'));

  modal.classList.remove('hidden');
}

function closeExportModal() {
  const modal = document.getElementById('exportModal');
  if (modal) modal.classList.add('hidden');
}

// ============================================================================
// 6. ÁRVORE DA VIDA INTERATIVA (FILOGENIA PANORÂMICA)
// ============================================================================

const TREE_BRANCHES = [
  {
    id: 'dinosauria-aves',
    title: 'Chordata → Archosauria & Dinosauria',
    subtitle: 'Dinossauros, pterossauros e aves',
    defaultOpen: true,
  },
  {
    id: 'mammalia-synapsida',
    title: 'Chordata → Synapsida & Mammalia',
    subtitle: 'Mamíferos atuais, baleias, felinos e megafauna pré-histórica',
    defaultOpen: true,
  },
  {
    id: 'aquatic-vertebrates',
    title: 'Chordata → Peixes, Répteis Marinhos & Anfíbios',
    subtitle: 'Tubarões, placodermos, mosassauros e transição água-terra',
    defaultOpen: false,
  },
  {
    id: 'invertebrata',
    title: 'Metazoa → Arthropoda, Mollusca & Invertebrados',
    subtitle: 'Cefalópodes, artrópodes cambrianos e linhagens sem coluna vertebral',
    defaultOpen: false,
  },
  {
    id: 'ediacara',
    title: 'Metazoa Basal → Biota Ediacarana (Pré-Cambriano)',
    subtitle: 'Os primeiros organismos macroscópicos complexos da Terra',
    defaultOpen: false,
  },
  {
    id: 'microbiology',
    title: 'Domínios Microscópicos & Vírus',
    subtitle: 'Tardígrados, protistas, cianobactérias, arqueias e vírus gigantes',
    defaultOpen: false,
  },
];

function classifyEvolutionaryBranch(spec) {
  if (spec.skeletal_type === 'microbiologico' || ['micro-animal', 'protozoario-protista', 'bacteria-cianobacteria', 'virus-gigante'].includes(spec.group)) {
    return 'microbiology';
  }
  if (spec.group === 'ediacarano' || spec.era === 'precambriano') {
    return 'ediacara';
  }
  if (spec.skeletal_type === 'invertebrado' || spec.group === 'artropode-invertebrado') {
    return 'invertebrata';
  }
  const cladeStr = normalizeStr((spec.expert?.cladogram || []).join(' ') + ' ' + (spec.group || '') + ' ' + (spec.group_display || ''));
  if (spec.group === 'dinossauro' || spec.group === 'pterossauro' || /dinosauria|pterosauria|aves|theropoda|sauropoda/.test(cladeStr)) {
    return 'dinosauria-aves';
  }
  if (spec.group === 'mamifero-megafauna' || spec.group === 'sinapsideo' || /mammalia|synapsida|cetacea|carnivora|proboscidea/.test(cladeStr)) {
    return 'mammalia-synapsida';
  }
  return 'aquatic-vertebrates';
}

function getSpecimenSubcladeLabel(spec) {
  const clad = Array.isArray(spec.expert?.cladogram) ? spec.expert.cladogram : [];
  if (clad.length >= 3) {
    return clad[Math.min(clad.length - 2, 3)];
  }
  return spec.group_display || spec.era_display || 'Linhagem Catalogada';
}

function renderTreeOfLife() {
  const container = document.getElementById('treeOfLifeContainer');
  if (!container) return;

  const catalog = state.allCatalog || [];
  if (catalog.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:0.88rem;">Carregando ramos evolutivos...</p>';
    return;
  }

  const buckets = {};
  TREE_BRANCHES.forEach((b) => {
    buckets[b.id] = [];
  });
  catalog.forEach((spec) => {
    const bId = classifyEvolutionaryBranch(spec);
    if (buckets[bId]) buckets[bId].push(spec);
  });

  container.innerHTML = '';
  const frag = document.createDocumentFragment();

  TREE_BRANCHES.forEach((branch) => {
    const items = buckets[branch.id] || [];
    if (items.length === 0) return;

    const details = document.createElement('details');
    details.className = 'tree-branch';
    if (branch.defaultOpen) details.open = true;

    const summary = document.createElement('summary');
    summary.className = 'tree-branch-summary';
    summary.innerHTML = `
      <span class="tree-branch-left">
        <span class="tree-branch-caret" aria-hidden="true">▸</span>
        <span>
          <span class="tree-branch-title">${escapeHtml(branch.title)}</span><br>
          <span class="tree-branch-sub">${escapeHtml(branch.subtitle)}</span>
        </span>
      </span>
      <span class="tree-branch-count tabular-num">${items.length} ${items.length === 1 ? 'espécie' : 'espécies'}</span>
    `;
    details.appendChild(summary);

    // Subagrupamento por subclado
    const subMap = new Map();
    items.forEach((spec) => {
      const subKey = getSpecimenSubcladeLabel(spec);
      if (!subMap.has(subKey)) subMap.set(subKey, []);
      subMap.get(subKey).push(spec);
    });

    const body = document.createElement('div');
    body.className = 'tree-branch-body';

    subMap.forEach((subItems, subLabel) => {
      const subWrap = document.createElement('div');
      const labelEl = document.createElement('div');
      labelEl.className = 'tree-subclade-label';
      labelEl.textContent = `↳ ${subLabel}`;
      subWrap.appendChild(labelEl);

      const grid = document.createElement('div');
      grid.className = 'tree-leaf-grid';

      subItems.forEach((spec) => {
        const hab = resolveSpecimenHabitat(spec);
        const habMeta = HABITAT_META[hab] || HABITAT_META.terrestre;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tree-leaf-btn';
        btn.setAttribute('data-habitat', hab);
        btn.innerHTML = `
          <img class="tree-leaf-thumb" src="${escapeHtml(resolveDisplayImageUrl(spec.image_url, hab))}" alt="${escapeHtml(spec.name)}" loading="lazy" decoding="async" />
          <span class="tree-leaf-texts">
            <span class="tree-leaf-name">${escapeHtml(spec.name)}</span>
            <span class="tree-leaf-meta">${escapeHtml(habMeta.shortLabel)} · ${escapeHtml(spec.period || spec.era_display)}</span>
          </span>
        `;
        const img = btn.querySelector('img');
        img.addEventListener('error', () => handleImageFallback(img, spec.image_url, hab));
        btn.addEventListener('click', () => openWikiModal(spec.id, 'tab-overview'));
        grid.appendChild(btn);
      });

      subWrap.appendChild(grid);
      body.appendChild(subWrap);
    });

    details.appendChild(body);
    frag.appendChild(details);
  });

  container.appendChild(frag);
}

// ============================================================================
// 7. MODO QUIZ · DESAFIO DO EXPLORADOR (5 PERGUNTAS + CONQUISTAS)
// ============================================================================

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ============================================================================
// 7. CAMPANHA PROGRESSIVA DO QUIZ · 50 NÍVEIS, 4 DIFICULDADES & 10 RANKINGS
// ============================================================================

const QUIZ_MAX_LEVEL = 50;

const QUIZ_DIFFICULTIES = {
  facil: {
    key: 'facil',
    shortKey: 'f',
    label: 'Fácil',
    role: 'Explorador Curioso',
    minQuestions: 5,
    maxQuestions: 15,
    passPct: 60,
    showHints: true,
    accent: '#22c55e',
    desc: '5 a 15 perguntas · Pistas ativas · Meta ≥ 60%',
  },
  medio: {
    key: 'medio',
    shortKey: 'm',
    label: 'Médio',
    role: 'Naturalista de Campo',
    minQuestions: 6,
    maxQuestions: 20,
    passPct: 70,
    showHints: true,
    accent: '#38bdf8',
    desc: '6 a 20 perguntas · Fósseis e IUCN · Meta ≥ 70%',
  },
  dificil: {
    key: 'dificil',
    shortKey: 'd',
    label: 'Difícil',
    role: 'Biólogo Pesquisador',
    minQuestions: 8,
    maxQuestions: 25,
    passPct: 75,
    showHints: false,
    accent: '#f59e0b',
    desc: '8 a 25 perguntas · Taxonomia e escala · Meta ≥ 75%',
  },
  especialista: {
    key: 'especialista',
    shortKey: 'e',
    label: 'Especialista',
    role: 'Mestre Taxonomista',
    minQuestions: 10,
    maxQuestions: 30,
    passPct: 80,
    showHints: false,
    accent: '#ec4899',
    desc: '10 a 30 perguntas · Sem pistas · Meta ≥ 80%',
  },
};

const QUIZ_DIFFICULTY_ORDER = ['facil', 'medio', 'dificil', 'especialista'];

const QUIZ_RANKING_TIERS = [
  { rank: 1, roman: 'I', startLevel: 1, endLevel: 5, focus: 'Biomas, dietas e fauna essencial' },
  { rank: 2, roman: 'II', startLevel: 6, endLevel: 10, focus: 'Ecossistemas aquáticos, aéreos e terrestres' },
  { rank: 3, roman: 'III', startLevel: 11, endLevel: 15, focus: 'Identificação visual multiperspectiva' },
  { rank: 4, roman: 'IV', startLevel: 16, endLevel: 20, focus: 'Conservação IUCN e cadeias tróficas' },
  { rank: 5, roman: 'V', startLevel: 21, endLevel: 25, focus: 'Esqueletos, crânios e registro fóssil' },
  { rank: 6, roman: 'VI', startLevel: 26, endLevel: 30, focus: 'Cronologia geológica do Pré-Cambriano ao Holoceno' },
  { rank: 7, roman: 'VII', startLevel: 31, endLevel: 35, focus: 'Anatomia comparada, biometria e esqueletos' },
  { rank: 8, roman: 'VIII', startLevel: 36, endLevel: 40, focus: 'Nomenclatura binomial e cladística evolutiva' },
  { rank: 9, roman: 'IX', startLevel: 41, endLevel: 45, focus: 'Formações geológicas, escala e filogenia avançada' },
  { rank: 10, roman: 'X', startLevel: 46, endLevel: 50, focus: 'Exame Supremo da Biodiversidade e Paleontologia' },
];

const QUIZ_RANK_TITLES_BY_DIFFICULTY = {
  facil: [
    'Broto Curioso',
    'Olhar da Floresta',
    'Amigo da Fauna',
    'Desbravador de Trilhas',
    'Viajante dos Mares',
    'Explorador dos Céus',
    'Caçador de Pegadas',
    'Guardião da Selva',
    'Embaixador da Vida',
    'Herói da Biodiversidade',
  ],
  medio: [
    'Cadete de Expedição',
    'Cartógrafo de Biomas',
    'Rastreador de Campo',
    'Sentinela Ecológico',
    'Escavador de Fósseis',
    'Cronista das Eras',
    'Conservacionista Sênior',
    'Capitão de Expedição',
    'Naturalista Consagrado',
    'Pioneiro do BioAtlas',
  ],
  dificil: [
    'Bolsista de Pesquisa',
    'Analista de Acervo',
    'Especialista em Osteologia',
    'Biólogo Evolutivo',
    'Paleontólogo de Campo',
    'Estratígrafo das Eras',
    'Curador de Museu',
    'Taxonomista Titular',
    'Diretor de Paleobiologia',
    'Catedrático da Evolução',
  ],
  especialista: [
    'Iniciado em Sistemática',
    'Decifrador de Clados',
    'Mestre Osteólogo',
    'Arquiteto Filogenético',
    'Oráculo do Registro Fóssil',
    'Soberano das Eras Geológicas',
    'Grão-Curador Mundial',
    'Sumo Taxonomista',
    'Guardião da Árvore da Vida',
    'Lenda Suprema do BioAtlas',
  ],
};

const QUIZ_RANKINGS_BY_DIFFICULTY = Object.fromEntries(
  QUIZ_DIFFICULTY_ORDER.map((diffKey) => {
    const diffLabel = QUIZ_DIFFICULTIES[diffKey].label;
    const titles = QUIZ_RANK_TITLES_BY_DIFFICULTY[diffKey];
    const list = QUIZ_RANKING_TIERS.map((tier, idx) => {
      const title = titles[idx];
      return {
        ...tier,
        difficultyKey: diffKey,
        difficultyLabel: diffLabel,
        title,
        achievementId: `Ranking ${tier.roman} (${diffLabel}) · ${title}`,
        requirementText: `Conclua o Nível ${tier.endLevel} na dificuldade ${diffLabel}`,
      };
    });
    return [diffKey, list];
  })
);

const QUIZ_ALL_RANKING_ACHIEVEMENTS = QUIZ_DIFFICULTY_ORDER.flatMap(
  (diffKey) => QUIZ_RANKINGS_BY_DIFFICULTY[diffKey]
);

const QUIZ_SPECIAL_ACHIEVEMENTS = [
  {
    id: 'Primeiro Passo (Nível 1)',
    emblem: '01',
    desc: 'Concluiu o primeiro nível da trilha progressiva.',
  },
  {
    id: 'Precisão Absoluta 100%',
    emblem: '3★',
    desc: 'Gabaritou um nível inteiro com 100% de acertos.',
  },
  {
    id: 'Guardião dos Oceanos',
    emblem: 'OC',
    desc: 'Acertou 3 ou mais questões de espécies aquáticas em um nível.',
  },
  {
    id: 'Mestre da Pré-História',
    emblem: 'FS',
    desc: 'Acertou 3 ou mais questões de fósseis ou esqueletos em um nível.',
  },
  {
    id: 'Desafiante Difícil',
    emblem: 'DF',
    desc: 'Concluiu pelo menos 5 níveis na dificuldade Difícil.',
  },
  {
    id: 'Grão-Mestre Especialista',
    emblem: '50',
    desc: 'Completou o Nível 50 na dificuldade Especialista.',
  },
];

const QUIZ_TOTAL_ACHIEVEMENTS = QUIZ_ALL_RANKING_ACHIEVEMENTS.length + QUIZ_SPECIAL_ACHIEVEMENTS.length;

function createDefaultQuizStats() {
  return {
    totalRounds: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    bestScore: 0,
    badges: [],
    selectedDifficulty: 'facil',
    unlockedLevels: { facil: 1, medio: 1, dificil: 1, especialista: 1 },
    completedLevels: { facil: 0, medio: 0, dificil: 0, especialista: 0 },
    levelStars: {},
  };
}

function normalizeQuizStats(raw) {
  const base = createDefaultQuizStats();
  if (!raw || typeof raw !== 'object') return base;

  const clampInt = (v, min, max, fallback) => {
    const n = Math.floor(Number(v));
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
  };

  let parsedStars = {};
  if (typeof raw.levelStars === 'string') {
    try {
      const obj = JSON.parse(raw.levelStars);
      if (obj && typeof obj === 'object') parsedStars = obj;
    } catch {
      parsedStars = {};
    }
  } else if (raw.levelStars && typeof raw.levelStars === 'object') {
    parsedStars = raw.levelStars;
  }

  const unlocked = {};
  const completed = {};
  QUIZ_DIFFICULTY_ORDER.forEach((d) => {
    const comp = clampInt(raw.completedLevels?.[d], 0, QUIZ_MAX_LEVEL, 0);
    const unl = clampInt(raw.unlockedLevels?.[d], 1, QUIZ_MAX_LEVEL, 1);
    completed[d] = comp;
    unlocked[d] = Math.min(QUIZ_MAX_LEVEL, Math.max(1, unl, comp + 1));
  });

  const isDiffUnlockedInMap = (diffKey) => {
    const idx = QUIZ_DIFFICULTY_ORDER.indexOf(diffKey);
    if (idx <= 0) return true;
    const prevKey = QUIZ_DIFFICULTY_ORDER[idx - 1];
    return completed[prevKey] >= QUIZ_MAX_LEVEL;
  };

  let selDiff = QUIZ_DIFFICULTIES[raw.selectedDifficulty] ? raw.selectedDifficulty : 'facil';
  if (!isDiffUnlockedInMap(selDiff)) {
    selDiff = 'facil';
  }
  let bestPct = clampInt(raw.bestScore, 0, 100, 0);
  // Migrar pontuações antigas (0..5) para percentual caso seja dado legado
  if (bestPct > 0 && bestPct <= 5 && Number(raw.totalQuestions || 0) <= 50 && !raw.unlockedLevels) {
    bestPct = Math.round((bestPct / 5) * 100);
  }

  return {
    totalRounds: clampInt(raw.totalRounds, 0, 100000, 0),
    totalCorrect: clampInt(raw.totalCorrect, 0, 500000, 0),
    totalQuestions: clampInt(raw.totalQuestions, 0, 500000, 0),
    bestScore: bestPct,
    badges: Array.isArray(raw.badges) ? Array.from(new Set(raw.badges.filter(Boolean))).slice(0, 60) : [],
    selectedDifficulty: selDiff,
    unlockedLevels: unlocked,
    completedLevels: completed,
    levelStars: parsedStars,
  };
}

function getPreviousDifficulty(diffKey) {
  const idx = QUIZ_DIFFICULTY_ORDER.indexOf(diffKey);
  if (idx <= 0) return null;
  return QUIZ_DIFFICULTIES[QUIZ_DIFFICULTY_ORDER[idx - 1]] || null;
}

function getNextDifficulty(diffKey) {
  const idx = QUIZ_DIFFICULTY_ORDER.indexOf(diffKey);
  if (idx < 0 || idx >= QUIZ_DIFFICULTY_ORDER.length - 1) return null;
  return QUIZ_DIFFICULTIES[QUIZ_DIFFICULTY_ORDER[idx + 1]] || null;
}

function isDifficultyUnlocked(diffKey) {
  const prev = getPreviousDifficulty(diffKey);
  if (!prev) return true;
  return getCompletedLevelForDiff(prev.key) >= QUIZ_MAX_LEVEL;
}

function getActivePlayableDifficulty() {
  const sel = state.quizStats?.selectedDifficulty || 'facil';
  if (QUIZ_DIFFICULTIES[sel] && isDifficultyUnlocked(sel)) return sel;
  return 'facil';
}

function getLevelQuestionCount(difficultyKey, level) {
  const cfg = QUIZ_DIFFICULTIES[difficultyKey] || QUIZ_DIFFICULTIES.facil;
  const clamped = Math.max(1, Math.min(QUIZ_MAX_LEVEL, Math.floor(Number(level) || 1)));
  return Math.round(cfg.minQuestions + ((clamped - 1) / (QUIZ_MAX_LEVEL - 1)) * (cfg.maxQuestions - cfg.minQuestions));
}

function getRankingsForDifficulty(difficultyKey) {
  return QUIZ_RANKINGS_BY_DIFFICULTY[difficultyKey] || QUIZ_RANKINGS_BY_DIFFICULTY.facil;
}

function getRankingForLevel(level, difficultyKey) {
  const diff = QUIZ_DIFFICULTIES[difficultyKey] ? difficultyKey : getActivePlayableDifficulty();
  const list = getRankingsForDifficulty(diff);
  const clamped = Math.max(1, Math.min(QUIZ_MAX_LEVEL, Math.floor(Number(level) || 1)));
  return list.find((r) => clamped >= r.startLevel && clamped <= r.endLevel) || list[0];
}

function getUnlockedLevelForDiff(diffKey) {
  if (!isDifficultyUnlocked(diffKey)) return 0;
  const st = state.quizStats;
  const u = st?.unlockedLevels?.[diffKey];
  return Math.max(1, Math.min(QUIZ_MAX_LEVEL, Number(u) || 1));
}

function getCompletedLevelForDiff(diffKey) {
  const st = state.quizStats;
  const c = st?.completedLevels?.[diffKey];
  return Math.max(0, Math.min(QUIZ_MAX_LEVEL, Number(c) || 0));
}

function getHighestCompletedLevelOverall() {
  return Math.max(...QUIZ_DIFFICULTY_ORDER.map((d) => getCompletedLevelForDiff(d)), 0);
}

function getCurrentPlayerRanking(diffKey) {
  const activeDiff = QUIZ_DIFFICULTIES[diffKey] ? diffKey : getActivePlayableDifficulty();
  const doneInDiff = getCompletedLevelForDiff(activeDiff);
  const targetLevel = Math.min(QUIZ_MAX_LEVEL, Math.max(1, doneInDiff + (doneInDiff < QUIZ_MAX_LEVEL ? 1 : 0)));
  return getRankingForLevel(targetLevel, activeDiff);
}

function getStarsForLevel(diffKey, level) {
  const cfg = QUIZ_DIFFICULTIES[diffKey] || QUIZ_DIFFICULTIES.facil;
  const bucket = state.quizStats.levelStars?.[cfg.shortKey];
  if (!bucket || typeof bucket !== 'object') return 0;
  return Math.max(0, Math.min(3, Number(bucket[String(level)]) || 0));
}

function setStarsForLevel(diffKey, level, stars) {
  const cfg = QUIZ_DIFFICULTIES[diffKey] || QUIZ_DIFFICULTIES.facil;
  if (!state.quizStats.levelStars || typeof state.quizStats.levelStars !== 'object') {
    state.quizStats.levelStars = {};
  }
  if (!state.quizStats.levelStars[cfg.shortKey] || typeof state.quizStats.levelStars[cfg.shortKey] !== 'object') {
    state.quizStats.levelStars[cfg.shortKey] = {};
  }
  const prev = Number(state.quizStats.levelStars[cfg.shortKey][String(level)]) || 0;
  state.quizStats.levelStars[cfg.shortKey][String(level)] = Math.max(prev, stars);
}

function countCampaignAchievementsUnlocked() {
  const badgeSet = new Set(state.quizStats.badges || []);
  let count = 0;
  QUIZ_DIFFICULTY_ORDER.forEach((d) => {
    const done = getCompletedLevelForDiff(d);
    getRankingsForDifficulty(d).forEach((rk) => {
      if (badgeSet.has(rk.achievementId) || done >= rk.endLevel) count += 1;
    });
  });
  QUIZ_SPECIAL_ACHIEVEMENTS.forEach((a) => {
    if (badgeSet.has(a.id)) count += 1;
  });
  return count;
}

function updateQuizFooterStats() {
  const footer = document.getElementById('quizStatsFooterText');
  const actionBtn = document.getElementById('btnRestartQuiz');
  const diff = getActivePlayableDifficulty();
  const cfg = QUIZ_DIFFICULTIES[diff] || QUIZ_DIFFICULTIES.facil;
  const done = getCompletedLevelForDiff(diff);
  const rank = getCurrentPlayerRanking(diff);
  const achCount = countCampaignAchievementsUnlocked();

  if (footer) {
    footer.textContent = `${cfg.label}: ${done}/${QUIZ_MAX_LEVEL} níveis · ${rank.title} · Conquistas: ${achCount}/${QUIZ_TOTAL_ACHIEVEMENTS}`;
  }
  if (actionBtn) {
    if (state.quizView === 'playing' || state.quizView === 'summary' || state.quizView === 'achievements') {
      actionBtn.textContent = 'Mapa de Níveis';
    } else {
      const nextLvl = getUnlockedLevelForDiff(diff);
      actionBtn.textContent = `Jogar Nível ${nextLvl}`;
    }
  }
}

function persistQuizStats() {
  saveLocalPersonalData();
  if (state.currentUser && window.BioAtlasFirebase && typeof window.BioAtlasFirebase.saveQuizStats === 'function') {
    window.BioAtlasFirebase.saveQuizStats({
      ...state.quizStats,
      levelStars: JSON.stringify(state.quizStats.levelStars || {}),
    }).catch((err) => {
      console.warn('Falha ao salvar progresso do Quiz na nuvem:', err);
    });
  }
}

function openQuizModal() {
  const modal = document.getElementById('quizModal');
  if (!modal) return;
  if ((state.allCatalog || []).length < 4) {
    showToast('Aguarde o catálogo carregar para iniciar o Desafio do Explorador.');
    return;
  }
  state.quizStats = normalizeQuizStats(state.quizStats);
  state.quizView = 'map';
  state.quizAchievementsDiff = null;
  state.quizSession = null;
  renderQuizModalView();
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeQuizModal() {
  const modal = document.getElementById('quizModal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
  setMobileActiveTab(state.favoritesOnly ? 'favorites' : 'explore');
}

function renderQuizModalView() {
  const kicker = document.getElementById('quizModalKicker');
  const title = document.getElementById('quizModalTitle');
  if (state.quizView === 'playing' && state.quizSession) {
    const cfg = QUIZ_DIFFICULTIES[state.quizSession.difficultyKey] || QUIZ_DIFFICULTIES.facil;
    const rank = getRankingForLevel(state.quizSession.level, cfg.key);
    if (kicker) kicker.textContent = `Ranking ${rank.roman} · ${rank.title} · Dificuldade ${cfg.label}`;
    if (title) title.textContent = `Nível ${state.quizSession.level} de ${QUIZ_MAX_LEVEL}`;
    renderQuizStep();
  } else if (state.quizView === 'summary' && state.quizSession) {
    const cfg = QUIZ_DIFFICULTIES[state.quizSession.difficultyKey] || QUIZ_DIFFICULTIES.facil;
    const rank = getRankingForLevel(state.quizSession.level, cfg.key);
    if (kicker) kicker.textContent = `Relatório da Fase · ${cfg.label} · ${rank.title}`;
    if (title) title.textContent = `Nível ${state.quizSession.level} Concluído`;
    renderQuizSummary();
  } else if (state.quizView === 'achievements') {
    if (kicker) kicker.textContent = 'Sala de Troféus · 40 Rankings Exclusivos + 6 Maestrias';
    if (title) title.textContent = 'Rankings & Conquistas';
    renderQuizAchievementsView();
  } else {
    if (kicker) kicker.textContent = 'Campanha Progressiva · 50 Níveis & 10 Rankings por Dificuldade';
    if (title) title.textContent = 'Desafio do Explorador';
    renderQuizHub();
  }
  updateQuizFooterStats();
}

function buildQuizHubTopHtml(activeTab) {
  const activeDiff = getActivePlayableDifficulty();
  const cfg = QUIZ_DIFFICULTIES[activeDiff] || QUIZ_DIFFICULTIES.facil;
  const rank = getCurrentPlayerRanking(activeDiff);
  const doneInDiff = getCompletedLevelForDiff(activeDiff);
  const achCount = countCampaignAchievementsUnlocked();
  return `
    <div class="quiz-hub-top">
      <div class="quiz-hub-view-tabs" role="tablist" aria-label="Seções do Quiz">
        <button type="button" class="quiz-view-tab ${activeTab === 'map' ? 'active' : ''}" data-quiz-tab="map" role="tab" aria-selected="${activeTab === 'map'}">
          Trilha de 50 Níveis
        </button>
        <button type="button" class="quiz-view-tab ${activeTab === 'achievements' ? 'active' : ''}" data-quiz-tab="achievements" role="tab" aria-selected="${activeTab === 'achievements'}">
          Rankings &amp; Conquistas (${achCount}/${QUIZ_TOTAL_ACHIEVEMENTS})
        </button>
      </div>
      <div class="quiz-rank-summary-line tabular-num">
        <strong>Ranking ${rank.roman} · ${escapeHtml(rank.title)}</strong>
        <span aria-hidden="true">·</span>
        <span>${escapeHtml(cfg.label)}: ${doneInDiff}/${QUIZ_MAX_LEVEL}</span>
        <span aria-hidden="true">·</span>
        <span>Rodadas: ${state.quizStats.totalRounds}</span>
      </div>
    </div>
  `;
}

function bindQuizHubTabListeners(body) {
  body.querySelectorAll('[data-quiz-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-quiz-tab');
      state.quizView = targetTab === 'achievements' ? 'achievements' : 'map';
      renderQuizModalView();
    });
  });
}

function renderQuizHub() {
  const body = document.getElementById('quizModalBody');
  if (!body) return;

  const activeDiff = getActivePlayableDifficulty();
  state.quizStats.selectedDifficulty = activeDiff;
  const cfg = QUIZ_DIFFICULTIES[activeDiff] || QUIZ_DIFFICULTIES.facil;
  const rankingsList = getRankingsForDifficulty(activeDiff);
  const unlockedMax = getUnlockedLevelForDiff(activeDiff);
  const completedMax = getCompletedLevelForDiff(activeDiff);
  const nextLevel = completedMax >= QUIZ_MAX_LEVEL ? QUIZ_MAX_LEVEL : unlockedMax;
  const nextQuestions = getLevelQuestionCount(activeDiff, nextLevel);
  const nextRank = getRankingForLevel(nextLevel, activeDiff);
  const badgeSet = new Set(state.quizStats.badges || []);

  const diffCardsHtml = QUIZ_DIFFICULTY_ORDER.map((key) => {
    const d = QUIZ_DIFFICULTIES[key];
    const done = getCompletedLevelForDiff(key);
    const unlocked = isDifficultyUnlocked(key);
    const prev = getPreviousDifficulty(key);
    const isActive = key === activeDiff;
    const statusRight = unlocked ? `${done}/${QUIZ_MAX_LEVEL}` : 'Bloqueada';
    const metaText = unlocked
      ? d.desc
      : `Conclua o Nível ${QUIZ_MAX_LEVEL} no ${prev ? prev.label : 'Fácil'} para liberar`;
    const titleAttr = unlocked
      ? `${d.label} — ${d.desc}`
      : `Bloqueada: conclua o Nível ${QUIZ_MAX_LEVEL} na dificuldade ${prev ? prev.label : 'Fácil'} primeiro`;

    return `
      <button
        type="button"
        class="quiz-diff-btn ${isActive ? 'active' : ''} ${unlocked ? '' : 'is-diff-locked'}"
        data-diff="${d.key}"
        data-diff-locked="${unlocked ? '0' : '1'}"
        style="--diff-accent:${d.accent};"
        title="${escapeHtml(titleAttr)}"
      >
        <div class="quiz-diff-head">
          <span class="quiz-diff-name">${escapeHtml(d.label)}</span>
          <span class="quiz-diff-progress tabular-num">${escapeHtml(statusRight)}</span>
        </div>
        <span class="quiz-diff-meta">${escapeHtml(metaText)}</span>
      </button>
    `;
  }).join('');

  const chaptersHtml = rankingsList.map((rk) => {
    const isCleared = completedMax >= rk.endLevel;
    const isEarned = badgeSet.has(rk.achievementId) || isCleared;
    const tiles = [];
    for (let lvl = rk.startLevel; lvl <= rk.endLevel; lvl += 1) {
      const isCompleted = lvl <= completedMax;
      const isUnlocked = lvl <= unlockedMax;
      const isCurrent = lvl === unlockedMax && !isCompleted;
      const qCount = getLevelQuestionCount(activeDiff, lvl);
      const stars = getStarsForLevel(activeDiff, lvl);

      let tileClass = 'quiz-level-tile';
      let stateLabel = 'Bloqueado';
      if (isCompleted) {
        tileClass += ' is-completed';
        stateLabel = '★'.repeat(Math.max(1, stars)) + '☆'.repeat(3 - Math.max(1, stars));
      } else if (isCurrent) {
        tileClass += ' is-current';
        stateLabel = 'Disponível';
      } else if (isUnlocked) {
        stateLabel = 'Aberto';
      } else {
        tileClass += ' is-locked';
        stateLabel = 'Trancado';
      }

      const titleAttr = isUnlocked
        ? `Nível ${lvl} · ${qCount} perguntas · Meta ≥ ${cfg.passPct}%`
        : `Bloqueado — conclua o Nível ${lvl - 1} (${cfg.label}) primeiro`;

      tiles.push(`
        <button
          type="button"
          class="${tileClass}"
          data-level="${lvl}"
          data-locked="${isUnlocked ? '0' : '1'}"
          title="${escapeHtml(titleAttr)}"
          aria-label="${escapeHtml(titleAttr)}"
        >
          <span class="quiz-level-num tabular-num">${String(lvl).padStart(2, '0')}</span>
          <span class="quiz-level-qcount tabular-num">${qCount} perg.</span>
          <span class="quiz-level-state">${escapeHtml(stateLabel)}</span>
        </button>
      `);
    }

    return `
      <section class="quiz-chapter-card ${isCleared ? 'is-rank-cleared' : ''}">
        <div class="quiz-chapter-header">
          <div>
            <h4 class="quiz-chapter-title">Ranking ${rk.roman} — ${escapeHtml(rk.title)} <span class="quiz-chapter-sub tabular-num">· Níveis ${rk.startLevel}–${rk.endLevel}</span></h4>
            <p class="quiz-chapter-sub">${escapeHtml(rk.focus)}</p>
          </div>
          <span class="quiz-chapter-reward ${isEarned ? 'is-earned' : ''}">
            ${isEarned ? `✓ Conquista: ${escapeHtml(rk.title)}` : `Conquista no Nível ${rk.endLevel}`}
          </span>
        </div>
        <div class="quiz-levels-row">${tiles.join('')}</div>
      </section>
    `;
  }).join('');

  body.innerHTML = `
    ${buildQuizHubTopHtml('map')}

    ${buildQuizGmailBannerHtml()}

    <div class="quiz-difficulty-bar" role="group" aria-label="Progressão obrigatória de dificuldades">
      ${diffCardsHtml}
    </div>

    <div class="quiz-next-card">
      <div class="quiz-next-info">
        <span class="quiz-question-kicker">
          ${completedMax >= QUIZ_MAX_LEVEL ? 'Trilha Concluída' : 'Próxima Fase Desbloqueada'} · ${escapeHtml(cfg.label)} (${escapeHtml(cfg.role)})
        </span>
        <h3>Nível ${nextLevel} de ${QUIZ_MAX_LEVEL} — Ranking ${nextRank.roman} · ${escapeHtml(nextRank.title)}</h3>
        <p class="quiz-next-meta tabular-num">
          ${nextQuestions} perguntas · Aprovação mínima: ${cfg.passPct}% · Progressão sequencial: Fácil → Médio → Difícil → Especialista
        </p>
      </div>
      <button type="button" class="btn-primary-sm quiz-next-cta" id="btnLaunchNextQuizLevel">
        ${completedMax >= QUIZ_MAX_LEVEL ? `Rejogar Nível ${QUIZ_MAX_LEVEL}` : `Iniciar Nível ${nextLevel}`}
      </button>
    </div>

    <div class="quiz-chapters-list" id="quizChaptersList">
      ${chaptersHtml}
    </div>
  `;

  bindQuizHubTabListeners(body);
  bindQuizGmailBannerListeners(body);

  body.querySelectorAll('.quiz-diff-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextDiff = btn.getAttribute('data-diff');
      const isLocked = btn.getAttribute('data-diff-locked') === '1';
      if (!nextDiff || !QUIZ_DIFFICULTIES[nextDiff]) return;
      if (isLocked) {
        const prev = getPreviousDifficulty(nextDiff);
        showToast(
          `Dificuldade ${QUIZ_DIFFICULTIES[nextDiff].label} bloqueada. Todos começam pelo Fácil — conclua o Nível ${QUIZ_MAX_LEVEL} no ${prev ? prev.label : 'Fácil'} primeiro.`
        );
        return;
      }
      state.quizStats.selectedDifficulty = nextDiff;
      persistQuizStats();
      renderQuizModalView();
    });
  });

  const launchBtn = body.querySelector('#btnLaunchNextQuizLevel');
  if (launchBtn) {
    launchBtn.addEventListener('click', () => startQuizLevel(activeDiff, nextLevel));
  }

  body.querySelectorAll('.quiz-level-tile').forEach((tile) => {
    tile.addEventListener('click', () => {
      const lvl = Number(tile.getAttribute('data-level'));
      const locked = tile.getAttribute('data-locked') === '1';
      if (locked) {
        showToast(`Nível ${lvl} bloqueado. Conclua o Nível ${lvl - 1} (${cfg.label}) com ≥ ${cfg.passPct}% primeiro.`);
        return;
      }
      startQuizLevel(activeDiff, lvl);
    });
  });
}

function renderQuizAchievementsView() {
  const body = document.getElementById('quizModalBody');
  if (!body) return;

  const previewDiff =
    state.quizAchievementsDiff && QUIZ_DIFFICULTIES[state.quizAchievementsDiff]
      ? state.quizAchievementsDiff
      : getActivePlayableDifficulty();
  const cfg = QUIZ_DIFFICULTIES[previewDiff] || QUIZ_DIFFICULTIES.facil;
  const rankingsList = getRankingsForDifficulty(previewDiff);
  const doneInDiff = getCompletedLevelForDiff(previewDiff);
  const diffUnlocked = isDifficultyUnlocked(previewDiff);
  const prevDiff = getPreviousDifficulty(previewDiff);
  const badgeSet = new Set(state.quizStats.badges || []);

  const diffFilterHtml = QUIZ_DIFFICULTY_ORDER.map((key) => {
    const d = QUIZ_DIFFICULTIES[key];
    const done = getCompletedLevelForDiff(key);
    const unlocked = isDifficultyUnlocked(key);
    const earnedCount = getRankingsForDifficulty(key).filter(
      (rk) => badgeSet.has(rk.achievementId) || done >= rk.endLevel
    ).length;
    const isActive = key === previewDiff;
    return `
      <button type="button" class="quiz-diff-btn ${isActive ? 'active' : ''}" data-ach-diff="${d.key}" style="--diff-accent:${d.accent};">
        <div class="quiz-diff-head">
          <span class="quiz-diff-name">${escapeHtml(d.label)}</span>
          <span class="quiz-diff-progress tabular-num">${unlocked ? `${earnedCount}/10` : 'Bloqueada'}</span>
        </div>
        <span class="quiz-diff-meta">Ranking X: ${escapeHtml(QUIZ_RANK_TITLES_BY_DIFFICULTY[key][9])}</span>
      </button>
    `;
  }).join('');

  const rankingCards = rankingsList.map((rk) => {
    const unlocked = badgeSet.has(rk.achievementId) || doneInDiff >= rk.endLevel;
    return `
      <div class="quiz-ach-card ${unlocked ? 'is-unlocked' : 'is-locked'}">
        <div class="quiz-ach-emblem tabular-num">${rk.roman}</div>
        <div class="quiz-ach-body">
          <div class="quiz-ach-title">${escapeHtml(rk.title)} <span style="font-weight:500;color:var(--text-secondary);">· Ranking ${rk.roman}</span></div>
          <div class="quiz-ach-desc">${escapeHtml(rk.requirementText)}</div>
          <span class="quiz-ach-status">${unlocked ? '✓ Desbloqueada' : `Bloqueada · Nível ${rk.endLevel} (${escapeHtml(cfg.label)})`}</span>
        </div>
      </div>
    `;
  }).join('');

  const specialCards = QUIZ_SPECIAL_ACHIEVEMENTS.map((ach) => {
    const unlocked = badgeSet.has(ach.id);
    return `
      <div class="quiz-ach-card ${unlocked ? 'is-unlocked' : 'is-locked'}">
        <div class="quiz-ach-emblem tabular-num">${escapeHtml(ach.emblem)}</div>
        <div class="quiz-ach-body">
          <div class="quiz-ach-title">${escapeHtml(ach.id)}</div>
          <div class="quiz-ach-desc">${escapeHtml(ach.desc)}</div>
          <span class="quiz-ach-status">${unlocked ? '✓ Desbloqueada' : 'Bloqueada'}</span>
        </div>
      </div>
    `;
  }).join('');

  body.innerHTML = `
    ${buildQuizHubTopHtml('achievements')}

    <div class="quiz-difficulty-bar" role="group" aria-label="Visualizar rankings por dificuldade">
      ${diffFilterHtml}
    </div>

    <div class="quiz-achievements-section">
      <h3 class="quiz-ach-heading">
        Rankings Exclusivos — Dificuldade ${escapeHtml(cfg.label)}
        ${!diffUnlocked && prevDiff ? `<span style="font-weight:400;font-size:0.8rem;color:var(--text-muted);"> · Libera após concluir o Nível ${QUIZ_MAX_LEVEL} no ${escapeHtml(prevDiff.label)}</span>` : ''}
      </h3>
      <div class="quiz-ach-grid">${rankingCards}</div>
      <h3 class="quiz-ach-heading">Conquistas Especiais de Maestria</h3>
      <div class="quiz-ach-grid">${specialCards}</div>
    </div>
  `;

  bindQuizHubTabListeners(body);

  body.querySelectorAll('[data-ach-diff]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextDiff = btn.getAttribute('data-ach-diff');
      if (nextDiff && QUIZ_DIFFICULTIES[nextDiff]) {
        state.quizAchievementsDiff = nextDiff;
        renderQuizModalView();
      }
    });
  });
}

function parseSpecimenLengthMeters(spec) {
  if (!spec || typeof spec.length !== 'string') return null;
  const raw = spec.length.toLowerCase().replace(/,/g, '.');
  const match = raw.match(/(\d+(?:\.\d+)?)\s*(?:[-–a]\s*(\d+(?:\.\d+)?)\s*)?(km|m|cm|mm|µm|um|nm)\b/);
  if (!match) return null;
  const v1 = parseFloat(match[1]);
  const v2 = match[2] ? parseFloat(match[2]) : v1;
  const val = Number.isFinite(v2) ? (v1 + v2) / 2 : v1;
  const unit = match[3];
  if (unit === 'km') return val * 1000;
  if (unit === 'm') return val;
  if (unit === 'cm') return val / 100;
  if (unit === 'mm') return val / 1000;
  if (unit === 'µm' || unit === 'um') return val / 1e6;
  if (unit === 'nm') return val / 1e9;
  return null;
}

function pickSpecimenPhoto(spec, preferredCategory) {
  const gallery = Array.isArray(spec.gallery) ? spec.gallery.filter((g) => g && g.url) : [];
  if (preferredCategory) {
    const filtered = gallery.filter((g) => g.category === preferredCategory);
    if (filtered.length > 0) {
      return filtered[Math.floor(Math.random() * filtered.length)].url;
    }
  }
  if (gallery.length > 0) {
    return gallery[Math.floor(Math.random() * gallery.length)].url;
  }
  return spec.image_url;
}

function buildSingleQuizQuestion(type, target, pool, cfg) {
  const habKey = resolveSpecimenHabitat(target);
  const habitatOptionsAll = ['aquatico', 'terrestre', 'aereo', 'anfibio', 'bentonico', 'microbiologico'];
  const eraOptionsAll = [
    { key: 'contemporaneo', label: 'Contemporâneo (Fauna Atual)' },
    { key: 'cenozoico', label: 'Cenozoico Pré-Histórico' },
    { key: 'mesozoico', label: 'Mesozoico (Era dos Dinossauros)' },
    { key: 'paleozoico', label: 'Paleozoico' },
    { key: 'precambriano', label: 'Pré-Cambriano' },
  ];
  const dietOptionsAll = [
    { key: 'carnivoro', label: 'Carnívoro' },
    { key: 'herbivoro', label: 'Herbívoro' },
    { key: 'onivoro', label: 'Onívoro' },
    { key: 'piscivoro', label: 'Piscívoro' },
    { key: 'filtrador', label: 'Filtrador / Planctívoro' },
    { key: 'insetivoro', label: 'Insetívoro' },
  ];

  if (type === 'skeleton') {
    const skelGallery = (target.gallery || []).filter((g) => g && g.category === 'skeletal_view' && g.url);
    if (skelGallery.length === 0) return null;
    const skelImg = skelGallery[Math.floor(Math.random() * skelGallery.length)];
    const distractors = shuffleArray(pool.filter((s) => s.id !== target.id)).slice(0, 3);
    if (distractors.length < 3) return null;
    return {
      kicker: 'Reconheça pelo Esqueleto',
      question: 'A qual organismo pertence esta estrutura esquelética ou fóssil?',
      subtitle: cfg.showHints
        ? `Pista: ${target.era_display} · ${target.diet_display}`
        : `Análise osteológica cega · ${target.skeletal_type}`,
      imageUrl: skelImg.url,
      habitatKey: habKey,
      options: shuffleArray([target, ...distractors]).map((s) => ({ value: s.id, label: s.name })),
      correctValue: target.id,
      specimen: target,
      explanation: `${target.name} (${target.scientific_name || target.genus}) possui ${target.skeletal_composition || target.skeletal_type}.`,
      categoryTag: 'skeleton',
    };
  }

  if (type === 'identify_photo') {
    const imgUrl = pickSpecimenPhoto(target, 'life_view');
    const distractors = shuffleArray(pool.filter((s) => s.id !== target.id)).slice(0, 3);
    if (distractors.length < 3) return null;
    return {
      kicker: 'Identificação Visual',
      question: 'Qual espécie está representada nesta imagem?',
      subtitle: cfg.showHints
        ? `Bioma: ${(HABITAT_META[habKey] || HABITAT_META.terrestre).label} · ${target.era_display}`
        : `Período: ${target.period}`,
      imageUrl: imgUrl,
      habitatKey: habKey,
      options: shuffleArray([target, ...distractors]).map((s) => ({ value: s.id, label: s.name })),
      correctValue: target.id,
      specimen: target,
      explanation: `${target.name} (${target.scientific_name || target.genus}) — ${target.group_display}.`,
      categoryTag: habKey === 'aquatico' ? 'ocean' : 'visual',
    };
  }

  if (type === 'habitat') {
    const wrongHabs = shuffleArray(habitatOptionsAll.filter((h) => h !== habKey)).slice(0, 3);
    return {
      kicker: 'Desafio de Bioma',
      question: `Em qual habitat natural vive (ou viveu) ${target.name}?`,
      subtitle: cfg.showHints
        ? `${target.scientific_name || target.genus} · ${target.period}`
        : `${target.scientific_name || target.genus}`,
      imageUrl: pickSpecimenPhoto(target, 'life_view'),
      habitatKey: habKey,
      options: shuffleArray([habKey, ...wrongHabs]).map((h) => ({
        value: h,
        label: (HABITAT_META[h] || HABITAT_META.terrestre).label,
      })),
      correctValue: habKey,
      specimen: target,
      explanation: `${target.name} está associado ao bioma ${(HABITAT_META[habKey] || HABITAT_META.terrestre).label}.`,
      categoryTag: habKey === 'aquatico' ? 'ocean' : 'habitat',
    };
  }

  if (type === 'era') {
    const eraKey = eraOptionsAll.some((e) => e.key === target.era) ? target.era : 'contemporaneo';
    const correctEraObj = eraOptionsAll.find((e) => e.key === eraKey);
    const wrongEras = shuffleArray(eraOptionsAll.filter((e) => e.key !== eraKey)).slice(0, 3);
    return {
      kicker: 'Viagem no Tempo',
      question: `A qual era geológica pertence ${target.name}?`,
      subtitle: cfg.showHints
        ? `Comprimento: ${target.length || 'Em estudo'} · ${target.group_display}`
        : `${target.group_display}`,
      imageUrl: pickSpecimenPhoto(target, 'life_view'),
      habitatKey: habKey,
      options: shuffleArray([correctEraObj, ...wrongEras]).map((e) => ({ value: e.key, label: e.label })),
      correctValue: eraKey,
      specimen: target,
      explanation: `${target.name} viveu no período ${target.period} (${target.geological_range}).`,
      categoryTag: eraKey !== 'contemporaneo' ? 'prehistory' : 'era',
    };
  }

  if (type === 'diet') {
    const rawDiet = normalizeStr(target.diet || target.diet_display || '');
    let dietKey = 'carnivoro';
    if (rawDiet.includes('herbiv')) dietKey = 'herbivoro';
    else if (rawDiet.includes('oniv')) dietKey = 'onivoro';
    else if (rawDiet.includes('pisciv')) dietKey = 'piscivoro';
    else if (rawDiet.includes('filtr') || rawDiet.includes('planct') || rawDiet.includes('fotossint')) dietKey = 'filtrador';
    else if (rawDiet.includes('inset')) dietKey = 'insetivoro';
    else if (!rawDiet.includes('carniv')) return null;

    const correctObj = dietOptionsAll.find((d) => d.key === dietKey);
    const wrongObjs = shuffleArray(dietOptionsAll.filter((d) => d.key !== dietKey)).slice(0, 3);
    return {
      kicker: 'Ecologia Trófica',
      question: `Qual é o hábito alimentar principal de ${target.name}?`,
      subtitle: cfg.showHints
        ? `${target.group_display} · ${target.era_display}`
        : `${target.scientific_name || target.genus}`,
      imageUrl: pickSpecimenPhoto(target, 'life_view'),
      habitatKey: habKey,
      options: shuffleArray([correctObj, ...wrongObjs]).map((d) => ({ value: d.key, label: d.label })),
      correctValue: dietKey,
      specimen: target,
      explanation: `${target.name} é classificado como ${target.diet_display || correctObj.label}.`,
      categoryTag: habKey === 'aquatico' ? 'ocean' : 'diet',
    };
  }

  if (type === 'anatomy') {
    const correctSkel = target.skeletal_type || 'vertebrado';
    return {
      kicker: 'Anatomia Comparada',
      question: `Qual é a classificação estrutural de ${target.name}?`,
      subtitle: cfg.showHints
        ? `${target.scientific_name || target.genus} · ${target.diet_display}`
        : `${target.scientific_name || target.genus}`,
      imageUrl: pickSpecimenPhoto(target, 'life_view'),
      habitatKey: habKey,
      options: [
        { value: 'vertebrado', label: 'Vertebrado (Coluna vertebral e crânio)' },
        { value: 'invertebrado', label: 'Invertebrado (Sem coluna vertebral)' },
        { value: 'microbiologico', label: 'Organismo Microbiológico / Acelular' },
      ],
      correctValue: correctSkel,
      specimen: target,
      explanation: `${target.name} possui ${target.skeletal_composition || correctSkel}.`,
      categoryTag: 'anatomy',
    };
  }

  if (type === 'period') {
    const cleanPeriod = (target.period || '').trim();
    if (!cleanPeriod || cleanPeriod.length < 3) return null;
    const otherPeriods = Array.from(
      new Set(
        pool
          .map((s) => (s.period || '').trim())
          .filter((p) => p && p.toLowerCase() !== cleanPeriod.toLowerCase())
      )
    );
    const wrong = shuffleArray(otherPeriods).slice(0, 3);
    if (wrong.length < 3) return null;
    return {
      kicker: 'Cronologia Geológica',
      question: `Em qual período ou época geológica situa-se ${target.name}?`,
      subtitle: cfg.showHints
        ? `${target.scientific_name || target.genus} · ${target.era_display}`
        : `${target.scientific_name || target.genus}`,
      imageUrl: pickSpecimenPhoto(target, 'skeletal_view'),
      habitatKey: habKey,
      options: shuffleArray([cleanPeriod, ...wrong]).map((p) => ({ value: p, label: p })),
      correctValue: cleanPeriod,
      specimen: target,
      explanation: `${target.name} está registrado em ${cleanPeriod} (${target.geological_range}).`,
      categoryTag: target.is_contemporary ? 'era' : 'prehistory',
    };
  }

  if (type === 'scientific_name') {
    const sci = (target.scientific_name || target.genus || '').trim();
    if (!sci || sci.length < 4) return null;
    const otherSci = Array.from(
      new Set(
        pool
          .map((s) => (s.scientific_name || s.genus || '').trim())
          .filter((n) => n && n.toLowerCase() !== sci.toLowerCase())
      )
    );
    const wrong = shuffleArray(otherSci).slice(0, 3);
    if (wrong.length < 3) return null;
    return {
      kicker: 'Nomenclatura Binomial',
      question: `Qual é o nome científico oficial de ${target.name}?`,
      subtitle: cfg.showHints
        ? `Grupo: ${target.group_display} · ${target.era_display}`
        : `Identifique o táxon científico correto`,
      imageUrl: pickSpecimenPhoto(target, 'life_view'),
      habitatKey: habKey,
      options: shuffleArray([sci, ...wrong]).map((n) => ({ value: n, label: n })),
      correctValue: sci,
      specimen: target,
      explanation: `O táxon científico de ${target.name} é ${sci}.`,
      categoryTag: 'taxonomy',
    };
  }

  if (type === 'cladogram') {
    const grp = (target.group_display || '').trim();
    if (!grp || grp.length < 3) return null;
    const otherGroups = Array.from(
      new Set(
        pool
          .map((s) => (s.group_display || '').trim())
          .filter((g) => g && g.toLowerCase() !== grp.toLowerCase())
      )
    );
    const wrong = shuffleArray(otherGroups).slice(0, 3);
    if (wrong.length < 3) return null;
    return {
      kicker: 'Taxonomia & Cladística',
      question: `A qual grupo taxonômico pertence ${target.name}?`,
      subtitle: cfg.showHints
        ? `${target.scientific_name || target.genus} · ${target.era_display}`
        : `${target.scientific_name || target.genus}`,
      imageUrl: pickSpecimenPhoto(target, 'life_view'),
      habitatKey: habKey,
      options: shuffleArray([grp, ...wrong]).map((g) => ({ value: g, label: g })),
      correctValue: grp,
      specimen: target,
      explanation: `${target.name} integra o grupo ${grp}.`,
      categoryTag: 'taxonomy',
    };
  }

  if (type === 'conservation') {
    const status = (target.conservation_status || '').trim();
    if (!status || status.length < 4) return null;
    const otherStatuses = Array.from(
      new Set(
        pool
          .map((s) => (s.conservation_status || '').trim())
          .filter((st) => st && st.toLowerCase() !== status.toLowerCase())
      )
    );
    const wrong = shuffleArray(otherStatuses).slice(0, 3);
    if (wrong.length < 3) return null;
    return {
      kicker: 'Status Biológico & IUCN',
      question: `Qual é o status biológico / de conservação de ${target.name}?`,
      subtitle: cfg.showHints
        ? `${target.scientific_name || target.genus} · ${target.era_display}`
        : `${target.scientific_name || target.genus}`,
      imageUrl: pickSpecimenPhoto(target, 'life_view'),
      habitatKey: habKey,
      options: shuffleArray([status, ...wrong]).map((st) => ({ value: st, label: st })),
      correctValue: status,
      specimen: target,
      explanation: `${target.name} possui status registrado como: ${status}.`,
      categoryTag: habKey === 'aquatico' ? 'ocean' : 'conservation',
    };
  }

  if (type === 'scale_compare') {
    const withLen = pool
      .map((s) => ({ spec: s, meters: parseSpecimenLengthMeters(s) }))
      .filter((x) => x.meters && x.meters > 0);
    const targetItem = withLen.find((x) => x.spec.id === target.id);
    if (!targetItem) return null;
    const others = shuffleArray(
      withLen.filter((x) => x.spec.id !== target.id && Math.abs(x.meters - targetItem.meters) / Math.max(x.meters, targetItem.meters) > 0.15)
    ).slice(0, 3);
    if (others.length < 3) return null;
    const group4 = [targetItem, ...others];
    group4.sort((a, b) => b.meters - a.meters);
    const winner = group4[0];
    return {
      kicker: 'Comparação Biométrica',
      question: 'Entre estes 4 organismos, qual atinge o MAIOR comprimento corporal?',
      subtitle: cfg.showHints
        ? 'Compare o porte máximo estimado nos dossiês do BioAtlas'
        : 'Avaliação biométrica comparativa',
      imageUrl: pickSpecimenPhoto(winner.spec, 'life_view'),
      habitatKey: resolveSpecimenHabitat(winner.spec),
      options: shuffleArray(group4).map((x) => ({ value: x.spec.id, label: x.spec.name })),
      correctValue: winner.spec.id,
      specimen: winner.spec,
      explanation: `${winner.spec.name} atinge ${winner.spec.length}, superando os demais organismos da lista.`,
      categoryTag: 'biometry',
    };
  }

  if (type === 'location') {
    const loc = (target.fossil_locations || '').trim();
    if (!loc || loc.length < 6) return null;
    const shortLoc = loc.length > 72 ? `${loc.slice(0, 69).trim()}...` : loc;
    const otherLocs = Array.from(
      new Set(
        pool
          .map((s) => {
            const l = (s.fossil_locations || '').trim();
            return l.length > 72 ? `${l.slice(0, 69).trim()}...` : l;
          })
          .filter((l) => l && l.length >= 6 && l.toLowerCase() !== shortLoc.toLowerCase())
      )
    );
    const wrong = shuffleArray(otherLocs).slice(0, 3);
    if (wrong.length < 3) return null;
    return {
      kicker: 'Geografia & Registro Fóssil',
      question: `Onde ${target.name} é encontrado ou possui registro fóssil principal?`,
      subtitle: cfg.showHints
        ? `${target.scientific_name || target.genus} · ${target.period}`
        : `${target.scientific_name || target.genus}`,
      imageUrl: pickSpecimenPhoto(target, target.is_contemporary ? 'life_view' : 'skeletal_view'),
      habitatKey: habKey,
      options: shuffleArray([shortLoc, ...wrong]).map((l) => ({ value: l, label: l })),
      correctValue: shortLoc,
      specimen: target,
      explanation: `Distribuição/formação de ${target.name}: ${loc}.`,
      categoryTag: target.is_contemporary ? 'habitat' : 'prehistory',
    };
  }

  return null;
}

function getQuestionTypePoolForTier(difficultyKey, level) {
  const rank = getRankingForLevel(level, difficultyKey).rank;
  if (difficultyKey === 'facil') {
    if (rank <= 3) return ['identify_photo', 'habitat', 'diet', 'era', 'anatomy'];
    if (rank <= 6) return ['identify_photo', 'habitat', 'skeleton', 'era', 'diet', 'conservation'];
    return ['identify_photo', 'skeleton', 'habitat', 'era', 'diet', 'scale_compare', 'conservation', 'anatomy'];
  }
  if (difficultyKey === 'medio') {
    if (rank <= 3) return ['habitat', 'era', 'identify_photo', 'diet', 'skeleton', 'conservation'];
    if (rank <= 6) return ['skeleton', 'period', 'habitat', 'conservation', 'scale_compare', 'era', 'diet'];
    return ['skeleton', 'period', 'cladogram', 'scale_compare', 'conservation', 'scientific_name', 'habitat', 'location'];
  }
  if (difficultyKey === 'dificil') {
    if (rank <= 4) return ['skeleton', 'period', 'scientific_name', 'conservation', 'scale_compare', 'cladogram'];
    return ['skeleton', 'scientific_name', 'cladogram', 'period', 'scale_compare', 'location', 'conservation', 'era'];
  }
  // especialista
  return ['scientific_name', 'skeleton', 'cladogram', 'period', 'scale_compare', 'location', 'conservation'];
}

function generateQuizQuestions(difficultyKey, level) {
  const cfg = QUIZ_DIFFICULTIES[difficultyKey] || QUIZ_DIFFICULTIES.facil;
  const count = getLevelQuestionCount(difficultyKey, level);
  const pool = shuffleArray(state.allCatalog || []);
  const primaryTypes = getQuestionTypePoolForTier(difficultyKey, level);
  const fallbackTypes = [
    'identify_photo', 'habitat', 'era', 'skeleton', 'diet', 'period',
    'scientific_name', 'cladogram', 'conservation', 'anatomy', 'scale_compare', 'location',
  ];

  const questions = [];
  const usedPairs = new Set();

  // Pass 1: Espalhar espécies únicas com tipos do tier atual
  for (let pass = 0; pass < 4 && questions.length < count; pass += 1) {
    const typePool = pass < 2 ? primaryTypes : fallbackTypes;
    const shuffledPool = shuffleArray(pool);
    for (let i = 0; i < shuffledPool.length && questions.length < count; i += 1) {
      const target = shuffledPool[i];
      const chosenType = typePool[(i + pass + level) % typePool.length];
      const pairKey = `${target.id}::${chosenType}`;
      if (usedPairs.has(pairKey)) continue;
      const q = buildSingleQuizQuestion(chosenType, target, pool, cfg);
      if (q) {
        usedPairs.add(pairKey);
        questions.push(q);
      }
    }
  }

  return shuffleArray(questions).slice(0, count);
}

function startQuizLevel(difficultyKey, level) {
  const cfg = QUIZ_DIFFICULTIES[difficultyKey] || QUIZ_DIFFICULTIES.facil;
  if (!isDifficultyUnlocked(cfg.key)) {
    const prev = getPreviousDifficulty(cfg.key);
    showToast(
      `Dificuldade ${cfg.label} bloqueada. Conclua o Nível ${QUIZ_MAX_LEVEL} na dificuldade ${prev ? prev.label : 'Fácil'} primeiro.`
    );
    return;
  }
  const unlockedMax = getUnlockedLevelForDiff(cfg.key);
  if (level > unlockedMax) {
    showToast(`Conclua o Nível ${level - 1} (${cfg.label}) com ≥ ${cfg.passPct}% para desbloquear o Nível ${level}.`);
    return;
  }

  state.quizStats.selectedDifficulty = cfg.key;
  const questions = generateQuizQuestions(cfg.key, level);
  if (questions.length === 0) {
    showToast('Não foi possível montar perguntas com o catálogo atual.');
    return;
  }

  state.quizSession = {
    difficultyKey: cfg.key,
    level,
    questions,
    currentIndex: 0,
    score: 0,
    answered: false,
    oceanCorrect: 0,
    prehistoryCorrect: 0,
    finalized: false,
    summaryData: null,
  };
  state.quizView = 'playing';
  renderQuizModalView();
}

function renderQuizStep() {
  const body = document.getElementById('quizModalBody');
  const session = state.quizSession;
  if (!body || !session) return;

  if (session.currentIndex >= session.questions.length) {
    state.quizView = 'summary';
    renderQuizModalView();
    return;
  }

  const cfg = QUIZ_DIFFICULTIES[session.difficultyKey] || QUIZ_DIFFICULTIES.facil;
  const rank = getRankingForLevel(session.level, cfg.key);
  const q = session.questions[session.currentIndex];
  const pct = Math.round(((session.currentIndex + (session.answered ? 1 : 0)) / session.questions.length) * 100);
  const minCorrectNeeded = Math.ceil((session.questions.length * cfg.passPct) / 100);

  body.innerHTML = `
    <div class="quiz-arena-topbar">
      <button type="button" class="quiz-back-btn" id="btnQuizBackToMap">← Voltar aos 50 Níveis</button>
      <span class="quiz-arena-meta tabular-num">
        Nível ${session.level}/${QUIZ_MAX_LEVEL} · ${escapeHtml(cfg.label)} · ${escapeHtml(rank.title)} · Meta: ${minCorrectNeeded}/${session.questions.length} (${cfg.passPct}%)
      </span>
    </div>

    <div class="quiz-progress-header">
      <span class="tabular-num">Pergunta ${session.currentIndex + 1} de ${session.questions.length}</span>
      <span class="tabular-num">Acertos: ${session.score}</span>
    </div>
    <div class="quiz-progress-track">
      <div class="quiz-progress-fill" style="width:${pct}%"></div>
    </div>

    <div class="quiz-stage-card">
      <img class="quiz-stage-img" id="quizStageImg" src="${escapeHtml(resolveDisplayImageUrl(q.imageUrl, q.habitatKey))}" alt="Espécime do desafio" referrerpolicy="no-referrer" />
      <div>
        <span class="quiz-question-kicker">${escapeHtml(q.kicker)}</span>
        <h3 class="quiz-question-text">${escapeHtml(q.question)}</h3>
        <p class="quiz-question-sub">${escapeHtml(q.subtitle)}</p>
      </div>
    </div>

    <div class="quiz-options-grid" id="quizOptionsGrid">
      ${q.options
        .map(
          (opt) => `
        <button type="button" class="quiz-option-btn" data-val="${escapeHtml(opt.value)}">
          <span>${escapeHtml(opt.label)}</span>
          <span class="quiz-option-state-tag" aria-hidden="true"></span>
        </button>
      `
        )
        .join('')}
    </div>

    <div id="quizFeedbackSlot"></div>
  `;

  const backBtn = body.querySelector('#btnQuizBackToMap');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      state.quizView = 'map';
      state.quizSession = null;
      renderQuizModalView();
    });
  }

  const stageImg = body.querySelector('#quizStageImg');
  if (stageImg) {
    stageImg.addEventListener('error', () => handleImageFallback(stageImg, q.imageUrl, q.habitatKey));
  }

  body.querySelectorAll('.quiz-option-btn').forEach((btn) => {
    btn.addEventListener('click', () => answerQuizOption(btn.getAttribute('data-val')));
  });
}

function answerQuizOption(selectedValue) {
  const session = state.quizSession;
  const body = document.getElementById('quizModalBody');
  if (!session || session.answered || !body) return;

  session.answered = true;
  const q = session.questions[session.currentIndex];
  const isCorrect = selectedValue === q.correctValue;

  if (isCorrect) {
    session.score += 1;
    if (q.categoryTag === 'ocean') session.oceanCorrect += 1;
    if (q.categoryTag === 'prehistory' || q.categoryTag === 'skeleton') session.prehistoryCorrect += 1;
  }

  body.querySelectorAll('.quiz-option-btn').forEach((btn) => {
    btn.disabled = true;
    const val = btn.getAttribute('data-val');
    const tag = btn.querySelector('.quiz-option-state-tag');
    if (val === q.correctValue) {
      btn.classList.add('is-correct');
      if (tag) tag.textContent = '✓ Correta';
    } else if (val === selectedValue && !isCorrect) {
      btn.classList.add('is-wrong');
      if (tag) tag.textContent = '✕ Incorreta';
    }
  });

  const feedbackSlot = body.querySelector('#quizFeedbackSlot');
  if (feedbackSlot) {
    const isLast = session.currentIndex === session.questions.length - 1;
    feedbackSlot.innerHTML = `
      <div class="quiz-feedback-box ${isCorrect ? 'is-correct' : 'is-wrong'}">
        <div>
          <strong>${isCorrect ? '✓ Resposta correta!' : '✕ Quase lá!'}</strong>
          <p style="font-size:0.84rem;color:var(--text-secondary);margin-top:3px;">${escapeHtml(q.explanation)}</p>
        </div>
        <button type="button" class="btn-primary-sm" id="btnQuizNext" style="white-space:nowrap;flex-shrink:0;">
          ${isLast ? 'Ver Resultado' : 'Próxima →'}
        </button>
      </div>
    `;
    feedbackSlot.querySelector('#btnQuizNext').addEventListener('click', () => {
      session.currentIndex += 1;
      session.answered = false;
      renderQuizStep();
    });
  }
}

function isQuizGmailConnected() {
  const fb = window.BioAtlasFirebase;
  return Boolean(
    state.currentUser &&
      state.currentUser.email &&
      fb &&
      typeof fb.hasGmailAccessToken === 'function' &&
      fb.hasGmailAccessToken()
  );
}

function buildGoogleSignInButtonHtml(id, label) {
  const safeLabel = escapeHtml(label || 'Entrar com Google');
  return `
    <button type="button" class="gsi-material-button" id="${escapeHtml(id)}">
      <div class="gsi-material-button-state"></div>
      <div class="gsi-material-button-content-wrapper">
        <div class="gsi-material-button-icon">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style="display:block;width:18px;height:18px;">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l7.98-6.19C6.51 42.62 14.62 48 24 48z"></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
        </div>
        <span class="gsi-material-button-contents">${safeLabel}</span>
      </div>
    </button>
  `;
}

function buildQuizGmailBannerHtml() {
  const connected = isQuizGmailConnected();
  if (connected) {
    return `
      <div class="quiz-gmail-bar is-connected">
        <div class="quiz-gmail-bar-info">
          <strong>E-mail automático de parabéns (Gmail) ativo</strong>
          <span>Destinatário: ${escapeHtml(state.currentUser.email)} · A cada etapa concluída (01, 02, ...), você receberá automaticamente seu e-mail de parabéns e incentivo.</span>
        </div>
      </div>
    `;
  }
  return `
    <div class="quiz-gmail-bar">
      <div class="quiz-gmail-bar-info">
        <strong>Receba um e-mail automático de parabéns a cada etapa (01, 02, ...)</strong>
        <span>${
          state.currentUser
            ? `Sessão de ${escapeHtml(state.currentUser.email)}: conecte o Gmail uma vez para receber automaticamente os e-mails de incentivo em cada etapa.`
            : 'Conecte sua conta Google (Gmail) para receber automaticamente um e-mail personalizado ao concluir cada etapa do Quiz.'
        }</span>
      </div>
      <div class="quiz-gmail-bar-actions">
        ${buildGoogleSignInButtonHtml('btnQuizConnectGmailHub', 'Conectar Gmail')}
      </div>
    </div>
  `;
}

function bindQuizGmailBannerListeners(container) {
  const btn = container.querySelector('#btnQuizConnectGmailHub');
  if (btn) {
    btn.addEventListener('click', () => {
      handleConnectGmailForQuiz({ forceConsent: false });
    });
  }
}

async function handleConnectGmailForQuiz(options = {}) {
  const fb = window.BioAtlasFirebase;
  if (!fb || typeof fb.connectGmail !== 'function') {
    showToast('Integração Gmail indisponível nesta sessão.');
    return null;
  }
  try {
    const user = await fb.connectGmail(Boolean(options.forceConsent));
    if (user) {
      state.currentUser = user;
      updateAuthHeaderUI(user);
      showToast(`Gmail conectado (${user.email}). Pronto para enviar parabéns a cada etapa!`);
      if (typeof options.onConnected === 'function') {
        options.onConnected(user);
      } else {
        renderQuizModalView();
      }
      return user;
    }
  } catch (err) {
    console.error('Erro ao conectar Gmail:', err);
    showToast('Conexão com Gmail cancelada ou não autorizada.');
  }
  return null;
}

function getQuizStageMotivationalNote({ level, difficultyKey, difficultyLabel, pct, nextLevelNum, nextQuestions, nextDiffAfter50 }) {
  const stageNum = String(level).padStart(2, '0');
  const nextStageNum = String(nextLevelNum).padStart(2, '0');

  if (level >= QUIZ_MAX_LEVEL && !nextDiffAfter50) {
    return 'Você alcançou o ápice absoluto do BioAtlas! Dominar a Etapa 50 no nível Especialista prova um conhecimento extraordinário da vida na Terra, dos microrganismos aos gigantes pré-históricos. Continue explorando novos espécimes e inspirando outros curiosos!';
  }
  if (level >= QUIZ_MAX_LEVEL && nextDiffAfter50) {
    return `Você fechou com chave de ouro todas as 50 etapas da dificuldade ${difficultyLabel}! Agora a trilha ${nextDiffAfter50.label} (${nextDiffAfter50.role}) está oficialmente aberta. Encare a Etapa 01 desse novo desafio e eleve ainda mais seu domínio científico!`;
  }
  if (pct === 100) {
    return `Desempenho impecável na Etapa ${stageNum} — 100% de acerto! Sua precisão mostra que você está absorvendo cada detalhe da biodiversidade e da paleontologia. A Etapa ${nextStageNum} (${nextQuestions} perguntas) já está desbloqueada esperando por você!`;
  }
  if (level === 1) {
    return `Excelente começo! Completar a Etapa 01 na dificuldade ${difficultyLabel} é o primeiro passo de uma jornada épica de 50 níveis. Mantenha o ritmo e parta agora para a Etapa 02 (${nextQuestions} perguntas) — cada acerto fortalece sua visão de explorador!`;
  }
  if (level % 5 === 0) {
    return `Marco de Ranking atingido na Etapa ${stageNum}! Você completou mais um bloco inteiro da trilha ${difficultyLabel} e garantiu uma nova conquista oficial. Continue firme rumo à Etapa ${nextStageNum} (${nextQuestions} perguntas) para conquistar o próximo Ranking!`;
  }
  if (level <= 15) {
    return `Ótima evolução na Etapa ${stageNum}! Você já está ganhando confiança nos biomas, eras geológicas e adaptações das espécies. Siga em frente para a Etapa ${nextStageNum} (${nextQuestions} perguntas) e aproxime-se do próximo Ranking!`;
  }
  if (level <= 35) {
    return `Avanço consistente na Etapa ${stageNum} (${difficultyLabel})! Poucos exploradores chegam tão longe mantendo alta precisão. Continue nessa cadência — a Etapa ${nextStageNum} (${nextQuestions} perguntas) está pronta para testar seu olhar científico!`;
  }
  return `Você está na reta final da trilha ${difficultyLabel}! Superar a Etapa ${stageNum} coloca você entre os grandes conhecedores do BioAtlas. Faltam apenas ${QUIZ_MAX_LEVEL - level} etapas para completar o Nível 50 — siga para a Etapa ${nextStageNum} (${nextQuestions} perguntas)!`;
}

function buildQuizStageEmailDraft({
  session,
  cfg,
  score,
  total,
  pct,
  stars,
  unlockedNextLevel,
  unlockedNextDifficulty,
  newlyUnlockedBadges,
}) {
  const stageNum = String(session.level).padStart(2, '0');
  const nextLevelNum = Math.min(QUIZ_MAX_LEVEL, session.level + 1);
  const nextStageNum = String(nextLevelNum).padStart(2, '0');
  const canAdvance = session.level < QUIZ_MAX_LEVEL;
  const nextQuestions = canAdvance ? getLevelQuestionCount(cfg.key, nextLevelNum) : 0;
  const nextDiffAfter50 = session.level === QUIZ_MAX_LEVEL ? getNextDifficulty(cfg.key) : null;
  const rank = getRankingForLevel(session.level, cfg.key);
  const starsText = `${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}`;
  const playerName = (state.currentUser && state.currentUser.displayName) || 'Explorador(a)';
  const recipient = (state.currentUser && state.currentUser.email) || '';

  const motivationalText = getQuizStageMotivationalNote({
    level: session.level,
    difficultyKey: cfg.key,
    difficultyLabel: cfg.label,
    pct,
    nextLevelNum,
    nextQuestions,
    nextDiffAfter50,
  });

  let subject = `Parabéns! Etapa ${stageNum} (${cfg.label}) concluída no Quiz BioAtlas`;
  if (session.level >= QUIZ_MAX_LEVEL && nextDiffAfter50) {
    subject = `Parabéns! Etapa 50 (${cfg.label}) concluída e ${nextDiffAfter50.label} desbloqueado — BioAtlas`;
  } else if (session.level >= QUIZ_MAX_LEVEL && !nextDiffAfter50) {
    subject = `Feito Histórico! Etapa 50 (${cfg.label}) dominada no Quiz BioAtlas`;
  }

  let nextChallengeLine = '';
  if (canAdvance) {
    nextChallengeLine = `Próximo desafio desbloqueado: Etapa ${nextStageNum} (${cfg.label}) — ${nextQuestions} perguntas`;
  } else if (nextDiffAfter50) {
    nextChallengeLine = `Nova trilha desbloqueada: ${nextDiffAfter50.label} (${nextDiffAfter50.role}) — Etapa 01 liberada!`;
  } else {
    nextChallengeLine = 'Você concluiu todas as 50 etapas em todas as dificuldades do BioAtlas!';
  }

  const badgesList = Array.isArray(newlyUnlockedBadges) ? newlyUnlockedBadges : [];

  const textLines = [
    `Olá, ${playerName}!`,
    '',
    `PARABÉNS POR CONCLUIR A ETAPA ${stageNum} (${cfg.label.toUpperCase()}) NO QUIZ BIOATLAS!`,
    '',
    `• Etapa concluída: Etapa ${stageNum} de ${QUIZ_MAX_LEVEL} (${cfg.label})`,
    `• Pontuação: ${score} de ${total} acertos (${pct}%)`,
    `• Avaliação: ${stars} de 3 estrelas (${starsText})`,
    `• Ranking atual: Ranking ${rank.roman} — ${rank.title}`,
  ];

  if (unlockedNextLevel) {
    textLines.push(`• Desbloqueio: Etapa ${String(unlockedNextLevel).padStart(2, '0')} liberada`);
  }
  if (unlockedNextDifficulty) {
    textLines.push(`• Nova Dificuldade: ${unlockedNextDifficulty.label} (${unlockedNextDifficulty.role}) desbloqueada`);
  }
  if (badgesList.length > 0) {
    textLines.push(`• Conquistas desbloqueadas: ${badgesList.join(', ')}`);
  }

  textLines.push(
    '',
    motivationalText,
    '',
    nextChallengeLine,
    '',
    'Continue explorando a vida na Terra,',
    'BioAtlas — Atlas Vivo de Biodiversidade e Paleontologia'
  );

  const badgesHtml =
    badgesList.length > 0
      ? `
        <div style="margin-top:16px;padding:12px 14px;border-radius:10px;background:#ecfdf5;border:1px solid #86efac;">
          <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#166534;margin-bottom:6px;">
            Novas Conquistas Desbloqueadas
          </div>
          <div style="font-size:14px;color:#14532d;line-height:1.5;">
            ${badgesList.map((b) => `• ${escapeHtml(b)}`).join('<br>')}
          </div>
        </div>
      `
      : '';

  const htmlBody = `<!DOCTYPE html>
<html lang="pt-BR">
<body style="margin:0;padding:24px 12px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
  <div style="max-width:580px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #cbd5e1;">
    <div style="background:#0b1220;padding:24px 28px;color:#f8fafc;">
      <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#38bdf8;font-weight:700;">
        BioAtlas · Desafio do Explorador
      </div>
      <h1 style="margin:8px 0 4px;font-size:22px;line-height:1.25;color:#ffffff;">
        Parabéns, ${escapeHtml(playerName)}!
      </h1>
      <div style="font-size:14px;color:#cbd5e1;">
        Etapa ${stageNum} de ${QUIZ_MAX_LEVEL} concluída na dificuldade <strong>${escapeHtml(cfg.label)}</strong>
      </div>
    </div>

    <div style="padding:24px 28px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:8px 0;margin:0 -8px 18px;">
        <tr>
          <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;text-align:center;">
            <div style="font-size:11px;text-transform:uppercase;color:#64748b;font-weight:600;">Acertos</div>
            <div style="font-size:20px;font-weight:800;color:#0284c7;margin-top:4px;">${score}/${total} (${pct}%)</div>
          </td>
          <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;text-align:center;">
            <div style="font-size:11px;text-transform:uppercase;color:#64748b;font-weight:600;">Estrelas</div>
            <div style="font-size:20px;font-weight:800;color:#d97706;margin-top:4px;">${starsText}</div>
          </td>
          <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;text-align:center;">
            <div style="font-size:11px;text-transform:uppercase;color:#64748b;font-weight:600;">Etapa</div>
            <div style="font-size:20px;font-weight:800;color:#16a34a;margin-top:4px;">${stageNum}/${QUIZ_MAX_LEVEL}</div>
          </td>
        </tr>
      </table>

      <div style="padding:12px 14px;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0;margin-bottom:16px;">
        <div style="font-size:12px;color:#64748b;font-weight:600;">Ranking Atual</div>
        <div style="font-size:15px;font-weight:700;color:#0f172a;margin-top:2px;">
          Ranking ${escapeHtml(rank.roman)} — ${escapeHtml(rank.title)}
        </div>
      </div>

      <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#1e293b;">
        ${escapeHtml(motivationalText)}
      </p>

      ${badgesHtml}

      <div style="margin-top:18px;padding:14px 16px;border-radius:10px;background:#eff6ff;border:1px solid #93c5fd;color:#1e3a8a;font-size:14px;font-weight:600;">
        ${escapeHtml(nextChallengeLine)}
      </div>
    </div>

    <div style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;">
      BioAtlas — Atlas Vivo de Biodiversidade e Paleontologia · Continue sua jornada de descobertas!
    </div>
  </div>
</body>
</html>`;

  return {
    stageNum,
    difficultyLabel: cfg.label,
    rankTitle: `Ranking ${rank.roman} — ${rank.title}`,
    score,
    total,
    pct,
    stars,
    starsText,
    to: recipient,
    subject,
    motivationalText,
    nextChallengeLine,
    badgesList,
    textBody: textLines.join('\n'),
    htmlBody,
  };
}

async function sendQuizStageEmailAuto(draft, targetSession) {
  const fb = window.BioAtlasFirebase;
  if (!draft || !targetSession) return;
  if (targetSession.emailSent || targetSession.emailSending) return;
  if (!fb || typeof fb.sendQuizStageEmail !== 'function') return;

  targetSession.emailSending = true;
  targetSession.emailError = '';
  if (state.quizView === 'summary' && state.quizSession === targetSession) {
    renderQuizSummary();
  }

  try {
    await fb.sendQuizStageEmail({
      to: draft.to,
      subject: draft.subject,
      textBody: draft.textBody,
      htmlBody: draft.htmlBody,
    });

    targetSession.emailSending = false;
    targetSession.emailSent = true;
    targetSession.emailError = '';
    targetSession.emailSentTo = draft.to;
    targetSession.emailSentAt = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    showToast(`✓ E-mail de parabéns da Etapa ${draft.stageNum} enviado para ${draft.to}!`);
    if (state.quizView === 'summary' && state.quizSession === targetSession) {
      renderQuizSummary();
    }
  } catch (err) {
    console.error('Erro ao enviar e-mail automático da etapa:', err);
    targetSession.emailSending = false;
    if (err && err.code === 'GMAIL_AUTH_REQUIRED') {
      targetSession.emailError = 'Sessão do Gmail expirada. Conecte novamente para enviar.';
    } else {
      targetSession.emailError =
        err instanceof Error ? err.message : 'Não foi possível enviar o e-mail pelo Gmail.';
    }
    if (state.quizView === 'summary' && state.quizSession === targetSession) {
      renderQuizSummary();
    }
  }
}

function renderQuizSummary() {
  const body = document.getElementById('quizModalBody');
  const session = state.quizSession;
  if (!body || !session) return;

  const cfg = QUIZ_DIFFICULTIES[session.difficultyKey] || QUIZ_DIFFICULTIES.facil;
  const total = session.questions.length;
  const score = session.score;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = pct >= cfg.passPct;
  const stars = !passed ? 0 : pct === 100 ? 3 : pct >= 85 ? 2 : 1;

  if (!session.finalized) {
    session.finalized = true;
    const prevBadges = new Set(state.quizStats.badges || []);
    const prevUnlocked = getUnlockedLevelForDiff(cfg.key);

    state.quizStats.totalRounds += 1;
    state.quizStats.totalCorrect += score;
    state.quizStats.totalQuestions += total;
    state.quizStats.bestScore = Math.max(state.quizStats.bestScore || 0, pct);

    let unlockedNextLevel = null;
    let unlockedNextDifficulty = null;
    if (passed) {
      const prevComp = getCompletedLevelForDiff(cfg.key);
      state.quizStats.completedLevels[cfg.key] = Math.max(prevComp, session.level);
      const nextUnlock = Math.min(QUIZ_MAX_LEVEL, Math.max(prevUnlocked, session.level + 1));
      if (nextUnlock > prevUnlocked) {
        unlockedNextLevel = nextUnlock;
      }
      state.quizStats.unlockedLevels[cfg.key] = nextUnlock;
      if (prevComp < QUIZ_MAX_LEVEL && session.level >= QUIZ_MAX_LEVEL) {
        const nextDiffObj = getNextDifficulty(cfg.key);
        if (nextDiffObj) {
          unlockedNextDifficulty = nextDiffObj;
          state.quizStats.unlockedLevels[nextDiffObj.key] = Math.max(
            1,
            Number(state.quizStats.unlockedLevels[nextDiffObj.key]) || 1
          );
        }
      }
      setStarsForLevel(cfg.key, session.level, stars);
    }

    const badgeSet = new Set(state.quizStats.badges || []);
    const highestDone = getHighestCompletedLevelOverall();

    // Conquistas de Ranking exclusivas por dificuldade (40 rankings únicos até o Nível 50)
    QUIZ_DIFFICULTY_ORDER.forEach((dKey) => {
      const doneInDiff = getCompletedLevelForDiff(dKey);
      getRankingsForDifficulty(dKey).forEach((rk) => {
        if (doneInDiff >= rk.endLevel) {
          badgeSet.add(rk.achievementId);
        }
      });
    });

    // Conquistas Especiais
    if (highestDone >= 1) badgeSet.add('Primeiro Passo (Nível 1)');
    if (passed && pct === 100) badgeSet.add('Precisão Absoluta 100%');
    if (session.oceanCorrect >= 3) badgeSet.add('Guardião dos Oceanos');
    if (session.prehistoryCorrect >= 3) badgeSet.add('Mestre da Pré-História');
    if (getCompletedLevelForDiff('dificil') >= 5) badgeSet.add('Desafiante Difícil');
    if (getCompletedLevelForDiff('especialista') >= QUIZ_MAX_LEVEL) badgeSet.add('Grão-Mestre Especialista');

    const newlyUnlockedBadges = Array.from(badgeSet).filter((b) => !prevBadges.has(b));
    state.quizStats.badges = Array.from(badgeSet).slice(0, 60);

    session.summaryData = {
      unlockedNextLevel,
      unlockedNextDifficulty,
      newlyUnlockedBadges,
    };

    persistQuizStats();
    updateQuizFooterStats();
  }

  const { unlockedNextLevel, unlockedNextDifficulty, newlyUnlockedBadges } = session.summaryData || {
    unlockedNextLevel: null,
    unlockedNextDifficulty: null,
    newlyUnlockedBadges: [],
  };

  const acc = state.quizStats.totalQuestions > 0
    ? Math.round((state.quizStats.totalCorrect / state.quizStats.totalQuestions) * 100)
    : 0;
  const canAdvance = passed && session.level < QUIZ_MAX_LEVEL;
  const nextDiffAfter50 = passed && session.level === QUIZ_MAX_LEVEL ? getNextDifficulty(cfg.key) : null;
  const nextLevelNum = session.level + 1;
  const starsText = passed ? `${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}` : '☆☆☆';
  const stageNum = String(session.level).padStart(2, '0');

  const emailDraft = passed
    ? buildQuizStageEmailDraft({
        session,
        cfg,
        score,
        total,
        pct,
        stars,
        unlockedNextLevel,
        unlockedNextDifficulty,
        newlyUnlockedBadges,
      })
    : null;

  let unlockBannerHtml = '';
  if (unlockedNextLevel || unlockedNextDifficulty || newlyUnlockedBadges.length > 0 || (passed && session.level === QUIZ_MAX_LEVEL)) {
    const lines = [];
    if (unlockedNextLevel) {
      const nextQ = getLevelQuestionCount(cfg.key, unlockedNextLevel);
      lines.push(`• Nível ${unlockedNextLevel} (${cfg.label}) desbloqueado — ${nextQ} perguntas`);
    }
    if (passed && session.level === QUIZ_MAX_LEVEL) {
      lines.push(`• Você concluiu todos os ${QUIZ_MAX_LEVEL} níveis na dificuldade ${cfg.label}!`);
    }
    if (unlockedNextDifficulty) {
      lines.push(`• Nova Dificuldade Desbloqueada: ${unlockedNextDifficulty.label} (${unlockedNextDifficulty.role}) — Nível 1 liberado!`);
    }
    newlyUnlockedBadges.forEach((b) => {
      lines.push(`• Nova Conquista Desbloqueada: ${b}`);
    });
    unlockBannerHtml = `
      <div class="quiz-unlock-banner">
        <div class="quiz-unlock-banner-title">Progresso &amp; Conquistas Desbloqueadas</div>
        <div class="quiz-unlock-banner-list">${lines.map((l) => `<div>${escapeHtml(l)}</div>`).join('')}</div>
      </div>
    `;
  }

  let emailCardHtml = '';
  if (passed && emailDraft) {
    const gmailReady = isQuizGmailConnected();
    if (session.emailSent) {
      emailCardHtml = `
        <div class="quiz-email-card is-sent">
          <div class="quiz-email-card-head">
            <span class="quiz-email-card-kicker">✓ E-mail de Parabéns Enviado (Gmail)</span>
            <span class="quiz-email-card-time tabular-num">${escapeHtml(session.emailSentAt || '')}</span>
          </div>
          <p class="quiz-email-card-desc">
            Parabéns pela <strong>Etapa ${stageNum}</strong> enviado automaticamente para <strong>${escapeHtml(session.emailSentTo || emailDraft.to)}</strong>.
          </p>
        </div>
      `;
    } else if (session.emailSending) {
      emailCardHtml = `
        <div class="quiz-email-card">
          <div class="quiz-email-card-head">
            <span class="quiz-email-card-kicker">Enviando E-mail · Etapa ${stageNum}</span>
            <span class="quiz-email-card-recipient">${escapeHtml(emailDraft.to)}</span>
          </div>
          <p class="quiz-email-card-desc">Enviando automaticamente seu e-mail de parabéns pelo Gmail...</p>
        </div>
      `;
    } else if (gmailReady && session.emailError) {
      emailCardHtml = `
        <div class="quiz-email-card">
          <div class="quiz-email-card-head">
            <span class="quiz-email-card-kicker">E-mail de Parabéns · Etapa ${stageNum}</span>
            <span class="quiz-email-card-recipient">${escapeHtml(emailDraft.to)}</span>
          </div>
          <p class="quiz-email-card-desc">${escapeHtml(session.emailError)}</p>
          <div class="quiz-email-card-controls">
            <button type="button" class="btn-primary-sm" id="btnRetryQuizEmailAuto">Tentar enviar novamente</button>
          </div>
        </div>
      `;
    } else if (!gmailReady) {
      emailCardHtml = `
        <div class="quiz-email-card">
          <div class="quiz-email-card-head">
            <span class="quiz-email-card-kicker">E-mail Automático · Etapa ${stageNum}</span>
          </div>
          <p class="quiz-email-card-desc">
            Conecte seu Gmail uma vez para receber automaticamente os e-mails de parabéns a cada etapa concluída (01, 02, ...).
          </p>
          <div class="quiz-email-card-controls">
            ${buildGoogleSignInButtonHtml('btnQuizConnectGmailSummary', 'Conectar Gmail')}
          </div>
        </div>
      `;
    }
  }

  body.innerHTML = `
    <div class="quiz-summary-panel">
      <div class="quiz-summary-status ${passed ? 'is-passed' : 'is-failed'}">
        ${passed ? `✓ APROVADO · Etapa ${stageNum} (${escapeHtml(cfg.label)})` : `✕ NÃO APROVADO · Necessário ≥ ${cfg.passPct}%`}
      </div>
      <div class="quiz-final-score tabular-num">${score} / ${total} (${pct}%)</div>
      <div class="quiz-stars-display" aria-label="${stars} de 3 estrelas">${starsText}</div>
      <p style="color:var(--text-secondary);font-size:0.9rem;max-width:520px;margin:0 auto;">
        ${
          passed
            ? session.level === QUIZ_MAX_LEVEL
              ? nextDiffAfter50
                ? `Trilha ${cfg.label} concluída! A dificuldade ${nextDiffAfter50.label} foi desbloqueada.`
                : 'Feito histórico! Você dominou todas as dificuldades até o Nível 50 no Especialista.'
              : `Excelente desempenho! Você superou a meta de ${cfg.passPct}% e avançou na trilha.`
            : `Você atingiu ${pct}%, mas esta dificuldade exige pelo menos ${cfg.passPct}% para desbloquear o Nível ${Math.min(QUIZ_MAX_LEVEL, session.level + 1)}.`
        }
      </p>

      ${unlockBannerHtml}

      ${emailCardHtml}

      <p style="font-family:var(--font-mono);font-size:0.78rem;color:var(--text-muted);margin-top:12px;">
        Precisão geral: ${acc}% · Conquistas: ${countCampaignAchievementsUnlocked()}/${QUIZ_TOTAL_ACHIEVEMENTS} · ${state.currentUser ? 'Salvo na nuvem' : 'Salvo localmente'}
      </p>

      <div class="quiz-summary-actions">
        ${
          canAdvance
            ? `<button type="button" class="btn-primary-sm" id="btnQuizAdvanceNext">Avançar para Nível ${nextLevelNum} (${getLevelQuestionCount(cfg.key, nextLevelNum)} perg.) →</button>`
            : nextDiffAfter50
              ? `<button type="button" class="btn-primary-sm" id="btnQuizStartNextDiff">Iniciar ${escapeHtml(nextDiffAfter50.label)} · Nível 1 →</button>`
              : ''
        }
        <button type="button" class="${canAdvance || nextDiffAfter50 ? 'btn-outline-sm' : 'btn-primary-sm'}" id="btnQuizRetryLevel">
          Repetir Nível ${session.level}
        </button>
        <button type="button" class="btn-outline-sm" id="btnQuizGoMap">
          Mapa de 50 Níveis
        </button>
        <button type="button" class="btn-outline-sm" id="btnQuizGoAchievements">
          Ver Conquistas
        </button>
      </div>
    </div>
  `;

  const retryEmailBtn = body.querySelector('#btnRetryQuizEmailAuto');
  if (retryEmailBtn && emailDraft) {
    retryEmailBtn.addEventListener('click', () => {
      session.emailAutoTriggered = true;
      sendQuizStageEmailAuto(emailDraft, session);
    });
  }

  const connectSummaryBtn = body.querySelector('#btnQuizConnectGmailSummary');
  if (connectSummaryBtn) {
    connectSummaryBtn.addEventListener('click', () => {
      handleConnectGmailForQuiz({
        forceConsent: false,
        onConnected: () => {
          const freshDraft = buildQuizStageEmailDraft({
            session,
            cfg,
            score,
            total,
            pct,
            stars,
            unlockedNextLevel,
            unlockedNextDifficulty,
            newlyUnlockedBadges,
          });
          session.emailAutoTriggered = true;
          sendQuizStageEmailAuto(freshDraft, session);
        },
      });
    });
  }

  const advBtn = body.querySelector('#btnQuizAdvanceNext');
  if (advBtn) advBtn.addEventListener('click', () => startQuizLevel(cfg.key, nextLevelNum));

  const nextDiffBtn = body.querySelector('#btnQuizStartNextDiff');
  if (nextDiffBtn && nextDiffAfter50) {
    nextDiffBtn.addEventListener('click', () => {
      state.quizStats.selectedDifficulty = nextDiffAfter50.key;
      persistQuizStats();
      startQuizLevel(nextDiffAfter50.key, 1);
    });
  }

  const retryBtn = body.querySelector('#btnQuizRetryLevel');
  if (retryBtn) retryBtn.addEventListener('click', () => startQuizLevel(cfg.key, session.level));

  const mapBtn = body.querySelector('#btnQuizGoMap');
  if (mapBtn) {
    mapBtn.addEventListener('click', () => {
      state.quizView = 'map';
      state.quizSession = null;
      renderQuizModalView();
    });
  }

  const achBtn = body.querySelector('#btnQuizGoAchievements');
  if (achBtn) {
    achBtn.addEventListener('click', () => {
      state.quizView = 'achievements';
      state.quizSession = null;
      renderQuizModalView();
    });
  }

  // Envia automaticamente o e-mail de parabéns da etapa assim que o usuário passa (com Gmail conectado)
  if (
    passed &&
    emailDraft &&
    isQuizGmailConnected() &&
    !session.emailSent &&
    !session.emailSending &&
    !session.emailAutoTriggered
  ) {
    session.emailAutoTriggered = true;
    sendQuizStageEmailAuto(emailDraft, session);
  }
}

// ============================================================================
// 8. AUTOCOMPLETE COM MINIATURAS NA BUSCA
// ============================================================================

const SEARCH_PT_ALIASES = {
  tiranossauro: ['tyrannosaurus', 't-rex'],
  espinossauro: ['spinosaurus'],
  velociraptor: ['velociraptor'],
  triceratopo: ['triceratops'],
  triceratops: ['triceratops'],
  braquiossauro: ['brachiosaurus'],
  estegossauro: ['stegosaurus'],
  mosassauro: ['mosasaurus'],
  megalodonte: ['megalodon', 'otodus'],
  mamute: ['mammuthus', 'mamute'],
  baleia: ['balaenoptera', 'baleia'],
  tubarao: ['carcharodon', 'tubarao'],
  onca: ['panthera onca', 'onca'],
  polvo: ['octopus', 'polvo'],
  tardigrado: ['tardigrado', 'milnesium'],
};

function getAutocompleteMatches(rawQuery) {
  const q = normalizeStr(rawQuery);
  if (q.length < 2) return [];

  const expanded = [q];
  Object.entries(SEARCH_PT_ALIASES).forEach(([alias, targets]) => {
    if (alias.includes(q) || q.includes(alias)) {
      expanded.push(...targets);
    }
  });

  const scored = [];
  (state.allCatalog || []).forEach((spec) => {
    const nameN = normalizeStr(spec.name);
    const sciN = normalizeStr(spec.scientific_name);
    const genusN = normalizeStr(spec.genus);
    const groupN = normalizeStr(spec.group_display);

    let score = 0;
    for (const term of expanded) {
      if (nameN.startsWith(term) || genusN.startsWith(term)) score = Math.max(score, 100);
      else if (sciN.startsWith(term)) score = Math.max(score, 90);
      else if (nameN.includes(term) || sciN.includes(term) || genusN.includes(term)) score = Math.max(score, 70);
      else if (groupN.includes(term)) score = Math.max(score, 40);
    }

    if (score > 0) scored.push({ spec, score });
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 6).map((x) => x.spec);
}

function updateSearchAutocomplete(rawQuery) {
  const box = document.getElementById('searchAutocomplete');
  if (!box) return;

  const q = String(rawQuery || '').trim();
  if (q.length < 2) {
    hideSearchAutocomplete();
    return;
  }

  const matches = getAutocompleteMatches(q);
  state.autocompleteItems = [
    ...matches.map((spec) => ({ kind: 'specimen', spec })),
    { kind: 'api', query: q },
  ];
  state.autocompleteIndex = -1;

  box.innerHTML = '';
  state.autocompleteItems.forEach((item, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.role = 'option';
    btn.dataset.acIndex = String(idx);

    if (item.kind === 'specimen') {
      const spec = item.spec;
      const hab = resolveSpecimenHabitat(spec);
      const habMeta = HABITAT_META[hab] || HABITAT_META.terrestre;
      btn.className = 'autocomplete-item';
      btn.innerHTML = `
        <img class="autocomplete-thumb" src="${escapeHtml(resolveDisplayImageUrl(spec.image_url, hab))}" alt="${escapeHtml(spec.name)}" loading="lazy" />
        <span class="autocomplete-meta">
          <span class="autocomplete-title">${escapeHtml(spec.name)}</span>
          <span class="autocomplete-sub">${escapeHtml(spec.scientific_name || spec.genus)} · ${escapeHtml(spec.period || spec.era_display)}</span>
        </span>
        <span class="autocomplete-habitat-tag" style="color:${habMeta.accentHex};">${escapeHtml(habMeta.shortLabel)}</span>
      `;
      const img = btn.querySelector('img');
      img.addEventListener('error', () => handleImageFallback(img, spec.image_url, hab));
    } else {
      btn.className = 'autocomplete-item autocomplete-api-cta';
      btn.innerHTML = `
        <span class="autocomplete-meta">
          <span class="autocomplete-title">Catalogar "${escapeHtml(item.query)}" via APIs científicas (GBIF / PBDB / Wikimedia)</span>
          <span class="autocomplete-sub">Não encontrou na lista? Busque qualquer ser vivo ou fóssil em tempo real.</span>
        </span>
      `;
    }

    btn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      selectAutocompleteItem(idx);
    });
    box.appendChild(btn);
  });

  box.classList.remove('hidden');
}

function moveAutocompleteSelection(delta) {
  const count = state.autocompleteItems.length;
  if (count === 0) return;
  state.autocompleteIndex = (state.autocompleteIndex + delta + count) % count;

  document.querySelectorAll('#searchAutocomplete .autocomplete-item').forEach((el, idx) => {
    el.classList.toggle('is-active', idx === state.autocompleteIndex);
  });
}

function selectAutocompleteItem(idx) {
  const item = state.autocompleteItems[idx];
  hideSearchAutocomplete();
  if (!item) return;

  if (item.kind === 'specimen') {
    openWikiModal(item.spec.id, 'tab-overview');
  } else if (item.kind === 'api') {
    executeAutoIngest(item.query);
  }
}

function hideSearchAutocomplete() {
  const box = document.getElementById('searchAutocomplete');
  if (box) box.classList.add('hidden');
  state.autocompleteIndex = -1;
  state.autocompleteItems = [];
}

// ============================================================================
// 9. LINKS COMPARTILHÁVEIS & SINCRONIZAÇÃO DE URL (?especime= & ?habitat=)
// ============================================================================

let __isApplyingInitialUrl = false;

function syncUrlParams(explicitSpecimenId) {
  if (__isApplyingInitialUrl || typeof window.history?.replaceState !== 'function') return;
  try {
    const url = new URL(window.location.href);

    if (state.currentHabitat && state.currentHabitat !== 'all') {
      url.searchParams.set('habitat', state.currentHabitat);
    } else {
      url.searchParams.delete('habitat');
    }

    if (state.currentEra && state.currentEra !== 'all') {
      url.searchParams.set('era', state.currentEra);
    } else {
      url.searchParams.delete('era');
    }

    if (state.audienceMode === 'researcher') {
      url.searchParams.set('modo', 'pesquisador');
    } else {
      url.searchParams.delete('modo');
    }

    if (explicitSpecimenId === null) {
      url.searchParams.delete('especime');
    } else if (typeof explicitSpecimenId === 'string' && explicitSpecimenId) {
      url.searchParams.set('especime', explicitSpecimenId);
    }

    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  } catch {}
}

async function applyInitialUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const habitat = params.get('habitat');
  const era = params.get('era');
  const modo = params.get('modo');
  const especime = params.get('especime');

  __isApplyingInitialUrl = true;
  let needsCatalogReload = false;

  if (modo === 'pesquisador' || modo === 'researcher') {
    setAudienceMode('researcher', false);
  }

  if (habitat && HABITAT_META[habitat]) {
    applyHabitatTheme(habitat);
    needsCatalogReload = true;
  }

  if (era && era !== 'all') {
    state.currentEra = era;
    document.querySelectorAll('.era-tab-btn').forEach((b) =>
      b.classList.toggle('active', b.getAttribute('data-era') === era)
    );
    needsCatalogReload = true;
  }

  __isApplyingInitialUrl = false;

  if (needsCatalogReload) {
    await loadCatalog(false);
  }

  if (especime) {
    const found = findSpecimenById(especime);
    if (found) {
      openWikiModal(found.id, 'tab-overview');
    } else if (state.isBackendOnline) {
      await openOrIngestSpecimen(especime);
    }
  }
}

function copyShareableSpecimenLink(targetSpec = null) {
  const spec = targetSpec || state.selectedSpecimen;
  if (!spec) return;
  const link = buildSpecimenShareUrl(spec.id);
  copyTextToClipboard(link, `Link direto de "${spec.name}" copiado!`);
}

