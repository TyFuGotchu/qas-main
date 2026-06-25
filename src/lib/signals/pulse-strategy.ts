import type { Candle } from "@/lib/market-data/types";
import type { MarketSymbol } from "@/lib/market-data/types";
import { defaultStopPips } from "@/lib/signals/market-symbols";
import type { LiveTradeSignal, SignalDirection } from "@/lib/signals/types";

export interface PulseCrossover {
  isCrossover: boolean;
  direction: SignalDirection | null;
  fastEma: number;
  slowEma: number;
  reason: string;
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

function pipSize(symbol: MarketSymbol): number {
  switch (symbol) {
    case "XAUUSD":
    case "XAGUSD":
      return 0.1;
    case "BTCUSD":
      return 1;
    case "NAS100":
    case "US30":
      return 0.25;
    default:
      return 0.0001;
  }
}

export function evaluatePulseCrossover(candles: Candle[]): PulseCrossover {
  if (candles.length < 25) {
    return {
      isCrossover: false,
      direction: null,
      fastEma: 0,
      slowEma: 0,
      reason: "Insufficient candle history",
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
      isCrossover: true,
      direction: "BUY",
      fastEma: fast,
      slowEma: slow,
      reason: "Bullish EMA 9/21 crossover — momentum pulse long",
    };
  }

  if (fast < slow && prevFast >= prevSlow) {
    return {
      isCrossover: true,
      direction: "SELL",
      fastEma: fast,
      slowEma: slow,
      reason: "Bearish EMA 9/21 crossover — momentum pulse short",
    };
  }

  return {
    isCrossover: false,
    direction: fast > slow ? "BUY" : "SELL",
    fastEma: fast,
    slowEma: slow,
    reason: fast > slow ? "Trend bias long" : "Trend bias short",
  };
}

export function buildSignalPayload(
  asset: MarketSymbol,
  crossover: PulseCrossover,
  candles: Candle[]
): LiveTradeSignal | null {
  if (!crossover.isCrossover || !crossover.direction) return null;

  const last = candles[candles.length - 1];
  if (!last) return null;

  const entryPrice = Number(last.close.toFixed(asset === "BTCUSD" ? 2 : 4));
  const stopPips = defaultStopPips(asset);
  const pip = pipSize(asset);
  const riskDistance = stopPips * pip;

  const stopLoss =
    crossover.direction === "BUY"
      ? Number((entryPrice - riskDistance).toFixed(asset === "BTCUSD" ? 2 : 4))
      : Number((entryPrice + riskDistance).toFixed(asset === "BTCUSD" ? 2 : 4));

  const takeProfit =
    crossover.direction === "BUY"
      ? Number((entryPrice + riskDistance * 2).toFixed(asset === "BTCUSD" ? 2 : 4))
      : Number((entryPrice - riskDistance * 2).toFixed(asset === "BTCUSD" ? 2 : 4));

  return {
    id: `qs-${asset}-${Date.now()}`,
    timestamp: new Date().toISOString(),
    asset,
    direction: crossover.direction,
    entryPrice,
    stopLoss,
    takeProfit,
    status: "active",
    strategy: "pulse-ema-9-21",
    reason: crossover.reason,
  };
}