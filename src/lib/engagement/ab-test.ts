export type StickyBarVariant = "8s" | "15s";

const BUCKET_KEY = "qs_ab_sticky_bucket";

export function getStickyBarDelayMs(): number {
  const variant = getStickyBarVariant();
  return variant === "15s" ? 15000 : 8000;
}

export function getStickyBarVariant(): StickyBarVariant {
  if (typeof window === "undefined") return "8s";
  try {
    const existing = localStorage.getItem(BUCKET_KEY) as StickyBarVariant | null;
    if (existing === "8s" || existing === "15s") return existing;
    const variant: StickyBarVariant = Math.random() < 0.5 ? "8s" : "15s";
    localStorage.setItem(BUCKET_KEY, variant);
    return variant;
  } catch {
    return "8s";
  }
}

export function getStickyBarVariantLabel(): string {
  return getStickyBarVariant();
}