import React from 'react';

interface PerformanceToggleProps {
  useWasm: boolean;
  onToggle: (useWasm: boolean) => void;
  isWasmAvailable: boolean;
}

const PerformanceToggle: React.FC<PerformanceToggleProps> = ({
  useWasm,
  onToggle,
  isWasmAvailable
}) => {
  return (
    <div className="performance-toggle">
      <span>Use WASM:</span>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={useWasm && isWasmAvailable}
          onChange={(e) => onToggle(e.target.checked)}
          disabled={!isWasmAvailable}
        />
        <span className="slider"></span>
      </label>
      <span>
        {!isWasmAvailable ? 'WASM not available' : useWasm ? 'WASM' : 'JavaScript'}
      </span>
    </div>
  );
};

export default PerformanceToggle;
