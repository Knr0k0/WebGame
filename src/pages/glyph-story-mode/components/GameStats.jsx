import React from 'react';
import Icon from '../../../components/AppIcon';

const GameStats = ({ 
  health, 
  maxHealth, 
  score, 
  combo, 
  glyphOverloadCharge, 
  wpm, 
  accuracy,
  isOverloadActive = false 
}) => {
  const healthPercentage = (health / maxHealth) * 100;
  const overloadPercentage = Math.min(glyphOverloadCharge, 100);
  
  const getHealthColor = () => {
    if (healthPercentage > 60) return 'success';
    if (healthPercentage > 30) return 'warning';
    return 'error';
  };

  const formatScore = (score) => {
    return score?.toLocaleString();
  };

  return (
    <div className="w-full h-full bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Health Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Heart" size={16} className={`text-${getHealthColor()}`} />
            <span className="font-heading font-medium text-sm text-card-foreground">
              Health
            </span>
          </div>
          <span className="font-data text-sm font-medium text-foreground">
            {health}/{maxHealth}
          </span>
        </div>
        
        <div className="w-full bg-border rounded-full h-3">
          <div 
            className={`
              h-3 rounded-full transition-all duration-300
              bg-${getHealthColor()} shadow-neon
              ${healthPercentage <= 20 ? 'animate-pulse' : ''}
            `}
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
      </div>

      {/* Score Display */}
      <div className="bg-muted rounded-lg p-3 border border-border">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <Icon name="Target" size={16} className="text-accent" />
            <span className="font-caption text-xs text-text-secondary">
              SCORE
            </span>
          </div>
        </div>
        <div className="font-data text-2xl font-bold text-accent">
          {formatScore(score)}
        </div>
      </div>

      {/* Combo Counter */}
      {combo > 0 && (
        <div className={`
          bg-gradient-to-r from-accent/20 to-success/20 rounded-lg p-3 
          border border-accent/30 shadow-neon animate-pulse-glow
        `}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <Icon name="Zap" size={16} className="text-accent" />
              <span className="font-caption text-xs text-accent font-medium">
                COMBO
              </span>
            </div>
          </div>
          <div className="font-data text-xl font-bold text-accent">
            {combo}x
          </div>
        </div>
      )}

      {/* Glyph Overload Meter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon 
              name="Zap" 
              size={16} 
              className={`${isOverloadActive ? 'text-warning animate-pulse' : 'text-accent'}`} 
            />
            <span className="font-heading font-medium text-sm text-card-foreground">
              Glyph Overload
            </span>
          </div>
          <span className="font-data text-sm font-medium text-accent">
            {Math.round(overloadPercentage)}%
          </span>
        </div>
        
        <div className="w-full bg-border rounded-full h-3">
          <div 
            className={`
              h-3 rounded-full transition-all duration-300
              ${isOverloadActive 
                ? 'bg-warning animate-pulse-glow' 
                : overloadPercentage >= 100 
                  ? 'bg-accent shadow-neon animate-pulse' 
                  : 'bg-accent'
              }
            `}
            style={{ width: `${overloadPercentage}%` }}
          />
        </div>
        
        {overloadPercentage >= 100 && !isOverloadActive && (
          <div className="text-center">
            <span className="font-caption text-xs text-accent font-medium animate-pulse">
              READY TO ACTIVATE!
            </span>
          </div>
        )}
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted rounded-lg p-3 text-center">
          <div className="font-data text-lg font-bold text-success mb-1">
            {wpm}
          </div>
          <div className="font-caption text-xs text-text-secondary">
            WPM
          </div>
        </div>
        
        <div className="bg-muted rounded-lg p-3 text-center">
          <div className="font-data text-lg font-bold text-warning mb-1">
            {accuracy}%
          </div>
          <div className="font-caption text-xs text-text-secondary">
            Accuracy
          </div>
        </div>
      </div>

      {/* Overload Mode Indicator */}
      {isOverloadActive && (
        <div className="bg-gradient-to-r from-warning/20 to-error/20 rounded-lg p-3 border border-warning/30 animate-pulse-glow">
          <div className="flex items-center justify-center space-x-2">
            <Icon name="Zap" size={20} className="text-warning animate-pulse" />
            <span className="font-heading font-bold text-warning">
              OVERLOAD ACTIVE
            </span>
            <Icon name="Zap" size={20} className="text-warning animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStats;