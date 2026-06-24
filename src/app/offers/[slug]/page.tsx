import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PROMO_LANDING_PAGES,
  getPromoLandingPageBySlug,
} from "@/lib/seo/promo-landing-pages";
import {
  faqJsonLd,
  landingPageJsonLd,
  promoOfferJsonLd,
} from "@/lib/seo/json-ld";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { LandingDemoWidget } from "@/components/seo/landing/LandingDemoWidget";
import { PromoLandingCTA } from "@/components/seo/landing/PromoLandingCTA";
import { Badge } from "@/components/ui/Badge";
import {
  PREMIUM_PRICE,
  PREMIUM_PROMO_CODE,
  PREMIUM_PROMO_FIRST_MONTH,
} from "@/lib/pricing-tiers";

export function generateStaticParams() {
  return PROMO_LANDING_PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const page = getPromoLandingPageBySlug(params.slug);
  if (!page) return { title: "Not Found" };
  return {
    title: page.title,
    description: page.metaDescription,
    keywords: [
      PREMIUM_PROMO_CODE,
      "Quicksilver Premium promo",
      "trading tools discount",
      page.market?.shortName,
      page.propFirm?.shortName,
      page.topic?.name,
      page.lessonTitle,
    ].filter(Boolean) as string[],
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      type: "website",
    },
  };
}

export default function PromoLandingPage({
  params,
}: {
  params: { slug: string };
}) {
  const page = getPromoLandingPageBySlug(params.slug);
  if (!page) notFound();

  const jsonLd = [
    landingPageJsonLd({
      title: page.title,
      description: page.metaDescription,
      slug: page.slug,
      publishedAt: page.publishedAt,
      pathPrefix: "/offers",
    }),
    promoOfferJsonLd({
      title: page.title,
      description: page.metaDescription,
      slug: page.slug,
      publishedAt: page.publishedAt,
      promoCode: PREMIUM_PROMO_CODE,
      fullPrice: PREMIUM_PRICE,
      discountedPrice: PREMIUM_PROMO_FIRST_MONTH,
    }),
    faqJsonLd(page.faqs),
  ];

  return (
    <article className="space-y-10">
      <JsonLdScript data={jsonLd} />

      <header>
        <Link
          href="/offers"
          className="font-mono text-xs text-cyan-accent hover:underline"
        >
          ← Offers Hub
        </Link>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="success">Code {PREMIUM_PROMO_CODE}</Badge>
          {page.market && (
            <Badge variant="success">{page.market.shortName}</Badge>
          )}
          {page.propFirm && (
            <Badge variant="success">{page.propFirm.shortName}</Badge>
          )}
          {page.topic && (
            <Badge variant="warning">{page.topic.name}</Badge>
          )}
          {page.lessonTitle && (
            <Badge variant="warning">{page.lessonTitle}</Badge>
          )}
          <Badge variant="warning">{PREMIUM_PROMO_FIRST_MONTH} month 1</Badge>
        </div>
        <h1 className="mt-4 font-mono text-2xl font-bold text-slate-100 sm:text-3xl">
          {page.h1}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-400 sm:text-lg">
          {page.intro}
        </p>
      </header>

      <PromoLandingCTA pageTitle={page.h1} />

      {page.demo && (
        <section aria-label="Interactive demo">
          <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-slate-500">
            Try free before you upgrade
          </h2>
          <LandingDemoWidget
            demo={page.demo}
            marketName={page.market?.name}
          />
        </section>
      )}

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

      <PromoLandingCTA pageTitle={page.h1} />

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
            Related FIRST100 offers
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {page.relatedSlugs.map((rel) => {
              const relPage = getPromoLandingPageBySlug(rel);
              if (!relPage) return null;
              return (
                <li key={rel}>
                  <Link
                    href={`/offers/${rel}`}
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