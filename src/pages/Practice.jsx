import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GestureRecognitionCanvas from './practice-lab/components/GestureRecognitionCanvas';

export default function Practice() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('draw'); // 'draw' or 'train'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">📚 Practice Mode</h1>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
        >
          ← Back
        </button>
      </div>

      {/* Mode Selector */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex gap-4">
          <button
            onClick={() => setMode('draw')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              mode === 'draw'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            Draw & Recognize
          </button>
          <button
            onClick={() => setMode('train')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              mode === 'train'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            Train Mode
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <GestureRecognitionCanvas />
        </div>
      </div>
    </div>
  );
}
