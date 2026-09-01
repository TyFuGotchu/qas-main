import { E8AffiliateLink } from "@/components/e8/E8AffiliateLink";
import { E8_BAR_LINE, E8_PARTNER_LINE } from "@/lib/e8-partner";

export function AnnouncementBar() {
  return (
    <E8AffiliateLink className="e8-bar block border-b">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-4 py-1.5 text-center">
        <p className="font-mono text-[11px] leading-relaxed text-[#E4D4FF] sm:text-xs">
          {E8_PARTNER_LINE}
          <span className="mx-2 text-[#B794FF]/40">|</span>
          {E8_BAR_LINE}
        </p>
      </div>
    </E8AffiliateLink>
  );
}
