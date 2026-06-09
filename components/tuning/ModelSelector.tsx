import React from 'react';

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const models = [
  { value: 'ep-20260609201117-gcqzt', label: '实验同学录 lite (Doubao-Seed-2.0-lite)' },
  { value: 'ep-20260608013645-vmmr2', label: '实验同学录 (DeepSeek-V4-pro)' },
];

export default function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">模型</label>
      <select
        className="input w-full text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {models.map((m) => (
          <option key={m.value + m.label} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        className="input w-full text-xs font-mono"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="输入 endpoint ID"
      />
    </div>
  );
}
