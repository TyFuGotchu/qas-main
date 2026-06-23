const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quicksilveralgo.com";
const PUBLISHER = {
  "@type": "Organization" as const,
  name: "Quicksilver Algo System",
  url: SITE_URL,
};

export function articleJsonLd(params: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  section?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.title,
    description: params.description,
    url: `${SITE_URL}/lessons/${params.slug}`,
    datePublished: params.publishedAt,
    dateModified: params.publishedAt,
    author: PUBLISHER,
    publisher: {
      ...PUBLISHER,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.ico`,
      },
    },
    mainEntityOfPage: `${SITE_URL}/lessons/${params.slug}`,
    articleSection: params.section,
  };
}

export function guideArticleJsonLd(params: {
  title: string;
  description: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.title,
    description: params.description,
    url: `${SITE_URL}/guides/${params.slug}`,
    author: PUBLISHER,
    publisher: PUBLISHER,
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function landingPageJsonLd(params: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: params.title,
    description: params.description,
    url: `${SITE_URL}/solutions/${params.slug}`,
    datePublished: params.publishedAt,
    dateModified: params.publishedAt,
    publisher: PUBLISHER,
    isPartOf: {
      "@type": "WebSite",
      name: "Quicksilver Algo System",
      url: SITE_URL,
    },
  };
}

export function serializeJsonLd(data: object | object[]) {
  return JSON.stringify(data);
}