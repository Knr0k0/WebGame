import React, { useRef, useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';

const GameCanvas = ({ 
  onGestureComplete, 
  isGameActive, 
  currentTarget,
  gestureTrail = true,
  showGhostOverlay = false 
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState([]);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const ctx = canvas?.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas?.getBoundingClientRect();
      canvas.width = rect?.width * window.devicePixelRatio;
      canvas.height = rect?.height * window.devicePixelRatio;
      ctx?.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    if (!isGameActive) return;

    const canvas = canvasRef?.current;
    const ctx = canvas?.getContext('2d');
    
    const animate = () => {
      // Clear canvas with dark background and noise texture
      ctx.fillStyle = '#0A0A0A';
      ctx?.fillRect(0, 0, canvas?.width / window.devicePixelRatio, canvas?.height / window.devicePixelRatio);
      
      // Add subtle noise texture effect
      ctx.globalAlpha = 0.1;
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#333' : '#111';
        ctx?.fillRect(
          Math.random() * canvas?.width / window.devicePixelRatio,
          Math.random() * canvas?.height / window.devicePixelRatio,
          1, 1
        );
      }
      ctx.globalAlpha = 1;

      // Draw ghost overlay if enabled
      if (showGhostOverlay && currentTarget) {
        drawGhostOverlay(ctx);
      }

      // Draw current stroke with neon trail
      if (currentStroke?.length > 1) {
        drawNeonTrail(ctx, currentStroke);
      }

      // Update and draw particles
      updateParticles(ctx);

      if (isGameActive) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isGameActive, currentStroke, particles, showGhostOverlay, currentTarget]);

  const drawNeonTrail = (ctx, stroke) => {
    if (stroke?.length < 2) return;

    // Outer glow
    ctx.shadowColor = '#00D4FF';
    ctx.shadowBlur = 20;
    ctx.strokeStyle = '#00D4FF';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx?.beginPath();
    ctx?.moveTo(stroke?.[0]?.x, stroke?.[0]?.y);
    for (let i = 1; i < stroke?.length; i++) {
      ctx?.lineTo(stroke?.[i]?.x, stroke?.[i]?.y);
    }
    ctx?.stroke();

    // Inner bright line
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    
    ctx?.beginPath();
    ctx?.moveTo(stroke?.[0]?.x, stroke?.[0]?.y);
    for (let i = 1; i < stroke?.length; i++) {
      ctx?.lineTo(stroke?.[i]?.x, stroke?.[i]?.y);
    }
    ctx?.stroke();
  };

  const drawGhostOverlay = (ctx) => {
    // Draw semi-transparent guide for current target symbol
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = '#00FF88';
    ctx.lineWidth = 3;
    ctx?.setLineDash([5, 5]);
    
    // Mock shorthand symbol path (would be dynamic based on currentTarget)
    ctx?.beginPath();
    ctx?.arc(200, 150, 50, 0, Math.PI * 2);
    ctx?.stroke();
    
    ctx?.setLineDash([]);
    ctx.globalAlpha = 1;
  };

  const updateParticles = (ctx) => {
    setParticles(prev => {
      const updated = prev?.map(particle => ({
        ...particle,
        x: particle?.x + particle?.vx,
        y: particle?.y + particle?.vy,
        life: particle?.life - 0.02,
        size: particle?.size * 0.98
      }))?.filter(particle => particle?.life > 0);

      // Draw particles
      updated?.forEach(particle => {
        ctx.globalAlpha = particle?.life;
        ctx.fillStyle = particle?.color;
        ctx?.beginPath();
        ctx?.arc(particle?.x, particle?.y, particle?.size, 0, Math.PI * 2);
        ctx?.fill();
      });
      ctx.globalAlpha = 1;

      return updated;
    });
  };

  const createParticles = (x, y) => {
    const newParticles = [];
    for (let i = 0; i < 5; i++) {
      newParticles?.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        life: 1,
        color: '#00D4FF'
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  const getEventPos = (e) => {
    const canvas = canvasRef?.current;
    const rect = canvas?.getBoundingClientRect();
    const clientX = e?.clientX || (e?.touches && e?.touches?.[0]?.clientX);
    const clientY = e?.clientY || (e?.touches && e?.touches?.[0]?.clientY);
    
    return {
      x: clientX - rect?.left,
      y: clientY - rect?.top
    };
  };

  const handleStart = (e) => {
    if (!isGameActive) return;
    
    e?.preventDefault();
    setIsDrawing(true);
    const pos = getEventPos(e);
    setCurrentStroke([pos]);
    createParticles(pos?.x, pos?.y);
  };

  const handleMove = (e) => {
    if (!isDrawing || !isGameActive) return;
    
    e?.preventDefault();
    const pos = getEventPos(e);
    setCurrentStroke(prev => [...prev, pos]);
    
    if (Math.random() > 0.7) {
      createParticles(pos?.x, pos?.y);
    }
  };

  const handleEnd = (e) => {
    if (!isDrawing || !isGameActive) return;
    
    e?.preventDefault();
    setIsDrawing(false);
    
    if (currentStroke?.length > 5) {
      // Simulate gesture recognition
      const gestureData = {
        stroke: currentStroke,
        accuracy: Math.random() * 40 + 60, // 60-100%
        speed: Math.random() * 50 + 50, // 50-100 WPM
        recognized: Math.random() > 0.3 // 70% success rate
      };
      
      onGestureComplete?.(gestureData);
    }
    
    setCurrentStroke([]);
  };

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden border border-border shadow-neon">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        style={{ touchAction: 'none' }}
      />
      {/* Overlay Instructions */}
      {!isGameActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="text-center">
            <Icon name="MousePointer2" size={48} className="text-accent mx-auto mb-4" />
            <h3 className="font-heading font-bold text-xl text-foreground mb-2">
              Ready to Draw
            </h3>
            <p className="font-body text-text-secondary">
              Draw shorthand symbols to destroy enemies
            </p>
          </div>
        </div>
      )}
      {/* Drawing Mode Indicator */}
      {isDrawing && (
        <div className="absolute top-4 left-4 flex items-center space-x-2 bg-accent/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-accent/30">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="font-caption text-sm text-accent font-medium">
            Drawing
          </span>
        </div>
      )}
      {/* Current Target Hint */}
      {currentTarget && (
        <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border">
          <div className="text-center">
            <div className="font-data text-lg font-bold text-accent mb-1">
              {currentTarget?.symbol}
            </div>
            <div className="font-caption text-xs text-text-secondary">
              Target: "{currentTarget?.word}"
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;