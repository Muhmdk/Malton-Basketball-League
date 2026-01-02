import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTeams } from '@/hooks/useTeams';
import { useTeamRoster } from '@/hooks/useTeams';
import { useActiveSeason } from '@/hooks/useSeasons';
import { COLORS } from '@/lib/constants';
import type { Team } from '@/types/models';

/**
 * Teams Tab
 * Shows all teams and their rosters
 */
export default function TeamsScreen() {
  const router = useRouter();
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

  const { data: activeSeason, isLoading: seasonLoading } = useActiveSeason();
  const { data: teams, isLoading: teamsLoading } = useTeams(activeSeason?.id || '');

  const isLoading = seasonLoading || teamsLoading;

  const toggleTeam = (teamId: string) => {
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
  };

  const renderTeam = ({ item: team }: { item: Team }) => {
    const isExpanded = expandedTeamId === team.id;

    return (
      <View style={styles.teamCard}>
        <Pressable style={styles.teamHeader} onPress={() => toggleTeam(team.id)}>
          <View style={styles.teamTitleRow}>
            <Text style={styles.teamIcon}>🏀</Text>
            <View style={styles.teamInfo}>
              <Text style={styles.teamName}>{team.name}</Text>
              {/* TODO: Add team record (wins-losses) */}
            </View>
          </View>
          <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
        </Pressable>

        {isExpanded && <TeamRosterList teamId={team.id} />}
      </View>
    );
  };

  return (
    <View style={styles.container}>
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

      {/* Teams List */}
      {!isLoading && activeSeason && (
        <FlatList
          data={teams || []}
          renderItem={renderTeam}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centerContent}>
              <Text style={styles.emptyText}>No teams found</Text>
              <Text style={styles.emptySubtext}>
                An admin needs to create teams for this season
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

/**
 * Team Roster Component (shown when team is expanded)
 */
function TeamRosterList({ teamId }: { teamId: string }) {
  const router = useRouter();
  const { data: roster, isLoading } = useTeamRoster(teamId);

  if (isLoading) {
    return (
      <View style={styles.rosterLoading}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }

  if (!roster || roster.length === 0) {
    return (
      <View style={styles.rosterEmpty}>
        <Text style={styles.rosterEmptyText}>No players on roster</Text>
      </View>
    );
  }

  return (
    <View style={styles.rosterContainer}>
      {roster.map((rosterEntry) => (
        <Pressable
          key={rosterEntry.id}
          style={styles.playerRow}
          onPress={() => router.push(`/player/${rosterEntry.player_id}`)}
        >
          <View style={styles.playerInfo}>
            {rosterEntry.jersey_number && (
              <Text style={styles.jerseyNumber}>#{rosterEntry.jersey_number}</Text>
            )}
            <Text style={styles.playerName}>
              {rosterEntry.player?.first_name} {rosterEntry.player?.last_name}
            </Text>
          </View>
          {rosterEntry.player?.position && (
            <Text style={styles.position}>{rosterEntry.player.position}</Text>
          )}
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
  listContent: {
    padding: 16,
    gap: 12,
  },
  teamCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  teamTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  teamIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  expandIcon: {
    fontSize: 16,
    color: COLORS.text.tertiary,
  },
  rosterContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  rosterLoading: {
    padding: 16,
    alignItems: 'center',
  },
  rosterEmpty: {
    padding: 16,
    alignItems: 'center',
  },
  rosterEmptyText: {
    fontSize: 14,
    color: COLORS.text.tertiary,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  jerseyNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 12,
    width: 40,
  },
  playerName: {
    fontSize: 16,
    color: COLORS.text.primary,
  },
  position: {
    fontSize: 12,
    color: COLORS.text.tertiary,
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

// TODO: Add team statistics (total points, avg points, etc.)
// TODO: Add team standings (win/loss record)
// TODO: Add team photos/logos
