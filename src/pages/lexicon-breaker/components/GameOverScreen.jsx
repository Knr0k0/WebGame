import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GameOverScreen = ({ 
  isVisible,
  finalStats = {},
  onRestart,
  onExit
}) => {
  const navigate = useNavigate();
  const [showStats, setShowStats] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, name: "GestureKing", score: 2847500, wpm: 156, accuracy: 98.2 },
    { rank: 2, name: "NeonStroke", score: 2634200, wpm: 142, accuracy: 96.8 },
    { rank: 3, name: "CyberScribe", score: 2451800, wpm: 138, accuracy: 95.4 },
    { rank: 4, name: "QuantumType", score: 2298600, wpm: 134, accuracy: 94.7 },
    { rank: 5, name: "FluxWriter", score: 2187300, wpm: 129, accuracy: 93.9 }
  ];

  // Mock achievements unlocked
  const achievementsUnlocked = [
    { 
      id: 1, 
      name: "First Blood", 
      description: "Destroy your first enemy", 
      icon: "Target",
      color: "success",
      isNew: true 
    },
    { 
      id: 2, 
      name: "Combo Starter", 
      description: "Achieve a 5x combo", 
      icon: "Zap",
      color: "accent",
      isNew: finalStats?.bestCombo >= 5 
    },
    { 
      id: 3, 
      name: "Speed Demon", 
      description: "Reach 60+ WPM", 
      icon: "Gauge",
      color: "warning",
      isNew: finalStats?.bestWPM >= 60 
    }
  ];

  useEffect(() => {
    if (isVisible && finalStats?.score) {
      setShowStats(true);
      // Animate score counting
      const duration = 2000;
      const steps = 60;
      const increment = finalStats?.score / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= finalStats?.score) {
          setAnimatedScore(finalStats?.score);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, finalStats?.score]);

  const getRankMessage = () => {
    const score = finalStats?.score || 0;
    if (score >= 2000000) return { message: "LEGENDARY PERFORMANCE!", color: "text-error" };
    if (score >= 1000000) return { message: "OUTSTANDING RUN!", color: "text-warning" };
    if (score >= 500000) return { message: "EXCELLENT WORK!", color: "text-accent" };
    if (score >= 100000) return { message: "GREAT JOB!", color: "text-success" };
    return { message: "KEEP PRACTICING!", color: "text-foreground" };
  };

  const getPerformanceGrade = () => {
    const accuracy = finalStats?.accuracy || 0;
    const wpm = finalStats?.wpm || 0;
    
    if (accuracy >= 95 && wpm >= 80) return { grade: "S+", color: "text-error" };
    if (accuracy >= 90 && wpm >= 60) return { grade: "S", color: "text-warning" };
    if (accuracy >= 85 && wpm >= 40) return { grade: "A", color: "text-accent" };
    if (accuracy >= 75 && wpm >= 25) return { grade: "B", color: "text-success" };
    return { grade: "C", color: "text-foreground" };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  const rankMessage = getRankMessage();
  const performanceGrade = getPerformanceGrade();
  const newAchievements = achievementsUnlocked?.filter(a => a?.isNew);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg p-8 max-w-4xl w-full shadow-neon max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-error/10 border border-error/20 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Icon name="Zap" size={48} className="text-error" />
          </div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            Run Complete
          </h1>
          <p className={`font-heading font-medium text-xl ${rankMessage?.color}`}>
            {rankMessage?.message}
          </p>
        </div>

        {/* Performance Grade */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 ${performanceGrade?.color?.replace('text-', 'border-')} bg-${performanceGrade?.color?.replace('text-', '')}/10`}>
            <span className={`font-heading font-bold text-4xl ${performanceGrade?.color}`}>
              {performanceGrade?.grade}
            </span>
          </div>
        </div>

        {/* Final Stats */}
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="font-data text-3xl font-bold text-accent mb-1">
                {animatedScore?.toLocaleString()}
              </div>
              <div className="font-caption text-sm text-text-secondary">
                Final Score
              </div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="font-data text-3xl font-bold text-success mb-1">
                {finalStats?.bestWPM || 0}
              </div>
              <div className="font-caption text-sm text-text-secondary">
                Best WPM
              </div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="font-data text-3xl font-bold text-warning mb-1">
                {finalStats?.accuracy || 0}%
              </div>
              <div className="font-caption text-sm text-text-secondary">
                Accuracy
              </div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="font-data text-3xl font-bold text-foreground mb-1">
                {formatTime(finalStats?.timeElapsed || 0)}
              </div>
              <div className="font-caption text-sm text-text-secondary">
                Time Survived
              </div>
            </div>
          </div>
        )}

        {/* Additional Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="font-data text-xl font-bold text-accent">
              {finalStats?.bestCombo || 0}x
            </div>
            <div className="font-caption text-xs text-text-secondary">
              Max Combo
            </div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="font-data text-xl font-bold text-success">
              {finalStats?.enemiesDestroyed || 0}
            </div>
            <div className="font-caption text-xs text-text-secondary">
              Enemies Destroyed
            </div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="font-data text-xl font-bold text-warning">
              {finalStats?.wavesCompleted || 1}
            </div>
            <div className="font-caption text-xs text-text-secondary">
              Waves Completed
            </div>
          </div>
        </div>

        {/* New Achievements */}
        {newAchievements?.length > 0 && (
          <div className="mb-8">
            <h3 className="font-heading font-bold text-lg text-foreground mb-4 flex items-center">
              <Icon name="Award" size={20} className="text-accent mr-2" />
              Achievements Unlocked
            </h3>
            <div className="space-y-3">
              {newAchievements?.map((achievement) => (
                <div 
                  key={achievement?.id}
                  className="flex items-center space-x-3 p-3 bg-muted rounded-lg border border-accent/20 animate-pulse-glow"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${achievement?.color}/10 border border-${achievement?.color}/20`}>
                    <Icon name={achievement?.icon} size={20} className={`text-${achievement?.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-body font-medium text-foreground">
                      {achievement?.name}
                    </div>
                    <p className="font-body text-sm text-text-secondary">
                      {achievement?.description}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                    NEW
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard Position */}
        <div className="mb-8">
          <h3 className="font-heading font-bold text-lg text-foreground mb-4 flex items-center">
            <Icon name="Trophy" size={20} className="text-warning mr-2" />
            Leaderboard
          </h3>
          <div className="bg-muted rounded-lg p-4">
            <div className="space-y-2">
              {leaderboardData?.slice(0, 3)?.map((entry) => (
                <div 
                  key={entry?.rank}
                  className={`flex items-center justify-between p-2 rounded ${
                    entry?.score <= (finalStats?.score || 0) ? 'bg-accent/10 border border-accent/20' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-data font-bold text-warning w-6">
                      #{entry?.rank}
                    </span>
                    <span className="font-body font-medium text-foreground">
                      {entry?.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-data text-sm font-bold text-accent">
                      {entry?.score?.toLocaleString()}
                    </div>
                    <div className="font-caption text-xs text-text-secondary">
                      {entry?.wpm} WPM • {entry?.accuracy}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="default"
            onClick={onRestart}
            iconName="RotateCcw"
            iconPosition="left"
            iconSize={16}
            className="bg-accent text-accent-foreground hover:bg-accent/90 px-8"
          >
            Play Again
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/leaderboards')}
            iconName="Trophy"
            iconPosition="left"
            iconSize={16}
            className="border-warning text-warning hover:bg-warning/10"
          >
            View Leaderboards
          </Button>

          <Button
            variant="outline"
            onClick={onExit}
            iconName="Home"
            iconPosition="left"
            iconSize={16}
            className="border-text-secondary text-text-secondary hover:bg-muted"
          >
            Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;