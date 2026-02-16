# Linux+ Mastery - PRD

## Original Problem Statement
Build a complete learning app from a CompTIA Linux+ XK0-006 exam preparation PDF with quiz mode, flashcards, progress tracking, and 20-week study plan.

## User Requirements
- All features: Quiz, Flashcards, Progress Tracking, 20-Week Plan
- Bilingual: German/English interface
- Username prompt before starting (not full auth)
- Matrix-style animated background on all pages
- Dark mode terminal-style theme
- AI-powered explanations with 6 providers (user provides own API key)
- Windows Desktop App via Electron (with option to install without AI)
- 90-minute Exam Simulation mode
- Spaced Repetition algorithm for flashcards

## Architecture

### Backend (FastAPI)
- `/api/` - Root endpoint with version info
- `/api/chapters` - Get all chapters with EN/DE titles
- `/api/questions/{chapter}` - Get quiz questions (20 per chapter)
- `/api/flashcards` - Get all flashcards
- `/api/flashcards/{chapter}` - Get chapter-specific flashcards
- `/api/studyplan` - Get 20-week study plan
- `/api/ai/providers` - Get list of 6 AI providers
- `/api/ai/explain` - POST endpoint for AI explanations

### Frontend (React + Tailwind + Shadcn/UI)
- Landing Page - Hero with Matrix background, EN/DE toggle
- Welcome Screen - Username input overlay (after clicking Get Started)
- Dashboard - Progress stats, chapters overview, username display
- Quiz Page - Multiple choice questions, results, AI explanations
- Flashcards Page - Flip cards with chapter filter + Spaced Repetition mode
- Study Plan Page - 20-week timeline
- Exam Simulation - 90-minute timed exam with 60 questions

### AI Providers Supported
1. OpenAI (GPT-4o, GPT-4o-mini, GPT-4-turbo)
2. Google Gemini (2.0 Flash, 1.5 Pro, 1.5 Flash)
3. Anthropic Claude (3.5 Sonnet, 3 Haiku)
4. DeepSeek (Chat, Coder)
5. Qwen/Alibaba (Max, Plus, Turbo)
6. Perplexity (Sonar Pro, Sonar)

## What's Been Implemented (Dec 2025)

### Core Features ✅
- [x] 100+ quiz questions across 5 chapters
- [x] 45+ flashcards with categories
- [x] 20-week study plan tracker
- [x] Progress tracking via localStorage
- [x] Bilingual DE/EN support with language toggle
- [x] Username welcome screen (stored in localStorage)
- [x] Matrix-style animated background on ALL pages
- [x] Logout/reset functionality

### AI Features ✅
- [x] AI-powered explanations endpoint
- [x] 6 AI provider support
- [x] User provides own API key (stored locally)
- [x] AI Settings dialog with provider/model selection

### Exam Simulation ✅
- [x] 90-minute timer
- [x] 60 randomized questions from all chapters
- [x] Pause/Resume functionality
- [x] 10-minute warning
- [x] Question navigator
- [x] Detailed results with pass/fail status (80% passing)
- [x] Progress saved to localStorage

### Spaced Repetition Flashcards ✅
- [x] SRS algorithm with intervals (Again: 6min, Hard: 1h, Good: 1d, Easy: 3d)
- [x] Card status tracking (New, Due, Learning)
- [x] Session statistics
- [x] Normal mode for free browsing
- [x] Due cards counter
- [x] Progress saved to localStorage

### Desktop App (Electron) ✅
- [x] Electron main process setup
- [x] Preload script for IPC
- [x] electron-builder configuration for Windows
- [x] NSIS installer script with AI feature toggle option
- [x] Build scripts in package.json

### UI/UX ✅
- [x] Matrix rain animated canvas background
- [x] Neon green color scheme (#00ff41)
- [x] Glowing card effects
- [x] Welcome screen with username input
- [x] Username displayed in header

### Documentation ✅
- [x] README.md - Full German documentation
- [x] OFFLINE_SETUP.md - Detailed offline installation guide
- [x] CHANGELOG.md - Version history
- [x] WINDOWS_BUILD.md - Windows installer build guide
- [x] LICENSE - MIT License
- [x] Docker files

## Files Reference
- `/app/backend/server.py` - Main API with all endpoints
- `/app/backend/questions_extended.py` - Extended questions data
- `/app/frontend/src/App.js` - Main frontend with username/welcome logic
- `/app/frontend/src/components/MatrixBackground.jsx` - Matrix effect
- `/app/frontend/src/components/WelcomeScreen.jsx` - Username input
- `/app/frontend/src/pages/Quiz.jsx` - Quiz with AI explanations
- `/app/frontend/src/pages/ExamSimulation.jsx` - 90-min timed exam
- `/app/frontend/src/pages/Flashcards.jsx` - SRS flashcards
- `/app/frontend/public/electron.js` - Electron main process
- `/app/frontend/electron-builder.json` - Build configuration
- `/app/WINDOWS_BUILD.md` - Windows build instructions

## Prioritized Backlog

### P0 (Critical) - DONE ✅
- [x] Quiz mode with 100+ questions
- [x] AI-powered explanations with 6 providers
- [x] Electron desktop app setup
- [x] Matrix background on all pages
- [x] Username welcome screen
- [x] Exam simulation mode (90-minute timer, 60 questions)
- [x] Spaced repetition algorithm for flashcards

### P1 (High Priority) - BLOCKED
- [ ] Build and distribute Windows installer (requires Windows machine)

### P2 (Medium Priority)
- [ ] User achievements/badges system
- [ ] Export progress reports (PDF/CSV)
- [ ] Add more questions (currently 100+, PDF has 150+)

### P3 (Low Priority)
- [ ] Mobile-responsive improvements
- [ ] Offline mode for desktop app
- [ ] Social features (leaderboards)

## Windows Installer Build

**IMPORTANT:** The Windows installer cannot be built in the agent's Linux environment.

To build the Windows installer:
1. Clone the repository to a Windows machine
2. Follow the instructions in `/app/WINDOWS_BUILD.md`
3. Run: `cd frontend && yarn install && yarn electron-build-win`
4. The installer will be created in `frontend/dist/`

## Technical Notes

- Progress is stored in localStorage (no server-side persistence required)
- App works offline once loaded (static questions/flashcards)
- AI features require user to provide their own API keys
- Matrix background uses HTML5 Canvas for performance
