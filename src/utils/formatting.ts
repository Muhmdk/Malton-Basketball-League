/**
 * Date and number formatting utilities
 */

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatDateTime(dateString: string): string {
  return `${formatDate(dateString)}, ${formatTime(dateString)}`;
}

export function formatStat(value: number | null | undefined, decimals = 1): string {
  if (value == null) return '-';
  return value.toFixed(decimals);
}

export function formatPercentage(value: number | null | undefined): string {
  if (value == null) return '-';
  return `${value.toFixed(1)}%`;
}

export function formatPlayerName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

export function formatGameScore(homeScore?: number, awayScore?: number): string {
  if (homeScore == null || awayScore == null) return 'TBD';
  return `${homeScore} - ${awayScore}`;
}
