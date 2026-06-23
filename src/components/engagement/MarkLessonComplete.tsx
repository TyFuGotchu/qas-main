"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  getLessonProgress,
  markLessonCompleted,
} from "@/lib/academy/lesson-progress";
import Button from "@/components/ui/Button";

interface MarkLessonCompleteProps {
  slug: string;
}

export function MarkLessonComplete({ slug }: MarkLessonCompleteProps) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const progress = getLessonProgress();
    setDone(progress.completed.includes(slug));
  }, [slug]);

  if (done) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        <span className="font-mono text-xs text-emerald-400">Lesson marked complete</span>
      </div>
    );
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => {
        markLessonCompleted(slug);
        setDone(true);
      }}
    >
      <CheckCircle2 className="h-4 w-4" />
      Mark as learned
    </Button>
  );
}