import { useApp } from "../App";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Terminal, BookOpen, BarChart3, Calendar, ChevronRight, Cpu, Clock, Zap } from "lucide-react";

export default function Landing() {
  const { t, language, setLanguage, username, handleGetStarted } = useApp();
  const navigate = useNavigate();

  const onGetStarted = () => {
    handleGetStarted();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Background grid with matrix effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00ff41] to-[#008f11] flex items-center justify-center">
            <Terminal className="w-6 h-6 text-black" />
          </div>
          <span className="text-xl font-bold font-mono text-[#00ff41]">Linux+</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <div className="lang-toggle flex">
            <button 
              onClick={() => setLanguage("en")} 
              className={`lang-btn ${language === "en" ? "active" : "text-zinc-400"}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage("de")} 
              className={`lang-btn ${language === "de" ? "active" : "text-zinc-400"}`}
            >
              DE
            </button>
          </div>
          
          {username && (
            <span className="text-sm font-mono text-[#00ff41] hidden sm:block">
              {username}
            </span>
          )}
          
          <Button 
            onClick={onGetStarted}
            className="bg-gradient-to-r from-[#00ff41] to-[#008f11] text-black font-semibold px-6 hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]"
            data-testid="login-btn"
          >
            {t("getStarted")}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8 animate-fadeIn">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">CompTIA XK0-006 • 2025-2027</span>
          </div>
          
          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fadeIn delay-100">
            <span className="text-white">{t("hero1").split(" ")[0]} </span>
            <span className="gradient-text">{t("hero1").split(" ").slice(1).join(" ")}</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 animate-fadeIn delay-200">
            {t("hero2")}
          </p>
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn delay-300">
            <Button 
              onClick={onGetStarted}
              className="btn-primary text-black font-semibold px-8 py-6 text-lg"
              data-testid="get-started-btn"
            >
              {t("getStarted")}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-32">
          {[
            { icon: Terminal, title: t("quizMode"), desc: t("quizDesc"), color: "#10b981" },
            { icon: BookOpen, title: t("flashcardsMode"), desc: t("flashcardsDesc"), color: "#06b6d4" },
            { icon: BarChart3, title: t("trackProgress"), desc: t("trackDesc"), color: "#fbbf24" },
            { icon: Calendar, title: t("weekPlan"), desc: t("weekPlanDesc"), color: "#a855f7" },
            { icon: Clock, title: language === "de" ? "Prüfungssimulation" : "Exam Simulation", desc: language === "de" ? "90-Minuten-Timer wie in der echten Prüfung" : "90-minute timer like the real exam", color: "#ef4444" },
            { icon: Zap, title: language === "de" ? "Spaced Repetition" : "Spaced Repetition", desc: language === "de" ? "Intelligenter Wiederholungsalgorithmus" : "Smart review algorithm for better retention", color: "#00ff41" },
          ].map((feature, i) => (
            <div 
              key={i} 
              className="chapter-card p-6 animate-fadeIn"
              style={{ animationDelay: `${400 + i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${feature.color}15` }}>
                <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-12 mt-24 animate-fadeIn delay-500">
          {[
            { value: "100+", label: language === "de" ? "Übungsfragen" : "Practice Questions" },
            { value: "45+", label: language === "de" ? "Lernkarten" : "Flashcards" },
            { value: "20", label: language === "de" ? "Wochen Lernplan" : "Week Study Plan" },
            { value: "90", label: language === "de" ? "Minuten Simulation" : "Min Exam Simulation" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-bold gradient-text font-mono">{stat.value}</div>
              <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-zinc-500">
          Linux+ Mastery • CompTIA Linux+ XK0-006 Exam Prep
        </div>
      </footer>
    </div>
  );
}
