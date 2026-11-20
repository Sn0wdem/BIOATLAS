#!/bin/bash
# Script de inicialização da Super Wiki com FastAPI
cd "$(dirname "$0")"
source venv/bin/activate

PORT=${1:-8000}

# Verifica se a porta já está ocupada e libera se necessário
PID=$(lsof -ti :$PORT 2>/dev/null)
if [ ! -z "$PID" ]; then
  echo "⚠️ Porta $PORT ocupada pelo processo $PID. Finalizando processo anterior..."
  kill -9 $PID 2>/dev/null
  sleep 1
fi

echo "=========================================================="
echo "🌍 Super Wiki da Vida na Terra (FastAPI Engine)"
echo "🚀 Servidor rodando em: http://localhost:$PORT"
echo "📚 Documentação API em:  http://localhost:$PORT/docs"
echo "=========================================================="
uvicorn app.main:app --reload --port $PORT
