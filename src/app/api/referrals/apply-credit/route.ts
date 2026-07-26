import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { applyReferralCreditToStripe, formatCents } from "@/lib/referrals";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const amountCents =
    typeof body.amountCents === "number" ? body.amountCents : undefined;

  const result = await applyReferralCreditToStripe({
    userId: session.id,
    amountCents,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    appliedCents: result.appliedCents,
    appliedFormatted: formatCents(result.appliedCents ?? 0),
    message: `${formatCents(result.appliedCents ?? 0)} promotional credit applied to your Stripe balance for future Premium invoices.`,
  });
}
