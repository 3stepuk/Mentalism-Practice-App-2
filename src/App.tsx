import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  CategoryData, 
  SessionData, 
  TrainerSettings, 
  TrainerStats 
} from './types';
import { 
  generateSession, 
  getCategoriesFromStorage, 
  getSettingsFromStorage, 
  getStatsFromStorage, 
  resetCategoriesToDefault, 
  saveCategoriesToStorage, 
  saveSettingsToStorage, 
  saveStatsToStorage, 
  validateGuess 
} from './utils/engine';
import { WordCard } from './components/WordCard';
import { LookupModal } from './components/LookupModal';
import { SettingsModal } from './components/SettingsModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { 
  Terminal, 
  Send, 
  ArrowRight, 
  BookOpen, 
  Sliders, 
  HelpCircle, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Timer,
  Award,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Persistence & Data States
  const [categories, setCategories] = useState<CategoryData[]>(() => getCategoriesFromStorage());
  const [settings, setSettings] = useState<TrainerSettings>(() => getSettingsFromStorage());
  const [stats, setStats] = useState<TrainerStats>(() => getStatsFromStorage());

  // Modals
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  // Session State - starts immediately on load with Session 1
  const [session, setSession] = useState<SessionData>(() => {
    return generateSession(categories, settings.enabledCategories, 1);
  });

  const [inputGuess, setInputGuess] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically whenever a new session starts
  useEffect(() => {
    if (session.status === 'guessing') {
      inputRef.current?.focus();
    }
  }, [session.sessionNumber, session.status]);

  // Elapsed time counter
  useEffect(() => {
    if (session.status !== 'guessing' || !settings.showTimer) return;
    setElapsedSeconds(0);
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [session.sessionNumber, session.status, settings.showTimer]);

  // Handle Reveal / Submit Guess
  const handleReveal = useCallback((userSubmittedGuess?: string) => {
    if (session.status === 'revealed') return;

    const currentGuess = (userSubmittedGuess !== undefined ? userSubmittedGuess : inputGuess).trim();
    const isCorrect = currentGuess.length > 0 
      ? validateGuess(currentGuess, session.masterWord.word, session.letterPair, settings.fuzzyMatching)
      : false;

    const durationMs = Date.now() - session.startTime;

    // Trigger celebration if correct
    if (isCorrect) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6']
        });
      } catch (e) {
        // Safe fallback
      }
    }

    // Update Stats
    const nextStreak = isCorrect ? stats.currentStreak + 1 : 0;
    const newStats: TrainerStats = {
      attempted: stats.attempted + 1,
      correct: isCorrect ? stats.correct + 1 : stats.correct,
      currentStreak: nextStreak,
      bestStreak: Math.max(stats.bestStreak, nextStreak),
      history: [
        {
          session: session.sessionNumber,
          masterWord: session.masterWord.word,
          category: session.category,
          userGuess: currentGuess || '(Skipped)',
          correct: isCorrect,
          durationMs,
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...stats.history.slice(0, 49) // Keep last 50
      ]
    };

    setStats(newStats);
    saveStatsToStorage(newStats);

    setSession(prev => ({
      ...prev,
      status: 'revealed',
      userGuess: currentGuess,
      isCorrect,
      endTime: Date.now()
    }));
  }, [inputGuess, session, settings.fuzzyMatching, stats]);

  // Handle Next Session
  const handleNextSession = useCallback(() => {
    const nextSessionNum = session.sessionNumber + 1;
    const newSession = generateSession(
      categories,
      settings.enabledCategories,
      nextSessionNum,
      session.masterWord.word
    );
    setSession(newSession);
    setInputGuess('');
    setElapsedSeconds(0);
    // Keep input focused
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [categories, session.masterWord.word, session.sessionNumber, settings.enabledCategories]);

  // Keyboard shortcut listener (Enter submits if guessing, or moves to next if revealed)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (session.status === 'guessing') {
        handleReveal();
      } else {
        handleNextSession();
      }
    }
  };

  // Global keyboard listener for spacebar / enter to advance when revealed
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (session.status === 'revealed' && (e.key === 'Enter' || e.key === ' ')) {
        if (!isLookupOpen && !isSettingsOpen && !isHowToPlayOpen) {
          e.preventDefault();
          handleNextSession();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [session.status, isLookupOpen, isSettingsOpen, isHowToPlayOpen, handleNextSession]);

  // Settings & Categories Handlers
  const handleUpdateCategories = (newCategories: CategoryData[]) => {
    setCategories(newCategories);
    saveCategoriesToStorage(newCategories);
  };

  const handleResetCategories = () => {
    const defaultCats = resetCategoriesToDefault();
    setCategories(defaultCats);
    setSettings(prev => {
      const updated = { ...prev, enabledCategories: defaultCats.map(c => c.id) };
      saveSettingsToStorage(updated);
      return updated;
    });
  };

  const handleUpdateSettings = (newSettings: TrainerSettings) => {
    setSettings(newSettings);
    saveSettingsToStorage(newSettings);
  };

  const handleResetStats = () => {
    if (confirm("Reset current practice score and streak?")) {
      const resetData: TrainerStats = {
        attempted: 0,
        correct: 0,
        currentStreak: 0,
        bestStreak: 0,
        history: []
      };
      setStats(resetData);
      saveStatsToStorage(resetData);
    }
  };

  const accuracy = stats.attempted > 0 
    ? Math.round((stats.correct / stats.attempted) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-[#090b11] text-slate-100 font-sans flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
      {/* Top Terminal Bar */}
      <header className="border-b border-slate-800/80 bg-[#0d101a]/95 backdrop-blur sticky top-0 z-30 px-4 sm:px-8 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Terminal Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-sm shadow-indigo-950">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-mono text-sm sm:text-base font-extrabold tracking-tight text-slate-100 uppercase">
                  Vanguard Mentalism Terminal
                </h1>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  DECODE DRILL
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
                Spectator 3-Word Code Training Engine
              </p>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              id="open-lookup-button"
              onClick={() => setIsLookupOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141828] border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-[#181d30] text-xs font-mono transition-all"
              title="View Reference Lookup Table"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Lookup Table</span>
            </button>

            <button
              id="open-settings-button"
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141828] border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-[#181d30] text-xs font-mono transition-all"
              title="Configure Word Banks & Categories"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Word Banks</span>
            </button>

            <button
              id="open-howto-button"
              onClick={() => setIsHowToPlayOpen(true)}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-[#141828] border border-slate-800 text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-[#181d30] text-xs font-mono transition-all"
              title="How this Mentalism Effect Works"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Terminal Stage */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col justify-center gap-8">
        
        {/* Score & Session Stats Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#111422] border border-slate-800/80 rounded-xl font-mono text-xs text-slate-400">
          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <span className="text-slate-500 mr-1.5">SESSION:</span>
              <strong className="text-indigo-400 font-bold">#{session.sessionNumber}</strong>
            </div>

            <div className="h-3.5 w-px bg-slate-800 hidden sm:block" />

            <div>
              <span className="text-slate-500 mr-1.5">SCORE:</span>
              <strong className="text-slate-200">{stats.correct}</strong>
              <span className="text-slate-500"> / {stats.attempted}</span>
              {stats.attempted > 0 && (
                <span className="ml-1 text-slate-400 text-[11px]">({accuracy}%)</span>
              )}
            </div>

            <div className="h-3.5 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-1">
              <Zap className={`w-3.5 h-3.5 ${stats.currentStreak > 0 ? 'text-amber-400' : 'text-slate-600'}`} />
              <span className="text-slate-500 mr-1">STREAK:</span>
              <strong className={stats.currentStreak > 0 ? 'text-amber-300' : 'text-slate-400'}>
                {stats.currentStreak}
              </strong>
              {stats.bestStreak > 0 && (
                <span className="text-[10px] text-slate-500 ml-1">(Best: {stats.bestStreak})</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {settings.showTimer && (
              <div className="flex items-center gap-1.5 text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
                <Timer className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-mono text-xs">{elapsedSeconds}s</span>
              </div>
            )}

            {stats.attempted > 0 && (
              <button
                onClick={handleResetStats}
                className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
                title="Reset session score"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 1. THREE SPECTATOR WORDS DISPLAY (Displayed Immediately) */}
        <section id="spectator-words-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                Spectator Output (3 Words In Random Order)
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Decode: Category + 1st & 2nd Letters
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {session.spectatorWords.map((wordObj, idx) => (
              <WordCard
                key={`${session.sessionNumber}-${idx}-${wordObj.text}`}
                word={wordObj}
                index={idx}
                revealed={session.status === 'revealed'}
              />
            ))}
          </div>
        </section>

        {/* 2. SINGLE TEXT INPUT WHERE PERFORMER TYPES GUESS */}
        <section id="performer-input-section" className="space-y-2">
          <label htmlFor="performer-guess-input" className="block text-xs font-mono font-semibold text-slate-400">
            ENTER DECODED MASTER WORD:
          </label>
          
          <div className="relative">
            <input
              id="performer-guess-input"
              ref={inputRef}
              type="text"
              autoComplete="off"
              spellCheck="false"
              value={inputGuess}
              disabled={session.status === 'revealed'}
              onChange={e => setInputGuess(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={session.status === 'guessing' ? 'Type your decoded master word guess here...' : 'Session completed. Press Next or Enter.'}
              className={`w-full font-mono text-lg sm:text-xl py-4 pl-5 pr-14 rounded-xl border bg-[#111422] transition-all focus:outline-none ${
                session.status === 'revealed'
                  ? session.isCorrect
                    ? 'border-emerald-500/60 bg-emerald-950/20 text-emerald-300'
                    : 'border-rose-500/60 bg-rose-950/20 text-rose-300'
                  : 'border-slate-800 text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-inner'
              }`}
            />

            {/* Quick Submit Icon button within input */}
            {session.status === 'guessing' && (
              <button
                id="submit-guess-button"
                onClick={() => handleReveal()}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-950 hover:scale-105 active:scale-95"
                title="Submit Decode Guess (Enter)"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1">
            <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]">Enter</kbd> to submit</span>
            <span>Lookup table available in top bar</span>
          </div>
        </section>

        {/* 3. REVEAL / NEXT SESSION ACTION & EXPLANATION PANEL */}
        <section id="action-and-feedback-section" className="space-y-4">
          {session.status === 'guessing' ? (
            <div className="flex items-center gap-3">
              <button
                id="reveal-answer-button"
                onClick={() => handleReveal()}
                className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-mono font-bold text-sm tracking-wide transition-all shadow-lg shadow-indigo-950/60 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>REVEAL ANSWER & BREAKDOWN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Feedback Banner */}
              <div
                id="feedback-banner"
                className={`p-5 sm:p-6 rounded-2xl border ${
                  session.isCorrect
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                    : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    {session.isCorrect ? (
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shrink-0">
                        <XCircle className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider">
                          {session.isCorrect ? 'PERFECT DECODE!' : 'INCORRECT GUESS'}
                        </span>
                        {session.userGuess && (
                          <span className="text-xs font-mono text-slate-400">
                            (You guessed: &ldquo;{session.userGuess}&rdquo;)
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight mt-0.5">
                        MASTER WORD: <span className="text-indigo-300 underline decoration-indigo-400">{session.masterWord.word}</span>
                      </h3>
                    </div>
                  </div>

                  {/* 2-Letter Pair Code Badge */}
                  <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                    <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 font-mono text-center">
                      <span className="text-[10px] text-slate-400 block font-semibold">LETTER PAIR</span>
                      <span className="text-base font-bold text-amber-300 tracking-wider">
                        {session.letterPair}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mentalism Decode Proof Walkthrough */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">1. CATEGORY IDENTIFIED</span>
                    <strong className="text-emerald-400 font-bold">{session.category}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">2. EXTRACTED LETTERS</span>
                    <strong className="text-indigo-400 font-bold">
                      {session.firstLetter} + {session.secondLetter} (or {session.secondLetter}{session.firstLetter})
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">3. TABLE RESOLUTION</span>
                    <strong className="text-amber-400 font-bold">
                      {session.category} &rarr; [{session.letterPair}] = {session.masterWord.word}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Next Session Button */}
              <button
                id="next-session-button"
                onClick={handleNextSession}
                className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-extrabold text-base tracking-wider transition-all shadow-xl shadow-indigo-950/80 flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>ADVANCE TO SESSION #{session.sessionNumber + 1}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </section>

      </main>

      {/* Terminal Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0c0e18] px-4 py-3 text-center text-xs font-mono text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>MENTALISM TRAINING PROTOCOL &bull; 100% LOCAL IN-BROWSER EXECUTION</span>
          <div className="flex items-center gap-4">
            <span>{categories.length} Categories</span>
            <span>&bull;</span>
            <span>{categories.reduce((acc, c) => acc + c.words.length, 0)} Master Words Bank</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LookupModal
        isOpen={isLookupOpen}
        onClose={() => {
          setIsLookupOpen(false);
          inputRef.current?.focus();
        }}
        categories={categories}
        currentCategory={session.category}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
          inputRef.current?.focus();
        }}
        categories={categories}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onUpdateCategories={handleUpdateCategories}
        onResetCategories={handleResetCategories}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => {
          setIsHowToPlayOpen(false);
          inputRef.current?.focus();
        }}
      />
    </div>
  );
}
