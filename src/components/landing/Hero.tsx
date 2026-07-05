import Link from "next/link";
import Button from "@/components/ui/Button";
import { TOTAL_SEO_LANDING_PAGES } from "@/lib/seo/seo-index";
import {
  PROP_FIRM_CHALLENGE_DAYS,
  PROP_FIRM_MARKETING_HEADLINE,
  PROP_FIRM_MARKETING_SUBHEADLINE,
  PROP_FIRM_PLAYBOOK_HREF,
} from "@/lib/prop-firm-challenge-marketing";
import { PREMIUM_PROMO_CODE, PREMIUM_PROMO_FIRST_MONTH } from "@/lib/pricing-tiers";
import { Activity, BarChart3, Calendar, Shield } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-qs-header-line opacity-90" />
        <div className="absolute left-1/2 top-28 h-48 w-48 -translate-x-1/2 rounded-full border border-cyan-400/20 opacity-50" />
        <div className="absolute left-1/2 top-28 h-80 w-80 -translate-x-1/2 rounded-full border border-slate-500/10 opacity-40" />
        <div className="absolute left-1/2 top-28 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full border border-cyan-500/5 opacity-25" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-gradient-to-r from-emerald-500/10 via-slate-900/60 to-cyan-500/5 px-4 py-1.5 shadow-[0_0_32px_rgba(16,185,129,0.1),inset_0_1px_0_rgba(232,244,252,0.06)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-300">
              {PROP_FIRM_CHALLENGE_DAYS}-Day Prop Firm Playbook
            </span>
          </div>

          <h1 className="mx-auto max-w-4xl font-mono text-3xl font-bold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
            {PROP_FIRM_MARKETING_HEADLINE}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {PROP_FIRM_MARKETING_SUBHEADLINE}
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/offers">
              <Button variant="primary" size="lg">
                Get Premium — {PREMIUM_PROMO_CODE} ({PREMIUM_PROMO_FIRST_MONTH})
              </Button>
            </Link>
            <Link href={PROP_FIRM_PLAYBOOK_HREF}>
              <Button variant="secondary" size="lg">
                Preview the Playbook
              </Button>
            </Link>
          </div>
          <p className="mt-4 font-mono text-xs text-slate-500">
            <Link href="/register" className="text-cyan-accent hover:underline">
              Free account
            </Link>
            {" · "}
            <Link href="/learn" className="text-cyan-accent hover:underline">
              {TOTAL_SEO_LANDING_PAGES}+ guides
            </Link>
            {" · "}
            <Link href="/solutions" className="text-cyan-accent hover:underline">
              Free calculators
            </Link>
          </p>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Calendar,
              title: `${PROP_FIRM_CHALLENGE_DAYS}-Day Execution Plan`,
              desc: "Daily profit caps, consistency checks & session tasks",
            },
            {
              icon: BarChart3,
              title: "9 Planning Engines",
              desc: "Confluence scoring, risk matrix, prop survival & more",
            },
            {
              icon: Shield,
              title: "20% Consistency Guard",
              desc: "Never let one hero day fail your funded payout",
            },
            {
              icon: Activity,
              title: "Prop OS + Live Terminal",
              desc: "Challenge survival outlook, journal & growth dashboard",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="qs-panel-shine group rounded-xl border border-slate-700/30 bg-qs-panel p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/25 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4),0_0_40px_rgba(0,229,255,0.08)]"
            >
              <div className="mb-4 inline-flex rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-2.5 shadow-[0_0_20px_rgba(0,229,255,0.08)] transition-all group-hover:border-cyan-400/35 group-hover:shadow-[0_0_28px_rgba(0,229,255,0.15)]">
                <feature.icon className="h-6 w-6 text-cyan-300 transition-transform group-hover:scale-110" />
              </div>
              <h3 className="font-mono text-sm font-semibold text-slate-100">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}