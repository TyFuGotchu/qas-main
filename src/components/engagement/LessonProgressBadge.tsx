"use client";

import { useEffect, useState } from "react";
import { getLessonProgress } from "@/lib/academy/lesson-progress";
import { Badge } from "@/components/ui/Badge";

export function LessonProgressBadge({ totalLessons }: { totalLessons: number }) {
  const [viewed, setViewed] = useState(0);

  useEffect(() => {
    const progress = getLessonProgress();
    setViewed(progress.viewed.length);
  }, []);

  if (viewed === 0) return null;

  return (
    <Badge variant="success">
      {viewed} of {totalLessons} lessons explored
    </Badge>
  );
}