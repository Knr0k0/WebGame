import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SlowMotionControls = ({ 
  isActive = false,
  onToggle,
  onSpeedChange,
  onFrameStep,
  replayData = null,
  showReplay = false
}) => {
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);

  const speedOptions = [
    { value: 0.1, label: '0.1x', description: 'Ultra Slow' },
    { value: 0.25, label: '0.25x', description: 'Very Slow' },
    { value: 0.5, label: '0.5x', description: 'Half Speed' },
    { value: 0.75, label: '0.75x', description: 'Slow' },
    { value: 1.0, label: '1x', description: 'Normal' },
    { value: 1.5, label: '1.5x', description: 'Fast' },
    { value: 2.0, label: '2x', description: 'Double Speed' }
  ];

  useEffect(() => {
    if (replayData && replayData?.frames) {
      setTotalFrames(replayData?.frames?.length);
      setCurrentFrame(0);
    }
  }, [replayData]);

  useEffect(() => {
    let interval;
    if (isPlaying && showReplay && totalFrames > 0) {
      const frameRate = 60; // 60 FPS base
      const adjustedFrameRate = frameRate * playbackSpeed;
      const frameInterval = 1000 / adjustedFrameRate;

      interval = setInterval(() => {
        setCurrentFrame(prev => {
          if (prev >= totalFrames - 1) {
            setIsPlaying(false);
            return totalFrames - 1;
          }
          return prev + 1;
        });
      }, frameInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, totalFrames, showReplay]);

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    onSpeedChange?.(speed);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFrameStep = (direction) => {
    const newFrame = direction === 'forward' 
      ? Math.min(currentFrame + 1, totalFrames - 1)
      : Math.max(currentFrame - 1, 0);
    
    setCurrentFrame(newFrame);
    onFrameStep?.(newFrame, direction);
  };

  const handleSeek = (frameNumber) => {
    setCurrentFrame(frameNumber);
    setIsPlaying(false);
  };

  const formatTime = (frame, fps = 60) => {
    const seconds = frame / fps;
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60)?.toFixed(1);
    return `${mins}:${secs?.padStart(4, '0')}`;
  };

  const getProgressPercentage = () => {
    if (totalFrames === 0) return 0;
    return (currentFrame / (totalFrames - 1)) * 100;
  };

  return (
    <div className="w-full bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={20} className="text-accent" />
            <h3 className="font-heading font-bold text-lg text-card-foreground">
              Slow Motion Analysis
            </h3>
          </div>
          
          <Button
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={onToggle}
            iconName={isActive ? "Pause" : "Play"}
            iconPosition="left"
            iconSize={16}
            className={isActive 
              ? "bg-accent text-accent-foreground" 
              : "border-accent text-accent hover:bg-accent/10"
            }
          >
            {isActive ? 'Disable' : 'Enable'} Slow Motion
          </Button>
        </div>
      </div>
      {/* Controls */}
      <div className="p-4 space-y-6">
        {/* Speed Control */}
        <div className="space-y-3">
          <label className="font-body font-medium text-foreground">
            Playback Speed
          </label>
          
          <div className="grid grid-cols-4 lg:grid-cols-7 gap-2">
            {speedOptions?.map((option) => (
              <Button
                key={option?.value}
                variant={playbackSpeed === option?.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleSpeedChange(option?.value)}
                className={`
                  font-data text-xs
                  ${playbackSpeed === option?.value 
                    ? 'bg-accent text-accent-foreground' 
                    : 'border-border text-text-secondary hover:text-accent hover:border-accent'
                  }
                `}
              >
                {option?.label}
              </Button>
            ))}
          </div>
          
          <div className="text-center">
            <span className="font-caption text-sm text-text-secondary">
              Current: {speedOptions?.find(opt => opt?.value === playbackSpeed)?.description}
            </span>
          </div>
        </div>

        {/* Replay Controls */}
        {showReplay && replayData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-body font-medium text-foreground">
                Gesture Replay
              </h4>
              <div className="font-data text-sm text-text-secondary">
                Frame {currentFrame + 1} / {totalFrames}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-border rounded-full h-2 cursor-pointer">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-100"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs font-data text-text-secondary">
                <span>{formatTime(0)}</span>
                <span>{formatTime(currentFrame)}</span>
                <span>{formatTime(totalFrames - 1)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSeek(0)}
                disabled={currentFrame === 0}
                iconName="SkipBack"
                iconSize={16}
                className="text-text-secondary hover:text-accent"
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFrameStep('backward')}
                disabled={currentFrame === 0}
                iconName="ChevronLeft"
                iconSize={16}
                className="text-text-secondary hover:text-accent"
              />
              
              <Button
                variant="default"
                size="sm"
                onClick={handlePlayPause}
                iconName={isPlaying ? "Pause" : "Play"}
                iconSize={16}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFrameStep('forward')}
                disabled={currentFrame >= totalFrames - 1}
                iconName="ChevronRight"
                iconSize={16}
                className="text-text-secondary hover:text-accent"
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSeek(totalFrames - 1)}
                disabled={currentFrame >= totalFrames - 1}
                iconName="SkipForward"
                iconSize={16}
                className="text-text-secondary hover:text-accent"
              />
            </div>
          </div>
        )}

        {/* Analysis Features */}
        <div className="space-y-4">
          <h4 className="font-body font-medium text-foreground">
            Analysis Tools
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              fullWidth
              iconName="Target"
              iconPosition="left"
              iconSize={16}
              className="border-success text-success hover:bg-success/10"
            >
              Stroke Quality
            </Button>
            
            <Button
              variant="outline"
              fullWidth
              iconName="TrendingUp"
              iconPosition="left"
              iconSize={16}
              className="border-warning text-warning hover:bg-warning/10"
            >
              Speed Analysis
            </Button>
            
            <Button
              variant="outline"
              fullWidth
              iconName="Crosshair"
              iconPosition="left"
              iconSize={16}
              className="border-accent text-accent hover:bg-accent/10"
            >
              Accuracy Check
            </Button>
            
            <Button
              variant="outline"
              fullWidth
              iconName="RotateCcw"
              iconPosition="left"
              iconSize={16}
              className="border-text-secondary text-text-secondary hover:bg-muted"
            >
              Compare Gestures
            </Button>
          </div>
        </div>

        {/* Current Analysis */}
        {isActive && (
          <div className="p-4 bg-muted rounded-lg space-y-3">
            <div className="flex items-center space-x-2">
              <Icon name="Activity" size={16} className="text-accent" />
              <span className="font-body font-medium text-foreground">
                Live Analysis
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="font-data text-lg font-bold text-success">
                  87%
                </div>
                <div className="font-caption text-xs text-text-secondary">
                  Stroke Quality
                </div>
              </div>
              
              <div>
                <div className="font-data text-lg font-bold text-accent">
                  1.2s
                </div>
                <div className="font-caption text-xs text-text-secondary">
                  Execution Time
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <span className="font-body text-sm text-text-secondary">
                Analyzing at {playbackSpeed}x speed
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlowMotionControls;