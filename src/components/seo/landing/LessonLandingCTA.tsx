import Link from "next/link";
import { ArrowRight, BookOpen, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";

interface LessonLandingCTAProps {
  lessonSlug: string;
  lessonTitle: string;
  pageTitle: string;
}

export function LessonLandingCTA({
  lessonSlug,
  lessonTitle,
  pageTitle,
}: LessonLandingCTAProps) {
  return (
    <GlassPanel className="border-cyan-accent/30 bg-gradient-to-br from-slate-950 to-cyan-accent/5 p-6 sm:p-8">
      <Badge variant="success" className="mb-4">
        Free lesson preview
      </Badge>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-accent/30 bg-cyan-accent/10">
          <BookOpen className="h-6 w-6 text-cyan-accent" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-mono text-xl font-bold text-slate-100 sm:text-2xl">
            Read the full lesson: {lessonTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            You explored <strong className="text-slate-300">{pageTitle}</strong>.
            Open the complete Chart Academy lesson for step-by-step explanations,
            interactive panels, and tier-matched tool access.
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/lessons/${lessonSlug}`}>
          <Button variant="primary" size="lg">
            <BookOpen className="h-4 w-4" />
            Open Full Lesson
          </Button>
        </Link>
        <Link href="/register">
          <Button variant="secondary" size="lg">
            <Zap className="h-4 w-4" />
            Create Free Account
          </Button>
        </Link>
        <Link href="/lessons">
          <Button variant="ghost" size="lg">
            Browse all lessons
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </GlassPanel>
  );
}