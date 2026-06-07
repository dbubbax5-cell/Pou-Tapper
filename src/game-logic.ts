import { Rarity } from './App';

export const getRarityColor = (rarity: Rarity): string => {
  const colors: Record<Rarity, string> = {
    common: 'text-gray-600',
    uncommon: 'text-blue-600',
    rare: 'text-green-600',
    epic: 'text-purple-600',
    legendary: 'text-yellow-600',
    mythic: 'text-indigo-600',
    glitch: 'text-red-600',
    secret: 'text-green-700',
  };
  return colors[rarity] || 'text-gray-600';
};

export const getRarityBgColor = (rarity: Rarity): string => {
  const colors: Record<Rarity, string> = {
    common: 'bg-gray-50 border-gray-200',
    uncommon: 'bg-blue-50 border-blue-200',
    rare: 'bg-green-50 border-green-200',
    epic: 'bg-purple-50 border-purple-200',
    legendary: 'bg-yellow-50 border-yellow-200',
    mythic: 'bg-indigo-50 border-indigo-200',
    glitch: 'bg-red-50 border-red-200',
    secret: 'bg-green-50 border-green-200',
  };
  return colors[rarity] || 'bg-gray-50 border-gray-200';
};
