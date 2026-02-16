# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt hält sich an [Semantic Versioning](https://semver.org/lang/de/).

## [2.0.0] - 2025-12-XX

### Hinzugefügt
- **KI-Erklärungen**: Unterstützung für 6 KI-Anbieter (OpenAI, Gemini, Claude, DeepSeek, Qwen, Perplexity)
- **Erweiterte Fragendatenbank**: 100 Prüfungsfragen (20 pro Kapitel)
- **45 Lernkarten**: Neue Karteikarten für alle Kapitel
- **Electron Desktop-App**: Windows-Installer mit Setup-Wizard
- **KI-Einstellungen Dialog**: Auswahl von Anbieter, Modell und API-Key
- **Optionale KI-Installation**: Setup-Wizard erlaubt Installation ohne KI-Funktionen

### Geändert
- Backend API erweitert mit `/api/ai/providers` und `/api/ai/explain`
- Quiz-Ergebnisseite mit KI-Erklärungsbuttons
- Verbesserte Fehlerbehandlung für API-Aufrufe

### Behoben
- ESLint Warnings in Quiz.jsx behoben
- .gitignore blockiert keine .env Dateien mehr

## [1.0.0] - 2025-12-XX

### Hinzugefügt
- Erste Version der Linux+ Mastery App
- Quiz-Modus mit 50 Fragen
- Lernkarten-Modus mit 30 Karten
- 20-Wochen-Lernplan
- Fortschrittsverfolgung via localStorage
- Zweisprachige Oberfläche (DE/EN)
- Dunkles Terminal-Design
- Keine Registrierung erforderlich

### Technologie-Stack
- Frontend: React 19, Tailwind CSS, Shadcn/UI
- Backend: FastAPI, Python 3.11
- Datenbank: MongoDB (Motor)
