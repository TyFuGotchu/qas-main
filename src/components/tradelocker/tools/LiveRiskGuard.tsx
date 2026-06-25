"use client";

import { useMemo, useState } from "react";
import type { TradeLockerDashboardMetrics } from "@/lib/tradelocker/types";
import {
  computeRiskGuard,
  riskStatusColor,
  riskStatusLabel,
} from "@/lib/tradelocker/account-tools";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import { HeatGauge } from "@/components/tools/qs/HeatGauge";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveRiskGuardProps {
  metrics: TradeLockerDashboardMetrics;
  currency?: string;
}

export function LiveRiskGuard({ metrics }: LiveRiskGuardProps) {
  const [dailyLossLimitPct, setDailyLossLimitPct] = useState("5");
  const [maxDrawdownPct, setMaxDrawdownPct] = useState("10");

  const result = useMemo(
    () =>
      computeRiskGuard(metrics, {
        dailyLossLimitPct: Number(dailyLossLimitPct) || 5,
        maxDrawdownPct: Number(maxDrawdownPct) || 10,
      }),
    [metrics, dailyLossLimitPct, maxDrawdownPct]
  );

  const badgeVariant =
    result.status === "safe"
      ? "success"
      : result.status === "halt"
        ? "warning"
        : "warning";

  return (
    <Card className="border-slate-800/60">
      <CardHeader>
        <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
          <ShieldAlert className="h-4 w-4 text-amber-400" />
          Live Risk Guard
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Prop-style daily loss & drawdown monitor on your connected account
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Daily loss limit (%)"
            type="number"
            min="1"
            max="20"
            step="0.5"
            value={dailyLossLimitPct}
            onChange={(e) => setDailyLossLimitPct(e.target.value)}
          />
          <Input
            label="Max drawdown (%)"
            type="number"
            min="2"
            max="30"
            step="0.5"
            value={maxDrawdownPct}
            onChange={(e) => setMaxDrawdownPct(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant={badgeVariant}>{riskStatusLabel(result.status)}</Badge>
          <span
            className={cn(
              "font-mono text-xs font-semibold uppercase tracking-widest",
              riskStatusColor(result.status)
            )}
          >
            {result.status}
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <HeatGauge
            value={Math.min(
              100,
              Math.round(
                (result.dailyLossUsedPct /
                  Math.max(Number(dailyLossLimitPct) || 5, 1)) *
                  100
              )
            )}
            label="Daily loss used"
            status={`${result.dailyLossUsedPct}% of ${dailyLossLimitPct}% cap`}
          />
          <HeatGauge
            value={Math.min(
              100,
              Math.round(
                (result.drawdownFromPeakPct /
                  Math.max(Number(maxDrawdownPct) || 10, 1)) *
                  100
              )
            )}
            label="Drawdown heat"
            status={`${result.drawdownFromPeakPct}% of ${maxDrawdownPct}% max`}
          />
        </div>

        <p className="rounded-lg border border-slate-800/60 bg-slate-900/40 px-4 py-3 text-sm text-slate-400">
          {result.message}
        </p>
        <p className="font-mono text-[10px] text-slate-600">
          Remaining daily loss budget: $
          {result.remainingDailyBudget.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </CardContent>
    </Card>
  );
}