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
    question: "What is the E8 Execution Center?",
    answer:
      "It is Quicksilver’s TradeLocker workflow desk for E8 Markets evaluations: E8 One, E8 Pro, and E8 Signature rule maps, risk presets, and direct signup. Educational tools only.",
  },
  {
    question: "Do Forex and Crypto use different E8 rules here?",
    answer:
      "No. Forex and Crypto share the same rule set on the current E8 configurator. Official rules are set by E8 Markets.",
  },
  {
    question: "Does Quicksilver guarantee an E8 pass or payout?",
    answer:
      "No. Trading and prop evaluations are high risk. You can lose the evaluation fee and/or capital. Quicksilver does not guarantee a pass, payout, or funded account.",
  },
];

export const metadata: Metadata = rankingPageMetadata({
  title: "E8 Markets Execution Center | Quicksilver Algo",
  description:
    "TradeLocker workflow, E8 One / Pro / Signature rule maps, and risk presets. Educational tools only.",
  path: E8_PUBLIC_PATH,
  modifiedAt: SEO_RECOVERY_REFRESHED,
  keywords: [
    "E8 Markets",
    "E8 One",
    "E8 Pro",
    "E8 Signature",
    "TradeLocker",
    "prop firm evaluation",
    "daily drawdown",
    "dynamic drawdown",
    "static drawdown",
    "end of day drawdown",
    "Quicksilver risk presets",
  ],
});

export default function E8PublicPage() {
  return (
    <article className="e8-desk mx-auto max-w-5xl rounded-[18px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "E8 Execution Center", path: E8_PUBLIC_PATH },
          ]),
          faqJsonLd(E8_PAGE_FAQS),
        ]}
      />
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-[4px] border border-[#B7B0D4]/30 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#B7B0D4]">
          {E8_PARTNER_LINE}
        </span>
        <span className="rounded-[4px] border border-[#B7B0D4]/30 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#B7B0D4]">
          Exclusive
        </span>
      </div>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#F3F5F7] sm:text-4xl">
        {E8_FIRM_NAME} Execution Center
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#C9C2D6]">
        {E8_HERO_SENTENCE} Map E8 One, Pro, and Signature on the Rule Desk, then ARM
        Hard Equity-Stop. Not a guaranteed pass.
      </p>
      <div className="mt-10">
        <E8ExecutionCenter variant="full" context="public" />
      </div>

      <section className="mt-14 space-y-8">
        {E8_PRODUCTS.map((product) => (
          <div key={product.id}>
            <h2 className="text-xl font-semibold tracking-tight text-[#F3F5F7]">
              {product.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#C9C2D6]">
              {product.drawdownType}. Max DD {product.maxDdRange}. {product.dailyDd}.{" "}
              {product.pass}. {product.consistency}. {product.firstPayout}.{" "}
              {product.payoutSplit}. {product.activationFee}. Quicksilver preset:{" "}
              {product.preset}.
            </p>
          </div>
        ))}
        <p className="text-sm text-[#C9C2D6]">{E8_RULES_CONFIRM}</p>
      </section>
    </article>
  );
}
