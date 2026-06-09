'use client';

import React, { useState, useEffect } from 'react';
import { AppState } from '@/lib/types';
import { loadState, saveState, getInitialState } from '@/lib/storage';
import MainLayout from '@/components/layout/MainLayout';
import QuickInput from '@/components/workflow1/QuickInput';
import InterviewChat from '@/components/workflow2/InterviewChat';
import ProfilePreview from '@/components/profile/ProfilePreview';

const tabs = [
  { key: 'quick' as const, label: '快速录入', desc: '输入一段话，AI 生成主页' },
  { key: 'interview' as const, label: 'AI 采访', desc: '对话式引导，挖掘深层标签' },
  { key: 'profile' as const, label: '个人主页', desc: '预览最终效果' },
];

export default function HomePage() {
  const [state, setState] = useState<AppState>(getInitialState);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadState();
    setState(saved);
    setHydrated(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (hydrated) {
      saveState(state);
    }
  }, [state, hydrated]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 mx-auto border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-secondary">加载中…</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout state={state} setState={setState}>
      {/* Tab Switcher */}
      <div className="flex gap-1 bg-elevated rounded-card p-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setState((prev) => ({ ...prev, activeTab: tab.key }))}
            className={`flex-1 text-center py-2.5 px-3 rounded-btn text-sm font-medium transition-all duration-200 ${
              state.activeTab === tab.key
                ? 'bg-surface text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <div>{tab.label}</div>
            <div className={`text-[10px] mt-0.5 ${state.activeTab === tab.key ? 'text-text-secondary' : 'text-text-placeholder'}`}>
              {tab.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {state.activeTab === 'quick' && <QuickInput state={state} setState={setState} />}
      {state.activeTab === 'interview' && <InterviewChat state={state} setState={setState} />}
      {state.activeTab === 'profile' && <ProfilePreview state={state} setState={setState} />}
    </MainLayout>
  );
}
