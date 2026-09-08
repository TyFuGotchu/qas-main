import type { Metadata } from "next";
import Link from "next/link";
import { rankingPageMetadata } from "@/lib/seo/page-metadata";
import { SEO_RECOVERY_REFRESHED } from "@/lib/seo/money-pages";
import { ARSENAL_INCLUDED, ARSENAL_NOT_OFFERED, ARSENAL_ON_REQUEST } from "@/lib/site-ia";

export const metadata: Metadata = rankingPageMetadata({
  title: "Arsenal Modules | Quicksilver",
  description: "Included, on-request, and refused Arsenal modules for prop firms.",
  path: "/arsenal/modules",
  modifiedAt: SEO_RECOVERY_REFRESHED,
});

export default function ArsenalModulesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link href="/arsenal" className="font-mono text-xs text-[#7FE7DC] hover:underline">
        ← Arsenal
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-[#F3F5F7]">Modules</h1>
      <Section title="Included" items={ARSENAL_INCLUDED} />
      <Section title="On request (build + monthly)" items={ARSENAL_ON_REQUEST} />
      <Section title="Not offered" items={ARSENAL_NOT_OFFERED} />
    </article>
  );
}

function Section({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <section className="mt-8">
      <h2 className="font-mono text-sm uppercase tracking-[0.14em] text-[#9AA3B2]">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm text-[#C9C2D6]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
