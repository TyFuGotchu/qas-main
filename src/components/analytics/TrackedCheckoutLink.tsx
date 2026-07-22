"use client";

import type { ReactNode } from "react";
import { trackBeginCheckout } from "@/lib/analytics/ga-events";
import { getPremiumCheckoutUrl } from "@/lib/pricing-constants";
import { cn } from "@/lib/utils";

interface TrackedCheckoutLinkProps {
  source: string;
  children: ReactNode;
  className?: string;
  withPromo?: boolean;
}

/** Stripe checkout link that fires GA4 begin_checkout (mark as Key Event in GA). */
export function TrackedCheckoutLink({
  source,
  children,
  className,
  withPromo = true,
}: TrackedCheckoutLinkProps) {
  const href = getPremiumCheckoutUrl(withPromo);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(className)}
      onClick={() => trackBeginCheckout(source)}
    >
      {children}
    </a>
  );
}
