import { resolveTradesTodayCount } from "@/lib/journal/trade-count";
import type { SessionStatsResult } from "@/lib/journal/stats";
import {
  getSessionDisplay,
  getSessionLabel,
  resolveCurrentTradingSession,
  type TradingSessionId,
} from "@/lib/journal/trading-session";
import { getTimezoneLabel } from "@/lib/journal/timezone";
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
  timezone: string;
  timezoneLabel: string;
  currentSession: TradingSessionId;
  currentSessionLabel: string;
  currentSessionLocalWindow: string;
  bestSession: TradingSessionId | null;
  bestSessionLabel: string | null;
  sessionInsight: string | null;
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

function buildSessionInsight(params: {
  currentSession: TradingSessionId;
  sessionStats: SessionStatsResult | null;
  timezone: string;
}): {
  bestSession: TradingSessionId | null;
  bestSessionLabel: string | null;
  insight: string | null;
} {
  const { currentSession, sessionStats, timezone } = params;
  const currentDisplay = getSessionDisplay(currentSession, timezone);

  if (!sessionStats || sessionStats.rows.length === 0) {
    return {
      bestSession: null,
      bestSessionLabel: null,
      insight: `Now in ${currentDisplay.label} (${currentDisplay.window} your time). Log trades to unlock session edge.`,
    };
  }

  const bestSession = sessionStats.bestSession;
  const bestSessionLabel = bestSession ? getSessionLabel(bestSession) : null;

  if (bestSession === currentSession && bestSessionLabel) {
    return {
      bestSession,
      bestSessionLabel,
      insight: `You're in your strongest session (${bestSessionLabel}, ${currentDisplay.window}). ${sessionStats.insight}`,
    };
  }

  if (bestSession && bestSessionLabel) {
    const bestWindow = getSessionDisplay(bestSession, timezone).window;
    return {
      bestSession,
      bestSessionLabel,
      insight: `Now: ${currentDisplay.label} (${currentDisplay.window}). Best edge: ${bestSessionLabel} (${bestWindow}).`,
    };
  }

  return {
    bestSession: null,
    bestSessionLabel: null,
    insight: sessionStats.insight,
  };
}

export function computePropTodaySnapshot(params: {
  profile: TraderProfileView;
  metrics: TradeLockerDashboardMetrics | null;
  tradesTodayTl: number;
  journalEntries: JournalSlice[];
  tlConnected: boolean;
  sessionStats?: SessionStatsResult | null;
}): PropTodaySnapshot {
  const {
    profile,
    metrics,
    tradesTodayTl,
    journalEntries,
    tlConnected,
    sessionStats = null,
  } = params;

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

  const timezone = profile.timezone;
  const currentSession = resolveCurrentTradingSession();
  const currentDisplay = getSessionDisplay(currentSession, timezone);
  const sessionEdge = buildSessionInsight({
    currentSession,
    sessionStats,
    timezone,
  });

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
    timezone,
    timezoneLabel: getTimezoneLabel(timezone),
    currentSession,
    currentSessionLabel: currentDisplay.label,
    currentSessionLocalWindow: currentDisplay.window,
    bestSession: sessionEdge.bestSession,
    bestSessionLabel: sessionEdge.bestSessionLabel,
    sessionInsight: sessionEdge.insight,
  };
}