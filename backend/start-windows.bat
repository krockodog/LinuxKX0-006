@echo off
echo ========================================
echo   CompTIA Linux+ App - Windows Start
echo ========================================
echo.

cd /d "%~dp0"

:: Python pruefen
python --version >nul 2>&1
if errorlevel 1 (
    echo [FEHLER] Python nicht gefunden!
    echo Bitte installiere Python von https://python.org
    echo WICHTIG: "Add Python to PATH" aktivieren!
    pause
    exit /b 1
)

:: Virtuelle Umgebung erstellen falls nicht vorhanden
if not exist "venv" (
    echo [1/3] Erstelle virtuelle Umgebung...
    python -m venv venv
)

:: Aktivieren
echo [2/3] Aktiviere Umgebung...
call venv\Scripts\activate.bat

:: Pakete installieren
echo [3/3] Installiere Pakete...
pip install -q fastapi uvicorn motor pymongo python-dotenv pydantic PyJWT httpx

:: .env erstellen falls nicht vorhanden
if not exist ".env" (
    echo MONGO_URL=mongodb://localhost:27017 > .env
    echo DB_NAME=linux_app >> .env
    echo CORS_ORIGINS=* >> .env
)

echo.
echo ========================================
echo   Backend startet auf Port 8001
echo   Druecke Ctrl+C zum Beenden
echo ========================================
echo.

python -m uvicorn server:app --host 0.0.0.0 --port 8001

pause
