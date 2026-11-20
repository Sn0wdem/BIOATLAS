# 🌍 Super Wiki Global da Vida na Terra (Todos os Animais de Todas as Eras)

> Uma plataforma zoológica e paleontológica universal de alta performance desenvolvida com **Python**, **FastAPI**, **SQLite**, **GBIF (Global Biodiversity Information Facility)**, **Paleobiology Database (PBDB)**, **Wikimedia Commons** e **Leaflet.js**, cobrindo **TODAS as espécies do Planeta Terra**: da **Fauna Contemporânea aos Monstros Pré-Históricos** (635 milhões de anos ao presente).

---

## 🌟 Visão Geral & Super Ingestão via APIs

A aplicação funciona como uma **Super Wiki Automática**, eliminando a necessidade de redigir milhares de linhas manualmente para cada espécie. O motor consome e correlaciona múltiplas APIs científicas globais em tempo real:

1. **GBIF (Global Biodiversity Information Facility API):**
   - Identifica qualquer espécie de animal vivo ou fóssil no planeta.
   - Extrai taxonomia biológica completa (Reino, Filo, Classe, Ordem, Família, Gênero e Espécie).
   - Determina se o animal é **Vertebrado** (possui coluna vertebral e crânio) ou **Invertebrado** (artrópodes, moluscos, cnidários, anelídeos, equinodermos).
   - Fornece coordenadas GPS georreferenciadas de observações no globo para alimentar o mapa interativo.

2. **Wikimedia Commons Action API:**
   - Realiza buscas especializadas de alta resolução para minerar múltiplas visões por indivíduo:
     - 🌿 **Indivíduo em Vida / Foto Natural:** Animal vivo em seu habitat ou paleoarte com reconstituição de tecidos moles (pele, penas, escamas, pelagem).
     - 🦴 **Esqueleto, Ossos, Cartilagem ou Exoesqueleto:** Vistas de crânio, esqueleto montado em museus, cartilagens calcificadas (tubarões) ou carapaças e conchas (invertebrados).
     - 🔬 **Anatomia & Diagramas Estruturais:** Cortes anatômicos, órgãos internos, radiografias e escalas biométricas.

3. **Paleobiology Database (PBDB API):**
   - Para espécies extintas e fósseis, extrai datas estratigráficas precisas (em milhões de anos), formações geológicas e sítios mundiais de escavação fóssil.

4. **Wikipedia REST API (PT & EN):**
   - Compila automaticamente a biografia em português, etimologia do nome, biometria estimada (comprimento, massa, velocidade e mordida) e curiosidades marcantes.

---

## 🏛️ Cobertura Completa de Eras & Períodos

| Era | Época / Período | Exemplos de Animais Catalogados |
|---|---|---|
| **Contemporâneo** | Holoceno / Atualidade (0 Ma) | *Panthera onca* (Onça-Pintada), *Balaenoptera musculus* (Baleia-Azul), *Carcharodon carcharias* (Tubarão-Branco), *Octopus vulgaris* (Polvo-Comum), *Loxodonta africana* (Elefante) |
| **Cenozoico Pré-Histórico** | Paleógeno, Neógeno, Pleistoceno (66 a 0.01 Ma) | *Smilodon populator* (Dente-de-Sabre), *Mammuthus primigenius* (Mamute-Lanoso), *Otodus megalodon*, *Titanoboa cerrejonensis*, *Purussaurus*, *Megatherium* |
| **Mesozoico** | Triássico, Jurássico, Cretáceo (252 a 66 Ma) | *Tyrannosaurus rex*, *Spinosaurus*, *Triceratops*, *Brachiosaurus*, *Velociraptor*, *Quetzalcoatlus*, *Mosasaurus* |
| **Paleozoico** | Cambriano, Devoniano, Carbonífero, Permiano (541 a 252 Ma) | *Anomalocaris*, *Opabinia*, *Dunkleosteus*, *Tiktaalik*, *Meganeura*, *Arthropleura*, *Dimetrodon*, *Gorgonops* |
| **Pré-Cambriano** | Ediacarano (635 a 541 Ma) | *Dickinsonia costata*, *Charnia masoni*, *Spriggina floundersi*, *Kimberella* |

---

## 🦴 Classificação Corporal: Vertebrados vs Invertebrados

A Super Wiki classifica a anatomia de cada espécime e exibe na interface:
- **🦴 Vertebrados:**
  - *Endoesqueleto Ósseo Articulado* (Mamíferos, Aves, Répteis, Peixes Ósseos, Dinossauros).
  - *Cartilagem Calcificada sem Ossos Verdadeiros* (Tubarões e Raias - Chondrichthyes).
  - *Esqueleto Ósseo Pneumatizado* (Aves e Pterossauros).
- **🐚 Invertebrados:**
  - *Exoesqueleto Quitinoso Esclerotizado* (Artrópodes, Insetos, Crustáceos, Trilobitas, Arthropleura).
  - *Concha Calcária de Carbonato de Cálcio* (Moluscos bivalves e gastrópodes).
  - *Hidroesqueleto Muscular e Bico de Quitina* (Cefalópodes, Polvos, Vermes, Biota Ediacarana).

---

## 🚀 Como Executar

### Opção 1: Execução Local com Python

```bash
# 1. Ative o ambiente virtual
source "/home/guilherme/Documentos/Mezozoico projeto/venv/bin/activate"

# 2. Inicie o servidor FastAPI com Uvicorn
uvicorn app.main:app --reload --port 8000
```

Abra no navegador:
- **Aplicação Web:** [http://localhost:8000](http://localhost:8000)
- **Documentação Interativa Swagger:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Opção 2: Execução com Docker Compose

```bash
docker compose up --build
```

Acesse em [http://localhost:8000](http://localhost:8000).

---

## 📡 Endpoints da API REST

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/` | Serve a interface web completa |
| `GET` | `/api/eras` | Retorna metadados das 5 eras (Contemporânea à Pré-Cambriana) |
| `GET` | `/api/specimens` | Lista espécimes com filtros (`era`, `period`, `diet`, `group`, `skeletal_type`, `search`) |
| `GET` | `/api/specimens/{id}` | Retorna detalhes biométricos, osteologia, imagens de esqueleto e cladograma |
| `POST` | `/api/ingest` | Ingestão automática em tempo real via GBIF + Wikipedia + Commons + PBDB |
| `GET` | `/api/discover` | Retorna sugestões aleatórias por era |
| `GET` | `/api/occurrences/{taxon}` | Coordenadas georreferenciadas da GBIF (vivos) ou PBDB (fósseis) |
| `GET` | `/api/stats` | Estatísticas (total por era, dieta, grupo e vertebrado/invertebrado) |
