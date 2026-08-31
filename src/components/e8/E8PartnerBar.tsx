import Link from "next/link";
import { E8_BAR_LINE, E8_DASHBOARD_PATH, E8_PARTNER_LINE, E8_PUBLIC_PATH } from "@/lib/e8-partner";

export function E8PartnerBar({ href }: { href?: string }) {
  return (
    <Link
      href={href ?? E8_PUBLIC_PATH}
      className="e8-bar flex w-full items-center justify-center gap-x-3 gap-y-1 border-b px-4 py-2 text-center transition-colors hover:brightness-110"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#E4D4FF] sm:text-[11px]">
        {E8_PARTNER_LINE}
      </span>
      <span className="hidden h-3 w-px bg-[#B794FF]/40 sm:block" />
      <span className="font-mono text-[10px] text-[#C9C2D6] sm:text-[11px]">{E8_BAR_LINE}</span>
    </Link>
  );
}

export function E8DashboardPartnerBar() {
  return <E8PartnerBar href={E8_DASHBOARD_PATH} />;
}
