import { MARKET_SYMBOLS, SYMBOL_LABELS } from "@/lib/market-data/symbols";
import type { MarketSymbol } from "@/lib/market-data/types";
import type { Candle } from "@/lib/market-data/types";
import { computePositionSize, computeRiskGuard } from "@/lib/tradelocker/account-tools";
import type {
  TradeLockerDashboardMetrics,
  TradeLockerPosition,
} from "@/lib/tradelocker/types";

export type BotAction = "none" | "buy" | "sell" | "close" | "halt";

export type BotStrategy = "pulse-ema";

export interface LiveBotConfig {
  accountId: string;
  accNum: string;
  tradableInstrumentId: number;
  routeId: number;
  instrumentName: string;
  riskPerTradePct: number;
  stopLossPips: number;
  pipValuePerLot: number;
  dailyLossLimitPct: number;
  maxDrawdownPct: number;
  maxOpenPositions: number;
  maxTradesPerSession: number;
  tradesThisSession: number;
  candleInterval: "5min" | "15min";
  strategy: BotStrategy;
}

export interface BotSignal {
  direction: "long" | "short" | "flat";
  fastEma: number;
  slowEma: number;
  reason: string;
}

export interface BotTickResult {
  action: BotAction;
  message: string;
  signal: BotSignal | null;
  suggestedLots: number;
  marketSymbol: MarketSymbol | null;
  riskHalted: boolean;
  tradesThisSession: number;
}

export function resolveMarketSymbol(instrumentName: string): MarketSymbol | null {
  const normalized = instrumentName.toUpperCase().replace(/[^A-Z0-9]/g, "");

  for (const symbol of MARKET_SYMBOLS) {
    if (normalized.includes(symbol)) return symbol;
  }

  if (normalized.includes("GOLD") || normalized.includes("XAU")) return "XAUUSD";
  if (normalized.includes("SILVER") || normalized.includes("XAG")) return "XAGUSD";
  if (
    normalized.includes("NAS") ||
    normalized.includes("US100") ||
    normalized.includes("NDX") ||
    normalized.includes("QQQ")
  ) {
    return "NAS100";
  }
  if (normalized.includes("DOW") || normalized.includes("US30")) return "US30";
  if (normalized.includes("BTC")) return "BTCUSD";

  return null;
}

export function defaultPipValue(symbol: MarketSymbol): number {
  switch (symbol) {
    case "XAUUSD":
      return 10;
    case "XAGUSD":
      return 5;
    case "BTCUSD":
      return 1;
    case "NAS100":
    case "US30":
      return 1;
    default:
      return 10;
  }
}

export function defaultStopPips(symbol: MarketSymbol): number {
  switch (symbol) {
    case "XAUUSD":
      return 20;
    case "XAGUSD":
      return 25;
    case "BTCUSD":
      return 50;
    case "NAS100":
    case "US30":
      return 15;
    default:
      return 20;
  }
}

function ema(values: number[], period: number): number[] {
  if (values.length === 0) return [];
  const k = 2 / (period + 1);
  const result: number[] = [];
  let prev = values[0] ?? 0;
  result.push(prev);

  for (let i = 1; i < values.length; i++) {
    const v = values[i] ?? prev;
    prev = v * k + prev * (1 - k);
    result.push(prev);
  }
  return result;
}

export function evaluatePulseSignal(candles: Candle[]): BotSignal {
  if (candles.length < 25) {
    return {
      direction: "flat",
      fastEma: 0,
      slowEma: 0,
      reason: "Insufficient candle history for signal",
    };
  }

  const closes = candles.map((c) => c.close);
  const fastSeries = ema(closes, 9);
  const slowSeries = ema(closes, 21);
  const fast = fastSeries[fastSeries.length - 1] ?? 0;
  const slow = slowSeries[slowSeries.length - 1] ?? 0;
  const prevFast = fastSeries[fastSeries.length - 2] ?? fast;
  const prevSlow = slowSeries[slowSeries.length - 2] ?? slow;

  if (fast > slow && prevFast <= prevSlow) {
    return {
      direction: "long",
      fastEma: fast,
      slowEma: slow,
      reason: "Bullish EMA crossover (9/21) — momentum pulse long",
    };
  }

  if (fast < slow && prevFast >= prevSlow) {
    return {
      direction: "short",
      fastEma: fast,
      slowEma: slow,
      reason: "Bearish EMA crossover (9/21) — momentum pulse short",
    };
  }

  if (fast > slow) {
    return {
      direction: "long",
      fastEma: fast,
      slowEma: slow,
      reason: "Trend bias long — holding above slow EMA",
    };
  }

  if (fast < slow) {
    return {
      direction: "short",
      fastEma: fast,
      slowEma: slow,
      reason: "Trend bias short — holding below slow EMA",
    };
  }

  return {
    direction: "flat",
    fastEma: fast,
    slowEma: slow,
    reason: "No clear edge — EMAs flat",
  };
}

function findPositionForInstrument(
  positions: TradeLockerPosition[],
  tradableInstrumentId: number
): TradeLockerPosition | undefined {
  return positions.find(
    (p) => String(p.instrumentId) === String(tradableInstrumentId)
  );
}

export function runBotTick(
  config: LiveBotConfig,
  metrics: TradeLockerDashboardMetrics,
  positions: TradeLockerPosition[],
  candles: Candle[] | null
): BotTickResult {
  const marketSymbol = resolveMarketSymbol(config.instrumentName);
  const base: Omit<BotTickResult, "action" | "message" | "signal"> = {
    suggestedLots: 0,
    marketSymbol,
    riskHalted: false,
    tradesThisSession: config.tradesThisSession,
  };

  const risk = computeRiskGuard(metrics, {
    dailyLossLimitPct: config.dailyLossLimitPct,
    maxDrawdownPct: config.maxDrawdownPct,
  });

  if (risk.status === "halt") {
    return {
      ...base,
      action: "halt",
      message: risk.message,
      signal: null,
      riskHalted: true,
    };
  }

  if (config.tradesThisSession >= config.maxTradesPerSession) {
    return {
      ...base,
      action: "none",
      message: "Session trade cap reached — bot paused until you reset or restart.",
      signal: null,
    };
  }

  if (!candles || candles.length < 25) {
    const label = marketSymbol ? SYMBOL_LABELS[marketSymbol] : config.instrumentName;
    return {
      ...base,
      action: "none",
      message: `Waiting for market data on ${label}…`,
      signal: null,
    };
  }

  const signal = evaluatePulseSignal(candles);
  const sizing = computePositionSize(metrics.balance, positions, {
    riskPerTradePct: config.riskPerTradePct,
    stopLossPips: config.stopLossPips,
    pipValuePerLot: config.pipValuePerLot,
  });

  const existing = findPositionForInstrument(
    positions,
    config.tradableInstrumentId
  );
  const side = existing?.side.toLowerCase() ?? "";
  const isLong = side === "buy" || side === "long";
  const isShort = side === "sell" || side === "short";

  if (existing && signal.direction === "short" && isLong) {
    return {
      ...base,
      action: "close",
      message: "Exit long — bearish pulse signal",
      signal,
      suggestedLots: Number(existing.qty) || sizing.suggestedLots,
    };
  }

  if (existing && signal.direction === "long" && isShort) {
    return {
      ...base,
      action: "close",
      message: "Exit short — bullish pulse signal",
      signal,
      suggestedLots: Number(existing.qty) || sizing.suggestedLots,
    };
  }

  if (
    !existing &&
    metrics.openPositionsCount >= config.maxOpenPositions
  ) {
    return {
      ...base,
      action: "none",
      message: `Max open positions (${config.maxOpenPositions}) — skip new entry`,
      signal,
      suggestedLots: sizing.suggestedLots,
    };
  }

  if (
    !existing &&
    signal.direction === "long" &&
    signal.reason.includes("crossover")
  ) {
    const lots = Math.max(0.01, sizing.suggestedLots);
    return {
      ...base,
      action: "buy",
      message: `Enter long ${lots} lots — ${signal.reason}. Risk $${sizing.riskDollars.toFixed(2)} (${config.riskPerTradePct}% of $${metrics.balance.toFixed(2)})`,
      signal,
      suggestedLots: lots,
      tradesThisSession: config.tradesThisSession,
    };
  }

  if (
    !existing &&
    signal.direction === "short" &&
    signal.reason.includes("crossover")
  ) {
    const lots = Math.max(0.01, sizing.suggestedLots);
    return {
      ...base,
      action: "sell",
      message: `Enter short ${lots} lots — ${signal.reason}. Risk $${sizing.riskDollars.toFixed(2)} (${config.riskPerTradePct}% of $${metrics.balance.toFixed(2)})`,
      signal,
      suggestedLots: lots,
      tradesThisSession: config.tradesThisSession,
    };
  }

  return {
    ...base,
    action: "none",
    message: existing
      ? `Managing ${existing.side} — ${signal.reason}`
      : signal.reason,
    signal,
    suggestedLots: sizing.suggestedLots,
  };
}