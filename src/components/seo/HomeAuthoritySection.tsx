import Link from "next/link";
import {
  HOMEPAGE_AUTHORITY_BLOCKS,
  HOMEPAGE_FAQS,
  SEO_RECOVERY_REFRESHED,
} from "@/lib/seo/money-pages";

/**
 * Crawlable, unique homepage body content + visible FAQ (matches FAQ schema).
 * Critical for recovery after thin/programmatic demotion.
 */
export function HomeAuthoritySection() {
  return (
    <section
      aria-labelledby="authority-content-heading"
      className="border-t border-slate-800/60 px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-3xl">
        <p className="mb-6 text-center font-mono text-[10px] uppercase tracking-widest text-slate-600">
          Updated {SEO_RECOVERY_REFRESHED}
        </p>
        <h2
          id="authority-content-heading"
          className="text-center font-mono text-2xl font-bold text-slate-200"
        >
          Why traders use Quicksilver Algo
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-500">
          Straight answers on the bot, the playbook, and prop firm challenge structure —
          not filler landing pages.
        </p>

        <div className="mt-10 space-y-10">
          {HOMEPAGE_AUTHORITY_BLOCKS.map((block) => (
            <div key={block.heading}>
              <h3 className="font-mono text-base font-semibold text-slate-200">
                {block.heading}
              </h3>
              {block.paragraphs.map((p) => (
                <p
                  key={p.slice(0, 48)}
                  className="mt-3 text-sm leading-relaxed text-slate-400"
                >
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3 font-mono text-xs">
          <Link href="/quant-protocol" className="text-cyan-400 hover:underline">
            Quant Protocol access →
          </Link>
          <Link href="/launch" className="text-cyan-400 hover:underline">
            7-Day Playbook →
          </Link>
          <Link href="/prop-firm" className="text-cyan-400 hover:underline">
            Prop firm guides →
          </Link>
          <Link
            href="/guides/break-of-structure"
            className="text-cyan-400 hover:underline"
          >
            Break of structure →
          </Link>
        </div>

        <div className="mt-16">
          <h2 className="text-center font-mono text-xl font-bold text-slate-200">
            Frequently asked questions
          </h2>
          <div className="mt-8 space-y-4">
            {HOMEPAGE_FAQS.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-5"
              >
                <h3 className="font-mono text-sm font-semibold text-slate-200">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
