@echo off
echo ========================================
echo   CompTIA Linux+ App - Frontend Start
echo ========================================
echo.

cd /d "%~dp0"

:: Node pruefen
node --version >nul 2>&1
if errorlevel 1 (
    echo [FEHLER] Node.js nicht gefunden!
    echo Bitte installiere Node.js von https://nodejs.org
    pause
    exit /b 1
)

:: Yarn pruefen/installieren
yarn --version >nul 2>&1
if errorlevel 1 (
    echo [1/3] Installiere Yarn...
    npm install -g yarn
)

:: node_modules pruefen
if not exist "node_modules" (
    echo [2/3] Installiere Pakete...
    yarn install
)

:: .env erstellen falls nicht vorhanden
if not exist ".env" (
    echo REACT_APP_BACKEND_URL=http://localhost:8001 > .env
    echo WDS_SOCKET_PORT=3000 >> .env
)

echo.
echo ========================================
echo   Frontend startet auf Port 3000
echo   Browser oeffnet automatisch
echo   Druecke Ctrl+C zum Beenden
echo ========================================
echo.

yarn start

pause
