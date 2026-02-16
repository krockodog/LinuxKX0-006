# Linux+ Mastery - PRD

## Original Problem Statement
Build a complete learning app from a CompTIA Linux+ XK0-006 exam preparation PDF with quiz mode, flashcards, progress tracking, and 20-week study plan.

## User Requirements
- All features: Quiz, Flashcards, Progress Tracking, 20-Week Plan
- Bilingual: German/English interface
- Username prompt before starting (not full auth)
- Matrix-style animated background
- Dark mode terminal-style theme
- AI-powered explanations with 6 providers (user provides own API key)
- Windows Desktop App via Electron (with option to install without AI)

## Architecture

### Backend (FastAPI)
- `/api/` - Root endpoint with version info
- `/api/chapters` - Get all chapters with EN/DE titles
- `/api/questions/{chapter}` - Get quiz questions (20 per chapter)
- `/api/flashcards` - Get all flashcards (45 total)
- `/api/flashcards/{chapter}` - Get chapter-specific flashcards
- `/api/studyplan` - Get 20-week study plan
- `/api/ai/providers` - Get list of 6 AI providers
- `/api/ai/explain` - POST endpoint for AI explanations

### Frontend (React + Tailwind + Shadcn/UI)
- Welcome Screen - Username input with Matrix background
- Landing Page - Hero, features, stats with Matrix effect
- Dashboard - Progress stats, chapters overview, username display
- Quiz Page - Multiple choice questions, results, AI explanations
- Flashcards Page - Flip cards with chapter filter
- Study Plan Page - 20-week timeline

### AI Providers Supported
1. OpenAI (GPT-4o, GPT-4o-mini, GPT-4-turbo)
2. Google Gemini (2.0 Flash, 1.5 Pro, 1.5 Flash)
3. Anthropic Claude (3.5 Sonnet, 3 Haiku)
4. DeepSeek (Chat, Coder)
5. Qwen/Alibaba (Max, Plus, Turbo)
6. Perplexity (Sonar Pro, Sonar)

## What's Been Implemented (Dec 2025)

### Core Features ✅
- [x] 100 quiz questions across 5 chapters (20 per chapter)
- [x] 45 flashcards with categories
- [x] 20-week study plan tracker
- [x] Progress tracking (quizzes, accuracy, streak) via localStorage
- [x] Bilingual DE/EN support with language toggle
- [x] Username welcome screen (stored in localStorage)
- [x] Matrix-style animated background
- [x] Logout/reset functionality

### AI Features ✅
- [x] AI-powered explanations endpoint
- [x] 6 AI provider support (OpenAI, Gemini, Claude, DeepSeek, Qwen, Perplexity)
- [x] User provides own API key (stored locally)
- [x] AI Settings dialog with provider/model selection
- [x] Get AI Explanation button on quiz results

### Desktop App (Electron) ✅
- [x] Electron main process setup
- [x] Preload script for IPC
- [x] electron-builder configuration for Windows
- [x] NSIS installer script with AI feature toggle option
- [x] Build scripts in package.json
- [x] Production build ready

### UI/UX ✅
- [x] Matrix rain animated canvas background
- [x] Neon green color scheme (#00ff41)
- [x] Glowing card effects
- [x] Welcome screen with username input
- [x] Username displayed in header
- [x] Logout button

### Documentation ✅
- [x] README.md - Full German documentation
- [x] OFFLINE_SETUP.md - Detailed offline installation guide
- [x] CHANGELOG.md - Version history
- [x] RELEASE_NOTES.md - Release information
- [x] LICENSE - MIT License
- [x] .env.example files for backend/frontend
- [x] Docker files (Dockerfile, docker-compose.yml)

## Files Reference
- `/app/backend/server.py` - Main API with all endpoints
- `/app/backend/questions_extended.py` - Extended questions data
- `/app/frontend/src/App.js` - Main frontend with username/welcome logic
- `/app/frontend/src/components/MatrixBackground.jsx` - Matrix effect
- `/app/frontend/src/components/WelcomeScreen.jsx` - Username input
- `/app/frontend/src/pages/Quiz.jsx` - Quiz with AI explanations
- `/app/frontend/public/electron.js` - Electron main process
- `/app/frontend/electron-builder.json` - Build configuration

## Prioritized Backlog

### P0 (Critical) - DONE ✅
- [x] 100+ quiz questions
- [x] AI-powered explanations with 6 providers
- [x] Electron desktop app setup
- [x] Matrix background
- [x] Username welcome screen

### P1 (High Priority)
- [x] Exam simulation mode (90-minute timer, 60 questions)
- [x] Spaced repetition algorithm for flashcards
- [ ] Build and distribute Windows installer
- [ ] Add more questions (currently 100, PDF has 150+)

### P2 (Medium Priority)
- [ ] User achievements/badges system
- [ ] Export progress reports (PDF/CSV)

### P3 (Low Priority)
- [ ] Mobile-responsive improvements
- [ ] Offline mode for desktop app
- [ ] Social features (leaderboards)

## Next Steps
1. Push to GitHub using "Save to GitHub" feature
2. Create GitHub Release with Windows installer
3. Add remaining questions from PDF

