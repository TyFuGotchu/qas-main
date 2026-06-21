import { SYMBOL_META, MARKET_SYMBOLS } from "./symbols";
import type {
  Candle,
  CorrelationCell,
  LiquidityZone,
  MacroEvent,
  MarketSessions,
  MarketSymbol,
  Quote,
  TrapZone,
} from "./types";

function seededNoise(seed: number, i: number): number {
  return Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453 % 1;
}

function getLiveOffset(symbol: MarketSymbol): number {
  const minute = Math.floor(Date.now() / 60_000);
  const meta = SYMBOL_META[symbol];
  const noise = seededNoise(minute, symbol.charCodeAt(0)) - 0.5;
  return noise * meta.basePrice * meta.volatility * 8;
}

export function getMockQuotes(): Quote[] {
  const now = Date.now();
  return MARKET_SYMBOLS.map((symbol) => {
    const meta = SYMBOL_META[symbol];
    const offset = getLiveOffset(symbol);
    const price = meta.basePrice + offset;
    const change = offset;
    const changePercent = (change / meta.basePrice) * 100;
    const spread = price * 0.00008;
    return {
      symbol,
      price: parseFloat(price.toFixed(symbol === "BTCUSD" ? 1 : 2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(3)),
      bid: parseFloat((price - spread / 2).toFixed(2)),
      ask: parseFloat((price + spread / 2).toFixed(2)),
      timestamp: now,
    };
  });
}

export function getMockCandles(
  symbol: MarketSymbol,
  count = 120,
  intervalMinutes = 5
): Candle[] {
  const meta = SYMBOL_META[symbol];
  const now = Math.floor(Date.now() / 1000);
  const interval = intervalMinutes * 60;
  let price = meta.basePrice;
  const candles: Candle[] = [];

  for (let i = count - 1; i >= 0; i--) {
    const time = now - i * interval;
    const drift = (seededNoise(symbol.charCodeAt(2), i) - 0.48) * meta.volatility;
    const open = price;
    const close = open * (1 + drift);
    const high = Math.max(open, close) * (1 + Math.abs(drift) * 0.6);
    const low = Math.min(open, close) * (1 - Math.abs(drift) * 0.6);
    const volume = 800 + seededNoise(i, symbol.charCodeAt(1)) * 2400;
    candles.push({
      time,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.round(volume),
    });
    price = close;
  }

  return candles;
}

function returnsFromCandles(candles: Candle[]): number[] {
  return candles.slice(1).map((c, i) => {
    const prev = candles[i].close;
    return (c.close - prev) / prev;
  });
}

function pearson(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  if (n < 2) return 0;
  const meanA = a.slice(0, n).reduce((s, v) => s + v, 0) / n;
  const meanB = b.slice(0, n).reduce((s, v) => s + v, 0) / n;
  let num = 0;
  let denA = 0;
  let denB = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - meanA;
    const db = b[i] - meanB;
    num += da * db;
    denA += da * da;
    denB += db * db;
  }
  const den = Math.sqrt(denA * denB);
  return den === 0 ? 0 : num / den;
}

export function getMockCorrelationMatrix(): CorrelationCell[] {
  const cells: CorrelationCell[] = [];
  const series = Object.fromEntries(
    MARKET_SYMBOLS.map((s) => [s, returnsFromCandles(getMockCandles(s, 60))])
  ) as Record<MarketSymbol, number[]>;

  for (let i = 0; i < MARKET_SYMBOLS.length; i++) {
    for (let j = i + 1; j < MARKET_SYMBOLS.length; j++) {
      const assetA = MARKET_SYMBOLS[i];
      const assetB = MARKET_SYMBOLS[j];
      const correlation = parseFloat(
        pearson(series[assetA], series[assetB]).toFixed(3)
      );
      const previousCorrelation = parseFloat(
        (correlation + (seededNoise(assetA.charCodeAt(0), assetB.charCodeAt(0)) - 0.5) * 0.35).toFixed(3)
      );
      const decoupled =
        Math.abs(correlation) < 0.25 &&
        Math.abs(previousCorrelation) > 0.55;
      cells.push({ assetA, assetB, correlation, previousCorrelation, decoupled });
    }
  }
  return cells;
}

export function getMockMacroCalendar(): MacroEvent[] {
  const now = new Date();
  const events: Omit<MacroEvent, "id">[] = [
    {
      title: "US CPI YoY",
      currency: "USD",
      impact: "high",
      scheduledAt: new Date(now.getTime() + 2 * 3600_000).toISOString(),
      volatilityImpactScore: 78,
      spikeProbability: 0.71,
      flushProbability: 0.29,
      sentiment: "bearish",
    },
    {
      title: "FOMC Rate Decision",
      currency: "USD",
      impact: "high",
      scheduledAt: new Date(now.getTime() + 26 * 3600_000).toISOString(),
      volatilityImpactScore: 92,
      spikeProbability: 0.84,
      flushProbability: 0.16,
      sentiment: "neutral",
    },
    {
      title: "ECB Press Conference",
      currency: "EUR",
      impact: "high",
      scheduledAt: new Date(now.getTime() + 8 * 3600_000).toISOString(),
      volatilityImpactScore: 61,
      spikeProbability: 0.58,
      flushProbability: 0.42,
      sentiment: "bullish",
    },
    {
      title: "UK GDP QoQ",
      currency: "GBP",
      impact: "medium",
      scheduledAt: new Date(now.getTime() + 14 * 3600_000).toISOString(),
      volatilityImpactScore: 34,
      spikeProbability: 0.45,
      flushProbability: 0.55,
      sentiment: "neutral",
    },
    {
      title: "NFP Non-Farm Payrolls",
      currency: "USD",
      impact: "high",
      scheduledAt: new Date(now.getTime() + 48 * 3600_000).toISOString(),
      volatilityImpactScore: 85,
      spikeProbability: 0.76,
      flushProbability: 0.24,
      sentiment: "bullish",
    },
    {
      title: "China PMI Manufacturing",
      currency: "CNY",
      impact: "medium",
      scheduledAt: new Date(now.getTime() + 5 * 3600_000).toISOString(),
      volatilityImpactScore: -22,
      spikeProbability: 0.38,
      flushProbability: 0.62,
      sentiment: "bearish",
    },
  ];

  return events.map((e, i) => ({ ...e, id: `evt-${i}` }));
}

export function getMockLiquidityZones(symbol: MarketSymbol): LiquidityZone[] {
  const quote = getMockQuotes().find((q) => q.symbol === symbol)!;
  const price = quote.price;
  return [
    {
      priceLow: price * 0.992,
      priceHigh: price * 0.9945,
      intensity: 0.92,
      label: "Sell-Side Void",
    },
    {
      priceLow: price * 0.997,
      priceHigh: price * 1.001,
      intensity: 0.45,
      label: "Equilibrium",
    },
    {
      priceLow: price * 1.0035,
      priceHigh: price * 1.0065,
      intensity: 0.88,
      label: "Buy-Side Void",
    },
    {
      priceLow: price * 1.009,
      priceHigh: price * 1.012,
      intensity: 0.71,
      label: "Stop Cluster",
    },
  ];
}

export function getMockTrapZones(): TrapZone[] {
  const quotes = getMockQuotes();
  const xau = quotes.find((q) => q.symbol === "XAUUSD")!;
  const nas = quotes.find((q) => q.symbol === "NAS100")!;

  return [
    {
      id: "trap-1",
      symbol: "XAUUSD",
      price: xau.price * 1.0018,
      direction: "long_trap",
      strength: 87,
      detectedAt: new Date().toISOString(),
      description: "Retail longs stacked above prior session high — liquidity sweep target",
    },
    {
      id: "trap-2",
      symbol: "XAUUSD",
      price: xau.price * 0.9965,
      direction: "short_trap",
      strength: 72,
      detectedAt: new Date(Date.now() - 12 * 60_000).toISOString(),
      description: "Equal lows cluster — stop-run magnet below Asia range",
    },
    {
      id: "trap-3",
      symbol: "NAS100",
      price: nas.price * 0.9982,
      direction: "short_trap",
      strength: 91,
      detectedAt: new Date(Date.now() - 4 * 60_000).toISOString(),
      description: "Opening drive shorts trapped — VWAP reclaim failure zone",
    },
    {
      id: "trap-4",
      symbol: "NAS100",
      price: nas.price * 1.0025,
      direction: "long_trap",
      strength: 65,
      detectedAt: new Date(Date.now() - 22 * 60_000).toISOString(),
      description: "Breakout buyers offside — gap fill reversal candidate",
    },
  ];
}

export function getMockSessions(): MarketSessions {
  const utcHour = new Date().getUTCHours();
  const asiaOpen = utcHour >= 0 && utcHour < 8;
  const londonOpen = utcHour >= 7 && utcHour < 16;
  const nyOpen = utcHour >= 13 && utcHour < 22;
  const overlapActive = londonOpen && nyOpen;

  const atrBase = [12, 14, 16, 18, 22, 28, 35, 42, 48, 55, 58, 52, 45, 50, 54, 48, 38, 32, 26, 20, 16, 14, 12, 11];
  const compositeAtr = atrBase[utcHour];

  return {
    utcHour,
    sessions: [
      { name: "Asia", open: asiaOpen, atr: atrBase[(utcHour + 16) % 24], volatilityRank: asiaOpen ? 2 : 0 },
      { name: "London", open: londonOpen, atr: atrBase[utcHour], volatilityRank: londonOpen ? 3 : 0 },
      { name: "NewYork", open: nyOpen, atr: atrBase[(utcHour + 5) % 24], volatilityRank: nyOpen ? 3 : 0 },
    ],
    overlapActive,
    overlapLabel: overlapActive ? "London × New York" : null,
    compositeAtr,
  };
}