import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useLeaderboards, type LeaderboardCategory } from '@/hooks/useLeaderboards';
import { useActiveSeason } from '@/hooks/useSeasons';
import { COLORS, STAT_CATEGORIES } from '@/lib/constants';
import { formatStat, formatPercentage } from '@/utils/formatting';
import type { LeaderboardEntry } from '@/types/models';

/**
 * Leaderboards Tab
 * Shows top players by various statistical categories
 */
export default function LeaderboardsScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<LeaderboardCategory>('ppg');

  const { data: activeSeason, isLoading: seasonLoading } = useActiveSeason();
  const { data: leaders, isLoading: leadersLoading } = useLeaderboards({
    category,
    seasonId: activeSeason?.id || '',
    limit: 25,
  });

  const isLoading = seasonLoading || leadersLoading;

  const renderLeader = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    const rank = index + 1;
    const statValue = item[category];
    const formattedValue = category.includes('pct')
      ? formatPercentage(statValue)
      : formatStat(statValue, 1);

    return (
      <Pressable
        style={styles.leaderRow}
        onPress={() => router.push(`/player/${item.player_id}`)}
      >
        <View style={styles.rankContainer}>
          <Text style={[styles.rank, rank <= 3 && styles.rankTop]}>{rank}</Text>
        </View>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>
            {item.first_name} {item.last_name}
          </Text>
          <Text style={styles.playerGames}>{item.games_played} games</Text>
        </View>
        <Text style={styles.statValue}>{formattedValue}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Category Selector */}
      <View style={styles.categoryScroll}>
        {STAT_CATEGORIES.map((cat) => (
          <Pressable
            key={cat.id}
            style={[
              styles.categoryChip,
              category === cat.id && styles.categoryChipActive,
            ]}
            onPress={() => setCategory(cat.id as LeaderboardCategory)}
          >
            <Text
              style={[
                styles.categoryText,
                category === cat.id && styles.categoryTextActive,
              ]}
            >
              {cat.shortLabel}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Loading State */}
      {isLoading && (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}

      {/* No Active Season */}
      {!isLoading && !activeSeason && (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No active season found</Text>
        </View>
      )}

      {/* Leaderboard List */}
      {!isLoading && activeSeason && (
        <FlatList
          data={leaders || []}
          renderItem={renderLeader}
          keyExtractor={(item) => item.player_id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centerContent}>
              <Text style={styles.emptyText}>No stats available yet</Text>
              <Text style={styles.emptySubtext}>
                Stats will appear after games are played
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  categoryScroll: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  categoryTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.secondary,
  },
  rankTop: {
    color: COLORS.primary,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  playerGames: {
    fontSize: 12,
    color: COLORS.text.tertiary,
    marginTop: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    textAlign: 'center',
  },
});

// TODO: Add season selector dropdown
// TODO: Add minimum games played filter
// TODO: Add share leaderboard functionality
