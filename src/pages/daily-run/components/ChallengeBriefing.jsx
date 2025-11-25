import React from 'react';
import Icon from '../../../components/AppIcon';

const ChallengeBriefing = ({ challengeData }) => {
  const difficultyColors = {
    'Beginner': 'success',
    'Intermediate': 'warning', 
    'Advanced': 'error',
    'Expert': 'accent'
  };

  const getDifficultyColor = (difficulty) => {
    return difficultyColors?.[difficulty] || 'accent';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-xl text-card-foreground">
          Today's Challenge
        </h2>
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={16} className="text-accent" />
          <span className="font-caption text-sm text-text-secondary">
            {challengeData?.date}
          </span>
        </div>
      </div>
      {/* Challenge Title and Difficulty */}
      <div className="space-y-2">
        <h3 className="font-heading font-bold text-2xl text-foreground">
          {challengeData?.title}
        </h3>
        <div className="flex items-center space-x-3">
          <span className={`
            px-3 py-1 rounded-full text-sm font-medium
            bg-${getDifficultyColor(challengeData?.difficulty)}/10 
            text-${getDifficultyColor(challengeData?.difficulty)}
            border border-${getDifficultyColor(challengeData?.difficulty)}/20
          `}>
            {challengeData?.difficulty}
          </span>
          <span className="font-caption text-sm text-text-secondary">
            Estimated completion: {challengeData?.estimatedTime}
          </span>
        </div>
      </div>
      {/* Description */}
      <div className="bg-muted rounded-lg p-4">
        <p className="font-body text-muted-foreground leading-relaxed">
          {challengeData?.description}
        </p>
      </div>
      {/* Special Rules */}
      <div className="space-y-3">
        <h4 className="font-heading font-medium text-lg text-card-foreground flex items-center space-x-2">
          <Icon name="Zap" size={18} className="text-accent" />
          <span>Special Rules</span>
        </h4>
        <div className="grid gap-3">
          {challengeData?.specialRules?.map((rule, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
              <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
              <span className="font-body text-sm text-muted-foreground">
                {rule}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Scoring Multipliers */}
      <div className="space-y-3">
        <h4 className="font-heading font-medium text-lg text-card-foreground flex items-center space-x-2">
          <Icon name="Target" size={18} className="text-warning" />
          <span>Scoring Multipliers</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {challengeData?.scoringMultipliers?.map((multiplier, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-body text-sm text-muted-foreground">
                {multiplier?.condition}
              </span>
              <span className="font-data font-bold text-accent">
                {multiplier?.multiplier}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Vocabulary Theme */}
      <div className="space-y-3">
        <h4 className="font-heading font-medium text-lg text-card-foreground flex items-center space-x-2">
          <Icon name="BookOpen" size={18} className="text-accent" />
          <span>Vocabulary Theme</span>
        </h4>
        <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-heading font-medium text-accent">
              {challengeData?.vocabularyTheme?.name}
            </span>
            <span className="font-caption text-xs text-text-secondary">
              {challengeData?.vocabularyTheme?.wordCount} words
            </span>
          </div>
          <p className="font-body text-sm text-text-secondary">
            {challengeData?.vocabularyTheme?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChallengeBriefing;