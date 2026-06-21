"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  type IChartApi,
  type ISeriesApi,
  type IPriceLine,
  type CandlestickData,
  ColorType,
} from "lightweight-charts";
import type { Candle } from "@/lib/market-data/types";

export interface PriceLine {
  price: number;
  color: string;
  title: string;
}

interface LightweightChartProps {
  candles: Candle[];
  height?: number;
  priceLines?: PriceLine[];
  className?: string;
}

export function LightweightChart({
  candles,
  height = 400,
  priceLines = [],
  className,
}: LightweightChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const priceLineRefs = useRef<IPriceLine[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      height,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#94a3b8",
        fontFamily: "var(--font-jetbrains-mono), monospace",
      },
      grid: {
        vertLines: { color: "rgba(0,229,255,0.04)" },
        horzLines: { color: "rgba(0,229,255,0.04)" },
      },
      crosshair: {
        vertLine: { color: "rgba(0,229,255,0.4)" },
        horzLine: { color: "rgba(0,229,255,0.4)" },
      },
      rightPriceScale: {
        borderColor: "rgba(148,163,184,0.2)",
      },
      timeScale: {
        borderColor: "rgba(148,163,184,0.2)",
        timeVisible: true,
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        chart.applyOptions({ width: entry.contentRect.width });
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [height]);

  useEffect(() => {
    if (!seriesRef.current || candles.length === 0) return;

    const data: CandlestickData[] = candles.map((c) => ({
      time: c.time as CandlestickData["time"],
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    seriesRef.current.setData(data);
    chartRef.current?.timeScale().fitContent();
  }, [candles]);

  useEffect(() => {
    if (!seriesRef.current) return;

    priceLineRefs.current.forEach((line) => {
      seriesRef.current?.removePriceLine(line);
    });
    priceLineRefs.current = [];

    priceLines.forEach((line) => {
      if (!line.title && !line.price) return;
      const pl = seriesRef.current?.createPriceLine({
        price: line.price,
        color: line.color,
        lineWidth: 2,
        lineStyle: 2,
        axisLabelVisible: Boolean(line.title),
        title: line.title,
      });
      if (pl) priceLineRefs.current.push(pl);
    });
  }, [priceLines, candles]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", minHeight: height }}
    />
  );
}