import type { TradeJournalEntry } from "@prisma/client";
import {
  isSameTraderCalendarDay,
  normalizeTraderTimezone,
} from "@/lib/journal/timezone";

type JournalEntrySlice = Pick<TradeJournalEntry, "entryTime" | "source">;

function toEntryDate(value: Date | string): Date | null {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Journal entries opened today (all sources — includes TL auto-logs). */
export function countJournalEntriesToday(
  entries: JournalEntrySlice[],
  timezone?: string,
  reference = new Date()
): number {
  const tz = normalizeTraderTimezone(timezone);
  let count = 0;

  for (const entry of entries) {
    const entryTime = toEntryDate(entry.entryTime);
    if (!entryTime) continue;
    if (isSameTraderCalendarDay(entryTime, tz, reference)) {
      count += 1;
    }
  }

  return count;
}

/**
 * Trades taken today for daily limit checks.
 * Journal entries are authoritative (1 entry = 1 trade opened).
 * Falls back to TL entry count when journal has no rows today.
 */
export function resolveTradesTodayCount(
  tlEntriesToday: number,
  journalEntries: JournalEntrySlice[],
  timezone?: string,
  reference = new Date()
): number {
  const fromJournal = countJournalEntriesToday(
    journalEntries,
    timezone,
    reference
  );
  if (fromJournal > 0) return fromJournal;
  return Math.max(0, tlEntriesToday);
}