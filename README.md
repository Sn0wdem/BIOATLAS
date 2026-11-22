# 🌍 BioAtlas — Atlas Global de Biodiversidade e Paleontologia

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Tyrannosaurus_rex_by_mariolanzas.jpg/960px-Tyrannosaurus_rex_by_mariolanzas.jpg" alt="BioAtlas Banner" width="720" />
</p>

<p align="center">
  <strong>Plataforma Interativa Universal da História Biológica da Terra</strong><br>
  <em>Da Vida Microbiológica e Fósseis Pré-Cambrianos à Fauna Contemporânea (3.800 Ma — Presente)</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Three.js-r128-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/GBIF_%7C_PBDB_%7C_OpenAlex-Dados_Abertos-0EA5E9?style=for-the-badge" alt="Dados Abertos" />
</p>

---

## 🌟 Visão Geral

O **BioAtlas** é uma plataforma web full-stack de biodiversidade e paleontologia projetada para dois públicos complementares:

- **Modo Explorador**: pensado para crianças, estudantes e curiosos — com atmosfera visual viva que muda conforme o bioma, comparador visual de escala em silhueta, sons reais da natureza (bioacústica), curiosidades e campanha interativa de Quiz com 50 níveis.
- **Modo Pesquisador**: pensado para biólogos, professores e paleontólogos — com bancada analítica em tempo real (regressão alométrica log-log, matriz Era × Habitat, calculadora cladística MRCA, tabela morfométrica ordenável), modelagem biofísica (Lei de Kleiber e Lei Quadrado-Cubo), ocorrências georreferenciadas GBIF/PBDB, artigos revisados por pares (OpenAlex/Crossref) e exportação de citações acadêmicas.

O sistema conta com um **motor de ingestão científica em tempo real** via Server-Sent Events (SSE) que consulta **Wikipédia**, **GBIF**, **PBDB** e **Wikimedia Commons** com validação biológica estrita (rejeitando personagens fictícios ou termos não biológicos) e garantindo cobertura fotográfica rica para cada espécime.

---

## ✨ Principais Funcionalidades

### 🎨 1. Biomas Vivos, Comparador de Escala & Bioacústica
- **Atmosfera Dinâmica por Habitat**: a paleta da interface e dos dossiês se adapta automaticamente ao ambiente natural selecionado (*Aquáticos & Oceanos*, *Florestas & Savanas*, *Céus & Aéreos*, *Anfíbios & Costas*, *Abissal & Primordial* e *Mundo Microscópico*).
- **Comparador Visual de Escala em Silhueta (SVG)**: compara proporcionalmente o tamanho real do organismo frente a um ser humano adulto (1,75 m), carro ou ônibus escolar, além de um comparador científico lado a lado para até **3 espécimes simultâneos**.
- **Bioacústica (Sons Reais da Natureza)**: player de áudio discreto dentro do dossiê que reproduz vocalizações e cantos reais (ex.: baleia-azul, onça-pintada, aves, anfíbios) obtidos da Wikimedia Commons via proxy seguro.
- **Selo Oficial da Lista Vermelha (IUCN)**: exibe o grau real de conservação das espécies contemporâneas (`LC`, `NT`, `VU`, `EN`, `CR`, `EW`, `EX`, `DD`).

### 📸 2. Galeria Científica Rica (10+ Fotos por Espécime) & Lightbox
- Cada espécime possui curadoria de **pelo menos 10 imagens** em alta resolução (960px+), abrangendo representações em vida/paleoarte, fotos reais, esqueletos montados, crânios/dentição, fósseis e diagramas anatômicos.
- **Visualizador Lightbox em Tela Cheia** com filtros por categoria (*Todas*, *Em Vida*, *Esqueleto*, *Crânio*, *Fósseis*), fita inferior de miniaturas (*filmstrip*), atalhos de teclado (`←`, `→`, `Esc`) e gesto de **arrastar (swipe)** em telas sensíveis ao toque.

### 🌐 3. Globo 3D Paleogeográfico (Three.js)
- Globo interativo renderizado em WebGL com **4 reconstruções paleocontinentais** selecionadas automaticamente pela era do espécime:
  - **Atual (0 Ma)** · **Mesozoico (110 Ma — Laurásia & Gondwana)** · **Pangeia (250 Ma)** · **Paleozoico (500 Ma)**.
- Projeção 3D de coordenadas reais de ocorrências (**GBIF** para espécies atuais e **PBDB** para fósseis), animação orbital *Fly-To*, marcadores pulsantes interativos, zoom por scroll ou **pinça (dois dedos)** no mobile e inspeção de localidades por toque ou mouse.

### 🔬 4. Modo Pesquisador & Laboratório Científico
- **Bancada Analítica no Catálogo**:
  - **KPIs Estatísticos em Tempo Real** do recorte filtrado (táxons, mediana de comprimento/massa, abrangência temporal e registros mapeados).
  - **Regressão Alométrica Log-Log Interativa**: gráfico SVG $\log_{10}(\text{Comprimento}) \times \log_{10}(\text{Massa})$ com ajuste por mínimos quadrados ($M \approx a \cdot L^b$, $R^2$), legenda por era e inspetor interativo de extremos.
  - **Matriz Empírica Era × Habitat (Heatmap)**: células clicáveis que filtram instantaneamente o catálogo na combinação escolhida.
  - **Calculadora de Parentesco Cladístico (MRCA)**: compara dois táxons quaisquer do acervo para identificar o Ancestral Comum Mais Recente, ramos divergentes e razão morfométrica.
  - **Tabela Morfométrica Ordenável**: alternância entre Grade de Cards e Tabela Científica com exportação direta em **CSV**, **TSV** (Excel/R/Python) e **JSON**.
- **Dossiê Científico Avançado (`Taxonomia & Cladística`)**:
  - **Matriz Taxonômica Completa** com links diretos para **GBIF**, **PBDB**, **Catalogue of Life**, **NCBI**, **IUCN** e **Google Scholar**.
  - **Perfil Morfométrico Comparado (Radar SVG de 5 eixos)** frente à mediana do acervo.
  - **Biofísica Alométrica & Simulador Quadrado-Cubo**: cálculo de taxa metabólica basal (Lei de Kleiber), energia cinética, robustez e simulador interativo de escala isométrica ($L \times k$).
  - **Cladograma Filogenético Clicável**, Osteologia, Biomecânica e Histologia.
  - **Tabela Real de Ocorrências GBIF/PBDB** com envelope latitudinal e exportação em **CSV** e **GeoJSON**.
  - **Literatura Científica Revisada por Pares** consultada ao vivo via **OpenAlex** e **Crossref** (com DOI oficial, contagem de citações, ordenação por *Mais Citados* / *Mais Recentes* e cópia rápida de citação em **ABNT** e **BibTeX**).

### 🏆 5. Modo Quiz — Campanha Progressiva de 50 Níveis & E-mail Automático (Gmail)
- **4 Níveis de Dificuldade Desbloqueados em Sequência**: todos os exploradores começam obrigatoriamente pelo **Fácil**, avançando sequencialmente até **Médio**, **Difícil** e **Especialista**.
- **50 Níveis Progressivos e 10 Rankings Exclusivos por Dificuldade**: cada faixa de dificuldade possui nomenclatura própria para os seus 10 rankings, número crescente de perguntas proporcional à dificuldade e sistema de estrelas e conquistas sincronizadas na conta do usuário.
- **Notificações Automáticas de Parabéns via Gmail API**: uma vez conectada a conta Google (escopo `gmail.send` mantido apenas em memória), cada etapa superada (Etapa 01, Etapa 02, ..., Etapa 50) dispara automaticamente um e-mail personalizado celebrando a conquista e incentivando a próxima fase.

### 🧭 6. Ferramentas de Estudo, Descoberta & Conta Google (Firebase)
- **Linha do Tempo Geológica Interativa (3.800 Ma – Presente)** com filtros rápidos para as **5 Grandes Extinções em Massa** (Ordoviciano, Devoniano, Permiano-Triássico, Triássico-Jurássico e K-Pg).
- **Árvore da Vida Interativa**: visualização hierárquica panorâmica por clados evolutivos com expansão/recolhimento e abertura direta do dossiê.
- **Busca Inteligente com Autocomplete**: sugestões instantâneas com miniatura, habitat e época, atalho para catalogação via API e validação rigorosa de nomes biológicos reais.
- **Links Compartilháveis**: sincronização de URL (`?especime=...`, `?habitat=...`, `?modo=researcher`) para compartilhar fichas e recortes diretamente em aulas e trabalhos.
- **Caderno de Campo, Favoritos & Coleções**: anotações pessoais por espécime, favoritos e coleções temáticas sincronizadas em tempo real no **Firebase Firestore** (com fallback local quando desconectado).
- **Exportação & Citações**: geração de ficha pronta para **Impressão/PDF**, **JSON**, **CSV** e citações formatadas em **ABNT**, **APA** e **BibTeX**.

### 📱 7. Versão Mobile Touch-First
- **Navegação Inferior Fixa** (`≤ 860px`) na zona do polegar (*Explorar*, *Quiz*, *Favoritos*, *Coleções* e *Mais*) + **Bottom Sheet** deslizante com atalhos rápidos.
- Carrosséis horizontais deslizáveis para biomas, eras, extinções e ferramentas do dossiê.
- Modais adaptados em formato **bottom sheet** em tela quase cheia, alvos de toque ergonômicos (`≥ 44px`), suporte a `safe-area-inset`, swipe na galeria e pinça para zoom no globo 3D.

---

## 🏛️ Eras Geológicas Cobertas

| Era | Intervalo Geológico | Exemplos de Organismos no Acervo |
|---|---|---|
| **Contemporâneo** | Holoceno / Atualidade (0 Ma) | *Balaenoptera musculus* (Baleia-Azul), *Carcharodon carcharias* (Tubarão-Branco), *Panthera onca* (Onça-Pintada), *Orcinus orca* (Orca), *Octopus vulgaris* (Polvo-Comum) |
| **Cenozoico** | Paleógeno ao Pleistoceno (66 – 0,01 Ma) | *Smilodon populator*, *Mammuthus primigenius*, *Otodus megalodon*, *Titanoboa cerrejonensis*, *Purussaurus brasiliensis* |
| **Mesozoico** | Triássico, Jurássico e Cretáceo (252 – 66 Ma) | *Tyrannosaurus rex*, *Spinosaurus aegyptiacus*, *Triceratops horridus*, *Velociraptor mongoliensis*, *Mosasaurus*, *Quetzalcoatlus*, *Brachiosaurus* |
| **Paleozoico** | Cambriano ao Permiano (541 – 252 Ma) | *Anomalocaris canadensis*, *Dunkleosteus terrelli*, *Tiktaalik roseae*, *Meganeura monyi*, *Arthropleura armata*, *Dimetrodon limbatus* |
| **Pré-Cambriano** | Arqueano ao Ediacarano (3.800 – 541 Ma) | *Estromatólitos (Cyanobacteria)*, *Dickinsonia costata*, *Charnia masoni*, *Spriggina floundersi* |
| **Microbiológico** | Todas as Épocas | *Milnesium tardigradum* (Tardígrado), *Paramecium caudatum*, *Amoeba proteus*, *Pithovirus sibericum* |

---

## 🗂️ Estrutura do Projeto

```text
.
├── server.ts                      # Servidor Express (porta 3000) e rotas da API REST / SSE
├── src/
│   ├── client/
│   │   └── firebaseClient.ts      # SDK Firebase (Auth, Firestore) + envio Gmail API (bundled via esbuild)
│   ├── services/
│   │   ├── knowledgeEngine.ts     # Orquestrador de ingestão científica e validação biológica
│   │   ├── wikiService.ts         # Consulta Wikipédia, Wikimedia Commons e Bioacústica
│   │   ├── gbifService.ts         # Backbone Taxonomy e ocorrências GBIF
│   │   ├── pbdbService.ts         # Dados estratigráficos e ocorrências fósseis PBDB
│   │   └── imageProxyCache.ts     # Proxy e cache de imagens científicas
│   ├── eras.ts                    # Metadados das eras geológicas
│   ├── store.ts                   # Catálogo em memória + sincronização de espécimes catalogados
│   └── types.ts                   # Definições TypeScript compartilhadas
├── public/
│   ├── index.html                 # Interface principal (Desktop + Navegação Mobile)
│   ├── style.css                  # Design system por bioma, Modo Pesquisador e responsividade mobile
│   ├── app.js                     # Lógica da interface, bancada científica, Quiz 50 níveis e mobile UX
│   ├── globe3d.js                 # Engine Three.js do Globo 3D Paleogeográfico (mouse + toque/pinça)
│   ├── firebase-bundle.js         # Bundle gerado a partir de src/client/firebaseClient.ts
│   └── embedded_catalog.json      # Catálogo embutido de fallback
├── firestore.rules                # Regras de segurança do Cloud Firestore
├── firebase-blueprint.json        # Esquema de coleções e entidades Firestore
├── package.json
├── Dockerfile
└── docker-compose.yml
```

---

## 📡 API REST & Streaming

```text
GET  /                              -> Interface Web Principal (Desktop & Mobile)
GET  /api/eras                      -> Metadados e limites temporais das eras geológicas
GET  /api/specimens                 -> Catálogo filtrável (habitat, era, período, dieta, grupo, esqueleto, clado, busca)
POST /api/specimens/sync            -> Sincronização de espécimes customizados catalogados
GET  /api/specimens/:identifier     -> Dossiê completo do espécime (biometria, galeria 10+ fotos, cladograma, osteologia)
POST /api/ingest                    -> Ingestão científica validada via Wikipédia, GBIF, PBDB e Wikimedia
GET  /api/ingest-stream             -> Ingestão científica em tempo real via Server-Sent Events (4 etapas)
GET  /api/discover                  -> Sorteador aleatório de espécies (geral ou por era)
GET  /api/occurrences/:taxon_name   -> Coordenadas georreferenciadas reais (GBIF / PBDB) para o Globo 3D e tabela
GET  /api/bioacoustics/:taxon_name  -> Gravações reais de sons da natureza (Wikimedia Commons)
GET  /api/proxy-image               -> Proxy seguro com cache para imagens científicas de alta resolução
GET  /api/proxy-audio               -> Proxy seguro com suporte a Range para streaming de bioacústica
GET  /api/research/:taxon_name      -> Artigos científicos revisados por pares com DOI (OpenAlex + Crossref)
GET  /api/stats                     -> Estatísticas globais do acervo
```

---

## 🚀 Como Executar

### Pré-requisitos
- **Node.js 22+** (com `npm`)
- Navegador moderno com suporte a **WebGL** (Chrome, Edge, Firefox, Safari)

### 1. Instalação e Build

```bash
# Instalar dependências
npm install

# Gerar bundle do cliente Firebase e validar TypeScript
npm run build
```

### 2. Iniciar em Desenvolvimento

```bash
npm run dev
```

Ou em produção:

```bash
npm start
```

Acesse a aplicação em **[http://localhost:3000](http://localhost:3000)** (a porta pode ser configurada via variável `PORT` em `.env`, conforme `.env.example`).

### 3. Verificação de Tipos e Regras Firestore

```bash
npm run lint
```

### 4. Execução com Docker Compose

```bash
docker compose up --build
```

---

## 🛠️ Tecnologias & Fontes Científicas

- **Backend**: Node.js, TypeScript, Express 5, CORS, Server-Sent Events (SSE)
- **Frontend**: HTML5 Semântico, CSS3 responsivo (*touch-first*), JavaScript modular, esbuild
- **3D & Visualização**: Three.js (WebGL, texturas paleocontinentais procedurais, Raycaster) e gráficos científicos SVG nativos
- **Autenticação, Persistência & E-mail**: Firebase Authentication (Google Sign-In), Cloud Firestore e Gmail API (`gmail.send` com token OAuth estritamente em memória)
- **Fontes Científicas Abertas**:
  - [GBIF — Global Biodiversity Information Facility](https://www.gbif.org/)
  - [PBDB — The Paleobiology Database](https://paleobiodb.org/)
  - [Wikimedia Commons](https://commons.wikimedia.org/) & [Wikipedia REST API](https://www.wikipedia.org/)
  - [OpenAlex](https://openalex.org/) & [Crossref](https://www.crossref.org/)

---

## 📄 Licença

Distribuído sob a licença MIT. Dados científicos e mídias abertas são regidos pelas respectivas licenças da GBIF, PBDB, Wikimedia Commons, OpenAlex e Crossref.
