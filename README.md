# Linux+ Mastery 🐧

**Vollständige Lern-App für die CompTIA Linux+ XK0-006 Zertifizierungsprüfung (2025-2027)**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.0.0-green.svg)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Windows-lightgrey.svg)
![Language](https://img.shields.io/badge/language-DE%20%7C%20EN-orange.svg)

<p align="center">
  <img src="docs/screenshot-landing.png" alt="Linux+ Mastery Landing Page" width="800">
</p>

---

## 📋 Inhaltsverzeichnis

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Schnellstart](#-schnellstart)
- [Installation](#-installation)
  - [Option 1: Web-App (Entwicklung)](#option-1-web-app-entwicklung)
  - [Option 2: Windows Desktop-App](#option-2-windows-desktop-app)
  - [Option 3: Docker](#option-3-docker)
- [KI-Erklärungen einrichten](#-ki-erklärungen-einrichten)
- [Projektstruktur](#-projektstruktur)
- [API-Dokumentation](#-api-dokumentation)
- [Mitwirken](#-mitwirken)
- [Lizenz](#-lizenz)

---

## ✨ Features

### Lernmodi

| Feature | Beschreibung |
|---------|--------------|
| **Quiz-Modus** | 100+ realistische Multiple-Choice-Fragen in 5 Kapiteln |
| **Prüfungssimulation** | 90-Minuten-Timer mit 60 Fragen - wie die echte Prüfung |
| **Lernkarten** | Interaktive Karteikarten mit Spaced Repetition Algorithmus |
| **20-Wochen-Plan** | Strukturierter Lernplan für die Prüfungsvorbereitung |

### Besonderheiten

- **Matrix-Design** - Animierter Hintergrund im Hacker-Style
- **Zweisprachig** - Komplett in Deutsch und Englisch
- **Kein Login** - Sofort loslegen, Fortschritt wird lokal gespeichert
- **KI-Erklärungen** - Detaillierte Erklärungen von 6 KI-Anbietern
- **Offline-fähig** - Desktop-App funktioniert ohne Internet
- **Spaced Repetition** - Intelligentes Wiederholungssystem für Lernkarten

### Kapitelübersicht

| # | Kapitel | Themen | Gewichtung |
|---|---------|--------|------------|
| 1 | Linux-Systemgrundlagen | Boot-Prozess, LVM, RAID, Virtualisierung | 23% |
| 2 | Dienste & Benutzerverwaltung | Systemd, Berechtigungen, Container | 20% |
| 3 | Sicherheitshärtung | PAM, Firewalls, SELinux, Verschlüsselung | 18% |
| 4 | Automatisierung & DevOps | Ansible, Scripting, Git, CI/CD | 17% |
| 5 | Fehlerbehebung & Leistung | Monitoring, Diagnose, Optimierung | 22% |

---

## 📸 Screenshots

<details>
<summary>Landing Page mit Matrix-Hintergrund</summary>
<img src="docs/screenshot-landing.png" alt="Landing Page" width="800">
</details>

<details>
<summary>Dashboard mit Fortschrittsanzeige</summary>
<img src="docs/screenshot-dashboard.png" alt="Dashboard" width="800">
</details>

<details>
<summary>Prüfungssimulation (90 Minuten)</summary>
<img src="docs/screenshot-exam.png" alt="Exam Simulation" width="800">
</details>

<details>
<summary>Lernkarten mit Spaced Repetition</summary>
<img src="docs/screenshot-flashcards.png" alt="Flashcards" width="800">
</details>

---

## 🚀 Schnellstart

### Voraussetzungen

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.9+ ([Download](https://python.org/))
- **Git** ([Download](https://git-scm.com/))

### In 5 Minuten starten

```bash
# 1. Repository klonen
git clone https://github.com/DEIN_USERNAME/linux-mastery.git
cd linux-mastery

# 2. Backend starten
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn server:app --port 8001 &

# 3. Frontend starten
cd ../frontend
yarn install
yarn start
```

Die App läuft jetzt auf **http://localhost:3000** 🎉

---

## 📦 Installation

### Option 1: Web-App (Entwicklung)

#### Schritt 1: Repository klonen

```bash
git clone https://github.com/DEIN_USERNAME/linux-mastery.git
cd linux-mastery
```

#### Schritt 2: Backend einrichten

```bash
cd backend

# Virtuelle Python-Umgebung erstellen
python -m venv venv

# Aktivieren
source venv/bin/activate      # Linux/Mac
venv\Scripts\activate         # Windows (CMD)
venv\Scripts\Activate.ps1     # Windows (PowerShell)

# Abhängigkeiten installieren
pip install -r requirements.txt

# Konfiguration erstellen
cp .env.example .env
```

**Backend `.env` Konfiguration:**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=linux_mastery
CORS_ORIGINS=*
```

> **Hinweis:** MongoDB ist optional. Die App funktioniert auch ohne Datenbank - der Fortschritt wird dann nur im Browser gespeichert.

#### Schritt 3: Frontend einrichten

```bash
cd ../frontend

# Abhängigkeiten installieren (yarn empfohlen)
yarn install
# oder: npm install

# Konfiguration erstellen
cp .env.example .env
```

**Frontend `.env` Konfiguration:**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=3000
```

#### Schritt 4: Anwendung starten

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

Öffne **http://localhost:3000** im Browser.

---

### Option 2: Windows Desktop-App

#### Methode A: Installer herunterladen (empfohlen)

1. Gehe zu [Releases](https://github.com/DEIN_USERNAME/linux-mastery/releases)
2. Lade `Linux+Mastery-Setup-2.0.0.exe` herunter
3. Führe den Installer aus
4. Wähle im Setup:
   - ✅ **Mit KI-Funktionen** - Vollständige App
   - ❌ **Ohne KI** - Kleinere Installation ohne KI-Features

#### Methode B: Selbst kompilieren

**Voraussetzungen:**
- Windows 10/11
- Node.js 18+
- Yarn (`npm install -g yarn`)

```powershell
# Repository klonen
git clone https://github.com/DEIN_USERNAME/linux-mastery.git
cd linux-mastery/frontend

# Abhängigkeiten installieren
yarn install

# Windows Installer bauen
yarn electron-build-win
```

Der Installer wird in `frontend/dist/` erstellt:
- `Linux+Mastery-Setup-2.0.0.exe` - Installer
- `win-unpacked/` - Portable Version

---

### Option 3: Docker

```bash
# Mit Docker Compose (empfohlen)
docker-compose up -d

# Oder einzeln:
# Backend
docker build -t linux-mastery-backend ./backend
docker run -p 8001:8001 linux-mastery-backend

# Frontend
docker build -t linux-mastery-frontend ./frontend
docker run -p 3000:3000 linux-mastery-frontend
```

---

## 🤖 KI-Erklärungen einrichten

Die App unterstützt **6 KI-Anbieter** für detaillierte Fragenerklärungen:

| Anbieter | Modelle | Kosten | API-Key holen |
|----------|---------|--------|---------------|
| **OpenAI** | GPT-4o, GPT-4o-mini | ~$0.01/Frage | [platform.openai.com](https://platform.openai.com/api-keys) |
| **Google Gemini** | 2.0 Flash, 1.5 Pro | Kostenlos* | [aistudio.google.com](https://aistudio.google.com/apikey) |
| **Anthropic Claude** | 3.5 Sonnet, Haiku | ~$0.01/Frage | [console.anthropic.com](https://console.anthropic.com) |
| **DeepSeek** | Chat, Coder | Sehr günstig | [platform.deepseek.com](https://platform.deepseek.com) |
| **Qwen** | Max, Plus, Turbo | Günstig | [dashscope.aliyun.com](https://dashscope.console.aliyun.com) |
| **Perplexity** | Sonar Pro, Sonar | ~$0.005/Frage | [perplexity.ai/settings](https://www.perplexity.ai/settings/api) |

*\*Gemini: 15 Anfragen/Minute kostenlos*

### So richtest du es ein:

1. Öffne ein Quiz und beantworte die Fragen
2. Auf der Ergebnisseite: Klicke auf **⚙️ KI-Einstellungen**
3. Wähle deinen Anbieter (z.B. "Google Gemini")
4. Füge deinen API-Key ein
5. Klicke bei einer Frage auf **"KI-Erklärung"**

> 🔒 **Sicherheit:** Dein API-Key wird nur lokal in deinem Browser gespeichert und niemals an unsere Server gesendet. Die Anfragen gehen direkt vom Backend an den KI-Anbieter.

---

## 📁 Projektstruktur

```
linux-mastery/
├── backend/
│   ├── server.py              # FastAPI Server (alle Endpoints)
│   ├── questions_extended.py  # Erweiterte Fragendatenbank
│   ├── requirements.txt       # Python Abhängigkeiten
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   ├── electron.js        # Electron Hauptprozess
│   │   └── preload.js         # Electron IPC Bridge
│   ├── src/
│   │   ├── App.js             # React Router & Context
│   │   ├── components/
│   │   │   ├── MatrixBackground.jsx  # Matrix Animation
│   │   │   └── WelcomeScreen.jsx     # Username Dialog
│   │   ├── pages/
│   │   │   ├── Landing.jsx      # Startseite
│   │   │   ├── Dashboard.jsx    # Übersicht & Stats
│   │   │   ├── Quiz.jsx         # Quiz mit KI-Erklärungen
│   │   │   ├── ExamSimulation.jsx  # 90-Min Prüfung
│   │   │   ├── Flashcards.jsx   # Lernkarten + SRS
│   │   │   └── StudyPlan.jsx    # 20-Wochen-Plan
│   │   └── components/ui/       # Shadcn UI Komponenten
│   ├── electron-builder.json    # Windows Build Config
│   ├── installer.nsh            # NSIS Installer Script
│   ├── package.json
│   └── .env.example
│
├── docker-compose.yml
├── WINDOWS_BUILD.md            # Windows Build Anleitung
├── OFFLINE_SETUP.md            # Offline Installation
└── README.md                   # Diese Datei
```

---

## 🔌 API-Dokumentation

**Basis-URL:** `http://localhost:8001/api`

### Endpoints

| Methode | Endpoint | Beschreibung |
|---------|----------|--------------|
| `GET` | `/` | API Info & Version |
| `GET` | `/chapters` | Alle Kapitel (DE/EN) |
| `GET` | `/questions/{chapter}` | Quiz-Fragen eines Kapitels |
| `GET` | `/flashcards` | Alle Lernkarten |
| `GET` | `/flashcards/{chapter}` | Lernkarten eines Kapitels |
| `GET` | `/studyplan` | 20-Wochen-Lernplan |
| `GET` | `/ai/providers` | Verfügbare KI-Anbieter |
| `POST` | `/ai/explain` | KI-Erklärung anfordern |

### Beispiel: KI-Erklärung

```bash
curl -X POST http://localhost:8001/api/ai/explain \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Which command lists loaded kernel modules?",
    "options": ["lsmod", "modinfo", "modprobe", "insmod"],
    "correct_answer": 0,
    "provider": "gemini",
    "api_key": "YOUR_API_KEY",
    "language": "de"
  }'
```

---

## 🛠️ Entwicklung

### Backend testen

```bash
cd backend
source venv/bin/activate
pytest tests/ -v
```

### Frontend Linting

```bash
cd frontend
yarn lint
```

### Electron Dev-Modus

```bash
cd frontend
yarn electron-dev
```

---

## 🤝 Mitwirken

Beiträge sind willkommen! So kannst du helfen:

1. **Fork** das Repository
2. Erstelle einen Branch: `git checkout -b feature/neue-funktion`
3. Committe: `git commit -m 'Neue Funktion hinzugefügt'`
4. Push: `git push origin feature/neue-funktion`
5. Öffne einen **Pull Request**

### Ideen für Beiträge

- [ ] Weitere Prüfungsfragen hinzufügen
- [ ] Mobile App (React Native)
- [ ] Achievements/Badges System
- [ ] Export zu PDF/Anki
- [ ] Weitere Sprachen

---

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE)

---

## 🙏 Danksagungen

- [CompTIA](https://www.comptia.org/) für die Linux+ Zertifizierung
- [Shadcn/UI](https://ui.shadcn.com/) für die UI-Komponenten
- [Electron](https://www.electronjs.org/) für die Desktop-App
- Alle Mitwirkenden und Tester

---

## 📞 Support

- **GitHub Issues:** [Issues öffnen](https://github.com/DEIN_USERNAME/linux-mastery/issues)
- **Discussions:** [Diskussionen](https://github.com/DEIN_USERNAME/linux-mastery/discussions)

---

<p align="center">
  <b>Viel Erfolg bei deiner Linux+ Prüfung! 🎉🐧</b>
</p>
