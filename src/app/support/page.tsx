import type { Metadata } from "next";
import Link from "next/link";
import { SupportContactPanel } from "@/components/support/SupportContactPanel";
import { FaqSection } from "@/components/support/FaqSection";
import { Badge } from "@/components/ui/Badge";
import { SUPPORT_EMAIL, SUPPORT_HOURS } from "@/lib/support";
import { faqJsonLd } from "@/lib/seo/json-ld";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { SITE_FAQS } from "@/lib/support";

export const metadata: Metadata = {
  title: "Support — Quicksilver Algo",
  description: `Contact Quicksilver support at ${SUPPORT_EMAIL}. Billing, TradeLocker, Chart Academy, and technical help. ${SUPPORT_HOURS}.`,
};

export default function SupportPage() {
  const jsonLd = faqJsonLd(
    SITE_FAQS.slice(0, 8).map((f) => ({
      question: f.question,
      answer: f.answer,
    }))
  );

  return (
    <div className="space-y-12">
      <JsonLdScript data={jsonLd} />

      <header>
        <Badge variant="success" className="mb-3">
          Email support only
        </Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-100 sm:text-4xl">
          Quicksilver <span className="text-cyan-terminal">Support</span>
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          All support is handled by email at{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-cyan-accent hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
          . Choose a topic below or browse the FAQ for instant answers.
        </p>
      </header>

      <SupportContactPanel />

      <section>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-mono text-lg font-bold text-slate-200">
            Common questions
          </h2>
          <Link
            href="/faq"
            className="font-mono text-xs text-cyan-accent hover:underline"
          >
            Full FAQ →
          </Link>
        </div>
        <FaqSection showCategories={false} limitPerCategory={2} />
      </section>
    </div>
  );
}