import type { Metadata } from "next";
import Link from "next/link";
import {
  LESSON_LANDING_COUNT,
  LESSON_LANDING_PAGES,
  getLessonLandingPagesByMarket,
  getLessonLandingPagesByPropFirm,
} from "@/lib/seo/lesson-landing-pages";
import { SEO_PROP_FIRMS, getLessonLandingMarkets } from "@/lib/seo/landing-data";
import { PUBLIC_LESSONS } from "@/lib/seo/public-lessons";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Free Trading Lesson Guides by Market & Prop Firm | Quicksilver Algo",
  description: `${LESSON_LANDING_COUNT}+ free lesson landing pages for gold, forex, indices, crypto, and prop firm challengers — chart reading, candlesticks, Fibonacci, and funded trader workflows.`,
};

export default function LearnHubPage() {
  const markets = getLessonLandingMarkets();

  return (
    <div className="space-y-12">
      <header>
        <Badge variant="success" className="mb-3">
          {LESSON_LANDING_COUNT} lesson guides
        </Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-100 sm:text-4xl">
          Lesson Guides by Market & Prop Firm
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          {markets.length} instruments and {SEO_PROP_FIRMS.length} prop firms
          paired with every Chart Academy lesson — free previews, interactive
          demos, and links to the full module.
        </p>
      </header>

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Browse by market ({markets.length})
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {markets.map((market) => {
            const count = getLessonLandingPagesByMarket(market.slug).length;
            const first = getLessonLandingPagesByMarket(market.slug)[0];
            return (
              <Link
                key={market.slug}
                href={first ? `/learn/${first.slug}` : "/learn"}
                className="rounded-lg border border-slate-800/60 bg-slate-900/40 p-4 hover:border-cyan-accent/30"
              >
                <p className="font-mono text-sm font-semibold text-slate-200">
                  {market.shortName}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {count} lesson guides · {market.session}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Browse by prop firm ({SEO_PROP_FIRMS.length})
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SEO_PROP_FIRMS.map((firm) => {
            const count = getLessonLandingPagesByPropFirm(firm.slug).length;
            const first = getLessonLandingPagesByPropFirm(firm.slug)[0];
            return (
              <Link
                key={firm.slug}
                href={first ? `/learn/${first.slug}` : "/learn"}
                className="rounded-lg border border-slate-800/60 bg-slate-900/40 p-4 hover:border-cyan-accent/30"
              >
                <p className="font-mono text-sm font-semibold text-slate-200">
                  {firm.shortName}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {count} lesson guides · {firm.profitTarget}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Popular lessons
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {PUBLIC_LESSONS.slice(0, 16).map((lesson) => {
            const first = LESSON_LANDING_PAGES.find(
              (p) => p.lessonSlug === lesson.slug && p.variant === "market"
            );
            if (!first) return null;
            return (
              <Link
                key={lesson.slug}
                href={`/learn/${first.slug}`}
                className="rounded-lg border border-slate-800/60 bg-slate-900/40 p-4 hover:border-cyan-accent/30"
              >
                <p className="font-mono text-sm font-semibold text-slate-200">
                  {lesson.title}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {lesson.categoryTitle} · {markets.length + SEO_PROP_FIRMS.length}{" "}
                  targeted guides
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-cyan-accent/20 bg-cyan-accent/5 p-6 text-center">
        <p className="font-mono text-sm text-slate-300">
          Need calculators and setup scorers?
        </p>
        <Link
          href="/solutions"
          className="mt-2 inline-block font-mono text-sm text-cyan-accent hover:underline"
        >
          Browse the Solutions Hub →
        </Link>
      </section>
    </div>
  );
}