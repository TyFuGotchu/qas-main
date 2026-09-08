import type { Metadata } from "next";
import { E8ExecutionCenter } from "@/components/e8/E8ExecutionCenter";
import { rankingPageMetadata } from "@/lib/seo/page-metadata";
import {
  E8_FIRM_NAME,
  E8_HERO_SENTENCE,
  E8_PARTNER_LINE,
  E8_PUBLIC_PATH,
} from "@/lib/e8-partner";
import { E8_PRODUCTS, E8_RULES_CONFIRM } from "@/lib/e8-rules";
import { SEO_RECOVERY_REFRESHED } from "@/lib/seo/money-pages";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/json-ld";

const E8_PAGE_FAQS = [
  {
    question: "What is the E8 pack on Quicksilver?",
    answer:
      "An optional firm pack: E8 One / Pro / Signature rule maps, risk presets, hard flatten, and Direct Signup. You do not need an E8 account to use the rest of the Desk.",
  },
  {
    question: "Do Forex and Crypto use different E8 rules here?",
    answer:
      "No. Forex and Crypto share the same rule set on the current configurator. Official rules are set by E8 Markets.",
  },
  {
    question: "Does Quicksilver guarantee an E8 pass or payout?",
    answer:
      "No. Trading and prop evaluations are high risk. Official rules and live prices are set by E8 Markets. Quicksilver does not guarantee a pass or payout.",
  },
];

export const metadata: Metadata = rankingPageMetadata({
  title: "E8 Markets on Quicksilver | Optional Firm Pack",
  description:
    "Optional E8 Markets pack on Quicksilver: rule maps, presets, hard flatten, Direct Signup. Not required to use the Desk.",
  path: E8_PUBLIC_PATH,
  modifiedAt: SEO_RECOVERY_REFRESHED,
  keywords: [
    "E8 Markets",
    "TradeLocker",
    "hard flatten",
    "prop firm evaluation",
  ],
});

export default function FirmsE8Page() {
  return (
    <article className="e8-desk mx-auto max-w-5xl rounded-[18px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Firms", path: "/firms" },
            { name: "E8 Markets", path: E8_PUBLIC_PATH },
          ]),
          faqJsonLd(E8_PAGE_FAQS),
        ]}
      />
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#C9C2D6]">
        Affiliate disclosure: we may earn if you open E8 through our link.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-[4px] border border-[#B7B0D4]/30 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#B7B0D4]">
          {E8_PARTNER_LINE}
        </span>
      </div>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#F5F3FA] sm:text-4xl">
        {E8_FIRM_NAME} on Quicksilver
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#C9C2D6]">
        {E8_HERO_SENTENCE}
      </p>
      <div className="mt-10">
        <E8ExecutionCenter variant="full" context="public" />
      </div>
      <section className="mt-14 space-y-8">
        {E8_PRODUCTS.map((product) => (
          <div key={product.id}>
            <h2 className="text-xl font-semibold tracking-tight text-[#F5F3FA]">
              {product.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#C9C2D6]">
              {product.drawdownType}. Max DD {product.maxDdRange}. {product.dailyDd}.{" "}
              {product.pass}. {E8_RULES_CONFIRM}
            </p>
          </div>
        ))}
      </section>
    </article>
  );
}
