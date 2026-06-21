export interface PropSurvivalInput {
  winRate: number;
  riskReward: number;
  tradesPerMonth: number;
  startingBalance: number;
  maxDrawdownPercent: number;
  dailyLossLimitPercent: number;
  profitTargetPercent: number;
  simulations: number;
  horizonDays: number;
}

export interface PropSurvivalResult {
  probabilityOfRuin: number;
  probabilityOfPass: number;
  medianEndingBalance: number;
  p10EndingBalance: number;
  p90EndingBalance: number;
  expectedDaysToTarget: number;
  survivalGrade: "A+" | "A" | "B" | "C" | "F";
  dailyLotChecklist: { day: number; maxLots: number; riskBudget: number }[];
  breachScenarios: string[];
  qsVerdict: "DEPLOY" | "OPTIMIZE" | "HALT";
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function computePropSurvival(input: PropSurvivalInput): PropSurvivalResult {
  const {
    winRate,
    riskReward,
    tradesPerMonth,
    startingBalance,
    maxDrawdownPercent,
    dailyLossLimitPercent,
    profitTargetPercent,
    simulations,
    horizonDays,
  } = input;

  const riskPerTrade = 0.01;
  const tradesPerDay = tradesPerMonth / 22;
  const profitTarget = startingBalance * (1 + profitTargetPercent / 100);
  let ruinCount = 0;
  let passCount = 0;
  let totalDaysToPass = 0;
  const endings: number[] = [];

  for (let sim = 0; sim < simulations; sim++) {
    const rand = mulberry32(sim + 1);
    let balance = startingBalance;
    let peak = startingBalance;
    let dailyLoss = 0;
    let passed = false;
    let daysToPass = horizonDays;

    for (let day = 0; day < horizonDays; day++) {
      dailyLoss = 0;
      const dayTrades = Math.round(tradesPerDay + (rand() > 0.5 ? 1 : 0));

      for (let t = 0; t < dayTrades; t++) {
        const win = rand() < winRate / 100;
        const pnl = win
          ? balance * riskPerTrade * riskReward
          : -balance * riskPerTrade;
        balance += pnl;
        dailyLoss += pnl < 0 ? Math.abs(pnl) : 0;
        peak = Math.max(peak, balance);
        const drawdown = ((peak - balance) / peak) * 100;

        if (balance >= profitTarget && !passed) {
          passed = true;
          daysToPass = day + 1;
        }

        if (
          drawdown >= maxDrawdownPercent ||
          dailyLoss >= startingBalance * (dailyLossLimitPercent / 100) ||
          balance <= startingBalance * 0.1
        ) {
          ruinCount++;
          balance = 0;
          break;
        }
      }

      if (balance <= 0) break;
    }

    if (passed) {
      passCount++;
      totalDaysToPass += daysToPass;
    }
    endings.push(balance);
  }

  endings.sort((a, b) => a - b);
  const p = (pct: number) => endings[Math.floor(endings.length * pct)] ?? 0;

  const probabilityOfRuin = parseFloat(
    ((ruinCount / simulations) * 100).toFixed(1)
  );
  const probabilityOfPass = parseFloat(
    ((passCount / simulations) * 100).toFixed(1)
  );
  const expectedDaysToTarget =
    passCount > 0 ? Math.round(totalDaysToPass / passCount) : horizonDays;

  const dailyLotChecklist = Array.from({ length: 5 }, (_, i) => {
    const day = i + 1;
    const riskBudget = startingBalance * (dailyLossLimitPercent / 100);
    const maxLots = parseFloat(
      (riskBudget / (startingBalance * riskPerTrade * 100)).toFixed(2)
    );
    return { day, maxLots: Math.max(0.01, maxLots), riskBudget };
  });

  const breachScenarios: string[] = [];
  if (probabilityOfRuin > 20) {
    breachScenarios.push("Ruin probability exceeds QS institutional threshold (20%).");
  }
  if (probabilityOfPass < 40) {
    breachScenarios.push("Pass rate below 40% — strategy parameters need optimization.");
  }
  if (winRate < 50 && riskReward < 2) {
    breachScenarios.push("Insufficient edge density for prop firm survival.");
  }

  const survivalGrade: PropSurvivalResult["survivalGrade"] =
    probabilityOfPass >= 70 && probabilityOfRuin <= 8
      ? "A+"
      : probabilityOfPass >= 55 && probabilityOfRuin <= 15
      ? "A"
      : probabilityOfPass >= 40 && probabilityOfRuin <= 25
      ? "B"
      : probabilityOfPass >= 25
      ? "C"
      : "F";

  const qsVerdict: PropSurvivalResult["qsVerdict"] =
    survivalGrade === "A+" || survivalGrade === "A"
      ? "DEPLOY"
      : survivalGrade === "B" || survivalGrade === "C"
      ? "OPTIMIZE"
      : "HALT";

  return {
    probabilityOfRuin,
    probabilityOfPass,
    medianEndingBalance: p(0.5),
    p10EndingBalance: p(0.1),
    p90EndingBalance: p(0.9),
    expectedDaysToTarget,
    survivalGrade,
    dailyLotChecklist,
    breachScenarios,
    qsVerdict,
  };
}