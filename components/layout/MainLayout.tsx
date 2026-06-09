'use client';

import React from 'react';
import { AppState } from '@/lib/types';
import TuningPanel from '@/components/tuning/TuningPanel';

interface MainLayoutProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  children: React.ReactNode;
}

export default function MainLayout({ state, setState, children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      <header className="h-14 bg-surface border-b border-border-light flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-xl font-semibold text-brand-dark">实验同学录</h1>
          <span className="text-xs text-text-placeholder">AI Profile POC</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">模型: {state.config.model.slice(0, 20)}…</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel - User View */}
        <section className="w-[55%] min-w-[500px] overflow-y-auto border-r border-border-light">
          <div className="max-w-[800px] mx-auto p-6">
            {children}
          </div>
        </section>

        {/* Right Panel - Tuning Tools */}
        <section className="w-[45%] min-w-[400px] overflow-y-auto bg-elevated">
          <TuningPanel state={state} setState={setState} />
        </section>
      </main>
    </div>
  );
}
