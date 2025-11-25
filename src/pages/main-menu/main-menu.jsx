import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import GameModeCard from './components/GameModeCard';
import DailyChallengePreview from './components/DailyChallengePreview';
import RecentAchievements from './components/RecentAchievements';
import QuickStats from './components/QuickStats';
import ContinueSession from './components/ContinueSession';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const MainMenu = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Simulate loading time for dramatic effect
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => {
      clearTimeout(timer);
      clearInterval(timeInterval);
    };
  }, []);

  const gameModes = [
    {
      id: 'glyph-story',
      title: 'Glyph Story Mode',
      description: 'Progressive narrative-driven gesture learning with story progression and character development',
      path: '/glyph-story-mode',
      icon: 'BookOpen',
      difficulty: 'Beginner',
      color: 'success',
      features: ['Story Progression', 'Guided Learning', 'Character Development'],
      isRecommended: true,
      stats: { level: 3, completion: 67, sessions: 12 }
    },
    {
      id: 'lexicon-breaker',
      title: 'Lexicon Breaker',
      description: 'Infinite arcade mode with escalating difficulty, combo systems, and high score challenges',
      path: '/lexicon-breaker',
      icon: 'Zap',
      difficulty: 'Advanced',
      color: 'accent',
      features: ['Infinite Play', 'Combo System', 'High Scores'],
      stats: { bestScore: 94580, accuracy: 92, sessions: 28 }
    },
    {
      id: 'practice-lab',
      title: 'Practice Lab',
      description: 'Focused skill development environment with detailed analytics and custom training drills',
      path: '/practice-lab',
      icon: 'Target',
      difficulty: 'All Levels',
      color: 'warning',
      features: ['Skill Analysis', 'Custom Drills', 'Progress Tracking'],
      stats: { bestWPM: 108, accuracy: 94, sessions: 45 }
    },
    {
      id: 'daily-run',
      title: 'Daily Run',
      description: 'Daily challenge with global leaderboards, unique modifiers, and exclusive rewards',
      path: '/daily-run',
      icon: 'Calendar',
      difficulty: 'Challenge',
      color: 'error',
      features: ['Daily Challenge', 'Global Rankings', 'Special Modifiers'],
      stats: { bestScore: 76240, completion: 85, sessions: 15 }
    }
  ];

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="font-heading text-xl text-foreground animate-pulse">
            Loading Gesture Type...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-success/5" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-accent/10 rounded-full animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-48 h-48 border border-success/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 border border-warning/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Circuit Pattern */}
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
            <path d="M100 100 L300 100 L300 200 L500 200" stroke="currentColor" strokeWidth="1" className="text-accent/5" />
            <path d="M700 300 L900 300 L900 400 L1100 400" stroke="currentColor" strokeWidth="1" className="text-success/5" />
            <path d="M200 600 L400 600 L400 500 L600 500" stroke="currentColor" strokeWidth="1" className="text-warning/5" />
            <circle cx="300" cy="100" r="3" fill="currentColor" className="text-accent/10" />
            <circle cx="500" cy="200" r="3" fill="currentColor" className="text-accent/10" />
            <circle cx="900" cy="300" r="3" fill="currentColor" className="text-success/10" />
            <circle cx="600" cy="500" r="3" fill="currentColor" className="text-warning/10" />
          </svg>
        </div>
      </div>
      <Header />
      <main className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Welcome Section */}
          <div className="text-center mb-12 relative z-10">
            <div className="mb-6">
              <h1 className="font-heading font-bold text-5xl md:text-6xl text-foreground mb-4 text-glow">
                Gesture Type
              </h1>
              <p className="font-body text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
                Master the art of shorthand writing through immersive gaming experiences.\nTransform your typing speed and unlock the power of gesture-based input.
              </p>
            </div>
            
            {/* Current Time Display */}
            <div className="inline-flex items-center space-x-4 bg-card/50 backdrop-blur-sm border border-border rounded-lg px-6 py-3 shadow-neon">
              <Icon name="Clock" size={20} className="text-accent" />
              <div className="text-left">
                <div className="font-data text-lg font-medium text-foreground">
                  {formatTime(currentTime)}
                </div>
                <div className="font-caption text-xs text-text-secondary">
                  {formatDate(currentTime)}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column - Game Modes */}
            <div className="xl:col-span-8 space-y-8">
              {/* Game Mode Selection */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading font-bold text-2xl text-foreground">
                    Select Game Mode
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/leaderboards')}
                    iconName="Trophy"
                    iconPosition="left"
                    iconSize={16}
                    className="text-accent hover:text-accent-foreground hover:bg-accent"
                  >
                    View Leaderboards
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {gameModes?.map((mode) => (
                    <GameModeCard key={mode?.id} {...mode} />
                  ))}
                </div>
              </section>

              {/* Daily Challenge */}
              <section>
                <DailyChallengePreview />
              </section>
            </div>

            {/* Right Column - Stats and Progress */}
            <div className="xl:col-span-4 space-y-6">
              {/* Continue Session */}
              <ContinueSession />
              
              {/* Quick Stats */}
              <QuickStats />
              
              {/* Recent Achievements */}
              <RecentAchievements />
            </div>
          </div>

          {/* Footer Section */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-6 bg-muted/50 rounded-lg px-6 py-4">
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={16} className="text-accent" />
                <span className="font-body text-sm text-text-secondary">
                  Join 50,000+ gesture typists worldwide
                </span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center space-x-2">
                <Icon name="Zap" size={16} className="text-success" />
                <span className="font-body text-sm text-text-secondary">
                  Average improvement: 200% WPM
                </span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center space-x-2">
                <Icon name="Award" size={16} className="text-warning" />
                <span className="font-body text-sm text-text-secondary">
                  Certified learning method
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainMenu;