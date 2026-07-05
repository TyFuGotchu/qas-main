export interface CompoundingMatrixInput {
  startingBalance: number;
  targetProfit: number;
  winRate: number;
  maxDrawdownPct: number;
  riskReward?: number;
  trades?: number;
}

export interface CompoundingMatrixRow {
  trade: number;
  balance: number;
  riskPct: number;
  riskAmount: number;
  lotSize: number;
  ifWin: number;
  ifLoss: number;
  expectedBalance: number;
  pctToTarget: number;
  targetReached: boolean;
}

export interface CompoundingMatrixResult {
  rows: CompoundingMatrixRow[];
  summary: {
    startingBalance: number;
    targetProfit: number;
    targetBalance: number;
    projectedEndBalance: number;
    winRate: number;
    maxDrawdownPct: number;
  };
}

export function computeCompoundingMatrix(
  input: CompoundingMatrixInput
): CompoundingMatrixResult {
  const {
    startingBalance,
    targetProfit,
    winRate,
    maxDrawdownPct,
    riskReward = 2,
    trades = 10,
  } = input;

  if (startingBalance <= 0) throw new Error("Starting balance must be positive");
  if (targetProfit < 0) throw new Error("Target profit cannot be negative");
  if (winRate <= 0 || winRate > 100) throw new Error("Win rate must be between 0 and 100");
  if (maxDrawdownPct <= 0 || maxDrawdownPct > 100) {
    throw new Error("Max drawdown must be between 0 and 100");
  }

  const targetBalance = startingBalance + targetProfit;
  const winProb = winRate / 100;
  const lossProb = 1 - winProb;
  const riskPct = Math.max(0.25, Math.min(2.5, maxDrawdownPct / trades));

  const rows: CompoundingMatrixRow[] = [];
  let balance = startingBalance;
  let peak = startingBalance;

  for (let tradeNum = 1; tradeNum <= trades; tradeNum++) {
    const riskAmount = Math.round(balance * (riskPct / 100) * 100) / 100;
    const lotSize = Math.round(Math.max(riskAmount / 10, 0.01) * 100) / 100;
    const ifWin = Math.round((balance + riskAmount * riskReward) * 100) / 100;
    const ifLoss = Math.round(Math.max(balance - riskAmount, 0) * 100) / 100;
    const expectedBalance = Math.round(
      (balance + winProb * riskAmount * riskReward - lossProb * riskAmount) * 100
    ) / 100;

    const pctToTarget =
      targetProfit > 0
        ? Math.round(((expectedBalance - startingBalance) / targetProfit) * 1000) / 10
        : 0;

    rows.push({
      trade: tradeNum,
      balance: Math.round(balance * 100) / 100,
      riskPct: Math.round(riskPct * 100) / 100,
      riskAmount,
      lotSize,
      ifWin,
      ifLoss,
      expectedBalance,
      pctToTarget,
      targetReached: expectedBalance >= targetBalance,
    });

    balance = expectedBalance;
    peak = Math.max(peak, balance);
  }

  return {
    rows,
    summary: {
      startingBalance,
      targetProfit,
      targetBalance: Math.round(targetBalance * 100) / 100,
      projectedEndBalance: rows[rows.length - 1]?.expectedBalance ?? startingBalance,
      winRate,
      maxDrawdownPct,
    },
  };
}