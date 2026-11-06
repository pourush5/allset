import React from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { JOURNEY_PRESETS } from '../utils/presets';
import type { JourneyPreset } from '../utils/presets';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: JourneyPreset) => void;
  currentRootId: string;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
  currentRootId
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Pre-Journey Templates
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Choose a pre-structured packing tree
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Presets */}
        <div className="p-4 space-y-3 overflow-y-auto">
          {JOURNEY_PRESETS.map((preset) => {
            const isCurrent = preset.tree.id === currentRootId;

            return (
              <div
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0">
                      {preset.icon}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {preset.name}
                        {isCurrent && (
                          <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {preset.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-slate-400 shrink-0 pt-1">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
          Selecting a template will replace current items.
        </div>
      </div>
    </div>
  );
};
