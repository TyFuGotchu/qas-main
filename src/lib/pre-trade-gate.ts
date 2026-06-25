import {
  computeRiskGuard,
  type RiskGuardResult,
  type RiskGuardStatus,
} from "@/lib/tradelocker/account-tools";
import type { TradeLockerDashboardMetrics } from "@/lib/tradelocker/types";
import type { TraderProfileView } from "@/lib/trader-profile";

export type GateSeverity = "info" | "warning" | "block";

export interface GateViolation {
  code: string;
  severity: GateSeverity;
  message: string;
}

export interface PreTradeGateResult {
  allowed: boolean;
  requiresAcknowledgment: boolean;
  riskGuard: RiskGuardResult;
  violations: GateViolation[];
  summary: string;
}

function statusSeverity(status: RiskGuardStatus): GateSeverity {
  if (status === "halt") return "block";
  if (status === "danger") return "warning";
  if (status === "caution") return "warning";
  return "info";
}

export function evaluatePreTradeGate(
  metrics: TradeLockerDashboardMetrics | null,
  profile: TraderProfileView,
  options?: {
    tradesToday?: number;
    gateAcknowledged?: boolean;
  }
): PreTradeGateResult {
  const violations: GateViolation[] = [];
  const tradesToday = options?.tradesToday ?? 0;

  if (tradesToday >= profile.maxTradesPerDay) {
    violations.push({
      code: "max_trades",
      severity: "block",
      message: `Daily trade cap reached (${profile.maxTradesPerDay} max).`,
    });
  } else if (tradesToday >= profile.maxTradesPerDay * 0.8) {
    violations.push({
      code: "trades_near_cap",
      severity: "warning",
      message: `${tradesToday}/${profile.maxTradesPerDay} trades used today.`,
    });
  }

  const defaultMetrics: TradeLockerDashboardMetrics = {
    balance: 10000,
    openNetPnL: 0,
    todayNetPnL: 0,
    winRate: null,
    closedTrades: 0,
    openPositionsCount: 0,
  };

  const riskGuard = computeRiskGuard(metrics ?? defaultMetrics, {
    dailyLossLimitPct: profile.dailyLossLimitPct,
    maxDrawdownPct: profile.maxDrawdownPct,
  });

  const riskSeverity = statusSeverity(riskGuard.status);
  if (riskGuard.status !== "safe") {
    violations.push({
      code: "risk_guard",
      severity: riskSeverity,
      message: riskGuard.message,
    });
  }

  const hasBlock = violations.some((v) => v.severity === "block");
  const hasWarning = violations.some((v) => v.severity === "warning");

  const requiresAcknowledgment =
    profile.strictPreTradeGate && hasWarning && !hasBlock;

  let allowed = true;
  if (hasBlock) {
    allowed = false;
  } else if (requiresAcknowledgment && !options?.gateAcknowledged) {
    allowed = false;
  }

  let summary = "All checks passed — proceed with discipline.";
  if (hasBlock) {
    summary = "Order blocked by your risk rules.";
  } else if (requiresAcknowledgment && !options?.gateAcknowledged) {
    summary = "Acknowledge elevated risk to continue.";
  } else if (hasWarning) {
    summary = "Elevated risk acknowledged — size down.";
  }

  return {
    allowed,
    requiresAcknowledgment,
    riskGuard,
    violations,
    summary,
  };
}