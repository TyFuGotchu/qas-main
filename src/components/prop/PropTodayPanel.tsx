"use client";

import Link from "next/link";
import type { PropTodaySnapshot } from "@/lib/prop/today-snapshot";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { SessionBadge } from "@/components/journal/SessionBadge";
import {
  Activity,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

function formatMoney(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function ProgressBar({
  value,
  variant,
}: {
  value: number;
  variant: "cyan" | "amber" | "red";
}) {
  const color =
    variant === "red"
      ? "bg-red-500"
      : variant === "amber"
        ? "bg-amber-500"
        : "bg-cyan-500";

  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-800/80">
      <div
        className={cn("h-full rounded-full transition-all duration-500", color)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

interface PropTodayPanelProps {
  snapshot: PropTodaySnapshot;
}

export function PropTodayPanel({ snapshot }: PropTodayPanelProps) {
  const verdictStyles = {
    go: {
      border: "border-emerald-500/40",
      bg: "bg-emerald-500/5",
      text: "text-emerald-400",
      icon: CheckCircle2,
    },
    caution: {
      border: "border-amber-500/40",
      bg: "bg-amber-500/5",
      text: "text-amber-400",
      icon: AlertTriangle,
    },
    stop: {
      border: "border-red-500/40",
      bg: "bg-red-500/5",
      text: "text-red-400",
      icon: Ban,
    },
  }[snapshot.verdict];

  const VerdictIcon = verdictStyles.icon;

  const tradesBarVariant =
    snapshot.tradesUsedPct >= 100
      ? "red"
      : snapshot.tradesUsedPct >= 80
        ? "amber"
        : "cyan";

  const lossBarVariant =
    snapshot.lossBudgetUsedPct >= 100
      ? "red"
      : snapshot.lossBudgetUsedPct >= 80
        ? "amber"
        : "cyan";

  return (
    <Card
      className={cn(
        "overflow-hidden border-2",
        verdictStyles.border,
        verdictStyles.bg
      )}
    >
      <CardContent className="p-0">
        <div className="grid gap-0 lg:grid-cols-[1fr_1.2fr]">
          <div className="border-b border-slate-800/60 p-6 lg:border-b-0 lg:border-r">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-600">
              Today · can I trade?
            </p>
            <div className="mt-3 flex items-start gap-4">
              <div
                className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border",
                  verdictStyles.border,
                  verdictStyles.bg
                )}
              >
                <VerdictIcon className={cn("h-7 w-7", verdictStyles.text)} />
              </div>
              <div>
                <h3
                  className={cn(
                    "font-mono text-2xl font-bold tracking-tight sm:text-3xl",
                    verdictStyles.text
                  )}
                >
                  {snapshot.verdictHeadline}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                  {snapshot.verdictDetail}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/dashboard/bot">
                <Button variant="primary" size="sm">
                  <Activity className="h-3.5 w-3.5" />
                  Open terminal
                </Button>
              </Link>
              {!snapshot.tlConnected && (
                <span className="self-center font-mono text-[10px] text-slate-600">
                  Connect TradeLocker for live P&amp;L
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-slate-500">Trades today</span>
                <span className="font-semibold text-slate-200">
                  {snapshot.tradesToday} / {snapshot.maxTradesPerDay}
                  <span className="ml-2 text-slate-500">
                    ({snapshot.tradesRemaining} left)
                  </span>
                </span>
              </div>
              <ProgressBar value={snapshot.tradesUsedPct} variant={tradesBarVariant} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-slate-500">Daily loss budget</span>
                <span className="font-semibold text-slate-200">
                  {formatMoney(snapshot.remainingDailyBudget)} left
                  {snapshot.dailyLossBudgetTotal > 0 && (
                    <span className="ml-2 text-slate-500">
                      of {formatMoney(snapshot.dailyLossBudgetTotal)}
                    </span>
                  )}
                </span>
              </div>
              <ProgressBar
                value={snapshot.lossBudgetUsedPct}
                variant={lossBarVariant}
              />
              <p className="font-mono text-[10px] text-slate-600">
                {snapshot.dailyLossUsedPct}% of {snapshot.dailyLossLimitPct}% cap
                used
              </p>
            </div>

            <div className="rounded-lg border border-slate-800/60 bg-slate-900/40 px-4 py-3">
              <div className="flex items-center gap-2">
                {snapshot.todayNetPnL >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
                <span className="font-mono text-[10px] uppercase text-slate-600">
                  Today P&amp;L
                </span>
              </div>
              <p
                className={cn(
                  "mt-2 font-mono text-xl font-bold",
                  snapshot.todayNetPnL >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
                )}
              >
                {snapshot.tlConnected
                  ? formatMoney(snapshot.todayNetPnL)
                  : "—"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-800/60 bg-slate-900/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-cyan-400" />
                <span className="font-mono text-[10px] uppercase text-slate-600">
                  Open positions
                </span>
              </div>
              <p className="mt-2 font-mono text-xl font-bold text-slate-200">
                {snapshot.tlConnected ? snapshot.openPositions : "—"}
              </p>
              {snapshot.balance > 0 && (
                <p className="mt-1 font-mono text-[10px] text-slate-600">
                  Balance {formatMoney(snapshot.balance)}
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <div className="flex flex-wrap items-center gap-2">
                <Clock className="h-4 w-4 text-violet-400" />
                <span className="font-mono text-[10px] uppercase text-slate-600">
                  Session edge
                </span>
                <SessionBadge sessionId={snapshot.currentSession} />
                <span className="font-mono text-[10px] text-slate-500">
                  {snapshot.currentSessionLocalWindow} ·{" "}
                  {snapshot.timezoneLabel}
                </span>
              </div>
              {snapshot.sessionInsight && (
                <p className="text-sm leading-relaxed text-slate-400">
                  {snapshot.sessionInsight}
                </p>
              )}
              {snapshot.bestSession &&
                snapshot.bestSession !== snapshot.currentSession &&
                snapshot.bestSessionLabel && (
                  <p className="font-mono text-[10px] text-cyan-400/80">
                    Journal best: {snapshot.bestSessionLabel}
                  </p>
                )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}