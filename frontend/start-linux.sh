#!/bin/bash
echo "========================================"
echo "  CompTIA Linux+ App - Frontend Start"
echo "========================================"
echo ""

cd "$(dirname "$0")"

# Node pruefen
if ! command -v node &> /dev/null; then
    echo "[FEHLER] Node.js nicht gefunden!"
    echo "Installiere mit: sudo apt install nodejs npm"
    exit 1
fi

# Yarn pruefen/installieren
if ! command -v yarn &> /dev/null; then
    echo "[1/3] Installiere Yarn..."
    sudo npm install -g yarn
fi

# node_modules pruefen
if [ ! -d "node_modules" ]; then
    echo "[2/3] Installiere Pakete..."
    yarn install
fi

# .env erstellen falls nicht vorhanden
if [ ! -f ".env" ]; then
    echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env
    echo "WDS_SOCKET_PORT=3000" >> .env
fi

echo ""
echo "========================================"
echo "  Frontend startet auf Port 3000"
echo "  Browser oeffnet automatisch"
echo "  Druecke Ctrl+C zum Beenden"
echo "========================================"
echo ""

yarn start
