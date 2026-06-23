"use client";

import { useEffect } from "react";
import { markLessonViewed } from "@/lib/academy/lesson-progress";

interface LessonEngagementTrackerProps {
  slug: string;
}

export function LessonEngagementTracker({ slug }: LessonEngagementTrackerProps) {
  useEffect(() => {
    markLessonViewed(slug);
  }, [slug]);

  return null;
}