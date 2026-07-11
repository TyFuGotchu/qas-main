import type { Metadata } from "next";
import Link from "next/link";
import {
  EDGE_RADAR_CLUSTER_COUNT,
  EDGE_RADAR_CLUSTER_PAGES,
  EDGE_RADAR_PILLAR_PATH,
  EDGE_RADAR_PILLAR_PAGE,
  SEO_BOOKS,
  SEO_SPORTS,
  SEO_TOPICS,
  getSportBookClusters,
} from "@/lib/seo/edge-radar-authority";
import { EDGE_RADAR_PATH, EDGE_RADAR_PRICE } from "@/lib/edge-radar";
import { Badge } from "@/components/ui/Badge";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quicksilveralgo.com";

export const metadata: Metadata = {
  title: "Sports Betting Props SEO Hub — Player Props Guides & Line Lag Strategies",
  description: `${EDGE_RADAR_CLUSTER_COUNT}+ guides on player prop line lag, injury betting, DraftKings vs FanDuel movement, and +EV scanning. ${EDGE_RADAR_PRICE} live terminal.`,
  alternates: { canonical: `${SITE_URL}/edge-radar/hub` },
  openGraph: {
    title: "Edge Radar Sports Props Authority Hub",
    description: "Long-tail player props guides for every major sport and betting strategy.",
    type: "website",
  },
};

export default function EdgeRadarHubPage() {
  const sportPages = EDGE_RADAR_CLUSTER_PAGES.filter((p) => p.variant === "sport");
  const topicPages = EDGE_RADAR_CLUSTER_PAGES.filter((p) => p.variant === "topic");

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <Badge variant="warning">Sports Props Authority Cluster</Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-100 sm:text-4xl">
          Edge Radar Sports Betting Hub
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-slate-400">
          {EDGE_RADAR_CLUSTER_COUNT}+ long-tail guides on player prop line lag, injury-driven
          betting, cross-book movement, and +EV scanning — built to capture exact search intent
          for NFL, NBA, MLB, NHL, and every major sport.
        </p>
        <Link
          href={EDGE_RADAR_PATH}
          className="inline-block font-mono text-xs text-amber-400 hover:underline"
        >
          → Live Edge Radar terminal ({EDGE_RADAR_PRICE})
        </Link>
      </header>

      <section>
        <Link
          href={EDGE_RADAR_PILLAR_PATH}
          className="block rounded-xl border border-amber-500/30 bg-gradient-to-br from-slate-950 to-amber-500/5 p-6 hover:border-amber-500/50"
        >
          <Badge variant="warning" className="mb-3">
            Canonical Pillar
          </Badge>
          <h2 className="font-mono text-lg font-bold text-slate-100">
            {EDGE_RADAR_PILLAR_PAGE.h1}
          </h2>
          <p className="mt-2 text-sm text-slate-400">{EDGE_RADAR_PILLAR_PAGE.directAnswer}</p>
        </Link>
      </section>

      <section>
        <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-amber-400">
          Strategy Guides ({SEO_TOPICS.length})
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {topicPages.map((page) => (
            <li key={page.slug}>
              <Link
                href={`/edge-radar/guides/${page.slug}`}
                className="block rounded-lg border border-slate-800/40 px-3 py-2.5 font-mono text-xs text-slate-300 hover:border-amber-500/20 hover:text-amber-400"
              >
                {page.h1}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-amber-400">
          Sport Prop Scanners ({SEO_SPORTS.length})
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {sportPages.map((page) => (
            <li key={page.slug}>
              <Link
                href={`/edge-radar/guides/${page.slug}`}
                className="block rounded-lg border border-slate-800/40 px-3 py-2.5 font-mono text-xs text-slate-300 hover:border-amber-500/20 hover:text-amber-400"
              >
                {page.h1}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {SEO_SPORTS.filter((s) => ["nfl", "nba", "mlb", "nhl"].includes(s.id)).map((sport) => {
        const bookClusters = getSportBookClusters(sport.id);
        return (
          <section key={sport.id}>
            <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
              {sport.label} × Sportsbook Guides
            </h2>
            <ul className="grid gap-2 sm:grid-cols-3">
              {bookClusters.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/edge-radar/guides/${page.slug}`}
                    className="block rounded-lg border border-slate-800/40 px-3 py-2.5 font-mono text-xs text-slate-300 hover:border-cyan-accent/20 hover:text-cyan-accent"
                  >
                    {page.bookName} {sport.label} Props
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <section className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-4">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-slate-500">
          Books covered
        </h2>
        <p className="mt-2 font-mono text-xs text-slate-400">
          {SEO_BOOKS.map((b) => b.name).join(" · ")} · cross-book line lag detection
        </p>
        <p className="mt-3 font-mono text-[10px] text-slate-600">
          {EDGE_RADAR_CLUSTER_PAGES.length} indexable cluster pages · All link to canonical pillar
          and live terminal
        </p>
      </section>
    </div>
  );
}