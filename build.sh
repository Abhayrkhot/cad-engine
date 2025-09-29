#!/bin/bash

# Build WebAssembly module
echo "Building WebAssembly module..."
cd rust-core
wasm-pack build --target web --out-dir ../react-demo/src/wasm
cd ..

# Build React application
echo "Building React application..."
cd react-demo
npm run build
cd ..

echo "Build complete!"
