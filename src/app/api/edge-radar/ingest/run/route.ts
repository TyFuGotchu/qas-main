import { NextResponse } from "next/server";
import { runEdgeRadarIngest } from "@/lib/edge-radar/ingest/run";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(request: Request) {
  const secret = process.env.ONBOARDING_INTERNAL_SECRET?.trim();
  const authHeader = request.headers.get("authorization");
  const provided = authHeader?.replace(/^Bearer\s+/i, "");

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runEdgeRadarIngest();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[edge-radar/ingest/run]", err);
    return NextResponse.json({ error: "Edge Radar ingest failed" }, { status: 500 });
  }
}