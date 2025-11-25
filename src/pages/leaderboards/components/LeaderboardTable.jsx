import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const LeaderboardTable = ({ data, currentUser, onViewProfile, loading }) => {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return { icon: 'Crown', color: 'text-warning' };
      case 2: return { icon: 'Medal', color: 'text-text-secondary' };
      case 3: return { icon: 'Award', color: 'text-warning' };
      default: return null;
    }
  };

  const formatScore = (score, type) => {
    switch (type) {
      case 'wpm': return `${score} WPM`;
      case 'accuracy': return `${score}%`;
      case 'time': return `${Math.floor(score / 60)}:${(score % 60)?.toString()?.padStart(2, '0')}`;
      case 'score': return score?.toLocaleString();
      default: return score;
    }
  };

  const getChangeIcon = (change) => {
    if (change > 0) return { icon: 'TrendingUp', color: 'text-success' };
    if (change < 0) return { icon: 'TrendingDown', color: 'text-error' };
    return { icon: 'Minus', color: 'text-text-secondary' };
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin">
            <Icon name="Loader2" size={24} className="text-accent" />
          </div>
          <span className="font-body text-text-secondary">Loading rankings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="text-left p-4 font-heading font-medium text-sm text-muted-foreground">
                Rank
              </th>
              <th className="text-left p-4 font-heading font-medium text-sm text-muted-foreground">
                Player
              </th>
              <th className="text-left p-4 font-heading font-medium text-sm text-muted-foreground">
                Score
              </th>
              <th className="text-left p-4 font-heading font-medium text-sm text-muted-foreground">
                Change
              </th>
              <th className="text-left p-4 font-heading font-medium text-sm text-muted-foreground">
                Date
              </th>
              <th className="text-left p-4 font-heading font-medium text-sm text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((player, index) => {
              const rankIcon = getRankIcon(player?.rank);
              const changeIcon = getChangeIcon(player?.change);
              const isCurrentUser = currentUser && player?.id === currentUser?.id;

              return (
                <tr 
                  key={player?.id}
                  className={`
                    border-b border-border transition-colors duration-150
                    ${isCurrentUser 
                      ? 'bg-accent/5 border-accent/20' :'hover:bg-muted/50'
                    }
                  `}
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {rankIcon ? (
                        <Icon 
                          name={rankIcon?.icon} 
                          size={18} 
                          className={rankIcon?.color}
                        />
                      ) : (
                        <span className="font-data font-medium text-foreground w-6 text-center">
                          {player?.rank}
                        </span>
                      )}
                      {isCurrentUser && (
                        <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                          YOU
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={player?.avatar}
                        alt={player?.avatarAlt}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-body font-medium text-card-foreground">
                          {player?.username}
                        </div>
                        <div className="font-caption text-xs text-text-secondary">
                          Level {player?.level}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-data font-bold text-lg text-accent">
                      {formatScore(player?.score, player?.scoreType)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1">
                      <Icon 
                        name={changeIcon?.icon} 
                        size={14} 
                        className={changeIcon?.color}
                      />
                      <span className={`font-data text-sm ${changeIcon?.color}`}>
                        {Math.abs(player?.change)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-body text-sm text-text-secondary">
                      {player?.date}
                    </span>
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewProfile(player)}
                      iconName="User"
                      iconSize={14}
                      className="text-text-secondary hover:text-accent"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3 p-4">
        {data?.map((player) => {
          const rankIcon = getRankIcon(player?.rank);
          const changeIcon = getChangeIcon(player?.change);
          const isCurrentUser = currentUser && player?.id === currentUser?.id;

          return (
            <div 
              key={player?.id}
              className={`
                p-4 rounded-lg border transition-all duration-200
                ${isCurrentUser 
                  ? 'bg-accent/5 border-accent/20 shadow-neon' 
                  : 'bg-muted border-border hover:border-accent/30'
                }
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {rankIcon ? (
                    <Icon 
                      name={rankIcon?.icon} 
                      size={20} 
                      className={rankIcon?.color}
                    />
                  ) : (
                    <span className="font-data font-bold text-lg text-foreground w-8 text-center">
                      {player?.rank}
                    </span>
                  )}
                  <Image
                    src={player?.avatar}
                    alt={player?.avatarAlt}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-body font-medium text-card-foreground">
                        {player?.username}
                      </span>
                      {isCurrentUser && (
                        <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="font-caption text-xs text-text-secondary">
                      Level {player?.level}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewProfile(player)}
                  iconName="User"
                  iconSize={16}
                  className="text-text-secondary hover:text-accent"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-data font-bold text-xl text-accent">
                    {formatScore(player?.score, player?.scoreType)}
                  </span>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <Icon 
                      name={changeIcon?.icon} 
                      size={14} 
                      className={changeIcon?.color}
                    />
                    <span className={`font-data text-sm ${changeIcon?.color}`}>
                      {Math.abs(player?.change)}
                    </span>
                  </div>
                  <span className="font-body text-xs text-text-secondary">
                    {player?.date}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderboardTable;