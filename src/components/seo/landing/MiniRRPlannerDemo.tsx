"use client";

import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";

export function MiniRRPlannerDemo() {
  const [entry, setEntry] = useState(100);
  const [stop, setStop] = useState(98);
  const [target, setTarget] = useState(105);

  const result = useMemo(() => {
    const risk = Math.abs(entry - stop);
    const reward = Math.abs(target - entry);
    const rr = risk > 0 ? reward / risk : 0;
    return { risk, reward, rr };
  }, [entry, stop, target]);

  return (
    <GlassPanel className="border-cyan-accent/25 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
          R:R Trade Planner Demo
        </h3>
        <Badge variant="success">Free demo</Badge>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Entry", value: entry, set: setEntry },
          { label: "Stop", value: stop, set: setStop },
          { label: "Target", value: target, set: setTarget },
        ].map((f) => (
          <label key={f.label} className="block">
            <span className="font-mono text-xs text-slate-500">{f.label}</span>
            <input
              type="number"
              step={0.01}
              value={f.value}
              onChange={(e) => f.set(Number(e.target.value))}
              className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-200"
            />
          </label>
        ))}
      </div>
      <div className="mt-6 rounded-lg border border-slate-800/60 bg-slate-900/50 p-4 text-center">
        <p className="font-mono text-[10px] uppercase text-slate-500">Risk : Reward</p>
        <p className="mt-1 font-mono text-4xl font-bold text-cyan-terminal">
          1 : {result.rr.toFixed(2)}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Premium Trade Planner adds ladders, partials, and time rules
        </p>
      </div>
    </GlassPanel>
  );
}