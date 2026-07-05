import type { Metadata } from "next";
import Link from "next/link";
import { PropFirmChallengePromo } from "@/components/marketing/PropFirmChallengePromo";
import { PremiumValueStack } from "@/components/tools/PremiumValueStack";
import { PropFirmTimeline } from "@/components/academy/PropFirmTimeline";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  PLAYBOOK_LAUNCH_FAQS,
  PLAYBOOK_LAUNCH_HERO,
  PLAYBOOK_LAUNCH_STEPS,
  PLAYBOOK_LAUNCH_SUBHERO,
  PLAYBOOK_LAUNCH_TAGLINE,
} from "@/lib/playbook-launch";
import {
  PROP_FIRM_DAY_PREVIEW,
  PROP_FIRM_PLAYBOOK_HREF,
  PROP_FIRM_PLAYBOOK_CTA,
} from "@/lib/prop-firm-challenge-marketing";
import { getPremiumCheckoutUrl, PREMIUM_PROMO_CODE } from "@/lib/pricing-constants";

export const metadata: Metadata = {
  title: "7-Day Prop Firm Playbook Launch — FIRST100 | Quicksilver",
  description:
    "Official launch: pass your prop firm challenge in 7 days with daily profit caps and consistency rules. Free preview. FIRST100 = $89.99 first month.",
  openGraph: {
    title: "Pass Your Prop Firm Challenge in 7 Days — Launch",
    description:
      "Day-by-day playbook with profit caps, 20% consistency guardrails, and Premium challenge tracker.",
  },
};

export default function PlaybookLaunchPage() {
  const premiumUrl = getPremiumCheckoutUrl(true);

  return (
    <div className="space-y-12">
      <header className="text-center">
        <Badge variant="success" className="mb-4">
          {PLAYBOOK_LAUNCH_TAGLINE}
        </Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-50 sm:text-4xl lg:text-5xl">
          {PLAYBOOK_LAUNCH_HERO}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-400">
          {PLAYBOOK_LAUNCH_SUBHERO}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href={premiumUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="lg">
              {PROP_FIRM_PLAYBOOK_CTA}
            </Button>
          </a>
          <Link href={PROP_FIRM_PLAYBOOK_HREF}>
            <Button variant="secondary" size="lg">
              Free Playbook Preview
            </Button>
          </Link>
        </div>
        <p className="mt-4 font-mono text-xs text-slate-600">
          Already have an account?{" "}
          <Link href="/dashboard/playbook" className="text-cyan-accent hover:underline">
            Open your challenge tracker →
          </Link>
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {PLAYBOOK_LAUNCH_STEPS.map((item) => (
          <div
            key={item.step}
            className="rounded-xl border border-slate-800/60 bg-slate-950/50 p-5 text-center"
          >
            <p className="font-mono text-2xl font-bold text-cyan-accent">{item.step}</p>
            <p className="mt-2 font-mono text-sm font-semibold text-slate-200">{item.title}</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{item.description}</p>
          </div>
        ))}
      </section>

      <PropFirmChallengePromo />

      <section>
        <h2 className="mb-4 text-center font-mono text-sm font-semibold uppercase tracking-widest text-slate-400">
          Your 7 sessions at a glance
        </h2>
        <PropFirmTimeline days={7} />
        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {PROP_FIRM_DAY_PREVIEW.map((day) => (
            <div
              key={day.day}
              className="rounded-lg border border-slate-800/60 bg-slate-950/40 px-3 py-3"
            >
              <p className="font-mono text-[10px] text-cyan-accent">Day {day.day}</p>
              <p className="mt-1 font-mono text-xs font-semibold text-slate-200">{day.title}</p>
              <p className="mt-2 font-mono text-[10px] text-emerald-400">Cap +{day.profitCap}%</p>
            </div>
          ))}
        </div>
      </section>

      <PremiumValueStack showToolList />

      <section>
        <h2 className="mb-6 text-center font-mono text-lg font-bold text-slate-200">
          Launch FAQ
        </h2>
        <div className="space-y-4">
          {PLAYBOOK_LAUNCH_FAQS.map((faq) => (
            <div
              key={faq.question}
              className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-5"
            >
              <h3 className="font-mono text-sm font-semibold text-slate-200">{faq.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-emerald-500/35 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 px-6 py-10 text-center">
        <h2 className="font-mono text-2xl font-bold text-emerald-100">
          Ready to run your challenge?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-emerald-200/80">
          Join the first 100 traders on the official 7-day playbook. Premium starts your tracker,
          Day 1 email, and full tool access immediately.
        </p>
        <a
          href={premiumUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block"
        >
          <Button variant="primary" size="lg">
            Claim {PREMIUM_PROMO_CODE} Launch Offer
          </Button>
        </a>
      </section>
    </div>
  );
}