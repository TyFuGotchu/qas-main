import Link from "next/link";
import { E8_BAR_LINE, E8_PARTNER_LINE, E8_PUBLIC_PATH } from "@/lib/e8-partner";

export function AnnouncementBar() {
  return (
    <Link
      href={E8_PUBLIC_PATH}
      className="block border-b border-white/[0.08] bg-[#07080C]"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-4 py-1.5 text-center">
        <p className="font-mono text-[11px] leading-relaxed text-[#B7B0D4] sm:text-xs">
          {E8_PARTNER_LINE}
          <span className="mx-2 text-white/20">|</span>
          {E8_BAR_LINE}
        </p>
      </div>
    </Link>
  );
}
