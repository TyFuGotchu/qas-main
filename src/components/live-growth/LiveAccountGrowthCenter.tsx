"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { TradeJournalEntry } from "@prisma/client";
import type { AlphaDurabilityResult } from "@/lib/quicksilver/alpha-durability";
import type { JournalStats, SessionStatsResult } from "@/lib/journal/stats";
import type { TraderProfileView } from "@/lib/trader-profile";
import type { TradeLockerDashboardData } from "@/lib/tradelocker/types";
import { computePropTodaySnapshot } from "@/lib/prop/today-snapshot";
import { PropTodayPanel } from "@/components/prop/PropTodayPanel";
import {
  computeGrowthCoach,
  computeRiskGuard,
  riskStatusColor,
  riskStatusLabel,
} from "@/lib/tradelocker/account-tools";
import {
  computeScalePlan,
  EQUITY_MILESTONES,
  formatEquity,
} from "@/lib/live-growth/scale-plan";
import { SessionBreakdown } from "@/components/journal/SessionBreakdown";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { HeatGauge } from "@/components/tools/qs/HeatGauge";
import { ScoreRing } from "@/components/tools/qs/ScoreRing";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { PremiumUpgradeNudge } from "@/components/engagement/PremiumUpgradeNudge";
import { cn } from "@/lib/utils";
import {
  Activity,
  ArrowRight,
  Check,
  Loader2,
  Settings,
  Shield,
  Target,
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

export function LiveAccountGrowthCenter() {
  const [profile, setProfile] = useState<TraderProfileView | null>(null);
  const [dashboard, setDashboard] = useState<TradeLockerDashboardData | null>(
    null
  );
  const [journalEntries, setJournalEntries] = useState<TradeJournalEntry[]>([]);
  const [journalStats, setJournalStats] = useState<JournalStats | null>(null);
  const [sessionStats, setSessionStats] = useState<SessionStatsResult | null>(
    null
  );
  const [alpha, setAlpha] = useState<AlphaDurabilityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [tlConnected, setTlConnected] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load(showSpinner: boolean) {
      if (showSpinner) setLoading(true);
      try {
        const [profileRes, statusRes, journalRes] = await Promise.all([
          fetch("/api/trader-profile"),
          fetch("/api/tradelocker/status"),
          fetch("/api/journal"),
        ]);

        if (cancelled) return;

        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfile(data.profile);
        }

        if (journalRes.ok) {
          const data = await journalRes.json();
          setJournalEntries(data.entries ?? []);
          setJournalStats(data.stats ?? null);
          setSessionStats(data.sessionStats ?? null);
          setAlpha(data.alpha ?? null);
        }

        if (statusRes.ok) {
          const status = await statusRes.json();
          const connected = Boolean(status.connected);
          setTlConnected(connected);
          if (connected) {
            const accountsRes = await fetch("/api/tradelocker/accounts");
            if (accountsRes.ok && !cancelled) {
              const { accounts } = await accountsRes.json();
              const first = accounts?.[0];
              if (first) {
                const dashRes = await fetch(
                  `/api/tradelocker/dashboard?accountId=${encodeURIComponent(first.accountId)}&accNum=${encodeURIComponent(first.accNum)}`
                );
                if (dashRes.ok && !cancelled) {
                  const dash = await dashRes.json();
                  setDashboard({
                    metrics: dash.metrics,
                    positions: dash.positions ?? [],
                    tradesToday: dash.tradesToday ?? 0,
                  });
                }
              }
            }
          } else {
            setDashboard(null);
          }
        }
      } catch {
        // partial load ok
      } finally {
        if (!cancelled && showSpinner) setLoading(false);
      }
    }

    load(true);
    const interval = setInterval(() => load(false), 60_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const balance = dashboard?.metrics.balance ?? 0;

  const todaySnapshot = useMemo(() => {
    if (!profile) return null;
    return computePropTodaySnapshot({
      profile,
      metrics: dashboard?.metrics ?? null,
      tradesTodayTl: dashboard?.tradesToday ?? 0,
      journalEntries,
      tlConnected,
    });
  }, [profile, dashboard, journalEntries, tlConnected]);

  const growthCoach = useMemo(() => {
    if (!profile || !dashboard?.metrics || balance <= 0) return null;
    const plan = computeScalePlan({
      balance,
      profile: profile!,
      journalStats,
      sessionStats,
      alpha,
      growthCoach: null,
    });
    return computeGrowthCoach(dashboard.metrics, {
      monthlyTargetPct: plan.monthlyTargetPct,
      tradingDaysPerMonth: 20,
    });
  }, [dashboard, balance, profile, journalStats, sessionStats, alpha]);

  const scalePlan = useMemo(() => {
    if (!profile) return null;
    return computeScalePlan({
      balance: balance > 0 ? balance : 10_000,
      profile,
      journalStats,
      sessionStats,
      alpha,
      growthCoach,
    });
  }, [profile, balance, journalStats, sessionStats, alpha, growthCoach]);

  const riskGuard = useMemo(() => {
    if (!profile || !dashboard?.metrics) return null;
    return computeRiskGuard(dashboard.metrics, {
      dailyLossLimitPct: profile.dailyLossLimitPct,
      maxDrawdownPct: profile.maxDrawdownPct,
    });
  }, [profile, dashboard]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-20">
        <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
        <span className="font-mono text-sm text-slate-500">
          Loading Live Growth Center…
        </span>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="font-mono text-sm text-slate-500">
            Complete your trader profile to unlock Live Growth.
          </p>
          <Link href="/onboarding/profile" className="mt-4 inline-block">
            <Button variant="primary">Set Up Profile</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const isLivePersonal =
    profile.accountType === "personal" || profile.accountType === "funded";
  const showPropBanner =
    profile.accountType === "prop" || profile.accountType === "funded";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-mono text-2xl font-bold text-slate-200">
            Live Account Growth
          </h2>
          <p className="mt-1 font-mono text-sm text-slate-500">
            Scale your own capital like a professional — milestones, compounding
            & session edge
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/journal?profile=1">
            <Button variant="ghost" size="sm">
              <Settings className="h-3.5 w-3.5" />
              Edit risk profile
            </Button>
          </Link>
          <Link href="/dashboard/journal">
            <Button variant="ghost" size="sm">
              Journal & Alpha
            </Button>
          </Link>
        </div>
      </div>

      <PremiumUpgradeNudge feature="Live Account Growth & scale planning" />

      {showPropBanner && (
        <Card className="border-cyan-500/30 bg-cyan-500/5">
          <CardContent className="flex flex-wrap items-center gap-4 py-4">
            <Shield className="h-5 w-5 shrink-0 text-cyan-400" />
            <div className="flex-1">
              <p className="font-mono text-sm text-cyan-300">
                Also running a prop evaluation?
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Prop OS tracks challenge survival, firm presets, and pass
                probability — separate from your live growth plan.
              </p>
            </div>
            <Link href="/dashboard/prop-command">
              <Button variant="ghost" size="sm">
                Open Prop OS
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {!isLivePersonal && profile.accountType === "prop" && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="py-4">
            <p className="font-mono text-sm text-amber-300">
              Your profile is set to prop evaluation — switch to{" "}
              <strong>Live personal account</strong> in settings if this hub is
              your primary workspace.
            </p>
          </CardContent>
        </Card>
      )}

      {todaySnapshot && <PropTodayPanel snapshot={todaySnapshot} />}

      {scalePlan && (
        <>
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">{scalePlan.phaseLabel} phase</Badge>
            <Badge variant="warning">
              {profile.accountType === "personal"
                ? "Live personal"
                : profile.accountType}
            </Badge>
            <Badge>{profile.tradingStyle} style</Badge>
            <Badge variant="success">Scale grade {scalePlan.scaleGrade}</Badge>
          </div>

          <TerminalPanel title="Equity scale track" status="online">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-around gap-6">
                <ScoreRing
                  score={scalePlan.scaleScore}
                  label="Scale readiness"
                  grade={scalePlan.scaleGrade}
                />
                <div className="space-y-3 text-center">
                  <p className="font-mono text-[10px] uppercase text-slate-500">
                    Live balance
                  </p>
                  <p className="font-mono text-3xl font-bold text-emerald-400">
                    {tlConnected && balance > 0
                      ? formatEquity(balance)
                      : "Connect TL"}
                  </p>
                  {scalePlan.nextMilestone && (
                    <p className="font-mono text-xs text-slate-500">
                      {scalePlan.progressToNextPct}% to{" "}
                      {formatEquity(scalePlan.nextMilestone)}
                      {scalePlan.monthsToNextMilestone != null && (
                        <span>
                          {" "}
                          · ~{scalePlan.monthsToNextMilestone} mo at{" "}
                          {scalePlan.monthlyTargetPct}%/mo
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <div className="space-y-2 text-center">
                  <p className="font-mono text-[10px] uppercase text-slate-500">
                    Monthly target
                  </p>
                  <p className="font-mono text-xl font-bold text-cyan-400">
                    {scalePlan.monthlyTargetPct}%
                  </p>
                  <p className="font-mono text-xs text-slate-500">
                    {formatMoney(scalePlan.monthlyTargetDollars)} / month
                  </p>
                </div>
              </div>

              <p className="text-center text-sm text-slate-400">
                {scalePlan.phaseDescription}
              </p>

              <div className="overflow-x-auto pb-2">
                <div className="flex min-w-max items-center gap-1">
                  {EQUITY_MILESTONES.map((milestone) => {
                    const reached = balance >= milestone;
                    const isNext = scalePlan.nextMilestone === milestone;
                    return (
                      <div
                        key={milestone}
                        className={cn(
                          "flex flex-col items-center rounded-lg border px-3 py-2",
                          reached
                            ? "border-emerald-500/40 bg-emerald-500/10"
                            : isNext
                              ? "border-cyan-500/40 bg-cyan-500/10"
                              : "border-slate-800/60 bg-slate-900/30"
                        )}
                      >
                        <Wallet
                          className={cn(
                            "h-3.5 w-3.5",
                            reached
                              ? "text-emerald-400"
                              : isNext
                                ? "text-cyan-400"
                                : "text-slate-600"
                          )}
                        />
                        <span
                          className={cn(
                            "mt-1 font-mono text-[10px] font-semibold",
                            reached
                              ? "text-emerald-400"
                              : isNext
                                ? "text-cyan-400"
                                : "text-slate-600"
                          )}
                        >
                          {formatEquity(milestone)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {scalePlan.nextMilestone && (
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-xs text-slate-500">
                    <span>
                      {formatEquity(scalePlan.prevMilestone)} →{" "}
                      {formatEquity(scalePlan.nextMilestone)}
                    </span>
                    <span>{scalePlan.progressToNextPct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800/80">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(100, scalePlan.progressToNextPct)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </TerminalPanel>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-slate-800/60">
              <CardHeader>
                <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  Compounding outlook
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  At {scalePlan.monthlyTargetPct}% monthly — illustrative, not
                  guaranteed
                </p>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["12 months", formatEquity(scalePlan.compoundProjection12Mo)],
                    ["24 months", formatEquity(scalePlan.compoundProjection24Mo)],
                    [
                      "Daily target",
                      growthCoach
                        ? formatMoney(growthCoach.dailyProfitTarget)
                        : "—",
                    ],
                    [
                      "Today progress",
                      growthCoach
                        ? `${growthCoach.todayProgressPct}%`
                        : "—",
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-lg border border-slate-800/60 bg-slate-900/40 px-4 py-3"
                    >
                      <dt className="font-mono text-[10px] uppercase text-slate-600">
                        {label}
                      </dt>
                      <dd className="mt-1 font-mono text-lg font-bold text-slate-200">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
                {growthCoach && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="success">
                      Consistency {growthCoach.consistencyScore}
                    </Badge>
                    <Badge variant="warning">
                      Coach grade {growthCoach.grade}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-800/60">
              <CardHeader>
                <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
                  <Target className="h-4 w-4 text-cyan-400" />
                  Live risk guard
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {tlConnected && dashboard
                    ? "Your capital protection layer"
                    : "Connect Trading terminal for live metrics"}
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                {riskGuard ? (
                  <>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          riskGuard.status === "safe" ? "success" : "warning"
                        }
                      >
                        {riskStatusLabel(riskGuard.status)}
                      </Badge>
                      <span
                        className={cn(
                          "font-mono text-xs font-semibold uppercase",
                          riskStatusColor(riskGuard.status)
                        )}
                      >
                        {riskGuard.status}
                      </span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <HeatGauge
                        value={Math.min(
                          100,
                          Math.round(
                            (riskGuard.dailyLossUsedPct /
                              profile.dailyLossLimitPct) *
                              100
                          )
                        )}
                        label="Daily loss"
                        status={`${riskGuard.dailyLossUsedPct}% / ${profile.dailyLossLimitPct}%`}
                      />
                      <HeatGauge
                        value={Math.min(
                          100,
                          Math.round(
                            (riskGuard.drawdownFromPeakPct /
                              profile.maxDrawdownPct) *
                              100
                          )
                        )}
                        label="Drawdown"
                        status={`${riskGuard.drawdownFromPeakPct}% / ${profile.maxDrawdownPct}%`}
                      />
                    </div>
                    <p className="rounded-lg border border-slate-800/60 bg-slate-900/40 px-4 py-3 text-sm text-slate-400">
                      {riskGuard.message.replace(
                        "prop-style",
                        "professional"
                      )}
                    </p>
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-500">
                      Connect TradeLocker to see live balance, P&amp;L, and
                      risk telemetry for your personal account.
                    </p>
                    <Link href="/dashboard/bot">
                      <Button variant="ghost" size="sm">
                        <Activity className="h-3.5 w-3.5" />
                        Open Trading Terminal
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {alpha && journalStats && journalStats.closedTrades > 0 && (
            <Card className="border-slate-800/60">
              <CardHeader>
                <h3 className="font-mono text-sm font-semibold text-slate-200">
                  Alpha durability
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Journal-backed edge — scale only when durability supports it
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4">
                  <Badge variant="success">
                    Grade {alpha.durabilityGrade}
                  </Badge>
                  <Badge>{alpha.edgeStatus}</Badge>
                  <Badge variant="warning">
                    {journalStats.closedTrades} closed trades
                  </Badge>
                  <span className="font-mono text-xs text-slate-500">
                    {journalStats.winRate}% WR · {journalStats.avgR}R avg
                  </span>
                </div>
                <ul className="mt-4 space-y-1">
                  {alpha.diagnostics.slice(0, 2).map((d) => (
                    <li key={d} className="text-sm text-slate-400">
                      {d}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {sessionStats && sessionStats.rows.length > 0 && (
            <SessionBreakdown stats={sessionStats} />
          )}

          <Card className="border-slate-800/60">
            <CardHeader>
              <h3 className="font-mono text-sm font-semibold text-slate-200">
                Professional scale playbook
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {scalePlan.playbook.map((card) => (
                  <div
                    key={card.title}
                    className={cn(
                      "rounded-lg border px-4 py-3",
                      card.priority === "high"
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-slate-800/60 bg-slate-900/30"
                    )}
                  >
                    <p className="font-mono text-xs font-semibold text-slate-200">
                      {card.title}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">{card.body}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardHeader>
              <h3 className="font-mono text-sm font-semibold text-emerald-300">
                Live growth insights
              </h3>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {scalePlan.insights.map((insight) => (
                  <li
                    key={insight}
                    className="flex items-start gap-2 text-sm text-slate-300"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {insight}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}