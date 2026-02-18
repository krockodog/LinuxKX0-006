#!/bin/bash
echo "========================================"
echo "  CompTIA Linux+ App - Linux Start"
echo "========================================"
echo ""

cd "$(dirname "$0")"

# Python pruefen
if ! command -v python3 &> /dev/null; then
    echo "[FEHLER] Python3 nicht gefunden!"
    echo "Installiere mit: sudo apt install python3 python3-venv python3-pip"
    exit 1
fi

# Virtuelle Umgebung erstellen falls nicht vorhanden
if [ ! -d "venv" ]; then
    echo "[1/3] Erstelle virtuelle Umgebung..."
    python3 -m venv venv
fi

# Aktivieren
echo "[2/3] Aktiviere Umgebung..."
source venv/bin/activate

# Pakete installieren
echo "[3/3] Installiere Pakete..."
pip install -q fastapi uvicorn motor pymongo python-dotenv pydantic PyJWT httpx

# .env erstellen falls nicht vorhanden
if [ ! -f ".env" ]; then
    echo "MONGO_URL=mongodb://localhost:27017" > .env
    echo "DB_NAME=linux_app" >> .env
    echo "CORS_ORIGINS=*" >> .env
fi

echo ""
echo "========================================"
echo "  Backend startet auf Port 8001"
echo "  Druecke Ctrl+C zum Beenden"
echo "========================================"
echo ""

uvicorn server:app --host 0.0.0.0 --port 8001
