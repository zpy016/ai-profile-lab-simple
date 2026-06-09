import React, { useState } from 'react';
import { TextBlock } from '@/lib/types';
import Button from './Button';

const categoryLabels: Record<string, string> = {
  self_intro: '自我介绍',
  background: '历史背景',
  offer: '能提供的',
  need: '具体需求',
  custom: '自定义',
  hidden: '仅搜索可见',
};

const categoryColors: Record<string, string> = {
  self_intro: 'bg-block-self_intro',
  background: 'bg-block-background',
  offer: 'bg-block-offer',
  need: 'bg-block-need',
  custom: 'bg-block-custom',
  hidden: 'bg-accent',
};

interface ContentBlockCardProps {
  block: TextBlock;
  onUpdate?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
}

export default function ContentBlockCard({ block, onUpdate, onDelete }: ContentBlockCardProps) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(block.content);

  const handleSave = () => {
    if (editContent.trim() && onUpdate) {
      onUpdate(block.id, editContent.trim());
    }
    setEditing(false);
  };

  return (
    <div className="card card--content-block relative pl-5">
      <div className={`absolute left-1 top-4 bottom-4 w-[3px] rounded-full ${categoryColors[block.category]}`} />
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-tag ${block.category === 'hidden' ? 'text-accent bg-accent-bg border border-dashed border-accent' : 'text-text-secondary bg-elevated'}`}>
          {categoryLabels[block.category]}
        </span>
        <div className="flex items-center gap-1">
          {block.source === 'ai' && (
            <span className="text-[10px] text-accent font-medium">AI</span>
          )}
          {onUpdate && (
            <button
              onClick={() => setEditing(!editing)}
              className="text-xs text-text-secondary hover:text-primary px-1.5 py-0.5 rounded transition-colors"
            >
              {editing ? '取消' : '编辑'}
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(block.id)}
              className="text-xs text-text-secondary hover:text-error px-1.5 py-0.5 rounded transition-colors"
            >
              删除
            </button>
          )}
        </div>
      </div>
      {editing ? (
        <div className="space-y-2">
          <textarea
            className="input w-full min-h-[60px] resize-none"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => { setEditing(false); setEditContent(block.content); }}>取消</Button>
            <Button variant="primary" onClick={handleSave}>保存</Button>
          </div>
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-text-primary whitespace-pre-wrap">
          {block.content}
        </p>
      )}
    </div>
  );
}
