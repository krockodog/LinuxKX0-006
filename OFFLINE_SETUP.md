# Offline-Bereitstellung - Komplette Anleitung

Diese Anleitung beschreibt, wie du die Linux+ Mastery App vollständig offline auf deinem eigenen Computer oder Server betreibst.

---

## 📥 Schnellstart (5 Minuten)

### Voraussetzungen installieren

**Windows:**
1. [Node.js 18+](https://nodejs.org/) herunterladen und installieren
2. [Python 3.9+](https://www.python.org/downloads/) herunterladen und installieren
3. [MongoDB Community](https://www.mongodb.com/try/download/community) herunterladen und installieren

**Linux (Ubuntu/Debian):**
```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Python
sudo apt install -y python3 python3-pip python3-venv

# MongoDB
sudo apt install -y mongodb
sudo systemctl start mongodb
```

**macOS:**
```bash
# Homebrew installieren falls nicht vorhanden
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Abhängigkeiten
brew install node python@3.11 mongodb-community
brew services start mongodb-community
```

---

## 🔧 Vollständige Installation

### Schritt 1: Repository herunterladen

```bash
# Option A: Mit Git
git clone https://github.com/YOUR_USERNAME/linux-mastery.git
cd linux-mastery

# Option B: Als ZIP
# Lade das Repository als ZIP herunter und entpacke es
```

### Schritt 2: Backend einrichten

```bash
cd backend

# Virtuelle Umgebung erstellen
python3 -m venv venv

# Aktivieren (Linux/macOS)
source venv/bin/activate

# Aktivieren (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Aktivieren (Windows CMD)
venv\Scripts\activate.bat

# Abhängigkeiten installieren
pip install -r requirements.txt
```

### Schritt 3: Backend konfigurieren

Erstelle die Datei `backend/.env`:

```env
# Lokale MongoDB
MONGO_URL=mongodb://localhost:27017
DB_NAME=linux_mastery

# Alle Origins erlauben
CORS_ORIGINS=*
```

### Schritt 4: Frontend einrichten

```bash
cd ../frontend

# Yarn installieren (falls nicht vorhanden)
npm install -g yarn

# Abhängigkeiten installieren
yarn install
```

### Schritt 5: Frontend konfigurieren

Erstelle die Datei `frontend/.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=3000
```

---

## 🚀 App starten

### Terminal 1 - MongoDB (falls nicht als Service)
```bash
mongod --dbpath /path/to/data
```

### Terminal 2 - Backend
```bash
cd backend
source venv/bin/activate  # oder Windows-Äquivalent
uvicorn server:app --host 0.0.0.0 --port 8001
```

### Terminal 3 - Frontend
```bash
cd frontend
yarn start
```

➡️ Öffne http://localhost:3000 im Browser

---

## 🖥️ Windows Desktop-App erstellen

### Variante A: Schnell-Build

```bash
cd frontend
yarn electron-build-win
```

Der Installer wird in `frontend/dist/` erstellt.

### Variante B: Entwicklungsmodus

```bash
cd frontend
yarn electron-dev
```

### Installer-Optionen

Der Setup-Wizard bietet:
- ✅ **Mit KI-Funktionen** - Volle Funktionalität
- ❌ **Ohne KI-Funktionen** - Keine API-Key-Eingabe nötig

---

## 🔒 Komplett Offline betreiben

Für 100% Offline-Betrieb:

### 1. Eingebettete Datenbank verwenden

Die App speichert alle Fragen direkt im Code (`server.py` und `questions_extended.py`). MongoDB wird nur für optionale Features benötigt.

### 2. Lokaler Fortschritt

Der Lernfortschritt wird automatisch im Browser-LocalStorage gespeichert - keine Datenbank erforderlich.

### 3. KI-Funktionen deaktivieren

Bei der Installation "Ohne KI-Funktionen" wählen oder in der Desktop-App:
- Die KI-Buttons werden automatisch ausgeblendet
- Keine Internetverbindung erforderlich

---

## 📱 Als portable App nutzen

### USB-Stick Installation

1. Installiere die Desktop-App auf einen USB-Stick
2. Kopiere den gesamten Installationsordner
3. Starte `Linux+Mastery.exe` von jedem Windows-PC

### Portable-Modus aktivieren

Erstelle eine leere Datei `portable` im App-Verzeichnis:
```
Linux+Mastery/
├── Linux+Mastery.exe
├── portable          <-- Diese Datei erstellen
└── resources/
```

Alle Einstellungen werden dann im App-Ordner statt im Benutzerverzeichnis gespeichert.

---

## 🐳 Docker-Deployment

### docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build: ./backend
    ports:
      - "8001:8001"
    environment:
      - MONGO_URL=mongodb://mongodb:27017
      - DB_NAME=linux_mastery
      - CORS_ORIGINS=*
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_BACKEND_URL=http://localhost:8001
    depends_on:
      - backend

volumes:
  mongo_data:
```

### Starten mit Docker

```bash
docker-compose up -d
```

---

## 🔧 Fehlerbehebung

### MongoDB startet nicht

**Windows:**
```powershell
# Als Administrator
net start MongoDB
```

**Linux:**
```bash
sudo systemctl start mongodb
# oder
sudo service mongodb start
```

### Port bereits belegt

```bash
# Port 8001 freigeben (Linux/macOS)
lsof -ti:8001 | xargs kill -9

# Port 3000 freigeben
lsof -ti:3000 | xargs kill -9
```

**Windows:**
```powershell
netstat -ano | findstr :8001
taskkill /PID <PID> /F
```

### Abhängigkeiten fehlen

```bash
# Backend
cd backend
pip install -r requirements.txt --force-reinstall

# Frontend
cd frontend
rm -rf node_modules
yarn install
```

### CORS-Fehler

Stelle sicher, dass in `backend/.env`:
```env
CORS_ORIGINS=*
```

---

## 📊 Systemanforderungen

### Minimum
- **OS:** Windows 10, macOS 10.14, Ubuntu 18.04
- **RAM:** 4 GB
- **Speicher:** 500 MB
- **Node.js:** 18.x
- **Python:** 3.9+

### Empfohlen
- **RAM:** 8 GB
- **Speicher:** 1 GB (mit MongoDB-Daten)
- **Node.js:** 20.x
- **Python:** 3.11+

---

## 📞 Support

Bei Problemen:
1. Überprüfe die [FAQ](https://github.com/YOUR_USERNAME/linux-mastery/wiki/FAQ)
2. Suche in [Issues](https://github.com/YOUR_USERNAME/linux-mastery/issues)
3. Erstelle ein neues Issue mit:
   - Betriebssystem und Version
   - Node.js und Python Version
   - Fehlermeldung (komplett)
   - Schritte zur Reproduktion

---

**Viel Erfolg mit deiner Offline-Installation! 🎉**
