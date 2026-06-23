"use client";

import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";

export function MiniRiskCalculatorDemo() {
  const [balance, setBalance] = useState(10000);
  const [riskPct, setRiskPct] = useState(1);
  const [stopPips, setStopPips] = useState(20);

  const result = useMemo(() => {
    const riskAmount = balance * (riskPct / 100);
    const pipValue = 10;
    const lots = stopPips > 0 ? riskAmount / (stopPips * pipValue) : 0;
    return { riskAmount, lots: Math.max(0, lots) };
  }, [balance, riskPct, stopPips]);

  return (
    <GlassPanel className="border-cyan-accent/25 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
          Free Risk Calculator Demo
        </h3>
        <Badge variant="success">No login required</Badge>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="font-mono text-xs text-slate-500">Account ($)</span>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-200"
          />
        </label>
        <label className="block">
          <span className="font-mono text-xs text-slate-500">Risk %</span>
          <input
            type="number"
            step={0.1}
            value={riskPct}
            onChange={(e) => setRiskPct(Number(e.target.value))}
            className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-200"
          />
        </label>
        <label className="block">
          <span className="font-mono text-xs text-slate-500">Stop (pips)</span>
          <input
            type="number"
            value={stopPips}
            onChange={(e) => setStopPips(Number(e.target.value))}
            className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-200"
          />
        </label>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-800/60 bg-slate-900/50 p-4 text-center">
          <p className="font-mono text-[10px] uppercase text-slate-500">Risk $</p>
          <p className="mt-1 font-mono text-2xl font-bold text-amber-400">
            ${result.riskAmount.toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-800/60 bg-slate-900/50 p-4 text-center">
          <p className="font-mono text-[10px] uppercase text-slate-500">Suggested lots</p>
          <p className="mt-1 font-mono text-2xl font-bold text-cyan-terminal">
            {result.lots.toFixed(2)}
          </p>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Premium Risk Matrix adds Kelly sizing, correlation heat, and portfolio limits
      </p>
    </GlassPanel>
  );
}