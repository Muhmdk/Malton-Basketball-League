import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { useGame, useGameStatLines } from '@/hooks/useGames';
import { COLORS } from '@/lib/constants';
import { formatDate, formatTime } from '@/utils/formatting';

/**
 * Game Box Score Screen
 * Shows detailed game stats for all players
 */
export default function GameBoxScoreScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: game, isLoading: gameLoading } = useGame(id);
  const { data: statLines, isLoading: statsLoading } = useGameStatLines(id);

  const isLoading = gameLoading || statsLoading;

  if (isLoading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!game) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.errorText}>Game not found</Text>
      </View>
    );
  }

  // Split stat lines by team
  const homeTeamStats = statLines?.filter((s) => s.team_id === game.home_team_id) || [];
  const awayTeamStats = statLines?.filter((s) => s.team_id === game.away_team_id) || [];

  return (
    <ScrollView style={styles.container}>
      {/* Game Header */}
      <View style={styles.header}>
        <Text style={styles.date}>
          {formatDate(game.scheduled_at)} • {formatTime(game.scheduled_at)}
        </Text>
        {game.location && <Text style={styles.location}>{game.location}</Text>}

        <View style={styles.scoreContainer}>
          <View style={styles.teamScore}>
            <Text style={styles.teamName}>{game.home_team?.name}</Text>
            <Text style={styles.score}>{game.home_score}</Text>
          </View>
          <Text style={styles.scoreSeparator}>-</Text>
          <View style={styles.teamScore}>
            <Text style={styles.teamName}>{game.away_team?.name}</Text>
            <Text style={styles.score}>{game.away_score}</Text>
          </View>
        </View>

        {game.is_final && <Text style={styles.finalBadge}>FINAL</Text>}
      </View>

      {/* Home Team Box Score */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{game.home_team?.name} Box Score</Text>
        <BoxScoreTable stats={homeTeamStats} onPlayerPress={(playerId) => router.push(`/player/${playerId}`)} />
      </View>

      {/* Away Team Box Score */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{game.away_team?.name} Box Score</Text>
        <BoxScoreTable stats={awayTeamStats} onPlayerPress={(playerId) => router.push(`/player/${playerId}`)} />
      </View>
    </ScrollView>
  );
}

function BoxScoreTable({
  stats,
  onPlayerPress,
}: {
  stats: any[];
  onPlayerPress: (playerId: string) => void;
}) {
  if (stats.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>No stats recorded</Text>
      </View>
    );
  }

  return (
    <View style={styles.table}>
      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableCell, styles.playerColumn]}>Player</Text>
        <Text style={styles.tableCell}>PTS</Text>
        <Text style={styles.tableCell}>REB</Text>
        <Text style={styles.tableCell}>AST</Text>
      </View>

      {/* Player Rows */}
      {stats.map((stat) => (
        <Pressable
          key={stat.id}
          style={styles.tableRow}
          onPress={() => onPlayerPress(stat.player_id)}
        >
          <Text style={[styles.tableCell, styles.playerColumn]}>
            {stat.player?.first_name[0]}. {stat.player?.last_name}
          </Text>
          <Text style={styles.tableCell}>{stat.points}</Text>
          <Text style={styles.tableCell}>{stat.rebounds}</Text>
          <Text style={styles.tableCell}>{stat.assists}</Text>
        </Pressable>
      ))}
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
    backgroundColor: COLORS.card,
    padding: 24,
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: COLORS.text.tertiary,
    marginBottom: 16,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  teamScore: {
    alignItems: 'center',
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  score: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  scoreSeparator: {
    fontSize: 24,
    color: COLORS.text.tertiary,
  },
  finalBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success,
    marginTop: 12,
  },
  section: {
    backgroundColor: COLORS.card,
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  table: {
    gap: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  playerColumn: {
    flex: 2,
    textAlign: 'left',
  },
  emptyBox: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text.tertiary,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
  },
});

// TODO: Add horizontal scroll for full stat line (FG%, 3PT%, etc.)
// TODO: Add team totals row
// TODO: Add shooting percentages
// TODO: Add +/- stat
