import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PouColor } from '../../types/game';
import { cn } from '../../lib/utils'; // Assuming cn exists or use clsx

interface PouCharacterProps {
  pou: PouColor;
  onTap: () => void;
}

export const PouCharacter: React.FC<PouCharacterProps> = ({ pou, onTap }) => {
  const isRainbow = pou.rarity === 'legendary';
  const isMythic = pou.rarity === 'mythic';
  const isEpic = pou.rarity === 'epic';
  const isGlitch = pou.rarity === 'glitch';
  const isSecret = pou.rarity === 'secret'; // Chip Pou
  const isGlow = pou.specialEffect === 'glow';

  // Base image URL
  const POU_IMAGE_URL = "https://miaoda-conversation-file.s3cdn.medo.dev/user-9r9gatfy7ncw/conv-9r9gc4svspog/20260220/file-9ra0dejm11j4.jpg";

  // Calculate hue rotation based on color name or ID
  const getFilter = () => {
    let hueRotate = 0;
    let saturate = 1;
    let brightness = 1;
    let contrast = 1;
    let invert = 0;
    let sepia = 0;

    // Map colors to hue rotations (approximate)
    if (pou.id.includes('brown')) { hueRotate = 0; }
    else if (pou.id.includes('lightblue')) { hueRotate = 180; saturate = 1.5; }
    else if (pou.id.includes('green')) { hueRotate = 80; saturate = 1.2; }
    else if (pou.id.includes('purple')) { hueRotate = 240; saturate = 1.2; }
    else if (pou.id.includes('orange')) { hueRotate = 0; saturate = 2; } 
    else if (pou.id.includes('pink')) { hueRotate = 290; saturate = 1.2; }
    else if (pou.id.includes('gold')) { hueRotate = 10; saturate = 2.5; brightness = 1.2; }
    else if (pou.id.includes('neonblue')) { hueRotate = 190; saturate = 3; brightness = 1.3; }
    else if (pou.id.includes('red')) { hueRotate = 340; saturate = 1.5; }
    else if (pou.id.includes('grey')) { hueRotate = 0; saturate = 0; }
    else if (pou.id.includes('teal')) { hueRotate = 170; saturate = 1.5; }
    
    // Epic colors
    else if (pou.id.includes('ruby')) { hueRotate = 330; saturate = 3; brightness = 1.2; }
    else if (pou.id.includes('emerald')) { hueRotate = 140; saturate = 3; brightness = 1.2; }
    else if (pou.id.includes('sapphire')) { hueRotate = 220; saturate = 3; brightness = 1.2; }
    else if (pou.id.includes('obsidian')) { hueRotate = 0; saturate = 0; brightness = 0.5; contrast = 1.5; }

    // Mythic/Glitch/Secret
    else if (pou.id.includes('galaxy') || pou.id.includes('void')) { hueRotate = 260; saturate = 0.5; brightness = 0.6; }
    else if (pou.id.includes('glitch') || pou.id.includes('error')) { hueRotate = 0; invert = 1; contrast = 2; }
    else if (pou.id.includes('rainbow') || pou.id.includes('holo')) { hueRotate = 0; }
    else if (pou.id.includes('chip')) { hueRotate = 80; saturate = 0.5; sepia = 0.8; brightness = 0.8; contrast = 1.2; } // Circuit board green/gold

    // Add mix-blend-multiply to blend the white background
    let filter = `hue-rotate(${hueRotate}deg) saturate(${saturate}) brightness(${brightness}) contrast(${contrast})`;
    
    if (invert) filter += ` invert(${invert})`;
    if (sepia) filter += ` sepia(${sepia})`;

    // Boost contrast to ensure white background is pure white for multiply
    filter += ' contrast(1.1) brightness(1.05)';

    // For mythic/legendary, we might want to mute the base image slightly so overlay pops
    if (isRainbow || isMythic || isEpic || isGlitch || isSecret) {
      filter += ' grayscale(0.2)';
    }

    return filter;
  };

  return (
    <div className="relative flex justify-center items-center cursor-pointer select-none" onClick={onTap}>
      <AnimatePresence mode="wait">
        <motion.div
          key={pou.id}
          initial={{ scale: 0, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0, opacity: 0, rotate: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          whileTap={{ scale: 0.8 }}
          className={cn(
            "relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center",
            isGlow && "drop-shadow-[0_0_25px_rgba(255,215,0,0.6)]",
            isGlitch && "animate-pulse",
            isSecret && "drop-shadow-[0_0_15px_rgba(0,255,0,0.8)]"
          )}
        >
           {/* Container for Image */}
           <div className="w-full h-full relative flex items-center justify-center">
             {/* Base Image with Filters & Multiply Blend Mode */}
             <img 
               src={POU_IMAGE_URL} 
               alt={pou.name}
               className={cn(
                 "w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal dark:rounded-3xl dark:overflow-hidden",
                 isGlitch && "skew-x-6 scale-105 opacity-90 blur-[0.5px]"
               )} 
               style={{ filter: getFilter() }}
             />

             {/* Overlays for Special Rarities */}
             
             {/* Epic: Metallic Shine */}
             {isEpic && (
               <div className="absolute inset-0 opacity-40 bg-gradient-to-tr from-transparent via-white to-transparent pointer-events-none rounded-3xl mix-blend-overlay" />
             )}

             {isRainbow && (
               <div className="absolute inset-0 opacity-50 mix-blend-overlay bg-gradient-to-br from-red-500 via-green-500 to-blue-500 animate-pulse pointer-events-none rounded-3xl" />
             )}
             
             {isMythic && (
               <>
                 <div className="absolute inset-0 opacity-60 mix-blend-color-dodge bg-indigo-900 pointer-events-none rounded-3xl" />
                 <div className="absolute inset-0 opacity-80 mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-spin-slow pointer-events-none rounded-3xl" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none rounded-3xl" />
               </>
             )}

             {isGlitch && (
               <div className="absolute inset-0 bg-red-500 opacity-20 mix-blend-difference pointer-events-none rounded-3xl animate-ping" />
             )}
             
             {isSecret && (
                <>
                  {/* Circuit Board Pattern */}
                  <div className="absolute inset-0 opacity-40 mix-blend-color-dodge bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] pointer-events-none rounded-3xl" />
                  {/* Digital Rain Effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent opacity-50 pointer-events-none rounded-3xl" />
                  <div className="absolute inset-0 border-2 border-green-500/50 rounded-3xl pointer-events-none animate-pulse" />
                </>
             )}

             {/* Shine effect */}
             <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none rounded-3xl" />
           </div>
           
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
