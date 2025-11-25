import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';

import Button from '../../components/ui/Button';
import LeaderboardTabs from './components/LeaderboardTabs';
import FilterControls from './components/FilterControls';
import LeaderboardTable from './components/LeaderboardTable';
import PersonalStats from './components/PersonalStats';
import PlayerProfileModal from './components/PlayerProfileModal';

const Leaderboards = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('wpm');
  const [loading, setLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [filters, setFilters] = useState({
    timePeriod: 'all',
    region: 'global',
    gameMode: 'all'
  });

  // Mock current user data
  const currentUser = {
    id: 'user-123',
    username: 'GestureTyper_Pro',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1d6db2e06-1762273502684.png",
    avatarAlt: 'Professional headshot of young man with brown hair wearing navy blue shirt',
    level: 12,
    globalRank: 156,
    bestWPM: 94,
    accuracy: 92.5,
    totalGames: 247,
    winRate: 78,
    rankChange: 12
  };

  // Mock user stats for personal section
  const userStats = {
    ...currentUser,
    totalTime: 1847,
    xp: 3240
  };

  // Leaderboard tabs configuration
  const tabs = [
  { id: 'wpm', name: 'Global WPM', icon: 'Zap', count: '10K+' },
  { id: 'accuracy', name: 'Accuracy Champions', icon: 'Target', count: '8.5K+' },
  { id: 'story', name: 'Story Mode', icon: 'BookOpen', count: '5.2K+' },
  { id: 'daily', name: 'Daily Challenge', icon: 'Calendar', count: '12K+' }];


  // Mock leaderboard data
  const mockLeaderboardData = {
    wpm: [
    {
      id: 'player-1',
      rank: 1,
      username: 'SpeedMaster_X',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_12d3ec86a-1762273889208.png",
      avatarAlt: 'Professional headshot of confident man with beard wearing black shirt',
      level: 25,
      score: 142,
      scoreType: 'wpm',
      change: 5,
      date: '11/14/2025',
      bestWPM: 142,
      accuracy: 98,
      gamesPlayed: 892,
      winRate: 89
    },
    {
      id: 'player-2',
      rank: 2,
      username: 'NeonFingers',
      avatar: "https://images.unsplash.com/photo-1706565029882-6f25f1d9af65",
      avatarAlt: 'Professional headshot of smiling woman with long dark hair wearing white blazer',
      level: 23,
      score: 138,
      scoreType: 'wpm',
      change: -2,
      date: '11/14/2025',
      bestWPM: 138,
      accuracy: 96,
      gamesPlayed: 756,
      winRate: 85
    },
    {
      id: 'player-3',
      rank: 3,
      username: 'GlyphWarrior',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_14ec2b532-1762273803429.png",
      avatarAlt: 'Professional headshot of young man with short blonde hair wearing gray sweater',
      level: 22,
      score: 135,
      scoreType: 'wpm',
      change: 8,
      date: '11/13/2025',
      bestWPM: 135,
      accuracy: 94,
      gamesPlayed: 634,
      winRate: 82
    },
    {
      id: 'user-123',
      rank: 156,
      username: 'GestureTyper_Pro',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1d6db2e06-1762273502684.png",
      avatarAlt: 'Professional headshot of young man with brown hair wearing navy blue shirt',
      level: 12,
      score: 94,
      scoreType: 'wpm',
      change: 12,
      date: '11/12/2025',
      bestWPM: 94,
      accuracy: 92,
      gamesPlayed: 247,
      winRate: 78
    },
    {
      id: 'player-4',
      rank: 157,
      username: 'CyberScribe',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_11b715d60-1762273834012.png",
      avatarAlt: 'Professional headshot of woman with curly brown hair wearing red blouse',
      level: 11,
      score: 93,
      scoreType: 'wpm',
      change: -3,
      date: '11/11/2025',
      bestWPM: 93,
      accuracy: 90,
      gamesPlayed: 198,
      winRate: 75
    }],

    accuracy: [
    {
      id: 'acc-1',
      rank: 1,
      username: 'PrecisionPro',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_12d77f22e-1762273581295.png",
      avatarAlt: 'Professional headshot of man with dark hair and beard wearing white shirt',
      level: 20,
      score: 99.8,
      scoreType: 'accuracy',
      change: 0,
      date: '11/14/2025',
      bestWPM: 118,
      accuracy: 99.8,
      gamesPlayed: 445,
      winRate: 92
    },
    {
      id: 'acc-2',
      rank: 2,
      username: 'FlawlessType',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_11b715d60-1762273834012.png",
      avatarAlt: 'Professional headshot of woman with short blonde hair wearing navy blazer',
      level: 18,
      score: 99.6,
      scoreType: 'accuracy',
      change: 1,
      date: '11/13/2025',
      bestWPM: 105,
      accuracy: 99.6,
      gamesPlayed: 378,
      winRate: 88
    }],

    story: [
    {
      id: 'story-1',
      rank: 1,
      username: 'ChapterMaster',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1e707c9bf-1762273427359.png",
      avatarAlt: 'Professional headshot of man with glasses wearing checkered shirt',
      level: 30,
      score: 2847,
      scoreType: 'time',
      change: 15,
      date: '11/10/2025',
      bestWPM: 125,
      accuracy: 95,
      gamesPlayed: 156,
      winRate: 94
    }],

    daily: [
    {
      id: 'daily-1',
      rank: 1,
      username: 'DailyChamp',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1367deb4c-1762274573807.png",
      avatarAlt: 'Professional headshot of smiling man with short dark hair wearing blue shirt',
      level: 28,
      score: 15420,
      scoreType: 'score',
      change: 3,
      date: '11/15/2025',
      bestWPM: 132,
      accuracy: 97,
      gamesPlayed: 365,
      winRate: 86
    }]

  };

  const [leaderboardData, setLeaderboardData] = useState(mockLeaderboardData?.[activeTab]);

  useEffect(() => {
    setLoading(true);
    // Simulate API call delay
    const timer = setTimeout(() => {
      setLeaderboardData(mockLeaderboardData?.[activeTab] || []);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [activeTab, filters]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      timePeriod: 'all',
      region: 'global',
      gameMode: 'all'
    });
  };

  const handleViewProfile = (player) => {
    setSelectedPlayer(player);
    setShowProfileModal(true);
  };

  const handleFollowPlayer = (player) => {
    console.log('Following player:', player?.username);
    // Implement follow functionality
  };

  const handleChallengePlayer = (player) => {
    console.log('Challenging player:', player?.username);
    // Implement challenge functionality
  };

  const handleViewFullStats = () => {
    navigate('/practice-lab');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-4">
              Global Leaderboards
            </h1>
            <p className="font-body text-lg text-text-secondary max-w-2xl mx-auto">
              Compete with players worldwide and track your progress across all game modes
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Leaderboard Section */}
            <div className="xl:col-span-3 space-y-6">
              {/* Tabs */}
              <LeaderboardTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                tabs={tabs} />


              {/* Filters */}
              <FilterControls
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters} />


              {/* Leaderboard Table */}
              <LeaderboardTable
                data={leaderboardData}
                currentUser={currentUser}
                onViewProfile={handleViewProfile}
                loading={loading} />


              {/* Quick Actions */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  variant="default"
                  onClick={() => navigate('/daily-run')}
                  iconName="Calendar"
                  iconPosition="left"
                  iconSize={16}
                  className="bg-accent text-accent-foreground hover:bg-accent/90">

                  Join Daily Challenge
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/practice-lab')}
                  iconName="Target"
                  iconPosition="left"
                  iconSize={16}
                  className="border-success text-success hover:bg-success/10">

                  Improve Skills
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/lexicon-breaker')}
                  iconName="Zap"
                  iconPosition="left"
                  iconSize={16}
                  className="border-warning text-warning hover:bg-warning/10">

                  Arcade Mode
                </Button>
              </div>
            </div>

            {/* Personal Stats Sidebar */}
            <div className="xl:col-span-1">
              <PersonalStats
                userStats={userStats}
                onViewFullStats={handleViewFullStats} />

            </div>
          </div>
        </div>
      </main>

      {/* Player Profile Modal */}
      <PlayerProfileModal
        player={selectedPlayer}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onFollow={handleFollowPlayer}
        onChallenge={handleChallengePlayer} />

    </div>);

};

export default Leaderboards;