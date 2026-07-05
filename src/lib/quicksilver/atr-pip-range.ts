export interface AtrPipRangeInput {
  highs: number[];
  lows: number[];
  pipMultiplier: number;
}

export interface AtrPipRangeResult {
  structuralPips: number;
  periodCount: number;
  avgRange: number;
  message: string;
}

export function parsePriceList(raw: string): number[] {
  return raw
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => !Number.isNaN(n));
}

export function computeStructuralPipRange(input: AtrPipRangeInput): AtrPipRangeResult | null {
  const len = Math.min(input.highs.length, input.lows.length);
  if (len < 2) {
    return null;
  }

  let sum = 0;
  for (let i = 0; i < len; i++) {
    sum += Math.abs(input.highs[i] - input.lows[i]);
  }

  const avgRange = sum / len;
  const structuralPips = avgRange * input.pipMultiplier;

  return {
    structuralPips,
    periodCount: len,
    avgRange,
    message: `Avg structural range over ${len} periods · multiplier ${input.pipMultiplier.toLocaleString()}.`,
  };
}