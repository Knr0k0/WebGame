import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    soundEnabled: true,
    brightness: 100,
    accuracy: 80,
    difficulty: 'intermediate'
  });

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gestureTypeSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('gestureTypeSettings', JSON.stringify(newSettings));
  };

  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  const handleSlider = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const handleSelect = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">⚙️ Settings</h1>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
        >
          ← Back
        </button>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Audio Settings */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Sound Effects</h3>
                <p className="text-gray-400 text-sm">Enable/disable audio feedback</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={() => handleToggle('soundEnabled')}
                  className="w-5 h-5 rounded"
                />
              </label>
            </div>
          </div>

          {/* Brightness Setting */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white">Brightness</h3>
              <p className="text-gray-400 text-sm">Adjust display brightness</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="50"
                max="150"
                value={settings.brightness}
                onChange={(e) => handleSlider('brightness', parseInt(e.target.value))}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-white font-semibold w-12 text-right">{settings.brightness}%</span>
            </div>
          </div>

          {/* Accuracy Threshold */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white">Accuracy Threshold</h3>
              <p className="text-gray-400 text-sm">Minimum accuracy % for gesture recognition</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={settings.accuracy}
                onChange={(e) => handleSlider('accuracy', parseInt(e.target.value))}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-white font-semibold w-12 text-right">{settings.accuracy}%</span>
            </div>
          </div>

          {/* Difficulty Setting */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white">Difficulty Level</h3>
              <p className="text-gray-400 text-sm">Choose your preferred difficulty</p>
            </div>
            <select
              value={settings.difficulty}
              onChange={(e) => handleSelect('difficulty', e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 transition"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          {/* Reset Button */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                const defaults = {
                  soundEnabled: true,
                  brightness: 100,
                  accuracy: 80,
                  difficulty: 'intermediate'
                };
                saveSettings(defaults);
              }}
              className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
            >
              Reset to Defaults
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition"
            >
              Save & Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
