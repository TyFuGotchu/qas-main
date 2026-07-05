"use client";

import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import Input from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { computeStrategyExpectancy } from "@/lib/quicksilver/expectancy-validator";
import { cn } from "@/lib/utils";

export function ExpectancyValidator() {
  const [totalTrades, setTotalTrades] = useState("100");
  const [wins, setWins] = useState("55");
  const [avgRR, setAvgRR] = useState("1.5");

  const result = useMemo(
    () =>
      computeStrategyExpectancy({
        totalTrades: Number(totalTrades),
        wins: Number(wins),
        avgRR: Number(avgRR),
      }),
    [totalTrades, wins, avgRR]
  );

  const color =
    result.verdict === "positive"
      ? "text-emerald-400"
      : result.verdict === "negative"
        ? "text-red-400"
        : "text-amber-400";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <GlassPanel className="p-6">
        <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
          Strategy Inputs
        </h3>
        <div className="mt-4 space-y-4">
          <Input label="Total Trades" value={totalTrades} onChange={(e) => setTotalTrades(e.target.value)} type="number" />
          <Input label="Wins" value={wins} onChange={(e) => setWins(e.target.value)} type="number" />
          <Input label="Average R:R" value={avgRR} onChange={(e) => setAvgRR(e.target.value)} type="number" step="0.1" />
        </div>
      </GlassPanel>
      <TerminalPanel title="Strategy Expectancy">
        <p className={cn("font-mono text-4xl font-bold", color)}>
          {result.expectancy >= 0 ? "+" : ""}
          {result.expectancy.toFixed(3)}R
        </p>
        <p className="mt-2 font-mono text-xs text-slate-500">per trade (R-multiples)</p>
        <Badge
          variant={result.verdict === "positive" ? "success" : result.verdict === "negative" ? "danger" : "warning"}
          className="mt-4"
        >
          {result.verdict === "positive" ? "Positive Edge" : result.verdict === "negative" ? "Negative Edge" : "Break-Even"}
        </Badge>
        <p className="mt-4 text-sm text-slate-400">{result.message}</p>
      </TerminalPanel>
    </div>
  );
}