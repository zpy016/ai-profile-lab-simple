'use client';

import React, { useState } from 'react';
import { AppState } from '@/lib/types';
import TuningPanel from '@/components/tuning/TuningPanel';
import HelpPanel from '@/components/help/HelpPanel';

interface MainLayoutProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  children: React.ReactNode;
}

export default function MainLayout({ state, setState, children }: MainLayoutProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [helpTab, setHelpTab] = useState<'system' | 'debug'>('system');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      <header className="h-14 bg-surface border-b border-border-light flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-xl font-semibold text-brand-dark">实验同学录</h1>
          <span className="text-xs text-text-placeholder">AI Profile POC</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setHelpTab('system');
              setShowHelp(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-medium transition-all duration-200 ${
              showHelp && helpTab === 'system'
                ? 'bg-accent text-white shadow-sm'
                : 'bg-elevated text-text-secondary hover:text-text-primary hover:bg-surface border border-border-light'
            }`}
          >
            <span>💡</span>
            <span>系统说明</span>
          </button>
          <button
            onClick={() => {
              setHelpTab('debug');
              setShowHelp(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-medium transition-all duration-200 ${
              showHelp && helpTab === 'debug'
                ? 'bg-accent text-white shadow-sm'
                : 'bg-elevated text-text-secondary hover:text-text-primary hover:bg-surface border border-border-light'
            }`}
          >
            <span>🐛</span>
            <span>调试说明</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel - User View */}
        <section
          className={`overflow-y-auto border-r border-border-light transition-all duration-300 ease-in-out ${
            showHelp ? 'w-[50%] min-w-[450px]' : 'w-[55%] min-w-[500px]'
          }`}
        >
          <div className="max-w-[800px] mx-auto p-6">{children}</div>
        </section>

        {/* Right Area - Tuning + Help */}
        <section
          className={`flex transition-all duration-300 ease-in-out ${
            showHelp ? 'w-[50%]' : 'w-[45%]'
          }`}
        >
          {/* Tuning Panel */}
          <div className="flex-1 min-w-0 overflow-y-auto bg-elevated">
            <TuningPanel state={state} setState={setState} />
          </div>

          {/* Help Panel */}
          {showHelp && (
            <div className="w-[260px] shrink-0 border-l border-border-light overflow-y-auto bg-surface animate-in slide-in-from-right duration-300">
              <HelpPanel onClose={() => setShowHelp(false)} initialTab={helpTab} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
