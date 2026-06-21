import { getCached, setCached } from "./cache";
import type { MacroEvent } from "./types";

const BASE_URL = "https://finnhub.io/api/v1";

function getApiKey(): string | null {
  return process.env.FINNHUB_API_KEY ?? null;
}

export function hasFinnhubKey(): boolean {
  return Boolean(getApiKey());
}

async function finnhubFetch<T>(path: string, params: Record<string, string> = {}): Promise<T | null> {
  const token = getApiKey();
  if (!token) return null;

  const url = new URL(`${BASE_URL}${path}`);
  Object.entries({ ...params, token }).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    next: { revalidate: 0 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    console.error(`[finnhub] HTTP ${res.status} for ${path}`);
    return null;
  }

  return res.json() as Promise<T>;
}

interface FinnhubEconomicEvent {
  event: string;
  time: string;
  country: string;
  impact: string;
  currency?: string;
  estimate?: number;
  prev?: number;
  actual?: number;
}

interface FinnhubCalendarResponse {
  economicCalendar?: FinnhubEconomicEvent[];
}

interface FinnhubNewsItem {
  id?: number;
  headline: string;
  summary: string;
  datetime: number;
  category: string;
}

const BULLISH_WORDS = ["surge", "beat", "strong", "growth", "rally", "hawkish", "hot", "rise", "gain"];
const BEARISH_WORDS = ["miss", "weak", "fall", "drop", "cut", "dovish", "cool", "decline", "flush", "selloff"];

function scoreHeadlineSentiment(text: string): number {
  const lower = text.toLowerCase();
  let score = 0;
  for (const w of BULLISH_WORDS) if (lower.includes(w)) score += 12;
  for (const w of BEARISH_WORDS) if (lower.includes(w)) score -= 12;
  return Math.max(-100, Math.min(100, score));
}

function impactLevel(impact: string): "low" | "medium" | "high" {
  const i = impact?.toLowerCase() ?? "";
  if (i.includes("high") || i === "3") return "high";
  if (i.includes("medium") || i === "2") return "medium";
  return "low";
}

function impactBaseScore(level: "low" | "medium" | "high"): number {
  if (level === "high") return 55;
  if (level === "medium") return 25;
  return 10;
}

function deriveVolatilityMetrics(
  impact: "low" | "medium" | "high",
  sentimentScore: number
): Pick<MacroEvent, "volatilityImpactScore" | "spikeProbability" | "flushProbability" | "sentiment"> {
  const base = impactBaseScore(impact);
  const volatilityImpactScore = Math.max(
    -100,
    Math.min(100, Math.round(base + sentimentScore * 0.45))
  );

  const normalized = (volatilityImpactScore + 100) / 200;
  const spikeProbability = parseFloat(
    (0.35 + normalized * 0.55 + (sentimentScore > 0 ? 0.05 : 0)).toFixed(2)
  );
  const flushProbability = parseFloat((1 - spikeProbability * 0.85).toFixed(2));

  const sentiment: MacroEvent["sentiment"] =
    sentimentScore > 15 ? "bullish" : sentimentScore < -15 ? "bearish" : "neutral";

  return { volatilityImpactScore, spikeProbability, flushProbability, sentiment };
}

function buildEventsFromNews(news: FinnhubNewsItem[]): MacroEvent[] {
  return news.slice(0, 12).map((item, i) => {
    const sentimentScore = scoreHeadlineSentiment(item.headline + " " + item.summary);
    const impact: MacroEvent["impact"] =
      Math.abs(sentimentScore) > 40 ? "high" : Math.abs(sentimentScore) > 20 ? "medium" : "low";
    const metrics = deriveVolatilityMetrics(impact, sentimentScore);

    return {
      id: `fh-news-${item.id ?? i}`,
      title: item.headline,
      currency: item.category === "forex" ? "USD" : "GLOBAL",
      impact,
      scheduledAt: new Date(item.datetime * 1000).toISOString(),
      ...metrics,
    };
  });
}

function buildEventsFromCalendar(
  calendar: FinnhubEconomicEvent[],
  avgNewsSentiment: number
): MacroEvent[] {
  return calendar
    .filter((e) => e.event && e.time)
    .slice(0, 12)
    .map((e, i) => {
      const impact = impactLevel(e.impact);
      const eventSentiment = scoreHeadlineSentiment(e.event) + avgNewsSentiment * 0.35;
      const metrics = deriveVolatilityMetrics(impact, eventSentiment);

      return {
        id: `fh-cal-${i}-${e.time}`,
        title: e.event,
        currency: e.currency ?? e.country ?? "USD",
        impact,
        scheduledAt: new Date(e.time).toISOString(),
        ...metrics,
      } satisfies MacroEvent;
    });
}

export async function fetchFinnhubMacroCalendar(): Promise<MacroEvent[]> {
  const cacheKey = "fh:calendar";
  const cached = getCached<MacroEvent[]>(cacheKey);
  if (cached) return cached;

  const now = new Date();
  const from = now.toISOString().slice(0, 10);
  const toDate = new Date(now.getTime() + 14 * 86400_000);
  const to = toDate.toISOString().slice(0, 10);

  const [calendar, forexNews, generalNews] = await Promise.all([
    finnhubFetch<FinnhubCalendarResponse>("/calendar/economic", { from, to }),
    finnhubFetch<FinnhubNewsItem[]>("/news", { category: "forex" }),
    finnhubFetch<FinnhubNewsItem[]>("/news", { category: "general" }),
  ]);

  const news = [...(forexNews ?? []), ...(generalNews ?? [])].slice(0, 40);
  const newsSentiment = news.reduce(
    (sum, n) => sum + scoreHeadlineSentiment(n.headline + " " + n.summary),
    0
  );
  const avgNewsSentiment = news.length ? newsSentiment / news.length : 0;

  const calendarEvents = calendar?.economicCalendar ?? [];
  const events =
    calendarEvents.length > 0
      ? buildEventsFromCalendar(calendarEvents, avgNewsSentiment)
      : buildEventsFromNews(news);

  const sorted = events.sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );

  return setCached(cacheKey, sorted, 300_000);
}