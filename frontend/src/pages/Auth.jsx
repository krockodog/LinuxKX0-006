import { useState } from "react";
import { useApp } from "../App";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Terminal, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function Auth() {
  const { t, language, setLanguage, login, register } = useApp();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success(language === "de" ? "Erfolgreich angemeldet!" : "Successfully logged in!");
      } else {
        await register(formData.email, formData.password, formData.name);
        toast.success(language === "de" ? "Konto erstellt!" : "Account created!");
      }
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.detail || (language === "de" ? "Ein Fehler ist aufgetreten" : "An error occurred"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 max-w-xl mx-auto w-full">
        {/* Back button */}
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition mb-12 self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">{language === "de" ? "Zurück" : "Back"}</span>
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Terminal className="w-7 h-7 text-black" />
          </div>
          <div>
            <span className="text-2xl font-bold font-mono gradient-text">Linux+</span>
            <p className="text-sm text-zinc-500">{t("tagline")}</p>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="lang-toggle flex w-fit mb-8">
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

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2">
          {isLogin ? t("login") : t("register")}
        </h1>
        <p className="text-zinc-400 mb-8">
          {isLogin ? t("hasAccount") : t("noAccount")}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-400 hover:text-emerald-300 ml-2 font-medium"
          >
            {isLogin ? t("register") : t("login")}
          </button>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2 animate-fadeIn">
              <Label htmlFor="name" className="text-zinc-300">{t("name")}</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-12 bg-zinc-900 border-zinc-800 h-12"
                  required={!isLogin}
                  data-testid="name-input"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">{t("email")}</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-12 bg-zinc-900 border-zinc-800 h-12"
                required
                data-testid="email-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-300">{t("password")}</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-12 bg-zinc-900 border-zinc-800 h-12"
                required
                data-testid="password-input"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full btn-primary text-black font-semibold h-12 text-base mt-6"
            disabled={loading}
            data-testid="submit-btn"
          >
            {loading ? (
              <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full"></div>
            ) : (
              isLogin ? t("login") : t("register")
            )}
          </Button>
        </form>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-zinc-900/50 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        
        <div className="relative z-10 text-center px-12">
          <div className="font-mono text-sm text-emerald-400 mb-6">$ sudo learn linux+</div>
          
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 font-mono text-sm text-left max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="space-y-2 text-zinc-300">
              <p><span className="text-emerald-400">$</span> cat /etc/exam-prep</p>
              <p className="text-zinc-500"># CompTIA Linux+ XK0-006</p>
              <p><span className="text-cyan-400">DOMAINS</span>=5</p>
              <p><span className="text-cyan-400">QUESTIONS</span>=150+</p>
              <p><span className="text-cyan-400">WEEKS</span>=20</p>
              <p className="text-emerald-400 cursor-blink">Ready to learn_</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
