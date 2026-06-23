"use client";

import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import Input from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ComparisonBars } from "@/components/tools/qs/ComparisonBars";
import { ScoreRing } from "@/components/tools/qs/ScoreRing";
import { computeAlphaDurability } from "@/lib/quicksilver/alpha-durability";
import { cn } from "@/lib/utils";

export function AlphaDurabilityEngine() {
  const [totalTrades, setTotalTrades] = useState("150");
  const [winRate, setWinRate] = useState("58");
  const [avgWinR, setAvgWinR] = useState("2.1");
  const [avgLossR, setAvgLossR] = useState("1");
  const [monthsActive, setMonthsActive] = useState("8");
  const [recentWinRate, setRecentWinRate] = useState("54");

  const result = useMemo(
    () =>
      computeAlphaDurability({
        totalTrades: Number(totalTrades),
        winRate: Number(winRate),
        avgWinR: Number(avgWinR),
        avgLossR: Number(avgLossR),
        monthsActive: Number(monthsActive),
        recentWinRate: Number(recentWinRate),
      }),
    [totalTrades, winRate, avgWinR, avgLossR, monthsActive, recentWinRate]
  );

  const statusColor = {
    STRENGTHENING: "text-emerald-400",
    STABLE: "text-cyan-accent",
    ERODING: "text-amber-400",
    EXPIRED: "text-red-400",
  }[result.edgeStatus];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <GlassPanel className="p-6">
        <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
          Journal Stats (your trade history)
        </h3>
        <div className="mt-4 space-y-4">
          <Input label="Total Trades" value={totalTrades} onChange={(e) => setTotalTrades(e.target.value)} type="number" />
          <Input label="Win Rate (%)" value={winRate} onChange={(e) => setWinRate(e.target.value)} type="number" />
          <Input label="Recent Win Rate (%)" value={recentWinRate} onChange={(e) => setRecentWinRate(e.target.value)} type="number" />
          <Input label="Avg Win (R)" value={avgWinR} onChange={(e) => setAvgWinR(e.target.value)} type="number" />
          <Input label="Avg Loss (R)" value={avgLossR} onChange={(e) => setAvgLossR(e.target.value)} type="number" />
          <Input label="Months Active" value={monthsActive} onChange={(e) => setMonthsActive(e.target.value)} type="number" />
        </div>
      </GlassPanel>

      <div className="space-y-6">
        <TerminalPanel title="QS Alpha Durability Engine™" status="online">
          <div className="flex flex-wrap items-center justify-around gap-6">
            <ScoreRing score={result.qsAlphaIndex} label="Alpha Index" grade={result.durabilityGrade} />
            <div className="space-y-3 text-center">
              <div>
                <p className="font-mono text-[10px] uppercase text-slate-500">Edge Status</p>
                <p className={cn("font-mono text-xl font-bold", statusColor)}>{result.edgeStatus}</p>
              </div>
              <Badge variant="success">{result.sampleAdequacy}</Badge>
              <p className="font-mono text-xs text-slate-500">Expectancy: {result.expectancyPerTrade}R/trade</p>
            </div>
          </div>
        </TerminalPanel>

        <TerminalPanel title="Win Rate Trend">
          <ComparisonBars
            items={[
              {
                label: "Historical win rate",
                value: Number(winRate),
                color: "#22d3ee",
              },
              {
                label: "Recent win rate",
                value: Number(recentWinRate),
                color: Number(recentWinRate) >= Number(winRate) ? "#34d399" : "#f87171",
              },
              {
                label: "Confidence level",
                value: result.confidenceLevel,
                color: "#a78bfa",
              },
            ]}
          />
        </TerminalPanel>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: "Z-Score", value: result.zScore },
            { label: "Confidence", value: `${result.confidenceLevel}%` },
            { label: "Alpha Half-Life", value: `${result.alphaHalfLifeMonths} mo` },
            { label: "Decay Rate", value: `${result.decayRate}%` },
          ].map((item) => (
            <GlassPanel key={item.label} className="p-3 text-center">
              <p className="font-mono text-[10px] text-slate-500">{item.label}</p>
              <p className="font-mono text-sm font-bold text-slate-200">{item.value}</p>
            </GlassPanel>
          ))}
        </div>

        <TerminalPanel title="QS Alpha Diagnostics" status="warning">
          <ul className="space-y-2">
            {result.diagnostics.map((d, i) => (
              <li key={i} className="font-mono text-xs text-slate-400">→ {d}</li>
            ))}
          </ul>
        </TerminalPanel>
      </div>
    </div>
  );
}