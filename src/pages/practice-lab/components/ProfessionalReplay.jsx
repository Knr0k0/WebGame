import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ProfessionalReplay = ({ 
  sessionData = null,
  onCompareGestures,
  onExportReplay,
  showComparison = false
}) => {
  const [selectedReplay, setSelectedReplay] = useState(null);
  const [comparisonMode, setComparisonMode] = useState('side-by-side');
  const [replayList, setReplayList] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    // Load saved replay sessions
    setReplayList([
      {
        id: 1,
        name: "Perfect 'The' Gesture",
        date: "2025-11-14",
        wpm: 94,
        accuracy: 98.5,
        duration: 1.2,
        strokeCount: 3,
        quality: 'Excellent',
        category: 'Common Words'
      },
      {
        id: 2,
        name: "Business Abbreviations",
        date: "2025-11-13",
        wpm: 78,
        accuracy: 92.1,
        duration: 2.8,
        strokeCount: 12,
        quality: 'Good',
        category: 'Abbreviations'
      },
      {
        id: 3,
        name: "Speed Challenge Session",
        date: "2025-11-12",
        wpm: 85,
        accuracy: 89.7,
        duration: 5.4,
        strokeCount: 28,
        quality: 'Good',
        category: 'Speed Training'
      },
      {
        id: 4,
        name: "Complex Consonant Blends",
        date: "2025-11-11",
        wpm: 62,
        accuracy: 95.3,
        duration: 3.1,
        strokeCount: 15,
        quality: 'Very Good',
        category: 'Advanced'
      }
    ]);

    // Mock analysis data
    setAnalysisData({
      strokeAnalysis: [
        { metric: 'Curvature Accuracy', score: 92, benchmark: 95 },
        { metric: 'Speed Consistency', score: 87, benchmark: 90 },
        { metric: 'Pressure Control', score: 94, benchmark: 85 },
        { metric: 'Stroke Smoothness', score: 89, benchmark: 92 }
      ],
      improvements: [
        "Maintain consistent pressure throughout strokes",
        "Reduce hesitation at stroke transitions",
        "Practice smoother curve connections"
      ],
      strengths: [
        "Excellent stroke initiation timing",
        "Good overall gesture recognition",
        "Consistent stroke direction"
      ]
    });
  }, []);

  const comparisonModes = [
    { value: 'side-by-side', label: 'Side by Side', description: 'Compare gestures horizontally' },
    { value: 'overlay', label: 'Overlay', description: 'Superimpose gestures' },
    { value: 'sequential', label: 'Sequential', description: 'Play one after another' }
  ];

  const qualityColors = {
    'Excellent': 'text-success',
    'Very Good': 'text-accent',
    'Good': 'text-warning',
    'Needs Work': 'text-error'
  };

  const handleReplaySelect = (replay) => {
    setSelectedReplay(replay);
  };

  const handleComparisonModeChange = (mode) => {
    setComparisonMode(mode);
    onCompareGestures?.(selectedReplay, mode);
  };

  const getScoreColor = (score, benchmark) => {
    if (score >= benchmark) return 'text-success';
    if (score >= benchmark * 0.9) return 'text-accent';
    if (score >= benchmark * 0.8) return 'text-warning';
    return 'text-error';
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full h-full bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Video" size={20} className="text-accent" />
            <h3 className="font-heading font-bold text-lg text-card-foreground">
              Professional Replay
            </h3>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onExportReplay}
            iconName="Download"
            iconPosition="left"
            iconSize={16}
            className="border-accent text-accent hover:bg-accent/10"
          >
            Export
          </Button>
        </div>
      </div>
      {/* Content */}
      <div className="p-4 space-y-6 overflow-y-auto h-full">
        {/* Replay Selection */}
        <div className="space-y-4">
          <h4 className="font-body font-medium text-foreground">
            Saved Replay Sessions
          </h4>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {replayList?.map((replay) => (
              <div
                key={replay?.id}
                className={`
                  p-4 rounded-lg border cursor-pointer transition-all duration-200
                  ${selectedReplay?.id === replay?.id
                    ? 'border-accent bg-accent/10 shadow-neon'
                    : 'border-border bg-muted hover:border-accent/50 hover:bg-muted/80'
                  }
                `}
                onClick={() => handleReplaySelect(replay)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h5 className="font-body font-medium text-foreground">
                        {replay?.name}
                      </h5>
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${qualityColors?.[replay?.quality]} bg-current/10
                      `}>
                        {replay?.quality}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="font-caption text-text-secondary">WPM:</span>
                        <span className="font-data ml-1 text-accent">{replay?.wpm}</span>
                      </div>
                      <div>
                        <span className="font-caption text-text-secondary">Accuracy:</span>
                        <span className="font-data ml-1 text-success">{replay?.accuracy}%</span>
                      </div>
                      <div>
                        <span className="font-caption text-text-secondary">Duration:</span>
                        <span className="font-data ml-1 text-foreground">{replay?.duration}s</span>
                      </div>
                      <div>
                        <span className="font-caption text-text-secondary">Strokes:</span>
                        <span className="font-data ml-1 text-foreground">{replay?.strokeCount}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-caption text-xs text-text-secondary">
                        {replay?.category} • {formatDate(replay?.date)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <Icon 
                      name="Play" 
                      size={20} 
                      className={selectedReplay?.id === replay?.id ? 'text-accent' : 'text-text-secondary'}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Controls */}
        {selectedReplay && (
          <div className="space-y-4">
            <h4 className="font-body font-medium text-foreground">
              Comparison Analysis
            </h4>
            
            <Select
              label="Comparison Mode"
              options={comparisonModes}
              value={comparisonMode}
              onChange={handleComparisonModeChange}
              placeholder="Select comparison mode"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                fullWidth
                iconName="GitCompare"
                iconPosition="left"
                iconSize={16}
                className="border-accent text-accent hover:bg-accent/10"
              >
                Compare with Current
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                iconName="Layers"
                iconPosition="left"
                iconSize={16}
                className="border-success text-success hover:bg-success/10"
              >
                Overlay Analysis
              </Button>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {selectedReplay && analysisData && (
          <div className="space-y-4">
            <h4 className="font-body font-medium text-foreground">
              Detailed Analysis
            </h4>
            
            {/* Stroke Metrics */}
            <div className="space-y-3">
              <h5 className="font-body text-sm font-medium text-foreground">
                Stroke Metrics
              </h5>
              
              {analysisData?.strokeAnalysis?.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-body text-sm text-foreground">
                    {metric?.metric}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className={`font-data font-medium ${getScoreColor(metric?.score, metric?.benchmark)}`}>
                      {metric?.score}%
                    </span>
                    <span className="font-caption text-xs text-text-secondary">
                      / {metric?.benchmark}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Strengths */}
            <div className="space-y-2">
              <h5 className="font-body text-sm font-medium text-success">
                Strengths
              </h5>
              <div className="space-y-1">
                {analysisData?.strengths?.map((strength, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-success/10 rounded">
                    <Icon name="CheckCircle" size={14} className="text-success mt-0.5 flex-shrink-0" />
                    <span className="font-body text-sm text-foreground">
                      {strength}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvements */}
            <div className="space-y-2">
              <h5 className="font-body text-sm font-medium text-warning">
                Areas for Improvement
              </h5>
              <div className="space-y-1">
                {analysisData?.improvements?.map((improvement, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-warning/10 rounded">
                    <Icon name="AlertCircle" size={14} className="text-warning mt-0.5 flex-shrink-0" />
                    <span className="font-body text-sm text-foreground">
                      {improvement}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-border">
          <Button
            variant="default"
            fullWidth
            iconName="Play"
            iconPosition="left"
            iconSize={16}
            disabled={!selectedReplay}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Play Selected Replay
          </Button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              fullWidth
              iconName="Save"
              iconPosition="left"
              iconSize={16}
              className="border-success text-success hover:bg-success/10"
            >
              Save Current Session
            </Button>
            
            <Button
              variant="outline"
              fullWidth
              iconName="Share"
              iconPosition="left"
              iconSize={16}
              className="border-text-secondary text-text-secondary hover:bg-muted"
            >
              Share Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalReplay;