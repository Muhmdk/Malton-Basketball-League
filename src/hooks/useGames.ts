import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Game } from '@/types/models';

interface UseGamesOptions {
  seasonId?: string;
  isFinal?: boolean;
  limit?: number;
}

/**
 * Fetch games with optional filters
 */
export function useGames(options: UseGamesOptions = {}) {
  return useQuery({
    queryKey: ['games', options],
    queryFn: async () => {
      let query = supabase
        .from('games')
        .select(`
          *,
          home_team:teams!games_home_team_id_fkey(id, name, logo_url),
          away_team:teams!games_away_team_id_fkey(id, name, logo_url),
          season:seasons(id, name)
        `)
        .order('scheduled_at', { ascending: !options.isFinal });

      if (options.seasonId) {
        query = query.eq('season_id', options.seasonId);
      }

      if (options.isFinal !== undefined) {
        query = query.eq('is_final', options.isFinal);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Game[];
    },
  });
}

/**
 * Fetch a single game by ID
 */
export function useGame(gameId: string) {
  return useQuery({
    queryKey: ['game', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select(`
          *,
          home_team:teams!games_home_team_id_fkey(id, name, logo_url),
          away_team:teams!games_away_team_id_fkey(id, name, logo_url),
          season:seasons(id, name)
        `)
        .eq('id', gameId)
        .single();

      if (error) throw error;
      return data as Game;
    },
    enabled: !!gameId,
  });
}

/**
 * Fetch stat lines for a game (box score)
 */
export function useGameStatLines(gameId: string) {
  return useQuery({
    queryKey: ['game-stat-lines', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('game_stat_lines')
        .select(`
          *,
          player:players(id, first_name, last_name, position),
          team:teams(id, name)
        `)
        .eq('game_id', gameId)
        .order('points', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!gameId,
  });
}

// TODO: Add useTeamSchedule hook for team-specific games
// TODO: Add useUpcomingGames hook with date filtering
