import { prisma } from "@/lib/prisma";
import { resolveTradingSession } from "@/lib/journal/trading-session";

export interface AutoLogOrderInput {
  userId: string;
  symbol: string;
  side: "buy" | "sell";
  qty: number;
  instrumentName?: string;
}

export interface AutoLogCloseInput {
  userId: string;
  symbol: string;
  side: string;
  unrealizedPl: number;
  qty?: string;
  balance?: number;
  riskPerTradePct?: number;
}

function sideToDirection(side: string): "long" | "short" {
  const normalized = side.toLowerCase();
  return normalized === "sell" || normalized === "short" ? "short" : "long";
}

export function computeRMultiple(
  pnl: number,
  balance: number,
  riskPerTradePct: number
): number | null {
  if (!Number.isFinite(pnl) || balance <= 0 || riskPerTradePct <= 0) {
    return null;
  }
  const riskDollars = balance * (riskPerTradePct / 100);
  if (riskDollars <= 0) return null;
  return Math.round((pnl / riskDollars) * 100) / 100;
}

export async function autoLogTradeLockerOrder(
  input: AutoLogOrderInput
): Promise<void> {
  const symbol = input.instrumentName?.trim() || input.symbol.trim();
  if (!symbol) return;

  const entryTime = new Date();
  const sessionTag = resolveTradingSession(entryTime);
  const windowStart = new Date(entryTime.getTime() - 2 * 60 * 1000);

  const existing = await prisma.tradeJournalEntry.findFirst({
    where: {
      userId: input.userId,
      symbol,
      direction: input.side === "buy" ? "long" : "short",
      source: "tradelocker",
      entryTime: { gte: windowStart },
      exitTime: null,
    },
  });

  if (existing) return;

  await prisma.tradeJournalEntry.create({
    data: {
      userId: input.userId,
      symbol,
      direction: input.side === "buy" ? "long" : "short",
      entryTime,
      session: sessionTag,
      source: "tradelocker",
      setupType: "live-terminal",
      notes: `Auto-logged · ${input.qty} lots`,
    },
  });
}

export async function autoLogTradeLockerClose(
  input: AutoLogCloseInput
): Promise<void> {
  const symbol = input.symbol.trim();
  if (!symbol) return;

  const direction = sideToDirection(input.side);
  const exitTime = new Date();
  const exitSession = resolveTradingSession(exitTime);
  const pnl = Number.isFinite(input.unrealizedPl) ? input.unrealizedPl : 0;

  const profile =
    input.riskPerTradePct != null
      ? { riskPerTradePct: input.riskPerTradePct }
      : await prisma.traderProfile.findUnique({
          where: { userId: input.userId },
          select: { riskPerTradePct: true },
        });

  const riskPct = profile?.riskPerTradePct ?? 1;
  const balance = input.balance ?? 0;
  const rMultiple =
    balance > 0 ? computeRMultiple(pnl, balance, riskPct) : null;

  const openEntry = await prisma.tradeJournalEntry.findFirst({
    where: {
      userId: input.userId,
      symbol,
      direction,
      source: "tradelocker",
      exitTime: null,
    },
    orderBy: { entryTime: "desc" },
  });

  if (openEntry) {
    await prisma.tradeJournalEntry.update({
      where: { id: openEntry.id },
      data: {
        exitTime,
        pnl,
        rMultiple,
        notes: `${openEntry.notes ?? "Auto-logged"} · Closed${input.qty ? ` · ${input.qty} lots` : ""}`,
      },
    });
    return;
  }

  await prisma.tradeJournalEntry.create({
    data: {
      userId: input.userId,
      symbol,
      direction,
      entryTime: new Date(exitTime.getTime() - 60_000),
      exitTime,
      pnl,
      rMultiple,
      session: exitSession,
      source: "tradelocker",
      setupType: "live-terminal",
      notes: `Auto-logged close${input.qty ? ` · ${input.qty} lots` : ""}`,
    },
  });
}