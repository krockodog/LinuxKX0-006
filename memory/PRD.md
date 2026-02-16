# Linux+ Mastery - PRD

## Original Problem Statement
Build a complete learning app from a CompTIA Linux+ XK0-006 exam preparation PDF with quiz mode, flashcards, progress tracking, and 20-week study plan.

## User Requirements
- All features: Quiz, Flashcards, Progress Tracking, 20-Week Plan
- Bilingual: German/English interface
- No user registration required (app works immediately)
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
- Landing Page - Hero, features, stats
- Dashboard - Progress stats, chapters overview
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
- [x] Dark terminal-style theme
- [x] No login required - immediate access

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

### Data Content
- Chapter 1: Linux System Foundations (20 questions, 10 flashcards)
- Chapter 2: Services & User Management (20 questions, 8 flashcards)
- Chapter 3: Security Hardening (20 questions, 11 flashcards)
- Chapter 4: Automation & DevOps (20 questions, 9 flashcards)
- Chapter 5: Troubleshooting & Performance (20 questions, 7 flashcards)

## Test Results (Iteration 2)
- Backend: 100% (12/12 tests passed)
- Frontend: 95% (all features working, minor ESLint warnings fixed)

## Prioritized Backlog

### P0 (Critical) - DONE ✅
- [x] 100+ quiz questions
- [x] AI-powered explanations with 6 providers
- [x] Electron desktop app setup

### P1 (High Priority)
- [ ] Build and test Windows installer executable
- [ ] Add more questions (currently 100, PDF has 150+)
- [ ] Implement spaced repetition algorithm for flashcards
- [ ] Add exam simulation mode (timed 90-minute tests)

### P2 (Medium Priority)
- [ ] User achievements/badges system
- [ ] Export progress reports (PDF/CSV)
- [ ] Notes feature per topic
- [ ] Study streak notifications

### P3 (Low Priority)
- [ ] Mobile-responsive improvements
- [ ] Offline mode for desktop app
- [ ] Social features (leaderboards)

## Files Reference
- `/app/backend/server.py` - Main API with all endpoints
- `/app/backend/questions_extended.py` - Extended questions data
- `/app/frontend/src/pages/Quiz.jsx` - Quiz with AI explanations
- `/app/frontend/public/electron.js` - Electron main process
- `/app/frontend/electron-builder.json` - Build configuration
- `/app/frontend/installer.nsh` - NSIS custom installer script

## Next Steps
1. Test Electron build on Windows machine
2. Generate installer with `yarn electron-build-win`
3. Test installer with/without AI option
4. Add remaining 50+ questions from PDF
