import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { canAccessBot } from "@/lib/tiers";
import {
  closePosition,
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
  parseAccountState,
  parsePositions,
} from "@/lib/tradelocker/parsers";
import { fetchCandles } from "@/lib/market-data/provider";
import {
  defaultPipValue,
  defaultStopPips,
  resolveMarketSymbol,
  runBotTick,
  type LiveBotConfig,
} from "@/lib/tradelocker/live-bot";
import type { PanelColumn } from "@/lib/tradelocker/types";
import {
  enforceRateLimit,
  rateLimitResponse,
} from "@/lib/security/rate-limit";

const BOT_TICK_LIMIT = 20;
const BOT_TICK_WINDOW_MS = 60 * 1000;

function getColumns(
  config: unknown,
  key: "accountDetailsConfig" | "positionsConfig" | "ordersHistoryConfig"
): PanelColumn[] {
  const columns =
    (config as { d?: Record<string, { columns?: PanelColumn[] }> })?.d?.[key]
      ?.columns ?? [];
  return Array.isArray(columns) ? columns : [];
}

function parseConfig(body: Record<string, unknown>): LiveBotConfig | null {
  const accountId =
    typeof body.accountId === "string" ? body.accountId.trim() : "";
  const accNum = typeof body.accNum === "string" ? body.accNum.trim() : "";
  const instrumentName =
    typeof body.instrumentName === "string" ? body.instrumentName.trim() : "";
  const tradableInstrumentId = Number(body.tradableInstrumentId);
  const routeId = Number(body.routeId);

  if (!accountId || !accNum || !instrumentName) return null;
  if (!Number.isFinite(tradableInstrumentId) || tradableInstrumentId <= 0) {
    return null;
  }
  if (!Number.isFinite(routeId) || routeId <= 0) return null;

  const marketSymbol = resolveMarketSymbol(instrumentName);
  const candleInterval =
    body.candleInterval === "15min" ? "15min" : "5min";

  return {
    accountId,
    accNum,
    tradableInstrumentId,
    routeId,
    instrumentName,
    riskPerTradePct: Math.min(
      5,
      Math.max(0.25, Number(body.riskPerTradePct) || 1)
    ),
    stopLossPips: Math.max(1, Number(body.stopLossPips) || (marketSymbol ? defaultStopPips(marketSymbol) : 20)),
    pipValuePerLot: Math.max(
      0.1,
      Number(body.pipValuePerLot) || (marketSymbol ? defaultPipValue(marketSymbol) : 10)
    ),
    dailyLossLimitPct: Math.min(
      20,
      Math.max(1, Number(body.dailyLossLimitPct) || 5)
    ),
    maxDrawdownPct: Math.min(
      30,
      Math.max(2, Number(body.maxDrawdownPct) || 10)
    ),
    maxOpenPositions: Math.min(
      10,
      Math.max(1, Number(body.maxOpenPositions) || 3)
    ),
    maxTradesPerSession: Math.min(
      50,
      Math.max(1, Number(body.maxTradesPerSession) || 10)
    ),
    tradesThisSession: Math.max(0, Number(body.tradesThisSession) || 0),
    candleInterval,
    strategy: "pulse-ema",
  };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canAccessBot(session.subscriptionTier)) {
      return NextResponse.json(
        { error: "Premium required for live trading bot" },
        { status: 403 }
      );
    }

    const rateLimit = enforceRateLimit(
      request,
      "tradelocker-bot-tick",
      BOT_TICK_LIMIT,
      BOT_TICK_WINDOW_MS
    );
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.retryAfterSeconds ?? 60);
    }

    const body = await request.json().catch(() => ({}));
    const config = parseConfig(body as Record<string, unknown>);
    const execute = Boolean(body.execute);

    if (!config) {
      return NextResponse.json(
        { error: "Invalid bot configuration" },
        { status: 400 }
      );
    }

    const [tradeConfig, stateRaw, positionsRaw, historyRaw] = await Promise.all([
      fetchTradeConfig(config.accNum),
      fetchAccountState(config.accountId, config.accNum),
      fetchOpenPositions(config.accountId, config.accNum),
      fetchOrdersHistory(config.accountId, config.accNum),
    ]);

    const accountColumns = getColumns(tradeConfig, "accountDetailsConfig");
    const positionColumns = getColumns(tradeConfig, "positionsConfig");
    const historyColumns = getColumns(tradeConfig, "ordersHistoryConfig");

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

    const marketSymbol = resolveMarketSymbol(config.instrumentName);
    let candles = null;
    if (marketSymbol) {
      candles = await fetchCandles(
        marketSymbol,
        60,
        config.candleInterval
      );
    }

    const tick = runBotTick(config, metrics, positions, candles);

    if (!execute || tick.action === "none" || tick.action === "halt") {
      return NextResponse.json({
        ...tick,
        executed: false,
        balance: metrics.balance,
      });
    }

    let executed = false;
    let executionError: string | null = null;
    let tradesThisSession = config.tradesThisSession;

    try {
      if (tick.action === "buy" || tick.action === "sell") {
        await placeOrder(config.accountId, config.accNum, {
          side: tick.action,
          qty: tick.suggestedLots,
          routeId: config.routeId,
          tradableInstrumentId: config.tradableInstrumentId,
        });
        executed = true;
        tradesThisSession += 1;
      } else if (tick.action === "close") {
        const existing = positions.find(
          (p) =>
            String(p.instrumentId) === String(config.tradableInstrumentId)
        );
        if (existing?.id) {
          await closePosition(existing.id, config.accNum, 0);
          executed = true;
          tradesThisSession += 1;
        }
      }
    } catch (error) {
      executionError =
        error instanceof TradeLockerApiError
          ? error.message
          : "Order execution failed";
    }

    return NextResponse.json({
      ...tick,
      executed,
      executionError,
      tradesThisSession,
      balance: metrics.balance,
    });
  } catch (error) {
    if (error instanceof TradeLockerApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("[tradelocker/bot/tick]", error);
    return NextResponse.json(
      { error: "Bot tick failed" },
      { status: 500 }
    );
  }
}