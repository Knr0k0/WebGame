import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';

const ControlPanel = ({ 
  onModeChange, 
  onSettingsChange, 
  onWordListImport,
  currentMode = 'free-drawing',
  settings = {}
}) => {
  const [selectedMode, setSelectedMode] = useState(currentMode);
  const [difficulty, setDifficulty] = useState('beginner');
  const [customWords, setCustomWords] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const practiceModes = [
    { value: 'free-drawing', label: 'Free Drawing', description: 'Practice without constraints' },
    { value: 'guided-tracing', label: 'Guided Tracing', description: 'Follow ghost overlay paths' },
    { value: 'speed-challenge', label: 'Speed Challenge', description: 'Timed gesture practice' },
    { value: 'accuracy-drill', label: 'Accuracy Drill', description: 'Focus on precision' },
    { value: 'custom-words', label: 'Custom Words', description: 'Practice specific vocabulary' }
  ];

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner', description: 'Basic shorthand symbols' },
    { value: 'intermediate', label: 'Intermediate', description: 'Common word combinations' },
    { value: 'advanced', label: 'Advanced', description: 'Complex phrases and abbreviations' },
    { value: 'expert', label: 'Expert', description: 'Professional shorthand forms' }
  ];

  const backgroundOptions = [
    { value: 'dark', label: 'Dark Theme' },
    { value: 'light', label: 'Light Theme' },
    { value: 'grid', label: 'Grid Pattern' }
  ];

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    onModeChange?.(mode);
  };

  const handleDifficultyChange = (level) => {
    setDifficulty(level);
    onSettingsChange?.({ ...settings, difficulty: level });
  };

  const handleSettingToggle = (setting, value) => {
    onSettingsChange?.({ ...settings, [setting]: value });
  };

  const handleWordListSubmit = () => {
    if (customWords?.trim()) {
      const wordList = customWords?.split('\n')?.filter(word => word?.trim());
      onWordListImport?.(wordList);
      setCustomWords('');
    }
  };

  const sampleWordLists = [
    { name: 'Business Terms', count: 150, category: 'Professional' },
    { name: 'Medical Vocabulary', count: 200, category: 'Healthcare' },
    { name: 'Legal Phrases', count: 180, category: 'Legal' },
    { name: 'Technical Terms', count: 120, category: 'Technology' }
  ];

  return (
    <div className="w-full h-full bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted">
        <div className="flex items-center space-x-2">
          <Icon name="Settings" size={20} className="text-accent" />
          <h3 className="font-heading font-bold text-lg text-card-foreground">
            Practice Controls
          </h3>
        </div>
      </div>
      {/* Content */}
      <div className="p-4 space-y-6 overflow-y-auto h-full">
        {/* Practice Mode Selection */}
        <div className="space-y-3">
          <label className="font-body font-medium text-foreground">
            Practice Mode
          </label>
          <Select
            options={practiceModes}
            value={selectedMode}
            onChange={handleModeChange}
            placeholder="Select practice mode"
          />
        </div>

        {/* Difficulty Level */}
        <div className="space-y-3">
          <label className="font-body font-medium text-foreground">
            Difficulty Level
          </label>
          <Select
            options={difficultyLevels}
            value={difficulty}
            onChange={handleDifficultyChange}
            placeholder="Select difficulty"
          />
        </div>

        {/* Canvas Settings */}
        <div className="space-y-4">
          <h4 className="font-body font-medium text-foreground">Canvas Settings</h4>
          
          <div className="space-y-3">
            <Checkbox
              label="Show Grid Overlay"
              description="Display alignment grid on canvas"
              checked={settings?.showGrid || false}
              onChange={(e) => handleSettingToggle('showGrid', e?.target?.checked)}
            />
            
            <Checkbox
              label="Ghost Path Guidance"
              description="Show correct gesture paths"
              checked={settings?.showGhost || false}
              onChange={(e) => handleSettingToggle('showGhost', e?.target?.checked)}
            />
            
            <Checkbox
              label="Real-time Feedback"
              description="Instant stroke quality analysis"
              checked={settings?.realtimeFeedback || false}
              onChange={(e) => handleSettingToggle('realtimeFeedback', e?.target?.checked)}
            />
          </div>

          <Select
            label="Canvas Background"
            options={backgroundOptions}
            value={settings?.canvasBackground || 'dark'}
            onChange={(value) => handleSettingToggle('canvasBackground', value)}
          />
        </div>

        {/* Custom Word List */}
        {selectedMode === 'custom-words' && (
          <div className="space-y-4">
            <h4 className="font-body font-medium text-foreground">Custom Word List</h4>
            
            <div className="space-y-3">
              <Input
                label="Enter Words"
                type="text"
                placeholder="Type words separated by new lines"
                value={customWords}
                onChange={(e) => setCustomWords(e?.target?.value)}
                description="One word per line, up to 100 words"
              />
              
              <Button
                variant="outline"
                fullWidth
                onClick={handleWordListSubmit}
                disabled={!customWords?.trim()}
                iconName="Upload"
                iconPosition="left"
                iconSize={16}
                className="border-accent text-accent hover:bg-accent/10"
              >
                Import Word List
              </Button>
            </div>

            {/* Sample Word Lists */}
            <div className="space-y-2">
              <label className="font-body text-sm font-medium text-foreground">
                Sample Word Lists
              </label>
              <div className="space-y-2">
                {sampleWordLists?.map((list, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                    onClick={() => onWordListImport?.(list)}
                  >
                    <div>
                      <div className="font-body font-medium text-foreground">
                        {list?.name}
                      </div>
                      <div className="font-caption text-xs text-text-secondary">
                        {list?.category} • {list?.count} words
                      </div>
                    </div>
                    <Icon name="Download" size={16} className="text-accent" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Advanced Settings */}
        <div className="space-y-4">
          <Button
            variant="ghost"
            fullWidth
            onClick={() => setShowAdvanced(!showAdvanced)}
            iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            iconSize={16}
            className="text-text-secondary hover:text-accent justify-between"
          >
            Advanced Settings
          </Button>

          {showAdvanced && (
            <div className="space-y-3 pl-4 border-l-2 border-accent/20">
              <Checkbox
                label="Stroke Smoothing"
                description="Auto-smooth drawn gestures"
                checked={settings?.strokeSmoothing || false}
                onChange={(e) => handleSettingToggle('strokeSmoothing', e?.target?.checked)}
              />
              
              <Checkbox
                label="Pressure Sensitivity"
                description="Vary stroke width by pressure"
                checked={settings?.pressureSensitive || false}
                onChange={(e) => handleSettingToggle('pressureSensitive', e?.target?.checked)}
              />
              
              <Checkbox
                label="Audio Feedback"
                description="Sound effects for gestures"
                checked={settings?.audioFeedback || false}
                onChange={(e) => handleSettingToggle('audioFeedback', e?.target?.checked)}
              />
              
              <Checkbox
                label="Gesture Trails"
                description="Neon trail effects"
                checked={settings?.gestureTrails || false}
                onChange={(e) => handleSettingToggle('gestureTrails', e?.target?.checked)}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-border">
          <Button
            variant="default"
            fullWidth
            iconName="Play"
            iconPosition="left"
            iconSize={16}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Start Practice Session
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            iconName="RotateCcw"
            iconPosition="left"
            iconSize={16}
            className="border-warning text-warning hover:bg-warning/10"
          >
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;