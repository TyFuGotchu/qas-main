"use client";

import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import Input from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { FactorBar } from "@/components/tools/qs/FactorBar";
import { computeRegimeOracle } from "@/lib/quicksilver/regime-oracle";
import { cn } from "@/lib/utils";

export function RegimeOracle() {
  const [atrPercentile, setAtrPercentile] = useState("65");
  const [rangeCompression, setRangeCompression] = useState("40");
  const [directionalBias, setDirectionalBias] = useState("55");
  const [volumeState, setVolumeState] = useState<"declining" | "stable" | "surging">("stable");
  const [sessionPhase, setSessionPhase] = useState<"open" | "mid" | "close" | "overnight">("mid");

  const result = useMemo(
    () =>
      computeRegimeOracle({
        atrPercentile: Number(atrPercentile),
        rangeCompression: Number(rangeCompression),
        directionalBias: Number(directionalBias),
        volumeState,
        sessionPhase,
      }),
    [atrPercentile, rangeCompression, directionalBias, volumeState, sessionPhase]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <GlassPanel className="p-6">
        <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
          Market State Inputs
        </h3>
        <div className="mt-4 space-y-4">
          <Input label="ATR Percentile (0-100)" value={atrPercentile} onChange={(e) => setAtrPercentile(e.target.value)} type="number" />
          <Input label="Range Compression (0-100)" value={rangeCompression} onChange={(e) => setRangeCompression(e.target.value)} type="number" />
          <Input label="Directional Bias (0-100)" value={directionalBias} onChange={(e) => setDirectionalBias(e.target.value)} type="number" />
          <label className="block">
            <span className="font-mono text-xs text-slate-500">Volume State</span>
            <select value={volumeState} onChange={(e) => setVolumeState(e.target.value as typeof volumeState)} className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-200">
              <option value="declining">Declining</option>
              <option value="stable">Stable</option>
              <option value="surging">Surging</option>
            </select>
          </label>
          <label className="block">
            <span className="font-mono text-xs text-slate-500">Session Phase</span>
            <select value={sessionPhase} onChange={(e) => setSessionPhase(e.target.value as typeof sessionPhase)} className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-200">
              <option value="open">Open</option>
              <option value="mid">Mid-Session</option>
              <option value="close">Close</option>
              <option value="overnight">Overnight</option>
            </select>
          </label>
        </div>
      </GlassPanel>

      <div className="space-y-6">
        <TerminalPanel title="QS Regime Oracle™" status="online">
          <div className="text-center">
            <p className="font-mono text-[10px] uppercase text-slate-500">Primary Regime</p>
            <p className="mt-1 font-mono text-2xl font-bold text-cyan-accent">{result.regimeLabel}</p>
            <div className="mt-3 flex items-center justify-center gap-3">
              <Badge variant="success">{result.confidence}% confidence</Badge>
              <Badge variant="warning">{result.riskMultiplier}x risk</Badge>
            </div>
          </div>
        </TerminalPanel>

        <TerminalPanel title="Regime Probability Stack">
          <div className="space-y-3">
            {result.signals.slice(0, 5).map((s) => (
              <FactorBar
                key={s.regime}
                label={s.regime.replace("_", " ").toUpperCase()}
                score={s.probability}
              />
            ))}
          </div>
        </TerminalPanel>

        <TerminalPanel title="QS Playbook">
          <p className="font-mono text-sm text-slate-300">{result.playbook}</p>
          <p className="mt-3 font-mono text-xs text-slate-500">{result.sessionBias}</p>
        </TerminalPanel>

        <TerminalPanel title="Protocol Directives" status="warning">
          <ul className="space-y-2">
            {result.protocolDirectives.map((d, i) => (
              <li key={i} className={cn("font-mono text-xs", result.primaryRegime === "chaos" ? "text-red-300" : "text-slate-400")}>
                → {d}
              </li>
            ))}
          </ul>
        </TerminalPanel>
      </div>
    </div>
  );
}