import React from 'react';
import Icon from '../../../components/AppIcon';

const GameHUD = ({ 
  score = 0,
  combo = 0,
  lives = 3,
  wave = 1,
  wpm = 0,
  accuracy = 100,
  glyphOverloadCharge = 0,
  isGlyphOverloadActive = false,
  timeElapsed = 0
}) => {
  const formatScore = (score) => {
    return score?.toLocaleString();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getComboColor = () => {
    if (combo >= 20) return 'text-error';
    if (combo >= 10) return 'text-warning';
    if (combo >= 5) return 'text-accent';
    return 'text-success';
  };

  const getOverloadBarColor = () => {
    const percentage = (glyphOverloadCharge / 100) * 100;
    if (percentage >= 100) return 'bg-error';
    if (percentage >= 75) return 'bg-warning';
    if (percentage >= 50) return 'bg-accent';
    return 'bg-success';
  };

  return (
    <>
      {/* Top HUD Bar */}
      <div className="fixed top-16 left-0 right-0 z-30 pointer-events-none">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left Stats */}
          <div className="flex items-center space-x-6 bg-card/80 backdrop-blur-sm border border-border rounded-lg px-4 py-2 shadow-neon">
            {/* Score */}
            <div className="text-center">
              <div className="font-data text-2xl font-bold text-accent">
                {formatScore(score)}
              </div>
              <div className="font-caption text-xs text-text-secondary">
                SCORE
              </div>
            </div>

            {/* Wave */}
            <div className="text-center">
              <div className="font-data text-xl font-bold text-warning">
                {wave}
              </div>
              <div className="font-caption text-xs text-text-secondary">
                WAVE
              </div>
            </div>

            {/* Lives */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: 3 }, (_, i) => (
                <Icon
                  key={i}
                  name="Heart"
                  size={20}
                  className={i < lives ? 'text-error' : 'text-border'}
                />
              ))}
            </div>
          </div>

          {/* Right Stats */}
          <div className="flex items-center space-x-6 bg-card/80 backdrop-blur-sm border border-border rounded-lg px-4 py-2 shadow-neon">
            {/* Time */}
            <div className="text-center">
              <div className="font-data text-lg font-bold text-foreground">
                {formatTime(timeElapsed)}
              </div>
              <div className="font-caption text-xs text-text-secondary">
                TIME
              </div>
            </div>

            {/* WPM */}
            <div className="text-center">
              <div className="font-data text-xl font-bold text-success">
                {wpm}
              </div>
              <div className="font-caption text-xs text-text-secondary">
                WPM
              </div>
            </div>

            {/* Accuracy */}
            <div className="text-center">
              <div className="font-data text-xl font-bold text-accent">
                {accuracy}%
              </div>
              <div className="font-caption text-xs text-text-secondary">
                ACC
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Combo Display */}
      {combo > 0 && (
        <div className="fixed top-32 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
          <div className={`
            bg-card/90 backdrop-blur-sm border border-border rounded-lg px-6 py-3 shadow-neon
            ${combo >= 10 ? 'animate-pulse-glow' : ''}
          `}>
            <div className="text-center">
              <div className={`font-data text-3xl font-bold ${getComboColor()}`}>
                {combo}x
              </div>
              <div className="font-caption text-sm text-text-secondary">
                COMBO
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Glyph Overload Charge Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 shadow-neon">
          <div className="flex items-center space-x-3">
            <Icon 
              name="Zap" 
              size={24} 
              className={`${isGlyphOverloadActive ? 'text-error animate-pulse' : 'text-accent'}`}
            />
            
            <div className="w-48 h-3 bg-border rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${getOverloadBarColor()}`}
                style={{ width: `${Math.min(100, (glyphOverloadCharge / 100) * 100)}%` }}
              />
            </div>
            
            <div className="font-data text-sm font-medium text-foreground min-w-[3rem]">
              {Math.floor(glyphOverloadCharge)}%
            </div>
          </div>
          
          <div className="text-center mt-2">
            <div className="font-caption text-xs text-text-secondary">
              {isGlyphOverloadActive ? 'GLYPH OVERLOAD ACTIVE!' : 'GLYPH OVERLOAD CHARGE'}
            </div>
          </div>
        </div>
      </div>

      {/* Glyph Overload Active Overlay */}
      {isGlyphOverloadActive && (
        <div className="fixed inset-0 pointer-events-none z-20">
          <div className="absolute inset-0 bg-gradient-to-r from-error/10 via-transparent to-error/10 animate-pulse" />
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-error via-warning to-error animate-pulse" />
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-error via-warning to-error animate-pulse" />
        </div>
      )}

      {/* Performance Indicators */}
      <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-30 pointer-events-none">
        <div className="space-y-3">
          {/* Gesture Quality Indicator */}
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 shadow-neon">
            <div className="text-center">
              <Icon name="Target" size={20} className="text-success mx-auto mb-1" />
              <div className="font-data text-sm font-bold text-success">
                GOOD
              </div>
              <div className="font-caption text-xs text-text-secondary">
                GESTURE
              </div>
            </div>
          </div>

          {/* Speed Indicator */}
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 shadow-neon">
            <div className="text-center">
              <Icon name="Gauge" size={20} className="text-accent mx-auto mb-1" />
              <div className="font-data text-sm font-bold text-accent">
                FAST
              </div>
              <div className="font-caption text-xs text-text-secondary">
                SPEED
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Stats Overlay */}
      <div className="fixed bottom-20 left-4 z-30 pointer-events-none lg:hidden">
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 shadow-neon">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <div className="font-data text-lg font-bold text-accent">
                {formatScore(score)}
              </div>
              <div className="font-caption text-xs text-text-secondary">
                SCORE
              </div>
            </div>
            <div>
              <div className="font-data text-lg font-bold text-success">
                {wpm}
              </div>
              <div className="font-caption text-xs text-text-secondary">
                WPM
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameHUD;