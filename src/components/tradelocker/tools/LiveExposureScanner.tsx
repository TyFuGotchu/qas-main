"use client";

import { useMemo } from "react";
import type {
  TradeLockerDashboardMetrics,
  TradeLockerPosition,
} from "@/lib/tradelocker/types";
import {
  computeExposureScan,
  exposureBiasLabel,
} from "@/lib/tradelocker/account-tools";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Layers, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveExposureScannerProps {
  metrics: TradeLockerDashboardMetrics;
  positions: TradeLockerPosition[];
  instrumentNames?: Map<string, string>;
}

function formatMoney(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function LiveExposureScanner({
  metrics,
  positions,
  instrumentNames,
}: LiveExposureScannerProps) {
  const result = useMemo(
    () =>
      computeExposureScan(
        positions,
        metrics.balance,
        (id) => instrumentNames?.get(id) ?? `#${id}`
      ),
    [positions, metrics.balance, instrumentNames]
  );

  const biasVariant =
    result.bias === "one-sided"
      ? "warning"
      : result.bias === "neutral"
        ? "success"
        : "warning";

  return (
    <Card className="border-slate-800/60">
      <CardHeader>
        <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
          <Layers className="h-4 w-4 text-violet-400" />
          Live Exposure Scanner
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Directional bias, concentration, and open-book alerts
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg border border-slate-800/60 bg-slate-900/30 p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Long
            </p>
            <p className="mt-1 font-mono text-xl font-bold text-emerald-400">
              {result.longCount}
            </p>
          </div>
          <div className="rounded-lg border border-slate-800/60 bg-slate-900/30 p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Short
            </p>
            <p className="mt-1 font-mono text-xl font-bold text-red-400">
              {result.shortCount}
            </p>
          </div>
          <div className="rounded-lg border border-slate-800/60 bg-slate-900/30 p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Net open PnL
            </p>
            <p
              className={cn(
                "mt-1 font-mono text-lg font-bold",
                result.netOpenPnL >= 0 ? "text-emerald-400" : "text-red-400"
              )}
            >
              {formatMoney(result.netOpenPnL)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant={biasVariant}>{exposureBiasLabel(result.bias)}</Badge>
          {result.biasScore !== 0 && (
            <Badge variant="success">Score {result.biasScore > 0 ? "+" : ""}
              {result.biasScore}
            </Badge>
          )}
          {result.concentratedInstrument && result.concentrationPct > 0 && (
            <Badge variant="warning">
              {result.concentrationPct}% {result.concentratedInstrument}
            </Badge>
          )}
        </div>

        {(result.topWinner || result.topLoser) && (
          <div className="grid gap-3 sm:grid-cols-2">
            {result.topWinner && (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
                <p className="font-mono text-[10px] uppercase text-slate-500">
                  Top winner
                </p>
                <p className="font-mono text-sm text-slate-200">
                  {result.topWinner.label}
                </p>
                <p className="font-mono text-sm font-semibold text-emerald-400">
                  {formatMoney(result.topWinner.pnl)}
                </p>
              </div>
            )}
            {result.topLoser && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
                <p className="font-mono text-[10px] uppercase text-slate-500">
                  Top loser
                </p>
                <p className="font-mono text-sm text-slate-200">
                  {result.topLoser.label}
                </p>
                <p className="font-mono text-sm font-semibold text-red-400">
                  {formatMoney(result.topLoser.pnl)}
                </p>
              </div>
            )}
          </div>
        )}

        <ul className="space-y-2">
          {result.alerts.map((alert) => (
            <li
              key={alert}
              className="flex items-start gap-2 text-sm text-slate-400"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              {alert}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}