import type { Metadata } from "next";
import Link from "next/link";
import { CHARTING_GUIDES } from "@/lib/seo/public-lessons";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Charting Guides Preview | Quicksilver Algo",
  description:
    "Freemium charting guide previews including the prop firm 1-week challenge playbook. Upgrade for full access.",
};

export default function GuidesIndexPage() {
  return (
    <div className="space-y-8">
      <header>
        <Badge variant="success" className="mb-3">
          Freemium · Charting Guides
        </Badge>
        <h1 className="font-mono text-3xl font-bold text-slate-100">
          Charting Guides
        </h1>
        <p className="mt-3 text-slate-400">
          Preview every guide for free. Free: 1 guide · Tier 1:
          2 guides · Premium: unlimited.
        </p>
      </header>
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
              <h2 className="font-mono text-lg font-semibold text-slate-200">
                {guide.title}
              </h2>
              {guide.badge && <Badge variant="warning">{guide.badge}</Badge>}
            </div>
            <p className="mt-2 text-sm text-slate-500">{guide.description}</p>
            <p className="mt-3 font-mono text-[10px] text-slate-600">
              {guide.sectionCount} sections · {guide.lessonCount} lessons
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}