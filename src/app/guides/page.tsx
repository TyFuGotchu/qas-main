import type { Metadata } from "next";
import Link from "next/link";
import { CHARTING_GUIDES } from "@/lib/seo/public-lessons";
import { PropFirmChallengePromo } from "@/components/marketing/PropFirmChallengePromo";
import {
  PROP_FIRM_MARKETING_HEADLINE,
  PROP_FIRM_PLAYBOOK_HREF,
} from "@/lib/prop-firm-challenge-marketing";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "7-Day Prop Firm Playbook & Charting Guides | Quicksilver",
  description:
    "Pass your prop firm challenge in one week with the Quicksilver day-by-day playbook. Preview free — Premium unlocks the full 7-day execution plan.",
};

export default function GuidesIndexPage() {
  const playbook = CHARTING_GUIDES.find((g) => g.featured);

  return (
    <div className="space-y-8">
      <header>
        <Badge variant="success" className="mb-3">
          Prop Firm Challenge
        </Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-100">
          {PROP_FIRM_MARKETING_HEADLINE}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          The flagship Quicksilver guide — daily profit caps, consistency rules, and QS tool
          workflows. Preview free; Premium unlocks the complete execution plan.
        </p>
        {playbook ? (
          <Link
            href={PROP_FIRM_PLAYBOOK_HREF}
            className="mt-4 inline-block font-mono text-sm text-cyan-accent hover:underline"
          >
            Open {playbook.title} →
          </Link>
        ) : null}
      </header>

      <PropFirmChallengePromo variant="compact" />

      <section>
        <h2 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
          All Charting Guides
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {CHARTING_GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className={`rounded-xl border bg-slate-900/40 p-6 transition-all hover:border-cyan-accent/30 ${
                guide.featured
                  ? "border-cyan-accent/30 bg-gradient-to-br from-slate-900/60 to-cyan-accent/5"
                  : "border-slate-800/60"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-mono text-lg font-semibold text-slate-200">
                  {guide.title}
                </h3>
                {guide.badge && <Badge variant="warning">{guide.badge}</Badge>}
              </div>
              <p className="mt-2 text-sm text-slate-500">{guide.description}</p>
              <p className="mt-3 font-mono text-[10px] text-slate-600">
                {guide.sectionCount} sections · {guide.lessonCount} lessons
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}