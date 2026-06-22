import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FadedPreviewProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps truncated SEO preview content with a gradient fade-out mask.
 * Unauthenticated and lower-tier visitors see the teaser; full content sits behind the CTA.
 */
export function FadedPreview({ children, className }: FadedPreviewProps) {
  return (
    <div
      className={cn("relative max-h-[28rem] overflow-hidden", className)}
      style={{
        maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
      }}
    >
      {children}
    </div>
  );
}