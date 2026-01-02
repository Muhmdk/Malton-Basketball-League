import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { LeaderboardEntry } from '@/types/models';

export type LeaderboardCategory = 'ppg' | 'rpg' | 'apg' | 'fg_pct';

interface UseLeaderboardsOptions {
  category: LeaderboardCategory;
  seasonId: string;
  limit?: number;
}

/**
 * Fetch leaderboard for a specific category and season
 */
export function useLeaderboards({
  category,
  seasonId,
  limit = 10,
}: UseLeaderboardsOptions) {
  return useQuery({
    queryKey: ['leaderboards', seasonId, category, limit],
    queryFn: async () => {
      const rankColumn = `${category}_rank`;

      const { data, error } = await supabase
        .from('season_leaderboards')
        .select('*')
        .eq('season_id', seasonId)
        .lte(rankColumn, limit)
        .order(rankColumn);

      if (error) throw error;
      return data as LeaderboardEntry[];
    },
    enabled: !!seasonId,
  });
}

// TODO: Add useAllLeaderboards hook to fetch all categories at once
// TODO: Add usePlayerRankings hook to get a player's rank in all categories
