"use client";

import { useMemo } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { buildCorrelationMatrix, returnsFromCandles } from "@/lib/market-data/analytics";
import { CORRELATION_SYMBOLS } from "@/lib/market-data/symbols";
import { useMarketDataContext } from "@/providers/MarketDataProvider";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

function corrColor(value: number) {
  if (value >= 0.7) return "bg-emerald-500/70";
  if (value >= 0.3) return "bg-cyan-accent/50";
  if (value >= -0.3) return "bg-slate-600/60";
  if (value >= -0.7) return "bg-amber-500/50";
  return "bg-red-500/70";
}

export function DecouplingHeatmap() {
  const { quotes, candles, source, loading } = useMarketDataContext();

  const matrix = useMemo(() => {
    const series = Object.fromEntries(
      CORRELATION_SYMBOLS.map((symbol) => [
        symbol,
        returnsFromCandles(candles[symbol] ?? []),
      ])
    ) as Partial<Record<(typeof CORRELATION_SYMBOLS)[number], number[]>>;

    return buildCorrelationMatrix(series, CORRELATION_SYMBOLS, candles);
  }, [candles]);

  const alert = matrix.find((c) => c.decoupled) ?? null;
  const assets = CORRELATION_SYMBOLS;

  function getCell(a: string, b: string) {
    if (a === b) return undefined;
    return matrix.find(
      (c) =>
        (c.assetA === a && c.assetB === b) ||
        (c.assetA === b && c.assetB === a)
    );
  }

  return (
    <div className="space-y-6">
      {alert && (
        <GlassPanel className="animate-pulse-glow border-red-500/50 bg-red-500/10 p-4" glow>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <div>
              <p className="font-mono text-sm font-bold text-red-300">
                DIVERGENCE ALERT — {alert.assetA} / {alert.assetB}
              </p>
              <p className="font-mono text-xs text-slate-400">
                Latest closes moved opposite · correlation {alert.correlation.toFixed(2)}{" "}
                (was {alert.previousCorrelation.toFixed(2)})
              </p>
            </div>
          </div>
        </GlassPanel>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quotes
          .filter((q) => assets.includes(q.symbol as (typeof assets)[number]))
          .map((q) => (
            <GlassPanel key={q.symbol} className="p-4">
              <p className="font-mono text-[10px] uppercase text-slate-500">{q.symbol}</p>
              <p className="font-mono text-xl font-bold text-slate-100">
                {q.price.toLocaleString()}
              </p>
              <p
                className={cn(
                  "font-mono text-xs",
                  q.changePercent >= 0 ? "text-emerald-400" : "text-red-400"
                )}
              >
                {q.changePercent >= 0 ? "+" : ""}
                {q.changePercent}%
              </p>
            </GlassPanel>
          ))}
      </div>

      <TerminalPanel
        title={`Cross-Asset Matrix · ${source.toUpperCase()} · ${loading ? "syncing" : "synced"}`}
        status="online"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse font-mono text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left text-slate-500" />
                {assets.map((a) => (
                  <th key={a} className="p-2 text-center text-slate-400">
                    {a}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assets.map((row) => (
                <tr key={row}>
                  <td className="p-2 font-semibold text-slate-400">{row}</td>
                  {assets.map((col) => {
                    if (row === col) {
                      return (
                        <td key={col} className="p-2 text-center">
                          <div className="mx-auto h-12 w-12 rounded bg-slate-800/80" />
                        </td>
                      );
                    }
                    const cell = getCell(row, col);
                    const val = cell?.correlation ?? 0;
                    return (
                      <td key={col} className="p-2 text-center">
                        <div
                          className={cn(
                            "mx-auto flex h-12 w-12 flex-col items-center justify-center rounded border transition-all",
                            corrColor(val),
                            cell?.decoupled &&
                              "animate-pulse border-red-400 ring-2 ring-red-400/50"
                          )}
                        >
                          <span className="text-xs font-bold text-white">
                            {val.toFixed(2)}
                          </span>
                          {cell?.decoupled && (
                            <Badge variant="danger" className="mt-0.5 scale-75">
                              DECOUPLED
                            </Badge>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TerminalPanel>
    </div>
  );
}