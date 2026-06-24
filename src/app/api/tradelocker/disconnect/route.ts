import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { clearTradeLockerTokenCookies } from "@/lib/tradelocker/cookies";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await clearTradeLockerTokenCookies();
  return NextResponse.json({ connected: false });
}