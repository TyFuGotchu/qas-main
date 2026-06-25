import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  fetchAccountState,
  fetchOpenPositions,
  fetchOrdersHistory,
  fetchTradeConfig,
  placeOrder,
  TradeLockerApiError,
} from "@/lib/tradelocker/client";
import {
  buildMetrics,
  computeWinRateFromHistory,
  countFilledOrdersToday,
  parseAccountState,
  parsePositions,
} from "@/lib/tradelocker/parsers";
import type { PanelColumn } from "@/lib/tradelocker/types";
import { autoLogTradeLockerOrder } from "@/lib/journal/auto-log";
import { resolveTradesTodayCount } from "@/lib/journal/trade-count";
import { evaluatePreTradeGate } from "@/lib/pre-trade-gate";
import { getOrCreateTraderProfileView } from "@/lib/trader-profile-db";
import {
  enforceRateLimit,
  rateLimitResponse,
} from "@/lib/security/rate-limit";

function getColumns(
  config: unknown,
  key: "accountDetailsConfig" | "positionsConfig" | "ordersHistoryConfig"
): PanelColumn[] {
  const columns =
    (config as { d?: Record<string, { columns?: PanelColumn[] }> })?.d?.[key]
      ?.columns ?? [];
  return Array.isArray(columns) ? columns : [];
}

const ORDER_LIMIT = 30;
const ORDER_WINDOW_MS = 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = enforceRateLimit(
      request,
      "tradelocker-orders",
      ORDER_LIMIT,
      ORDER_WINDOW_MS
    );
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.retryAfterSeconds ?? 60);
    }

    const body = await request.json();
    const accountId =
      typeof body.accountId === "string" ? body.accountId.trim() : "";
    const accNum = typeof body.accNum === "string" ? body.accNum.trim() : "";
    const side = body.side === "buy" || body.side === "sell" ? body.side : null;
    const qty = Number(body.qty);
    const tradableInstrumentId = Number(body.tradableInstrumentId);
    const routeId = Number(body.routeId);

    if (!accountId || !accNum) {
      return NextResponse.json(
        { error: "accountId and accNum are required" },
        { status: 400 }
      );
    }

    if (!side) {
      return NextResponse.json(
        { error: "side must be buy or sell" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(qty) || qty <= 0) {
      return NextResponse.json(
        { error: "qty must be a positive number" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(tradableInstrumentId) || tradableInstrumentId <= 0) {
      return NextResponse.json(
        { error: "tradableInstrumentId is required" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(routeId) || routeId <= 0) {
      return NextResponse.json(
        { error: "routeId is required" },
        { status: 400 }
      );
    }

    const gateAcknowledged = Boolean(body.gateAcknowledged);
    const instrumentName =
      typeof body.instrumentName === "string"
        ? body.instrumentName.trim()
        : "";
    const profile = await getOrCreateTraderProfileView(session.id);

    if (profile.profileComplete) {
      let metrics = null;
      let tlFilledToday = 0;

      try {
        const [configRaw, stateRaw, positionsRaw, historyRaw] =
          await Promise.all([
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
          (positionsRaw as { d?: { positions?: string[][] } })?.d?.positions ??
          [];
        const positions = parsePositions(positionRows, positionColumns);

        const historyRows =
          (historyRaw as { d?: { ordersHistory?: string[][] } })?.d
            ?.ordersHistory ?? [];
        const { winRate, closedTrades } = computeWinRateFromHistory(
          historyRows,
          historyColumns
        );

        metrics = buildMetrics(
          state,
          winRate,
          closedTrades,
          positions.length
        );

        tlFilledToday = countFilledOrdersToday(historyRows, historyColumns);
      } catch {
        // proceed with null metrics if TL fetch fails
      }

      const dayStart = new Date();
      dayStart.setHours(0, 0, 0, 0);
      const journalToday = await prisma.tradeJournalEntry.findMany({
        where: { userId: session.id, entryTime: { gte: dayStart } },
        select: { entryTime: true, source: true },
      });
      const tradesToday = resolveTradesTodayCount(
        tlFilledToday,
        journalToday
      );

      const gate = evaluatePreTradeGate(metrics, profile, {
        tradesToday,
        gateAcknowledged,
      });

      if (!gate.allowed) {
        return NextResponse.json(
          {
            error: gate.summary,
            gate: {
              violations: gate.violations,
              requiresAcknowledgment: gate.requiresAcknowledgment,
            },
          },
          { status: 403 }
        );
      }
    }

    const result = await placeOrder(accountId, accNum, {
      side,
      qty,
      routeId,
      tradableInstrumentId,
    });

    try {
      await autoLogTradeLockerOrder({
        userId: session.id,
        symbol: instrumentName || String(tradableInstrumentId),
        side,
        qty,
        instrumentName: instrumentName || undefined,
      });
    } catch (autoLogError) {
      console.error("[tradelocker/orders] auto-log failed:", autoLogError);
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    if (error instanceof TradeLockerApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("[tradelocker/orders]", error);
    return NextResponse.json(
      { error: "Failed to place TradeLocker order" },
      { status: 500 }
    );
  }
}