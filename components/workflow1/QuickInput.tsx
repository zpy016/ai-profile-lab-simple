'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AppState, TextBlock, Tag } from '@/lib/types';
import Button from '@/components/shared/Button';
import TagCloud from '@/components/shared/TagCloud';
import ContentBlockCard from '@/components/shared/ContentBlockCard';

interface QuickInputProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function QuickInput({ state, setState }: QuickInputProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    autoResize();
  }, [state.quickInput]);

  const handleGenerate = async () => {
    if (!state.quickInput.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: state.config.promptExtractTags,
          userPrompt: state.quickInput,
          model: state.config.model,
          temperature: state.config.temperature,
          responseFormat: { type: 'json_object' },
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `请求失败 (${res.status})`);
      }

      const data = await res.json();
      const parsed = JSON.parse(data.content);

      const blocks: TextBlock[] = (parsed.blocks || []).map((b: any, i: number) => ({
        id: `qb-${Date.now()}-${i}`,
        category: b.category || 'custom',
        content: b.content || '',
        source: 'ai',
      }));

      const tags: Tag[] = (parsed.tags || []).map((t: any, i: number) => ({
        id: `qt-${Date.now()}-${i}`,
        text: t.text || '',
        type: t.type || 'follow',
        source: 'ai',
      }));

      setState((prev) => ({
        ...prev,
        quickBlocks: blocks,
        quickTags: tags,
        quickIntro: parsed.intro || '',
      }));
    } catch (err: any) {
      setError(err.message || 'AI 解析失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const updateBlock = (id: string, content: string) => {
    setState((prev) => ({
      ...prev,
      quickBlocks: prev.quickBlocks.map((b) => (b.id === id ? { ...b, content, source: 'user' as const } : b)),
    }));
  };

  const deleteBlock = (id: string) => {
    setState((prev) => ({
      ...prev,
      quickBlocks: prev.quickBlocks.filter((b) => b.id !== id),
    }));
  };

  const deleteTag = (id: string) => {
    setState((prev) => ({
      ...prev,
      quickTags: prev.quickTags.filter((t) => t.id !== id),
    }));
  };

  const publishToProfile = () => {
    setState((prev) => ({
      ...prev,
      profile: {
        intro: prev.quickIntro,
        tags: prev.quickTags,
        blocks: prev.quickBlocks,
      },
      activeTab: 'profile',
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-semibold text-brand-dark mb-2">快速录入</h2>
        <p className="text-sm text-text-secondary">用键盘语音输入或打字，告诉 AI 你的故事</p>
      </div>

      {/* Input Area */}
      <div className="space-y-3">
        <textarea
          ref={textareaRef}
          className={`input w-full text-base leading-relaxed min-h-[140px] resize-none overflow-hidden transition-all ${loading ? 'opacity-70' : ''}`}
          placeholder="试试用键盘语音输入，口述你的自我介绍..."
          value={state.quickInput}
          onChange={(e) => {
            setState((prev) => ({ ...prev, quickInput: e.target.value }));
          }}
          disabled={loading}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-placeholder">
            {state.quickInput.length} 字
          </span>
          <Button variant="primary" onClick={handleGenerate} disabled={loading || !state.quickInput.trim()}>
            {loading ? 'AI 解析中…' : '生成主页'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-error-surface border border-error rounded-btn px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      {/* Results */}
      {(state.quickBlocks.length > 0 || state.quickTags.length > 0 || state.quickIntro) && (
        <div className="space-y-6 border-t border-border pt-6">
          {/* Intro */}
          {state.quickIntro && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-2">简介</h3>
              <div className="bg-surface border border-border rounded-card p-4">
                <p className="text-sm leading-relaxed text-text-primary whitespace-pre-wrap">{state.quickIntro}</p>
              </div>
            </div>
          )}

          {/* Tags */}
          {state.quickTags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-2">标签</h3>
              <TagCloud tags={state.quickTags} onDelete={deleteTag} editable />
            </div>
          )}

          {/* Blocks */}
          {state.quickBlocks.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-text-primary">文本块</h3>
              {state.quickBlocks.map((block) => (
                <ContentBlockCard
                  key={block.id}
                  block={block}
                  onUpdate={updateBlock}
                  onDelete={deleteBlock}
                />
              ))}
            </div>
          )}

          <Button variant="primary" className="w-full" onClick={publishToProfile}>
            确认并发布到个人主页
          </Button>
        </div>
      )}
    </div>
  );
}
