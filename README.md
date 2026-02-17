# CompTIA Linux+ XK0-006 Lern-App 🐧

**Prüfungsvorbereitung für CompTIA Linux+ XK0-006 (2025-2027)**

---

## ✨ Features

- 100+ Prüfungsfragen in 5 Kapiteln
- 90-Minuten Prüfungssimulation (wie echte Prüfung)
- Lernkarten mit Spaced Repetition
- 20-Wochen-Lernplan
- KI-Erklärungen (OpenAI, Gemini, Claude, etc.)
- Deutsch/Englisch
- Kein Login nötig

---

# 🪟 Windows Installationsanleitung

## Voraussetzungen installieren

1. **Node.js** herunterladen und installieren:
   - https://nodejs.org/ → "LTS" Version wählen
   
2. **Python** herunterladen und installieren:
   - https://python.org/downloads/
   - ⚠️ **WICHTIG:** Bei Installation "Add Python to PATH" aktivieren!
   
3. **Git** herunterladen und installieren:
   - https://git-scm.com/download/win

## Projekt herunterladen

PowerShell öffnen und ausführen:

```powershell
cd $HOME\Desktop
git clone https://github.com/krockodog/LinuxKX0-006.git
cd LinuxKX0-006
```

## Backend einrichten

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

## Frontend einrichten

**Neues PowerShell-Fenster öffnen:**

```powershell
cd $HOME\Desktop\LinuxKX0-006\frontend
npm install -g yarn
yarn install
copy .env.example .env
notepad .env
```

In der `.env` Datei ändern:
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

## App starten

**Terminal 1 - Backend:**
```powershell
cd $HOME\Desktop\LinuxKX0-006\backend
venv\Scripts\activate
python -m uvicorn server:app --host 0.0.0.0 --port 8001
```

**Terminal 2 - Frontend:**
```powershell
cd $HOME\Desktop\LinuxKX0-006\frontend
yarn start
```

**Fertig!** Öffne http://localhost:3000

## App später wieder starten

**Terminal 1:**
```powershell
cd $HOME\Desktop\LinuxKX0-006\backend
venv\Scripts\activate
python -m uvicorn server:app --host 0.0.0.0 --port 8001
```

**Terminal 2:**
```powershell
cd $HOME\Desktop\LinuxKX0-006\frontend
yarn start
```

## Fehlerbehebung Windows

**"python wurde nicht erkannt"**
→ Python neu installieren, "Add to PATH" aktivieren

**"yarn wurde nicht erkannt"**
```powershell
npm install -g yarn
```

**Port 3000 belegt:**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Module fehlen:**
```powershell
cd frontend
rmdir /s /q node_modules
yarn install
```

---

# 🐧 Linux Installationsanleitung

## Voraussetzungen installieren

### Ubuntu / Debian:
```bash
sudo apt update
sudo apt install -y nodejs npm python3 python3-venv python3-pip git
sudo npm install -g yarn
```

### Arch Linux:
```bash
sudo pacman -S nodejs npm python python-pip git
sudo npm install -g yarn
```

### Fedora:
```bash
sudo dnf install nodejs npm python3 python3-pip git
sudo npm install -g yarn
```

## Projekt herunterladen

```bash
cd ~/Desktop
git clone https://github.com/krockodog/LinuxKX0-006.git
cd LinuxKX0-006
```

## Backend einrichten

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

## Frontend einrichten

**Neues Terminal öffnen:**

```bash
cd ~/Desktop/LinuxKX0-006/frontend
yarn install
cp .env.example .env
nano .env
```

In der `.env` Datei ändern:
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

Speichern: `Ctrl+O` → `Enter` → `Ctrl+X`

## App starten

**Terminal 1 - Backend:**
```bash
cd ~/Desktop/LinuxKX0-006/backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001
```

**Terminal 2 - Frontend:**
```bash
cd ~/Desktop/LinuxKX0-006/frontend
yarn start
```

**Fertig!** Öffne http://localhost:3000

## App später wieder starten

**Terminal 1:**
```bash
cd ~/Desktop/LinuxKX0-006/backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001
```

**Terminal 2:**
```bash
cd ~/Desktop/LinuxKX0-006/frontend
yarn start
```

## Fehlerbehebung Linux

**Python nicht gefunden:**
```bash
sudo apt install python3 python3-venv
```

**Yarn nicht gefunden:**
```bash
sudo npm install -g yarn
```

**Port 3000 belegt:**
```bash
kill -9 $(lsof -t -i:3000)
```

**Module fehlen:**
```bash
cd frontend
rm -rf node_modules
yarn install
```

---

# 🍎 macOS Installationsanleitung

## Voraussetzungen installieren

```bash
# Homebrew installieren (falls nicht vorhanden)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Abhängigkeiten installieren
brew install node python git
npm install -g yarn
```

## Projekt herunterladen

```bash
cd ~/Desktop
git clone https://github.com/krockodog/LinuxKX0-006.git
cd LinuxKX0-006
```

## Backend einrichten

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

## Frontend einrichten

**Neues Terminal öffnen:**

```bash
cd ~/Desktop/LinuxKX0-006/frontend
yarn install
cp .env.example .env
nano .env
```

In der `.env` Datei ändern:
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

## App starten

**Terminal 1 - Backend:**
```bash
cd ~/Desktop/LinuxKX0-006/backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001
```

**Terminal 2 - Frontend:**
```bash
cd ~/Desktop/LinuxKX0-006/frontend
yarn start
```

**Fertig!** Öffne http://localhost:3000

---

## 📄 Lizenz

MIT License

---

**Viel Erfolg bei der Linux+ Prüfung! 🎉**
