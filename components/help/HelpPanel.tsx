'use client';

import React, { useState } from 'react';

interface HelpPanelProps {
  onClose: () => void;
  initialTab?: 'system' | 'debug';
}

export default function HelpPanel({ onClose, initialTab = 'system' }: HelpPanelProps) {
  const [tab, setTab] = useState<'system' | 'debug'>(initialTab);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-light bg-surface sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-base">{tab === 'system' ? '💡' : '🐛'}</span>
          <span className="font-serif text-sm font-semibold text-brand-dark">
            {tab === 'system' ? '系统说明' : '调试说明'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-text-placeholder hover:text-text-primary transition-colors text-xs px-2 py-1 rounded-btn hover:bg-elevated"
        >
          ✕ 关闭
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-border-light bg-surface">
        <button
          onClick={() => setTab('system')}
          className={`flex-1 py-2 text-[11px] font-medium transition-colors ${
            tab === 'system'
              ? 'text-primary border-b-2 border-accent'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          💡 系统说明
        </button>
        <button
          onClick={() => setTab('debug')}
          className={`flex-1 py-2 text-[11px] font-medium transition-colors ${
            tab === 'debug'
              ? 'text-primary border-b-2 border-accent'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          🐛 调试说明
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-text-secondary leading-relaxed">
        {tab === 'system' ? (
          <>
            {/* Quick Start */}
            <div className="space-y-2">
              <p className="font-medium text-text-primary text-sm">🚀 快速开始</p>
              <p>这个工具帮你把一段自我介绍或一段对话，转换成结构化的个人主页。</p>
              <ol className="list-decimal list-inside space-y-1 pl-0.5">
                <li>在<strong className="text-text-primary">左侧</strong>输入你的故事（或跟 AI 聊天）</li>
                <li>在<strong className="text-text-primary">右侧</strong>调整 Prompt 和模型参数</li>
                <li>点击<strong className="text-text-primary">生成主页 / 发送</strong>，AI 会解析并返回结构化内容</li>
                <li>满意后点击<strong className="text-text-primary">确认并发布到个人主页</strong>，在「个人主页」标签预览</li>
              </ol>
            </div>

            {/* Two Workflows */}
            <div className="bg-elevated rounded-card p-3 space-y-2">
              <p className="font-medium text-text-primary text-sm">🔄 两种工作流</p>
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <span className="text-accent font-medium shrink-0">快速录入</span>
                  <span>适合一次性写完整自我介绍。把文字粘贴进去，点「生成主页」即可。</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-accent font-medium shrink-0">AI 采访</span>
                  <span>适合边聊边整理。AI 会一步步提问，帮你挖掘深层信息。</span>
                </div>
              </div>
            </div>

            {/* Tuning Panel */}
            <div className="bg-elevated rounded-card p-3 space-y-2">
              <p className="font-medium text-text-primary text-sm">🎛️ 调优面板（右侧）</p>
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <span className="text-accent font-medium shrink-0">模型</span>
                  <span>选择预设模型或粘贴火山方舟 endpoint ID</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-accent font-medium shrink-0">Temperature</span>
                  <span>越低越稳定，越高越有创意。建议调试时先保持 0.7</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-accent font-medium shrink-0">4 个 Prompt</span>
                  <span>分别控制标签提取、简介生成、采访引导、图片生成风格</span>
                </div>
              </div>
              <p className="text-text-placeholder text-[11px]">💡 修改 Prompt 后，下一次点击「生成」或「发送」立即生效。</p>
            </div>

            {/* Prompt Manager */}
            <div className="bg-elevated rounded-card p-3 space-y-2">
              <p className="font-medium text-text-primary text-sm">🎛️ 提示词管理</p>
              <p>位于右侧面板底部，用来保存和分享你调好的 Prompt 配置：</p>
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <span className="text-accent font-medium shrink-0">💾</span>
                  <span><strong>保存到云端</strong>：把当前 Prompt + 模型参数保存到服务器，所有人可见</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-accent font-medium shrink-0">📂</span>
                  <span><strong>从云端加载</strong>：查看并使用别人保存的 Prompt 配置</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-accent font-medium shrink-0">⬇️</span>
                  <span><strong>下载到本地</strong>：导出 JSON 文件，可离线传给别人</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-accent font-medium shrink-0">⬆️</span>
                  <span><strong>从本地上传</strong>：加载别人发来的 JSON 文件</span>
                </div>
              </div>
            </div>

            {/* Data Manager */}
            <div className="bg-elevated rounded-card p-3 space-y-2">
              <p className="font-medium text-text-primary text-sm">🗑️ 数据管理</p>
              <p>位于右侧面板最底部，用来一键清理数据重新开始：</p>
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <span className="text-accent font-medium shrink-0">🧹</span>
                  <span><strong>重置用户数据</strong>：清空左侧所有生成结果和个人主页，保留 Prompt 配置</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-accent font-medium shrink-0">🔄</span>
                  <span><strong>恢复默认提示词</strong>：把 Prompt 恢复为系统默认值，保留用户数据</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-accent font-medium shrink-0">💥</span>
                  <span><strong>清空所有数据</strong>：同时重置用户数据和 Prompt 配置</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Test Logs */}
            <div className="bg-elevated rounded-card p-3 space-y-2">
              <p className="font-medium text-text-primary text-sm">📊 测试日志</p>
              <p>每次点击「生成主页」或 AI 采访的「发送」时，系统自动记录一次完整的 API 调用过程，包括：</p>
              <ul className="list-disc list-inside space-y-0.5 pl-0.5">
                <li>时间、用户输入、<strong>提示词快照</strong>、AI 输出</li>
                <li>Token 用量（prompt / completion / total）</li>
                <li>请求耗时、成功/失败状态</li>
              </ul>
              <p>测试日志位于右侧面板底部，你可以：</p>
              <div className="space-y-1.5 pt-1">
                <div className="flex gap-2">
                  <span className="text-accent font-medium shrink-0">💾</span>
                  <span><strong>保存到云端</strong>：批量保存本地日志到服务器</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-accent font-medium shrink-0">📂</span>
                  <span><strong>从云端加载</strong>：查看他人分享的日志集</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-accent font-medium shrink-0">📥</span>
                  <span><strong>下载 CSV</strong>：导出表格，便于 Excel 统计</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-accent font-medium shrink-0">📄</span>
                  <span><strong>下载 Markdown</strong>：导出完整记录，便于 AI 分析</span>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="bg-elevated rounded-card p-3 space-y-1.5">
              <p className="font-medium text-text-primary text-sm">🤖 用 AI 分析日志</p>
              <ol className="list-decimal list-inside space-y-1 pl-0.5">
                <li>多次测试后，点击「下载 Markdown」</li>
                <li>把 .md 文件发给 Claude/GPT/其他 AI</li>
                <li>让它分析："为什么这次的输出不够好？"、"哪个 Prompt 版本效果更好？"</li>
              </ol>
            </div>

            {/* Hidden Blocks */}
            <div className="bg-elevated rounded-card p-3 space-y-1.5">
              <p className="font-medium text-text-primary text-sm">🫥 Hidden 文本块</p>
              <p>AI 采访独有的机制。用户在对话中透露的、不想直接展示在主页上的信息：</p>
              <ul className="list-disc list-inside space-y-0.5 pl-0.5">
                <li>不会出现在「个人主页」预览中</li>
                <li>会列在右侧面板底部</li>
                <li>可被 AI 在「模拟其他同学提问」时引用</li>
              </ul>
            </div>

            {/* Privacy & Collaboration */}
            <div className="bg-elevated rounded-card p-3 space-y-1.5">
              <p className="font-medium text-text-primary text-sm">🔒 协作与隐私</p>
              <ul className="list-disc list-inside space-y-0.5 pl-0.5">
                <li>云端保存的提示词和日志默认对所有人可见</li>
                <li>在「从云端加载」列表中，鼠标悬停到某条记录上会出现「删除」按钮</li>
                <li>删除仅移除服务器上的云端记录，不影响你的本地数据</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
