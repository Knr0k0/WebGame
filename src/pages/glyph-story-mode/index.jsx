import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import InGameNavigation from '../../components/ui/InGameNavigation';
import GameCanvas from './components/GameCanvas';
import ChapterPanel from './components/ChapterPanel';
import GameStats from './components/GameStats';
import EnemyField from './components/EnemyField';
import GestureRecognitionFeedback from './components/GestureRecognitionFeedback';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const GlyphStoryMode = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'paused', 'completed'
  const [isPaused, setIsPaused] = useState(false);
  
  // Game Data
  const [currentChapter, setCurrentChapter] = useState({
    number: 1,
    title: "Basic Consonants",
    description: "Learn fundamental shorthand consonant symbols and their stroke patterns. Master the foundation of efficient gesture-based writing.",
    unlocked: true
  });

  const [chapterProgress, setChapterProgress] = useState({
    completed: 3,
    total: 8
  });

  const [objectives, setObjectives] = useState([
    {
      text: "Complete tutorial introduction",
      completed: true,
      active: false,
      progress: 100
    },
    {
      text: "Draw 5 correct \'B\' symbols",
      completed: true,
      active: false,
      progress: 100
    },
    {
      text: "Achieve 70% accuracy on \'T\' symbols",
      completed: false,
      active: true,
      progress: 60
    },
    {
      text: "Destroy 10 enemies with combo attacks",
      completed: false,
      active: false,
      progress: 0
    }
  ]);

  const [shorthandRules, setShorthandRules] = useState([
    {
      symbol: "B",
      meaning: "B sound",
      category: "Consonant",
      description: "Vertical line with small hook at bottom",
      tip: "Start from top, draw straight down, then small curve right"
    },
    {
      symbol: "T",
      meaning: "T sound", 
      category: "Consonant",
      description: "Horizontal line crossed by vertical stroke",
      tip: "Draw horizontal first, then cross with vertical line"
    },
    {
      symbol: "P",
      meaning: "P sound",
      category: "Consonant", 
      description: "Vertical line with small circle at top",
      tip: "Draw vertical line upward, add small circle at top"
    }
  ]);

  // Game Stats
  const [gameStats, setGameStats] = useState({
    health: 85,
    maxHealth: 100,
    score: 12450,
    combo: 0,
    glyphOverloadCharge: 75,
    wpm: 68,
    accuracy: 87,
    isOverloadActive: false
  });

  // Enemies
  const [enemies, setEnemies] = useState([
    {
      id: 1,
      word: "BEAT",
      symbol: "B",
      shape: "cube",
      difficulty: "easy",
      x: 20,
      y: 25,
      health: 1,
      maxHealth: 1
    },
    {
      id: 2,
      word: "TIME",
      symbol: "T", 
      shape: "hexagon",
      difficulty: "medium",
      x: 60,
      y: 35,
      health: 2,
      maxHealth: 2
    },
    {
      id: 3,
      word: "POWER",
      symbol: "P",
      shape: "triangle", 
      difficulty: "easy",
      x: 80,
      y: 20,
      health: 1,
      maxHealth: 1
    }
  ]);

  // Current target and gesture feedback
  const [currentTarget, setCurrentTarget] = useState({
    symbol: "B",
    word: "BEAT",
    category: "Consonant",
    difficulty: "Easy",
    hint: "Draw a straight vertical line with a small hook at the bottom"
  });

  const [lastGesture, setLastGesture] = useState(null);

  useEffect(() => {
    // Set current target based on first enemy
    if (enemies?.length > 0) {
      const firstEnemy = enemies?.[0];
      setCurrentTarget({
        symbol: firstEnemy?.symbol,
        word: firstEnemy?.word,
        category: "Consonant",
        difficulty: firstEnemy?.difficulty,
        hint: shorthandRules?.find(rule => rule?.symbol === firstEnemy?.symbol)?.tip || "Draw the symbol carefully"
      });
    }
  }, [enemies, shorthandRules]);

  const handleStartGame = () => {
    setGameState('playing');
    setIsPaused(false);
  };

  const handlePauseGame = () => {
    setIsPaused(true);
  };

  const handleResumeGame = () => {
    setIsPaused(false);
  };

  const handleRestartGame = () => {
    setGameState('playing');
    setIsPaused(false);
    // Reset game stats
    setGameStats(prev => ({
      ...prev,
      health: prev?.maxHealth,
      score: 0,
      combo: 0,
      glyphOverloadCharge: 0,
      isOverloadActive: false
    }));
  };

  const handleGestureComplete = (gestureData) => {
    if (!gameState === 'playing' || isPaused) return;

    setLastGesture({
      recognized: gestureData?.recognized,
      accuracy: gestureData?.accuracy,
      speed: gestureData?.speed,
      suggestions: gestureData?.recognized ? [] : [
        "Try drawing more smoothly",
        "Check the symbol guide for proper stroke order",
        "Maintain consistent speed throughout the gesture"
      ]
    });

    if (gestureData?.recognized && gestureData?.accuracy > 70) {
      // Update combo and score
      setGameStats(prev => ({
        ...prev,
        combo: prev?.combo + 1,
        score: prev?.score + Math.round(gestureData?.accuracy * 10),
        glyphOverloadCharge: Math.min(prev?.glyphOverloadCharge + 15, 100),
        wpm: Math.round((prev?.wpm + gestureData?.speed) / 2),
        accuracy: Math.round((prev?.accuracy + gestureData?.accuracy) / 2)
      }));

      // Remove matching enemy
      const matchingEnemy = enemies?.find(enemy => enemy?.symbol === currentTarget?.symbol);
      if (matchingEnemy) {
        handleEnemyDestroyed(matchingEnemy);
      }
    } else {
      // Reset combo on miss
      setGameStats(prev => ({
        ...prev,
        combo: 0,
        health: Math.max(prev?.health - 5, 0)
      }));
    }
  };

  const handleEnemyDestroyed = (enemy) => {
    setEnemies(prev => prev?.filter(e => e?.id !== enemy?.id));
    
    // Spawn new enemy after delay
    setTimeout(() => {
      const newEnemy = {
        id: Date.now(),
        word: ["BOOK", "TREE", "PLAY", "STOP"]?.[Math.floor(Math.random() * 4)],
        symbol: ["B", "T", "P"]?.[Math.floor(Math.random() * 3)],
        shape: ["cube", "hexagon", "triangle"]?.[Math.floor(Math.random() * 3)],
        difficulty: ["easy", "medium"]?.[Math.floor(Math.random() * 2)],
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
        health: 1,
        maxHealth: 1
      };
      setEnemies(prev => [...prev, newEnemy]);
    }, 2000);
  };

  const handleNextChapter = () => {
    if (currentChapter?.number < 10) {
      setCurrentChapter(prev => ({
        ...prev,
        number: prev?.number + 1,
        title: `Chapter ${prev?.number + 1}`,
        description: "Advanced shorthand techniques and complex symbol combinations."
      }));
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapter?.number > 1) {
      setCurrentChapter(prev => ({
        ...prev,
        number: prev?.number - 1,
        title: `Chapter ${prev?.number - 1}`,
        description: "Review previous shorthand fundamentals and practice basic symbols."
      }));
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-4xl">
            <div className="text-center mb-12">
              <h1 className="font-heading font-bold text-5xl text-foreground mb-4">
                Glyph Story Mode
              </h1>
              <p className="font-body text-lg text-text-secondary max-w-2xl mx-auto mb-8">
                Master shorthand writing through immersive chapter-based gameplay. Learn symbols, destroy enemies, and unlock advanced techniques.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <Icon name="BookOpen" size={32} className="text-success mx-auto mb-3" />
                  <h3 className="font-heading font-medium text-foreground mb-2">
                    Chapter-Based Learning
                  </h3>
                  <p className="font-body text-sm text-text-secondary">
                    Progress through structured lessons with clear objectives
                  </p>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <Icon name="Target" size={32} className="text-accent mx-auto mb-3" />
                  <h3 className="font-heading font-medium text-foreground mb-2">
                    Gesture Recognition
                  </h3>
                  <p className="font-body text-sm text-text-secondary">
                    Real-time feedback on your shorthand drawing accuracy
                  </p>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <Icon name="Zap" size={32} className="text-warning mx-auto mb-3" />
                  <h3 className="font-heading font-medium text-foreground mb-2">
                    Arcade Action
                  </h3>
                  <p className="font-body text-sm text-text-secondary">
                    Destroy enemies with correct gestures and build combos
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                variant="default"
                size="lg"
                onClick={handleStartGame}
                iconName="Play"
                iconPosition="left"
                iconSize={20}
                className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-neon px-8 py-4 text-lg"
              >
                Start Chapter {currentChapter?.number}
              </Button>
              
              <div className="mt-6 flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/main-menu')}
                  iconName="ArrowLeft"
                  iconPosition="left"
                  iconSize={16}
                  className="border-text-secondary text-text-secondary hover:bg-muted"
                >
                  Back to Menu
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/practice-lab')}
                  iconName="Target"
                  iconPosition="left"
                  iconSize={16}
                  className="text-accent hover:text-accent-foreground hover:bg-accent"
                >
                  Practice Lab
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <InGameNavigation
        gameMode="glyph-story"
        isPaused={isPaused}
        onPause={handlePauseGame}
        onResume={handleResumeGame}
        onRestart={handleRestartGame}
        showStats={true}
        stats={{
          wpm: gameStats?.wpm,
          accuracy: gameStats?.accuracy,
          time: 0,
          combo: gameStats?.combo,
          score: gameStats?.score
        }}
      />
      <div className="pt-14 min-h-screen p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-4rem)]">
          {/* Left Panel - Chapter Info */}
          <div className="lg:col-span-3 h-full">
            <ChapterPanel
              currentChapter={currentChapter}
              chapterProgress={chapterProgress}
              objectives={objectives}
              shorthandRules={shorthandRules}
              onNextChapter={handleNextChapter}
              onPreviousChapter={handlePreviousChapter}
            />
          </div>

          {/* Center Panel - Game Area */}
          <div className="lg:col-span-6 h-full space-y-4">
            {/* Enemy Field */}
            <div className="h-1/3">
              <EnemyField
                enemies={enemies}
                onEnemyDestroyed={handleEnemyDestroyed}
                isGameActive={gameState === 'playing' && !isPaused}
                glyphOverloadActive={gameStats?.isOverloadActive}
              />
            </div>

            {/* Drawing Canvas */}
            <div className="h-2/3">
              <GameCanvas
                onGestureComplete={handleGestureComplete}
                isGameActive={gameState === 'playing' && !isPaused}
                currentTarget={currentTarget}
                gestureTrail={true}
                showGhostOverlay={true}
              />
            </div>
          </div>

          {/* Right Panel - Stats and Feedback */}
          <div className="lg:col-span-3 h-full space-y-4">
            {/* Game Stats */}
            <div className="h-1/2">
              <GameStats
                health={gameStats?.health}
                maxHealth={gameStats?.maxHealth}
                score={gameStats?.score}
                combo={gameStats?.combo}
                glyphOverloadCharge={gameStats?.glyphOverloadCharge}
                wpm={gameStats?.wpm}
                accuracy={gameStats?.accuracy}
                isOverloadActive={gameStats?.isOverloadActive}
              />
            </div>

            {/* Gesture Feedback */}
            <div className="h-1/2">
              <GestureRecognitionFeedback
                lastGesture={lastGesture}
                currentTarget={currentTarget}
                showHints={true}
                accuracy={gameStats?.accuracy}
                speed={gameStats?.wpm}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlyphStoryMode;