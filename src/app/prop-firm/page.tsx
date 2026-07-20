import type { Metadata } from "next";
import Link from "next/link";
import {
  AUTHORITY_PROP_FIRMS,
  PILLAR_PATHS,
  PROP_FIRM_CLUSTER_COUNT,
  PROP_FIRM_CLUSTER_PAGES,
  getClustersByFirm,
} from "@/lib/seo/prop-firm-authority";
import { AuthorityPillarCTA } from "@/components/seo/authority/AuthorityPillarCTA";
import { Badge } from "@/components/ui/Badge";

import { rankingPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = rankingPageMetadata({
  title: "Prop Firm Challenge Guides: FTMO, Apex, FundedNext & More",
  description:
    "Free prop firm challenge guides: how to pass FTMO, FundedNext, Apex, FTUK, Topstep — consistency rules, drawdown math, 7-day playbooks, and risk plans.",
  path: "/prop-firm",
  keywords: [
    "prop firm challenge",
    "how to pass FTMO",
    "Apex trader funding guide",
    "prop firm consistency rule",
    "FundedNext challenge tips",
  ],
});

export default function PropFirmHubPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <Badge variant="success">Topic Authority Cluster</Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-100 sm:text-4xl">
          Prop Firm Challenge Guides (Pass Cleanly)
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-slate-400">
          Practical playbooks for FTMO, FundedNext, Apex, FTUK, Topstep, and more —
          consistency math, daily loss limits, drawdown rules, and {PROP_FIRM_CLUSTER_COUNT}+
          step-by-step firm-specific guides. Start with the two pillars below.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href={PILLAR_PATHS.playbook}
          className="rounded-xl border border-cyan-accent/30 bg-gradient-to-br from-slate-950 to-cyan-accent/5 p-6 hover:border-cyan-accent/50"
        >
          <Badge variant="success" className="mb-3">
            Pillar 1
          </Badge>
          <h2 className="font-mono text-lg font-bold text-slate-100">
            Ultimate 7-Day Prop Firm Playbook
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Psychology, profit caps, consistency math, daily risk boundaries.
          </p>
        </Link>
        <Link
          href={PILLAR_PATHS.math}
          className="rounded-xl border border-cyan-accent/30 bg-gradient-to-br from-slate-950 to-cyan-accent/5 p-6 hover:border-cyan-accent/50"
        >
          <Badge variant="success" className="mb-3">
            Pillar 2
          </Badge>
          <h2 className="font-mono text-lg font-bold text-slate-100">
            Mathematical Model for Prop Firm Success
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Monte Carlo, probability, consistency equations, 9 tools.
          </p>
        </Link>
      </section>

      <AuthorityPillarCTA />

      {AUTHORITY_PROP_FIRMS.map((firm) => {
        const clusters = getClustersByFirm(firm.slug);
        return (
          <section key={firm.slug}>
            <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
              {firm.name}
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {clusters.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/prop-firm/${page.slug}`}
                    className="block rounded-lg border border-slate-800/40 px-3 py-2.5 font-mono text-xs text-slate-300 hover:border-cyan-accent/20 hover:text-cyan-accent"
                  >
                    {page.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <p className="font-mono text-xs text-slate-600">
        {PROP_FIRM_CLUSTER_PAGES.length} cluster pages · All link to canonical pillars
      </p>
    </div>
  );
}