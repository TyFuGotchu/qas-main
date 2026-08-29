"use client";

import type { ReactNode } from "react";
import { trackBeginCheckout } from "@/lib/analytics/ga-events";
import {
  type CheckoutOffer,
  DISCOUNT_FIRST_MONTH_PRICE_NUMBER,
  getCheckoutUrl,
  PREMIUM_PRICE_NUMBER,
} from "@/lib/pricing-constants";
import { cn } from "@/lib/utils";

interface TrackedCheckoutLinkProps {
  source: string;
  children: ReactNode;
  className?: string;
  withPromo?: boolean;
  offer?: CheckoutOffer;
}

/** Stripe checkout link that fires GA4 begin_checkout (mark as Key Event in GA). */
export function TrackedCheckoutLink({
  source,
  children,
  className,
  withPromo = true,
  offer = "premium",
}: TrackedCheckoutLinkProps) {
  void withPromo;
  const href = getCheckoutUrl(offer);
  const value =
    offer === "trial"
      ? 0
      : offer === "discount"
        ? DISCOUNT_FIRST_MONTH_PRICE_NUMBER
        : PREMIUM_PRICE_NUMBER;

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={cn(className)}
      onClick={() => trackBeginCheckout(`${source}_${offer}`, value)}
    >
      {children}
    </a>
  );
}
