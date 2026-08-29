import Button from "@/components/ui/Button";
import { TrackedCheckoutLink } from "@/components/analytics/TrackedCheckoutLink";
import { HOME_PRICING } from "@/lib/homepage-copy";
import { cn } from "@/lib/utils";

type CtaSize = "sm" | "md" | "lg";

interface StartOfferCtasProps {
  source: string;
  size?: CtaSize;
  layout?: "row" | "stack";
  labels?: "hero" | "card";
  className?: string;
}

export function StartOfferCtas({
  source,
  size = "lg",
  layout = "row",
  labels = "hero",
  className,
}: StartOfferCtasProps) {
  const trialLabel =
    labels === "card" ? HOME_PRICING.trial.cta : HOME_PRICING.trial.heroCta;
  const discountLabel =
    labels === "card" ? HOME_PRICING.discount.cta : HOME_PRICING.discount.heroCta;

  return (
    <div
      className={cn(
        "flex items-stretch justify-center gap-3",
        layout === "stack" ? "flex-col" : "flex-col sm:flex-row sm:items-center",
        className
      )}
    >
      <TrackedCheckoutLink source={source} offer="trial">
        <Button variant="secondary" size={size} className="w-full sm:w-auto">
          {trialLabel}
        </Button>
      </TrackedCheckoutLink>
      <TrackedCheckoutLink source={source} offer="discount">
        <Button variant="gold" size={size} className="w-full sm:w-auto">
          {discountLabel}
        </Button>
      </TrackedCheckoutLink>
    </div>
  );
}
