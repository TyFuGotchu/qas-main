"use client";

import { useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { AccordionItem } from "@/components/ui/Accordion";
import { ACADEMY_CATEGORIES } from "@/lib/academy/content";
import type { AcademyCategory, AcademyLesson } from "@/lib/academy/types";
import { cn } from "@/lib/utils";
import { LessonVisual } from "@/components/academy/LessonVisual";

function LessonCard({
  lesson,
  categoryId,
}: {
  lesson: AcademyLesson;
  categoryId: string;
}) {
  const diffColor = {
    beginner: "text-emerald-400",
    intermediate: "text-cyan-accent",
    advanced: "text-amber-400",
  }[lesson.difficulty ?? "beginner"];

  return (
    <div className="space-y-3 rounded-lg border border-slate-800/60 bg-slate-900/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h4 className="font-mono text-sm font-semibold text-slate-200">
          {lesson.title}
        </h4>
        {lesson.difficulty && (
          <span className={cn("font-mono text-[10px] uppercase", diffColor)}>
            {lesson.difficulty}
          </span>
        )}
      </div>
      <p className="font-mono text-xs text-slate-500">{lesson.summary}</p>
      <LessonVisual categoryId={categoryId} lessonId={lesson.id} title={lesson.title} />
      <div className="space-y-2">
        {lesson.body.map((para, i) => (
          <p key={i} className="text-sm leading-relaxed text-slate-400">
            {para}
          </p>
        ))}
      </div>
      {lesson.keyPoints && lesson.keyPoints.length > 0 && (
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-slate-600">
            Key Points
          </p>
          <ul className="space-y-1">
            {lesson.keyPoints.map((pt) => (
              <li key={pt} className="font-mono text-xs text-slate-400">
                → {pt}
              </li>
            ))}
          </ul>
        </div>
      )}
      {lesson.manualTips && lesson.manualTips.length > 0 && (
        <div className="rounded border border-cyan-accent/20 bg-cyan-accent/5 p-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-cyan-accent/80">
            Manual Trading Tips
          </p>
          <ul className="space-y-1">
            {lesson.manualTips.map((tip) => (
              <li key={tip} className="font-mono text-xs text-slate-400">
                • {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function ChartAcademy() {
  const [activeCategory, setActiveCategory] = useState<string>(
    ACADEMY_CATEGORIES[0]?.id ?? ""
  );
  const [search, setSearch] = useState("");
  const [openSection, setOpenSection] = useState<string | null>(null);

  const category = useMemo(
    () => ACADEMY_CATEGORIES.find((c) => c.id === activeCategory),
    [activeCategory]
  );

  const filteredSections = useMemo(() => {
    if (!category) return [];
    const q = search.trim().toLowerCase();
    if (!q) return category.sections;

    return category.sections
      .map((section) => ({
        ...section,
        lessons: section.lessons.filter(
          (l) =>
            l.title.toLowerCase().includes(q) ||
            l.summary.toLowerCase().includes(q) ||
            l.body.some((b) => b.toLowerCase().includes(q))
        ),
      }))
      .filter((s) => s.lessons.length > 0);
  }, [category, search]);

  const totalLessons = ACADEMY_CATEGORIES.reduce(
    (sum, c) => sum + c.sections.reduce((s, sec) => s + sec.lessons.length, 0),
    0
  );

  return (
    <div className="space-y-6">
      <GlassPanel className="p-6" glow>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-accent" />
              <h2 className="font-mono text-2xl font-bold text-slate-100">
                QS Chart Academy
              </h2>
            </div>
            <p className="mt-2 max-w-2xl font-mono text-sm text-slate-500">
              Learn to read charts, recognize candlestick patterns, understand
              trading styles, and use Fibonacci zones — for manual trading on any
              platform. No account linking required.
            </p>
          </div>
          <Badge variant="success">{totalLessons} lessons</Badge>
        </div>
      </GlassPanel>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <GlassPanel className="h-fit p-3">
          <p className="mb-3 px-2 font-mono text-[10px] uppercase tracking-widest text-slate-600">
            Categories
          </p>
          <nav className="space-y-1">
            {ACADEMY_CATEGORIES.map((cat: AcademyCategory) => {
              const lessonCount = cat.sections.reduce(
                (s, sec) => s + sec.lessons.length,
                0
              );
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setOpenSection(null);
                  }}
                  className={cn(
                    "w-full rounded-lg px-3 py-2.5 text-left transition-all",
                    activeCategory === cat.id
                      ? "bg-cyan-accent/10 text-cyan-accent"
                      : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"
                  )}
                >
                  <p className="font-mono text-xs font-semibold">{cat.title}</p>
                  <p className="mt-0.5 font-mono text-[10px] opacity-70">
                    {cat.sections.length} sections · {lessonCount} lessons
                  </p>
                </button>
              );
            })}
          </nav>
        </GlassPanel>

        <div className="space-y-4">
          {category && (
            <>
              <GlassPanel className="p-4">
                <h3 className="font-mono text-lg font-bold text-slate-200">
                  {category.title}
                </h3>
                <p className="mt-1 font-mono text-sm text-slate-500">
                  {category.description}
                </p>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                  <input
                    type="search"
                    placeholder="Search lessons in this category…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-10 pr-4 font-mono text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-accent/40 focus:outline-none"
                  />
                </div>
              </GlassPanel>

              <div className="space-y-3">
                {filteredSections.map((section) => (
                  <AccordionItem
                    key={section.id}
                    id={section.id}
                    title={section.title}
                    subtitle={section.description}
                    badge={`${section.lessons.length} lessons`}
                    defaultOpen={openSection === section.id}
                  >
                    <div
                      className="space-y-4"
                      onFocus={() => setOpenSection(section.id)}
                    >
                      {section.lessons.map((lesson) => (
                        <LessonCard
                          key={lesson.id}
                          lesson={lesson}
                          categoryId={category.id}
                        />
                      ))}
                    </div>
                  </AccordionItem>
                ))}
                {filteredSections.length === 0 && (
                  <p className="py-8 text-center font-mono text-sm text-slate-500">
                    No lessons match your search.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}