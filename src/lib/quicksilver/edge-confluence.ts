export type MomentumPhase =
  | "impulse"
  | "corrective"
  | "exhaustion"
  | "accumulation";

export type VolatilityRegime = "compressed" | "normal" | "expanded" | "extreme";

export type SessionContext =
  | "asia"
  | "london"
  | "newyork"
  | "london_ny_overlap"
  | "off_hours";

export interface EdgeConfluenceInput {
  structureAlignment: number;
  momentumPhase: MomentumPhase;
  volatilityRegime: VolatilityRegime;
  sessionContext: SessionContext;
  riskReward: number;
  liquidityProximity: number;
  higherTimeframeBias: "bullish" | "bearish" | "neutral";
  tradeDirection: "long" | "short";
}

export interface FactorScore {
  label: string;
  score: number;
  weight: number;
  note: string;
}

export interface EdgeConfluenceResult {
  qsEdgeScore: number;
  grade: "A+" | "A" | "B" | "C" | "F";
  verdict: "STRONG" | "REDUCE_SIZE" | "WAIT" | "SKIP";
  factors: FactorScore[];
  confluenceLayers: number;
  asymmetryRating: string;
  protocolNotes: string[];
}

const MOMENTUM_SCORES: Record<MomentumPhase, number> = {
  impulse: 92,
  accumulation: 78,
  corrective: 52,
  exhaustion: 28,
};

const VOLATILITY_SCORES: Record<VolatilityRegime, number> = {
  normal: 85,
  compressed: 72,
  expanded: 58,
  extreme: 35,
};

const SESSION_SCORES: Record<SessionContext, number> = {
  london_ny_overlap: 95,
  london: 82,
  newyork: 80,
  asia: 68,
  off_hours: 42,
};

function gradeFromScore(score: number): EdgeConfluenceResult["grade"] {
  if (score >= 88) return "A+";
  if (score >= 78) return "A";
  if (score >= 65) return "B";
  if (score >= 50) return "C";
  return "F";
}

function verdictFromScore(score: number): EdgeConfluenceResult["verdict"] {
  if (score >= 82) return "STRONG";
  if (score >= 68) return "REDUCE_SIZE";
  if (score >= 50) return "WAIT";
  return "SKIP";
}

export function computeEdgeConfluence(
  input: EdgeConfluenceInput
): EdgeConfluenceResult {
  const structureScore = Math.min(100, Math.max(0, input.structureAlignment * 20));
  const momentumScore = MOMENTUM_SCORES[input.momentumPhase];
  const volatilityScore = VOLATILITY_SCORES[input.volatilityRegime];
  const sessionScore = SESSION_SCORES[input.sessionContext];
  const liquidityScore = Math.min(100, Math.max(0, input.liquidityProximity * 20));

  const biasAligned =
    input.higherTimeframeBias === "neutral" ||
    (input.higherTimeframeBias === "bullish" && input.tradeDirection === "long") ||
    (input.higherTimeframeBias === "bearish" && input.tradeDirection === "short");
  const biasScore = biasAligned ? 90 : 35;

  const rrScore = Math.min(100, 40 + input.riskReward * 22);

  const factors: FactorScore[] = [
    {
      label: "Structure Alignment",
      score: structureScore,
      weight: 0.22,
      note: "QS institutional structure stack",
    },
    {
      label: "Momentum Phase",
      score: momentumScore,
      weight: 0.18,
      note: `Phase: ${input.momentumPhase}`,
    },
    {
      label: "Volatility Regime",
      score: volatilityScore,
      weight: 0.14,
      note: `Regime: ${input.volatilityRegime}`,
    },
    {
      label: "Session Context",
      score: sessionScore,
      weight: 0.12,
      note: `Window: ${input.sessionContext.replace("_", " ")}`,
    },
    {
      label: "HTF Bias Sync",
      score: biasScore,
      weight: 0.16,
      note: biasAligned ? "Directional sync confirmed" : "Counter-HTF conflict",
    },
    {
      label: "Risk Asymmetry",
      score: rrScore,
      weight: 0.1,
      note: `${input.riskReward}:1 R:R target`,
    },
    {
      label: "Liquidity Proximity",
      score: liquidityScore,
      weight: 0.08,
      note: "Distance to institutional liquidity",
    },
  ];

  const qsEdgeScore = Math.round(
    factors.reduce((sum, f) => sum + f.score * f.weight, 0)
  );

  const confluenceLayers = factors.filter((f) => f.score >= 70).length;

  const asymmetryRating =
    input.riskReward >= 3
      ? "Institutional"
      : input.riskReward >= 2
      ? "Favorable"
      : input.riskReward >= 1.5
      ? "Marginal"
      : "Insufficient";

  const protocolNotes: string[] = [];
  if (!biasAligned) {
    protocolNotes.push(
      "Counter-HTF setup — consider 50% smaller size and a tighter manual stop."
    );
  }
  if (input.volatilityRegime === "extreme") {
    protocolNotes.push(
      "Extreme volatility — widen stops or wait for compression before planning entries."
    );
  }
  if (confluenceLayers >= 5) {
    protocolNotes.push(
      "Full confluence stack — strong manual setup on paper; verify on your platform."
    );
  } else if (confluenceLayers <= 2) {
    protocolNotes.push(
      "Thin confluence — demo or journal the setup before risking real capital."
    );
  }
  if (input.sessionContext === "london_ny_overlap") {
    protocolNotes.push(
      "Overlap window — momentum continuation setups often score higher here."
    );
  }

  return {
    qsEdgeScore,
    grade: gradeFromScore(qsEdgeScore),
    verdict: verdictFromScore(qsEdgeScore),
    factors,
    confluenceLayers,
    asymmetryRating,
    protocolNotes,
  };
}