import { TrackedCheckoutLink } from "@/components/analytics/TrackedCheckoutLink";
import { PREMIUM_PRICE } from "@/lib/pricing-constants";

export function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cyan-500/25 bg-obsidian-950/95 p-3 backdrop-blur-xl md:hidden">
      <TrackedCheckoutLink source="homepage_sticky_mobile" className="block">
        <span className="flex w-full items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-500/15 px-4 py-3 font-mono text-sm font-semibold text-cyan-100">
          Start Premium — {PREMIUM_PRICE}/mo
        </span>
      </TrackedCheckoutLink>
    </div>
  );
}
