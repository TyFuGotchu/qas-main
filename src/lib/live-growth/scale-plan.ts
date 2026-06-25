import type { AlphaDurabilityResult } from "@/lib/quicksilver/alpha-durability";
import type { JournalStats, SessionStatsResult } from "@/lib/journal/stats";
import type { GrowthCoachResult } from "@/lib/tradelocker/account-tools";
import type { TraderProfileView } from "@/lib/trader-profile";

export const EQUITY_MILESTONES = [
  5_000, 10_000, 25_000, 50_000, 100_000, 250_000, 500_000, 1_000_000,
] as const;

export type GrowthPhase = "foundation" | "build" | "scale" | "institutional";

export interface PlaybookCard {
  title: string;
  body: string;
  priority: "high" | "medium";
}

export interface ScalePlanResult {
  currentBalance: number;
  phase: GrowthPhase;
  phaseLabel: string;
  phaseDescription: string;
  nextMilestone: number | null;
  prevMilestone: number;
  progressToNextPct: number;
  monthlyTargetPct: number;
  monthlyTargetDollars: number;
  monthsToNextMilestone: number | null;
  compoundProjection12Mo: number;
  compoundProjection24Mo: number;
  scaleGrade: "A" | "B" | "C" | "D";
  scaleScore: number;
  insights: string[];
  playbook: PlaybookCard[];
}

function resolvePhase(balance: number): {
  phase: GrowthPhase;
  label: string;
  description: string;
  monthlyTargetPct: number;
} {
  if (balance < 25_000) {
    return {
      phase: "foundation",
      label: "Foundation",
      description:
        "Protect capital and build repeatable process. Focus on consistency over size.",
      monthlyTargetPct: 8,
    };
  }
  if (balance < 100_000) {
    return {
      phase: "build",
      label: "Build",
      description:
        "Edge is proven — compound with fixed risk % and session discipline.",
      monthlyTargetPct: 6,
    };
  }
  if (balance < 500_000) {
    return {
      phase: "scale",
      label: "Scale",
      description:
        "Treat the account like a business. Liquidity, slippage, and heat matter more.",
      monthlyTargetPct: 4,
    };
  }
  return {
    phase: "institutional",
    label: "Institutional",
    description:
      "Preserve edge at size. Capital efficiency and drawdown control dominate returns.",
    monthlyTargetPct: 3,
  };
}

function resolveMilestones(balance: number): {
  prev: number;
  next: number | null;
  progressPct: number;
} {
  const safeBalance = Math.max(balance, 0);
  let prev = 0;
  let next: number | null = EQUITY_MILESTONES[0] ?? null;

  for (const milestone of EQUITY_MILESTONES) {
    if (safeBalance >= milestone) {
      prev = milestone;
      const idx = EQUITY_MILESTONES.indexOf(milestone);
      next = EQUITY_MILESTONES[idx + 1] ?? null;
    } else {
      next = milestone;
      break;
    }
  }

  if (next == null) {
    return { prev, next: null, progressPct: 100 };
  }

  const range = next - prev;
  const progressPct =
    range > 0
      ? Math.min(100, Math.round(((safeBalance - prev) / range) * 100))
      : 0;

  return { prev, next, progressPct };
}

function compoundBalance(
  start: number,
  monthlyPct: number,
  months: number
): number {
  const rate = monthlyPct / 100;
  return Math.round(start * Math.pow(1 + rate, months) * 100) / 100;
}

function formatMilestone(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}k`;
  return `$${value.toLocaleString()}`;
}

function buildPlaybook(
  phase: GrowthPhase,
  profile: TraderProfileView,
  sessionStats: SessionStatsResult | null
): PlaybookCard[] {
  const cards: PlaybookCard[] = [
    {
      title: "Fixed risk per trade",
      body: `Risk ${profile.riskPerTradePct}% per setup — never scale up after a win streak without journal proof.`,
      priority: "high",
    },
    {
      title: "Daily loss circuit breaker",
      body: `Stop at ${profile.dailyLossLimitPct}% daily loss. Live accounts die from revenge trading, not bad setups.`,
      priority: "high",
    },
    {
      title: "Withdrawal discipline",
      body:
        phase === "foundation" || phase === "build"
          ? "Reinvest profits until you hit the next milestone — then skim 10–20% to reduce emotional pressure."
          : "Pay yourself on a schedule. Pros treat withdrawals as salary, not lottery tickets.",
      priority: phase === "institutional" ? "high" : "medium",
    },
  ];

  if (sessionStats?.bestSession) {
    const best = sessionStats.rows.find((r) => r.session === sessionStats.bestSession);
    if (best) {
      cards.push({
        title: "Session specialization",
        body: `Your journal shows strongest results in ${best.label}. Prioritize that window; reduce low-edge sessions.`,
        priority: "medium",
      });
    }
  }

  if (phase === "scale" || phase === "institutional") {
    cards.push({
      title: "Liquidity & execution",
      body: "At size, partial fills and spread matter. Plan max position size per instrument before entry.",
      priority: "high",
    });
  }

  return cards;
}

function liveGrowthInsights(params: {
  balance: number;
  phase: GrowthPhase;
  nextMilestone: number | null;
  progressPct: number;
  journalStats: JournalStats | null;
  alpha: AlphaDurabilityResult | null;
  sessionStats: SessionStatsResult | null;
  growthCoach: GrowthCoachResult | null;
  profile: TraderProfileView;
}): string[] {
  const insights: string[] = [];
  const {
    balance,
    phase,
    nextMilestone,
    progressPct,
    journalStats,
    alpha,
    sessionStats,
    growthCoach,
    profile,
  } = params;

  if (nextMilestone) {
    insights.push(
      `${progressPct}% toward ${formatMilestone(nextMilestone)} — ${phase === "foundation" ? "stack small wins" : "stay on process"} to reach the next equity tier.`
    );
  } else {
    insights.push(
      "You've cleared the $1M milestone track — focus shifts to capital preservation and execution quality."
    );
  }

  if (growthCoach) {
    if (growthCoach.todayProgressPct >= 100) {
      insights.push(
        "Daily growth target hit — pros often stop early on live accounts to protect monthly consistency."
      );
    } else if (growthCoach.todayProgressPct < -50) {
      insights.push(
        "Red day — cut size tomorrow. Live account scaling requires protecting the equity curve."
      );
    }
  }

  if (journalStats && journalStats.closedTrades >= 10) {
    if (journalStats.winRate >= 55 && journalStats.avgR >= 0.5) {
      insights.push(
        `Journal edge is solid (${journalStats.winRate}% WR, ${journalStats.avgR}R avg) — maintain risk %; don't chase size.`
      );
    } else if (journalStats.winRate < 45) {
      insights.push(
        "Win rate below 45% in journal — fix setup selection before increasing live size."
      );
    }
  } else {
    insights.push(
      "Log 30+ closed trades in the journal to unlock live-specific edge and scale recommendations."
    );
  }

  if (alpha) {
    if (alpha.edgeStatus === "ERODING" || alpha.edgeStatus === "EXPIRED") {
      insights.push(
        `Alpha durability is ${alpha.edgeStatus.toLowerCase()} — pause scaling until recent win rate recovers.`
      );
    } else if (alpha.durabilityGrade === "A" || alpha.durabilityGrade === "A+") {
      insights.push(
        "Alpha grade supports scaling — increase size only in 10–15% steps after each profitable month."
      );
    }
  }

  if (sessionStats?.bestSession) {
    const best = sessionStats.rows.find((r) => r.session === sessionStats.bestSession);
    if (best && best.closed >= 3) {
      insights.push(sessionStats.insight);
    }
  }

  if (balance > 0 && profile.riskPerTradePct > 1.5 && phase !== "foundation") {
    insights.push(
      `Risk per trade is ${profile.riskPerTradePct}% — at ${formatMilestone(balance)} balance, pros often cap at 0.5–1% for smoother compounding.`
    );
  }

  return insights.slice(0, 5);
}

function computeScaleScore(params: {
  journalStats: JournalStats | null;
  alpha: AlphaDurabilityResult | null;
  growthCoach: GrowthCoachResult | null;
}): { score: number; grade: ScalePlanResult["scaleGrade"] } {
  let score = 40;

  if (params.growthCoach) {
    score += params.growthCoach.consistencyScore * 0.3;
  }

  if (params.journalStats && params.journalStats.closedTrades >= 5) {
    score += Math.min(25, params.journalStats.winRate * 0.25);
    if (params.journalStats.avgR > 0) score += 10;
  }

  if (params.alpha) {
    const gradeBoost: Record<string, number> = {
      "A+": 15,
      A: 12,
      B: 6,
      C: 0,
      F: -10,
    };
    score += gradeBoost[params.alpha.durabilityGrade] ?? 0;
  }

  score = Math.min(100, Math.max(0, Math.round(score)));

  const grade: ScalePlanResult["scaleGrade"] =
    score >= 75 ? "A" : score >= 55 ? "B" : score >= 35 ? "C" : "D";

  return { score, grade };
}

export function computeScalePlan(params: {
  balance: number;
  profile: TraderProfileView;
  journalStats: JournalStats | null;
  sessionStats: SessionStatsResult | null;
  alpha: AlphaDurabilityResult | null;
  growthCoach: GrowthCoachResult | null;
}): ScalePlanResult {
  const balance = Math.max(params.balance, 0);
  const phaseInfo = resolvePhase(balance);
  const { prev, next, progressPct } = resolveMilestones(balance);
  const monthlyTargetDollars = balance * (phaseInfo.monthlyTargetPct / 100);

  const monthsToNextMilestone =
    next != null && monthlyTargetDollars > 0
      ? Math.ceil((next - balance) / monthlyTargetDollars)
      : null;

  const { score, grade } = computeScaleScore({
    journalStats: params.journalStats,
    alpha: params.alpha,
    growthCoach: params.growthCoach,
  });

  return {
    currentBalance: balance,
    phase: phaseInfo.phase,
    phaseLabel: phaseInfo.label,
    phaseDescription: phaseInfo.description,
    nextMilestone: next,
    prevMilestone: prev,
    progressToNextPct: progressPct,
    monthlyTargetPct: phaseInfo.monthlyTargetPct,
    monthlyTargetDollars: Math.round(monthlyTargetDollars * 100) / 100,
    monthsToNextMilestone,
    compoundProjection12Mo: compoundBalance(
      balance,
      phaseInfo.monthlyTargetPct,
      12
    ),
    compoundProjection24Mo: compoundBalance(
      balance,
      phaseInfo.monthlyTargetPct,
      24
    ),
    scaleGrade: grade,
    scaleScore: score,
    insights: liveGrowthInsights({
      balance,
      phase: phaseInfo.phase,
      nextMilestone: next,
      progressPct,
      journalStats: params.journalStats,
      alpha: params.alpha,
      sessionStats: params.sessionStats,
      growthCoach: params.growthCoach,
      profile: params.profile,
    }),
    playbook: buildPlaybook(
      phaseInfo.phase,
      params.profile,
      params.sessionStats
    ),
  };
}

export function formatEquity(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}