import Link from "next/link";
import { PROP_FIRM_ONE_WEEK_GUIDE } from "@/lib/academy/content/prop-firm-one-week";
import { PremiumLessonCTA } from "@/components/seo/PremiumLessonCTA";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Target } from "lucide-react";

export function PropFirmOneWeekGuide() {
  const guide = PROP_FIRM_ONE_WEEK_GUIDE;

  return (
    <div className="space-y-10">
      <header>
        <Link href="/guides" className="font-mono text-xs text-cyan-accent hover:underline">
          ← All Guides
        </Link>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="warning">Prop Challenge</Badge>
          <Badge variant="success">
            {guide.consistencyTargetPercent}% Consistency Target
          </Badge>
        </div>
        <h1 className="mt-4 font-mono text-3xl font-bold text-slate-100">
          {guide.title}
        </h1>
        <p className="mt-3 text-lg text-slate-400">{guide.description}</p>
      </header>

      <section className="rounded-xl border border-cyan-accent/20 bg-cyan-accent/5 p-6">
        <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
          How This Playbook Works
        </h2>
        <ul className="mt-4 space-y-3">
          {guide.overview.map((line) => (
            <li key={line} className="text-sm leading-relaxed text-slate-400">
              • {line}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-slate-500">
          20% Consistency Rules
        </h2>
        <div className="space-y-3">
          {guide.consistencyRules.map((rule) => (
            <div
              key={rule}
              className="rounded-lg border border-slate-800/60 bg-slate-900/40 px-4 py-3 text-sm text-slate-400"
            >
              {rule}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 font-mono text-sm font-bold uppercase tracking-widest text-slate-500">
          7-Day Execution Plan
        </h2>
        <div className="space-y-4">
          {guide.dailyPlans.map((day) => (
            <div
              key={day.day}
              className="rounded-xl border border-slate-800/60 bg-slate-900/30 p-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-accent/40 bg-cyan-accent/10 font-mono text-sm font-bold text-cyan-accent">
                  {day.day}
                </span>
                <div>
                  <h3 className="font-mono text-base font-semibold text-slate-200">
                    {day.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">{day.focus}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="success">Cap: +{day.profitCapPercent}%</Badge>
                <Badge variant="warning">Max risk: {day.maxRiskPercent}%/trade</Badge>
              </div>
              <ul className="mt-4 space-y-2">
                {day.tasks.map((task) => (
                  <li key={task} className="font-mono text-xs text-slate-400">
                    → {task}
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-200/80">
                <strong className="text-amber-300">Consistency check:</strong>{" "}
                {day.consistencyCheck}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/tools/prop-survival">
          <Button variant="primary">
            <Target className="h-4 w-4" />
            Open Prop Survival Module
          </Button>
        </Link>
        <Link href="/dashboard/tools/risk-matrix">
          <Button variant="secondary">Risk Matrix</Button>
        </Link>
      </div>

      <PremiumLessonCTA lessonSlug="prop-firm-one-week" />

      <section>
        <h2 className="mb-4 font-mono text-sm font-bold uppercase tracking-widest text-slate-500">
          FAQ
        </h2>
        <div className="space-y-4">
          {guide.faqs.map((faq) => (
            <div key={faq.question} className="rounded-lg border border-slate-800/40 p-4">
              <h3 className="font-mono text-sm font-semibold text-slate-200">
                {faq.question}
              </h3>
              <p className="mt-2 text-sm text-slate-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}