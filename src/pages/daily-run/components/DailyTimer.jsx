import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const DailyTimer = ({ onTimeExpired }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    // Calculate time remaining until next day (midnight UTC)
    const calculateTimeRemaining = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow?.setUTCDate(tomorrow?.getUTCDate() + 1);
      tomorrow?.setUTCHours(0, 0, 0, 0);
      
      const diff = tomorrow?.getTime() - now?.getTime();
      return Math.max(0, Math.floor(diff / 1000));
    };

    setTimeRemaining(calculateTimeRemaining());

    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
      
      // Set urgent state when less than 1 hour remaining
      setIsUrgent(remaining < 3600);
      
      if (remaining <= 0) {
        onTimeExpired?.();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeExpired]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours?.toString()?.padStart(2, '0')}:${minutes?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
    }
    return `${minutes?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  return (
    <div className={`
      relative bg-card border rounded-lg p-4 transition-all duration-300
      ${isUrgent 
        ? 'border-error shadow-[0_4px_20px_rgba(255,0,64,0.3)] animate-pulse-glow' 
        : 'border-accent shadow-neon'
      }
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon 
            name="Clock" 
            size={20} 
            className={isUrgent ? 'text-error' : 'text-accent'} 
          />
          <span className="font-heading font-medium text-card-foreground">
            Challenge Ends In
          </span>
        </div>
        <div className={`
          font-data text-xl font-bold transition-colors duration-300
          ${isUrgent ? 'text-error' : 'text-accent'}
        `}>
          {formatTime(timeRemaining)}
        </div>
      </div>
      
      {isUrgent && (
        <div className="mt-2 flex items-center space-x-1">
          <Icon name="AlertTriangle" size={14} className="text-error" />
          <span className="font-caption text-xs text-error font-medium">
            URGENT: Less than 1 hour remaining!
          </span>
        </div>
      )}
      
      {/* Animated background effect for urgency */}
      {isUrgent && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-error/5 to-transparent animate-pulse pointer-events-none" />
      )}
    </div>
  );
};

export default DailyTimer;