import type { EdgeRadarSportId } from "@/lib/edge-radar";

export interface SportFeedConfig {
  sportId: EdgeRadarSportId;
  sources: { name: string; url: string }[];
  /** The Odds API sport key — only polled when ODDS_API_KEY is set. */
  oddsApiSport?: string;
}

/** RSS + optional odds keys for every filterable sport (except `all`). */
export const EDGE_RADAR_SPORT_FEEDS: SportFeedConfig[] = [
  {
    sportId: "nfl",
    oddsApiSport: "americanfootball_nfl",
    sources: [
      { name: "ESPN NFL", url: "https://www.espn.com/espn/rss/nfl/news" },
      {
        name: "Google News",
        url: "https://news.google.com/rss/search?q=NFL+injury+lineup+player+props&hl=en-US&gl=US&ceid=US:en",
      },
    ],
  },
  {
    sportId: "nba",
    oddsApiSport: "basketball_nba",
    sources: [
      { name: "ESPN NBA", url: "https://www.espn.com/espn/rss/nba/news" },
      {
        name: "Google News",
        url: "https://news.google.com/rss/search?q=NBA+injury+lineup+player+props&hl=en-US&gl=US&ceid=US:en",
      },
    ],
  },
  {
    sportId: "mlb",
    oddsApiSport: "baseball_mlb",
    sources: [
      { name: "ESPN MLB", url: "https://www.espn.com/espn/rss/mlb/news" },
      {
        name: "Google News",
        url: "https://news.google.com/rss/search?q=MLB+injury+lineup+player+props&hl=en-US&gl=US&ceid=US:en",
      },
    ],
  },
  {
    sportId: "nhl",
    oddsApiSport: "icehockey_nhl",
    sources: [
      { name: "ESPN NHL", url: "https://www.espn.com/espn/rss/nhl/news" },
      {
        name: "Google News",
        url: "https://news.google.com/rss/search?q=NHL+injury+lineup+player+props&hl=en-US&gl=US&ceid=US:en",
      },
    ],
  },
  {
    sportId: "ncaaf",
    oddsApiSport: "americanfootball_ncaaf",
    sources: [
      { name: "ESPN NCAAF", url: "https://www.espn.com/espn/rss/ncaaf/news" },
      {
        name: "Google News",
        url: "https://news.google.com/rss/search?q=college+football+injury+lineup&hl=en-US&gl=US&ceid=US:en",
      },
    ],
  },
  {
    sportId: "ncaab",
    oddsApiSport: "basketball_ncaab",
    sources: [
      { name: "ESPN NCAAB", url: "https://www.espn.com/espn/rss/ncaab/news" },
      {
        name: "Google News",
        url: "https://news.google.com/rss/search?q=college+basketball+injury+lineup&hl=en-US&gl=US&ceid=US:en",
      },
    ],
  },
  {
    sportId: "wnba",
    oddsApiSport: "basketball_wnba",
    sources: [
      {
        name: "Google News",
        url: "https://news.google.com/rss/search?q=WNBA+injury+lineup+player+props&hl=en-US&gl=US&ceid=US:en",
      },
    ],
  },
  {
    sportId: "mls",
    oddsApiSport: "soccer_usa_mls",
    sources: [
      {
        name: "Google News",
        url: "https://news.google.com/rss/search?q=MLS+soccer+injury+lineup&hl=en-US&gl=US&ceid=US:en",
      },
    ],
  },
  {
    sportId: "epl",
    oddsApiSport: "soccer_epl",
    sources: [
      {
        name: "Google News",
        url: "https://news.google.com/rss/search?q=Premier+League+injury+lineup&hl=en-US&gl=US&ceid=US:en",
      },
    ],
  },
  {
    sportId: "ufc",
    oddsApiSport: "mma_mixed_martial_arts",
    sources: [
      {
        name: "Google News",
        url: "https://news.google.com/rss/search?q=UFC+fight+injury+withdrawal&hl=en-US&gl=US&ceid=US:en",
      },
    ],
  },
  {
    sportId: "pga",
    sources: [
      {
        name: "Google News",
        url: "https://news.google.com/rss/search?q=PGA+Tour+injury+withdrawal&hl=en-US&gl=US&ceid=US:en",
      },
    ],
  },
  {
    sportId: "nascar",
    sources: [
      {
        name: "Google News",
        url: "https://news.google.com/rss/search?q=NASCAR+driver+injury+lineup&hl=en-US&gl=US&ceid=US:en",
      },
    ],
  },
  {
    sportId: "tennis",
    sources: [
      {
        name: "Google News",
        url: "https://news.google.com/rss/search?q=tennis+player+injury+withdrawal&hl=en-US&gl=US&ceid=US:en",
      },
    ],
  },
  {
    sportId: "soccer",
    sources: [
      {
        name: "Google News",
        url: "https://news.google.com/rss/search?q=soccer+injury+lineup+player&hl=en-US&gl=US&ceid=US:en",
      },
    ],
  },
  {
    sportId: "cbb",
    sources: [
      {
        name: "Google News",
        url: "https://news.google.com/rss/search?q=college+basketball+injury+March+Madness&hl=en-US&gl=US&ceid=US:en",
      },
    ],
  },
  {
    sportId: "cfb",
    sources: [
      {
        name: "Google News",
        url: "https://news.google.com/rss/search?q=college+football+injury+CFB&hl=en-US&gl=US&ceid=US:en",
      },
    ],
  },
  {
    sportId: "boxing",
    sources: [
      {
        name: "Google News",
        url: "https://news.google.com/rss/search?q=boxing+fighter+injury+withdrawal&hl=en-US&gl=US&ceid=US:en",
      },
    ],
  },
  {
    sportId: "f1",
    sources: [
      {
        name: "Google News",
        url: "https://news.google.com/rss/search?q=Formula+1+driver+injury+lineup&hl=en-US&gl=US&ceid=US:en",
      },
    ],
  },
];

export function getOddsApiSports(): { sportId: EdgeRadarSportId; oddsApiSport: string }[] {
  return EDGE_RADAR_SPORT_FEEDS.filter(
    (f): f is SportFeedConfig & { oddsApiSport: string } => Boolean(f.oddsApiSport)
  ).map((f) => ({ sportId: f.sportId, oddsApiSport: f.oddsApiSport }));
}