import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useGames } from '@/hooks/useGames';
import { useActiveSeason } from '@/hooks/useSeasons';
import { COLORS } from '@/lib/constants';
import { formatDate, formatTime, formatGameScore } from '@/utils/formatting';
import type { Game } from '@/types/models';

/**
 * Schedule Tab - Home screen
 * Shows upcoming games and recent results
 */
export default function ScheduleScreen() {
  const router = useRouter();
  const [view, setView] = useState<'upcoming' | 'results'>('upcoming');

  // Fetch active season
  const { data: activeSeason, isLoading: seasonLoading } = useActiveSeason();

  // Fetch games based on current view
  const { data: games, isLoading: gamesLoading } = useGames({
    seasonId: activeSeason?.id,
    isFinal: view === 'results',
    limit: view === 'results' ? 20 : undefined,
  });

  const isLoading = seasonLoading || gamesLoading;

  const handleGamePress = (game: Game) => {
    if (game.is_final) {
      router.push(`/game/${game.id}`);
    }
  };

  const renderGame = ({ item: game }: { item: Game }) => (
    <Pressable
      style={styles.gameCard}
      onPress={() => handleGamePress(game)}
      disabled={!game.is_final}
    >
      <View style={styles.gameHeader}>
        <Text style={styles.gameDate}>{formatDate(game.scheduled_at)}</Text>
        <Text style={styles.gameTime}>{formatTime(game.scheduled_at)}</Text>
      </View>

      <View style={styles.gameMatchup}>
        <View style={styles.teamRow}>
          <Text style={styles.teamName}>{game.home_team?.name || 'Home'}</Text>
          {game.is_final && <Text style={styles.score}>{game.home_score}</Text>}
        </View>
        <Text style={styles.vs}>vs</Text>
        <View style={styles.teamRow}>
          <Text style={styles.teamName}>{game.away_team?.name || 'Away'}</Text>
          {game.is_final && <Text style={styles.score}>{game.away_score}</Text>}
        </View>
      </View>

      {game.location && (
        <Text style={styles.location}>{game.location}</Text>
      )}

      {game.is_final && (
        <Text style={styles.finalBadge}>FINAL - Tap for box score</Text>
      )}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Segment Control */}
      <View style={styles.segmentControl}>
        <Pressable
          style={[styles.segment, view === 'upcoming' && styles.segmentActive]}
          onPress={() => setView('upcoming')}
        >
          <Text style={[styles.segmentText, view === 'upcoming' && styles.segmentTextActive]}>
            Upcoming
          </Text>
        </Pressable>
        <Pressable
          style={[styles.segment, view === 'results' && styles.segmentActive]}
          onPress={() => setView('results')}
        >
          <Text style={[styles.segmentText, view === 'results' && styles.segmentTextActive]}>
            Results
          </Text>
        </Pressable>
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
          <Text style={styles.emptySubtext}>
            An admin needs to create and activate a season
          </Text>
        </View>
      )}

      {/* Games List */}
      {!isLoading && activeSeason && (
        <FlatList
          data={games || []}
          renderItem={renderGame}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centerContent}>
              <Text style={styles.emptyText}>
                {view === 'upcoming' ? 'No upcoming games' : 'No results yet'}
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
  segmentControl: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentActive: {
    backgroundColor: COLORS.primary,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  segmentTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  gameCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gameDate: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  gameTime: {
    fontSize: 14,
    color: COLORS.text.tertiary,
  },
  gameMatchup: {
    gap: 8,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  vs: {
    fontSize: 12,
    color: COLORS.text.tertiary,
    textAlign: 'center',
  },
  location: {
    fontSize: 12,
    color: COLORS.text.tertiary,
    marginTop: 8,
  },
  finalBadge: {
    fontSize: 11,
    color: COLORS.success,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
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

// TODO: Add pull-to-refresh functionality
// TODO: Add filter by team
// TODO: Add search functionality
