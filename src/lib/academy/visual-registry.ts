export type CandlePattern =
  | "doji"
  | "hammer-hanging-man"
  | "shooting-star-inverted-hammer"
  | "marubozu"
  | "spinning-top"
  | "bullish-bearish-engulfing"
  | "harami"
  | "piercing-dark-cloud"
  | "tweezer-tops-bottoms"
  | "inside-outside-bar"
  | "morning-evening-star"
  | "three-white-soldiers"
  | "three-black-crows"
  | "three-inside-up-down"
  | "abandoned-baby"
  | "pattern-context";

export type ChartDiagramVariant =
  | "candle-anatomy"
  | "bull-bear-pressure"
  | "range-trend"
  | "support-resistance"
  | "level-drawing"
  | "reaction-break"
  | "dynamic-levels"
  | "structure-overview"
  | "swing-points"
  | "trend-continuation"
  | "trend-exhaustion"
  | "top-down"
  | "timeframe-correlation"
  | "fractal"
  | "volume"
  | "session-timing"
  | "summary";

export type StructureDiagramVariant =
  | "swing-definition"
  | "labeling"
  | "swing-trading"
  | "bos"
  | "bos-sweep"
  | "trade-bos"
  | "choch"
  | "choch-vs-bos"
  | "choch-false"
  | "liquidity"
  | "inducement"
  | "liquidity-pools"
  | "fvg"
  | "session-ranges"
  | "daily-weekly"
  | "session-models"
  | "integrating";

export type FibDiagramVariant =
  | "basics"
  | "drawing"
  | "key-levels"
  | "pullback"
  | "extension"
  | "abc"
  | "extension-target"
  | "golden-pocket"
  | "gp-entry"
  | "gp-failures"
  | "structure-confluence"
  | "supply-demand"
  | "multi-timeframe"
  | "validity"
  | "redraw"
  | "invalidation"
  | "mistakes";

export type StyleDiagramVariant =
  | "scalping"
  | "day-trading"
  | "swing"
  | "ict"
  | "liquidity-ob"
  | "fvg-premium"
  | "kill-zones"
  | "supply-demand"
  | "rally-base"
  | "sd-vs-sr"
  | "zone-trading"
  | "intraday"
  | "playbook"
  | "psychology"
  | "swing-entry"
  | "swing-fundamentals"
  | "scalping-tf"
  | "scalping-risk";

export type LessonVisualConfig =
  | { kind: "candle"; pattern: CandlePattern; caption?: string }
  | { kind: "chart"; variant: ChartDiagramVariant; caption?: string }
  | { kind: "structure"; variant: StructureDiagramVariant; caption?: string }
  | { kind: "fib"; variant: FibDiagramVariant; caption?: string }
  | { kind: "style"; variant: StyleDiagramVariant; caption?: string };

const CANDLE_PATTERN_MAP: Record<string, CandlePattern> = {
  doji: "doji",
  "hammer-hanging-man": "hammer-hanging-man",
  "shooting-star-inverted-hammer": "shooting-star-inverted-hammer",
  marubozu: "marubozu",
  "spinning-top": "spinning-top",
  "bullish-bearish-engulfing": "bullish-bearish-engulfing",
  harami: "harami",
  "piercing-dark-cloud": "piercing-dark-cloud",
  "tweezer-tops-bottoms": "tweezer-tops-bottoms",
  "inside-outside-bar": "inside-outside-bar",
  "morning-evening-star": "morning-evening-star",
  "three-white-soldiers": "three-white-soldiers",
  "three-black-crows": "three-black-crows",
  "three-inside-up-down": "three-inside-up-down",
  "abandoned-baby": "abandoned-baby",
  "location-is-king": "pattern-context",
  "trend-and-counter-trend-patterns": "pattern-context",
  "confirmation-filters": "pattern-context",
  "common-candlestick-mistakes": "pattern-context",
};

const CHART_VARIANT_MAP: Record<string, ChartDiagramVariant> = {
  "what-is-price-action": "candle-anatomy",
  "reading-candle-components": "candle-anatomy",
  "bullish-vs-bearish-pressure": "bull-bear-pressure",
  "ranges-vs-trends": "range-trend",
  "what-are-support-resistance": "support-resistance",
  "drawing-levels-manually": "level-drawing",
  "reaction-vs-break": "reaction-break",
  "dynamic-vs-static-levels": "dynamic-levels",
  "market-structure-overview": "structure-overview",
  "identifying-swing-highs-lows": "swing-points",
  "trend-continuation-signals": "trend-continuation",
  "trend-exhaustion-transitions": "trend-exhaustion",
  "top-down-analysis": "top-down",
  "timeframe-correlation": "timeframe-correlation",
  "fractal-nature-of-markets": "fractal",
  "volume-basics": "volume",
  "session-timing-context": "session-timing",
  "putting-it-together": "summary",
};

const STRUCTURE_VARIANT_MAP: Record<string, StructureDiagramVariant> = {
  "swing-point-definition": "swing-definition",
  "labeling-structure": "labeling",
  "swing-point-trading": "swing-trading",
  "what-is-bos": "bos",
  "bos-vs-liquidity-sweep": "bos-sweep",
  "trading-bos": "trade-bos",
  "what-is-choch": "choch",
  "choch-vs-bos-reversal": "choch-vs-bos",
  "choch-false-signals": "choch-false",
  "liquidity-basics": "liquidity",
  "inducement-engineered": "inducement",
  "liquidity-pools-targets": "liquidity-pools",
  "liquidity-voids-fvg": "fvg",
  "session-ranges": "session-ranges",
  "daily-weekly-structure": "daily-weekly",
  "session-trading-models": "session-models",
  "integrating-structure": "integrating",
};

const FIB_VARIANT_MAP: Record<string, FibDiagramVariant> = {
  "fib-basics": "basics",
  "drawing-retracements": "drawing",
  "key-retracement-levels": "key-levels",
  "fib-pullback-entries": "pullback",
  "extension-basics": "extension",
  "abc-projection-method": "abc",
  "extension-target-strategy": "extension-target",
  "what-is-golden-pocket": "golden-pocket",
  "golden-pocket-entries": "gp-entry",
  "golden-pocket-failures": "gp-failures",
  "fib-with-swing-structure": "structure-confluence",
  "fib-supply-demand-liquidity": "supply-demand",
  "multi-timeframe-fib": "multi-timeframe",
  "when-fib-is-valid": "validity",
  "redraw-rules": "redraw",
  "fib-invalidation-checklist": "invalidation",
  "common-fib-mistakes": "mistakes",
};

const STYLE_VARIANT_MAP: Record<string, StyleDiagramVariant> = {
  "what-is-scalping": "scalping",
  "scalping-timeframes-setups": "scalping-tf",
  "scalping-risk-management": "scalping-risk",
  "day-trading-fundamentals": "day-trading",
  "intraday-structure-levels": "intraday",
  "day-trading-playbook": "playbook",
  "day-trading-psychology-session": "psychology",
  "swing-trading-overview": "swing",
  "swing-entry-exit-planning": "swing-entry",
  "swing-fundamentals-context": "swing-fundamentals",
  "ict-introduction": "ict",
  "liquidity-order-blocks": "liquidity-ob",
  "fvg-premium-discount": "fvg-premium",
  "kill-zones-session-models": "kill-zones",
  "supply-demand-zones": "supply-demand",
  "rally-base-rally-drop": "rally-base",
  "supply-demand-vs-support-resistance": "sd-vs-sr",
  "trading-the-zone": "zone-trading",
};

export function getLessonVisual(
  categoryId: string,
  lessonId: string
): LessonVisualConfig {
  if (categoryId === "candlesticks") {
    return {
      kind: "candle",
      pattern: CANDLE_PATTERN_MAP[lessonId] ?? "doji",
    };
  }
  if (categoryId === "chart-reading") {
    return {
      kind: "chart",
      variant: CHART_VARIANT_MAP[lessonId] ?? "candle-anatomy",
    };
  }
  if (categoryId === "market-structure") {
    return {
      kind: "structure",
      variant: STRUCTURE_VARIANT_MAP[lessonId] ?? "bos",
    };
  }
  if (categoryId === "fibonacci") {
    return {
      kind: "fib",
      variant: FIB_VARIANT_MAP[lessonId] ?? "basics",
    };
  }
  if (categoryId === "trading-styles") {
    return {
      kind: "style",
      variant: STYLE_VARIANT_MAP[lessonId] ?? "scalping",
    };
  }
  return { kind: "chart", variant: "summary" };
}

const CATEGORY_IDS = [
  "chart-reading",
  "market-structure",
  "trading-styles",
  "candlesticks",
  "fibonacci",
] as const;

export function getLessonVisualBySlug(slug: string): LessonVisualConfig {
  for (const categoryId of CATEGORY_IDS) {
    const prefix = `${categoryId}-`;
    if (slug.startsWith(prefix)) {
      return getLessonVisual(categoryId, slug.slice(prefix.length));
    }
  }
  return { kind: "chart", variant: "summary" };
}