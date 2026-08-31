import Link from "next/link";
import { E8_BAR_LINE, E8_PARTNER_LINE, E8_PUBLIC_PATH } from "@/lib/e8-partner";

export function AnnouncementBar() {
  return (
    <Link
      href={E8_PUBLIC_PATH}
      className="block border-b border-indigo-400/20 bg-gradient-to-r from-slate-950 via-indigo-950/50 to-slate-950"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-4 py-1.5 text-center">
        <p className="font-mono text-[11px] leading-relaxed text-indigo-100 sm:text-xs">
          {E8_PARTNER_LINE}
          <span className="mx-2 text-indigo-400/50">|</span>
          {E8_BAR_LINE}
        </p>
      </div>
    </Link>
  );
}
