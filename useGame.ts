import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Trash2, Heart, User, Star } from 'lucide-react';
import { setSoundEnabled, isSoundEnabled } from '../../lib/audio';

interface SettingsUIProps {
  onClose: () => void;
  onReset: () => void;
}

export const SettingsUI: React.FC<SettingsUIProps> = ({ onClose, onReset }) => {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [showCreator, setShowCreator] = useState(false);

  const toggleSound = () => {
    setSoundEnabled(!soundOn);
    setSoundOn(!soundOn);
  };

  const handleRate = () => {
    window.open('https://github.com/miaoda/pou-color-collector', '_blank'); // Mock link
    alert('Thank you for rating!');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset ALL progress? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
      onReset();
    }
  };

  const handleJoinDiscord = () => {
    window.open('https://discord.gg/h4mZAcvwaw', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm shadow-xl border dark:border-gray-800 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-800">
          <h2 className="text-xl font-bold dark:text-white">Settings</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5 dark:text-white" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          
          {/* Sound Toggle */}
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="flex items-center gap-3">
              {soundOn ? <Volume2 className="w-5 h-5 text-blue-500" /> : <VolumeX className="w-5 h-5 text-gray-500" />}
              <span className="font-medium dark:text-white">Sound Effects</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={soundOn} onChange={toggleSound} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Discover Creator */}
          <button 
            onClick={() => setShowCreator(true)}
            className="w-full p-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-xl flex items-center gap-3 transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="font-medium">THE POU KINGS</span>
          </button>

          {/* Rate Game */}
          <button 
            onClick={handleRate}
            className="w-full p-3 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300 rounded-xl flex items-center gap-3 transition-colors"
          >
            <Star className="w-5 h-5" />
            <span className="font-medium">Rate Game</span>
          </button>

          <div className="border-t dark:border-gray-800 my-4"></div>

          {/* Reset Progress */}
          <button 
            onClick={handleReset}
            className="w-full p-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-300 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Reset All Progress
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Version 1.3.0 • Made with ❤️
          </p>

        </div>

        {/* Creator Modal Overlay */}
        <AnimatePresence>
          {showCreator && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute inset-0 z-10 bg-white dark:bg-gray-900 p-6 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
                👑
              </div>
              <h3 className="text-2xl font-bold dark:text-white">THE POU KINGS</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm px-4">
                Join our community and become part of the kingdom!
              </p>
              
              {/* Join Discord Button */}
              <button
                onClick={handleJoinDiscord}
                className="w-full p-4 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl flex items-center justify-center gap-3 transition-colors font-bold shadow-lg transform hover:scale-105 active:scale-95"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.772-.6083 1.1588a18.2915 18.2915 0 00-5.4882 0 12.646 12.646 0 00-.6173-1.1588.0775.0775 0 00-.0785-.0371 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c-0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z"/>
                </svg>
                Join My Discord Server
              </button>

              <button 
                onClick={() => setShowCreator(false)}
                className="mt-6 px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
