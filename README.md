# CompTIA Linux+ XK0-006 Lern-App 🐧

**Prüfungsvorbereitung für CompTIA Linux+ XK0-006 (2025-2027)**

---

## ✨ Features

- 100+ Prüfungsfragen in 5 Kapiteln
- 90-Minuten Prüfungssimulation
- Lernkarten mit Spaced Repetition
- 20-Wochen-Lernplan
- KI-Erklärungen (6 Anbieter)
- Deutsch/Englisch

---

# 🪟 Windows Installation

## Voraussetzungen

1. **Node.js** installieren: https://nodejs.org/ (LTS Version)
2. **Python** installieren: https://python.org/ 
   - ⚠️ **"Add Python to PATH" aktivieren!**
3. **Git** installieren: https://git-scm.com/

## Installation & Start

```powershell
# 1. Projekt herunterladen
cd Desktop
git clone https://github.com/krockodog/LinuxKX0-006.git
cd LinuxKX0-006

# 2. Backend starten (Doppelklick oder im Terminal)
backend\start-windows.bat

# 3. Frontend starten (neues Terminal, Doppelklick oder)
frontend\start-windows.bat
```

**Oder einfach:**
1. `backend\start-windows.bat` doppelklicken
2. `frontend\start-windows.bat` doppelklicken
3. http://localhost:7100 öffnen

## Später starten

Einfach beide `.bat` Dateien doppelklicken:
- `backend\start-windows.bat`
- `frontend\start-windows.bat`

---

# 🐧 Linux Installation

## Voraussetzungen

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y nodejs npm python3 python3-venv git

# Arch
sudo pacman -S nodejs npm python git

# Fedora
sudo dnf install nodejs npm python3 git
```

## Installation & Start

```bash
# 1. Projekt herunterladen
cd ~/Desktop
git clone https://github.com/krockodog/LinuxKX0-006.git
cd LinuxKX0-006

# 2. Scripts ausführbar machen
chmod +x backend/start-linux.sh
chmod +x frontend/start-linux.sh

# 3. Backend starten (Terminal 1)
./backend/start-linux.sh

# 4. Frontend starten (Terminal 2)
./frontend/start-linux.sh
```

## Später starten

```bash
# Terminal 1
./backend/start-linux.sh

# Terminal 2
./frontend/start-linux.sh
```

---

# 🍎 macOS Installation

## Voraussetzungen

```bash
# Homebrew installieren (falls nicht vorhanden)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Software installieren
brew install node python git
```

## Installation & Start

```bash
# 1. Projekt herunterladen
cd ~/Desktop
git clone https://github.com/krockodog/LinuxKX0-006.git
cd LinuxKX0-006

# 2. Scripts ausführbar machen
chmod +x backend/start-linux.sh
chmod +x frontend/start-linux.sh

# 3. Backend starten (Terminal 1)
./backend/start-linux.sh

# 4. Frontend starten (Terminal 2)
./frontend/start-linux.sh
```

---

## 🔧 Fehlerbehebung

| Problem | Lösung |
|---------|--------|
| Python nicht gefunden | Python neu installieren, "Add to PATH" ✅ |
| Node nicht gefunden | Node.js neu installieren |
| Port belegt | Altes Terminal schließen, neu starten |
| Weiße Seite | Warten bis Backend fertig geladen |

---

## 📁 Projektstruktur

```
LinuxKX0-006/
├── backend/
│   ├── server.py
│   ├── start-windows.bat    ← Doppelklick zum Starten
│   └── start-linux.sh       ← ./start-linux.sh
│
├── frontend/
│   ├── src/
│   ├── start-windows.bat    ← Doppelklick zum Starten
│   └── start-linux.sh       ← ./start-linux.sh
│
└── README.md
```

---

**Viel Erfolg bei der Linux+ Prüfung! 🎉**
