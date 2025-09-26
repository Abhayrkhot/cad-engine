export interface Shape {
  id: string;
  type: 'square' | 'triangle' | 'circle';
  size: number;
  base?: number;
  height?: number;
  center?: { x: number; y: number };
  radius?: number;
  transform: {
    translate: { x: number; y: number };
    rotate: number;
    scale: { x: number; y: number };
  };
}
