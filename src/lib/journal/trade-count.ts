import type { TradeJournalEntry } from "@prisma/client";

type JournalEntrySlice = Pick<TradeJournalEntry, "entryTime" | "source">;

function startOfToday(): Date {
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  return dayStart;
}

export function countManualJournalTradesToday(
  entries: JournalEntrySlice[]
): number {
  const dayStart = startOfToday();
  return entries.filter(
    (e) => e.entryTime >= dayStart && e.source !== "tradelocker"
  ).length;
}

/** TL filled orders today + manual journal entries (avoids double-counting auto-logs). */
export function resolveTradesTodayCount(
  tlFilledToday: number,
  journalEntries: JournalEntrySlice[]
): number {
  return tlFilledToday + countManualJournalTradesToday(journalEntries);
}