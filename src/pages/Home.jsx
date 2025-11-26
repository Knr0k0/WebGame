import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">
          Gesture Type
        </h1>
        <p className="text-xl text-gray-300 mb-12">
          Master shorthand typing through immersive gaming
        </p>

        {/* Buttons Container */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
          {/* Arcade Button */}
          <button
            onClick={() => navigate('/arcade')}
            onMouseEnter={() => setHoveredButton('arcade')}
            onMouseLeave={() => setHoveredButton(null)}
            className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
              hoveredButton === 'arcade'
                ? 'bg-blue-600 shadow-lg shadow-blue-500/50 scale-105'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            🎮 Arcade Mode
          </button>

          {/* Practice Button */}
          <button
            onClick={() => navigate('/practice')}
            onMouseEnter={() => setHoveredButton('practice')}
            onMouseLeave={() => setHoveredButton(null)}
            className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
              hoveredButton === 'practice'
                ? 'bg-purple-600 shadow-lg shadow-purple-500/50 scale-105'
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white`}
          >
            📚 Practice Mode
          </button>
        </div>

        {/* Settings Button */}
        <button
          onClick={() => navigate('/settings')}
          onMouseEnter={() => setHoveredButton('settings')}
          onMouseLeave={() => setHoveredButton(null)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            hoveredButton === 'settings'
              ? 'bg-gray-700 shadow-lg shadow-gray-500/30 scale-105'
              : 'bg-gray-700 hover:bg-gray-600'
          } text-white`}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-gray-400 text-sm text-center">
        <p>Learn. Practice. Master. Type faster with gestures.</p>
      </div>
    </div>
  );
}
