import { NextResponse } from "next/server";
import { getFreshSession } from "@/lib/access-control";

export async function POST() {
  const user = await getFreshSession();

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}