import React from 'react';
import { Tag } from '@/lib/types';

const tagTypeStyles: Record<string, string> = {
  belong: 'bg-block-background text-[#4A3F5C]',
  offer: 'bg-block-offer text-[#3D5A2F]',
  need: 'bg-block-need text-[#6B5234]',
  follow: 'bg-block-custom text-[#3A5A6B]',
};

interface TagCloudProps {
  tags: Tag[];
  onDelete?: (id: string) => void;
  editable?: boolean;
}

export default function TagCloud({ tags, onDelete, editable = false }: TagCloudProps) {
  if (tags.length === 0) {
    return (
      <div className="flex flex-wrap gap-2">
        {['属于', '提供', '需要', '关注'].map((text, i) => {
          const colors = ['border-block-background', 'border-block-offer', 'border-block-need', 'border-block-custom'];
          return (
            <span key={i} className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold border border-dashed ${colors[i]} text-text-placeholder rounded-tag`}>
              {text}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag.id}
          className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-tag ${tagTypeStyles[tag.type] || tagTypeStyles.follow}`}
        >
          {tag.text}
          {editable && onDelete && (
            <button
              onClick={() => onDelete(tag.id)}
              className="ml-0.5 w-3.5 h-3.5 inline-flex items-center justify-center rounded-full hover:bg-error hover:text-white text-current opacity-60 hover:opacity-100 transition-all"
            >
              ×
            </button>
          )}
        </span>
      ))}
    </div>
  );
}
