"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { TraderProfileView } from "@/lib/trader-profile";
import type { TradeLockerDashboardData } from "@/lib/tradelocker/types";
import {
  computeRiskGuard,
  riskStatusColor,
  riskStatusLabel,
} from "@/lib/tradelocker/account-tools";
import { computePropSurvival } from "@/lib/quicksilver/prop-survival";
import { getPropFirmPreset } from "@/lib/prop-firms";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { HeatGauge } from "@/components/tools/qs/HeatGauge";
import { ScoreRing } from "@/components/tools/qs/ScoreRing";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import {
  Activity,
  Loader2,
  Settings,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function PropCommandCenter() {
  const [profile, setProfile] = useState<TraderProfileView | null>(null);
  const [dashboard, setDashboard] = useState<TradeLockerDashboardData | null>(
    null
  );
  const [journalWinRate, setJournalWinRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [tlConnected, setTlConnected] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, statusRes, journalRes] = await Promise.all([
          fetch("/api/trader-profile"),
          fetch("/api/tradelocker/status"),
          fetch("/api/journal"),
        ]);

        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfile(data.profile);
        }

        if (journalRes.ok) {
          const data = await journalRes.json();
          if (data.stats?.closedTrades > 0) {
            setJournalWinRate(data.stats.winRate);
          }
        }

        if (statusRes.ok) {
          const status = await statusRes.json();
          setTlConnected(Boolean(status.connected));
          if (status.connected) {
            const accountsRes = await fetch("/api/tradelocker/accounts");
            if (accountsRes.ok) {
              const { accounts } = await accountsRes.json();
              const first = accounts?.[0];
              if (first) {
                const dashRes = await fetch(
                  `/api/tradelocker/dashboard?accountId=${encodeURIComponent(first.accountId)}&accNum=${encodeURIComponent(first.accNum)}`
                );
                if (dashRes.ok) {
                  const dash = await dashRes.json();
                  setDashboard({
                    metrics: dash.metrics,
                    positions: dash.positions ?? [],
                  });
                }
              }
            }
          }
        }
      } catch {
        // partial load ok
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const riskGuard = useMemo(() => {
    if (!profile || !dashboard?.metrics) return null;
    return computeRiskGuard(dashboard.metrics, {
      dailyLossLimitPct: profile.dailyLossLimitPct,
      maxDrawdownPct: profile.maxDrawdownPct,
    });
  }, [profile, dashboard]);

  const survival = useMemo(() => {
    if (!profile) return null;
    const winRate = journalWinRate ?? dashboard?.metrics.winRate ?? 55;
    const safeWinRate = winRate ?? 55;
    const preset = getPropFirmPreset(profile.propFirmPreset);
    return computePropSurvival({
      winRate: safeWinRate,
      riskReward: 2,
      tradesPerMonth: profile.maxTradesPerDay * 22,
      startingBalance: dashboard?.metrics.balance ?? 100000,
      maxDrawdownPercent: profile.maxDrawdownPct,
      dailyLossLimitPercent: profile.dailyLossLimitPct,
      profitTargetPercent: preset.profitTargetPct ?? 10,
      simulations: 5000,
      horizonDays: 30,
    });
  }, [profile, dashboard, journalWinRate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-20">
        <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
        <span className="font-mono text-sm text-slate-500">
          Loading Prop Command Center…
        </span>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="font-mono text-sm text-slate-500">
            Complete your trader profile to unlock Prop OS.
          </p>
          <Link href="/onboarding/profile" className="mt-4 inline-block">
            <Button variant="primary">Set Up Profile</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const firm = getPropFirmPreset(profile.propFirmPreset);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-mono text-2xl font-bold text-slate-200">
            Prop Command Center
          </h2>
          <p className="mt-1 font-mono text-sm text-slate-500">
            Live risk telemetry + challenge survival — wired to your profile
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

      <div className="flex flex-wrap gap-2">
        <Badge variant="success">{firm.name}</Badge>
        <Badge variant="warning">{profile.accountType}</Badge>
        <Badge>{profile.tradingStyle} style</Badge>
        {profile.strictPreTradeGate && (
          <Badge variant="warning">Strict gate ON</Badge>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-800/60">
          <CardHeader>
            <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
              <Shield className="h-4 w-4 text-amber-400" />
              Live Risk Guard
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {tlConnected && dashboard
                ? "Connected TradeLocker account"
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
                  {riskGuard.message}
                </p>
              </>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-slate-500">
                  No live account data. Your limits are armed for pre-trade
                  gates when you connect.
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

        <Card className="border-slate-800/60">
          <CardHeader>
            <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
              <Target className="h-4 w-4 text-cyan-400" />
              Profile limits
            </h3>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 sm:grid-cols-2">
              {[
                ["Daily loss cap", `${profile.dailyLossLimitPct}%`],
                ["Max drawdown", `${profile.maxDrawdownPct}%`],
                ["Risk / trade", `${profile.riskPerTradePct}%`],
                ["Max trades / day", String(profile.maxTradesPerDay)],
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
            <p className="mt-4 font-mono text-xs text-slate-600">
              Markets: {profile.primaryMarkets.join(", ")}
            </p>
          </CardContent>
        </Card>
      </div>

      {survival && (
        <TerminalPanel title="Prop Survival Outlook" status="online">
          <div className="flex flex-wrap items-center justify-around gap-6">
            <ScoreRing
              score={Math.round(survival.probabilityOfPass)}
              label="Pass probability"
              grade={survival.survivalGrade}
            />
            <div className="space-y-2 text-center">
              <p className="font-mono text-[10px] uppercase text-slate-500">
                QS Verdict
              </p>
              <p
                className={cn(
                  "font-mono text-xl font-bold",
                  survival.qsVerdict === "FAVORABLE"
                    ? "text-emerald-400"
                    : survival.qsVerdict === "REFINE"
                      ? "text-amber-400"
                      : "text-red-400"
                )}
              >
                {survival.qsVerdict}
              </p>
              <p className="font-mono text-xs text-slate-500">
                Ruin: {survival.probabilityOfRuin.toFixed(1)}% · Uses{" "}
                {journalWinRate != null ? "journal" : "default"} win rate
              </p>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <span className="font-mono text-xs">
                Target {firm.profitTargetPct ?? 10}% · {firm.name}
              </span>
            </div>
          </div>
        </TerminalPanel>
      )}
    </div>
  );
}