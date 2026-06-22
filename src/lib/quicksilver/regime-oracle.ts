export type QSRegime =
  | "expansion"
  | "compression"
  | "distribution"
  | "accumulation"
  | "reversal"
  | "chaos";

export interface RegimeOracleInput {
  atrPercentile: number;
  rangeCompression: number;
  directionalBias: number;
  volumeState: "declining" | "stable" | "surging";
  sessionPhase: "open" | "mid" | "close" | "overnight";
}

export interface RegimeSignal {
  regime: QSRegime;
  probability: number;
}

export interface RegimeOracleResult {
  primaryRegime: QSRegime;
  regimeLabel: string;
  confidence: number;
  riskMultiplier: number;
  playbook: string;
  sessionBias: string;
  signals: RegimeSignal[];
  protocolDirectives: string[];
}

const REGIME_LABELS: Record<QSRegime, string> = {
  expansion: "Momentum Expansion",
  compression: "Volatility Compression",
  distribution: "Institutional Distribution",
  accumulation: "Smart Money Accumulation",
  reversal: "Structural Reversal",
  chaos: "Chaos / No-Trade",
};

export function computeRegimeOracle(
  input: RegimeOracleInput
): RegimeOracleResult {
  const {
    atrPercentile,
    rangeCompression,
    directionalBias,
    volumeState,
    sessionPhase,
  } = input;

  const signals: RegimeSignal[] = [
    {
      regime: "expansion",
      probability: Math.min(
        100,
        atrPercentile * 0.5 + Math.abs(directionalBias) * 0.35
      ),
    },
    {
      regime: "compression",
      probability: Math.min(100, rangeCompression * 0.7 + (100 - atrPercentile) * 0.2),
    },
    {
      regime: "distribution",
      probability: Math.min(
        100,
        directionalBias > 30
          ? directionalBias * 0.4 + (volumeState === "surging" ? 25 : 0)
          : 10
      ),
    },
    {
      regime: "accumulation",
      probability: Math.min(
        100,
        rangeCompression * 0.3 +
          (volumeState === "declining" ? 30 : 10) +
          (Math.abs(directionalBias) < 20 ? 25 : 0)
      ),
    },
    {
      regime: "reversal",
      probability: Math.min(
        100,
        atrPercentile > 70 && Math.abs(directionalBias) > 50 ? 45 : 15
      ),
    },
    {
      regime: "chaos",
      probability: Math.min(
        100,
        atrPercentile > 85 && volumeState === "surging" ? 55 : 8
      ),
    },
  ];

  signals.sort((a, b) => b.probability - a.probability);
  const primary = signals[0];
  const primaryRegime = primary.regime;
  const confidence = Math.round(primary.probability);

  const riskMultiplier = parseFloat(
    ({
      expansion: 1.0,
      compression: 0.7,
      distribution: 0.85,
      accumulation: 0.75,
      reversal: 0.6,
      chaos: 0.25,
    } as Record<QSRegime, number>)[primaryRegime].toFixed(2)
  );

  const playbooks: Record<QSRegime, string> = {
    expansion: "Trend continuation — trade pullbacks to VWAP/mean with momentum confirmation.",
    compression: "Range-bound — fade extremes, reduce size, await breakout catalyst.",
    distribution: "Take profits into strength — avoid new longs at highs, watch for reversal signatures.",
    accumulation: "Scale entries at range lows — build position with tight invalidation.",
    reversal: "Counter-trend only with QS confluence A+ — half size, fast invalidation.",
    chaos: "Stand aside — wait for regime clarity before planning manual entries.",
  };

  const sessionBiases: Record<RegimeOracleInput["sessionPhase"], string> = {
    open: "Opening drive — prioritize gap-and-go or fade setups per regime.",
    mid: "Mid-session — mean reversion and continuation balanced.",
    close: "Close positioning — reduce exposure, watch for rebalancing flows.",
    overnight: "Thin liquidity — QS systems restrict to 25% standard size.",
  };

  const protocolDirectives: string[] = [
    `Regime read: ${REGIME_LABELS[primaryRegime]} (${confidence}% confidence).`,
    `Suggested size multiplier: ${riskMultiplier}x your normal manual risk.`,
    playbooks[primaryRegime],
  ];

  if (primaryRegime === "chaos") {
    protocolDirectives.push(
      "Chaos regime — avoid new manual entries until compression or expansion returns."
    );
  }
  if (sessionPhase === "overnight") {
    protocolDirectives.push(
      "Overnight session — consider wider spreads and half your usual planned size."
    );
  }

  return {
    primaryRegime,
    regimeLabel: REGIME_LABELS[primaryRegime],
    confidence,
    riskMultiplier,
    playbook: playbooks[primaryRegime],
    sessionBias: sessionBiases[sessionPhase],
    signals: signals.map((s) => ({
      ...s,
      probability: Math.round(s.probability),
    })),
    protocolDirectives,
  };
}