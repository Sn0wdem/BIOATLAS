# 🌍 Enciclopédia Paleontológica Global da Vida na Terra

> Uma plataforma paleontológica moderna, interativa e de alta performance desenvolvida com **Python**, **FastAPI**, **SQLite**, **Paleobiology Database (PBDB)**, **Wikimedia Commons** e **Leaflet.js**, cobrindo **TODAS as eras geológicas da história da Terra**: do **Pré-Cambriano ao Quaternário** (635 milhões de anos ao presente).

---

## 🌟 Visão Geral & Novidades da Versão 2.0 (FastAPI)

1. **Reescrita Completa com Python & FastAPI**:
   - Backend robusto e assíncrono com Uvicorn e HTTPX.
   - Banco de dados relacional **SQLite** com inicialização e semeadura automática.
   - Ingestão server-side com *User-Agent* em conformidade científica, eliminando problemas de CORS e limites de taxa de requisições de navegadores.

2. **Expansão para TODAS as Eras da Terra**:
   - 🦠 **Pré-Cambriano / Ediacarano (635 a 541 Ma)**: A origem dos primeiros organismos multicelulares complexos (*Dickinsonia, Charnia, Spriggina, Kimberella*).
   - 🦐 **Paleozoico (541 a 252 Ma)**: A Explosão Cambriana, peixes couraçados, os primeiros tetrápodes na terra firme, artrópodes gigantes e ancestrais sinapsídeos (*Anomalocaris, Opabinia, Dunkleosteus, Tiktaalik, Meganeura, Arthropleura, Dimetrodon, Gorgonops*).
   - 🦖 **Mesozoico (252 a 66 Ma)**: A Era dos Dinossauros, Pterossauros gigantes e répteis marinhos pelágicos (*Tyrannosaurus, Spinosaurus, Triceratops, Velociraptor, Brachiosaurus, Quetzalcoatlus, Mosasaurus*).
   - 🦣 **Cenozoico (66 Ma ao Presente)**: A Era dos Mamíferos Gigantes, serpentes colossais, caimões amazônicos e a megafauna da Idade do Gelo (*Titanoboa, Basilosaurus, Otodus megalodon, Purussaurus, Smilodon, Mammuthus primigenius, Megatherium*).

3. **Representações Visuais de Como Eram em Vida (Paleoarte)**:
   - Algoritmo que prioriza e busca ilustrações científicas de *life restoration* (pele, escamas, penas, musculatura e habitat natural) em vez de simples fotos de ossos desarticulados de museu.
   - Galeria rica com múltiplas reconstruções por espécime e visualizador *Lightbox* em tela cheia.

4. **Wiki Paleontológica Própria (100% Integrada, Sem Redirecionamentos)**:
   - Ficha técnica biométrica completa (comprimento, altura, massa, velocidade estimada, força de mordida em Newtons, etimologia e curiosidades marcantes).
   - Nunca redireciona para links externos da Wikipedia.

5. **🔬 Modo Paleontólogo / Especialista (Detalhes Complexos)**:
   - Cladograma filogenético interativo em árvore taxonômica.
   - Osteologia e morfometria craniana detalhada.
   - Biomecânica, cinemática de mordida e Análise de Elementos Finitos (FEA).
   - Histologia óssea, linhas de crescimento arrestado (LAGs) e tafonomia sedimentar.

6. **🗺️ Mapa Fóssil Global Interativo (PBDB + Leaflet.js)**:
   - Mapeamento em tempo real de coordenadas georreferenciadas dos sítios de escavação onde os fósseis da espécie foram realmente descobertos no planeta.

7. **⚡ Ingestão Automática de QUALQUER Espécime de Qualquer Época**:
   - Digite qualquer gênero fóssil no buscador e clique em **"Subir Espécime"** ou busque diretamente. O backend Python consulta a PBDB e a Wikimedia Action API, monta a ficha biométrica, compila o cladograma e salva no SQLite.

---

## 📂 Estrutura do Projeto

```plaintext
mesozoico-explorer/
├── app/
│   ├── __init__.py            # Inicializador do pacote
│   ├── main.py                # Aplicação FastAPI, rotas da API e montagem estática
│   ├── models.py              # Esquemas de dados Pydantic (Specimen, Era, Occurrence, etc.)
│   ├── database.py            # Camada SQLite, persistência e consultas filtradas
│   ├── seed_data.py           # Catálogo inicial de 25+ espécimes icônicos de todas as eras
│   ├── services/
│   │   ├── __init__.py
│   │   ├── pbdb_service.py    # Cliente da Paleobiology Database (táxons e ocorrências)
│   │   └── wiki_service.py    # Cliente Wikimedia Commons (paleoarte) e Wikipedia (dossiês)
│   └── static/                # Frontend responsivo
│       ├── index.html         # Interface com seletor de eras, busca e modais
│       ├── style.css          # Tema dark fóssil com paletas cromáticas por era
│       └── app.js             # Controlador JavaScript assíncrono conectado à API
├── venv/                      # Ambiente virtual Python
├── Dockerfile                 # Contêiner Python 3.11-slim com FastAPI e Uvicorn
├── docker-compose.yml         # Orquestração do container na porta 8000
├── requirements.txt           # Dependências Python (fastapi, uvicorn, httpx, pydantic)
└── README.md                  # Documentação completa
```

---

## 🚀 Como Executar o Projeto

Você pode rodar a aplicação de duas formas simples: diretamente com **Python** local ou via **Docker**.

### Opção 1: Execução Local com Python (Recomendado para Desenvolvimento)

1. **Crie e ative o ambiente virtual:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Inicie o servidor FastAPI com Uvicorn:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

4. **Acesse a aplicação no navegador:**
   - 🌐 **Interface Web:** [http://localhost:8000](http://localhost:8000)
   - 📚 **Documentação Interativa Swagger (OpenAPI):** [http://localhost:8000/docs](http://localhost:8000/docs)
   - 📖 **Documentação Redoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

### Opção 2: Execução com Docker & Docker Compose

Certifique-se de que o Docker esteja instalado e em execução no seu sistema.

1. **Suba o contêiner com build automático:**
   ```bash
   docker compose up --build
   ```

2. **Para rodar em segundo plano (modo daemon):**
   ```bash
   docker compose up -d
   ```

3. **Acesse no navegador:**
   - [http://localhost:8000](http://localhost:8000)

4. **Para parar o contêiner:**
   ```bash
   docker compose down
   ```

---

## 📡 Endpoints da API REST (FastAPI)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/` | Serve a interface web completa (`index.html`) |
| `GET` | `/api/eras` | Retorna metadados das 4 eras geológicas (nome, período, cor, criaturas) |
| `GET` | `/api/specimens` | Lista espécimes com filtros (`era`, `period`, `diet`, `group`, `search`) |
| `GET` | `/api/specimens/{id}` | Retorna detalhes biométricos, biológicos e cladísticos de um espécime |
| `POST` | `/api/ingest` | Ingestão automática de qualquer espécime por nome científico via PBDB + Wikimedia |
| `GET` | `/api/discover` | Retorna sugestões aleatórias ou curadas de uma era para exploração rápida |
| `GET` | `/api/occurrences/{taxon}` | Coordenadas georreferenciadas da PBDB para o mapa Leaflet |
| `GET` | `/api/proxy-image?url=...` | Proxy e cache de imagens Wikimedia com cabeçalho seguro |
| `GET` | `/api/stats` | Estatísticas gerais do acervo (contagem por era, dieta e grupo) |

---

## 🏛️ Acervo Científico Pré-Catalogado

A aplicação já vem pré-alimentada no SQLite com espécimes fundamentais de todas as eras:

| Era Geológica | Período | Espécimes Pré-Semeados |
|---|---|---|
| **Pré-Cambriano** | Ediacarano (635–541 Ma) | *Dickinsonia costata*, *Charnia masoni*, *Spriggina floundersi* |
| **Paleozoico** | Cambriano, Devoniano, Carbonífero, Permiano (541–252 Ma) | *Anomalocaris*, *Opabinia*, *Dunkleosteus*, *Tiktaalik*, *Meganeura*, *Arthropleura*, *Dimetrodon*, *Gorgonops* |
| **Mesozoico** | Triássico, Jurássico, Cretáceo (252–66 Ma) | *Tyrannosaurus rex*, *Spinosaurus*, *Triceratops*, *Brachiosaurus*, *Velociraptor*, *Quetzalcoatlus*, *Mosasaurus* |
| **Cenozoico** | Paleógeno, Neógeno, Quaternário (66 Ma–Presente) | *Titanoboa*, *Basilosaurus*, *Otodus megalodon*, *Purussaurus*, *Smilodon*, *Mammuthus primigenius*, *Megatherium* |

---

## 🔬 Fontes de Dados Científicos

- **[Paleobiology Database (PBDB)](https://paleobiodb.org/):** Base de dados paleontológica global mantida por paleontólogos internacionais com registros estratigráficos e coordenadas georreferenciadas de espécimes fósseis.
- **[Wikimedia Commons](https://commons.wikimedia.org/):** Acervo livre de paleoarte e representações visuais anatômicas sob licenças Creative Commons.
- **[Wikipedia REST API](https://www.mediawiki.org/wiki/API:REST_API):** Dossiês textuais científicos e etimológicos em português e inglês.
