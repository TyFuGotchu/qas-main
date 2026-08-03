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
import { AuthorityCrossLinks } from "@/components/seo/AuthorityCrossLinks";
import { Badge } from "@/components/ui/Badge";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  moneyPageItemListJsonLd,
} from "@/lib/seo/json-ld";
import { rankingPageMetadata, SEO_CONTENT_REFRESHED } from "@/lib/seo/page-metadata";

export const metadata: Metadata = rankingPageMetadata({
  title: "Prop Firm Challenge Guides: FTMO, Apex, FundedNext & More",
  description:
    "Free prop firm challenge guides: how to pass FTMO, FundedNext, Apex, FTUK, Topstep — consistency rules, drawdown math, 7-day playbooks, and risk plans.",
  path: "/prop-firm",
  modifiedAt: SEO_CONTENT_REFRESHED,
  keywords: [
    "prop firm challenge",
    "how to pass FTMO",
    "Apex trader funding guide",
    "prop firm consistency rule",
    "FundedNext challenge tips",
  ],
});

const HUB_FAQS = [
  {
    question: "What is a prop firm challenge?",
    answer:
      "A prop firm challenge is an evaluation where you trade a simulated or evaluation account under strict rules (profit target, max drawdown, daily loss, often a consistency rule). Pass the evaluation to receive a funded account and share of profits.",
  },
  {
    question: "How do I pass a prop firm challenge without violating consistency?",
    answer:
      "Cap daily profits so no single day becomes more than about 20% of total profit, keep risk fixed per trade, and use a day-by-day plan. Quicksilver’s 7-Day Playbook and Prop Survival tools are built around those constraints.",
  },
  {
    question: "Which prop firms do these guides cover?",
    answer:
      "FTMO, FundedNext, Apex Trader Funding, FTUK, Topstep, and related firm-specific cluster pages linked from this hub. Always verify your firm’s current rules before trading.",
  },
];

export default function PropFirmHubPage() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Prop Firm Guides", path: "/prop-firm" },
    ]),
    faqJsonLd(HUB_FAQS),
    moneyPageItemListJsonLd([
      {
        name: "Ultimate 7-Day Prop Firm Playbook",
        path: PILLAR_PATHS.playbook,
        description: "Canonical prop firm execution pillar",
      },
      {
        name: "Mathematical Model for Prop Firm Success",
        path: PILLAR_PATHS.math,
        description: "Consistency math and probability pillar",
      },
      {
        name: "7-Day Playbook Launch",
        path: "/launch",
        description: "Productized challenge tracker and Premium offer",
      },
    ]),
  ];

  return (
    <div className="space-y-12">
      <JsonLdScript data={jsonLd} />
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
        <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
          These guides are educational. Prop firm rules change — treat every page as a
          framework for risk and consistency, then confirm your firm’s latest challenge
          terms. For the interactive tracker and planning tools, use the{" "}
          <Link href="/launch" className="text-cyan-400 hover:underline">
            7-Day Playbook launch
          </Link>{" "}
          or{" "}
          <Link href="/quant-protocol" className="text-cyan-400 hover:underline">
            Quant Protocol
          </Link>{" "}
          Premium stack.
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

      <section>
        <h2 className="mb-4 font-mono text-lg font-bold text-slate-200">
          Prop firm hub FAQ
        </h2>
        <div className="space-y-4">
          {HUB_FAQS.map((faq) => (
            <div
              key={faq.question}
              className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-5"
            >
              <h3 className="font-mono text-sm font-semibold text-slate-200">
                {faq.question}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="font-mono text-xs text-slate-600">
        {PROP_FIRM_CLUSTER_PAGES.length} cluster pages · All link to canonical pillars
      </p>

      <AuthorityCrossLinks currentPath="/prop-firm" />
    </div>
  );
}