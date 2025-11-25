import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChapterPanel = ({ 
  currentChapter, 
  chapterProgress, 
  objectives, 
  shorthandRules,
  onNextChapter,
  onPreviousChapter 
}) => {
  const progressPercentage = (chapterProgress?.completed / chapterProgress?.total) * 100;

  return (
    <div className="w-full h-full bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Chapter Header */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-heading font-bold text-lg text-card-foreground">
            Chapter {currentChapter?.number}
          </h2>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPreviousChapter}
              iconName="ChevronLeft"
              iconSize={16}
              disabled={currentChapter?.number <= 1}
              className="text-text-secondary hover:text-accent"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onNextChapter}
              iconName="ChevronRight"
              iconSize={16}
              disabled={!currentChapter?.unlocked}
              className="text-text-secondary hover:text-accent"
            />
          </div>
        </div>
        
        <h3 className="font-body font-medium text-accent mb-2">
          {currentChapter?.title}
        </h3>
        
        <p className="font-body text-sm text-text-secondary leading-relaxed">
          {currentChapter?.description}
        </p>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-caption text-xs text-text-secondary">
              Progress
            </span>
            <span className="font-data text-xs text-accent font-medium">
              {chapterProgress?.completed}/{chapterProgress?.total}
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-500 shadow-neon"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
      {/* Current Objectives */}
      <div className="space-y-3">
        <h4 className="font-heading font-medium text-foreground flex items-center space-x-2">
          <Icon name="Target" size={16} className="text-success" />
          <span>Objectives</span>
        </h4>
        
        <div className="space-y-2">
          {objectives?.map((objective, index) => (
            <div 
              key={index}
              className={`
                flex items-start space-x-3 p-3 rounded-lg border transition-all duration-200
                ${objective?.completed 
                  ? 'bg-success/10 border-success/20' 
                  : objective?.active 
                    ? 'bg-accent/10 border-accent/20 shadow-neon' 
                    : 'bg-muted border-border'
                }
              `}
            >
              <div className="flex-shrink-0 mt-0.5">
                {objective?.completed ? (
                  <Icon name="CheckCircle" size={16} className="text-success" />
                ) : objective?.active ? (
                  <Icon name="Circle" size={16} className="text-accent" />
                ) : (
                  <Icon name="Circle" size={16} className="text-text-secondary" />
                )}
              </div>
              
              <div className="flex-1">
                <p className={`
                  font-body text-sm leading-relaxed
                  ${objective?.completed 
                    ? 'text-success line-through' 
                    : objective?.active 
                      ? 'text-foreground' 
                      : 'text-text-secondary'
                  }
                `}>
                  {objective?.text}
                </p>
                
                {objective?.progress && (
                  <div className="mt-2">
                    <div className="w-full bg-border rounded-full h-1">
                      <div 
                        className={`
                          h-1 rounded-full transition-all duration-300
                          ${objective?.completed ? 'bg-success' : 'bg-accent'}
                        `}
                        style={{ width: `${objective?.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Shorthand Rules */}
      <div className="space-y-3">
        <h4 className="font-heading font-medium text-foreground flex items-center space-x-2">
          <Icon name="BookOpen" size={16} className="text-warning" />
          <span>Rules & Symbols</span>
        </h4>
        
        <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
          {shorthandRules?.map((rule, index) => (
            <div 
              key={index}
              className="bg-muted rounded-lg p-3 border border-border"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-data text-sm font-medium text-accent">
                  {rule?.symbol}
                </span>
                <span className="font-caption text-xs text-text-secondary">
                  {rule?.category}
                </span>
              </div>
              
              <p className="font-body text-sm text-foreground mb-1">
                <strong>Meaning:</strong> {rule?.meaning}
              </p>
              
              <p className="font-body text-xs text-text-secondary">
                {rule?.description}
              </p>
              
              {rule?.tip && (
                <div className="mt-2 flex items-start space-x-2 bg-accent/10 rounded p-2">
                  <Icon name="Lightbulb" size={12} className="text-accent flex-shrink-0 mt-0.5" />
                  <p className="font-body text-xs text-accent">
                    <strong>Tip:</strong> {rule?.tip}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChapterPanel;