import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGame } from './useGame';
import { usePlayTime } from './usePlayTime';
import { PouCharacter, CollectionUI } from './PouCharacter';
import { LeaderboardUI } from './LeaderboardUI';
import { StatsUI } from './StatsUI';
import { AchievementsUI } from './AchievementsUI';
import { SettingsUI } from './SettingsUI';
import { playPopSound, playUnlockSound } from './supabase';
import { getRarityColor, getRarityBgColor } from './game-logic';
import { Trophy, BarChart3, PieChart, Settings, Medal } from 'lucide-react';

export type Achievement = {
  id: string;
  name: string;
  description: string;
  condition: (stats: { collectionSize: number; totalTaps: number; hasLegendary: boolean; hasMythic: boolean }) => boolean;
  icon: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'beginner_collector',
    name: 'Beginner Collector',
    description: 'Collect 5 unique Pous',
    condition: (stats) => stats.collectionSize >= 5,
    icon: '🎯'
  },
  {
    id: 'master_collector',
    name: 'Master Collector',
    description: 'Collect 20 unique Pous',
    condition: (stats) => stats.collectionSize >= 20,
    icon: '🏆'
  },
  {
    id: 'clicker_novice',
    name: 'Tapping Novice',
    description: 'Tap Pou 100 times',
    condition: (stats) => stats.totalTaps >= 100,
    icon: '👆'
  },
  {
    id: 'clicker_expert',
    name: 'Tapping Expert',
    description: 'Tap Pou 1000 times',
    condition: (stats) => stats.totalTaps >= 1000,
    icon: '🔥'
  },
  {
    id: 'lucky_charm',
    name: 'Lucky Charm',
    description: 'Find a Legendary Pou',
    condition: (stats) => stats.hasLegendary,
    icon: '🍀'
  },
  {
    id: 'mythic_hunter',
    name: 'Mythic Hunter',
    description: 'Find a Mythic Pou',
    condition: (stats) => stats.hasMythic,
    icon: '🌌'
  }
];

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'glitch' | 'secret';

export type PouColor = {
  id: string;
  name: string;
  rarity: Rarity;
  colorCode: string;
  specialEffect?: string;
};

export type CollectionItem = {
  id: string;
  pou_color_id: string;
  rarity: Rarity;
  unlocked_at: string;
};

export const RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 53000,
  uncommon: 30000,
  rare: 10000,
  epic: 5000,
  legendary: 1500,
  mythic: 400,
  glitch: 99,
  secret: 1,
};

export const RARITY_SCORES: Record<Rarity, number> = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
  legendary: 5,
  mythic: 6,
  glitch: 7,
  secret: 8
};

export const POU_COLORS: PouColor[] = [
  { id: 'common_lightblue', name: 'Light Blue Pou', rarity: 'common', colorCode: '#ADD8E6' },
  { id: 'common_green', name: 'Green Pou', rarity: 'common', colorCode: '#90EE90' },
  { id: 'common_grey', name: 'Grey Pou', rarity: 'common', colorCode: '#A9A9A9' },
  { id: 'uncommon_purple', name: 'Purple Pou', rarity: 'uncommon', colorCode: '#9370DB' },
  { id: 'uncommon_orange', name: 'Orange Pou', rarity: 'uncommon', colorCode: '#FFA500' },
  { id: 'uncommon_pink', name: 'Pink Pou', rarity: 'uncommon', colorCode: '#FFC0CB' },
  { id: 'uncommon_teal', name: 'Teal Pou', rarity: 'uncommon', colorCode: '#008080' },
  { id: 'rare_brown', name: 'Brown Pou', rarity: 'rare', colorCode: '#8B4513' },
  { id: 'rare_gold', name: 'Gold Pou', rarity: 'rare', colorCode: '#FFD700', specialEffect: 'glow' },
  { id: 'rare_neonblue', name: 'Neon Blue Pou', rarity: 'rare', colorCode: '#00FFFF', specialEffect: 'glow' },
  { id: 'rare_red', name: 'Red Pou', rarity: 'rare', colorCode: '#DC143C' },
  { id: 'epic_ruby', name: 'Ruby Pou', rarity: 'epic', colorCode: '#E0115F', specialEffect: 'metallic' },
  { id: 'epic_emerald', name: 'Emerald Pou', rarity: 'epic', colorCode: '#50C878', specialEffect: 'metallic' },
  { id: 'epic_sapphire', name: 'Sapphire Pou', rarity: 'epic', colorCode: '#0F52BA', specialEffect: 'metallic' },
  { id: 'epic_obsidian', name: 'Obsidian Pou', rarity: 'epic', colorCode: '#111111', specialEffect: 'metallic' },
  { id: 'legendary_rainbow', name: 'Rainbow Pou', rarity: 'legendary', colorCode: 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)', specialEffect: 'rainbow' },
  { id: 'legendary_holo', name: 'Holo Pou', rarity: 'legendary', colorCode: 'linear-gradient(135deg, #e6e6fa, #d8bfd8, #dda0dd)', specialEffect: 'glow' },
  { id: 'mythic_galaxy', name: 'Galaxy Pou', rarity: 'mythic', colorCode: '#000', specialEffect: 'galaxy' },
  { id: 'mythic_void', name: 'Void Pou', rarity: 'mythic', colorCode: '#000000', specialEffect: 'galaxy' },
  { id: 'glitch_error', name: 'Error 404 Pou', rarity: 'glitch', colorCode: '#000', specialEffect: 'glitch' },
  { id: 'secret_chip', name: 'Chip Pou', rarity: 'secret', colorCode: '#006400', specialEffect: 'chip' },
];

export const GameScreen: React.FC = () => {
  const { currentPou, collection, loading, handleTap, notification, isRespawning, userId } = useGame();
  const { playTime, totalTaps, achievements, leaderboard, incrementTaps, unlockAchievement, checkBestPou } = usePlayTime(userId);
  
  const [showCollection, setShowCollection] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [achievementNotif, setAchievementNotif] = useState<string | null>(null);

  useEffect(() => {
    let bestScore = 0;
    let bestId = '';
    
    collection.forEach(id => {
      const pou = POU_COLORS.find(p => p.id === id);
      if (pou) {
        const score = RARITY_SCORES[pou.rarity] || 0;
        if (score > bestScore) {
          bestScore = score;
          bestId = id;
        }
      }
    });

    if (bestScore > 0 && bestId) {
      checkBestPou(bestId);
    }

    const checkAchievements = () => {
      const stats = {
        collectionSize: collection.size,
        totalTaps: totalTaps,
        hasLegendary: Array.from(collection).some(id => POU_COLORS.find(p => p.id === id)?.rarity === 'legendary'),
        hasMythic: Array.from(collection).some(id => POU_COLORS.find(p => p.id === id)?.rarity === 'mythic')
      };

      ACHIEVEMENTS.forEach(ach => {
        if (!achievements.has(ach.id) && ach.condition(stats)) {
          unlockAchievement(ach.id);
          setAchievementNotif(ach.name);
          playUnlockSound();
          setTimeout(() => setAchievementNotif(null), 3000);
        }
      });
    };

    checkAchievements();
  }, [collection, totalTaps, achievements, unlockAchievement, checkBestPou]);

  useEffect(() => {
    if (notification?.type === 'new') {
      playUnlockSound();
    }
  }, [notification]);

  const onPouTap = () => {
    checkBestPou(currentPou.id);
    playPopSound();
    handleTap();
    incrementTaps();
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-between p-4 font-sans select-none overflow-hidden relative">
      <header className="w-full max-w-md flex justify-between items-center z-10 pt-4 px-2">
        <div className="flex flex-col">
          <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
             Time: <span className="font-mono text-gray-800 dark:text-gray-200">{formatTime(playTime)}</span>
          </div>
          <div className="text-xs text-gray-400 font-mono mt-1 flex items-center gap-1">
             <span className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-[10px] border border-gray-200 dark:border-gray-700">
               {achievements.size}/{ACHIEVEMENTS.length}
             </span>
             Achievements
          </div>
        </div>
        <div className="flex gap-2">
           <button
             onClick={() => setShowSettings(true)}
             className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 text-gray-500"
           >
             <Settings className="w-5 h-5" />
           </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center relative w-full max-w-md">
        <div className="absolute top-4 w-full flex flex-col items-center pointer-events-none z-20 gap-2">
          <AnimatePresence mode="wait">
            {notification && (
              <div key={notification.message} className="px-6 py-3 rounded-full shadow-lg font-bold text-sm tracking-wide flex items-center gap-2">
                {notification.type === 'new' && <span className="text-lg">✨</span>}
                {notification.message}
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {achievementNotif && (
              <div key={achievementNotif} className="bg-gray-900 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-gray-700">
                <div className="p-2 bg-yellow-500 rounded-full text-black">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Achievement Unlocked</p>
                  <p className="font-bold">{achievementNotif}</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative w-64 h-64 flex justify-center items-center">
          <AnimatePresence mode="wait">
            {!isRespawning && (
              <div key={currentPou.id}>
                <PouCharacter pou={currentPou} onTap={onPouTap} />
              </div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {isRespawning && (
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                 <div className="w-32 h-32 bg-white rounded-full opacity-50 blur-xl" />
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 text-center pointer-events-none">
          <AnimatePresence mode="wait">
             <div key={currentPou.id} className="flex flex-col items-center gap-2">
               <span className={`text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${getRarityColor(currentPou.rarity)} ${getRarityBgColor(currentPou.rarity)}`}>
                 {currentPou.rarity}
               </span>
               <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                 {currentPou.name}
               </h2>
             </div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="w-full max-w-md pb-4 pt-4 px-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border dark:border-gray-800 p-2 flex justify-between items-center relative z-20">
           <button onClick={() => setShowStats(true)} className="flex-1 flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors gap-1 text-gray-500 active:scale-95">
             <PieChart className="w-6 h-6 text-green-500" />
             <span className="text-[10px] font-medium">Stats</span>
           </button>
           
           <button onClick={() => setShowLeaderboard(true)} className="flex-1 flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors gap-1 text-gray-500 active:scale-95">
             <BarChart3 className="w-6 h-6 text-blue-500" />
             <span className="text-[10px] font-medium">Rank</span>
           </button>

           <div className="w-px h-8 bg-gray-100 dark:bg-gray-800 mx-1"></div>

           <button onClick={() => setShowAchievements(true)} className="flex-1 flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors gap-1 text-gray-500 active:scale-95">
             <Medal className="w-6 h-6 text-orange-500" />
             <span className="text-[10px] font-medium">Awards</span>
           </button>

           <button onClick={() => setShowCollection(true)} className="flex-1 flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors gap-1 text-gray-500 active:scale-95">
             <div className="relative">
               <Trophy className="w-6 h-6 text-yellow-500" />
               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-gray-900">
                 {collection.size}
               </span>
             </div>
             <span className="text-[10px] font-medium">Pous</span>
           </button>
        </div>
      </footer>

      <AnimatePresence>
        {showCollection && (<CollectionUI collectedIds={collection} onClose={() => setShowCollection(false)} />)}
      </AnimatePresence>

      <AnimatePresence>
        {showLeaderboard && (<LeaderboardUI leaderboard={leaderboard} currentUserId={userId} onClose={() => setShowLeaderboard(false)} />)}
      </AnimatePresence>

      <AnimatePresence>
        {showStats && (<StatsUI collectedCount={collection.size} totalTaps={totalTaps} onClose={() => setShowStats(false)} />)}
      </AnimatePresence>

      <AnimatePresence>
        {showAchievements && (<AchievementsUI unlockedAchievements={achievements} onClose={() => setShowAchievements(false)} />)}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (<SettingsUI onClose={() => setShowSettings(false)} onReset={() => {setShowSettings(false);}} />)}
      </AnimatePresence>
    </div>
  );
};

export default GameScreen;
