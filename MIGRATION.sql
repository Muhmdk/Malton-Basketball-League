-- Malton Basketball League Database Migration
-- Run this SQL in your Supabase SQL Editor to set up the database schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- 1. Seasons
CREATE TABLE seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK(end_date > start_date)
);
CREATE INDEX idx_seasons_active ON seasons(is_active) WHERE is_active = true;

-- 2. Teams
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_team_per_season UNIQUE(season_id, name)
);
CREATE INDEX idx_teams_season ON teams(season_id);

-- 3. Players
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  photo_url TEXT,
  position VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_email UNIQUE(email)
);
CREATE INDEX idx_players_name ON players(last_name, first_name);
CREATE INDEX idx_players_email ON players(email);

-- 4. Team Rosters
CREATE TABLE team_rosters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
  jersey_number VARCHAR(3),
  joined_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_player_per_team UNIQUE(team_id, player_id)
);
CREATE INDEX idx_rosters_team ON team_rosters(team_id);
CREATE INDEX idx_rosters_player ON team_rosters(player_id);

-- 5. Games
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  home_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
  away_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
  scheduled_at TIMESTAMP NOT NULL,
  location VARCHAR(255),
  home_score INTEGER,
  away_score INTEGER,
  is_final BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT different_teams CHECK(home_team_id != away_team_id),
  CONSTRAINT valid_scores CHECK(
    (home_score IS NULL AND away_score IS NULL) OR
    (home_score IS NOT NULL AND away_score IS NOT NULL)
  )
);
CREATE INDEX idx_games_season ON games(season_id, scheduled_at DESC);
CREATE INDEX idx_games_home_team ON games(home_team_id);
CREATE INDEX idx_games_away_team ON games(away_team_id);
CREATE INDEX idx_games_upcoming ON games(scheduled_at) WHERE is_final = false;

-- 6. Game Stat Lines
CREATE TABLE game_stat_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
  minutes_played INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  rebounds INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  steals INTEGER DEFAULT 0,
  blocks INTEGER DEFAULT 0,
  turnovers INTEGER DEFAULT 0,
  field_goals_made INTEGER DEFAULT 0,
  field_goals_attempted INTEGER DEFAULT 0,
  three_pointers_made INTEGER DEFAULT 0,
  three_pointers_attempted INTEGER DEFAULT 0,
  free_throws_made INTEGER DEFAULT 0,
  free_throws_attempted INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_player_per_game UNIQUE(game_id, player_id),
  CONSTRAINT non_negative_stats CHECK(
    points >= 0 AND rebounds >= 0 AND assists >= 0 AND
    field_goals_made >= 0 AND field_goals_attempted >= 0
  )
);
CREATE INDEX idx_stat_lines_game ON game_stat_lines(game_id);
CREATE INDEX idx_stat_lines_player ON game_stat_lines(player_id);
CREATE INDEX idx_stat_lines_team ON game_stat_lines(team_id);
CREATE INDEX idx_stat_lines_points ON game_stat_lines(points DESC);
CREATE INDEX idx_stat_lines_rebounds ON game_stat_lines(rebounds DESC);
CREATE INDEX idx_stat_lines_assists ON game_stat_lines(assists DESC);

-- 7. Badges
CREATE TABLE badges (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url TEXT,
  category VARCHAR(50),
  rarity VARCHAR(20) DEFAULT 'common',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 8. Player Badges
CREATE TABLE player_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  badge_id VARCHAR(50) NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE SET NULL,
  season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_badge_per_game UNIQUE(player_id, badge_id, game_id)
);
CREATE INDEX idx_player_badges_player ON player_badges(player_id);
CREATE INDEX idx_player_badges_badge ON player_badges(badge_id);
CREATE INDEX idx_player_badges_season ON player_badges(season_id);

-- ============================================
-- VIEWS
-- ============================================

-- Player Season Stats View
CREATE VIEW player_season_stats AS
SELECT
  gsl.player_id,
  g.season_id,
  p.first_name,
  p.last_name,
  p.photo_url,
  COUNT(DISTINCT gsl.game_id) as games_played,
  ROUND(AVG(gsl.points), 1) as ppg,
  ROUND(AVG(gsl.rebounds), 1) as rpg,
  ROUND(AVG(gsl.assists), 1) as apg,
  ROUND(AVG(gsl.steals), 1) as spg,
  ROUND(AVG(gsl.blocks), 1) as bpg,
  ROUND(AVG(gsl.turnovers), 1) as tpg,
  ROUND(
    100.0 * SUM(gsl.field_goals_made)::NUMERIC /
    NULLIF(SUM(gsl.field_goals_attempted), 0),
    1
  ) as fg_pct,
  ROUND(
    100.0 * SUM(gsl.three_pointers_made)::NUMERIC /
    NULLIF(SUM(gsl.three_pointers_attempted), 0),
    1
  ) as three_pt_pct,
  ROUND(
    100.0 * SUM(gsl.free_throws_made)::NUMERIC /
    NULLIF(SUM(gsl.free_throws_attempted), 0),
    1
  ) as ft_pct,
  SUM(gsl.points) as total_points,
  SUM(gsl.rebounds) as total_rebounds,
  SUM(gsl.assists) as total_assists
FROM game_stat_lines gsl
JOIN games g ON gsl.game_id = g.id
JOIN players p ON gsl.player_id = p.id
WHERE g.is_final = true
GROUP BY gsl.player_id, g.season_id, p.first_name, p.last_name, p.photo_url;

-- Player Career Stats View
CREATE VIEW player_career_stats AS
SELECT
  gsl.player_id,
  p.first_name,
  p.last_name,
  p.photo_url,
  COUNT(DISTINCT gsl.game_id) as career_games,
  ROUND(AVG(gsl.points), 1) as career_ppg,
  ROUND(AVG(gsl.rebounds), 1) as career_rpg,
  ROUND(AVG(gsl.assists), 1) as career_apg,
  ROUND(
    100.0 * SUM(gsl.field_goals_made)::NUMERIC /
    NULLIF(SUM(gsl.field_goals_attempted), 0),
    1
  ) as career_fg_pct,
  SUM(gsl.points) as career_total_points
FROM game_stat_lines gsl
JOIN games g ON gsl.game_id = g.id
JOIN players p ON gsl.player_id = p.id
WHERE g.is_final = true
GROUP BY gsl.player_id, p.first_name, p.last_name, p.photo_url;

-- Season Leaderboards View
CREATE VIEW season_leaderboards AS
SELECT
  season_id,
  player_id,
  first_name,
  last_name,
  ppg,
  rpg,
  apg,
  fg_pct,
  games_played,
  ROW_NUMBER() OVER (PARTITION BY season_id ORDER BY ppg DESC) as ppg_rank,
  ROW_NUMBER() OVER (PARTITION BY season_id ORDER BY rpg DESC) as rpg_rank,
  ROW_NUMBER() OVER (PARTITION BY season_id ORDER BY apg DESC) as apg_rank,
  ROW_NUMBER() OVER (PARTITION BY season_id ORDER BY fg_pct DESC) as fg_pct_rank
FROM player_season_stats
WHERE games_played >= 3;

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default badges
INSERT INTO badges (id, name, description, category, rarity) VALUES
('thirty_point_game', '30-Point Game', 'Score 30+ points in a single game', 'scoring', 'rare'),
('triple_double', 'Triple Double', '10+ in three statistical categories', 'all_around', 'rare'),
('fifty_forty_ninety', '50-40-90 Club', 'Shoot 50% FG, 40% 3PT, 90% FT in a season', 'shooting', 'legendary'),
('double_double', 'Double Double', '10+ in two statistical categories', 'all_around', 'common'),
('sharpshooter', 'Sharpshooter', 'Make 5+ three-pointers in a game', 'shooting', 'common'),
('defensive_anchor', 'Defensive Anchor', '5+ steals or blocks in a game', 'defense', 'common'),
('perfect_game', 'Perfect Game', '100% shooting (min 5 FG attempts)', 'shooting', 'legendary');

-- ============================================
-- DONE!
-- ============================================

-- Your database is now ready. Next steps:
-- 1. Create a season
-- 2. Add teams to the season
-- 3. Add players
-- 4. Add players to team rosters
-- 5. Create games
-- 6. Add game stat lines
