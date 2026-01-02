import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Team, TeamRoster } from '@/types/models';

/**
 * Fetch all teams for a season
 */
export function useTeams(seasonId: string) {
  return useQuery({
    queryKey: ['teams', seasonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('season_id', seasonId)
        .order('name');

      if (error) throw error;
      return data as Team[];
    },
    enabled: !!seasonId,
  });
}

/**
 * Fetch a single team by ID
 */
export function useTeam(teamId: string) {
  return useQuery({
    queryKey: ['team', teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

      if (error) throw error;
      return data as Team;
    },
    enabled: !!teamId,
  });
}

/**
 * Fetch team roster (players on the team)
 */
export function useTeamRoster(teamId: string) {
  return useQuery({
    queryKey: ['team-roster', teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_rosters')
        .select(`
          *,
          player:players(*)
        `)
        .eq('team_id', teamId);

      if (error) throw error;
      return data as TeamRoster[];
    },
    enabled: !!teamId,
  });
}

// TODO: Add useTeamStats hook for aggregated team statistics
// TODO: Add useTeamStandings hook for win/loss records
