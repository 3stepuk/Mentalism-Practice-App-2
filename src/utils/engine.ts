import { CategoryData, MasterWord, SessionData, SpectatorWord, TrainerSettings, TrainerStats } from '../types';
import { DEFAULT_CATEGORIES } from '../data/categories';
import { LETTER_WORDS } from '../data/letterWords';

const STATS_STORAGE_KEY = 'mentalism_trainer_stats_v1';
const CATEGORIES_STORAGE_KEY = 'mentalism_trainer_categories_v1';
const SETTINGS_STORAGE_KEY = 'mentalism_trainer_settings_v1';

export function getCategoriesFromStorage(): CategoryData[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading categories from localStorage:', err);
  }
  return DEFAULT_CATEGORIES;
}

export function saveCategoriesToStorage(categories: CategoryData[]): void {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch (err) {
    console.error('Error saving categories to localStorage:', err);
  }
}

export function resetCategoriesToDefault(): CategoryData[] {
  try {
    localStorage.removeItem(CATEGORIES_STORAGE_KEY);
  } catch (err) {
    console.error('Error resetting categories:', err);
  }
  return DEFAULT_CATEGORIES;
}

export function getStatsFromStorage(): TrainerStats {
  const defaultStats: TrainerStats = {
    attempted: 0,
    correct: 0,
    currentStreak: 0,
    bestStreak: 0,
    history: []
  };

  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaultStats,
        ...parsed,
        history: Array.isArray(parsed.history) ? parsed.history : []
      };
    }
  } catch (err) {
    console.error('Error loading stats from localStorage:', err);
  }
  return defaultStats;
}

export function saveStatsToStorage(stats: TrainerStats): void {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Error saving stats to localStorage:', err);
  }
}

export function getSettingsFromStorage(): TrainerSettings {
  const defaultSettings: TrainerSettings = {
    skillLevel: 'level2',
    level1Category: DEFAULT_CATEGORIES[0]?.id || 'tools',
    timedDrillSeconds: 10,
    enabledCategories: DEFAULT_CATEGORIES.map(c => c.id),
    instantNextOnCorrect: false,
    fuzzyMatching: true,
    showTimer: true
  };

  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaultSettings,
        ...parsed,
        skillLevel: ['level1', 'level2', 'level3'].includes(parsed.skillLevel) ? parsed.skillLevel : 'level2',
        level1Category: parsed.level1Category || defaultSettings.level1Category,
        timedDrillSeconds: typeof parsed.timedDrillSeconds === 'number' && parsed.timedDrillSeconds > 0 ? parsed.timedDrillSeconds : 10,
        enabledCategories: Array.isArray(parsed.enabledCategories) && parsed.enabledCategories.length > 0
          ? parsed.enabledCategories
          : defaultSettings.enabledCategories
      };
    }
  } catch (err) {
    console.error('Error loading settings from localStorage:', err);
  }
  return defaultSettings;
}

export function saveSettingsToStorage(settings: TrainerSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings to localStorage:', err);
  }
}

function getRandomItem<T>(array: T[]): T {
  const idx = Math.floor(Math.random() * array.length);
  return array[idx];
}

function getRandomWordForLetter(letter: string, exclude: string[]): string {
  const uppercaseLetter = letter.toUpperCase();
  const pool = LETTER_WORDS[uppercaseLetter] || ['Alpha', 'Beta', 'Gamma', 'Delta'];
  const lowerExcludes = exclude.map(e => e.toLowerCase());

  const validWords = pool.filter(w => !lowerExcludes.includes(w.toLowerCase()));
  if (validWords.length > 0) {
    return getRandomItem(validWords);
  }
  
  // Fallback if all were excluded
  return pool[0] || `${uppercaseLetter}word`;
}

export function generateSession(
  allCategories: CategoryData[],
  enabledCategoryIds: string[],
  sessionNumber: number,
  lastMasterWord?: string,
  level: 'level1' | 'level2' | 'level3' = 'level2',
  level1CategoryId?: string
): SessionData {
  let categoryToUse: CategoryData;

  if (level === 'level1' && level1CategoryId) {
    // Single Category Mastery mode
    const matched = allCategories.find(c => c.id === level1CategoryId);
    categoryToUse = matched || allCategories[0] || DEFAULT_CATEGORIES[0];
  } else {
    // Multi-Category or Timed Drill mode
    const activeCategories = allCategories.filter(cat => 
      enabledCategoryIds.length === 0 || enabledCategoryIds.includes(cat.id)
    );
    categoryToUse = activeCategories.length > 0 
      ? getRandomItem(activeCategories) 
      : (allCategories[0] || DEFAULT_CATEGORIES[0]);
  }

  // Filter master words (avoid direct immediate repetition if multiple exist)
  let candidateMasterWords = categoryToUse.words;
  if (candidateMasterWords.length > 1 && lastMasterWord) {
    candidateMasterWords = candidateMasterWords.filter(w => w.word.toLowerCase() !== lastMasterWord.toLowerCase());
    if (candidateMasterWords.length === 0) candidateMasterWords = categoryToUse.words;
  }

  const master = getRandomItem(candidateMasterWords);
  const letter1 = master.pair[0] || master.word[0].toUpperCase();
  const letter2 = master.pair[1] || (master.word[1] ? master.word[1].toUpperCase() : 'X');

  // 1. Choose Category Member Word (different from master)
  const categoryPool = [
    ...(categoryToUse.memberPool || []),
    ...categoryToUse.words.map(w => w.word)
  ].filter(w => w.toLowerCase() !== master.word.toLowerCase());

  const categoryClueWord = categoryPool.length > 0 
    ? getRandomItem(categoryPool) 
    : `${categoryToUse.name} Item`;

  // 2. Choose Word starting with 1st letter
  const word1 = getRandomWordForLetter(letter1, [master.word, categoryClueWord]);

  // 3. Choose Word starting with 2nd letter
  const word2 = getRandomWordForLetter(letter2, [master.word, categoryClueWord, word1]);

  // Construct spectator words
  const spectatorWords: SpectatorWord[] = [
    {
      text: categoryClueWord,
      role: 'category',
      originalRoleDescription: `Category Clue (${categoryToUse.name})`
    },
    {
      text: word1,
      role: 'letter1',
      letter: letter1,
      originalRoleDescription: `1st Letter Clue (${letter1})`
    },
    {
      text: word2,
      role: 'letter2',
      letter: letter2,
      originalRoleDescription: `2nd Letter Clue (${letter2})`
    }
  ];

  // Shuffle order randomly so position reveals nothing
  for (let i = spectatorWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [spectatorWords[i], spectatorWords[j]] = [spectatorWords[j], spectatorWords[i]];
  }

  return {
    sessionNumber,
    masterWord: master,
    category: categoryToUse.name,
    letterPair: `${letter1}${letter2}`,
    firstLetter: letter1,
    secondLetter: letter2,
    spectatorWords,
    status: 'guessing',
    userGuess: '',
    startTime: Date.now(),
    level
  };
}

function levenshtein(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = new Array<number[]>(bn + 1);
  for (let i = 0; i <= bn; ++i) {
    let row = matrix[i] = new Array<number>(an + 1);
    row[0] = i;
  }
  const firstRow = matrix[0];
  for (let j = 1; j <= an; ++j) {
    firstRow[j] = j;
  }
  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }
  return matrix[bn][an];
}

export function validateGuess(
  userGuess: string,
  targetWord: string,
  targetPair: string,
  enableFuzzy = true
): boolean {
  const cleanGuess = userGuess.trim().toLowerCase();
  const cleanTarget = targetWord.trim().toLowerCase();
  const cleanPair = targetPair.trim().toLowerCase();

  if (!cleanGuess) return false;

  // Exact word or exact letter-pair match
  if (cleanGuess === cleanTarget || cleanGuess === cleanPair) {
    return true;
  }

  // Handle plural / singular / common suffixes (e.g. "Drums" vs "Drum")
  if (cleanGuess.replace(/s$/, '') === cleanTarget.replace(/s$/, '')) {
    return true;
  }

  // Fuzzy match for minor typos (e.g. "Cheeta" vs "Cheetah", "Screwdriwer")
  if (enableFuzzy && cleanTarget.length >= 4) {
    const dist = levenshtein(cleanGuess, cleanTarget);
    if (dist <= 1) return true;
    if (cleanTarget.length >= 8 && dist <= 2) return true;
  }

  return false;
}
