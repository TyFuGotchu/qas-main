import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
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
    Promise.resolve(Boolean(process.env.ODDS_API_KEY?.trim())),
  ]);

  return NextResponse.json({
    lastRun,
    activeNews,
    activeAlerts,
    oddsConfigured,
    cronPath: "/api/edge-radar/ingest/run",
    recommendedCron: "every 10 minutes",
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