import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PlayerProfileModal = ({ player, isOpen, onClose, onFollow, onChallenge }) => {
  if (!isOpen || !player) return null;

  const stats = [
    { label: 'Best WPM', value: player?.bestWPM || 94, icon: 'Zap', color: 'accent' },
    { label: 'Accuracy', value: `${player?.accuracy || 96}%`, icon: 'Target', color: 'success' },
    { label: 'Games Played', value: player?.gamesPlayed || 342, icon: 'Gamepad2', color: 'warning' },
    { label: 'Win Rate', value: `${player?.winRate || 78}%`, icon: 'Trophy', color: 'foreground' }
  ];

  const recentGames = [
    { mode: 'Lexicon Breaker', score: 8750, wpm: 89, accuracy: 94, date: '11/14/2025' },
    { mode: 'Daily Run', score: 6420, wpm: 76, accuracy: 98, date: '11/13/2025' },
    { mode: 'Glyph Story', score: 4890, wpm: 82, accuracy: 91, date: '11/12/2025' }
  ];

  const achievements = [
    { name: 'Speed Demon', icon: 'Zap', color: 'accent' },
    { name: 'Precision Master', icon: 'Target', color: 'success' },
    { name: 'Story Completionist', icon: 'BookOpen', color: 'warning' },
    { name: 'Daily Warrior', icon: 'Calendar', color: 'error' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-neon">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <Image
              src={player?.avatar}
              alt={player?.avatarAlt}
              className="w-16 h-16 rounded-full object-cover border-2 border-accent"
            />
            <div>
              <h2 className="font-heading font-bold text-2xl text-card-foreground">
                {player?.username}
              </h2>
              <div className="flex items-center space-x-4 mt-1">
                <span className="font-caption text-sm text-text-secondary">
                  Level {player?.level}
                </span>
                <span className="font-data font-medium text-accent">
                  #{player?.rank} Global
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            iconSize={20}
            className="text-text-secondary hover:text-accent"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="default"
              onClick={() => onFollow(player)}
              iconName="UserPlus"
              iconPosition="left"
              iconSize={16}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Follow Player
            </Button>
            <Button
              variant="outline"
              onClick={() => onChallenge(player)}
              iconName="Swords"
              iconPosition="left"
              iconSize={16}
              className="border-warning text-warning hover:bg-warning/10"
            >
              Challenge
            </Button>
          </div>

          {/* Stats Grid */}
          <div>
            <h3 className="font-heading font-bold text-lg text-card-foreground mb-4">
              Performance Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {stats?.map((stat, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon 
                      name={stat?.icon} 
                      size={20} 
                      className={`text-${stat?.color}`}
                    />
                    <span className="font-body font-medium text-foreground">
                      {stat?.label}
                    </span>
                  </div>
                  <div className="font-data text-2xl font-bold text-accent">
                    {stat?.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Games */}
          <div>
            <h3 className="font-heading font-bold text-lg text-card-foreground mb-4">
              Recent Games
            </h3>
            <div className="space-y-3">
              {recentGames?.map((game, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-body font-medium text-foreground">
                      {game?.mode}
                    </span>
                    <span className="font-caption text-sm text-text-secondary">
                      {game?.date}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="font-data text-lg font-bold text-accent">
                        {game?.score?.toLocaleString()}
                      </div>
                      <div className="font-caption text-xs text-text-secondary">
                        Score
                      </div>
                    </div>
                    <div>
                      <div className="font-data text-lg font-bold text-warning">
                        {game?.wpm}
                      </div>
                      <div className="font-caption text-xs text-text-secondary">
                        WPM
                      </div>
                    </div>
                    <div>
                      <div className="font-data text-lg font-bold text-success">
                        {game?.accuracy}%
                      </div>
                      <div className="font-caption text-xs text-text-secondary">
                        Accuracy
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="font-heading font-bold text-lg text-card-foreground mb-4">
              Achievements
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {achievements?.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center
                    bg-${achievement?.color}/10 border border-${achievement?.color}/20
                  `}>
                    <Icon 
                      name={achievement?.icon} 
                      size={16} 
                      className={`text-${achievement?.color}`}
                    />
                  </div>
                  <span className="font-body font-medium text-foreground">
                    {achievement?.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfileModal;