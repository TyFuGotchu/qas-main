import { NextResponse } from "next/server";
import { captureEngagementLead } from "@/lib/email/engagement-drip";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email : "";
    const viewedLessons = Array.isArray(body.viewedLessons)
      ? body.viewedLessons.filter((x: unknown) => typeof x === "string")
      : [];
    const source = typeof body.source === "string" ? body.source : undefined;
    const abStickyBucket =
      typeof body.abStickyBucket === "string" ? body.abStickyBucket : undefined;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const result = await captureEngagementLead({
      email,
      viewedLessons,
      source,
      abStickyBucket,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[engagement/capture]", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}