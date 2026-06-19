"use client";

import { useState, useMemo } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";

const ASSET_SPECS: Record<
  string,
  { pipValue: number; pipSize: number; label: string }
> = {
  XAUUSD: { pipValue: 1, pipSize: 0.1, label: "XAUUSD (Gold)" },
  EURUSD: { pipValue: 10, pipSize: 0.0001, label: "EURUSD" },
  US30: { pipValue: 1, pipSize: 1, label: "US30 (Dow)" },
  NAS100: { pipValue: 1, pipSize: 1, label: "NAS100 (Nasdaq)" },
  GBPUSD: { pipValue: 10, pipSize: 0.0001, label: "GBPUSD" },
};

export function LotCalculator() {
  const [accountBalance, setAccountBalance] = useState("100000");
  const [riskPercent, setRiskPercent] = useState("0.5");
  const [stopLossPips, setStopLossPips] = useState("35");
  const [spread, setSpread] = useState("2.5");
  const [commission, setCommission] = useState("7");
  const [rewardRatio, setRewardRatio] = useState("2");
  const [asset, setAsset] = useState("XAUUSD");

  const calculation = useMemo(() => {
    const balance = parseFloat(accountBalance) || 0;
    const risk = parseFloat(riskPercent) || 0;
    const slPips = parseFloat(stopLossPips) || 0;
    const spreadPips = parseFloat(spread) || 0;
    const commissionPerLot = parseFloat(commission) || 0;
    const rr = parseFloat(rewardRatio) || 0;

    const spec = ASSET_SPECS[asset] ?? ASSET_SPECS.XAUUSD;
    const riskAmount = balance * (risk / 100);

    const effectiveStopPips = slPips + spreadPips;
    const pipValuePerLot = spec.pipValue;

    const rawLots =
      effectiveStopPips > 0
        ? riskAmount / (effectiveStopPips * pipValuePerLot)
        : 0;

    const commissionCost = rawLots * commissionPerLot * 2;
    const adjustedRisk = riskAmount - commissionCost;
    const adjustedLots =
      effectiveStopPips > 0
        ? Math.max(0, adjustedRisk / (effectiveStopPips * pipValuePerLot))
        : 0;

    const finalLots = Math.floor(adjustedLots * 100) / 100;
    const actualRisk =
      finalLots * effectiveStopPips * pipValuePerLot + finalLots * commissionPerLot * 2;
    const actualRiskPct = balance > 0 ? (actualRisk / balance) * 100 : 0;

    const takeProfitPips = slPips * rr;
    const potentialProfit =
      finalLots * takeProfitPips * pipValuePerLot -
      finalLots * commissionPerLot * 2;
    const potentialLoss = finalLots * effectiveStopPips * pipValuePerLot + finalLots * commissionPerLot * 2;

    const marginRequired = finalLots * 1000;

    return {
      riskAmount,
      finalLots,
      actualRisk,
      actualRiskPct,
      takeProfitPips,
      potentialProfit,
      potentialLoss,
      effectiveStopPips,
      marginRequired,
      commissionCost: finalLots * commissionPerLot * 2,
      pipValuePerLot,
    };
  }, [
    accountBalance,
    riskPercent,
    stopLossPips,
    spread,
    commission,
    rewardRatio,
    asset,
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Input
          label="Account Balance ($)"
          type="number"
          value={accountBalance}
          onChange={(e) => setAccountBalance(e.target.value)}
        />
        <Input
          label="Risk Per Trade (%)"
          type="number"
          step="0.1"
          value={riskPercent}
          onChange={(e) => setRiskPercent(e.target.value)}
        />
        <Select
          label="Asset"
          options={Object.entries(ASSET_SPECS).map(([key, spec]) => ({
            value: key,
            label: spec.label,
          }))}
          value={asset}
          onChange={(e) => setAsset(e.target.value)}
        />
        <Input
          label="Stop Loss Distance (pips)"
          type="number"
          value={stopLossPips}
          onChange={(e) => setStopLossPips(e.target.value)}
        />
        <Input
          label="Broker Spread (pips)"
          type="number"
          step="0.1"
          value={spread}
          onChange={(e) => setSpread(e.target.value)}
        />
        <Input
          label="Commission ($/lot round-trip)"
          type="number"
          step="0.5"
          value={commission}
          onChange={(e) => setCommission(e.target.value)}
        />
        <Input
          label="Risk:Reward Ratio"
          type="number"
          step="0.5"
          value={rewardRatio}
          onChange={(e) => setRewardRatio(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <TerminalPanel title="Position Sizing Output" status="online">
          <div className="mb-6 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Recommended Lot Size
            </p>
            <p className="font-mono text-5xl font-bold text-cyan-terminal terminal-glow">
              {calculation.finalLots.toFixed(2)}
            </p>
            <p className="mt-1 font-mono text-sm text-slate-600">standard lots</p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Risk Amount</span>
              <span className="text-slate-300">
                {formatCurrency(calculation.riskAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Effective Stop (incl. spread)</span>
              <span className="text-slate-300">
                {calculation.effectiveStopPips.toFixed(1)} pips
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Actual Risk</span>
              <span className="text-amber-400">
                {formatCurrency(calculation.actualRisk)} (
                {calculation.actualRiskPct.toFixed(2)}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Commission Cost</span>
              <span className="text-slate-400">
                {formatCurrency(calculation.commissionCost)}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-2">
              <span className="text-slate-500">Take Profit Target</span>
              <span className="text-emerald-400">
                {calculation.takeProfitPips.toFixed(0)} pips
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Potential Profit</span>
              <span className="text-emerald-400">
                +{formatCurrency(calculation.potentialProfit)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Potential Loss</span>
              <span className="text-red-400">
                -{formatCurrency(calculation.potentialLoss)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Est. Margin Required</span>
              <span className="text-slate-400">
                {formatCurrency(calculation.marginRequired)}
              </span>
            </div>
          </div>

          <Badge
            variant={
              calculation.actualRiskPct > parseFloat(riskPercent) * 1.1
                ? "warning"
                : "success"
            }
            className="mt-4"
          >
            R:R 1:{rewardRatio} — Pip Value ${calculation.pipValuePerLot}/lot
          </Badge>
        </TerminalPanel>
      </div>
    </div>
  );
}