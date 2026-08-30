import React from 'react';
import { SpectatorWord } from '../types';

interface WordCardProps {
  word: SpectatorWord;
  index: number;
  revealed: boolean;
}

export const WordCard: React.FC<WordCardProps> = ({ word, index, revealed }) => {
  const getBadgeContent = () => {
    if (!revealed) return null;
    if (word.role === 'category') {
      return {
        label: 'CATEGORY CLUE',
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        dot: 'bg-emerald-400'
      };
    }
    if (word.role === 'letter1') {
      return {
        label: `LETTER 1: [ ${word.letter} ]`,
        bg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
        dot: 'bg-indigo-400'
      };
    }
    return {
      label: `LETTER 2: [ ${word.letter} ]`,
      bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      dot: 'bg-amber-400'
    };
  };

  const badge = getBadgeContent();

  return (
    <div
      id={`word-card-${index}`}
      className={`relative group rounded-xl p-5 md:p-6 transition-all duration-300 flex flex-col justify-between border ${
        revealed
          ? word.role === 'category'
            ? 'bg-[#101928]/90 border-emerald-500/40 shadow-lg shadow-emerald-950/30'
            : word.role === 'letter1'
            ? 'bg-[#141530]/90 border-indigo-500/40 shadow-lg shadow-indigo-950/30'
            : 'bg-[#201815]/90 border-amber-500/40 shadow-lg shadow-amber-950/30'
          : 'bg-[#121624] border-slate-800/90 hover:border-indigo-500/50 hover:bg-[#161b2e] shadow-md shadow-black/40'
      }`}
    >
      {/* Card Header with position index */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="font-mono text-xs text-slate-500 font-semibold tracking-wider">
          WORD 0{index + 1}
        </span>
        {revealed && badge && (
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${badge.bg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot} animate-pulse`} />
            {badge.label}
          </span>
        )}
      </div>

      {/* Main Word Display */}
      <div className="my-2">
        {revealed && (word.role === 'letter1' || word.role === 'letter2') ? (
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight font-mono text-slate-100 break-words">
            <span className={word.role === 'letter1' ? 'text-indigo-400 underline decoration-indigo-500 underline-offset-4' : 'text-amber-400 underline decoration-amber-500 underline-offset-4'}>
              {word.text.charAt(0)}
            </span>
            <span>{word.text.slice(1)}</span>
          </h3>
        ) : (
          <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight font-mono break-words ${
            revealed && word.role === 'category' ? 'text-emerald-300' : 'text-slate-100'
          }`}>
            {word.text}
          </h3>
        )}
      </div>

      {/* Footer descriptor */}
      <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 font-mono">
        <span className="text-slate-500">
          {revealed
            ? word.originalRoleDescription
            : 'Spectator Clue'}
        </span>
        <span className="text-slate-600 select-none">
          #{index + 1}
        </span>
      </div>
    </div>
  );
};
