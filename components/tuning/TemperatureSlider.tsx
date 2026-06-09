import React, { useState } from 'react';

interface TemperatureSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function TemperatureSlider({ value, onChange }: TemperatureSliderProps) {
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Temperature
          </label>
          <button
            onMouseEnter={() => setShowTip(true)}
            onMouseLeave={() => setShowTip(false)}
            onClick={() => setShowTip(!showTip)}
            className="text-text-placeholder hover:text-accent transition-colors text-xs w-4 h-4 flex items-center justify-center rounded-full border border-border-light hover:border-accent"
          >
            ?
          </button>
        </div>
        <span className="text-xs font-mono text-accent font-medium">{value.toFixed(1)}</span>
      </div>

      {showTip && (
        <div className="bg-elevated border border-border-light rounded-card p-2.5 text-[11px] text-text-secondary leading-relaxed space-y-1">
          <p>
            <strong className="text-text-primary">Temperature</strong> 控制 AI 输出的随机程度：
          </p>
          <div className="grid grid-cols-[40px_1fr] gap-x-2 gap-y-0.5">
            <span className="text-accent font-medium">0.1-0.3</span>
            <span>更确定、保守，适合精确提取标签</span>
            <span className="text-accent font-medium">0.5-0.7</span>
            <span>
              <strong>推荐</strong> — 平衡创意与稳定，日常通用
            </span>
            <span className="text-accent font-medium">0.8-1.0</span>
            <span>更有创意，适合开放性采访问题</span>
          </div>
          <p className="text-text-placeholder">当前 0.7 是通用推荐值，可根据效果微调。</p>
        </div>
      )}

      <input
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-primary cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-text-placeholder">
        <span>精确</span>
        <span>创意</span>
      </div>
    </div>
  );
}
