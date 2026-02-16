import { useState } from 'react';
import { Terminal } from 'lucide-react';

const WelcomeScreen = ({ onComplete, language }) => {
  const [username, setUsername] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim().length >= 2) {
      setIsAnimating(true);
      setTimeout(() => {
        onComplete(username.trim());
      }, 500);
    }
  };

  const texts = {
    en: {
      title: '> LINUX+ MASTERY_',
      subtitle: 'CompTIA Linux+ XK0-006 Certification Prep',
      placeholder: 'Enter your name...',
      button: 'Initialize System',
      minChars: 'Minimum 2 characters'
    },
    de: {
      title: '> LINUX+ MASTERY_',
      subtitle: 'CompTIA Linux+ XK0-006 Zertifizierungsvorbereitung',
      placeholder: 'Gib deinen Namen ein...',
      button: 'System initialisieren',
      minChars: 'Mindestens 2 Zeichen'
    }
  };

  const t = texts[language] || texts.en;

  return (
    <div className={`welcome-screen ${isAnimating ? 'animate-fadeOut' : ''}`} data-testid="welcome-screen">
      <div className="welcome-card">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00ff41] to-[#008f11] flex items-center justify-center">
            <Terminal className="w-10 h-10 text-black" />
          </div>
        </div>
        
        <h1 className="welcome-title">{t.title}</h1>
        <p className="welcome-subtitle">{t.subtitle}</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t.placeholder}
            className="welcome-input"
            autoFocus
            maxLength={20}
            data-testid="username-input"
          />
          
          {username.length > 0 && username.length < 2 && (
            <p className="text-yellow-500 text-sm mb-4 font-mono">{t.minChars}</p>
          )}
          
          <button
            type="submit"
            disabled={username.trim().length < 2}
            className="welcome-btn"
            data-testid="start-btn"
          >
            {t.button}
          </button>
        </form>
        
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {}}
            className={`text-xs font-mono px-3 py-1 rounded ${language === 'en' ? 'bg-[#00ff41] text-black' : 'text-[#00ff41] border border-[#00ff41]/30'}`}
          >
            EN
          </button>
          <button
            onClick={() => {}}
            className={`text-xs font-mono px-3 py-1 rounded ${language === 'de' ? 'bg-[#00ff41] text-black' : 'text-[#00ff41] border border-[#00ff41]/30'}`}
          >
            DE
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
