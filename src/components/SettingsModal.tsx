import React, { useState } from 'react';
import { CategoryData, TrainerSettings } from '../types';
import { X, Sliders, CheckSquare, Square, RotateCcw, Plus, Trash2, Download, Upload, Check } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'categories' | 'editWords' | 'preferences'>('categories');
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
        // Prevent duplicate word
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
    downloadAnchor.setAttribute("download", "mentalism_word_banks.json");
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
            alert("Custom word bank imported successfully!");
          } else {
            setImportError("Invalid word bank format.");
          }
        } catch (err) {
          setImportError("Failed to parse JSON file.");
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="settings-terminal-modal"
        className="bg-[#0f121d] border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl shadow-indigo-950/40 text-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#131724]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight font-mono text-slate-100">
                TRAINER CONFIGURATION & WORD BANKS
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Customize training categories and word dictionary
              </p>
            </div>
          </div>
          <button
            id="close-settings-modal-button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-[#0c0f18] px-6">
          <button
            id="settings-tab-categories"
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-4 font-mono text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'categories'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Active Categories ({settings.enabledCategories.length}/{categories.length})
          </button>
          <button
            id="settings-tab-wordbanks"
            onClick={() => setActiveTab('editWords')}
            className={`py-3 px-4 font-mono text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'editWords'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Word Bank Editor
          </button>
          <button
            id="settings-tab-preferences"
            onClick={() => setActiveTab('preferences')}
            className={`py-3 px-4 font-mono text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'preferences'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Preferences & Backup
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <p className="text-xs text-slate-400 font-mono">
                  Toggle categories to focus your decoding drills on specific sets:
                </p>
                <button
                  onClick={selectAllCategories}
                  className="text-xs font-mono text-indigo-400 hover:underline"
                >
                  Select All
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
                      className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                        isEnabled
                          ? 'bg-[#151929] border-indigo-500/50 text-slate-100 shadow-sm'
                          : 'bg-[#0f121d] border-slate-800/80 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isEnabled ? (
                          <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                        <span className="font-mono text-xs font-semibold">{cat.name}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-400">
                        {cat.words.length}w
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'editWords' && (
            <div className="space-y-6">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">
                  Select Category to Edit:
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCatIdForEdit(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors border ${
                        selectedCatIdForEdit === cat.id
                          ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/60'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cat.name} ({cat.words.length})
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Word Form */}
              <form onSubmit={handleAddWord} className="bg-[#141827] border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-300">
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
                    placeholder="Word (e.g., Sledgehammer)"
                    className="bg-[#0f121d] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    maxLength={2}
                    value={newPair}
                    onChange={e => setNewPair(e.target.value.toUpperCase())}
                    placeholder="2-Letter Pair (e.g., SL)"
                    className="bg-[#0f121d] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 uppercase focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Word
                  </button>
                </div>
              </form>

              {/* Word List for Selected Category */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Current Words in {currentEditCat.name}:</span>
                  <span>{currentEditCat.words.length} items</span>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                  {currentEditCat.words.map(w => (
                    <div
                      key={w.word}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#141827] border border-slate-800/80 text-xs font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-200">{w.word}</span>
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                          {w.pair}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveWord(w.word)}
                        className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Preferences Checklist */}
              <div className="space-y-3 bg-[#141827] border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-mono font-bold text-slate-300 mb-2">
                  Drill Terminal Options
                </h4>
                
                <label className="flex items-center justify-between cursor-pointer py-1">
                  <div>
                    <span className="text-xs font-mono text-slate-200 block">Fuzzy Typo Tolerance</span>
                    <span className="text-[11px] text-slate-400 font-mono">Accept single-letter typos in fast typing</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.fuzzyMatching}
                    onChange={e => onUpdateSettings({ ...settings, fuzzyMatching: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer py-1 border-t border-slate-800/80 pt-2">
                  <div>
                    <span className="text-xs font-mono text-slate-200 block">Session Stopwatch</span>
                    <span className="text-[11px] text-slate-400 font-mono">Track seconds taken to decode</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showTimer}
                    onChange={e => onUpdateSettings({ ...settings, showTimer: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded"
                  />
                </label>
              </div>

              {/* Data Import/Export */}
              <div className="space-y-3 bg-[#141827] border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-mono font-bold text-slate-300 mb-2">
                  Word Bank Backup & Restore
                </h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleExportJSON}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition-colors"
                  >
                    <Download className="w-4 h-4 text-indigo-400" />
                    <span>Export Word Bank (JSON)</span>
                  </button>

                  <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Import Word Bank (JSON)</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="hidden"
                    />
                  </label>
                </div>
                {copiedNotification && (
                  <p className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Word bank downloaded to your computer!
                  </p>
                )}
                {importError && (
                  <p className="text-xs font-mono text-red-400">
                    {importError}
                  </p>
                )}
              </div>

              {/* Reset Categories */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-slate-300 block">Reset Word Banks</span>
                  <span className="text-[11px] font-mono text-slate-500">Restore factory 16 categories & 370+ words</span>
                </div>
                <button
                  onClick={() => {
                    if (confirm("Reset all word banks to the default dictionary? Custom additions will be cleared.")) {
                      onResetCategories();
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-800/40 text-red-300 text-xs font-mono hover:bg-red-900/40 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Factory Defaults</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#111422] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
