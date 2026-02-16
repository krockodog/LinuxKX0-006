import { useState, useEffect } from "react";
import { useApp, API } from "../App";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Terminal, BookOpen, BarChart3, Calendar,
  ChevronRight, Trophy, Flame, CheckCircle2,
  Play, Target
} from "lucide-react";
import axios from "axios";

export default function Dashboard() {
  const { t, language, setLanguage } = useApp();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [progress, setProgress] = useState({
    total_quizzes: 0,
    total_correct: 0,
    total_questions: 0,
    chapters_completed: [],
    current_week: 1,
    streak_days: 0,
    flashcards_reviewed: 0,
    quiz_history: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load chapters
        const chaptersRes = await axios.get(`${API}/chapters`);
        setChapters(chaptersRes.data);
        
        // Load progress from localStorage
        const savedProgress = localStorage.getItem("linux_progress");
        if (savedProgress) {
          setProgress(JSON.parse(savedProgress));
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const accuracy = progress?.total_questions > 0 
    ? Math.round((progress.total_correct / progress.total_questions) * 100) 
    : 0;

  // Save progress to localStorage whenever it changes
  const updateProgress = (newProgress) => {
    setProgress(newProgress);
    localStorage.setItem("linux_progress", JSON.stringify(newProgress));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b]" data-testid="dashboard">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Terminal className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-bold font-mono gradient-text hidden sm:block">Linux+</span>
          </div>
          
          <nav className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" onClick={() => navigate("/dashboard")} className="text-emerald-400" data-testid="nav-dashboard">
              <BarChart3 className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">{t("dashboard")}</span>
            </Button>
            <Button variant="ghost" onClick={() => navigate("/flashcards")} className="text-zinc-400 hover:text-white" data-testid="nav-flashcards">
              <BookOpen className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">{t("flashcards")}</span>
            </Button>
            <Button variant="ghost" onClick={() => navigate("/studyplan")} className="text-zinc-400 hover:text-white" data-testid="nav-studyplan">
              <Calendar className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">{t("studyPlan")}</span>
            </Button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="lang-toggle flex">
              <button onClick={() => setLanguage("en")} className={`lang-btn ${language === "en" ? "active" : "text-zinc-400"}`}>EN</button>
              <button onClick={() => setLanguage("de")} className={`lang-btn ${language === "de" ? "active" : "text-zinc-400"}`}>DE</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {t("welcome")}, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className="text-zinc-400">CompTIA Linux+ XK0-006 • {language === "de" ? "Prüfungsvorbereitung" : "Exam Preparation"}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Trophy, label: t("totalQuizzes"), value: progress?.total_quizzes || 0, color: "emerald" },
            { icon: Target, label: t("accuracy"), value: `${accuracy}%`, color: "cyan" },
            { icon: CheckCircle2, label: t("chaptersCompleted"), value: `${progress?.chapters_completed?.length || 0}/5`, color: "yellow" },
            { icon: Flame, label: t("streak"), value: progress?.streak_days || 0, color: "orange" },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="stats-card p-5 animate-fadeIn"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center`}
                  style={{ background: stat.color === "emerald" ? "rgba(16,185,129,0.1)" : stat.color === "cyan" ? "rgba(6,182,212,0.1)" : stat.color === "yellow" ? "rgba(251,191,36,0.1)" : "rgba(249,115,22,0.1)" }}>
                  <stat.icon className="w-5 h-5" style={{ color: stat.color === "emerald" ? "#10b981" : stat.color === "cyan" ? "#06b6d4" : stat.color === "yellow" ? "#fbbf24" : "#f97316" }} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white font-mono">{stat.value}</div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Chapters */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            {t("chapters")}
          </h2>
          
          <div className="grid gap-4">
            {chapters.map((chapter, i) => {
              const isCompleted = progress?.chapters_completed?.includes(chapter.id);
              const chapterQuizzes = progress?.quiz_history?.filter(q => q.chapter === chapter.id) || [];
              const bestScore = chapterQuizzes.length > 0 
                ? Math.max(...chapterQuizzes.map(q => q.percentage)) 
                : 0;
              
              return (
                <div 
                  key={chapter.id} 
                  className="chapter-card p-5 animate-fadeIn"
                  style={{ animationDelay: `${300 + i * 100}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold font-mono ${isCompleted ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                          {chapter.id}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">
                            {language === "de" ? chapter.title_de : chapter.title}
                          </h3>
                          <p className="text-sm text-zinc-500">
                            {language === "de" ? chapter.description_de : chapter.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="text-zinc-500">{chapter.questions} {t("questions")}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-500">{chapter.weight}</span>
                        {bestScore > 0 && (
                          <>
                            <span className="text-zinc-600">•</span>
                            <span className={bestScore >= 70 ? "text-emerald-400" : "text-yellow-400"}>
                              Best: {bestScore}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => navigate(`/quiz/${chapter.id}`)}
                      className={isCompleted ? "btn-secondary" : "btn-primary text-black"}
                      data-testid={`quiz-chapter-${chapter.id}`}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {t("start")}
                    </Button>
                  </div>
                  
                  {bestScore > 0 && (
                    <div className="mt-4">
                      <Progress value={bestScore} className="h-2 bg-zinc-800" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate("/flashcards")}
            className="chapter-card p-5 text-left flex items-center justify-between group"
            data-testid="goto-flashcards"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{t("flashcards")}</h3>
                <p className="text-sm text-zinc-500">{progress?.flashcards_reviewed || 0} {t("flashcardsReviewed")}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-emerald-400 transition" />
          </button>
          
          <button 
            onClick={() => navigate("/studyplan")}
            className="chapter-card p-5 text-left flex items-center justify-between group"
            data-testid="goto-studyplan"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{t("studyPlan")}</h3>
                <p className="text-sm text-zinc-500">{t("week")} {progress?.current_week || 1} / 20</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-emerald-400 transition" />
          </button>
        </div>
      </main>
    </div>
  );
}
