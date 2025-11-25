import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const LiveLeaderboard = ({ currentUser }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading leaderboard data
    const loadLeaderboard = () => {
      setIsLoading(true);

      setTimeout(() => {
        const mockData = [
        {
          rank: 1,
          username: "GestureKing",
          avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1584b53a9-1762273471611.png",
          avatarAlt: "Professional headshot of young man with brown hair in casual shirt",
          score: 15420,
          wpm: 94,
          accuracy: 98.5,
          isOnline: true,
          country: "US"
        },
        {
          rank: 2,
          username: "SwiftStrokes",
          avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_16ff2d89e-1762274063140.png",
          avatarAlt: "Professional woman with blonde hair in business attire smiling",
          score: 14890,
          wpm: 89,
          accuracy: 97.2,
          isOnline: true,
          country: "CA"
        },
        {
          rank: 3,
          username: "NeonTyper",
          avatar: "https://images.unsplash.com/photo-1655882752624-7c01aa90fa27",
          avatarAlt: "Bearded man with glasses in casual clothing",
          score: 14156,
          wpm: 87,
          accuracy: 96.8,
          isOnline: false,
          country: "UK"
        },
        {
          rank: 4,
          username: "CyberScribe",
          avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1b33e57c8-1762274356059.png",
          avatarAlt: "Asian woman with long dark hair in professional setting",
          score: 13742,
          wpm: 85,
          accuracy: 95.9,
          isOnline: true,
          country: "JP"
        },
        {
          rank: 5,
          username: "QuantumKeys",
          avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1e4feef44-1762273998511.png",
          avatarAlt: "Professional man in suit with confident expression",
          score: 13298,
          wpm: 82,
          accuracy: 94.7,
          isOnline: true,
          country: "DE"
        }];


        setLeaderboardData(mockData);

        // Set current user rank (simulate user being ranked 12th)
        setUserRank({
          rank: 12,
          username: currentUser?.username || "Player",
          score: 11450,
          wpm: 76,
          accuracy: 92.3
        });

        setIsLoading(false);
      }, 1000);
    };

    loadLeaderboard();

    // Simulate live updates every 30 seconds
    const interval = setInterval(loadLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:return { icon: 'Crown', color: 'text-yellow-400' };
      case 2:return { icon: 'Medal', color: 'text-gray-300' };
      case 3:return { icon: 'Award', color: 'text-orange-400' };
      default:return { icon: 'User', color: 'text-text-secondary' };
    }
  };

  const getCountryFlag = (country) => {
    const flags = {
      'US': '🇺🇸',
      'CA': '🇨🇦',
      'UK': '🇬🇧',
      'JP': '🇯🇵',
      'DE': '🇩🇪'
    };
    return flags?.[country] || '🌍';
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-accent rounded-full animate-pulse" />
            <span className="font-body text-text-secondary">Loading leaderboard...</span>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-lg text-card-foreground flex items-center space-x-2">
          <Icon name="Trophy" size={20} className="text-accent" />
          <span>Live Rankings</span>
        </h3>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="font-caption text-xs text-success">LIVE</span>
        </div>
      </div>
      {/* Top 5 Leaderboard */}
      <div className="space-y-2">
        {leaderboardData?.map((player) => {
          const rankInfo = getRankIcon(player?.rank);
          return (
            <div
              key={player?.rank}
              className={`
                flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
                ${player?.rank <= 3 ?
              'bg-accent/5 border border-accent/20' : 'bg-muted hover:bg-muted/80'}
              `
              }>

              {/* Rank */}
              <div className="flex items-center justify-center w-8 h-8">
                {player?.rank <= 3 ?
                <Icon name={rankInfo?.icon} size={18} className={rankInfo?.color} /> :

                <span className="font-data font-bold text-sm text-text-secondary">
                    #{player?.rank}
                  </span>
                }
              </div>
              {/* Avatar and Info */}
              <div className="flex items-center space-x-3 flex-1">
                <div className="relative">
                  <Image
                    src={player?.avatar}
                    alt={player?.avatarAlt}
                    className="w-10 h-10 rounded-full object-cover" />

                  {player?.isOnline &&
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success border-2 border-card rounded-full" />
                  }
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-body font-medium text-card-foreground">
                      {player?.username}
                    </span>
                    <span className="text-sm">{getCountryFlag(player?.country)}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-text-secondary">
                    <span>{player?.wpm} WPM</span>
                    <span>{player?.accuracy}% ACC</span>
                  </div>
                </div>
              </div>
              {/* Score */}
              <div className="text-right">
                <div className="font-data font-bold text-accent">
                  {player?.score?.toLocaleString()}
                </div>
                <div className="font-caption text-xs text-text-secondary">
                  points
                </div>
              </div>
            </div>);

        })}
      </div>
      {/* Current User Rank */}
      {userRank && userRank?.rank > 5 &&
      <div className="border-t border-border pt-4">
          <div className="flex items-center space-x-3 p-3 bg-accent/10 border border-accent/30 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8">
              <span className="font-data font-bold text-sm text-accent">
                #{userRank?.rank}
              </span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-body font-medium text-accent">
                  {userRank?.username} (You)
                </span>
              </div>
              <div className="flex items-center space-x-4 text-xs text-text-secondary">
                <span>{userRank?.wpm} WPM</span>
                <span>{userRank?.accuracy}% ACC</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-data font-bold text-accent">
                {userRank?.score?.toLocaleString()}
              </div>
              <div className="font-caption text-xs text-text-secondary">
                points
              </div>
            </div>
          </div>
        </div>
      }
      {/* Update Indicator */}
      <div className="text-center">
        <span className="font-caption text-xs text-text-secondary">
          Updates every 30 seconds • {leaderboardData?.length} active players
        </span>
      </div>
    </div>);

};

export default LiveLeaderboard;