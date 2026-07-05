"use client";

import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import Input from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  computeStructuralPipRange,
  parsePriceList,
} from "@/lib/quicksilver/atr-pip-range";

export function AtrPipRangeCalculator() {
  const [highsRaw, setHighsRaw] = useState("1.0850, 1.0862, 1.0871, 1.0880, 1.0892");
  const [lowsRaw, setLowsRaw] = useState("1.0820, 1.0831, 1.0838, 1.0845, 1.0855");
  const [pipMult, setPipMult] = useState("10000");

  const result = useMemo(() => {
    return computeStructuralPipRange({
      highs: parsePriceList(highsRaw),
      lows: parsePriceList(lowsRaw),
      pipMultiplier: Number(pipMult) || 10000,
    });
  }, [highsRaw, lowsRaw, pipMult]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <GlassPanel className="p-6">
        <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
          Recent Highs / Lows
        </h3>
        <div className="mt-4 space-y-4">
          <label className="block">
            <span className="mb-1 block font-mono text-xs text-slate-500">Recent Highs (comma-separated)</span>
            <textarea
              className="w-full rounded-lg border border-slate-700/60 bg-slate-950/60 px-3 py-2 font-mono text-sm text-slate-200"
              rows={3}
              value={highsRaw}
              onChange={(e) => setHighsRaw(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs text-slate-500">Recent Lows (comma-separated)</span>
            <textarea
              className="w-full rounded-lg border border-slate-700/60 bg-slate-950/60 px-3 py-2 font-mono text-sm text-slate-200"
              rows={3}
              value={lowsRaw}
              onChange={(e) => setLowsRaw(e.target.value)}
            />
          </label>
          <Input
            label="Pip Multiplier (10000 forex, 10 XAUUSD)"
            value={pipMult}
            onChange={(e) => setPipMult(e.target.value)}
            type="number"
          />
        </div>
      </GlassPanel>
      <TerminalPanel title="Structural Pip Range">
        {result ? (
          <>
            <p className="font-mono text-4xl font-bold text-emerald-400">
              {result.structuralPips.toFixed(1)} pips
            </p>
            <Badge variant="success" className="mt-4">
              {result.periodCount} periods averaged
            </Badge>
            <p className="mt-4 text-sm text-slate-400">{result.message}</p>
          </>
        ) : (
          <p className="text-sm text-slate-500">Need at least 2 matched high/low pairs.</p>
        )}
      </TerminalPanel>
    </div>
  );
}