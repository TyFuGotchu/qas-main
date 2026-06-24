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
];

/** High-traffic markets used for lesson × instrument SEO landing pages */
export const LESSON_LANDING_MARKET_SLUGS = [
  "xauusd",
  "eurusd",
  "gbpusd",
  "nas100",
  "btcusd",
  "usdjpy",
  "us30",
  "oil-wti",
  "spx500",
  "ethusd",
] as const;

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
];

export function getLessonLandingMarkets(): SeoMarket[] {
  const slugSet = new Set<string>(LESSON_LANDING_MARKET_SLUGS);
  return SEO_MARKETS.filter((market) => slugSet.has(market.slug));
}