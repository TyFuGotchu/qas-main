"use client";

import { useEffect, type HTMLAttributes } from "react";
import { STRIPE_BUY_PUBLISHABLE_KEY } from "@/lib/plans";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "stripe-buy-button": React.DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "buy-button-id": string;
        "publishable-key": string;
      };
    }
  }
}

let scriptStarted = false;

export function StripeBuyButton({ buyButtonId }: { buyButtonId: string }) {
  useEffect(() => {
    if (scriptStarted) return;
    if (document.querySelector('script[src="https://js.stripe.com/v3/buy-button.js"]')) {
      scriptStarted = true;
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/buy-button.js";
    script.async = true;
    document.body.appendChild(script);
    scriptStarted = true;
  }, []);

  return (
    <stripe-buy-button
      buy-button-id={buyButtonId}
      publishable-key={STRIPE_BUY_PUBLISHABLE_KEY}
    />
  );
}
