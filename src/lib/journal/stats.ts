import type { TradeJournalEntry } from "@prisma/client";
import type { AlphaDurabilityInput } from "@/lib/quicksilver/alpha-durability";
import {
  resolveEntrySession,
  TRADING_SESSIONS,
  type TradingSessionId,
} from "@/lib/journal/trading-session";

export interface JournalStats {
  totalTrades: number;
  closedTrades: number;
  winRate: number;
  avgWinR: number;
  avgLossR: number;
  recentWinRate: number;
  monthsActive: number;
  totalPnl: number;
  avgR: number;
}

export interface SessionStatRow {
  session: TradingSessionId;
  label: string;
  trades: number;
  closed: number;
  winRate: number;
  totalPnl: number;
  avgR: number | null;
}

export interface SessionStatsResult {
  rows: SessionStatRow[];
  bestSession: TradingSessionId | null;
  insight: string;
}

function isWin(entry: TradeJournalEntry): boolean {
  if (entry.rMultiple != null) return entry.rMultiple > 0;
  return (entry.pnl ?? 0) > 0;
}

export function computeSessionStats(
  entries: TradeJournalEntry[]
): SessionStatsResult {
  const buckets = new Map<
    TradingSessionId,
    { trades: number; closed: TradeJournalEntry[] }
  >();

  for (const session of TRADING_SESSIONS) {
    buckets.set(session.id, { trades: 0, closed: [] });
  }

  for (const entry of entries) {
    const sessionId = resolveEntrySession(entry);
    const bucket = buckets.get(sessionId)!;
    bucket.trades += 1;
    if (entry.exitTime != null && (entry.pnl != null || entry.rMultiple != null)) {
      bucket.closed.push(entry);
    }
  }

  const rows: SessionStatRow[] = TRADING_SESSIONS.map((session) => {
    const bucket = buckets.get(session.id)!;
    const closed = bucket.closed;
    const wins = closed.filter(isWin);
    const winRate =
      closed.length > 0 ? (wins.length / closed.length) * 100 : 0;
    const totalPnl = closed.reduce((s, e) => s + (e.pnl ?? 0), 0);
    const rValues = closed
      .map((e) => e.rMultiple)
      .filter((r): r is number => r != null);
    const avgR =
      rValues.length > 0
        ? Math.round(
            (rValues.reduce((s, r) => s + r, 0) / rValues.length) * 100
          ) / 100
        : null;

    return {
      session: session.id,
      label: session.label,
      trades: bucket.trades,
      closed: closed.length,
      winRate: Math.round(winRate * 10) / 10,
      totalPnl: Math.round(totalPnl * 100) / 100,
      avgR,
    };
  }).filter((row) => row.trades > 0);

  const qualified = rows.filter((r) => r.closed >= 3);
  const best =
    qualified.length > 0
      ? qualified.reduce((a, b) => (b.winRate > a.winRate ? b : a))
      : null;

  let insight = "Log more closed trades to unlock session-level edge analysis.";
  if (best) {
    insight = `Strongest edge in ${best.label} (${best.winRate}% win rate over ${best.closed} closed trades).`;
  } else if (rows.length > 0) {
    insight =
      "Need at least 3 closed trades per session for a reliable edge read.";
  }

  return {
    rows,
    bestSession: best?.session ?? null,
    insight,
  };
}

function monthsBetween(earliest: Date, latest: Date): number {
  const ms = latest.getTime() - earliest.getTime();
  return Math.max(1, ms / (1000 * 60 * 60 * 24 * 30));
}

export function computeJournalStats(
  entries: TradeJournalEntry[]
): JournalStats {
  if (entries.length === 0) {
    return {
      totalTrades: 0,
      closedTrades: 0,
      winRate: 0,
      avgWinR: 0,
      avgLossR: 1,
      recentWinRate: 0,
      monthsActive: 1,
      totalPnl: 0,
      avgR: 0,
    };
  }

  const sorted = [...entries].sort(
    (a, b) => a.entryTime.getTime() - b.entryTime.getTime()
  );
  const earliest = sorted[0]!.entryTime;
  const latest = sorted[sorted.length - 1]!.entryTime;
  const monthsActive = monthsBetween(earliest, latest);

  const closed = entries.filter(
    (e) => e.exitTime != null && (e.pnl != null || e.rMultiple != null)
  );

  const wins = closed.filter((e) => {
    if (e.rMultiple != null) return e.rMultiple > 0;
    return (e.pnl ?? 0) > 0;
  });
  const losses = closed.filter((e) => {
    if (e.rMultiple != null) return e.rMultiple <= 0;
    return (e.pnl ?? 0) <= 0;
  });

  const winRate =
    closed.length > 0 ? (wins.length / closed.length) * 100 : 0;

  const winRs = wins
    .map((e) => e.rMultiple ?? (e.pnl != null && e.pnl > 0 ? 1 : 0))
    .filter((r) => r > 0);
  const lossRs = losses
    .map((e) =>
      e.rMultiple != null
        ? Math.abs(Math.min(e.rMultiple, 0)) || Math.abs(e.rMultiple)
        : 1
    )
    .filter((r) => r > 0);

  const avgWinR =
    winRs.length > 0
      ? winRs.reduce((s, r) => s + r, 0) / winRs.length
      : 1.5;
  const avgLossR =
    lossRs.length > 0
      ? lossRs.reduce((s, r) => s + r, 0) / lossRs.length
      : 1;

  const recentSlice = closed.slice(-Math.min(30, closed.length));
  const recentWins = recentSlice.filter((e) => {
    if (e.rMultiple != null) return e.rMultiple > 0;
    return (e.pnl ?? 0) > 0;
  });
  const recentWinRate =
    recentSlice.length > 0
      ? (recentWins.length / recentSlice.length) * 100
      : winRate;

  const rValues = closed
    .map((e) => e.rMultiple)
    .filter((r): r is number => r != null);
  const avgR =
    rValues.length > 0
      ? rValues.reduce((s, r) => s + r, 0) / rValues.length
      : 0;

  const totalPnl = closed.reduce((s, e) => s + (e.pnl ?? 0), 0);

  return {
    totalTrades: entries.length,
    closedTrades: closed.length,
    winRate: Math.round(winRate * 10) / 10,
    avgWinR: Math.round(avgWinR * 100) / 100,
    avgLossR: Math.round(avgLossR * 100) / 100,
    recentWinRate: Math.round(recentWinRate * 10) / 10,
    monthsActive: Math.round(monthsActive * 10) / 10,
    totalPnl: Math.round(totalPnl * 100) / 100,
    avgR: Math.round(avgR * 100) / 100,
  };
}

export function journalStatsToAlphaInput(
  stats: JournalStats
): AlphaDurabilityInput {
  return {
    totalTrades: stats.closedTrades,
    winRate: stats.winRate,
    avgWinR: stats.avgWinR,
    avgLossR: stats.avgLossR,
    monthsActive: stats.monthsActive,
    recentWinRate: stats.recentWinRate,
  };
}

export function countTradesToday(entries: TradeJournalEntry[]): number {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return entries.filter((e) => e.entryTime >= start).length;
}