import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  usePlayer,
  usePlayerSeasonStats,
  usePlayerBadges,
  usePlayerRecentGames,
} from '@/hooks/usePlayer';
import { useActiveSeason } from '@/hooks/useSeasons';
import { COLORS, BADGE_RARITIES } from '@/lib/constants';
import { formatStat, formatPercentage, formatDate } from '@/utils/formatting';

/**
 * Player Profile Screen
 * Shows detailed player stats, badges, and recent games
 */
export default function PlayerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: activeSeason } = useActiveSeason();
  const { data: player, isLoading: playerLoading } = usePlayer(id);
  const { data: seasonStats, isLoading: statsLoading } = usePlayerSeasonStats(
    id,
    activeSeason?.id || ''
  );
  const { data: badges, isLoading: badgesLoading } = usePlayerBadges(id);
  const { data: recentGames } = usePlayerRecentGames(id, { limit: 5 });

  const isLoading = playerLoading || statsLoading;

  if (isLoading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!player) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.errorText}>Player not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Player Header */}
      <View style={styles.header}>
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoPlaceholderText}>
            {player.first_name[0]}
            {player.last_name[0]}
          </Text>
        </View>
        <Text style={styles.playerName}>
          {player.first_name} {player.last_name}
        </Text>
        {player.position && <Text style={styles.position}>{player.position}</Text>}
      </View>

      {/* Season Stats */}
      {seasonStats ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Season Stats</Text>
          <View style={styles.statsGrid}>
            <StatBox label="PPG" value={formatStat(seasonStats.ppg, 1)} />
            <StatBox label="RPG" value={formatStat(seasonStats.rpg, 1)} />
            <StatBox label="APG" value={formatStat(seasonStats.apg, 1)} />
            <StatBox label="FG%" value={formatPercentage(seasonStats.fg_pct)} />
            <StatBox label="3PT%" value={formatPercentage(seasonStats.three_pt_pct)} />
            <StatBox label="FT%" value={formatPercentage(seasonStats.ft_pct)} />
          </View>
          <Text style={styles.gamesPlayed}>
            {seasonStats.games_played} games played
          </Text>
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.emptyText}>No stats available for this season</Text>
        </View>
      )}

      {/* Badges */}
      {badges && badges.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges ({badges.length})</Text>
          <View style={styles.badgesContainer}>
            {badges.map((playerBadge) => (
              <View key={playerBadge.id} style={styles.badgeCard}>
                <Text style={styles.badgeIcon}>🏅</Text>
                <View style={styles.badgeInfo}>
                  <Text style={styles.badgeName}>{playerBadge.badge?.name}</Text>
                  <Text style={styles.badgeDescription}>
                    {playerBadge.badge?.description}
                  </Text>
                  {playerBadge.badge?.rarity && (
                    <Text
                      style={[
                        styles.badgeRarity,
                        {
                          color: BADGE_RARITIES[playerBadge.badge.rarity].color,
                        },
                      ]}
                    >
                      {BADGE_RARITIES[playerBadge.badge.rarity].label}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Recent Games */}
      {recentGames && recentGames.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Games</Text>
          {recentGames.map((statLine) => (
            <View key={statLine.id} style={styles.gameStatCard}>
              <Text style={styles.gameStatOpponent}>
                vs {statLine.game?.home_team?.name || statLine.game?.away_team?.name}
              </Text>
              <Text style={styles.gameStatLine}>
                {statLine.points} pts • {statLine.rebounds} reb • {statLine.assists} ast
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.card,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  photoPlaceholderText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  position: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  section: {
    padding: 16,
    marginTop: 8,
    backgroundColor: COLORS.card,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statBox: {
    width: '30%',
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  gamesPlayed: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    textAlign: 'center',
    marginTop: 16,
  },
  badgesContainer: {
    gap: 12,
  },
  badgeCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
  },
  badgeIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  badgeDescription: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  badgeRarity: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  gameStatCard: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  gameStatOpponent: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  gameStatLine: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
  },
});

// TODO: Add career stats section
// TODO: Add photo upload functionality
// TODO: Add game-by-game stat log
// TODO: Add share profile functionality
