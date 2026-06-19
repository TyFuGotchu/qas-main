"use client";

import { useState, useMemo } from "react";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { Badge } from "@/components/ui/Badge";
import { Copy, Check } from "lucide-react";

type TradingStyle = "Conservative" | "Balanced" | "Aggressive";
type MarketPhase = "Trending" | "Ranging" | "High-Volatility";

const STYLE_PARAMS: Record<TradingStyle, Record<string, number | string>> = {
  Conservative: {
    riskPerTrade: 0.25,
    maxDailyLoss: 3.0,
    lotMultiplier: 0.5,
    stopLossPips: 25,
    takeProfitPips: 50,
    trailingStop: 15,
    maxOpenTrades: 2,
  },
  Balanced: {
    riskPerTrade: 0.5,
    maxDailyLoss: 4.5,
    lotMultiplier: 1.0,
    stopLossPips: 35,
    takeProfitPips: 70,
    trailingStop: 20,
    maxOpenTrades: 3,
  },
  Aggressive: {
    riskPerTrade: 1.0,
    maxDailyLoss: 4.8,
    lotMultiplier: 1.5,
    stopLossPips: 50,
    takeProfitPips: 100,
    trailingStop: 30,
    maxOpenTrades: 5,
  },
};

const PHASE_MODIFIERS: Record<MarketPhase, Record<string, number | string | boolean>> = {
  Trending: {
    trendFilter: true,
    emaPeriod: 21,
    adxThreshold: 25,
    sessionBias: "TrendFollow",
    volatilityGate: 0.8,
  },
  Ranging: {
    trendFilter: false,
    emaPeriod: 50,
    adxThreshold: 18,
    sessionBias: "MeanRevert",
    volatilityGate: 0.5,
  },
  "High-Volatility": {
    trendFilter: true,
    emaPeriod: 13,
    adxThreshold: 30,
    sessionBias: "Breakout",
    volatilityGate: 1.2,
  },
};

export function PresetGenerator() {
  const [style, setStyle] = useState<TradingStyle>("Balanced");
  const [phase, setPhase] = useState<MarketPhase>("Trending");
  const [outputFormat, setOutputFormat] = useState<"JSON" | "INI">("JSON");
  const [copied, setCopied] = useState(false);

  const config = useMemo(() => {
    const base = STYLE_PARAMS[style];
    const phaseMod = PHASE_MODIFIERS[phase];
    return {
      meta: {
        generator: "Quicksilver Preset Generator v2.4",
        style,
        marketPhase: phase,
        generatedAt: new Date().toISOString(),
      },
      risk: {
        riskPerTrade: base.riskPerTrade,
        maxDailyLoss: base.maxDailyLoss,
        lotMultiplier: base.lotMultiplier,
        maxOpenTrades: base.maxOpenTrades,
      },
      execution: {
        stopLossPips: base.stopLossPips,
        takeProfitPips: base.takeProfitPips,
        trailingStop: base.trailingStop,
        spreadFilter: style === "Conservative" ? 2.0 : style === "Balanced" ? 2.5 : 3.5,
      },
      strategy: {
        trendFilter: phaseMod.trendFilter,
        emaPeriod: phaseMod.emaPeriod,
        adxThreshold: phaseMod.adxThreshold,
        sessionBias: phaseMod.sessionBias,
        volatilityGate: phaseMod.volatilityGate,
      },
      sessions: {
        london: { start: "07:00", end: "16:00", enabled: true },
        newYork: { start: "12:00", end: "21:00", enabled: true },
        asian: { start: "00:00", end: "07:00", enabled: phase === "Ranging" },
      },
    };
  }, [style, phase]);

  const output = useMemo(() => {
    if (outputFormat === "JSON") {
      return JSON.stringify(config, null, 2);
    }

    const lines = [
      "; Quicksilver Algo Preset Configuration",
      `; Style: ${style} | Phase: ${phase}`,
      "",
      "[Risk]",
      `RiskPerTrade=${config.risk.riskPerTrade}`,
      `MaxDailyLoss=${config.risk.maxDailyLoss}`,
      `LotMultiplier=${config.risk.lotMultiplier}`,
      `MaxOpenTrades=${config.risk.maxOpenTrades}`,
      "",
      "[Execution]",
      `StopLossPips=${config.execution.stopLossPips}`,
      `TakeProfitPips=${config.execution.takeProfitPips}`,
      `TrailingStop=${config.execution.trailingStop}`,
      `SpreadFilter=${config.execution.spreadFilter}`,
      "",
      "[Strategy]",
      `TrendFilter=${config.strategy.trendFilter}`,
      `EMAPeriod=${config.strategy.emaPeriod}`,
      `ADXThreshold=${config.strategy.adxThreshold}`,
      `SessionBias=${config.strategy.sessionBias}`,
      `VolatilityGate=${config.strategy.volatilityGate}`,
      "",
      "[Sessions]",
      `LondonStart=${config.sessions.london.start}`,
      `LondonEnd=${config.sessions.london.end}`,
      `NewYorkStart=${config.sessions.newYork.start}`,
      `NewYorkEnd=${config.sessions.newYork.end}`,
    ];
    return lines.join("\n");
  }, [config, outputFormat, style, phase]);

  async function handleCopy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Select
          label="Trading Style"
          options={[
            { value: "Conservative", label: "Conservative" },
            { value: "Balanced", label: "Balanced" },
            { value: "Aggressive", label: "Aggressive" },
          ]}
          value={style}
          onChange={(e) => setStyle(e.target.value as TradingStyle)}
        />
        <Select
          label="Market Phase"
          options={[
            { value: "Trending", label: "Trending" },
            { value: "Ranging", label: "Ranging" },
            { value: "High-Volatility", label: "High-Volatility" },
          ]}
          value={phase}
          onChange={(e) => setPhase(e.target.value as MarketPhase)}
        />
        <Select
          label="Output Format"
          options={[
            { value: "JSON", label: "JSON (Python/API)" },
            { value: "INI", label: "INI (MQL5 Terminal)" },
          ]}
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value as "JSON" | "INI")}
        />

        <div className="rounded-lg border border-slate-700/50 bg-obsidian-950 p-4">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-500">
            Parameter Preview
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-slate-500">Risk/Trade</div>
            <div className="text-right text-cyan-400">
              {config.risk.riskPerTrade}%
            </div>
            <div className="text-slate-500">Stop Loss</div>
            <div className="text-right text-cyan-400">
              {config.execution.stopLossPips} pips
            </div>
            <div className="text-slate-500">Take Profit</div>
            <div className="text-right text-cyan-400">
              {config.execution.takeProfitPips} pips
            </div>
            <div className="text-slate-500">EMA Period</div>
            <div className="text-right text-cyan-400">
              {config.strategy.emaPeriod}
            </div>
            <div className="text-slate-500">Session Bias</div>
            <div className="text-right text-emerald-400">
              {config.strategy.sessionBias}
            </div>
          </div>
          <Badge variant="success" className="mt-4">
            {style} / {phase}
          </Badge>
        </div>
      </div>

      <TerminalPanel title={`${outputFormat} Configuration Output`} status="online">
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words text-xs text-slate-400">
          {output}
        </pre>
        <Button
          variant="primary"
          size="sm"
          className="mt-4"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy to Clipboard
            </>
          )}
        </Button>
      </TerminalPanel>
    </div>
  );
}