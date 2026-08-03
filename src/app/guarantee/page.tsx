import type { Metadata } from "next";
import Link from "next/link";
import { MoneyBackGuarantee } from "@/components/marketing/MoneyBackGuarantee";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  GUARANTEE_FAQ,
  GUARANTEE_HEADLINE,
  GUARANTEE_POLICY_SECTIONS,
  GUARANTEE_TAGLINE,
} from "@/lib/money-back-guarantee";
import {
  getPremiumCheckoutUrl,
  PREMIUM_PRICE,
} from "@/lib/pricing-constants";
import { SUPPORT_EMAIL } from "@/lib/support";

import { rankingPageMetadata, SEO_CONTENT_REFRESHED } from "@/lib/seo/page-metadata";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { AuthorityCrossLinks } from "@/components/seo/AuthorityCrossLinks";

export const metadata: Metadata = rankingPageMetadata({
  title: "30-Day Prop Firm Playbook Money-Back Guarantee",
  description:
    "Complete the 7-Day Prop Firm Playbook within 30 days of Premium — full first-month refund if not satisfied. Clear eligibility and how to claim.",
  path: "/guarantee",
  modifiedAt: SEO_CONTENT_REFRESHED,
  keywords: [
    "prop firm tools money back guarantee",
    "trading software refund",
    "Quicksilver guarantee",
  ],
});

export default function GuaranteePage() {
  const checkoutUrl = getPremiumCheckoutUrl();
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Money-Back Guarantee", path: "/guarantee" },
    ]),
    faqJsonLd([...GUARANTEE_FAQ]),
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-12 sm:px-6">
      <JsonLdScript data={jsonLd} />
      <header className="text-center">
        <Badge variant="success" className="mb-4">
          Risk-free Premium
        </Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-100 sm:text-4xl">
          {GUARANTEE_HEADLINE}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-400">
          {GUARANTEE_TAGLINE}
        </p>
      </header>

      <MoneyBackGuarantee variant="panel" showLink={false} />

      {GUARANTEE_POLICY_SECTIONS.map((section) => (
        <section key={section.heading}>
          <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
            {section.heading}
          </h2>
          <div className="mt-4 space-y-3">
            {section.paragraphs.map((p) => (
              <p key={p} className="leading-relaxed text-slate-400">
                {p}
              </p>
            ))}
          </div>
          {section.listItems && (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-400">
              {section.listItems.map((item) => (
                <li key={item} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <section>
        <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-slate-500">
          Guarantee FAQ
        </h2>
        <div className="space-y-4">
          {GUARANTEE_FAQ.map((faq) => (
            <div
              key={faq.question}
              className="rounded-lg border border-slate-800/40 p-4"
            >
              <h3 className="font-mono text-sm font-semibold text-slate-200">
                {faq.question}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-xl border border-cyan-accent/30 bg-cyan-accent/5 p-6 text-center">
        <p className="font-mono text-sm text-slate-300">
          Ready to run the system risk-free?
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="lg">
              Subscribe — {PREMIUM_PRICE}
            </Button>
          </a>
          <Link href="/register">
            <Button variant="secondary" size="lg">
              Create Free Account First
            </Button>
          </Link>
        </div>
        <p className="mt-4 font-mono text-xs text-slate-600">
          Questions? {SUPPORT_EMAIL}
        </p>
      </div>

      <AuthorityCrossLinks currentPath="/guarantee" />
    </div>
  );
}