/** Premium-included trading calculators — slug registry */

export const LOCAL_TOOL_SLUGS = [
  "expectancy-validator",
  "atr-pip-range",
  "compounding-matrix",
] as const;

export type LocalToolSlug = (typeof LOCAL_TOOL_SLUGS)[number];

export const LOCAL_TOOL_BENEFITS: Record<LocalToolSlug, string> = {
  "expectancy-validator": "Validate edge math before you size up",
  "atr-pip-range": "Measure structural volatility in pips",
  "compounding-matrix": "Plan prop-firm lot progression",
};

export function isLocalToolSlug(slug: string): slug is LocalToolSlug {
  return (LOCAL_TOOL_SLUGS as readonly string[]).includes(slug);
}