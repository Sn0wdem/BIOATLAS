# 🦖 Explorador da Era Mesozoica (Mesozoic Explorer)

> Uma aplicação web interativa, moderna e responsiva para explorar seres vivos da Era Mesozoica (Triássico, Jurássico e Cretáceo) consumindo dados abertos da **Paleobiology Database (PBDB)**, da **Wikipedia REST API** e mapeamento georreferenciado de fósseis via **Leaflet.js**.

---

## 🌟 Funcionalidades

- 🔍 **Busca Dinâmica em Tempo Real**: Busque por qualquer gênero de réptil fóssil, dinossauro, pterossauro ou réptil marinho (*ex: Tyrannosaurus, Velociraptor, Mosasaurus, Spinosaurus, Stegosaurus*).
- ⏳ **Filtros por Período Geológico**:
  - **Triássico** (252 – 201 Ma)
  - **Jurássico** (201 – 145 Ma)
  - **Cretáceo** (145 – 66 Ma)
- 🌿 **Filtros por Dieta e Habitat**:
  - Terrestres (Dinossauros), Aéreos (Pterossauros) e Aquáticos (Répteis Marinhos).
  - Carnívoros, Herbívoros e Piscívoros.
- 🗺️ **Mapa Global de Ocorrências Fósseis (Leaflet.js + PBDB)**:
  - Visualize no mapa mundial os locais exatos onde os fósseis daquele animal foram desenterrados pela ciência, incluindo formação rochosa e país de origem.
- 📖 **Artigos e Imagens Oficiais**:
  - Resumos automáticos e fotografias/reconstituições obtidas diretamente da Wikipedia (com suporte a PT e fallback para EN).
- ⚡ **Zero Dependências Pesadas**:
  - Desenvolvido em HTML5, CSS3 moderno e Vanilla JavaScript, permitindo hospedagem estática 100% gratuita no **GitHub Pages** ou **Vercel**.

---

## 📂 Estrutura de Arquivos

```plaintext
mesozoico-explorer/
├── index.html          # Estrutura semântica, meta tags e containers
├── style.css           # Design moderno, tema dark fóssil e responsividade
├── app.js              # Integrações com PBDB API, Wikipedia API e Leaflet.js
├── Dockerfile          # Imagem de produção leve baseada em Nginx Alpine
├── docker-compose.yml  # Orquestração do container Docker na porta 8080
├── nginx.conf          # Configuração otimizada do Nginx (Gzip, Cache, Segurança)
├── .dockerignore       # Arquivos ignorados no build do Docker
└── README.md           # Documentação e guia de publicação
```

---

## 🚀 Como Rodar Localmente

Você não precisa instalar Node.js nem ferramentas complexas. Basta ter um navegador web:

### Opção 1: Abrir diretamente no navegador
Dê um duplo clique no arquivo `index.html` ou arraste-o para o Chrome, Firefox ou Edge.

### Opção 2: Usando o Python (Recomendado para evitar bloqueios de CORS em file://)
No terminal, dentro da pasta do projeto:

```bash
# Python 3
python3 -m http.server 8000
```
Em seguida, abra no navegador: `http://localhost:8000`

### Opção 3: Extensão Live Server (VS Code)
1. Instale a extensão **Live Server** no VS Code.
2. Clique com o botão direito em `index.html` e selecione **"Open with Live Server"**.

### Opção 4: Usando Docker (Recomendado para produção ou containers)

#### Usando Docker Compose:
```bash
docker compose up -d --build
```
Acesse no navegador: **`http://localhost:8080`**

Para parar o container:
```bash
docker compose down
```

#### Ou usando apenas a Docker CLI:
```bash
# 1. Construir a imagem
docker build -t mesozoico-explorer .

# 2. Executar o container na porta 8080
docker run -d -p 8080:80 --name mesozoico-explorer mesozoico-explorer
```

---

## 🛰️ Publicando no GitHub e GitHub Pages (Passo a Passo)

### 1. Inicializar o repositório Git local
No terminal do seu computador (dentro da pasta do projeto):

```bash
git init
git add .
git commit -m "feat: versão inicial do Explorador da Era Mesozoica"
```

### 2. Criar o repositório no GitHub
1. Acesse o [GitHub](https://github.com) e faça login.
2. Clique no botão **"+"** (canto superior direito) e selecione **New repository**.
3. Escolha o nome do repositório (ex: `mesozoico-explorer`).
4. Mantenha-o como **Public** e **NÃO** marque a opção de adicionar README (já criamos localmente).
5. Clique em **Create repository**.

### 3. Vincular e subir o código para o GitHub
Substitua `SEU_USUARIO` pelo seu nome de usuário no GitHub:

```bash
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/mesozoico-explorer.git
git push -u origin main
```

### 4. Ativar o GitHub Pages (Hospedagem Gratuita)
1. No seu repositório no GitHub, clique na aba **Settings** (Configurações).
2. Na barra lateral esquerda, clique em **Pages**.
3. Em **Build and deployment > Source**, selecione:
   - Branch: `main`
   - Pasta: `/ (root)`
4. Clique em **Save**.
5. Aguarde cerca de 1 a 2 minutos. O GitHub gerará um link público parecido com:
   `https://SEU_USUARIO.github.io/mesozoico-explorer/`

Pronto! Seu site estará no ar mundialmente.

---

## 🌐 Alternativa: Publicando na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta do GitHub.
2. Clique em **"Add New..."** > **"Project"**.
3. Importe o repositório `mesozoico-explorer`.
4. Deixe todas as opções como padrão e clique em **Deploy**.
5. Em segundos, sua aplicação receberá uma URL de alta velocidade (ex: `mesozoico-explorer.vercel.app`).

---

## 🔬 Fontes de Dados e APIs

- **[Paleobiology Database (PBDB) API](https://paleobiodb.org/data1.2/)**:
  - Dados taxonômicos: `/taxa/single.json?name={nome}&show=attr`
  - Coordenadas georreferenciadas de fósseis: `/occs/list.json?base_name={nome}&show=coords,loc`
- **[Wikipedia REST API](https://www.mediawiki.org/wiki/API:REST_API)**:
  - Resumo e imagem: `/api/rest_v1/page/summary/{nome}`
- **[Leaflet.js](https://leafletjs.com/)**:
  - Biblioteca open-source para renderização de mapas interativos.

---

## 📜 Licença

Distribuído sob a licença **MIT**. Sinta-se livre para utilizar, modificar e expandir este projeto para estudos, feiras de ciências ou divulgação paleontológica!
