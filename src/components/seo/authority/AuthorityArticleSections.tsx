import type { AuthoritySection } from "@/lib/seo/prop-firm-authority/types";

function SectionHeading({
  level,
  children,
}: {
  level: 2 | 3 | 4;
  children: React.ReactNode;
}) {
  if (level === 2) {
    return (
      <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
        {children}
      </h2>
    );
  }
  if (level === 3) {
    return (
      <h3 className="font-mono text-sm font-semibold text-slate-200">{children}</h3>
    );
  }
  return <h4 className="font-mono text-xs font-semibold text-slate-300">{children}</h4>;
}

export function AuthorityArticleSections({ sections }: { sections: AuthoritySection[] }) {
  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section key={`${section.level}-${section.heading}`}>
          <SectionHeading level={section.level}>{section.heading}</SectionHeading>
          {section.paragraphs.length > 0 && (
            <div className="mt-4 space-y-3">
              {section.paragraphs.map((para) => (
                <p key={para} className="leading-relaxed text-slate-400">
                  {para}
                </p>
              ))}
            </div>
          )}
          {section.listItems && section.listItems.length > 0 && (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-400">
              {section.listItems.map((item) => (
                <li key={item} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          )}
          {section.orderedItems && section.orderedItems.length > 0 && (
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-400">
              {section.orderedItems.map((item) => (
                <li key={item} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ol>
          )}
        </section>
      ))}
    </div>
  );
}

export function AuthorityFaqSection({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  return (
    <section>
      <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-slate-500">
        FAQ
      </h2>
      <div className="space-y-4">
        {faqs.map((faq) => (
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
  );
}