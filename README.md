# CompTIA Linux+ XK0-006 Lern-App 🐧

**Prüfungsvorbereitung für CompTIA Linux+ XK0-006 (2025-2027)**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.1.0-green.svg)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Windows-lightgrey.svg)
![Language](https://img.shields.io/badge/language-DE%20%7C%20EN-orange.svg)

---

## 🚀 Schnellstart (5 Minuten)

### Voraussetzungen

- **Node.js 18+** → [nodejs.org](https://nodejs.org/) (LTS Version)
- **Python 3.9+** → [python.org](https://python.org/)
- **Git** → [git-scm.com](https://git-scm.com/)

### Installation

```bash
# 1. Repository klonen
git clone https://github.com/krockodog/LinuxKX0-006.git
cd LinuxKX0-006

# 2. Backend starten
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
copy .env.example .env      # Windows
# cp .env.example .env      # Linux/Mac

python -m uvicorn server:app --host 0.0.0.0 --port 8001

# 3. Neues Terminal öffnen - Frontend starten
cd LinuxKX0-006/frontend
npm install -g yarn         # Falls noch nicht installiert
yarn install
copy .env.example .env      # Windows
# cp .env.example .env      # Linux/Mac

# In .env ändern:
# REACT_APP_BACKEND_URL=http://localhost:8001

yarn start
```

**Fertig!** Öffne http://localhost:3000 im Browser.

---

## 📦 Windows Komplett-Anleitung

### Schritt 1: Software installieren

1. **Node.js installieren**
   - Gehe zu https://nodejs.org/
   - Lade "LTS" Version herunter (z.B. 20.x.x)
   - Installieren → alle Häkchen anlassen

2. **Python installieren**
   - Gehe zu https://python.org/downloads/
   - Lade neueste Version herunter
   - **WICHTIG:** Bei Installation "Add Python to PATH" aktivieren ✅

3. **Git installieren**
   - Gehe zu https://git-scm.com/download/win
   - Installieren mit Standardeinstellungen

### Schritt 2: Projekt herunterladen

Öffne **PowerShell** oder **CMD** und führe aus:

```powershell
cd C:\Users\DEIN_NAME\Desktop
git clone https://github.com/krockodog/LinuxKX0-006.git
cd LinuxKX0-006
```

### Schritt 3: Backend einrichten

```powershell
cd backend

# Virtuelle Umgebung erstellen
python -m venv venv

# Aktivieren
venv\Scripts\activate

# Abhängigkeiten installieren
pip install -r requirements.txt

# Konfiguration erstellen
copy .env.example .env
```

### Schritt 4: Frontend einrichten

Öffne ein **neues** PowerShell-Fenster:

```powershell
cd C:\Users\DEIN_NAME\Desktop\LinuxKX0-006\frontend

# Yarn installieren (falls nicht vorhanden)
npm install -g yarn

# Abhängigkeiten installieren
yarn install

# Konfiguration erstellen
copy .env.example .env

# .env bearbeiten - öffne die Datei und ändere:
notepad .env
```

In der `.env` Datei ändern:
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Schritt 5: App starten

**Terminal 1 - Backend:**
```powershell
cd C:\Users\DEIN_NAME\Desktop\LinuxKX0-006\backend
venv\Scripts\activate
python -m uvicorn server:app --host 0.0.0.0 --port 8001
```

**Terminal 2 - Frontend:**
```powershell
cd C:\Users\DEIN_NAME\Desktop\LinuxKX0-006\frontend
yarn start
```

Browser öffnet automatisch: **http://localhost:3000**

---

## 🍎 macOS Anleitung

```bash
# Homebrew installieren (falls nicht vorhanden)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Abhängigkeiten
brew install node python git
npm install -g yarn

# Projekt klonen
git clone https://github.com/krockodog/LinuxKX0-006.git
cd LinuxKX0-006

# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python -m uvicorn server:app --host 0.0.0.0 --port 8001 &

# Frontend (neues Terminal)
cd ../frontend
yarn install
cp .env.example .env
# In .env: REACT_APP_BACKEND_URL=http://localhost:8001
yarn start
```

---

## 🐧 Linux Anleitung (Ubuntu/Debian)

```bash
# Abhängigkeiten
sudo apt update
sudo apt install -y nodejs npm python3 python3-venv python3-pip git
sudo npm install -g yarn

# Projekt klonen
git clone https://github.com/krockodog/LinuxKX0-006.git
cd LinuxKX0-006

# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python -m uvicorn server:app --host 0.0.0.0 --port 8001 &

# Frontend (neues Terminal)
cd ../frontend
yarn install
cp .env.example .env
nano .env  # REACT_APP_BACKEND_URL=http://localhost:8001 setzen
yarn start
```

---

## ✨ Features

- **100+ Prüfungsfragen** in 5 Kapiteln
- **Prüfungssimulation** mit 90-Minuten-Timer (60 Fragen)
- **Lernkarten** mit Spaced Repetition Algorithmus
- **20-Wochen-Lernplan**
- **KI-Erklärungen** (OpenAI, Gemini, Claude, DeepSeek, Qwen, Perplexity)
- **Zweisprachig** (Deutsch/Englisch)
- **Matrix-Hintergrund** Animation
- **Kein Login erforderlich**

---

## 🔧 Fehlerbehebung

### "Python nicht gefunden"
→ Python neu installieren mit "Add to PATH" ✅

### "yarn nicht gefunden"
```powershell
npm install -g yarn
```

### "Port 3000 belegt"
```powershell
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### "CORS Error"
→ Prüfe ob Backend läuft (http://localhost:8001/api/)

### "Module not found"
```bash
# Im jeweiligen Ordner:
rm -rf node_modules  # oder: rmdir /s node_modules (Windows)
yarn install
```

---

## 📁 Projektstruktur

```
LinuxKX0-006/
├── backend/
│   ├── server.py           # FastAPI Backend
│   ├── requirements.txt    # Python Abhängigkeiten
│   └── .env.example        # Konfiguration
│
├── frontend/
│   ├── src/
│   │   ├── pages/          # React Seiten
│   │   └── components/     # UI Komponenten
│   ├── package.json        # Node Abhängigkeiten
│   └── .env.example        # Konfiguration
│
└── README.md
```

---

## 📄 Lizenz

MIT License

---

**Viel Erfolg bei der Linux+ Prüfung! 🎉**
