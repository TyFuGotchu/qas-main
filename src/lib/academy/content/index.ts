import type { AcademyCategory } from "../types";
import { chartReadingCategory } from "./chart-reading";
import { candlestickCategory } from "./candlesticks";
import { tradingStylesCategory } from "./trading-styles";
import { fibonacciCategory } from "./fibonacci";
import { marketStructureCategory } from "./market-structure";

export const ACADEMY_CATEGORIES: AcademyCategory[] = [
  chartReadingCategory,
  candlestickCategory,
  tradingStylesCategory,
  fibonacciCategory,
  marketStructureCategory,
];

export {
  chartReadingCategory,
  candlestickCategory,
  tradingStylesCategory,
  fibonacciCategory,
  marketStructureCategory,
};