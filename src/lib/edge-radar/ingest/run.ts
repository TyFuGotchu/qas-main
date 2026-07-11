import { prisma } from "@/lib/prisma";
import {
  ALERT_TTL_HOURS,
  hoursAgo,
  NEWS_INGEST_MAX_AGE_HOURS,
  NEWS_TTL_HOURS,
  SEED_ALERT_PLAYERS,
  SEED_NEWS_HEADLINES,
} from "@/lib/edge-radar/freshness";
import { fetchPropLineLags } from "@/lib/edge-radar/ingest/odds-api";
import { fetchSgoPropLineLags } from "@/lib/edge-radar/ingest/sportsgameodds-api";
import {
  extractPlayerHint,
  scoreNewsImpact,
  shouldSpawnPropWatch,
} from "@/lib/edge-radar/ingest/impact-scorer";
import { parseRssFeed, parseRssPubDate } from "@/lib/edge-radar/ingest/parse-rss";
import {
  EDGE_RADAR_SPORT_FEEDS,
  getOddsApiSports,
  getSgoLeagues,
} from "@/lib/edge-radar/ingest/sport-feeds";

const ODDS_SPORTS_PER_RUN = 4;
const newsIngestCutoff = () => hoursAgo(NEWS_INGEST_MAX_AGE_HOURS);

export interface IngestResult {
  newsInserted: number;
  alertsInserted: number;
  newsPruned: number;
  alertsPruned: number;
  demoPurged: number;
  feedsPolled: number;
  oddsPolled: number;
  errors: string[];
}

function externalNewsId(sportId: string, guid: string): string {
  return `rss:${sportId}:${guid}`.slice(0, 180);
}

async function fetchRss(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "QuicksilverEdgeRadar/1.0 (+https://quicksilveralgo.com)",
      Accept: "application/rss+xml, application/xml, text/xml",
    },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`RSS ${res.status} ${url}`);
  return res.text();
}

async function ingestNewsForSport(
  sportId: string,
  sourceName: string,
  url: string,
  result: IngestResult
): Promise<void> {
  const xml = await fetchRss(url);
  const items = parseRssFeed(xml);
  result.feedsPolled += 1;

  for (const item of items) {
    const publishedAt = parseRssPubDate(item.pubDate);
    if (!publishedAt || publishedAt < newsIngestCutoff()) continue;

    const externalId = externalNewsId(sportId, item.guid);
    const existing = await prisma.edgeRadarNewsItem.findUnique({
      where: { externalId },
    });
    if (existing) continue;

    const impactScore = scoreNewsImpact(item.title, item.description);

    await prisma.edgeRadarNewsItem.create({
      data: {
        sport: sportId,
        headline: item.title.slice(0, 280),
        summary: item.description.slice(0, 600),
        impactScore,
        source: sourceName,
        externalId,
        publishedAt,
      },
    });
    result.newsInserted += 1;

    if (shouldSpawnPropWatch(impactScore)) {
      const player = extractPlayerHint(item.title);
      const alertExternalId = `watch:${externalId}`;
      const alertExists = await prisma.edgeRadarPropAlert.findUnique({
        where: { externalId: alertExternalId },
      });
      if (!alertExists) {
        await prisma.edgeRadarPropAlert.create({
          data: {
            sport: sportId,
            player: player ?? "Lineup watch",
            propType: "Player props",
            line: "—",
            signal: "NEWS WATCH",
            detail: `${item.title} — monitor DK/FD prop lines for lag`,
            evPercent: Math.round((impactScore - 50) / 5),
            books: ["DraftKings", "FanDuel"],
            externalId: alertExternalId,
            publishedAt,
          },
        });
        result.alertsInserted += 1;
      }
    }
  }
}

async function persistPropAlerts(
  lags: {
    sportId: string;
    player: string;
    propType: string;
    line: string;
    signal: string;
    detail: string;
    evPercent: number;
    books: string[];
    externalId: string;
  }[],
  result: IngestResult
): Promise<void> {
  for (const lag of lags) {
    const existing = await prisma.edgeRadarPropAlert.findUnique({
      where: { externalId: lag.externalId },
    });
    if (existing) continue;

    await prisma.edgeRadarPropAlert.create({
      data: {
        sport: lag.sportId,
        player: lag.player,
        propType: lag.propType,
        line: lag.line,
        signal: lag.signal,
        detail: lag.detail,
        evPercent: lag.evPercent,
        books: lag.books,
        externalId: lag.externalId,
      },
    });
    result.alertsInserted += 1;
  }
}

async function ingestSgoOddsBatch(result: IngestResult): Promise<void> {
  const apiKey = process.env.SPORTSGAMEODDS_API_KEY?.trim();
  if (!apiKey) return;

  const leagues = getSgoLeagues();
  const offset = Number(process.env.EDGE_RADAR_SGO_OFFSET ?? 0) % leagues.length;
  const batch = [
    ...leagues.slice(offset, offset + ODDS_SPORTS_PER_RUN),
    ...leagues.slice(0, Math.max(0, offset + ODDS_SPORTS_PER_RUN - leagues.length)),
  ].slice(0, ODDS_SPORTS_PER_RUN);

  for (const { sportId, sgoLeagueId } of batch) {
    try {
      const lags = await fetchSgoPropLineLags(sgoLeagueId, sportId, apiKey);
      result.oddsPolled += 1;
      await persistPropAlerts(lags, result);
    } catch (err) {
      result.errors.push(
        `SGO ${sgoLeagueId}: ${err instanceof Error ? err.message : "unknown"}`
      );
    }
  }
}

async function ingestLegacyOddsBatch(result: IngestResult): Promise<void> {
  if (process.env.SPORTSGAMEODDS_API_KEY?.trim()) return;

  const apiKey = process.env.ODDS_API_KEY?.trim();
  if (!apiKey) return;

  const sports = getOddsApiSports();
  const offset = Number(process.env.EDGE_RADAR_ODDS_OFFSET ?? 0) % sports.length;
  const batch = [
    ...sports.slice(offset, offset + ODDS_SPORTS_PER_RUN),
    ...sports.slice(0, Math.max(0, offset + ODDS_SPORTS_PER_RUN - sports.length)),
  ].slice(0, ODDS_SPORTS_PER_RUN);

  for (const { sportId, oddsApiSport } of batch) {
    try {
      const lags = await fetchPropLineLags(oddsApiSport, sportId, apiKey);
      result.oddsPolled += 1;
      await persistPropAlerts(lags, result);
    } catch (err) {
      result.errors.push(
        `Odds ${oddsApiSport}: ${err instanceof Error ? err.message : "unknown"}`
      );
    }
  }
}

async function purgeDemoContent(result: IngestResult): Promise<void> {
  const [newsPurged, alertsPurged] = await Promise.all([
    prisma.edgeRadarNewsItem.updateMany({
      where: {
        active: true,
        OR: [
          { headline: { in: [...SEED_NEWS_HEADLINES] } },
          { externalId: null, source: { in: ["Rotowire", "Beat reporter", "QS Monitor"] } },
        ],
      },
      data: { active: false },
    }),
    prisma.edgeRadarPropAlert.updateMany({
      where: {
        active: true,
        player: { in: [...SEED_ALERT_PLAYERS] },
        externalId: null,
      },
      data: { active: false },
    }),
  ]);

  result.demoPurged = newsPurged.count + alertsPurged.count;
}

async function pruneStale(result: IngestResult): Promise<void> {
  const newsCutoff = hoursAgo(NEWS_TTL_HOURS);
  const alertCutoff = hoursAgo(ALERT_TTL_HOURS);

  const newsPruned = await prisma.edgeRadarNewsItem.updateMany({
    where: { active: true, publishedAt: { lt: newsCutoff } },
    data: { active: false },
  });
  const alertsPruned = await prisma.edgeRadarPropAlert.updateMany({
    where: { active: true, publishedAt: { lt: alertCutoff } },
    data: { active: false },
  });

  result.newsPruned = newsPruned.count;
  result.alertsPruned = alertsPruned.count;
}

export async function runEdgeRadarIngest(): Promise<IngestResult> {
  const result: IngestResult = {
    newsInserted: 0,
    alertsInserted: 0,
    newsPruned: 0,
    alertsPruned: 0,
    demoPurged: 0,
    feedsPolled: 0,
    oddsPolled: 0,
    errors: [],
  };

  await purgeDemoContent(result);

  for (const feed of EDGE_RADAR_SPORT_FEEDS) {
    for (const source of feed.sources) {
      try {
        await ingestNewsForSport(feed.sportId, source.name, source.url, result);
      } catch (err) {
        result.errors.push(
          `${feed.sportId}/${source.name}: ${err instanceof Error ? err.message : "unknown"}`
        );
      }
    }
  }

  await ingestSgoOddsBatch(result);
  await ingestLegacyOddsBatch(result);
  await pruneStale(result);

  await prisma.edgeRadarIngestRun.create({
    data: {
      newsInserted: result.newsInserted,
      alertsInserted: result.alertsInserted,
      newsPruned: result.newsPruned,
      alertsPruned: result.alertsPruned,
      feedsPolled: result.feedsPolled,
      oddsPolled: result.oddsPolled,
      errors: result.errors,
    },
  });

  return result;
}