import type { EdgeRadarSportId } from "@/lib/edge-radar";

export const EDGE_RADAR_PILLAR_SLUG = "player-props-edge-playbook";
export const EDGE_RADAR_PILLAR_PATH = `/edge-radar/guides/${EDGE_RADAR_PILLAR_SLUG}`;
export const EDGE_RADAR_HUB_PATH = "/edge-radar/hub";

export const PUBLISHED_AT = "2026-07-10";

export interface SportSeoConfig {
  id: EdgeRadarSportId;
  label: string;
  shortLabel: string;
  propTypes: string[];
  injuryTriggers: string[];
  peakSeason: string;
  searchVolume: "high" | "medium" | "low";
}

export const SEO_SPORTS: SportSeoConfig[] = [
  {
    id: "nfl",
    label: "NFL",
    shortLabel: "NFL",
    propTypes: ["passing yards", "rushing yards", "receiving yards", "anytime TD", "receptions"],
    injuryTriggers: ["DNP", "limited practice", "game-time decision", "inactive list"],
    peakSeason: "September through February",
    searchVolume: "high",
  },
  {
    id: "nba",
    label: "NBA",
    shortLabel: "NBA",
    propTypes: ["points", "rebounds", "assists", "PRA", "threes made", "steals + blocks"],
    injuryTriggers: ["OUT tag", "minutes restriction", "late scratch", "load management"],
    peakSeason: "October through June",
    searchVolume: "high",
  },
  {
    id: "mlb",
    label: "MLB",
    shortLabel: "MLB",
    propTypes: ["strikeouts", "hits", "total bases", "home runs", "earned runs"],
    injuryTriggers: ["lineup card", "pitching change", "rain delay", "bullpen day"],
    peakSeason: "April through October",
    searchVolume: "high",
  },
  {
    id: "nhl",
    label: "NHL",
    shortLabel: "NHL",
    propTypes: ["goals", "assists", "shots on goal", "saves", "power-play points"],
    injuryTriggers: ["starting goalie", "upper-body IR", "line combination change"],
    peakSeason: "October through June",
    searchVolume: "high",
  },
  {
    id: "ncaaf",
    label: "NCAAF",
    shortLabel: "College Football",
    propTypes: ["passing yards", "rushing yards", "receiving yards", "anytime TD"],
    injuryTriggers: ["depth chart update", "starting QB change", "suspension"],
    peakSeason: "August through January",
    searchVolume: "medium",
  },
  {
    id: "ncaab",
    label: "NCAAB",
    shortLabel: "College Basketball",
    propTypes: ["points", "rebounds", "assists", "threes made"],
    injuryTriggers: ["tournament injury report", "minutes limit", "foul trouble risk"],
    peakSeason: "November through April",
    searchVolume: "medium",
  },
  {
    id: "wnba",
    label: "WNBA",
    shortLabel: "WNBA",
    propTypes: ["points", "rebounds", "assists", "PRA"],
    injuryTriggers: ["rest day", "back-to-back", "late scratch"],
    peakSeason: "May through October",
    searchVolume: "medium",
  },
  {
    id: "mls",
    label: "MLS",
    shortLabel: "MLS",
    propTypes: ["goals", "shots", "assists", "cards"],
    injuryTriggers: ["starting XI", "international duty", "suspension"],
    peakSeason: "February through December",
    searchVolume: "low",
  },
  {
    id: "epl",
    label: "EPL",
    shortLabel: "Premier League",
    propTypes: ["goals", "shots on target", "assists", "cards"],
    injuryTriggers: ["team news", "press conference", "fixture congestion"],
    peakSeason: "August through May",
    searchVolume: "medium",
  },
  {
    id: "ufc",
    label: "UFC",
    shortLabel: "UFC",
    propTypes: ["method of victory", "round betting", "significant strikes", "takedowns"],
    injuryTriggers: ["weight miss", "fight withdrawal", "replacement opponent"],
    peakSeason: "Year-round",
    searchVolume: "medium",
  },
  {
    id: "pga",
    label: "PGA Tour",
    shortLabel: "PGA",
    propTypes: ["top 20 finish", "made cut", "birdies", "round score"],
    injuryTriggers: ["withdrawal", "WD", "weather delay", "course change"],
    peakSeason: "January through December",
    searchVolume: "low",
  },
  {
    id: "nascar",
    label: "NASCAR",
    shortLabel: "NASCAR",
    propTypes: ["top 5 finish", "top 10", "laps led", "stage winner"],
    injuryTriggers: ["practice crash", "backup car", "pit crew penalty"],
    peakSeason: "February through November",
    searchVolume: "low",
  },
  {
    id: "tennis",
    label: "Tennis",
    shortLabel: "Tennis",
    propTypes: ["match winner", "set betting", "total games", "aces"],
    injuryTriggers: ["retirement", "medical timeout", "surface switch"],
    peakSeason: "Year-round",
    searchVolume: "medium",
  },
  {
    id: "soccer",
    label: "Soccer",
    shortLabel: "Soccer",
    propTypes: ["goals", "shots", "assists", "cards"],
    injuryTriggers: ["lineup leak", "derby rotation", "red card suspension"],
    peakSeason: "Year-round",
    searchVolume: "medium",
  },
  {
    id: "cbb",
    label: "CBB",
    shortLabel: "College Basketball",
    propTypes: ["points", "rebounds", "assists"],
    injuryTriggers: ["March Madness injury", "foul trouble", "blowout minutes"],
    peakSeason: "November through April",
    searchVolume: "medium",
  },
  {
    id: "cfb",
    label: "CFB",
    shortLabel: "College Football",
    propTypes: ["passing yards", "rushing yards", "receiving yards"],
    injuryTriggers: ["QB change", "bowl game opt-out", "weather"],
    peakSeason: "August through January",
    searchVolume: "medium",
  },
  {
    id: "boxing",
    label: "Boxing",
    shortLabel: "Boxing",
    propTypes: ["method of victory", "round betting", "knockdowns"],
    injuryTriggers: ["weight miss", "fight postponement", "replacement"],
    peakSeason: "Year-round",
    searchVolume: "low",
  },
  {
    id: "f1",
    label: "Formula 1",
    shortLabel: "F1",
    propTypes: ["podium finish", "fastest lap", "constructor points"],
    injuryTriggers: ["grid penalty", "DNF risk", "weather strategy"],
    peakSeason: "March through December",
    searchVolume: "low",
  },
];

export const SEO_BOOKS = [
  { slug: "draftkings", name: "DraftKings", shortName: "DK" },
  { slug: "fanduel", name: "FanDuel", shortName: "FD" },
  { slug: "betmgm", name: "BetMGM", shortName: "MGM" },
] as const;

export type BookSlug = (typeof SEO_BOOKS)[number]["slug"];

export const SEO_TOPICS = [
  {
    slug: "line-lag-detection",
    name: "Line Lag Detection",
    keyword: "sportsbook line lag",
    h1Keyword: "Line Lag Detection for Player Props",
  },
  {
    slug: "injury-prop-betting",
    name: "Injury Prop Betting",
    keyword: "injury player props betting",
    h1Keyword: "Injury-Driven Player Prop Betting",
  },
  {
    slug: "ev-player-props-scanner",
    name: "+EV Props Scanner",
    keyword: "+EV player props scanner",
    h1Keyword: "+EV Player Props Scanner",
  },
  {
    slug: "draftkings-fanduel-line-movement",
    name: "DK vs FD Line Movement",
    keyword: "DraftKings FanDuel line movement",
    h1Keyword: "DraftKings vs FanDuel Line Movement",
  },
  {
    slug: "news-impact-betting",
    name: "News Impact Betting",
    keyword: "sports betting news impact",
    h1Keyword: "News Impact Scoring for Sports Betting",
  },
  {
    slug: "live-prop-alerts",
    name: "Live Prop Alerts",
    keyword: "live player prop alerts",
    h1Keyword: "Live Player Prop Alerts",
  },
  {
    slug: "sportsbook-arbitrage-props",
    name: "Prop Arbitrage",
    keyword: "player prop arbitrage",
    h1Keyword: "Sportsbook Arbitrage on Player Props",
  },
  {
    slug: "same-game-parlay-edge",
    name: "SGP Edge",
    keyword: "same game parlay edge",
    h1Keyword: "Same Game Parlay Edge Strategy",
  },
] as const;

export type TopicSlug = (typeof SEO_TOPICS)[number]["slug"];

/** Top sports for sport×book combo pages (highest search volume). */
export const HIGH_VOLUME_SPORT_IDS: EdgeRadarSportId[] = ["nfl", "nba", "mlb", "nhl"];