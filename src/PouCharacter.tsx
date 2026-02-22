import React from 'react';
import { motion } from 'framer-motion';
import { POU_COLORS, PouColor, Rarity } from '../../types/game';
import { cn } from '../../lib/utils';
import { X, Lock } from 'lucide-react';

interface CollectionUIProps {
  collectedIds: Set<string>;
  onClose: () => void;
}

export const CollectionUI: React.FC<CollectionUIProps> = ({ collectedIds, onClose }) => {
  // Group by rarity
  const groupedPous = POU_COLORS.reduce((acc, pou) => {
    if (!acc[pou.rarity]) {
      acc[pou.rarity] = [];
    }
    acc[pou.rarity].push(pou);
    return acc;
  }, {} as Record<Rarity, PouColor[]>);

  const rarityOrder: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'glitch', 'secret'];

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col"
    >
      <div className="p-4 flex justify-between items-center border-b dark:border-gray-800">
        <h2 className="text-2xl font-bold dark:text-white">Collection</h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <X className="w-6 h-6 dark:text-white" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-8 pb-20">
        {rarityOrder.map((rarity) => (
          <div key={rarity}>
            <h3 className="capitalize text-lg font-semibold mb-4 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2">
              {rarity}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {groupedPous[rarity]?.map((pou) => {
                const isCollected = collectedIds.has(pou.id);
                return (
                  <div key={pou.id} className="flex flex-col items-center">
                    <div className={cn(
                      "w-20 h-20 rounded-xl flex justify-center items-center shadow-sm relative overflow-hidden transition-all",
                      isCollected ? "bg-gray-50 dark:bg-gray-800 border-2 border-transparent" : "bg-gray-100 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 opacity-50"
                    )}>
                      {isCollected ? (
                        <div className="w-16 h-16" style={{
                           background: pou.rarity === 'legendary' 
                             ? 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)' 
                             : pou.rarity === 'mythic' 
                               ? 'radial-gradient(circle at 50% 50%, #333399, #000)'
                               : pou.rarity === 'glitch'
                                 ? 'repeating-linear-gradient(45deg, #000, #000 10px, #222 10px, #222 20px)'
                                 : pou.rarity === 'secret'
                                   ? 'repeating-linear-gradient(90deg, #006400, #006400 2px, #004d00 2px, #004d00 4px)'
                                   : pou.colorCode,
                           borderRadius: '50% 50% 40% 40%',
                           boxShadow: pou.specialEffect === 'glow' ? '0 0 10px rgba(0,255,255,0.5)' : 'none'
                        }} />
                      ) : (
                        <Lock className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <span className={cn(
                      "text-xs mt-2 text-center font-medium",
                      isCollected ? "text-gray-900 dark:text-gray-100" : "text-gray-400"
                    )}>
                      {pou.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
