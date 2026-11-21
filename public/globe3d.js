/* ==========================================================================
   BioAtlas 3D Globe Engine (Lazy Three.js + Paleocontinents Reconstructions)
   ========================================================================== */

(function () {
  'use strict';

  const THREE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

  const PALEO_CONFIGS = {
    modern: {
      id: 'modern',
      label: 'Atual (Holoceno)',
      subtitle: 'Configuração Continental Moderna (0 Ma)',
      oceanTop: '#071b30',
      oceanMid: '#0b2944',
      oceanBot: '#061526',
      shelfColor: 'rgba(14, 116, 144, 0.28)',
      landFill: '#1a4a35',
      landHighlight: '#2d6e4c',
      landStroke: '#4ade80',
      gridColor: 'rgba(56, 189, 248, 0.12)',
      atmosphere: 0x38bdf8,
      halo: 0x10b981,
      markerColor: 0x10b981,
      labels: [
        { text: 'AMÉRICA DO NORTE', lat: 46, lng: -100 },
        { text: 'AMÉRICA DO SUL', lat: -15, lng: -58 },
        { text: 'ÁFRICA', lat: 4, lng: 20 },
        { text: 'EURÁSIA', lat: 52, lng: 75 },
        { text: 'OCEANIA', lat: -25, lng: 134 },
        { text: 'ANTÁRTICA', lat: -78, lng: 15 }
      ],
      continents: [
        // América do Norte
        [[-168, 65], [-145, 70], [-115, 69], [-85, 64], [-60, 50], [-75, 35], [-82, 24], [-97, 19], [-84, 9], [-105, 20], [-118, 33], [-128, 49], [-148, 60]],
        // Groenlândia
        [[-52, 60], [-42, 66], [-20, 76], [-32, 82], [-60, 80], [-58, 68]],
        // América do Sul
        [[-79, 10], [-62, 10], [-49, 0], [-35, -6], [-39, -22], [-53, -34], [-67, -54], [-74, -46], [-71, -18], [-81, -4]],
        // Europa
        [[-9, 37], [-5, 48], [8, 55], [18, 69], [42, 68], [58, 56], [42, 44], [25, 37], [12, 43], [2, 42]],
        // África
        [[-17, 15], [-6, 35], [10, 37], [33, 31], [43, 12], [51, 11], [40, -10], [33, -27], [19, -35], [12, -18], [9, 4], [-8, 5]],
        // Ásia
        [[42, 42], [58, 56], [70, 72], [115, 74], [168, 66], [142, 44], [122, 32], [108, 12], [98, 16], [80, 8], [67, 24], [52, 26], [36, 36]],
        // Índia / Sudeste / Japão (detalhe insular)
        [[130, 32], [141, 41], [145, 44], [136, 35]],
        [[105, -6], [116, -8], [128, -4], [118, 1], [108, -2]],
        // Austrália
        [[114, -22], [130, -12], [142, -11], [153, -27], [148, -38], [131, -32], [115, -34]],
        // Antártica
        [[-180, -73], [-120, -72], [-62, -64], [-20, -71], [45, -68], [110, -67], [168, -72], [180, -73], [180, -88], [-180, -88]]
      ]
    },

    mesozoic: {
      id: 'mesozoic',
      label: 'Mesozoico (110 Ma)',
      subtitle: 'Laurásia & Gondwana • Mar de Tétis',
      oceanTop: '#0a202c',
      oceanMid: '#0e3545',
      oceanBot: '#071923',
      shelfColor: 'rgba(245, 158, 11, 0.20)',
      landFill: '#3b4a22',
      landHighlight: '#55692e',
      landStroke: '#f59e0b',
      gridColor: 'rgba(245, 158, 11, 0.13)',
      atmosphere: 0xf59e0b,
      halo: 0xea580c,
      markerColor: 0xf59e0b,
      labels: [
        { text: 'LAURÁSIA', lat: 48, lng: -15 },
        { text: 'MAR INTERIOR OCIDENTAL', lat: 42, lng: -102 },
        { text: 'MAR DE TÉTIS', lat: 14, lng: 56 },
        { text: 'GONDWANA', lat: -22, lng: 8 },
        { text: 'ÍNDIA INSULAR', lat: -30, lng: 64 },
        { text: 'ANTÁRTICA-AUSTRÁLIA', lat: -62, lng: 98 }
      ],
      continents: [
        // América do Norte Ocidental (Laramídia)
        [[-158, 66], [-125, 70], [-108, 60], [-106, 36], [-115, 24], [-134, 42], [-148, 56]],
        // América do Norte Oriental (Apaláchia) + Groenlândia
        [[-96, 62], [-64, 68], [-44, 60], [-56, 42], [-78, 30], [-92, 36]],
        // Eurásia Mesozoica
        [[-16, 44], [6, 56], [42, 66], [96, 68], [142, 56], [134, 34], [104, 24], [76, 30], [42, 32], [12, 38], [-6, 36]],
        // América do Sul (começando a se separar da África)
        [[-68, 6], [-44, 2], [-30, -8], [-34, -28], [-50, -48], [-64, -46], [-72, -16]],
        // África Mesozoica
        [[-20, 12], [-4, 28], [22, 26], [36, 10], [34, -14], [20, -34], [4, -30], [-6, -8], [-18, 2]],
        // Índia à deriva no Oceano Índico
        [[56, -24], [68, -22], [72, -36], [60, -40]],
        // Gondwana Austral (Antártica + Austrália ainda conectadas)
        [[-38, -62], [12, -58], [66, -60], [116, -48], [140, -56], [132, -72], [72, -78], [10, -78], [-42, -74]]
      ]
    },

    pangaea: {
      id: 'pangaea',
      label: 'Pangeia (250 Ma)',
      subtitle: 'Supercontinente Pangeia • Oceano Pantalassa',
      oceanTop: '#161b2e',
      oceanMid: '#1c2842',
      oceanBot: '#101424',
      shelfColor: 'rgba(234, 88, 12, 0.22)',
      landFill: '#5c3620',
      landHighlight: '#7c4b2b',
      landStroke: '#fb923c',
      gridColor: 'rgba(251, 146, 60, 0.13)',
      atmosphere: 0xf97316,
      halo: 0xef4444,
      markerColor: 0xfb923c,
      labels: [
        { text: 'PANGEIA', lat: 8, lng: -8 },
        { text: 'OCEANO PANTALASSA', lat: 12, lng: -125 },
        { text: 'MAR DE TÉTIS', lat: 6, lng: 64 },
        { text: 'CATHAYSIA', lat: 24, lng: 108 },
        { text: 'GONDWANA SUL', lat: -42, lng: 18 }
      ],
      continents: [
        // Supercontinente Pangeia em C
        [
          [-62, 54], [-22, 68], [26, 70], [72, 62], [86, 46], [56, 34], [24, 24],
          [8, 8], [24, -8], [58, -18], [86, -34], [82, -56], [42, -72], [-18, -74],
          [-56, -54], [-64, -22], [-56, 8], [-68, 28]
        ],
        // Blocos da China / Cathaysia no Tétis Oriental
        [[98, 30], [118, 28], [122, 16], [102, 14]],
        [[84, 10], [98, 6], [94, -4], [80, 0]]
      ]
    },

    paleozoic: {
      id: 'paleozoic',
      label: 'Paleozoico (500 Ma)',
      subtitle: 'Gondwana Primitivo, Laurêntia & Báltica',
      oceanTop: '#061c24',
      oceanMid: '#0a2f3a',
      oceanBot: '#04141a',
      shelfColor: 'rgba(6, 182, 212, 0.25)',
      landFill: '#184b49',
      landHighlight: '#216964',
      landStroke: '#22d3ee',
      gridColor: 'rgba(34, 211, 238, 0.14)',
      atmosphere: 0x06b6d4,
      halo: 0x22d3ee,
      markerColor: 0x22d3ee,
      labels: [
        { text: 'LAURÊNTIA', lat: 4, lng: -76 },
        { text: 'BÁLTICA', lat: -22, lng: -12 },
        { text: 'SIBÉRIA', lat: 14, lng: 32 },
        { text: 'GONDWANA PRIMITIVO', lat: -48, lng: 72 },
        { text: 'OCEANO PANTHALÁSSICO', lat: 38, lng: -120 }
      ],
      continents: [
        // Laurêntia (equatorial)
        [[-108, 18], [-68, 20], [-48, 6], [-60, -10], [-98, -12], [-116, 2]],
        // Báltica
        [[-30, -14], [-4, -12], [6, -28], [-12, -38], [-32, -28]],
        // Sibéria
        [[14, 24], [48, 26], [56, 8], [32, 0], [10, 10]],
        // Gondwana Primitivo (maciço austral extenso)
        [[20, -26], [64, -22], [118, -16], [148, -32], [142, -62], [96, -78], [30, -76], [-14, -64], [2, -40]],
        // Arco insular / Cazaquistânia
        [[78, 20], [96, 16], [92, 4], [74, 8]]
      ]
    }
  };

  let threeLoadPromise = null;

  function ensureThreeLoaded() {
    if (typeof window.THREE !== 'undefined') {
      return Promise.resolve(window.THREE);
    }
    if (threeLoadPromise) return threeLoadPromise;

    threeLoadPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${THREE_CDN}"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve(window.THREE));
        existing.addEventListener('error', reject);
        return;
      }
      const script = document.createElement('script');
      script.src = THREE_CDN;
      script.async = true;
      script.onload = () => resolve(window.THREE);
      script.onerror = (err) => {
        threeLoadPromise = null;
        reject(err);
      };
      document.head.appendChild(script);
    });
    return threeLoadPromise;
  }

  function detectSoftwareWebGL(renderer) {
    try {
      const gl = renderer.getContext();
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      const name = dbg
        ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '')
        : String(gl.getParameter(gl.RENDERER) || '');
      return /SwiftShader|llvmpipe|Software|Basic Render/i.test(name);
    } catch {
      return false;
    }
  }

  function lngLatToCanvas(lng, lat, width, height) {
    const x = ((lng + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return [x, y];
  }

  function createPaleoTexture(modeKey, isSoftwareGl) {
    const cfg = PALEO_CONFIGS[modeKey] || PALEO_CONFIGS.modern;
    const width = isSoftwareGl ? 1024 : 2048;
    const height = isSoftwareGl ? 512 : 1024;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 1. Oceano com gradiente latitudinal
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
    oceanGrad.addColorStop(0, cfg.oceanTop);
    oceanGrad.addColorStop(0.5, cfg.oceanMid);
    oceanGrad.addColorStop(1, cfg.oceanBot);
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Bandas batimétricas sutis
    ctx.strokeStyle = cfg.gridColor;
    ctx.lineWidth = Math.max(1, width / 1400);
    for (let lng = -150; lng <= 150; lng += 30) {
      const [x] = lngLatToCanvas(lng, 0, width, height);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      const [, y] = lngLatToCanvas(0, lat, width, height);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Linha do Equador destacada
    const [, eqY] = lngLatToCanvas(0, 0, width, height);
    ctx.strokeStyle = cfg.landStroke;
    ctx.globalAlpha = 0.24;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(0, eqY);
    ctx.lineTo(width, eqY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    // 3. Plataformas continentais (glow suave) + Massas terrestres
    cfg.continents.forEach((poly) => {
      if (!poly || poly.length < 3) return;
      ctx.save();
      ctx.beginPath();
      poly.forEach(([lng, lat], idx) => {
        const [x, y] = lngLatToCanvas(lng, lat, width, height);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();

      // Plataforma continental rasa
      ctx.strokeStyle = cfg.shelfColor;
      ctx.lineWidth = width * 0.018;
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Preenchimento continental
      const landGrad = ctx.createLinearGradient(0, height * 0.15, 0, height * 0.85);
      landGrad.addColorStop(0, cfg.landHighlight);
      landGrad.addColorStop(0.5, cfg.landFill);
      landGrad.addColorStop(1, cfg.landHighlight);
      ctx.fillStyle = landGrad;
      ctx.fill();

      // Contorno tectônico
      ctx.strokeStyle = cfg.landStroke;
      ctx.lineWidth = Math.max(1.5, width / 900);
      ctx.globalAlpha = 0.8;
      ctx.stroke();
      ctx.restore();
    });

    // 4. Textura topográfica discreta (micro-relevo determinístico)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    for (let i = 0; i < 420; i++) {
      const rx = ((i * 7919) % width);
      const ry = ((i * 3571) % height);
      const rad = 1 + (i % 3);
      ctx.beginPath();
      ctx.arc(rx, ry, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Rótulos tectônicos / paleogeográficos
    ctx.save();
    ctx.font = `700 ${Math.round(width * 0.015)}px "Plus Jakarta Sans", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    cfg.labels.forEach((lbl) => {
      const [x, y] = lngLatToCanvas(lbl.lng, lbl.lat, width, height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillText(lbl.text, x + 1.5, y + 1.5);
      ctx.fillStyle = 'rgba(240, 246, 240, 0.78)';
      ctx.fillText(lbl.text, x, y);
    });
    ctx.restore();

    const THREE = window.THREE;
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    if ('colorSpace' in texture && THREE.SRGBColorSpace) {
      texture.colorSpace = THREE.SRGBColorSpace;
    } else if ('encoding' in texture && THREE.sRGBEncoding) {
      texture.encoding = THREE.sRGBEncoding;
    }
    texture.needsUpdate = true;
    return texture;
  }

  function latLngToVector3(lat, lng, radius = 10.12) {
    const THREE = window.THREE;
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }

  const engine = {
    scene: null,
    camera: null,
    renderer: null,
    globeGroup: null,
    earthMesh: null,
    earthMat: null,
    atmosMesh: null,
    haloMesh: null,
    markersGroup: null,
    interactiveMarkers: [],
    currentTexture: null,
    currentMode: 'modern',
    isSoftwareGl: false,
    autoRotate: true,
    isDragging: false,
    prevPointer: { x: 0, y: 0 },
    targetRotY: 0,
    targetRotX: 0.2,
    animId: null,
    lastTime: 0,
    primaryPoint: null,
    controlsBound: false,
    raycaster: null,
    mouseNdc: null,

    autoModeForEra(era) {
      const e = String(era || '').toLowerCase();
      if (e === 'mesozoico') return 'mesozoic';
      if (e === 'paleozoico') return 'pangaea';
      if (e === 'precambriano') return 'paleozoic';
      return 'modern';
    },

    async init() {
      const container = document.getElementById('globe3dContainer');
      const canvas = document.getElementById('globe3dCanvas');
      if (!container || !canvas) return false;

      const loadingEl = document.getElementById('globe3dLoading');
      if (!this.renderer && loadingEl) {
        loadingEl.classList.remove('hidden');
      }

      try {
        await ensureThreeLoaded();
      } catch (err) {
        console.error('[BioAtlasGlobe3D] Falha ao carregar Three.js:', err);
        if (loadingEl) loadingEl.classList.add('hidden');
        return false;
      }

      if (this.renderer) {
        this.startLoop();
        this.resize();
        return true;
      }

      const THREE = window.THREE;
      const width = container.clientWidth || 380;
      const height = container.clientHeight || 290;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
      this.camera.position.set(0, 1.5, 27.5);
      this.camera.lookAt(0, 0, 0);

      this.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.isSoftwareGl = detectSoftwareWebGL(this.renderer);
      this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.setSize(width, height);

      // Grupo principal que gira junto (Terra + Marcadores)
      this.globeGroup = new THREE.Group();
      this.scene.add(this.globeGroup);

      const segs = this.isSoftwareGl ? 36 : 64;
      const earthGeom = new THREE.SphereGeometry(10, segs, segs);
      this.currentTexture = createPaleoTexture(this.currentMode, this.isSoftwareGl);
      this.earthMat = new THREE.MeshPhongMaterial({
        map: this.currentTexture,
        shininess: 16,
        specular: new THREE.Color(0x1f3644)
      });
      this.earthMesh = new THREE.Mesh(earthGeom, this.earthMat);
      this.globeGroup.add(this.earthMesh);

      // Atmosfera interna e halo
      const atmosGeom = new THREE.SphereGeometry(10.35, 32, 32);
      const atmosMat = new THREE.MeshBasicMaterial({
        color: PALEO_CONFIGS.modern.atmosphere,
        transparent: true,
        opacity: 0.14,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      });
      this.atmosMesh = new THREE.Mesh(atmosGeom, atmosMat);
      this.scene.add(this.atmosMesh);

      const haloGeom = new THREE.SphereGeometry(10.85, 32, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: PALEO_CONFIGS.modern.halo,
        transparent: true,
        opacity: 0.06,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      });
      this.haloMesh = new THREE.Mesh(haloGeom, haloMat);
      this.scene.add(this.haloMesh);

      // Marcadores de ocorrências
      this.markersGroup = new THREE.Group();
      this.globeGroup.add(this.markersGroup);

      // Iluminação balanceada
      const ambient = new THREE.AmbientLight(0xdbeafe, 0.92);
      this.scene.add(ambient);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.78);
      dirLight.position.set(22, 16, 26);
      this.scene.add(dirLight);

      const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.35);
      rimLight.position.set(-20, -10, -18);
      this.scene.add(rimLight);

      // Campo estelar sutil
      const starPositions = [];
      const starCount = this.isSoftwareGl ? 140 : 320;
      for (let i = 0; i < starCount; i++) {
        const r = 65 + Math.random() * 45;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        starPositions.push(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        );
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0x94a3b8,
        size: 0.45,
        transparent: true,
        opacity: 0.55
      });
      this.scene.add(new THREE.Points(starGeo, starMat));

      this.raycaster = new THREE.Raycaster();
      this.mouseNdc = new THREE.Vector2();

      this.bindControls(container, canvas);
      this.startLoop();
      this.resize();
      return true;
    },

    bindControls(container, canvas) {
      if (this.controlsBound) return;
      this.controlsBound = true;

      canvas.addEventListener('pointerdown', (e) => {
        this.isDragging = true;
        this.autoRotate = false;
        this.prevPointer = { x: e.clientX, y: e.clientY };
        const toggleBtn = document.getElementById('btnToggleGlobeRotate');
        if (toggleBtn) toggleBtn.textContent = '▶️';
      });

      window.addEventListener('pointermove', (e) => {
        if (this.isDragging && this.globeGroup) {
          const dx = e.clientX - this.prevPointer.x;
          const dy = e.clientY - this.prevPointer.y;
          this.targetRotY += dx * 0.008;
          this.targetRotX = Math.max(-1.25, Math.min(1.25, this.targetRotX + dy * 0.008));
          this.prevPointer = { x: e.clientX, y: e.clientY };
        }
      });

      window.addEventListener('pointerup', () => {
        this.isDragging = false;
      });

      canvas.addEventListener('mousemove', (e) => {
        if (this.isDragging || !this.raycaster || !this.camera || this.interactiveMarkers.length === 0) return;
        const rect = canvas.getBoundingClientRect();
        this.mouseNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouseNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseNdc, this.camera);
        const hits = this.raycaster.intersectObjects(this.interactiveMarkers, false);
        const tooltip = document.getElementById('globe3dTooltip');
        if (!tooltip) return;

        if (hits.length > 0) {
          const d = hits[0].object.userData;
          tooltip.innerHTML = `<strong>${d.locality || d.country}</strong><br><small>${d.country || ''} ${d.formation ? '• ' + d.formation : ''}</small>`;
          tooltip.style.left = `${Math.min(rect.width - 170, Math.max(10, e.clientX - rect.left + 12))}px`;
          tooltip.style.top = `${Math.max(10, e.clientY - rect.top - 48)}px`;
          tooltip.classList.remove('hidden');
          canvas.style.cursor = 'pointer';
        } else {
          tooltip.classList.add('hidden');
          canvas.style.cursor = 'grab';
        }
      });

      canvas.addEventListener('mouseleave', () => {
        const tooltip = document.getElementById('globe3dTooltip');
        if (tooltip) tooltip.classList.add('hidden');
      });

      canvas.addEventListener('wheel', (e) => {
        if (!this.camera) return;
        e.preventDefault();
        const nextZ = this.camera.position.z + e.deltaY * 0.015;
        this.camera.position.z = Math.max(15, Math.min(40, nextZ));
      }, { passive: false });

      const btnToggle = document.getElementById('btnToggleGlobeRotate');
      if (btnToggle) {
        btnToggle.addEventListener('click', () => {
          this.autoRotate = !this.autoRotate;
          btnToggle.textContent = this.autoRotate ? '⏸️' : '▶️';
        });
      }

      const btnFocus = document.getElementById('btnFocusGlobeSpecimen');
      if (btnFocus) {
        btnFocus.addEventListener('click', () => {
          if (this.primaryPoint) {
            this.flyTo(this.primaryPoint.lat, this.primaryPoint.lng);
          }
        });
      }

      const btnReset = document.getElementById('btnResetGlobe');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          this.autoRotate = true;
          this.targetRotX = 0.2;
          if (this.camera) this.camera.position.z = 27.5;
          if (btnToggle) btnToggle.textContent = '⏸️';
        });
      }

      const paleoBar = document.getElementById('globePaleoSwitcher');
      if (paleoBar) {
        paleoBar.addEventListener('click', (e) => {
          const btn = e.target.closest('[data-paleo-mode]');
          if (!btn) return;
          const mode = btn.getAttribute('data-paleo-mode');
          this.setPaleoMode(mode);
        });
      }

      window.addEventListener('resize', () => this.resize());
    },

    setPaleoMode(modeKey) {
      const cfg = PALEO_CONFIGS[modeKey] || PALEO_CONFIGS.modern;
      this.currentMode = cfg.id;

      // Atualiza botões de paleocontinentes
      document.querySelectorAll('#globePaleoSwitcher [data-paleo-mode]').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-paleo-mode') === cfg.id);
      });

      const modeCaption = document.getElementById('globePaleoCaption');
      if (modeCaption) {
        modeCaption.textContent = cfg.subtitle;
      }

      if (!this.earthMat || typeof window.THREE === 'undefined') return;

      const oldTex = this.currentTexture;
      const newTex = createPaleoTexture(cfg.id, this.isSoftwareGl);
      this.earthMat.map = newTex;
      this.earthMat.needsUpdate = true;
      this.currentTexture = newTex;

      if (oldTex && typeof oldTex.dispose === 'function') {
        oldTex.dispose();
      }

      if (this.atmosMesh && this.atmosMesh.material) {
        this.atmosMesh.material.color.setHex(cfg.atmosphere);
      }
      if (this.haloMesh && this.haloMesh.material) {
        this.haloMesh.material.color.setHex(cfg.halo);
      }
    },

    clearMarkers() {
      if (!this.markersGroup) return;
      while (this.markersGroup.children.length > 0) {
        const child = this.markersGroup.children[0];
        this.markersGroup.remove(child);
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      }
      this.interactiveMarkers = [];
    },

    plotOccurrences(occurrences, era) {
      if (!this.markersGroup || typeof window.THREE === 'undefined') return;
      const THREE = window.THREE;
      this.clearMarkers();

      const cfg = PALEO_CONFIGS[this.currentMode] || PALEO_CONFIGS.modern;
      const pinHex = era === 'contemporaneo' ? 0x10b981 : cfg.markerColor;

      occurrences.forEach((occ, idx) => {
        const pos = latLngToVector3(occ.lat, occ.lng, 10.14);

        // Esfera núcleo brilhante
        const coreGeo = new THREE.SphereGeometry(idx === 0 ? 0.32 : 0.24, 14, 14);
        const coreMat = new THREE.MeshBasicMaterial({ color: idx === 0 ? 0xfef08a : pinHex });
        const core = new THREE.Mesh(coreGeo, coreMat);
        core.position.copy(pos);
        core.userData = occ;
        this.markersGroup.add(core);
        this.interactiveMarkers.push(core);

        // Anel pulsante orientado na normal da superfície
        const ringGeo = new THREE.RingGeometry(0.38, 0.56, 20);
        const ringMat = new THREE.MeshBasicMaterial({
          color: pinHex,
          transparent: true,
          opacity: 0.78,
          side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(latLngToVector3(occ.lat, occ.lng, 10.18));
        ring.lookAt(ring.position.clone().multiplyScalar(2));
        ring.userData = { isPulseRing: true, phase: idx * 0.8 };
        this.markersGroup.add(ring);

        // Coluna luminosa vertical
        const beamHeight = idx === 0 ? 1.45 : 0.95;
        const beamGeo = new THREE.CylinderGeometry(0.04, 0.09, beamHeight, 8);
        const beamMat = new THREE.MeshBasicMaterial({
          color: pinHex,
          transparent: true,
          opacity: 0.65
        });
        const beam = new THREE.Mesh(beamGeo, beamMat);
        const normal = pos.clone().normalize();
        beam.position.copy(pos.clone().add(normal.clone().multiplyScalar(beamHeight / 2)));
        beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
        this.markersGroup.add(beam);
      });
    },

    flyTo(lat, lng) {
      const targetY = -((lng + 90) * (Math.PI / 180));
      const targetX = Math.max(-1.1, Math.min(1.1, lat * (Math.PI / 180) * 0.75));
      this.targetRotY = targetY;
      this.targetRotX = targetX;
      this.autoRotate = false;
      const toggleBtn = document.getElementById('btnToggleGlobeRotate');
      if (toggleBtn) toggleBtn.textContent = '▶️';

      const hud = document.getElementById('globeHudCoords');
      if (hud) {
        const ns = lat >= 0 ? 'N' : 'S';
        const ew = lng >= 0 ? 'E' : 'W';
        hud.textContent = `Coord: ${Math.abs(lat).toFixed(2)}° ${ns}, ${Math.abs(lng).toFixed(2)}° ${ew}`;
      }
    },

    async updateForSpecimen(specimen, occurrences, sourceLabel) {
      const loadingEl = document.getElementById('globe3dLoading');
      const locEl = document.getElementById('globeSpecLocality');
      const badgeEl = document.getElementById('globeDatasetBadge');
      const countEl = document.getElementById('globeOccurrencesBadge');
      const pointsList = document.getElementById('globePointsList');

      if (locEl) locEl.textContent = specimen.fossil_locations || 'Distribuição Biogeográfica Global';
      if (badgeEl) {
        badgeEl.textContent = sourceLabel || (specimen.is_contemporary ? 'GBIF Vivente' : 'Fóssil PBDB');
      }

      const ready = await this.init();
      if (loadingEl) loadingEl.classList.add('hidden');
      if (!ready) return;

      // Auto-seleciona o mapa paleocontinental correspondente à era do espécime
      const recommendedMode = this.autoModeForEra(specimen.era);
      this.setPaleoMode(recommendedMode);

      const safeOcc = Array.isArray(occurrences) && occurrences.length > 0
        ? occurrences
        : [{ lat: 15, lng: 10, locality: specimen.fossil_locations || 'Registro Global', country: 'Global' }];

      this.primaryPoint = safeOcc[0];
      this.plotOccurrences(safeOcc, specimen.era);

      if (countEl) {
        countEl.textContent = `${safeOcc.length} ${safeOcc.length === 1 ? 'ponto' : 'pontos'}`;
      }

      if (pointsList) {
        pointsList.innerHTML = '';
        safeOcc.slice(0, 12).forEach((occ, idx) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `globe-point-tag ${idx === 0 ? 'active' : ''}`;
          btn.innerHTML = `
            <span class="point-dot"></span>
            <span class="point-name">${occ.locality || occ.country}</span>
            <small class="point-country">${occ.country || ''}</small>
          `;
          btn.addEventListener('click', () => {
            pointsList.querySelectorAll('.globe-point-tag').forEach((t) => t.classList.remove('active'));
            btn.classList.add('active');
            this.flyTo(occ.lat, occ.lng);
          });
          pointsList.appendChild(btn);
        });
      }

      this.flyTo(this.primaryPoint.lat, this.primaryPoint.lng);
    },

    startLoop() {
      if (this.animId) return;
      this.lastTime = performance.now();

      const tick = (now) => {
        this.animId = requestAnimationFrame(tick);
        const dt = Math.min((now - this.lastTime) / 1000, 0.1);
        this.lastTime = now;

        if (this.globeGroup) {
          if (this.autoRotate && !this.isDragging) {
            this.targetRotY += dt * 0.22;
          }
          // Exponential damping frame-rate independent
          const damp = 1 - Math.exp(-6.5 * dt);
          this.globeGroup.rotation.y += (this.targetRotY - this.globeGroup.rotation.y) * damp;
          this.globeGroup.rotation.x += (this.targetRotX - this.globeGroup.rotation.x) * damp;
        }

        if (this.markersGroup) {
          const t = now * 0.003;
          for (let i = 0; i < this.markersGroup.children.length; i++) {
            const child = this.markersGroup.children[i];
            if (child.userData && child.userData.isPulseRing) {
              const s = 1 + 0.35 * Math.sin(t + child.userData.phase);
              child.scale.set(s, s, 1);
            }
          }
        }

        if (this.renderer && this.scene && this.camera) {
          this.renderer.render(this.scene, this.camera);
        }
      };

      this.animId = requestAnimationFrame(tick);
    },

    pause() {
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    },

    resize() {
      const container = document.getElementById('globe3dContainer');
      if (!container || !this.renderer || !this.camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 20 && h > 20) {
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
      }
    }
  };

  window.BioAtlasGlobe3D = engine;
})();
