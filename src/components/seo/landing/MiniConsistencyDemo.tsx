"use client";

import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export function MiniConsistencyDemo() {
  const [bestDay, setBestDay] = useState(400);
  const [totalProfit, setTotalProfit] = useState(2000);
  const threshold = 20;

  const result = useMemo(() => {
    if (totalProfit <= 0) return { pct: 0, pass: false };
    const pct = (bestDay / totalProfit) * 100;
    return { pct, pass: pct <= threshold };
  }, [bestDay, totalProfit, threshold]);

  return (
    <GlassPanel className="border-cyan-accent/25 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
          Prop Consistency Calculator
        </h3>
        <Badge variant="success">Free demo</Badge>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Best Day ÷ Total Profit must stay ≤ {threshold}% on most prop platforms
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-xs text-slate-500">Best day profit ($)</span>
          <input
            type="number"
            value={bestDay}
            onChange={(e) => setBestDay(Number(e.target.value))}
            className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-200"
          />
        </label>
        <label className="block">
          <span className="font-mono text-xs text-slate-500">Total profit ($)</span>
          <input
            type="number"
            value={totalProfit}
            onChange={(e) => setTotalProfit(Number(e.target.value))}
            className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-200"
          />
        </label>
      </div>
      <div className="mt-6 rounded-lg border border-slate-800/60 bg-slate-900/50 p-4 text-center">
        <p className="font-mono text-[10px] uppercase text-slate-500">Consistency score</p>
        <p className="mt-1 font-mono text-4xl font-bold text-cyan-terminal">
          {result.pct.toFixed(1)}%
        </p>
        <p
          className={cn(
            "mt-2 font-mono text-sm font-semibold",
            result.pass ? "text-emerald-400" : "text-red-400"
          )}
        >
          {result.pass ? "Within 20% rule ✓" : "Fails consistency — spread gains"}
        </p>
      </div>
    </GlassPanel>
  );
}