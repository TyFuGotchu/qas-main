import type { CandlestickData, UTCTimestamp } from "lightweight-charts";
import type { Candle } from "./types";

/**
 * Normalize polled OHLCV into lightweight-charts schema.
 * Requires ascending unique UTCTimestamp (seconds) for intraday candles.
 */
export function formatCandlesForChart(candles: Candle[]): CandlestickData[] {
  const sorted = [...candles].sort((a, b) => a.time - b.time);
  const seen = new Set<number>();

  return sorted
    .filter((c) => {
      if (!Number.isFinite(c.open) || !Number.isFinite(c.close)) return false;
      if (c.high < c.low) return false;
      if (seen.has(c.time)) return false;
      seen.add(c.time);
      return true;
    })
    .map((c) => ({
      time: c.time as UTCTimestamp,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));
}