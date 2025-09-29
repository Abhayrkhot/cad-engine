import { Point, Polygon, Matrix, TransformOptions } from './types.js';

// JavaScript fallback implementation for testing and comparison
export class GeometryJS {
  static area(polygon: Polygon): number {
    if (polygon.vertices.length < 3) {
      return 0;
    }

    let area = 0;
    const n = polygon.vertices.length;

    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += polygon.vertices[i].x * polygon.vertices[j].y;
      area -= polygon.vertices[j].x * polygon.vertices[i].y;
    }

    return Math.abs(area) / 2;
  }

  static perimeter(polygon: Polygon): number {
    if (polygon.vertices.length < 2) {
      return 0;
    }

    let perimeter = 0;
    const n = polygon.vertices.length;

    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const dx = polygon.vertices[j].x - polygon.vertices[i].x;
      const dy = polygon.vertices[j].y - polygon.vertices[i].y;
      perimeter += Math.sqrt(dx * dx + dy * dy);
    }

    return perimeter;
  }

  static centroid(polygon: Polygon): Point {
    if (polygon.vertices.length === 0) {
      return { x: 0, y: 0 };
    }

    let cx = 0;
    let cy = 0;

    for (const vertex of polygon.vertices) {
      cx += vertex.x;
      cy += vertex.y;
    }

    return {
      x: cx / polygon.vertices.length,
      y: cy / polygon.vertices.length
    };
  }

  static createMatrix(options: TransformOptions): Matrix {
    let matrix: Matrix = {
      m11: 1, m12: 0,
      m21: 0, m22: 1,
      dx: 0, dy: 0
    };

    if (options.translate) {
      matrix.dx = options.translate.x;
      matrix.dy = options.translate.y;
    }

    if (options.scale) {
      matrix.m11 *= options.scale.x;
      matrix.m22 *= options.scale.y;
    }

    if (options.rotate !== undefined) {
      const cos = Math.cos(options.rotate);
      const sin = Math.sin(options.rotate);
      const newM11 = matrix.m11 * cos - matrix.m12 * sin;
      const newM12 = matrix.m11 * sin + matrix.m12 * cos;
      const newM21 = matrix.m21 * cos - matrix.m22 * sin;
      const newM22 = matrix.m21 * sin + matrix.m22 * cos;
      
      matrix.m11 = newM11;
      matrix.m12 = newM12;
      matrix.m21 = newM21;
      matrix.m22 = newM22;
    }

    return matrix;
  }

  static transform(polygon: Polygon, matrix: Matrix): Polygon {
    const newVertices: Point[] = [];

    for (const vertex of polygon.vertices) {
      const newX = matrix.m11 * vertex.x + matrix.m12 * vertex.y + matrix.dx;
      const newY = matrix.m21 * vertex.x + matrix.m22 * vertex.y + matrix.dy;
      newVertices.push({ x: newX, y: newY });
    }

    return { vertices: newVertices };
  }

  static createSquare(size: number): Polygon {
    return {
      vertices: [
        { x: 0, y: 0 },
        { x: size, y: 0 },
        { x: size, y: size },
        { x: 0, y: size }
      ]
    };
  }

  static createTriangle(base: number, height: number): Polygon {
    return {
      vertices: [
        { x: 0, y: 0 },
        { x: base, y: 0 },
        { x: base / 2, y: height }
      ]
    };
  }
}


