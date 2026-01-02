# Setup Guide - Malton Basketball League App

This guide will walk you through setting up the development environment and deploying the app.

## Prerequisites

- Node.js 18+ installed
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app on your phone (optional, for testing on device)
- Supabase account (free tier is fine)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd malton-basketball-league
npm install
```

### 2. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (e.g., "Malton League")
4. Create a new project:
   - Name: "malton-basketball-league"
   - Database Password: (save this somewhere safe)
   - Region: Choose closest to your location
   - Click "Create new project"
5. Wait for the project to be provisioned (~2 minutes)

### 3. Run Database Migration

1. In your Supabase project dashboard, click "SQL Editor" in the left sidebar
2. Click "New query"
3. Copy the entire contents of `MIGRATION.sql` from this repo
4. Paste into the SQL editor
5. Click "Run" (bottom right)
6. You should see "Success. No rows returned"

### 4. Verify Database Setup

1. Click "Table Editor" in the left sidebar
2. You should see all your tables:
   - seasons
   - teams
   - players
   - team_rosters
   - games
   - game_stat_lines
   - badges
   - player_badges
3. Click on the "badges" table - you should see 7 pre-seeded badges

### 5. Get API Credentials

1. Click "Settings" (gear icon) in the left sidebar
2. Click "API" under "Project Settings"
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### 6. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and paste your credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
```

### 7. Generate TypeScript Types (Recommended)

This step is optional but highly recommended for type safety:

```bash
# Install Supabase CLI globally
npm install -g supabase

# Generate types (replace YOUR_PROJECT_ID with your actual project ID from the URL)
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

Your project ID is the part before `.supabase.co` in your project URL.

### 8. Seed Test Data

To see the app in action, you need some test data. Run these SQL queries in the Supabase SQL Editor:

```sql
-- 1. Create a season
INSERT INTO seasons (name, start_date, end_date, is_active)
VALUES ('Winter 2025', '2025-01-01', '2025-03-31', true)
RETURNING id;

-- Copy the returned season ID and use it below

-- 2. Create teams
INSERT INTO teams (season_id, name) VALUES
  ('PASTE_SEASON_ID_HERE', 'Thunder'),
  ('PASTE_SEASON_ID_HERE', 'Lakers'),
  ('PASTE_SEASON_ID_HERE', 'Raptors'),
  ('PASTE_SEASON_ID_HERE', 'Warriors')
RETURNING id, name;

-- Copy the team IDs

-- 3. Create players
INSERT INTO players (first_name, last_name, position) VALUES
  ('John', 'Smith', 'Guard'),
  ('Mike', 'Johnson', 'Forward'),
  ('Chris', 'Lee', 'Guard'),
  ('David', 'Brown', 'Center'),
  ('James', 'Wilson', 'Forward'),
  ('Robert', 'Davis', 'Guard'),
  ('Michael', 'Martinez', 'Forward'),
  ('William', 'Garcia', 'Center')
RETURNING id, first_name, last_name;

-- Copy player IDs

-- 4. Add players to teams (use your actual IDs)
INSERT INTO team_rosters (team_id, player_id, jersey_number) VALUES
  ('THUNDER_TEAM_ID', 'PLAYER_1_ID', '23'),
  ('THUNDER_TEAM_ID', 'PLAYER_2_ID', '32'),
  ('LAKERS_TEAM_ID', 'PLAYER_3_ID', '24'),
  ('LAKERS_TEAM_ID', 'PLAYER_4_ID', '34');

-- 5. Create a completed game
INSERT INTO games (
  season_id,
  home_team_id,
  away_team_id,
  scheduled_at,
  location,
  home_score,
  away_score,
  is_final
)
VALUES (
  'SEASON_ID',
  'THUNDER_TEAM_ID',
  'LAKERS_TEAM_ID',
  '2025-01-15 19:00:00',
  'Court 3, Malton Community Center',
  92,
  85,
  true
)
RETURNING id;

-- 6. Add game stats (use your actual IDs)
INSERT INTO game_stat_lines (
  game_id, player_id, team_id,
  minutes_played, points, rebounds, assists, steals, blocks,
  field_goals_made, field_goals_attempted,
  three_pointers_made, three_pointers_attempted,
  free_throws_made, free_throws_attempted
) VALUES
  ('GAME_ID', 'PLAYER_1_ID', 'THUNDER_TEAM_ID', 32, 28, 8, 5, 2, 1, 10, 18, 2, 5, 6, 7),
  ('GAME_ID', 'PLAYER_2_ID', 'THUNDER_TEAM_ID', 30, 24, 12, 3, 1, 2, 9, 15, 1, 3, 5, 6),
  ('GAME_ID', 'PLAYER_3_ID', 'LAKERS_TEAM_ID', 28, 22, 6, 8, 3, 0, 8, 16, 2, 6, 4, 5),
  ('GAME_ID', 'PLAYER_4_ID', 'LAKERS_TEAM_ID', 26, 18, 10, 2, 1, 3, 7, 12, 0, 1, 4, 4);
```

**Pro Tip**: Use a SQL client or create a simple script to automate this. The IDs are UUIDs so copying them manually is tedious.

### 9. Run the App

```bash
# Start Expo dev server
npm start

# In another terminal, run on iOS
npm run ios

# Or run on Android
npm run android

# Or open Expo Go on your phone and scan the QR code
```

### 10. Verify Everything Works

You should now see:

- **Schedule Tab**: The game you created (Thunder vs Lakers)
- **Leaderboards Tab**: Top scorers from your test game
- **Teams Tab**: Thunder, Lakers, Raptors, Warriors with rosters
- Click on the game → See the box score
- Click on a player → See their profile with stats

## Troubleshooting

### "Missing Supabase credentials" Error

- Make sure `.env.local` exists and has the correct values
- Restart the Expo dev server after creating `.env.local`
- Check that your keys don't have extra quotes or spaces

### "No active season found"

- Make sure you set `is_active = true` when creating the season
- Only one season should be active at a time

### Database query errors

- Check the Supabase logs: Dashboard → Logs → Postgres Logs
- Verify your foreign key IDs are correct (UUIDs must match exactly)
- Make sure the migration ran successfully

### App crashes on startup

- Check the terminal for error messages
- Run `npm install` again
- Clear Expo cache: `npx expo start -c`

## Next Steps

1. Add more test data (more games, players, teams)
2. Customize the app colors in `src/lib/constants.ts`
3. Add team logos and player photos
4. Build the admin panel for data entry (separate Next.js app)
5. Deploy to TestFlight (iOS) or Google Play Internal Testing (Android)

## Deployment

### iOS (TestFlight)

```bash
# Build for iOS
eas build --platform ios

# Submit to App Store Connect
eas submit --platform ios
```

### Android (Google Play)

```bash
# Build for Android
eas build --platform android

# Submit to Google Play
eas submit --platform android
```

You'll need an Expo Application Services (EAS) account. The free tier allows limited builds per month.

## Support

For issues or questions, contact the development team or create an issue in the project repository.
