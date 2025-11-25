import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContinueSession = () => {
  const navigate = useNavigate();

  const lastSession = {
    mode: "Glyph Story Mode",
    chapter: "Chapter 3: Advanced Curves",
    progress: 67,
    timeSpent: 23, // minutes
    lastPlayed: "2 hours ago",
    nextObjective: "Master the S-curve gesture sequence",
    difficulty: "Intermediate",
    icon: "BookOpen",
    color: "success",
    path: "/glyph-story-mode"
  };

  const quickActions = [
    {
      label: "Quick Practice",
      description: "5-minute warm-up session",
      icon: "Clock",
      color: "accent",
      path: "/practice-lab",
      duration: "5 min"
    },
    {
      label: "Daily Challenge",
      description: "Today\'s special challenge",
      icon: "Calendar",
      color: "warning",
      path: "/daily-run",
      status: "Available"
    }
  ];

  const handleContinueSession = () => {
    navigate(lastSession?.path);
  };

  const handleQuickAction = (path) => {
    navigate(path);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-transparent" />
        <div className="absolute top-0 right-0 w-24 h-24 border border-success/10 rounded-full -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border border-success/10 rounded-full translate-y-16 -translate-x-16" />
      </div>
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-success/10 border border-success/20 rounded-lg flex items-center justify-center">
            <Icon name="Play" size={16} className="text-success" />
          </div>
          <h3 className="font-heading font-bold text-lg text-card-foreground">
            Continue Learning
          </h3>
        </div>

        {/* Last Session Card */}
        <div className="bg-muted rounded-lg p-4 mb-6 hover:bg-muted/80 transition-colors duration-200 cursor-pointer" onClick={handleContinueSession}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                bg-${lastSession?.color}/10 border border-${lastSession?.color}/20
              `}>
                <Icon name={lastSession?.icon} size={20} className={`text-${lastSession?.color}`} />
              </div>
              <div>
                <h4 className="font-body font-medium text-foreground">
                  {lastSession?.mode}
                </h4>
                <span className="font-caption text-sm text-text-secondary">
                  {lastSession?.chapter}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-caption text-xs text-text-secondary">
                {lastSession?.lastPlayed}
              </span>
              <div className="font-caption text-xs text-success">
                {lastSession?.difficulty}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="font-caption text-xs text-text-secondary">
                Chapter Progress
              </span>
              <span className="font-data text-xs text-success font-medium">
                {lastSession?.progress}%
              </span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div 
                className="bg-success h-2 rounded-full transition-all duration-500"
                style={{ width: `${lastSession?.progress}%` }}
              />
            </div>
          </div>

          {/* Next Objective */}
          <div className="mb-4">
            <span className="font-caption text-xs text-text-secondary uppercase tracking-wide">
              Next Objective
            </span>
            <p className="font-body text-sm text-foreground mt-1">
              {lastSession?.nextObjective}
            </p>
          </div>

          {/* Continue Button */}
          <Button
            variant="default"
            fullWidth
            iconName="ArrowRight"
            iconPosition="right"
            iconSize={16}
            className="bg-success text-success-foreground hover:bg-success/90"
          >
            Continue Session ({lastSession?.timeSpent}m played)
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h4 className="font-body font-medium text-foreground flex items-center space-x-2">
            <Icon name="Zap" size={16} className="text-accent" />
            <span>Quick Actions</span>
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions?.map((action, index) => (
              <div
                key={index}
                className="bg-muted/50 rounded-lg p-3 hover:bg-muted transition-colors duration-200 cursor-pointer"
                onClick={() => handleQuickAction(action?.path)}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center
                    bg-${action?.color}/10 border border-${action?.color}/20
                  `}>
                    <Icon name={action?.icon} size={16} className={`text-${action?.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-body font-medium text-foreground text-sm">
                        {action?.label}
                      </span>
                      <span className={`font-caption text-xs text-${action?.color} font-medium`}>
                        {action?.duration || action?.status}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="font-body text-xs text-text-secondary ml-11">
                  {action?.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinueSession;