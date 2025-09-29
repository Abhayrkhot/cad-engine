// Simple test file for the CAD Geometry Engine
import { 
  init, 
  area, 
  perimeter, 
  centroid, 
  createSquare, 
  createTriangle,
  isWasmAvailable
} from '../index.js';

async function runTests() {
  console.log('🧪 Running CAD Geometry Engine Tests...\n');

  try {
    // Initialize the engine
    console.log('1. Initializing engine...');
    await init();
    console.log('✅ Engine initialized successfully');

    // Test 1: Square area calculation
    console.log('\n2. Testing square area calculation...');
    const square = createSquare(2);
    const squareArea = area(square);
    console.log(`Square area: ${squareArea} (expected: 4)`);
    if (Math.abs(squareArea - 4) < 0.001) {
      console.log('✅ Square area test passed');
    } else {
      console.log('❌ Square area test failed');
    }

    // Test 2: Triangle area calculation
    console.log('\n3. Testing triangle area calculation...');
    const triangle = createTriangle(4, 3);
    const triangleArea = area(triangle);
    console.log(`Triangle area: ${triangleArea} (expected: 6)`);
    if (Math.abs(triangleArea - 6) < 0.001) {
      console.log('✅ Triangle area test passed');
    } else {
      console.log('❌ Triangle area test failed');
    }

    // Test 3: Perimeter calculation
    console.log('\n4. Testing perimeter calculation...');
    const squarePerimeter = perimeter(square);
    console.log(`Square perimeter: ${squarePerimeter} (expected: 8)`);
    if (Math.abs(squarePerimeter - 8) < 0.001) {
      console.log('✅ Perimeter test passed');
    } else {
      console.log('❌ Perimeter test failed');
    }

    // Test 4: Centroid calculation
    console.log('\n5. Testing centroid calculation...');
    const center = centroid(square);
    console.log(`Square centroid: (${center.x}, ${center.y}) (expected: (1, 1))`);
    if (Math.abs(center.x - 1) < 0.001 && Math.abs(center.y - 1) < 0.001) {
      console.log('✅ Centroid test passed');
    } else {
      console.log('❌ Centroid test failed');
    }

    // Test 5: WASM availability
    console.log('\n6. Testing WASM availability...');
    const wasmAvailable = isWasmAvailable();
    console.log(`WASM available: ${wasmAvailable}`);
    console.log('✅ WASM availability test completed');

    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { runTests };
