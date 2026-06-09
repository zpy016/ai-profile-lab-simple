'use client';

import React from 'react';

interface HelpPanelProps {
  onClose: () => void;
}

export default function HelpPanel({ onClose }: HelpPanelProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-light bg-surface sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-base">💡</span>
          <span className="font-serif text-sm font-semibold text-brand-dark">系统说明</span>
        </div>
        <button
          onClick={onClose}
          className="text-text-placeholder hover:text-text-primary transition-colors text-xs px-2 py-1 rounded-btn hover:bg-elevated"
        >
          ✕ 关闭
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-text-secondary leading-relaxed">
        {/* Core Flow */}
        <div className="space-y-2">
          <p className="font-medium text-text-primary text-sm">核心流程</p>
          <ol className="list-decimal list-inside space-y-1 pl-0.5">
            <li>
              <strong className="text-text-primary">右侧 Prompt</strong> = 给 AI 的系统指令
            </li>
            <li>
              <strong className="text-text-primary">左侧输入</strong> = 给 AI 的用户输入
            </li>
            <li>
              两者拼接后通过 <code className="bg-elevated px-1 rounded text-[10px]">/api/chat</code> 发给大模型
            </li>
            <li>AI 返回结果 → 前端解析展示在左侧</li>
          </ol>
        </div>

        {/* Prompts */}
        <div className="bg-elevated rounded-card p-3 space-y-2">
          <p className="font-medium text-text-primary text-sm">4 个 Prompt 的作用</p>
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <span className="text-accent font-medium shrink-0 w-14">标签提取</span>
              <span>控制怎么拆文本块 + 提取哪些标签</span>
            </div>
            <div className="flex gap-2">
              <span className="text-accent font-medium shrink-0 w-14">简介生成</span>
              <span>控制个人简介的语气、长度、风格</span>
            </div>
            <div className="flex gap-2">
              <span className="text-accent font-medium shrink-0 w-14">采访引导</span>
              <span>控制 AI 问什么问题、怎么追问</span>
            </div>
            <div className="flex gap-2">
              <span className="text-accent font-medium shrink-0 w-14">图片生成</span>
              <span>控制概念图的风格和约束</span>
            </div>
          </div>
        </div>

        {/* Hidden Blocks */}
        <div className="bg-elevated rounded-card p-3 space-y-1.5">
          <p className="font-medium text-text-primary text-sm">Hidden 文本块</p>
          <p>工作流2（AI 采访）独有的机制。用户在对话中透露的、不想直接展示在主页上的信息：</p>
          <ul className="list-disc list-inside space-y-0.5 pl-0.5">
            <li>不在「个人主页」预览中显示</li>
            <li>但会列在右侧面板底部</li>
            <li>可被 AI 在「模拟其他同学提问」时引用</li>
          </ul>
        </div>

        {/* Tip */}
        <p className="text-text-placeholder text-[11px]">
          💡 修改任何 Prompt 后，下一次点击「生成」或「发送」立即生效，无需刷新页面。
        </p>
      </div>
    </div>
  );
}
