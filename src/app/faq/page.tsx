import type { Metadata } from "next";
import { FaqSection } from "@/components/support/FaqSection";
import { SupportContactPanel } from "@/components/support/SupportContactPanel";
import { Badge } from "@/components/ui/Badge";
import { SITE_FAQS, SUPPORT_EMAIL } from "@/lib/support";
import { faqJsonLd } from "@/lib/seo/json-ld";
import { JsonLdScript } from "@/components/seo/JsonLdScript";

export const metadata: Metadata = {
  title: "FAQ — Quicksilver Algo",
  description: `Frequently asked questions about Quicksilver Premium, Chart Academy, trading tools, TradeLocker bot, and billing. Still need help? Email ${SUPPORT_EMAIL}.`,
};

export default function FaqPage() {
  const jsonLd = faqJsonLd(
    SITE_FAQS.map((f) => ({ question: f.question, answer: f.answer }))
  );

  return (
    <div className="space-y-12">
      <JsonLdScript data={jsonLd} />

      <header>
        <Badge variant="success" className="mb-3">
          {SITE_FAQS.length} answers
        </Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-100 sm:text-4xl">
          Frequently Asked <span className="text-cyan-terminal">Questions</span>
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Billing, academy, tools, TradeLocker, and account help. Can&apos;t find
          your answer? Email{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-cyan-accent hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </header>

      <FaqSection />

      <section>
        <h2 className="mb-4 font-mono text-lg font-bold text-slate-200">
          Still need help?
        </h2>
        <SupportContactPanel variant="compact" />
      </section>
    </div>
  );
}