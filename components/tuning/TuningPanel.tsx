'use client';

import React, { useState } from 'react';
import { AppState } from '@/lib/types';
import PromptEditor from './PromptEditor';
import ModelSelector from './ModelSelector';
import TemperatureSlider from './TemperatureSlider';
import Button from '@/components/shared/Button';
import PromptManager from './PromptManager';
import TestLogManager from './TestLogManager';
import DataManager from './DataManager';

interface TuningPanelProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const promptTabs = [
  { key: 'extract', label: '标签提取', configKey: 'promptExtractTags', rows: 8 },
  { key: 'intro', label: '简介生成', configKey: 'promptGenerateIntro', rows: 5 },
  { key: 'interview', label: '采访引导', configKey: 'promptInterviewGuide', rows: 10 },
  { key: 'image', label: '图片生成', configKey: 'promptGenerateImage', rows: 8 },
] as const;

export default function TuningPanel({ state, setState }: TuningPanelProps) {
  const [activePromptTab, setActivePromptTab] = useState<(typeof promptTabs)[number]['key']>('extract');

  const updateConfig = (key: string, value: string | number) => {
    setState((prev) => ({
      ...prev,
      config: { ...prev.config, [key]: value },
    }));
  };

  const hiddenBlocks = [
    ...state.interviewBlocks.filter((b) => b.category === 'hidden'),
  ];

  const handleTestSearch = async () => {
    const question = window.prompt('模拟其他同学提问：');
    if (!question) return;
    alert('搜索验证功能待接入——需要将 hidden 文本块作为 context 调用 AI。');
  };

  const activeTabConfig = promptTabs.find((t) => t.key === activePromptTab)!;

  return (
    <div className="p-5 space-y-5">
      {/* Title */}
      <div>
        <h2 className="font-serif text-lg font-semibold text-brand-dark mb-0.5">调优面板</h2>
        <p className="text-xs text-text-secondary">调整 Prompt、模型和参数，实时观察左侧效果</p>
      </div>

      {/* Model & Temperature */}
      <div className="space-y-4">
        <ModelSelector
          value={state.config.model}
          onChange={(v) => updateConfig('model', v)}
        />
        <TemperatureSlider
          value={state.config.temperature}
          onChange={(v) => updateConfig('temperature', v)}
        />
      </div>

      {/* Prompt Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Prompt 编辑器
          </label>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-1 bg-surface rounded-btn p-1">
          {promptTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActivePromptTab(tab.key)}
              className={`flex-1 text-center py-1.5 px-1 rounded-[6px] text-[11px] font-medium transition-all duration-200 ${
                activePromptTab === tab.key
                  ? 'bg-elevated text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Prompt Editor */}
        <PromptEditor
          label={`${activeTabConfig.label} Prompt`}
          value={state.config[activeTabConfig.configKey]}
          onChange={(v) => updateConfig(activeTabConfig.configKey, v)}
          rows={activeTabConfig.rows}
        />
      </div>

      {/* Image Model Note */}
      <div className="bg-surface border border-border-light rounded-card px-3 py-2">
        <p className="text-[11px] text-text-secondary">
          图片使用火山方舟 Doubao-Seedream-5.0-lite 模型，与文字模型共用同一个 API Key。
        </p>
      </div>

      {/* Hidden Blocks Preview */}
      {hiddenBlocks.length > 0 && (
        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold text-text-primary mb-2">
            Hidden 文本块（仅 AI 搜索可见）
          </h3>
          <div className="space-y-2">
            {hiddenBlocks.map((block) => (
              <div key={block.id} className="bg-accent-bg border border-dashed border-accent rounded-btn px-3 py-2 text-xs text-text-primary">
                {block.content}
              </div>
            ))}
          </div>
          <Button variant="secondary" className="mt-3 w-full text-xs" onClick={handleTestSearch}>
            模拟其他同学提问（验证搜索引用）
          </Button>
        </div>
      )}

      {/* Prompt Manager */}
      <PromptManager
        config={state.config}
        onLoad={(newConfig) =>
          setState((prev) => ({
            ...prev,
            config: { ...prev.config, ...newConfig },
          }))
        }
      />

      {/* Test Log Manager */}
      <TestLogManager state={state} setState={setState} />

      {/* Data Manager */}
      <DataManager state={state} setState={setState} />
    </div>
  );
}
