import React, { forwardRef, useEffect, useRef, useImperativeHandle, useMemo, useCallback } from 'react';
import { Shape } from '../types';

interface CanvasProps {
  shapes: Shape[];
  selectedShape: string | null;
  onShapeSelect: (id: string) => void;
  onShapeUpdate: (id: string, updates: Partial<Shape>) => void;
  useWasm: boolean;
  selectedTool: 'select' | 'rotate' | 'scale' | 'edit';
  showGrid: boolean;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(({
  shapes,
  selectedShape,
  onShapeSelect,
  onShapeUpdate,
  selectedTool,
  showGrid
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastUpdateTime = useRef(0);
  const initialScaleDistance = useRef(0);

  useImperativeHandle(ref, () => canvasRef.current!);

  // Helper functions - defined before useMemo hooks
  const getShapePolygon = (shape: Shape) => {
    switch (shape.type) {
      case 'square':
        const halfSize = shape.size / 2;
        return [
          { x: -halfSize, y: -halfSize },
          { x: halfSize, y: -halfSize },
          { x: halfSize, y: halfSize },
          { x: -halfSize, y: halfSize }
        ];
      case 'triangle':
        const halfBase = (shape.base || 60) / 2;
        const height = shape.height || 40;
        return [
          { x: 0, y: -height / 2 },
          { x: -halfBase, y: height / 2 },
          { x: halfBase, y: height / 2 }
        ];
      case 'circle':
        const radius = shape.radius || 30;
        const points = [];
        for (let i = 0; i < 32; i++) {
          const angle = (i / 32) * 2 * Math.PI;
          points.push({
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius
          });
        }
        return points;
      default:
        return [];
    }
  };

  const getShapeBounds = (vertices: { x: number; y: number }[]) => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    vertices.forEach(vertex => {
      minX = Math.min(minX, vertex.x);
      minY = Math.min(minY, vertex.y);
      maxX = Math.max(maxX, vertex.x);
      maxY = Math.max(maxY, vertex.y);
    });
    return { minX, minY, maxX, maxY };
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


  // Memoized shape polygons
  const shapePolygons = useMemo(() => {
    return shapes.map(shape => {
      const basePolygon = getShapePolygon(shape);
      const transformedPolygon = basePolygon.map(vertex => ({
        x: vertex.x * shape.transform.scale.x,
        y: vertex.y * shape.transform.scale.y
      })).map(vertex => {
        const cos = Math.cos(shape.transform.rotate);
        const sin = Math.sin(shape.transform.rotate);
        return {
          x: vertex.x * cos - vertex.y * sin + shape.transform.translate.x,
          y: vertex.x * sin + vertex.y * cos + shape.transform.translate.y
        };
      });
      return { shape, polygon: transformedPolygon };
    });
  }, [shapes]);

  // Memoized transformed shapes for drawing
  const transformedShapes = useMemo(() => {
    return shapePolygons.map(({ shape, polygon }) => ({
      shape,
      polygon,
      bounds: getShapeBounds(polygon)
    }));
  }, [shapePolygons]);

  // Grid drawing function
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!showGrid) return;
    
    const gridSize = 20;
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    
    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }, [showGrid]);

  // Main draw function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(ctx, canvas.width, canvas.height);

    // Draw shapes
    transformedShapes.forEach(({ shape, polygon, bounds }) => {
      const isSelected = selectedShape === shape.id;
      
      // Draw shape
      ctx.beginPath();
      ctx.moveTo(polygon[0].x, polygon[0].y);
      for (let i = 1; i < polygon.length; i++) {
        ctx.lineTo(polygon[i].x, polygon[i].y);
      }
      ctx.closePath();

      // Fill
      ctx.fillStyle = isSelected ? '#3b82f6' : '#6366f1';
      ctx.fill();

      // Stroke
      ctx.strokeStyle = isSelected ? '#1d4ed8' : '#4f46e5';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();

      // Draw selection handles if selected
      if (isSelected) {
        ctx.fillStyle = '#1d4ed8';
        const handleSize = 6;
        const corners = [
          { x: bounds.minX, y: bounds.minY },
          { x: bounds.maxX, y: bounds.minY },
          { x: bounds.maxX, y: bounds.maxY },
          { x: bounds.minX, y: bounds.maxY }
        ];
        
        corners.forEach(corner => {
          ctx.fillRect(corner.x - handleSize/2, corner.y - handleSize/2, handleSize, handleSize);
        });
      }
    });
  }, [transformedShapes, selectedShape, drawGrid]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find clicked shape
    let clickedShape = null;
    for (const { shape, polygon } of transformedShapes) {
      if (isPointInPolygon({ x, y }, polygon)) {
        clickedShape = shape;
        break;
      }
    }

    if (clickedShape) {
      onShapeSelect(clickedShape.id);
      isDragging.current = true;
      // Store the offset from the shape's center to the click point
      const shape = shapes.find(s => s.id === clickedShape.id);
      if (shape) {
        dragStart.current = { 
          x: x - shape.transform.translate.x, 
          y: y - shape.transform.translate.y 
        };
        
        // For scaling, store the initial distance from center
        if (selectedTool === 'scale') {
          const centerX = shape.transform.translate.x;
          const centerY = shape.transform.translate.y;
          initialScaleDistance.current = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        }
      } else {
        dragStart.current = { x, y };
      }
      lastMousePos.current = { x, y };
    } else {
      onShapeSelect(null);
    }
  }, [transformedShapes, onShapeSelect]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current || !selectedShape) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Throttle updates
    const now = Date.now();
    if (now - lastUpdateTime.current < 16) return; // ~60fps
    lastUpdateTime.current = now;

    const dx = x - lastMousePos.current.x;
    const dy = y - lastMousePos.current.y;

    if (selectedTool === 'select') {
      // Move shape with bounds checking
      const shape = shapes.find(s => s.id === selectedShape);
      if (shape) {
        const basePolygon = getShapePolygon(shape);
        const transformedPolygon = basePolygon.map(vertex => ({
          x: vertex.x * shape.transform.scale.x,
          y: vertex.y * shape.transform.scale.y
        })).map(vertex => {
          const cos = Math.cos(shape.transform.rotate);
          const sin = Math.sin(shape.transform.rotate);
          return {
            x: vertex.x * cos - vertex.y * sin,
            y: vertex.x * sin + vertex.y * cos
          };
        });
        
        const bounds = getShapeBounds(transformedPolygon);
        const shapeWidth = bounds.maxX - bounds.minX;
        const shapeHeight = bounds.maxY - bounds.minY;
        
        // Calculate new position with bounds checking
        let newX = x - dragStart.current.x;
        let newY = y - dragStart.current.y;
        
        // Constrain to canvas bounds
        const margin = 10; // Keep some margin from edges
        newX = Math.max(margin, Math.min(canvas.width - shapeWidth - margin, newX));
        newY = Math.max(margin, Math.min(canvas.height - shapeHeight - margin, newY));
        
        // Apply snap to grid if enabled
        
        onShapeUpdate(selectedShape, {
          transform: {
            ...shape.transform,
            translate: { x: newX, y: newY }
          }
        });
      }
    } else if (selectedTool === 'rotate') {
      // Rotate shape
      const shape = shapes.find(s => s.id === selectedShape);
      if (shape) {
        const centerX = shape.transform.translate.x;
        const centerY = shape.transform.translate.y;
        const angle = Math.atan2(y - centerY, x - centerX);
        onShapeUpdate(selectedShape, {
          transform: {
            ...shape.transform,
            rotate: angle
          }
        });
      }
    } else if (selectedTool === 'scale') {
      // Scale shape based on distance from center
      const shape = shapes.find(s => s.id === selectedShape);
      if (shape) {
        const centerX = shape.transform.translate.x;
        const centerY = shape.transform.translate.y;
        const currentDistance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        
        // Use the initial distance when scaling started as reference
        const initialDistance = initialScaleDistance.current || 30;
        const scaleFactor = Math.max(0.1, Math.min(5.0, currentDistance / initialDistance)); // Limit scale between 0.1x and 5x
        
        onShapeUpdate(selectedShape, {
          transform: {
            ...shape.transform,
            scale: { x: scaleFactor, y: scaleFactor }
          }
        });
      }
    }

    lastMousePos.current = { x, y };
  }, [selectedShape, selectedTool, onShapeUpdate, shapes]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Throttled mouse move handler
  const throttledMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    handleMouseMove(e);
  }, [handleMouseMove]);

  // Redraw when dependencies change
  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="canvas-wrapper">
      <canvas
        ref={canvasRef}
        className="geometry-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={throttledMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          cursor: isDragging.current ? 'grabbing' : (selectedShape ? 'grab' : 'default'),
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;