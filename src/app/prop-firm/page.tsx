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

export const metadata: Metadata = {
  title: "Prop Firm Challenge Authority Hub | Quicksilver",
  description:
    "Long-tail guides for passing FTMO, FundedNext, Apex, FTUK, and Topstep challenges — consistency math, Monte Carlo risk, daily drawdown, and 7-day playbooks.",
};

export default function PropFirmHubPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <Badge variant="success">Topic Authority Cluster</Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-100 sm:text-4xl">
          Prop Firm Challenge Authority
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-slate-400">
          {PROP_FIRM_CLUSTER_COUNT}+ long-tail guides on mathematically passing prop
          firm challenges — sniping exact search intent for FTMO, FundedNext, Apex,
          FTUK, Topstep, and more.
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