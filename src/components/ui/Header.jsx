import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Main Menu', path: '/main-menu', icon: 'Home' },
    { label: 'Glyph Story', path: '/glyph-story-mode', icon: 'BookOpen' },
    { label: 'Lexicon Breaker', path: '/lexicon-breaker', icon: 'Zap' },
    { label: 'Practice Lab', path: '/practice-lab', icon: 'Target' },
    { label: 'Daily Run', path: '/daily-run', icon: 'Calendar' }
  ];

  const secondaryItems = [
    { label: 'Leaderboards', path: '/leaderboards', icon: 'Trophy' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isActivePath = (path) => location?.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => handleNavigation('/main-menu')}
        >
          <div className="relative">
            <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center group-hover:shadow-neon transition-all duration-200">
              <Icon name="Gamepad2" size={20} color="var(--color-accent-foreground)" />
            </div>
          </div>
          <div className="font-heading font-bold text-xl text-foreground group-hover:text-accent transition-colors duration-200">
            Gesture Type
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <Button
              key={item?.path}
              variant={isActivePath(item?.path) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item?.path)}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={16}
              className={`
                font-body font-medium transition-all duration-200
                ${isActivePath(item?.path) 
                  ? 'bg-accent text-accent-foreground shadow-neon' 
                  : 'text-text-secondary hover:text-accent hover:bg-muted'
                }
              `}
            >
              {item?.label}
            </Button>
          ))}
          
          {/* More Menu */}
          <div className="relative ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              iconName="MoreHorizontal"
              iconSize={16}
              className="text-text-secondary hover:text-accent hover:bg-muted"
            >
              More
            </Button>
            
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-neon z-50">
                <div className="py-2">
                  {secondaryItems?.map((item) => (
                    <button
                      key={item?.path}
                      onClick={() => handleNavigation(item?.path)}
                      className={`
                        w-full px-4 py-2 text-left flex items-center space-x-3 font-body text-sm
                        transition-colors duration-150
                        ${isActivePath(item?.path)
                          ? 'bg-accent text-accent-foreground'
                          : 'text-popover-foreground hover:bg-muted hover:text-accent'
                        }
                      `}
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          iconName="Menu"
          iconSize={20}
          className="lg:hidden text-text-secondary hover:text-accent"
        />
      </div>
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <nav className="px-6 py-4 space-y-2">
            {[...navigationItems, ...secondaryItems]?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`
                  w-full px-4 py-3 rounded-md flex items-center space-x-3 font-body font-medium
                  transition-all duration-200
                  ${isActivePath(item?.path)
                    ? 'bg-accent text-accent-foreground shadow-neon'
                    : 'text-card-foreground hover:bg-muted hover:text-accent'
                  }
                `}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;