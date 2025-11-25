import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterControls = ({ filters, onFilterChange, onReset }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const timeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  const regionOptions = [
    { value: 'global', label: 'Global' },
    { value: 'us', label: 'United States' },
    { value: 'eu', label: 'Europe' },
    { value: 'asia', label: 'Asia' },
    { value: 'local', label: 'Local Region' }
  ];

  const gameModeOptions = [
    { value: 'all', label: 'All Modes' },
    { value: 'story', label: 'Glyph Story' },
    { value: 'breaker', label: 'Lexicon Breaker' },
    { value: 'practice', label: 'Practice Lab' },
    { value: 'daily', label: 'Daily Run' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Mobile Toggle */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          fullWidth
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          iconSize={16}
          className="justify-between p-4 text-card-foreground hover:bg-muted"
        >
          Filter Options
        </Button>
      </div>
      {/* Filter Controls */}
      <div className={`
        ${isExpanded ? 'block' : 'hidden'} lg:block
        p-4 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:space-x-4
      `}>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Time Period"
            options={timeOptions}
            value={filters?.timePeriod}
            onChange={(value) => onFilterChange('timePeriod', value)}
            className="w-full"
          />

          <Select
            label="Region"
            options={regionOptions}
            value={filters?.region}
            onChange={(value) => onFilterChange('region', value)}
            className="w-full"
          />

          <Select
            label="Game Mode"
            options={gameModeOptions}
            value={filters?.gameMode}
            onChange={(value) => onFilterChange('gameMode', value)}
            className="w-full"
          />
        </div>

        <div className="flex space-x-2 lg:flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            iconName="RotateCcw"
            iconPosition="left"
            iconSize={14}
            className="border-text-secondary text-text-secondary hover:bg-muted"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;