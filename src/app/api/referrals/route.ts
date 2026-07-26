import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ensureUserReferralCode,
  formatCents,
  getReferralShareUrl,
  REFERRAL_HOLD_DAYS,
  REFERRAL_PAYPAL_MIN_CENTS,
  REFERRAL_REWARD_CENTS,
  unlockMaturedRewards,
} from "@/lib/referrals";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const code = await ensureUserReferralCode(session.id);
  await unlockMaturedRewards(session.id);

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      referralCreditCents: true,
      paypalEmail: true,
      referralCode: true,
    },
  });

  const [rewards, payouts, referredCount, paidCount] = await Promise.all([
    prisma.referralReward.findMany({
      where: { referrerId: session.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        referredUser: { select: { email: true, name: true, createdAt: true } },
      },
    }),
    prisma.referralPayoutRequest.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.user.count({ where: { referredById: session.id } }),
    prisma.referralReward.count({
      where: {
        referrerId: session.id,
        status: { not: "clawed_back" },
      },
    }),
  ]);

  const pendingCents = rewards
    .filter((r) => r.status === "pending")
    .reduce((s, r) => s + r.amountCents, 0);

  return NextResponse.json({
    code: user?.referralCode ?? code,
    shareUrl: getReferralShareUrl(user?.referralCode ?? code),
    creditCents: user?.referralCreditCents ?? 0,
    creditFormatted: formatCents(user?.referralCreditCents ?? 0),
    pendingCents,
    pendingFormatted: formatCents(pendingCents),
    paypalEmail: user?.paypalEmail ?? null,
    stats: {
      invites: referredCount,
      paidReferrals: paidCount,
    },
    config: {
      rewardCents: REFERRAL_REWARD_CENTS,
      rewardFormatted: formatCents(REFERRAL_REWARD_CENTS),
      holdDays: REFERRAL_HOLD_DAYS,
      paypalMinCents: REFERRAL_PAYPAL_MIN_CENTS,
      paypalMinFormatted: formatCents(REFERRAL_PAYPAL_MIN_CENTS),
    },
    rewards: rewards.map((r) => ({
      id: r.id,
      amountCents: r.amountCents,
      status: r.status,
      availableAt: r.availableAt,
      createdAt: r.createdAt,
      referredEmail: maskEmail(r.referredUser.email),
    })),
    payouts: payouts.map((p) => ({
      id: p.id,
      amountCents: p.amountCents,
      status: p.status,
      paypalEmail: p.paypalEmail,
      createdAt: p.createdAt,
      processedAt: p.processedAt,
    })),
  });
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  const shown = local.slice(0, 2);
  return `${shown}***@${domain}`;
}
