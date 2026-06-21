export interface MonteCarloInput {
  winRate: number;
  riskReward: number;
  tradesPerMonth: number;
  startingBalance: number;
  maxDrawdownPercent: number;
  dailyLossLimitPercent: number;
  simulations: number;
  horizonDays: number;
}

export interface MonteCarloResult {
  probabilityOfRuin: number;
  medianEndingBalance: number;
  p10EndingBalance: number;
  p90EndingBalance: number;
  dailyLotChecklist: { day: number; maxLots: number; riskBudget: number }[];
  equityCurves: number[][];
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function runMonteCarlo(input: MonteCarloInput): MonteCarloResult {
  const {
    winRate,
    riskReward,
    tradesPerMonth,
    startingBalance,
    maxDrawdownPercent,
    dailyLossLimitPercent,
    simulations,
    horizonDays,
  } = input;

  const riskPerTrade = 0.01;
  const tradesPerDay = tradesPerMonth / 22;
  let ruinCount = 0;
  const endings: number[] = [];
  const sampleCurves: number[][] = [];

  for (let sim = 0; sim < simulations; sim++) {
    const rand = mulberry32(sim + 1);
    let balance = startingBalance;
    let peak = startingBalance;
    let dailyLoss = 0;
    const curve = [balance];

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

      curve.push(balance);
      if (balance <= 0) break;
    }

    endings.push(balance);
    if (sim < 5) sampleCurves.push(curve);
  }

  endings.sort((a, b) => a - b);
  const p = (pct: number) =>
    endings[Math.floor(endings.length * pct)] ?? 0;

  const dailyLotChecklist = Array.from({ length: 5 }, (_, i) => {
    const day = i + 1;
    const riskBudget = startingBalance * (dailyLossLimitPercent / 100);
    const maxLots = parseFloat(
      (riskBudget / (startingBalance * riskPerTrade * 100)).toFixed(2)
    );
    return { day, maxLots: Math.max(0.01, maxLots), riskBudget };
  });

  return {
    probabilityOfRuin: parseFloat(
      ((ruinCount / simulations) * 100).toFixed(1)
    ),
    medianEndingBalance: p(0.5),
    p10EndingBalance: p(0.1),
    p90EndingBalance: p(0.9),
    dailyLotChecklist,
    equityCurves: sampleCurves,
  };
}