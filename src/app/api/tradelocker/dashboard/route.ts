import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { normalizeTraderTimezone } from "@/lib/journal/timezone";
import { prisma } from "@/lib/prisma";
import {
  fetchAccountState,
  fetchOpenPositions,
  fetchOrdersHistory,
  fetchTradeConfig,
  TradeLockerApiError,
} from "@/lib/tradelocker/client";
import {
  buildMetrics,
  computeWinRateFromHistory,
  countTradeEntriesTodayFromHistory,
  parseAccountState,
  parsePositions,
} from "@/lib/tradelocker/parsers";
import type { PanelColumn } from "@/lib/tradelocker/types";

function getColumns(
  config: unknown,
  key: "accountDetailsConfig" | "positionsConfig" | "ordersHistoryConfig"
): PanelColumn[] {
  const columns =
    (config as { d?: Record<string, { columns?: PanelColumn[] }> })?.d?.[key]
      ?.columns ?? [];
  return Array.isArray(columns) ? columns : [];
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accountId = request.nextUrl.searchParams.get("accountId");
    const accNum = request.nextUrl.searchParams.get("accNum");

    if (!accountId || !accNum) {
      return NextResponse.json(
        { error: "accountId and accNum are required" },
        { status: 400 }
      );
    }

    const [configRaw, stateRaw, positionsRaw, historyRaw] = await Promise.all([
      fetchTradeConfig(accNum),
      fetchAccountState(accountId, accNum),
      fetchOpenPositions(accountId, accNum),
      fetchOrdersHistory(accountId, accNum),
    ]);

    const accountColumns = getColumns(configRaw, "accountDetailsConfig");
    const positionColumns = getColumns(configRaw, "positionsConfig");
    const historyColumns = getColumns(configRaw, "ordersHistoryConfig");

    const stateValues =
      (stateRaw as { d?: { accountDetailsData?: number[] } })?.d
        ?.accountDetailsData ?? [];
    const state = parseAccountState(stateValues, accountColumns);

    const positionRows =
      (positionsRaw as { d?: { positions?: string[][] } })?.d?.positions ?? [];
    const positions = parsePositions(positionRows, positionColumns);

    const historyRows =
      (historyRaw as { d?: { ordersHistory?: string[][] } })?.d
        ?.ordersHistory ?? [];
    const { winRate, closedTrades } = computeWinRateFromHistory(
      historyRows,
      historyColumns
    );

    const metrics = buildMetrics(
      state,
      winRate,
      closedTrades,
      positions.length
    );

    const profile = await prisma.traderProfile.findUnique({
      where: { userId: session.id },
      select: { timezone: true },
    });
    const timezone = normalizeTraderTimezone(
      request.nextUrl.searchParams.get("timezone") ??
        profile?.timezone ??
        undefined
    );

    const tradesToday = countTradeEntriesTodayFromHistory(
      historyRows,
      historyColumns,
      timezone
    );

    return NextResponse.json({ metrics, positions, tradesToday });
  } catch (error) {
    if (error instanceof TradeLockerApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("[tradelocker/dashboard]", error);
    return NextResponse.json(
      { error: "Failed to load TradeLocker dashboard data" },
      { status: 500 }
    );
  }
}