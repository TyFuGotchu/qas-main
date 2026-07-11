import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  EDGE_RADAR_CLUSTER_PAGES,
  EDGE_RADAR_HUB_PATH,
  EDGE_RADAR_PILLAR_PAGE,
  EDGE_RADAR_PILLAR_SLUG,
  getEdgeRadarClusterBySlug,
} from "@/lib/seo/edge-radar-authority";
import { authorityArticleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/json-ld";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
  AuthorityArticleSections,
  AuthorityFaqSection,
} from "@/components/seo/authority/AuthorityArticleSections";
import { EdgeRadarCTA } from "@/components/seo/authority/EdgeRadarCTA";
import { Badge } from "@/components/ui/Badge";
import { EDGE_RADAR_PATH } from "@/lib/edge-radar";

export function generateStaticParams() {
  return [
    { slug: EDGE_RADAR_PILLAR_SLUG },
    ...EDGE_RADAR_CLUSTER_PAGES.map((p) => ({ slug: p.slug })),
  ];
}

function getPage(slug: string) {
  if (slug === EDGE_RADAR_PILLAR_SLUG) {
    return { type: "pillar" as const, page: EDGE_RADAR_PILLAR_PAGE };
  }
  const cluster = getEdgeRadarClusterBySlug(slug);
  if (cluster) return { type: "cluster" as const, page: cluster };
  return null;
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const result = getPage(params.slug);
  if (!result) return { title: "Not Found" };

  const { page } = result;
  const keywords =
    result.type === "cluster" && "keywords" in page ? (page.keywords as string[]) : undefined;

  return {
    title: page.title,
    description: page.metaDescription,
    keywords,
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      type: "article",
    },
    alternates: {
      canonical: `/edge-radar/guides/${params.slug}`,
    },
  };
}

export default function EdgeRadarGuidePage({ params }: { params: { slug: string } }) {
  const result = getPage(params.slug);
  if (!result) notFound();

  const { type, page } = result;
  const isPillar = type === "pillar";
  const cluster = type === "cluster" ? page : null;

  const jsonLd = [
    authorityArticleJsonLd({
      title: page.title,
      description: page.metaDescription,
      slug: params.slug,
      publishedAt: page.publishedAt,
      pathPrefix: "/edge-radar/guides",
      articleSection: "Sports Betting Player Props",
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Edge Radar", path: EDGE_RADAR_PATH },
      { name: "Guides", path: EDGE_RADAR_HUB_PATH },
      { name: page.h1, path: `/edge-radar/guides/${params.slug}` },
    ]),
    faqJsonLd(page.faqs),
  ];

  const variantBadge =
    cluster?.variant === "sport"
      ? cluster.sportLabel
      : cluster?.variant === "sport-book"
        ? `${cluster.bookName} · ${cluster.sportLabel}`
        : cluster?.variant === "topic"
          ? "Strategy Guide"
          : "Pillar Guide";

  const relatedSlugs = isPillar
    ? (page as typeof EDGE_RADAR_PILLAR_PAGE).relatedClusterSlugs
    : cluster?.relatedSlugs ?? [];

  return (
    <article className="space-y-10">
      <JsonLdScript data={jsonLd} />

      <header>
        <Link
          href={EDGE_RADAR_HUB_PATH}
          className="font-mono text-xs text-cyan-accent hover:underline"
        >
          ← Edge Radar SEO Hub
        </Link>
        <div className="mt-3 flex flex-wrap gap-2">
          {isPillar && <Badge variant="warning">Canonical Pillar</Badge>}
          {variantBadge && <Badge variant="success">{variantBadge}</Badge>}
          {cluster?.bookName && <Badge variant="warning">{cluster.bookName}</Badge>}
        </div>
        <h1 className="mt-4 font-mono text-2xl font-bold text-slate-100 sm:text-3xl">
          {page.h1}
        </h1>
        <p className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-base font-medium leading-relaxed text-slate-200">
          {page.directAnswer}
        </p>
        {"intro" in page && page.intro && (
          <p className="mt-3 text-sm leading-relaxed text-slate-500">{page.intro}</p>
        )}
      </header>

      <AuthorityArticleSections sections={page.sections} />

      <EdgeRadarCTA pageTitle={page.h1} sportLabel={cluster?.sportLabel} />

      {isPillar && (
        <section>
          <h2 className="mb-3 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
            Start Here
          </h2>
          <Link
            href={EDGE_RADAR_PATH}
            className="block rounded-lg border border-amber-500/30 px-3 py-2 font-mono text-xs text-amber-400 hover:bg-amber-500/5"
          >
            Open Edge Radar Live Terminal →
          </Link>
        </section>
      )}

      <AuthorityFaqSection faqs={page.faqs} />

      {relatedSlugs.length > 0 && (
        <section>
          <h2 className="mb-3 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
            Related Guides
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {relatedSlugs.map((relSlug) => {
              const rel = getEdgeRadarClusterBySlug(relSlug);
              if (!rel) return null;
              return (
                <li key={relSlug}>
                  <Link
                    href={`/edge-radar/guides/${relSlug}`}
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