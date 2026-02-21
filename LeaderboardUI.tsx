import React from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, Check } from 'lucide-react';
import { ACHIEVEMENTS, Achievement } from '../../types/game';

interface AchievementsUIProps {
  unlockedAchievements: Set<string>;
  onClose: () => void;
}

export const AchievementsUI: React.FC<AchievementsUIProps> = ({ unlockedAchievements, onClose }) => {
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
          <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
            <Trophy className="text-yellow-500 w-6 h-6" /> Achievements
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5 dark:text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlockedAchievements.has(achievement.id);
            return (
              <div 
                key={achievement.id}
                className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
                  isUnlocked 
                    ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700' 
                    : 'bg-gray-50 border-gray-100 dark:bg-gray-800 dark:border-gray-700 opacity-60 grayscale'
                }`}
              >
                <div className="text-3xl filter drop-shadow-sm">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                    {achievement.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
                {isUnlocked && (
                  <div className="p-1 bg-green-500 rounded-full">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};
