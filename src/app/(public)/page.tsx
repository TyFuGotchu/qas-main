import type { Metadata } from "next";
import { Hero } from "@/components/landing/Hero";
import {
  HomeE8Presets,
  HomeE8Promos,
  HomeFaq,
  HomeFinalCta,
  HomeLiveGrowth,
  HomePricingChooser,
  HomeQuantProtocol,
  HomeWhyE8,
} from "@/components/landing/HomeSections";
import { TraderFeedback } from "@/components/landing/TraderFeedback";
import { StickyMobileCta } from "@/components/marketing/StickyMobileCta";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
  organizationJsonLd,
  websiteJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  moneyPageItemListJsonLd,
  subscriptionProductJsonLd,
} from "@/lib/seo/json-ld";
import { rankingPageMetadata } from "@/lib/seo/page-metadata";
import { MONEY_PAGES, SEO_RECOVERY_REFRESHED } from "@/lib/seo/money-pages";
import { HOME_FAQS } from "@/lib/homepage-copy";
import {
  getDiscountCheckoutUrl,
  PREMIUM_PRICE_NUMBER,
} from "@/lib/pricing-constants";
import { E8_POSITIONING } from "@/lib/e8-partner";

export const metadata: Metadata = rankingPageMetadata({
  title: "E8 Markets Partner | TradeLocker Trading OS | Quicksilver Algo",
  description: `${E8_POSITIONING} Structure, risk presets, journaling, live growth tools, and optional Quant Protocol. 3-day free trial (bot not included) or first month 30% off. Educational tools only.`,
  path: "/",
  modifiedAt: SEO_RECOVERY_REFRESHED,
  keywords: [
    "E8 Markets",
    "E8 Execution Center",
    "TradeLocker Desktop trading OS",
    "trading journal and risk workflow",
    "live growth terminal",
    "Quicksilver Quant Protocol",
  ],
});

export default function LandingPage() {
  const jsonLd = [
    websiteJsonLd(),
    organizationJsonLd(),
    breadcrumbJsonLd([{ name: "Home", path: "/" }]),
    faqJsonLd(HOME_FAQS),
    moneyPageItemListJsonLd(
      MONEY_PAGES.filter((p) => p.priority === "core").map((p) => ({
        name: p.title,
        path: p.href === "/" ? "/" : p.href,
        description: p.description,
      }))
    ),
    subscriptionProductJsonLd({
      name: "Premium Quant — Quicksilver Algo",
      description: `${E8_POSITIONING} Workflow stack, live growth terminal, E8 Execution Center, optional Quant Protocol.`,
      path: "/",
      price: PREMIUM_PRICE_NUMBER,
      checkoutUrl: getDiscountCheckoutUrl(),
      category: "FinanceApplication",
      datePublished: SEO_RECOVERY_REFRESHED,
    }),
  ];

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <Hero />
      <HomeWhyE8 />
      <HomeE8Presets />
      <HomeE8Promos />
      <HomeLiveGrowth />
      <HomeQuantProtocol />
      <HomePricingChooser />
      <HomeFaq />
      <TraderFeedback />
      <HomeFinalCta />
      <StickyMobileCta />
    </>
  );
}
