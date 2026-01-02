/**
 * Statistical calculations and validations
 */

export function calculateFieldGoalPercentage(
  made: number,
  attempted: number
): number | null {
  if (attempted === 0) return null;
  return (made / attempted) * 100;
}

export function isDoubleDouble(stats: {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
}): boolean {
  const categories = [
    stats.points,
    stats.rebounds,
    stats.assists,
    stats.steals,
    stats.blocks,
  ];
  return categories.filter((v) => v >= 10).length >= 2;
}

export function isTripleDouble(stats: {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
}): boolean {
  const categories = [
    stats.points,
    stats.rebounds,
    stats.assists,
    stats.steals,
    stats.blocks,
  ];
  return categories.filter((v) => v >= 10).length >= 3;
}

export function isPerfectShooting(
  made: number,
  attempted: number,
  minAttempts = 5
): boolean {
  return attempted >= minAttempts && made === attempted;
}
