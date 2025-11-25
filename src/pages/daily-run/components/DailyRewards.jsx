import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DailyRewards = ({ isEligible, onClaimReward }) => {
  const [claimedRewards, setClaimedRewards] = useState([]);

  const rewards = [
    {
      id: 1,
      type: 'xp',
      name: 'Experience Points',
      description: 'Bonus XP for daily participation',
      value: '500 XP',
      icon: 'Star',
      color: 'accent',
      requirement: 'Complete daily challenge'
    },
    {
      id: 2,
      type: 'theme',
      name: 'Neon Pulse Theme',
      description: 'Exclusive daily theme unlock',
      value: 'Theme Unlock',
      icon: 'Palette',
      color: 'success',
      requirement: 'Achieve 80%+ accuracy'
    },
    {
      id: 3,
      type: 'currency',
      name: 'Gesture Coins',
      description: 'In-game currency for upgrades',
      value: '250 Coins',
      icon: 'Coins',
      color: 'warning',
      requirement: 'Reach top 50% ranking'
    },
    {
      id: 4,
      type: 'title',
      name: 'Daily Champion',
      description: 'Special title for 24 hours',
      value: 'Title Badge',
      icon: 'Crown',
      color: 'error',
      requirement: 'Finish in top 10'
    }
  ];

  const handleClaimReward = (reward) => {
    if (!isEligible || claimedRewards?.includes(reward?.id)) return;
    
    setClaimedRewards(prev => [...prev, reward?.id]);
    onClaimReward?.(reward);
  };

  const isRewardClaimed = (rewardId) => claimedRewards?.includes(rewardId);

  const getRewardStatus = (reward) => {
    if (!isEligible) return 'locked';
    if (isRewardClaimed(reward?.id)) return 'claimed';
    return 'available';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-lg text-card-foreground flex items-center space-x-2">
          <Icon name="Gift" size={20} className="text-accent" />
          <span>Daily Rewards</span>
        </h3>
        <div className={`
          px-3 py-1 rounded-full text-sm font-medium
          ${isEligible 
            ? 'bg-success/10 text-success border border-success/20' :'bg-warning/10 text-warning border border-warning/20'
          }
        `}>
          {isEligible ? 'Eligible' : 'Not Eligible'}
        </div>
      </div>
      {/* Eligibility Notice */}
      {!isEligible && (
        <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertCircle" size={16} className="text-warning mt-0.5" />
            <div>
              <p className="font-body text-sm text-warning font-medium mb-1">
                Complete Requirements to Unlock Rewards
              </p>
              <p className="font-body text-xs text-text-secondary">
                Finish the daily challenge to become eligible for reward claims.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rewards?.map((reward) => {
          const status = getRewardStatus(reward);
          
          return (
            <div 
              key={reward?.id}
              className={`
                relative p-4 rounded-lg border transition-all duration-200
                ${status === 'claimed' ?'bg-success/5 border-success/20' 
                  : status === 'available'
                  ? `bg-${reward?.color}/5 border-${reward?.color}/20 hover:bg-${reward?.color}/10`
                  : 'bg-muted border-border opacity-60'
                }
              `}
            >
              {/* Reward Icon and Info */}
              <div className="flex items-start space-x-3 mb-3">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${status === 'claimed' ?'bg-success/20 text-success'
                    : status === 'available'
                    ? `bg-${reward?.color}/20 text-${reward?.color}`
                    : 'bg-border text-text-secondary'
                  }
                `}>
                  <Icon name={reward?.icon} size={20} />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-heading font-medium text-card-foreground">
                    {reward?.name}
                  </h4>
                  <p className="font-body text-sm text-text-secondary mb-1">
                    {reward?.description}
                  </p>
                  <div className={`
                    font-data text-sm font-bold
                    ${status === 'claimed' ? 'text-success' : `text-${reward?.color}`}
                  `}>
                    {reward?.value}
                  </div>
                </div>
              </div>
              {/* Requirement */}
              <div className="mb-3">
                <div className="flex items-center space-x-1 text-xs text-text-secondary">
                  <Icon name="Target" size={12} />
                  <span>{reward?.requirement}</span>
                </div>
              </div>
              {/* Action Button */}
              <Button
                variant={status === 'available' ? 'default' : 'outline'}
                size="sm"
                fullWidth
                disabled={status !== 'available'}
                onClick={() => handleClaimReward(reward)}
                iconName={
                  status === 'claimed' ? 'CheckCircle' : 
                  status === 'available' ? 'Gift' : 'Lock'
                }
                iconPosition="left"
                iconSize={14}
                className={
                  status === 'claimed' ?'border-success text-success' 
                    : status === 'available'
                    ? `bg-${reward?.color} text-${reward?.color === 'warning' ? 'black' : 'white'} hover:bg-${reward?.color}/90`
                    : 'opacity-50 cursor-not-allowed'
                }
              >
                {status === 'claimed' ? 'Claimed' : 
                 status === 'available' ? 'Claim Reward' : 'Locked'}
              </Button>
              {/* Claimed Overlay */}
              {status === 'claimed' && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                    <Icon name="Check" size={14} className="text-white" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Claim All Button */}
      {isEligible && claimedRewards?.length < rewards?.length && (
        <div className="pt-4 border-t border-border">
          <Button
            variant="default"
            fullWidth
            onClick={() => {
              rewards?.forEach(reward => {
                if (!isRewardClaimed(reward?.id)) {
                  handleClaimReward(reward);
                }
              });
            }}
            iconName="Gift"
            iconPosition="left"
            iconSize={16}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Claim All Available Rewards
          </Button>
        </div>
      )}
      {/* Next Rewards Preview */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Calendar" size={14} className="text-text-secondary" />
          <span className="font-caption text-xs text-text-secondary">
            Tomorrow's Preview
          </span>
        </div>
        <p className="font-body text-sm text-text-secondary">
          Complete tomorrow's challenge to unlock exclusive gesture trail effects and bonus XP multipliers.
        </p>
      </div>
    </div>
  );
};

export default DailyRewards;