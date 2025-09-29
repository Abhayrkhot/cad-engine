import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: ['cad-geometry-engine']
    }
  },
  optimizeDeps: {
    exclude: ['cad-geometry-engine']
  },
  resolve: {
    alias: {
      'cad-geometry-engine': './src/wasm/cad_geometry_engine.js'
    }
  }
})
