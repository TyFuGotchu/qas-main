const STORAGE_KEY = "qs_lesson_progress";

export interface LessonProgress {
  viewed: string[];
  completed: string[];
  lastViewed?: string;
  lastViewedAt?: string;
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