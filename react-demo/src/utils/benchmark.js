import { init, benchmark } from 'cad-geo-sdk';

async function runBenchmark() {
  console.log('Initializing CAD Geometry Engine...');
  await init();
  
  console.log('Running benchmark...');
  const results = benchmark(1000);
  
  console.log('\n=== Benchmark Results ===');
  console.log(`WASM Performance: ${results.wasm.toFixed(2)}ms`);
  console.log(`JavaScript Performance: ${results.js.toFixed(2)}ms`);
  console.log(`Speed Improvement: ${results.ratio.toFixed(2)}x`);
  
  if (results.ratio > 1) {
    console.log(`✅ WASM is ${results.ratio.toFixed(2)}x faster than JavaScript`);
  } else {
    console.log('⚠️ JavaScript is faster in this case (WASM overhead for small operations)');
  }
}

runBenchmark().catch(console.error);
