import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Season } from '@/types/models';

/**
 * Fetch all seasons
 */
export function useSeasons() {
  return useQuery({
    queryKey: ['seasons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seasons')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data as Season[];
    },
  });
}

/**
 * Fetch the currently active season
 */
export function useActiveSeason() {
  return useQuery({
    queryKey: ['active-season'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seasons')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data as Season | null;
    },
  });
}

/**
 * Fetch a specific season by ID
 */
export function useSeason(seasonId: string) {
  return useQuery({
    queryKey: ['season', seasonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seasons')
        .select('*')
        .eq('id', seasonId)
        .single();

      if (error) throw error;
      return data as Season;
    },
    enabled: !!seasonId,
  });
}
