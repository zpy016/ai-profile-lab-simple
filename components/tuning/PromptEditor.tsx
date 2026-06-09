import React from 'react';

interface PromptEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  readOnlyPrefix?: string;
}

export default function PromptEditor({ label, value, onChange, rows = 6, readOnlyPrefix }: PromptEditorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{label}</label>
      {readOnlyPrefix && (
        <div className="text-xs text-text-placeholder bg-surface border border-border rounded-btn px-3 py-2 whitespace-pre-wrap">
          {readOnlyPrefix}
        </div>
      )}
      <textarea
        className="input w-full resize-none font-mono text-xs leading-relaxed"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
}
