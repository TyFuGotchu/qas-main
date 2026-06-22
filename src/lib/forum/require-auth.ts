import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import type { UserSession } from "@/types";

export async function requireForumSession(): Promise<
  { session: UserSession; error: null } | { session: null; error: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session, error: null };
}