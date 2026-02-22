import React from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, Crown, Medal } from 'lucide-react';
import { POU_COLORS, Rarity } from '../../types/game';
import { getRarityColor, getRarityBgColor } from '../../lib/game-logic';

interface LeaderboardUIProps {
  leaderboard: { user_id: string; best_pou_id: string | null; best_rarity_score: number; total_taps: number }[];
  currentUserId: string | null;
  onClose: () => void;
}

import { cn } from '../../lib/utils'; // Import cn

export const LeaderboardUI: React.FC<LeaderboardUIProps> = ({ leaderboard, currentUserId, onClose }) => {
  
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
      case 1: return <Medal className="w-6 h-6 text-gray-400 fill-gray-400" />;
      case 2: return <Medal className="w-6 h-6 text-amber-700 fill-amber-700" />;
      default: return <span className="font-bold text-gray-400 w-6 text-center">{index + 1}</span>;
    }
  };

  const getPouName = (id: string | null) => {
    if (!id) return 'No Pou Yet';
    return POU_COLORS.find(p => p.id === id)?.name || 'Unknown Pou';
  };

  const getPouRarity = (id: string | null) => {
    if (!id) return 'common';
    return POU_COLORS.find(p => p.id === id)?.rarity || 'common';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-xl border dark:border-gray-800 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex justify-between items-center border-b dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-500 w-6 h-6" />
            <div>
               <h2 className="text-xl font-bold dark:text-white">Rarest Finds</h2>
               <p className="text-xs text-gray-500 dark:text-gray-400">Global Leaderboard</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5 dark:text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {leaderboard.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No records yet. Be the first!
            </div>
          ) : (
            leaderboard.map((entry, index) => {
              const isCurrentUser = entry.user_id === currentUserId;
              const pouName = getPouName(entry.best_pou_id);
              const pouRarity = getPouRarity(entry.best_pou_id);
              
              return (
                <div 
                  key={entry.user_id}
                  className={`p-3 rounded-xl flex items-center gap-3 transition-all ${
                    isCurrentUser 
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 border' 
                      : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700 border hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex-shrink-0 w-8 flex justify-center">
                    {getRankIcon(index)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-bold text-sm truncate ${isCurrentUser ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>
                        {isCurrentUser ? 'You' : `Player ${entry.user_id.slice(0, 4)}`}
                      </span>
                      <span className={cn(
                        "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border",
                        getRarityBgColor(pouRarity as Rarity),
                        getRarityColor(pouRarity as Rarity)
                      )}>
                        {pouRarity}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{pouName}</span>
                      <span>{entry.total_taps.toLocaleString()} Taps</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
