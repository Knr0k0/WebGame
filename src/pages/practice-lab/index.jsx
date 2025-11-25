import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import InGameNavigation from '../../components/ui/InGameNavigation';
import DrawingCanvas from './components/DrawingCanvas';
import ControlPanel from './components/ControlPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import SlowMotionControls from './components/SlowMotionControls';
import ProfessionalReplay from './components/ProfessionalReplay';

import Button from '../../components/ui/Button';

const PracticeLab = () => {
  const navigate = useNavigate();
  
  // Main state management
  const [practiceMode, setPracticeMode] = useState('free-drawing');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activePanel, setActivePanel] = useState('controls');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Canvas and drawing state
  const [canvasSettings, setCanvasSettings] = useState({
    showGrid: false,
    showGhost: false,
    canvasBackground: 'dark',
    realtimeFeedback: true,
    strokeSmoothing: true,
    pressureSensitive: false,
    audioFeedback: true,
    gestureTrails: true
  });
  
  // Session tracking
  const [sessionStats, setSessionStats] = useState({
    wpm: 0,
    accuracy: 0,
    strokesCompleted: 0,
    sessionTime: 0,
    gestureQuality: 0,
    combo: 0,
    score: 0
  });
  
  // Slow motion and replay state
  const [slowMotionActive, setSlowMotionActive] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [replayData, setReplayData] = useState(null);
  const [showReplay, setShowReplay] = useState(false);

  // Ghost path data for guided tracing
  const [ghostPath, setGhostPath] = useState([]);

  useEffect(() => {
    // Initialize session timer
    const timer = setInterval(() => {
      if (!isPaused) {
        setSessionStats(prev => ({
          ...prev,
          sessionTime: prev?.sessionTime + 1
        }));
      }
    }, 1000);

    // Load ghost path for guided tracing mode
    if (practiceMode === 'guided-tracing') {
      setGhostPath([
        { x: 100, y: 200 },
        { x: 150, y: 180 },
        { x: 200, y: 160 },
        { x: 250, y: 180 },
        { x: 300, y: 200 }
      ]);
    } else {
      setGhostPath([]);
    }

    return () => clearInterval(timer);
  }, [isPaused, practiceMode]);

  const handleModeChange = (mode) => {
    setPracticeMode(mode);
    // Reset session stats when changing modes
    setSessionStats(prev => ({
      ...prev,
      strokesCompleted: 0,
      combo: 0,
      score: 0
    }));
  };

  const handleSettingsChange = (newSettings) => {
    setCanvasSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleWordListImport = (wordList) => {
    console.log('Imported word list:', wordList);
    // Handle custom word list import
  };

  const handleStrokeComplete = (strokeData) => {
    // Analyze stroke and update stats
    const quality = Math.random() * 20 + 80; // Mock quality score
    const wpmIncrease = Math.random() * 2;
    
    setSessionStats(prev => ({
      ...prev,
      strokesCompleted: prev?.strokesCompleted + 1,
      wpm: Math.min(prev?.wpm + wpmIncrease, 100),
      accuracy: Math.min(prev?.accuracy + 0.5, 100),
      gestureQuality: quality,
      combo: prev?.combo + 1,
      score: prev?.score + Math.floor(quality * 10)
    }));

    // Store stroke data for replay
    if (replayData) {
      setReplayData(prev => ({
        ...prev,
        strokes: [...(prev?.strokes || []), strokeData]
      }));
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleRestart = () => {
    setSessionStats({
      wpm: 0,
      accuracy: 0,
      strokesCompleted: 0,
      sessionTime: 0,
      gestureQuality: 0,
      combo: 0,
      score: 0
    });
    setIsPaused(false);
  };

  const handleSlowMotionToggle = () => {
    setSlowMotionActive(!slowMotionActive);
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
  };

  // Add this handler for missing prop
  const handleFrameStep = (direction) => {
    console.log('Frame step:', direction);
    // Handle frame-by-frame navigation
  };

  // Add this handler for missing prop
  const handleCompareGestures = (gestureData) => {
    console.log('Comparing gestures:', gestureData);
    // Handle gesture comparison
  };

  const handleExportReport = () => {
    const report = {
      mode: practiceMode,
      stats: sessionStats,
      settings: canvasSettings,
      timestamp: new Date()?.toISOString()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `practice-session-${Date.now()}.json`;
    a?.click();
    URL.revokeObjectURL(url);
  };

  const panelOptions = [
    { id: 'controls', label: 'Controls', icon: 'Settings' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'slowmotion', label: 'Slow Motion', icon: 'Clock' },
    { id: 'replay', label: 'Replay', icon: 'Video' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <InGameNavigation
        gameMode="practice-lab"
        isPaused={isPaused}
        onPause={handlePause}
        onResume={handleResume}
        onRestart={handleRestart}
        showStats={true}
        stats={sessionStats}
      />
      {/* Main Content */}
      <div className="pt-28 pb-6 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
            {/* Left Panel - Controls */}
            <div className="col-span-3">
              <ControlPanel
                onModeChange={handleModeChange}
                onSettingsChange={handleSettingsChange}
                onWordListImport={handleWordListImport}
                currentMode={practiceMode}
                settings={canvasSettings}
              />
            </div>

            {/* Center - Drawing Canvas */}
            <div className="col-span-6">
              <DrawingCanvas
                isDrawing={!isPaused}
                onDrawingChange={setIsDrawing}
                showGrid={canvasSettings?.showGrid}
                showGhost={canvasSettings?.showGhost && practiceMode === 'guided-tracing'}
                ghostPath={ghostPath}
                onStrokeComplete={handleStrokeComplete}
                canvasBackground={canvasSettings?.canvasBackground}
              />
            </div>

            {/* Right Panel - Analytics/Controls */}
            <div className="col-span-3">
              <div className="space-y-4 h-full">
                {/* Panel Selector */}
                <div className="bg-card border border-border rounded-lg p-2">
                  <div className="grid grid-cols-2 gap-1">
                    {panelOptions?.map((panel) => (
                      <Button
                        key={panel?.id}
                        variant={activePanel === panel?.id ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActivePanel(panel?.id)}
                        iconName={panel?.icon}
                        iconPosition="left"
                        iconSize={14}
                        className={`
                          font-body text-xs
                          ${activePanel === panel?.id 
                            ? 'bg-accent text-accent-foreground' 
                            : 'text-text-secondary hover:text-accent'
                          }
                        `}
                      >
                        {panel?.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Active Panel Content */}
                <div className="flex-1">
                  {activePanel === 'controls' && (
                    <div className="h-full overflow-hidden">
                      <SlowMotionControls
                        isActive={slowMotionActive}
                        onToggle={handleSlowMotionToggle}
                        onSpeedChange={handleSpeedChange}
                        onFrameStep={handleFrameStep}
                        replayData={replayData}
                        showReplay={showReplay}
                      />
                    </div>
                  )}
                  
                  {activePanel === 'analytics' && (
                    <AnalyticsPanel
                      currentSession={sessionStats}
                      showDetailedStats={true}
                      onExportReport={handleExportReport}
                    />
                  )}
                  
                  {activePanel === 'slowmotion' && (
                    <SlowMotionControls
                      isActive={slowMotionActive}
                      onToggle={handleSlowMotionToggle}
                      onSpeedChange={handleSpeedChange}
                      onFrameStep={handleFrameStep}
                      replayData={replayData}
                      showReplay={showReplay}
                    />
                  )}
                  
                  {activePanel === 'replay' && (
                    <ProfessionalReplay
                      sessionData={sessionStats}
                      onExportReplay={handleExportReport}
                      onCompareGestures={handleCompareGestures}
                      showComparison={true}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-4">
            {/* Mobile Header */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="font-heading font-bold text-xl text-foreground">
                  Practice Lab
                </h1>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  iconName="Menu"
                  iconSize={16}
                  className="text-accent border-accent"
                >
                  Controls
                </Button>
              </div>

              {/* Mobile Stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="font-data text-lg font-bold text-accent">
                    {Math.round(sessionStats?.wpm)}
                  </div>
                  <div className="font-caption text-xs text-text-secondary">
                    WPM
                  </div>
                </div>
                <div>
                  <div className="font-data text-lg font-bold text-success">
                    {Math.round(sessionStats?.accuracy)}%
                  </div>
                  <div className="font-caption text-xs text-text-secondary">
                    Accuracy
                  </div>
                </div>
                <div>
                  <div className="font-data text-lg font-bold text-warning">
                    {sessionStats?.strokesCompleted}
                  </div>
                  <div className="font-caption text-xs text-text-secondary">
                    Strokes
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Canvas */}
            <div className="h-96">
              <DrawingCanvas
                isDrawing={!isPaused}
                onDrawingChange={setIsDrawing}
                showGrid={canvasSettings?.showGrid}
                showGhost={canvasSettings?.showGhost && practiceMode === 'guided-tracing'}
                ghostPath={ghostPath}
                onStrokeComplete={handleStrokeComplete}
                canvasBackground={canvasSettings?.canvasBackground}
              />
            </div>

            {/* Mobile Controls Overlay */}
            {isMobileMenuOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
                <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-lg max-h-[80vh] overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-bold text-lg text-foreground">
                        Practice Controls
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                        iconName="X"
                        iconSize={16}
                        className="text-text-secondary"
                      />
                    </div>
                  </div>
                  
                  <div className="overflow-y-auto max-h-96">
                    <ControlPanel
                      onModeChange={handleModeChange}
                      onSettingsChange={handleSettingsChange}
                      onWordListImport={handleWordListImport}
                      currentMode={practiceMode}
                      settings={canvasSettings}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Analytics */}
            <div className="space-y-4">
              <AnalyticsPanel
                currentSession={sessionStats}
                showDetailedStats={false}
                onExportReport={handleExportReport}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center space-x-3 bg-card border border-border rounded-lg p-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/glyph-story-mode')}
                iconName="BookOpen"
                iconPosition="left"
                iconSize={16}
                className="border-success text-success hover:bg-success/10"
              >
                Story Mode
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/lexicon-breaker')}
                iconName="Zap"
                iconPosition="left"
                iconSize={16}
                className="border-accent text-accent hover:bg-accent/10"
              >
                Arcade Mode
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/daily-run')}
                iconName="Calendar"
                iconPosition="left"
                iconSize={16}
                className="border-warning text-warning hover:bg-warning/10"
              >
                Daily Challenge
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeLab;