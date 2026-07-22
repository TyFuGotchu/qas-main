import type { AcademyCategory } from "../types";
import { chartReadingCategory } from "./chart-reading";
import { candlestickCategory } from "./candlesticks";
import { tradingStylesCategory } from "./trading-styles";
import { fibonacciCategory } from "./fibonacci";
import { marketStructureCategory } from "./market-structure";
import { forexCategory } from "./forex";
import { cfdCategory } from "./cfd";

export const ACADEMY_CATEGORIES: AcademyCategory[] = [
  chartReadingCategory,
  candlestickCategory,
  tradingStylesCategory,
  fibonacciCategory,
  marketStructureCategory,
  forexCategory,
  cfdCategory,
];

export function countAcademyLessons(): number {
  return ACADEMY_CATEGORIES.reduce(
    (total, cat) =>
      total + cat.sections.reduce((n, section) => n + section.lessons.length, 0),
    0
  );
}

export {
  chartReadingCategory,
  candlestickCategory,
  tradingStylesCategory,
  fibonacciCategory,
  marketStructureCategory,
  forexCategory,
  cfdCategory,
};