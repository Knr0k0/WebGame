import React from 'react';
import Icon from '../../../components/AppIcon';

const DailyProgress = ({ progressData }) => {
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'accent';
  };

  const achievements = [
    {
      id: 1,
      name: "First Blood",
      description: "Complete first gesture",
      icon: "Zap",
      completed: progressData?.gesturesCompleted > 0,
      progress: Math.min(progressData?.gesturesCompleted, 1),
      target: 1
    },
    {
      id: 2,
      name: "Speed Demon",
      description: "Reach 60+ WPM",
      icon: "Gauge",
      completed: progressData?.bestWPM >= 60,
      progress: Math.min(progressData?.bestWPM, 60),
      target: 60
    },
    {
      id: 3,
      name: "Accuracy Master",
      description: "Maintain 90% accuracy",
      icon: "Target",
      completed: progressData?.accuracy >= 90,
      progress: Math.min(progressData?.accuracy, 90),
      target: 90
    },
    {
      id: 4,
      name: "Combo King",
      description: "Achieve 10x combo",
      icon: "Flame",
      completed: progressData?.bestCombo >= 10,
      progress: Math.min(progressData?.bestCombo, 10),
      target: 10
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-lg text-card-foreground">
          Daily Progress
        </h3>
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={16} className="text-success" />
          <span className="font-caption text-sm text-success">
            {progressData?.completionPercentage}% Complete
          </span>
        </div>
      </div>
      {/* Overall Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-body text-sm text-card-foreground">
            Challenge Progress
          </span>
          <span className="font-data text-sm text-accent">
            {progressData?.currentScore?.toLocaleString()} / {progressData?.targetScore?.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-3">
          <div 
            className={`
              h-3 rounded-full transition-all duration-500
              bg-${getProgressColor(progressData?.completionPercentage)}
            `}
            style={{ width: `${Math.min(progressData?.completionPercentage, 100)}%` }}
          />
        </div>
      </div>
      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="font-data text-xl font-bold text-accent mb-1">
            {progressData?.gesturesCompleted}
          </div>
          <div className="font-caption text-xs text-text-secondary">
            Gestures
          </div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="font-data text-xl font-bold text-success mb-1">
            {progressData?.bestWPM}
          </div>
          <div className="font-caption text-xs text-text-secondary">
            Best WPM
          </div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="font-data text-xl font-bold text-warning mb-1">
            {progressData?.accuracy}%
          </div>
          <div className="font-caption text-xs text-text-secondary">
            Accuracy
          </div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="font-data text-xl font-bold text-error mb-1">
            {progressData?.bestCombo}x
          </div>
          <div className="font-caption text-xs text-text-secondary">
            Best Combo
          </div>
        </div>
      </div>
      {/* Daily Achievements */}
      <div className="space-y-3">
        <h4 className="font-heading font-medium text-card-foreground flex items-center space-x-2">
          <Icon name="Award" size={16} className="text-accent" />
          <span>Daily Achievements</span>
        </h4>
        
        <div className="space-y-2">
          {achievements?.map((achievement) => (
            <div 
              key={achievement?.id}
              className={`
                flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
                ${achievement?.completed 
                  ? 'bg-success/10 border border-success/20' :'bg-muted'
                }
              `}
            >
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center
                ${achievement?.completed 
                  ? 'bg-success/20 text-success' :'bg-border text-text-secondary'
                }
              `}>
                <Icon name={achievement?.icon} size={16} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`
                    font-body font-medium
                    ${achievement?.completed ? 'text-success' : 'text-card-foreground'}
                  `}>
                    {achievement?.name}
                  </span>
                  {achievement?.completed && (
                    <Icon name="CheckCircle" size={14} className="text-success" />
                  )}
                </div>
                <p className="font-body text-xs text-text-secondary">
                  {achievement?.description}
                </p>
                
                {!achievement?.completed && (
                  <div className="mt-1 w-full bg-border rounded-full h-1">
                    <div 
                      className="bg-accent h-1 rounded-full transition-all duration-300"
                      style={{ width: `${(achievement?.progress / achievement?.target) * 100}%` }}
                    />
                  </div>
                )}
              </div>
              
              {!achievement?.completed && (
                <span className="font-data text-xs text-text-secondary">
                  {achievement?.progress}/{achievement?.target}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Reward Eligibility */}
      <div className={`
        p-4 rounded-lg border
        ${progressData?.completionPercentage >= 100
          ? 'bg-success/10 border-success/20' :'bg-warning/10 border-warning/20'
        }
      `}>
        <div className="flex items-center space-x-2 mb-2">
          <Icon 
            name={progressData?.completionPercentage >= 100 ? "Gift" : "Clock"} 
            size={16} 
            className={progressData?.completionPercentage >= 100 ? "text-success" : "text-warning"} 
          />
          <span className={`
            font-heading font-medium
            ${progressData?.completionPercentage >= 100 ? 'text-success' : 'text-warning'}
          `}>
            {progressData?.completionPercentage >= 100 ? 'Rewards Available!' : 'Reward Progress'}
          </span>
        </div>
        <p className="font-body text-sm text-text-secondary">
          {progressData?.completionPercentage >= 100
            ? 'Congratulations! You\'ve earned today\'s daily rewards. Claim them now!'
            : `Complete ${100 - progressData?.completionPercentage}% more to unlock daily rewards.`
          }
        </p>
      </div>
    </div>
  );
};

export default DailyProgress;