import React, { useRef, useEffect, useState, useCallback } from 'react';
import Icon from '../../../components/AppIcon';

const GameCanvas = ({ 
  isGameActive, 
  isPaused, 
  onScoreUpdate, 
  onComboUpdate, 
  onGameOver,
  onGestureComplete 
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [particles, setParticles] = useState([]);
  const [gestureTrail, setGestureTrail] = useState([]);

  // Mock enemy data with shorthand words
  const enemyWords = [
    "the", "and", "for", "are", "but", "not", "you", "all", "can", "had",
    "her", "was", "one", "our", "out", "day", "get", "has", "him", "his",
    "how", "man", "new", "now", "old", "see", "two", "way", "who", "boy",
    "did", "its", "let", "put", "say", "she", "too", "use"
  ];

  // Initialize canvas and game loop
  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const ctx = canvas?.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = canvas?.offsetWidth;
      canvas.height = canvas?.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef?.current) {
        cancelAnimationFrame(animationRef?.current);
      }
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (!isGameActive || isPaused) return;

    const gameLoop = () => {
      updateGame();
      renderGame();
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef?.current) {
        cancelAnimationFrame(animationRef?.current);
      }
    };
  }, [isGameActive, isPaused, enemies, particles, gestureTrail]);

  // Spawn enemies periodically
  useEffect(() => {
    if (!isGameActive || isPaused) return;

    const spawnInterval = setInterval(() => {
      spawnEnemy();
    }, 2000);

    return () => clearInterval(spawnInterval);
  }, [isGameActive, isPaused]);

  const spawnEnemy = useCallback(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const word = enemyWords?.[Math.floor(Math.random() * enemyWords?.length)];
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x, y, vx, vy;

    switch (side) {
      case 0: // top
        x = Math.random() * canvas?.width;
        y = -50;
        vx = (Math.random() - 0.5) * 2;
        vy = 1 + Math.random();
        break;
      case 1: // right
        x = canvas?.width + 50;
        y = Math.random() * canvas?.height;
        vx = -(1 + Math.random());
        vy = (Math.random() - 0.5) * 2;
        break;
      case 2: // bottom
        x = Math.random() * canvas?.width;
        y = canvas?.height + 50;
        vx = (Math.random() - 0.5) * 2;
        vy = -(1 + Math.random());
        break;
      case 3: // left
        x = -50;
        y = Math.random() * canvas?.height;
        vx = 1 + Math.random();
        vy = (Math.random() - 0.5) * 2;
        break;
    }

    const newEnemy = {
      id: Date.now() + Math.random(),
      word,
      x,
      y,
      vx,
      vy,
      size: 40 + Math.random() * 20,
      health: 100,
      maxHealth: 100,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      shape: Math.floor(Math.random() * 3), // 0: cube, 1: hexagon, 2: polygon
      glowIntensity: 0.5 + Math.random() * 0.5
    };

    setEnemies(prev => [...prev, newEnemy]);
  }, []);

  const updateGame = useCallback(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    // Update enemies
    setEnemies(prev => prev?.map(enemy => ({
      ...enemy,
      x: enemy?.x + enemy?.vx,
      y: enemy?.y + enemy?.vy,
      rotation: enemy?.rotation + enemy?.rotationSpeed
    }))?.filter(enemy => 
      enemy?.x > -100 && 
      enemy?.x < canvas?.width + 100 && 
      enemy?.y > -100 && 
      enemy?.y < canvas?.height + 100 &&
      enemy?.health > 0
    ));

    // Update particles
    setParticles(prev => prev?.map(particle => ({
      ...particle,
      x: particle?.x + particle?.vx,
      y: particle?.y + particle?.vy,
      life: particle?.life - 1,
      alpha: particle?.alpha * 0.98
    }))?.filter(particle => particle?.life > 0 && particle?.alpha > 0.01));

    // Update gesture trail
    setGestureTrail(prev => prev?.map(point => ({
      ...point,
      life: point?.life - 1,
      alpha: point?.alpha * 0.95
    }))?.filter(point => point?.life > 0));
  }, []);

  const renderGame = useCallback(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const ctx = canvas?.getContext('2d');
    
    // Clear canvas with dark background
    ctx.fillStyle = '#050505';
    ctx?.fillRect(0, 0, canvas?.width, canvas?.height);

    // Draw circuit pattern background
    drawCircuitPattern(ctx, canvas?.width, canvas?.height);

    // Draw enemies
    enemies?.forEach(enemy => drawEnemy(ctx, enemy));

    // Draw gesture trail
    drawGestureTrail(ctx);

    // Draw particles
    particles?.forEach(particle => drawParticle(ctx, particle));
  }, [enemies, particles, gestureTrail]);

  const drawCircuitPattern = (ctx, width, height) => {
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;

    const gridSize = 50;
    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        if (Math.random() > 0.7) {
          ctx?.beginPath();
          ctx?.moveTo(x, y);
          ctx?.lineTo(x + gridSize, y);
          ctx?.lineTo(x + gridSize, y + gridSize);
          ctx?.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
  };

  const drawEnemy = (ctx, enemy) => {
    ctx?.save();
    ctx?.translate(enemy?.x, enemy?.y);
    ctx?.rotate(enemy?.rotation);

    // Draw enemy shape with neon glow
    ctx.shadowColor = '#00D4FF';
    ctx.shadowBlur = 20 * enemy?.glowIntensity;
    ctx.strokeStyle = '#00D4FF';
    ctx.fillStyle = 'rgba(0, 212, 255, 0.1)';
    ctx.lineWidth = 2;

    const size = enemy?.size;
    ctx?.beginPath();

    switch (enemy?.shape) {
      case 0: // cube
        ctx?.rect(-size/2, -size/2, size, size);
        break;
      case 1: // hexagon
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          let x = Math.cos(angle) * size/2;
          let y = Math.sin(angle) * size/2;
          if (i === 0) ctx?.moveTo(x, y);
          else ctx?.lineTo(x, y);
        }
        ctx?.closePath();
        break;
      case 2: // polygon
        const sides = 5 + Math.floor(Math.random() * 3);
        for (let i = 0; i < sides; i++) {
          const angle = (i * 2 * Math.PI) / sides;
          let x = Math.cos(angle) * size/2;
          let y = Math.sin(angle) * size/2;
          if (i === 0) ctx?.moveTo(x, y);
          else ctx?.lineTo(x, y);
        }
        ctx?.closePath();
        break;
    }

    ctx?.fill();
    ctx?.stroke();

    // Draw word inside enemy
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${Math.max(12, size/4)}px 'JetBrains Mono'`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx?.fillText(enemy?.word, 0, 0);

    // Draw health bar
    if (enemy?.health < enemy?.maxHealth) {
      const barWidth = size;
      const barHeight = 4;
      const healthPercent = enemy?.health / enemy?.maxHealth;
      
      ctx.fillStyle = '#FF0040';
      ctx?.fillRect(-barWidth/2, -size/2 - 10, barWidth, barHeight);
      
      ctx.fillStyle = '#00FF88';
      ctx?.fillRect(-barWidth/2, -size/2 - 10, barWidth * healthPercent, barHeight);
    }

    ctx?.restore();
  };

  const drawGestureTrail = (ctx) => {
    if (gestureTrail?.length < 2) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 1; i < gestureTrail?.length; i++) {
      const point = gestureTrail?.[i];
      const prevPoint = gestureTrail?.[i - 1];

      ctx.globalAlpha = point?.alpha;
      ctx.strokeStyle = '#00D4FF';
      ctx.lineWidth = 8 * (point?.life / 60);
      ctx.shadowColor = '#00D4FF';
      ctx.shadowBlur = 15;

      ctx?.beginPath();
      ctx?.moveTo(prevPoint?.x, prevPoint?.y);
      ctx?.lineTo(point?.x, point?.y);
      ctx?.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  };

  const drawParticle = (ctx, particle) => {
    ctx?.save();
    ctx.globalAlpha = particle?.alpha;
    ctx.fillStyle = particle?.color;
    ctx.shadowColor = particle?.color;
    ctx.shadowBlur = 10;

    ctx?.beginPath();
    ctx?.arc(particle?.x, particle?.y, particle?.size, 0, Math.PI * 2);
    ctx?.fill();

    ctx?.restore();
  };

  const createExplosion = (x, y) => {
    const newParticles = [];
    for (let i = 0; i < 20; i++) {
      newParticles?.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        size: 2 + Math.random() * 4,
        color: ['#00D4FF', '#00FF88', '#FF6B00']?.[Math.floor(Math.random() * 3)],
        life: 60,
        alpha: 1
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Mouse/Touch event handlers
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
    if (!isGameActive || isPaused) return;
    
    e?.preventDefault();
    setIsDrawing(true);
    const pos = getEventPos(e);
    setCurrentStroke([pos]);
    setGestureTrail([{ ...pos, life: 60, alpha: 1 }]);
  };

  const handleMove = (e) => {
    if (!isDrawing || !isGameActive || isPaused) return;
    
    e?.preventDefault();
    const pos = getEventPos(e);
    setCurrentStroke(prev => [...prev, pos]);
    setGestureTrail(prev => [...prev, { ...pos, life: 60, alpha: 1 }]);
  };

  const handleEnd = (e) => {
    if (!isDrawing || !isGameActive || isPaused) return;
    
    e?.preventDefault();
    setIsDrawing(false);
    
    if (currentStroke?.length > 5) {
      processGesture(currentStroke);
    }
    
    setCurrentStroke([]);
  };

  const processGesture = (stroke) => {
    // Simple gesture recognition - check if stroke intersects with enemies
    const canvas = canvasRef?.current;
    if (!canvas) return;

    let hitEnemies = [];
    
    enemies?.forEach(enemy => {
      const distance = Math.min(...stroke?.map(point => 
        Math.sqrt(Math.pow(point?.x - enemy?.x, 2) + Math.pow(point?.y - enemy?.y, 2))
      ));
      
      if (distance < enemy?.size / 2) {
        hitEnemies?.push(enemy);
      }
    });

    if (hitEnemies?.length > 0) {
      // Damage enemies
      setEnemies(prev => prev?.map(enemy => {
        if (hitEnemies?.includes(enemy)) {
          const newHealth = Math.max(0, enemy?.health - 50);
          if (newHealth === 0) {
            createExplosion(enemy?.x, enemy?.y);
            onScoreUpdate?.(100);
            onComboUpdate?.(1);
          }
          return { ...enemy, health: newHealth };
        }
        return enemy;
      }));

      onGestureComplete?.(stroke, hitEnemies);
    }
  };

  return (
    <div className="relative w-full h-full bg-background overflow-hidden">
      {/* Circuit pattern overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-accent/5 to-transparent" />
      </div>

      {/* Game canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        style={{ touchAction: 'none' }}
      />

      {/* Game paused overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <Icon name="Pause" size={64} className="text-accent mx-auto mb-4" />
            <h2 className="font-heading font-bold text-2xl text-foreground mb-2">
              Game Paused
            </h2>
            <p className="font-body text-text-secondary">
              Resume to continue your run
            </p>
          </div>
        </div>
      )}

      {/* Game over overlay */}
      {!isGameActive && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <Icon name="Zap" size={64} className="text-error mx-auto mb-4" />
            <h2 className="font-heading font-bold text-3xl text-foreground mb-2">
              Game Over
            </h2>
            <p className="font-body text-text-secondary mb-6">
              Your lexicon breaking run has ended
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;