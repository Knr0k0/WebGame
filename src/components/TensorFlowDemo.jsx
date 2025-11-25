import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { initializeTensorFlow, loadCustomModel } from '@/utils/tensorflow';

export default function GestureRecognitionDemo() {
  const [tfReady, setTfReady] = useState(false);
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const initTF = async () => {
      // Initialize TensorFlow
      const initialized = await initializeTensorFlow();
      setTfReady(initialized);

      // Load your custom model here (optional)
      // const loadedModel = await loadCustomModel('path/to/your/model.json');
      // setModel(loadedModel);
    };

    initTF();

    return () => {
      // Cleanup
      if (model) {
        model.dispose();
      }
    };
  }, []);

  const handleGesturePrediction = async () => {
    if (!tfReady) {
      alert('TensorFlow.js is not ready');
      return;
    }

    // Example: Create dummy gesture data and make prediction
    const gestureData = tf.tensor2d([[1, 2, 3, 4, 5, 6]]);
    
    try {
      // This is a placeholder - replace with actual model prediction
      console.log('Processing gesture...');
      setPrediction('Gesture detected');
      
      gestureData.dispose();
    } catch (error) {
      console.error('Error processing gesture:', error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">TensorFlow.js Integration</h2>
      
      <div className="space-y-4">
        <div className="p-3 bg-slate-700 rounded">
          <p className="text-sm text-gray-300">
            Status: <span className="font-semibold text-green-400">
              {tfReady ? 'TensorFlow Ready' : 'Loading...'}
            </span>
          </p>
        </div>

        <button
          onClick={handleGesturePrediction}
          disabled={!tfReady}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white rounded font-semibold transition"
        >
          Predict Gesture
        </button>

        {prediction && (
          <div className="p-3 bg-green-900 rounded">
            <p className="text-green-200">Prediction: {prediction}</p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full bg-black rounded border border-gray-600"
        />
      </div>
    </div>
  );
}
