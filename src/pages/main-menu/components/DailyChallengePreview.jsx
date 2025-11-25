import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DailyChallengePreview = () => {
  const navigate = useNavigate();

  const todayChallenge = {
    id: "daily-2025-11-15",
    title: "Speed Demon Challenge",
    description: "Master rapid gesture sequences with increasing complexity",
    difficulty: "Expert",
    timeRemaining: "18h 32m",
    participants: 1247,
    topScore: 94580,
    rewards: [
      { type: "XP", amount: 500, icon: "Star" },
      { type: "Badge", name: "Speed Master", icon: "Zap" },
      { type: "Theme", name: "Neon Pulse", icon: "Palette" }
    ],
    modifiers: [
      "Double Speed Mode",
      "Combo Multiplier x3",
      "Precision Penalty"
    ]
  };

  const handleJoinChallenge = () => {
    navigate('/daily-run');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-32 border border-accent/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 border border-accent/10 rounded-full translate-y-12 -translate-x-12" />
      </div>
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-card-foreground">
                Daily Challenge
              </h3>
              <div className="flex items-center space-x-2">
                <span className="font-caption text-sm text-error font-medium">
                  {todayChallenge?.difficulty}
                </span>
                <span className="text-text-secondary">•</span>
                <span className="font-data text-sm text-warning">
                  {todayChallenge?.timeRemaining} left
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-data text-sm text-text-secondary">
              {todayChallenge?.participants?.toLocaleString()} players
            </div>
            <div className="font-data text-xs text-accent">
              Top: {todayChallenge?.topScore?.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Challenge Title and Description */}
        <div className="mb-6">
          <h4 className="font-heading font-bold text-xl text-accent mb-2">
            {todayChallenge?.title}
          </h4>
          <p className="font-body text-text-secondary leading-relaxed">
            {todayChallenge?.description}
          </p>
        </div>

        {/* Modifiers */}
        <div className="mb-6">
          <h5 className="font-body font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="Settings" size={16} className="text-warning" />
            <span>Challenge Modifiers</span>
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {todayChallenge?.modifiers?.map((modifier, index) => (
              <div key={index} className="bg-muted rounded-md px-3 py-2">
                <span className="font-caption text-sm text-text-secondary">
                  {modifier}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards */}
        <div className="mb-6">
          <h5 className="font-body font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="Gift" size={16} className="text-success" />
            <span>Rewards</span>
          </h5>
          <div className="flex flex-wrap gap-3">
            {todayChallenge?.rewards?.map((reward, index) => (
              <div key={index} className="flex items-center space-x-2 bg-muted rounded-md px-3 py-2">
                <Icon name={reward?.icon} size={14} className="text-accent" />
                <span className="font-caption text-sm text-text-secondary">
                  {reward?.type === 'XP' ? `${reward?.amount} XP` : reward?.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="default"
            onClick={handleJoinChallenge}
            iconName="Play"
            iconPosition="left"
            iconSize={16}
            className="bg-accent text-accent-foreground hover:bg-accent/90 flex-1"
          >
            Join Challenge
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/leaderboards')}
            iconName="Trophy"
            iconPosition="left"
            iconSize={16}
            className="border-warning text-warning hover:bg-warning/10"
          >
            View Rankings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DailyChallengePreview;