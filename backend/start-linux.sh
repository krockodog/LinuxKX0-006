#!/usr/bin/env bash
set -euo pipefail

echo "========================================"
echo "  CompTIA Linux+ App - Linux Start"
echo "========================================"
echo ""

cd "$(dirname "$0")"

if ! command -v python3 >/dev/null 2>&1; then
  echo "[FEHLER] Python3 nicht gefunden!"
  echo "Installiere mit: sudo apt install python3 python3-venv python3-pip"
  exit 1
fi

if [ ! -d "venv" ]; then
  echo "[1/3] Erstelle virtuelle Umgebung..."
  python3 -m venv venv
fi

echo "[2/3] Aktiviere Umgebung..."
# shellcheck disable=SC1091
source venv/bin/activate

echo "[3/3] Installiere Pakete..."
if [ -f "requirements-minimal.txt" ]; then
  pip install -q -r requirements-minimal.txt
else
  pip install -q fastapi uvicorn motor pymongo python-dotenv pydantic PyJWT httpx requests
fi

if [ ! -f ".env" ]; then
  {
    echo "MONGO_URL=mongodb://localhost:27017"
    echo "DB_NAME=linux_app"
    echo "CORS_ORIGINS=*"
  } > .env
fi

echo ""
echo "========================================"
echo "  Backend startet auf Port 8001"
echo "  Druecke Ctrl+C zum Beenden"
echo "========================================"
echo ""

uvicorn server:app --host 0.0.0.0 --port 8001
