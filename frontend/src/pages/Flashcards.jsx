import { useState, useEffect } from "react";
import { useApp, API } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Terminal, BookOpen, ArrowLeft, ArrowRight, RotateCcw,
  ChevronDown, Layers
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chaptersRes = await axios.get(`${API}/chapters`);
        setChapters(chaptersRes.data);
        
        const url = selectedChapter > 0 
          ? `${API}/flashcards/${selectedChapter}` 
          : `${API}/flashcards`;
        const flashcardsRes = await axios.get(url);
        setFlashcards(flashcardsRes.data);
        setCurrentIndex(0);
        setFlipped(false);
      } catch (error) {
        toast.error(language === "de" ? "Fehler beim Laden" : "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedChapter, language]);

  const handleNext = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
    
    // Track review locally
    const savedProgress = localStorage.getItem("linux_progress");
    const progress = savedProgress ? JSON.parse(savedProgress) : { flashcards_reviewed: 0 };
    progress.flashcards_reviewed = (progress.flashcards_reviewed || 0) + 1;
    localStorage.setItem("linux_progress", JSON.stringify(progress));
  };

  const handlePrev = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  const handleShuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setFlipped(false);
    toast.success(language === "de" ? "Karten gemischt!" : "Cards shuffled!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

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
        <div className="text-center mb-6">
          <span className="text-zinc-400 text-sm">
            {t("cardOf").replace("{current}", currentIndex + 1).replace("{total}", flashcards.length)}
          </span>
        </div>

        {/* Flashcard */}
        {currentCard && (
          <div 
            className={`flip-card ${flipped ? 'flipped' : ''} h-80 mb-8 cursor-pointer`}
            onClick={() => setFlipped(!flipped)}
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

        {/* Navigation */}
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

        {/* Card Dots */}
        <div className="flex justify-center gap-1 flex-wrap">
          {flashcards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setCurrentIndex(idx); setFlipped(false); }}
              className={`w-2 h-2 rounded-full transition ${idx === currentIndex ? 'bg-emerald-500' : 'bg-zinc-700'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
