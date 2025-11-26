import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Arcade() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);

  // Game timer
  useEffect(() => {
    if (!gameActive || timeRemaining === 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, timeRemaining]);

  // End game when time runs out
  useEffect(() => {
    if (timeRemaining === 0 && gameActive) {
      setGameActive(false);
    }
  }, [timeRemaining, gameActive]);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setCombo(0);
    setTimeRemaining(60);
  };

  const simulateGestureDetected = () => {
    if (!gameActive) return;
    setScore(prev => prev + (10 * (combo + 1)));
    setCombo(prev => prev + 1);
  };

  const resetCombo = () => {
    setCombo(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">🎮 Arcade Mode</h1>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
        >
          ← Back
        </button>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Stats Display */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          {/* Score */}
          <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-6 text-center">
            <p className="text-gray-300 text-sm mb-2">SCORE</p>
            <p className="text-4xl font-bold text-blue-400">{score}</p>
          </div>

          {/* Combo */}
          <div className="bg-purple-600/20 border border-purple-500 rounded-lg p-6 text-center">
            <p className="text-gray-300 text-sm mb-2">COMBO</p>
            <p className="text-4xl font-bold text-purple-400">{combo}</p>
          </div>

          {/* Time */}
          <div className="bg-red-600/20 border border-red-500 rounded-lg p-6 text-center">
            <p className="text-gray-300 text-sm mb-2">TIME</p>
            <p className="text-4xl font-bold text-red-400">{timeRemaining}s</p>
          </div>
        </div>

        {/* Game Canvas Placeholder */}
        <div className="w-full max-w-2xl h-96 bg-slate-800 border-2 border-slate-700 rounded-lg mb-8 flex items-center justify-center">
          <div className="text-center">
            {gameActive ? (
              <div className="space-y-4">
                <p className="text-gray-400 text-lg">Draw gestures below to score points!</p>
                <div className="w-32 h-32 border-2 border-dashed border-gray-600 rounded-lg mx-auto flex items-center justify-center">
                  <p className="text-gray-500">Canvas Area</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-lg">Click Start Game to begin!</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {!gameActive ? (
            <button
              onClick={startGame}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition"
            >
              Start Game
            </button>
          ) : (
            <>
              <button
                onClick={simulateGestureDetected}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
              >
                Gesture Detected ✓
              </button>
              <button
                onClick={resetCombo}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
              >
                Missed ✗
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
