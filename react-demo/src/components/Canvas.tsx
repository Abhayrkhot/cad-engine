import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import { createSquare, createTriangle, createCircle, transform, createMatrix, centroid } from 'cad-geo-sdk';
import { Shape } from '../types';

interface CanvasProps {
  shapes: Shape[];
  selectedShape: string | null;
  onShapeSelect: (id: string) => void;
  onShapeUpdate: (id: string, updates: Partial<Shape>) => void;
  useWasm: boolean;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(({
  shapes,
  selectedShape,
  onShapeSelect,
  onShapeUpdate
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });

  useImperativeHandle(ref, () => canvasRef.current!);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw shapes
      shapes.forEach(shape => {
        const polygon = getShapePolygon(shape);
        const transformed = transform(polygon, createMatrix({
          translate: shape.transform.translate,
          rotate: shape.transform.rotate,
          scale: shape.transform.scale
        }));

        // Draw shape
        ctx.strokeStyle = shape.id === selectedShape ? '#646cff' : '#fff';
        ctx.lineWidth = shape.id === selectedShape ? 3 : 2;
        ctx.fillStyle = shape.id === selectedShape ? 'rgba(100, 108, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)';
        
        ctx.beginPath();
        ctx.moveTo(transformed.vertices[0].x, transformed.vertices[0].y);
        for (let i = 1; i < transformed.vertices.length; i++) {
          ctx.lineTo(transformed.vertices[i].x, transformed.vertices[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw centroid
        const center = centroid(transformed);
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(center.x, center.y, 3, 0, 2 * Math.PI);
        ctx.fill();
      });
    };

    draw();

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Check if clicking on a shape
      for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];
        const polygon = getShapePolygon(shape);
        const transformed = transform(polygon, createMatrix({
          translate: shape.transform.translate,
          rotate: shape.transform.rotate,
          scale: shape.transform.scale
        }));

        if (isPointInPolygon({ x, y }, transformed.vertices)) {
          onShapeSelect(shape.id);
          isDragging.current = true;
          dragStart.current = { x, y };
          lastMousePos.current = { x, y };
          break;
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !selectedShape) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const dx = x - lastMousePos.current.x;
      const dy = y - lastMousePos.current.y;
      
      onShapeUpdate(selectedShape, {
        transform: {
          ...shapes.find(s => s.id === selectedShape)!.transform,
          translate: {
            x: shapes.find(s => s.id === selectedShape)!.transform.translate.x + dx,
            y: shapes.find(s => s.id === selectedShape)!.transform.translate.y + dy
          }
        }
      });
      
      lastMousePos.current = { x, y };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [shapes, selectedShape, onShapeSelect, onShapeUpdate]);

  const getShapePolygon = (shape: Shape) => {
    switch (shape.type) {
      case 'square':
        return createSquare(shape.size);
      case 'triangle':
        return createTriangle(shape.base || 60, shape.height || 40);
      case 'circle':
        return createCircle(shape.center || { x: 100, y: 100 }, shape.radius || 30);
      default:
        return createSquare(50);
    }
  };

  const isPointInPolygon = (point: { x: number; y: number }, vertices: { x: number; y: number }[]) => {
    let inside = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      if (((vertices[i].y > point.y) !== (vertices[j].y > point.y)) &&
          (point.x < (vertices[j].x - vertices[i].x) * (point.y - vertices[i].y) / (vertices[j].y - vertices[i].y) + vertices[i].x)) {
        inside = !inside;
      }
    }
    return inside;
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
      />
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;
