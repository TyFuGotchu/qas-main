"use client";

import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import Input from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { FactorBar } from "@/components/tools/qs/FactorBar";
import { ScoreRing } from "@/components/tools/qs/ScoreRing";
import {
  computeEdgeConfluence,
  type MomentumPhase,
  type SessionContext,
  type VolatilityRegime,
} from "@/lib/quicksilver/edge-confluence";
import { cn } from "@/lib/utils";

export function EdgeConfluenceEngine() {
  const [structure, setStructure] = useState("4");
  const [momentum, setMomentum] = useState<MomentumPhase>("impulse");
  const [volatility, setVolatility] = useState<VolatilityRegime>("normal");
  const [session, setSession] = useState<SessionContext>("london_ny_overlap");
  const [riskReward, setRiskReward] = useState("2.5");
  const [liquidity, setLiquidity] = useState("4");
  const [htfBias, setHtfBias] = useState<"bullish" | "bearish" | "neutral">("bullish");
  const [direction, setDirection] = useState<"long" | "short">("long");

  const result = useMemo(
    () =>
      computeEdgeConfluence({
        structureAlignment: Number(structure),
        momentumPhase: momentum,
        volatilityRegime: volatility,
        sessionContext: session,
        riskReward: Number(riskReward),
        liquidityProximity: Number(liquidity),
        higherTimeframeBias: htfBias,
        tradeDirection: direction,
      }),
    [structure, momentum, volatility, session, riskReward, liquidity, htfBias, direction]
  );

  const verdictColor = {
    EXECUTE: "text-emerald-400",
    SCALE_DOWN: "text-cyan-accent",
    WAIT: "text-amber-400",
    AVOID: "text-red-400",
  }[result.verdict];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <GlassPanel className="p-6">
        <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
          Setup Parameters
        </h3>
        <div className="mt-4 space-y-4">
          <Input label="Structure Alignment (1-5)" value={structure} onChange={(e) => setStructure(e.target.value)} type="number" />
          <Input label="Risk : Reward" value={riskReward} onChange={(e) => setRiskReward(e.target.value)} type="number" />
          <Input label="Liquidity Proximity (1-5)" value={liquidity} onChange={(e) => setLiquidity(e.target.value)} type="number" />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-xs text-slate-500">Momentum Phase</span>
              <select value={momentum} onChange={(e) => setMomentum(e.target.value as MomentumPhase)} className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-200">
                <option value="impulse">Impulse</option>
                <option value="accumulation">Accumulation</option>
                <option value="corrective">Corrective</option>
                <option value="exhaustion">Exhaustion</option>
              </select>
            </label>
            <label className="block">
              <span className="font-mono text-xs text-slate-500">Volatility Regime</span>
              <select value={volatility} onChange={(e) => setVolatility(e.target.value as VolatilityRegime)} className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-200">
                <option value="compressed">Compressed</option>
                <option value="normal">Normal</option>
                <option value="expanded">Expanded</option>
                <option value="extreme">Extreme</option>
              </select>
            </label>
            <label className="block">
              <span className="font-mono text-xs text-slate-500">Session</span>
              <select value={session} onChange={(e) => setSession(e.target.value as SessionContext)} className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-200">
                <option value="london_ny_overlap">London × NY Overlap</option>
                <option value="london">London</option>
                <option value="newyork">New York</option>
                <option value="asia">Asia</option>
                <option value="off_hours">Off Hours</option>
              </select>
            </label>
            <label className="block">
              <span className="font-mono text-xs text-slate-500">Trade Direction</span>
              <select value={direction} onChange={(e) => setDirection(e.target.value as "long" | "short")} className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-200">
                <option value="long">Long</option>
                <option value="short">Short</option>
              </select>
            </label>
          </div>
          <div className="flex gap-2">
            {(["bullish", "neutral", "bearish"] as const).map((b) => (
              <button key={b} type="button" onClick={() => setHtfBias(b)} className={cn("flex-1 rounded border px-3 py-2 font-mono text-xs capitalize transition-all", htfBias === b ? "border-cyan-accent/40 bg-cyan-accent/10 text-cyan-accent" : "border-slate-700 text-slate-500 hover:border-slate-600")}>
                HTF {b}
              </button>
            ))}
          </div>
        </div>
      </GlassPanel>

      <div className="space-y-6">
        <TerminalPanel title="QS Edge Index™" status="online">
          <div className="flex flex-wrap items-center justify-around gap-6">
            <ScoreRing score={result.qsEdgeScore} label="Edge Score" grade={result.grade} />
            <div className="text-center">
              <p className="font-mono text-[10px] uppercase text-slate-500">Verdict</p>
              <p className={cn("mt-1 font-mono text-2xl font-bold", verdictColor)}>{result.verdict}</p>
              <Badge variant="success" className="mt-3">{result.confluenceLayers}/7 layers active</Badge>
              <p className="mt-2 font-mono text-xs text-slate-500">Asymmetry: {result.asymmetryRating}</p>
            </div>
          </div>
        </TerminalPanel>

        <TerminalPanel title="Confluence Factor Breakdown">
          <div className="space-y-4">
            {result.factors.map((f) => (
              <FactorBar key={f.label} label={f.label} score={Math.round(f.score)} note={f.note} />
            ))}
          </div>
        </TerminalPanel>

        <TerminalPanel title="QS Protocol Directives" status="warning">
          <ul className="space-y-2">
            {result.protocolNotes.map((note, i) => (
              <li key={i} className="font-mono text-xs text-slate-400">→ {note}</li>
            ))}
          </ul>
        </TerminalPanel>
      </div>
    </div>
  );
}