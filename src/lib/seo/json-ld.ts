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

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function subscriptionProductJsonLd(params: {
  name: string;
  description: string;
  path: string;
  price: number;
  priceCurrency?: string;
  billingPeriod?: "MON" | "YEAR";
  checkoutUrl: string;
  category: string;
  datePublished?: string;
}) {
  const pageUrl = `${SITE_URL}${params.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: params.name,
    description: params.description,
    url: pageUrl,
    applicationCategory: params.category,
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript. Modern browser.",
    datePublished: params.datePublished,
    author: AUTHORITY_AUTHOR,
    publisher: PUBLISHER,
    offers: {
      "@type": "Offer",
      url: params.checkoutUrl,
      price: params.price.toFixed(2),
      priceCurrency: params.priceCurrency ?? "USD",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2027-12-31",
      seller: PUBLISHER,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: params.price.toFixed(2),
        priceCurrency: params.priceCurrency ?? "USD",
        billingDuration: 1,
        unitCode: params.billingPeriod ?? "MON",
      },
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Quicksilver Algo System",
      url: SITE_URL,
    },
  };
}

export function productWebPageJsonLd(params: {
  name: string;
  description: string;
  path: string;
  datePublished?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: params.name,
    description: params.description,
    url: `${SITE_URL}${params.path}`,
    datePublished: params.datePublished,
    dateModified: params.datePublished,
    publisher: PUBLISHER,
    isPartOf: {
      "@type": "WebSite",
      name: "Quicksilver Algo System",
      url: SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: params.name,
      description: params.description,
    },
  };
}

export function serializeJsonLd(data: object | object[]) {
  return JSON.stringify(data);
}