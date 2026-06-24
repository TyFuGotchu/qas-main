import type {
  PanelColumn,
  TradeLockerAccount,
  TradeLockerDashboardMetrics,
  TradeLockerPosition,
} from "@/lib/tradelocker/types";

type RawAccount = {
  id?: string;
  accNum?: string | number;
  name?: string;
  currency?: string;
  status?: string;
  aaccountBalance?: number | string;
  accountBalance?: number | string;
};

export function cleanAccountsResponse(data: unknown): TradeLockerAccount[] {
  const accounts =
    (data as { accounts?: RawAccount[] })?.accounts ??
    (data as { d?: { accounts?: RawAccount[] } })?.d?.accounts ??
    [];

  if (!Array.isArray(accounts)) return [];

  const cleaned: TradeLockerAccount[] = [];

  for (const account of accounts) {
    const accountId = account.id != null ? String(account.id) : "";
    const accNum = account.accNum != null ? String(account.accNum) : "";
    if (!accountId || !accNum) continue;

    const balanceRaw =
      account.aaccountBalance ?? account.accountBalance ?? undefined;
    const balance = balanceRaw != null ? Number(balanceRaw) : undefined;

    cleaned.push({
      accountId,
      accNum,
      name: account.name,
      currency: account.currency,
      status: account.status,
      balance: Number.isFinite(balance) ? balance : undefined,
    });
  }

  return cleaned;
}

export function mapRowToObject(
  row: string[],
  columns: PanelColumn[]
): Record<string, string> {
  const mapped: Record<string, string> = {};
  columns.forEach((col, index) => {
    mapped[col.id] = row[index] ?? "";
  });
  return mapped;
}

export function parsePositions(
  rows: string[][],
  columns: PanelColumn[]
): TradeLockerPosition[] {
  return rows.map((row) => {
    const data = mapRowToObject(row, columns);
    return {
      id: data.id ?? "",
      instrumentId: data.tradableInstrumentId ?? "",
      side: data.side ?? "",
      qty: data.qty ?? "",
      avgPrice: data.avgPrice ?? "",
      openDate: data.openDate ?? "",
      unrealizedPl: data.unrealizedPl ?? "0",
    };
  });
}

export function parseAccountState(
  values: number[],
  columns: PanelColumn[]
): Record<string, number> {
  const mapped: Record<string, number> = {};
  columns.forEach((col, index) => {
    const value = values[index];
    if (typeof value === "number" && Number.isFinite(value)) {
      mapped[col.id] = value;
    }
  });
  return mapped;
}

export function computeWinRateFromHistory(
  rows: string[][],
  columns: PanelColumn[]
): { winRate: number | null; closedTrades: number } {
  const statusIdx = columns.findIndex((c) => c.id === "status");
  const sideIdx = columns.findIndex((c) => c.id === "side");
  const avgPriceIdx = columns.findIndex((c) => c.id === "avgPrice");
  const positionIdx = columns.findIndex((c) => c.id === "positionId");

  if (
    statusIdx < 0 ||
    sideIdx < 0 ||
    avgPriceIdx < 0 ||
    positionIdx < 0
  ) {
    return { winRate: null, closedTrades: 0 };
  }

  const byPosition = new Map<
    string,
    { side: string; avgPrice: number }[]
  >();

  for (const row of rows) {
    if ((row[statusIdx] ?? "").toLowerCase() !== "filled") continue;
    const positionId = row[positionIdx];
    if (!positionId) continue;

    const side = row[sideIdx] ?? "";
    const avgPrice = Number(row[avgPriceIdx]);
    if (!Number.isFinite(avgPrice)) continue;

    const list = byPosition.get(positionId) ?? [];
    list.push({ side, avgPrice });
    byPosition.set(positionId, list);
  }

  let wins = 0;
  let closed = 0;

  for (const trades of Array.from(byPosition.values())) {
    if (trades.length < 2) continue;
    const entry = trades[0];
    const exit = trades[trades.length - 1];
    if (!entry || !exit) continue;

    closed += 1;
    const entrySide = entry.side.toLowerCase();
    const profitable =
      entrySide === "buy"
        ? exit.avgPrice > entry.avgPrice
        : exit.avgPrice < entry.avgPrice;
    if (profitable) wins += 1;
  }

  if (closed === 0) return { winRate: null, closedTrades: 0 };
  return { winRate: Math.round((wins / closed) * 1000) / 10, closedTrades: closed };
}

export function buildMetrics(
  state: Record<string, number>,
  winRate: number | null,
  closedTrades: number,
  openPositionsCount: number
): TradeLockerDashboardMetrics {
  return {
    balance: state.balance ?? 0,
    openNetPnL: state.openNetPnL ?? 0,
    todayNetPnL: state.todayNet ?? 0,
    winRate,
    closedTrades,
    openPositionsCount,
  };
}