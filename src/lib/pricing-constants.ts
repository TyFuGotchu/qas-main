/** Base pricing constants — no imports from tools-registry or marketing (avoids circular deps) */

export const PREMIUM_CHECKOUT_URL =
  "https://buy.stripe.com/fZufZhcWo4XY4L7727co00c";

export const PREMIUM_PRICE = "$149.99";
export const PREMIUM_PRICE_NUMBER = 149.99;

/** 3-day free trial — $0 today, then Premium Quant. Bot not included. */
export const TRIAL_DAYS = 3;
export const TRIAL_PRICE_TODAY = "$0";
export const TRIAL_LABEL = "3-Day Free Trial";

/** First month 30% off — full Premium path including Quant Protocol access request. */
export const DISCOUNT_FIRST_MONTH_PERCENT = 30;
export const DISCOUNT_FIRST_MONTH_PRICE = "$104.99";
export const DISCOUNT_FIRST_MONTH_PRICE_NUMBER = 104.99;
export const DISCOUNT_LABEL = "First Month 30% Off";

/**
 * Stripe checkout placeholders.
 * Set these env vars when the live Stripe Payment Links exist.
 * Client components can only read NEXT_PUBLIC_* values.
 *
 *   TRIAL_STRIPE_LINK                  → NEXT_PUBLIC_TRIAL_STRIPE_LINK
 *   DISCOUNT_FIRST_MONTH_STRIPE_LINK   → NEXT_PUBLIC_DISCOUNT_FIRST_MONTH_STRIPE_LINK
 */
export const TRIAL_STRIPE_LINK_ENV = "NEXT_PUBLIC_TRIAL_STRIPE_LINK";
export const DISCOUNT_FIRST_MONTH_STRIPE_LINK_ENV =
  "NEXT_PUBLIC_DISCOUNT_FIRST_MONTH_STRIPE_LINK";

export type CheckoutOffer = "trial" | "discount" | "premium";

function publicEnv(name: string): string {
  const value = process.env[name]?.trim();
  return value || "";
}

/** 3-day trial checkout. Bot is never included. Falls back to register until Stripe link is set. */
export function getTrialCheckoutUrl(): string {
  return (
    publicEnv(TRIAL_STRIPE_LINK_ENV) ||
    "/register?start=trial#TRIAL_STRIPE_LINK"
  );
}

/** First-month 30% off — full Premium path. Falls back to current Premium link until the discount link is set. */
export function getDiscountCheckoutUrl(): string {
  return publicEnv(DISCOUNT_FIRST_MONTH_STRIPE_LINK_ENV) || PREMIUM_CHECKOUT_URL;
}

export function getCheckoutUrl(offer: CheckoutOffer = "premium"): string {
  if (offer === "trial") return getTrialCheckoutUrl();
  if (offer === "discount") return getDiscountCheckoutUrl();
  return getPremiumCheckoutUrl();
}

/** $29 7-Day Challenge Kit (PDF). Set CHALLENGE_KIT_CHECKOUT_URL to a Stripe/Gumroad link. */
export const CHALLENGE_KIT_PRICE = "$29";
export const CHALLENGE_KIT_PATH = "/challenge-kit";
export const CHALLENGE_KIT_PDF = "/products/qs-7-day-challenge-kit.pdf";
export function getChallengeKitCheckoutUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_CHALLENGE_KIT_CHECKOUT_URL?.trim();
  return url || null;
}

/** Plain Stripe checkout — promo codes are no longer used. */
export function getPremiumCheckoutUrl(withPromo = false): string {
  void withPromo; // kept for call-site compatibility; promo codes removed
  return PREMIUM_CHECKOUT_URL;
}
