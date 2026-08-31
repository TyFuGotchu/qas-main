export type GuardStatus = "SAFE" | "TIGHT" | "BREACH RISK";

export function parseSizeToDollars(size: string): number {
  const n = Number.parseFloat(size.replace(/k/i, ""));
  if (!Number.isFinite(n)) return 100_000;
  return Math.round(n * 1000);
}

export function signatureDdPctForSize(sizeDollars: number): number {
  if (sizeDollars <= 50_000) return 4;
  return 3;
}

export function computePresetGuard(input: {
  equity: number;
  maxDailyPct: number;
  maxDdPct: number;
  floatingPnl: number;
  stopDistance: number;
  dailyCapPct?: number;
}) {
  const equity = Math.max(0, input.equity);
  const dailyRoom = equity * (input.maxDailyPct / 100);
  const ddRoom = equity * (input.maxDdPct / 100);
  const remainingDaily = dailyRoom + Math.min(0, input.floatingPnl);
  const remainingDd = ddRoom + Math.min(0, input.floatingPnl);
  const dailyCap =
    input.dailyCapPct != null ? equity * (input.dailyCapPct / 100) : null;
  const remainingCap =
    dailyCap != null ? dailyCap - Math.max(0, input.floatingPnl) : null;

  let status: GuardStatus = "SAFE";
  if (remainingDaily <= 0 || remainingDd <= 0 || (remainingCap != null && remainingCap <= 0)) {
    status = "BREACH RISK";
  } else if (
    remainingDaily < dailyRoom * 0.25 ||
    remainingDd < ddRoom * 0.25 ||
    (remainingCap != null && dailyCap != null && remainingCap < dailyCap * 0.25)
  ) {
    status = "TIGHT";
  }

  const suggestedRisk = Math.max(
    0,
    Math.min(remainingDaily * 0.25, equity * 0.0075)
  );
  const suggestedSize =
    input.stopDistance > 0 ? suggestedRisk / input.stopDistance : 0;

  return {
    dailyRoom,
    ddRoom,
    remainingDaily,
    remainingDd,
    dailyCap,
    remainingCap,
    suggestedRisk,
    suggestedSize,
    status,
  };
}
