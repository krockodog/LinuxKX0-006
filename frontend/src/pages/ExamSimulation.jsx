import { useState, useEffect, useCallback } from "react";
import { useApp, API } from "../App";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Terminal, ArrowLeft, ArrowRight, CheckCircle2, XCircle, 
  Clock, AlertTriangle, Trophy, Home, Play, Pause, RotateCcw
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";

const EXAM_TIME = 90 * 60; // 90 minutes in seconds
const TOTAL_QUESTIONS = 60; // Official Linux+ exam has ~60 questions

export default function ExamSimulation() {
  const { t, language } = useApp();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(EXAM_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);

  // Fetch questions from all chapters
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const allQuestions = [];
        for (let chapter = 1; chapter <= 5; chapter++) {
          const res = await axios.get(`${API}/questions/${chapter}?limit=20`);
          allQuestions.push(...res.data);
        }
        // Shuffle and take 60 questions
        const shuffled = allQuestions.sort(() => Math.random() - 0.5);
        setQuestions(shuffled.slice(0, TOTAL_QUESTIONS));
      } catch (error) {
        toast.error(language === "de" ? "Fehler beim Laden" : "Failed to load questions");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [language]);

  // Timer countdown
  useEffect(() => {
    let interval;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            handleTimeUp();
            return 0;
          }
          // Show warning at 10 minutes
          if (prev === 600) {
            setShowTimeWarning(true);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const handleTimeUp = useCallback(() => {
    toast.error(language === "de" ? "Zeit abgelaufen!" : "Time's up!");
    finishExam();
  }, [language]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startExam = () => {
    setExamStarted(true);
    setIsRunning(true);
    toast.success(language === "de" ? "Prüfung gestartet! Viel Erfolg!" : "Exam started! Good luck!");
  };

  const togglePause = () => {
    setIsRunning(!isRunning);
    toast.info(isRunning 
      ? (language === "de" ? "Pausiert" : "Paused") 
      : (language === "de" ? "Fortgesetzt" : "Resumed")
    );
  };

  const handleSelect = (answerIndex) => {
    if (examFinished) return;
    setSelectedAnswers({ ...selectedAnswers, [questions[currentIndex].id]: answerIndex });
  };

  const finishExam = () => {
    setIsRunning(false);
    setExamFinished(true);
    
    let correct = 0;
    const resultsList = [];
    
    for (const q of questions) {
      const selected = selectedAnswers[q.id];
      const isCorrect = selected === q.correct_answer;
      if (isCorrect) correct++;
      resultsList.push({
        question_id: q.id,
        selected: selected,
        correct: q.correct_answer,
        is_correct: isCorrect,
        question: q.question,
        options: q.options
      });
    }
    
    const total = questions.length;
    const percentage = Math.round((correct / total) * 100);
    const timeUsed = EXAM_TIME - timeRemaining;
    
    setResults({
      score: correct,
      total: total,
      percentage: percentage,
      passed: percentage >= 720/900 * 100, // CompTIA passing score is 720/900
      timeUsed: timeUsed,
      results: resultsList
    });

    // Save to localStorage
    const savedProgress = localStorage.getItem("linux_progress");
    const progressData = savedProgress ? JSON.parse(savedProgress) : {};
    progressData.exam_simulations = (progressData.exam_simulations || 0) + 1;
    progressData.best_exam_score = Math.max(progressData.best_exam_score || 0, percentage);
    localStorage.setItem("linux_progress", JSON.stringify(progressData));
  };

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress = (answeredCount / questions.length) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#00ff41] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Start Screen
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] py-8 px-6" data-testid="exam-start">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{t("backToDashboard")}</span>
          </button>

          <div className="stats-card p-8 text-center animate-fadeIn">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 bg-red-500/20 flex items-center justify-center">
              <Clock className="w-10 h-10 text-red-400" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              {language === "de" ? "Prüfungssimulation" : "Exam Simulation"}
            </h1>
            <p className="text-zinc-400 mb-8">
              {language === "de" 
                ? "Simuliere die echte CompTIA Linux+ Prüfung"
                : "Simulate the real CompTIA Linux+ exam"}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 text-left">
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <p className="text-zinc-500 text-sm">{language === "de" ? "Fragen" : "Questions"}</p>
                <p className="text-2xl font-bold text-white font-mono">{TOTAL_QUESTIONS}</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <p className="text-zinc-500 text-sm">{language === "de" ? "Zeitlimit" : "Time Limit"}</p>
                <p className="text-2xl font-bold text-white font-mono">90 min</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <p className="text-zinc-500 text-sm">{language === "de" ? "Bestehensgrenze" : "Passing Score"}</p>
                <p className="text-2xl font-bold text-white font-mono">80%</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <p className="text-zinc-500 text-sm">{language === "de" ? "Format" : "Format"}</p>
                <p className="text-2xl font-bold text-white font-mono">MCQ</p>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-8 text-left">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-400 font-semibold text-sm">
                    {language === "de" ? "Wichtig" : "Important"}
                  </p>
                  <p className="text-yellow-400/80 text-sm">
                    {language === "de" 
                      ? "Der Timer startet sofort. Du kannst pausieren, aber die echte Prüfung erlaubt keine Pausen."
                      : "Timer starts immediately. You can pause, but the real exam doesn't allow pauses."}
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={startExam}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold py-6 text-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
              data-testid="start-exam-btn"
            >
              <Play className="w-5 h-5 mr-2" />
              {language === "de" ? "Prüfung starten" : "Start Exam"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (examFinished && results) {
    const passed = results.passed;
    
    return (
      <div className="min-h-screen bg-[#0a0a0b] py-8 px-6" data-testid="exam-results">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 animate-scaleIn">
            <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${passed ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              {passed ? (
                <Trophy className="w-12 h-12 text-emerald-400" />
              ) : (
                <XCircle className="w-12 h-12 text-red-400" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {passed 
                ? (language === "de" ? "Bestanden!" : "Passed!")
                : (language === "de" ? "Nicht bestanden" : "Not Passed")}
            </h1>
            <p className="text-zinc-400">
              {language === "de" ? "Prüfungssimulation abgeschlossen" : "Exam simulation completed"}
            </p>
          </div>

          {/* Score Card */}
          <div className="stats-card p-8 text-center mb-8 animate-fadeIn">
            <div className={`text-7xl font-bold font-mono mb-2 ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
              {results.percentage}%
            </div>
            <p className="text-zinc-400 text-lg">
              {results.score} / {results.total} {language === "de" ? "richtig" : "correct"}
            </p>
            <div className="mt-4">
              <Progress value={results.percentage} className={`h-4 ${passed ? 'bg-emerald-500/20' : 'bg-red-500/20'}`} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <p className="text-zinc-500 text-sm">{language === "de" ? "Benötigte Zeit" : "Time Used"}</p>
                <p className="text-xl font-bold text-white font-mono">{formatTime(results.timeUsed)}</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <p className="text-zinc-500 text-sm">{language === "de" ? "Bestehensgrenze" : "Passing Score"}</p>
                <p className="text-xl font-bold text-white font-mono">80%</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="stats-card p-4 text-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-emerald-400">{results.score}</p>
              <p className="text-xs text-zinc-500">{language === "de" ? "Richtig" : "Correct"}</p>
            </div>
            <div className="stats-card p-4 text-center">
              <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-400">{results.total - results.score}</p>
              <p className="text-xs text-zinc-500">{language === "de" ? "Falsch" : "Wrong"}</p>
            </div>
            <div className="stats-card p-4 text-center">
              <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-400">{Object.keys(selectedAnswers).length < results.total ? results.total - Object.keys(selectedAnswers).length : 0}</p>
              <p className="text-xs text-zinc-500">{language === "de" ? "Übersprungen" : "Skipped"}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button 
              onClick={() => window.location.reload()} 
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white"
              data-testid="retry-exam-btn"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {language === "de" ? "Neue Simulation" : "New Simulation"}
            </Button>
            <Button 
              onClick={() => navigate("/dashboard")} 
              className="flex-1 btn-primary text-black"
              data-testid="back-dashboard-btn"
            >
              <Home className="w-4 h-4 mr-2" />
              {t("backToDashboard")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Exam Screen
  return (
    <div className="min-h-screen bg-[#0a0a0b] py-4 px-6" data-testid="exam-page">
      <div className="max-w-4xl mx-auto">
        {/* Timer Bar */}
        <div className="sticky top-0 z-50 bg-[#0a0a0b]/95 backdrop-blur py-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg ${
                timeRemaining < 600 ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800 text-white'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="font-bold">{formatTime(timeRemaining)}</span>
              </div>
              <Button
                onClick={togglePause}
                variant="ghost"
                size="sm"
                className="text-zinc-400"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-400">
                {answeredCount}/{questions.length} {language === "de" ? "beantwortet" : "answered"}
              </span>
              <Button
                onClick={() => setShowConfirmEnd(true)}
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                {language === "de" ? "Beenden" : "End Exam"}
              </Button>
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-zinc-800" />
        </div>

        {/* Question */}
        <div className="stats-card p-6 mb-6 animate-fadeIn" key={currentQuestion?.id}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-mono text-zinc-500">
              {language === "de" ? "Frage" : "Question"} {currentIndex + 1} / {questions.length}
            </span>
            {selectedAnswers[currentQuestion?.id] !== undefined && (
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">
                {language === "de" ? "Beantwortet" : "Answered"}
              </span>
            )}
          </div>
          
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
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    isSelected 
                      ? 'bg-[#00ff41]/10 border-2 border-[#00ff41]' 
                      : 'bg-zinc-800/50 border-2 border-transparent hover:border-zinc-700'
                  }`}
                  data-testid={`option-${idx}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-mono font-bold ${
                      isSelected ? 'bg-[#00ff41] text-black' : 'bg-zinc-700 text-zinc-400'
                    }`}>
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
        <div className="flex gap-4 mb-6">
          <Button 
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="btn-secondary flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("previous")}
          </Button>
          
          {currentIndex === questions.length - 1 ? (
            <Button 
              onClick={() => setShowConfirmEnd(true)}
              className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white"
            >
              {language === "de" ? "Prüfung beenden" : "Finish Exam"}
              <CheckCircle2 className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
              className="btn-primary text-black flex-1"
            >
              {t("next")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="stats-card p-4">
          <p className="text-sm text-zinc-500 mb-3">{language === "de" ? "Fragenübersicht" : "Question Navigator"}</p>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-9 h-9 rounded-lg text-xs font-mono font-bold transition ${
                  idx === currentIndex 
                    ? 'bg-[#00ff41] text-black' 
                    : selectedAnswers[q.id] !== undefined 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Confirm End Dialog */}
      <Dialog open={showConfirmEnd} onOpenChange={setShowConfirmEnd}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>{language === "de" ? "Prüfung beenden?" : "End Exam?"}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {language === "de" 
                ? `Du hast ${answeredCount} von ${questions.length} Fragen beantwortet. Möchtest du die Prüfung wirklich beenden?`
                : `You've answered ${answeredCount} of ${questions.length} questions. Are you sure you want to end the exam?`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 mt-4">
            <Button onClick={() => setShowConfirmEnd(false)} variant="outline" className="flex-1">
              {language === "de" ? "Weitermachen" : "Continue"}
            </Button>
            <Button onClick={finishExam} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
              {language === "de" ? "Beenden" : "End Exam"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Time Warning Dialog */}
      <Dialog open={showTimeWarning} onOpenChange={setShowTimeWarning}>
        <DialogContent className="bg-zinc-900 border-yellow-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="w-5 h-5" />
              {language === "de" ? "Noch 10 Minuten!" : "10 Minutes Left!"}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {language === "de" 
                ? "Du hast noch 10 Minuten Zeit. Überprüfe deine unbeantworteten Fragen."
                : "You have 10 minutes remaining. Review your unanswered questions."}
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowTimeWarning(false)} className="w-full btn-primary text-black">
            {language === "de" ? "Verstanden" : "Got it"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
