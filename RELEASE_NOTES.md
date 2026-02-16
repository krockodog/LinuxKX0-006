# Linux+ Mastery v2.0.0 Release

## 🎉 Was ist neu?

### Matrix-Style Design
- Animierter Matrix-Regen-Hintergrund mit grünen Zeichen
- Glühende UI-Elemente im Terminal-Stil
- Neon-grüne Akzentfarben

### Username-Begrüßung
- Personalisierter Willkommensbildschirm beim ersten Start
- Username wird im Dashboard angezeigt
- Logout-Funktion zum Neustarten

### KI-Erklärungsfunktion
- 6 KI-Anbieter unterstützt:
  - OpenAI (GPT-4o)
  - Google Gemini
  - Anthropic Claude
  - DeepSeek
  - Qwen (Alibaba)
  - Perplexity
- Benutzer gibt eigenen API-Schlüssel ein
- Schlüssel wird lokal gespeichert

### 100+ Prüfungsfragen
- 20 Fragen pro Kapitel
- 5 Kapitel abdecken alle Prüfungsbereiche
- Deutsche und englische Oberfläche

---

## 📥 Download

### Windows Desktop-App
- **Linux+Mastery-Setup-2.0.0.exe** - Vollständiger Installer
- Wähle bei der Installation:
  - ✅ Mit KI-Funktionen (empfohlen)
  - ❌ Ohne KI-Funktionen (Basis-App)

### Portable Version
- **Linux+Mastery-portable-2.0.0.zip** - Keine Installation nötig
- Entpacken und `Linux+Mastery.exe` starten

---

## 🛠️ Selber kompilieren

```bash
# Repository klonen
git clone https://github.com/YOUR_USERNAME/linux-mastery.git
cd linux-mastery/frontend

# Abhängigkeiten installieren
yarn install

# Windows Installer erstellen
yarn electron-build-win
```

Der Installer wird in `frontend/dist/` erstellt.

---

## 📋 Systemanforderungen

| Anforderung | Minimum | Empfohlen |
|-------------|---------|-----------|
| Betriebssystem | Windows 10 | Windows 11 |
| RAM | 4 GB | 8 GB |
| Speicherplatz | 200 MB | 500 MB |
| Bildschirm | 1280x720 | 1920x1080 |

---

## 🐛 Bekannte Probleme

- KI-Erklärungen benötigen Internetverbindung
- Einige Anti-Virus-Programme können den Installer fälschlicherweise blockieren

---

## 📝 Changelog

Siehe [CHANGELOG.md](CHANGELOG.md) für alle Änderungen.

---

## 📄 Lizenz

MIT License - Siehe [LICENSE](LICENSE)
