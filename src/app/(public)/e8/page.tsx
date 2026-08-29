import type { Metadata } from "next";
import { E8ExecutionCenter } from "@/components/e8/E8ExecutionCenter";
import { rankingPageMetadata } from "@/lib/seo/page-metadata";
import {
  E8_COMPLIANCE_BLOCK,
  E8_FIRM_NAME,
  E8_OVERVIEW,
  E8_PARTNER_LINE,
  E8_POSITIONING,
  E8_PUBLIC_PATH,
} from "@/lib/e8-partner";
import { SEO_RECOVERY_REFRESHED } from "@/lib/seo/money-pages";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = rankingPageMetadata({
  title: "E8 Execution Center | Official E8 Markets Partner | Quicksilver",
  description: `${E8_POSITIONING} ${E8_OVERVIEW.subtitle} Educational tools only. Not a guaranteed pass.`,
  path: E8_PUBLIC_PATH,
  modifiedAt: SEO_RECOVERY_REFRESHED,
  keywords: [
    "E8 Markets",
    "E8 Execution Center",
    "Quicksilver E8 partner",
    "TradeLocker prop evaluation",
  ],
});

export default function E8PublicPage() {
  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "E8 Execution Center", path: E8_PUBLIC_PATH },
        ])}
      />
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-indigo-300">
        {E8_PARTNER_LINE}
      </p>
      <h1 className="mt-4 font-mono text-3xl font-bold text-white sm:text-4xl">
        {E8_FIRM_NAME} Execution Center
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
        {E8_POSITIONING}
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
        {E8_COMPLIANCE_BLOCK}
      </p>
      <div className="mt-10">
        <E8ExecutionCenter variant="full" context="public" />
      </div>
    </article>
  );
}
