"use client";

import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { runMonteCarlo } from "@/lib/market-data/monte-carlo";
import { cn } from "@/lib/utils";

export function MonteCarloSimulator() {
  const [winRate, setWinRate] = useState("55");
  const [riskReward, setRiskReward] = useState("2");
  const [tradesPerMonth, setTradesPerMonth] = useState("40");
  const [startingBalance, setStartingBalance] = useState("100000");
  const [maxDrawdown, setMaxDrawdown] = useState("10");
  const [dailyLossLimit, setDailyLossLimit] = useState("5");
  const [runKey, setRunKey] = useState(0);

  const result = useMemo(() => {
    void runKey;
    return runMonteCarlo({
      winRate: Number(winRate),
      riskReward: Number(riskReward),
      tradesPerMonth: Number(tradesPerMonth),
      startingBalance: Number(startingBalance),
      maxDrawdownPercent: Number(maxDrawdown),
      dailyLossLimitPercent: Number(dailyLossLimit),
      simulations: 10000,
      horizonDays: 30,
    });
  }, [
    winRate,
    riskReward,
    tradesPerMonth,
    startingBalance,
    maxDrawdown,
    dailyLossLimit,
    runKey,
  ]);

  const ruinColor =
    result.probabilityOfRuin > 25
      ? "text-red-400"
      : result.probabilityOfRuin > 10
      ? "text-amber-400"
      : "text-emerald-400";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <GlassPanel className="p-6">
        <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
          Strategy Parameters
        </h3>
        <div className="mt-4 space-y-4">
          <Input label="Win Rate (%)" value={winRate} onChange={(e) => setWinRate(e.target.value)} type="number" />
          <Input label="Risk : Reward" value={riskReward} onChange={(e) => setRiskReward(e.target.value)} type="number" />
          <Input label="Trades / Month" value={tradesPerMonth} onChange={(e) => setTradesPerMonth(e.target.value)} type="number" />
          <Input label="Starting Balance ($)" value={startingBalance} onChange={(e) => setStartingBalance(e.target.value)} type="number" />
          <Input label="Max Drawdown (%)" value={maxDrawdown} onChange={(e) => setMaxDrawdown(e.target.value)} type="number" />
          <Input label="Daily Loss Limit (%)" value={dailyLossLimit} onChange={(e) => setDailyLossLimit(e.target.value)} type="number" />
          <Button variant="primary" className="w-full" onClick={() => setRunKey((k) => k + 1)}>
            Run 10,000 Simulations
          </Button>
        </div>
      </GlassPanel>

      <div className="space-y-6">
        <TerminalPanel title="Probability of Ruin Report" status="online">
          <div className="text-center">
            <p className="font-mono text-[10px] uppercase text-slate-500">
              Probability of Ruin
            </p>
            <p className={cn("font-mono text-5xl font-bold", ruinColor)}>
              {result.probabilityOfRuin}%
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <GlassPanel className="p-3 text-center">
              <p className="font-mono text-[10px] text-slate-500">P10 Balance</p>
              <p className="font-mono text-sm font-bold text-red-400">
                ${result.p10EndingBalance.toLocaleString()}
              </p>
            </GlassPanel>
            <GlassPanel className="p-3 text-center">
              <p className="font-mono text-[10px] text-slate-500">Median</p>
              <p className="font-mono text-sm font-bold text-cyan-accent">
                ${result.medianEndingBalance.toLocaleString()}
              </p>
            </GlassPanel>
            <GlassPanel className="p-3 text-center">
              <p className="font-mono text-[10px] text-slate-500">P90 Balance</p>
              <p className="font-mono text-sm font-bold text-emerald-400">
                ${result.p90EndingBalance.toLocaleString()}
              </p>
            </GlassPanel>
          </div>

          <div className="mt-6">
            <p className="mb-2 font-mono text-[10px] uppercase text-slate-500">
              Sample Equity Paths
            </p>
            <div className="relative h-32 overflow-hidden rounded-lg border border-slate-700/50 bg-slate-950">
              <svg viewBox="0 0 400 120" className="h-full w-full" preserveAspectRatio="none">
                {result.equityCurves.map((curve, i) => {
                  const max = Math.max(...curve, 1);
                  const points = curve
                    .map((v, idx) => {
                      const x = (idx / (curve.length - 1)) * 400;
                      const y = 120 - (v / max) * 100;
                      return `${x},${y}`;
                    })
                    .join(" ");
                  return (
                    <polyline
                      key={i}
                      fill="none"
                      stroke={i === 0 ? "#00E5FF" : "rgba(0,229,255,0.25)"}
                      strokeWidth={i === 0 ? 2 : 1}
                      points={points}
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        </TerminalPanel>

        <TerminalPanel title="Daily Lot-Size Checklist" status="warning">
          <div className="space-y-2">
            {result.dailyLotChecklist.map((row) => (
              <div
                key={row.day}
                className="flex items-center justify-between rounded border border-slate-700/40 bg-slate-900/50 px-4 py-2"
              >
                <span className="font-mono text-xs text-slate-400">Day {row.day}</span>
                <span className="font-mono text-xs text-slate-500">
                  Risk budget: ${row.riskBudget.toLocaleString()}
                </span>
                <span className="font-mono text-sm font-bold text-cyan-accent">
                  Max {row.maxLots} lots
                </span>
              </div>
            ))}
          </div>
        </TerminalPanel>
      </div>
    </div>
  );
}