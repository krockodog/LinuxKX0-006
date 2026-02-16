# Linux+ Mastery - Desktop App

## Build Instructions

### Prerequisites
- Node.js 18+ 
- Yarn package manager

### Development
```bash
cd frontend
yarn install
yarn electron-dev
```

### Build Windows Installer
```bash
cd frontend
yarn electron-build-win
```

The installer will be created in `frontend/dist/` folder.

## Installation Options

During installation, you can choose to:
1. **Install with AI Features** - Enables AI-powered explanations for quiz questions (requires your own API key)
2. **Install without AI Features** - Basic learning app without AI explanations

## Supported AI Providers

The app supports the following AI providers for explanations:
- OpenAI (GPT-4o, GPT-4o-mini, GPT-4-turbo)
- Google Gemini (2.0 Flash, 1.5 Pro, 1.5 Flash)
- Anthropic Claude (3.5 Sonnet, 3 Haiku)
- DeepSeek (Chat, Coder)
- Qwen/Alibaba (Max, Plus, Turbo)
- Perplexity (Sonar Pro, Sonar)

## API Key Setup

1. After completing a quiz, click "AI Settings"
2. Select your preferred AI provider
3. Enter your API key (obtain from provider's website)
4. Optionally save the key for future sessions

API keys are stored locally in your browser/app storage and are never sent to any server except the AI provider you selected.

## Features

- 150+ exam-style questions
- 45 flashcards
- 20-week structured study plan
- Progress tracking
- German/English language support
- AI-powered explanations (optional)
