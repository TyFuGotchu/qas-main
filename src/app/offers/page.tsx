import type { Metadata } from "next";
import Link from "next/link";
import {
  getPromoPagesByMarket,
  getPromoPagesByPropFirm,
} from "@/lib/seo/promo-landing-pages";
import {
  SEO_MARKETS,
  SEO_PROP_FIRMS,
  SEO_TOPICS,
} from "@/lib/seo/landing-data";
import { PropFirmChallengePromo } from "@/components/marketing/PropFirmChallengePromo";
import {
  PROP_FIRM_MARKETING_HEADLINE,
  PROP_FIRM_PREMIUM_PITCH,
} from "@/lib/prop-firm-challenge-marketing";
import { Badge } from "@/components/ui/Badge";
import { PREMIUM_PRICE } from "@/lib/pricing-tiers";

export const metadata: Metadata = {
  title: `Premium Offers | Quicksilver`,
  description: `${PROP_FIRM_MARKETING_HEADLINE}. Premium is ${PREMIUM_PRICE}/mo — tools, playbook, academy, and Quant Protocol.`,
};

const BUNDLE_LINKS: { slug: string; label: string; href?: string }[] = [
  { slug: "launch", label: "Official launch page", href: "/launch" },
  {
    slug: "prop-firm-one-week",
    label: "7-Day Prop Firm Playbook",
    href: "/guides/prop-firm-one-week",
  },
  { slug: "first100-prop-firm-one-week", label: "Playbook offer page" },
  { slug: "first100-premium", label: "Main Premium offer" },
  { slug: "local-tools", label: "Trading Tools hub", href: "/tools" },
  { slug: "first100-chart-academy", label: "Chart Academy bundle" },
  { slug: "first100-trading-bot", label: "TradeLocker bot deal" },
  { slug: "first100-prop-firm-tools", label: "Prop firm toolkit" },
  { slug: "first100-all-tools", label: "All 9 planning engines" },
];

export default function OffersHubPage() {
  return (
    <div className="space-y-12">
      <header>
        <Badge variant="success" className="mb-3">
          Premium
        </Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-100 sm:text-4xl">
          Premium Offers Hub
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          {PROP_FIRM_PREMIUM_PITCH} Premium is {PREMIUM_PRICE}/mo. Browse by
          market, prop firm, or topic below.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {BUNDLE_LINKS.map((link) => (
            <Link
              key={link.slug}
              href={link.href ?? `/offers/${link.slug}`}
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 font-mono text-xs text-emerald-400 hover:border-emerald-400/50"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </header>

      <PropFirmChallengePromo />

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          By market
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SEO_MARKETS.map((market) => {
            const sample = getPromoPagesByMarket(market.slug)[0];
            return (
              <Link
                key={market.slug}
                href={
                  sample
                    ? `/offers/${sample.slug}`
                    : `/offers/first100-${market.slug}-setup-scoring`
                }
                className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-4 transition-colors hover:border-cyan-500/30"
              >
                <p className="font-mono text-sm font-semibold text-slate-200">
                  {market.shortName}
                </p>
                <p className="mt-1 text-xs text-slate-500">{market.name}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          By prop firm
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SEO_PROP_FIRMS.map((firm) => {
            const sample = getPromoPagesByPropFirm(firm.slug)[0];
            return (
              <Link
                key={firm.slug}
                href={
                  sample
                    ? `/offers/${sample.slug}`
                    : `/offers/first100-${firm.slug}-prop-firm-challenge`
                }
                className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-4 transition-colors hover:border-cyan-500/30"
              >
                <p className="font-mono text-sm font-semibold text-slate-200">
                  {firm.shortName}
                </p>
                <p className="mt-1 text-xs text-slate-500">{firm.name}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          By topic
        </h2>
        <div className="flex flex-wrap gap-2">
          {SEO_TOPICS.map((topic) => (
            <Link
              key={topic.slug}
              href={`/offers/first100-${topic.slug}-deal`}
              className="rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 font-mono text-xs text-slate-300 hover:border-cyan-500/40"
            >
              {topic.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-6">
        <h2 className="font-mono text-lg font-bold text-slate-100">
          How to subscribe
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-400">
          <li>Pick any offer page above (or start with the main bundle).</li>
          <li>Click Subscribe to open Stripe checkout.</li>
          <li>
            Pay {PREMIUM_PRICE}/mo for Premium; full access activates
            immediately.
          </li>
          <li>Cancel anytime from billing support.</li>
        </ol>
        <Link
          href="/offers/first100-premium"
          className="mt-4 inline-block font-mono text-sm text-emerald-400 hover:underline"
        >
          Go to main Premium offer →
        </Link>
      </section>
    </div>
  );
}
