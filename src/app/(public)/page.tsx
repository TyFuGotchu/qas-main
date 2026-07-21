import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/landing/Hero";
import { ProbabilitySimulator } from "@/components/landing/ProbabilitySimulator";
import { Stats } from "@/components/landing/Stats";
import { RecommendedBrokerCard } from "@/components/broker/RecommendedBrokerCard";
import Button from "@/components/ui/Button";
import { ConversionHeroDemo } from "@/components/engagement/ConversionHeroDemo";
import { LearningPathTracker } from "@/components/engagement/LearningPathTracker";
import { PropFirmChallengePromo } from "@/components/marketing/PropFirmChallengePromo";
import { LocalToolsPromo } from "@/components/tools/LocalToolsPromo";
import { PremiumEverythingIncluded } from "@/components/marketing/PremiumEverythingIncluded";
import { PremiumValueStack } from "@/components/tools/PremiumValueStack";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
  organizationJsonLd,
  websiteJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo/json-ld";
import { rankingPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = rankingPageMetadata({
  title: "Pass Prop Firm Challenges in 7 Days | Quicksilver Algo",
  description:
    "7-Day Prop Firm Playbook, risk & consistency tools, Chart Academy, and TradeLocker Quant Protocol. Free demos for manual traders. FIRST100 first month.",
  path: "/",
  keywords: [
    "prop firm challenge playbook",
    "pass prop firm challenge",
    "FTMO challenge plan",
    "prop firm consistency rule",
    "trading risk calculator",
    "break of structure",
  ],
});

const SEO_HUB_LINKS = [
  {
    href: "/guides/break-of-structure",
    title: "Break of Structure (BOS)",
    body: "What BOS means in trading, BOS vs liquidity sweeps, and how to trade the retest.",
  },
  {
    href: "/quant-protocol",
    title: "Quicksilver Quant Protocol",
    body: "TradeLocker bot access via Premium — plus playbook, tools, and academy.",
  },
  {
    href: "/launch",
    title: "7-Day Prop Firm Playbook",
    body: "Day-by-day challenge plan with consistency rules and FIRST100 pricing.",
  },
  {
    href: "/prop-firm",
    title: "Prop Firm Authority Hub",
    body: "Long-tail guides for FTMO, FundedNext, Apex, Topstep, and more.",
  },
  {
    href: "/tools",
    title: "Trading Tools",
    body: "Risk Matrix, Prop Survival, Edge Confluence, and free local calculators.",
  },
  {
    href: "/lessons",
    title: "Chart Academy Lessons",
    body: "Market structure, candlesticks, Fibonacci, and prop firm execution education.",
  },
  {
    href: "/guarantee",
    title: "30-Day Guarantee",
    body: "Money-back policy for Premium members who complete the playbook.",
  },
];

export default function LandingPage() {
  const jsonLd = [
    websiteJsonLd(),
    organizationJsonLd(),
    breadcrumbJsonLd([{ name: "Home", path: "/" }]),
  ];

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <Hero />
      <PremiumEverythingIncluded />
      <ProbabilitySimulator />
      <section className="px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <RecommendedBrokerCard />
        </div>
      </section>
      <Stats />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8">
          <PropFirmChallengePromo />
          <PremiumValueStack />
          <LocalToolsPromo variant="compact" />
          <ConversionHeroDemo />
          <LearningPathTracker />
        </div>
      </section>

      <section
        aria-labelledby="seo-hub-heading"
        className="border-t border-slate-800/60 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">
          <h2
            id="seo-hub-heading"
            className="text-center font-mono text-2xl font-bold text-slate-200"
          >
            Explore Quicksilver
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-500">
            Free previews, prop firm guides, Chart Academy, and Premium planning engines —
            built for manual traders.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SEO_HUB_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-5 transition-colors hover:border-cyan-500/30"
              >
                <h3 className="font-mono text-sm font-semibold text-slate-200">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{item.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800/60 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-mono text-2xl font-bold text-slate-200">
            Start with the 7-Day Playbook Preview
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Every guide includes a free preview — including the prop firm challenge playbook.
            Premium unlocks the full day-by-day plan plus all nine planning engines and Chart
            Academy.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/solutions">
              <Button variant="secondary" size="lg">
                Try Free Trading Demos
              </Button>
            </Link>
            <Link href="/guides/prop-firm-one-week">
              <Button variant="ghost" size="lg">
                7-Day Playbook
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="ghost" size="lg">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-mono text-2xl font-bold text-slate-200">Ready to Deploy?</h2>
          <p className="mt-4 text-slate-500">
            Create your profile to unlock access tier options and deploy the Quicksilver
            stack — TradeLocker Quant Protocol, planning tools, and the 7-Day Playbook.
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button variant="primary" size="lg">
                Create Profile to View Access Tiers
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
