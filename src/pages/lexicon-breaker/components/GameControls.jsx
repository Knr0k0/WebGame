import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GameControls = ({ 
  isGameActive,
  isPaused,
  onStart,
  onPause,
  onResume,
  onRestart,
  onExit,
  gameStats = {}
}) => {
  const [showInstructions, setShowInstructions] = useState(false);

  const instructions = [
    {
      icon: 'MousePointer2',
      title: 'Draw Gestures',
      description: 'Use mouse or touch to draw shorthand gestures on the canvas'
    },
    {
      icon: 'Target',
      title: 'Hit Enemies',
      description: 'Draw gestures that intersect with floating word enemies to destroy them'
    },
    {
      icon: 'Zap',
      title: 'Build Combos',
      description: 'Chain successful hits to build combo multipliers and charge Glyph Overload'
    },
    {
      icon: 'Gauge',
      title: 'Increase Speed',
      description: 'Draw faster and more accurately to improve your WPM and score'
    }
  ];

  if (!isGameActive && !isPaused) {
    return (
      <div className="fixed inset-0 z-40 bg-background flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-6">
          {/* Game Logo */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4 shadow-neon">
              <Icon name="Zap" size={48} className="text-accent-foreground" />
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-2">
              Lexicon Breaker
            </h1>
            <p className="font-body text-lg text-text-secondary">
              Infinite arcade mode with escalating difficulty
            </p>
          </div>

          {/* Game Stats Preview */}
          {Object.keys(gameStats)?.length > 0 && (
            <div className="mb-8 p-6 bg-card border border-border rounded-lg shadow-neon">
              <h3 className="font-heading font-bold text-lg text-card-foreground mb-4">
                Previous Best
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="font-data text-2xl font-bold text-accent">
                    {gameStats?.bestScore?.toLocaleString() || '0'}
                  </div>
                  <div className="font-caption text-xs text-text-secondary">
                    HIGH SCORE
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-data text-2xl font-bold text-success">
                    {gameStats?.bestWPM || '0'}
                  </div>
                  <div className="font-caption text-xs text-text-secondary">
                    BEST WPM
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-data text-2xl font-bold text-warning">
                    {gameStats?.bestWave || '1'}
                  </div>
                  <div className="font-caption text-xs text-text-secondary">
                    BEST WAVE
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-data text-2xl font-bold text-foreground">
                    {gameStats?.bestCombo || '0'}x
                  </div>
                  <div className="font-caption text-xs text-text-secondary">
                    MAX COMBO
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            <Button
              variant="default"
              size="lg"
              onClick={onStart}
              iconName="Play"
              iconPosition="left"
              iconSize={20}
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-neon w-full md:w-auto px-12"
            >
              Start New Run
            </Button>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => setShowInstructions(true)}
                iconName="HelpCircle"
                iconPosition="left"
                iconSize={16}
                className="border-text-secondary text-text-secondary hover:bg-muted"
              >
                How to Play
              </Button>

              <Button
                variant="outline"
                onClick={onExit}
                iconName="ArrowLeft"
                iconPosition="left"
                iconSize={16}
                className="border-text-secondary text-text-secondary hover:bg-muted"
              >
                Back to Menu
              </Button>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="text-left bg-muted rounded-lg p-4">
            <h4 className="font-heading font-medium text-foreground mb-3 flex items-center">
              <Icon name="Lightbulb" size={16} className="text-accent mr-2" />
              Quick Tips
            </h4>
            <ul className="space-y-2 font-body text-sm text-text-secondary">
              <li className="flex items-start">
                <Icon name="ChevronRight" size={14} className="text-accent mt-0.5 mr-2 flex-shrink-0" />
                Draw smooth, confident strokes for better gesture recognition
              </li>
              <li className="flex items-start">
                <Icon name="ChevronRight" size={14} className="text-accent mt-0.5 mr-2 flex-shrink-0" />
                Target multiple enemies with single gestures for combo bonuses
              </li>
              <li className="flex items-start">
                <Icon name="ChevronRight" size={14} className="text-accent mt-0.5 mr-2 flex-shrink-0" />
                Charge Glyph Overload for devastating area attacks
              </li>
            </ul>
          </div>
        </div>
        {/* Instructions Modal */}
        {showInstructions && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full shadow-neon">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-2xl text-card-foreground">
                  How to Play
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInstructions(false)}
                  iconName="X"
                  iconSize={16}
                  className="text-text-secondary hover:text-accent"
                />
              </div>

              <div className="space-y-6">
                {instructions?.map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name={instruction?.icon} size={24} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="font-heading font-medium text-lg text-card-foreground mb-1">
                        {instruction?.title}
                      </h3>
                      <p className="font-body text-text-secondary">
                        {instruction?.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <Button
                  variant="default"
                  fullWidth
                  onClick={() => {
                    setShowInstructions(false);
                    onStart();
                  }}
                  iconName="Play"
                  iconPosition="left"
                  iconSize={16}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Start Playing
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default GameControls;