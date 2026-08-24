import Link from "next/link";
import { HOME_ANNOUNCEMENT } from "@/lib/homepage-copy";
import { PREMIUM_PRICE } from "@/lib/pricing-constants";

export function AnnouncementBar() {
  return (
    <div className="border-b border-cyan-500/20 bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 text-center">
        <p className="font-mono text-[11px] leading-relaxed text-slate-300 sm:text-xs">
          {HOME_ANNOUNCEMENT}
        </p>
        <Link
          href="/register"
          className="font-mono text-[11px] font-semibold text-cyan-accent hover:underline sm:text-xs"
        >
          Start Premium — {PREMIUM_PRICE}/mo →
        </Link>
      </div>
    </div>
  );
}
