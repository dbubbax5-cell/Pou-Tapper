import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, Crosshair } from 'lucide-react';
import { POU_COLORS } from '../../types/game';

interface StatsUIProps {
  collectedCount: number;
  totalTaps: number;
  onClose: () => void;
}

export const StatsUI: React.FC<StatsUIProps> = ({ collectedCount, totalTaps, onClose }) => {
  const totalAvailable = POU_COLORS.length;
  const percentage = Math.round((collectedCount / totalAvailable) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-xl border dark:border-gray-800 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold dark:text-white">Player Stats</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5 dark:text-white" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Completion Stat */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-green-100 text-green-600 rounded-full">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold dark:text-white">{percentage}%</p>
                <p className="text-xs text-gray-400">({collectedCount}/{totalAvailable})</p>
              </div>
            </div>
          </div>

          {/* Taps Stat */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <Crosshair className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Lifetime Taps</p>
              <p className="text-2xl font-bold dark:text-white">{totalTaps}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
