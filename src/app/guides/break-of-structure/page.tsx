import type { Metadata } from "next";
import Link from "next/link";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { BOS_GUIDE, BOS_GUIDE_PATH } from "@/lib/seo/break-of-structure-guide";
import {
  authorityArticleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  howToJsonLd,
} from "@/lib/seo/json-ld";
import { rankingPageMetadata, SEO_CONTENT_REFRESHED } from "@/lib/seo/page-metadata";

export const metadata: Metadata = rankingPageMetadata({
  title: BOS_GUIDE.title,
  description: BOS_GUIDE.metaDescription,
  path: BOS_GUIDE_PATH,
  type: "article",
  publishedAt: BOS_GUIDE.publishedAt,
  keywords: [...BOS_GUIDE.keywords],
});

export default function BreakOfStructureGuidePage() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
      { name: "Break of Structure (BOS)", path: BOS_GUIDE_PATH },
    ]),
    authorityArticleJsonLd({
      title: BOS_GUIDE.title,
      description: BOS_GUIDE.metaDescription,
      slug: "break-of-structure",
      publishedAt: BOS_GUIDE.publishedAt,
      dateModified: SEO_CONTENT_REFRESHED,
      pathPrefix: "/guides",
      articleSection: "Market Structure Trading",
    }),
    howToJsonLd({
      name: "How to Trade a Break of Structure (BOS)",
      description:
        "Confirm BOS with a close beyond a swing, wait for retest, define risk, and manage the trade.",
      path: BOS_GUIDE_PATH,
      totalTime: "PT15M",
      steps: [
        {
          name: "Label swing structure",
          text: "Mark the last swing high and swing low on your decision timeframe.",
        },
        {
          name: "Wait for a close beyond the extreme",
          text: "Bullish BOS closes above the last swing high; bearish BOS closes below the last swing low.",
        },
        {
          name: "Filter with higher-timeframe bias",
          text: "Only take LTF BOS that align with HTF trend direction.",
        },
        {
          name: "Enter on retest (preferred)",
          text: "Wait for pullback to the broken level; enter on rejection with stop beyond the retest extreme.",
        },
        {
          name: "Manage failed BOS",
          text: "If price closes back through the level against you, scratch the trade.",
        },
      ],
    }),
    faqJsonLd([...BOS_GUIDE.faqs]),
  ];

  return (
    <article className="space-y-10">
      <JsonLdScript data={jsonLd} />

      <header>
        <Link
          href="/guides"
          className="font-mono text-xs text-cyan-accent hover:underline"
        >
          ← Charting Guides
        </Link>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="success">Free guide</Badge>
          <Badge variant="warning">Market structure</Badge>
          <Badge variant="default">BOS</Badge>
        </div>
        <h1 className="mt-4 font-mono text-2xl font-bold text-slate-100 sm:text-4xl">
          {BOS_GUIDE.h1}
        </h1>
        <p className="mt-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4 text-base font-medium leading-relaxed text-slate-200">
          {BOS_GUIDE.directAnswer}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">{BOS_GUIDE.intro}</p>
      </header>

      {BOS_GUIDE.sections.map((section) => (
        <section key={section.heading}>
          <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
            {section.heading}
          </h2>
          <div className="mt-4 space-y-3">
            {section.paragraphs.map((para) => (
              <p key={para.slice(0, 48)} className="leading-relaxed text-slate-400">
                {para}
              </p>
            ))}
          </div>
        </section>
      ))}

      <section>
        <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
          Break of structure FAQ
        </h2>
        <div className="space-y-4">
          {BOS_GUIDE.faqs.map((faq) => (
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

      <section>
        <h2 className="mb-3 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Related lessons
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {BOS_GUIDE.relatedLessons.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-lg border border-slate-800/40 px-3 py-2 font-mono text-xs text-cyan-accent hover:border-cyan-accent/20"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 to-slate-950/80 px-6 py-8 text-center">
        <h2 className="font-mono text-lg font-bold text-slate-100">
          Pair structure with a prop firm risk plan
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
          BOS setups work best with hard daily loss limits and profit caps — the same rules
          prop firms enforce.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/launch">
            <Button variant="primary" size="md">
              7-Day Prop Firm Playbook
            </Button>
          </Link>
          <Link href="/lessons/market-structure-what-is-bos">
            <Button variant="secondary" size="md">
              Open BOS lesson
            </Button>
          </Link>
        </div>
      </section>
    </article>
  );
}
