import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarRecognizer, Point } from '@/utils/dollar-recognizer';
import { createDefaultTemplates } from '@/utils/gestureTemplateManager';

const ACCURACY_THRESHOLD = 0.65;
const MIN_STROKE_LENGTH = 10;
const AVAILABLE_LETTERS = ['a', 'e', 'i', 'l', 'o', 's', 't', 'b', 'c', 'd', 'f', 'g', 'h'];
const GAME_DURATION = 60;

export default function Arcade() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  // Game state
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState([]);
  const [allStrokes, setAllStrokes] = useState([]);
  const [targetLetter, setTargetLetter] = useState('a');
  const [feedback, setFeedback] = useState('');
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 });
  const [tracingImage, setTracingImage] = useState(null);
  const [ghostOpacity, setGhostOpacity] = useState(0.2);
  const [feedbackColor, setFeedbackColor] = useState('neutral'); // 'neutral', 'success', 'error'

  const recognizerRef = useRef(new DollarRecognizer());
  const templateManagerRef = useRef(createDefaultTemplates());
  const recognitionTimeoutRef = useRef(null);

  // Create a canvas-based letter guide
  const createLetterGuide = useCallback((letter) => {
    const guideCanvas = document.createElement('canvas');
    guideCanvas.width = 200;
    guideCanvas.height = 200;
    const ctx = guideCanvas.getContext('2d');
    
    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter.toUpperCase(), 100, 100);
    
    const img = new Image();
    img.src = guideCanvas.toDataURL();
    return img;
  }, []);

  // Load random letter image
  const loadRandomLetter = useCallback(() => {
    const randomLetter = AVAILABLE_LETTERS[Math.floor(Math.random() * AVAILABLE_LETTERS.length)];
    setTargetLetter(randomLetter);

    const img = new Image();
    img.onload = () => {
      console.log(`✅ Image loaded: ${randomLetter}.png`);
      setTracingImage(img);
    };
    img.onerror = () => {
      console.log(`⚠️ PNG not found, using generated letter guide for: ${randomLetter}`);
      // Fallback to generated letter guide
      const generatedImg = createLetterGuide(randomLetter);
      setTracingImage(generatedImg);
    };
    img.src = `/images/${randomLetter}.png`;
  }, [createLetterGuide]);

  // Initialize game
  useEffect(() => {
    if (!gameActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      const rect = container?.getBoundingClientRect();
      const newWidth = Math.max(600, rect?.width - 32);
      const newHeight = Math.max(300, rect?.height - 100);

      setCanvasSize({ width: newWidth, height: newHeight });
      canvas.width = newWidth;
      canvas.height = newHeight;
      redrawCanvas();
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Load templates
    const templateManager = templateManagerRef.current;
    const gestureNames = templateManager.getGestureNames();
    gestureNames.forEach(name => {
      const templates = templateManager.getTemplates(name);
      templates.forEach(points => {
        const scaledPoints = points.map(p => ({
          x: p.x * canvasSize.width,
          y: p.y * canvasSize.height
        }));
        recognizerRef.current.addGesture(name, scaledPoints);
      });
    });

    loadRandomLetter();

    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [gameActive, loadRandomLetter]);

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

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw feedback color overlay
    if (feedbackColor !== 'neutral') {
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = feedbackColor === 'success' ? '#22C55E' : '#EF4444';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }

    // Draw tracing image
    if (tracingImage && gameActive) {
      ctx.globalAlpha = ghostOpacity;
      const maxWidth = canvas.width * 0.4;
      const maxHeight = canvas.height * 0.6;
      const imgAspect = tracingImage.width / tracingImage.height;
      const canvasAspect = maxWidth / maxHeight;

      let drawWidth, drawHeight;
      if (imgAspect > canvasAspect) {
        drawWidth = maxWidth;
        drawHeight = maxWidth / imgAspect;
      } else {
        drawHeight = maxHeight;
        drawWidth = maxHeight * imgAspect;
      }

      const x = (canvas.width - drawWidth) / 2;
      const y = (canvas.height - drawHeight) / 2;

      ctx.drawImage(tracingImage, x, y, drawWidth, drawHeight);
      ctx.globalAlpha = 1;
    }

    // Draw grid
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 0.5;
    const gridSize = 50;
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw strokes
    allStrokes.forEach(stroke => {
      drawStroke(ctx, stroke, '#00D4FF', 2);
    });

    if (currentStroke.length > 0) {
      drawStroke(ctx, currentStroke, '#00FF88', 3);
    }
  };

  const drawStroke = (ctx, stroke, color, width) => {
    if (stroke.length < 2) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(stroke[0].x, stroke[0].y);
    for (let i = 1; i < stroke.length; i++) {
      ctx.lineTo(stroke[i].x, stroke[i].y);
    }
    ctx.stroke();
  };

  const getCanvasCoordinates = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  const handleMouseDown = (e) => {
    if (!gameActive) return;
    setIsDrawing(true);
    const coords = getCanvasCoordinates(e);
    setCurrentStroke([coords]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !gameActive) return;

    const coords = getCanvasCoordinates(e);
    const newStroke = [...currentStroke, coords];
    setCurrentStroke(newStroke);
    redrawCanvas();
  };

  const handleMouseUp = async (e) => {
    if (!isDrawing || !gameActive) return;
    setIsDrawing(false);

    if (currentStroke.length < MIN_STROKE_LENGTH) {
      setFeedbackColor('error');
      setTimeout(() => setFeedbackColor('neutral'), 600);
      setCurrentStroke([]);
      redrawCanvas();
      return;
    }

    // Add to all strokes
    const newAllStrokes = [...allStrokes, currentStroke];
    setAllStrokes(newAllStrokes);
    setCurrentStroke([]);

    // Clear any pending recognition timeout
    if (recognitionTimeoutRef.current) {
      clearTimeout(recognitionTimeoutRef.current);
    }

    // Set a new recognition timeout - only recognize after user stops drawing for 400ms
    recognitionTimeoutRef.current = setTimeout(() => {
      // Combine all collected strokes
      const allPoints = newAllStrokes.flat();

      if (allPoints.length >= MIN_STROKE_LENGTH) {
        // Recognize the complete gesture
        const result = recognizerRef.current.recognize(allPoints);
        const accuracy = Math.min(result.score / 64, 1.0);
        
        // Check if the recognized gesture matches the target letter
        // The result.name might include training samples like "a-0", "a-1", so we check the prefix
        const recognizedLetter = result.name.split('-')[0];
        const isMatch = accuracy >= ACCURACY_THRESHOLD && recognizedLetter === targetLetter;

        if (isMatch) {
          // Correct gesture!
          const pointsEarned = 10 * (combo + 1);
          setScore(prev => prev + pointsEarned);
          setCombo(prev => prev + 1);
          setFeedbackColor('success');

          // Reset for next letter
          setTimeout(() => {
            setFeedbackColor('neutral');
            setAllStrokes([]);
            setCurrentStroke([]);
            loadRandomLetter();
          }, 800);
        } else {
          // Wrong gesture
          setCombo(0);
          setFeedbackColor('error');

          // Reset for next letter
          setTimeout(() => {
            setFeedbackColor('neutral');
            setAllStrokes([]);
            setCurrentStroke([]);
            loadRandomLetter();
          }, 900);
        }
      }

      recognitionTimeoutRef.current = null;
    }, 400);

    redrawCanvas();
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setCombo(0);
    setTimeRemaining(GAME_DURATION);
    setAllStrokes([]);
    setCurrentStroke([]);
    setFeedback('');
    loadRandomLetter();
  };

  const endGame = () => {
    if (recognitionTimeoutRef.current) {
      clearTimeout(recognitionTimeoutRef.current);
    }
    setGameActive(false);
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
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
        {/* Stats Display */}
        <div className="grid grid-cols-4 gap-4 w-full max-w-4xl">
          {/* Score */}
          <div className="bg-blue-600/20 border border-blue-500 rounded-lg p-4 text-center">
            <p className="text-gray-300 text-xs mb-1">SCORE</p>
            <p className="text-3xl font-bold text-blue-400">{score}</p>
          </div>

          {/* Combo */}
          <div className="bg-purple-600/20 border border-purple-500 rounded-lg p-4 text-center">
            <p className="text-gray-300 text-xs mb-1">COMBO</p>
            <p className="text-3xl font-bold text-purple-400">{combo}x</p>
          </div>

          {/* Current Letter */}
          <div className="bg-green-600/20 border border-green-500 rounded-lg p-4 text-center">
            <p className="text-gray-300 text-xs mb-1">TRACE</p>
            <p className="text-3xl font-bold text-green-400">{targetLetter.toUpperCase()}</p>
          </div>

          {/* Time */}
          <div className={`rounded-lg p-4 text-center border ${timeRemaining <= 10 ? 'bg-red-600/30 border-red-500' : 'bg-orange-600/20 border-orange-500'}`}>
            <p className="text-gray-300 text-xs mb-1">TIME</p>
            <p className={`text-3xl font-bold ${timeRemaining <= 10 ? 'text-red-400 animate-pulse' : 'text-orange-400'}`}>{timeRemaining}s</p>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="w-full max-w-4xl bg-slate-800 border-2 border-slate-600 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="block w-full cursor-crosshair"
            style={{ display: 'block' }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4">
          {!gameActive ? (
            <button
              onClick={startGame}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition text-lg"
            >
              🚀 Start Game
            </button>
          ) : (
            <button
              onClick={endGame}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition text-lg"
            >
              ⏹ End Game
            </button>
          )}
        </div>

        {/* Game Over Screen */}
        {!gameActive && (score > 0 || combo > 0) && (
          <div className="bg-slate-700 border border-slate-600 rounded-lg p-8 text-center max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Game Over!</h2>
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-gray-400">Final Score</p>
                <p className="text-4xl font-bold text-blue-400">{score}</p>
              </div>
              <div>
                <p className="text-gray-400">Max Combo</p>
                <p className="text-3xl font-bold text-purple-400">{combo}x</p>
              </div>
            </div>
            <button
              onClick={startGame}
              className="w-full px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
