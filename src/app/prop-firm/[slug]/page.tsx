import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PILLAR_PATHS,
  PROP_FIRM_CLUSTER_PAGES,
  getClusterPageBySlug,
} from "@/lib/seo/prop-firm-authority";
import { authorityArticleJsonLd, faqJsonLd } from "@/lib/seo/json-ld";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
  AuthorityArticleSections,
  AuthorityFaqSection,
} from "@/components/seo/authority/AuthorityArticleSections";
import { AuthorityPillarCTA } from "@/components/seo/authority/AuthorityPillarCTA";
import { SeoLandingCTA } from "@/components/seo/landing/SeoLandingCTA";
import { Badge } from "@/components/ui/Badge";

export function generateStaticParams() {
  return PROP_FIRM_CLUSTER_PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const page = getClusterPageBySlug(params.slug);
  if (!page) return { title: "Not Found" };
  return {
    title: page.title,
    description: page.metaDescription,
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      type: "article",
    },
  };
}

export default function PropFirmClusterPage({
  params,
}: {
  params: { slug: string };
}) {
  const page = getClusterPageBySlug(params.slug);
  if (!page) notFound();

  const jsonLd = [
    authorityArticleJsonLd({
      title: page.title,
      description: page.metaDescription,
      slug: page.slug,
      publishedAt: page.publishedAt,
      pathPrefix: "/prop-firm",
    }),
    faqJsonLd(page.faqs),
  ];

  const formatLabel =
    page.format === "guide"
      ? "Step-by-Step Guide"
      : page.format === "faq"
        ? "Direct Answer"
        : page.format === "listicle"
          ? "Listicle"
          : page.format === "step-by-step"
            ? "Step-by-Step"
            : "Explainer";

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
          <Badge variant="success">{page.firmName}</Badge>
          {page.sizeLabel && <Badge variant="warning">{page.sizeLabel}</Badge>}
          <Badge variant="success">{formatLabel}</Badge>
        </div>
        <h1 className="mt-4 font-mono text-2xl font-bold text-slate-100 sm:text-3xl">
          {page.h1}
        </h1>
        <p className="mt-4 rounded-lg border border-emerald-terminal/20 bg-emerald-terminal/5 p-4 text-base font-medium leading-relaxed text-slate-200">
          {page.directAnswer}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">{page.intro}</p>
      </header>

      <AuthorityArticleSections sections={page.sections} />

      <SeoLandingCTA toolSlug={page.toolSlug} pageTitle={page.h1} />

      <AuthorityPillarCTA />

      <section>
        <h2 className="mb-3 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          Canonical Pillars
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          <li>
            <Link
              href={PILLAR_PATHS.playbook}
              className="block rounded-lg border border-cyan-accent/30 px-3 py-2 font-mono text-xs text-cyan-accent hover:bg-cyan-accent/5"
            >
              Ultimate 7-Day Prop Firm Playbook →
            </Link>
          </li>
          <li>
            <Link
              href={PILLAR_PATHS.math}
              className="block rounded-lg border border-cyan-accent/30 px-3 py-2 font-mono text-xs text-cyan-accent hover:bg-cyan-accent/5"
            >
              Mathematical Model for Prop Firm Success →
            </Link>
          </li>
        </ul>
      </section>

      <AuthorityFaqSection faqs={page.faqs} />

      {page.relatedSlugs.length > 0 && (
        <section>
          <h2 className="mb-3 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
            More {page.firmName} Guides
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {page.relatedSlugs.map((relSlug) => {
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
    </article>
  );
}