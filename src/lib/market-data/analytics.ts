import type { Candle, CorrelationCell, LiquidityZone, MarketSymbol, TrapZone } from "./types";

export function returnsFromCandles(candles: Candle[]): number[] {
  return candles.slice(1).map((c, i) => {
    const prev = candles[i].close;
    return prev === 0 ? 0 : (c.close - prev) / prev;
  });
}

export function pearsonCorrelation(a: number[], b: number[]): number {
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

function lastCloseReturnsOpposite(
  candlesA: Candle[],
  candlesB: Candle[]
): boolean {
  if (candlesA.length < 2 || candlesB.length < 2) return false;
  const retA =
    (candlesA.at(-1)!.close - candlesA.at(-2)!.close) / candlesA.at(-2)!.close;
  const retB =
    (candlesB.at(-1)!.close - candlesB.at(-2)!.close) / candlesB.at(-2)!.close;
  return retA * retB < 0 && Math.abs(retA) > 0.0004 && Math.abs(retB) > 0.0004;
}

export function buildCorrelationMatrix(
  series: Partial<Record<MarketSymbol, number[]>>,
  symbols: MarketSymbol[],
  candlesBySymbol?: Partial<Record<MarketSymbol, Candle[]>>
): CorrelationCell[] {
  const cells: CorrelationCell[] = [];
  const window = 30;

  for (let i = 0; i < symbols.length; i++) {
    for (let j = i + 1; j < symbols.length; j++) {
      const assetA = symbols[i];
      const assetB = symbols[j];
      const a = series[assetA] ?? [];
      const b = series[assetB] ?? [];

      const recentA = a.slice(-window);
      const recentB = b.slice(-window);
      const priorA = a.slice(-window * 2, -window);
      const priorB = b.slice(-window * 2, -window);

      const correlation = parseFloat(
        pearsonCorrelation(recentA, recentB).toFixed(3)
      );
      const previousCorrelation = parseFloat(
        pearsonCorrelation(priorA, priorB).toFixed(3)
      );

      const oppositeLastCandle = candlesBySymbol
        ? lastCloseReturnsOpposite(
            candlesBySymbol[assetA] ?? [],
            candlesBySymbol[assetB] ?? []
          )
        : false;

      const decoupled =
        oppositeLastCandle ||
        (Math.abs(correlation) < 0.3 && Math.abs(previousCorrelation) > 0.55) ||
        (Math.abs(correlation - previousCorrelation) > 0.45 &&
          Math.abs(recentA.at(-1) ?? 0) > 0.003 &&
          Math.abs(recentB.at(-1) ?? 0) < 0.001);

      cells.push({ assetA, assetB, correlation, previousCorrelation, decoupled });
    }
  }
  return cells;
}

export function computeAtr(candles: Candle[], period = 14): number {
  if (candles.length < period + 1) return 0;
  const trs: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    const cur = candles[i];
    const prev = candles[i - 1];
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

export function detectLiquidityVoids(
  candles: Candle[],
  currentPrice: number
): LiquidityZone[] {
  if (candles.length < 10) {
    return [
      {
        priceLow: currentPrice * 0.995,
        priceHigh: currentPrice * 0.997,
        intensity: 0.5,
        label: "Void (insufficient data)",
      },
    ];
  }

  const lows = candles.map((c) => c.low);
  const highs = candles.map((c) => c.high);
  const min = Math.min(...lows);
  const max = Math.max(...highs);
  const bins = 24;
  const step = (max - min) / bins || 1;
  const profile = Array.from({ length: bins }, () => 0);

  for (const c of candles) {
    const mid = (c.high + c.low) / 2;
    const idx = Math.min(bins - 1, Math.max(0, Math.floor((mid - min) / step)));
    profile[idx] += c.volume || 1;
  }

  const maxVol = Math.max(...profile, 1);
  const zones: LiquidityZone[] = [];

  for (let i = 0; i < bins - 2; i++) {
    const avgNeighbor = (profile[i] + profile[i + 1] + profile[i + 2]) / 3;
    const density = avgNeighbor / maxVol;
    if (density < 0.28) {
      const priceLow = min + i * step;
      const priceHigh = priceLow + step * 2;
      zones.push({
        priceLow: parseFloat(priceLow.toFixed(2)),
        priceHigh: parseFloat(priceHigh.toFixed(2)),
        intensity: parseFloat((1 - density).toFixed(2)),
        label: density < 0.15 ? "Liquidity Void" : "Thin Zone",
      });
    }
  }

  return zones
    .sort((a, b) => b.intensity - a.intensity)
    .slice(0, 4);
}

export function detectTrapZones(
  symbol: MarketSymbol,
  candles: Candle[]
): TrapZone[] {
  const traps: TrapZone[] = [];
  const recent = candles.slice(-25);
  const avgVolume =
    recent.reduce((s, c) => s + (c.volume || 0), 0) / Math.max(recent.length, 1);

  recent.forEach((candle, idx) => {
    const range = candle.high - candle.low;
    if (range <= 0) return;

    const volume = candle.volume || 0;
    const highVolume = volume > avgVolume * 1.35;
    if (!highVolume) return;

    const bodyTop = Math.max(candle.open, candle.close);
    const bodyBottom = Math.min(candle.open, candle.close);
    const upperWick = candle.high - bodyTop;
    const lowerWick = bodyBottom - candle.low;
    const upperRatio = upperWick / range;
    const lowerRatio = lowerWick / range;
    const volBoost = Math.min(20, Math.round((volume / avgVolume) * 8));

    if (upperRatio > 0.55 && candle.close < bodyTop) {
      traps.push({
        id: `${symbol}-long-${idx}`,
        symbol,
        price: parseFloat(candle.high.toFixed(2)),
        direction: "long_trap",
        strength: Math.min(99, Math.round(upperRatio * 100) + volBoost),
        detectedAt: new Date(candle.time * 1000).toISOString(),
        description:
          "High-volume upper wick — retail bought the top and is trapped offside",
      });
    }

    if (lowerRatio > 0.55 && candle.close > bodyBottom) {
      traps.push({
        id: `${symbol}-short-${idx}`,
        symbol,
        price: parseFloat(candle.low.toFixed(2)),
        direction: "short_trap",
        strength: Math.min(99, Math.round(lowerRatio * 100) + volBoost),
        detectedAt: new Date(candle.time * 1000).toISOString(),
        description:
          "High-volume lower wick — retail sold the bottom and is trapped offside",
      });
    }
  });

  return traps
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 6);
}