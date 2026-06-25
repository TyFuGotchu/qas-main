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
import { Badge } from "@/components/ui/Badge";
import {
  PREMIUM_PROMO_CODE,
  PREMIUM_PROMO_DISCOUNT,
  PREMIUM_PROMO_FIRST_MONTH,
  PREMIUM_PROMO_NOTE,
  PREMIUM_PRICE,
} from "@/lib/pricing-tiers";

export const metadata: Metadata = {
  title: `${PREMIUM_PROMO_CODE} Promo Offers — ${PREMIUM_PROMO_DISCOUNT} Off Premium | Quicksilver`,
  description: `${PREMIUM_PROMO_NOTE} ${PREMIUM_PROMO_FIRST_MONTH} first month on Quicksilver Premium (${PREMIUM_PRICE}/mo). Chart Academy, trading tools, live terminal, and email support.`,
};

const BUNDLE_LINKS = [
  { slug: "first100-premium", label: "Main FIRST100 offer" },
  { slug: "first100-chart-academy", label: "Chart Academy bundle" },
  { slug: "first100-trading-bot", label: "TradeLocker bot deal" },
  { slug: "first100-prop-firm-tools", label: "Prop firm toolkit" },
  { slug: "first100-all-tools", label: "All 6 planning modules" },
];

export default function OffersHubPage() {
  return (
    <div className="space-y-12">
      <header>
        <Badge variant="success" className="mb-3">
          Limited-time promo
        </Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-100 sm:text-4xl">
          {PREMIUM_PROMO_CODE} Promo Hub
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          {PREMIUM_PROMO_NOTE} Premium is normally {PREMIUM_PRICE}/mo — code{" "}
          {PREMIUM_PROMO_CODE} drops month one to {PREMIUM_PROMO_FIRST_MONTH}.
          Find deals by market, prop firm, or trading topic below.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {BUNDLE_LINKS.map((link) => (
            <Link
              key={link.slug}
              href={`/offers/${link.slug}`}
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 font-mono text-xs text-emerald-400 hover:border-emerald-400/50"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </header>

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Browse by market
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SEO_MARKETS.slice(0, 12).map((market) => {
            const pages = getPromoPagesByMarket(market.slug);
            const sample = pages.find((p) => p.slug.endsWith("-premium-deal"));
            return (
              <Link
                key={market.slug}
                href={sample ? `/offers/${sample.slug}` : `/offers/first100-${market.slug}-setup-scoring`}
                className="rounded-lg border border-slate-800/60 bg-slate-900/40 px-4 py-3 hover:border-emerald-500/30"
              >
                <p className="font-mono text-sm font-semibold text-slate-200">
                  {market.shortName}
                </p>
                <p className="mt-1 font-mono text-[10px] text-slate-600">
                  {market.session}
                </p>
              </Link>
            );
          })}
        </div>
        <p className="mt-3 font-mono text-xs text-slate-600">
          More markets and topics in the sections below.
        </p>
      </section>

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Browse by prop firm
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SEO_PROP_FIRMS.map((firm) => {
            const pages = getPromoPagesByPropFirm(firm.slug);
            const sample = pages.find((p) => p.slug.endsWith("-premium-deal"));
            return (
              <Link
                key={firm.slug}
                href={sample ? `/offers/${sample.slug}` : `/offers/first100-${firm.slug}-prop-firm-challenge`}
                className="rounded-lg border border-slate-800/60 bg-slate-900/40 px-4 py-3 hover:border-emerald-500/30"
              >
                <p className="font-mono text-sm font-semibold text-slate-200">
                  {firm.shortName}
                </p>
                <p className="mt-1 font-mono text-[10px] text-slate-600">
                  {firm.profitTarget}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Browse by topic
        </h2>
        <div className="flex flex-wrap gap-2">
          {SEO_TOPICS.slice(0, 24).map((topic) => (
            <Link
              key={topic.slug}
              href={`/offers/first100-${topic.slug}-deal`}
              className="rounded-full border border-slate-800/60 px-3 py-1.5 font-mono text-[10px] text-slate-400 hover:border-cyan-accent/30 hover:text-cyan-accent"
            >
              {topic.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-6">
        <h2 className="font-mono text-lg font-bold text-slate-100">
          How to redeem {PREMIUM_PROMO_CODE}
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-400">
          <li>Pick any offer page above (or start with the main bundle).</li>
          <li>
            Click Subscribe — checkout opens with code {PREMIUM_PROMO_CODE}{" "}
            prefilled when supported.
          </li>
          <li>
            Pay {PREMIUM_PROMO_FIRST_MONTH} for month one; full access activates
            immediately.
          </li>
          <li>Month two onward is {PREMIUM_PRICE}/mo — cancel anytime.</li>
        </ol>
        <Link
          href="/offers/first100-premium"
          className="mt-4 inline-block font-mono text-sm text-emerald-400 hover:underline"
        >
          Go to main FIRST100 offer →
        </Link>
      </section>
    </div>
  );
}