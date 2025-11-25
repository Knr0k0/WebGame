import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const InGameNavigation = ({ 
  gameMode = 'practice',
  isPaused = false,
  onPause,
  onResume,
  onRestart,
  showStats = true,
  stats = {}
}) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
      navigate('/main-menu');
    }
  };

  const handlePauseToggle = () => {
    if (isPaused) {
      onResume?.();
    } else {
      onPause?.();
    }
    setIsMenuOpen(false);
  };

  const handleRestart = () => {
    if (window.confirm('Restart current session? Your progress will be reset.')) {
      onRestart?.();
      setIsMenuOpen(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Left: Game Mode Info */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(true)}
              iconName="Menu"
              iconSize={18}
              className="text-text-secondary hover:text-accent"
            />
            <div className="hidden sm:block">
              <span className="font-heading font-medium text-sm text-foreground capitalize">
                {gameMode?.replace('-', ' ')} Mode
              </span>
            </div>
          </div>

          {/* Center: Stats (if enabled) */}
          {showStats && (
            <div className="hidden md:flex items-center space-x-6">
              {stats?.wpm !== undefined && (
                <div className="text-center">
                  <div className="font-data text-lg font-medium text-accent">
                    {stats?.wpm}
                  </div>
                  <div className="font-caption text-xs text-text-secondary">
                    WPM
                  </div>
                </div>
              )}
              {stats?.accuracy !== undefined && (
                <div className="text-center">
                  <div className="font-data text-lg font-medium text-success">
                    {stats?.accuracy}%
                  </div>
                  <div className="font-caption text-xs text-text-secondary">
                    Accuracy
                  </div>
                </div>
              )}
              {stats?.time !== undefined && (
                <div className="text-center">
                  <div className="font-data text-lg font-medium text-warning">
                    {formatTime(stats?.time)}
                  </div>
                  <div className="font-caption text-xs text-text-secondary">
                    Time
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Right: Quick Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePauseToggle}
              iconName={isPaused ? "Play" : "Pause"}
              iconSize={16}
              className="text-text-secondary hover:text-accent"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExit}
              iconName="X"
              iconSize={16}
              className="text-text-secondary hover:text-error"
            />
          </div>
        </div>
      </div>
      {/* Pause Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4 shadow-neon">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-xl text-card-foreground">
                Game Menu
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(false)}
                iconName="X"
                iconSize={16}
                className="text-text-secondary hover:text-accent"
              />
            </div>

            {/* Stats Display (Mobile) */}
            {showStats && (
              <div className="md:hidden mb-6 p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  {stats?.wpm !== undefined && (
                    <div>
                      <div className="font-data text-xl font-medium text-accent">
                        {stats?.wpm}
                      </div>
                      <div className="font-caption text-xs text-text-secondary">
                        WPM
                      </div>
                    </div>
                  )}
                  {stats?.accuracy !== undefined && (
                    <div>
                      <div className="font-data text-xl font-medium text-success">
                        {stats?.accuracy}%
                      </div>
                      <div className="font-caption text-xs text-text-secondary">
                        Accuracy
                      </div>
                    </div>
                  )}
                  {stats?.time !== undefined && (
                    <div>
                      <div className="font-data text-xl font-medium text-warning">
                        {formatTime(stats?.time)}
                      </div>
                      <div className="font-caption text-xs text-text-secondary">
                        Time
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Menu Actions */}
            <div className="space-y-3">
              <Button
                variant="default"
                fullWidth
                onClick={handlePauseToggle}
                iconName={isPaused ? "Play" : "Pause"}
                iconPosition="left"
                iconSize={16}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {isPaused ? 'Resume Game' : 'Pause Game'}
              </Button>

              <Button
                variant="outline"
                fullWidth
                onClick={handleRestart}
                iconName="RotateCcw"
                iconPosition="left"
                iconSize={16}
                className="border-warning text-warning hover:bg-warning/10"
              >
                Restart Session
              </Button>

              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate('/main-menu')}
                iconName="Home"
                iconPosition="left"
                iconSize={16}
                className="border-text-secondary text-text-secondary hover:bg-muted"
              >
                Main Menu
              </Button>

              <Button
                variant="outline"
                fullWidth
                onClick={handleExit}
                iconName="LogOut"
                iconPosition="left"
                iconSize={16}
                className="border-error text-error hover:bg-error/10"
              >
                Exit Game
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Floating Quick Stats (Bottom Right) */}
      {showStats && !isMenuOpen && (
        <div className="fixed bottom-4 right-4 z-30 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-neon">
          <div className="flex items-center space-x-4 text-sm">
            {stats?.combo !== undefined && stats?.combo > 0 && (
              <div className="flex items-center space-x-1">
                <Icon name="Zap" size={14} className="text-accent" />
                <span className="font-data text-accent font-medium">
                  {stats?.combo}x
                </span>
              </div>
            )}
            {stats?.score !== undefined && (
              <div className="flex items-center space-x-1">
                <Icon name="Target" size={14} className="text-success" />
                <span className="font-data text-success font-medium">
                  {stats?.score?.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default InGameNavigation;