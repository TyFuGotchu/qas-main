import { NextResponse } from "next/server";
import { fetchQuotes, getDataSource } from "@/lib/market-data/provider";

export const dynamic = "force-dynamic";

export async function GET() {
  const quotes = await fetchQuotes();
  return NextResponse.json({ quotes, source: getDataSource() });
}