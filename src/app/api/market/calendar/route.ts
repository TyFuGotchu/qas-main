import { NextResponse } from "next/server";
import { fetchMacroCalendar } from "@/lib/market-data/provider";

export const dynamic = "force-dynamic";

export async function GET() {
  const events = await fetchMacroCalendar();
  return NextResponse.json({ events });
}