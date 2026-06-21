"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  type CandlestickData,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi,
  ColorType,
} from "lightweight-charts";
import { formatCandlesForChart } from "@/lib/market-data/chart-format";
import type { Candle } from "@/lib/market-data/types";
import type { MarketSymbol } from "@/lib/market-data/types";
import { cn } from "@/lib/utils";

export interface PriceLine {
  price: number;
  color: string;
  title: string;
}

interface MarketChartProps {
  candles: Candle[];
  symbol: MarketSymbol;
  height?: number;
  priceLines?: PriceLine[];
  className?: string;
  loading?: boolean;
}

export function MarketChart({
  candles,
  symbol,
  height = 420,
  priceLines = [],
  className,
  loading,
}: MarketChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const priceLineRefs = useRef<IPriceLine[]>([]);
  const prevSymbolRef = useRef<MarketSymbol | null>(null);

  const chartData = useMemo(() => formatCandlesForChart(candles), [candles]);

  // Initialize native lightweight-charts instance (no iframe, no external embed)
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      layout: {
        background: { type: ColorType.Solid, color: "#020617" },
        textColor: "#94a3b8",
        fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "rgba(0,229,255,0.06)" },
        horzLines: { color: "rgba(0,229,255,0.06)" },
      },
      crosshair: {
        vertLine: { color: "rgba(0,229,255,0.45)", labelBackgroundColor: "#0f172a" },
        horzLine: { color: "rgba(0,229,255,0.45)", labelBackgroundColor: "#0f172a" },
      },
      rightPriceScale: {
        borderColor: "rgba(148,163,184,0.15)",
      },
      timeScale: {
        borderColor: "rgba(148,163,184,0.15)",
        timeVisible: true,
        secondsVisible: false,
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
      if (entry && chartRef.current) {
        chartRef.current.applyOptions({ width: entry.contentRect.width });
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      priceLineRefs.current = [];
      prevSymbolRef.current = null;
    };
  }, [height]);

  // Wire polled data + clear on asset toggle
  useEffect(() => {
    const series = seriesRef.current;
    const chart = chartRef.current;
    if (!series || !chart) return;

    if (prevSymbolRef.current !== symbol) {
      series.setData([]);
      prevSymbolRef.current = symbol;
    }

    if (chartData.length === 0) {
      series.setData([]);
      return;
    }

    series.setData(chartData as CandlestickData[]);
    chart.timeScale().fitContent();
  }, [chartData, symbol]);

  // Overlay price lines (liquidity voids, trap zones)
  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;

    priceLineRefs.current.forEach((line) => series.removePriceLine(line));
    priceLineRefs.current = [];

    priceLines.forEach((line) => {
      if (!line.price) return;
      const pl = series.createPriceLine({
        price: line.price,
        color: line.color,
        lineWidth: 2,
        lineStyle: 2,
        axisLabelVisible: Boolean(line.title),
        title: line.title,
      });
      priceLineRefs.current.push(pl);
    });
  }, [priceLines, symbol]);

  const isEmpty = chartData.length === 0;

  return (
    <div className={cn("relative w-full bg-slate-950", className)}>
      {isEmpty && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/90">
          <p className="font-mono text-sm text-slate-500">
            {loading ? "Loading candle data…" : `No candle data for ${symbol}`}
          </p>
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full"
        style={{ height }}
        aria-label={`${symbol} native candlestick chart`}
      />
    </div>
  );
}