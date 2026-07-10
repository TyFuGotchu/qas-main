import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { userHasEdgeRadarAccess } from "@/lib/edge-radar-access";
import { EDGE_RADAR_SPORTS } from "@/lib/edge-radar";
import { prisma } from "@/lib/prisma";

const PREVIEW_ALERT_LIMIT = 2;
const PREVIEW_NEWS_LIMIT = 3;

export async function GET(request: NextRequest) {
  const sport = request.nextUrl.searchParams.get("sport") ?? "all";

  const session = await getSession();
  const hasAccess = session ? await userHasEdgeRadarAccess(session.id) : false;

  const sportFilter =
    sport !== "all"
      ? {
          OR: [{ sport }, { sport: "all" }],
        }
      : {};

  const [alerts, news, alertCounts, newsCounts] = await Promise.all([
    prisma.edgeRadarPropAlert.findMany({
      where: { active: true, ...sportFilter },
      orderBy: { publishedAt: "desc" },
      take: hasAccess ? 50 : PREVIEW_ALERT_LIMIT,
    }),
    prisma.edgeRadarNewsItem.findMany({
      where: { active: true, ...sportFilter },
      orderBy: { publishedAt: "desc" },
      take: hasAccess ? 30 : PREVIEW_NEWS_LIMIT,
    }),
    prisma.edgeRadarPropAlert.groupBy({
      by: ["sport"],
      where: { active: true },
      _count: { sport: true },
    }),
    prisma.edgeRadarNewsItem.groupBy({
      by: ["sport"],
      where: { active: true },
      _count: { sport: true },
    }),
  ]);

  const alertCountMap = new Map<string, number>(
    alertCounts.map((r) => [r.sport, r._count.sport])
  );
  const newsCountMap = new Map<string, number>(
    newsCounts.map((r) => [r.sport, r._count.sport])
  );
  const globalAlertCount = alertCountMap.get("all") ?? 0;
  const globalNewsCount = newsCountMap.get("all") ?? 0;

  const sports = EDGE_RADAR_SPORTS.map((s) => {
    if (s.id === "all") {
      const total =
        alertCounts.reduce((sum, r) => sum + r._count.sport, 0) +
        newsCounts.reduce((sum, r) => sum + r._count.sport, 0);
      return { id: s.id, label: s.label, count: total };
    }
    const count =
      (alertCountMap.get(s.id) ?? 0) +
      (newsCountMap.get(s.id) ?? 0) +
      globalAlertCount +
      globalNewsCount;
    return { id: s.id, label: s.label, count };
  });

  return NextResponse.json({
    hasAccess,
    sport,
    sports,
    alerts: alerts.map((a) => ({
      id: a.id,
      sport: a.sport,
      player: a.player,
      propType: a.propType,
      line: a.line,
      signal: a.signal,
      detail: a.detail,
      evPercent: a.evPercent,
      books: a.books,
      publishedAt: a.publishedAt.toISOString(),
    })),
    news: news.map((n) => ({
      id: n.id,
      sport: n.sport,
      headline: n.headline,
      summary: hasAccess ? n.summary : n.summary.slice(0, 120) + (n.summary.length > 120 ? "…" : ""),
      impactScore: n.impactScore,
      source: n.source,
      publishedAt: n.publishedAt.toISOString(),
    })),
    refreshedAt: new Date().toISOString(),
  });
}