/** Insights & calculators for live-capital portfolio growth (not prop evaluation). */

export interface PortfolioLabInput {
  startingEquity: number;
  monthlyReturnPct: number;
  riskPerTradePct: number;
  maxOpenRiskPct: number;
  months: number;
}

export interface PortfolioLabResult {
  projectedEquity: number;
  totalGrowthPct: number;
  maxRiskDollarsPerTrade: number;
  maxPortfolioHeatDollars: number;
  suggestedUnits: number;
  milestonesHit: number[];
  rules: { title: string; body: string }[];
  scaleSteps: { equity: number; riskPct: number; note: string }[];
}

const MILESTONES = [5_000, 10_000, 25_000, 50_000, 100_000, 250_000, 500_000];

export function computePortfolioLab(input: PortfolioLabInput): PortfolioLabResult {
  const start = Math.max(100, input.startingEquity);
  const r = Math.max(0, Math.min(50, input.monthlyReturnPct)) / 100;
  const months = Math.max(1, Math.min(60, Math.round(input.months)));
  const riskPct = Math.max(0.1, Math.min(5, input.riskPerTradePct));
  const heatPct = Math.max(riskPct, Math.min(15, input.maxOpenRiskPct));

  const projectedEquity = start * Math.pow(1 + r, months);
  const totalGrowthPct = ((projectedEquity - start) / start) * 100;

  const maxRiskDollarsPerTrade = (start * riskPct) / 100;
  const maxPortfolioHeatDollars = (start * heatPct) / 100;
  const suggestedUnits = Math.max(
    1,
    Math.floor(heatPct / riskPct)
  );

  const milestonesHit = MILESTONES.filter((m) => projectedEquity >= m);

  const rules = [
    {
      title: "Risk is the throttle, not the edge",
      body: `Keep risk per trade near ${riskPct}% of equity. Edge compounds; oversized risk resets the account.`,
    },
    {
      title: "Portfolio heat = concurrent exposure",
      body: `Cap total open risk around ${heatPct}% so correlated losses cannot wipe a month of gains.`,
    },
    {
      title: "Scale size after equity, not after one win",
      body: "Increase position size only when equity hits the next milestone and your process stats (win rate, expectancy) are still intact.",
    },
    {
      title: "Separate prop rules from live capital",
      body: "Prop challenges optimize for pass criteria. Live capital optimizes for survival + compounding. Do not copy prop daily targets onto personal money.",
    },
    {
      title: "Withdraw a slice of profits",
      body: "At each major milestone, bank a portion of gains so growth is real wealth, not only on-screen equity.",
    },
  ];

  const scaleSteps = [
    {
      equity: start,
      riskPct: Math.min(riskPct, 1),
      note: "Foundation — prove process, small heat",
    },
    {
      equity: Math.max(start * 1.5, 10_000),
      riskPct: Math.min(riskPct, 0.75),
      note: "Build — same % risk as equity grows (dollars scale automatically)",
    },
    {
      equity: Math.max(start * 3, 50_000),
      riskPct: Math.min(riskPct * 0.8, 0.5),
      note: "Scale — slightly lower % risk; liquidity & slippage matter",
    },
    {
      equity: Math.max(start * 10, 100_000),
      riskPct: Math.min(riskPct * 0.6, 0.35),
      note: "Institutional-style — preserve edge at size",
    },
  ];

  return {
    projectedEquity,
    totalGrowthPct,
    maxRiskDollarsPerTrade,
    maxPortfolioHeatDollars,
    suggestedUnits,
    milestonesHit,
    rules,
    scaleSteps,
  };
}

export function formatUsd(n: number): string {
  return `$${n.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;
}
