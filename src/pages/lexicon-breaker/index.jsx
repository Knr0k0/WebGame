import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import InGameNavigation from '../../components/ui/InGameNavigation';
import GameCanvas from './components/GameCanvas';
import GameHUD from './components/GameHUD';
import GameControls from './components/GameControls';
import GameOverScreen from './components/GameOverScreen';

const LexiconBreaker = () => {
  const navigate = useNavigate();
  
  // Game state
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'paused', 'gameOver'
  const [gameStats, setGameStats] = useState({
    score: 0,
    combo: 0,
    lives: 3,
    wave: 1,
    wpm: 0,
    accuracy: 100,
    glyphOverloadCharge: 0,
    isGlyphOverloadActive: false,
    timeElapsed: 0,
    bestCombo: 0,
    enemiesDestroyed: 0,
    gesturesDrawn: 0,
    successfulGestures: 0
  });

  // Previous best stats (mock data)
  const [previousBest, setPreviousBest] = useState({
    bestScore: 1847500,
    bestWPM: 94,
    bestWave: 12,
    bestCombo: 28
  });

  // Game timer
  useEffect(() => {
    let interval;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setGameStats(prev => ({
          ...prev,
          timeElapsed: prev?.timeElapsed + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // Glyph Overload timer
  useEffect(() => {
    let timeout;
    if (gameStats?.isGlyphOverloadActive) {
      timeout = setTimeout(() => {
        setGameStats(prev => ({
          ...prev,
          isGlyphOverloadActive: false,
          glyphOverloadCharge: 0
        }));
      }, 10000); // 10 seconds of overload
    }
    return () => clearTimeout(timeout);
  }, [gameStats?.isGlyphOverloadActive]);

  // Auto-activate Glyph Overload when fully charged
  useEffect(() => {
    if (gameStats?.glyphOverloadCharge >= 100 && !gameStats?.isGlyphOverloadActive) {
      setGameStats(prev => ({
        ...prev,
        isGlyphOverloadActive: true
      }));
    }
  }, [gameStats?.glyphOverloadCharge, gameStats?.isGlyphOverloadActive]);

  // Calculate WPM and accuracy
  useEffect(() => {
    const calculateWPM = () => {
      if (gameStats?.timeElapsed === 0) return 0;
      const minutes = gameStats?.timeElapsed / 60;
      const wordsTyped = gameStats?.successfulGestures * 1.2; // Approximate words per gesture
      return Math.round(wordsTyped / minutes);
    };

    const calculateAccuracy = () => {
      if (gameStats?.gesturesDrawn === 0) return 100;
      return Math.round((gameStats?.successfulGestures / gameStats?.gesturesDrawn) * 100);
    };

    setGameStats(prev => ({
      ...prev,
      wpm: calculateWPM(),
      accuracy: calculateAccuracy()
    }));
  }, [gameStats?.timeElapsed, gameStats?.successfulGestures, gameStats?.gesturesDrawn]);

  const handleStartGame = useCallback(() => {
    setGameState('playing');
    setGameStats({
      score: 0,
      combo: 0,
      lives: 3,
      wave: 1,
      wpm: 0,
      accuracy: 100,
      glyphOverloadCharge: 0,
      isGlyphOverloadActive: false,
      timeElapsed: 0,
      bestCombo: 0,
      enemiesDestroyed: 0,
      gesturesDrawn: 0,
      successfulGestures: 0
    });
  }, []);

  const handlePauseGame = useCallback(() => {
    setGameState('paused');
  }, []);

  const handleResumeGame = useCallback(() => {
    setGameState('playing');
  }, []);

  const handleRestartGame = useCallback(() => {
    handleStartGame();
  }, [handleStartGame]);

  const handleExitGame = useCallback(() => {
    setGameState('menu');
    navigate('/main-menu');
  }, [navigate]);

  const handleGameOver = useCallback(() => {
    setGameState('gameOver');
    
    // Update previous best if current run is better
    setPreviousBest(prev => ({
      bestScore: Math.max(prev?.bestScore, gameStats?.score),
      bestWPM: Math.max(prev?.bestWPM, gameStats?.wpm),
      bestWave: Math.max(prev?.bestWave, gameStats?.wave),
      bestCombo: Math.max(prev?.bestCombo, gameStats?.bestCombo)
    }));
  }, [gameStats]);

  const handleScoreUpdate = useCallback((points) => {
    setGameStats(prev => {
      const multiplier = Math.max(1, prev?.combo);
      const finalPoints = points * multiplier;
      
      return {
        ...prev,
        score: prev?.score + finalPoints,
        enemiesDestroyed: prev?.enemiesDestroyed + 1
      };
    });
  }, []);

  const handleComboUpdate = useCallback((increment) => {
    setGameStats(prev => {
      const newCombo = prev?.combo + increment;
      const chargeIncrease = increment * 5; // 5% charge per successful hit
      
      return {
        ...prev,
        combo: newCombo,
        bestCombo: Math.max(prev?.bestCombo, newCombo),
        glyphOverloadCharge: Math.min(100, prev?.glyphOverloadCharge + chargeIncrease)
      };
    });
  }, []);

  const handleGestureComplete = useCallback((stroke, hitEnemies) => {
    setGameStats(prev => ({
      ...prev,
      gesturesDrawn: prev?.gesturesDrawn + 1,
      successfulGestures: hitEnemies?.length > 0 ? prev?.successfulGestures + 1 : prev?.successfulGestures
    }));

    // Reset combo if no enemies hit
    if (hitEnemies?.length === 0) {
      setGameStats(prev => ({
        ...prev,
        combo: 0
      }));
    }
  }, []);

  const isGameActive = gameState === 'playing';
  const isPaused = gameState === 'paused';
  const isGameOver = gameState === 'gameOver';
  const isMenu = gameState === 'menu';

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card/20" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(0,212,255,0.1)_0%,transparent_50%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(255,107,0,0.1)_0%,transparent_50%)]" />
      </div>
      {/* In-Game Navigation */}
      {(isGameActive || isPaused) && (
        <InGameNavigation
          gameMode="lexicon-breaker"
          isPaused={isPaused}
          onPause={handlePauseGame}
          onResume={handleResumeGame}
          onRestart={handleRestartGame}
          showStats={true}
          stats={{
            wpm: gameStats?.wpm,
            accuracy: gameStats?.accuracy,
            time: gameStats?.timeElapsed,
            combo: gameStats?.combo,
            score: gameStats?.score
          }}
        />
      )}
      {/* Game Canvas */}
      <div className="absolute inset-0">
        <GameCanvas
          isGameActive={isGameActive}
          isPaused={isPaused}
          onScoreUpdate={handleScoreUpdate}
          onComboUpdate={handleComboUpdate}
          onGameOver={handleGameOver}
          onGestureComplete={handleGestureComplete}
        />
      </div>
      {/* Game HUD */}
      {(isGameActive || isPaused) && (
        <GameHUD
          score={gameStats?.score}
          combo={gameStats?.combo}
          lives={gameStats?.lives}
          wave={gameStats?.wave}
          wpm={gameStats?.wpm}
          accuracy={gameStats?.accuracy}
          glyphOverloadCharge={gameStats?.glyphOverloadCharge}
          isGlyphOverloadActive={gameStats?.isGlyphOverloadActive}
          timeElapsed={gameStats?.timeElapsed}
        />
      )}
      {/* Game Controls (Menu Screen) */}
      {isMenu && (
        <GameControls
          isGameActive={isGameActive}
          isPaused={isPaused}
          onStart={handleStartGame}
          onPause={handlePauseGame}
          onResume={handleResumeGame}
          onRestart={handleRestartGame}
          onExit={handleExitGame}
          gameStats={previousBest}
        />
      )}
      {/* Game Over Screen */}
      <GameOverScreen
        isVisible={isGameOver}
        finalStats={{
          score: gameStats?.score,
          bestWPM: gameStats?.wpm,
          accuracy: gameStats?.accuracy,
          timeElapsed: gameStats?.timeElapsed,
          bestCombo: gameStats?.bestCombo,
          enemiesDestroyed: gameStats?.enemiesDestroyed,
          wavesCompleted: gameStats?.wave
        }}
        onRestart={handleRestartGame}
        onExit={handleExitGame}
      />
      {/* Audio Context (placeholder for future audio implementation) */}
      <div className="hidden">
        {/* Audio elements would be placed here for gesture sounds, explosions, etc. */}
      </div>
    </div>
  );
};

export default LexiconBreaker;