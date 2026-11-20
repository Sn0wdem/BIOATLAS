#!/bin/bash
# Script de inicialização da Super Wiki com FastAPI
cd "$(dirname "$0")"
source venv/bin/activate
echo "=========================================================="
echo "🌍 Iniciando Super Wiki da Vida na Terra (FastAPI Engine)"
echo "🚀 Servidor rodando em: http://localhost:8000"
echo "📚 Documentação API em:  http://localhost:8000/docs"
echo "=========================================================="
uvicorn app.main:app --reload --port 8000
