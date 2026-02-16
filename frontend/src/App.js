import { useState, useEffect, createContext, useContext } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// Pages
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
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
    hero2: "Comprehensive learning platform with 150+ practice questions, flashcards, and a structured 20-week study plan.",
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
    hero2: "Umfassende Lernplattform mit 150+ Übungsfragen, Lernkarten und einem strukturierten 20-Wochen-Lernplan.",
  }
};

// Context
export const AppContext = createContext();

export const useApp = () => useContext(AppContext);

// Auth wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useApp();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

function AppContent() {
  const { user } = useApp();
  const location = useLocation();
  
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/quiz/:chapter" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
      <Route path="/flashcards" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
      <Route path="/flashcards/:chapter" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
      <Route path="/studyplan" element={<ProtectedRoute><StudyPlan /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);
  
  const t = (key) => translations[language][key] || key;
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setUser(res.data);
        setLanguage(res.data.language || "en");
      })
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);
  
  const login = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    setLanguage(res.data.user.language || "en");
    return res.data;
  };
  
  const register = async (email, password, name) => {
    const res = await axios.post(`${API}/auth/register`, { email, password, name });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    return res.data;
  };
  
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  
  const switchLanguage = async (lang) => {
    setLanguage(lang);
    if (user) {
      const token = localStorage.getItem("token");
      await axios.put(`${API}/auth/language?language=${lang}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  };
  
  return (
    <AppContext.Provider value={{ user, setUser, language, setLanguage: switchLanguage, t, login, register, logout, loading }}>
      <div className="App dark">
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
        <Toaster position="top-right" theme="dark" />
      </div>
    </AppContext.Provider>
  );
}

export default App;
