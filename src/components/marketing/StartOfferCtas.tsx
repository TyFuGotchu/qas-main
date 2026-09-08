import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

type CtaSize = "sm" | "md" | "lg";

interface StartOfferCtasProps {
  source: string;
  size?: CtaSize;
  layout?: "row" | "stack";
  className?: string;
  premiumOnly?: boolean;
}

export function StartOfferCtas({
  size = "lg",
  layout = "row",
  className,
}: StartOfferCtasProps) {
  return (
    <div
      className={cn(
        "flex items-stretch justify-center gap-3",
        layout === "stack" ? "flex-col" : "flex-col sm:flex-row sm:items-center",
        className
      )}
    >
      <Link href="/pricing">
        <Button variant="gold" size={size} className="w-full sm:w-auto">
          Pricing — $39.99 / $99 / $119.99
        </Button>
      </Link>
    </div>
  );
}
