import React from 'react';
import { X, Sparkles, Key, CheckCircle, ArrowRight } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="how-to-play-modal"
        className="bg-[#0f121d] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-indigo-950/40 text-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#131724]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight font-mono text-slate-100">
                THE MENTALISM EFFECT & DECODE RULES
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                How the three-word mental code works
              </p>
            </div>
          </div>
          <button
            id="close-howto-modal-button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-300 font-sans leading-relaxed">
          {/* Premise */}
          <div className="bg-[#141828] border border-slate-800 rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4" /> The Premise
            </h3>
            <p className="text-xs text-slate-300">
              A spectator secretly thinks of a target master word (for example, <strong className="text-slate-100">&ldquo;Hammer&rdquo;</strong>). Under the guise of a mental association procedure, they say back three words in <strong>any scrambled order</strong>:
            </p>
            <ol className="list-decimal list-inside text-xs space-y-1 text-slate-400 font-mono pl-2">
              <li><span className="text-emerald-400">Category Clue:</span> A member of the same category (e.g., &ldquo;Chisel&rdquo;).</li>
              <li><span className="text-indigo-400">1st Letter Clue:</span> A word starting with the 1st letter (e.g., &ldquo;Horizon&rdquo; &rarr; <strong>H</strong>).</li>
              <li><span className="text-amber-400">2nd Letter Clue:</span> A word starting with the 2nd letter (e.g., &ldquo;Anchor&rdquo; &rarr; <strong>A</strong>).</li>
            </ol>
          </div>

          {/* Step by Step Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Decoding Walkthrough:
            </h3>

            <div className="space-y-2.5">
              <div className="p-3 bg-[#111524] border border-slate-800/80 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-200">Spot the Category Member</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Look at the three words. Identify which one belongs to a known category (e.g., &ldquo;Chisel&rdquo; is a <strong className="text-emerald-400">Tool</strong>).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#111524] border border-slate-800/80 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-200">Extract the Remaining Letters</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Take the first letter of each of the other two words. If the words are &ldquo;Horizon&rdquo; and &ldquo;Anchor&rdquo;, the extracted letters are <strong className="text-indigo-400 font-mono">H</strong> and <strong className="text-amber-400 font-mono">A</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#111524] border border-slate-800/80 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-200">Check the Letter Pair Both Ways</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Check the letter pair both ways: <strong className="font-mono text-slate-200">HA</strong> or <strong className="font-mono text-slate-200">AH</strong> against your Tool lookup table. <strong className="font-mono text-slate-200">HA</strong> corresponds to <strong className="text-emerald-400 font-mono">Hammer</strong>!
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#111524] border border-slate-800/80 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-200">Type Your Guess</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Type your guess and hit <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[10px] text-slate-300">Enter</kbd> to reveal the answer.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="bg-[#141828] border border-slate-800 rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-400" /> Keyboard Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400">
              <div className="flex items-center justify-between p-1.5 bg-[#0f121d] rounded">
                <span>Submit / Reveal:</span>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded text-slate-200">Enter</kbd>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-[#0f121d] rounded">
                <span>Next Session:</span>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded text-slate-200">Enter or Space</kbd>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-[#0f121d] rounded">
                <span>Open Reference Table:</span>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded text-slate-200">Ref Button</kbd>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-[#0f121d] rounded">
                <span>Skip / Give Up:</span>
                <kbd className="px-2 py-0.5 bg-slate-800 rounded text-slate-200">Reveal Button</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#111422] flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-colors"
          >
            <span>Start Practicing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
