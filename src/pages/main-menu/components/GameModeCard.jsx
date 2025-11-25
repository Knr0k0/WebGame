import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GameModeCard = ({ 
  id, 
  title, 
  description, 
  path, 
  icon, 
  difficulty, 
  color, 
  features, 
  isRecommended = false,
  stats = null
}) => {
  const navigate = useNavigate();

  const handleModeSelect = () => {
    navigate(path);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-success';
      case 'Advanced': return 'text-accent';
      case 'Challenge': return 'text-error';
      default: return 'text-warning';
    }
  };

  const getCardHoverEffect = (color) => {
    switch (color) {
      case 'success': return 'hover:border-success hover:shadow-[0_4px_20px_rgba(0,255,136,0.2)]';
      case 'accent': return 'hover:border-accent hover:shadow-neon-intense';
      case 'warning': return 'hover:border-warning hover:shadow-[0_4px_20px_rgba(255,107,0,0.2)]';
      case 'error': return 'hover:border-error hover:shadow-[0_4px_20px_rgba(255,0,64,0.2)]';
      default: return 'hover:border-accent hover:shadow-neon';
    }
  };

  return (
    <div
      className={`
        group relative bg-card border border-border rounded-lg p-6 
        transition-all duration-300 cursor-pointer
        ${getCardHoverEffect(color)}
        hover:scale-[1.02] hover:bg-card/80
      `}
      onClick={handleModeSelect}
    >
      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium shadow-neon">
          Recommended
        </div>
      )}
      {/* Mode Icon and Title */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={`
            w-12 h-12 rounded-lg flex items-center justify-center
            bg-${color}/10 border border-${color}/20
            group-hover:bg-${color}/20 transition-colors duration-300
          `}>
            <Icon 
              name={icon} 
              size={24} 
              className={`text-${color} group-hover:scale-110 transition-transform duration-300`}
            />
          </div>
          <div>
            <h3 className="font-heading font-bold text-xl text-card-foreground group-hover:text-accent transition-colors duration-300">
              {title}
            </h3>
            <span className={`font-caption text-sm ${getDifficultyColor(difficulty)} font-medium`}>
              {difficulty}
            </span>
          </div>
        </div>
        
        <Icon 
          name="ArrowRight" 
          size={20} 
          className="text-text-secondary group-hover:text-accent group-hover:translate-x-1 transition-all duration-300"
        />
      </div>
      {/* Description */}
      <p className="font-body text-text-secondary mb-6 leading-relaxed">
        {description}
      </p>
      {/* Stats (if available) */}
      {stats && (
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <div className={`font-data text-lg font-bold text-${color}`}>
                {stats?.bestScore || stats?.bestWPM || stats?.level || 0}
              </div>
              <div className="font-caption text-xs text-text-secondary">
                {stats?.bestScore ? 'Best Score' : stats?.bestWPM ? 'Best WPM' : 'Level'}
              </div>
            </div>
            <div>
              <div className="font-data text-lg font-bold text-success">
                {stats?.completion || stats?.accuracy || stats?.sessions || 0}
                {stats?.completion || stats?.accuracy ? '%' : ''}
              </div>
              <div className="font-caption text-xs text-text-secondary">
                {stats?.completion ? 'Complete' : stats?.accuracy ? 'Accuracy' : 'Sessions'}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Features */}
      <div className="space-y-2 mb-6">
        {features?.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Icon 
              name="Check" 
              size={16} 
              className={`text-${color} flex-shrink-0`}
            />
            <span className="font-body text-sm text-text-secondary">
              {feature}
            </span>
          </div>
        ))}
      </div>
      {/* Action Button */}
      <Button
        variant="outline"
        fullWidth
        iconName="Play"
        iconPosition="left"
        iconSize={16}
        className={`
          group-hover:border-${color} group-hover:text-${color}
          group-hover:bg-${color}/5 transition-all duration-300
        `}
      >
        Start Mode
      </Button>
      {/* Glow Effect */}
      <div className={`
        absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100
        bg-gradient-to-br from-${color}/5 to-transparent
        transition-opacity duration-300 pointer-events-none
      `} />
    </div>
  );
};

export default GameModeCard;