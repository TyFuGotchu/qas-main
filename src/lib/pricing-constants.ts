/** Base pricing constants — no imports from tools-registry or marketing (avoids circular deps) */

export const PREMIUM_CHECKOUT_URL =
  "https://buy.stripe.com/fZufZhcWo4XY4L7727co00c";

export const PREMIUM_PRICE = "$149.99";

/** Plain Stripe checkout — promo codes are no longer used. */
export function getPremiumCheckoutUrl(withPromo = false): string {
  void withPromo; // kept for call-site compatibility; promo codes removed
  return PREMIUM_CHECKOUT_URL;
}
