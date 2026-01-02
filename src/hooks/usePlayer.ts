import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Player, PlayerSeasonStats, PlayerBadge } from '@/types/models';

/**
 * Fetch player basic information
 */
export function usePlayer(playerId: string) {
  return useQuery({
    queryKey: ['player', playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('id', playerId)
        .single();

      if (error) throw error;
      return data as Player;
    },
    enabled: !!playerId,
  });
}

/**
 * Fetch player season stats from the database view
 */
export function usePlayerSeasonStats(playerId: string, seasonId: string) {
  return useQuery({
    queryKey: ['player-season-stats', playerId, seasonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_season_stats')
        .select('*')
        .eq('player_id', playerId)
        .eq('season_id', seasonId)
        .maybeSingle();

      if (error) throw error;
      return data as PlayerSeasonStats | null;
    },
    enabled: !!playerId && !!seasonId,
  });
}

/**
 * Fetch player career stats from the database view
 */
export function usePlayerCareerStats(playerId: string) {
  return useQuery({
    queryKey: ['player-career-stats', playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_career_stats')
        .select('*')
        .eq('player_id', playerId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!playerId,
  });
}

/**
 * Fetch player badges
 */
export function usePlayerBadges(playerId: string) {
  return useQuery({
    queryKey: ['player-badges', playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_badges')
        .select(`
          *,
          badge:badges(*)
        `)
        .eq('player_id', playerId)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return data as PlayerBadge[];
    },
    enabled: !!playerId,
  });
}

/**
 * Fetch player recent game performances
 */
export function usePlayerRecentGames(
  playerId: string,
  options: { limit?: number } = {}
) {
  return useQuery({
    queryKey: ['player-recent-games', playerId, options.limit],
    queryFn: async () => {
      let query = supabase
        .from('game_stat_lines')
        .select(`
          *,
          game:games(
            *,
            home_team:teams!games_home_team_id_fkey(name),
            away_team:teams!games_away_team_id_fkey(name)
          )
        `)
        .eq('player_id', playerId)
        .order('created_at', { ascending: false });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!playerId,
  });
}

// TODO: Add usePlayerGameLog hook for full season game-by-game stats
// TODO: Add usePlayerComparison hook for comparing two players
