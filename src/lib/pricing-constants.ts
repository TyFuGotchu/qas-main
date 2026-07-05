/** Base pricing constants — no imports from tools-registry or marketing (avoids circular deps) */

export const PREMIUM_CHECKOUT_URL =
  "https://buy.stripe.com/fZufZhcWo4XY4L7727co00c";

export const PREMIUM_PROMO_CODE = "FIRST100";

export const PREMIUM_PROMO_STRIPE_ID = "promo_1TlzBjDUxwVQyisqks4CyIKy";

export const PREMIUM_PRICE = "$149.99";

export const PREMIUM_PROMO_DISCOUNT = "$60";

export const PREMIUM_PROMO_FIRST_MONTH = "$89.99";

export const PREMIUM_PROMO_NOTE =
  "Use code FIRST100 for $60 off your first month (first 100 users)";

export function getPremiumCheckoutUrl(withPromo = true): string {
  if (!withPromo) return PREMIUM_CHECKOUT_URL;
  const url = new URL(PREMIUM_CHECKOUT_URL);
  url.searchParams.set("prefilled_promo_code", PREMIUM_PROMO_CODE);
  return url.toString();
}