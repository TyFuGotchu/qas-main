export interface ExpectancyInput {
  totalTrades: number;
  wins: number;
  avgRR: number;
}

export interface ExpectancyResult {
  expectancy: number;
  winRate: number;
  verdict: "positive" | "negative" | "breakeven";
  message: string;
}

export function computeStrategyExpectancy(input: ExpectancyInput): ExpectancyResult {
  const { totalTrades, wins, avgRR } = input;

  if (totalTrades <= 0 || wins < 0 || wins > totalTrades || avgRR < 0) {
    return {
      expectancy: 0,
      winRate: 0,
      verdict: "breakeven",
      message: "Check inputs: wins must be ≤ total trades.",
    };
  }

  const winRate = wins / totalTrades;
  const lossRate = 1 - winRate;
  const expectancy = winRate * avgRR - lossRate;

  const winPct = (winRate * 100).toFixed(1);
  let verdict: ExpectancyResult["verdict"] = "breakeven";
  let message: string;

  if (expectancy > 0) {
    verdict = "positive";
    message = `${winPct}% win rate @ ${avgRR}:1 R:R → positive mathematical edge.`;
  } else if (expectancy < 0) {
    verdict = "negative";
    message = `${winPct}% win rate @ ${avgRR}:1 R:R → negative edge. Refine strategy before sizing up.`;
  } else {
    message = "Break-even expectancy at current parameters.";
  }

  return { expectancy, winRate, verdict, message };
}