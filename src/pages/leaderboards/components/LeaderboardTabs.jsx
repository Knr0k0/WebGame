import React from 'react';

import Button from '../../../components/ui/Button';

const LeaderboardTabs = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-2">
      <div className="flex flex-wrap gap-1">
        {tabs?.map((tab) => (
          <Button
            key={tab?.id}
            variant={activeTab === tab?.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onTabChange(tab?.id)}
            iconName={tab?.icon}
            iconPosition="left"
            iconSize={16}
            className={`
              font-body font-medium transition-all duration-200 flex-1 min-w-0
              ${activeTab === tab?.id 
                ? 'bg-accent text-accent-foreground shadow-neon' 
                : 'text-text-secondary hover:text-accent hover:bg-muted'
              }
            `}
          >
            <div className="flex flex-col items-center sm:flex-row sm:space-x-2">
              <span className="truncate">{tab?.name}</span>
              <span className="text-xs opacity-70 hidden sm:inline">
                ({tab?.count})
              </span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardTabs;