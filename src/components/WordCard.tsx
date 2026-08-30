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
        label: `KEY ALPHA: [ ${word.letter} ]`,
        bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        dot: 'bg-cyan-400'
      };
    }
    return {
      label: `KEY BETA: [ ${word.letter} ]`,
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-400'
    };
  };

  const badge = getBadgeContent();

  return (
    <div
      id={`word-card-${index}`}
      className={`relative group rounded-lg p-5 md:p-6 transition-all duration-300 flex flex-col justify-between border-2 font-mono ${
        revealed
          ? word.role === 'category'
            ? 'bg-[#0b1b17] border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
            : word.role === 'letter1'
            ? 'bg-[#081726] border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
            : 'bg-[#1e1509] border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
          : 'bg-[#111827] border-[#1e293b] hover:border-cyan-500/50 hover:bg-[#131d31] shadow-md shadow-black/40'
      }`}
    >
      {/* Card Header with position index */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="font-mono text-xs text-gray-500 font-bold tracking-widest uppercase">
          STREAM 0{index + 1}
        </span>
        {revealed && badge && (
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase tracking-wider ${badge.bg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot} animate-pulse`} />
            {badge.label}
          </span>
        )}
      </div>

      {/* Main Word Display */}
      <div className="my-2">
        {revealed && (word.role === 'letter1' || word.role === 'letter2') ? (
          <h3 className="text-2xl sm:text-3xl font-black tracking-widest font-mono text-white break-words uppercase">
            <span className={word.role === 'letter1' ? 'text-cyan-400 underline decoration-cyan-400 underline-offset-4' : 'text-amber-400 underline decoration-amber-400 underline-offset-4'}>
              {word.text.charAt(0)}
            </span>
            <span className="text-gray-300">{word.text.slice(1)}</span>
          </h3>
        ) : (
          <h3 className={`text-2xl sm:text-3xl font-black tracking-widest font-mono break-words uppercase ${
            revealed && word.role === 'category' ? 'text-emerald-400' : 'text-white'
          }`}>
            {word.text}
          </h3>
        )}
      </div>

      {/* Footer descriptor */}
      <div className="mt-3 pt-3 border-t border-[#1e293b] flex items-center justify-between text-[11px] text-gray-500 font-mono uppercase tracking-tight">
        <span>
          {revealed
            ? word.originalRoleDescription
            : 'Spectator Transmitted Signal'}
        </span>
        <span className="text-gray-600 select-none">
          #{index + 1}
        </span>
      </div>
    </div>
  );
};

