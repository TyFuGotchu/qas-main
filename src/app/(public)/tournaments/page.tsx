import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import { rankingPageMetadata } from "@/lib/seo/page-metadata";
import { SEO_RECOVERY_REFRESHED } from "@/lib/seo/money-pages";
import {
  TOURNAMENT,
  TRALENT_SIGNUP_URL,
  TRALENT_TOURNAMENT_URL,
} from "@/lib/tournaments";

export const metadata: Metadata = rankingPageMetadata({
  title: "Quicksilver Trading Tournament | Tralent Forex 21 Sep",
  description:
    "$50 Forex tournament 21–22 Sep on Tralent. Signup + lobby links. Crypto deposit note for US.",
  path: "/tournaments",
  modifiedAt: SEO_RECOVERY_REFRESHED,
  keywords: ["Quicksilver tournament", "Tralent", "Forex tournament"],
});

export default function TournamentsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#9AA3B2]">
        {TOURNAMENT.title}
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#F3F5F7] sm:text-5xl">
        {TOURNAMENT.h1}
      </h1>
      <dl className="mt-8 space-y-3 text-sm text-[#C9C2D6]">
        <Row label="Host" value={TOURNAMENT.host} />
        <Row label="ID" value={TOURNAMENT.id} />
        <Row label="Market" value={`${TOURNAMENT.market}, ${TOURNAMENT.duration}`} />
        <Row
          label="Window"
          value={`${TOURNAMENT.start} → ${TOURNAMENT.end} (${TOURNAMENT.timeNote})`}
        />
        <Row label="Entry" value={TOURNAMENT.entry} />
        <Row label="Prize" value={TOURNAMENT.prize} />
        <Row label="Quantity" value={TOURNAMENT.quantityNote} />
        <Row label="US" value={TOURNAMENT.usNote} />
        <Row label="Custody" value={TOURNAMENT.custody} />
      </dl>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <a href={TRALENT_SIGNUP_URL} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" size="lg" className="w-full sm:w-auto">
            Create Tralent account
          </Button>
        </a>
        <a href={TRALENT_TOURNAMENT_URL} target="_blank" rel="noopener noreferrer">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            Open tournament lobby
          </Button>
        </a>
      </div>
      <p className="mt-6 text-sm text-[#C9C2D6]">{TOURNAMENT.howTo}</p>
      <p className="mt-8 font-mono text-[11px] leading-relaxed text-[#9AA3B2]">
        {TOURNAMENT.disclaimer}
      </p>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9AA3B2]">
        {label}
      </dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
