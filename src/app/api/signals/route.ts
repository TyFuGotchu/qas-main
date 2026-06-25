import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { canAccessBot } from "@/lib/tiers";
import { getActiveSignals } from "@/lib/signals/store";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canAccessBot(session.subscriptionTier)) {
    return NextResponse.json(
      { error: "Premium required for live trade signals" },
      { status: 403 }
    );
  }

  return NextResponse.json({ signals: getActiveSignals() });
}