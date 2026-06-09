'use client';

import React, { useState } from 'react';
import { AppState } from '@/lib/types';
import PromptEditor from './PromptEditor';
import ModelSelector from './ModelSelector';
import TemperatureSlider from './TemperatureSlider';
import Button from '@/components/shared/Button';

interface TuningPanelProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function TuningPanel({ state, setState }: TuningPanelProps) {
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

  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* Help Section */}
      <div className="bg-surface border border-border rounded-card p-4">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">💡</span>
            <span className="font-serif text-sm font-semibold text-brand-dark">这个系统是怎么工作的？</span>
          </div>
          <span className="text-text-secondary text-xs">{showHelp ? '收起' : '展开'}</span>
        </button>

        {showHelp && (
          <div className="mt-3 pt-3 border-t border-border-light space-y-3 text-xs text-text-secondary leading-relaxed">
            <div className="space-y-2">
              <p className="font-medium text-text-primary">核心流程（所有工作流通用）：</p>
              <ol className="list-decimal list-inside space-y-1 pl-1">
                <li>你在<strong>右侧 Prompt 编辑器</strong>里写的文字 = 给 AI 的「系统指令」</li>
                <li>用户在<strong>左侧输入框</strong>里写的文字 = 给 AI 的「用户输入」</li>
                <li>两者拼接后，通过 <code className="bg-elevated px-1 rounded text-[10px]">/api/chat</code> 发给火山方舟大模型</li>
                <li>AI 返回结果 → 前端解析展示在左侧</li>
              </ol>
            </div>

            <div className="bg-elevated rounded-btn p-3 space-y-1.5">
              <p className="font-medium text-text-primary">4 个 Prompt 分别控制什么：</p>
              <div className="grid grid-cols-[80px_1fr] gap-x-2 gap-y-1">
                <span className="text-accent font-medium">标签提取</span>
                <span>控制 AI 怎么把一段话拆成文本块 + 提取哪些标签</span>
                <span className="text-accent font-medium">简介生成</span>
                <span>控制 AI 怎么写个人简介（语气、长度、风格）</span>
                <span className="text-accent font-medium">采访引导</span>
                <span>控制 AI 采访用户时问什么问题、怎么追问</span>
                <span className="text-accent font-medium">图片生成</span>
                <span>控制 AI 生成概念图的风格和约束</span>
              </div>
            </div>

            <div className="bg-elevated rounded-btn p-3 space-y-1.5">
              <p className="font-medium text-text-primary">Hidden 文本块是什么？</p>
              <p>工作流2（AI 采访）独有的机制。用户在对话中透露的、不想直接展示在主页上的信息（如真实诉求、敏感背景）。这些信息：</p>
              <ul className="list-disc list-inside space-y-0.5 pl-1">
                <li>不在「个人主页」预览中显示</li>
                <li>但会列在右侧面板底部</li>
                <li>可以被 AI 在「模拟其他同学提问」时引用</li>
              </ul>
            </div>

            <p className="text-text-placeholder">💡 修改右侧任何 Prompt 后，下一次用户点击「生成」或「发送」就会立即生效，不需要刷新页面。</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="font-serif text-lg font-semibold text-brand-dark mb-1">调优面板</h2>
        <p className="text-xs text-text-secondary">调整 Prompt、模型和参数，实时观察左侧效果</p>
      </div>

      <div className="space-y-5">
        <ModelSelector
          value={state.config.model}
          onChange={(v) => updateConfig('model', v)}
        />

        <TemperatureSlider
          value={state.config.temperature}
          onChange={(v) => updateConfig('temperature', v)}
        />

        <PromptEditor
          label="标签提取 & 内容分块 Prompt"
          value={state.config.promptExtractTags}
          onChange={(v) => updateConfig('promptExtractTags', v)}
          rows={8}
        />

        <PromptEditor
          label="简介生成 Prompt"
          value={state.config.promptGenerateIntro}
          onChange={(v) => updateConfig('promptGenerateIntro', v)}
          rows={5}
        />

        <PromptEditor
          label="采访引导 Prompt"
          value={state.config.promptInterviewGuide}
          onChange={(v) => updateConfig('promptInterviewGuide', v)}
          rows={10}
        />

        <div className="border-t border-border pt-5">
          <h3 className="text-sm font-semibold text-brand-dark mb-3">图片生成配置</h3>
          <p className="text-xs text-text-secondary mb-3">
            使用火山方舟 Doubao-Seedream-5.0-lite 模型，与文字模型共用同一个 API Key。
          </p>
          <PromptEditor
            label="图片生成 Prompt"
            value={state.config.promptGenerateImage}
            onChange={(v) => updateConfig('promptGenerateImage', v)}
            rows={8}
          />
        </div>
      </div>

      {/* Hidden Blocks Preview */}
      {hiddenBlocks.length > 0 && (
        <div className="border-t border-border pt-5">
          <h3 className="text-sm font-semibold text-text-primary mb-3">
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
    </div>
  );
}
