import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const GestureRecognitionFeedback = ({ 
  lastGesture, 
  currentTarget, 
  showHints = true,
  accuracy = 0,
  speed = 0 
}) => {
  const [feedback, setFeedback] = useState(null);
  const [showAccuracyDetails, setShowAccuracyDetails] = useState(false);

  useEffect(() => {
    if (lastGesture) {
      setFeedback(lastGesture);
      
      // Auto-hide feedback after 3 seconds
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [lastGesture]);

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 90) return 'success';
    if (accuracy >= 70) return 'warning';
    return 'error';
  };

  const getSpeedRating = (wpm) => {
    if (wpm >= 80) return { rating: 'Excellent', color: 'success' };
    if (wpm >= 60) return { rating: 'Good', color: 'accent' };
    if (wpm >= 40) return { rating: 'Fair', color: 'warning' };
    return { rating: 'Slow', color: 'error' };
  };

  const getFeedbackIcon = (recognized, accuracy) => {
    if (recognized && accuracy >= 90) return { icon: 'CheckCircle', color: 'success' };
    if (recognized && accuracy >= 70) return { icon: 'AlertCircle', color: 'warning' };
    if (recognized) return { icon: 'XCircle', color: 'error' };
    return { icon: 'HelpCircle', color: 'text-secondary' };
  };

  return (
    <div className="w-full bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Current Target Display */}
      {currentTarget && (
        <div className="bg-muted rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-medium text-foreground">
              Current Target
            </h3>
            {showHints && (
              <button
                onClick={() => setShowAccuracyDetails(!showAccuracyDetails)}
                className="text-accent hover:text-accent-foreground transition-colors duration-200"
              >
                <Icon name="Info" size={16} />
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-accent/20 border-2 border-accent/30 rounded-lg flex items-center justify-center">
                <span className="font-data text-2xl font-bold text-accent">
                  {currentTarget?.symbol}
                </span>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="font-body font-medium text-foreground mb-1">
                Word: "{currentTarget?.word}"
              </div>
              <div className="font-caption text-sm text-text-secondary mb-2">
                {currentTarget?.category} • {currentTarget?.difficulty}
              </div>
              
              {showHints && currentTarget?.hint && (
                <div className="flex items-start space-x-2 bg-accent/10 rounded p-2">
                  <Icon name="Lightbulb" size={14} className="text-accent flex-shrink-0 mt-0.5" />
                  <p className="font-body text-sm text-accent">
                    {currentTarget?.hint}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Gesture Feedback */}
      {feedback && (
        <div className={`
          rounded-lg p-4 border transition-all duration-300
          ${feedback?.recognized 
            ? 'bg-success/10 border-success/20' :'bg-error/10 border-error/20'
          }
        `}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {(() => {
                const { icon, color } = getFeedbackIcon(feedback?.recognized, feedback?.accuracy);
                return <Icon name={icon} size={20} className={`text-${color}`} />;
              })()}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-heading font-medium text-foreground">
                  {feedback?.recognized ? 'Gesture Recognized!' : 'Gesture Not Recognized'}
                </h4>
                <div className="flex items-center space-x-2">
                  <span className={`
                    font-data text-sm font-medium
                    text-${getAccuracyColor(feedback?.accuracy)}
                  `}>
                    {Math.round(feedback?.accuracy)}%
                  </span>
                </div>
              </div>
              
              {feedback?.recognized && (
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="text-center p-2 bg-muted rounded">
                    <div className={`font-data text-lg font-bold text-${getAccuracyColor(feedback?.accuracy)}`}>
                      {Math.round(feedback?.accuracy)}%
                    </div>
                    <div className="font-caption text-xs text-text-secondary">
                      Accuracy
                    </div>
                  </div>
                  
                  <div className="text-center p-2 bg-muted rounded">
                    <div className={`font-data text-lg font-bold text-${getSpeedRating(feedback?.speed)?.color}`}>
                      {Math.round(feedback?.speed)}
                    </div>
                    <div className="font-caption text-xs text-text-secondary">
                      WPM
                    </div>
                  </div>
                </div>
              )}
              
              {feedback?.suggestions && feedback?.suggestions?.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-body font-medium text-sm text-foreground">
                    Suggestions:
                  </h5>
                  {feedback?.suggestions?.map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Icon name="ArrowRight" size={14} className="text-accent flex-shrink-0 mt-0.5" />
                      <p className="font-body text-sm text-text-secondary">
                        {suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Real-time Performance */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted rounded-lg p-3 text-center">
          <div className={`font-data text-xl font-bold text-${getAccuracyColor(accuracy)} mb-1`}>
            {Math.round(accuracy)}%
          </div>
          <div className="font-caption text-xs text-text-secondary">
            Session Accuracy
          </div>
        </div>
        
        <div className="bg-muted rounded-lg p-3 text-center">
          <div className={`font-data text-xl font-bold text-${getSpeedRating(speed)?.color} mb-1`}>
            {Math.round(speed)}
          </div>
          <div className="font-caption text-xs text-text-secondary">
            Current WPM
          </div>
        </div>
      </div>
      {/* Accuracy Details Modal */}
      {showAccuracyDetails && currentTarget && (
        <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-heading font-medium text-accent">
              Drawing Tips
            </h4>
            <button
              onClick={() => setShowAccuracyDetails(false)}
              className="text-accent hover:text-accent-foreground"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Icon name="Target" size={14} className="text-accent flex-shrink-0 mt-0.5" />
              <p className="font-body text-sm text-foreground">
                Draw smooth, confident strokes
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <Icon name="Zap" size={14} className="text-accent flex-shrink-0 mt-0.5" />
              <p className="font-body text-sm text-foreground">
                Maintain consistent speed throughout
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <Icon name="Eye" size={14} className="text-accent flex-shrink-0 mt-0.5" />
              <p className="font-body text-sm text-foreground">
                Follow the ghost overlay guide when available
              </p>
            </div>
          </div>
        </div>
      )}
      {/* No Active Gesture State */}
      {!feedback && !currentTarget && (
        <div className="text-center py-8">
          <Icon name="MousePointer2" size={32} className="text-text-secondary mx-auto mb-3 opacity-50" />
          <p className="font-body text-text-secondary">
            Start drawing to see gesture feedback
          </p>
        </div>
      )}
    </div>
  );
};

export default GestureRecognitionFeedback;