import { useState, useEffect } from "react";
import { useApp, API } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Terminal, ArrowLeft, ArrowRight, CheckCircle2, XCircle, 
  RotateCcw, Home, Trophy, AlertCircle
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function Quiz() {
  const { t, language } = useApp();
  const navigate = useNavigate();
  const { chapter } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [chapterInfo, setChapterInfo] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const [questionsRes, chaptersRes] = await Promise.all([
          axios.get(`${API}/questions/${chapter}?limit=10`),
          axios.get(`${API}/chapters`)
        ]);
        setQuestions(questionsRes.data);
        setChapterInfo(chaptersRes.data.find(c => c.id === parseInt(chapter)));
      } catch (error) {
        toast.error(language === "de" ? "Fehler beim Laden" : "Failed to load questions");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [chapter, language]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSelect = (answerIndex) => {
    if (showResults) return;
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: answerIndex });
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      toast.error(language === "de" ? "Bitte alle Fragen beantworten" : "Please answer all questions");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("token");
    
    try {
      const answers = questions.map(q => ({
        question_id: q.id,
        selected_answer: selectedAnswers[q.id]
      }));
      
      const res = await axios.post(`${API}/quiz/submit?chapter=${chapter}`, answers, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setResults(res.data);
      setShowResults(true);
      
      if (res.data.percentage >= 70) {
        toast.success(language === "de" ? "Kapitel bestanden!" : "Chapter passed!");
      }
    } catch (error) {
      toast.error(language === "de" ? "Fehler beim Absenden" : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setResults(null);
    setCurrentIndex(0);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Results Screen
  if (showResults && results) {
    const passed = results.percentage >= 70;
    
    return (
      <div className="min-h-screen bg-[#0a0a0b] py-8 px-6" data-testid="quiz-results">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-scaleIn">
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${passed ? 'bg-emerald-500/20' : 'bg-yellow-500/20'}`}>
              {passed ? (
                <Trophy className="w-10 h-10 text-emerald-400" />
              ) : (
                <AlertCircle className="w-10 h-10 text-yellow-400" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{t("results")}</h1>
            <p className="text-zinc-400">
              {language === "de" ? chapterInfo?.title_de : chapterInfo?.title}
            </p>
          </div>

          {/* Score Card */}
          <div className="stats-card p-8 text-center mb-8 animate-fadeIn">
            <div className={`text-6xl font-bold font-mono mb-2 ${passed ? 'text-emerald-400' : 'text-yellow-400'}`}>
              {results.percentage}%
            </div>
            <p className="text-zinc-400">
              {results.score} / {results.total} {t("correct")}
            </p>
            <div className="mt-4">
              <Progress value={results.percentage} className={`h-3 ${passed ? 'bg-emerald-500/20' : 'bg-yellow-500/20'}`} />
            </div>
            <p className="mt-4 text-sm">
              {passed ? (
                <span className="text-emerald-400">{language === "de" ? "✓ Bestanden! 70% erreicht" : "✓ Passed! 70% threshold reached"}</span>
              ) : (
                <span className="text-yellow-400">{language === "de" ? "70% benötigt zum Bestehen" : "70% required to pass"}</span>
              )}
            </p>
          </div>

          {/* Answer Review */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-bold text-white">{language === "de" ? "Antworten überprüfen" : "Review Answers"}</h2>
            
            {results.results.map((result, idx) => {
              const question = questions.find(q => q.id === result.question_id);
              if (!question) return null;
              
              return (
                <div 
                  key={result.question_id} 
                  className="chapter-card p-5 animate-fadeIn"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    {result.is_correct ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-white text-sm mb-2">{question.question}</p>
                      
                      <div className="space-y-1 text-sm">
                        <p className="text-zinc-400">
                          {language === "de" ? "Deine Antwort: " : "Your answer: "}
                          <span className={result.is_correct ? "text-emerald-400" : "text-red-400"}>
                            {question.options[result.selected]}
                          </span>
                        </p>
                        {!result.is_correct && (
                          <p className="text-zinc-400">
                            {language === "de" ? "Richtig: " : "Correct: "}
                            <span className="text-emerald-400">{question.options[result.correct]}</span>
                          </p>
                        )}
                      </div>
                      
                      {result.explanation && (
                        <div className="mt-3 p-3 bg-zinc-800/50 rounded-lg">
                          <p className="text-xs text-zinc-500 uppercase mb-1">{t("explanation")}</p>
                          <p className="text-sm text-zinc-300">{result.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button onClick={handleRetry} className="flex-1 btn-secondary" data-testid="retry-btn">
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("tryAgain")}
            </Button>
            <Button onClick={() => navigate("/dashboard")} className="flex-1 btn-primary text-black" data-testid="back-dashboard-btn">
              <Home className="w-4 h-4 mr-2" />
              {t("backToDashboard")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  return (
    <div className="min-h-screen bg-[#0a0a0b] py-8 px-6" data-testid="quiz-page">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{t("backToDashboard")}</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <span className="font-mono text-sm text-zinc-400">
              {language === "de" ? `Kapitel ${chapter}` : `Chapter ${chapter}`}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-zinc-400 mb-2">
            <span>{t("questionOf").replace("{current}", currentIndex + 1).replace("{total}", questions.length)}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-zinc-800" />
        </div>

        {/* Question Card */}
        <div className="stats-card p-6 mb-6 animate-fadeIn" key={currentQuestion?.id}>
          <p className="text-lg text-white leading-relaxed mb-6">
            {currentQuestion?.question}
          </p>
          
          <div className="space-y-3">
            {currentQuestion?.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQuestion.id] === idx;
              
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl quiz-option ${isSelected ? 'selected' : ''}`}
                  data-testid={`option-${idx}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-mono font-bold ${isSelected ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-zinc-200">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <Button 
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="btn-secondary flex-1"
            data-testid="prev-btn"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("previous")}
          </Button>
          
          {currentIndex === questions.length - 1 ? (
            <Button 
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary text-black flex-1"
              data-testid="submit-btn"
            >
              {submitting ? (
                <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></div>
              ) : (
                <>
                  {t("submit")}
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
              className="btn-primary text-black flex-1"
              data-testid="next-btn"
            >
              {t("next")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Question Dots */}
        <div className="flex justify-center gap-2 mt-8 flex-wrap">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition ${
                idx === currentIndex 
                  ? 'bg-emerald-500 text-black' 
                  : selectedAnswers[q.id] !== undefined 
                    ? 'bg-cyan-500/20 text-cyan-400' 
                    : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
