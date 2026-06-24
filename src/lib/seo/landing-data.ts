export type LandingDemoType =
  | "setup-scorer"
  | "risk-calc"
  | "consistency-calc"
  | "rr-planner";

export interface SeoMarket {
  slug: string;
  name: string;
  shortName: string;
  session: string;
}

export interface SeoTopic {
  slug: string;
  name: string;
  demo: LandingDemoType;
  toolSlug: string;
  keyword: string;
}

export interface SeoPropFirm {
  slug: string;
  name: string;
  shortName: string;
  profitTarget: string;
  maxDrawdown: string;
  dailyLossLimit: string;
  consistencyRule: string;
}

export interface SeoTimeframe {
  slug: string;
  label: string;
  shortLabel: string;
}

export const SEO_TIMEFRAMES: SeoTimeframe[] = [
  { slug: "1m", label: "1-Minute", shortLabel: "1M" },
  { slug: "5m", label: "5-Minute", shortLabel: "5M" },
  { slug: "15m", label: "15-Minute", shortLabel: "15M" },
  { slug: "30m", label: "30-Minute", shortLabel: "30M" },
  { slug: "1h", label: "1-Hour", shortLabel: "1H" },
  { slug: "4h", label: "4-Hour", shortLabel: "4H" },
  { slug: "1d", label: "Daily", shortLabel: "Daily" },
  { slug: "1w", label: "Weekly", shortLabel: "Weekly" },
];

export const SEO_MARKETS: SeoMarket[] = [
  { slug: "xauusd", name: "Gold (XAUUSD)", shortName: "Gold", session: "London and New York overlap" },
  { slug: "xagusd", name: "Silver (XAGUSD)", shortName: "Silver", session: "London session" },
  { slug: "nas100", name: "NASDAQ 100 (NAS100)", shortName: "NAS100", session: "New York cash session" },
  { slug: "us30", name: "Dow Jones (US30)", shortName: "US30", session: "New York session" },
  { slug: "spx500", name: "S&P 500 (SPX500)", shortName: "S&P 500", session: "New York session" },
  { slug: "eurusd", name: "Euro / US Dollar (EURUSD)", shortName: "EURUSD", session: "London open" },
  { slug: "gbpusd", name: "British Pound / US Dollar (GBPUSD)", shortName: "GBPUSD", session: "London session" },
  { slug: "usdjpy", name: "US Dollar / Japanese Yen (USDJPY)", shortName: "USDJPY", session: "Tokyo and New York" },
  { slug: "audusd", name: "Australian Dollar / US Dollar (AUDUSD)", shortName: "AUDUSD", session: "Sydney and London" },
  { slug: "usdcad", name: "US Dollar / Canadian Dollar (USDCAD)", shortName: "USDCAD", session: "New York session" },
  { slug: "btcusd", name: "Bitcoin (BTCUSD)", shortName: "Bitcoin", session: "24-hour crypto" },
  { slug: "ethusd", name: "Ethereum (ETHUSD)", shortName: "Ethereum", session: "24-hour crypto" },
  { slug: "oil-wti", name: "Crude Oil WTI", shortName: "Oil", session: "New York energy session" },
  { slug: "natural-gas", name: "Natural Gas", shortName: "Nat Gas", session: "US energy hours" },
  { slug: "dxy", name: "US Dollar Index (DXY)", shortName: "DXY", session: "Global macro sessions" },
  { slug: "nzdusd", name: "New Zealand Dollar / US Dollar (NZDUSD)", shortName: "NZDUSD", session: "Sydney open" },
  { slug: "usdchf", name: "US Dollar / Swiss Franc (USDCHF)", shortName: "USDCHF", session: "London session" },
  { slug: "gbpjpy", name: "British Pound / Japanese Yen (GBPJPY)", shortName: "GBPJPY", session: "London and Tokyo overlap" },
  { slug: "eurjpy", name: "Euro / Japanese Yen (EURJPY)", shortName: "EURJPY", session: "London and Tokyo overlap" },
  { slug: "eurgbp", name: "Euro / British Pound (EURGBP)", shortName: "EURGBP", session: "London session" },
  { slug: "solusd", name: "Solana (SOLUSD)", shortName: "Solana", session: "24-hour crypto" },
  { slug: "xrpusd", name: "Ripple (XRPUSD)", shortName: "XRP", session: "24-hour crypto" },
  { slug: "ger40", name: "DAX 40 (GER40)", shortName: "DAX", session: "Frankfurt session" },
  { slug: "uk100", name: "FTSE 100 (UK100)", shortName: "FTSE", session: "London cash session" },
  { slug: "jpn225", name: "Nikkei 225 (JPN225)", shortName: "Nikkei", session: "Tokyo session" },
  { slug: "copper", name: "Copper", shortName: "Copper", session: "London metals session" },
  { slug: "platinum", name: "Platinum (XPTUSD)", shortName: "Platinum", session: "London and New York" },
  { slug: "palladium", name: "Palladium (XPDUSD)", shortName: "Palladium", session: "London and New York" },
  { slug: "audjpy", name: "Australian Dollar / Japanese Yen (AUDJPY)", shortName: "AUDJPY", session: "Tokyo and Sydney overlap" },
  { slug: "cadjpy", name: "Canadian Dollar / Japanese Yen (CADJPY)", shortName: "CADJPY", session: "Tokyo session" },
  { slug: "chfjpy", name: "Swiss Franc / Japanese Yen (CHFJPY)", shortName: "CHFJPY", session: "Tokyo session" },
  { slug: "usdmxn", name: "US Dollar / Mexican Peso (USDMXN)", shortName: "USDMXN", session: "New York session" },
  { slug: "usdsgd", name: "US Dollar / Singapore Dollar (USDSGD)", shortName: "USDSGD", session: "Asian session" },
  { slug: "usdzar", name: "US Dollar / South African Rand (USDZAR)", shortName: "USDZAR", session: "London open" },
  { slug: "brent-oil", name: "Brent Crude Oil", shortName: "Brent", session: "London energy session" },
  { slug: "wheat", name: "Wheat Futures", shortName: "Wheat", session: "Chicago grains session" },
];

export const SEO_PROP_FIRMS: SeoPropFirm[] = [
  {
    slug: "ftmo",
    name: "FTMO",
    shortName: "FTMO",
    profitTarget: "10% Phase 1, 5% Phase 2",
    maxDrawdown: "10% maximum account loss",
    dailyLossLimit: "5% daily loss limit",
    consistencyRule: "Best day cannot exceed 20% of total profit target",
  },
  {
    slug: "apex",
    name: "Apex Trader Funding",
    shortName: "Apex",
    profitTarget: "Varies by account size (e.g. $3,000 on $50K)",
    maxDrawdown: "Trailing drawdown on Rithmic plans",
    dailyLossLimit: "No hard daily cap on most evaluation plans",
    consistencyRule: "30% consistency rule on funded payouts",
  },
  {
    slug: "topstep",
    name: "Topstep",
    shortName: "Topstep",
    profitTarget: "Varies by Trading Combine size",
    maxDrawdown: "Trailing Maximum Loss Limit",
    dailyLossLimit: "Daily loss limits on Express Funded accounts",
    consistencyRule: "Consistency Target — cap best-day share of total profit",
  },
  {
    slug: "fundednext",
    name: "FundedNext",
    shortName: "FundedNext",
    profitTarget: "8–10% depending on challenge type",
    maxDrawdown: "Maximum loss limit (static or trailing by plan)",
    dailyLossLimit: "Daily loss limits on Stellar and Evaluation plans",
    consistencyRule: "Consistency score required on funded withdrawals",
  },
  {
    slug: "the5ers",
    name: "The5ers",
    shortName: "The5ers",
    profitTarget: "Varies by bootcamp and high-stakes program",
    maxDrawdown: "Maximum drawdown per program tier",
    dailyLossLimit: "Program-specific daily loss caps",
    consistencyRule: "Consistency requirements on profit splits",
  },
  {
    slug: "myfundedfx",
    name: "MyFundedFX",
    shortName: "MyFundedFX",
    profitTarget: "8–10% two-step challenge targets",
    maxDrawdown: "Overall max loss and daily drawdown rules",
    dailyLossLimit: "Daily drawdown limits on evaluation accounts",
    consistencyRule: "Best trading day caps on payout requests",
  },
  {
    slug: "e8-funding",
    name: "E8 Funding",
    shortName: "E8",
    profitTarget: "8% evaluation profit target (plan dependent)",
    maxDrawdown: "Trailing or static max drawdown by account",
    dailyLossLimit: "Daily loss limits on most challenge tiers",
    consistencyRule: "Consistency rule on funded payout eligibility",
  },
  {
    slug: "lucid-trading",
    name: "Lucid Trading",
    shortName: "Lucid",
    profitTarget: "Varies by LucidDirect and evaluation plans",
    maxDrawdown: "End-of-day or trailing drawdown by product",
    dailyLossLimit: "Daily loss limits on evaluation paths",
    consistencyRule: "Payout consistency thresholds on funded accounts",
  },
  {
    slug: "blusky",
    name: "BluSky Trading",
    shortName: "BluSky",
    profitTarget: "Program-specific profit objectives",
    maxDrawdown: "Trailing drawdown on funded futures accounts",
    dailyLossLimit: "Daily loss limits during evaluation",
    consistencyRule: "Consistency requirements for withdrawals",
  },
  {
    slug: "take-profit-trader",
    name: "Take Profit Trader",
    shortName: "TPT",
    profitTarget: "Varies by test account size",
    maxDrawdown: "Maximum trailing drawdown on funded plans",
    dailyLossLimit: "Daily loss limits on evaluation accounts",
    consistencyRule: "Consistency caps on profit withdrawals",
  },
  {
    slug: "tradeify",
    name: "Tradeify",
    shortName: "Tradeify",
    profitTarget: "Varies by evaluation and funded plan",
    maxDrawdown: "Trailing drawdown on funded accounts",
    dailyLossLimit: "Daily loss limits on evaluation tiers",
    consistencyRule: "Consistency requirements on payouts",
  },
  {
    slug: "alpha-futures",
    name: "Alpha Futures",
    shortName: "Alpha Futures",
    profitTarget: "Program-specific profit targets",
    maxDrawdown: "Maximum loss limits by account size",
    dailyLossLimit: "Daily loss caps during evaluation",
    consistencyRule: "Payout consistency thresholds",
  },
  {
    slug: "maven-trading",
    name: "Maven Trading",
    shortName: "Maven",
    profitTarget: "Varies by challenge tier",
    maxDrawdown: "Static or trailing max drawdown",
    dailyLossLimit: "Daily loss limits on evaluation",
    consistencyRule: "Best-day consistency on withdrawals",
  },
  {
    slug: "bulenox",
    name: "Bulenox",
    shortName: "Bulenox",
    profitTarget: "Evaluation profit targets by plan",
    maxDrawdown: "Trailing drawdown on funded accounts",
    dailyLossLimit: "Daily loss limits during challenges",
    consistencyRule: "Consistency rules on profit splits",
  },
  {
    slug: "surge-trader",
    name: "Surge Trader",
    shortName: "Surge",
    profitTarget: "Varies by audition and funded program",
    maxDrawdown: "Maximum account drawdown limits",
    dailyLossLimit: "Daily loss limits on evaluation",
    consistencyRule: "Consistency caps on funded payouts",
  },
];

export const SEO_TOPICS: SeoTopic[] = [
  { slug: "setup-scoring", name: "Setup Scoring", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "trade setup scorecard" },
  { slug: "risk-management", name: "Risk Management", demo: "risk-calc", toolSlug: "risk-matrix", keyword: "position size calculator" },
  { slug: "prop-firm-challenge", name: "Prop Firm Challenge", demo: "consistency-calc", toolSlug: "prop-survival", keyword: "prop firm challenge plan" },
  { slug: "prop-firm-consistency", name: "Prop Firm Consistency Rule", demo: "consistency-calc", toolSlug: "prop-survival", keyword: "20 percent consistency rule" },
  { slug: "trade-planning", name: "Trade Planning", demo: "rr-planner", toolSlug: "execution-protocol", keyword: "manual trade plan template" },
  { slug: "confluence-trading", name: "Confluence Trading", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "confluence trading checklist" },
  { slug: "candlestick-patterns", name: "Candlestick Patterns", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "candlestick pattern scoring" },
  { slug: "market-structure", name: "Market Structure", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "market structure analysis" },
  { slug: "fibonacci-trading", name: "Fibonacci Trading", demo: "rr-planner", toolSlug: "execution-protocol", keyword: "fibonacci trade planning" },
  { slug: "session-trading", name: "Session Trading", demo: "setup-scorer", toolSlug: "regime-oracle", keyword: "session-based trading plan" },
  { slug: "scalping-strategy", name: "Scalping Strategy", demo: "risk-calc", toolSlug: "risk-matrix", keyword: "scalping risk calculator" },
  { slug: "swing-trading", name: "Swing Trading", demo: "rr-planner", toolSlug: "execution-protocol", keyword: "swing trade planner" },
  { slug: "journal-analytics", name: "Journal Analytics", demo: "setup-scorer", toolSlug: "alpha-durability", keyword: "trading journal edge analysis" },
  { slug: "funded-trader", name: "Funded Trader Workflow", demo: "consistency-calc", toolSlug: "prop-survival", keyword: "funded account trading plan" },
  { slug: "support-resistance", name: "Support & Resistance", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "support resistance trading plan" },
  { slug: "supply-demand", name: "Supply & Demand Zones", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "supply demand zone trading" },
  { slug: "breakout-trading", name: "Breakout Trading", demo: "rr-planner", toolSlug: "execution-protocol", keyword: "breakout trade planner" },
  { slug: "range-trading", name: "Range Trading", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "range bound trading strategy" },
  { slug: "trend-following", name: "Trend Following", demo: "setup-scorer", toolSlug: "regime-oracle", keyword: "trend following checklist" },
  { slug: "liquidity-sweeps", name: "Liquidity Sweeps", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "liquidity sweep trading" },
  { slug: "order-blocks", name: "Order Blocks", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "order block analysis" },
  { slug: "moving-averages", name: "Moving Average Strategy", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "moving average trade setup" },
  { slug: "rsi-strategy", name: "RSI Strategy", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "RSI divergence trading" },
  { slug: "news-trading", name: "News Trading", demo: "risk-calc", toolSlug: "risk-matrix", keyword: "news event risk calculator" },
  { slug: "stop-loss-placement", name: "Stop Loss Placement", demo: "risk-calc", toolSlug: "risk-matrix", keyword: "stop loss placement calculator" },
  { slug: "take-profit-strategy", name: "Take Profit Strategy", demo: "rr-planner", toolSlug: "execution-protocol", keyword: "take profit planning tool" },
  { slug: "partial-profits", name: "Partial Profit Taking", demo: "rr-planner", toolSlug: "execution-protocol", keyword: "partial take profit planner" },
  { slug: "trailing-stops", name: "Trailing Stops", demo: "rr-planner", toolSlug: "execution-protocol", keyword: "trailing stop trade plan" },
  { slug: "prop-firm-payout", name: "Prop Firm Payout Planning", demo: "consistency-calc", toolSlug: "prop-survival", keyword: "prop firm payout calculator" },
  { slug: "drawdown-recovery", name: "Drawdown Recovery", demo: "consistency-calc", toolSlug: "prop-survival", keyword: "drawdown recovery plan" },
  { slug: "position-sizing", name: "Position Sizing", demo: "risk-calc", toolSlug: "risk-matrix", keyword: "lot size calculator" },
  { slug: "multi-timeframe", name: "Multi-Timeframe Analysis", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "multi timeframe confluence" },
  { slug: "opening-range", name: "Opening Range Strategy", demo: "setup-scorer", toolSlug: "regime-oracle", keyword: "opening range breakout plan" },
  { slug: "vwap-trading", name: "VWAP Trading", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "VWAP intraday strategy" },
  { slug: "gap-trading", name: "Gap Trading", demo: "rr-planner", toolSlug: "execution-protocol", keyword: "gap fill trade planner" },
  { slug: "correlation-trading", name: "Correlation Trading", demo: "risk-calc", toolSlug: "risk-matrix", keyword: "portfolio correlation risk" },
  { slug: "double-top-bottom", name: "Double Top & Bottom", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "double top double bottom trading" },
  { slug: "head-shoulders", name: "Head & Shoulders", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "head and shoulders pattern trade" },
  { slug: "ichimoku-trading", name: "Ichimoku Trading", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "ichimoku cloud strategy" },
  { slug: "bollinger-bands", name: "Bollinger Bands Strategy", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "bollinger bands trading plan" },
  { slug: "macd-strategy", name: "MACD Strategy", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "MACD crossover trading" },
  { slug: "atr-stops", name: "ATR Stop Placement", demo: "risk-calc", toolSlug: "risk-matrix", keyword: "ATR stop loss calculator" },
  { slug: "fair-value-gaps", name: "Fair Value Gaps", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "fair value gap trading" },
  { slug: "break-retest", name: "Break & Retest", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "break and retest strategy" },
  { slug: "pullback-trading", name: "Pullback Trading", demo: "rr-planner", toolSlug: "execution-protocol", keyword: "pullback entry trade plan" },
  { slug: "reversal-trading", name: "Reversal Trading", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "reversal setup scorecard" },
  { slug: "momentum-trading", name: "Momentum Trading", demo: "setup-scorer", toolSlug: "regime-oracle", keyword: "momentum breakout plan" },
  { slug: "mean-reversion", name: "Mean Reversion", demo: "setup-scorer", toolSlug: "edge-confluence", keyword: "mean reversion trading strategy" },
  { slug: "economic-calendar", name: "Economic Calendar Trading", demo: "risk-calc", toolSlug: "risk-matrix", keyword: "economic calendar risk plan" },
  { slug: "pre-market-prep", name: "Pre-Market Preparation", demo: "rr-planner", toolSlug: "execution-protocol", keyword: "pre market trading checklist" },
];

/** Topics suited for timeframe-specific landing pages */
export const TIMEFRAME_TOPIC_SLUGS = new Set(
  SEO_TOPICS.filter(
    (t) =>
      !t.slug.startsWith("prop-firm") &&
      t.slug !== "funded-trader" &&
      t.slug !== "drawdown-recovery" &&
      t.slug !== "journal-analytics"
  ).map((t) => t.slug)
);

/** Topics for prop firm + market combo pages */
export function getPropMarketTopics(): SeoTopic[] {
  const slugs = new Set([
    "prop-firm-challenge",
    "prop-firm-consistency",
    "funded-trader",
    "prop-firm-payout",
    "drawdown-recovery",
    "risk-management",
    "position-sizing",
    "scalping-strategy",
    "session-trading",
    "setup-scoring",
    "trade-planning",
    "stop-loss-placement",
    "news-trading",
    "confluence-trading",
    "candlestick-patterns",
  ]);
  return SEO_TOPICS.filter((t) => slugs.has(t.slug));
}

export function getTimeframeTopics(): SeoTopic[] {
  return SEO_TOPICS.filter((t) => TIMEFRAME_TOPIC_SLUGS.has(t.slug));
}

export function getLessonLandingMarkets(): SeoMarket[] {
  return SEO_MARKETS;
}