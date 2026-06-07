import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Trash2, User, Star } from 'lucide-react';

interface SettingsUIProps {
  onClose: () => void;
  onReset: () => void;
}

export const SettingsUI: React.FC<SettingsUIProps> = ({ onClose, onReset }) => {
  const [soundOn, setSoundOn] = useState(true);
  const [showCreator, setShowCreator] = useState(false);

  const toggleSound = () => {
    setSoundOn(!soundOn);
  };

  const handleRate = () => {
    window.open('https://github.com/dbubbax5-cell/Pou-Tapper', '_blank');
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
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="flex items-center gap-3">
              {soundOn ? <Volume2 className="w-5 h-5 text-blue-500" /> : <VolumeX className="w-5 h-5 text-gray-500" />}
              <span className="font-medium dark:text-white">Sound Effects</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={soundOn} onChange={toggleSound} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <button 
            onClick={() => setShowCreator(true)}
            className="w-full p-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-xl flex items-center gap-3 transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="font-medium">THE POU KINGS</span>
          </button>

          <button 
            onClick={handleRate}
            className="w-full p-3 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300 rounded-xl flex items-center gap-3 transition-colors"
          >
            <Star className="w-5 h-5" />
            <span className="font-medium">Rate Game</span>
          </button>

          <div className="border-t dark:border-gray-800 my-4"></div>

          <button 
            onClick={handleReset}
            className="w-full p-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-300 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Reset All Progress
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Version 1.3.0 • Made with ❤️
          </p>
        </div>

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
              
              <button
                onClick={handleJoinDiscord}
                className="w-full p-4 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl flex items-center justify-center gap-3 transition-colors font-bold shadow-lg transform hover:scale-105"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.772-.6083 1.1588a18.2915 18.2915 0 00-5.4882 0 12.646 12.646 0 00-.6173-1.1588.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0657.0657 0 00-.0146.0105C1.328 8.975.007 13.432.131 17.863a.068.068 0 00.0315.0625c3.192.507 6.3047 1.529 9.176 3.022a.07.07 0 00.0765-.0275c.1533-.25.3004-.521.4386-.8022a.066.066 0 00-.0364-.092 12.806 12.806 0 01-1.829-.892.073.073 0 00-.036-.126c.122-.091.244-.177.365-.266a.07.07 0 01.073-.01c3.858 1.77 8.032 1.77 11.868 0a.07.07 0 01.075.01c.121.089.242.174.365.265a.073.073 0 00-.036.126 12.759 12.759 0 01-1.83.892.072.072 0 00-.037.092c.138.283.285.554.438.802a.07.07 0 00.077.028c2.92-1.493 6.035-2.545 9.19-3.022a.071.071 0 00.031-.0625c.145-4.537-.24-8.969-2.063-13.055a.06.06 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-.965-2.157-2.156 0-1.193.955-2.157 2.157-2.157 1.202 0 2.169.964 2.157 2.157 0 1.19-.956 2.156-2.157 2.156zm7.975 0c-1.183 0-2.157-.965-2.157-2.156 0-1.193.955-2.157 2.157-2.157 1.202 0 2.169.964 2.157 2.157 0 1.19-.956 2.156-2.157 2.156Z" />
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
