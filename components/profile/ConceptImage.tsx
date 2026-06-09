'use client';

import React, { useState } from 'react';
import Button from '@/components/shared/Button';

interface ConceptImageProps {
  profileContext: { intro: string; tags: { text: string }[] };
  imagePrompt: string;
}

export default function ConceptImage({ profileContext, imagePrompt }: ConceptImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    const contextText = `用户简介：${profileContext.intro}\n标签：${profileContext.tags.map((t) => t.text).join('、')}`;
    const fullPrompt = `${imagePrompt}\n\n${contextText}`;

    try {
      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `生图失败 (${res.status})`);
      }

      const data = await res.json();
      setImageUrl(data.url);
    } catch (err: any) {
      setError(err.message || '生图失败');
    } finally {
      setLoading(false);
    }
  };

  if (imageUrl) {
    return (
      <div className="relative w-full aspect-video rounded-card overflow-hidden border border-border">
        <img src={imageUrl} alt="概念印象图" className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
          <p className="text-xs text-white/80">AI 生成概念图 · 24小时内有效</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-gradient-to-br from-block-background/30 via-accent/20 to-block-offer/30 rounded-card border border-border flex flex-col items-center justify-center relative overflow-hidden">
      {/* Abstract geometric shapes */}
      <div className="absolute inset-0 opacity-30">
        <svg viewBox="0 0 400 225" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B8A9C9" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#9BB5C4" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="g2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A8BF9A" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#C49A6C" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <circle cx="80" cy="60" r="50" fill="url(#g1)" />
          <rect x="250" y="40" width="80" height="80" rx="8" fill="url(#g2)" transform="rotate(15 290 80)" />
          <polygon points="200,160 260,220 140,220" fill="#C49A6C" opacity="0.15" />
          <circle cx="320" cy="170" r="35" fill="#B8A9C9" opacity="0.2" />
          <rect x="60" y="140" width="60" height="60" rx="30" fill="#A8BF9A" opacity="0.15" />
          <line x1="0" y1="112" x2="400" y2="112" stroke="#E8E4DE" strokeWidth="1" opacity="0.5" />
          <line x1="200" y1="0" x2="200" y2="225" stroke="#E8E4DE" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>

      <div className="text-center z-10 space-y-3">
        <p className="text-sm text-text-placeholder font-serif">印象图占位</p>
        <p className="text-xs text-text-disabled">抽象概念图 · 基于简介和标签生成</p>
        {error && (
          <p className="text-xs text-error max-w-[280px]">{error}</p>
        )}
        <Button variant="secondary" onClick={handleGenerate} disabled={loading} className="text-xs">
          {loading ? '生成中…' : '生成概念图'}
        </Button>
      </div>
    </div>
  );
}
