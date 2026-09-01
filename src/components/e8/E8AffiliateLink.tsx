import type { ReactNode } from "react";
import { getE8ReferralUrl } from "@/lib/e8-partner";

export function E8AffiliateLink({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={getE8ReferralUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
