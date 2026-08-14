/** Base pricing constants — no imports from tools-registry or marketing (avoids circular deps) */

export const PREMIUM_CHECKOUT_URL =
  "https://buy.stripe.com/fZufZhcWo4XY4L7727co00c";

export const PREMIUM_PRICE = "$149.99";

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
