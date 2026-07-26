"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import {
  computePortfolioLab,
  formatUsd,
} from "@/lib/live-growth/portfolio-lab";
import {
  Briefcase,
  Layers,
  TrendingUp,
  Shield,
  Target,
  Lightbulb,
} from "lucide-react";

/**
 * Live capital portfolio lab — build, scale, and protect personal equity.
 * Complements scale track / TradeLocker metrics; works without TL connected.
 */
export function LivePortfolioLab() {
  const [startingEquity, setStartingEquity] = useState(10_000);
  const [monthlyReturnPct, setMonthlyReturnPct] = useState(4);
  const [riskPerTradePct, setRiskPerTradePct] = useState(0.5);
  const [maxOpenRiskPct, setMaxOpenRiskPct] = useState(1.5);
  const [months, setMonths] = useState(12);

  const result = useMemo(
    () =>
      computePortfolioLab({
        startingEquity,
        monthlyReturnPct,
        riskPerTradePct,
        maxOpenRiskPct,
        months,
      }),
    [
      startingEquity,
      monthlyReturnPct,
      riskPerTradePct,
      maxOpenRiskPct,
      months,
    ]
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge variant="success" className="mb-2">
            Live capital
          </Badge>
          <h3 className="flex items-center gap-2 font-mono text-lg font-bold text-slate-200">
            <Briefcase className="h-5 w-5 text-emerald-400" />
            Live Portfolio Lab
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Insights for traders running real capital — how to build, scale, and
            protect equity without treating a live account like a prop challenge.
          </p>
        </div>
      </div>

      <Card className="border-emerald-500/20 bg-gradient-to-br from-obsidian-900/80 to-emerald-500/5">
        <CardHeader>
          <h4 className="font-mono text-sm font-semibold text-slate-200">
            Portfolio inputs
          </h4>
          <p className="font-mono text-[10px] text-slate-600">
            Adjust numbers to match your account. Projection is educational, not
            a guarantee of returns.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Input
            label="Starting equity ($)"
            type="number"
            min={100}
            value={startingEquity}
            onChange={(e) => setStartingEquity(Number(e.target.value) || 0)}
          />
          <Input
            label="Target return % / mo"
            type="number"
            min={0}
            max={50}
            step={0.5}
            value={monthlyReturnPct}
            onChange={(e) => setMonthlyReturnPct(Number(e.target.value) || 0)}
          />
          <Input
            label="Risk per trade %"
            type="number"
            min={0.1}
            max={5}
            step={0.1}
            value={riskPerTradePct}
            onChange={(e) => setRiskPerTradePct(Number(e.target.value) || 0)}
          />
          <Input
            label="Max open heat %"
            type="number"
            min={0.1}
            max={15}
            step={0.1}
            value={maxOpenRiskPct}
            onChange={(e) => setMaxOpenRiskPct(Number(e.target.value) || 0)}
          />
          <Input
            label="Horizon (months)"
            type="number"
            min={1}
            max={60}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value) || 1)}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={TrendingUp}
          label={`${months}-mo projected equity`}
          value={formatUsd(result.projectedEquity)}
          sub={`+${result.totalGrowthPct.toFixed(0)}% if targets hold`}
          accent="text-emerald-400"
        />
        <MetricCard
          icon={Shield}
          label="Risk $ / trade"
          value={formatUsd(result.maxRiskDollarsPerTrade)}
          sub={`at ${riskPerTradePct}% of current equity`}
          accent="text-cyan-400"
        />
        <MetricCard
          icon={Layers}
          label="Max portfolio heat"
          value={formatUsd(result.maxPortfolioHeatDollars)}
          sub={`~${result.suggestedUnits} concurrent unit(s) at your risk %`}
          accent="text-amber-400"
        />
        <MetricCard
          icon={Target}
          label="Milestones in range"
          value={String(result.milestonesHit.length)}
          sub={
            result.milestonesHit.length
              ? `Up to ${formatUsd(result.milestonesHit[result.milestonesHit.length - 1]!)}`
              : "Raise horizon or return %"
          }
          accent="text-slate-200"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h4 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              Live capital playbook
            </h4>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.rules.map((rule) => (
              <div
                key={rule.title}
                className="rounded-lg border border-slate-800/60 bg-obsidian-950/50 p-3"
              >
                <p className="font-mono text-xs font-semibold text-slate-200">
                  {rule.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {rule.body}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h4 className="font-mono text-sm font-semibold text-slate-200">
              Scale path (example)
            </h4>
            <p className="font-mono text-[10px] text-slate-600">
              Risk % often decreases as equity grows — dollars at risk can still
              rise.
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.scaleSteps.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-lg border border-slate-800/60 bg-obsidian-950/50 p-3"
                >
                  <span className="font-mono text-xs text-cyan-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-mono text-sm text-slate-200">
                      {formatUsd(step.equity)} · {step.riskPct}% risk
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">{step.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center gap-2 text-slate-500">
          <Icon className="h-4 w-4" />
          <p className="font-mono text-[10px] uppercase tracking-wider">
            {label}
          </p>
        </div>
        <p className={`mt-2 font-mono text-xl font-bold ${accent}`}>{value}</p>
        <p className="mt-1 text-xs text-slate-600">{sub}</p>
      </CardContent>
    </Card>
  );
}
