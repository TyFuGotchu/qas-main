"use client";

import { useState, useMemo } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { HISTORICAL_VOLATILITY } from "@/lib/trading-data";

export function DrawdownMatrix() {
  const [startingCapital, setStartingCapital] = useState("100000");
  const [dailyDrawdownLimit, setDailyDrawdownLimit] = useState("5");
  const [maxTrailingDrawdown, setMaxTrailingDrawdown] = useState("10");
  const [lotSize, setLotSize] = useState("1.0");
  const [asset, setAsset] = useState("XAUUSD");

  const simulation = useMemo(() => {
    const capital = parseFloat(startingCapital) || 0;
    const dailyLimit = parseFloat(dailyDrawdownLimit) || 0;
    const trailingLimit = parseFloat(maxTrailingDrawdown) || 0;
    const lots = parseFloat(lotSize) || 0;

    const volData = HISTORICAL_VOLATILITY[asset] ?? HISTORICAL_VOLATILITY.XAUUSD;
    const pipValue = asset === "XAUUSD" ? 100 : 10;
    const avgVol = volData.reduce((s, v) => s + v, 0) / volData.length;

    const dailyLossLimit = capital * (dailyLimit / 100);
    const trailingLossLimit = capital * (trailingLimit / 100);
    const expectedDailyMove = avgVol * lots * pipValue;

    const breachProbability = Math.min(
      99,
      Math.max(
        1,
        (expectedDailyMove / dailyLossLimit) * 35 +
          (expectedDailyMove / trailingLossLimit) * 25
      )
    );

    const maxSafeLots = dailyLossLimit / (avgVol * pipValue * 1.5);
    const daysToBreach = Math.max(1, Math.floor(trailingLossLimit / expectedDailyMove));

    const riskLevel =
      breachProbability > 70 ? "danger" : breachProbability > 40 ? "warning" : "success";

    const dailyScenarios = volData.slice(-10).map((vol, i) => {
      const pnl = (Math.random() > 0.45 ? -1 : 1) * vol * lots * pipValue * (0.5 + Math.random());
      const cumDrawdown = volData
        .slice(0, i + 1)
        .reduce((max, v) => Math.max(max, v * lots * pipValue), 0);
      return {
        day: i + 1,
        volatility: vol,
        simulatedPnl: pnl,
        drawdownPct: (Math.abs(Math.min(0, pnl)) / capital) * 100,
        breachDaily: Math.abs(Math.min(0, pnl)) > dailyLossLimit,
        breachTrailing: cumDrawdown > trailingLossLimit,
      };
    });

    return {
      capital,
      dailyLossLimit,
      trailingLossLimit,
      expectedDailyMove,
      breachProbability,
      maxSafeLots,
      daysToBreach,
      riskLevel,
      dailyScenarios,
      avgVol,
    };
  }, [startingCapital, dailyDrawdownLimit, maxTrailingDrawdown, lotSize, asset]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Input
          label="Starting Capital ($)"
          type="number"
          value={startingCapital}
          onChange={(e) => setStartingCapital(e.target.value)}
        />
        <Select
          label="Challenge Account Size"
          options={[
            { value: "100000", label: "$100,000" },
            { value: "200000", label: "$200,000" },
            { value: "50000", label: "$50,000" },
          ]}
          value={startingCapital}
          onChange={(e) => setStartingCapital(e.target.value)}
        />
        <Input
          label="Daily Drawdown Limit (%)"
          type="number"
          step="0.1"
          value={dailyDrawdownLimit}
          onChange={(e) => setDailyDrawdownLimit(e.target.value)}
        />
        <Input
          label="Max Trailing Drawdown (%)"
          type="number"
          step="0.1"
          value={maxTrailingDrawdown}
          onChange={(e) => setMaxTrailingDrawdown(e.target.value)}
        />
        <Input
          label="Lot Size"
          type="number"
          step="0.01"
          value={lotSize}
          onChange={(e) => setLotSize(e.target.value)}
        />
        <Select
          label="Primary Asset"
          options={[
            { value: "XAUUSD", label: "XAUUSD (Gold)" },
            { value: "US30", label: "US30 (Dow)" },
            { value: "NAS100", label: "NAS100 (Nasdaq)" },
          ]}
          value={asset}
          onChange={(e) => setAsset(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <TerminalPanel
          title="Breach Risk Analysis"
          status={
            simulation.riskLevel === "danger"
              ? "warning"
              : simulation.riskLevel === "warning"
              ? "warning"
              : "online"
          }
        >
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Breach Probability</span>
              <span
                className={
                  simulation.riskLevel === "danger"
                    ? "text-red-400"
                    : simulation.riskLevel === "warning"
                    ? "text-amber-400"
                    : "text-emerald-400"
                }
              >
                {formatPercent(simulation.breachProbability, 1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Daily Loss Limit</span>
              <span className="text-cyan-terminal">
                {formatCurrency(simulation.dailyLossLimit)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Trailing Loss Limit</span>
              <span className="text-cyan-terminal">
                {formatCurrency(simulation.trailingLossLimit)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Expected Daily Move</span>
              <span className="text-slate-300">
                {formatCurrency(simulation.expectedDailyMove)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Max Safe Lot Size</span>
              <span className="text-emerald-400">
                {simulation.maxSafeLots.toFixed(2)} lots
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Est. Days to Breach</span>
              <span className="text-slate-300">{simulation.daysToBreach} days</span>
            </div>
          </div>
          <div className="mt-4">
            <Badge
              variant={
                simulation.riskLevel === "danger"
                  ? "danger"
                  : simulation.riskLevel === "warning"
                  ? "warning"
                  : "success"
              }
            >
              {simulation.riskLevel === "danger"
                ? "HIGH RISK — Reduce lot size"
                : simulation.riskLevel === "warning"
                ? "MODERATE RISK — Monitor closely"
                : "WITHIN PARAMETERS"}
            </Badge>
          </div>
        </TerminalPanel>

        <TerminalPanel title="10-Day Simulation Log">
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-600">
                  <th className="py-1 text-left">Day</th>
                  <th className="py-1 text-right">Vol</th>
                  <th className="py-1 text-right">P&L</th>
                  <th className="py-1 text-right">DD%</th>
                  <th className="py-1 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {simulation.dailyScenarios.map((day) => (
                  <tr key={day.day} className="border-b border-slate-800/40">
                    <td className="py-1.5 text-slate-400">{day.day}</td>
                    <td className="py-1.5 text-right text-slate-500">
                      {day.volatility.toFixed(2)}
                    </td>
                    <td
                      className={`py-1.5 text-right ${
                        day.simulatedPnl >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {formatCurrency(day.simulatedPnl)}
                    </td>
                    <td className="py-1.5 text-right text-slate-400">
                      {formatPercent(day.drawdownPct, 2)}
                    </td>
                    <td className="py-1.5 text-right">
                      {day.breachDaily || day.breachTrailing ? (
                        <Badge variant="danger">BREACH</Badge>
                      ) : (
                        <Badge variant="success">OK</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TerminalPanel>
      </div>
    </div>
  );
}