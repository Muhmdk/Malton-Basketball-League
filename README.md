# Malton Basketball League App

A cross-platform iOS + Android basketball rec-league app built with React Native (Expo) and Supabase.

## Features

- **Player Portfolios**: Detailed stats, badges, and performance tracking
- **Schedule & Results**: View upcoming games and past results
- **Leaderboards**: Top players by PPG, RPG, APG, FG%
- **Team Rosters**: Browse teams and their players
- **Box Scores**: Detailed game statistics

## Tech Stack

- **Frontend**: React Native (Expo) + TypeScript
- **Backend**: Supabase (Postgres, Auto-generated REST API)
- **Data Fetching**: React Query (TanStack Query)
- **Navigation**: Expo Router (file-based routing)

## Project Structure

```
malton-basketball-league/
├── app/                    # Expo Router screens (file-based routing)
│   ├── (tabs)/            # Tab navigator
│   │   ├── index.tsx      # Schedule tab
│   │   ├── leaderboards.tsx
│   │   └── teams.tsx
│   ├── player/[id].tsx    # Player profile (modal)
│   └── game/[id].tsx      # Game box score (modal)
├── src/
│   ├── hooks/             # React Query hooks
│   ├── lib/               # Core config (Supabase, React Query)
│   ├── types/             # TypeScript types
│   └── utils/             # Helper functions
├── assets/                # Static assets (images, icons)
└── package.json
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Run the database migration from `MIGRATION.sql` in the Supabase SQL Editor
3. Copy your project credentials:
   - Go to Project Settings → API
   - Copy the Project URL and anon/public key

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the App

```bash
npm start
```

See `SETUP_GUIDE.md` for detailed setup instructions including test data seeding.

## Database Schema

The app uses the following tables:

- `seasons` - League seasons (e.g., "Winter 2025")
- `teams` - Teams within a season
- `players` - Player information
- `team_rosters` - Many-to-many: players on teams
- `games` - Scheduled and completed games
- `game_stat_lines` - Player performance in each game
- `badges` - Available badges (30-point game, triple-double, etc.)
- `player_badges` - Badges earned by players

And these views for performance:

- `player_season_stats` - Aggregated season stats (PPG, RPG, etc.)
- `player_career_stats` - Career-wide statistics
- `season_leaderboards` - Top players by category

See `MIGRATION.sql` for the complete database schema.

## Development Roadmap

### MVP (Current)
- ✅ Player profiles with season stats
- ✅ Schedule and results
- ✅ Leaderboards
- ✅ Team rosters
- ✅ Game box scores
- ✅ Badge system (display only)

### Future Enhancements
- [ ] User authentication (players can claim profiles)
- [ ] Admin panel (Next.js) for data entry
- [ ] Real-time score updates (Supabase Realtime)
- [ ] Push notifications for game reminders
- [ ] Photo uploads (Supabase Storage)
- [ ] Advanced stats (PER, TS%, etc.)
- [ ] Season archives
- [ ] Player comparisons
- [ ] Team standings and win/loss records

## Architecture Decisions

### Why Expo?
- Zero native code configuration
- Over-the-air updates
- Faster development iteration
- Built-in components and APIs

### Why Supabase?
- Postgres (perfect for sports stats and aggregations)
- Auto-generated REST API (no backend boilerplate)
- Built-in auth and storage for future features
- Real-time subscriptions for live updates

### Why React Query?
- Automatic caching and background refetching
- Eliminates useState/useEffect boilerplate
- Optimistic updates support
- Excellent DevTools

### Why Database Views?
- Pre-computed aggregations (PPG, RPG, etc.)
- Single source of truth
- Fast reads (Postgres optimizes)
- No sync issues

## License

Proprietary - All rights reserved.
