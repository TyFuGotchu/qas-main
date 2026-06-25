"use client";

import { useMemo, useState } from "react";
import type {
  TradeLockerDashboardMetrics,
  TradeLockerPosition,
} from "@/lib/tradelocker/types";
import { computePositionSize } from "@/lib/tradelocker/account-tools";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import { Target } from "lucide-react";

interface LivePositionSizerProps {
  metrics: TradeLockerDashboardMetrics;
  positions: TradeLockerPosition[];
}

function formatMoney(value: number): string {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function LivePositionSizer({
  metrics,
  positions,
}: LivePositionSizerProps) {
  const [riskPerTradePct, setRiskPerTradePct] = useState("1");

  const result = useMemo(
    () =>
      computePositionSize(metrics.balance, positions, {
        riskPerTradePct: Number(riskPerTradePct) || 1,
      }),
    [metrics.balance, positions, riskPerTradePct]
  );

  return (
    <Card className="border-slate-800/60">
      <CardHeader>
        <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
          <Target className="h-4 w-4 text-cyan-400" />
          Live Position Sizer
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Risk budget from live balance — you set lot size for your broker
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <Input
          label="Risk per trade (%)"
          type="number"
          min="0.25"
          max="5"
          step="0.25"
          value={riskPerTradePct}
          onChange={(e) => setRiskPerTradePct(e.target.value)}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-cyan-accent/20 bg-cyan-accent/5 px-4 py-5 text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Risk per trade
            </p>
            <p className="mt-2 font-mono text-4xl font-bold text-cyan-terminal">
              {result.riskPerTradePct}%
            </p>
            <p className="mt-2 font-mono text-lg font-semibold text-slate-200">
              {formatMoney(result.riskDollars)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-800/60 bg-slate-900/40 px-4 py-5 text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Live balance
            </p>
            <p className="mt-2 font-mono text-2xl font-bold text-slate-200">
              {formatMoney(result.balance)}
            </p>
            <p className="mt-2 font-mono text-xs text-slate-500">
              Max loss budget for next trade
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="success">
            Open exposure: {result.openExposurePct}%
          </Badge>
          <Badge variant="warning">
            {positions.length} open position
            {positions.length === 1 ? "" : "s"}
          </Badge>
        </div>

        <p className="text-sm text-slate-400">{result.message}</p>
      </CardContent>
    </Card>
  );
}