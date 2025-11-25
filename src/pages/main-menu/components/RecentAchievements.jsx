import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentAchievements = () => {
  const achievements = [
    {
      id: 1,
      name: "Gesture Master",
      description: "Complete 100 perfect gesture sequences",
      icon: "Target",
      color: "success",
      isNew: true,
      unlockedAt: "2 hours ago",
      progress: 100,
      rarity: "Epic"
    },
    {
      id: 2,
      name: "Speed Demon",
      description: "Reach 90+ WPM in any mode",
      icon: "Zap",
      color: "accent",
      isNew: true,
      unlockedAt: "1 day ago",
      progress: 100,
      rarity: "Rare"
    },
    {
      id: 3,
      name: "Combo King",
      description: "Achieve 50x combo multiplier",
      icon: "Flame",
      color: "warning",
      isNew: false,
      unlockedAt: "3 days ago",
      progress: 100,
      rarity: "Common"
    }
  ];

  const inProgressAchievements = [
    {
      id: 4,
      name: "Marathon Runner",
      description: "Practice for 10 hours total",
      icon: "Clock",
      color: "accent",
      progress: 73,
      current: 7.3,
      target: 10,
      unit: "hours"
    },
    {
      id: 5,
      name: "Precision Expert",
      description: "Maintain 95% accuracy for 20 sessions",
      icon: "Crosshair",
      color: "success",
      progress: 45,
      current: 9,
      target: 20,
      unit: "sessions"
    }
  ];

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Epic': return 'text-error';
      case 'Rare': return 'text-accent';
      case 'Common': return 'text-success';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-success/10 border border-success/20 rounded-lg flex items-center justify-center">
            <Icon name="Award" size={16} className="text-success" />
          </div>
          <h3 className="font-heading font-bold text-lg text-card-foreground">
            Recent Achievements
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="ExternalLink"
          iconSize={14}
          className="text-text-secondary hover:text-accent"
        >
          View All
        </Button>
      </div>
      {/* Completed Achievements */}
      <div className="space-y-3 mb-6">
        {achievements?.map((achievement) => (
          <div 
            key={achievement?.id}
            className="flex items-center space-x-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors duration-200 relative overflow-hidden"
          >
            {/* Achievement Icon */}
            <div className={`
              w-12 h-12 rounded-lg flex items-center justify-center
              bg-${achievement?.color}/10 border border-${achievement?.color}/20
              relative z-10
            `}>
              <Icon 
                name={achievement?.icon} 
                size={20} 
                className={`text-${achievement?.color}`}
              />
            </div>

            {/* Achievement Info */}
            <div className="flex-1 relative z-10">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-body font-medium text-foreground">
                  {achievement?.name}
                </span>
                {achievement?.isNew && (
                  <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full animate-pulse-glow">
                    NEW
                  </span>
                )}
                <span className={`font-caption text-xs ${getRarityColor(achievement?.rarity)} font-medium`}>
                  {achievement?.rarity}
                </span>
              </div>
              <p className="font-body text-sm text-text-secondary mb-1">
                {achievement?.description}
              </p>
              <span className="font-caption text-xs text-text-secondary">
                Unlocked {achievement?.unlockedAt}
              </span>
            </div>

            {/* Completion Badge */}
            <div className="relative z-10">
              <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                <Icon name="Check" size={16} className="text-success-foreground" />
              </div>
            </div>

            {/* Glow Effect for New Achievements */}
            {achievement?.isNew && (
              <div className={`
                absolute inset-0 rounded-lg opacity-20
                bg-gradient-to-r from-${achievement?.color}/10 to-transparent
                animate-pulse-glow
              `} />
            )}
          </div>
        ))}
      </div>
      {/* In Progress Achievements */}
      <div>
        <h4 className="font-body font-medium text-foreground mb-3 flex items-center space-x-2">
          <Icon name="TrendingUp" size={16} className="text-warning" />
          <span>In Progress</span>
        </h4>
        <div className="space-y-3">
          {inProgressAchievements?.map((achievement) => (
            <div 
              key={achievement?.id}
              className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg"
            >
              {/* Achievement Icon */}
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                bg-${achievement?.color}/10 border border-${achievement?.color}/20
              `}>
                <Icon 
                  name={achievement?.icon} 
                  size={18} 
                  className={`text-${achievement?.color}`}
                />
              </div>

              {/* Achievement Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-body font-medium text-foreground text-sm">
                    {achievement?.name}
                  </span>
                  <span className="font-data text-xs text-text-secondary">
                    {achievement?.current}/{achievement?.target} {achievement?.unit}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-border rounded-full h-2 mb-1">
                  <div 
                    className={`bg-${achievement?.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${achievement?.progress}%` }}
                  />
                </div>
                
                <p className="font-body text-xs text-text-secondary">
                  {achievement?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentAchievements;