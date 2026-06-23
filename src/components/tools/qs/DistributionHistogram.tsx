"use client";

interface DistributionHistogramProps {
  buckets: { label: string; count: number }[];
  title?: string;
}

export function DistributionHistogram({
  buckets,
  title = "Ending balance distribution",
}: DistributionHistogramProps) {
  const max = Math.max(...buckets.map((b) => b.count), 1);

  return (
    <div>
      <p className="mb-3 text-center font-mono text-[10px] uppercase tracking-widest text-slate-500">
        {title}
      </p>
      <svg viewBox={`0 0 ${buckets.length * 36 + 20} 120`} className="h-auto w-full" role="img">
        {buckets.map((bucket, i) => {
          const h = (bucket.count / max) * 80;
          const x = 16 + i * 36;
          return (
            <g key={bucket.label}>
              <rect
                x={x}
                y={95 - h}
                width={24}
                height={h}
                fill="rgba(34,211,238,0.5)"
                rx={2}
              />
              <text
                x={x + 12}
                y={108}
                textAnchor="middle"
                className="fill-slate-500 text-[6px] font-mono"
              >
                {bucket.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}