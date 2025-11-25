import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const EnemyField = ({ 
  enemies, 
  onEnemyDestroyed, 
  isGameActive, 
  glyphOverloadActive = false 
}) => {
  const [animatingEnemies, setAnimatingEnemies] = useState(new Set());
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!isGameActive) return;

    const interval = setInterval(() => {
      // Update enemy positions
      // This would typically be handled by the parent component
      // Here we just simulate some movement animations
    }, 16); // 60 FPS

    return () => clearInterval(interval);
  }, [isGameActive]);

  const handleEnemyClick = (enemy) => {
    if (!isGameActive || animatingEnemies?.has(enemy?.id)) return;

    // Add destruction animation
    setAnimatingEnemies(prev => new Set([...prev, enemy.id]));
    
    // Create destruction particles
    createDestructionParticles(enemy?.x, enemy?.y);
    
    // Notify parent after animation delay
    setTimeout(() => {
      onEnemyDestroyed?.(enemy);
      setAnimatingEnemies(prev => {
        const newSet = new Set(prev);
        newSet?.delete(enemy?.id);
        return newSet;
      });
    }, 300);
  };

  const createDestructionParticles = (x, y) => {
    const newParticles = [];
    for (let i = 0; i < 12; i++) {
      newParticles?.push({
        id: Math.random(),
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        size: Math.random() * 4 + 2,
        life: 1,
        color: ['#00D4FF', '#00FF88', '#FF6B00']?.[Math.floor(Math.random() * 3)]
      });
    }
    setParticles(prev => [...prev, ...newParticles]);

    // Remove particles after animation
    setTimeout(() => {
      setParticles(prev => prev?.filter(p => !newParticles?.includes(p)));
    }, 1000);
  };

  const getEnemyShape = (type) => {
    switch (type) {
      case 'cube': return 'Square';
      case 'hexagon': return 'Hexagon';
      case 'triangle': return 'Triangle';
      default: return 'Circle';
    }
  };

  const getEnemyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'accent';
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-background to-card rounded-lg overflow-hidden border border-border">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
      </div>
      {/* Enemies */}
      <div className="relative w-full h-full">
        {enemies?.map((enemy) => (
          <div
            key={enemy?.id}
            className={`
              absolute cursor-pointer transition-all duration-300 group
              ${animatingEnemies?.has(enemy?.id) 
                ? 'animate-ping scale-150 opacity-0' :'hover:scale-110'
              }
              ${glyphOverloadActive ? 'animate-pulse' : ''}
            `}
            style={{
              left: `${enemy?.x}%`,
              top: `${enemy?.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => handleEnemyClick(enemy)}
          >
            {/* Enemy Shape Container */}
            <div className={`
              relative w-16 h-16 flex items-center justify-center
              bg-${getEnemyColor(enemy?.difficulty)}/20 
              border-2 border-${getEnemyColor(enemy?.difficulty)}/50
              rounded-lg shadow-neon group-hover:shadow-neon-intense
              ${glyphOverloadActive ? 'border-warning shadow-[0_0_20px_rgba(255,107,0,0.5)]' : ''}
            `}>
              {/* Geometric Shape Icon */}
              <Icon 
                name={getEnemyShape(enemy?.shape)} 
                size={24} 
                className={`text-${getEnemyColor(enemy?.difficulty)} group-hover:scale-110 transition-transform duration-200`}
              />
              
              {/* Floating Word */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <div className={`
                  px-2 py-1 rounded text-xs font-data font-medium
                  bg-${getEnemyColor(enemy?.difficulty)}/90 text-${getEnemyColor(enemy?.difficulty)}-foreground
                  shadow-neon
                `}>
                  {enemy?.word}
                </div>
              </div>

              {/* Health Bar for Stronger Enemies */}
              {enemy?.health && enemy?.maxHealth && enemy?.health < enemy?.maxHealth && (
                <div className="absolute -bottom-6 left-0 right-0">
                  <div className="w-full bg-border rounded-full h-1">
                    <div 
                      className={`bg-${getEnemyColor(enemy?.difficulty)} h-1 rounded-full transition-all duration-200`}
                      style={{ width: `${(enemy?.health / enemy?.maxHealth) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Difficulty Indicator */}
              <div className={`
                absolute -top-1 -right-1 w-3 h-3 rounded-full
                bg-${getEnemyColor(enemy?.difficulty)} border border-background
              `} />
            </div>
          </div>
        ))}
      </div>
      {/* Destruction Particles */}
      {particles?.map((particle) => (
        <div
          key={particle?.id}
          className="absolute w-1 h-1 rounded-full animate-ping"
          style={{
            left: `${particle?.x}%`,
            top: `${particle?.y}%`,
            backgroundColor: particle?.color,
            animationDuration: '1s'
          }}
        />
      ))}
      {/* Overload Mode Overlay */}
      {glyphOverloadActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-warning/10 via-transparent to-error/10 animate-pulse pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-warning/5 to-transparent" />
        </div>
      )}
      {/* Empty State */}
      {enemies?.length === 0 && isGameActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Icon name="Target" size={48} className="text-text-secondary mx-auto mb-4 opacity-50" />
            <p className="font-body text-text-secondary">
              Preparing next wave...
            </p>
          </div>
        </div>
      )}
      {/* Wave Indicator */}
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Waves" size={16} className="text-accent" />
          <span className="font-caption text-sm text-foreground font-medium">
            Wave {Math.floor(enemies?.length / 5) + 1}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnemyField;