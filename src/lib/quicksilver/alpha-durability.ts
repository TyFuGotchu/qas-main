export interface AlphaDurabilityInput {
  totalTrades: number;
  winRate: number;
  avgWinR: number;
  avgLossR: number;
  monthsActive: number;
  recentWinRate: number;
}

export interface AlphaDurabilityResult {
  expectancy: number;
  expectancyPerTrade: number;
  zScore: number;
  confidenceLevel: number;
  alphaHalfLifeMonths: number;
  sampleAdequacy: "INSUFFICIENT" | "DEVELOPING" | "ROBUST" | "INSTITUTIONAL";
  durabilityGrade: "A+" | "A" | "B" | "C" | "F";
  decayRate: number;
  edgeStatus: "STRENGTHENING" | "STABLE" | "ERODING" | "EXPIRED";
  qsAlphaIndex: number;
  diagnostics: string[];
}

export function computeAlphaDurability(
  input: AlphaDurabilityInput
): AlphaDurabilityResult {
  const {
    totalTrades,
    winRate,
    avgWinR,
    avgLossR,
    monthsActive,
    recentWinRate,
  } = input;

  const winProb = winRate / 100;
  const lossProb = 1 - winProb;
  const expectancy = winProb * avgWinR - lossProb * avgLossR;
  const expectancyPerTrade = parseFloat(expectancy.toFixed(3));

  const variance =
    winProb * Math.pow(avgWinR - expectancy, 2) +
    lossProb * Math.pow(-avgLossR - expectancy, 2);
  const stdErr = Math.sqrt(variance / Math.max(totalTrades, 1));
  const zScore =
    stdErr > 0 ? parseFloat((expectancy / stdErr).toFixed(2)) : 0;

  const confidenceLevel = parseFloat(
    Math.min(99, Math.max(0, 50 + zScore * 12)).toFixed(1)
  );

  const decayRate = parseFloat(
    (((winRate - recentWinRate) / Math.max(winRate, 1)) * 100).toFixed(1)
  );

  const alphaHalfLifeMonths = parseFloat(
    Math.max(
      1,
      monthsActive * (expectancy > 0 ? 0.5 + expectancy * 2 : 0.3)
    ).toFixed(1)
  );

  const sampleAdequacy: AlphaDurabilityResult["sampleAdequacy"] =
    totalTrades >= 500
      ? "INSTITUTIONAL"
      : totalTrades >= 200
      ? "ROBUST"
      : totalTrades >= 75
      ? "DEVELOPING"
      : "INSUFFICIENT";

  const edgeStatus: AlphaDurabilityResult["edgeStatus"] =
    decayRate < -5
      ? "STRENGTHENING"
      : decayRate <= 8
      ? "STABLE"
      : decayRate <= 20
      ? "ERODING"
      : "EXPIRED";

  const qsAlphaIndex = Math.round(
    Math.min(
      100,
      Math.max(
        0,
        expectancy * 35 +
          zScore * 8 +
          (totalTrades / 500) * 20 +
          (edgeStatus === "STABLE" ? 15 : edgeStatus === "STRENGTHENING" ? 20 : 0) -
          (edgeStatus === "ERODING" ? 15 : edgeStatus === "EXPIRED" ? 35 : 0)
      )
    )
  );

  const durabilityGrade: AlphaDurabilityResult["durabilityGrade"] =
    qsAlphaIndex >= 85
      ? "A+"
      : qsAlphaIndex >= 72
      ? "A"
      : qsAlphaIndex >= 58
      ? "B"
      : qsAlphaIndex >= 40
      ? "C"
      : "F";

  const diagnostics: string[] = [];
  if (sampleAdequacy === "INSUFFICIENT") {
    diagnostics.push(
      "QS Alpha: Sample size below 75 trades — statistical confidence unreliable."
    );
  }
  if (zScore < 1.96 && totalTrades >= 75) {
    diagnostics.push(
      "Edge not yet significant at 95% confidence — continue forward testing."
    );
  }
  if (edgeStatus === "ERODING") {
    diagnostics.push(
      `Alpha decay detected: recent win rate trails baseline by ${decayRate}%.`
    );
  }
  if (expectancy <= 0) {
    diagnostics.push(
      "Negative expectancy — journal review recommended before sizing up manually."
    );
  }
  if (qsAlphaIndex >= 72 && sampleAdequacy !== "INSUFFICIENT") {
    diagnostics.push(
      "Statistically supportive edge — suitable for disciplined manual sizing."
    );
  }

  return {
    expectancy,
    expectancyPerTrade,
    zScore,
    confidenceLevel,
    alphaHalfLifeMonths,
    sampleAdequacy,
    durabilityGrade,
    decayRate,
    edgeStatus,
    qsAlphaIndex,
    diagnostics,
  };
}