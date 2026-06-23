const STORAGE_KEY = "qs_lesson_progress";
const EMAIL_KEY = "qs_email_captured";
const EMAIL_VALUE_KEY = "qs_captured_email";

export interface LessonProgress {
  viewed: string[];
  completed: string[];
  lastViewed?: string;
  lastViewedAt?: string;
  emailCaptured?: boolean;
  capturedEmail?: string;
}

export function hasEmailCapture(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(EMAIL_KEY) === "1";
}

export function getCapturedEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(EMAIL_VALUE_KEY);
}

export function setEmailCaptured(email: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(EMAIL_KEY, "1");
  localStorage.setItem(EMAIL_VALUE_KEY, email);
  const progress = getLessonProgress();
  saveLessonProgress({ ...progress, emailCaptured: true, capturedEmail: email });
}

export async function syncEngagementToServer(params: {
  email: string;
  source?: string;
  abStickyBucket?: string;
}): Promise<boolean> {
  const progress = getLessonProgress();
  try {
    const res = await fetch("/api/engagement/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: params.email,
        viewedLessons: progress.viewed,
        source: params.source,
        abStickyBucket: params.abStickyBucket,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function getLessonProgress(): LessonProgress {
  if (typeof window === "undefined") {
    return { viewed: [], completed: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { viewed: [], completed: [] };
    return JSON.parse(raw) as LessonProgress;
  } catch {
    return { viewed: [], completed: [] };
  }
}

export function saveLessonProgress(progress: LessonProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function markLessonViewed(slug: string): LessonProgress {
  const progress = getLessonProgress();
  if (!progress.viewed.includes(slug)) {
    progress.viewed.push(slug);
  }
  progress.lastViewed = slug;
  progress.lastViewedAt = new Date().toISOString();
  saveLessonProgress(progress);
  return progress;
}

export function markLessonCompleted(slug: string): LessonProgress {
  const progress = markLessonViewed(slug);
  if (!progress.completed.includes(slug)) {
    progress.completed.push(slug);
  }
  saveLessonProgress(progress);
  return progress;
}