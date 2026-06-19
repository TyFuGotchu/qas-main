export function generateVolatilitySeries(
  length: number,
  baseVol: number,
  seed = 42
): number[] {
  const series: number[] = [];
  let value = baseVol;
  for (let i = 0; i < length; i++) {
    const noise = Math.sin(seed + i * 0.7) * 0.3 + Math.cos(seed + i * 1.1) * 0.2;
    value = Math.max(0.1, baseVol + noise * baseVol * 0.5);
    series.push(parseFloat(value.toFixed(4)));
  }
  return series;
}

export function calculateCorrelation(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  if (n === 0) return 0;

  const meanA = a.slice(0, n).reduce((s, v) => s + v, 0) / n;
  const meanB = b.slice(0, n).reduce((s, v) => s + v, 0) / n;

  let num = 0;
  let denA = 0;
  let denB = 0;

  for (let i = 0; i < n; i++) {
    const diffA = a[i] - meanA;
    const diffB = b[i] - meanB;
    num += diffA * diffB;
    denA += diffA * diffA;
    denB += diffB * diffB;
  }

  const den = Math.sqrt(denA * denB);
  return den === 0 ? 0 : parseFloat((num / den).toFixed(4));
}

export const HISTORICAL_VOLATILITY: Record<string, number[]> = {
  XAUUSD: generateVolatilitySeries(30, 1.8, 10),
  US30: generateVolatilitySeries(30, 0.9, 20),
  NAS100: generateVolatilitySeries(30, 1.2, 30),
};

export const SESSION_ATR_DATA = [
  { hour: 0, london: 12, newYork: 8, overlap: 0 },
  { hour: 1, london: 11, newYork: 7, overlap: 0 },
  { hour: 2, london: 10, newYork: 6, overlap: 0 },
  { hour: 3, london: 9, newYork: 6, overlap: 0 },
  { hour: 4, london: 10, newYork: 7, overlap: 0 },
  { hour: 5, london: 14, newYork: 8, overlap: 0 },
  { hour: 6, london: 18, newYork: 10, overlap: 0 },
  { hour: 7, london: 24, newYork: 14, overlap: 0 },
  { hour: 8, london: 32, newYork: 22, overlap: 28 },
  { hour: 9, london: 38, newYork: 35, overlap: 42 },
  { hour: 10, london: 42, newYork: 48, overlap: 55 },
  { hour: 11, london: 40, newYork: 52, overlap: 58 },
  { hour: 12, london: 36, newYork: 50, overlap: 52 },
  { hour: 13, london: 30, newYork: 55, overlap: 48 },
  { hour: 14, london: 22, newYork: 58, overlap: 45 },
  { hour: 15, london: 16, newYork: 52, overlap: 38 },
  { hour: 16, london: 12, newYork: 44, overlap: 0 },
  { hour: 17, london: 10, newYork: 36, overlap: 0 },
  { hour: 18, london: 8, newYork: 28, overlap: 0 },
  { hour: 19, london: 7, newYork: 22, overlap: 0 },
  { hour: 20, london: 6, newYork: 16, overlap: 0 },
  { hour: 21, london: 5, newYork: 12, overlap: 0 },
  { hour: 22, london: 6, newYork: 10, overlap: 0 },
  { hour: 23, london: 8, newYork: 9, overlap: 0 },
];