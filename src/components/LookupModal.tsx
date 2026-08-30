import React, { useState, useMemo } from 'react';
import { CategoryData } from '../types';
import { X, Search, BookOpen, Layers, Zap } from 'lucide-react';

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
  const [viewAllCategories, setViewAllCategories] = useState(false);

  const activeCategory = useMemo(() => {
    return categories.find(c => c.id === selectedCatId) || categories[0];
  }, [categories, selectedCatId]);

  const filteredWords = useMemo(() => {
    const q地下 = searchQuery.toLowerCase().trim();
    if (viewAllCategories) {
      const all: Array<{ word: string; pair: string; categoryName: string }> = [];
      categories.forEach(c => {
        c.words.forEach(w => {
          if (!q地下 || w.word.toLowerCase().includes(q地下) || w.pair.toLowerCase().includes(q地下) || c.name.toLowerCase().includes(q地下)) {
            all.push({ word: w.word, pair: w.pair, categoryName: c.name });
          }
        });
      });
      return all;
    }

    if (!activeCategory) return [];
    if (!q地下) {
      return activeCategory.words.map(w => ({ word: w.word, pair: w.pair, categoryName: activeCategory.name }));
    }
    return activeCategory.words
      .filter(w => w.word.toLowerCase().includes(q地下) || w.pair.toLowerCase().includes(q地下))
      .map(w => ({ word: w.word, pair: w.pair, categoryName: activeCategory.name }));
  }, [activeCategory, categories, searchQuery, viewAllCategories]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="lookup-reference-modal"
        className="bg-[#0a0b14] border-2 border-[#1e293b] rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-950/40 text-gray-200 overflow-hidden font-mono"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1e293b] flex items-center justify-between bg-[#0f1122]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-widest text-cyan-400 uppercase">
                  CRIB SHEET // MASTER DECODE MATRIX
                </h2>
                <span className="px-1.5 py-0.2 text-[10px] bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 rounded">
                  VANGUARD
                </span>
              </div>
              <p className="text-[11px] text-gray-500 uppercase tracking-tight">
                Rapid Category & Two-Letter Pair Cross-Reference Table
              </p>
            </div>
          </div>
          <button
            id="close-lookup-modal-button"
            onClick={onClose}
            className="p-2 rounded text-gray-400 hover:text-white hover:bg-[#1e293b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Search & Category Selector */}
        <div className="p-4 sm:p-5 border-b border-[#1e293b] bg-[#030712] space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="lookup-search-input"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search word or pair (e.g. SP, HA)..."
                className="w-full bg-[#0a0b14] border border-[#1e293b] rounded pl-9 pr-3 py-2 text-xs text-cyan-300 placeholder-gray-600 font-mono focus:outline-none focus:border-cyan-500 uppercase tracking-wider"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewAllCategories(!viewAllCategories)}
                className={`px-3 py-1.5 rounded text-xs font-mono border transition-all uppercase tracking-wider flex items-center gap-1.5 ${
                  viewAllCategories
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500'
                    : 'bg-[#111827] text-gray-400 border-[#1e293b] hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{viewAllCategories ? 'All Banks View' : 'Single Category View'}</span>
              </button>

              <span className="text-xs text-gray-500 hidden sm:inline uppercase">
                {categories.length} CATEGORIES &bull; {categories.reduce((acc, c) => acc + c.words.length, 0)} WORDS
              </span>
            </div>
          </div>

          {/* Category Tabs (if not in all categories view) */}
          {!viewAllCategories && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-800">
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
                    className={`px-3 py-1.5 rounded text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border uppercase tracking-wider ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                        : 'bg-[#0a0b14] text-gray-500 border-[#1e293b] hover:text-gray-300 hover:bg-[#111827]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] px-1 py-0.2 bg-[#1e293b] text-gray-400 rounded">
                      {cat.words.length}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Word Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#0a0b14]">
          <div className="flex items-center justify-between text-xs font-mono text-gray-500 pb-2 border-b border-[#1e293b] uppercase">
            <span>
              {viewAllCategories ? (
                <>ALL CATEGORIES <strong className="text-cyan-400 font-bold">({filteredWords.length} RESULTS)</strong></>
              ) : (
                <>CATEGORY: <strong className="text-cyan-400 font-bold">{activeCategory?.name}</strong></>
              )}
            </span>
            <span>{filteredWords.length} Words in View</span>
          </div>

          {filteredWords.length === 0 ? (
            <div className="py-12 text-center text-gray-600 font-mono text-xs uppercase tracking-wider">
              No master words match your search filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredWords.map((item, idx) => {
                const p1技巧 = item.pair[0] || '';
                const p2技巧实 = item.pair[1] || '';
                const reversed = `${p2技巧实}${p1技巧}`;
                return (
                  <div
                    key={`${item.word}-${idx}`}
                    className="bg-[#111827] border border-[#1e293b] rounded p-3.5 flex items-center justify-between hover:border-cyan-500/50 hover:bg-[#131d31] transition-all group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono uppercase tracking-wider group-hover:text-cyan-300">
                          {item.word}
                        </span>
                        {viewAllCategories && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-[#1e293b] text-gray-400 rounded uppercase">
                            {item.categoryName}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5 uppercase">
                        PAIR: <strong className="text-gray-300">{item.pair}</strong> or <strong className="text-gray-300">{reversed}</strong>
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-black px-2.5 py-1 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 rounded group-hover:bg-cyan-500/25">
                        {item.pair}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#1e293b] bg-[#0f1122] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-gray-500 uppercase tracking-tight">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-cyan-500" />
            <span>Rule: Look up category + match letter-pair in forward or reverse order</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#1e293b] hover:bg-[#283548] text-white transition-colors uppercase tracking-wider text-xs font-bold"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};

