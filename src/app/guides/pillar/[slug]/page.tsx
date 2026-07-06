import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PILLAR_PAGES,
  PILLAR_PATHS,
  getPillarBySlug,
} from "@/lib/seo/prop-firm-authority";
import { getClusterPageBySlug } from "@/lib/seo/prop-firm-authority/cluster-builder";
import { authorityArticleJsonLd, faqJsonLd } from "@/lib/seo/json-ld";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
  AuthorityArticleSections,
  AuthorityFaqSection,
} from "@/components/seo/authority/AuthorityArticleSections";
import { AuthorityPillarCTA } from "@/components/seo/authority/AuthorityPillarCTA";
import { Badge } from "@/components/ui/Badge";

export function generateStaticParams() {
  return PILLAR_PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const pillar = getPillarBySlug(params.slug);
  if (!pillar) return { title: "Not Found" };
  return {
    title: pillar.title,
    description: pillar.metaDescription,
    openGraph: {
      title: pillar.title,
      description: pillar.metaDescription,
      type: "article",
    },
  };
}

export default function PillarGuidePage({ params }: { params: { slug: string } }) {
  const pillar = getPillarBySlug(params.slug);
  if (!pillar) notFound();

  const otherPillar = PILLAR_PAGES.find((p) => p.slug !== pillar.slug);

  const jsonLd = [
    authorityArticleJsonLd({
      title: pillar.title,
      description: pillar.metaDescription,
      slug: pillar.slug,
      publishedAt: pillar.publishedAt,
      pathPrefix: "/guides/pillar",
    }),
    faqJsonLd(pillar.faqs),
  ];

  return (
    <article className="space-y-10">
      <JsonLdScript data={jsonLd} />

      <header>
        <Link
          href="/prop-firm"
          className="font-mono text-xs text-cyan-accent hover:underline"
        >
          ← Prop Firm Authority Hub
        </Link>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="success">Canonical Pillar</Badge>
          <Badge variant="warning">Prop Firm Authority</Badge>
        </div>
        <h1 className="mt-4 font-mono text-2xl font-bold text-slate-100 sm:text-4xl">
          {pillar.h1}
        </h1>
        <p className="mt-4 rounded-lg border border-cyan-accent/20 bg-cyan-accent/5 p-4 text-base font-medium leading-relaxed text-slate-200 sm:text-lg">
          {pillar.directAnswer}
        </p>
        <p className="mt-3 font-mono text-xs text-slate-600">
          By Quicksilver Lead Dev · Updated {pillar.publishedAt}
        </p>
      </header>

      <AuthorityArticleSections sections={pillar.sections} />

      <AuthorityPillarCTA />

      {otherPillar && (
        <section>
          <h2 className="mb-3 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
            Companion Pillar
          </h2>
          <Link
            href={`/guides/pillar/${otherPillar.slug}`}
            className="block rounded-lg border border-slate-800/40 px-4 py-3 font-mono text-sm text-cyan-accent hover:border-cyan-accent/20"
          >
            {otherPillar.h1} →
          </Link>
        </section>
      )}

      {pillar.relatedClusterSlugs.length > 0 && (
        <section>
          <h2 className="mb-3 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
            Related Cluster Guides
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {pillar.relatedClusterSlugs.map((relSlug) => {
              const rel = getClusterPageBySlug(relSlug);
              if (!rel) return null;
              return (
                <li key={relSlug}>
                  <Link
                    href={`/prop-firm/${relSlug}`}
                    className="block rounded-lg border border-slate-800/40 px-3 py-2 font-mono text-xs text-cyan-accent hover:border-cyan-accent/20"
                  >
                    {rel.h1}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <AuthorityFaqSection faqs={pillar.faqs} />

      <nav className="rounded-lg border border-slate-800/40 p-4 font-mono text-xs text-slate-500">
        <p>
          Canonical pillars:{" "}
          <Link href={PILLAR_PATHS.playbook} className="text-cyan-accent hover:underline">
            7-Day Playbook
          </Link>
          {" · "}
          <Link href={PILLAR_PATHS.math} className="text-cyan-accent hover:underline">
            Mathematical Model
          </Link>
        </p>
      </nav>
    </article>
  );
}