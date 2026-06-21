import { NextResponse } from "next/server";
import { fetchSessions } from "@/lib/market-data/provider";

export const dynamic = "force-dynamic";

export async function GET() {
  const sessions = await fetchSessions();
  return NextResponse.json(sessions);
}