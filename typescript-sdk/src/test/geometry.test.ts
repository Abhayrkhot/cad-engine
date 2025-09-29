import { describe, it, expect, beforeAll } from '@jest/globals';
import { 
  init, 
  area, 
  perimeter, 
  centroid, 
  transform, 
  createSquare, 
  createTriangle, 
  createCircle,
  createMatrix,
  translate,
  rotate,
  scale,
  isWasmAvailable,
  benchmark
} from '../index';

describe('CAD Geometry Engine', () => {
  beforeAll(async () => {
    await init();
  });

  describe('Basic Geometry Operations', () => {
    it('should calculate area of a square', () => {
      const square = createSquare(2);
      expect(area(square)).toBe(4);
    });

    it('should calculate area of a triangle', () => {
      const triangle = createTriangle(4, 3);
      expect(area(triangle)).toBe(6);
    });

    it('should calculate perimeter of a square', () => {
      const square = createSquare(1);
      expect(perimeter(square)).toBe(4);
    });

    it('should calculate centroid of a square', () => {
      const square = createSquare(2);
      const center = centroid(square);
      expect(center.x).toBe(1);
      expect(center.y).toBe(1);
    });
  });

  describe('Matrix Operations', () => {
    it('should create identity matrix', () => {
      const matrix = createMatrix({});
      expect(matrix.m11).toBe(1);
      expect(matrix.m12).toBe(0);
      expect(matrix.m21).toBe(0);
      expect(matrix.m22).toBe(1);
      expect(matrix.dx).toBe(0);
      expect(matrix.dy).toBe(0);
    });

    it('should create translation matrix', () => {
      const matrix = translate(5, 10);
      expect(matrix.dx).toBe(5);
      expect(matrix.dy).toBe(10);
    });

    it('should create scale matrix', () => {
      const matrix = scale(2, 3);
      expect(matrix.m11).toBe(2);
      expect(matrix.m22).toBe(3);
    });

    it('should create rotation matrix', () => {
      const matrix = rotate(Math.PI / 2);
      expect(matrix.m11).toBeCloseTo(0, 10);
      expect(matrix.m12).toBeCloseTo(-1, 10);
      expect(matrix.m21).toBeCloseTo(1, 10);
      expect(matrix.m22).toBeCloseTo(0, 10);
    });
  });

  describe('Transformations', () => {
    it('should translate a polygon', () => {
      const square = createSquare(1);
      const matrix = translate(2, 3);
      const transformed = transform(square, matrix);
      const center = centroid(transformed);
      expect(center.x).toBe(2.5);
      expect(center.y).toBe(3.5);
    });

    it('should scale a polygon', () => {
      const square = createSquare(1);
      const matrix = scale(2, 2);
      const transformed = transform(square, matrix);
      expect(area(transformed)).toBe(4);
    });
  });

  describe('Shape Creation', () => {
    it('should create a square with correct vertices', () => {
      const square = createSquare(2);
      expect(square.vertices).toHaveLength(4);
      expect(square.vertices[0]).toEqual({ x: 0, y: 0 });
      expect(square.vertices[1]).toEqual({ x: 2, y: 0 });
      expect(square.vertices[2]).toEqual({ x: 2, y: 2 });
      expect(square.vertices[3]).toEqual({ x: 0, y: 2 });
    });

    it('should create a triangle with correct vertices', () => {
      const triangle = createTriangle(4, 3);
      expect(triangle.vertices).toHaveLength(3);
      expect(triangle.vertices[0]).toEqual({ x: 0, y: 0 });
      expect(triangle.vertices[1]).toEqual({ x: 4, y: 0 });
      expect(triangle.vertices[2]).toEqual({ x: 2, y: 3 });
    });

    it('should create a circle with correct number of segments', () => {
      const circle = createCircle({ x: 0, y: 0 }, 1, 8);
      expect(circle.vertices).toHaveLength(8);
    });
  });

  describe('Performance', () => {
    it('should be able to run benchmark', () => {
      const results = benchmark(100);
      expect(results).toHaveProperty('wasm');
      expect(results).toHaveProperty('js');
      expect(results).toHaveProperty('ratio');
      expect(typeof results.wasm).toBe('number');
      expect(typeof results.js).toBe('number');
      expect(typeof results.ratio).toBe('number');
    });

    it('should detect WASM availability', () => {
      const available = isWasmAvailable();
      expect(typeof available).toBe('boolean');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty polygon', () => {
      const empty = { vertices: [] };
      expect(area(empty)).toBe(0);
      expect(perimeter(empty)).toBe(0);
      expect(centroid(empty)).toEqual({ x: 0, y: 0 });
    });

    it('should handle single point', () => {
      const point = { vertices: [{ x: 1, y: 1 }] };
      expect(area(point)).toBe(0);
      expect(perimeter(point)).toBe(0);
      expect(centroid(point)).toEqual({ x: 1, y: 1 });
    });

    it('should handle two points', () => {
      const line = { vertices: [{ x: 0, y: 0 }, { x: 1, y: 0 }] };
      expect(area(line)).toBe(0);
      expect(perimeter(line)).toBe(1);
      expect(centroid(line)).toEqual({ x: 0.5, y: 0 });
    });
  });
});
