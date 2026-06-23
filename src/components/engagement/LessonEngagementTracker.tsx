"use client";

import { useEffect } from "react";
import {
  markLessonViewed,
  syncEngagementToServer,
  getCapturedEmail,
} from "@/lib/academy/lesson-progress";
import { getStickyBarVariantLabel } from "@/lib/engagement/ab-test";

interface LessonEngagementTrackerProps {
  slug: string;
  userEmail?: string | null;
}

export function LessonEngagementTracker({
  slug,
  userEmail,
}: LessonEngagementTrackerProps) {
  useEffect(() => {
    markLessonViewed(slug);

    const email = userEmail ?? getCapturedEmail();
    if (email) {
      void syncEngagementToServer({
        email,
        source: slug,
        abStickyBucket: getStickyBarVariantLabel(),
      });
    }
  }, [slug, userEmail]);

  return null;
}