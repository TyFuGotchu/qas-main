"use client";

import { useMemo, useState } from "react";
import type { TradeLockerDashboardMetrics } from "@/lib/tradelocker/types";
import { computeGrowthCoach } from "@/lib/tradelocker/account-tools";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import { TrendingUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveGrowthCoachProps {
  metrics: TradeLockerDashboardMetrics;
}

function formatMoney(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function LiveGrowthCoach({ metrics }: LiveGrowthCoachProps) {
  const [monthlyTargetPct, setMonthlyTargetPct] = useState("8");
  const [tradingDaysPerMonth, setTradingDaysPerMonth] = useState("20");

  const result = useMemo(
    () =>
      computeGrowthCoach(metrics, {
        monthlyTargetPct: Number(monthlyTargetPct) || 8,
        tradingDaysPerMonth: Number(tradingDaysPerMonth) || 20,
      }),
    [metrics, monthlyTargetPct, tradingDaysPerMonth]
  );

  const progressColor =
    result.todayProgressPct >= 100
      ? "text-emerald-400"
      : result.todayProgressPct >= 50
        ? "text-cyan-400"
        : result.todayProgressPct < 0
          ? "text-red-400"
          : "text-amber-400";

  return (
    <Card className="border-slate-800/60">
      <CardHeader>
        <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          Live Growth Coach
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Daily targets & consistency score from your live account stats
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Monthly growth target (%)"
            type="number"
            min="1"
            max="30"
            step="0.5"
            value={monthlyTargetPct}
            onChange={(e) => setMonthlyTargetPct(e.target.value)}
          />
          <Input
            label="Trading days / month"
            type="number"
            min="5"
            max="31"
            step="1"
            value={tradingDaysPerMonth}
            onChange={(e) => setTradingDaysPerMonth(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-800/60 bg-slate-900/30 p-4 text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Today&apos;s target
            </p>
            <p className="mt-2 font-mono text-lg font-bold text-slate-200">
              {formatMoney(result.dailyProfitTarget)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-800/60 bg-slate-900/30 p-4 text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Today PnL
            </p>
            <p
              className={cn(
                "mt-2 font-mono text-lg font-bold",
                metrics.todayNetPnL >= 0 ? "text-emerald-400" : "text-red-400"
              )}
            >
              {formatMoney(metrics.todayNetPnL)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-800/60 bg-slate-900/30 p-4 text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Progress
            </p>
            <p className={cn("mt-2 font-mono text-lg font-bold", progressColor)}>
              {result.todayProgressPct}%
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="success">Consistency: {result.consistencyScore}</Badge>
          <Badge variant="warning">Grade {result.grade}</Badge>
          {metrics.winRate != null && (
            <Badge variant="success">
              Win rate {metrics.winRate}% ({metrics.closedTrades} trades)
            </Badge>
          )}
          {result.daysToTarget != null && result.daysToTarget > 0 && (
            <span className="font-mono text-xs text-slate-500">
              ~{result.daysToTarget} sessions to monthly target at current pace
            </span>
          )}
        </div>

        <ul className="space-y-2">
          {result.insights.map((insight) => (
            <li
              key={insight}
              className="flex items-start gap-2 text-sm text-slate-400"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              {insight}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}