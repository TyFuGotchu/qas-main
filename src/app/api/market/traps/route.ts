import { NextResponse } from "next/server";
import { fetchTrapZones } from "@/lib/market-data/provider";

export const dynamic = "force-dynamic";

export async function GET() {
  const traps = await fetchTrapZones();
  return NextResponse.json({ traps, timestamp: Date.now() });
}