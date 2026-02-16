import { useState, useEffect } from "react";
import { useApp, API } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Terminal, ArrowLeft, ArrowRight, CheckCircle2, XCircle, 
  RotateCcw, Home, Trophy, AlertCircle, Sparkles, Key, Settings, Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  
  // AI Explanation state
  const [aiProviders, setAiProviders] = useState([]);
  const [showAiSettings, setShowAiSettings] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [saveApiKey, setSaveApiKey] = useState(true);
  const [aiExplanations, setAiExplanations] = useState({});
  const [loadingExplanation, setLoadingExplanation] = useState({});
  const [aiEnabled, setAiEnabled] = useState(true);

  // Check if running in Electron and if AI is enabled
  useEffect(() => {
    const checkAiEnabled = async () => {
      if (window.electronAPI) {
        const enabled = await window.electronAPI.getAiEnabled();
        setAiEnabled(enabled);
      }
    };
    checkAiEnabled();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requests = [
          axios.get(`${API}/questions/${chapter}?limit=10`),
          axios.get(`${API}/chapters`)
        ];
        
        // Only fetch AI providers if AI is enabled
        if (aiEnabled) {
          requests.push(axios.get(`${API}/ai/providers`));
        }
        
        const [questionsRes, chaptersRes, providersRes] = await Promise.all(requests);
        setQuestions(questionsRes.data);
        setChapterInfo(chaptersRes.data.find(c => c.id === parseInt(chapter)));
        
        if (providersRes) {
          setAiProviders(providersRes.data);
        }
        
        // Load saved AI settings
        const savedProvider = localStorage.getItem("ai_provider");
        const savedModel = localStorage.getItem("ai_model");
        if (savedProvider) setSelectedProvider(savedProvider);
        if (savedModel) setSelectedModel(savedModel);
        
        // Load saved API keys
        if (savedProvider) {
          const savedKey = localStorage.getItem(`ai_key_${savedProvider}`);
          if (savedKey) setApiKey(savedKey);
        }
      } catch (error) {
        toast.error(language === "de" ? "Fehler beim Laden" : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [chapter, language]);

  // Update API key when provider changes
  useEffect(() => {
    if (selectedProvider) {
      const savedKey = localStorage.getItem(`ai_key_${selectedProvider}`);
      setApiKey(savedKey || "");
      
      // Set default model for provider
      const provider = aiProviders.find(p => p.id === selectedProvider);
      if (provider && !selectedModel) {
        setSelectedModel(provider.default_model);
      }
    }
  }, [selectedProvider, aiProviders]);

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
        explanation: q.explanation
      });
    }
    
    const total = questions.length;
    const percentage = Math.round((correct / total) * 100);
    
    const quizResult = {
      id: Date.now().toString(),
      chapter: parseInt(chapter),
      score: correct,
      total: total,
      percentage: percentage,
      results: resultsList,
      completed_at: new Date().toISOString()
    };
    
    const savedProgress = localStorage.getItem("linux_progress");
    const progressData = savedProgress ? JSON.parse(savedProgress) : {
      total_quizzes: 0,
      total_correct: 0,
      total_questions: 0,
      chapters_completed: [],
      quiz_history: []
    };
    
    progressData.total_quizzes += 1;
    progressData.total_correct += correct;
    progressData.total_questions += total;
    if (percentage >= 70 && !progressData.chapters_completed.includes(parseInt(chapter))) {
      progressData.chapters_completed.push(parseInt(chapter));
    }
    progressData.quiz_history = [quizResult, ...(progressData.quiz_history || [])].slice(0, 10);
    
    localStorage.setItem("linux_progress", JSON.stringify(progressData));
    
    setResults(quizResult);
    setShowResults(true);
    setSubmitting(false);
    
    if (percentage >= 70) {
      toast.success(language === "de" ? "Kapitel bestanden!" : "Chapter passed!");
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setResults(null);
    setCurrentIndex(0);
    setAiExplanations({});
    window.location.reload();
  };

  const saveAiSettings = () => {
    if (selectedProvider) {
      localStorage.setItem("ai_provider", selectedProvider);
      if (selectedModel) {
        localStorage.setItem("ai_model", selectedModel);
      }
      if (saveApiKey && apiKey) {
        localStorage.setItem(`ai_key_${selectedProvider}`, apiKey);
      }
    }
    setShowAiSettings(false);
    toast.success(language === "de" ? "KI-Einstellungen gespeichert" : "AI settings saved");
  };

  const getAiExplanation = async (questionId) => {
    if (!selectedProvider || !apiKey) {
      setShowAiSettings(true);
      return;
    }

    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    setLoadingExplanation(prev => ({ ...prev, [questionId]: true }));

    try {
      const response = await axios.post(`${API}/ai/explain`, {
        question: question.question,
        options: question.options,
        correct_answer: question.correct_answer,
        user_answer: selectedAnswers[questionId],
        provider: selectedProvider,
        api_key: apiKey,
        model: selectedModel || undefined,
        language: language
      });

      if (response.data.success) {
        setAiExplanations(prev => ({ ...prev, [questionId]: response.data.explanation }));
      } else {
        toast.error(response.data.error || (language === "de" ? "KI-Fehler" : "AI error"));
      }
    } catch (error) {
      toast.error(language === "de" ? "Fehler bei der KI-Anfrage" : "AI request failed");
    } finally {
      setLoadingExplanation(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const isAiConfigured = selectedProvider && apiKey;

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

          {/* AI Settings Button */}
          <div className="flex justify-end mb-4">
            <Button 
              onClick={() => setShowAiSettings(true)} 
              variant="outline"
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
              data-testid="ai-settings-btn"
            >
              <Settings className="w-4 h-4 mr-2" />
              {language === "de" ? "KI-Einstellungen" : "AI Settings"}
            </Button>
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
                      
                      {/* Static Explanation */}
                      {result.explanation && (
                        <div className="mt-3 p-3 bg-zinc-800/50 rounded-lg">
                          <p className="text-xs text-zinc-500 uppercase mb-1">{t("explanation")}</p>
                          <p className="text-sm text-zinc-300">{result.explanation}</p>
                        </div>
                      )}

                      {/* AI Explanation */}
                      {aiExplanations[result.question_id] ? (
                        <div className="mt-3 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <p className="text-xs text-purple-400 uppercase font-semibold">
                              {language === "de" ? "KI-Erklärung" : "AI Explanation"}
                            </p>
                          </div>
                          <p className="text-sm text-zinc-300 whitespace-pre-wrap">{aiExplanations[result.question_id]}</p>
                        </div>
                      ) : (
                        <Button
                          onClick={() => getAiExplanation(result.question_id)}
                          disabled={loadingExplanation[result.question_id]}
                          className="mt-3 bg-purple-600 hover:bg-purple-700 text-white"
                          size="sm"
                          data-testid={`ai-explain-btn-${idx}`}
                        >
                          {loadingExplanation[result.question_id] ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              {language === "de" ? "Lädt..." : "Loading..."}
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              {language === "de" ? "KI-Erklärung anfordern" : "Get AI Explanation"}
                            </>
                          )}
                        </Button>
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

        {/* AI Settings Dialog */}
        <Dialog open={showAiSettings} onOpenChange={setShowAiSettings}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                {language === "de" ? "KI-Einstellungen" : "AI Settings"}
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                {language === "de" 
                  ? "Konfiguriere deinen KI-Anbieter für detaillierte Erklärungen."
                  : "Configure your AI provider for detailed explanations."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              {/* Provider Selection */}
              <div className="space-y-2">
                <Label className="text-zinc-300">
                  {language === "de" ? "KI-Anbieter" : "AI Provider"}
                </Label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder={language === "de" ? "Anbieter wählen..." : "Select provider..."} />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {aiProviders.map(provider => (
                      <SelectItem key={provider.id} value={provider.id} className="text-white hover:bg-zinc-700">
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Model Selection */}
              {selectedProvider && (
                <div className="space-y-2">
                  <Label className="text-zinc-300">
                    {language === "de" ? "Modell" : "Model"}
                  </Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue placeholder={language === "de" ? "Modell wählen..." : "Select model..."} />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {aiProviders.find(p => p.id === selectedProvider)?.models.map(model => (
                        <SelectItem key={model} value={model} className="text-white hover:bg-zinc-700">
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* API Key */}
              <div className="space-y-2">
                <Label className="text-zinc-300 flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  {language === "de" ? "API-Schlüssel" : "API Key"}
                </Label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={language === "de" ? "Dein API-Schlüssel..." : "Your API key..."}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
                <p className="text-xs text-zinc-500">
                  {language === "de" 
                    ? "Dein Schlüssel wird nur lokal gespeichert."
                    : "Your key is stored locally only."}
                </p>
              </div>

              {/* Save Key Toggle */}
              <div className="flex items-center justify-between">
                <Label className="text-zinc-300 text-sm">
                  {language === "de" ? "API-Schlüssel speichern" : "Save API key"}
                </Label>
                <Switch
                  checked={saveApiKey}
                  onCheckedChange={setSaveApiKey}
                />
              </div>

              {/* Save Button */}
              <Button 
                onClick={saveAiSettings}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={!selectedProvider}
              >
                {language === "de" ? "Speichern" : "Save"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
