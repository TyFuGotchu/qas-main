import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import {
  fetchAllAccounts,
  TradeLockerApiError,
} from "@/lib/tradelocker/client";
import { cleanAccountsResponse } from "@/lib/tradelocker/parsers";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const raw = await fetchAllAccounts();
    const accounts = cleanAccountsResponse(raw);

    return NextResponse.json({ accounts });
  } catch (error) {
    if (error instanceof TradeLockerApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("[tradelocker/accounts]", error);
    return NextResponse.json(
      { error: "Failed to fetch TradeLocker accounts" },
      { status: 500 }
    );
  }
}