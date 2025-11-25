import React, { useRef, useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DrawingCanvas = ({ 
  isDrawing, 
  onDrawingChange, 
  showGrid, 
  showGhost, 
  ghostPath,
  onStrokeComplete,
  canvasBackground = 'dark'
}) => {
  const canvasRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [currentStroke, setCurrentStroke] = useState([]);
  const [allStrokes, setAllStrokes] = useState([]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const container = canvas?.parentElement;
      const rect = container?.getBoundingClientRect();
      const newWidth = Math.max(600, rect?.width - 32);
      const newHeight = Math.max(400, rect?.height - 32);
      
      setCanvasSize({ width: newWidth, height: newHeight });
      canvas.width = newWidth;
      canvas.height = newHeight;
      redrawCanvas();
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const redrawCanvas = () => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const ctx = canvas?.getContext('2d');
    ctx?.clearRect(0, 0, canvas?.width, canvas?.height);

    // Draw background
    if (canvasBackground === 'light') {
      ctx.fillStyle = '#FFFFFF';
    } else if (canvasBackground === 'grid') {
      ctx.fillStyle = '#1A1A1A';
    } else {
      ctx.fillStyle = '#0A0A0A';
    }
    ctx?.fillRect(0, 0, canvas?.width, canvas?.height);

    // Draw grid if enabled
    if (showGrid) {
      drawGrid(ctx);
    }

    // Draw ghost path if enabled
    if (showGhost && ghostPath && ghostPath?.length > 0) {
      drawGhostPath(ctx, ghostPath);
    }

    // Draw all completed strokes
    allStrokes?.forEach(stroke => {
      drawStroke(ctx, stroke, '#00D4FF', 3);
    });

    // Draw current stroke
    if (currentStroke?.length > 0) {
      drawStroke(ctx, currentStroke, '#00FF88', 4);
    }
  };

  const drawGrid = (ctx) => {
    const gridSize = 20;
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3;

    for (let x = 0; x <= canvasSize?.width; x += gridSize) {
      ctx?.beginPath();
      ctx?.moveTo(x, 0);
      ctx?.lineTo(x, canvasSize?.height);
      ctx?.stroke();
    }

    for (let y = 0; y <= canvasSize?.height; y += gridSize) {
      ctx?.beginPath();
      ctx?.moveTo(0, y);
      ctx?.lineTo(canvasSize?.width, y);
      ctx?.stroke();
    }

    ctx.globalAlpha = 1;
  };

  const drawGhostPath = (ctx, path) => {
    if (path?.length < 2) return;

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3;
    ctx?.setLineDash([5, 5]);

    ctx?.beginPath();
    ctx?.moveTo(path?.[0]?.x, path?.[0]?.y);
    
    for (let i = 1; i < path?.length; i++) {
      ctx?.lineTo(path?.[i]?.x, path?.[i]?.y);
    }
    
    ctx?.stroke();
    ctx?.setLineDash([]);
    ctx.globalAlpha = 1;
  };

  const drawStroke = (ctx, stroke, color, width) => {
    if (stroke?.length < 2) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.9;

    ctx?.beginPath();
    ctx?.moveTo(stroke?.[0]?.x, stroke?.[0]?.y);
    
    for (let i = 1; i < stroke?.length; i++) {
      ctx?.lineTo(stroke?.[i]?.x, stroke?.[i]?.y);
    }
    
    ctx?.stroke();
    ctx.globalAlpha = 1;
  };

  const getMousePos = (e) => {
    const canvas = canvasRef?.current;
    const rect = canvas?.getBoundingClientRect();
    return {
      x: e?.clientX - rect?.left,
      y: e?.clientY - rect?.top,
      timestamp: Date.now()
    };
  };

  const getTouchPos = (e) => {
    const canvas = canvasRef?.current;
    const rect = canvas?.getBoundingClientRect();
    const touch = e?.touches?.[0];
    return {
      x: touch?.clientX - rect?.left,
      y: touch?.clientY - rect?.top,
      timestamp: Date.now()
    };
  };

  const startDrawing = (pos) => {
    if (!isDrawing) return;
    
    setIsMouseDown(true);
    setCurrentStroke([pos]);
    onDrawingChange?.(true);
  };

  const continueDrawing = (pos) => {
    if (!isMouseDown || !isDrawing) return;

    setCurrentStroke(prev => [...prev, pos]);
    redrawCanvas();
  };

  const stopDrawing = () => {
    if (!isMouseDown || currentStroke?.length === 0) return;

    setIsMouseDown(false);
    setAllStrokes(prev => [...prev, currentStroke]);
    
    // Analyze stroke and provide feedback
    const strokeData = {
      points: currentStroke,
      duration: currentStroke?.[currentStroke?.length - 1]?.timestamp - currentStroke?.[0]?.timestamp,
      length: calculateStrokeLength(currentStroke)
    };
    
    onStrokeComplete?.(strokeData);
    setCurrentStroke([]);
    onDrawingChange?.(false);
  };

  const calculateStrokeLength = (stroke) => {
    let length = 0;
    for (let i = 1; i < stroke?.length; i++) {
      const dx = stroke?.[i]?.x - stroke?.[i-1]?.x;
      const dy = stroke?.[i]?.y - stroke?.[i-1]?.y;
      length += Math.sqrt(dx * dx + dy * dy);
    }
    return length;
  };

  const clearCanvas = () => {
    setAllStrokes([]);
    setCurrentStroke([]);
    redrawCanvas();
  };

  const undoLastStroke = () => {
    setAllStrokes(prev => prev?.slice(0, -1));
    redrawCanvas();
  };

  useEffect(() => {
    redrawCanvas();
  }, [allStrokes, currentStroke, showGrid, showGhost, ghostPath, canvasBackground]);

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-lg overflow-hidden">
      {/* Canvas Controls */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted">
        <div className="flex items-center space-x-2">
          <Icon name="PenTool" size={20} className="text-accent" />
          <span className="font-heading font-medium text-foreground">Drawing Canvas</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={undoLastStroke}
            disabled={allStrokes?.length === 0}
            iconName="Undo"
            iconSize={16}
            className="text-text-secondary hover:text-warning"
          >
            Undo
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCanvas}
            disabled={allStrokes?.length === 0 && currentStroke?.length === 0}
            iconName="Trash2"
            iconSize={16}
            className="text-text-secondary hover:text-error"
          >
            Clear
          </Button>
        </div>
      </div>
      {/* Canvas Area */}
      <div className="flex-1 p-4 bg-background overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="border border-border rounded-lg cursor-crosshair shadow-neon"
            onMouseDown={(e) => startDrawing(getMousePos(e))}
            onMouseMove={(e) => continueDrawing(getMousePos(e))}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={(e) => {
              e?.preventDefault();
              startDrawing(getTouchPos(e));
            }}
            onTouchMove={(e) => {
              e?.preventDefault();
              continueDrawing(getTouchPos(e));
            }}
            onTouchEnd={(e) => {
              e?.preventDefault();
              stopDrawing();
            }}
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%',
              touchAction: 'none'
            }}
          />
        </div>
      </div>
      {/* Canvas Status */}
      <div className="px-4 py-2 border-t border-border bg-muted">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="font-caption text-text-secondary">
              Strokes: {allStrokes?.length}
            </span>
            {showGrid && (
              <span className="font-caption text-accent">Grid: ON</span>
            )}
            {showGhost && (
              <span className="font-caption text-success">Ghost: ON</span>
            )}
          </div>
          
          <div className="font-caption text-text-secondary">
            Canvas: {canvasSize?.width} × {canvasSize?.height}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas;