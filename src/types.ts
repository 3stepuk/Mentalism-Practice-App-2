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
  }>;
}

export interface TrainerSettings {
  enabledCategories: string[];
  instantNextOnCorrect: boolean;
  fuzzyMatching: boolean;
  showTimer: boolean;
}
