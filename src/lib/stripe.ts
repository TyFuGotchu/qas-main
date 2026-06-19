import Stripe from "stripe";
import { isProduction } from "@/lib/env";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      const message = "STRIPE_SECRET_KEY environment variable is not set";
      if (isProduction()) {
        throw new Error(`${message} (required in production)`);
      }
      throw new Error(message);
    }
    stripeClient = new Stripe(secretKey, {
      typescript: true,
    });
  }
  return stripeClient;
}

export function getStripeWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    const message = "STRIPE_WEBHOOK_SECRET environment variable is not set";
    if (isProduction()) {
      throw new Error(`${message} (required in production)`);
    }
    throw new Error(message);
  }
  return secret;
}