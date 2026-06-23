import { NextResponse } from "next/server";
import { runEngagementDripBatch } from "@/lib/email/engagement-drip";

export async function POST(request: Request) {
  const secret = process.env.ONBOARDING_INTERNAL_SECRET?.trim();
  const authHeader = request.headers.get("authorization");
  const provided = authHeader?.replace(/^Bearer\s+/i, "");

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runEngagementDripBatch();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[engagement/drip/run]", err);
    return NextResponse.json({ error: "Drip run failed" }, { status: 500 });
  }
}