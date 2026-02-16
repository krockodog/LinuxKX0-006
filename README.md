# Linux+ Mastery 🐧

**Vollständige Lern-App für die CompTIA Linux+ XK0-006 Zertifizierungsprüfung**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.0.0-green.svg)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Windows-lightgrey.svg)

## 📋 Übersicht

Linux+ Mastery ist eine umfassende Lern-Anwendung zur Vorbereitung auf die CompTIA Linux+ XK0-006 Prüfung. Die App bietet Quiz-Fragen, Lernkarten, einen strukturierten 20-Wochen-Lernplan und optionale KI-gestützte Erklärungen.

### ✨ Features

- **100+ Prüfungsfragen** - Realistische Multiple-Choice-Fragen in 5 Kapiteln
- **45 Lernkarten** - Interaktive Karteikarten für schnelles Lernen
- **20-Wochen-Lernplan** - Strukturierter Zeitplan für die Prüfungsvorbereitung
- **Fortschrittsverfolgung** - Speichert deinen Lernfortschritt lokal
- **Zweisprachig** - Komplett in Deutsch und Englisch verfügbar
- **KI-Erklärungen** - Optionale detaillierte Erklärungen von 6 KI-Anbietern
- **Kein Login erforderlich** - Sofort loslegen ohne Registrierung
- **Desktop-App** - Als Windows-Anwendung installierbar

### 🎯 Kapitelübersicht

| Kapitel | Thema | Fragen | Gewichtung |
|---------|-------|--------|------------|
| 1 | Linux-Systemgrundlagen | 20 | 23% |
| 2 | Dienste & Benutzerverwaltung | 20 | 20% |
| 3 | Sicherheitshärtung | 20 | 18% |
| 4 | Automatisierung & DevOps | 20 | 17% |
| 5 | Fehlerbehebung & Leistung | 20 | 22% |

---

## 🚀 Installation

### Voraussetzungen

- **Node.js** 18.x oder höher
- **Python** 3.9 oder höher
- **MongoDB** (lokal oder Cloud)
- **Yarn** Package Manager

### Option 1: Lokale Entwicklung (Web-App)

#### 1. Repository klonen

```bash
git clone https://github.com/YOUR_USERNAME/linux-mastery.git
cd linux-mastery
```

#### 2. Backend einrichten

```bash
cd backend

# Virtuelle Umgebung erstellen
python -m venv venv
source venv/bin/activate  # Linux/Mac
# oder: venv\Scripts\activate  # Windows

# Abhängigkeiten installieren
pip install -r requirements.txt

# Umgebungsvariablen konfigurieren
cp .env.example .env
# Bearbeite .env mit deinen MongoDB-Zugangsdaten
```

#### 3. Frontend einrichten

```bash
cd ../frontend

# Abhängigkeiten installieren
yarn install

# Umgebungsvariablen konfigurieren
cp .env.example .env
# Bearbeite .env falls nötig
```

#### 4. Anwendung starten

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
yarn start
```

Die App ist nun unter `http://localhost:3000` verfügbar.

---

### Option 2: Windows Desktop-App (Offline)

#### Methode A: Installer verwenden (empfohlen)

1. Lade den neuesten Installer von [Releases](https://github.com/YOUR_USERNAME/linux-mastery/releases) herunter
2. Führe `Linux+Mastery-Setup.exe` aus
3. Wähle im Setup-Wizard:
   - ✅ **Mit KI-Funktionen** - Für detaillierte Erklärungen (API-Key erforderlich)
   - ❌ **Ohne KI-Funktionen** - Basis-Lernapp ohne KI

#### Methode B: Selbst kompilieren

```bash
cd frontend

# Alle Abhängigkeiten installieren
yarn install

# React-App bauen und Electron-Installer erstellen
yarn electron-build-win
```

Der Installer wird in `frontend/dist/` erstellt.

---

## ⚙️ Konfiguration

### Backend (.env)

```env
# MongoDB Verbindung
MONGO_URL=mongodb://localhost:27017
DB_NAME=linux_mastery

# CORS Einstellungen
CORS_ORIGINS=*

# Optional: JWT Secret (falls Authentifizierung aktiviert)
JWT_SECRET=your-secret-key
```

### Frontend (.env)

```env
# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8001

# WebSocket Port (für Hot Reload)
WDS_SOCKET_PORT=3000
```

---

## 🤖 KI-Erklärungen einrichten

Die App unterstützt 6 verschiedene KI-Anbieter für detaillierte Fragenerklärungen:

| Anbieter | Modelle | API-Key erhalten |
|----------|---------|------------------|
| **OpenAI** | GPT-4o, GPT-4o-mini, GPT-4-turbo | [platform.openai.com](https://platform.openai.com) |
| **Google Gemini** | 2.0 Flash, 1.5 Pro, 1.5 Flash | [aistudio.google.com](https://aistudio.google.com) |
| **Anthropic Claude** | 3.5 Sonnet, 3 Haiku | [console.anthropic.com](https://console.anthropic.com) |
| **DeepSeek** | Chat, Coder | [platform.deepseek.com](https://platform.deepseek.com) |
| **Qwen (Alibaba)** | Max, Plus, Turbo | [dashscope.console.aliyun.com](https://dashscope.console.aliyun.com) |
| **Perplexity** | Sonar Pro, Sonar | [perplexity.ai/settings/api](https://www.perplexity.ai/settings/api) |

### So richtest du KI-Erklärungen ein:

1. Absolviere ein Quiz und gelange zur Ergebnisseite
2. Klicke auf **"KI-Einstellungen"** (oben rechts)
3. Wähle deinen bevorzugten KI-Anbieter
4. Gib deinen API-Schlüssel ein
5. Optional: Aktiviere "API-Schlüssel speichern"
6. Klicke bei jeder Frage auf **"KI-Erklärung anfordern"**

> ⚠️ **Hinweis:** Dein API-Schlüssel wird nur lokal in deinem Browser gespeichert und niemals an unsere Server gesendet.

---

## 📁 Projektstruktur

```
linux-mastery/
├── backend/
│   ├── server.py              # FastAPI Hauptanwendung
│   ├── questions_extended.py  # Erweiterte Fragendatenbank
│   ├── requirements.txt       # Python Abhängigkeiten
│   └── .env                   # Backend Konfiguration
│
├── frontend/
│   ├── public/
│   │   ├── electron.js        # Electron Hauptprozess
│   │   ├── preload.js         # Electron Preload Script
│   │   └── index.html
│   ├── src/
│   │   ├── App.js             # React Hauptkomponente
│   │   ├── pages/
│   │   │   ├── Landing.jsx    # Startseite
│   │   │   ├── Dashboard.jsx  # Übersicht
│   │   │   ├── Quiz.jsx       # Quiz mit KI-Erklärungen
│   │   │   ├── Flashcards.jsx # Lernkarten
│   │   │   └── StudyPlan.jsx  # Lernplan
│   │   └── components/ui/     # Shadcn UI Komponenten
│   ├── electron-builder.json  # Electron Build Konfiguration
│   ├── installer.nsh          # NSIS Installer Script
│   ├── package.json
│   └── .env                   # Frontend Konfiguration
│
├── memory/
│   └── PRD.md                 # Produktanforderungen
│
└── README.md                  # Diese Datei
```

---

## 🔌 API-Dokumentation

### Basis-URL
```
http://localhost:8001/api
```

### Endpoints

| Methode | Endpoint | Beschreibung |
|---------|----------|--------------|
| GET | `/` | API Info und Version |
| GET | `/chapters` | Alle Kapitel abrufen |
| GET | `/questions/{chapter}` | Fragen eines Kapitels |
| GET | `/flashcards` | Alle Lernkarten |
| GET | `/flashcards/{chapter}` | Lernkarten eines Kapitels |
| GET | `/studyplan` | 20-Wochen-Lernplan |
| GET | `/ai/providers` | Verfügbare KI-Anbieter |
| POST | `/ai/explain` | KI-Erklärung anfordern |

### Beispiel: KI-Erklärung anfordern

```bash
curl -X POST http://localhost:8001/api/ai/explain \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Which command lists loaded kernel modules?",
    "options": ["lsmod", "modinfo", "modprobe", "insmod"],
    "correct_answer": 0,
    "provider": "openai",
    "api_key": "sk-...",
    "language": "de"
  }'
```

---

## 🛠️ Entwicklung

### Backend Tests ausführen

```bash
cd backend
pytest tests/ -v
```

### Frontend Linting

```bash
cd frontend
yarn lint
```

### Electron im Entwicklungsmodus

```bash
cd frontend
yarn electron-dev
```

---

## 📦 Build & Release

### Windows Installer erstellen

```bash
cd frontend

# Production Build
yarn build

# Electron Installer
yarn electron-build-win
```

Output: `frontend/dist/Linux+Mastery-Setup-{version}.exe`

### Docker (optional)

```dockerfile
# Backend
docker build -t linux-mastery-backend ./backend
docker run -p 8001:8001 -e MONGO_URL=... linux-mastery-backend

# Frontend
docker build -t linux-mastery-frontend ./frontend
docker run -p 3000:3000 linux-mastery-frontend
```

---

## 🌍 Offline-Nutzung

Die Desktop-App kann vollständig offline verwendet werden:

1. **Quiz & Lernkarten** - Alle Fragen sind lokal gespeichert
2. **Fortschritt** - Wird im lokalen Speicher gespeichert
3. **Lernplan** - Vollständig offline verfügbar

> **Hinweis:** KI-Erklärungen benötigen eine Internetverbindung, da sie von externen APIs abgerufen werden.

---

## 🤝 Beitragen

Beiträge sind willkommen! So kannst du helfen:

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/neue-funktion`)
3. Committe deine Änderungen (`git commit -m 'Neue Funktion hinzugefügt'`)
4. Push zum Branch (`git push origin feature/neue-funktion`)
5. Öffne einen Pull Request

### Ideen für Beiträge

- [ ] Weitere Prüfungsfragen hinzufügen
- [ ] Prüfungssimulation mit Timer
- [ ] Spaced Repetition Algorithmus
- [ ] Mobile App (React Native)
- [ ] Weitere Sprachen

---

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) für Details.

---

## 🙏 Danksagungen

- CompTIA für die Linux+ Zertifizierung
- Die Open-Source-Community für die verwendeten Bibliotheken
- Alle Mitwirkenden und Tester

---

## 📞 Support

Bei Fragen oder Problemen:
- Öffne ein [GitHub Issue](https://github.com/YOUR_USERNAME/linux-mastery/issues)
- Schau in die [Discussions](https://github.com/YOUR_USERNAME/linux-mastery/discussions)

---

**Viel Erfolg bei deiner Linux+ Prüfung! 🎉**
