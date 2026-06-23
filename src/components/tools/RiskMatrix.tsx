"use client";

import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import Input from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { HeatGauge } from "@/components/tools/qs/HeatGauge";
import { ComparisonBars } from "@/components/tools/qs/ComparisonBars";
import { ScoreRing } from "@/components/tools/qs/ScoreRing";
import { computeRiskMatrix } from "@/lib/quicksilver/risk-matrix";
import { cn } from "@/lib/utils";

export function RiskMatrix() {
  const [accountSize, setAccountSize] = useState("100000");
  const [riskPerTrade, setRiskPerTrade] = useState("1");
  const [openPositions, setOpenPositions] = useState("3");
  const [correlation, setCorrelation] = useState("0.35");
  const [winRate, setWinRate] = useState("55");
  const [avgRR, setAvgRR] = useState("2");
  const [maxDailyLoss, setMaxDailyLoss] = useState("5");
  const [maxDrawdown, setMaxDrawdown] = useState("10");

  const result = useMemo(
    () =>
      computeRiskMatrix({
        accountSize: Number(accountSize),
        riskPerTradePercent: Number(riskPerTrade),
        openPositions: Number(openPositions),
        avgPositionCorrelation: Number(correlation),
        winRate: Number(winRate),
        avgRiskReward: Number(avgRR),
        maxDailyLossPercent: Number(maxDailyLoss),
        maxDrawdownPercent: Number(maxDrawdown),
      }),
    [accountSize, riskPerTrade, openPositions, correlation, winRate, avgRR, maxDailyLoss, maxDrawdown]
  );

  const heatColor = {
    SAFE: "text-emerald-400",
    ELEVATED: "text-amber-400",
    CRITICAL: "text-red-400",
  }[result.heatStatus];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <GlassPanel className="p-6">
        <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
          Your Risk Inputs (not linked to any account)
        </h3>
        <div className="mt-4 space-y-4">
          <Input label="Trading Capital ($)" value={accountSize} onChange={(e) => setAccountSize(e.target.value)} type="number" />
          <Input label="Risk Per Trade (%)" value={riskPerTrade} onChange={(e) => setRiskPerTrade(e.target.value)} type="number" />
          <Input label="Open Positions" value={openPositions} onChange={(e) => setOpenPositions(e.target.value)} type="number" />
          <Input label="Avg Position Correlation (0-1)" value={correlation} onChange={(e) => setCorrelation(e.target.value)} type="number" />
          <Input label="Win Rate (%)" value={winRate} onChange={(e) => setWinRate(e.target.value)} type="number" />
          <Input label="Avg Risk : Reward" value={avgRR} onChange={(e) => setAvgRR(e.target.value)} type="number" />
          <Input label="Max Daily Loss (%)" value={maxDailyLoss} onChange={(e) => setMaxDailyLoss(e.target.value)} type="number" />
          <Input label="Max Drawdown (%)" value={maxDrawdown} onChange={(e) => setMaxDrawdown(e.target.value)} type="number" />
        </div>
      </GlassPanel>

      <div className="space-y-6">
        <TerminalPanel title="QS Risk Matrix™" status={result.heatStatus === "CRITICAL" ? "offline" : "online"}>
          <div className="flex flex-wrap items-center justify-around gap-6">
            <ScoreRing score={Math.round(100 - result.portfolioHeat * 5)} label="Risk Health" grade={result.qsRiskGrade} />
            <div className="space-y-3 text-center">
              <div>
                <p className="font-mono text-[10px] uppercase text-slate-500">Portfolio Heat</p>
                <p className={cn("font-mono text-3xl font-bold", heatColor)}>{result.portfolioHeat}%</p>
                <Badge variant={result.heatStatus === "SAFE" ? "success" : "warning"}>{result.heatStatus}</Badge>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase text-slate-500">Kelly (Half)</p>
                <p className="font-mono text-lg font-bold text-cyan-accent">{result.kellyAdjusted}%</p>
              </div>
            </div>
          </div>
        </TerminalPanel>

        <TerminalPanel title="Risk Visuals">
          <div className="flex flex-wrap items-center justify-around gap-6">
            <HeatGauge
              value={result.portfolioHeat}
              label="Portfolio Heat"
              status={result.heatStatus}
            />
            <div className="min-w-[180px] flex-1">
              <ComparisonBars
                items={[
                  {
                    label: "Your risk / trade",
                    value: Number(riskPerTrade),
                    color: "#22d3ee",
                  },
                  {
                    label: "Kelly (half)",
                    value: result.kellyAdjusted,
                    color: "#34d399",
                  },
                  {
                    label: "Recommended",
                    value: result.recommendedRiskPercent,
                    color: "#fbbf24",
                  },
                ]}
              />
            </div>
          </div>
        </TerminalPanel>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: "Recommended Risk", value: `${result.recommendedRiskPercent}%` },
            { label: "Max Positions", value: String(result.maxConcurrentPositions) },
            { label: "Daily Risk Budget", value: `$${result.dailyRiskBudget.toLocaleString()}` },
            { label: "Per-Trade Risk ($)", value: `$${result.perTradeDollarRisk.toLocaleString()}` },
            { label: "Correlation Penalty", value: `${result.correlationPenalty}x` },
            { label: "Kelly Fraction", value: result.kellyFraction.toFixed(4) },
          ].map((item) => (
            <GlassPanel key={item.label} className="p-3 text-center">
              <p className="font-mono text-[10px] text-slate-500">{item.label}</p>
              <p className="font-mono text-sm font-bold text-slate-200">{item.value}</p>
            </GlassPanel>
          ))}
        </div>

        {result.breachWarnings.length > 0 && (
          <TerminalPanel title="Breach Warnings" status="warning">
            <ul className="space-y-2">
              {result.breachWarnings.map((w, i) => (
                <li key={i} className="font-mono text-xs text-amber-300">⚠ {w}</li>
              ))}
            </ul>
          </TerminalPanel>
        )}
      </div>
    </div>
  );
}