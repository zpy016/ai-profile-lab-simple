'use client';

import React, { useState } from 'react';
import { AppState, DEFAULT_CONFIG } from '@/lib/types';
import Button from '@/components/shared/Button';

interface DataManagerProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function DataManager({ state, setState }: DataManagerProps) {
  const [message, setMessage] = useState('');

  const resetUserData = () => {
    if (!window.confirm('确定要重置所有用户数据吗？\n\n这会清空：\n- 快速录入的输入和生成结果\n- AI 采访的对话和生成结果\n- 已发布的个人主页\n\n提示词配置不会被重置。')) return;

    setState((prev) => ({
      ...prev,
      quickInput: '',
      quickBlocks: [],
      quickTags: [],
      quickIntro: '',
      interviewMessages: [],
      interviewBlocks: [],
      interviewTags: [],
      interviewIntro: '',
      interviewRound: 0,
      interviewEnded: false,
      profile: { intro: '', tags: [], blocks: [] },
    }));
    setMessage('✅ 用户数据已重置');
    setTimeout(() => setMessage(''), 2000);
  };

  const resetPrompts = () => {
    if (!window.confirm('确定要恢复默认提示词吗？\n\n这会把你自定义的 Prompt、模型、temperature 全部恢复为系统默认值。\n\n用户生成的数据不会被删除。')) return;

    setState((prev) => ({ ...prev, config: DEFAULT_CONFIG }));
    setMessage('✅ 提示词已恢复为默认');
    setTimeout(() => setMessage(''), 2000);
  };

  const resetAll = () => {
    if (!window.confirm('确定要清空所有数据吗？\n\n这会同时重置：\n- 所有用户数据（输入、生成结果、个人主页）\n- 所有提示词配置\n\n此操作不可撤销。')) return;

    setState((prev) => ({
      ...prev,
      config: DEFAULT_CONFIG,
      quickInput: '',
      quickBlocks: [],
      quickTags: [],
      quickIntro: '',
      interviewMessages: [],
      interviewBlocks: [],
      interviewTags: [],
      interviewIntro: '',
      interviewRound: 0,
      interviewEnded: false,
      profile: { intro: '', tags: [], blocks: [] },
    }));
    setMessage('✅ 所有数据已清空');
    setTimeout(() => setMessage(''), 2000);
  };

  const hasUserData =
    state.quickInput ||
    state.quickBlocks.length > 0 ||
    state.quickTags.length > 0 ||
    state.quickIntro ||
    state.interviewMessages.length > 0 ||
    state.interviewBlocks.length > 0 ||
    state.interviewTags.length > 0 ||
    state.interviewIntro ||
    state.profile.blocks.length > 0 ||
    state.profile.tags.length > 0 ||
    state.profile.intro;

  return (
    <div className="border-t border-border pt-4 space-y-3">
      <h3 className="text-sm font-semibold text-text-primary">🗑️ 数据管理</h3>

      <div className="space-y-2">
        <Button
          variant="danger"
          className="w-full text-xs py-1.5"
          onClick={resetUserData}
          disabled={!hasUserData}
        >
          🧹 重置用户数据
        </Button>
        <Button variant="danger" className="w-full text-xs py-1.5" onClick={resetPrompts}>
          🔄 恢复默认提示词
        </Button>
        <Button variant="danger" className="w-full text-xs py-1.5" onClick={resetAll}>
          💥 清空所有数据
        </Button>
      </div>

      {message && (
        <div className="text-xs text-center py-1 px-2 rounded bg-surface border border-border-light text-text-primary">
          {message}
        </div>
      )}
    </div>
  );
}
