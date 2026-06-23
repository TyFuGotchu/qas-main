"use client";

interface LadderLevel {
  label: string;
  price: number;
  rMultiple?: number;
  sizePercent?: number;
  kind: "entry" | "stop" | "tp" | "be" | "trail";
}

interface PriceLadderChartProps {
  levels: LadderLevel[];
  direction: "long" | "short";
}

const KIND_COLORS: Record<LadderLevel["kind"], string> = {
  entry: "#22d3ee",
  stop: "#f87171",
  tp: "#34d399",
  be: "#fbbf24",
  trail: "#a78bfa",
};

export function PriceLadderChart({ levels, direction }: PriceLadderChartProps) {
  const prices = levels.map((l) => l.price);
  const min = Math.min(...prices) - 2;
  const max = Math.max(...prices) + 2;
  const range = max - min || 1;
  const toY = (price: number) => 20 + ((max - price) / range) * 140;

  const sorted = [...levels].sort((a, b) => b.price - a.price);

  return (
    <svg viewBox="0 0 280 180" className="h-auto w-full" role="img" aria-label="Price ladder">
      <text x={140} y={14} textAnchor="middle" className="fill-cyan-400 text-[9px] font-mono font-semibold">
        {direction.toUpperCase()} price ladder
      </text>
      <line x1={80} y1={20} x2={80} y2={160} stroke="rgba(148,163,184,0.3)" strokeWidth={2} />
      {sorted.map((level) => {
        const y = toY(level.price);
        const color = KIND_COLORS[level.kind];
        return (
          <g key={`${level.label}-${level.price}`}>
            <line x1={60} y1={y} x2={200} y2={y} stroke={color} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.6} />
            <circle cx={80} cy={y} r={5} fill={color} />
            <text x={95} y={y + 4} className="fill-slate-300 text-[8px] font-mono">
              {level.label} · {level.price}
              {level.rMultiple !== undefined ? ` · ${level.rMultiple}R` : ""}
              {level.sizePercent !== undefined ? ` · ${level.sizePercent}%` : ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
}