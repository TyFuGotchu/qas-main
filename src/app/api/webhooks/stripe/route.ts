import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { validateStripeWebhookEnv } from "@/lib/env";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe";
import {
  handleCheckoutSessionCompleted,
  hasProcessedStripeWebhookEvent,
  recordStripeWebhookEvent,
  syncUserTierFromStripePriceId,
} from "@/lib/stripe-sync";

export const runtime = "nodejs";

function misconfigurationResponse(message: string): NextResponse {
  console.error("[stripe-webhook] Configuration error:", message);
  return NextResponse.json(
    { error: "Stripe webhook misconfigured", message },
    { status: 503 }
  );
}

export async function POST(request: NextRequest) {
  const envCheck = validateStripeWebhookEnv();
  if (!envCheck.valid && envCheck.message) {
    return misconfigurationResponse(envCheck.message);
  }

  let stripe: Stripe;
  let webhookSecret: string;

  try {
    stripe = getStripe();
    webhookSecret = getStripeWebhookSecret();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Stripe environment variables are not configured";
    return misconfigurationResponse(message);
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Webhook signature verification failed";
    console.error("[stripe-webhook] Verification error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const alreadyProcessed = await hasProcessedStripeWebhookEvent(event.id);
    if (alreadyProcessed) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    let syncMessage = "Event received";

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const result = await handleCheckoutSessionCompleted(session);
        syncMessage = result.message;

        if (!result.success) {
          console.warn("[stripe-webhook] Checkout sync warning:", result);
        } else {
          console.log("[stripe-webhook] Checkout sync success:", result);
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price?.id ?? null;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id;

        if (customerId && priceId) {
          const customer = await stripe.customers.retrieve(customerId);
          if (!customer.deleted && customer.email) {
            const result = await syncUserTierFromStripePriceId({
              email: customer.email,
              priceId,
              stripeCustomerId: customerId,
            });
            syncMessage = result.message;
          }
        }
        break;
      }

      default:
        syncMessage = `Unhandled event type: ${event.type}`;
    }

    await recordStripeWebhookEvent(event.id, event.type);

    return NextResponse.json({
      received: true,
      type: event.type,
      message: syncMessage,
    });
  } catch (error) {
    console.error("[stripe-webhook] Handler error:", error);
    const message =
      error instanceof Error ? error.message : "Webhook processing failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}