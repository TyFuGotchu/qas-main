import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { isPremiumTier } from "@/lib/tiers";
import type { AccountTier } from "@/types";

/** $5 promotional Premium credit per paid referred member */
export const REFERRAL_REWARD_CENTS = 500;

/** Hold before credit unlocks (refund window buffer) */
export const REFERRAL_HOLD_DAYS = 7;

/**
 * Minimum promotional credit to request a manual PayPal cash-out.
 * Keeps small rewards as in-app credit (safer; no routine tax ops).
 */
export const REFERRAL_PAYPAL_MIN_CENTS = 2500;

/** Soft cap: max unlocked rewards per referrer per calendar month */
export const REFERRAL_MAX_REWARDS_PER_MONTH = 20;

export const REFERRAL_COOKIE = "qs_ref";
export const REFERRAL_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://quicksilveralgo.com";

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function getReferralShareUrl(code: string): string {
  const base = SITE_URL.replace(/\/$/, "");
  return `${base}/register?ref=${encodeURIComponent(code)}`;
}

export function generateReferralCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

export async function ensureUserReferralCode(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true },
  });
  if (user?.referralCode) return user.referralCode;

  for (let attempt = 0; attempt < 8; attempt++) {
    const code = generateReferralCode();
    try {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: { referralCode: code },
        select: { referralCode: true },
      });
      if (updated.referralCode) return updated.referralCode;
    } catch {
      // unique collision — retry
    }
  }
  throw new Error("Could not allocate referral code");
}

export async function resolveReferrerIdByCode(
  code: string | null | undefined
): Promise<string | null> {
  if (!code || typeof code !== "string") return null;
  const normalized = code.trim().toUpperCase();
  if (normalized.length < 4 || normalized.length > 16) return null;

  const referrer = await prisma.user.findFirst({
    where: { referralCode: { equals: normalized, mode: "insensitive" } },
    select: { id: true },
  });
  return referrer?.id ?? null;
}

/**
 * Unlock pending rewards past hold date into referralCreditCents.
 */
export async function unlockMaturedRewards(userId: string): Promise<number> {
  const now = new Date();
  const matured = await prisma.referralReward.findMany({
    where: {
      referrerId: userId,
      status: "pending",
      availableAt: { lte: now },
    },
  });

  let unlockedCents = 0;
  for (const reward of matured) {
    await prisma.$transaction(async (tx) => {
      const updated = await tx.referralReward.updateMany({
        where: { id: reward.id, status: "pending" },
        data: { status: "available", unlockedAt: now },
      });
      if (updated.count === 0) return;
      await tx.user.update({
        where: { id: userId },
        data: { referralCreditCents: { increment: reward.amountCents } },
      });
      unlockedCents += reward.amountCents;
    });
  }
  return unlockedCents;
}

/**
 * Create a pending $5 reward when a referred user first becomes paid Premium.
 * Safe to call multiple times — one reward per referred user.
 */
export async function awardReferralOnPaidPremium(params: {
  paidUserId: string;
  stripeSessionId?: string | null;
}): Promise<{ awarded: boolean; reason: string }> {
  const paidUser = await prisma.user.findUnique({
    where: { id: params.paidUserId },
    select: {
      id: true,
      email: true,
      referredById: true,
      accountTier: true,
    },
  });

  if (!paidUser?.referredById) {
    return { awarded: false, reason: "no_referrer" };
  }

  if (paidUser.referredById === paidUser.id) {
    return { awarded: false, reason: "self_referral" };
  }

  if (!isPremiumTier(paidUser.accountTier as AccountTier)) {
    return { awarded: false, reason: "not_premium" };
  }

  const existing = await prisma.referralReward.findUnique({
    where: { referredUserId: paidUser.id },
  });
  if (existing) {
    return { awarded: false, reason: "already_awarded" };
  }

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const monthCount = await prisma.referralReward.count({
    where: {
      referrerId: paidUser.referredById,
      createdAt: { gte: monthStart },
      status: { not: "clawed_back" },
    },
  });

  if (monthCount >= REFERRAL_MAX_REWARDS_PER_MONTH) {
    return { awarded: false, reason: "monthly_cap" };
  }

  const referrer = await prisma.user.findUnique({
    where: { id: paidUser.referredById },
    select: { id: true, email: true },
  });
  if (!referrer) {
    return { awarded: false, reason: "referrer_missing" };
  }

  // Same email domain self-farm heuristic (optional soft block for exact same email only)
  if (referrer.email.toLowerCase() === paidUser.email.toLowerCase()) {
    return { awarded: false, reason: "same_email" };
  }

  const availableAt = new Date();
  availableAt.setDate(availableAt.getDate() + REFERRAL_HOLD_DAYS);

  await prisma.referralReward.create({
    data: {
      referrerId: referrer.id,
      referredUserId: paidUser.id,
      amountCents: REFERRAL_REWARD_CENTS,
      status: "pending",
      availableAt,
      stripeSessionId: params.stripeSessionId ?? null,
      note: "Promotional Premium credit — paid referred member",
    },
  });

  return { awarded: true, reason: "created" };
}

/**
 * Apply promotional credit to Stripe customer balance (future invoices).
 * Not a contractor payment — billing credit only.
 */
export async function applyReferralCreditToStripe(params: {
  userId: string;
  amountCents?: number;
}): Promise<{ ok: boolean; error?: string; appliedCents?: number }> {
  await unlockMaturedRewards(params.userId);

  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: {
      id: true,
      referralCreditCents: true,
      stripeCustomerId: true,
      email: true,
    },
  });

  if (!user) return { ok: false, error: "User not found" };
  if (user.referralCreditCents <= 0) {
    return { ok: false, error: "No promotional credit available" };
  }
  if (!user.stripeCustomerId) {
    return {
      ok: false,
      error:
        "No Stripe customer on file yet. Subscribe to Premium once, then apply credit to your next invoice — or keep credit until then.",
    };
  }

  const amount = Math.min(
    params.amountCents ?? user.referralCreditCents,
    user.referralCreditCents
  );
  if (amount <= 0) return { ok: false, error: "Invalid amount" };

  try {
    const stripe = getStripe();
    // Negative amount on customer balance = credit toward future invoices
    await stripe.customers.createBalanceTransaction(user.stripeCustomerId, {
      amount: -amount,
      currency: "usd",
      description: "Quicksilver referral promotional credit",
      metadata: {
        type: "referral_promo_credit",
        user_id: user.id,
      },
    });
  } catch (err) {
    console.error("[referrals] Stripe balance credit failed:", err);
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Could not apply credit in Stripe",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: { referralCreditCents: { decrement: amount } },
    });

    const available = await tx.referralReward.findMany({
      where: { referrerId: user.id, status: "available" },
      orderBy: { createdAt: "asc" },
    });

    let remaining = amount;
    for (const reward of available) {
      if (remaining <= 0) break;
      if (reward.amountCents <= remaining) {
        await tx.referralReward.update({
          where: { id: reward.id },
          data: { status: "applied_to_premium", appliedAt: new Date() },
        });
        remaining -= reward.amountCents;
      }
    }
  });

  return { ok: true, appliedCents: amount };
}

export async function requestPaypalPayout(params: {
  userId: string;
  paypalEmail: string;
  amountCents?: number;
}): Promise<{ ok: boolean; error?: string; requestId?: string }> {
  await unlockMaturedRewards(params.userId);

  const email = params.paypalEmail.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Valid PayPal email required" };
  }

  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: { id: true, referralCreditCents: true },
  });
  if (!user) return { ok: false, error: "User not found" };

  if (user.referralCreditCents < REFERRAL_PAYPAL_MIN_CENTS) {
    return {
      ok: false,
      error: `PayPal cash-out requires at least ${formatCents(REFERRAL_PAYPAL_MIN_CENTS)} in promotional credit. Until then, apply credit toward Premium (recommended).`,
    };
  }

  const pending = await prisma.referralPayoutRequest.findFirst({
    where: { userId: user.id, status: "pending" },
  });
  if (pending) {
    return {
      ok: false,
      error: "You already have a pending PayPal request. Wait for admin processing.",
    };
  }

  const amount = Math.min(
    params.amountCents ?? user.referralCreditCents,
    user.referralCreditCents
  );
  if (amount < REFERRAL_PAYPAL_MIN_CENTS) {
    return {
      ok: false,
      error: `Minimum cash-out is ${formatCents(REFERRAL_PAYPAL_MIN_CENTS)}`,
    };
  }

  const request = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: {
        referralCreditCents: { decrement: amount },
        paypalEmail: email,
      },
    });
    return tx.referralPayoutRequest.create({
      data: {
        userId: user.id,
        amountCents: amount,
        paypalEmail: email,
        status: "pending",
      },
    });
  });

  return { ok: true, requestId: request.id };
}
