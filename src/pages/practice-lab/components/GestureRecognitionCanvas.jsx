import React, { useRef, useEffect, useState, useCallback } from 'react';
import { DollarRecognizer, Point } from '@/utils/dollar-recognizer';
import { GestureTemplateManager, createDefaultTemplates, normalizePoints } from '@/utils/gestureTemplateManager';
import Button from '../../../components/ui/Button';

const ACCURACY_THRESHOLD = 0.80; // 80% accuracy
const MIN_STROKE_LENGTH = 10;

// Sample letters available for tracing (you can extend this)
const AVAILABLE_LETTERS = ['a', 'e', 'i', 'l', 'o', 's', 't', 'b', 'c', 'd', 'f', 'g', 'h'];

export default function GestureRecognitionCanvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState([]);
  const [allStrokes, setAllStrokes] = useState([]);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [recognitionHistory, setRecognitionHistory] = useState([]);
  const [gestureMode, setGestureMode] = useState('draw'); // 'draw' or 'train'
  const [selectedGesture, setSelectedGesture] = useState('a');
  const [trainingData, setTrainingData] = useState(new Map());
  const [feedback, setFeedback] = useState('');
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [tracingImage, setTracingImage] = useState(null);
  const [ghostOpacity, setGhostOpacity] = useState(0.3);
  const [stats, setStats] = useState({
    strokes: 0,
    accuracy: 0,
    successCount: 0,
    totalAttempts: 0,
    currentStreak: 0
  });
  const [sessionActive, setSessionActive] = useState(false);

  const recognizerRef = useRef(new DollarRecognizer());
  const templateManagerRef = useRef(createDefaultTemplates());
  
  // Get random letter
  const getRandomLetter = useCallback(() => {
    return AVAILABLE_LETTERS[Math.floor(Math.random() * AVAILABLE_LETTERS.length)];
  }, []);

  // Load tracing image when gesture changes
  const loadTracingImage = useCallback((letter) => {
    // Generate a path to the letter image from datasets
    // This uses the public folder as a fallback with a placeholder
    // In production, you'd want to serve these from your datasets-main folder
    const imagePath = `/images/${letter}.png`;
    
    const img = new Image();
    img.onload = () => {
      setTracingImage(img);
    };
    img.onerror = () => {
      // Fallback: create a placeholder with the letter
      console.log(`Image not found: ${imagePath}`);
      setTracingImage(null);
    };
    img.src = imagePath;
  }, []);

  // Initialize canvas and add default templates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      const rect = container?.getBoundingClientRect();
      const newWidth = Math.max(600, rect?.width - 32);
      const newHeight = Math.max(400, rect?.height - 200);

      setCanvasSize({ width: newWidth, height: newHeight });
      canvas.width = newWidth;
      canvas.height = newHeight;
      redrawCanvas();
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Load default templates into recognizer
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

    // Load initial tracing image
    loadTracingImage(selectedGesture);

    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [loadTracingImage, selectedGesture]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw tracing image as ghost/guide
    if (tracingImage && gestureMode === 'draw') {
      ctx.globalAlpha = ghostOpacity;
      
      // Calculate dimensions to fit image while maintaining aspect ratio
      const maxWidth = canvas.width * 0.6;
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

    // Draw completed strokes
    allStrokes.forEach(stroke => {
      drawStroke(ctx, stroke, '#00D4FF', 3);
    });

    // Draw current stroke
    if (currentStroke.length > 0) {
      drawStroke(ctx, currentStroke, '#00FF88', 4);
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
    setIsDrawing(true);
    const coords = getCanvasCoordinates(e);
    setCurrentStroke([coords]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const coords = getCanvasCoordinates(e);
    const newStroke = [...currentStroke, coords];
    setCurrentStroke(newStroke);
    redrawCanvas();
  };

  const handleMouseUp = async (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentStroke.length < MIN_STROKE_LENGTH) {
      setFeedback('Stroke too short. Please draw again.');
      return;
    }

    if (gestureMode === 'train') {
      // Training mode: add to training data
      const currentData = trainingData.get(selectedGesture) || [];
      currentData.push([...currentStroke]);
      setTrainingData(new Map(trainingData.set(selectedGesture, currentData)));

      setFeedback(
        `Training sample added for '${selectedGesture}' (${currentData.length} samples)`
      );

      // Add to recognizer for immediate testing
      recognizerRef.current.addGesture(
        `${selectedGesture}-train-${currentData.length}`,
        currentStroke
      );
    } else {
      // Recognition mode: recognize the gesture
      const result = recognizerRef.current.recognize(currentStroke);

      // Calculate accuracy as a percentage (score ranges from 0 to ~1)
      const accuracy = Math.min(result.score / 64, 1.0); // Normalize score

      const isMatch = accuracy >= ACCURACY_THRESHOLD;

      setRecognitionResult({
        gesture: result.name,
        score: result.score,
        accuracy: (accuracy * 100).toFixed(2),
        time: result.time,
        isMatch
      });

      // Update stats
      setStats(prevStats => ({
        strokes: prevStats.strokes + 1,
        accuracy: (prevStats.accuracy + parseFloat(accuracy * 100)) / 2,
        successCount: prevStats.successCount + (isMatch ? 1 : 0),
        totalAttempts: prevStats.totalAttempts + 1,
        currentStreak: isMatch ? prevStats.currentStreak + 1 : 0
      }));

      setFeedback(
        isMatch
          ? `✓ Recognized: "${result.name}" (${accuracy.toFixed(2)}% accuracy)`
          : `✗ Low confidence. Best match: "${result.name}" (${accuracy.toFixed(2)}%)`
      );

      // Add to history
      setRecognitionHistory([
        {
          gesture: result.name,
          accuracy: (accuracy * 100).toFixed(2),
          timestamp: new Date().toLocaleTimeString(),
          isMatch: isMatch
        },
        ...recognitionHistory.slice(0, 9)
      ]);

      // Change to random letter after each stroke
      setTimeout(() => {
        const newLetter = getRandomLetter();
        handleGestureChange(newLetter);
      }, 500);
    }

    const newStroke = [...allStrokes, currentStroke];
    setAllStrokes(newStroke);
    setCurrentStroke([]);
    redrawCanvas();
  };

  const clearCanvas = () => {
    setAllStrokes([]);
    setCurrentStroke([]);
    setRecognitionResult(null);
    setFeedback('');
    redrawCanvas();
  };

  const commitTrainingData = () => {
    if (trainingData.size === 0) {
      setFeedback('No training data to commit.');
      return;
    }

    // Clear current recognizer and reload with training data
    recognizerRef.current.clear();

    // Re-add all training data
    trainingData.forEach((samples, gestureName) => {
      samples.forEach((stroke, index) => {
        recognizerRef.current.addGesture(`${gestureName}-${index}`, stroke);
      });
    });

    setFeedback(
      `✓ Committed ${trainingData.size} gesture types with ${Array.from(trainingData.values()).reduce((sum, arr) => sum + arr.length, 0)} samples`
    );
  };

  const handleGestureChange = (gesture) => {
    setSelectedGesture(gesture);
    loadTracingImage(gesture);
    setAllStrokes([]);
    setCurrentStroke([]);
    setRecognitionResult(null);
    setFeedback('');
  };

  const startSession = () => {
    setSessionActive(true);
    setStats({
      strokes: 0,
      accuracy: 0,
      successCount: 0,
      totalAttempts: 0,
      currentStreak: 0
    });
    clearCanvas();
  };

  const endSession = () => {
    setSessionActive(false);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gesture Recognition Canvas</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setGestureMode('draw')}
            className={`px-4 py-2 rounded font-semibold transition ${
              gestureMode === 'draw'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            Draw Mode
          </button>
          <button
            onClick={() => setGestureMode('train')}
            className={`px-4 py-2 rounded font-semibold transition ${
              gestureMode === 'train'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            Train Mode
          </button>
        </div>
      </div>

      {/* Session Stats */}
      {gestureMode === 'draw' && sessionActive && (
        <div className="grid grid-cols-5 gap-2 p-3 bg-slate-700 rounded">
          <div className="text-center">
            <p className="text-gray-400 text-xs">STROKES</p>
            <p className="text-lg font-bold text-blue-400">{stats.strokes}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">ACCURACY</p>
            <p className="text-lg font-bold text-green-400">{stats.accuracy.toFixed(1)}%</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">SUCCESS</p>
            <p className="text-lg font-bold text-purple-400">{stats.successCount}/{stats.totalAttempts}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">STREAK</p>
            <p className="text-lg font-bold text-orange-400">{stats.currentStreak}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">SUCCESS RATE</p>
            <p className="text-lg font-bold text-cyan-400">{stats.totalAttempts > 0 ? ((stats.successCount / stats.totalAttempts) * 100).toFixed(0) : 0}%</p>
          </div>
        </div>
      )}

      {gestureMode === 'train' && (
        <div className="bg-slate-700 p-4 rounded">
          <p className="text-gray-300 mb-3">Select letter to train:</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {AVAILABLE_LETTERS.map(gesture => (
              <button
                key={gesture}
                onClick={() => handleGestureChange(gesture)}
                className={`px-3 py-1 rounded font-semibold transition ${
                  selectedGesture === gesture
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
                }`}
              >
                {gesture}
                {trainingData.get(gesture) && (
                  <span className="ml-1 text-xs">({trainingData.get(gesture).length})</span>
                )}
              </button>
            ))}
          </div>
          <Button onClick={commitTrainingData} variant="primary" size="sm">
            Commit Training Data
          </Button>
        </div>
      )}

      {gestureMode === 'draw' && (
        <div className="bg-slate-700 p-4 rounded space-y-4">
          <div>
            <p className="text-gray-300 mb-3">Select letter to trace:</p>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_LETTERS.map(gesture => (
                <button
                  key={gesture}
                  onClick={() => handleGestureChange(gesture)}
                  className={`px-3 py-1 rounded font-semibold transition text-sm ${
                    selectedGesture === gesture
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
                  }`}
                >
                  {gesture}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-2 block">
              Image Opacity: {(ghostOpacity * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={ghostOpacity * 100}
              onChange={(e) => setGhostOpacity(parseInt(e.target.value) / 100)}
              className="w-full"
            />
            <p className="text-gray-400 text-xs mt-1">Adjust how visible the letter guide is</p>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="border-2 border-slate-600 rounded-lg overflow-hidden bg-slate-950">
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

      {/* Controls */}
      <div className="flex gap-2">
        {gestureMode === 'draw' ? (
          <>
            {!sessionActive ? (
              <button
                onClick={startSession}
                className="flex-1 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition"
              >
                🚀 Start Session
              </button>
            ) : (
              <>
                <button
                  onClick={clearCanvas}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition"
                >
                  Clear
                </button>
                <button
                  onClick={endSession}
                  className="flex-1 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
                >
                  ⏹ End Session
                </button>
              </>
            )}
          </>
        ) : (
          <Button onClick={clearCanvas} variant="secondary" size="sm">
            Clear Canvas
          </Button>
        )}
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded font-semibold ${
            feedback.includes('✓')
              ? 'bg-green-900 text-green-200'
              : feedback.includes('✗')
              ? 'bg-red-900 text-red-200'
              : 'bg-blue-900 text-blue-200'
          }`}
        >
          {feedback}
        </div>
      )}

      {/* Recognition Result Details */}
      {recognitionResult && gestureMode === 'draw' && (
        <div className="grid grid-cols-2 gap-2 p-4 bg-slate-700 rounded">
          <div>
            <p className="text-gray-400 text-sm">Gesture</p>
            <p className="text-white font-bold text-lg">{recognitionResult.gesture}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Accuracy</p>
            <p
              className={`font-bold text-lg ${
                recognitionResult.isMatch ? 'text-green-400' : 'text-orange-400'
              }`}
            >
              {recognitionResult.accuracy}%
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Score</p>
            <p className="text-white font-mono">{recognitionResult.score.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Time</p>
            <p className="text-white font-mono">{recognitionResult.time.toFixed(2)}ms</p>
          </div>
        </div>
      )}

      {/* Recognition History */}
      {recognitionHistory.length > 0 && gestureMode === 'draw' && (
        <div className="bg-slate-700 p-4 rounded">
          <h3 className="text-white font-bold mb-2">Recent Recognitions</h3>
          <div className="space-y-1">
            {recognitionHistory.slice(0, 5).map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm text-gray-300">
                <span>"{item.gesture}"</span>
                <span>{item.accuracy}% @ {item.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
