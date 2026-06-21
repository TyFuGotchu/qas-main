"use client";

import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import Input from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { computeExecutionProtocol } from "@/lib/quicksilver/execution-protocol";
import { cn } from "@/lib/utils";

export function ExecutionProtocol() {
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [entry, setEntry] = useState("4150");
  const [stop, setStop] = useState("4140");
  const [accountSize, setAccountSize] = useState("100000");
  const [riskPercent, setRiskPercent] = useState("1");
  const [scaleLevels, setScaleLevels] = useState("3");
  const [trailing, setTrailing] = useState(true);

  const result = useMemo(
    () =>
      computeExecutionProtocol({
        direction,
        entryPrice: Number(entry),
        stopPrice: Number(stop),
        accountSize: Number(accountSize),
        riskPercent: Number(riskPercent),
        scaleOutLevels: Number(scaleLevels),
        useTrailingStop: trailing,
      }),
    [direction, entry, stop, accountSize, riskPercent, scaleLevels, trailing]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <GlassPanel className="p-6">
        <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
          Trade Setup
        </h3>
        <div className="mt-4 space-y-4">
          <div className="flex gap-2">
            {(["long", "short"] as const).map((d) => (
              <button key={d} type="button" onClick={() => setDirection(d)} className={cn("flex-1 rounded border px-3 py-2 font-mono text-xs uppercase transition-all", direction === d ? "border-cyan-accent/40 bg-cyan-accent/10 text-cyan-accent" : "border-slate-700 text-slate-500")}>
                {d}
              </button>
            ))}
          </div>
          <Input label="Entry Price" value={entry} onChange={(e) => setEntry(e.target.value)} type="number" />
          <Input label="Stop Price" value={stop} onChange={(e) => setStop(e.target.value)} type="number" />
          <Input label="Account Size ($)" value={accountSize} onChange={(e) => setAccountSize(e.target.value)} type="number" />
          <Input label="Risk (%)" value={riskPercent} onChange={(e) => setRiskPercent(e.target.value)} type="number" />
          <Input label="Scale-Out Levels (2-3)" value={scaleLevels} onChange={(e) => setScaleLevels(e.target.value)} type="number" />
          <label className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <input type="checkbox" checked={trailing} onChange={(e) => setTrailing(e.target.checked)} className="rounded border-slate-600" />
            Enable QS trailing stop
          </label>
        </div>
      </GlassPanel>

      <div className="space-y-6">
        <TerminalPanel title="QS Execution Protocol™" status="online">
          <div className="grid gap-3 sm:grid-cols-3">
            <GlassPanel className="p-3 text-center">
              <p className="font-mono text-[10px] text-slate-500">Position Size</p>
              <p className="font-mono text-lg font-bold text-cyan-accent">{result.positionSize}</p>
            </GlassPanel>
            <GlassPanel className="p-3 text-center">
              <p className="font-mono text-[10px] text-slate-500">Dollar Risk</p>
              <p className="font-mono text-lg font-bold text-slate-200">${result.dollarRisk.toLocaleString()}</p>
            </GlassPanel>
            <GlassPanel className="p-3 text-center">
              <p className="font-mono text-[10px] text-slate-500">Protocol Tier</p>
              <Badge variant="success" className="mt-1">{result.protocolTier}</Badge>
            </GlassPanel>
          </div>
        </TerminalPanel>

        <TerminalPanel title="Entry Ladder">
          <div className="space-y-2">
            {result.entryLadder.map((level) => (
              <div key={level.label} className="flex items-center justify-between rounded border border-slate-700/40 bg-slate-900/50 px-4 py-2">
                <div>
                  <p className="font-mono text-xs font-semibold text-slate-300">{level.label}</p>
                  <p className="font-mono text-[10px] text-slate-600">{level.action}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-bold text-cyan-accent">{level.price}</p>
                  <p className="font-mono text-[10px] text-slate-500">{level.sizePercent}% · {level.rMultiple}R</p>
                </div>
              </div>
            ))}
          </div>
        </TerminalPanel>

        <TerminalPanel title="Take-Profit Ladder">
          <div className="space-y-2">
            {result.takeProfitLadder.map((level) => (
              <div key={level.label} className="flex items-center justify-between rounded border border-emerald-500/20 bg-emerald-500/5 px-4 py-2">
                <div>
                  <p className="font-mono text-xs font-semibold text-emerald-300">{level.label}</p>
                  <p className="font-mono text-[10px] text-slate-600">{level.action}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-bold text-emerald-400">{level.price}</p>
                  <p className="font-mono text-[10px] text-slate-500">{level.sizePercent}% · +{level.rMultiple}R</p>
                </div>
              </div>
            ))}
          </div>
        </TerminalPanel>

        <TerminalPanel title="Protocol Directives" status="warning">
          <ul className="space-y-2">
            {result.executionNotes.map((note, i) => (
              <li key={i} className="font-mono text-xs text-slate-400">→ {note}</li>
            ))}
          </ul>
        </TerminalPanel>
      </div>
    </div>
  );
}