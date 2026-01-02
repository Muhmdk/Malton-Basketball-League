// Core database models
// These types mirror the Supabase schema designed in STEP 2

export interface Player {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  photo_url?: string;
  position?: string;
  created_at: string;
}

export interface Team {
  id: string;
  season_id: string;
  name: string;
  logo_url?: string;
  created_at: string;
}

export interface Season {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface Game {
  id: string;
  season_id: string;
  home_team_id: string;
  away_team_id: string;
  scheduled_at: string;
  location?: string;
  home_score?: number;
  away_score?: number;
  is_final: boolean;
  created_at: string;
  // Joined relations (when using .select() with joins)
  home_team?: Team;
  away_team?: Team;
  season?: Season;
}

export interface GameStatLine {
  id: string;
  game_id: string;
  player_id: string;
  team_id: string;
  minutes_played: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  field_goals_made: number;
  field_goals_attempted: number;
  three_pointers_made: number;
  three_pointers_attempted: number;
  free_throws_made: number;
  free_throws_attempted: number;
  created_at: string;
  updated_at: string;
  // Joined relations
  player?: Player;
  game?: Game;
  team?: Team;
}

export interface Badge {
  id: string;
  name: string;
  description?: string;
  icon_url?: string;
  category?: string;
  rarity: 'common' | 'rare' | 'legendary';
  created_at: string;
}

export interface PlayerBadge {
  id: string;
  player_id: string;
  badge_id: string;
  game_id?: string;
  season_id?: string;
  earned_at: string;
  // Joined relations
  badge?: Badge;
  game?: Game;
}

export interface TeamRoster {
  id: string;
  team_id: string;
  player_id: string;
  jersey_number?: string;
  joined_at: string;
  // Joined relations
  player?: Player;
  team?: Team;
}

// Database view types
export interface PlayerSeasonStats {
  player_id: string;
  season_id: string;
  first_name: string;
  last_name: string;
  photo_url?: string;
  games_played: number;
  ppg: number;
  rpg: number;
  apg: number;
  spg: number;
  bpg: number;
  tpg: number;
  fg_pct?: number;
  three_pt_pct?: number;
  ft_pct?: number;
  total_points: number;
  total_rebounds: number;
  total_assists: number;
}

export interface PlayerCareerStats {
  player_id: string;
  first_name: string;
  last_name: string;
  photo_url?: string;
  career_games: number;
  career_ppg: number;
  career_rpg: number;
  career_apg: number;
  career_fg_pct?: number;
  career_total_points: number;
}

export interface LeaderboardEntry extends PlayerSeasonStats {
  ppg_rank: number;
  rpg_rank: number;
  apg_rank: number;
  fg_pct_rank: number;
}
