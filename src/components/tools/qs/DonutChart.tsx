"use client";

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  centerLabel?: string;
}

export function DonutChart({ segments, size = 140, centerLabel }: DonutChartProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const radius = size * 0.32;
  const stroke = size * 0.14;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(148,163,184,0.1)"
            strokeWidth={stroke}
          />
          {segments.map((seg) => {
            const pct = seg.value / total;
            const dash = pct * circumference;
            const circle = (
              <circle
                key={seg.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += dash;
            return circle;
          })}
        </svg>
        {centerLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-xs text-slate-400">{centerLabel}</span>
          </div>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="font-mono text-[10px] text-slate-500">
              {seg.label} {seg.value.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}