import type { Metadata } from "next";
import Link from "next/link";
import { PropFirmChallengePromo } from "@/components/marketing/PropFirmChallengePromo";
import { PremiumValueStack } from "@/components/tools/PremiumValueStack";
import { PropFirmTimeline } from "@/components/academy/PropFirmTimeline";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
  PLAYBOOK_LAUNCH_FAQS,
  PLAYBOOK_LAUNCH_HERO,
  PLAYBOOK_LAUNCH_PATH,
  PLAYBOOK_LAUNCH_STEPS,
  PLAYBOOK_LAUNCH_SUBHERO,
  PLAYBOOK_LAUNCH_TAGLINE,
} from "@/lib/playbook-launch";
import {
  PROP_FIRM_DAY_PREVIEW,
  PROP_FIRM_PLAYBOOK_HREF,
  PROP_FIRM_PLAYBOOK_CTA,
} from "@/lib/prop-firm-challenge-marketing";
import { PremiumEverythingIncluded } from "@/components/marketing/PremiumEverythingIncluded";
import {
  getPremiumCheckoutUrl,
  PREMIUM_PRICE,
} from "@/lib/pricing-constants";
import { rankingPageMetadata, SEO_CONTENT_REFRESHED } from "@/lib/seo/page-metadata";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  howToJsonLd,
  subscriptionProductJsonLd,
} from "@/lib/seo/json-ld";
import { AuthorityCrossLinks } from "@/components/seo/AuthorityCrossLinks";

export const metadata: Metadata = rankingPageMetadata({
  title: "How to Pass a Prop Firm Challenge in 7 Days | Playbook",
  description:
    "Step-by-step 7-day prop firm challenge plan: daily profit caps, 20% consistency rule, risk limits for FTMO & funded accounts. Free preview + Premium tracker.",
  path: PLAYBOOK_LAUNCH_PATH,
  modifiedAt: SEO_CONTENT_REFRESHED,
  keywords: [
    "pass prop firm challenge in 7 days",
    "prop firm consistency rule",
    "FTMO challenge plan",
    "7 day prop firm playbook",
    "prop firm profit target",
  ],
});

export default function PlaybookLaunchPage() {
  const premiumUrl = getPremiumCheckoutUrl();
  const priceNum = Number.parseFloat(PREMIUM_PRICE.replace(/[^0-9.]/g, "")) || 149.99;

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "7-Day Prop Firm Playbook", path: PLAYBOOK_LAUNCH_PATH },
    ]),
    howToJsonLd({
      name: "How to Pass a Prop Firm Challenge in 7 Days",
      description:
        "Use daily profit caps, consistency math, and risk limits to pass a prop firm challenge in one week.",
      path: PLAYBOOK_LAUNCH_PATH,
      totalTime: "P7D",
      steps: PLAYBOOK_LAUNCH_STEPS.map((s) => ({
        name: s.title,
        text: s.description,
      })),
    }),
    faqJsonLd([...PLAYBOOK_LAUNCH_FAQS]),
    subscriptionProductJsonLd({
      name: "7-Day Prop Firm Playbook — Premium Quant",
      description:
        "Day-by-day prop firm challenge tracker, consistency rules, and full Quicksilver Premium stack.",
      path: PLAYBOOK_LAUNCH_PATH,
      price: priceNum,
      checkoutUrl: premiumUrl,
      category: "FinanceApplication",
      datePublished: SEO_CONTENT_REFRESHED,
    }),
  ];

  return (
    <div className="space-y-12">
      <JsonLdScript data={jsonLd} />
      <header className="text-center">
        <Badge variant="success" className="mb-4">
          {PLAYBOOK_LAUNCH_TAGLINE}
        </Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-50 sm:text-4xl lg:text-5xl">
          How to Pass a Prop Firm Challenge in 7 Days
        </h1>
        <p className="mx-auto mt-3 max-w-2xl font-mono text-sm text-cyan-400/90">
          {PLAYBOOK_LAUNCH_HERO}
        </p>
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
          <Link href="/e8">
            <Button variant="ghost" size="lg">
              E8 Execution Center
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

      <PremiumEverythingIncluded showGuarantee={false} className="!py-0 !px-0" />

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
          Join the traders on the official 7-day playbook. Premium starts your tracker,
          Day 1 email, and full tool access immediately — {PREMIUM_PRICE}/mo.
        </p>
        <a
          href={premiumUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block"
        >
          <Button variant="primary" size="lg">
            Get Premium Quant
          </Button>
        </a>
      </section>

      <AuthorityCrossLinks currentPath={PLAYBOOK_LAUNCH_PATH} />
    </div>
  );
}