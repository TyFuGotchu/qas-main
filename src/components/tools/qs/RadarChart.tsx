"use client";

interface RadarChartProps {
  labels: string[];
  values: number[];
  size?: number;
}

export function RadarChart({ labels, values, size = 200 }: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.36;
  const count = labels.length;
  const angleStep = (Math.PI * 2) / count;

  const pointAt = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + Math.cos(angle) * r,
      y: center + Math.sin(angle) * r,
    };
  };

  const gridLevels = [25, 50, 75, 100];
  const dataPoints = values.map((v, i) => pointAt(i, v));
  const polygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg width={size} height={size} className="mx-auto" role="img" aria-label="Confluence radar chart">
      {gridLevels.map((level) => {
        const pts = Array.from({ length: count }, (_, i) => {
          const p = pointAt(i, level);
          return `${p.x},${p.y}`;
        }).join(" ");
        return (
          <polygon
            key={level}
            points={pts}
            fill="none"
            stroke="rgba(148,163,184,0.15)"
            strokeWidth={1}
          />
        );
      })}
      {labels.map((label, i) => {
        const outer = pointAt(i, 115);
        const axis = pointAt(i, 100);
        return (
          <g key={label}>
            <line
              x1={center}
              y1={center}
              x2={axis.x}
              y2={axis.y}
              stroke="rgba(148,163,184,0.2)"
              strokeWidth={1}
            />
            <text
              x={outer.x}
              y={outer.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-500 text-[7px] font-mono"
            >
              {label.slice(0, 8)}
            </text>
          </g>
        );
      })}
      <polygon
        points={polygon}
        fill="rgba(34,211,238,0.2)"
        stroke="#22d3ee"
        strokeWidth={2}
      />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="#22d3ee" />
      ))}
    </svg>
  );
}