# Detaillierte Installationsanleitung

## Windows Installation (Schritt für Schritt)

### 1. Voraussetzungen installieren

#### Node.js
1. Öffne https://nodejs.org/
2. Klicke auf den grünen "LTS" Button
3. Führe den Installer aus
4. Klicke immer "Next" → "Install" → "Finish"

#### Python
1. Öffne https://python.org/downloads/
2. Klicke "Download Python 3.x.x"
3. **WICHTIG:** Im Installer unten "Add Python to PATH" ankreuzen ✅
4. Klicke "Install Now"

#### Git
1. Öffne https://git-scm.com/download/win
2. Lade den Installer herunter
3. Installiere mit Standardeinstellungen

#### Prüfen ob alles installiert ist
Öffne PowerShell und tippe:
```powershell
node --version    # sollte v18.x.x oder höher zeigen
python --version  # sollte Python 3.x.x zeigen
git --version     # sollte git version 2.x.x zeigen
```

---

### 2. Projekt herunterladen

```powershell
# Gehe zum Desktop (oder wo du es haben willst)
cd $HOME\Desktop

# Repository klonen
git clone https://github.com/krockodog/LinuxKX0-006.git

# In den Ordner wechseln
cd LinuxKX0-006
```

---

### 3. Backend einrichten

```powershell
# In den Backend-Ordner wechseln
cd backend

# Virtuelle Python-Umgebung erstellen
python -m venv venv

# Umgebung aktivieren
venv\Scripts\activate

# Du siehst jetzt (venv) am Anfang der Zeile

# Pakete installieren
pip install -r requirements.txt

# Konfigurationsdatei erstellen
copy .env.example .env
```

---

### 4. Frontend einrichten

Öffne ein **NEUES** PowerShell-Fenster:

```powershell
# Zum Frontend-Ordner
cd $HOME\Desktop\LinuxKX0-006\frontend

# Yarn global installieren
npm install -g yarn

# Abhängigkeiten installieren
yarn install

# Konfiguration erstellen
copy .env.example .env
```

**WICHTIG:** Öffne die `.env` Datei und ändere sie:

```powershell
notepad .env
```

Ändere den Inhalt zu:
```
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=3000
```

Speichern und schließen.

---

### 5. App starten

#### Terminal 1 - Backend starten:
```powershell
cd $HOME\Desktop\LinuxKX0-006\backend
venv\Scripts\activate
python -m uvicorn server:app --host 0.0.0.0 --port 8001
```

Du solltest sehen:
```
INFO:     Uvicorn running on http://0.0.0.0:8001
```

#### Terminal 2 - Frontend starten:
```powershell
cd $HOME\Desktop\LinuxKX0-006\frontend
yarn start
```

Der Browser öffnet automatisch **http://localhost:3000**

---

### 6. App benutzen

1. Klicke "Get Started" / "Loslegen"
2. Gib deinen Namen ein
3. Wähle ein Kapitel und starte das Quiz
4. Oder gehe zu Lernkarten / Prüfungssimulation

---

## App später wieder starten

Jedes Mal wenn du die App nutzen willst:

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

---

## Fehlerbehebung

### "python wurde nicht erkannt"
→ Python neu installieren, "Add to PATH" aktivieren

### "yarn wurde nicht erkannt"
```powershell
npm install -g yarn
```

### "ENOENT: no such file"
```powershell
cd frontend
rmdir /s /q node_modules
yarn install
```

### Backend startet nicht
```powershell
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend zeigt Fehler
- Prüfe ob Backend läuft: http://localhost:8001/api/
- Prüfe .env Datei im frontend Ordner

---

## macOS / Linux

```bash
# Klonen
git clone https://github.com/krockodog/LinuxKX0-006.git
cd LinuxKX0-006

# Backend (Terminal 1)
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python -m uvicorn server:app --host 0.0.0.0 --port 8001

# Frontend (Terminal 2)
cd frontend
npm install -g yarn
yarn install
cp .env.example .env
# Editiere .env: REACT_APP_BACKEND_URL=http://localhost:8001
yarn start
```
