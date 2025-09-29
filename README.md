# CAD Geometry Engine

A high-performance cross-platform CAD geometry engine built with Rust, WebAssembly, TypeScript, and React. This project demonstrates the power of WebAssembly for computationally intensive geometric operations in web applications.

**🚀 [Live Demo](https://cad-engine-3zkc.vercel.app/) | 📚 [Documentation](#getting-started) | 🐛 [Issues](https://github.com/Abhayrkhot/cad-engine/issues)**

## Overview

This engine provides a complete solution for 2D geometric operations including polygon calculations, transformations, and real-time interactive manipulation. The architecture showcases modern web development practices with Rust's performance benefits through WebAssembly.

## Features

### Core Geometry Operations
- **Polygon Calculations**: Area, perimeter, and centroid computation
- **Transformations**: Translation, rotation, and scaling operations
- **Shape Support**: Squares, triangles, circles, and custom polygons
- **Real-time Updates**: Live property calculations during manipulation

### Performance Optimization
- **WebAssembly Integration**: Rust-compiled geometry operations
- **Benchmarking System**: Performance comparison between WASM and JavaScript
- **Memory Management**: Efficient handling of large polygon datasets
- **Optimized Rendering**: Canvas-based drawing with memoization

### Interactive Interface
- **Drag and Drop**: Intuitive shape manipulation
- **Rotation Controls**: Precise angle adjustments with degree display
- **Scaling Operations**: Dynamic size modification
- **Visual Feedback**: Real-time property updates and visual indicators

## Architecture

### Technology Stack
- **Rust Core**: High-performance geometry calculations
- **WebAssembly**: Cross-platform performance optimization
- **TypeScript SDK**: Type-safe JavaScript integration
- **React Frontend**: Interactive user interface
- **Canvas Rendering**: Hardware-accelerated graphics

### Project Structure
```
cad-geometry-engine/
├── rust-core/           # Rust geometry engine
├── typescript-sdk/      # TypeScript wrapper
├── react-demo/         # React web application
└── ui-component-library/ # Shared UI components
```

## Live Demo

**🌐 [Try the CAD Engine Live](https://cad-engine-3zkc.vercel.app/)**

Experience the full functionality of the CAD geometry engine with interactive shapes, real-time calculations, and performance benchmarks.

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Rust 1.70+
- wasm-pack

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abhayrkhot/cad-engine.git
   cd cad-engine
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build WebAssembly module**
   ```bash
   npm run build:wasm
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Build Commands

- `npm run build:wasm` - Compile Rust to WebAssembly
- `npm run dev` - Start React development server
- `npm run test` - Run Rust and TypeScript tests
- `npm run bench` - Run performance benchmarks

## Usage

### Basic Operations

```typescript
import { init, calculateArea, calculatePerimeter } from './typescript-sdk';

// Initialize the engine
await init();

// Create a polygon
const polygon = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 100 }
];

// Calculate properties
const area = calculateArea(polygon);
const perimeter = calculatePerimeter(polygon);
```

### Transformations

```typescript
import { createMatrix, transform } from './typescript-sdk';

// Create transformation matrix
const matrix = createMatrix({
  translate: { x: 50, y: 50 },
  rotate: Math.PI / 4, // 45 degrees
  scale: { x: 2, y: 2 }
});

// Apply transformation
const transformedPolygon = transform(polygon, matrix);
```

## Performance

### Benchmark Results

The engine demonstrates significant performance improvements over pure JavaScript:

- **Small Polygons (4 vertices)**: 1.5-2.0x faster
- **Medium Polygons (4 vertices)**: 3.3-4.0x faster  
- **Large Polygons (100 vertices)**: 4.5-5.6x faster

### Optimization Features

- **WebAssembly Compilation**: Near-native performance
- **Memory Efficiency**: Optimized data structures
- **Batch Processing**: Efficient handling of multiple operations
- **Real-time Updates**: Smooth 60fps interactions

## Development

### Running Tests

```bash
# Rust tests
cd rust-core && cargo test

# TypeScript tests
cd typescript-sdk && npm test

# Integration tests
npm run test
```

### Building for Production

```bash
# Build WebAssembly
npm run build:wasm

# Build React application
cd react-demo && npm run build
```

## API Reference

### Core Functions

- `calculateArea(polygon)` - Calculate polygon area
- `calculatePerimeter(polygon)` - Calculate polygon perimeter
- `calculateCentroid(polygon)` - Calculate polygon centroid
- `transform(polygon, matrix)` - Apply transformation matrix
- `createMatrix(options)` - Create transformation matrix

### Shape Creation

- `createSquare(size, center)` - Create square polygon
- `createTriangle(base, height, center)` - Create triangle polygon
- `createCircle(radius, center, segments)` - Create circle polygon

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Rust WebAssembly team for excellent tooling
- React team for the powerful frontend framework
- TypeScript team for type safety and developer experience
- WebAssembly community for performance optimization techniques