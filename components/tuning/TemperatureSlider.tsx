import React from 'react';

interface TemperatureSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function TemperatureSlider({ value, onChange }: TemperatureSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Temperature</label>
        <span className="text-xs font-mono text-accent font-medium">{value.toFixed(1)}</span>
      </div>
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
