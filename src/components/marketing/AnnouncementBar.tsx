import Link from "next/link";
import { HOME_ANNOUNCEMENT } from "@/lib/homepage-copy";

export function AnnouncementBar() {
  return (
    <div className="border-b border-indigo-400/20 bg-gradient-to-r from-slate-950 via-indigo-950/50 to-slate-950">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 text-center">
        <p className="font-mono text-[11px] leading-relaxed text-slate-300 sm:text-xs">
          {HOME_ANNOUNCEMENT}
        </p>
        <Link
          href="/e8"
          className="font-mono text-[11px] font-semibold text-indigo-300 hover:underline sm:text-xs"
        >
          E8 Execution Center →
        </Link>
      </div>
    </div>
  );
}
