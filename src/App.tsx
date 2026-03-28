import React from 'react';
import { GameScreen } from './PouCharacter'; // Or wherever your main game loop is
import StatsUI from './StatsUI';
import LeaderboardUI from './LeaderboardUI';
import AchievementsUI from './AchievementsUI';
export const app = ()>(
export type Achievement = {
  id: string;
  name: string;
  description: string;
  condition: (stats: { collectionSize: number; totalTaps: number; hasLegendary: boolean; hasMythic: boolean }) => boolean;
  icon: string; // lucide icon name or emoji
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
  colorCode: string; // CSS color or gradient
  specialEffect?: string; // 'glow', 'rainbow', 'galaxy', 'metallic', 'glitch', 'chip'
};

export type CollectionItem = {
  id: string;
  pou_color_id: string;
  rarity: Rarity;
  unlocked_at: string;
};

// Scaled up to 100,000 total to allow for 0.001% chance (which is 1/100,000)
export const RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 53000,    // 53%
  uncommon: 30000,  // 30%
  rare: 10000,      // 10%
  epic: 5000,       // 5% (Increased from ~4%)
  legendary: 1500,  // 1.5% (Increased from ~0.8%)
  mythic: 400,      // 0.4% (Increased from ~0.15%)
  glitch: 99,       // ~0.1%
  secret: 1,        // 0.001% (1 in 100,000) - Chip Pou
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
  // Common (Light Blue, Green, Grey)
  { id: 'common_lightblue', name: 'Light Blue Pou', rarity: 'common', colorCode: '#ADD8E6' },
  { id: 'common_green', name: 'Green Pou', rarity: 'common', colorCode: '#90EE90' },
  { id: 'common_grey', name: 'Grey Pou', rarity: 'common', colorCode: '#A9A9A9' },

  // Uncommon (Purple, Orange, Pink, Teal)
  { id: 'uncommon_purple', name: 'Purple Pou', rarity: 'uncommon', colorCode: '#9370DB' },
  { id: 'uncommon_orange', name: 'Orange Pou', rarity: 'uncommon', colorCode: '#FFA500' },
  { id: 'uncommon_pink', name: 'Pink Pou', rarity: 'uncommon', colorCode: '#FFC0CB' },
  { id: 'uncommon_teal', name: 'Teal Pou', rarity: 'uncommon', colorCode: '#008080' },

  // Rare (Brown, Gold, Neon Blue, Red)
  { id: 'rare_brown', name: 'Brown Pou', rarity: 'rare', colorCode: '#8B4513' },
  { id: 'rare_gold', name: 'Gold Pou', rarity: 'rare', colorCode: '#FFD700', specialEffect: 'glow' },
  { id: 'rare_neonblue', name: 'Neon Blue Pou', rarity: 'rare', colorCode: '#00FFFF', specialEffect: 'glow' },
  { id: 'rare_red', name: 'Red Pou', rarity: 'rare', colorCode: '#DC143C' },

  // Epic (Gemstones/Metallic)
  { id: 'epic_ruby', name: 'Ruby Pou', rarity: 'epic', colorCode: '#E0115F', specialEffect: 'metallic' },
  { id: 'epic_emerald', name: 'Emerald Pou', rarity: 'epic', colorCode: '#50C878', specialEffect: 'metallic' },
  { id: 'epic_sapphire', name: 'Sapphire Pou', rarity: 'epic', colorCode: '#0F52BA', specialEffect: 'metallic' },
  { id: 'epic_obsidian', name: 'Obsidian Pou', rarity: 'epic', colorCode: '#111111', specialEffect: 'metallic' },

  // Legendary (Rainbow, Holographic)
  { id: 'legendary_rainbow', name: 'Rainbow Pou', rarity: 'legendary', colorCode: 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)', specialEffect: 'rainbow' },
  { id: 'legendary_holo', name: 'Holo Pou', rarity: 'legendary', colorCode: 'linear-gradient(135deg, #e6e6fa, #d8bfd8, #dda0dd)', specialEffect: 'glow' },

  // Mythic (Galaxy, Void)
  { id: 'mythic_galaxy', name: 'Galaxy Pou', rarity: 'mythic', colorCode: '#000', specialEffect: 'galaxy' },
  { id: 'mythic_void', name: 'Void Pou', rarity: 'mythic', colorCode: '#000000', specialEffect: 'galaxy' },

  // Glitch (MissingNo style)
  { id: 'glitch_error', name: 'Error 404 Pou', rarity: 'glitch', colorCode: '#000', specialEffect: 'glitch' },

  // Secret (The Chip Pou)
  { id: 'secret_chip', name: 'Chip Pou', rarity: 'secret', colorCode: '#006400', specialEffect: 'chip' },
];
)}
export default App;
