import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { getTierFromStripePriceId } from "@/lib/stripe-tiers";
import type { AccountTier } from "@/types";

export interface TierSyncResult {
  success: boolean;
  email: string;
  priceId: string | null;
  accountTier: AccountTier | null;
  userId?: string;
  message: string;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function syncUserTierFromStripePriceId(params: {
  email: string;
  priceId: string | null;
  stripeCustomerId?: string | null;
  stripeSessionId?: string | null;
}): Promise<TierSyncResult> {
  const email = normalizeEmail(params.email);

  if (!params.priceId) {
    return {
      success: false,
      email,
      priceId: null,
      accountTier: null,
      message: "No Stripe price ID found on checkout session",
    };
  }

  const accountTier = getTierFromStripePriceId(params.priceId);

  if (!accountTier) {
    return {
      success: false,
      email,
      priceId: params.priceId,
      accountTier: null,
      message: `Unmapped Stripe price ID: ${params.priceId}`,
    };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      success: false,
      email,
      priceId: params.priceId,
      accountTier,
      message: `No registered user found for email: ${email}`,
    };
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      accountTier,
      onboardingComplete: true,
      stripeCustomerId: params.stripeCustomerId ?? user.stripeCustomerId,
      stripePriceId: params.priceId,
      stripeSessionId: params.stripeSessionId ?? user.stripeSessionId,
    },
  });

  return {
    success: true,
    email,
    priceId: params.priceId,
    accountTier: updatedUser.accountTier as AccountTier,
    userId: updatedUser.id,
    message: `User tier updated to ${updatedUser.accountTier}`,
  };
}

export async function extractPriceIdFromCheckoutSession(
  session: Stripe.Checkout.Session
): Promise<string | null> {
  if (session.metadata?.price_id) {
    return session.metadata.price_id;
  }

  if (session.metadata?.stripe_price_id) {
    return session.metadata.stripe_price_id;
  }

  const lineItems = session.line_items?.data;
  if (lineItems && lineItems.length > 0) {
    const firstItem = lineItems[0];
    if (typeof firstItem.price === "object" && firstItem.price?.id) {
      return firstItem.price.id;
    }
    if (typeof firstItem.price === "string") {
      return firstItem.price;
    }
  }

  if (session.amount_total !== null && session.currency) {
    const stripe = getStripe();
    const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items.data.price"],
    });

    const expandedItems = expandedSession.line_items?.data ?? [];
    if (expandedItems.length > 0) {
      const price = expandedItems[0].price;
      if (typeof price === "object" && price?.id) {
        return price.id;
      }
      if (typeof price === "string") {
        return price;
      }
    }
  }

  return null;
}

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<TierSyncResult> {
  const email =
    session.customer_details?.email ??
    session.customer_email ??
    null;

  if (!email) {
    return {
      success: false,
      email: "",
      priceId: null,
      accountTier: null,
      message: "Checkout session missing customer email",
    };
  }

  const stripe = getStripe();
  const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items.data.price"],
  });

  const priceId = await extractPriceIdFromCheckoutSession(expandedSession);

  const customerId =
    typeof expandedSession.customer === "string"
      ? expandedSession.customer
      : expandedSession.customer?.id ?? null;

  return syncUserTierFromStripePriceId({
    email,
    priceId,
    stripeCustomerId: customerId,
    stripeSessionId: expandedSession.id,
  });
}

export async function recordStripeWebhookEvent(eventId: string, type: string) {
  await prisma.stripeWebhookEvent.create({
    data: {
      id: eventId,
      type,
    },
  });
}

export async function hasProcessedStripeWebhookEvent(
  eventId: string
): Promise<boolean> {
  const existing = await prisma.stripeWebhookEvent.findUnique({
    where: { id: eventId },
  });
  return Boolean(existing);
}