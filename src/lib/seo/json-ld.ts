const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quicksilveralgo.com";
const PUBLISHER = {
  "@type": "Organization" as const,
  name: "Quicksilver Algo System",
  url: SITE_URL,
};

export const AUTHORITY_AUTHOR = {
  "@type": "Person" as const,
  name: "Quicksilver Lead Dev",
  worksFor: PUBLISHER,
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
        url: `${SITE_URL}/icon.png`,
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
  pathPrefix?: string;
}) {
  const base = params.pathPrefix ?? "/solutions";
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: params.title,
    description: params.description,
    url: `${SITE_URL}${base}/${params.slug}`,
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

export function promoOfferJsonLd(params: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  promoCode: string;
  fullPrice: string;
  discountedPrice: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: params.title,
    description: params.description,
    url: `${SITE_URL}/offers/${params.slug}`,
    price: params.discountedPrice.replace(/[^0-9.]/g, ""),
    priceCurrency: "USD",
    priceValidUntil: "2026-12-31",
    availability: "https://schema.org/LimitedAvailability",
    validFrom: params.publishedAt,
    seller: PUBLISHER,
    eligibleQuantity: {
      "@type": "QuantitativeValue",
      maxValue: 100,
      unitText: "redemptions",
    },
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: params.discountedPrice.replace(/[^0-9.]/g, ""),
      priceCurrency: "USD",
      referenceQuantity: {
        "@type": "QuantitativeValue",
        value: 1,
        unitCode: "MON",
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "promoCode",
        value: params.promoCode,
      },
      {
        "@type": "PropertyValue",
        name: "regularPrice",
        value: params.fullPrice,
      },
    ],
  };
}

export function authorityArticleJsonLd(params: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  pathPrefix: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.title,
    description: params.description,
    url: `${SITE_URL}${params.pathPrefix}/${params.slug}`,
    datePublished: params.publishedAt,
    dateModified: params.publishedAt,
    author: AUTHORITY_AUTHOR,
    publisher: {
      ...PUBLISHER,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.png`,
      },
    },
    mainEntityOfPage: `${SITE_URL}${params.pathPrefix}/${params.slug}`,
    articleSection: "Prop Firm Trading",
  };
}

export function softwareApplicationJsonLd(params: {
  name: string;
  description: string;
  slug: string;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: params.name,
    description: params.description,
    url: `${SITE_URL}/tools/${params.slug}`,
    applicationCategory: params.category,
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free preview; full access with Quicksilver Premium",
    },
    author: AUTHORITY_AUTHOR,
    publisher: PUBLISHER,
  };
}

export function serializeJsonLd(data: object | object[]) {
  return JSON.stringify(data);
}