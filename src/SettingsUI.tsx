import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../../hooks/useGame';
import { usePlayerStats } from '../../hooks/usePlayTime';
import { PouCharacter } from './PouCharacter';
import { CollectionUI } from './CollectionUI';
import { LeaderboardUI } from './LeaderboardUI';
import { StatsUI } from './StatsUI';
import { AchievementsUI } from './AchievementsUI';
import { SettingsUI } from './SettingsUI';
import { playPopSound, playUnlockSound } from '../../lib/audio';
import { getRarityColor, getRarityBgColor } from '../../lib/game-logic';
import { Trophy, BarChart3, PieChart, Settings, Medal } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ACHIEVEMENTS, POU_COLORS, RARITY_SCORES } from '../../types/game';

export const GameScreen: React.FC = () => {
  const { currentPou, collection, loading, handleTap, notification, isRespawning, userId } = useGame();
  const { playTime, totalTaps, achievements, leaderboard, incrementTaps, unlockAchievement, checkBestPou } = usePlayerStats(userId);
  
  const [showCollection, setShowCollection] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Achievement Notification
  const [achievementNotif, setAchievementNotif] = useState<string | null>(null);

  // Check Achievements
  useEffect(() => {
    // Sync best pou from collection if found better
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

    // Helper to check conditions
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

  // Play sound on notification if it's a new unlock
  useEffect(() => {
    if (notification?.type === 'new') {
      playUnlockSound();
    }
  }, [notification]);

  const onPouTap = () => {
    // Check if the current pou (before respawn) is a new best
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
      
      {/* Header */}
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

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col justify-center items-center relative w-full max-w-md">
        
        {/* Notification Area */}
        <div className="absolute top-4 w-full flex flex-col items-center pointer-events-none z-20 gap-2">
          {/* Collection Unlock Notification */}
          <AnimatePresence mode="wait">
            {notification && (
              <motion.div
                key={notification.message}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                className={cn(
                  "px-6 py-3 rounded-full shadow-lg font-bold text-sm tracking-wide flex items-center gap-2",
                  notification.type === 'new' 
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white" 
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                )}
              >
                {notification.type === 'new' && <span className="text-lg">✨</span>}
                {notification.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Achievement Notification */}
          <AnimatePresence>
            {achievementNotif && (
              <motion.div
                key={achievementNotif}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="bg-gray-900 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-gray-700"
              >
                <div className="p-2 bg-yellow-500 rounded-full text-black">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Achievement Unlocked</p>
                  <p className="font-bold">{achievementNotif}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pou Character Container */}
        <div className="relative w-64 h-64 flex justify-center items-center">
          <AnimatePresence mode="wait">
            {!isRespawning && (
              <motion.div
                key={currentPou.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <PouCharacter pou={currentPou} onTap={onPouTap} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Respawn effect (poof) */}
          <AnimatePresence>
            {isRespawning && (
              <motion.div
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex justify-center items-center pointer-events-none"
              >
                 <div className="w-32 h-32 bg-white rounded-full opacity-50 blur-xl" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Current Rarity Info */}
        <div className="mt-12 text-center pointer-events-none">
          <AnimatePresence mode="wait">
             <motion.div
               key={currentPou.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="flex flex-col items-center gap-2"
             >
               <span className={cn(
                 "text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full border",
                 getRarityColor(currentPou.rarity),
                 getRarityBgColor(currentPou.rarity)
               )}>
                 {currentPou.rarity}
               </span>
               <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                 {currentPou.name}
               </h2>
             </motion.div>
          </AnimatePresence>
        </div>

      </main>

      {/* Footer Navigation Bar */}
      <footer className="w-full max-w-md pb-4 pt-4 px-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border dark:border-gray-800 p-2 flex justify-between items-center relative z-20">
           <button
             onClick={() => setShowStats(true)}
             className="flex-1 flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors gap-1 text-gray-500 active:scale-95"
           >
             <PieChart className="w-6 h-6 text-green-500" />
             <span className="text-[10px] font-medium">Stats</span>
           </button>
           
           <button
             onClick={() => setShowLeaderboard(true)}
             className="flex-1 flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors gap-1 text-gray-500 active:scale-95"
           >
             <BarChart3 className="w-6 h-6 text-blue-500" />
             <span className="text-[10px] font-medium">Rank</span>
           </button>

           <div className="w-px h-8 bg-gray-100 dark:bg-gray-800 mx-1"></div>

           <button
             onClick={() => setShowAchievements(true)}
             className="flex-1 flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors gap-1 text-gray-500 active:scale-95"
           >
             <Medal className="w-6 h-6 text-orange-500" />
             <span className="text-[10px] font-medium">Awards</span>
           </button>

           <button
             onClick={() => setShowCollection(true)}
             className="flex-1 flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors gap-1 text-gray-500 active:scale-95"
           >
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

      {/* Modals */}
      <AnimatePresence>
        {showCollection && (
          <CollectionUI 
            collectedIds={collection} 
            onClose={() => setShowCollection(false)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLeaderboard && (
          <LeaderboardUI
            leaderboard={leaderboard}
            currentUserId={userId}
            onClose={() => setShowLeaderboard(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showStats && (
          <StatsUI
            collectedCount={collection.size}
            totalTaps={totalTaps}
            onClose={() => setShowStats(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAchievements && (
          <AchievementsUI
            unlockedAchievements={achievements}
            onClose={() => setShowAchievements(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <SettingsUI
            onClose={() => setShowSettings(false)}
            onReset={() => {
              setShowSettings(false);
              // Force reload is handled in SettingsUI, but we could reset state here if needed
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
};
