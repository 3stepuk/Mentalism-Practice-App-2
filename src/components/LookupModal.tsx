import React, { useState, useMemo } from 'react';
import { CategoryData } from '../types';
import { X, Search, BookOpen, Layers } from 'lucide-react';

interface LookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryData[];
  currentCategory?: string;
}

export const LookupModal: React.FC<LookupModalProps> = ({
  isOpen,
  onClose,
  categories,
  currentCategory
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>(
    () => {
      if (currentCategory) {
        const found = categories.find(c => c.name.toLowerCase() === currentCategory.toLowerCase());
        if (found) return found.id;
      }
      return categories[0]?.id || '';
    }
  );
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategory = useMemo(() => {
    return categories.find(c => c.id === selectedCatId) || categories[0];
  }, [categories, selectedCatId]);

  const filteredWords = useMemo(() => {
    if (!activeCategory) return [];
    if (!searchQuery.trim()) return activeCategory.words;
    const q = searchQuery.toLowerCase().trim();
    return activeCategory.words.filter(
      w => w.word.toLowerCase().includes(q) || w.pair.toLowerCase().includes(q)
    );
  }, [activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="lookup-reference-modal"
        className="bg-[#0f121d] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl shadow-indigo-950/40 text-slate-100 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#131724]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight font-mono text-slate-100">
                MASTER DECODE REFERENCE TABLE
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Category lookup & two-letter pair decoding grid
              </p>
            </div>
          </div>
          <button
            id="close-lookup-modal-button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Search & Category Selector */}
        <div className="p-4 sm:p-6 border-b border-slate-800/80 bg-[#0c0f18] space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="lookup-search-input"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search word or pair (e.g., SP)..."
                className="w-full bg-[#151928] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>{categories.length} Categories Loaded</span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
            {categories.map(cat => {
              const isSelected = cat.id === selectedCatId;
              return (
                <button
                  key={cat.id}
                  id={`lookup-category-tab-${cat.id}`}
                  onClick={() => {
                    setSelectedCatId(cat.id);
                    setSearchQuery('');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 shadow-sm shadow-indigo-950'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] px-1 py-0.2 bg-slate-800 text-slate-400 rounded-full">
                    {cat.words.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Word Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800/60">
            <span>CATEGORY: <strong className="text-indigo-400 uppercase">{activeCategory?.name}</strong></span>
            <span>{filteredWords.length} Words in Bank</span>
          </div>

          {filteredWords.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-sm">
              No master words match your search filter in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredWords.map((item, idx) => (
                <div
                  key={`${item.word}-${idx}`}
                  className="bg-[#141828] border border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between hover:border-indigo-500/40 transition-colors"
                >
                  <div>
                    <span className="text-sm font-semibold text-slate-200 font-mono">
                      {item.word}
                    </span>
                    <p className="text-[11px] text-slate-500 font-mono">
                      1st: {item.pair[0]} &bull; 2nd: {item.pair[1]}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 rounded-md">
                      {item.pair}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#111422] flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Tip: Check the pair in either order (e.g. SP or PS).</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close Table
          </button>
        </div>
      </div>
    </div>
  );
};
