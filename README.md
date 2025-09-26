# CAD Geometry Engine

A cross-platform CAD geometry engine built with Rust, WebAssembly, TypeScript, and React. This project demonstrates high-performance geometry calculations with a clean, modern web interface.

## 🚀 Features

- **Rust Core**: High-performance geometry calculations with linear algebra
- **WebAssembly**: Compile Rust to WASM for near-native performance in browsers
- **TypeScript SDK**: Clean, typed API with JavaScript fallback
- **React Demo**: Interactive web application with real-time geometry manipulation
- **Performance Comparison**: Benchmark WASM vs JavaScript performance

## 🏗️ Architecture

```
cad-geometry-engine/
├── rust-core/           # Rust geometry engine
├── typescript-sdk/      # TypeScript wrapper with JS fallback
├── react-demo/         # Interactive React application
└── package.json        # Root package configuration
```

## 🛠️ Prerequisites

- **Rust** (latest stable)
- **Node.js** (v18+)
- **pnpm** (recommended) or npm
- **wasm-pack** (`cargo install wasm-pack`)

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install:all
   ```

2. **Build the WASM module:**
   ```bash
   pnpm build:wasm
   ```

3. **Start the development server:**
   ```bash
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📦 Available Scripts

- `pnpm build:wasm` - Build Rust core to WebAssembly
- `pnpm dev` - Start React development server
- `pnpm test` - Run all tests (Rust + TypeScript)
- `pnpm bench` - Run performance benchmarks
- `pnpm build` - Build production bundle

## 🧮 Core Geometry Functions

### Basic Shapes
```typescript
import { createSquare, createTriangle, createCircle } from 'cad-geo-sdk';

const square = createSquare(100);        // 100x100 square
const triangle = createTriangle(80, 60); // base=80, height=60
const circle = createCircle({x: 50, y: 50}, 30); // center + radius
```

### Geometric Properties
```typescript
import { area, perimeter, centroid } from 'cad-geo-sdk';

const polygon = createSquare(50);
console.log(area(polygon));        // 2500
console.log(perimeter(polygon));   // 200
console.log(centroid(polygon));    // {x: 25, y: 25}
```

### Transformations
```typescript
import { transform, createMatrix } from 'cad-geo-sdk';

const matrix = createMatrix({
  translate: { x: 10, y: 20 },
  rotate: Math.PI / 4,           // 45 degrees
  scale: { x: 2, y: 1.5 }
});

const transformed = transform(polygon, matrix);
```

## 🎯 Performance

The Rust + WebAssembly implementation provides significant performance improvements:

- **2-5x faster** for complex geometry calculations
- **Memory efficient** with minimal allocations
- **Type safe** with compile-time error checking
- **Fallback support** with JavaScript implementation

### Benchmark Example
```typescript
import { benchmark } from 'cad-geo-sdk';

const results = benchmark(1000);
console.log(`WASM: ${results.wasm}ms`);
console.log(`JS: ${results.js}ms`);
console.log(`Speedup: ${results.ratio}x`);
```

## 🧪 Testing

### Rust Tests
```bash
cd rust-core
cargo test
```

### TypeScript Tests
```bash
cd typescript-sdk
npm test
```

### Integration Tests
```bash
pnpm test
```

## 🎨 Demo Application

The React demo showcases:

- **Interactive Canvas**: Draw and manipulate shapes
- **Real-time Properties**: Area, perimeter, centroid calculations
- **Transform Controls**: Translate, rotate, scale shapes
- **Performance Toggle**: Switch between WASM and JavaScript
- **Benchmarking**: Compare performance metrics

### Demo Features
- Add/remove shapes (squares, triangles, circles)
- Drag shapes around the canvas
- Real-time property calculations
- Performance comparison tools
- Visual feedback for selected shapes

## 🔧 Development

### Project Structure
```
rust-core/
├── src/lib.rs          # Core geometry implementation
├── Cargo.toml          # Rust dependencies
└── tests/              # Rust unit tests

typescript-sdk/
├── src/
│   ├── index.ts        # Main SDK API
│   ├── types.ts        # TypeScript definitions
│   └── geometry-js.ts  # JavaScript fallback
├── package.json        # SDK dependencies
└── dist/               # Compiled output

react-demo/
├── src/
│   ├── App.tsx         # Main application
│   ├── components/     # React components
│   └── utils/          # Utility functions
├── package.json        # Demo dependencies
└── vite.config.ts     # Build configuration
```

### Adding New Features

1. **Rust Core**: Add geometry functions in `rust-core/src/lib.rs`
2. **WASM Bindings**: Expose functions with `#[wasm_bindgen]`
3. **TypeScript SDK**: Add wrapper functions in `typescript-sdk/src/index.ts`
4. **React Demo**: Update UI components to use new features

## 🚀 Why Rust + WebAssembly?

- **Performance**: Near-native speed for complex calculations
- **Memory Safety**: No garbage collection overhead
- **Type Safety**: Compile-time error checking
- **Cross-platform**: Works in any WebAssembly environment
- **Modern**: Leverages cutting-edge web technologies

## 📚 API Reference

### Core Types
```typescript
interface Point { x: number; y: number; }
interface Polygon { vertices: Point[]; }
interface Matrix { m11, m12, m21, m22, dx, dy: number; }
```

### Main Functions
- `init()` - Initialize the WASM module
- `area(polygon)` - Calculate polygon area
- `perimeter(polygon)` - Calculate polygon perimeter
- `centroid(polygon)` - Calculate polygon centroid
- `transform(polygon, matrix)` - Apply transformation
- `benchmark(iterations)` - Performance comparison

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- **Rust Community** for the excellent language and ecosystem
- **WebAssembly** for enabling high-performance web applications
- **React Team** for the modern UI framework
- **Vite** for the fast development experience
