import { TESTIMONIALS_DISCLAIMER, TRADER_PULL_QUOTES, TRADER_TESTIMONIALS } from "@/lib/testimonials";

export function TraderFeedback() {
  return (
    <section className="border-t border-slate-800/60 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-mono text-2xl font-bold text-slate-50">
          Trader Feedback
        </h2>
        <p className="mt-2 text-center font-mono text-sm text-slate-500">
          What operators say after using the stack.
        </p>
        <div className="mt-8 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-3">
          {TRADER_TESTIMONIALS.map((t) => (
            <article
              key={t.name}
              className="min-w-[85%] snap-center rounded-xl border border-slate-800/60 bg-slate-950/50 p-5 md:min-w-0"
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-500">
                {t.tag}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">“{t.quote}”</p>
              <p className="mt-4 font-mono text-xs text-slate-200">{t.name}</p>
              <p className="font-mono text-[11px] text-slate-500">{t.role}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {TRADER_PULL_QUOTES.map((q) => (
            <p
              key={q}
              className="rounded-full border border-slate-800/80 px-4 py-2 font-mono text-[11px] text-slate-400"
            >
              {q}
            </p>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-[11px] leading-relaxed text-slate-600">
          {TESTIMONIALS_DISCLAIMER}
        </p>
      </div>
    </section>
  );
}
