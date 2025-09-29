export interface Point {
  x: number;
  y: number;
}

export interface Vector {
  x: number;
  y: number;
}

export interface Polygon {
  vertices: Point[];
}

export interface Matrix {
  m11: number;
  m12: number;
  m21: number;
  m22: number;
  dx: number;
  dy: number;
}

export interface TransformOptions {
  translate?: { x: number; y: number };
  rotate?: number; // angle in radians
  scale?: { x: number; y: number };
}


