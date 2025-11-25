import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';

const AnalyticsPanel = ({ 
  currentSession = {},
  showDetailedStats = true,
  onExportReport
}) => {
  const [activeTab, setActiveTab] = useState('current');
  const [timeRange, setTimeRange] = useState('week');

  // Mock analytics data
  const [sessionData, setSessionData] = useState({
    wpm: 0,
    accuracy: 0,
    strokesCompleted: 0,
    averageStrokeTime: 0,
    gestureQuality: 0,
    sessionTime: 0
  });

  const [historicalData, setHistoricalData] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [skillBreakdown, setSkillBreakdown] = useState([]);

  useEffect(() => {
    // Simulate real-time session updates
    const interval = setInterval(() => {
      setSessionData(prev => ({
        wpm: Math.min(prev?.wpm + Math.random() * 2, 85),
        accuracy: Math.min(prev?.accuracy + Math.random() * 1, 96.5),
        strokesCompleted: prev?.strokesCompleted + Math.floor(Math.random() * 3),
        averageStrokeTime: 1.2 + Math.random() * 0.8,
        gestureQuality: Math.min(prev?.gestureQuality + Math.random() * 2, 92),
        sessionTime: prev?.sessionTime + 1
      }));
    }, 2000);

    // Load historical data
    setHistoricalData([
      { date: '2025-11-08', wpm: 45, accuracy: 87, sessions: 3 },
      { date: '2025-11-09', wpm: 52, accuracy: 89, sessions: 4 },
      { date: '2025-11-10', wpm: 48, accuracy: 91, sessions: 2 },
      { date: '2025-11-11', wpm: 58, accuracy: 88, sessions: 5 },
      { date: '2025-11-12', wpm: 61, accuracy: 93, sessions: 3 },
      { date: '2025-11-13', wpm: 67, accuracy: 90, sessions: 4 },
      { date: '2025-11-14', wpm: 72, accuracy: 94, sessions: 6 }
    ]);

    setProgressData([
      { skill: 'Basic Strokes', current: 95, target: 100 },
      { skill: 'Word Combinations', current: 78, target: 90 },
      { skill: 'Speed Writing', current: 65, target: 85 },
      { skill: 'Accuracy Control', current: 88, target: 95 },
      { skill: 'Complex Gestures', current: 42, target: 70 }
    ]);

    setSkillBreakdown([
      { category: 'Consonants', score: 92, improvement: '+5%' },
      { category: 'Vowels', score: 87, improvement: '+3%' },
      { category: 'Blends', score: 74, improvement: '+8%' },
      { category: 'Abbreviations', score: 68, improvement: '+12%' },
      { category: 'Numbers', score: 81, improvement: '+2%' }
    ]);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 75) return 'text-accent';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const tabs = [
    { id: 'current', label: 'Current Session', icon: 'Activity' },
    { id: 'progress', label: 'Progress Tracking', icon: 'TrendingUp' },
    { id: 'history', label: 'Session History', icon: 'Calendar' },
    { id: 'skills', label: 'Skill Analysis', icon: 'Target' }
  ];

  return (
    <div className="w-full h-full bg-card border border-border rounded-lg overflow-hidden">
      {/* Header with Tabs */}
      <div className="border-b border-border bg-muted">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="BarChart3" size={20} className="text-accent" />
            <h3 className="font-heading font-bold text-lg text-card-foreground">
              Performance Analytics
            </h3>
          </div>
          
          <div className="flex space-x-1 overflow-x-auto">
            {tabs?.map((tab) => (
              <Button
                key={tab?.id}
                variant={activeTab === tab?.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab?.id)}
                iconName={tab?.icon}
                iconPosition="left"
                iconSize={14}
                className={`
                  whitespace-nowrap font-body text-sm
                  ${activeTab === tab?.id 
                    ? 'bg-accent text-accent-foreground' 
                    : 'text-text-secondary hover:text-accent'
                  }
                `}
              >
                {tab?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Content Area */}
      <div className="p-4 overflow-y-auto h-full">
        {/* Current Session Tab */}
        {activeTab === 'current' && (
          <div className="space-y-6">
            {/* Real-time Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="font-data text-2xl font-bold text-accent mb-1">
                  {Math.round(sessionData?.wpm)}
                </div>
                <div className="font-caption text-xs text-text-secondary">
                  Words Per Minute
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="font-data text-2xl font-bold text-success mb-1">
                  {Math.round(sessionData?.accuracy)}%
                </div>
                <div className="font-caption text-xs text-text-secondary">
                  Accuracy Rate
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="font-data text-2xl font-bold text-warning mb-1">
                  {sessionData?.strokesCompleted}
                </div>
                <div className="font-caption text-xs text-text-secondary">
                  Strokes Completed
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="font-data text-2xl font-bold text-foreground mb-1">
                  {sessionData?.averageStrokeTime?.toFixed(1)}s
                </div>
                <div className="font-caption text-xs text-text-secondary">
                  Avg Stroke Time
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className={`font-data text-2xl font-bold mb-1 ${getScoreColor(sessionData?.gestureQuality)}`}>
                  {Math.round(sessionData?.gestureQuality)}
                </div>
                <div className="font-caption text-xs text-text-secondary">
                  Gesture Quality
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="font-data text-2xl font-bold text-accent mb-1">
                  {formatTime(sessionData?.sessionTime)}
                </div>
                <div className="font-caption text-xs text-text-secondary">
                  Session Time
                </div>
              </div>
            </div>

            {/* Session Actions */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                iconSize={16}
                onClick={onExportReport}
                className="border-accent text-accent hover:bg-accent/10"
              >
                Export Session
              </Button>
              
              <Button
                variant="ghost"
                iconName="RotateCcw"
                iconPosition="left"
                iconSize={16}
                className="text-warning hover:bg-warning/10"
              >
                Reset Session
              </Button>
            </div>
          </div>
        )}

        {/* Progress Tracking Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-body font-medium text-foreground">Skill Progress</h4>
              
              {progressData?.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm text-foreground">
                      {skill?.skill}
                    </span>
                    <span className="font-data text-sm text-text-secondary">
                      {skill?.current}% / {skill?.target}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-border rounded-full h-2">
                    <div 
                      className="bg-accent h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(skill?.current / skill?.target) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly Progress Chart */}
            <div className="space-y-3">
              <h4 className="font-body font-medium text-foreground">Weekly Progress</h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#B0B0B0"
                      fontSize={12}
                      tickFormatter={(value) => new Date(value)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis stroke="#B0B0B0" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#2A2A2A', 
                        border: '1px solid #333333',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="wpm" 
                      stroke="#00D4FF" 
                      fill="#00D4FF" 
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Session History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#B0B0B0"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#B0B0B0" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#2A2A2A', 
                      border: '1px solid #333333',
                      borderRadius: '8px',
                      color: '#FFFFFF'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="wpm" 
                    stroke="#00D4FF" 
                    strokeWidth={2}
                    dot={{ fill: '#00D4FF', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#00FF88" 
                    strokeWidth={2}
                    dot={{ fill: '#00FF88', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Sessions List */}
            <div className="space-y-3">
              <h4 className="font-body font-medium text-foreground">Recent Sessions</h4>
              <div className="space-y-2">
                {historicalData?.slice(-5)?.reverse()?.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon name="Calendar" size={16} className="text-accent" />
                      <div>
                        <div className="font-body text-sm font-medium text-foreground">
                          {new Date(session.date)?.toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="font-caption text-xs text-text-secondary">
                          {session?.sessions} sessions
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="text-center">
                        <div className="font-data font-medium text-accent">
                          {session?.wpm}
                        </div>
                        <div className="font-caption text-xs text-text-secondary">
                          WPM
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-data font-medium text-success">
                          {session?.accuracy}%
                        </div>
                        <div className="font-caption text-xs text-text-secondary">
                          ACC
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Skill Analysis Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-body font-medium text-foreground">Skill Breakdown</h4>
              
              {skillBreakdown?.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-3 h-3 rounded-full
                      ${skill?.score >= 90 ? 'bg-success' : 
                        skill?.score >= 75 ? 'bg-accent' : 
                        skill?.score >= 60 ? 'bg-warning' : 'bg-error'}
                    `} />
                    <div>
                      <div className="font-body font-medium text-foreground">
                        {skill?.category}
                      </div>
                      <div className="font-caption text-xs text-text-secondary">
                        {skill?.improvement} this week
                      </div>
                    </div>
                  </div>
                  
                  <div className={`font-data text-lg font-bold ${getScoreColor(skill?.score)}`}>
                    {skill?.score}%
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="space-y-3">
              <h4 className="font-body font-medium text-foreground">Recommendations</h4>
              <div className="space-y-2">
                <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon name="Lightbulb" size={16} className="text-accent mt-0.5" />
                    <div>
                      <div className="font-body text-sm font-medium text-accent">
                        Focus on Abbreviations
                      </div>
                      <div className="font-body text-xs text-text-secondary">
                        Your abbreviation accuracy is below target. Practice common business abbreviations.
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon name="TrendingUp" size={16} className="text-success mt-0.5" />
                    <div>
                      <div className="font-body text-sm font-medium text-success">
                        Great Progress on Blends
                      </div>
                      <div className="font-body text-xs text-text-secondary">
                        8% improvement this week! Keep practicing complex consonant blends.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPanel;