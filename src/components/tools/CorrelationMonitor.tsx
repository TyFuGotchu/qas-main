"use client";

import { useState, useMemo } from "react";
import Select from "@/components/ui/Select";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { Badge } from "@/components/ui/Badge";
import {
  HISTORICAL_VOLATILITY,
  calculateCorrelation,
} from "@/lib/trading-data";

const LOOKBACK_WINDOWS = {
  "1H": 12,
  "4H": 24,
  "1D": 30,
};

export function CorrelationMonitor() {
  const [lookback, setLookback] = useState<keyof typeof LOOKBACK_WINDOWS>("4H");

  const correlations = useMemo(() => {
    const window = LOOKBACK_WINDOWS[lookback];

    const xau = HISTORICAL_VOLATILITY.XAUUSD.slice(-window);
    const us30 = HISTORICAL_VOLATILITY.US30.slice(-window);
    const nas = HISTORICAL_VOLATILITY.NAS100.slice(-window);

    const xauUs30 = calculateCorrelation(xau, us30);
    const xauNas = calculateCorrelation(xau, nas);
    const us30Nas = calculateCorrelation(us30, nas);

    const systemicRisk = Math.abs(xauUs30) > 0.7 || Math.abs(xauNas) > 0.7 || Math.abs(us30Nas) > 0.7;

    return {
      pairs: [
        { pair: "XAUUSD / US30", value: xauUs30, assets: ["XAUUSD", "US30"] },
        { pair: "XAUUSD / NAS100", value: xauNas, assets: ["XAUUSD", "NAS100"] },
        { pair: "US30 / NAS100", value: us30Nas, assets: ["US30", "NAS100"] },
      ],
      systemicRisk,
      gridData: Array.from({ length: window }, (_, i) => ({
        index: i + 1,
        xauusd: xau[i] ?? 0,
        us30: us30[i] ?? 0,
        nas100: nas[i] ?? 0,
        rollingCorr: calculateCorrelation(
          xau.slice(Math.max(0, i - 4), i + 1),
          us30.slice(Math.max(0, i - 4), i + 1)
        ),
      })),
    };
  }, [lookback]);

  function getCorrelationColor(value: number): string {
    const abs = Math.abs(value);
    if (abs > 0.7) return "text-red-400";
    if (abs > 0.4) return "text-amber-400";
    return "text-emerald-400";
  }

  function getCorrelationBadge(value: number): "danger" | "warning" | "success" {
    const abs = Math.abs(value);
    if (abs > 0.7) return "danger";
    if (abs > 0.4) return "warning";
    return "success";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Select
          label="Lookback Window"
          options={[
            { value: "1H", label: "1 Hour (12 periods)" },
            { value: "4H", label: "4 Hour (24 periods)" },
            { value: "1D", label: "1 Day (30 periods)" },
          ]}
          value={lookback}
          onChange={(e) =>
            setLookback(e.target.value as keyof typeof LOOKBACK_WINDOWS)
          }
          className="max-w-xs"
        />
        {correlations.systemicRisk && (
          <Badge variant="danger" className="mt-6">
            SYSTEMIC RISK ALERT
          </Badge>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {correlations.pairs.map((pair) => (
          <TerminalPanel
            key={pair.pair}
            title={pair.pair}
            status={Math.abs(pair.value) > 0.7 ? "warning" : "online"}
          >
            <div className="text-center">
              <p
                className={`font-mono text-4xl font-bold ${getCorrelationColor(
                  pair.value
                )}`}
              >
                {pair.value >= 0 ? "+" : ""}
                {(pair.value * 100).toFixed(1)}%
              </p>
              <Badge
                variant={getCorrelationBadge(pair.value)}
                className="mt-3"
              >
                {Math.abs(pair.value) > 0.7
                  ? "High Correlation"
                  : Math.abs(pair.value) > 0.4
                  ? "Moderate"
                  : "Low Correlation"}
              </Badge>
            </div>
          </TerminalPanel>
        ))}
      </div>

      <TerminalPanel title="Volatility Correlation Grid" status="online">
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-700 text-slate-500">
                <th className="px-2 py-2 text-left">#</th>
                <th className="px-2 py-2 text-right text-amber-400">XAUUSD</th>
                <th className="px-2 py-2 text-right text-blue-400">US30</th>
                <th className="px-2 py-2 text-right text-purple-400">NAS100</th>
                <th className="px-2 py-2 text-right text-cyan-400">
                  XAU/US30 ρ
                </th>
              </tr>
            </thead>
            <tbody>
              {correlations.gridData.map((row) => (
                <tr
                  key={row.index}
                  className="border-b border-slate-800/40 hover:bg-slate-800/20"
                >
                  <td className="px-2 py-1.5 text-slate-600">{row.index}</td>
                  <td className="px-2 py-1.5 text-right text-amber-300/80">
                    {row.xauusd.toFixed(3)}
                  </td>
                  <td className="px-2 py-1.5 text-right text-blue-300/80">
                    {row.us30.toFixed(3)}
                  </td>
                  <td className="px-2 py-1.5 text-right text-purple-300/80">
                    {row.nas100.toFixed(3)}
                  </td>
                  <td
                    className={`px-2 py-1.5 text-right ${getCorrelationColor(
                      row.rollingCorr
                    )}`}
                  >
                    {(row.rollingCorr * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TerminalPanel>

      {correlations.systemicRisk && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
          <p className="font-mono text-sm text-red-400">
            ⚠ High correlation detected between major assets. Automated
            portfolios may experience amplified drawdowns during systemic moves.
            Consider reducing exposure or enabling correlation-based position
            limits.
          </p>
        </div>
      )}
    </div>
  );
}