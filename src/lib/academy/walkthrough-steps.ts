import { getLessonVisual } from "@/lib/academy/visual-registry";

export interface WalkthroughStep {
  title: string;
  description: string;
  /** Candle index to highlight (candlestick lessons) */
  candleIndex?: number;
  /** Part of candle to pulse */
  highlight?: "body" | "upper-wick" | "lower-wick" | "full";
}

const CANDLE_STEPS: Record<string, WalkthroughStep[]> = {
  doji: [
    { title: "Spot the body", description: "Open and close are nearly equal — a tiny or flat body.", highlight: "body", candleIndex: 0 },
    { title: "Read the wicks", description: "Long wicks show rejection from both sides — indecision.", highlight: "full", candleIndex: 0 },
    { title: "Check context", description: "A doji at resistance after a rally signals buyer exhaustion.", highlight: "full", candleIndex: 0 },
  ],
  "hammer-hanging-man": [
    { title: "Small body at top", description: "Body sits near the high of the candle.", highlight: "body", candleIndex: 0 },
    { title: "Long lower wick", description: "Rejection from below — buyers stepped in.", highlight: "lower-wick", candleIndex: 0 },
    { title: "Hanging man variant", description: "Same shape at the top of an uptrend — bearish warning.", highlight: "full", candleIndex: 1 },
  ],
  "bullish-bearish-engulfing": [
    { title: "First candle", description: "Smaller body sets up the pattern.", highlight: "body", candleIndex: 0 },
    { title: "Engulfing body", description: "Second candle body fully covers the first — momentum shift.", highlight: "body", candleIndex: 1 },
    { title: "Bearish version", description: "Large red body swallows prior green — sellers took control.", highlight: "body", candleIndex: 3 },
  ],
  "morning-evening-star": [
    { title: "First leg", description: "Strong directional candle establishes the trend.", highlight: "body", candleIndex: 0 },
    { title: "Star candle", description: "Small-bodied candle gaps away — indecision star.", highlight: "body", candleIndex: 1 },
    { title: "Confirmation", description: "Third candle closes past the star — reversal confirmed.", highlight: "body", candleIndex: 2 },
  ],
};

const CONCEPT_STEPS: Record<string, WalkthroughStep[]> = {
  bos: [
    { title: "Mark swing high", description: "Identify the most recent swing high in the trend." },
    { title: "Wait for close", description: "A wick above is a sweep — you need a candle close beyond the level." },
    { title: "Confirm BOS", description: "Break of Structure confirms trend continuation on your timeframe." },
  ],
  choch: [
    { title: "Established trend", description: "Price has been making clear HH/HL or LH/LL." },
    { title: "First counter break", description: "Price closes beyond the last protected swing — character changes." },
    { title: "Don't chase", description: "Wait for retest or LTF confirmation before reversing bias." },
  ],
  fib: [
    { title: "Anchor the swing", description: "Draw from swing low to swing high (uptrend) or reverse." },
    { title: "Watch 61.8%", description: "Golden Pocket (61.8–65%) is the highest-probability reaction zone." },
    { title: "Confluence filter", description: "Stack Fib with structure, liquidity, or OB for A+ entries." },
  ],
  liquidity: [
    { title: "Equal highs/lows", description: "Clusters of similar highs = buy-side liquidity resting above." },
    { title: "Sweep or run", description: "Price often wicks through to fill stops before reversing." },
    { title: "Target the pool", description: "Use liquidity pools as TP targets or reversal zones." },
  ],
  "support-resistance": [
    { title: "Mark zones", description: "Draw zones at prior reaction areas — not single lines." },
    { title: "Reaction vs break", description: "Wick into zone = reaction. Close through = break." },
    { title: "Trade the retest", description: "Best entries come on retest of broken S/R flipped." },
  ],
  default: [
    { title: "Mark your levels", description: "Start with HTF structure before dropping to entry TF." },
    { title: "Wait for confluence", description: "Stack 2–3 factors before risking capital." },
    { title: "Plan the trade", description: "Use QS tools to score, size, and plan execution." },
  ],
};

function conceptKey(categoryId: string, lessonId: string): string {
  if (categoryId === "market-structure") {
    if (lessonId.includes("choch")) return "choch";
    if (lessonId.includes("bos") || lessonId.includes("sweep")) return "bos";
    if (lessonId.includes("liquidity") || lessonId.includes("fvg")) return "liquidity";
  }
  if (categoryId === "fibonacci") return "fib";
  if (categoryId === "chart-reading") {
    if (lessonId.includes("support") || lessonId.includes("resistance") || lessonId.includes("reaction"))
      return "support-resistance";
  }
  return "default";
}

export function getWalkthroughSteps(
  categoryId: string,
  lessonId: string
): WalkthroughStep[] {
  if (categoryId === "candlesticks") {
    return CANDLE_STEPS[lessonId] ?? CANDLE_STEPS.doji;
  }
  const key = conceptKey(categoryId, lessonId);
  return CONCEPT_STEPS[key] ?? CONCEPT_STEPS.default;
}

export function isCandleWalkthrough(categoryId: string): boolean {
  return categoryId === "candlesticks";
}

export function getWalkthroughTitle(categoryId: string, lessonId: string): string {
  const config = getLessonVisual(categoryId, lessonId);
  if (config.kind === "candle") return "Animated pattern walkthrough";
  return "Step-by-step concept walkthrough";
}