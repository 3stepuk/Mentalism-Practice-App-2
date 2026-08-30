import React, { useState } from 'react';
import { CategoryData, TrainerSettings, SkillLevel } from '../types';
import { X, Sliders, CheckSquare, Square, RotateCcw, Plus, Trash2, Download, Upload, Check, Target, Shuffle, Timer, Zap } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryData[];
  settings: TrainerSettings;
  onUpdateSettings: (newSettings: TrainerSettings) => void;
  onUpdateCategories: (newCategories: CategoryData[]) => void;
  onResetCategories: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  categories,
  settings,
  onUpdateSettings,
  onUpdateCategories,
  onResetCategories
}) => {
  const [activeTab, setActiveTab] = useState<'levels' | 'categories' | 'editWords' | 'preferences'>('levels');
  const [selectedCatIdForEdit, setSelectedCatIdForEdit] = useState<string>(categories[0]?.id || '');
  const [newWord, setNewWord] = useState('');
  const [newPair, setNewPair] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleCategory = (catId: string) => {
    let nextEnabled: string[];
    if (settings.enabledCategories.includes(catId)) {
      if (settings.enabledCategories.length === 1) {
        return; // Don't allow disabling all categories
      }
      nextEnabled = settings.enabledCategories.filter(id => id !== catId);
    } else {
      nextEnabled = [...settings.enabledCategories, catId];
    }
    onUpdateSettings({ ...settings, enabledCategories: nextEnabled });
  };

  const selectAllCategories = () => {
    onUpdateSettings({ ...settings, enabledCategories: categories.map(c => c.id) });
  };

  const currentEditCat = categories.find(c => c.id === selectedCatIdForEdit) || categories[0];

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newPair.trim()) return;

    const formattedWord = newWord.trim().charAt(0).toUpperCase() + newWord.trim().slice(1);
    const formattedPair = newPair.trim().slice(0, 2).toUpperCase();

    const updated = categories.map(cat => {
      if (cat.id === currentEditCat.id) {
        if (cat.words.some(w => w.word.toLowerCase() === formattedWord.toLowerCase())) {
          return cat;
        }
        return {
          ...cat,
          words: [...cat.words, { word: formattedWord, pair: formattedPair, category: cat.name }]
        };
      }
      return cat;
    });

    onUpdateCategories(updated);
    setNewWord('');
    setNewPair('');
  };

  const handleRemoveWord = (wordToRemove: string) => {
    const updated = categories.map(cat => {
      if (cat.id === currentEditCat.id) {
        return {
          ...cat,
          words: cat.words.filter(w => w.word !== wordToRemove)
        };
      }
      return cat;
    });
    onUpdateCategories(updated);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(categories, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "vanguard_word_banks.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].words) {
            onUpdateCategories(parsed);
            onUpdateSettings({ ...settings, enabledCategories: parsed.map(c => c.id) });
            alert("Custom word bank matrix imported successfully!");
          } else {
            setImportError("Invalid word bank schema.");
          }
        } catch (err) {
          setImportError("Failed to parse JSON matrix file.");
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200 font-mono">
      <div 
        id="settings-terminal-modal"
        className="bg-[#0a0b14] border-2 border-[#1e293b] rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-950/40 text-gray-200 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1e293b] flex items-center justify-between bg-[#0f1122]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-widest text-cyan-400 uppercase">
                  DRILL CONFIGURATION & SKILL MATRIX
                </h2>
                <span className="px-1.5 py-0.2 text-[10px] bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 rounded">
                  SYS.CFG
                </span>
              </div>
              <p className="text-[11px] text-gray-500 uppercase tracking-tight">
                Skill Levels, Active Banks, Timers & Dictionaries
              </p>
            </div>
          </div>
          <button
            id="close-settings-modal-button"
            onClick={onClose}
            className="p-2 rounded text-gray-400 hover:text-white hover:bg-[#1e293b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#1e293b] bg-[#030712] px-6 overflow-x-auto">
          <button
            id="settings-tab-levels"
            onClick={() => setActiveTab('levels')}
            className={`py-3 px-4 font-mono text-xs font-bold border-b-2 whitespace-nowrap transition-colors uppercase tracking-wider ${
              activeTab === 'levels'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            Skill Levels ({settings.skillLevel.toUpperCase()})
          </button>
          <button
            id="settings-tab-categories"
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-4 font-mono text-xs font-bold border-b-2 whitespace-nowrap transition-colors uppercase tracking-wider ${
              activeTab === 'categories'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            Category Pools ({settings.enabledCategories.length}/{categories.length})
          </button>
          <button
            id="settings-tab-wordbanks"
            onClick={() => setActiveTab('editWords')}
            className={`py-3 px-4 font-mono text-xs font-bold border-b-2 whitespace-nowrap transition-colors uppercase tracking-wider ${
              activeTab === 'editWords'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            Word Bank Editor
          </button>
          <button
            id="settings-tab-preferences"
            onClick={() => setActiveTab('preferences')}
            className={`py-3 px-4 font-mono text-xs font-bold border-b-2 whitespace-nowrap transition-colors uppercase tracking-wider ${
              activeTab === 'preferences'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            Preferences & Backup
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0a0b14]">
          {/* SKILL LEVELS TAB */}
          {activeTab === 'levels' && (
            <div className="space-y-6">
              <div className="pb-2 border-b border-[#1e293b]">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Select Active Drill Skill Level
                </h3>
                <p className="text-[11px] text-gray-500 mt-1 uppercase">
                  Target your training focus to isolate weaknesses or train under performance conditions:
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Level 1 Card */}
                <div 
                  onClick={() => onUpdateSettings({ ...settings, skillLevel: 'level1' })}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    settings.skillLevel === 'level1'
                      ? 'bg-[#081726] border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'bg-[#111827] border-[#1e293b] hover:border-gray-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Level 1: Single Category Mastery</h4>
                          {settings.skillLevel === 'level1' && (
                            <span className="px-1.5 py-0.5 bg-cyan-500 text-black text-[10px] font-black rounded uppercase">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Drill one category repeatedly to memorize matrix lookups cold without category ambiguity.
                        </p>
                      </div>
                    </div>
                  </div>

                  {settings.skillLevel === 'level1' && (
                    <div className="mt-4 pt-3 border-t border-cyan-900/60 flex flex-wrap items-center gap-3">
                      <span className="text-xs text-cyan-300 font-bold uppercase">Focus Category:</span>
                      <select
                        value={settings.level1Category || categories[0]?.id}
                        onChange={e => onUpdateSettings({ ...settings, level1Category: e.target.value })}
                        className="bg-[#030712] border border-cyan-500/60 rounded px-3 py-1.5 text-xs text-cyan-300 uppercase tracking-wider focus:outline-none"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name.toUpperCase()} ({c.words.length} words)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Level 2 Card */}
                <div 
                  onClick={() => onUpdateSettings({ ...settings, skillLevel: 'level2' })}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    settings.skillLevel === 'level2'
                      ? 'bg-[#081726] border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'bg-[#111827] border-[#1e293b] hover:border-gray-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        <Shuffle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Level 2: Multi-Category Pro</h4>
                          {settings.skillLevel === 'level2' && (
                            <span className="px-1.5 py-0.5 bg-emerald-500 text-black text-[10px] font-black rounded uppercase">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Standard mixed mode. Randomizes categories dynamically across enabled word banks.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Level 3 Card */}
                <div 
                  onClick={() => onUpdateSettings({ ...settings, skillLevel: 'level3' })}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    settings.skillLevel === 'level3'
                      ? 'bg-[#081726] border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'bg-[#111827] border-[#1e293b] hover:border-gray-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                        <Timer className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Level 3: Timed Drill (Countdown Speed Run)</h4>
                          {settings.skillLevel === 'level3' && (
                            <span className="px-1.5 py-0.5 bg-amber-500 text-black text-[10px] font-black rounded uppercase">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          High-intensity countdown timer drill. Trains instant reflex recognition under spectator performance tempo.
                        </p>
                      </div>
                    </div>
                  </div>

                  {settings.skillLevel === 'level3' && (
                    <div className="mt-4 pt-3 border-t border-cyan-900/60 flex flex-wrap items-center gap-3">
                      <span className="text-xs text-amber-400 font-bold uppercase">Countdown Limit:</span>
                      <div className="flex items-center gap-2">
                        {[5, 7, 10, 15, 20].map(sec => (
                          <button
                            key={sec}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateSettings({ ...settings, timedDrillSeconds: sec });
                            }}
                            className={`px-3 py-1 rounded text-xs font-bold font-mono transition-all uppercase ${
                              (settings.timedDrillSeconds || 10) === sec
                                ? 'bg-amber-500 text-black border border-amber-400'
                                : 'bg-[#030712] text-gray-400 border border-[#1e293b] hover:text-white'
                            }`}
                          >
                            {sec}s
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CATEGORIES TAB */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
                <p className="text-xs text-gray-400 uppercase">
                  Toggle categories to focus your decoding drills on specific sets:
                </p>
                <button
                  onClick={selectAllCategories}
                  className="text-xs text-cyan-400 hover:underline uppercase font-bold"
                >
                  Select All Banks
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map(cat => {
                  const isEnabled = settings.enabledCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      id={`toggle-category-${cat.id}`}
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-3.5 rounded border flex items-center justify-between text-left transition-all ${
                        isEnabled
                          ? 'bg-[#111827] border-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                          : 'bg-[#0a0b14] border-[#1e293b] text-gray-600 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isEnabled ? (
                          <CheckSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-600 shrink-0" />
                        )}
                        <span className="text-xs font-bold uppercase">{cat.name}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#1e293b] text-gray-400">
                        {cat.words.length}w
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* WORD BANK EDITOR TAB */}
          {activeTab === 'editWords' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase">
                  Select Category to Edit:
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-800">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCatIdForEdit(cat.id)}
                      className={`px-3 py-1.5 rounded text-xs whitespace-nowrap transition-colors border uppercase tracking-wider font-bold ${
                        selectedCatIdForEdit === cat.id
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                          : 'bg-[#111827] border-[#1e293b] text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {cat.name} ({cat.words.length})
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Word Form */}
              <form onSubmit={handleAddWord} className="bg-[#111827] border border-[#1e293b] rounded-lg p-4 space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 uppercase">
                  Add Master Word to &ldquo;{currentEditCat.name}&rdquo;
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newWord}
                    onChange={e => {
                      const w = e.target.value;
                      setNewWord(w);
                      if (w.length >= 2 && !newPair) {
                        setNewPair(w.slice(0, 2).toUpperCase());
                      }
                    }}
                    placeholder="Word (e.g. Sledgehammer)"
                    className="bg-[#0a0b14] border border-[#1e293b] rounded px-3 py-2 text-xs text-cyan-300 uppercase focus:outline-none focus:border-cyan-500"
                  />
                  <input
                    type="text"
                    maxLength={2}
                    value={newPair}
                    onChange={e => setNewPair(e.target.value.toUpperCase())}
                    placeholder="2-Letter Pair (e.g. SL)"
                    className="bg-[#0a0b14] border border-[#1e293b] rounded px-3 py-2 text-xs text-cyan-300 uppercase focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-black rounded transition-colors uppercase tracking-wider"
                  >
                    <Plus className="w-4 h-4" /> Add Word
                  </button>
                </div>
              </form>

              {/* Word List for Selected Category */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 uppercase">
                  <span>Current Words in {currentEditCat.name}:</span>
                  <span>{currentEditCat.words.length} items</span>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                  {currentEditCat.words.map(w => (
                    <div
                      key={w.word}
                      className="flex items-center justify-between px-3 py-2 rounded bg-[#111827] border border-[#1e293b] text-xs uppercase"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white">{w.word}</span>
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
                          {w.pair}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveWord(w.word)}
                        className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Remove word"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PREFERENCES & BACKUP TAB */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Preferences Checklist */}
              <div className="space-y-3 bg-[#111827] border border-[#1e293b] rounded-lg p-4">
                <h4 className="text-xs font-bold text-cyan-400 mb-2 uppercase tracking-wider">
                  Terminal Options
                </h4>
                
                <label className="flex items-center justify-between cursor-pointer py-1">
                  <div>
                    <span className="text-xs text-white block uppercase">Fuzzy Typo Tolerance</span>
                    <span className="text-[11px] text-gray-500">Accept single-letter typing typos automatically</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.fuzzyMatching}
                    onChange={e => onUpdateSettings({ ...settings, fuzzyMatching: e.target.checked })}
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer py-1 border-t border-[#1e293b] pt-2">
                  <div>
                    <span className="text-xs text-white block uppercase">Session Stopwatch / Timer</span>
                    <span className="text-[11px] text-gray-500">Track and display seconds taken to decode session</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showTimer}
                    onChange={e => onUpdateSettings({ ...settings, showTimer: e.target.checked })}
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                </label>
              </div>

              {/* Data Import/Export */}
              <div className="space-y-3 bg-[#111827] border border-[#1e293b] rounded-lg p-4">
                <h4 className="text-xs font-bold text-cyan-400 mb-2 uppercase tracking-wider">
                  Word Bank Backup & Export
                </h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleExportJSON}
                    className="flex items-center gap-1.5 px-3 py-2 rounded bg-[#1e293b] hover:bg-[#283548] text-xs text-white transition-colors uppercase tracking-wider font-bold"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Export Word Matrix (JSON)</span>
                  </button>

                  <label className="flex items-center gap-1.5 px-3 py-2 rounded bg-[#1e293b] hover:bg-[#283548] text-xs text-white cursor-pointer transition-colors uppercase tracking-wider font-bold">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Import Word Matrix (JSON)</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="hidden"
                    />
                  </label>
                </div>
                {copiedNotification && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1 uppercase">
                    <Check className="w-3.5 h-3.5" /> Word bank matrix saved to your device!
                  </p>
                )}
                {importError && (
                  <p className="text-xs text-red-400 uppercase">
                    {importError}
                  </p>
                )}
              </div>

              {/* Reset Categories */}
              <div className="pt-2 border-t border-[#1e293b] flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-300 block uppercase font-bold">Restore Factory Word Banks</span>
                  <span className="text-[11px] text-gray-600">Revert all 16 categories and 370+ words to defaults</span>
                </div>
                <button
                  onClick={() => {
                    if (confirm("Reset all word banks to the default dictionary? Custom additions will be cleared.")) {
                      onResetCategories();
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-950/40 border border-red-800/40 text-red-400 text-xs hover:bg-red-900/40 transition-colors uppercase font-bold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Factory Defaults</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#1e293b] bg-[#0f1122] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-black font-mono text-xs font-black transition-colors uppercase tracking-widest"
          >
            Apply & Save
          </button>
        </div>
      </div>
    </div>
  );
};

