# Linux+ Mastery - PRD

## Original Problem Statement
Build a complete learning app from a CompTIA Linux+ XK0-006 exam preparation PDF with quiz mode, flashcards, progress tracking, and 20-week study plan.

## User Choices
- All features: Quiz, Flashcards, Progress Tracking, 20-Week Plan
- Bilingual: German/English interface
- JWT Authentication
- Dark mode theme

## Architecture

### Backend (FastAPI + MongoDB)
- `/api/auth/register` - User registration
- `/api/auth/login` - User login with JWT
- `/api/auth/me` - Get current user
- `/api/auth/language` - Update language preference
- `/api/chapters` - Get all chapters
- `/api/questions/{chapter}` - Get quiz questions
- `/api/quiz/submit` - Submit quiz answers
- `/api/flashcards` - Get all flashcards
- `/api/flashcards/{chapter}` - Get chapter flashcards
- `/api/progress` - Get user progress
- `/api/studyplan` - Get 20-week study plan

### Frontend (React + Tailwind + Shadcn/UI)
- Landing Page - Hero, features, stats
- Auth Page - Login/Register forms
- Dashboard - Progress stats, chapters overview
- Quiz Page - Multiple choice questions, results
- Flashcards Page - Flip cards with chapter filter
- Study Plan Page - 20-week timeline

## What's Been Implemented (Feb 2026)

### Core Features ✅
- [x] User authentication (JWT-based)
- [x] 50 quiz questions across 5 chapters
- [x] 30 flashcards with categories
- [x] 20-week study plan tracker
- [x] Progress tracking (quizzes, accuracy, streak)
- [x] Bilingual DE/EN support
- [x] Dark terminal-style theme

### Data Content
- Chapter 1: Linux System Foundations (10 questions, 8 flashcards)
- Chapter 2: Services & User Management (10 questions, 6 flashcards)
- Chapter 3: Security Hardening (10 questions, 6 flashcards)
- Chapter 4: Automation & DevOps (10 questions, 5 flashcards)
- Chapter 5: Troubleshooting & Performance (10 questions, 5 flashcards)

## Prioritized Backlog

### P0 (Critical)
- All core features implemented ✅

### P1 (High Priority)
- [ ] Add more questions (currently 50, PDF has 150+)
- [ ] Add more flashcards (currently 30)
- [ ] Implement spaced repetition algorithm
- [ ] Add exam simulation mode (timed tests)

### P2 (Medium Priority)
- [ ] Add user achievements/badges
- [ ] Export progress reports
- [ ] Add notes feature per topic
- [ ] Social features (leaderboards)

### P3 (Low Priority)
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] AI-powered explanations

## Next Action Items
1. Extract remaining 100+ questions from PDF
2. Add exam simulation with 90-minute timer
3. Implement spaced repetition for flashcards
4. Add study streak notifications
