import type { EdgeRadarSportId } from "@/lib/edge-radar";

/** Google News RSS limited to the last 7 days. */
function googleNewsRss(query: string): string {
  const q = encodeURIComponent(`${query} when:7d`);
  return `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`;
}

export interface SportFeedConfig {
  sportId: EdgeRadarSportId;
  sources: { name: string; url: string }[];
  /** SportsGameOdds leagueID — polled when SPORTSGAMEODDS_API_KEY is set. */
  sgoLeagueId?: string;
  /** Legacy The Odds API sport key fallback. */
  oddsApiSport?: string;
}

/** RSS + optional odds keys for every filterable sport (except `all`). */
export const EDGE_RADAR_SPORT_FEEDS: SportFeedConfig[] = [
  {
    sportId: "nfl",
    sgoLeagueId: "NFL",
    oddsApiSport: "americanfootball_nfl",
    sources: [
      { name: "ESPN NFL", url: "https://www.espn.com/espn/rss/nfl/news" },
      {
        name: "Google News",
        url: googleNewsRss("NFL injury lineup player props"),
      },
    ],
  },
  {
    sportId: "nba",
    sgoLeagueId: "NBA",
    oddsApiSport: "basketball_nba",
    sources: [
      { name: "ESPN NBA", url: "https://www.espn.com/espn/rss/nba/news" },
      {
        name: "Google News",
        url: googleNewsRss("NBA injury lineup player props"),
      },
    ],
  },
  {
    sportId: "mlb",
    sgoLeagueId: "MLB",
    oddsApiSport: "baseball_mlb",
    sources: [
      { name: "ESPN MLB", url: "https://www.espn.com/espn/rss/mlb/news" },
      {
        name: "Google News",
        url: googleNewsRss("MLB injury lineup player props"),
      },
    ],
  },
  {
    sportId: "nhl",
    sgoLeagueId: "NHL",
    oddsApiSport: "icehockey_nhl",
    sources: [
      { name: "ESPN NHL", url: "https://www.espn.com/espn/rss/nhl/news" },
      {
        name: "Google News",
        url: googleNewsRss("NHL injury lineup player props"),
      },
    ],
  },
  {
    sportId: "ncaaf",
    sgoLeagueId: "NCAAF",
    oddsApiSport: "americanfootball_ncaaf",
    sources: [
      { name: "ESPN NCAAF", url: "https://www.espn.com/espn/rss/ncaaf/news" },
      {
        name: "Google News",
        url: googleNewsRss("college football injury lineup"),
      },
    ],
  },
  {
    sportId: "ncaab",
    sgoLeagueId: "NCAAB",
    oddsApiSport: "basketball_ncaab",
    sources: [
      { name: "ESPN NCAAB", url: "https://www.espn.com/espn/rss/ncaab/news" },
      {
        name: "Google News",
        url: googleNewsRss("college basketball injury lineup"),
      },
    ],
  },
  {
    sportId: "wnba",
    sgoLeagueId: "WNBA",
    oddsApiSport: "basketball_wnba",
    sources: [
      {
        name: "Google News",
        url: googleNewsRss("WNBA injury lineup player props"),
      },
    ],
  },
  {
    sportId: "mls",
    sgoLeagueId: "MLS",
    oddsApiSport: "soccer_usa_mls",
    sources: [
      {
        name: "Google News",
        url: googleNewsRss("MLS soccer injury lineup"),
      },
    ],
  },
  {
    sportId: "epl",
    sgoLeagueId: "EPL",
    oddsApiSport: "soccer_epl",
    sources: [
      {
        name: "Google News",
        url: googleNewsRss("Premier League injury lineup"),
      },
    ],
  },
  {
    sportId: "ufc",
    sgoLeagueId: "UFC",
    oddsApiSport: "mma_mixed_martial_arts",
    sources: [
      {
        name: "Google News",
        url: googleNewsRss("UFC fight injury withdrawal"),
      },
    ],
  },
  {
    sportId: "pga",
    sources: [
      {
        name: "Google News",
        url: googleNewsRss("PGA Tour injury withdrawal"),
      },
    ],
  },
  {
    sportId: "nascar",
    sources: [
      {
        name: "Google News",
        url: googleNewsRss("NASCAR driver injury lineup"),
      },
    ],
  },
  {
    sportId: "tennis",
    sources: [
      {
        name: "Google News",
        url: googleNewsRss("tennis player injury withdrawal"),
      },
    ],
  },
  {
    sportId: "soccer",
    sources: [
      {
        name: "Google News",
        url: googleNewsRss("soccer injury lineup player"),
      },
    ],
  },
  {
    sportId: "cbb",
    sources: [
      {
        name: "Google News",
        url: googleNewsRss("college basketball injury March Madness"),
      },
    ],
  },
  {
    sportId: "cfb",
    sources: [
      {
        name: "Google News",
        url: googleNewsRss("college football injury CFB"),
      },
    ],
  },
  {
    sportId: "boxing",
    sources: [
      {
        name: "Google News",
        url: googleNewsRss("boxing fighter injury withdrawal"),
      },
    ],
  },
  {
    sportId: "f1",
    sources: [
      {
        name: "Google News",
        url: googleNewsRss("Formula 1 driver injury lineup"),
      },
    ],
  },
];

export function getOddsApiSports(): { sportId: EdgeRadarSportId; oddsApiSport: string }[] {
  return EDGE_RADAR_SPORT_FEEDS.filter(
    (f): f is SportFeedConfig & { oddsApiSport: string } => Boolean(f.oddsApiSport)
  ).map((f) => ({ sportId: f.sportId, oddsApiSport: f.oddsApiSport }));
}

export function getSgoLeagues(): { sportId: EdgeRadarSportId; sgoLeagueId: string }[] {
  return EDGE_RADAR_SPORT_FEEDS.filter(
    (f): f is SportFeedConfig & { sgoLeagueId: string } => Boolean(f.sgoLeagueId)
  ).map((f) => ({ sportId: f.sportId, sgoLeagueId: f.sgoLeagueId }));
}