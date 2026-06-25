import { resolveTradesTodayCount } from "@/lib/journal/trade-count";
import { evaluatePreTradeGate } from "@/lib/pre-trade-gate";
import type { RiskGuardStatus } from "@/lib/tradelocker/account-tools";
import type { TradeLockerDashboardMetrics } from "@/lib/tradelocker/types";
import type { TraderProfileView } from "@/lib/trader-profile";
import type { TradeJournalEntry } from "@prisma/client";

export type TodayVerdict = "go" | "caution" | "stop";

export interface PropTodaySnapshot {
  verdict: TodayVerdict;
  verdictHeadline: string;
  verdictDetail: string;
  canTrade: boolean;
  riskStatus: RiskGuardStatus;
  tradesToday: number;
  tradesRemaining: number;
  maxTradesPerDay: number;
  tradesUsedPct: number;
  dailyLossUsedPct: number;
  dailyLossLimitPct: number;
  remainingDailyBudget: number;
  dailyLossBudgetTotal: number;
  lossBudgetUsedPct: number;
  todayNetPnL: number;
  openPositions: number;
  balance: number;
  tlConnected: boolean;
}

type JournalSlice = Pick<TradeJournalEntry, "entryTime" | "source">;

function verdictFromGate(
  riskStatus: RiskGuardStatus,
  tradesToday: number,
  maxTrades: number
): { verdict: TodayVerdict; headline: string; detail: string } {
  if (riskStatus === "halt" || tradesToday >= maxTrades) {
    return {
      verdict: "stop",
      headline: "Stop trading",
      detail: "Daily limits reached — protect capital and reset next session.",
    };
  }

  if (
    riskStatus === "danger" ||
    riskStatus === "caution" ||
    tradesToday >= maxTrades * 0.8
  ) {
    return {
      verdict: "caution",
      headline: "Trade with caution",
      detail: "Elevated risk or trade count — reduce size and be selective.",
    };
  }

  return {
    verdict: "go",
    headline: "Clear to trade",
    detail: "Within profile limits — stay disciplined on the next setup.",
  };
}

export function computePropTodaySnapshot(params: {
  profile: TraderProfileView;
  metrics: TradeLockerDashboardMetrics | null;
  tradesTodayTl: number;
  journalEntries: JournalSlice[];
  tlConnected: boolean;
}): PropTodaySnapshot {
  const { profile, metrics, tradesTodayTl, journalEntries, tlConnected } =
    params;

  const tradesToday = resolveTradesTodayCount(tradesTodayTl, journalEntries);
  const maxTrades = profile.maxTradesPerDay;
  const tradesRemaining = Math.max(0, maxTrades - tradesToday);
  const tradesUsedPct =
    maxTrades > 0 ? Math.min(100, Math.round((tradesToday / maxTrades) * 100)) : 0;

  const balance = metrics?.balance ?? 0;
  const dailyLossBudgetTotal =
    balance > 0 ? (profile.dailyLossLimitPct / 100) * balance : 0;

  const gate = evaluatePreTradeGate(metrics, profile, { tradesToday });
  const { riskGuard } = gate;
  const { verdict, headline, detail } = verdictFromGate(
    riskGuard.status,
    tradesToday,
    maxTrades
  );

  const lossBudgetUsedPct =
    dailyLossBudgetTotal > 0
      ? Math.min(
          100,
          Math.round(
            ((dailyLossBudgetTotal - riskGuard.remainingDailyBudget) /
              dailyLossBudgetTotal) *
              100
          )
        )
      : Math.min(
          100,
          Math.round(
            (riskGuard.dailyLossUsedPct / profile.dailyLossLimitPct) * 100
          )
        );

  return {
    verdict,
    verdictHeadline: headline,
    verdictDetail: detail,
    canTrade: riskGuard.status !== "halt" && tradesToday < maxTrades,
    riskStatus: riskGuard.status,
    tradesToday,
    tradesRemaining,
    maxTradesPerDay: maxTrades,
    tradesUsedPct,
    dailyLossUsedPct: riskGuard.dailyLossUsedPct,
    dailyLossLimitPct: profile.dailyLossLimitPct,
    remainingDailyBudget: riskGuard.remainingDailyBudget,
    dailyLossBudgetTotal,
    lossBudgetUsedPct,
    todayNetPnL: metrics?.todayNetPnL ?? 0,
    openPositions: metrics?.openPositionsCount ?? 0,
    balance,
    tlConnected,
  };
}