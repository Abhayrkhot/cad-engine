import React from 'react';

interface BenchmarkResultsProps {
  results: {
    wasm: number;
    js: number;
    ratio: number;
  };
}

const BenchmarkResults: React.FC<BenchmarkResultsProps> = ({ results }) => {
  const formatTime = (time: number) => `${time.toFixed(2)}ms`;
  const formatRatio = (ratio: number) => `${ratio.toFixed(2)}x`;

  return (
    <div className="benchmark-results">
      <h3>Benchmark Results (1000 iterations)</h3>
      
      <div className="result wasm">
        <span>WASM Performance:</span>
        <span>{formatTime(results.wasm)}</span>
      </div>
      
      <div className="result js">
        <span>JavaScript Performance:</span>
        <span>{formatTime(results.js)}</span>
      </div>
      
      <div className="result">
        <span>Speed Improvement:</span>
        <span>{formatRatio(results.ratio)}</span>
      </div>
      
      <div style={{ marginTop: '1rem', fontSize: '0.9em', color: '#888' }}>
        {results.ratio > 1 ? (
          <p>✅ WASM is {formatRatio(results.ratio)} faster than JavaScript</p>
        ) : (
          <p>⚠️ JavaScript is faster in this case (WASM overhead for small operations)</p>
        )}
      </div>
    </div>
  );
};

export default BenchmarkResults;
