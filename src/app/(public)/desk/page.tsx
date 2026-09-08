import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { rankingPageMetadata } from "@/lib/seo/page-metadata";
import { SEO_RECOVERY_REFRESHED } from "@/lib/seo/money-pages";
import { LEGAL_FOOTER } from "@/lib/site-ia";

export const metadata: Metadata = rankingPageMetadata({
  title: "TradeLocker Trading Desk | Risk Presets & Hard Flatten",
  description:
    "TradeLocker risk desk: Rule Desk, presets, hard flatten, journal, live terminal. Works on any TradeLocker account. Optional Master Suite copy and Quant Protocol.",
  path: "/desk",
  modifiedAt: SEO_RECOVERY_REFRESHED,
  keywords: [
    "TradeLocker risk desk",
    "hard flatten",
    "daily drawdown",
    "TradeLocker presets",
  ],
});

export default function DeskPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#9AA3B2]">Desk</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#F3F5F7] sm:text-5xl">
        TradeLocker risk desk
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#C9C2D6]">
        Rule Desk, presets, hard flatten, journal, live terminal. Works on any
        TradeLocker account. You do not need an E8 account.
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#9AA3B2]">
        Flatten and presets apply to TradeLocker FX, metals, and indices. Arm flatten
        $100–$200 above the firm’s real drawdown limit. Flatten overrides copy.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/login">
          <Button variant="primary" size="lg">
            Start on the Desk
          </Button>
        </Link>
        <Link href="/copy">
          <Button variant="secondary" size="lg">
            Master Suite / Copy
          </Button>
        </Link>
        <Link href="/pricing">
          <Button variant="ghost" size="lg">
            Pricing
          </Button>
        </Link>
      </div>
      <ul className="mt-12 space-y-3 text-sm text-[#C9C2D6]">
        <li>Hard flatten — ARM / DISARM. Buffer above the firm’s DD floor.</li>
        <li>Journal and live terminal stay in the dashboard.</li>
        <li>Master Suite copy: TradingView webhook → TradeLocker. Off by default. Not live until the alert JSON is wired.</li>
        <li>Quant Protocol is TradeLocker Desktop and a separate Desk flag — not in Tools $39.99.</li>
      </ul>
      <p className="mt-10 font-mono text-[11px] leading-relaxed text-[#9AA3B2]">{LEGAL_FOOTER}</p>
    </article>
  );
}
