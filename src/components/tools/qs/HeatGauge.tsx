"use client";

import { cn } from "@/lib/utils";

interface HeatGaugeProps {
  value: number;
  max?: number;
  label: string;
  status?: string;
}

export function HeatGauge({ value, max = 100, label, status }: HeatGaugeProps) {
  const pct = Math.min(100, (value / max) * 100);
  const angle = (pct / 100) * 180;
  const color =
    pct >= 75 ? "text-red-400" : pct >= 50 ? "text-amber-400" : "text-emerald-400";

  return (
    <div className="flex flex-col items-center">
      <svg width={160} height={90} viewBox="0 0 160 90" role="img" aria-label={`${label} gauge`}>
        <path
          d="M 20 80 A 60 60 0 0 1 140 80"
          fill="none"
          stroke="rgba(148,163,184,0.15)"
          strokeWidth={12}
          strokeLinecap="round"
        />
        <path
          d="M 20 80 A 60 60 0 0 1 140 80"
          fill="none"
          stroke="currentColor"
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={`${(angle / 180) * 188} 188`}
          className={cn("transition-all duration-700", color)}
        />
        <text x={80} y={68} textAnchor="middle" className={cn("font-mono text-xl font-bold", color)}>
          {value}%
        </text>
      </svg>
      <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{label}</p>
      {status && (
        <p className={cn("mt-1 font-mono text-xs font-semibold", color)}>{status}</p>
      )}
    </div>
  );
}