import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { rankingPageMetadata } from "@/lib/seo/page-metadata";
import { SEO_RECOVERY_REFRESHED } from "@/lib/seo/money-pages";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { organizationJsonLd, websiteJsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { TournamentBanner } from "@/components/marketing/TournamentBanner";
import { HOME_H1, LEGAL_FOOTER, SITE_POSITIONING } from "@/lib/site-ia";
import { E8_PUBLIC_PATH } from "@/lib/e8-partner";

export const metadata: Metadata = rankingPageMetadata({
  title: "Quicksilver Algo Systems | TradeLocker Desk & Prop Firm Arsenals",
  description: `${SITE_POSITIONING} Tools $39.99, Copy $99, Full $119.99. Educational software. High risk.`,
  path: "/",
  modifiedAt: SEO_RECOVERY_REFRESHED,
  keywords: [
    "TradeLocker risk desk",
    "hard flatten",
    "prop firm trading tools",
    "white label TradeLocker",
    "TradingView webhook TradeLocker",
  ],
});

export default function LandingPage() {
  return (
    <>
      <JsonLdScript
        data={[
          websiteJsonLd(),
          organizationJsonLd(),
          breadcrumbJsonLd([{ name: "Home", path: "/" }]),
        ]}
      />
      <TournamentBanner />
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#9AA3B2]">
            Quicksilver Algo Systems
          </p>
          <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-[#F3F5F7] sm:text-5xl">
            {HOME_H1}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#C9C2D6]">
            {SITE_POSITIONING} The Desk works on any TradeLocker account.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/desk">
              <Button variant="primary" size="lg">
                Start on the Desk
              </Button>
            </Link>
            <Link href="/arsenal">
              <Button variant="secondary" size="lg">
                Request an Arsenal
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost" size="lg">
                Pricing
              </Button>
            </Link>
          </div>
          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            <article className="rounded-[16px] border border-white/[0.1] bg-[#0B0D12] p-6">
              <h2 className="text-xl font-semibold text-[#F3F5F7]">Desk for traders</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#C9C2D6]">
                Rule Desk, presets, hard flatten, journal, live terminal. Optional Master
                Suite copy (TV webhook → TradeLocker). Optional Quant Protocol on Desktop.
              </p>
              <Link href="/desk" className="mt-4 inline-block font-mono text-sm text-[#7FE7DC] hover:underline">
                Open Desk →
              </Link>
            </article>
            <article className="rounded-[16px] border border-white/[0.1] bg-[#0B0D12] p-6">
              <h2 className="text-xl font-semibold text-[#F3F5F7]">Arsenal for firms</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#C9C2D6]">
                Map published rules into TradeLocker presets and flatten. White-label.
                Quote-based. Brokers second.
              </p>
              <Link href="/arsenal" className="mt-4 inline-block font-mono text-sm text-[#7FE7DC] hover:underline">
                Request a pack →
              </Link>
            </article>
          </div>
          <aside className="mt-12 text-sm text-[#9AA3B2]">
            Optional firm pack:{" "}
            <Link href={E8_PUBLIC_PATH} className="text-[#7FE7DC] hover:underline">
              E8 Markets
            </Link>
            . Not required.
          </aside>
          <p className="mt-10 max-w-2xl font-mono text-[11px] leading-relaxed text-[#9AA3B2]">
            {LEGAL_FOOTER}
          </p>
        </div>
      </section>
    </>
  );
}
