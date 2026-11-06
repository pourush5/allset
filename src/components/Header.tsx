import React, { useState } from 'react';
import { 
  Compass, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RotateCcw, 
  Search, 
  X, 
  GitFork, 
  ListTree, 
  FolderPlus,
  CheckCircle2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import type { TreeStats, ViewMode, FilterMode } from '../types/tree';

interface HeaderProps {
  tripTitle: string;
  stats: TreeStats;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filter: FilterMode;
  onFilterChange: (filter: FilterMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenPresets: () => void;
  onResetAll: () => void;
  onAddContainer: () => void;
  onToggleExpandAll: (expand: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  tripTitle,
  stats,
  viewMode,
  onViewModeChange,
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  soundEnabled,
  onToggleSound,
  onOpenPresets,
  onResetAll,
  onAddContainer,
  onToggleExpandAll
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleExpandToggle = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    onToggleExpandAll(nextState);
  };

  return (
    <header className="shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 shadow-sm z-30">
      {/* Top Bar: Logo, Trip Name, Utility Icons */}
      <div className="px-4 pt-3.5 pb-2.5 flex items-center justify-between gap-3">
        {/* Brand & Trip Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Compass className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-wider uppercase bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AllSet
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Pre-Journey Tree
              </span>
            </div>
            <h1 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate leading-tight">
              {tripTitle}
            </h1>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Add Container Button */}
          <button
            type="button"
            onClick={onAddContainer}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 hover:bg-blue-100 font-semibold text-xs transition-colors"
            title="Add new container or bag node"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Add Bag</span>
          </button>

          {/* Expand/Collapse All Button */}
          <button
            type="button"
            onClick={handleExpandToggle}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isExpanded ? 'Collapse All' : 'Expand All'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Search Toggle Button */}
          <button
            type="button"
            onClick={() => setShowSearch(s => !s)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Search items"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Presets Modal Button */}
          <button
            type="button"
            onClick={onOpenPresets}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Trip Templates"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={soundEnabled ? 'Mute Sounds' : 'Enable Sound FX'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Reset All / Confirm */}
          {showResetConfirm ? (
            <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/40 p-1 rounded-xl border border-red-200 dark:border-red-900/60 text-xs">
              <button
                type="button"
                onClick={() => {
                  onResetAll();
                  setShowResetConfirm(false);
                }}
                className="px-2 py-0.5 rounded-lg bg-red-600 text-white font-semibold text-[11px]"
              >
                Reset All?
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Reset all checkboxes for next journey"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Section */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-slate-100">{stats.percent}%</span>
            <span>Packed</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-500 dark:text-slate-400">
              {stats.leafCompleted} of {stats.leafTotal} items
            </span>
          </div>

          <div className="text-slate-500 dark:text-slate-400 text-[11px]">
            {stats.remaining === 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All packed!
              </span>
            ) : (
              <span><strong className="text-slate-800 dark:text-slate-200">{stats.remaining}</strong> left to pack</span>
            )}
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden p-0.5">
          <div 
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              stats.percent === 100 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/50' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
            }`}
            style={{ width: `${Math.min(Math.max(stats.percent, 0), 100)}%` }}
          />
        </div>
      </div>

      {/* View Switcher & Filter Controls Row */}
      <div className="px-4 py-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
        {/* Segmented View Mode Switcher */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <button
            type="button"
            onClick={() => onViewModeChange('visual-tree')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'visual-tree'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <GitFork className="w-3.5 h-3.5 rotate-90" />
            <span>Visual Tree</span>
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('outline-tree')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'outline-tree'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ListTree className="w-3.5 h-3.5" />
            <span>Checklist</span>
          </button>
        </div>

        {/* Filter Chips: All | Unpacked | Packed */}
        <div className="flex items-center gap-1 text-xs">
          {(['all', 'unpacked', 'packed'] as FilterMode[]).map((mode) => {
            const isSelected = filter === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => onFilterChange(mode)}
                className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-all ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {mode === 'unpacked' ? 'Unpacked Only' : mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* Expandable Search Input (if opened or query present) */}
      {showSearch || searchQuery ? (
        <div className="px-4 pb-2.5 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search items in tree (e.g. passport, charger)..."
              className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setShowSearch(false);
              onSearchChange('');
            }}
            className="text-xs text-slate-500 font-medium px-2 py-1"
          >
            Done
          </button>
        </div>
      ) : null}
    </header>
  );
};
