import type { CandlePattern } from "@/lib/academy/visual-registry";

interface CandleData {
  open: number;
  close: number;
  high: number;
  low: number;
  label?: string;
}

const PATTERN_CANDLES: Record<CandlePattern, { candles: CandleData[]; title: string }> = {
  doji: {
    title: "Doji — open ≈ close",
    candles: [{ open: 50, close: 50.5, high: 62, low: 38, label: "Doji" }],
  },
  "hammer-hanging-man": {
    title: "Hammer / Hanging Man",
    candles: [
      { open: 52, close: 55, high: 56, low: 30, label: "Hammer" },
      { open: 48, close: 45, high: 70, low: 44, label: "Hanging Man" },
    ],
  },
  "shooting-star-inverted-hammer": {
    title: "Shooting Star / Inverted Hammer",
    candles: [
      { open: 45, close: 42, high: 72, low: 40, label: "Shooting Star" },
      { open: 42, close: 48, high: 70, low: 40, label: "Inv. Hammer" },
    ],
  },
  marubozu: {
    title: "Marubozu — full body, no wicks",
    candles: [
      { open: 35, close: 65, high: 65, low: 35, label: "Bull" },
      { open: 65, close: 35, high: 65, low: 35, label: "Bear" },
    ],
  },
  "spinning-top": {
    title: "Spinning Top — small body, long wicks",
    candles: [{ open: 48, close: 52, high: 68, low: 32, label: "Spinning Top" }],
  },
  "bullish-bearish-engulfing": {
    title: "Bullish / Bearish Engulfing",
    candles: [
      { open: 55, close: 52, high: 57, low: 50 },
      { open: 51, close: 58, high: 60, low: 49, label: "Bull Engulf" },
      { open: 48, close: 52, high: 54, low: 46 },
      { open: 53, close: 44, high: 55, low: 42, label: "Bear Engulf" },
    ],
  },
  harami: {
    title: "Harami — inside body",
    candles: [
      { open: 40, close: 60, high: 62, low: 38 },
      { open: 48, close: 52, high: 54, low: 46, label: "Harami" },
    ],
  },
  "piercing-dark-cloud": {
    title: "Piercing / Dark Cloud Cover",
    candles: [
      { open: 42, close: 58, high: 60, low: 40 },
      { open: 60, close: 50, high: 62, low: 48, label: "Piercing" },
    ],
  },
  "tweezer-tops-bottoms": {
    title: "Tweezer Tops / Bottoms",
    candles: [
      { open: 50, close: 58, high: 70, low: 48, label: "Top" },
      { open: 56, close: 48, high: 70, low: 46, label: "Top" },
    ],
  },
  "inside-outside-bar": {
    title: "Inside Bar / Outside Bar",
    candles: [
      { open: 40, close: 60, high: 62, low: 38 },
      { open: 48, close: 52, high: 54, low: 46, label: "Inside" },
      { open: 52, close: 48, high: 66, low: 34, label: "Outside" },
    ],
  },
  "morning-evening-star": {
    title: "Morning / Evening Star (3-candle)",
    candles: [
      { open: 42, close: 58, high: 60, low: 40 },
      { open: 58, close: 57, high: 59, low: 56, label: "Star" },
      { open: 55, close: 45, high: 57, low: 43 },
    ],
  },
  "three-white-soldiers": {
    title: "Three White Soldiers",
    candles: [
      { open: 40, close: 50, high: 52, low: 38 },
      { open: 48, close: 58, high: 60, low: 46 },
      { open: 56, close: 68, high: 70, low: 54, label: "Soldiers" },
    ],
  },
  "three-black-crows": {
    title: "Three Black Crows",
    candles: [
      { open: 60, close: 50, high: 62, low: 48 },
      { open: 52, close: 42, high: 54, low: 40 },
      { open: 44, close: 32, high: 46, low: 30, label: "Crows" },
    ],
  },
  "three-inside-up-down": {
    title: "Three Inside Up / Down",
    candles: [
      { open: 58, close: 42, high: 60, low: 40 },
      { open: 44, close: 48, high: 50, low: 42 },
      { open: 46, close: 55, high: 57, low: 44, label: "Inside Up" },
    ],
  },
  "abandoned-baby": {
    title: "Abandoned Baby — gap + doji",
    candles: [
      { open: 42, close: 58, high: 60, low: 40 },
      { open: 68, close: 68, high: 70, low: 66, label: "Doji gap" },
      { open: 72, close: 58, high: 74, low: 56 },
    ],
  },
  "pattern-context": {
    title: "Pattern context matters",
    candles: [
      { open: 55, close: 45, high: 58, low: 42, label: "At resistance" },
      { open: 42, close: 52, high: 54, low: 38, label: "At support" },
    ],
  },
};

export type CandleHighlight = "body" | "upper-wick" | "lower-wick" | "full";

function Candle({
  x,
  data,
  width = 28,
  highlighted = false,
  highlightPart = "full",
}: {
  x: number;
  data: CandleData;
  width?: number;
  highlighted?: boolean;
  highlightPart?: CandleHighlight;
}) {
  const bullish = data.close >= data.open;
  const color = bullish ? "#34d399" : "#f87171";
  const bodyTop = Math.min(data.open, data.close);
  const bodyHeight = Math.max(Math.abs(data.close - data.open), 2);
  const scale = (v: number) => 160 - v * 1.2;

  const pulseClass = highlighted ? "animate-pulse" : "";

  return (
    <g>
      {highlighted && (
        <rect
          x={x - 2}
          y={highlightPart === "lower-wick" ? scale(data.close) : scale(data.high) - 4}
          width={width + 4}
          height={
            highlightPart === "body"
              ? bodyHeight * 1.2 + 8
              : highlightPart === "upper-wick"
                ? scale(data.close) - scale(data.high) + 8
                : highlightPart === "lower-wick"
                  ? scale(data.low) - scale(data.close) + 8
                  : scale(data.low) - scale(data.high) + 8
          }
          fill="rgba(34,211,238,0.15)"
          stroke="#22d3ee"
          strokeWidth={2}
          rx={4}
          className={pulseClass}
        />
      )}
      <line
        x1={x + width / 2}
        y1={scale(data.high)}
        x2={x + width / 2}
        y2={scale(data.low)}
        stroke={color}
        strokeWidth={highlighted ? 3 : 2}
        opacity={highlighted || highlightPart === "full" || highlightPart.includes("wick") ? 1 : 0.35}
      />
      <rect
        x={x + 4}
        y={scale(bodyTop + bodyHeight)}
        width={width - 8}
        height={bodyHeight * 1.2}
        fill={color}
        rx={1}
        opacity={highlighted || highlightPart === "full" || highlightPart === "body" ? 1 : 0.35}
      />
      {data.label && (
        <text
          x={x + width / 2}
          y={scale(data.low) + 14}
          textAnchor="middle"
          className="fill-slate-500 text-[9px] font-mono"
        >
          {data.label}
        </text>
      )}
    </g>
  );
}

export function CandlestickDiagram({
  pattern,
  highlightIndex,
  highlightPart = "full",
}: {
  pattern: CandlePattern;
  highlightIndex?: number;
  highlightPart?: CandleHighlight;
}) {
  const config = PATTERN_CANDLES[pattern];
  const spacing = 48;
  const totalWidth = config.candles.length * spacing + 20;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${totalWidth} 200`}
        className="mx-auto h-auto w-full max-w-md"
        role="img"
        aria-label={config.title}
      >
        <rect x={0} y={0} width={totalWidth} height={200} fill="transparent" />
        <line
          x1={10}
          y1={170}
          x2={totalWidth - 10}
          y2={170}
          stroke="rgba(148,163,184,0.2)"
          strokeWidth={1}
        />
        {config.candles.map((c, i) => (
          <Candle
            key={i}
            x={16 + i * spacing}
            data={c}
            highlighted={highlightIndex === i}
            highlightPart={highlightIndex === i ? highlightPart : "full"}
          />
        ))}
        <text
          x={totalWidth / 2}
          y={16}
          textAnchor="middle"
          className="fill-cyan-400 text-[10px] font-mono font-semibold"
        >
          {config.title}
        </text>
      </svg>
    </div>
  );
}