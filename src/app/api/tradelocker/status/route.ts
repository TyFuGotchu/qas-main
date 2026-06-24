import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import {
  getTradeLockerEnvironmentFromCookies,
  getTradeLockerTokensFromCookies,
} from "@/lib/tradelocker/cookies";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tokens = await getTradeLockerTokensFromCookies();
  const environment = await getTradeLockerEnvironmentFromCookies();

  return NextResponse.json({
    connected: Boolean(tokens?.accessToken && tokens?.refreshToken),
    expireDate: tokens?.expireDate ?? null,
    environment,
  });
}