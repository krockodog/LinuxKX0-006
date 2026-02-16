import { useState, useEffect, createContext, useContext } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";

// Components
import MatrixBackground from "./components/MatrixBackground";
import WelcomeScreen from "./components/WelcomeScreen";

// Pages
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Flashcards from "./pages/Flashcards";
import StudyPlan from "./pages/StudyPlan";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Translations
export const translations = {
  en: {
    appName: "Linux+ Mastery",
    tagline: "Master CompTIA Linux+ XK0-006",
    login: "Login",
    register: "Register",
    logout: "Logout",
    email: "Email",
    password: "Password",
    name: "Name",
    dashboard: "Dashboard",
    quiz: "Quiz",
    flashcards: "Flashcards",
    studyPlan: "Study Plan",
    progress: "Progress",
    chapters: "Chapters",
    questions: "Questions",
    correct: "Correct",
    incorrect: "Incorrect",
    score: "Score",
    start: "Start",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    flip: "Flip",
    week: "Week",
    completed: "Completed",
    inProgress: "In Progress",
    notStarted: "Not Started",
    totalQuizzes: "Total Quizzes",
    accuracy: "Accuracy",
    chaptersCompleted: "Chapters Completed",
    currentWeek: "Current Week",
    recentActivity: "Recent Activity",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    getStarted: "Get Started",
    learnMore: "Learn More",
    features: "Features",
    quizMode: "Quiz Mode",
    quizDesc: "Test your knowledge with exam-style questions",
    flashcardsMode: "Flashcards",
    flashcardsDesc: "Review key concepts with interactive cards",
    trackProgress: "Track Progress",
    trackDesc: "Monitor your learning journey",
    weekPlan: "20-Week Plan",
    weekPlanDesc: "Structured study schedule",
    selectChapter: "Select Chapter",
    questionOf: "Question {current} of {total}",
    results: "Results",
    tryAgain: "Try Again",
    backToDashboard: "Back to Dashboard",
    explanation: "Explanation",
    cardOf: "Card {current} of {total}",
    topics: "Topics",
    markComplete: "Mark Complete",
    flashcardsReviewed: "Flashcards Reviewed",
    streak: "Day Streak",
    welcome: "Welcome back",
    hero1: "Ace the CompTIA Linux+ XK0-006 Exam",
    hero2: "Comprehensive learning platform with 100+ practice questions, flashcards, and a structured 20-week study plan.",
    aiExplanation: "AI Explanation",
    aiSettings: "AI Settings",
    getAiExplanation: "Get AI Explanation",
    aiProvider: "AI Provider",
    apiKey: "API Key",
    saveApiKey: "Save API Key",
  },
  de: {
    appName: "Linux+ Meisterschaft",
    tagline: "CompTIA Linux+ XK0-006 meistern",
    login: "Anmelden",
    register: "Registrieren",
    logout: "Abmelden",
    email: "E-Mail",
    password: "Passwort",
    name: "Name",
    dashboard: "Dashboard",
    quiz: "Quiz",
    flashcards: "Lernkarten",
    studyPlan: "Lernplan",
    progress: "Fortschritt",
    chapters: "Kapitel",
    questions: "Fragen",
    correct: "Richtig",
    incorrect: "Falsch",
    score: "Punktzahl",
    start: "Starten",
    next: "Weiter",
    previous: "Zurück",
    submit: "Absenden",
    flip: "Umdrehen",
    week: "Woche",
    completed: "Abgeschlossen",
    inProgress: "In Bearbeitung",
    notStarted: "Nicht begonnen",
    totalQuizzes: "Gesamte Quizze",
    accuracy: "Genauigkeit",
    chaptersCompleted: "Abgeschlossene Kapitel",
    currentWeek: "Aktuelle Woche",
    recentActivity: "Letzte Aktivität",
    noAccount: "Noch kein Konto?",
    hasAccount: "Bereits ein Konto?",
    getStarted: "Loslegen",
    learnMore: "Mehr erfahren",
    features: "Funktionen",
    quizMode: "Quiz-Modus",
    quizDesc: "Teste dein Wissen mit Prüfungsfragen",
    flashcardsMode: "Lernkarten",
    flashcardsDesc: "Wiederhole Konzepte mit interaktiven Karten",
    trackProgress: "Fortschritt verfolgen",
    trackDesc: "Überwache deinen Lernfortschritt",
    weekPlan: "20-Wochen-Plan",
    weekPlanDesc: "Strukturierter Lernplan",
    selectChapter: "Kapitel auswählen",
    questionOf: "Frage {current} von {total}",
    results: "Ergebnisse",
    tryAgain: "Nochmal versuchen",
    backToDashboard: "Zurück zum Dashboard",
    explanation: "Erklärung",
    cardOf: "Karte {current} von {total}",
    topics: "Themen",
    markComplete: "Als erledigt markieren",
    flashcardsReviewed: "Lernkarten wiederholt",
    streak: "Tage Serie",
    welcome: "Willkommen zurück",
    hero1: "CompTIA Linux+ XK0-006 Prüfung bestehen",
    hero2: "Umfassende Lernplattform mit 100+ Übungsfragen, Lernkarten und einem strukturierten 20-Wochen-Lernplan.",
    aiExplanation: "KI-Erklärung",
    aiSettings: "KI-Einstellungen",
    getAiExplanation: "KI-Erklärung anfordern",
    aiProvider: "KI-Anbieter",
    apiKey: "API-Schlüssel",
    saveApiKey: "API-Schlüssel speichern",
  }
};

// Context
export const AppContext = createContext();

export const useApp = () => useContext(AppContext);

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/quiz/:chapter" element={<Quiz />} />
      <Route path="/flashcards" element={<Flashcards />} />
      <Route path="/flashcards/:chapter" element={<Flashcards />} />
      <Route path="/studyplan" element={<StudyPlan />} />
    </Routes>
  );
}

function App() {
  const [username, setUsername] = useState(null);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  
  const t = (key) => translations[language][key] || key;
  
  useEffect(() => {
    // Restore language from localStorage
    const savedLang = localStorage.getItem("app_language");
    if (savedLang) {
      setLanguage(savedLang);
    }
    
    // Check if user has already entered their name
    const savedUsername = localStorage.getItem("linux_username");
    if (savedUsername) {
      setUsername(savedUsername);
      setShowWelcome(false);
    } else {
      setShowWelcome(true);
    }
    
    setLoading(false);
  }, []);
  
  const handleWelcomeComplete = (name) => {
    localStorage.setItem("linux_username", name);
    setUsername(name);
    setShowWelcome(false);
  };
  
  const switchLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("app_language", lang);
  };

  const logout = () => {
    localStorage.removeItem("linux_username");
    localStorage.removeItem("linux_progress");
    setUsername(null);
    setShowWelcome(true);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <MatrixBackground />
        <div className="animate-spin w-8 h-8 border-2 border-[#00ff41] border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <AppContext.Provider value={{ 
      username, 
      setUsername, 
      language, 
      setLanguage: switchLanguage, 
      t, 
      logout,
      loading 
    }}>
      <div className="App dark">
        <MatrixBackground />
        
        {showWelcome ? (
          <WelcomeScreen 
            onComplete={handleWelcomeComplete} 
            language={language}
          />
        ) : (
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        )}
        
        <Toaster position="top-right" theme="dark" />
      </div>
    </AppContext.Provider>
  );
}

export default App;
