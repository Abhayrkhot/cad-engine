#!/bin/bash

# Install wasm-pack
echo "Installing wasm-pack..."
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
export PATH="$HOME/.cargo/bin:$PATH"

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
