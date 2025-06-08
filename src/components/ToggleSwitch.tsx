import React from 'react';
import './ToggleSwitch.css';

interface ToggleSwitchProps {
  isOn: boolean;
  onChange: () => void;
  leftLabel: string;
  rightLabel: string;
}

export default function ToggleSwitch({ isOn, onChange, leftLabel, rightLabel }: ToggleSwitchProps) {
  return (
    <div className="toggle-container">
      <span className="toggle-label">{leftLabel}</span>
      <label className="switch">
        <input
          type="checkbox"
          checked={isOn}
          onChange={onChange}
        />
        <span className="slider"></span>
      </label>
      <span className="toggle-label">{rightLabel}</span>
    </div>
  );
} 