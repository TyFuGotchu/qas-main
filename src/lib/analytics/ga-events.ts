type GaEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackGaEvent(eventName: string, params?: GaEventParams): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, params);
}

/** Mark as Key Event in GA4: begin_checkout */
export function trackBeginCheckout(source: string): void {
  trackGaEvent("begin_checkout", {
    currency: "USD",
    value: 149.99,
    source,
  });
}

/** Mark as Key Event in GA4: sign_up */
export function trackSignUp(method: string): void {
  trackGaEvent("sign_up", { method });
}

/** Mark as Key Event in GA4: login */
export function trackLogin(method: string): void {
  trackGaEvent("login", { method });
}

export function trackViewQuantProtocol(source: string): void {
  trackGaEvent("view_quant_protocol", { source });
}

export function trackSelectContent(contentType: string, itemId: string): void {
  trackGaEvent("select_content", {
    content_type: contentType,
    item_id: itemId,
  });
}
