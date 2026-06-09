'use client';

import React from 'react';
import { AppState } from '@/lib/types';
import TagCloud from '@/components/shared/TagCloud';
import ContentBlockCard from '@/components/shared/ContentBlockCard';
import ConceptImage from './ConceptImage';

interface ProfilePreviewProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function ProfilePreview({ state, setState }: ProfilePreviewProps) {
  const { profile } = state;
  const isEmpty = !profile.intro && profile.tags.length === 0 && profile.blocks.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-brand-dark mb-2">个人主页预览</h2>
        <p className="text-sm text-text-secondary">这是其他校友将看到的页面</p>
      </div>

      {isEmpty ? (
        <div className="text-center py-16 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-elevated flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-placeholder">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <p className="font-serif text-base text-text-placeholder">你的故事，将由 AI 与你一起书写</p>
          <p className="text-xs text-text-disabled">先完成「快速录入」或「AI 采访」来创建主页</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Concept Image */}
          <ConceptImage
            profileContext={{ intro: profile.intro, tags: profile.tags }}
            imagePrompt={state.config.promptGenerateImage}
          />

          {/* Name / Title */}
          <div className="text-center">
            <h3 className="font-serif text-2xl font-semibold text-text-primary">实验中学 2006 届校友</h3>
            <p className="text-sm text-text-secondary mt-1">AI 生成档案</p>
          </div>

          {/* Intro */}
          {profile.intro ? (
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-accent/30" />
              <div className="pl-4">
                <p className="text-base leading-[1.8] text-text-primary whitespace-pre-wrap font-serif">
                  {profile.intro}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="h-px bg-accent/20 my-3" />
              <p className="font-serif text-sm text-text-placeholder">简介待补充</p>
              <div className="h-px bg-accent/20 my-3" />
            </div>
          )}

          {/* Tags */}
          <div>
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">标签</h4>
            <TagCloud tags={profile.tags} />
          </div>

          {/* Blocks */}
          {profile.blocks.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">详细内容</h4>
              {profile.blocks.map((block) => (
                <ContentBlockCard key={block.id} block={block} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
