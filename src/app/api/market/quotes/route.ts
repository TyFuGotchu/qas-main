import { NextResponse } from "next/server";
import { fetchQuotes } from "@/lib/market-data/provider";

export const dynamic = "force-dynamic";

export async function GET() {
  const quotes = await fetchQuotes();
  return NextResponse.json({ quotes, provider: process.env.MARKET_DATA_API_KEY ? "live" : "mock" });
}