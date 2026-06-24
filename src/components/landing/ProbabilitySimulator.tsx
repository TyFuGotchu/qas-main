"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Slider } from "@/components/ui/Slider";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { cn, formatCurrency } from "@/lib/utils";
import { BarChart3, Play, Target } from "lucide-react";

const RUN_COUNT = 50;
const MAX_TRADES = 100;

type RunStatus = "passed" | "failed" | "open";

interface SimRun {
  id: number;
  curve: number[];
  status: RunStatus;
}

interface SimulationParams {
  accountSize: number;
  profitTargetPct: number;
  maxDrawdownPct: number;
  winRatePct: number;
  riskReward: number;
  riskPerTradePct: number;
}

interface SimulationResult {
  runs: SimRun[];
  passProbability: number;
  passedCount: number;
  failedCount: number;
  profitTargetBalance: number;
  drawdownFloorBalance: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function runSimulation(params: SimulationParams): SimulationResult {
  const profitTargetBalance =
    params.accountSize * (1 + params.profitTargetPct / 100);
  const drawdownFloorBalance =
    params.accountSize * (1 - params.maxDrawdownPct / 100);

  const runs: SimRun[] = [];

  for (let runIndex = 0; runIndex < RUN_COUNT; runIndex++) {
    const curve = [params.accountSize];
    let balance = params.accountSize;
    let status: RunStatus = "open";

    for (let trade = 1; trade <= MAX_TRADES; trade++) {
      const isWin = Math.random() < params.winRatePct / 100;
      const riskFraction = params.riskPerTradePct / 100;

      if (isWin) {
        balance *= 1 + riskFraction * params.riskReward;
      } else {
        balance *= 1 - riskFraction;
      }

      curve.push(balance);

      if (balance >= profitTargetBalance) {
        status = "passed";
        break;
      }

      if (balance <= drawdownFloorBalance) {
        status = "failed";
        break;
      }
    }

    runs.push({ id: runIndex, curve, status });
  }

  const passedCount = runs.filter((run) => run.status === "passed").length;
  const failedCount = runs.filter((run) => run.status === "failed").length;

  return {
    runs,
    passProbability: (passedCount / RUN_COUNT) * 100,
    passedCount,
    failedCount,
    profitTargetBalance,
    drawdownFloorBalance,
  };
}

function runStroke(status: RunStatus): string {
  if (status === "passed") return "rgba(52, 211, 153, 0.45)";
  if (status === "failed") return "rgba(248, 113, 113, 0.4)";
  return "rgba(102, 252, 241, 0.22)";
}

interface ParamControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  format?: (value: number) => string;
  onChange: (value: number) => void;
}

function ParamControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  format,
  onChange,
}: ParamControlProps) {
  const display = format ? format(value) : `${value}${unit ?? ""}`;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <label className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          {label}
        </label>
        <span className="font-mono text-xs text-cyan-terminal">{display}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(next) => onChange(clamp(next[0] ?? value, min, max))}
      />
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={String(value)}
        onChange={(e) => {
          const parsed = Number(e.target.value);
          if (Number.isFinite(parsed)) {
            onChange(clamp(parsed, min, max));
          }
        }}
        className="text-right"
      />
    </div>
  );
}

export function ProbabilitySimulator() {
  const [accountSize, setAccountSize] = useState(100_000);
  const [profitTargetPct, setProfitTargetPct] = useState(8);
  const [maxDrawdownPct, setMaxDrawdownPct] = useState(10);
  const [winRatePct, setWinRatePct] = useState(45);
  const [riskReward, setRiskReward] = useState(2);
  const [riskPerTradePct, setRiskPerTradePct] = useState(1);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const chartData = useMemo(() => {
    if (!result) return [];

    const maxLength = Math.max(...result.runs.map((run) => run.curve.length));

    return Array.from({ length: maxLength }, (_, tradeIdx) => {
      const row: Record<string, number> = { trade: tradeIdx };
      result.runs.forEach((run) => {
        row[`r${run.id}`] =
          run.curve[tradeIdx] ?? run.curve[run.curve.length - 1] ?? 0;
      });
      return row;
    });
  }, [result]);

  function handleRunSimulation() {
    setIsRunning(true);
    window.setTimeout(() => {
      setResult(
        runSimulation({
          accountSize,
          profitTargetPct,
          maxDrawdownPct,
          winRatePct,
          riskReward,
          riskPerTradePct,
        })
      );
      setIsRunning(false);
    }, 0);
  }

  const profitTargetBalance =
    result?.profitTargetBalance ??
    accountSize * (1 + profitTargetPct / 100);
  const drawdownFloorBalance =
    result?.drawdownFloorBalance ??
    accountSize * (1 - maxDrawdownPct / 100);

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <Badge variant="success" className="mb-4">
            Free Lead Tool
          </Badge>
          <h2 className="font-mono text-2xl font-bold text-slate-100 sm:text-3xl">
            Prop Firm Monte Carlo Simulator
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500 sm:text-base">
            Model 50 equity curves across 100 trades using your exact challenge
            rules. See the mathematical probability of passing before you risk
            real capital.
          </p>
        </div>

        <GlassPanel className="overflow-hidden border-cyan-500/20 p-0">
          <div className="grid lg:grid-cols-[320px_1fr]">
            <aside className="border-b border-slate-800/60 bg-obsidian-950/80 p-6 lg:border-b-0 lg:border-r">
              <div className="mb-6 flex items-center gap-2">
                <Target className="h-4 w-4 text-cyan-400" />
                <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-slate-300">
                  Challenge Parameters
                </h3>
              </div>

              <div className="space-y-5">
                <ParamControl
                  label="Account Size"
                  value={accountSize}
                  min={10_000}
                  max={500_000}
                  step={1_000}
                  format={(v) => formatCurrency(v)}
                  onChange={setAccountSize}
                />
                <ParamControl
                  label="Profit Target"
                  value={profitTargetPct}
                  min={1}
                  max={20}
                  step={0.5}
                  unit="%"
                  onChange={setProfitTargetPct}
                />
                <ParamControl
                  label="Max Drawdown"
                  value={maxDrawdownPct}
                  min={1}
                  max={20}
                  step={0.5}
                  unit="%"
                  onChange={setMaxDrawdownPct}
                />
                <ParamControl
                  label="Win Rate"
                  value={winRatePct}
                  min={20}
                  max={80}
                  step={1}
                  unit="%"
                  onChange={setWinRatePct}
                />
                <ParamControl
                  label="Risk : Reward"
                  value={riskReward}
                  min={0.5}
                  max={5}
                  step={0.1}
                  format={(v) => `1:${v.toFixed(1)}`}
                  onChange={setRiskReward}
                />
                <ParamControl
                  label="Risk Per Trade"
                  value={riskPerTradePct}
                  min={0.1}
                  max={5}
                  step={0.1}
                  unit="%"
                  onChange={setRiskPerTradePct}
                />
              </div>

              <Button
                variant="primary"
                className="mt-8 w-full"
                onClick={handleRunSimulation}
                disabled={isRunning}
              >
                <Play className="h-4 w-4" />
                {isRunning ? "Running Simulation…" : "Run Simulation"}
              </Button>

              <p className="mt-4 font-mono text-[10px] leading-relaxed text-slate-600">
                50 independent runs · up to 100 trades each · IOC-style kill
                switches at profit target and max drawdown.
              </p>
            </aside>

            <div className="p-4 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-cyan-400" />
                  <span className="font-mono text-xs uppercase tracking-widest text-slate-500">
                    Equity Curve Distribution
                  </span>
                </div>
                {result && (
                  <div className="flex flex-wrap gap-3 font-mono text-[10px] text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-6 rounded-sm bg-emerald-400/50" />
                      Passed ({result.passedCount})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-6 rounded-sm bg-red-400/50" />
                      Failed ({result.failedCount})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-6 rounded-sm bg-cyan-terminal/30" />
                      Open ({RUN_COUNT - result.passedCount - result.failedCount})
                    </span>
                  </div>
                )}
              </div>

              <div className="h-[360px] w-full rounded-lg border border-slate-800/60 bg-obsidian-950/50 p-2 sm:h-[420px]">
                {result ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 12, right: 12, left: 4, bottom: 8 }}
                    >
                      <CartesianGrid
                        stroke="rgba(51, 65, 85, 0.35)"
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="trade"
                        tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }}
                        axisLine={{ stroke: "#334155" }}
                        tickLine={false}
                        label={{
                          value: "Trade #",
                          position: "insideBottom",
                          offset: -2,
                          fill: "#64748b",
                          fontSize: 10,
                          fontFamily: "monospace",
                        }}
                      />
                      <YAxis
                        domain={[
                          Math.floor(drawdownFloorBalance * 0.98),
                          Math.ceil(profitTargetBalance * 1.02),
                        ]}
                        tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }}
                        axisLine={{ stroke: "#334155" }}
                        tickLine={false}
                        tickFormatter={(v) =>
                          v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
                        }
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#0B0C10",
                          border: "1px solid rgba(51, 65, 85, 0.8)",
                          borderRadius: "8px",
                          fontFamily: "monospace",
                          fontSize: "11px",
                        }}
                        labelStyle={{ color: "#94a3b8" }}
                        formatter={(value) =>
                          formatCurrency(Number(value ?? 0))
                        }
                        labelFormatter={(label) => `Trade ${label}`}
                      />
                      <ReferenceLine
                        y={profitTargetBalance}
                        stroke="#34d399"
                        strokeDasharray="6 4"
                        strokeWidth={1.5}
                        label={{
                          value: `Target ${formatCurrency(profitTargetBalance)}`,
                          position: "insideTopRight",
                          fill: "#34d399",
                          fontSize: 10,
                          fontFamily: "monospace",
                        }}
                      />
                      <ReferenceLine
                        y={drawdownFloorBalance}
                        stroke="#f87171"
                        strokeDasharray="6 4"
                        strokeWidth={1.5}
                        label={{
                          value: `DD ${formatCurrency(drawdownFloorBalance)}`,
                          position: "insideBottomRight",
                          fill: "#f87171",
                          fontSize: 10,
                          fontFamily: "monospace",
                        }}
                      />
                      {result.runs.map((run) => (
                        <Line
                          key={run.id}
                          type="monotone"
                          dataKey={`r${run.id}`}
                          stroke={runStroke(run.status)}
                          strokeWidth={1}
                          dot={false}
                          activeDot={false}
                          isAnimationActive={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                    <BarChart3 className="h-10 w-10 text-slate-700" />
                    <p className="font-mono text-sm text-slate-500">
                      Configure your parameters and run the simulation
                    </p>
                    <p className="max-w-xs font-mono text-[10px] text-slate-600">
                      Each click generates 50 fresh equity paths using your win
                      rate, R:R, and risk per trade.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-lg border border-slate-800/60 bg-obsidian-900/40 px-6 py-8 text-center">
                {result ? (
                  <>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      Simulation Result
                    </p>
                    <p
                      className={cn(
                        "mt-3 font-mono text-3xl font-bold sm:text-4xl",
                        result.passProbability >= 50
                          ? "text-emerald-400"
                          : result.passProbability >= 25
                            ? "text-amber-400"
                            : "text-red-400"
                      )}
                    >
                      Probability of Passing: {result.passProbability.toFixed(1)}%
                    </p>
                    <p className="mt-2 font-mono text-xs text-slate-500">
                      {result.passedCount} of {RUN_COUNT} runs reached the{" "}
                      {profitTargetPct}% profit target before breaching{" "}
                      {maxDrawdownPct}% max drawdown.
                    </p>
                  </>
                ) : (
                  <p className="font-mono text-sm text-slate-500">
                    Probability of Passing: —%
                  </p>
                )}
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}