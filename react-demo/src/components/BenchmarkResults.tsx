import React from 'react';

interface BenchmarkResultsProps {
  results: {
    [key: string]: { wasm: number; js: number; ratio: number };
  };
}

const BenchmarkResults: React.FC<BenchmarkResultsProps> = ({ results }) => {
  console.log('BenchmarkResults received:', results);
  
  const formatTime = (time: number) => `${time.toFixed(2)}ms`;
  const formatRatio = (ratio: number) => `${ratio.toFixed(2)}x`;

  const renderBenchmarkSection = (title: string, data: { wasm: number; js: number; ratio: number }, description?: string) => (
    <div className="benchmark-section">
      <div className="benchmark-header">
        <h4 className="benchmark-title">{title}</h4>
        {description && <p className="benchmark-description">{description}</p>}
      </div>
      
      <div className="benchmark-metrics">
        <div className="metric-row">
          <div className="metric-label">
            <span>WASM</span>
          </div>
          <div className="metric-value wasm">
            {formatTime(data.wasm)}
          </div>
        </div>
        
        <div className="metric-row">
          <div className="metric-label">
            <span>JavaScript</span>
          </div>
          <div className="metric-value js">
            {formatTime(data.js)}
          </div>
        </div>
        
        <div className="metric-row performance">
          <div className="metric-label">
            <span>Speed Ratio</span>
          </div>
          <div className={`metric-value ratio ${data.ratio > 1 ? 'faster' : 'slower'}`}>
            {formatRatio(data.ratio)}x
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompactBenchmarkSection = (title: string, data: { wasm: number; js: number; ratio: number }) => (
    <div className="benchmark-section compact">
      <div className="benchmark-header">
        <h4 className="benchmark-title">{title}</h4>
      </div>
      
      <div className="benchmark-metrics compact">
        <div className="metric-row compact">
          <span className="metric-label">WASM:</span>
          <span className="metric-value wasm">{formatTime(data.wasm)}</span>
        </div>
        
        <div className="metric-row compact">
          <span className="metric-label">JS:</span>
          <span className="metric-value js">{formatTime(data.js)}</span>
        </div>
        
        <div className="metric-row compact performance">
          <span className="metric-label">Ratio:</span>
          <span className={`metric-value ratio ${data.ratio > 1 ? 'faster' : 'slower'}`}>
            {formatRatio(data.ratio)}x
          </span>
        </div>
      </div>
    </div>
  );

  // Get all benchmark entries
  const benchmarkEntries = Object.entries(results || {});
  
  // Check if this is an extreme benchmark
  const isExtremeBenchmark = results?.millionRotations || results?.hundredThousandRotations;
  const isRealWorldBenchmark = results?.heavyComputation || results?.memoryIntensive || results?.batchProcessing;
  
  // If no results, show a message
  if (benchmarkEntries.length === 0) {
    return (
      <div className="benchmark-results">
        <div className="benchmark-header">
          <h3 className="benchmark-main-title">Performance Benchmark</h3>
        </div>
        <div className="benchmark-content">
          <p>No benchmark results available. Click "Run Benchmarks" to start.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="benchmark-results">
      <div className="benchmark-header">
        <h3 className="benchmark-main-title">
          {isExtremeBenchmark 
            ? 'WASM-Optimized Performance Benchmark (10K Operations)' 
            : isRealWorldBenchmark 
            ? 'Real-World Benchmark Results (100 iterations)' 
            : 'Performance Benchmark Results (10K iterations)'
          }
        </h3>
      </div>
      
      <div className="benchmark-content">
        {benchmarkEntries.map(([key, data]) => {
          let title = key;
          // Format the title nicely
          if (key === 'small') title = 'Small Polygon (4 vertices)';
          else if (key === 'medium') title = 'Medium Polygon (4 vertices)';
          else if (key === 'large') title = 'Large Polygon (100 vertices)';
          else if (key === 'complex') title = 'Complex Polygon (100-sided)';
          else if (key === 'heavyComputation') title = 'Heavy Computation';
          else if (key === 'memoryIntensive') title = 'Memory Intensive';
          else if (key === 'batchProcessing') title = 'Batch Processing';
          else if (key === 'millionRotations') title = 'Mathematical Computation';
          else if (key === 'hundredThousandRotations') title = 'Memory Operations';
          
          return renderCompactBenchmarkSection(title, data);
        })}
      </div>
      
      <div className="benchmark-footer">
        {isExtremeBenchmark ? (
          <div className="benchmark-info">
            <div className="info-item">
              <span>WASM-optimized scenarios (10K operations)</span>
            </div>
            <div className="info-item">
              <span>Designed to favor WASM's compiled performance</span>
            </div>
          </div>
        ) : isRealWorldBenchmark ? (
          <div className="benchmark-info">
            <div className="info-item">
              <span>Real-world scenarios where WASM excels</span>
            </div>
            <div className="info-item">
              <span>Heavy computation and memory operations</span>
            </div>
          </div>
        ) : (
          <div className="benchmark-info">
            <div className="info-item">
              <span>WASM excels with larger, more complex polygons</span>
            </div>
            <div className="info-item">
              <span>Tests area, perimeter, and centroid calculations</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BenchmarkResults;