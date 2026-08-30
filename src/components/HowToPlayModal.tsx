import React from 'react';
import { X, Sparkles, Key, CheckCircle, ArrowRight, Target, Shuffle, Timer, Zap } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="how-to-play-modal"
        className="bg-[#0a0b14] border-2 border-[#1e293b] rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-950/40 text-gray-200 overflow-hidden font-mono"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1e293b] flex items-center justify-between bg-[#0f1122]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-widest text-cyan-400 uppercase">
                  VANGUARD SIGNAL DECODING PROTOCOL
                </h2>
                <span className="px-1.5 py-0.2 text-[10px] bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 rounded">
                  DOCS
                </span>
              </div>
              <p className="text-[11px] text-gray-500 uppercase tracking-tight">
                Mentalism 3-Word Association Method & Drill Skill Levels
              </p>
            </div>
          </div>
          <button
            id="close-howto-modal-button"
            onClick={onClose}
            className="p-2 rounded text-gray-400 hover:text-white hover:bg-[#1e293b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-gray-300 leading-relaxed">
          {/* Skill Levels Section */}
          <div className="bg-[#111827] border border-[#1e293b] rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4" /> Three Progressive Skill Levels
            </h3>
            
            <div className="grid grid-cols-1 gap-2.5 text-xs">
              <div className="p-3 bg-[#0a0b14] border border-[#1e293b] rounded flex items-start gap-3">
                <div className="p-1.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shrink-0 mt-0.5">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase">Level 1: Single Category Mastery</h4>
                  <p className="text-gray-400 text-[11px] mt-0.5">
                    Drill one category exclusively (e.g. Tools, Animals, Countries) to memorize matrix lookup tables cold without category confusion.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#0a0b14] border border-[#1e293b] rounded flex items-start gap-3">
                <div className="p-1.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0 mt-0.5">
                  <Shuffle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase">Level 2: Multi-Category Pro</h4>
                  <p className="text-gray-400 text-[11px] mt-0.5">
                    Standard mixed mode. Randomizes categories every session to test rapid category identification from scrambled spectator word streams.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#0a0b14] border border-[#1e293b] rounded flex items-start gap-3">
                <div className="p-1.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0 mt-0.5">
                  <Timer className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase">Level 3: Timed Drill (Speed Run)</h4>
                  <p className="text-gray-400 text-[11px] mt-0.5">
                    Countdown pressure drill (5s, 7s, 10s, 15s). Simulates real-time performance tempo with visual timer warnings and auto-timeout.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Premise */}
          <div className="bg-[#111827] border border-[#1e293b] rounded-lg p-4 space-y-2">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <Key className="w-4 h-4" /> The Mentalism Transmission Effect
            </h3>
            <p className="text-xs text-gray-300">
              A spectator secretly thinks of a target master word (e.g. <strong className="text-white">&ldquo;Hammer&rdquo;</strong>). Under the guise of a mental association procedure, they say back three words in <strong>any scrambled order</strong>:
            </p>
            <ol className="list-decimal list-inside text-xs space-y-1.5 text-gray-400 font-mono pl-2">
              <li><span className="text-emerald-400 font-bold">[1] Category Map:</span> Member of the same category (e.g. &ldquo;Chisel&rdquo; &rarr; Tool).</li>
              <li><span className="text-cyan-400 font-bold">[2] Key Alpha:</span> Starts with 1st letter of target (e.g. &ldquo;Horizon&rdquo; &rarr; <strong>H</strong>).</li>
              <li><span className="text-amber-400 font-bold">[3] Key Beta:</span> Starts with 2nd letter of target (e.g. &ldquo;Anchor&rdquo; &rarr; <strong>A</strong>).</li>
            </ol>
          </div>

          {/* Step by Step Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-gray-200 uppercase tracking-widest">
              Decoding Walkthrough:
            </h3>

            <div className="space-y-2.5">
              <div className="p-3 bg-[#111827] border border-[#1e293b] rounded-lg flex items-start gap-3">
                <span className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5 border border-cyan-500/40">
                  1
                </span>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase">Isolate Category Member</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Look at the 3 scrambled words. Identify which word belongs to a known category pool (e.g. &ldquo;Chisel&rdquo; is a <strong className="text-emerald-400">Tool</strong>).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#111827] border border-[#1e293b] rounded-lg flex items-start gap-3">
                <span className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5 border border-cyan-500/40">
                  2
                </span>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase">Extract Letter Pair</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Take the first letter of the remaining two words: &ldquo;Horizon&rdquo; &rarr; <strong className="text-cyan-400">H</strong>, &ldquo;Anchor&rdquo; &rarr; <strong className="text-amber-400">A</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#111827] border border-[#1e293b] rounded-lg flex items-start gap-3">
                <span className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5 border border-cyan-500/40">
                  3
                </span>
                <div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase">Cross-Check Matrix Table</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Check the pair both ways: <strong className="text-white">HA</strong> or <strong className="text-white">AH</strong> under the Tool category matrix &rarr; <strong className="text-cyan-400">Hammer</strong>!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="bg-[#111827] border border-[#1e293b] rounded-lg p-4 space-y-2">
            <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400" /> Terminal Hotkeys
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-gray-400 uppercase">
              <div className="flex items-center justify-between p-2 bg-[#0a0b14] rounded border border-[#1e293b]">
                <span>Submit / Analyze:</span>
                <kbd className="px-2 py-0.5 bg-[#1e293b] rounded text-cyan-400 font-bold">Enter</kbd>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#0a0b14] rounded border border-[#1e293b]">
                <span>Next Session:</span>
                <kbd className="px-2 py-0.5 bg-[#1e293b] rounded text-cyan-400 font-bold">Enter / Space</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#1e293b] bg-[#0f1122] flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-5 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-black font-mono text-xs font-black transition-colors uppercase tracking-widest"
          >
            <span>Initialize Practice</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

