import type { EdgeRadarSportId } from "@/lib/edge-radar";

const US_BOOKS = new Set([
  "draftkings",
  "fanduel",
  "betmgm",
  "caesars",
  "pointsbetus",
  "espnbet",
]);

interface OddsOutcome {
  name: string;
  price: number;
  point?: number;
}

interface OddsMarket {
  key: string;
  outcomes: OddsOutcome[];
}

interface OddsBookmaker {
  key: string;
  title: string;
  markets: OddsMarket[];
}

interface OddsEvent {
  id: string;
  sport_key: string;
  home_team: string;
  away_team: string;
  bookmakers: OddsBookmaker[];
}

export interface PropLineLagAlert {
  sportId: EdgeRadarSportId;
  player: string;
  propType: string;
  line: string;
  signal: string;
  detail: string;
  evPercent: number;
  books: string[];
  externalId: string;
}

function americanToImplied(price: number): number {
  if (price > 0) return 100 / (price + 100);
  return Math.abs(price) / (Math.abs(price) + 100);
}

export async function fetchPropLineLags(
  oddsApiSport: string,
  sportId: EdgeRadarSportId,
  apiKey: string
): Promise<PropLineLagAlert[]> {
  const url = new URL(`https://api.the-odds-api.com/v4/sports/${oddsApiSport}/odds`);
  url.searchParams.set("apiKey", apiKey);
  url.searchParams.set("regions", "us");
  url.searchParams.set("markets", "h2h,spreads,totals");
  url.searchParams.set("oddsFormat", "american");

  const res = await fetch(url.toString(), { next: { revalidate: 0 } });
  if (!res.ok) {
    throw new Error(`Odds API ${res.status} for ${oddsApiSport}`);
  }

  const events = (await res.json()) as OddsEvent[];
  const alerts: PropLineLagAlert[] = [];

  for (const event of events.slice(0, 8)) {
    const bookLines = new Map<string, Map<string, number>>();

    for (const bookmaker of event.bookmakers) {
      if (!US_BOOKS.has(bookmaker.key)) continue;

      for (const market of bookmaker.markets) {
        if (market.key !== "spreads" && market.key !== "totals") continue;

        for (const outcome of market.outcomes) {
          const key = `${market.key}:${outcome.name}`;
          if (!bookLines.has(key)) bookLines.set(key, new Map());
          bookLines.get(key)!.set(bookmaker.title, outcome.price);
        }
      }
    }

    for (const [marketKey, prices] of Array.from(bookLines.entries())) {
      if (prices.size < 2) continue;

      const entries = Array.from(prices.entries());
      let maxGap = 0;
      let lagBook = "";
      let refBook = "";
      let lagPrice = 0;
      let refPrice = 0;

      for (let i = 0; i < entries.length; i++) {
        for (let j = i + 1; j < entries.length; j++) {
          const impA = americanToImplied(entries[i][1]);
          const impB = americanToImplied(entries[j][1]);
          const gap = Math.abs(impA - impB) * 100;
          if (gap > maxGap) {
            maxGap = gap;
            if (impA < impB) {
              lagBook = entries[i][0];
              refBook = entries[j][0];
              lagPrice = entries[i][1];
              refPrice = entries[j][1];
            } else {
              lagBook = entries[j][0];
              refBook = entries[i][0];
              lagPrice = entries[j][1];
              refPrice = entries[i][1];
            }
          }
        }
      }

      if (maxGap < 2.5) continue;

      const [market, outcomeName] = marketKey.split(":");
      const matchup = `${event.away_team} @ ${event.home_team}`;
      const externalId = `odds:${event.id}:${market}:${outcomeName}:${lagBook}`;

      alerts.push({
        sportId,
        player: matchup,
        propType: market === "spreads" ? "Spread" : "Total",
        line: outcomeName,
        signal: "LINE LAG",
        detail: `${lagBook} ${lagPrice} vs ${refBook} ${refPrice} — ${outcomeName} market lag detected`,
        evPercent: Math.round(maxGap * 10) / 10,
        books: [lagBook, refBook],
        externalId,
      });
    }
  }

  return alerts.slice(0, 6);
}