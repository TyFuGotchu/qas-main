type GaEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackGaEvent(
  eventName: string,
  params?: GaEventParams
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, params);
}

export function trackBeginCheckout(source: string): void {
  trackGaEvent("begin_checkout", {
    currency: "USD",
    value: 89.99,
    coupon: "FIRST100",
    source,
  });
}

export function trackSignUp(method: string): void {
  trackGaEvent("sign_up", { method });
}