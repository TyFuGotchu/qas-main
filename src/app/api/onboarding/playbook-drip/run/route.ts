import { NextResponse } from "next/server";
import { runPlaybookNudgeBatch } from "@/lib/email/playbook-drip";

export async function POST(request: Request) {
  const secret = process.env.ONBOARDING_INTERNAL_SECRET?.trim();
  const authHeader = request.headers.get("authorization");
  const provided = authHeader?.replace(/^Bearer\s+/i, "");

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runPlaybookNudgeBatch();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[onboarding/playbook-drip/run]", err);
    return NextResponse.json({ error: "Playbook drip run failed" }, { status: 500 });
  }
}