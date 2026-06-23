"use client";

import { useMemo } from "react";
import { MarketChart } from "@/components/charts/MarketChart";
import { getLessonChartFixture } from "@/lib/academy/chart-fixtures";
import { Badge } from "@/components/ui/Badge";

interface LessonLiveChartProps {
  categoryId: string;
  lessonId: string;
}

export function LessonLiveChart({ categoryId, lessonId }: LessonLiveChartProps) {
  const fixture = useMemo(
    () => getLessonChartFixture(categoryId, lessonId),
    [categoryId, lessonId]
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="success">{fixture.symbol}</Badge>
        <Badge variant="warning">{fixture.scenario.replace("_", " ")}</Badge>
        <span className="font-mono text-[10px] text-slate-500">Illustrative chart overlay</span>
      </div>
      <MarketChart
        candles={fixture.candles}
        symbol={fixture.symbol}
        priceLines={fixture.priceLines}
        height={320}
        className="overflow-hidden rounded-lg border border-slate-800/60"
      />
      <p className="text-center font-mono text-xs text-slate-500">{fixture.caption}</p>
    </div>
  );
}