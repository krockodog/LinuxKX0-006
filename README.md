# CompTIA Linux+ XK0-006 Lern-App 🐧

**Prüfungsvorbereitung für CompTIA Linux+ XK0-006 (2025-2027)**

---

## 🚀 Installation

### Voraussetzungen

| Software | Download |
|----------|----------|
| Node.js 18+ | [nodejs.org](https://nodejs.org/) |
| Python 3.9+ | [python.org](https://python.org/) |
| Git | [git-scm.com](https://git-scm.com/) |

---

### Schritt 1: Repository klonen

| 🐧 Linux / macOS | 🪟 Windows (PowerShell) |
|------------------|-------------------------|
| `cd ~/Desktop` | `cd $HOME\Desktop` |
| `git clone https://github.com/krockodog/LinuxKX0-006.git` | `git clone https://github.com/krockodog/LinuxKX0-006.git` |
| `cd LinuxKX0-006` | `cd LinuxKX0-006` |

---

### Schritt 2: Backend einrichten

| 🐧 Linux / macOS | 🪟 Windows (PowerShell) |
|------------------|-------------------------|
| `cd backend` | `cd backend` |
| `python3 -m venv venv` | `python -m venv venv` |
| `source venv/bin/activate` | `venv\Scripts\activate` |
| `pip install -r requirements.txt` | `pip install -r requirements.txt` |
| `cp .env.example .env` | `copy .env.example .env` |

---

### Schritt 3: Frontend einrichten (neues Terminal!)

| 🐧 Linux / macOS | 🪟 Windows (PowerShell) |
|------------------|-------------------------|
| `cd LinuxKX0-006/frontend` | `cd LinuxKX0-006\frontend` |
| `npm install -g yarn` | `npm install -g yarn` |
| `yarn install` | `yarn install` |
| `cp .env.example .env` | `copy .env.example .env` |

**In `.env` ändern:**
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

---

### Schritt 4: App starten

#### Terminal 1 - Backend:

| 🐧 Linux / macOS | 🪟 Windows (PowerShell) |
|------------------|-------------------------|
| `cd LinuxKX0-006/backend` | `cd LinuxKX0-006\backend` |
| `source venv/bin/activate` | `venv\Scripts\activate` |
| `uvicorn server:app --port 8001` | `python -m uvicorn server:app --port 8001` |

#### Terminal 2 - Frontend:

| 🐧 Linux / macOS | 🪟 Windows (PowerShell) |
|------------------|-------------------------|
| `cd LinuxKX0-006/frontend` | `cd LinuxKX0-006\frontend` |
| `yarn start` | `yarn start` |

---

### ✅ Fertig!

Öffne **http://localhost:3000** im Browser.

---

## 🔄 App später starten

| 🐧 Linux / macOS | 🪟 Windows (PowerShell) |
|------------------|-------------------------|
| **Terminal 1:** | **Terminal 1:** |
| `cd LinuxKX0-006/backend` | `cd LinuxKX0-006\backend` |
| `source venv/bin/activate` | `venv\Scripts\activate` |
| `uvicorn server:app --port 8001` | `python -m uvicorn server:app --port 8001` |
| **Terminal 2:** | **Terminal 2:** |
| `cd LinuxKX0-006/frontend` | `cd LinuxKX0-006\frontend` |
| `yarn start` | `yarn start` |

---

## 🔧 Fehlerbehebung

| Problem | 🐧 Linux / macOS | 🪟 Windows |
|---------|------------------|------------|
| Python nicht gefunden | `sudo apt install python3` | Python neu installieren mit "Add to PATH" ✅ |
| Yarn nicht gefunden | `npm install -g yarn` | `npm install -g yarn` |
| Port 3000 belegt | `kill -9 $(lsof -t -i:3000)` | `netstat -ano \| findstr :3000` dann `taskkill /PID <PID> /F` |
| Module fehlen | `rm -rf node_modules && yarn install` | `rmdir /s /q node_modules` dann `yarn install` |
| CORS Error | Backend läuft? → http://localhost:8001/api/ | Backend läuft? → http://localhost:8001/api/ |

---

## ✨ Features

- 100+ Prüfungsfragen in 5 Kapiteln
- 90-Minuten Prüfungssimulation
- Lernkarten mit Spaced Repetition
- 20-Wochen-Lernplan
- KI-Erklärungen (6 Anbieter)
- Deutsch/Englisch
- Kein Login nötig

---

**Viel Erfolg bei der Linux+ Prüfung! 🎉**
