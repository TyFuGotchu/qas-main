import type {
  TradeLockerDashboardMetrics,
  TradeLockerPosition,
} from "@/lib/tradelocker/types";

export type RiskGuardStatus = "safe" | "caution" | "danger" | "halt";

export interface RiskGuardResult {
  status: RiskGuardStatus;
  dailyLossUsedPct: number;
  openLossPct: number;
  drawdownFromPeakPct: number;
  remainingDailyBudget: number;
  message: string;
}

export interface PositionSizeResult {
  riskDollars: number;
  suggestedLots: number;
  maxLotsAtRisk: number;
  openExposurePct: number;
  message: string;
}

export interface GrowthCoachResult {
  dailyProfitTarget: number;
  todayProgressPct: number;
  daysToTarget: number | null;
  consistencyScore: number;
  grade: "A" | "B" | "C" | "D";
  insights: string[];
}

export function computeRiskGuard(
  metrics: TradeLockerDashboardMetrics,
  options: {
    dailyLossLimitPct: number;
    maxDrawdownPct: number;
    sessionStartBalance?: number;
  }
): RiskGuardResult {
  const balance = Math.max(metrics.balance, 1);
  const todayLoss = Math.max(0, -metrics.todayNetPnL);
  const openLoss = Math.max(0, -metrics.openNetPnL);
  const dailyLossUsedPct = (todayLoss / balance) * 100;
  const openLossPct = (openLoss / balance) * 100;

  const peakBalance = options.sessionStartBalance ?? balance;
  const drawdownFromPeakPct =
    peakBalance > 0
      ? (Math.max(0, peakBalance - balance - metrics.openNetPnL) / peakBalance) *
        100
      : 0;

  const remainingDailyBudget =
    (options.dailyLossLimitPct / 100) * balance - todayLoss;

  let status: RiskGuardStatus = "safe";
  let message =
    "Within prop-style risk limits. Stay disciplined on the next setup.";

  if (
    dailyLossUsedPct >= options.dailyLossLimitPct ||
    drawdownFromPeakPct >= options.maxDrawdownPct
  ) {
    status = "halt";
    message =
      "Daily loss or drawdown limit reached — stop trading for this session.";
  } else if (
    dailyLossUsedPct >= options.dailyLossLimitPct * 0.8 ||
    drawdownFromPeakPct >= options.maxDrawdownPct * 0.8
  ) {
    status = "danger";
    message =
      "Approaching limit — reduce size or pause until next session.";
  } else if (
    dailyLossUsedPct >= options.dailyLossLimitPct * 0.5 ||
    openLossPct >= options.dailyLossLimitPct * 0.4
  ) {
    status = "caution";
    message = "Elevated risk — tighten stops and avoid revenge trades.";
  }

  return {
    status,
    dailyLossUsedPct: Math.round(dailyLossUsedPct * 10) / 10,
    openLossPct: Math.round(openLossPct * 10) / 10,
    drawdownFromPeakPct: Math.round(drawdownFromPeakPct * 10) / 10,
    remainingDailyBudget: Math.max(0, remainingDailyBudget),
    message,
  };
}

export function computePositionSize(
  balance: number,
  positions: TradeLockerPosition[],
  options: {
    riskPerTradePct: number;
    stopLossPips: number;
    pipValuePerLot: number;
  }
): PositionSizeResult {
  const safeBalance = Math.max(balance, 1);
  const riskDollars = safeBalance * (options.riskPerTradePct / 100);
  const stopRiskPerLot = options.stopLossPips * options.pipValuePerLot;
  const suggestedLots =
    stopRiskPerLot > 0
      ? Math.floor((riskDollars / stopRiskPerLot) * 100) / 100
      : 0;
  const maxLotsAtRisk = Math.max(0.01, suggestedLots);

  const openUnrealized = positions.reduce(
    (sum, p) => sum + Math.abs(Number(p.unrealizedPl) || 0),
    0
  );
  const openExposurePct = (openUnrealized / safeBalance) * 100;

  let message = `Risking ${options.riskPerTradePct}% ($${riskDollars.toFixed(2)}) per trade at ${options.stopLossPips} pip stop.`;
  if (openExposurePct > options.riskPerTradePct * 3) {
    message +=
      " Open book heat is high — consider closing or hedging before adding size.";
  }

  return {
    riskDollars: Math.round(riskDollars * 100) / 100,
    suggestedLots,
    maxLotsAtRisk,
    openExposurePct: Math.round(openExposurePct * 10) / 10,
    message,
  };
}

export function computeGrowthCoach(
  metrics: TradeLockerDashboardMetrics,
  options: {
    monthlyTargetPct: number;
    tradingDaysPerMonth: number;
  }
): GrowthCoachResult {
  const balance = Math.max(metrics.balance, 1);
  const monthlyTargetDollars = balance * (options.monthlyTargetPct / 100);
  const dailyProfitTarget =
    monthlyTargetDollars / Math.max(options.tradingDaysPerMonth, 1);
  const todayProgressPct =
    dailyProfitTarget > 0
      ? (metrics.todayNetPnL / dailyProfitTarget) * 100
      : 0;

  const daysToTarget =
    dailyProfitTarget > 0 && monthlyTargetDollars > metrics.todayNetPnL
      ? Math.ceil(
          (monthlyTargetDollars - Math.max(0, metrics.todayNetPnL)) /
            dailyProfitTarget
        )
      : metrics.todayNetPnL >= monthlyTargetDollars
        ? 0
        : null;

  const winRate = metrics.winRate ?? 0;
  const closed = metrics.closedTrades;
  let consistencyScore = 50;
  if (closed >= 20) {
    consistencyScore = Math.min(
      100,
      Math.round(winRate * 0.6 + Math.min(closed, 50) * 0.8)
    );
  } else if (closed >= 5) {
    consistencyScore = Math.round(winRate * 0.5 + closed * 2);
  }

  const grade: GrowthCoachResult["grade"] =
    consistencyScore >= 75
      ? "A"
      : consistencyScore >= 55
        ? "B"
        : consistencyScore >= 35
          ? "C"
          : "D";

  const insights: string[] = [];

  if (metrics.todayNetPnL > dailyProfitTarget) {
    insights.push(
      "Daily target hit — consider stopping early to protect consistency (prop firm best-day rules)."
    );
  } else if (metrics.todayNetPnL < 0 && Math.abs(metrics.todayNetPnL) > dailyProfitTarget * 0.5) {
    insights.push(
      "Down more than half a target day — reduce size; do not chase losses."
    );
  }

  if (winRate != null && winRate < 45 && closed >= 10) {
    insights.push(
      "Win rate below 45% on recent history — review setup scoring before next entry."
    );
  } else if (winRate != null && winRate >= 55 && closed >= 10) {
    insights.push(
      "Solid win rate — focus on R:R and position sizing to compound equity."
    );
  }

  if (metrics.openPositionsCount > 3) {
    insights.push(
      `${metrics.openPositionsCount} open positions — portfolio heat may be elevated.`
    );
  }

  if (insights.length === 0) {
    insights.push(
      "Journal each trade. Pros scale by repeating the same risk % and setup criteria."
    );
  }

  return {
    dailyProfitTarget: Math.round(dailyProfitTarget * 100) / 100,
    todayProgressPct: Math.round(todayProgressPct * 10) / 10,
    daysToTarget,
    consistencyScore,
    grade,
    insights,
  };
}

export function riskStatusColor(status: RiskGuardStatus): string {
  switch (status) {
    case "safe":
      return "text-emerald-400";
    case "caution":
      return "text-amber-400";
    case "danger":
      return "text-orange-400";
    case "halt":
      return "text-red-400";
    default:
      return "text-slate-400";
  }
}

export function riskStatusLabel(status: RiskGuardStatus): string {
  switch (status) {
    case "safe":
      return "Clear to trade";
    case "caution":
      return "Trade smaller";
    case "danger":
      return "Near limit";
    case "halt":
      return "Stop trading";
    default:
      return "Unknown";
  }
}