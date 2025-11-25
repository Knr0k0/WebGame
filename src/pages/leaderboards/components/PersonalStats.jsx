import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PersonalStats = ({ userStats, onViewFullStats }) => {
  const achievements = [
    { 
      id: 1, 
      name: 'Speed Demon', 
      description: 'Reached 100+ WPM', 
      icon: 'Zap', 
      color: 'accent',
      earned: true,
      date: '11/10/2025'
    },
    { 
      id: 2, 
      name: 'Precision Master', 
      description: '98% accuracy streak', 
      icon: 'Target', 
      color: 'success',
      earned: true,
      date: '11/08/2025'
    },
    { 
      id: 3, 
      name: 'Marathon Runner', 
      description: '5+ hours practice', 
      icon: 'Clock', 
      color: 'warning',
      earned: false,
      progress: 78
    }
  ];

  const getProgressColor = (rank) => {
    if (rank <= 10) return 'text-warning';
    if (rank <= 50) return 'text-accent';
    if (rank <= 100) return 'text-success';
    return 'text-text-secondary';
  };

  return (
    <div className="space-y-6">
      {/* Personal Ranking Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading font-bold text-lg text-card-foreground">
            Your Performance
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewFullStats}
            iconName="BarChart3"
            iconPosition="left"
            iconSize={16}
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          >
            Full Stats
          </Button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <Image
            src={userStats?.avatar}
            alt={userStats?.avatarAlt}
            className="w-16 h-16 rounded-full object-cover border-2 border-accent"
          />
          <div className="flex-1">
            <h4 className="font-body font-bold text-xl text-card-foreground">
              {userStats?.username}
            </h4>
            <div className="flex items-center space-x-4 mt-1">
              <span className="font-caption text-sm text-text-secondary">
                Level {userStats?.level}
              </span>
              <span className={`font-data font-medium ${getProgressColor(userStats?.globalRank)}`}>
                #{userStats?.globalRank} Global
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="font-data text-2xl font-bold text-accent mb-1">
              {userStats?.bestWPM}
            </div>
            <div className="font-caption text-xs text-text-secondary">
              Best WPM
            </div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="font-data text-2xl font-bold text-success mb-1">
              {userStats?.accuracy}%
            </div>
            <div className="font-caption text-xs text-text-secondary">
              Accuracy
            </div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="font-data text-2xl font-bold text-warning mb-1">
              {userStats?.totalGames}
            </div>
            <div className="font-caption text-xs text-text-secondary">
              Games
            </div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="font-data text-2xl font-bold text-foreground mb-1">
              {userStats?.winRate}%
            </div>
            <div className="font-caption text-xs text-text-secondary">
              Win Rate
            </div>
          </div>
        </div>

        {/* Rank Progress */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-body font-medium text-foreground">
              Rank Progress
            </span>
            <span className="font-data text-sm text-text-secondary">
              {userStats?.rankChange > 0 ? '+' : ''}{userStats?.rankChange} this week
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Icon 
              name={userStats?.rankChange >= 0 ? "TrendingUp" : "TrendingDown"} 
              size={16} 
              className={userStats?.rankChange >= 0 ? "text-success" : "text-error"}
            />
            <div className="flex-1">
              <div className="w-full bg-border rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (1000 - userStats?.globalRank) / 10)}%` }}
                />
              </div>
            </div>
            <span className="font-data text-sm text-accent">
              Top {Math.ceil(userStats?.globalRank / 100) * 10}%
            </span>
          </div>
        </div>
      </div>
      {/* Recent Achievements */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-lg text-card-foreground">
            Recent Achievements
          </h3>
          <Button
            variant="ghost"
            size="sm"
            iconName="Award"
            iconSize={16}
            className="text-text-secondary hover:text-accent"
          >
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {achievements?.map((achievement) => (
            <div 
              key={achievement?.id}
              className={`
                flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
                ${achievement?.earned 
                  ? 'bg-muted hover:bg-muted/80' :'bg-muted/50 opacity-60'
                }
              `}
            >
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                ${achievement?.earned 
                  ? `bg-${achievement?.color}/10 border border-${achievement?.color}/20` 
                  : 'bg-border border border-border'
                }
              `}>
                <Icon 
                  name={achievement?.icon} 
                  size={20} 
                  className={achievement?.earned ? `text-${achievement?.color}` : 'text-text-secondary'}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`font-body font-medium ${achievement?.earned ? 'text-foreground' : 'text-text-secondary'}`}>
                    {achievement?.name}
                  </span>
                  {achievement?.earned && (
                    <Icon name="Check" size={14} className="text-success" />
                  )}
                </div>
                <p className="font-body text-sm text-text-secondary">
                  {achievement?.description}
                </p>
                {!achievement?.earned && achievement?.progress && (
                  <div className="mt-2">
                    <div className="w-full bg-border rounded-full h-1">
                      <div 
                        className="bg-accent h-1 rounded-full transition-all duration-500"
                        style={{ width: `${achievement?.progress}%` }}
                      />
                    </div>
                    <span className="font-caption text-xs text-text-secondary mt-1">
                      {achievement?.progress}% complete
                    </span>
                  </div>
                )}
              </div>
              {achievement?.earned && (
                <span className="font-caption text-xs text-text-secondary">
                  {achievement?.date}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalStats;