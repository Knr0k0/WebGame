import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickStats = () => {
  const navigate = useNavigate();

  const userStats = {
    level: 12,
    xp: 8450,
    xpToNext: 2550,
    totalSessions: 89,
    averageWPM: 74,
    bestWPM: 108,
    accuracy: 94.2,
    totalTime: 2847, // in minutes
    globalRank: 342,
    weeklyRank: 28,
    streakDays: 7,
    achievements: 23
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getXPProgress = () => {
    const totalXPForLevel = userStats?.xp + userStats?.xpToNext;
    return (userStats?.xp / totalXPForLevel) * 100;
  };

  const statCards = [
    {
      label: "Best WPM",
      value: userStats?.bestWPM,
      icon: "Zap",
      color: "accent",
      trend: "+12 this week"
    },
    {
      label: "Accuracy",
      value: `${userStats?.accuracy}%`,
      icon: "Target",
      color: "success",
      trend: "+2.1% this week"
    },
    {
      label: "Global Rank",
      value: `#${userStats?.globalRank}`,
      icon: "Trophy",
      color: "warning",
      trend: "↑15 positions"
    },
    {
      label: "Streak",
      value: `${userStats?.streakDays} days`,
      icon: "Flame",
      color: "error",
      trend: "Keep it up!"
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center">
            <Icon name="BarChart3" size={16} className="text-accent" />
          </div>
          <h3 className="font-heading font-bold text-lg text-card-foreground">
            Your Progress
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/practice-lab')}
          iconName="TrendingUp"
          iconSize={14}
          className="text-text-secondary hover:text-accent"
        >
          Detailed Stats
        </Button>
      </div>
      {/* Level and XP Progress */}
      <div className="mb-6 p-4 bg-muted rounded-lg relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-16 h-16 border border-accent rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border border-accent rounded-full translate-y-6 -translate-x-6" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Icon name="Star" size={20} className="text-accent-foreground" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-xl text-foreground">
                  Level {userStats?.level}
                </h4>
                <span className="font-caption text-sm text-text-secondary">
                  Gesture Master
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-data text-lg font-bold text-accent">
                {userStats?.xp?.toLocaleString()} XP
              </div>
              <div className="font-caption text-xs text-text-secondary">
                {userStats?.xpToNext?.toLocaleString()} to next
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="w-full bg-border rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-accent to-accent/80 h-3 rounded-full transition-all duration-1000 shadow-neon"
              style={{ width: `${getXPProgress()}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-text-secondary font-caption">
            <span>Level {userStats?.level}</span>
            <span>Level {userStats?.level + 1}</span>
          </div>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {statCards?.map((stat, index) => (
          <div key={index} className="bg-muted rounded-lg p-4 hover:bg-muted/80 transition-colors duration-200">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name={stat?.icon} size={16} className={`text-${stat?.color}`} />
              <span className="font-caption text-xs text-text-secondary uppercase tracking-wide">
                {stat?.label}
              </span>
            </div>
            <div className={`font-data text-xl font-bold text-${stat?.color} mb-1`}>
              {stat?.value}
            </div>
            <div className="font-caption text-xs text-text-secondary">
              {stat?.trend}
            </div>
          </div>
        ))}
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="default"
          fullWidth
          onClick={() => navigate('/practice-lab')}
          iconName="Target"
          iconPosition="left"
          iconSize={16}
          className="bg-success text-success-foreground hover:bg-success/90"
        >
          <div className="text-left">
            <div className="font-medium">Continue Practice</div>
            <div className="text-xs opacity-80">Improve your skills</div>
          </div>
        </Button>

        <Button
          variant="outline"
          fullWidth
          onClick={() => navigate('/leaderboards')}
          iconName="Trophy"
          iconPosition="left"
          iconSize={16}
          className="border-warning text-warning hover:bg-warning/10"
        >
          <div className="text-left">
            <div className="font-medium">View Rankings</div>
            <div className="text-xs opacity-80">Check your position</div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default QuickStats;