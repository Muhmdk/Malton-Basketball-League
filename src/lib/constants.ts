export const APP_NAME = 'Malton Basketball League';

export const STAT_CATEGORIES = [
  { id: 'ppg', label: 'Points', shortLabel: 'PPG' },
  { id: 'rpg', label: 'Rebounds', shortLabel: 'RPG' },
  { id: 'apg', label: 'Assists', shortLabel: 'APG' },
  { id: 'fg_pct', label: 'Field Goal %', shortLabel: 'FG%' },
] as const;

export const BADGE_RARITIES = {
  common: { color: '#9CA3AF', label: 'Common' },
  rare: { color: '#3B82F6', label: 'Rare' },
  legendary: { color: '#F59E0B', label: 'Legendary' },
} as const;

export const MIN_GAMES_FOR_LEADERBOARD = 3;

// UI Colors
export const COLORS = {
  primary: '#3B82F6',
  secondary: '#6B7280',
  success: '#10B981',
  error: '#EF4444',
  background: '#F9FAFB',
  card: '#FFFFFF',
  border: '#E5E7EB',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
  },
};
