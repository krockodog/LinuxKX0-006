#!/usr/bin/env bash
set -euo pipefail

echo "========================================"
echo "  CompTIA Linux+ App - Frontend Start"
echo "========================================"
echo ""

cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "[FEHLER] Node.js nicht gefunden!"
  echo "Installiere mit: sudo apt install nodejs npm"
  exit 1
fi

PACKAGE_MANAGER=""
if command -v yarn >/dev/null 2>&1; then
  PACKAGE_MANAGER="yarn"
elif command -v npm >/dev/null 2>&1; then
  PACKAGE_MANAGER="npm"
else
  echo "[FEHLER] Weder yarn noch npm gefunden."
  exit 1
fi

install_dependencies() {
  echo "[1/2] Installiere Frontend-Abhaengigkeiten mit ${PACKAGE_MANAGER}..."
  if [ "${PACKAGE_MANAGER}" = "yarn" ]; then
    yarn install --network-timeout 120000
  else
    npm install --legacy-peer-deps
  fi
}

if [ ! -d "node_modules" ] || [ ! -x "node_modules/.bin/craco" ]; then
  install_dependencies
fi

if [ ! -x "node_modules/.bin/craco" ]; then
  echo "[HINWEIS] craco fehlt weiterhin, erzwinge Neuinstallation..."
  rm -rf node_modules
  install_dependencies
fi

if [ ! -f ".env" ]; then
  {
    echo "REACT_APP_BACKEND_URL=http://localhost:8001"
    echo "WDS_SOCKET_PORT=3000"
  } > .env
fi

echo ""
echo "========================================"
echo "  Frontend startet auf Port 3000"
echo "  Browser oeffnet automatisch"
echo "  Druecke Ctrl+C zum Beenden"
echo "========================================"
echo ""

if [ "${PACKAGE_MANAGER}" = "yarn" ]; then
  yarn start
else
  npm run start
fi
