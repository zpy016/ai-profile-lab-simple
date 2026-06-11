'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AppState, TextBlock, Tag, Message } from '@/lib/types';
import { createTestLog } from '@/lib/test-log-helper';
import Button from '@/components/shared/Button';
import TagCloud from '@/components/shared/TagCloud';
import ContentBlockCard from '@/components/shared/ContentBlockCard';

interface InterviewChatProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function InterviewChat({ state, setState }: InterviewChatProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const MAX_ROUNDS = 6;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.interviewMessages, loading]);

  // Initialize interview if empty (prevent double init in StrictMode)
  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    if (state.interviewMessages.length === 0 && !state.interviewEnded) {
      startInterview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startInterview = async () => {
    setLoading(true);
    const startTime = Date.now();
    const systemPrompt = state.config.promptInterviewGuide + '\n\n这是采访的第 1 轮，请开始第一个问题。';
    const userPrompt = '开始采访';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          userPrompt,
          model: state.config.model,
          temperature: state.config.temperature,
        }),
      });

      const data = await res.json();
      const parsed = JSON.parse(data.content);

      const aiMsg: Message = { role: 'assistant', content: parsed.nextQuestion || '你好！请先简单介绍一下自己吧。' };

      setState((prev) => ({
        ...prev,
        interviewMessages: [aiMsg],
        interviewRound: 1,
      }));

      createTestLog(setState, {
        workflow: 'interview-start',
        model: state.config.model,
        temperature: state.config.temperature,
        userPrompt,
        systemPrompt,
        success: true,
        rawOutput: data.content || '',
        parsedOutput: { nextQuestion: parsed.nextQuestion },
        usage: data.usage,
        latencyMs: Date.now() - startTime,
        configSnapshot: state.config,
      });
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        interviewMessages: [{ role: 'assistant', content: '你好！请先简单介绍一下自己吧。' }],
        interviewRound: 1,
      }));
      createTestLog(setState, {
        workflow: 'interview-start',
        model: state.config.model,
        temperature: state.config.temperature,
        userPrompt,
        systemPrompt,
        success: false,
        rawOutput: '',
        errorMessage: err.message || '采访初始化失败',
        latencyMs: Date.now() - startTime,
        configSnapshot: state.config,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading || state.interviewEnded) return;

    const userMsg: Message = { role: 'user', content: input.trim() };
    const newMessages = [...state.interviewMessages, userMsg];

    setState((prev) => ({ ...prev, interviewMessages: newMessages }));
    setInput('');
    setLoading(true);
    setError('');
    const startTime = Date.now();
    const historyText = newMessages.map((m) => `${m.role === 'user' ? '用户' : 'AI'}: ${m.content}`).join('\n');
    const systemPrompt = `${state.config.promptInterviewGuide}\n\n当前是第 ${state.interviewRound + 1} 轮（最多 ${MAX_ROUNDS} 轮）。\n\n历史对话：\n${historyText}`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          userPrompt: userMsg.content,
          model: state.config.model,
          temperature: state.config.temperature,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `请求失败 (${res.status})`);
      }

      const data = await res.json();
      const parsed = JSON.parse(data.content);

      const aiMsg: Message = { role: 'assistant', content: parsed.nextQuestion || '感谢你的回答！' };

      const hiddenBlocks: TextBlock[] = (parsed.hiddenBlocks || []).map((b: any, i: number) => ({
        id: `hb-${Date.now()}-${i}`,
        category: 'hidden',
        content: b.content || '',
        source: 'ai',
      }));

      const extractedTags: Tag[] = (parsed.extractedTags || []).map((t: any, i: number) => ({
        id: `it-${Date.now()}-${i}`,
        text: t.text || '',
        type: t.type || 'follow',
        source: 'ai',
      }));

      const nextRound = state.interviewRound + 1;
      const shouldEnd = nextRound >= MAX_ROUNDS;

      setState((prev) => ({
        ...prev,
        interviewMessages: [...newMessages, aiMsg],
        interviewBlocks: [...prev.interviewBlocks, ...hiddenBlocks],
        interviewTags: [...prev.interviewTags, ...extractedTags],
        interviewRound: nextRound,
        interviewIntro: parsed.introSnippet || prev.interviewIntro,
        interviewEnded: shouldEnd,
      }));

      createTestLog(setState, {
        workflow: 'interview-send',
        model: state.config.model,
        temperature: state.config.temperature,
        userPrompt: userMsg.content,
        systemPrompt,
        success: true,
        rawOutput: data.content || '',
        parsedOutput: {
          nextQuestion: parsed.nextQuestion,
          hiddenBlocks: parsed.hiddenBlocks,
          extractedTags: parsed.extractedTags,
          introSnippet: parsed.introSnippet,
        },
        usage: data.usage,
        latencyMs: Date.now() - startTime,
        configSnapshot: state.config,
      });
    } catch (err: any) {
      setError(err.message || 'AI 响应失败');
      createTestLog(setState, {
        workflow: 'interview-send',
        model: state.config.model,
        temperature: state.config.temperature,
        userPrompt: userMsg.content,
        systemPrompt,
        success: false,
        rawOutput: '',
        errorMessage: err.message || 'AI 响应失败',
        latencyMs: Date.now() - startTime,
        configSnapshot: state.config,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEndInterview = async () => {
    setLoading(true);
    const startTime = Date.now();
    const historyText = state.interviewMessages.map((m) => `${m.role === 'user' ? '用户' : 'AI'}: ${m.content}`).join('\n');
    const hiddenContext = state.interviewBlocks.filter(b => b.category === 'hidden').map(b => b.content).join('\n');
    const systemPrompt = state.config.promptExtractTags + '\n\n注意：请同时基于以下 hidden 信息提炼标签和内容块（但 hidden 内容本身不展示，仅参与提炼）。\nHidden 信息：\n' + hiddenContext;
    const userPrompt = `请根据以下采访对话，生成完整的个人主页内容：\n${historyText}`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          userPrompt,
          model: state.config.model,
          temperature: state.config.temperature,
        }),
      });

      const data = await res.json();
      const parsed = JSON.parse(data.content);

      const blocks: TextBlock[] = (parsed.blocks || []).map((b: any, i: number) => ({
        id: `ib-${Date.now()}-${i}`,
        category: b.category || 'custom',
        content: b.content || '',
        source: 'ai',
      }));

      const tags: Tag[] = (parsed.tags || []).map((t: any, i: number) => ({
        id: `it2-${Date.now()}-${i}`,
        text: t.text || '',
        type: t.type || 'follow',
        source: 'ai',
      }));

      setState((prev) => ({
        ...prev,
        interviewBlocks: [...prev.interviewBlocks.filter(b => b.category === 'hidden'), ...blocks],
        interviewTags: tags,
        interviewIntro: parsed.intro || prev.interviewIntro,
        interviewEnded: true,
      }));

      createTestLog(setState, {
        workflow: 'interview-end',
        model: state.config.model,
        temperature: state.config.temperature,
        userPrompt,
        systemPrompt,
        success: true,
        rawOutput: data.content || '',
        parsedOutput: { blocks: parsed.blocks, tags: parsed.tags, intro: parsed.intro },
        usage: data.usage,
        latencyMs: Date.now() - startTime,
        configSnapshot: state.config,
      });
    } catch (err: any) {
      setError(err.message || '生成失败');
      createTestLog(setState, {
        workflow: 'interview-end',
        model: state.config.model,
        temperature: state.config.temperature,
        userPrompt,
        systemPrompt,
        success: false,
        rawOutput: '',
        errorMessage: err.message || '生成失败',
        latencyMs: Date.now() - startTime,
        configSnapshot: state.config,
      });
    } finally {
      setLoading(false);
    }
  };

  const publishToProfile = () => {
    setState((prev) => ({
      ...prev,
      profile: {
        intro: prev.interviewIntro,
        tags: prev.interviewTags,
        blocks: prev.interviewBlocks.filter((b) => b.category !== 'hidden'),
      },
      activeTab: 'profile',
    }));
  };

  const visibleBlocks = state.interviewBlocks.filter((b) => b.category !== 'hidden');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-brand-dark mb-2">AI 采访</h2>
        <p className="text-sm text-text-secondary">跟 AI 聊天，逐步完善你的主页</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 text-xs text-text-secondary">
        <span>已进行 {state.interviewRound} / {MAX_ROUNDS} 轮</span>
        <div className="flex gap-1">
          {Array.from({ length: MAX_ROUNDS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i < state.interviewRound ? 'w-5 bg-brand-dark' : 'w-5 bg-border-light'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="bg-surface border border-border rounded-card p-4 space-y-3 min-h-[300px] max-h-[500px] overflow-y-auto">
        {state.interviewMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed rounded-card ${
                msg.role === 'user'
                  ? 'bg-primary-surface text-text-primary rounded-br-sm'
                  : 'bg-surface border border-border-light text-text-primary rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface border border-border-light rounded-card rounded-bl-sm px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!state.interviewEnded ? (
        <div className="flex gap-2">
          <textarea
            className="input flex-1 min-h-[48px] resize-none"
            placeholder="输入你的回答..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={loading}
            rows={1}
          />
          <Button variant="primary" onClick={handleSend} disabled={loading || !input.trim()}>
            发送
          </Button>
          <Button variant="secondary" onClick={handleEndInterview} disabled={loading}>
            结束采访
          </Button>
        </div>
      ) : (
        <div className="text-center text-sm text-text-secondary">
          采访已结束
        </div>
      )}

      {error && (
        <div className="bg-error-surface border border-error rounded-btn px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      {/* Results */}
      {(visibleBlocks.length > 0 || state.interviewTags.length > 0 || state.interviewIntro) && (
        <div className="space-y-6 border-t border-border pt-6">
          {state.interviewIntro && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-2">简介</h3>
              <div className="bg-surface border border-border rounded-card p-4">
                <p className="text-sm leading-relaxed text-text-primary whitespace-pre-wrap">{state.interviewIntro}</p>
              </div>
            </div>
          )}

          {state.interviewTags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-2">标签</h3>
              <TagCloud tags={state.interviewTags} editable onDelete={(id) => setState((prev) => ({ ...prev, interviewTags: prev.interviewTags.filter((t) => t.id !== id) }))} />
            </div>
          )}

          {visibleBlocks.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-text-primary">文本块</h3>
              {visibleBlocks.map((block) => (
                <ContentBlockCard
                  key={block.id}
                  block={block}
                  onUpdate={(id, content) => setState((prev) => ({
                    ...prev,
                    interviewBlocks: prev.interviewBlocks.map((b) => (b.id === id ? { ...b, content, source: 'user' } : b)),
                  }))}
                  onDelete={(id) => setState((prev) => ({
                    ...prev,
                    interviewBlocks: prev.interviewBlocks.filter((b) => b.id !== id),
                  }))}
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
