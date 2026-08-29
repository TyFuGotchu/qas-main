import Link from "next/link";
import { E8_BAR_LINE, E8_DASHBOARD_PATH, E8_PARTNER_LINE, E8_PUBLIC_PATH } from "@/lib/e8-partner";

export function E8PartnerBar({ href }: { href?: string }) {
  return (
    <Link
      href={href ?? E8_PUBLIC_PATH}
      className="flex w-full items-center justify-center gap-x-3 gap-y-1 border-b border-indigo-400/20 bg-indigo-950/40 px-4 py-2 text-center transition-colors hover:bg-indigo-950/60"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-indigo-200 sm:text-[11px]">
        {E8_PARTNER_LINE}
      </span>
      <span className="hidden h-3 w-px bg-indigo-400/30 sm:block" />
      <span className="font-mono text-[10px] text-slate-300 sm:text-[11px]">{E8_BAR_LINE}</span>
    </Link>
  );
}

export function E8DashboardPartnerBar() {
  return <E8PartnerBar href={E8_DASHBOARD_PATH} />;
}
