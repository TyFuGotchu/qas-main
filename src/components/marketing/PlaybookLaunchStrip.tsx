import Link from "next/link";
import { Rocket } from "lucide-react";
import {
  PLAYBOOK_LAUNCH_PATH,
  PLAYBOOK_LAUNCH_TAGLINE,
} from "@/lib/playbook-launch";
import { GUARANTEE_HEADLINE } from "@/lib/money-back-guarantee";
import { PREMIUM_PROMO_CODE, PREMIUM_PROMO_FIRST_MONTH } from "@/lib/pricing-constants";

export function PlaybookLaunchStrip() {
  return (
    <div className="border-b border-emerald-500/25 bg-gradient-to-r from-emerald-500/10 via-slate-950/90 to-cyan-500/10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-2.5 text-center">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-emerald-400">
          <Rocket className="h-3.5 w-3.5" />
          Launch live
        </span>
        <p className="font-mono text-xs text-slate-300">
          {PLAYBOOK_LAUNCH_TAGLINE} — code{" "}
          <strong className="text-emerald-300">{PREMIUM_PROMO_CODE}</strong> →{" "}
          {PREMIUM_PROMO_FIRST_MONTH} first month
        </p>
        <span className="font-mono text-[10px] text-emerald-400/90">
          {GUARANTEE_HEADLINE}
        </span>
        <Link
          href={PLAYBOOK_LAUNCH_PATH}
          className="font-mono text-xs font-semibold text-cyan-accent hover:underline"
        >
          Start the 7-day challenge →
        </Link>
      </div>
    </div>
  );
}