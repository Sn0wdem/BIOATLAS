# Imagem base oficial Python otimizada
FROM python:3.11-slim

# Evita criação de arquivos .pyc e ativa saída sem buffer
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Define diretório de trabalho
WORKDIR /app

# Instala certificados e utilitários
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copia e instala as dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código da aplicação e assets
COPY app ./app

# Inicializa o banco de dados com espécimes de todas as eras
RUN python -m app.seed_data

# Expõe a porta 8000 da API FastAPI
EXPOSE 8000

# Executa o servidor Uvicorn com FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
