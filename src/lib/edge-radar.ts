export const EDGE_RADAR_PATH = "/edge-radar";

export const EDGE_RADAR_NAME = "Quicksilver Edge Radar";

export const EDGE_RADAR_PRICE = "$14.99/mo";

export const EDGE_RADAR_PRICE_AMOUNT = 14.99;

export const EDGE_RADAR_CHECKOUT_URL =
  "https://buy.stripe.com/28E6oH1dG8aa6Tf3PVco00g";

export const EDGE_RADAR_PUBLISHED_AT = "2026-07-10";

export const EDGE_RADAR_TAGLINE =
  "Automated edge detection for quantitative traders and sports bettors.";

export const EDGE_RADAR_HOOK =
  "Scans real-time news sentiment and line movements to flag market inefficiencies — lagging player prop lines on DraftKings and FanDuel, rapid volume spikes on XAUUSD and US30 — before they correct.";

/** Primary meta description — tuned for SERP length and dual-intent keywords. */
export const EDGE_RADAR_META_DESCRIPTION =
  "Quicksilver Edge Radar flags +EV sports prop line lags on DraftKings & FanDuel and macro sentiment spikes on XAUUSD & US30. Live hosted terminal — $14.99/mo, no setup.";

export const EDGE_RADAR_SEO_KEYWORDS = [
  "sports betting player props scanner",
  "DraftKings FanDuel line movement",
  "+EV sports betting tool",
  "player prop line lag",
  "XAUUSD sentiment scanner",
  "gold trading volume alerts",
  "US30 futures news sentiment",
  "quantitative trading edge detection",
  "live betting odds scanner",
  "macro sentiment trading",
  "sportsbook arbitrage alerts",
  "real-time injury line movement",
] as const;

export const EDGE_RADAR_MARKETS = [
  {
    category: "Sportsbooks",
    items: ["DraftKings", "FanDuel", "NBA player props", "NFL receiving yards", "injury-driven line lags"],
  },
  {
    category: "Macro & futures",
    items: ["XAUUSD (gold)", "US30 (Dow)", "volume acceleration", "news sentiment bursts", "pre-market gap divergence"],
  },
] as const;

export const EDGE_RADAR_USE_CASES = [
  {
    title: "Sports bettors chasing +EV props",
    body: "Edge Radar compares player prop lines across books the moment injury or lineup news drops — surfacing lagging numbers before DraftKings and FanDuel fully adjust.",
  },
  {
    title: "Forex & index traders on volatility",
    body: "When CPI, Fed speakers, or geopolitical headlines hit, Edge Radar flags abnormal XAUUSD and US30 volume and sentiment acceleration so you can react before the move exhausts.",
  },
  {
    title: "Quant traders who want one terminal",
    body: "No local scripts, API keys, or Discord bots. The full live feed runs on quicksilveralgo.com — subscribe and open the dashboard from any device.",
  },
] as const;

export const EDGE_RADAR_FAQ = [
  {
    question: "What is Quicksilver Edge Radar?",
    answer:
      "Edge Radar is a dual-purpose live scanner for sports bettors and quantitative traders. It monitors real-time news sentiment and line movements to flag mispriced player props on DraftKings and FanDuel, plus macro volume and sentiment spikes on XAUUSD and US30 — before markets correct.",
  },
  {
    question: "How much does Edge Radar cost?",
    answer:
      "Edge Radar is $14.99 per month. Subscribe via Stripe for instant access to the live hosted terminal on quicksilveralgo.com. Cancel anytime.",
  },
  {
    question: "Do I need to install code or connect APIs?",
    answer:
      "No. Edge Radar is hosted entirely on Quicksilver — no external repos, API keys, or local setup. After checkout you access the live dashboard directly on the site.",
  },
  {
    question: "What sportsbooks and markets does Edge Radar cover?",
    answer:
      "The sports prop scanner focuses on major US books including DraftKings and FanDuel, with alerts for NBA and NFL player props when injury or lineup news creates line lags. The macro scanner covers high-volatility assets including XAUUSD (gold) and US30 (Dow futures) with volume and sentiment spike detection.",
  },
  {
    question: "How is Edge Radar different from Quicksilver Premium?",
    answer:
      "Premium ($149.99/mo) is the full prop-firm trading stack: 7-Day Playbook, 9 planning tools, TradeLocker Quant Protocol bot, and challenge tracker. Edge Radar ($14.99/mo) is a standalone live edge scanner for sports props and macro sentiment — ideal if you only need real-time inefficiency alerts.",
  },
  {
    question: "Can Edge Radar guarantee profits?",
    answer:
      "No tool can guarantee trading or betting profits. Edge Radar surfaces statistical edges and market inefficiencies — execution, bankroll management, and risk remain your responsibility.",
  },
] as const;

export const EDGE_RADAR_FEATURES = [
  {
    title: "+EV Sports Prop Scanner",
    description:
      "Spots mispriced player lines driven by instant injury and lineup updates before books fully adjust.",
    accent: "emerald" as const,
  },
  {
    title: "Macro Sentiment Spikes",
    description:
      "Flags rapid volume acceleration on high-volatility assets like XAUUSD and US30 when news sentiment breaks.",
    accent: "cyan" as const,
  },
  {
    title: "Centralized Live Terminal",
    description:
      "Hosted completely live on quicksilveralgo.com — no external code, API keys, or local setup required.",
    accent: "amber" as const,
  },
] as const;

export type EdgeRadarAlertKind = "sports" | "macro";

export interface EdgeRadarSampleAlert {
  id: string;
  kind: EdgeRadarAlertKind;
  timestamp: string;
  asset: string;
  signal: string;
  detail: string;
  ev?: string;
  locked?: boolean;
}

export const EDGE_RADAR_SAMPLE_ALERTS: EdgeRadarSampleAlert[] = [
  {
    id: "sports-1",
    kind: "sports",
    timestamp: "14:02:18",
    asset: "NBA · Giannis Antetokounmpo O 28.5 Pts",
    signal: "LINE LAG",
    detail: "DraftKings still 28.5 — FanDuel moved to 30.5 after Middleton OUT (13:58 ET)",
    ev: "+4.2% EV",
  },
  {
    id: "macro-1",
    kind: "macro",
    timestamp: "14:01:44",
    asset: "XAUUSD",
    signal: "VOL SPIKE",
    detail: "Volume +312% vs 20m baseline · Sentiment burst +0.72 in 90s (CPI headline)",
    ev: "3.1σ",
  },
  {
    id: "macro-2",
    kind: "macro",
    timestamp: "13:58:09",
    asset: "US30",
    signal: "GAP DIVERGENCE",
    detail: "Futures +0.4% while cash index flat · Fed speaker headline 08:30 ET",
    ev: "+0.38%",
  },
  {
    id: "sports-2",
    kind: "sports",
    timestamp: "13:55:31",
    asset: "NFL · Tyreek Hill U 6.5 Rec",
    signal: "LINE LAG",
    detail: "FanDuel 6.5 · DK still 7.5 after practice report downgrade",
    ev: "+3.1% EV",
    locked: true,
  },
  {
    id: "macro-3",
    kind: "macro",
    timestamp: "13:52:17",
    asset: "XAUUSD",
    signal: "SENTIMENT FLIP",
    detail: "Headline cluster: safe-haven bid · Order flow imbalance 2.4:1 buy",
    ev: "2.8σ",
    locked: true,
  },
];