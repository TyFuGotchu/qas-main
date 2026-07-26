import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { requestPaypalPayout } from "@/lib/referrals";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const paypalEmail =
    typeof body.paypalEmail === "string" ? body.paypalEmail : "";
  const amountCents =
    typeof body.amountCents === "number" ? body.amountCents : undefined;

  const result = await requestPaypalPayout({
    userId: session.id,
    paypalEmail,
    amountCents,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    requestId: result.requestId,
    message:
      "PayPal request submitted. Our team will process manual promotional goodwill payouts after review. Premium credit remains the default and recommended option.",
  });
}
