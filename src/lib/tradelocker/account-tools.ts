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
  riskPerTradePct: number;
  balance: number;
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
  }
): PositionSizeResult {
  const safeBalance = Math.max(balance, 1);
  const riskPerTradePct = options.riskPerTradePct;
  const riskDollars = safeBalance * (riskPerTradePct / 100);

  const openUnrealized = positions.reduce(
    (sum, p) => sum + Math.abs(Number(p.unrealizedPl) || 0),
    0
  );
  const openExposurePct = (openUnrealized / safeBalance) * 100;

  let message = `Cap each trade at ${riskPerTradePct}% of account ($${riskDollars.toFixed(2)}). You choose lot size — margin and leverage vary by broker and prop firm.`;
  if (openExposurePct > riskPerTradePct * 3) {
    message +=
      " Open book heat is high — consider closing or hedging before adding size.";
  }

  return {
    riskDollars: Math.round(riskDollars * 100) / 100,
    riskPerTradePct,
    balance: safeBalance,
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

export type ExposureBias = "neutral" | "long" | "short" | "one-sided";

export interface ExposureScanResult {
  longCount: number;
  shortCount: number;
  bias: ExposureBias;
  biasScore: number;
  netOpenPnL: number;
  topWinner: { label: string; pnl: number } | null;
  topLoser: { label: string; pnl: number } | null;
  concentrationPct: number;
  concentratedInstrument: string | null;
  alerts: string[];
}

export function computeExposureScan(
  positions: TradeLockerPosition[],
  balance: number,
  resolveInstrumentName: (instrumentId: string) => string
): ExposureScanResult {
  const safeBalance = Math.max(balance, 1);
  let longCount = 0;
  let shortCount = 0;
  let netOpenPnL = 0;

  const byInstrument = new Map<string, number>();
  let topWinner: ExposureScanResult["topWinner"] = null;
  let topLoser: ExposureScanResult["topLoser"] = null;

  for (const position of positions) {
    const side = position.side.toLowerCase();
    if (side === "buy" || side === "long") longCount += 1;
    else if (side === "sell" || side === "short") shortCount += 1;

    const pnl = Number(position.unrealizedPl) || 0;
    netOpenPnL += pnl;
    const label = resolveInstrumentName(position.instrumentId);

    byInstrument.set(label, (byInstrument.get(label) ?? 0) + 1);

    if (!topWinner || pnl > topWinner.pnl) {
      topWinner = { label, pnl };
    }
    if (!topLoser || pnl < topLoser.pnl) {
      topLoser = { label, pnl };
    }
  }

  const total = positions.length;
  let concentratedInstrument: string | null = null;
  let concentrationPct = 0;
  for (const [instrument, count] of Array.from(byInstrument.entries())) {
    const pct = total > 0 ? (count / total) * 100 : 0;
    if (pct > concentrationPct) {
      concentrationPct = pct;
      concentratedInstrument = instrument;
    }
  }

  const biasScore =
    total > 0 ? Math.round(((longCount - shortCount) / total) * 100) : 0;

  let bias: ExposureBias = "neutral";
  if (total === 0) {
    bias = "neutral";
  } else if (longCount === 0 || shortCount === 0) {
    bias = "one-sided";
  } else if (biasScore >= 25) {
    bias = "long";
  } else if (biasScore <= -25) {
    bias = "short";
  }

  const alerts: string[] = [];
  const openLossPct = (Math.max(0, -netOpenPnL) / safeBalance) * 100;

  if (total === 0) {
    alerts.push("No open exposure — book is flat. Good time to plan the next setup.");
  } else {
    if (bias === "one-sided") {
      alerts.push(
        "All positions lean one direction — add hedges or reduce correlated entries."
      );
    }
    if (concentrationPct >= 60 && concentratedInstrument) {
      alerts.push(
        `${Math.round(concentrationPct)}% of positions are in ${concentratedInstrument} — concentration risk is elevated.`
      );
    }
    if (openLossPct >= 2) {
      alerts.push(
        `Open book is down ${openLossPct.toFixed(1)}% of balance — review losers before adding size.`
      );
    }
    if (topWinner && topWinner.pnl > safeBalance * 0.015) {
      alerts.push(
        `${topWinner.label} is carrying the book — consider partial profits to lock gains.`
      );
    }
    if (alerts.length === 0) {
      alerts.push("Exposure looks balanced — keep risk per trade consistent.");
    }
  }

  return {
    longCount,
    shortCount,
    bias,
    biasScore,
    netOpenPnL: Math.round(netOpenPnL * 100) / 100,
    topWinner: topWinner && topWinner.pnl > 0 ? topWinner : null,
    topLoser: topLoser && topLoser.pnl < 0 ? topLoser : null,
    concentrationPct: Math.round(concentrationPct),
    concentratedInstrument,
    alerts,
  };
}

export function exposureBiasLabel(bias: ExposureBias): string {
  switch (bias) {
    case "long":
      return "Long bias";
    case "short":
      return "Short bias";
    case "one-sided":
      return "One-sided book";
    default:
      return "Balanced";
  }
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