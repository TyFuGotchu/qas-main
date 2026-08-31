import Button from "@/components/ui/Button";
import { TrackedCheckoutLink } from "@/components/analytics/TrackedCheckoutLink";
import { HOME_PRICING } from "@/lib/homepage-copy";
import { TRIAL_REQUEST_CTA, getTrialRequestMailto } from "@/lib/trial-request";
import { cn } from "@/lib/utils";

type CtaSize = "sm" | "md" | "lg";

interface StartOfferCtasProps {
  source: string;
  size?: CtaSize;
  layout?: "row" | "stack";
  className?: string;
  /** When true, only the Premium checkout (no trial request). */
  premiumOnly?: boolean;
}

export function StartOfferCtas({
  source,
  size = "lg",
  layout = "row",
  className,
  premiumOnly = false,
}: StartOfferCtasProps) {
  return (
    <div
      className={cn(
        "flex items-stretch justify-center gap-3",
        layout === "stack" ? "flex-col" : "flex-col sm:flex-row sm:items-center",
        className
      )}
    >
      <TrackedCheckoutLink source={source} offer="discount">
        <Button variant="gold" size={size} className="w-full sm:w-auto">
          {HOME_PRICING.discount.heroCta}
        </Button>
      </TrackedCheckoutLink>
      {!premiumOnly && (
        <a href={getTrialRequestMailto()}>
          <Button variant="ghost" size={size} className="w-full sm:w-auto">
            {TRIAL_REQUEST_CTA}
          </Button>
        </a>
      )}
    </div>
  );
}
