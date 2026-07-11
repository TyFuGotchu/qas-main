/** Max age for news shown in the public feed API. */
export const NEWS_FEED_MAX_AGE_HOURS = 48;

/** Max age for prop alerts shown in the public feed API. */
export const ALERT_FEED_MAX_AGE_HOURS = 24;

/** Skip RSS items older than this during ingest. */
export const NEWS_INGEST_MAX_AGE_HOURS = 48;

/** Deactivate news older than this after each ingest run. */
export const NEWS_TTL_HOURS = 48;

/** Deactivate alerts older than this after each ingest run. */
export const ALERT_TTL_HOURS = 12;

/** Warn in admin UI when last ingest is older than this. */
export const INGEST_STALE_MINUTES = 30;

export function hoursAgo(hours: number): Date {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

export function minutesAgo(minutes: number): Date {
  return new Date(Date.now() - minutes * 60 * 1000);
}

export function isPublishedWithin(isoOrDate: string | Date, maxAgeHours: number): boolean {
  const published = isoOrDate instanceof Date ? isoOrDate : new Date(isoOrDate);
  return published.getTime() >= hoursAgo(maxAgeHours).getTime();
}

/** Headlines from prisma/seed.ts — deactivated on every ingest. */
export const SEED_NEWS_HEADLINES = [
  "Bucks: Khris Middleton ruled OUT (knee)",
  "Chiefs WR limited in practice Wednesday",
  "DraftKings adjusting NBA injury prop delays",
] as const;

/** Player names from prisma/seed.ts demo alerts. */
export const SEED_ALERT_PLAYERS = [
  "Giannis Antetokounmpo",
  "Tyreek Hill",
  "Shohei Ohtani",
] as const;