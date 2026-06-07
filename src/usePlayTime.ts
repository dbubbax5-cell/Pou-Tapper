import { useState, useCallback, useEffect } from 'react';
import { supabase } from './supabase';

interface PlayerStats {
  playTime: number;
  totalTaps: number;
  achievements: Set<string>;
  leaderboard: any[];
}

export const usePlayTime = (userId: string | null) => {
  const [stats, setStats] = useState<PlayerStats>({
    playTime: 0,
    totalTaps: 0,
    achievements: new Set(),
    leaderboard: [],
  });

  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        playTime: prev.playTime + 1,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [userId]);

  const incrementTaps = useCallback(() => {
    setStats(prev => ({
      ...prev,
      totalTaps: prev.totalTaps + 1,
    }));
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    setStats(prev => ({
      ...prev,
      achievements: new Set([...prev.achievements, id]),
    }));
  }, []);

  const checkBestPou = useCallback(async (pouId: string) => {
    if (!userId) return;
    try {
      await supabase.from('leaderboard').upsert(
        { user_id: userId, best_pou_id: pouId, total_taps: stats.totalTaps },
        { onConflict: 'user_id' }
      );
    } catch (error) {
      console.error('Failed to update leaderboard:', error);
    }
  }, [userId, stats.totalTaps]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await supabase
          .from('leaderboard')
          .select('*')
          .order('best_rarity_score', { ascending: false })
          .limit(10);
        
        setStats(prev => ({
          ...prev,
          leaderboard: data || [],
        }));
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  return {
    ...stats,
    incrementTaps,
    unlockAchievement,
    checkBestPou,
  };
};
