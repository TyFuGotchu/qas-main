import type { EdgeRadarSportId } from "@/lib/edge-radar";

const BOOKMAKERS = "draftkings,fanduel,betmgm";

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

/** Maps Edge Radar sport id → SportsGameOdds leagueID */
export const SGO_LEAGUE_MAP: Partial<Record<EdgeRadarSportId, string>> = {
  nfl: "NFL",
  nba: "NBA",
  mlb: "MLB",
  nhl: "NHL",
  ncaaf: "NCAAF",
  ncaab: "NCAAB",
  wnba: "WNBA",
  mls: "MLS",
  epl: "EPL",
  ufc: "UFC",
};

interface SgoBookOdds {
  odds?: string;
  overUnder?: string;
  available?: boolean;
  lastUpdatedAt?: string;
}

interface SgoOdd {
  oddID: string;
  marketName?: string;
  statID?: string;
  statEntityID?: string;
  betTypeID?: string;
  sideID?: string;
  playerID?: string;
  bookOverUnder?: string;
  openBookOverUnder?: string;
  bookOdds?: string;
  openBookOdds?: string;
  byBookmaker?: Record<string, SgoBookOdds>;
}

interface SgoPlayer {
  name?: string;
  firstName?: string;
  lastName?: string;
}

interface SgoEvent {
  eventID: string;
  leagueID: string;
  teams?: {
    home?: { names?: { medium?: string; long?: string } };
    away?: { names?: { medium?: string; long?: string } };
  };
  players?: Record<string, SgoPlayer>;
  odds?: Record<string, SgoOdd>;
}

interface SgoResponse {
  success: boolean;
  data: SgoEvent[];
  error?: string;
}

function parseAmericanOdds(odds: string): number | null {
  const n = parseInt(odds.replace(/[^0-9+-]/g, ""), 10);
  return Number.isNaN(n) ? null : n;
}

function oddsGapPercent(a: string, b: string): number {
  const priceA = parseAmericanOdds(a);
  const priceB = parseAmericanOdds(b);
  if (priceA == null || priceB == null) return 0;

  const impA = priceA > 0 ? 100 / (priceA + 100) : Math.abs(priceA) / (Math.abs(priceA) + 100);
  const impB = priceB > 0 ? 100 / (priceB + 100) : Math.abs(priceB) / (Math.abs(priceB) + 100);
  return Math.abs(impA - impB) * 100;
}

function isPlayerProp(odd: SgoOdd): boolean {
  if (odd.betTypeID !== "ou") return false;
  if (!odd.statEntityID) return false;
  if (["home", "away", "all"].includes(odd.statEntityID)) return false;
  return odd.sideID === "over";
}

function resolvePlayerName(event: SgoEvent, odd: SgoOdd): string {
  const id = odd.playerID ?? odd.statEntityID;
  if (id && event.players?.[id]?.name) return event.players[id].name!;
  if (odd.marketName) {
    const match = odd.marketName.match(/^(.+?)\s+(Over|Under)/i);
    if (match?.[1]) return match[1].trim();
  }
  return id?.replace(/_\d+_[A-Z]+$/, "").replace(/_/g, " ") ?? "Player";
}

function formatPropType(odd: SgoOdd): string {
  if (odd.marketName) {
    return odd.marketName.replace(/ Over\/Under$/i, "").trim();
  }
  return (odd.statID ?? "Prop").replace(/_/g, " ");
}

export function getSgoLeagues(): { sportId: EdgeRadarSportId; leagueId: string }[] {
  return Object.entries(SGO_LEAGUE_MAP).map(([sportId, leagueId]) => ({
    sportId: sportId as EdgeRadarSportId,
    leagueId: leagueId!,
  }));
}

export async function fetchSgoPropLineLags(
  leagueId: string,
  sportId: EdgeRadarSportId,
  apiKey: string
): Promise<PropLineLagAlert[]> {
  const url = new URL("https://api.sportsgameodds.com/v2/events");
  url.searchParams.set("apiKey", apiKey);
  url.searchParams.set("oddsAvailable", "true");
  url.searchParams.set("leagueID", leagueId);
  url.searchParams.set("bookmakerID", BOOKMAKERS);
  url.searchParams.set("limit", "8");

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`SportsGameOdds ${res.status} for ${leagueId}`);
  }

  const body = (await res.json()) as SgoResponse;
  if (!body.success) {
    throw new Error(body.error ?? `SportsGameOdds failed for ${leagueId}`);
  }

  const alerts: PropLineLagAlert[] = [];

  for (const event of body.data ?? []) {
    if (!event.odds) continue;

    for (const odd of Object.values(event.odds)) {
      if (!isPlayerProp(odd)) continue;

      const dk = odd.byBookmaker?.draftkings;
      const fd = odd.byBookmaker?.fanduel;
      if (!dk || !fd) continue;

      const player = resolvePlayerName(event, odd);
      const propLabel = formatPropType(odd);
      const dkLine = dk.overUnder ?? odd.bookOverUnder;
      const fdLine = fd.overUnder ?? odd.bookOverUnder;

      if (!dkLine || !fdLine) continue;

      const books: string[] = [];
      let signal = "LINE LAG";
      let detail = "";
      let evPercent = 0;

      if (dkLine !== fdLine) {
        const lagBook = parseFloat(dkLine) < parseFloat(fdLine) ? "DraftKings" : "FanDuel";
        const refBook = lagBook === "DraftKings" ? "FanDuel" : "DraftKings";
        const lagLine = lagBook === "DraftKings" ? dkLine : fdLine;
        const refLine = refBook === "FanDuel" ? fdLine : dkLine;
        detail = `${lagBook} still ${lagLine} — ${refBook} at ${refLine} (${propLabel})`;
        evPercent = Math.min(12, Math.abs(parseFloat(dkLine) - parseFloat(fdLine)) * 4);
        books.push("DraftKings", "FanDuel");
      } else if (
        odd.openBookOverUnder &&
        odd.bookOverUnder &&
        odd.openBookOverUnder !== odd.bookOverUnder
      ) {
        signal = "LINE MOVE";
        detail = `${propLabel} moved ${odd.openBookOverUnder} → ${odd.bookOverUnder} — check ${BOOKMAKERS.split(",").join("/")} for lag`;
        evPercent = Math.min(
          10,
          Math.abs(parseFloat(odd.openBookOverUnder) - parseFloat(odd.bookOverUnder)) * 3
        );
        books.push("DraftKings", "FanDuel", "BetMGM");
      } else if (dk.odds && fd.odds) {
        const gap = oddsGapPercent(dk.odds, fd.odds);
        if (gap < 2.5) continue;
        detail = `Same line ${dkLine} — DK ${dk.odds} vs FD ${fd.odds} (${propLabel})`;
        evPercent = Math.round(gap * 10) / 10;
        books.push("DraftKings", "FanDuel");
      } else {
        continue;
      }

      if (evPercent < 2) continue;

      const externalId = `sgo:${event.eventID}:${odd.oddID}`;

      alerts.push({
        sportId,
        player,
        propType: `O ${dkLine}`,
        line: dkLine,
        signal,
        detail,
        evPercent,
        books,
        externalId,
      });
    }
  }

  return alerts.slice(0, 12);
}