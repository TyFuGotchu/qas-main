import type { Candle } from "@/lib/market-data/types";
import type { MarketSymbol } from "@/lib/market-data/types";
import type {
  LiveTradeSignal,
  MarketBias,
  SetupStatus,
  SignalDirection,
  TrendBias,
} from "@/lib/signals/types";

export interface ConfluenceAnalysis {
  score: number;
  bias: MarketBias;
  trend: TrendBias;
  setupStatus: SetupStatus;
  direction: SignalDirection | null;
  isTriggered: boolean;
  price: number;
  changePercent: number;
  ema21: number;
  ema55: number;
  rsi: number;
  atr: number;
  support: number;
  resistance: number;
  reasons: string[];
  triggerReason: string | null;
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

function computeRsi(closes: number[], period = 14): number {
  if (closes.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = (closes[i] ?? 0) - (closes[i - 1] ?? 0);
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function computeAtr(candles: Candle[], period = 14): number {
  if (candles.length < period + 1) return 0;
  const trs: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    const cur = candles[i]!;
    const prev = candles[i - 1]!;
    const tr = Math.max(
      cur.high - cur.low,
      Math.abs(cur.high - prev.close),
      Math.abs(cur.low - prev.close)
    );
    trs.push(tr);
  }
  const slice = trs.slice(-period);
  return slice.reduce((s, v) => s + v, 0) / slice.length;
}

function roundPrice(value: number, asset: MarketSymbol): number {
  const digits = asset === "BTCUSD" ? 2 : 4;
  return Number(value.toFixed(digits));
}

function swingLevels(candles: Candle[]): { support: number; resistance: number } {
  const recent = candles.slice(-20);
  const lows = recent.map((c) => c.low);
  const highs = recent.map((c) => c.high);
  return {
    support: Math.min(...lows),
    resistance: Math.max(...highs),
  };
}

function structureBias(candles: Candle[]): { bullish: boolean; bearish: boolean } {
  if (candles.length < 12) return { bullish: false, bearish: false };
  const slice = candles.slice(-12);
  const mid = Math.floor(slice.length / 2);
  const firstHalf = slice.slice(0, mid);
  const secondHalf = slice.slice(mid);

  const firstHigh = Math.max(...firstHalf.map((c) => c.high));
  const secondHigh = Math.max(...secondHalf.map((c) => c.high));
  const firstLow = Math.min(...firstHalf.map((c) => c.low));
  const secondLow = Math.min(...secondHalf.map((c) => c.low));

  return {
    bullish: secondHigh > firstHigh && secondLow > firstLow,
    bearish: secondHigh < firstHigh && secondLow < firstLow,
  };
}

export function analyzeConfluence(
  asset: MarketSymbol,
  candles: Candle[]
): ConfluenceAnalysis {
  const empty: ConfluenceAnalysis = {
    score: 0,
    bias: "NEUTRAL",
    trend: "ranging",
    setupStatus: "scanning",
    direction: null,
    isTriggered: false,
    price: 0,
    changePercent: 0,
    ema21: 0,
    ema55: 0,
    rsi: 50,
    atr: 0,
    support: 0,
    resistance: 0,
    reasons: ["Waiting for market data"],
    triggerReason: null,
  };

  if (candles.length < 60) return empty;

  const closes = candles.map((c) => c.close);
  const last = candles[candles.length - 1]!;
  const prev = candles[candles.length - 2]!;
  const price = last.close;
  const changePercent =
    prev.close === 0 ? 0 : ((price - prev.close) / prev.close) * 100;

  const ema21Series = ema(closes, 21);
  const ema55Series = ema(closes, 55);
  const ema21 = ema21Series[ema21Series.length - 1] ?? price;
  const ema55 = ema55Series[ema55Series.length - 1] ?? price;
  const rsi = computeRsi(closes);
  const prevRsi = computeRsi(closes.slice(0, -1));
  const atr = computeAtr(candles);
  const { support, resistance } = swingLevels(candles);
  const structure = structureBias(candles);

  const reasons: string[] = [];
  let longScore = 0;
  let shortScore = 0;

  const emaSpreadPct = Math.abs(ema21 - ema55) / Math.max(ema55, 1);
  let trend: TrendBias = "ranging";
  if (emaSpreadPct > 0.0015) {
    trend = ema21 > ema55 ? "bullish" : "bearish";
  }

  if (trend === "bullish") {
    longScore += 22;
    reasons.push("EMA 21/55 bullish stack");
  } else if (trend === "bearish") {
    shortScore += 22;
    reasons.push("EMA 21/55 bearish stack");
  } else {
    reasons.push("EMAs compressed — range regime");
  }

  if (price > ema21 && price > ema55) {
    longScore += 12;
    reasons.push("Price above trend EMAs");
  }
  if (price < ema21 && price < ema55) {
    shortScore += 12;
    reasons.push("Price below trend EMAs");
  }

  if (structure.bullish) {
    longScore += 18;
    reasons.push("Higher highs + higher lows");
  }
  if (structure.bearish) {
    shortScore += 18;
    reasons.push("Lower highs + lower lows");
  }

  const atrPct = atr / Math.max(price, 1);
  if (atrPct > 0.0008 && atrPct < 0.025) {
    longScore += 8;
    shortScore += 8;
    reasons.push("ATR volatility in tradeable band");
  } else if (atrPct <= 0.0008) {
    reasons.push("Low volatility — waiting for expansion");
  }

  if (rsi >= 48 && rsi <= 68) {
    longScore += 15;
    reasons.push("RSI momentum supports longs");
  } else if (rsi >= 32 && rsi <= 52) {
    shortScore += 15;
    reasons.push("RSI momentum supports shorts");
  }

  const pulledBackToEma21Long =
    prev.low <= ema21 * 1.001 && last.close > ema21 && last.close > last.open;
  const pulledBackToEma21Short =
    prev.high >= ema21 * 0.999 && last.close < ema21 && last.close < last.open;

  if (pulledBackToEma21Long) {
    longScore += 20;
    reasons.push("Pullback rejection at EMA 21");
  }
  if (pulledBackToEma21Short) {
    shortScore += 20;
    reasons.push("Pullback rejection at EMA 21");
  }

  const rsiCrossUp = prevRsi < 45 && rsi >= 45;
  const rsiCrossDown = prevRsi > 55 && rsi <= 55;
  if (rsiCrossUp && trend !== "bearish") {
    longScore += 10;
    reasons.push("RSI crossing up through 45");
  }
  if (rsiCrossDown && trend !== "bullish") {
    shortScore += 10;
    reasons.push("RSI crossing down through 55");
  }

  const score = Math.max(longScore, shortScore);
  let bias: MarketBias = "NEUTRAL";
  if (longScore > shortScore + 8) bias = "BUY";
  else if (shortScore > longScore + 8) bias = "SELL";

  let setupStatus: SetupStatus = "scanning";
  if (score >= 55) setupStatus = "forming";
  if (score >= 72) setupStatus = "ready";

  const TRIGGER_THRESHOLD = 78;
  let direction: SignalDirection | null = null;
  let isTriggered = false;
  let triggerReason: string | null = null;

  if (
    longScore >= TRIGGER_THRESHOLD &&
    longScore > shortScore &&
    trend !== "bearish" &&
    (pulledBackToEma21Long || rsiCrossUp) &&
    structure.bullish
  ) {
    direction = "BUY";
    isTriggered = true;
    setupStatus = "triggered";
    triggerReason =
      "Confluence long: trend + structure + EMA pullback rejection + RSI confirm";
  } else if (
    shortScore >= TRIGGER_THRESHOLD &&
    shortScore > longScore &&
    trend !== "bullish" &&
    (pulledBackToEma21Short || rsiCrossDown) &&
    structure.bearish
  ) {
    direction = "SELL";
    isTriggered = true;
    setupStatus = "triggered";
    triggerReason =
      "Confluence short: trend + structure + EMA pullback rejection + RSI confirm";
  }

  return {
    score: Math.min(100, score),
    bias,
    trend,
    setupStatus,
    direction,
    isTriggered,
    price: roundPrice(price, asset),
    changePercent: Number(changePercent.toFixed(3)),
    ema21: roundPrice(ema21, asset),
    ema55: roundPrice(ema55, asset),
    rsi: Number(rsi.toFixed(1)),
    atr: roundPrice(atr, asset),
    support: roundPrice(support, asset),
    resistance: roundPrice(resistance, asset),
    reasons: reasons.slice(0, 6),
    triggerReason,
  };
}

export function buildConfluenceSignal(
  asset: MarketSymbol,
  analysis: ConfluenceAnalysis
): LiveTradeSignal | null {
  if (!analysis.isTriggered || !analysis.direction) return null;

  const entryPrice = analysis.price;
  const stopDistance = analysis.atr * 1.5;
  const targetDistance = analysis.atr * 3;

  const stopLoss =
    analysis.direction === "BUY"
      ? roundPrice(entryPrice - stopDistance, asset)
      : roundPrice(entryPrice + stopDistance, asset);

  const takeProfit =
    analysis.direction === "BUY"
      ? roundPrice(entryPrice + targetDistance, asset)
      : roundPrice(entryPrice - targetDistance, asset);

  return {
    id: `qs-${asset}-${Date.now()}`,
    timestamp: new Date().toISOString(),
    asset,
    direction: analysis.direction,
    entryPrice,
    stopLoss,
    takeProfit,
    status: "active",
    strategy: "quicksilver-confluence",
    reason: analysis.triggerReason ?? "Confluence setup triggered",
    confluenceScore: analysis.score,
  };
}