"use client";

interface ComparisonBarsProps {
  items: { label: string; value: number; color: string }[];
  unit?: string;
}

export function ComparisonBars({ items, unit = "%" }: ComparisonBarsProps) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex justify-between font-mono text-[10px] text-slate-500">
            <span>{item.label}</span>
            <span style={{ color: item.color }}>
              {item.value}
              {unit}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(item.value / max) * 100}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}