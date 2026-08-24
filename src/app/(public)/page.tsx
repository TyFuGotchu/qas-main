import type { Metadata } from "next";
import { Hero } from "@/components/landing/Hero";
import {
  HomeAudience,
  HomeFaq,
  HomeFinalCta,
  HomePlaybook,
  HomePremiumStack,
  HomeQuantProtocol,
  HomeSocialProof,
  HomeToolsAcademy,
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
import { getPremiumCheckoutUrl, PREMIUM_PRICE } from "@/lib/pricing-constants";

export const metadata: Metadata = rankingPageMetadata({
  title: "TradeLocker Prop-Challenge Operating System | Quicksilver Algo",
  description:
    "Quicksilver is the operating system for TradeLocker Desktop traders: daily loss control, consistency discipline, 7-Day Playbook, and optional Quant Protocol. $149.99/mo, cancel anytime. Educational tools only.",
  path: "/",
  modifiedAt: SEO_RECOVERY_REFRESHED,
  keywords: [
    "prop firm challenge playbook",
    "TradeLocker Desktop bot",
    "Quicksilver Quant Protocol",
    "prop firm consistency rule",
    "trading risk calculator",
  ],
});

export default function LandingPage() {
  const priceNum = Number.parseFloat(PREMIUM_PRICE.replace(/[^0-9.]/g, "")) || 149.99;
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
      description:
        "TradeLocker Quant Protocol, 7-Day Prop Firm Playbook, planning tools, Chart Academy, and live terminal.",
      path: "/",
      price: priceNum,
      checkoutUrl: getPremiumCheckoutUrl(),
      category: "FinanceApplication",
      datePublished: SEO_RECOVERY_REFRESHED,
    }),
  ];

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <Hero />
      <HomeSocialProof />
      <HomeAudience />
      <HomePremiumStack />
      <HomeQuantProtocol />
      <HomePlaybook />
      <HomeToolsAcademy />
      <TraderFeedback />
      <HomeFaq />
      <HomeFinalCta />
      <StickyMobileCta />
    </>
  );
}
