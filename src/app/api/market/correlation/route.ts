import { NextResponse } from "next/server";
import { fetchCorrelationMatrix } from "@/lib/market-data/provider";

export const dynamic = "force-dynamic";

export async function GET() {
  const matrix = await fetchCorrelationMatrix();
  return NextResponse.json({ matrix, timestamp: Date.now() });
}