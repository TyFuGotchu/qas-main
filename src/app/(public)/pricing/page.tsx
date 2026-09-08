import type { Metadata } from "next";
import Link from "next/link";
import { StripeBuyButton } from "@/components/billing/StripeBuyButton";
import { CONSUMER_PLANS } from "@/lib/plans";
import { rankingPageMetadata } from "@/lib/seo/page-metadata";
import { SEO_RECOVERY_REFRESHED } from "@/lib/seo/money-pages";
import { LEGAL_FOOTER } from "@/lib/site-ia";

export const metadata: Metadata = rankingPageMetadata({
  title: "Quicksilver Pricing | Tools $39.99, Copy $99, Full $119.99",
  description:
    "Consumer plans: Tools $39.99, Copy $99, Full $119.99. Arsenal for firms is quote-based. No public coupons.",
  path: "/pricing",
  modifiedAt: SEO_RECOVERY_REFRESHED,
  keywords: ["Quicksilver pricing", "TradeLocker desk", "TradingView webhook TradeLocker"],
});

export default function PricingPage() {
  return (
    <article className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#9AA3B2]">Pricing</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#F3F5F7] sm:text-5xl">
        Tools $39.99. Copy $99. Full $119.99.
      </h1>
      <p className="mt-4 max-w-2xl text-base text-[#C9C2D6]">
        No public coupons. Quant Protocol stays a separate Desk flag — not inside Tools.
        Arsenal for prop firms is quoted separately.
      </p>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {CONSUMER_PLANS.map((plan) => (
          <article
            key={plan.id}
            className="flex flex-col rounded-[16px] border border-white/[0.1] bg-[#0B0D12] p-6"
          >
            <h2 className="font-mono text-sm uppercase tracking-[0.14em] text-[#7FE7DC]">
              {plan.name}
            </h2>
            <p className="mt-3 text-3xl font-semibold text-white">
              {plan.price}
              <span className="ml-1 text-base font-normal text-[#9AA3B2]">{plan.period}</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#C9C2D6]">{plan.summary}</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-[#C9C2D6]">
              {plan.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {"splitNote" in plan && plan.splitNote && (
              <p className="mt-3 text-xs text-[#9AA3B2]">{plan.splitNote}</p>
            )}
            <div className="mt-6">
              <StripeBuyButton buyButtonId={plan.buyButtonId} />
            </div>
          </article>
        ))}
      </div>
      <p className="mt-8 text-sm text-[#C9C2D6]">
        Profit-split for Copy is request-only.{" "}
        <Link href="/arsenal" className="text-[#7FE7DC] hover:underline">
          Request
        </Link>
        . No fourth buy button.
      </p>
      <p className="mt-6 font-mono text-[11px] leading-relaxed text-[#9AA3B2]">{LEGAL_FOOTER}</p>
    </article>
  );
}
