export const EDGE_RADAR_PATH = "/edge-radar";

export const EDGE_RADAR_NAME = "Quicksilver Edge Radar";

export const EDGE_RADAR_PRICE = "$14.99/mo";

export const EDGE_RADAR_PRICE_AMOUNT = 14.99;

export const EDGE_RADAR_CHECKOUT_URL =
  "https://buy.stripe.com/28E6oH1dG8aa6Tf3PVco00g";

export const EDGE_RADAR_PUBLISHED_AT = "2026-07-10";

export const EDGE_RADAR_TAGLINE =
  "Live +EV sports prop scanner with injury-driven line lag detection.";

export const EDGE_RADAR_HOOK =
  "Scans real-time injury, lineup, and news sentiment across DraftKings, FanDuel, and major US books — flagging mispriced player prop lines before books fully adjust.";

export const EDGE_RADAR_META_DESCRIPTION =
  "Quicksilver Edge Radar flags +EV player prop line lags on DraftKings & FanDuel across every major sport. Live news impact scores — $14.99/mo, no setup.";

export const EDGE_RADAR_SEO_KEYWORDS = [
  "sports betting player props scanner",
  "DraftKings FanDuel line movement",
  "+EV sports betting tool",
  "player prop line lag",
  "NBA player props scanner",
  "NFL player props alerts",
  "MLB player props betting",
  "NHL player props scanner",
  "injury line movement betting",
  "sportsbook arbitrage alerts",
  "real-time injury line movement",
  "live betting odds scanner",
  "sports betting news impact",
  "player prop alerts",
  "BetMGM prop lines",
  "same game parlay edge",
  "college football player props",
  "WNBA player props",
  "UFC betting props",
  "live prop betting tool",
] as const;

/** All filterable sports — `all` shows every active alert. */
export const EDGE_RADAR_SPORTS = [
  { id: "all", label: "All Sports" },
  { id: "nfl", label: "NFL" },
  { id: "nba", label: "NBA" },
  { id: "mlb", label: "MLB" },
  { id: "nhl", label: "NHL" },
  { id: "ncaaf", label: "NCAAF" },
  { id: "ncaab", label: "NCAAB" },
  { id: "wnba", label: "WNBA" },
  { id: "mls", label: "MLS" },
  { id: "epl", label: "EPL" },
  { id: "ufc", label: "UFC" },
  { id: "pga", label: "PGA" },
  { id: "nascar", label: "NASCAR" },
  { id: "tennis", label: "Tennis" },
  { id: "soccer", label: "Soccer" },
  { id: "cbb", label: "CBB" },
  { id: "cfb", label: "CFB" },
  { id: "boxing", label: "Boxing" },
  { id: "f1", label: "F1" },
] as const;

export type EdgeRadarSportId = (typeof EDGE_RADAR_SPORTS)[number]["id"];

export const EDGE_RADAR_MARKETS = [
  {
    category: "US Sportsbooks",
    items: [
      "DraftKings",
      "FanDuel",
      "BetMGM",
      "Caesars",
      "ESPN BET",
      "cross-book line lag detection",
    ],
  },
  {
    category: "Prop markets",
    items: [
      "player points",
      "rebounds & assists",
      "receiving & rushing yards",
      "strikeouts & hits",
      "anytime TD & goal scorers",
    ],
  },
] as const;

export const EDGE_RADAR_USE_CASES = [
  {
    title: "Injury & lineup snipers",
    body: "Edge Radar surfaces prop lines that haven't moved yet when injury or lineup news breaks — the window before DraftKings and FanDuel fully adjust.",
  },
  {
    title: "Multi-sport prop hunters",
    body: "Filter by NFL, NBA, MLB, NHL, NCAA, UFC, and more. One terminal for every sport you bet — no switching between Discord channels or spreadsheets.",
  },
  {
    title: "News-driven impact scoring",
    body: "A live news feed ranks every headline by projected prop impact so you know which injuries, weather, and lineup changes matter most right now.",
  },
] as const;

export const EDGE_RADAR_FAQ = [
  {
    question: "What is Quicksilver Edge Radar?",
    answer:
      "Edge Radar is a live sports betting scanner focused exclusively on player props. It monitors injury news, lineup changes, and line movements across major US sportsbooks to flag +EV prop opportunities before lines correct.",
  },
  {
    question: "How much does Edge Radar cost?",
    answer:
      "Edge Radar is $14.99 per month. Subscribe via Stripe for instant access to the live hosted terminal on quicksilveralgo.com. Cancel anytime.",
  },
  {
    question: "Which sports does Edge Radar cover?",
    answer:
      "Filter across NFL, NBA, MLB, NHL, NCAAF, NCAAB, WNBA, MLS, EPL, UFC, PGA, NASCAR, Tennis, Soccer, and more. New sports and prop markets are added as the product expands.",
  },
  {
    question: "What are news impact scores?",
    answer:
      "Every headline in the Edge Radar news feed includes an impact score (1–100) estimating how likely the news is to move player prop lines. Higher scores mean faster action recommended.",
  },
  {
    question: "How is Edge Radar different from Quicksilver Premium?",
    answer:
      "Premium ($149.99/mo) is the prop-firm trading stack: 7-Day Playbook, quant tools, and TradeLocker bot. Edge Radar ($14.99/mo) is a standalone sports prop scanner — built for bettors, not forex traders.",
  },
  {
    question: "Can Edge Radar guarantee profits?",
    answer:
      "No tool can guarantee betting profits. Edge Radar surfaces statistical edges and line inefficiencies — bankroll management and bet selection remain your responsibility.",
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
    title: "Live News Impact Feed",
    description:
      "Continuously updated injury and lineup headlines ranked by projected prop impact score (1–100).",
    accent: "cyan" as const,
  },
  {
    title: "Every Sport, One Terminal",
    description:
      "Filter NFL, NBA, MLB, NHL, NCAA, UFC, and more from a single hosted dashboard — no setup required.",
    accent: "amber" as const,
  },
] as const;

export function getSportLabel(sportId: string): string {
  return EDGE_RADAR_SPORTS.find((s) => s.id === sportId)?.label ?? sportId.toUpperCase();
}

export function getImpactScoreVariant(score: number): "danger" | "warning" | "success" {
  if (score >= 75) return "danger";
  if (score >= 45) return "warning";
  return "success";
}

export function formatImpactScore(score: number): string {
  return `${Math.min(100, Math.max(1, Math.round(score)))}`;
}