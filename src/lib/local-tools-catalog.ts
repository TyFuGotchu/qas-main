/** Standalone local trading tools — Stripe checkout + Premium bundle inclusion */

export const LOCAL_TOOL_STRIPE = {
  "expectancy-validator": "https://buy.stripe.com/28EcN509C9ee1yV3PVco00d",
  "atr-pip-range": "https://buy.stripe.com/cNifZhe0s4XYb9v9afco00e",
  "compounding-matrix": "https://buy.stripe.com/00waEX3lOduu7Xj2LRco00f",
} as const;

export type LocalToolSlug = keyof typeof LOCAL_TOOL_STRIPE;

export const LOCAL_TOOL_PRICES: Record<LocalToolSlug, string> = {
  "expectancy-validator": "$6.99",
  "atr-pip-range": "$12.99",
  "compounding-matrix": "$14.99",
};

export function isLocalToolSlug(slug: string): slug is LocalToolSlug {
  return slug in LOCAL_TOOL_STRIPE;
}

export function getLocalToolStripeUrl(slug: LocalToolSlug): string {
  return LOCAL_TOOL_STRIPE[slug];
}