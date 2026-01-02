import type { GameStatLine } from '@/types/models';
import { isDoubleDouble, isTripleDouble, isPerfectShooting } from './stats';

/**
 * Badge evaluation logic
 * TODO: Move this to Supabase Edge Functions for server-side badge awarding
 */

export function checkThirtyPointGame(statLine: GameStatLine): boolean {
  return statLine.points >= 30;
}

export function checkTripleDouble(statLine: GameStatLine): boolean {
  return isTripleDouble(statLine);
}

export function checkDoubleDouble(statLine: GameStatLine): boolean {
  return isDoubleDouble(statLine);
}

export function checkSharpshooter(statLine: GameStatLine): boolean {
  return statLine.three_pointers_made >= 5;
}

export function checkDefensiveAnchor(statLine: GameStatLine): boolean {
  return statLine.steals + statLine.blocks >= 5;
}

export function checkPerfectGame(statLine: GameStatLine): boolean {
  return isPerfectShooting(
    statLine.field_goals_made,
    statLine.field_goals_attempted,
    5
  );
}

/**
 * Check all game-based badges for a stat line
 */
export function evaluateGameBadges(statLine: GameStatLine): string[] {
  const earnedBadges: string[] = [];

  if (checkThirtyPointGame(statLine)) {
    earnedBadges.push('thirty_point_game');
  }

  if (checkTripleDouble(statLine)) {
    earnedBadges.push('triple_double');
  }

  if (checkDoubleDouble(statLine)) {
    earnedBadges.push('double_double');
  }

  if (checkSharpshooter(statLine)) {
    earnedBadges.push('sharpshooter');
  }

  if (checkDefensiveAnchor(statLine)) {
    earnedBadges.push('defensive_anchor');
  }

  if (checkPerfectGame(statLine)) {
    earnedBadges.push('perfect_game');
  }

  return earnedBadges;
}
