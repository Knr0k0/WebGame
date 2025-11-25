import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import InGameNavigation from '../../components/ui/InGameNavigation';
import DailyTimer from './components/DailyTimer';
import ChallengeBriefing from './components/ChallengeBriefing';
import LiveLeaderboard from './components/LiveLeaderboard';
import DailyProgress from './components/DailyProgress';
import DailyRewards from './components/DailyRewards';
import GameCanvas from './components/GameCanvas';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const DailyRun = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('briefing'); // briefing, playing, paused, completed
  const [currentScore, setCurrentScore] = useState(0);
  const [gameStats, setGameStats] = useState({
    wpm: 0,
    accuracy: 0,
    time: 0,
    combo: 0,
    score: 0
  });

  const [challengeData] = useState({
    date: "November 15, 2025",
    title: "Cyberpunk Lexicon Assault",
    difficulty: "Advanced",
    estimatedTime: "15-20 minutes",
    description: `Today's challenge features high-tech vocabulary with enhanced particle effects and neon trail mechanics. Navigate through floating lexicon shards containing cyberpunk terminology while maintaining precision under time pressure. Special daily modifiers include increased gesture sensitivity and bonus combo multipliers for consecutive accurate inputs.`,
    specialRules: [
    "Enhanced gesture sensitivity - smaller movements register",
    "Neon trail persistence - trails last 2x longer for visual feedback",
    "Combo multiplier increases by 0.5x per consecutive hit",
    "Time bonus: +100 points per second remaining",
    "Accuracy threshold: 85% minimum for reward eligibility"],

    scoringMultipliers: [
    { condition: "Perfect accuracy (100%)", multiplier: "3.0x" },
    { condition: "Speed demon (80+ WPM)", multiplier: "2.5x" },
    { condition: "Combo master (15+ combo)", multiplier: "2.0x" },
    { condition: "Time bonus (under 10 min)", multiplier: "1.5x" }],

    vocabularyTheme: {
      name: "Cyberpunk Technology",
      description: "Advanced technological terms, digital concepts, and futuristic vocabulary from cyberpunk literature and gaming",
      wordCount: 50
    }
  });

  const [progressData, setProgressData] = useState({
    completionPercentage: 0,
    currentScore: 0,
    targetScore: 15000,
    gesturesCompleted: 0,
    bestWPM: 0,
    accuracy: 0,
    bestCombo: 0
  });

  const [currentUser] = useState({
    username: "CyberTypist",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_15d9256da-1762273599595.png",
    avatarAlt: "Professional headshot of young man with glasses in casual shirt"
  });

  // Game timer
  useEffect(() => {
    let timer;
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setGameStats((prev) => ({
          ...prev,
          time: prev?.time + 1
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  // Update progress based on score
  useEffect(() => {
    const completionPercentage = Math.min(currentScore / progressData?.targetScore * 100, 100);
    setProgressData((prev) => ({
      ...prev,
      completionPercentage,
      currentScore,
      gesturesCompleted: Math.floor(currentScore / 100),
      bestWPM: gameStats?.wpm,
      accuracy: gameStats?.accuracy,
      bestCombo: gameStats?.combo
    }));
  }, [currentScore, gameStats, progressData?.targetScore]);

  const handleStartChallenge = () => {
    setGameState('playing');
    setCurrentScore(0);
    setGameStats({
      wpm: 0,
      accuracy: 0,
      time: 0,
      combo: 0,
      score: 0
    });
  };

  const handlePause = () => {
    setGameState('paused');
  };

  const handleResume = () => {
    setGameState('playing');
  };

  const handleRestart = () => {
    setGameState('briefing');
    setCurrentScore(0);
    setGameStats({
      wpm: 0,
      accuracy: 0,
      time: 0,
      combo: 0,
      score: 0
    });
  };

  const handleScoreUpdate = (newScore) => {
    setCurrentScore(newScore);
  };

  const handleStatsUpdate = (newStats) => {
    setGameStats(newStats);
  };

  const handleTimeExpired = () => {
    if (gameState === 'playing') {
      setGameState('completed');
    }
  };

  const handleClaimReward = (reward) => {
    console.log('Reward claimed:', reward);
    // Handle reward claiming logic
  };

  const isRewardEligible = progressData?.completionPercentage >= 100 && gameStats?.accuracy >= 85;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      {gameState === 'briefing' ?
      <Header /> :

      <InGameNavigation
        gameMode="daily-run"
        isPaused={gameState === 'paused'}
        onPause={handlePause}
        onResume={handleResume}
        onRestart={handleRestart}
        showStats={true}
        stats={gameStats} />

      }

      <main className={`${gameState === 'briefing' ? 'pt-16' : 'pt-14'} pb-8`}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Briefing State */}
          {gameState === 'briefing' &&
          <div className="space-y-8">
              {/* Header Section */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Icon name="Calendar" size={32} className="text-accent" />
                  <h1 className="font-heading font-bold text-4xl md:text-5xl text-foreground">
                    Daily Run
                  </h1>
                </div>
                <p className="font-body text-lg text-text-secondary max-w-3xl mx-auto">
                  Take on today's unique challenge with special rules, themed vocabulary, and exclusive rewards. 
                  Compete against players worldwide in this 24-hour limited event.
                </p>
              </div>

              {/* Timer and Quick Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <DailyTimer onTimeExpired={handleTimeExpired} />
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-center">
                    <div className="font-data text-2xl font-bold text-accent mb-1">
                      1,247
                    </div>
                    <div className="font-caption text-sm text-text-secondary">
                      Active Players
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column - Challenge Details */}
                <div className="xl:col-span-2 space-y-6">
                  <ChallengeBriefing challengeData={challengeData} />
                  
                  {/* Start Challenge Button */}
                  <div className="text-center">
                    <Button
                    variant="default"
                    size="lg"
                    onClick={handleStartChallenge}
                    iconName="Play"
                    iconPosition="left"
                    iconSize={20}
                    className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-neon px-12 py-4">

                      <div className="text-left">
                        <div className="font-heading font-bold text-lg">Start Daily Challenge</div>
                        <div className="text-sm opacity-80">Begin your run now</div>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Right Column - Leaderboard */}
                <div className="space-y-6">
                  <LiveLeaderboard currentUser={currentUser} />
                </div>
              </div>
            </div>
          }

          {/* Playing/Paused State */}
          {(gameState === 'playing' || gameState === 'paused') &&
          <div className="space-y-6">
              {/* Game Canvas */}
              <GameCanvas
              isActive={gameState === 'playing'}
              onScoreUpdate={handleScoreUpdate}
              onStatsUpdate={handleStatsUpdate}
              challengeMode="daily" />


              {/* Progress and Leaderboard */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <DailyProgress progressData={progressData} />
                <LiveLeaderboard currentUser={currentUser} />
              </div>
            </div>
          }

          {/* Completed State */}
          {gameState === 'completed' &&
          <div className="space-y-8">
              {/* Completion Header */}
              <div className="text-center space-y-4">
                <Icon name="Trophy" size={48} className="text-success mx-auto" />
                <h1 className="font-heading font-bold text-4xl text-success">
                  Challenge Complete!
                </h1>
                <p className="font-body text-lg text-text-secondary">
                  Congratulations on completing today's daily challenge
                </p>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Left Column - Progress and Rewards */}
                <div className="space-y-6">
                  <DailyProgress progressData={progressData} />
                  <DailyRewards
                  isEligible={isRewardEligible}
                  onClaimReward={handleClaimReward} />

                </div>

                {/* Right Column - Leaderboard and Actions */}
                <div className="space-y-6">
                  <LiveLeaderboard currentUser={currentUser} />
                  
                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                    variant="default"
                    fullWidth
                    onClick={handleRestart}
                    iconName="RotateCcw"
                    iconPosition="left"
                    iconSize={16}
                    className="bg-accent text-accent-foreground hover:bg-accent/90">

                      Try Again
                    </Button>
                    
                    <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/leaderboards')}
                    iconName="Trophy"
                    iconPosition="left"
                    iconSize={16}
                    className="border-success text-success hover:bg-success/10">

                      View Full Leaderboards
                    </Button>
                    
                    <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/main-menu')}
                    iconName="Home"
                    iconPosition="left"
                    iconSize={16}
                    className="border-text-secondary text-text-secondary hover:bg-muted">

                      Return to Main Menu
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </main>
    </div>);

};

export default DailyRun;