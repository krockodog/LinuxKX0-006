import { useState, useEffect } from "react";
import { useApp, API } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Terminal, BookOpen, ArrowLeft, ArrowRight, RotateCcw,
  ChevronDown, Layers, Zap, CheckCircle2, XCircle, Brain,
  TrendingUp, Clock
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

// Spaced Repetition intervals in hours
const SR_INTERVALS = {
  again: 0.1,    // 6 minutes - show again soon
  hard: 1,       // 1 hour
  good: 24,      // 1 day
  easy: 72       // 3 days
};

const getCardDueStatus = (card, srData) => {
  if (!srData[card.id]) return 'new';
  const lastReview = new Date(srData[card.id].lastReview);
  const interval = srData[card.id].interval || 24;
  const nextDue = new Date(lastReview.getTime() + interval * 60 * 60 * 1000);
  return nextDue <= new Date() ? 'due' : 'learning';
};

export default function Flashcards() {
  const { t, language } = useApp();
  const navigate = useNavigate();
  const { chapter } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(chapter ? parseInt(chapter) : 0);
  const [showChapterSelect, setShowChapterSelect] = useState(false);
  const [srMode, setSrMode] = useState(false);
  const [srData, setSrData] = useState({});
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, correct: 0 });
  const [showRating, setShowRating] = useState(false);

  // Load SR data from localStorage
  useEffect(() => {
    const savedSR = localStorage.getItem("linux_sr_data");
    if (savedSR) {
      setSrData(JSON.parse(savedSR));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chaptersRes = await axios.get(`${API}/chapters`);
        setChapters(chaptersRes.data);
        
        const url = selectedChapter > 0 
          ? `${API}/flashcards/${selectedChapter}` 
          : `${API}/flashcards`;
        const flashcardsRes = await axios.get(url);
        
        let cards = flashcardsRes.data;
        
        // In SR mode, sort by due status
        if (srMode) {
          cards = cards.sort((a, b) => {
            const statusA = getCardDueStatus(a, srData);
            const statusB = getCardDueStatus(b, srData);
            const order = { new: 0, due: 1, learning: 2 };
            return order[statusA] - order[statusB];
          });
        }
        
        setFlashcards(cards);
        setCurrentIndex(0);
        setFlipped(false);
      } catch (error) {
        toast.error(language === "de" ? "Fehler beim Laden" : "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedChapter, language, srMode, srData]);

  const handleRating = (rating) => {
    const currentCard = flashcards[currentIndex];
    const newInterval = SR_INTERVALS[rating];
    
    const newSrData = {
      ...srData,
      [currentCard.id]: {
        lastReview: new Date().toISOString(),
        interval: newInterval,
        repetitions: (srData[currentCard.id]?.repetitions || 0) + 1,
        rating: rating
      }
    };
    
    setSrData(newSrData);
    localStorage.setItem("linux_sr_data", JSON.stringify(newSrData));
    
    // Update session stats
    setSessionStats(prev => ({
      reviewed: prev.reviewed + 1,
      correct: prev.correct + (rating === 'good' || rating === 'easy' ? 1 : 0)
    }));
    
    // Track review locally
    const savedProgress = localStorage.getItem("linux_progress");
    const progress = savedProgress ? JSON.parse(savedProgress) : { flashcards_reviewed: 0 };
    progress.flashcards_reviewed = (progress.flashcards_reviewed || 0) + 1;
    localStorage.setItem("linux_progress", JSON.stringify(progress));
    
    // Move to next card
    setShowRating(false);
    setFlipped(false);
    setTimeout(() => {
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // End of deck
        toast.success(language === "de" 
          ? `Session beendet! ${sessionStats.reviewed + 1} Karten durchgearbeitet.`
          : `Session complete! ${sessionStats.reviewed + 1} cards reviewed.`
        );
      }
    }, 150);
  };

  const handleNext = () => {
    setFlipped(false);
    setShowRating(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
    
    if (!srMode) {
      // Track review locally
      const savedProgress = localStorage.getItem("linux_progress");
      const progress = savedProgress ? JSON.parse(savedProgress) : { flashcards_reviewed: 0 };
      progress.flashcards_reviewed = (progress.flashcards_reviewed || 0) + 1;
      localStorage.setItem("linux_progress", JSON.stringify(progress));
    }
  };

  const handlePrev = () => {
    setFlipped(false);
    setShowRating(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  const handleFlip = () => {
    setFlipped(!flipped);
    if (!flipped && srMode) {
      setShowRating(true);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setFlipped(false);
    setShowRating(false);
    toast.success(language === "de" ? "Karten gemischt!" : "Cards shuffled!");
  };

  const getDueCards = () => {
    return flashcards.filter(card => {
      const status = getCardDueStatus(card, srData);
      return status === 'new' || status === 'due';
    }).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const cardStatus = currentCard ? getCardDueStatus(currentCard, srData) : 'new';

  return (
    <div className="min-h-screen bg-[#0a0a0b] py-8 px-6" data-testid="flashcards-page">
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
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span className="font-mono text-sm text-zinc-400">{t("flashcards")}</span>
          </div>
        </div>

        {/* Mode Toggle & Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setSrMode(false)}
            className={`p-4 rounded-xl border-2 transition ${
              !srMode 
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' 
                : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600'
            }`}
            data-testid="normal-mode-btn"
          >
            <BookOpen className="w-6 h-6 mx-auto mb-2" />
            <p className="font-semibold text-sm">{language === "de" ? "Normal" : "Normal"}</p>
            <p className="text-xs opacity-70">{language === "de" ? "Freies Durchblättern" : "Free browsing"}</p>
          </button>
          
          <button
            onClick={() => setSrMode(true)}
            className={`p-4 rounded-xl border-2 transition ${
              srMode 
                ? 'bg-[#00ff41]/10 border-[#00ff41] text-[#00ff41]' 
                : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600'
            }`}
            data-testid="sr-mode-btn"
          >
            <Brain className="w-6 h-6 mx-auto mb-2" />
            <p className="font-semibold text-sm">Spaced Repetition</p>
            <p className="text-xs opacity-70">{getDueCards()} {language === "de" ? "fällig" : "due"}</p>
          </button>
        </div>

        {/* SR Session Stats */}
        {srMode && sessionStats.reviewed > 0 && (
          <div className="stats-card p-4 mb-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-zinc-400">
                    {sessionStats.reviewed} {language === "de" ? "durchgearbeitet" : "reviewed"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-zinc-400">
                    {Math.round((sessionStats.correct / sessionStats.reviewed) * 100)}% {language === "de" ? "gewusst" : "correct"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chapter Select */}
        <div className="relative mb-8">
          <button
            onClick={() => setShowChapterSelect(!showChapterSelect)}
            className="w-full chapter-card p-4 flex items-center justify-between"
            data-testid="chapter-select"
          >
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span className="text-white">
                {selectedChapter === 0 
                  ? (language === "de" ? "Alle Kapitel" : "All Chapters")
                  : (language === "de" 
                      ? chapters.find(c => c.id === selectedChapter)?.title_de 
                      : chapters.find(c => c.id === selectedChapter)?.title)
                }
              </span>
            </div>
            <ChevronDown className={`w-5 h-5 text-zinc-400 transition ${showChapterSelect ? 'rotate-180' : ''}`} />
          </button>
          
          {showChapterSelect && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden z-10 animate-fadeIn">
              <button
                onClick={() => { setSelectedChapter(0); setShowChapterSelect(false); }}
                className={`w-full p-4 text-left hover:bg-zinc-800 transition ${selectedChapter === 0 ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-300'}`}
              >
                {language === "de" ? "Alle Kapitel" : "All Chapters"}
              </button>
              {chapters.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => { setSelectedChapter(ch.id); setShowChapterSelect(false); }}
                  className={`w-full p-4 text-left hover:bg-zinc-800 transition border-t border-zinc-800 ${selectedChapter === ch.id ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-300'}`}
                >
                  {language === "de" ? ch.title_de : ch.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Card Counter */}
        <div className="text-center mb-6 flex items-center justify-center gap-4">
          <span className="text-zinc-400 text-sm">
            {t("cardOf").replace("{current}", currentIndex + 1).replace("{total}", flashcards.length)}
          </span>
          {srMode && (
            <span className={`text-xs px-2 py-1 rounded ${
              cardStatus === 'new' ? 'bg-blue-500/20 text-blue-400' :
              cardStatus === 'due' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-emerald-500/20 text-emerald-400'
            }`}>
              {cardStatus === 'new' ? (language === "de" ? "Neu" : "New") :
               cardStatus === 'due' ? (language === "de" ? "Fällig" : "Due") :
               (language === "de" ? "Gelernt" : "Learning")}
            </span>
          )}
        </div>

        {/* Flashcard */}
        {currentCard && (
          <div 
            className={`flip-card ${flipped ? 'flipped' : ''} h-80 mb-6 cursor-pointer`}
            onClick={handleFlip}
            data-testid="flashcard"
          >
            <div className="flip-card-inner relative w-full h-full">
              {/* Front */}
              <div className="flip-card-front absolute w-full h-full stats-card p-8 flex flex-col items-center justify-center">
                {currentCard.category && (
                  <span className="absolute top-4 left-4 text-xs px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full">
                    {currentCard.category}
                  </span>
                )}
                <p className="text-xl text-white text-center leading-relaxed">
                  {currentCard.front}
                </p>
                <p className="absolute bottom-4 text-xs text-zinc-500">
                  {language === "de" ? "Tippen zum Umdrehen" : "Tap to flip"}
                </p>
              </div>
              
              {/* Back */}
              <div className="flip-card-back absolute w-full h-full stats-card p-8 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500/5 to-cyan-500/5">
                {currentCard.category && (
                  <span className="absolute top-4 left-4 text-xs px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full">
                    {currentCard.category}
                  </span>
                )}
                <p className="text-lg text-zinc-200 text-center leading-relaxed">
                  {currentCard.back}
                </p>
                <p className="absolute bottom-4 text-xs text-zinc-500">
                  {language === "de" ? "Tippen zum Umdrehen" : "Tap to flip"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SR Rating Buttons */}
        {srMode && showRating && flipped && (
          <div className="grid grid-cols-4 gap-2 mb-6 animate-fadeIn">
            <button
              onClick={() => handleRating('again')}
              className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition"
              data-testid="rating-again"
            >
              <XCircle className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs font-semibold">{language === "de" ? "Nochmal" : "Again"}</p>
              <p className="text-[10px] opacity-70">&lt;6min</p>
            </button>
            <button
              onClick={() => handleRating('hard')}
              className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 transition"
              data-testid="rating-hard"
            >
              <Clock className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs font-semibold">{language === "de" ? "Schwer" : "Hard"}</p>
              <p className="text-[10px] opacity-70">1h</p>
            </button>
            <button
              onClick={() => handleRating('good')}
              className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition"
              data-testid="rating-good"
            >
              <CheckCircle2 className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs font-semibold">{language === "de" ? "Gut" : "Good"}</p>
              <p className="text-[10px] opacity-70">1d</p>
            </button>
            <button
              onClick={() => handleRating('easy')}
              className="p-3 rounded-xl bg-[#00ff41]/10 border border-[#00ff41]/30 text-[#00ff41] hover:bg-[#00ff41]/20 transition"
              data-testid="rating-easy"
            >
              <Zap className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs font-semibold">{language === "de" ? "Leicht" : "Easy"}</p>
              <p className="text-[10px] opacity-70">3d</p>
            </button>
          </div>
        )}

        {/* Navigation */}
        {!srMode && (
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={handlePrev}
              className="btn-secondary flex-1"
              data-testid="prev-card-btn"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("previous")}
            </Button>
            
            <Button 
              onClick={handleShuffle}
              className="btn-secondary px-4"
              data-testid="shuffle-btn"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            <Button 
              onClick={handleNext}
              className="btn-primary text-black flex-1"
              data-testid="next-card-btn"
            >
              {t("next")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* SR Mode Skip Button */}
        {srMode && !showRating && (
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={handlePrev}
              className="btn-secondary flex-1"
              data-testid="prev-card-btn"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("previous")}
            </Button>
            <Button 
              onClick={handleNext}
              className="btn-secondary flex-1"
              data-testid="skip-card-btn"
            >
              {language === "de" ? "Überspringen" : "Skip"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Card Progress */}
        <div className="mb-4">
          <Progress value={(currentIndex / flashcards.length) * 100} className="h-2 bg-zinc-800" />
        </div>

        {/* Card Dots */}
        <div className="flex justify-center gap-1 flex-wrap">
          {flashcards.map((card, idx) => {
            const status = getCardDueStatus(card, srData);
            return (
              <button
                key={idx}
                onClick={() => { setCurrentIndex(idx); setFlipped(false); setShowRating(false); }}
                className={`w-2 h-2 rounded-full transition ${
                  idx === currentIndex 
                    ? 'bg-[#00ff41]' 
                    : srMode 
                      ? (status === 'new' ? 'bg-blue-500/50' : status === 'due' ? 'bg-yellow-500/50' : 'bg-emerald-500/50')
                      : 'bg-zinc-700'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
