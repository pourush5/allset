import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Plane, CheckCircle2, RotateCcw, X } from 'lucide-react';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  tripTitle: string;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  onReset,
  tripTitle
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti burst!
      const end = Date.now() + 1.5 * 1000;
      const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Animated Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Plane className="w-8 h-8 rotate-[-15deg] animate-bounce" />
        </div>

        <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
          You're All Set! 🎉
        </h3>
        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
          100% of your tree items are packed
        </p>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
          Every container, bag, and essential item in <span className="font-semibold text-slate-700 dark:text-slate-200">"{tripTitle}"</span> has been ticked off. You're ready to embark!
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Ready for Departure!</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onReset();
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Checklist for Return Journey</span>
          </button>
        </div>
      </div>
    </div>
  );
};
