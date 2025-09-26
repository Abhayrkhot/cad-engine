import React, { useState, useEffect, useRef } from 'react'
import { init, createSquare, createTriangle, createCircle, area, perimeter, centroid, transform, createMatrix, isWasmAvailable, benchmark } from 'cad-geo-sdk'
import Canvas from './components/Canvas'
import PerformanceToggle from './components/PerformanceToggle'
import BenchmarkResults from './components/BenchmarkResults'

interface Shape {
  id: string;
  type: 'square' | 'triangle' | 'circle';
  size: number;
  base?: number;
  height?: number;
  center?: { x: number; y: number };
  radius?: number;
  transform: {
    translate: { x: number; y: number };
    rotate: number;
    scale: { x: number; y: number };
  };
}

function App() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [useWasm, setUseWasm] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [benchmarkResults, setBenchmarkResults] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const initializeEngine = async () => {
      try {
        await init();
        setIsInitialized(true);
        console.log('CAD Geometry Engine initialized');
      } catch (error) {
        console.error('Failed to initialize CAD Geometry Engine:', error);
        setIsInitialized(true); // Still allow JS fallback
      }
    };

    initializeEngine();
  }, []);

  const addShape = (type: 'square' | 'triangle' | 'circle') => {
    const id = `${type}_${Date.now()}`;
    const newShape: Shape = {
      id,
      type,
      size: 50,
      base: 60,
      height: 40,
      center: { x: 100, y: 100 },
      radius: 30,
      transform: {
        translate: { x: 0, y: 0 },
        rotate: 0,
        scale: { x: 1, y: 1 }
      }
    };
    setShapes(prev => [...prev, newShape]);
    setSelectedShape(id);
  };

  const updateShape = (id: string, updates: Partial<Shape>) => {
    setShapes(prev => prev.map(shape => 
      shape.id === id ? { ...shape, ...updates } : shape
    ));
  };

  const deleteShape = (id: string) => {
    setShapes(prev => prev.filter(shape => shape.id !== id));
    if (selectedShape === id) {
      setSelectedShape(null);
    }
  };

  const runBenchmark = async () => {
    const results = benchmark(1000);
    setBenchmarkResults(results);
  };

  const selectedShapeData = shapes.find(s => s.id === selectedShape);

  if (!isInitialized) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>CAD Geometry Engine</h1>
        <p>Initializing...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>CAD Geometry Engine Demo</h1>
      <p>Interactive geometry engine powered by Rust + WebAssembly</p>
      
      <PerformanceToggle 
        useWasm={useWasm} 
        onToggle={setUseWasm}
        isWasmAvailable={isWasmAvailable()}
      />

      <div className="controls">
        <button onClick={() => addShape('square')}>Add Square</button>
        <button onClick={() => addShape('triangle')}>Add Triangle</button>
        <button onClick={() => addShape('circle')}>Add Circle</button>
        <button onClick={runBenchmark}>Run Benchmark</button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <Canvas
            ref={canvasRef}
            shapes={shapes}
            selectedShape={selectedShape}
            onShapeSelect={setSelectedShape}
            onShapeUpdate={updateShape}
            useWasm={useWasm}
          />
        </div>

        <div style={{ flex: '0 0 300px' }}>
          {selectedShapeData && (
            <div className="stat-card">
              <h3>Selected Shape Properties</h3>
              <p><strong>Type:</strong> {selectedShapeData.type}</p>
              <p><strong>Area:</strong> {area(selectedShapeData as any).toFixed(2)}</p>
              <p><strong>Perimeter:</strong> {perimeter(selectedShapeData as any).toFixed(2)}</p>
              <p><strong>Centroid:</strong> ({centroid(selectedShapeData as any).x.toFixed(2)}, {centroid(selectedShapeData as any).y.toFixed(2)})</p>
              
              <div style={{ marginTop: '1rem' }}>
                <button onClick={() => deleteShape(selectedShapeData.id)}>
                  Delete Shape
                </button>
              </div>
            </div>
          )}

          {benchmarkResults && (
            <BenchmarkResults results={benchmarkResults} />
          )}
        </div>
      </div>

      <div className="stats">
        <div className="stat-card">
          <h3>Engine Status</h3>
          <p><strong>WASM Available:</strong> {isWasmAvailable() ? 'Yes' : 'No'}</p>
          <p><strong>Current Mode:</strong> {useWasm ? 'WASM' : 'JavaScript'}</p>
          <p><strong>Shapes:</strong> {shapes.length}</p>
        </div>

        <div className="stat-card">
          <h3>Performance</h3>
          <p>WASM provides significant performance improvements for complex geometry calculations</p>
          <p>Try running the benchmark to see the difference!</p>
        </div>
      </div>
    </div>
  );
}

export default App;
