# Installationsanleitung

Diese Anleitung führt dich Schritt für Schritt durch die Installation von Linux+ Mastery.

---

## 📑 Inhaltsverzeichnis

1. [Systemanforderungen](#1-systemanforderungen)
2. [Windows Installation](#2-windows-installation)
3. [macOS Installation](#3-macos-installation)
4. [Linux Installation](#4-linux-installation)
5. [Docker Installation](#5-docker-installation)
6. [Fehlerbehebung](#6-fehlerbehebung)

---

## 1. Systemanforderungen

### Minimum
- **OS:** Windows 10, macOS 10.15, Ubuntu 20.04
- **RAM:** 4 GB
- **Speicher:** 500 MB frei
- **Browser:** Chrome, Firefox, Edge (aktuell)

### Empfohlen für Entwicklung
- **Node.js:** 18.x oder höher
- **Python:** 3.9 oder höher
- **MongoDB:** 6.x (optional)

---

## 2. Windows Installation

### Option A: Desktop-App (Empfohlen für Endanwender)

1. **Installer herunterladen**
   - Gehe zu [GitHub Releases](https://github.com/DEIN_USERNAME/linux-mastery/releases)
   - Lade `Linux+Mastery-Setup-2.0.0.exe` herunter

2. **Installation starten**
   - Doppelklick auf die `.exe` Datei
   - Windows SmartScreen: Klicke auf "Weitere Informationen" → "Trotzdem ausführen"

3. **Installationsoptionen**
   - Installationspfad wählen (Standard: `C:\Program Files\Linux+ Mastery`)
   - **Mit KI-Funktionen:** Aktivieren für AI-gestützte Erklärungen
   - **Desktop-Verknüpfung:** Empfohlen

4. **Fertig!**
   - Starte die App über das Desktop-Icon oder Startmenü

### Option B: Entwicklungsumgebung

#### Voraussetzungen installieren

1. **Node.js installieren**
   ```powershell
   # Mit winget (Windows 11)
   winget install OpenJS.NodeJS.LTS
   
   # Oder manuell: https://nodejs.org/
   ```

2. **Python installieren**
   ```powershell
   # Mit winget
   winget install Python.Python.3.11
   
   # Oder manuell: https://python.org/
   # ⚠️ Bei der Installation "Add to PATH" aktivieren!
   ```

3. **Git installieren**
   ```powershell
   winget install Git.Git
   ```

4. **Yarn installieren**
   ```powershell
   npm install -g yarn
   ```

#### Projekt einrichten

```powershell
# 1. Repository klonen
git clone https://github.com/DEIN_USERNAME/linux-mastery.git
cd linux-mastery

# 2. Backend einrichten
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env

# 3. Frontend einrichten
cd ..\frontend
yarn install
copy .env.example .env
```

#### Anwendung starten

**Terminal 1 (Backend):**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 2 (Frontend):**
```powershell
cd frontend
yarn start
```

Öffne http://localhost:3000 im Browser.

---

## 3. macOS Installation

### Voraussetzungen

```bash
# Homebrew installieren (falls nicht vorhanden)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Abhängigkeiten installieren
brew install node python git
npm install -g yarn
```

### Projekt einrichten

```bash
# Repository klonen
git clone https://github.com/DEIN_USERNAME/linux-mastery.git
cd linux-mastery

# Backend einrichten
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

# Frontend einrichten
cd ../frontend
yarn install
cp .env.example .env
```

### Starten

**Terminal 1:**
```bash
cd backend && source venv/bin/activate && uvicorn server:app --port 8001 --reload
```

**Terminal 2:**
```bash
cd frontend && yarn start
```

---

## 4. Linux Installation

### Ubuntu/Debian

```bash
# Abhängigkeiten installieren
sudo apt update
sudo apt install -y nodejs npm python3 python3-venv git
sudo npm install -g yarn

# Repository klonen
git clone https://github.com/DEIN_USERNAME/linux-mastery.git
cd linux-mastery

# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

# Frontend
cd ../frontend
yarn install
cp .env.example .env
```

### Arch Linux

```bash
sudo pacman -S nodejs npm python python-pip git
sudo npm install -g yarn
# Rest wie oben
```

### Fedora

```bash
sudo dnf install nodejs npm python3 python3-pip git
sudo npm install -g yarn
# Rest wie oben
```

---

## 5. Docker Installation

### Mit Docker Compose (Empfohlen)

```bash
# Repository klonen
git clone https://github.com/DEIN_USERNAME/linux-mastery.git
cd linux-mastery

# Container starten
docker-compose up -d

# Logs ansehen
docker-compose logs -f
```

Die App läuft auf:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8001

### Einzelne Container

```bash
# Backend
docker build -t linux-mastery-backend ./backend
docker run -d -p 8001:8001 --name lm-backend linux-mastery-backend

# Frontend
docker build -t linux-mastery-frontend ./frontend
docker run -d -p 3000:3000 --name lm-frontend linux-mastery-frontend
```

---

## 6. Fehlerbehebung

### "ENOENT: no such file or directory"

```bash
# Abhängigkeiten neu installieren
rm -rf node_modules
yarn install
```

### "Python nicht gefunden" (Windows)

1. Python Installer erneut ausführen
2. "Modify" → "Add to PATH" aktivieren
3. Terminal neu starten

### "Port 3000/8001 bereits belegt"

```bash
# Prozess finden und beenden
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :3000
kill -9 <PID>
```

### "CORS Error" im Browser

Prüfe die Backend `.env`:
```env
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### MongoDB Verbindungsfehler

Die App funktioniert auch ohne MongoDB. Der Fortschritt wird dann nur im Browser (localStorage) gespeichert.

Falls MongoDB gewünscht:
```bash
# Docker
docker run -d -p 27017:27017 --name mongodb mongo:6

# Oder installieren:
# https://www.mongodb.com/try/download/community
```

### Electron-Build schlägt fehl

```bash
# Cache leeren
yarn cache clean

# Node-Module neu installieren
rm -rf node_modules
yarn install

# Erneut versuchen
yarn electron-build-win
```

---

## Hilfe & Support

- **GitHub Issues:** [Probleme melden](https://github.com/DEIN_USERNAME/linux-mastery/issues)
- **Discussions:** [Fragen stellen](https://github.com/DEIN_USERNAME/linux-mastery/discussions)

---

**Viel Erfolg bei deiner Linux+ Prüfung! 🐧🎉**
