import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { rankingPageMetadata } from "@/lib/seo/page-metadata";
import { SEO_RECOVERY_REFRESHED } from "@/lib/seo/money-pages";
import { E8_FIRM_NAME, E8_PUBLIC_PATH } from "@/lib/e8-partner";
import { LEGAL_FOOTER } from "@/lib/site-ia";

export const metadata: Metadata = rankingPageMetadata({
  title: "Firms on Quicksilver | Optional Packs",
  description:
    "Optional firm packs on the Quicksilver Desk. E8 Markets is card one. Add your firm via Arsenal.",
  path: "/firms",
  modifiedAt: SEO_RECOVERY_REFRESHED,
});

export default function FirmsIndexPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#9AA3B2]">Firms</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#F3F5F7]">
        Firm packs
      </h1>
      <p className="mt-4 max-w-2xl text-base text-[#C9C2D6]">
        Optional. The Desk works without any of these. E8 is listed first because it is
        the current collab option — not because it is the product.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href={E8_PUBLIC_PATH}
          className="rounded-[12px] border border-white/[0.1] bg-[#0B0D12] p-5 hover:border-[#7FE7DC]/40"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7FE7DC]">
            Card 1
          </p>
          <h2 className="mt-2 text-lg font-semibold text-[#F3F5F7]">{E8_FIRM_NAME}</h2>
          <p className="mt-2 text-sm text-[#C9C2D6]">
            Optional pack: Rule Desk, presets, hard flatten, Direct Signup.
          </p>
        </Link>
        <Link
          href="/arsenal#request"
          className="rounded-[12px] border border-dashed border-white/[0.14] bg-transparent p-5 hover:border-[#7FE7DC]/40"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9AA3B2]">
            Add your firm
          </p>
          <h2 className="mt-2 text-lg font-semibold text-[#F3F5F7]">Empty slot</h2>
          <p className="mt-2 text-sm text-[#C9C2D6]">Request an Arsenal pack.</p>
        </Link>
      </div>
      <div className="mt-8">
        <Link href="/arsenal">
          <Button variant="secondary">Request an Arsenal</Button>
        </Link>
      </div>
      <p className="mt-10 font-mono text-[11px] text-[#9AA3B2]">{LEGAL_FOOTER}</p>
    </article>
  );
}
