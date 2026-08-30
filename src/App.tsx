import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  CategoryData, 
  SessionData, 
  TrainerSettings, 
  TrainerStats,
  SkillLevel
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
  Target,
  Shuffle,
  Clock,
  History,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Flame,
  Volume2,
  VolumeX
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
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

  // Session State - starts immediately on load with Session 1
  const [session, setSession] = useState<SessionData>(() => {
    return generateSession(
      categories, 
      settings.enabledCategories, 
      1,
      undefined,
      settings.skillLevel,
      settings.level1Category
    );
  });

  const [inputGuess, setInputGuess] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timedRemaining, setTimedRemaining] = useState<number>(settings.timedDrillSeconds || 10);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically whenever a new session starts
  useEffect(() => {
    if (session.status === 'guessing') {
      inputRef.current?.focus();
    }
  }, [session.sessionNumber, session.status]);

  // Elapsed stopwatch counter (for Level 1 & Level 2)
  useEffect(() => {
    if (session.status !== 'guessing' || settings.skillLevel === 'level3' || !settings.showTimer) return;
    setElapsedSeconds(0);
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [session.sessionNumber, session.status, settings.showTimer, settings.skillLevel]);

  // Level 3 Countdown Timer Engine
  useEffect(() => {
    if (session.status !== 'guessing' || settings.skillLevel !== 'level3') return;

    const totalSeconds = settings.timedDrillSeconds || 10;
    setTimedRemaining(totalSeconds);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedMs = Date.now() - startTime;
      const remainingSec = Math.max(0, totalSeconds - elapsedMs / 1000);
      setTimedRemaining(remainingSec);

      if (remainingSec <= 0) {
        clearInterval(interval);
        handleTimeout();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [session.sessionNumber, session.status, settings.skillLevel, settings.timedDrillSeconds]);

  // Handle Timeout for Level 3
  const handleTimeout = useCallback(() => {
    if (session.status === 'revealed') return;

    const durationMs = (settings.timedDrillSeconds || 10) * 1000;
    const nextStreak = 0;

    const newStats: TrainerStats = {
      attempted: stats.attempted + 1,
      correct: stats.correct,
      currentStreak: 0,
      bestStreak: stats.bestStreak,
      history: [
        {
          session: session.sessionNumber,
          masterWord: session.masterWord.word,
          category: session.category,
          userGuess: '(Timed Out)',
          correct: false,
          durationMs,
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          level: settings.skillLevel,
          timedOut: true
        },
        ...stats.history.slice(0, 49)
      ]
    };

    setStats(newStats);
    saveStatsToStorage(newStats);

    setSession(prev => ({
      ...prev,
      status: 'revealed',
      userGuess: '(Timed Out)',
      isCorrect: false,
      timedOut: true,
      endTime: Date.now()
    }));
  }, [session, settings.skillLevel, settings.timedDrillSeconds, stats]);

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
          particleCount: 55,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#06b6d4', '#10b981', '#f59e0b', '#3b82f6', '#ec4899']
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
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          level: settings.skillLevel,
          timedOut: false
        },
        ...stats.history.slice(0, 49)
      ]
    };

    setStats(newStats);
    saveStatsToStorage(newStats);

    setSession(prev => ({
      ...prev,
      status: 'revealed',
      userGuess: currentGuess,
      isCorrect,
      timedOut: false,
      endTime: Date.now()
    }));
  }, [inputGuess, session, settings.fuzzyMatching, settings.skillLevel, stats]);

  // Handle Next Session
  const handleNextSession = useCallback((customLevel?: SkillLevel, customCategory?: string) => {
    const nextSessionNum = session.sessionNumber + 1;
    const activeLevel = customLevel || settings.skillLevel;
    const activeCategory = customCategory || settings.level1Category;

    const newSession = generateSession(
      categories,
      settings.enabledCategories,
      nextSessionNum,
      session.masterWord.word,
      activeLevel,
      activeCategory
    );
    setSession(newSession);
    setInputGuess('');
    setElapsedSeconds(0);
    setTimedRemaining(settings.timedDrillSeconds || 10);
    
    // Focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [categories, session.masterWord.word, session.sessionNumber, settings.enabledCategories, settings.level1Category, settings.skillLevel, settings.timedDrillSeconds]);

  // Quick switch skill level from header
  const handleSwitchLevel = (level: SkillLevel) => {
    const updated = { ...settings, skillLevel: level };
    setSettings(updated);
    saveSettingsToStorage(updated);
    // Restart session in new level
    const newSession = generateSession(
      categories,
      updated.enabledCategories,
      session.sessionNumber,
      undefined,
      level,
      updated.level1Category
    );
    setSession(newSession);
    setInputGuess('');
    setElapsedSeconds(0);
    setTimedRemaining(updated.timedDrillSeconds || 10);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSwitchLevel1Category = (catId: string) => {
    const updated = { ...settings, level1Category: catId };
    setSettings(updated);
    saveSettingsToStorage(updated);
    if (settings.skillLevel === 'level1') {
      const newSession = generateSession(
        categories,
        updated.enabledCategories,
        session.sessionNumber,
        undefined,
        'level1',
        catId
      );
      setSession(newSession);
      setInputGuess('');
    }
  };

  // Keyboard shortcut listener
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
    if (confirm("Reset current practice score, streak, and decode history?")) {
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

  // Level 3 timer percentage
  const totalLimit = settings.timedDrillSeconds || 10;
  const timePercentage = Math.max(0, Math.min(100, (timedRemaining / totalLimit) * 100));

  return (
    <div className="min-h-screen bg-[#0a0b14] text-gray-200 font-mono flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* Top Terminal Bar */}
      <header className="border-b border-[#1e293b] bg-[#0c0e1a]/95 backdrop-blur sticky top-0 z-30 px-4 sm:px-8 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Terminal Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold tracking-widest text-white uppercase">
                  VANGUARD SIGNAL DECODER
                </h1>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold">
                  v2.0 // TERMINAL
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block uppercase tracking-tight">
                Mentalism Spectator 3-Word Matrix Protocol
              </p>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center gap-2">
            <button
              id="open-lookup-button"
              onClick={() => setIsLookupOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#111827] border border-[#1e293b] text-gray-300 hover:text-white hover:border-cyan-500/50 hover:bg-[#152238] text-xs font-bold transition-all uppercase tracking-wider"
              title="View Reference Lookup Crib Sheet"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Crib Sheet</span>
            </button>

            <button
              id="open-settings-button"
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#111827] border border-[#1e293b] text-gray-300 hover:text-white hover:border-cyan-500/50 hover:bg-[#152238] text-xs font-bold transition-all uppercase tracking-wider"
              title="Skill Levels & Word Banks Config"
            >
              <Sliders className="w-3.5 h-3.5 text-gray-400" />
              <span className="hidden md:inline">Config</span>
            </button>

            <button
              id="open-howto-button"
              onClick={() => setIsHowToPlayOpen(true)}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded bg-[#111827] border border-[#1e293b] text-gray-400 hover:text-white hover:border-cyan-500/50 hover:bg-[#152238] text-xs font-bold transition-all"
              title="How this Mentalism Effect Works"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* SKILL LEVEL SELECTOR STRIP */}
      <section className="bg-[#030712] border-b border-[#1e293b] px-4 py-2.5">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Level Switcher Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] text-gray-500 uppercase font-bold mr-1 hidden sm:inline">TRAINING DRILL:</span>
            
            {/* Level 1 Button */}
            <button
              id="skill-level-1-button"
              onClick={() => handleSwitchLevel('level1')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-all uppercase tracking-wider ${
                settings.skillLevel === 'level1'
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'bg-[#111827] text-gray-400 border border-[#1e293b] hover:text-white hover:border-gray-700'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>L1: SINGLE CATEGORY</span>
            </button>

            {/* Level 2 Button */}
            <button
              id="skill-level-2-button"
              onClick={() => handleSwitchLevel('level2')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-all uppercase tracking-wider ${
                settings.skillLevel === 'level2'
                  ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                  : 'bg-[#111827] text-gray-400 border border-[#1e293b] hover:text-white hover:border-gray-700'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>L2: MULTI-CATEGORY</span>
            </button>

            {/* Level 3 Button */}
            <button
              id="skill-level-3-button"
              onClick={() => handleSwitchLevel('level3')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-all uppercase tracking-wider ${
                settings.skillLevel === 'level3'
                  ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                  : 'bg-[#111827] text-gray-400 border border-[#1e293b] hover:text-white hover:border-gray-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>L3: TIMED DRILL</span>
            </button>
          </div>

          {/* Level Context Helpers */}
          <div className="flex items-center gap-3">
            {settings.skillLevel === 'level1' && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-cyan-400 uppercase font-bold">FOCUS:</span>
                <select
                  value={settings.level1Category}
                  onChange={e => handleSwitchLevel1Category(e.target.value)}
                  className="bg-[#111827] border border-cyan-500/50 rounded px-2 py-0.5 text-xs text-cyan-300 uppercase tracking-wider focus:outline-none"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {settings.skillLevel === 'level3' && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-amber-400 uppercase font-bold">LIMIT:</span>
                {[5, 7, 10, 15].map(sec => (
                  <button
                    key={sec}
                    onClick={() => {
                      const updated = { ...settings, timedDrillSeconds: sec };
                      setSettings(updated);
                      saveSettingsToStorage(updated);
                      setTimedRemaining(sec);
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      (settings.timedDrillSeconds || 10) === sec
                        ? 'bg-amber-500 text-black font-black'
                        : 'bg-[#111827] text-gray-400 hover:text-white'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Terminal Stage */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col justify-center gap-6">
        
        {/* Score & Session Stats Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#0f1122] border border-[#1e293b] rounded-lg text-xs text-gray-400">
          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <span className="text-gray-500 mr-1.5 uppercase">TRANSMISSION:</span>
              <strong className="text-cyan-400 font-bold">#{session.sessionNumber}</strong>
            </div>

            <div className="h-3.5 w-px bg-[#1e293b] hidden sm:block" />

            <div>
              <span className="text-gray-500 mr-1.5 uppercase">DECODES:</span>
              <strong className="text-white">{stats.correct}</strong>
              <span className="text-gray-500"> / {stats.attempted}</span>
              {stats.attempted > 0 && (
                <span className="ml-1 text-cyan-400 text-[11px]">({accuracy}%)</span>
              )}
            </div>

            <div className="h-3.5 w-px bg-[#1e293b] hidden sm:block" />

            <div className="flex items-center gap-1">
              <Zap className={`w-3.5 h-3.5 ${stats.currentStreak > 0 ? 'text-amber-400' : 'text-gray-600'}`} />
              <span className="text-gray-500 mr-1 uppercase">STREAK:</span>
              <strong className={stats.currentStreak > 0 ? 'text-amber-300' : 'text-gray-400'}>
                {stats.currentStreak}
              </strong>
              {stats.bestStreak > 0 && (
                <span className="text-[10px] text-gray-500 ml-1">(Best: {stats.bestStreak})</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Stopwatch indicator for L1/L2 */}
            {settings.skillLevel !== 'level3' && settings.showTimer && (
              <div className="flex items-center gap-1.5 text-gray-300 bg-[#030712] px-2.5 py-1 rounded border border-[#1e293b]">
                <Timer className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold text-xs">{elapsedSeconds}s</span>
              </div>
            )}

            {/* Toggle History Drawer */}
            <button
              onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
              className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-white transition-colors bg-[#030712] px-2 py-1 rounded border border-[#1e293b] uppercase"
            >
              <History className="w-3 h-3 text-cyan-400" />
              <span>Log ({stats.history.length})</span>
              {showHistoryDrawer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {stats.attempted > 0 && (
              <button
                onClick={handleResetStats}
                className="text-[11px] text-gray-500 hover:text-red-400 transition-colors p-1"
                title="Reset session stats"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Level 3 Timed Countdown Progress Bar */}
        {settings.skillLevel === 'level3' && session.status === 'guessing' && (
          <div className="space-y-1 bg-[#111827] border border-amber-500/40 rounded-lg p-3 shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-pulse">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-400 font-bold uppercase flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" /> COUNTDOWN TEMPO ACTIVE
              </span>
              <span className={`font-mono text-sm font-black ${
                timedRemaining <= 3 ? 'text-red-400 animate-bounce' : 'text-amber-300'
              }`}>
                {timedRemaining.toFixed(1)}s REMAINING
              </span>
            </div>
            <div className="w-full bg-[#030712] h-2 rounded-full overflow-hidden border border-amber-900/50">
              <div 
                className={`h-full transition-all duration-75 ${
                  timePercentage <= 30
                    ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                    : timePercentage <= 60
                    ? 'bg-amber-500'
                    : 'bg-cyan-400'
                }`}
                style={{ width: `${timePercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* History Drawer */}
        {showHistoryDrawer && (
          <div className="p-4 bg-[#0a0b14] border border-[#1e293b] rounded-lg space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs text-gray-400 uppercase font-bold border-b border-[#1e293b] pb-2">
              <span>Recent Transmission Logs</span>
              <button 
                onClick={() => setShowHistoryDrawer(false)}
                className="text-gray-500 hover:text-white"
              >
                Close
              </button>
            </div>
            {stats.history.length === 0 ? (
              <p className="text-xs text-gray-500 py-2">No transmissions logged in this session yet.</p>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {stats.history.slice(0, 10).map((h, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between text-xs p-2 rounded bg-[#111827] border border-[#1e293b]"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                        h.correct ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}>
                        {h.correct ? 'DECODED' : h.timedOut ? 'TIMED OUT' : 'MISSED'}
                      </span>
                      <span className="text-white font-bold">{h.masterWord}</span>
                      <span className="text-gray-500">[{h.category}]</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 text-[11px]">
                      <span>{(h.durationMs / 1000).toFixed(1)}s</span>
                      <span>{h.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 1. THREE SPECTATOR WORDS DISPLAY */}
        <section id="spectator-words-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                Spectator Output Streams (Randomized Sequence)
              </h2>
            </div>
            <span className="text-[11px] text-gray-500 uppercase tracking-tight">
              Formula: [1 Category Clue] + [2 Letter Clues]
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
          <label htmlFor="performer-guess-input" className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
            Target Master Word Decryption:
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
              placeholder={session.status === 'guessing' ? 'Type decoded master word...' : 'Transmission resolved. Press [Enter] or [Next].'}
              className={`w-full font-mono text-lg sm:text-xl py-4 pl-5 pr-14 rounded-lg border bg-[#0a0b14] uppercase transition-all focus:outline-none ${
                session.status === 'revealed'
                  ? session.isCorrect
                    ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'border-red-500 bg-red-950/20 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                  : 'border-[#1e293b] text-cyan-300 placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 shadow-inner'
              }`}
            />

            {/* Quick Submit Icon button within input */}
            {session.status === 'guessing' && (
              <button
                id="submit-guess-button"
                onClick={() => handleReveal()}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded bg-cyan-600 hover:bg-cyan-500 text-black transition-all shadow-md shadow-cyan-950 hover:scale-105 active:scale-95"
                title="Submit Decode Guess (Enter)"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-500 px-1 uppercase">
            <span>Press <kbd className="px-1.5 py-0.5 bg-[#111827] border border-[#1e293b] text-gray-300 rounded text-[10px]">Enter</kbd> to submit / advance</span>
            <span>Crib Sheet hotkey available above</span>
          </div>
        </section>

        {/* 3. REVEAL / NEXT SESSION ACTION & EXPLANATION PANEL */}
        <section id="action-and-feedback-section" className="space-y-4">
          {session.status === 'guessing' ? (
            <div className="flex items-center gap-3">
              <button
                id="reveal-answer-button"
                onClick={() => handleReveal()}
                className="flex-1 py-3.5 px-6 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-sm tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2 hover:scale-[1.005] active:scale-[0.99]"
              >
                <span>REVEAL MASTER WORD & MATRIX PROOF</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Feedback Banner */}
              <div
                id="feedback-banner"
                className={`p-5 sm:p-6 rounded-lg border-2 ${
                  session.isCorrect
                    ? 'bg-[#061e19] border-emerald-500/80 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                    : 'bg-[#220c11] border-red-500/80 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    {session.isCorrect ? (
                      <div className="p-2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="p-2 rounded bg-red-500/20 text-red-400 border border-red-500/40 shrink-0">
                        <XCircle className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {session.isCorrect 
                            ? 'TARGET DECRYPTED ACCURATELY' 
                            : session.timedOut 
                            ? 'TEMPO EXPIRED // TIMED OUT' 
                            : 'DECODE FAILED'}
                        </span>
                        {session.userGuess && (
                          <span className="text-xs text-gray-400">
                            (Input: &ldquo;{session.userGuess}&rdquo;)
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wider mt-0.5 uppercase">
                        MASTER WORD: <span className="text-cyan-400 underline decoration-cyan-500">{session.masterWord.word}</span>
                      </h3>
                    </div>
                  </div>

                  {/* 2-Letter Pair Code Badge */}
                  <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                    <div className="px-4 py-2 rounded bg-[#0a0b14] border border-[#1e293b] text-center">
                      <span className="text-[10px] text-gray-500 block font-bold uppercase">MATRIX CODE</span>
                      <span className="text-lg font-black text-amber-400 tracking-widest">
                        {session.letterPair}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mentalism Decode Proof Walkthrough */}
                <div className="mt-4 pt-4 border-t border-[#1e293b] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded bg-[#0a0b14] border border-[#1e293b]">
                    <span className="text-gray-500 block text-[10px] font-bold uppercase">1. CATEGORY IDENTIFIED</span>
                    <strong className="text-emerald-400 font-bold uppercase">{session.category}</strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#0a0b14] border border-[#1e293b]">
                    <span className="text-gray-500 block text-[10px] font-bold uppercase">2. EXTRACTED LETTERS</span>
                    <strong className="text-cyan-400 font-bold uppercase">
                      {session.firstLetter} + {session.secondLetter} (or {session.secondLetter}{session.firstLetter})
                    </strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#0a0b14] border border-[#1e293b]">
                    <span className="text-gray-500 block text-[10px] font-bold uppercase">3. MATRIX LOOKUP</span>
                    <strong className="text-amber-400 font-bold uppercase">
                      [{session.letterPair}] &rarr; {session.masterWord.word}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Next Session Button */}
              <button
                id="next-session-button"
                onClick={() => handleNextSession()}
                className="w-full py-4 px-6 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-black text-base tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-3 uppercase hover:scale-[1.005] active:scale-[0.99]"
              >
                <span>ADVANCE TO TRANSMISSION #{session.sessionNumber + 1} [ENTER]</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </section>

      </main>

      {/* Terminal Footer */}
      <footer className="border-t border-[#1e293b] bg-[#030712] px-4 py-3 text-center text-xs text-gray-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 uppercase tracking-wider">
          <span>VANGUARD PROTOCOL &bull; 100% CLIENT-SIDE IN-BROWSER MEMORY DRILL</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-cyan-400 font-bold">{categories.length} CATEGORIES</span>
            <span>&bull;</span>
            <span className="text-gray-400">{categories.reduce((acc, c) => acc + c.words.length, 0)} MASTER WORDS MATRIX</span>
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
