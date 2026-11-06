import React, { useState } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center sm:p-4">
      {/* Top Floating Viewport Device Switcher for Desktop Testing */}
      <div className="hidden sm:flex items-center gap-2 mb-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Device View:</span>
        <button
          type="button"
          onClick={() => setIsPhoneFrame(true)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all ${
            isPhoneFrame 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile Device (390px)</span>
        </button>
        <button
          type="button"
          onClick={() => setIsPhoneFrame(false)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all ${
            !isPhoneFrame 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Full Screen Responsive</span>
        </button>
      </div>

      {/* Main Container */}
      <div 
        className={`w-full transition-all duration-300 flex flex-col bg-white dark:bg-slate-900 overflow-hidden ${
          isPhoneFrame 
            ? 'max-w-[420px] h-[870px] rounded-[48px] shadow-2xl border-[10px] border-slate-900 dark:border-slate-800 relative ring-1 ring-slate-900/10'
            : 'h-screen sm:h-[94vh] sm:max-w-6xl sm:rounded-3xl sm:shadow-xl sm:border sm:border-slate-200/80 sm:dark:border-slate-800'
        }`}
      >
        {/* Simulated iOS Status Bar (in Phone Frame mode) */}
        {isPhoneFrame && (
          <div className="shrink-0 h-10 px-6 pt-2 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 select-none bg-white dark:bg-slate-900 z-40">
            <span>9:41</span>
            {/* Dynamic Island Pill */}
            <div className="w-24 h-5 rounded-full bg-black mx-auto mb-1 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800 ml-auto mr-2" />
            </div>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 w-full h-full min-h-0 flex flex-col relative overflow-hidden">
          {children}
        </div>

        {/* Simulated iOS Bottom Home Indicator Bar (in Phone Frame mode) */}
        {isPhoneFrame && (
          <div className="shrink-0 h-6 bg-white dark:bg-slate-900 flex items-center justify-center z-40">
            <div className="w-32 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          </div>
        )}
      </div>
    </div>
  );
};
