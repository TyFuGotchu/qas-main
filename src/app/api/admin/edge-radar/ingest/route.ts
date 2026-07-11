import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import { INGEST_STALE_MINUTES, minutesAgo } from "@/lib/edge-radar/freshness";
import { runEdgeRadarIngest } from "@/lib/edge-radar/ingest/run";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET() {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [lastRun, activeNews, activeAlerts, oddsConfigured] = await Promise.all([
    prisma.edgeRadarIngestRun.findFirst({ orderBy: { completedAt: "desc" } }),
    prisma.edgeRadarNewsItem.count({ where: { active: true } }),
    prisma.edgeRadarPropAlert.count({ where: { active: true } }),
    Promise.resolve(
      Boolean(
        process.env.SPORTSGAMEODDS_API_KEY?.trim() || process.env.ODDS_API_KEY?.trim()
      )
    ),
  ]);

  const isStale =
    !lastRun || lastRun.completedAt < minutesAgo(INGEST_STALE_MINUTES);

  return NextResponse.json({
    lastRun,
    activeNews,
    activeAlerts,
    oddsConfigured,
    isStale,
    autoIngestEnabled: process.env.EDGE_RADAR_INGEST_DISABLED !== "true",
    cronPath: "/api/edge-radar/ingest/run",
    recommendedCron: "every 10 minutes (or built-in scheduler on server start)",
  });
}

export async function POST() {
  const session = await getSession();
  if (!session || !isAdminUser(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const result = await runEdgeRadarIngest();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[admin/edge-radar/ingest]", err);
    return NextResponse.json({ error: "Ingest failed" }, { status: 500 });
  }
}