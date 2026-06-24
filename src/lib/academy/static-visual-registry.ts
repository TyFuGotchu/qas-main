export interface LessonStaticImageConfig {
  alt: string;
  src?: string;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "3/2";
  caption?: string;
}

/**
 * Optional per-lesson static image URLs.
 * When `src` is omitted, LessonStaticVisual renders an integrated skeleton placeholder.
 */
const STATIC_IMAGE_MAP: Record<string, LessonStaticImageConfig> = {
  // Example once assets are ready:
  // "chart-reading-what-is-price-action": {
  //   alt: "Price action candle anatomy reference",
  //   src: "/lessons/chart-reading/what-is-price-action.png",
  //   aspectRatio: "16/9",
  //   caption: "Annotated candle structure for manual chart reading.",
  // },
};

function slugToKey(categoryId: string, lessonId: string): string {
  return `${categoryId}-${lessonId}`;
}

export function getLessonStaticImage(
  categoryId: string,
  lessonId: string
): LessonStaticImageConfig | null {
  const key = slugToKey(categoryId, lessonId);
  const mapped = STATIC_IMAGE_MAP[key];

  if (mapped) return mapped;

  const label = lessonId.replace(/-/g, " ");
  return {
    alt: `Trading lesson reference visual — ${label}`,
    aspectRatio: "16/9",
    caption: "High-utility chart reference — image URL can be added without layout changes.",
  };
}