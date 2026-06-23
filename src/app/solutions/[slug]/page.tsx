import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SEO_LANDING_PAGES,
  getLandingPageBySlug,
} from "@/lib/seo/landing-pages";
import { faqJsonLd, landingPageJsonLd } from "@/lib/seo/json-ld";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { LandingDemoWidget } from "@/components/seo/landing/LandingDemoWidget";
import { SeoLandingCTA } from "@/components/seo/landing/SeoLandingCTA";
import { Badge } from "@/components/ui/Badge";

export function generateStaticParams() {
  return SEO_LANDING_PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const page = getLandingPageBySlug(params.slug);
  if (!page) return { title: "Not Found" };
  return {
    title: page.title,
    description: page.metaDescription,
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      type: "website",
    },
  };
}

export default function SolutionLandingPage({
  params,
}: {
  params: { slug: string };
}) {
  const page = getLandingPageBySlug(params.slug);
  if (!page) notFound();

  const jsonLd = [
    landingPageJsonLd({
      title: page.title,
      description: page.metaDescription,
      slug: page.slug,
      publishedAt: page.publishedAt,
    }),
    faqJsonLd(page.faqs),
  ];

  return (
    <article className="space-y-10">
      <JsonLdScript data={jsonLd} />

      <header>
        <Link
          href="/solutions"
          className="font-mono text-xs text-cyan-accent hover:underline"
        >
          ← Solutions Hub
        </Link>
        <div className="mt-3 flex flex-wrap gap-2">
          {page.market && (
            <Badge variant="success">{page.market.shortName}</Badge>
          )}
          {page.propFirm && (
            <Badge variant="success">{page.propFirm.shortName}</Badge>
          )}
          <Badge variant="warning">{page.topic.name}</Badge>
          <Badge variant="success">Free demo</Badge>
        </div>
        <h1 className="mt-4 font-mono text-2xl font-bold text-slate-100 sm:text-3xl">
          {page.h1}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-400 sm:text-lg">
          {page.intro}
        </p>
      </header>

      <section aria-label="Interactive demo">
        <LandingDemoWidget
          demo={page.demo}
          marketName={page.market?.name}
        />
      </section>

      {page.sections.map((section) => (
        <section key={section.heading}>
          <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
            {section.heading}
          </h2>
          <div className="mt-4 space-y-3">
            {section.paragraphs.map((para) => (
              <p key={para} className="leading-relaxed text-slate-400">
                {para}
              </p>
            ))}
          </div>
        </section>
      ))}

      <SeoLandingCTA toolSlug={page.toolSlug} pageTitle={page.h1} />

      <section>
        <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-slate-500">
          FAQ
        </h2>
        <div className="space-y-4">
          {page.faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-lg border border-slate-800/40 p-4"
            >
              <h3 className="font-mono text-sm font-semibold text-slate-200">
                {faq.question}
              </h3>
              <p className="mt-2 text-sm text-slate-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {page.relatedSlugs.length > 0 && (
        <section>
          <h2 className="mb-3 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
            Related solutions
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {page.relatedSlugs.map((rel) => {
              const relPage = getLandingPageBySlug(rel);
              if (!relPage) return null;
              return (
                <li key={rel}>
                  <Link
                    href={`/solutions/${rel}`}
                    className="block rounded-lg border border-slate-800/40 px-3 py-2 font-mono text-xs text-cyan-accent hover:border-cyan-accent/20"
                  >
                    {relPage.h1}
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