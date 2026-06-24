import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import {
  fetchInstruments,
  TradeLockerApiError,
} from "@/lib/tradelocker/client";
import { parseInstruments } from "@/lib/tradelocker/parsers";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accountId = request.nextUrl.searchParams.get("accountId");
    const accNum = request.nextUrl.searchParams.get("accNum");

    if (!accountId || !accNum) {
      return NextResponse.json(
        { error: "accountId and accNum are required" },
        { status: 400 }
      );
    }

    const raw = await fetchInstruments(accountId, accNum);
    const instruments = parseInstruments(raw);

    return NextResponse.json({ instruments });
  } catch (error) {
    if (error instanceof TradeLockerApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("[tradelocker/instruments]", error);
    return NextResponse.json(
      { error: "Failed to fetch TradeLocker instruments" },
      { status: 500 }
    );
  }
}