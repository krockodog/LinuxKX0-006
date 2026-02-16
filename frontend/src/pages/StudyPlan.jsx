import { useState, useEffect } from "react";
import { useApp, API } from "../App";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Terminal, Calendar, ArrowLeft, CheckCircle2, Circle,
  BookOpen, ChevronRight
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function StudyPlan() {
  const { t, language } = useApp();
  const navigate = useNavigate();
  const [studyPlan, setStudyPlan] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedWeek, setExpandedWeek] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const planRes = await axios.get(`${API}/studyplan`);
        setStudyPlan(planRes.data);
        
        // Load progress from localStorage
        const savedProgress = localStorage.getItem("linux_progress");
        const localProgress = savedProgress ? JSON.parse(savedProgress) : { current_week: 1 };
        setProgress(localProgress);
        setExpandedWeek(localProgress.current_week || 1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSetCurrentWeek = (week) => {
    const savedProgress = localStorage.getItem("linux_progress");
    const localProgress = savedProgress ? JSON.parse(savedProgress) : {};
    localProgress.current_week = week;
    localStorage.setItem("linux_progress", JSON.stringify(localProgress));
    setProgress({ ...progress, current_week: week });
    toast.success(language === "de" ? `Woche ${week} ausgewählt` : `Week ${week} selected`);
  };

  const currentWeek = progress?.current_week || 1;
  const progressPercent = (currentWeek / 20) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-8 px-6" data-testid="studyplan-page">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{t("backToDashboard")}</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            <span className="font-mono text-sm text-zinc-400">{t("studyPlan")}</span>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="stats-card p-6 mb-8 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              {language === "de" ? "20-Wochen Lernplan" : "20-Week Study Plan"}
            </h2>
            <span className="text-emerald-400 font-mono">
              {currentWeek}/20
            </span>
          </div>
          <Progress value={progressPercent} className="h-3 mb-3" />
          <p className="text-sm text-zinc-400">
            {language === "de" 
              ? `Du bist in Woche ${currentWeek} von 20` 
              : `You're on week ${currentWeek} of 20`}
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {studyPlan.map((week, idx) => {
            const isCurrentWeek = week.week === currentWeek;
            const isPast = week.week < currentWeek;
            const isExpanded = expandedWeek === week.week;
            
            return (
              <div 
                key={week.week}
                className={`chapter-card overflow-hidden animate-fadeIn ${isCurrentWeek ? 'border-emerald-500/50' : ''}`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <button
                  onClick={() => setExpandedWeek(isExpanded ? null : week.week)}
                  className="w-full p-5 flex items-center justify-between"
                  data-testid={`week-${week.week}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Timeline dot */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isPast 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : isCurrentWeek 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {isPast ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="font-mono font-bold">{week.week}</span>
                      )}
                    </div>
                    
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500 font-mono">
                          {t("week")} {week.week}
                        </span>
                        {isCurrentWeek && (
                          <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">
                            {language === "de" ? "Aktuell" : "Current"}
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-medium">{week.title}</h3>
                    </div>
                  </div>
                  
                  <ChevronRight className={`w-5 h-5 text-zinc-500 transition ${isExpanded ? 'rotate-90' : ''}`} />
                </button>
                
                {isExpanded && (
                  <div className="px-5 pb-5 animate-fadeIn">
                    <div className="pl-14 border-l-2 border-zinc-800 ml-5">
                      <h4 className="text-sm text-zinc-400 mb-3">{t("topics")}:</h4>
                      <ul className="space-y-2">
                        {week.topics.map((topic, tidx) => (
                          <li key={tidx} className="flex items-center gap-2 text-sm text-zinc-300">
                            <Circle className="w-2 h-2 text-emerald-400" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                      
                      {!isPast && (
                        <Button
                          onClick={(e) => { e.stopPropagation(); handleSetCurrentWeek(week.week); }}
                          className={`mt-4 ${isCurrentWeek ? 'btn-secondary' : 'btn-primary text-black'}`}
                          size="sm"
                          data-testid={`set-week-${week.week}`}
                        >
                          {isCurrentWeek 
                            ? (language === "de" ? "Aktuelle Woche" : "Current Week")
                            : (language === "de" ? "Als aktuelle Woche setzen" : "Set as Current Week")
                          }
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
