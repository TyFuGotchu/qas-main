import Link from "next/link";
import Button from "@/components/ui/Button";
import { TrackedCheckoutLink } from "@/components/analytics/TrackedCheckoutLink";
import { E8_PUBLIC_PATH } from "@/lib/e8-partner";
import { HOME_PRICING } from "@/lib/homepage-copy";
import { TRIAL_REQUEST_COPY } from "@/lib/trial-request";

export function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-soft/20 bg-obsidian-950/95 p-3 backdrop-blur-xl md:hidden">
      <div className="flex flex-col gap-2">
        <Link href={E8_PUBLIC_PATH}>
          <Button variant="gold" size="sm" className="w-full">
            Open E8 Execution Center
          </Button>
        </Link>
        <TrackedCheckoutLink source="homepage_sticky_mobile" offer="discount" className="block">
          <Button variant="secondary" size="sm" className="w-full">
            {HOME_PRICING.discount.heroCta}
          </Button>
        </TrackedCheckoutLink>
      </div>
      <p className="mt-2 text-center font-mono text-[10px] text-slate-500">
        {TRIAL_REQUEST_COPY}
      </p>
    </div>
  );
}
