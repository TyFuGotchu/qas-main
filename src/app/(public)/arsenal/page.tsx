import type { Metadata } from "next";
import Link from "next/link";
import { ArsenalRequestForm } from "@/components/arsenal/ArsenalRequestForm";
import { rankingPageMetadata } from "@/lib/seo/page-metadata";
import { SEO_RECOVERY_REFRESHED } from "@/lib/seo/money-pages";
import {
  ARSENAL_INCLUDED,
  ARSENAL_NOT_OFFERED,
  ARSENAL_ON_REQUEST,
  LEGAL_FOOTER,
} from "@/lib/site-ia";

export const metadata: Metadata = rankingPageMetadata({
  title: "Quicksilver Arsenal | Rule Packs & Flatten for Prop Firms",
  description:
    "White-label TradeLocker rule packs and hard flatten for prop firms. Setup + monthly. Modules extra. No pass-rate promise.",
  path: "/arsenal",
  modifiedAt: SEO_RECOVERY_REFRESHED,
  keywords: [
    "prop firm trading tools",
    "white label TradeLocker",
    "drawdown protection software",
    "rule enforcement",
  ],
});

export default function ArsenalPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#9AA3B2]">Arsenal</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#F3F5F7] sm:text-5xl">
        Rule packs and flatten for prop firms
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#C9C2D6]">
        Firms lose accounts to daily and max drawdown. Arsenal maps published rules
        into TradeLocker presets and a hard flatten with a $100–$200 buffer. White-label.
        Quote-based: setup + monthly + optional per-account. Modules extra.
      </p>
      <p className="mt-3 text-sm text-[#9AA3B2]">
        TradeLocker now. MT5 after a paying TL firm. cTrader on request. TradingView
        companion later. We do not sell KYC, payout engines, spy tools, or pass-rate SLAs.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <Column title="Included" items={ARSENAL_INCLUDED} />
        <Column title="On request" items={ARSENAL_ON_REQUEST} />
        <Column title="Not offered" items={ARSENAL_NOT_OFFERED} />
      </div>
      <div className="mt-6">
        <Link href="/arsenal/modules" className="font-mono text-sm text-[#7FE7DC] hover:underline">
          Module list →
        </Link>
      </div>
      <div id="request" className="mt-12 max-w-lg scroll-mt-28">
        <h2 className="text-xl font-semibold text-[#F3F5F7]">Request a pack</h2>
        <p className="mt-2 text-sm text-[#C9C2D6]">
          No pass-rate promise. We map the rules you publish.
        </p>
        <div className="mt-6">
          <ArsenalRequestForm />
        </div>
      </div>
      <p className="mt-10 font-mono text-[11px] leading-relaxed text-[#9AA3B2]">{LEGAL_FOOTER}</p>
    </article>
  );
}

function Column({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="rounded-[12px] border border-white/[0.08] bg-[#0B0D12] p-4">
      <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-[#7FE7DC]">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm text-[#C9C2D6]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
