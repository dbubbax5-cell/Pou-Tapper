import { useState, useCallback, useEffect } from 'react';
import { supabase } from './supabase';
import { POU_COLORS, RARITY_WEIGHTS } from './App';

interface GameState {
  currentPou: typeof POU_COLORS[0];
  collection: Set<string>;
  loading: boolean;
  notification: { type: 'new' | 'duplicate'; message: string } | null;
  isRespawning: boolean;
  userId: string | null;
}

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentPou: POU_COLORS[0],
    collection: new Set(),
    loading: true,
    notification: null,
    isRespawning: false,
    userId: null,
  });

  useEffect(() => {
    const initGame = async () => {
      try {
        const userId = localStorage.getItem('userId') || crypto.randomUUID();
        localStorage.setItem('userId', userId);
        
        const { data } = await supabase
          .from('collections')
          .select('pou_color_id')
          .eq('user_id', userId);
        
        const collection = new Set(data?.map(d => d.pou_color_id) || []);
        
        setGameState(prev => ({
          ...prev,
          userId,
          collection,
          loading: false,
          currentPou: getRandomPou(),
        }));
      } catch (error) {
        console.error('Failed to init game:', error);
        setGameState(prev => ({ ...prev, loading: false }));
      }
    };
    
    initGame();
  }, []);

  const getRandomPou = useCallback(() => {
    const total = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
    let random = Math.random() * total;
    
    for (const pou of POU_COLORS) {
      random -= RARITY_WEIGHTS[pou.rarity];
      if (random <= 0) return pou;
    }
    
    return POU_COLORS[0];
  }, []);

  const handleTap = useCallback(async () => {
    const newPou = getRandomPou();
    const isNew = !gameState.collection.has(newPou.id);

    setGameState(prev => ({
      ...prev,
      isRespawning: true,
    }));

    setTimeout(async () => {
      if (isNew && gameState.userId) {
        try {
          await supabase.from('collections').insert([
            { user_id: gameState.userId, pou_color_id: newPou.id, rarity: newPou.rarity }
          ]);
        } catch (error) {
          console.error('Failed to save collection:', error);
        }
      }

      setGameState(prev => ({
        ...prev,
        currentPou: newPou,
        collection: isNew ? new Set([...prev.collection, newPou.id]) : prev.collection,
        notification: isNew ? { type: 'new', message: `New: ${newPou.name}!` } : { type: 'duplicate', message: newPou.name },
        isRespawning: false,
      }));
    }, 300);
  }, [gameState.collection, gameState.userId, getRandomPou]);

  return { ...gameState, handleTap };
};
