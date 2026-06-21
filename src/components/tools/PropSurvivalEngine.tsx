"use client";

import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { ScoreRing } from "@/components/tools/qs/ScoreRing";
import { computePropSurvival } from "@/lib/quicksilver/prop-survival";
import { cn } from "@/lib/utils";

export function PropSurvivalEngine() {
  const [winRate, setWinRate] = useState("55");
  const [riskReward, setRiskReward] = useState("2");
  const [tradesPerMonth, setTradesPerMonth] = useState("40");
  const [startingBalance, setStartingBalance] = useState("100000");
  const [maxDrawdown, setMaxDrawdown] = useState("10");
  const [dailyLossLimit, setDailyLossLimit] = useState("5");
  const [profitTarget, setProfitTarget] = useState("10");
  const [runKey, setRunKey] = useState(0);

  const result = useMemo(() => {
    void runKey;
    return computePropSurvival({
      winRate: Number(winRate),
      riskReward: Number(riskReward),
      tradesPerMonth: Number(tradesPerMonth),
      startingBalance: Number(startingBalance),
      maxDrawdownPercent: Number(maxDrawdown),
      dailyLossLimitPercent: Number(dailyLossLimit),
      profitTargetPercent: Number(profitTarget),
      simulations: 10000,
      horizonDays: 30,
    });
  }, [winRate, riskReward, tradesPerMonth, startingBalance, maxDrawdown, dailyLossLimit, profitTarget, runKey]);

  const verdictColor = {
    DEPLOY: "text-emerald-400",
    OPTIMIZE: "text-amber-400",
    HALT: "text-red-400",
  }[result.qsVerdict];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <GlassPanel className="p-6">
        <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
          Prop Firm Parameters
        </h3>
        <div className="mt-4 space-y-4">
          <Input label="Win Rate (%)" value={winRate} onChange={(e) => setWinRate(e.target.value)} type="number" />
          <Input label="Risk : Reward" value={riskReward} onChange={(e) => setRiskReward(e.target.value)} type="number" />
          <Input label="Trades / Month" value={tradesPerMonth} onChange={(e) => setTradesPerMonth(e.target.value)} type="number" />
          <Input label="Account Size ($)" value={startingBalance} onChange={(e) => setStartingBalance(e.target.value)} type="number" />
          <Input label="Max Drawdown (%)" value={maxDrawdown} onChange={(e) => setMaxDrawdown(e.target.value)} type="number" />
          <Input label="Daily Loss Limit (%)" value={dailyLossLimit} onChange={(e) => setDailyLossLimit(e.target.value)} type="number" />
          <Input label="Profit Target (%)" value={profitTarget} onChange={(e) => setProfitTarget(e.target.value)} type="number" />
          <Button variant="primary" className="w-full" onClick={() => setRunKey((k) => k + 1)}>
            Run 10,000 QS Simulations
          </Button>
        </div>
      </GlassPanel>

      <div className="space-y-6">
        <TerminalPanel title="QS Prop Survival Engine™" status="online">
          <div className="flex flex-wrap items-center justify-around gap-6">
            <ScoreRing score={Math.round(result.probabilityOfPass)} label="Pass Rate" grade={result.survivalGrade} />
            <div className="space-y-3 text-center">
              <div>
                <p className="font-mono text-[10px] uppercase text-slate-500">Probability of Ruin</p>
                <p className={cn("font-mono text-3xl font-bold", result.probabilityOfRuin > 15 ? "text-red-400" : "text-emerald-400")}>
                  {result.probabilityOfRuin}%
                </p>
              </div>
              <p className={cn("font-mono text-lg font-bold", verdictColor)}>{result.qsVerdict}</p>
            </div>
          </div>
        </TerminalPanel>

        <div className="grid gap-3 sm:grid-cols-3">
          <GlassPanel className="p-3 text-center">
            <p className="font-mono text-[10px] text-slate-500">P10 Balance</p>
            <p className="font-mono text-sm font-bold text-red-400">${result.p10EndingBalance.toLocaleString()}</p>
          </GlassPanel>
          <GlassPanel className="p-3 text-center">
            <p className="font-mono text-[10px] text-slate-500">Median</p>
            <p className="font-mono text-sm font-bold text-cyan-accent">${result.medianEndingBalance.toLocaleString()}</p>
          </GlassPanel>
          <GlassPanel className="p-3 text-center">
            <p className="font-mono text-[10px] text-slate-500">P90 Balance</p>
            <p className="font-mono text-sm font-bold text-emerald-400">${result.p90EndingBalance.toLocaleString()}</p>
          </GlassPanel>
        </div>

        <GlassPanel className="p-4 text-center">
          <p className="font-mono text-[10px] uppercase text-slate-500">Expected Days to Pass Target</p>
          <p className="font-mono text-2xl font-bold text-slate-200">{result.expectedDaysToTarget} days</p>
        </GlassPanel>

        <TerminalPanel title="Daily Lot-Size Checklist" status="warning">
          <div className="space-y-2">
            {result.dailyLotChecklist.map((row) => (
              <div key={row.day} className="flex items-center justify-between rounded border border-slate-700/40 bg-slate-900/50 px-4 py-2">
                <span className="font-mono text-xs text-slate-400">Day {row.day}</span>
                <span className="font-mono text-xs text-slate-500">Risk: ${row.riskBudget.toLocaleString()}</span>
                <span className="font-mono text-sm font-bold text-cyan-accent">Max {row.maxLots} lots</span>
              </div>
            ))}
          </div>
        </TerminalPanel>

        {result.breachScenarios.length > 0 && (
          <TerminalPanel title="Breach Scenarios" status="offline">
            <ul className="space-y-2">
              {result.breachScenarios.map((s, i) => (
                <li key={i} className="font-mono text-xs text-red-300">✕ {s}</li>
              ))}
            </ul>
          </TerminalPanel>
        )}
      </div>
    </div>
  );
}