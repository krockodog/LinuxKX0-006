# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt hält sich an [Semantic Versioning](https://semver.org/lang/de/).

## [2.1.0] - 2025-12-XX

### Hinzugefügt
- **Prüfungssimulation**: 90-Minuten-Timer mit 60 Fragen wie bei der echten CompTIA-Prüfung
  - Pause/Fortsetzen Funktion
  - 10-Minuten-Warnung
  - Fragennavigator
  - Detaillierte Ergebnisse mit Bestanden/Nicht-bestanden Status (80% Grenze)
- **Spaced Repetition für Lernkarten**: Intelligenter Lernalgorithmus
  - 4 Bewertungsstufen: Nochmal (6min), Schwer (1h), Gut (1d), Leicht (3d)
  - Kartenstatus: Neu, Fällig, Gelernt
  - Session-Statistiken
  - Fortschritt wird lokal gespeichert
- **Matrix-Hintergrund**: Animierter Canvas-Hintergrund auf allen Seiten
- **Willkommensbildschirm**: Benutzername-Eingabe nach "Get Started"
  - Name wird im Dashboard-Header angezeigt
  - Lokal gespeichert (kein Login erforderlich)
- **Logout-Funktion**: Benutzerdaten und Fortschritt zurücksetzen

### Geändert
- Dashboard zeigt jetzt Link zu Prüfungssimulation
- Dashboard zeigt Link zu Spaced Repetition
- Verbesserte UI/UX mit Glow-Effekten
- Lernkarten-Seite komplett überarbeitet

## [2.0.0] - 2025-12-XX

### Hinzugefügt
- **KI-Erklärungen**: Unterstützung für 6 KI-Anbieter
  - OpenAI (GPT-4o, GPT-4o-mini, GPT-4-turbo)
  - Google Gemini (2.0 Flash, 1.5 Pro, 1.5 Flash)
  - Anthropic Claude (3.5 Sonnet, 3 Haiku)
  - DeepSeek (Chat, Coder)
  - Qwen/Alibaba (Max, Plus, Turbo)
  - Perplexity (Sonar Pro, Sonar)
- **Erweiterte Fragendatenbank**: 100+ Prüfungsfragen (20+ pro Kapitel)
- **45+ Lernkarten**: Neue Karteikarten für alle Kapitel mit Kategorien
- **Electron Desktop-App**: Windows-Installer mit Setup-Wizard
- **KI-Einstellungen Dialog**: Auswahl von Anbieter, Modell und API-Key
- **Optionale KI-Installation**: Setup-Wizard erlaubt Installation ohne KI-Funktionen

### Geändert
- Backend API erweitert mit `/api/ai/providers` und `/api/ai/explain`
- Quiz-Ergebnisseite mit KI-Erklärungsbuttons
- Verbesserte Fehlerbehandlung für API-Aufrufe

### Behoben
- ESLint Warnings behoben
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
- Desktop: Electron
- Datenbank: MongoDB (Motor) - optional
