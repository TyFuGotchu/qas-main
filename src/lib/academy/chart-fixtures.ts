import type { PriceLine } from "@/components/charts/MarketChart";
import type { Candle, MarketSymbol } from "@/lib/market-data/types";
import { getLessonVisual, type LessonVisualConfig } from "@/lib/academy/visual-registry";

export type ChartScenario =
  | "uptrend"
  | "downtrend"
  | "range"
  | "bos"
  | "choch"
  | "liquidity"
  | "fib"
  | "fvg"
  | "reversal";

export interface LessonChartFixture {
  symbol: MarketSymbol;
  candles: Candle[];
  priceLines: PriceLine[];
  scenario: ChartScenario;
  caption: string;
}

function buildCandles(
  basePrice: number,
  moves: { o: number; h: number; l: number; c: number }[],
  intervalMinutes = 60
): Candle[] {
  const now = Math.floor(Date.now() / 1000);
  const interval = intervalMinutes * 60;
  let price = basePrice;

  return moves.map((m, i) => {
    const open = price + m.o;
    const close = price + m.c;
    const high = price + m.h;
    const low = price + m.l;
    const candle: Candle = {
      time: now - (moves.length - i) * interval,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: 1000 + i * 120,
    };
    price = close;
    return candle;
  });
}

const SCENARIOS: Record<
  ChartScenario,
  { moves: { o: number; h: number; l: number; c: number }[]; lines: PriceLine[]; caption: string }
> = {
  uptrend: {
    moves: [
      { o: 0, h: 8, l: -2, c: 6 },
      { o: 0, h: 6, l: -3, c: 4 },
      { o: 0, h: 10, l: -1, c: 8 },
      { o: 0, h: 7, l: -4, c: 5 },
      { o: 0, h: 12, l: -2, c: 10 },
      { o: 0, h: 9, l: -3, c: 7 },
      { o: 0, h: 14, l: -1, c: 11 },
    ],
    lines: [{ price: 0, color: "#34d399", title: "HL trend" }],
    caption: "Higher highs and higher lows define bullish structure.",
  },
  downtrend: {
    moves: [
      { o: 0, h: 2, l: -8, c: -6 },
      { o: 0, h: 3, l: -7, c: -4 },
      { o: 0, h: 1, l: -10, c: -8 },
      { o: 0, h: 2, l: -9, c: -5 },
      { o: 0, h: 1, l: -12, c: -10 },
    ],
    lines: [{ price: 0, color: "#f87171", title: "LH trend" }],
    caption: "Lower highs and lower lows — bearish structure.",
  },
  range: {
    moves: [
      { o: 0, h: 5, l: -4, c: 2 },
      { o: 0, h: 4, l: -5, c: -3 },
      { o: 0, h: 6, l: -3, c: 4 },
      { o: 0, h: 3, l: -6, c: -4 },
      { o: 0, h: 5, l: -4, c: 1 },
      { o: 0, h: 4, l: -5, c: -2 },
    ],
    lines: [
      { price: 0, color: "#f87171", title: "Resistance" },
      { price: 0, color: "#34d399", title: "Support" },
    ],
    caption: "Price oscillates between support and resistance.",
  },
  bos: {
    moves: [
      { o: 0, h: 6, l: -2, c: 5 },
      { o: 0, h: 4, l: -4, c: 2 },
      { o: 0, h: 8, l: -1, c: 7 },
      { o: 0, h: 5, l: -3, c: 3 },
      { o: 0, h: 15, l: -2, c: 12 },
    ],
    lines: [{ price: 0, color: "#22d3ee", title: "BOS level" }],
    caption: "Break of Structure — close above prior swing high.",
  },
  choch: {
    moves: [
      { o: 0, h: 8, l: -1, c: 6 },
      { o: 0, h: 6, l: -3, c: 4 },
      { o: 0, h: 5, l: -8, c: -6 },
      { o: 0, h: 2, l: -10, c: -8 },
    ],
    lines: [{ price: 0, color: "#fbbf24", title: "CHoCH" }],
    caption: "Change of Character — first break against the trend.",
  },
  liquidity: {
    moves: [
      { o: 0, h: 12, l: -1, c: 10 },
      { o: 0, h: 14, l: 8, c: 11 },
      { o: 0, h: 16, l: 9, c: 8 },
      { o: 0, h: 10, l: -2, c: 6 },
    ],
    lines: [{ price: 0, color: "#f87171", title: "Equal highs (liquidity)" }],
    caption: "Equal highs cluster stop orders — liquidity pool.",
  },
  fib: {
    moves: [
      { o: 0, h: 2, l: -2, c: -1 },
      { o: 0, h: 15, l: -1, c: 12 },
      { o: 0, h: 8, l: -6, c: -4 },
      { o: 0, h: 5, l: -7, c: -3 },
      { o: 0, h: 6, l: -2, c: 4 },
    ],
    lines: [
      { price: 0, color: "#64748b", title: "38.2%" },
      { price: 0, color: "#22d3ee", title: "61.8% GP" },
      { price: 0, color: "#64748b", title: "50%" },
    ],
    caption: "Fibonacci retracement zones on a pullback.",
  },
  fvg: {
    moves: [
      { o: 0, h: 10, l: -1, c: 8 },
      { o: 0, h: 14, l: 6, c: 12 },
      { o: 0, h: 8, l: -2, c: 4 },
    ],
    lines: [{ price: 0, color: "#fbbf24", title: "FVG zone" }],
    caption: "Fair Value Gap — imbalance between candle wicks.",
  },
  reversal: {
    moves: [
      { o: 0, h: 8, l: -1, c: 6 },
      { o: 0, h: 10, l: 5, c: 7 },
      { o: 0, h: 12, l: 6, c: 6.2 },
      { o: 0, h: 7, l: -5, c: -4 },
    ],
    lines: [{ price: 0, color: "#f87171", title: "Reversal zone" }],
    caption: "Reversal pattern at resistance after extended move.",
  },
};

function scenarioForVisual(config: LessonVisualConfig): ChartScenario {
  if (config.kind === "candle") return "reversal";
  if (config.kind === "fib") return "fib";
  if (config.kind === "structure") {
    const v = config.variant;
    if (v.includes("choch")) return "choch";
    if (v.includes("bos") || v.includes("sweep")) return "bos";
    if (v.includes("liquidity") || v.includes("fvg") || v.includes("inducement")) return "liquidity";
    return "uptrend";
  }
  if (config.kind === "chart") {
    const v = config.variant;
    if (v.includes("support") || v.includes("reaction") || v.includes("range")) return "range";
    if (v.includes("exhaustion") || v.includes("bear")) return "downtrend";
    if (v.includes("fractal") || v.includes("top-down")) return "uptrend";
    return "range";
  }
  if (config.kind === "style") {
    const v = config.variant;
    if (v.includes("fvg")) return "fvg";
    if (v.includes("liquidity") || v.includes("ict")) return "liquidity";
    if (v.includes("swing")) return "uptrend";
    return "range";
  }
  return "uptrend";
}

function offsetLines(candles: Candle[], lines: PriceLine[]): PriceLine[] {
  if (candles.length === 0) return lines;
  const min = Math.min(...candles.map((c) => c.low));
  const max = Math.max(...candles.map((c) => c.high));
  const range = max - min || 1;

  return lines.map((line, i) => {
    const ratios = [0.25, 0.5, 0.618, 0.75, 0.9];
    const ratio = ratios[i % ratios.length];
    return {
      ...line,
      price: parseFloat((min + range * ratio).toFixed(2)),
    };
  });
}

export function getLessonChartFixture(
  categoryId: string,
  lessonId: string,
  basePrice = 2650
): LessonChartFixture {
  const config = getLessonVisual(categoryId, lessonId);
  const scenario = scenarioForVisual(config);
  const def = SCENARIOS[scenario];
  const candles = buildCandles(basePrice, def.moves);
  const priceLines = offsetLines(candles, def.lines);

  return {
    symbol: "XAUUSD",
    candles,
    priceLines,
    scenario,
    caption: def.caption,
  };
}