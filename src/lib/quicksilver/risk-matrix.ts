export interface RiskMatrixInput {
  accountSize: number;
  riskPerTradePercent: number;
  openPositions: number;
  avgPositionCorrelation: number;
  winRate: number;
  avgRiskReward: number;
  maxDailyLossPercent: number;
  maxDrawdownPercent: number;
}

export interface RiskMatrixResult {
  portfolioHeat: number;
  heatStatus: "SAFE" | "ELEVATED" | "CRITICAL";
  kellyFraction: number;
  kellyAdjusted: number;
  recommendedRiskPercent: number;
  maxConcurrentPositions: number;
  correlationPenalty: number;
  dailyRiskBudget: number;
  perTradeDollarRisk: number;
  breachWarnings: string[];
  qsRiskGrade: "A" | "B" | "C" | "D";
}

export function computeRiskMatrix(input: RiskMatrixInput): RiskMatrixResult {
  const {
    accountSize,
    riskPerTradePercent,
    openPositions,
    avgPositionCorrelation,
    winRate,
    avgRiskReward,
    maxDailyLossPercent,
    maxDrawdownPercent,
  } = input;

  const winProb = winRate / 100;
  const lossProb = 1 - winProb;
  const kelly =
    winProb - lossProb / Math.max(avgRiskReward, 0.1);
  const kellyFraction = Math.max(0, Math.min(kelly, 0.25));
  const kellyAdjusted = parseFloat((kellyFraction * 100).toFixed(2));

  const correlationPenalty = parseFloat(
    (1 + Math.max(0, avgPositionCorrelation) * 0.6).toFixed(2)
  );

  const rawHeat =
    riskPerTradePercent * openPositions * correlationPenalty;
  const portfolioHeat = parseFloat(Math.min(100, rawHeat).toFixed(1));

  const heatStatus: RiskMatrixResult["heatStatus"] =
    portfolioHeat >= 12
      ? "CRITICAL"
      : portfolioHeat >= 7
      ? "ELEVATED"
      : "SAFE";

  const recommendedRiskPercent = parseFloat(
    Math.min(
      riskPerTradePercent,
      kellyAdjusted * 0.5,
      maxDailyLossPercent / Math.max(openPositions, 1)
    ).toFixed(2)
  );

  const maxConcurrentPositions = Math.max(
    1,
    Math.floor(maxDailyLossPercent / Math.max(recommendedRiskPercent, 0.25))
  );

  const dailyRiskBudget = accountSize * (maxDailyLossPercent / 100);
  const perTradeDollarRisk = accountSize * (recommendedRiskPercent / 100);

  const breachWarnings: string[] = [];
  if (portfolioHeat >= maxDrawdownPercent * 0.5) {
    breachWarnings.push(
      "Portfolio heat exceeds 50% of max drawdown tolerance — reduce exposure."
    );
  }
  if (openPositions > maxConcurrentPositions) {
    breachWarnings.push(
      `QS Matrix: ${openPositions} open positions exceeds recommended max of ${maxConcurrentPositions}.`
    );
  }
  if (kellyFraction <= 0) {
    breachWarnings.push(
      "Negative expectancy detected — Kelly criterion indicates no mathematical edge."
    );
  }
  if (avgPositionCorrelation > 0.7) {
    breachWarnings.push(
      "High cross-position correlation — diversification benefit collapsed."
    );
  }
  if (riskPerTradePercent > kellyAdjusted) {
    breachWarnings.push(
      `Risk per trade (${riskPerTradePercent}%) exceeds half-Kelly ceiling (${(kellyAdjusted * 0.5).toFixed(2)}%).`
    );
  }

  const qsRiskGrade: RiskMatrixResult["qsRiskGrade"] =
    breachWarnings.length === 0 && heatStatus === "SAFE"
      ? "A"
      : breachWarnings.length <= 1 && heatStatus !== "CRITICAL"
      ? "B"
      : heatStatus === "CRITICAL"
      ? "D"
      : "C";

  return {
    portfolioHeat,
    heatStatus,
    kellyFraction: parseFloat(kellyFraction.toFixed(4)),
    kellyAdjusted,
    recommendedRiskPercent,
    maxConcurrentPositions,
    correlationPenalty,
    dailyRiskBudget,
    perTradeDollarRisk,
    breachWarnings,
    qsRiskGrade,
  };
}