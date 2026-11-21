#!/bin/bash
# Script de inicialização resiliente do BioAtlas com FastAPI
cd "$(dirname "$0")"

# Ativa o ambiente virtual se existir
if [ -f "venv/bin/activate" ]; then
  source venv/bin/activate
elif [ -f "../venv/bin/activate" ]; then
  source ../venv/bin/activate
fi

REQUESTED_PORT=${1:-8000}

# 1. Tenta finalizar processos antigos do uvicorn da wiki
pkill -f "uvicorn.*app.main" 2>/dev/null || true

# 2. Tenta liberar a porta solicitada caso pertença a um processo anterior
fuser -k "${REQUESTED_PORT}/tcp" 2>/dev/null || true
PID=$(lsof -ti :"${REQUESTED_PORT}" 2>/dev/null)
if [ -n "$PID" ]; then
  kill -9 $PID 2>/dev/null || true
fi
sleep 0.5

# 3. Detecta porta livre de forma infalível via Python
PORT=$(python3 -c "
import socket

def is_free(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            s.bind(('0.0.0.0', port))
            return True
        except OSError:
            return False

preferred = int('$REQUESTED_PORT')
if is_free(preferred):
    print(preferred)
else:
    for p in [8001, 8002, 8003, 8080, 8081, 8888, 5000]:
        if is_free(p):
            print(p)
            break
    else:
        print(preferred)
")

# Notifica se precisou alternar a porta
if [ "$PORT" != "$REQUESTED_PORT" ]; then
  echo "⚠️ Porta $REQUESTED_PORT está ocupada por outro processo no sistema."
  echo "🔄 Alternando automaticamente para a porta disponível: $PORT"
fi

echo "=========================================================="
echo "🌍 BioAtlas — Plataforma Global de Biodiversidade e Paleontologia"
echo "🚀 Servidor rodando em: http://localhost:$PORT"
echo "📚 Documentação API em:  http://localhost:$PORT/docs"
echo "=========================================================="

# Abre automaticamente o navegador após o boot do servidor
(
  sleep 1.2
  if which xdg-open > /dev/null 2>&1; then
    xdg-open "http://localhost:$PORT" > /dev/null 2>&1 &
  elif which sensible-browser > /dev/null 2>&1; then
    sensible-browser "http://localhost:$PORT" > /dev/null 2>&1 &
  fi
) &

# Inicia o servidor uvicorn na porta selecionada
exec uvicorn app.main:app --reload --host 0.0.0.0 --port "$PORT"
