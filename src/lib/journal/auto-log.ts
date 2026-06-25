import { prisma } from "@/lib/prisma";

export interface AutoLogOrderInput {
  userId: string;
  symbol: string;
  side: "buy" | "sell";
  qty: number;
  instrumentName?: string;
}

export async function autoLogTradeLockerOrder(
  input: AutoLogOrderInput
): Promise<void> {
  const symbol = input.instrumentName?.trim() || input.symbol.trim();
  if (!symbol) return;

  const entryTime = new Date();
  const windowStart = new Date(entryTime.getTime() - 2 * 60 * 1000);

  const existing = await prisma.tradeJournalEntry.findFirst({
    where: {
      userId: input.userId,
      symbol,
      direction: input.side === "buy" ? "long" : "short",
      source: "tradelocker",
      entryTime: { gte: windowStart },
    },
  });

  if (existing) return;

  await prisma.tradeJournalEntry.create({
    data: {
      userId: input.userId,
      symbol,
      direction: input.side === "buy" ? "long" : "short",
      entryTime,
      source: "tradelocker",
      setupType: "live-terminal",
      notes: `Auto-logged · ${input.qty} lots`,
    },
  });
}