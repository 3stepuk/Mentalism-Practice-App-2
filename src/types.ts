export type SkillLevel = 'level1' | 'level2' | 'level3';

export interface MasterWord {
  word: string;
  pair: string; // 2-letter uppercase pair, e.g. "SP"
  category: string;
}

export interface CategoryData {
  id: string;
  name: string;
  iconName: string;
  color: string;
  words: MasterWord[];
  memberPool: string[]; // Additional member nouns for spectator clue
}

export interface SpectatorWord {
  text: string;
  role: 'category' | 'letter1' | 'letter2';
  letter?: string;
  originalRoleDescription: string;
}

export interface SessionData {
  sessionNumber: number;
  masterWord: MasterWord;
  category: string;
  letterPair: string; // e.g. "HA"
  firstLetter: string;
  secondLetter: string;
  spectatorWords: SpectatorWord[];
  status: 'guessing' | 'revealed';
  userGuess: string;
  isCorrect?: boolean;
  startTime: number;
  endTime?: number;
  timedOut?: boolean;
  level: SkillLevel;
}

export interface TrainerStats {
  attempted: number;
  correct: number;
  currentStreak: number;
  bestStreak: number;
  history: Array<{
    session: number;
    masterWord: string;
    category: string;
    userGuess: string;
    correct: boolean;
    durationMs: number;
    date: string;
    level?: SkillLevel;
    timedOut?: boolean;
  }>;
}

export interface TrainerSettings {
  skillLevel: SkillLevel;
  level1Category: string; // Category ID for single category mastery
  timedDrillSeconds: number; // Countdown seconds for Level 3
  enabledCategories: string[];
  instantNextOnCorrect: boolean;
  fuzzyMatching: boolean;
  showTimer: boolean;
}
