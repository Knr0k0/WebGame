import React, { useRef, useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';


const GameCanvas = ({ 
  isActive = false, 
  onScoreUpdate, 
  onStatsUpdate,
  challengeMode = 'daily'
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentGesture, setCurrentGesture] = useState([]);
  const [gameStats, setGameStats] = useState({
    score: 0,
    wpm: 0,
    accuracy: 0,
    combo: 0,
    gesturesCompleted: 0
  });
  const [particles, setParticles] = useState([]);
  const [enemies, setEnemies] = useState([]);

  // Initialize canvas and game state
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

    // Initialize enemies for daily challenge
    const initializeEnemies = () => {
      const dailyWords = [
        "TECHNOLOGY", "INNOVATION", "CYBERPUNK", "QUANTUM", "NEURAL",
        "DIGITAL", "MATRIX", "PROTOCOL", "ALGORITHM", "SYNTHESIS"
      ];
      
      const newEnemies = dailyWords?.slice(0, 5)?.map((word, index) => ({
        id: index,
        word,
        x: Math.random() * (canvas?.width / window.devicePixelRatio - 100) + 50,
        y: Math.random() * (canvas?.height / window.devicePixelRatio - 100) + 50,
        health: word?.length,
        maxHealth: word?.length,
        isDestroyed: false,
        glowIntensity: 0.5 + Math.random() * 0.5
      }));
      
      setEnemies(newEnemies);
    };

    if (isActive) {
      initializeEnemies();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isActive]);

  // Animation loop
  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef?.current;
    if (!canvas) return;

    const ctx = canvas?.getContext('2d');
    let animationId;

    const animate = () => {
      // Clear canvas with dark background
      ctx.fillStyle = '#050505';
      ctx?.fillRect(0, 0, canvas?.width, canvas?.height);

      // Draw grid pattern
      drawGrid(ctx, canvas);

      // Draw enemies
      enemies?.forEach(enemy => {
        if (!enemy?.isDestroyed) {
          drawEnemy(ctx, enemy);
        }
      });

      // Draw particles
      particles?.forEach((particle, index) => {
        updateParticle(particle);
        drawParticle(ctx, particle);
        
        if (particle?.life <= 0) {
          setParticles(prev => prev?.filter((_, i) => i !== index));
        }
      });

      // Draw current gesture trail
      if (currentGesture?.length > 1) {
        drawGestureTrail(ctx, currentGesture);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isActive, enemies, particles, currentGesture]);

  const drawGrid = (ctx, canvas) => {
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 1;
    
    const gridSize = 50;
    for (let x = 0; x < canvas?.width; x += gridSize) {
      ctx?.beginPath();
      ctx?.moveTo(x, 0);
      ctx?.lineTo(x, canvas?.height);
      ctx?.stroke();
    }
    
    for (let y = 0; y < canvas?.height; y += gridSize) {
      ctx?.beginPath();
      ctx?.moveTo(0, y);
      ctx?.lineTo(canvas?.width, y);
      ctx?.stroke();
    }
  };

  const drawEnemy = (ctx, enemy) => {
    const healthPercentage = enemy?.health / enemy?.maxHealth;
    
    // Enemy container (hexagon)
    ctx?.save();
    ctx?.translate(enemy?.x, enemy?.y);
    
    // Glow effect
    ctx.shadowColor = '#00D4FF';
    ctx.shadowBlur = 20 * enemy?.glowIntensity;
    
    // Hexagon shape
    ctx?.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      let x = Math.cos(angle) * 40;
      let y = Math.sin(angle) * 40;
      if (i === 0) ctx?.moveTo(x, y);
      else ctx?.lineTo(x, y);
    }
    ctx?.closePath();
    
    // Fill with health-based color
    const hue = healthPercentage * 120; // Green to red
    ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.3)`;
    ctx?.fill();
    
    ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
    ctx.lineWidth = 2;
    ctx?.stroke();
    
    // Word text
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px "JetBrains Mono"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx?.fillText(enemy?.word, 0, 0);
    
    ctx?.restore();
  };

  const drawGestureTrail = (ctx, gesture) => {
    if (gesture?.length < 2) return;
    
    ctx.strokeStyle = '#00D4FF';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Add glow effect
    ctx.shadowColor = '#00D4FF';
    ctx.shadowBlur = 10;
    
    ctx?.beginPath();
    ctx?.moveTo(gesture?.[0]?.x, gesture?.[0]?.y);
    
    for (let i = 1; i < gesture?.length; i++) {
      ctx?.lineTo(gesture?.[i]?.x, gesture?.[i]?.y);
    }
    
    ctx?.stroke();
    ctx.shadowBlur = 0;
  };

  const drawParticle = (ctx, particle) => {
    ctx?.save();
    ctx.globalAlpha = particle?.life / particle?.maxLife;
    ctx.fillStyle = particle?.color;
    ctx?.beginPath();
    ctx?.arc(particle?.x, particle?.y, particle?.size, 0, Math.PI * 2);
    ctx?.fill();
    ctx?.restore();
  };

  const updateParticle = (particle) => {
    particle.x += particle?.vx;
    particle.y += particle?.vy;
    particle.life -= 1;
    particle.size *= 0.98;
  };

  const createExplosion = (x, y) => {
    const newParticles = [];
    for (let i = 0; i < 20; i++) {
      newParticles?.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        size: Math.random() * 4 + 2,
        color: `hsl(${180 + Math.random() * 60}, 70%, 60%)`,
        life: 60,
        maxLife: 60
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Mouse/Touch event handlers
  const handleStart = (e) => {
    if (!isActive) return;
    
    setIsDrawing(true);
    const rect = canvasRef?.current?.getBoundingClientRect();
    let x = e?.clientX - rect?.left;
    let y = e?.clientY - rect?.top;
    setCurrentGesture([{ x, y, timestamp: Date.now() }]);
  };

  const handleMove = (e) => {
    if (!isDrawing || !isActive) return;
    
    const rect = canvasRef?.current?.getBoundingClientRect();
    let x = e?.clientX - rect?.left;
    let y = e?.clientY - rect?.top;
    
    setCurrentGesture(prev => [...prev, { x, y, timestamp: Date.now() }]);
  };

  const handleEnd = () => {
    if (!isDrawing || !isActive) return;
    
    setIsDrawing(false);
    
    // Process gesture recognition (simplified)
    if (currentGesture?.length > 5) {
      processGesture(currentGesture);
    }
    
    setCurrentGesture([]);
  };

  const processGesture = (gesture) => {
    // Simplified gesture recognition - in real implementation, this would use ML
    const gestureLength = gesture?.length;
    const isValidGesture = gestureLength > 10;
    
    if (isValidGesture) {
      // Find closest enemy and damage it
      const targetEnemy = enemies?.find(enemy => !enemy?.isDestroyed);
      
      if (targetEnemy) {
        targetEnemy.health -= 1;
        
        if (targetEnemy?.health <= 0) {
          targetEnemy.isDestroyed = true;
          createExplosion(targetEnemy?.x, targetEnemy?.y);
          
          // Update stats
          const newStats = {
            ...gameStats,
            score: gameStats?.score + targetEnemy?.word?.length * 100,
            combo: gameStats?.combo + 1,
            gesturesCompleted: gameStats?.gesturesCompleted + 1,
            wpm: Math.min(gameStats?.wpm + 2, 120),
            accuracy: Math.min(gameStats?.accuracy + 1, 100)
          };
          
          setGameStats(newStats);
          onScoreUpdate?.(newStats?.score);
          onStatsUpdate?.(newStats);
        }
      }
    }
  };

  return (
    <div className="relative w-full h-96 bg-background border border-border rounded-lg overflow-hidden">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => {
          e?.preventDefault();
          const touch = e?.touches?.[0];
          handleStart(touch);
        }}
        onTouchMove={(e) => {
          e?.preventDefault();
          const touch = e?.touches?.[0];
          handleMove(touch);
        }}
        onTouchEnd={(e) => {
          e?.preventDefault();
          handleEnd();
        }}
      />
      {/* Game UI Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        {/* Score Display */}
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg px-4 py-2">
          <div className="font-data text-lg font-bold text-accent">
            {gameStats?.score?.toLocaleString()}
          </div>
          <div className="font-caption text-xs text-text-secondary">
            Score
          </div>
        </div>

        {/* Combo Display */}
        {gameStats?.combo > 0 && (
          <div className="bg-success/20 backdrop-blur-sm border border-success/30 rounded-lg px-4 py-2">
            <div className="font-data text-lg font-bold text-success">
              {gameStats?.combo}x
            </div>
            <div className="font-caption text-xs text-success">
              Combo
            </div>
          </div>
        )}
      </div>
      {/* Instructions Overlay */}
      {!isActive && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center space-y-4">
            <Icon name="MousePointer" size={48} className="text-accent mx-auto" />
            <h3 className="font-heading font-bold text-xl text-foreground">
              Ready to Start?
            </h3>
            <p className="font-body text-text-secondary max-w-md">
              Draw gestures to destroy enemies containing words. Match the shorthand symbols to deal damage!
            </p>
          </div>
        </div>
      )}
      {/* Game Over Overlay */}
      {isActive && enemies?.every(enemy => enemy?.isDestroyed) && (
        <div className="absolute inset-0 bg-success/20 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center space-y-4">
            <Icon name="Trophy" size={48} className="text-success mx-auto" />
            <h3 className="font-heading font-bold text-xl text-success">
              Challenge Complete!
            </h3>
            <p className="font-body text-text-secondary">
              Final Score: {gameStats?.score?.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;