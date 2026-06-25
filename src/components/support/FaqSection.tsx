import { FAQ_CATEGORIES, getFaqsByCategory } from "@/lib/support";

interface FaqSectionProps {
  showCategories?: boolean;
  limitPerCategory?: number;
}

export function FaqSection({
  showCategories = true,
  limitPerCategory,
}: FaqSectionProps) {
  return (
    <div className="space-y-10">
      {FAQ_CATEGORIES.map((category) => {
        const faqs = getFaqsByCategory(category);
        const visible = limitPerCategory
          ? faqs.slice(0, limitPerCategory)
          : faqs;
        if (visible.length === 0) return null;

        return (
          <section key={category}>
            {showCategories && (
              <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
                {category}
              </h2>
            )}
            <div className="space-y-4">
              {visible.map((faq) => (
                <details
                  key={faq.id}
                  className="group rounded-lg border border-slate-800/40 bg-slate-900/20 open:border-cyan-accent/20"
                >
                  <summary className="cursor-pointer list-none px-4 py-4 font-mono text-sm font-semibold text-slate-200 marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-start justify-between gap-3">
                      {faq.question}
                      <span className="shrink-0 text-cyan-accent transition-transform group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  <div className="border-t border-slate-800/40 px-4 py-3">
                    <p className="text-sm leading-relaxed text-slate-400">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}