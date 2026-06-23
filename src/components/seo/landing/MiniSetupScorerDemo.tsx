"use client";

import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export function MiniSetupScorerDemo({ marketName }: { marketName?: string }) {
  const [structure, setStructure] = useState(4);
  const [momentum, setMomentum] = useState(3);
  const [riskReward, setRiskReward] = useState(2);

  const score = useMemo(() => {
    const rrScore = Math.min(5, riskReward * 1.5);
    const raw = (structure + momentum + rrScore) / 3;
    return Math.round(raw * 20);
  }, [structure, momentum, riskReward]);

  const verdict =
    score >= 75 ? "Strong Setup" : score >= 55 ? "Reduce Size" : score >= 40 ? "Wait" : "Skip";

  const verdictColor =
    score >= 75
      ? "text-emerald-400"
      : score >= 55
        ? "text-cyan-accent"
        : score >= 40
          ? "text-amber-400"
          : "text-red-400";

  return (
    <GlassPanel className="border-cyan-accent/25 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
          Free Setup Scorer Demo
        </h3>
        <Badge variant="success">No login required</Badge>
      </div>
      {marketName && (
        <p className="mt-2 text-xs text-slate-500">
          Preview scoring for <strong className="text-slate-400">{marketName}</strong> setups
        </p>
      )}
      <div className="mt-5 space-y-4">
        {[
          { label: "Structure alignment (1–5)", value: structure, set: setStructure },
          { label: "Momentum quality (1–5)", value: momentum, set: setMomentum },
          { label: "Risk : Reward", value: riskReward, set: setRiskReward, min: 1, max: 5, step: 0.5 },
        ].map((field) => (
          <label key={field.label} className="block">
            <span className="font-mono text-xs text-slate-500">{field.label}</span>
            <input
              type="range"
              min={field.min ?? 1}
              max={field.max ?? 5}
              step={field.step ?? 1}
              value={field.value}
              onChange={(e) => field.set(Number(e.target.value))}
              className="mt-2 w-full accent-cyan-accent"
            />
            <span className="font-mono text-xs text-slate-400">{field.value}</span>
          </label>
        ))}
      </div>
      <div className="mt-6 rounded-lg border border-slate-800/60 bg-slate-900/50 p-4 text-center">
        <p className="font-mono text-[10px] uppercase text-slate-500">QS Edge Preview</p>
        <p className="mt-1 font-mono text-4xl font-bold text-cyan-terminal">{score}</p>
        <p className={cn("mt-2 font-mono text-sm font-semibold", verdictColor)}>{verdict}</p>
        <p className="mt-2 text-xs text-slate-500">
          Premium unlocks 7 confluence layers + exportable scorecards
        </p>
      </div>
    </GlassPanel>
  );
}