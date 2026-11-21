# 🌍 BioAtlas — Plataforma Global de Biodiversidade e Paleontologia

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Tyrannosaurus_rex_by_mariolanzas.jpg/960px-Tyrannosaurus_rex_by_mariolanzas.jpg" alt="BioAtlas Banner" width="700" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.8);" />
</p>

<p align="center">
  <strong>Catálogo Universal Interativo da História Biológica do Planeta Terra</strong><br>
  <em>Da Vida Microbiológica e Fósseis Pré-Cambrianos à Fauna Contemporânea (635 Ma — Presente)</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Three.js-r128-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/GBIF-Data_Engine-489234?style=for-the-badge" alt="GBIF" />
  <img src="https://img.shields.io/badge/PBDB-Paleobiology-f59e0b?style=for-the-badge" alt="PBDB" />
  <img src="https://img.shields.io/badge/Wikimedia-Commons-006699?style=for-the-badge&logo=wikimedia-commons&logoColor=white" alt="Wikimedia Commons" />
</p>

---

## 🌟 Visão Geral

O **BioAtlas** é uma plataforma zoológica e paleontológica universal de alta performance desenvolvida para catalogar, explorar e visualizar qualquer organismo vivo ou fóssil que já habitou o planeta Terra.

Eliminando a necessidade de cadastros manuais extensos, o sistema conta com um **motor de ingestão científica automática em tempo real** que integra dados das maiores bases abertas de biodiversidade mundial (**GBIF**, **PBDB**, **Wikimedia Commons** e **Wikipédia**).

---

## ✨ Principais Funcionalidades

### 🌐 1. Globo Terrestre 3D Interativo (Three.js)
- Substitui mapas 2D convencionais por um **globo 3D imersivo** acoplado ao lado da ficha biométrica.
- Projeção tridimensional de coordenadas geográficas reais de ocorrências (*lat/lng* para coordenadas de esfera 3D).
- Rotação orbital suave, zoom por roda do mouse, controles de rotação automática e recurso de **"Fly-To"** suave que viaja orbitalmente até o ponto fossilífero ou habitat da espécie.
- Pinos tridimensionais interativos com anéis de pulso de radar e painel de localidades.

### 📸 2. Galeria Interativa com Pop-up Separado por Categorias
- **Pop-up Exclusivo Multivisões:** Ao inspecionar espécimes com rica cobertura fotográfica (como os dinossauros do **Mesozoico com 10 a 12 fotos**), a interface organiza a visualização em um pop-up de tela cheia sem quebrar o layout da ficha técnica.
- **Filtros por Categoria Científica:**
  - 🌿 **Em Vida / Paleoarte:** Reconstituição em vida com tecidos moles, penas, pelagem ou escamas.
  - 🦴 **Esqueleto & Museu:** Esqueletos montados em museus mundiais e articulações anatômicas.
  - 💀 **Crânio & Dentição:** Vistas em alta resolução de dentições especializadas e fenestras cranianas.
  - ⛏️ **Fósseis & Escavação:** Fósseis em rocha, garras, moldes de pele mumificada e diagramas de escala.
- **Fita Inferior de Miniaturas (Filmstrip):** Navegação rápida por miniaturas iluminadas, setas laterais e atalhos de teclado (`←`, `→`, `Esc`).
- **Badges nos Cards:** No catálogo principal, cards com múltiplas fotos exibem o botão direto **`📸 X Fotos`** para abrir o visualizador pop-up instantaneamente.

### 🔬 3. Modo Especialista (Zoologia & Paleontologia Aprofundada)
- Cladogramas filogenéticos completos estruturados a partir da **GBIF Backbone Taxonomy**.
- Textos técnicos de **Osteologia Craniana e Axial**, **Biomecânica de Locomoção** e **Histologia Tecidual**.

### 🦠 4. Cobertura Universal: Da Microbiologia aos Monstros Pré-Históricos
- **Vida Microbiológica:** Bactérias, cianobactérias arqueanas, diatomáceas, vírus gigantes e protozoários límnicos.
- **Invertebrados:** Exoesqueletos de quitina, conchas calcárias, hidroesqueletos e fósseis ediacaranos.
- **Vertebrados:** Endoesqueletos ósseos articulados, vértebras pneumatizadas de dinossauros e peixes cartilaginosos.

---

## 🏛️ Eras Geológicas Cobertas

| Era | Época Geológica | Exemplos de Organismos no Acervo |
|---|---|---|
| **Contemporâneo** | Holoceno / Atualidade (0 Ma) | *Panthera leo* (Leão), *Panthera onca* (Onça-Pintada), *Balaenoptera musculus* (Baleia-Azul), *Aquila chrysaetos* (Águia-Real), *Sphyrna mokarran* (Tubarão-Martelo) |
| **Cenozoico Pré-Histórico** | Paleógeno ao Pleistoceno (66 a 0.01 Ma) | *Smilodon populator* (Tigre Dente-de-Sabre), *Mammuthus primigenius* (Mamute-Lanoso), *Otodus megalodon*, *Titanoboa cerrejonensis*, *Purussaurus brasiliensis* |
| **Mesozoico** | Triássico, Jurássico, Cretáceo (252 a 66 Ma) | *Tyrannosaurus rex*, *Spinosaurus aegyptiacus*, *Triceratops horridus*, *Velociraptor mongoliensis*, *Brachiosaurus altithorax*, *Allosaurus fragilis*, *Stegosaurus stenops*, *Pterodactylus antiquus* |
| **Paleozoico** | Cambriano ao Permiano (541 a 252 Ma) | *Anomalocaris canadensis*, *Dunkleosteus terrelli*, *Tiktaalik roseae*, *Meganeura monyi*, *Arthropleura armata*, *Dimetrodon limbatus* |
| **Pré-Cambriano** | Arqueano ao Ediacarano (3.800 a 541 Ma) | *Estromatólitos (Cyanobacteria)*, *Dickinsonia costata*, *Charnia masoni*, *Spriggina floundersi* |
| **Microbiologia** | Todas as Épocas | *Milnesium tardigradum* (Tardígrado), *Paramecium caudatum*, *Amoeba proteus*, *Pithovirus sibericum* |

---

## 🚀 Como Executar

### Pré-requisitos
- **Python 3.10+**
- Navegador moderno com suporte a WebGL (Chrome, Edge, Firefox, Brave, Safari)

### 1. Inicialização Rápida com Script Automatizado
O script detecta portas disponíveis (8000, 8001, etc.) e abre o navegador automaticamente:

```bash
chmod +x iniciar.sh
./iniciar.sh
```

### 2. Inicialização Manual via Python

```bash
# 1. Ativar o ambiente virtual
source venv/bin/activate

# 2. Instalar dependências se necessário
pip install -r requirements.txt

# 3. Iniciar o servidor com Uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Acesse no navegador:
* 🌍 **Aplicação Web:** [http://localhost:8000](http://localhost:8000) (ou porta indicada no terminal)
* 📚 **Documentação Interativa Swagger:** [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Execução com Docker Compose

```bash
docker compose up --build
```

---

## 📡 Arquitetura da API REST

```
GET  /                             -> Interface Web Principal (HTML5/CSS3/Three.js)
GET  /api/eras                     -> Metadados e limites temporais das 5 grandes eras
GET  /api/specimens                -> Catálogo filtrável (era, período, dieta, grupo, esqueleto, busca)
GET  /api/specimens/{id}           -> Dossiê detalhado (biometria, osteologia, imagens e cladograma)
POST /api/ingest                   -> Ingestão científica inteligente via GBIF, PBDB e Wikimedia
GET  /api/occurrences/{taxon_name} -> Coordenadas 3D georreferenciadas reais de localidades fósseis ou atuais
GET  /api/proxy-image              -> Proxy de transmissão seguro para imagens de alta resolução
GET  /api/discover                 -> Sorteador aleatório de espécies para exploração rápida
GET  /api/stats                    -> Estatísticas globais do acervo
```

---

## 🛠️ Tecnologias Utilizadas

* **Backend:** Python 3.14 / FastAPI / Uvicorn / HTTPX / SQLite
* **Frontend:** HTML5 Semântico / CSS3 Moderno (Glassmorphism & Flexbox/Grid) / JavaScript ES6+
* **Computação Gráfica 3D:** Three.js (WebGL, SphereGeometry, Raycaster, Procedural Textures)
* **Fontes de Dados Científicos:**
  * [GBIF — Global Biodiversity Information Facility](https://www.gbif.org/)
  * [PBDB — The Paleobiology Database](https://paleobiodb.org/)
  * [Wikimedia Commons](https://commons.wikimedia.org/)
  * [Wikipedia REST API](https://www.wikipedia.org/)

---

## 📄 Licença

Distribuído sob a licença MIT. Dados científicos de livre acesso regidos pelos termos da GBIF e Wikimedia Commons.
