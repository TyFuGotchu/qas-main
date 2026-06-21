"use client";

import { cn } from "@/lib/utils";

interface FactorBarProps {
  label: string;
  score: number;
  note?: string;
}

export function FactorBar({ label, score, note }: FactorBarProps) {
  const color =
    score >= 80
      ? "bg-emerald-500"
      : score >= 60
      ? "bg-cyan-accent"
      : score >= 40
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-slate-400">{label}</span>
        <span className="font-mono text-xs font-bold text-slate-200">{score}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${Math.min(100, score)}%` }}
        />
      </div>
      {note && <p className="font-mono text-[10px] text-slate-600">{note}</p>}
    </div>
  );
}