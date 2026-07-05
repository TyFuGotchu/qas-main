"use client";

import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import Input from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { computeCompoundingMatrix } from "@/lib/quicksilver/compounding-matrix";

function formatMoney(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function CompoundingMatrix() {
  const [balance, setBalance] = useState("100000");
  const [target, setTarget] = useState("8000");
  const [winRate, setWinRate] = useState("55");
  const [maxDd, setMaxDd] = useState("10");

  const result = useMemo(() => {
    try {
      return computeCompoundingMatrix({
        startingBalance: Number(balance),
        targetProfit: Number(target),
        winRate: Number(winRate),
        maxDrawdownPct: Number(maxDd),
      });
    } catch {
      return null;
    }
  }, [balance, target, winRate, maxDd]);

  const onPace =
    result && result.summary.projectedEndBalance >= result.summary.targetBalance;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <GlassPanel className="p-6">
          <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
            Challenge Parameters
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Starting Balance ($)" value={balance} onChange={(e) => setBalance(e.target.value)} type="number" />
            <Input label="Target Profit ($)" value={target} onChange={(e) => setTarget(e.target.value)} type="number" />
            <Input label="Win Rate (%)" value={winRate} onChange={(e) => setWinRate(e.target.value)} type="number" />
            <Input label="Max Drawdown (%)" value={maxDd} onChange={(e) => setMaxDd(e.target.value)} type="number" />
          </div>
        </GlassPanel>
        <TerminalPanel title="Projection Summary">
          {result ? (
            <>
              <p className="font-mono text-2xl font-bold text-slate-100">
                {formatMoney(result.summary.projectedEndBalance)}
              </p>
              <p className="mt-1 font-mono text-xs text-slate-500">
                Target: {formatMoney(result.summary.targetBalance)}
              </p>
              <Badge variant={onPace ? "success" : "warning"} className="mt-4">
                {onPace ? "On pace for target" : "Below target trajectory"}
              </Badge>
            </>
          ) : (
            <p className="text-sm text-slate-500">Enter valid challenge parameters.</p>
          )}
        </TerminalPanel>
      </div>

      {result && (
        <GlassPanel className="overflow-x-auto p-4">
          <table className="w-full min-w-[640px] font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-left text-slate-500">
                <th className="px-2 py-2">Trade</th>
                <th className="px-2 py-2 text-right">Balance</th>
                <th className="px-2 py-2 text-right">Risk %</th>
                <th className="px-2 py-2 text-right">Risk $</th>
                <th className="px-2 py-2 text-right">Lot</th>
                <th className="px-2 py-2 text-right">If Win</th>
                <th className="px-2 py-2 text-right">If Loss</th>
                <th className="px-2 py-2 text-right">Expected</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => (
                <tr key={row.trade} className="border-b border-slate-800/50 text-slate-300">
                  <td className="px-2 py-2">#{row.trade}</td>
                  <td className="px-2 py-2 text-right">{formatMoney(row.balance)}</td>
                  <td className="px-2 py-2 text-right">{row.riskPct}%</td>
                  <td className="px-2 py-2 text-right">{formatMoney(row.riskAmount)}</td>
                  <td className="px-2 py-2 text-right">{row.lotSize.toFixed(2)}</td>
                  <td className="px-2 py-2 text-right text-emerald-400">{formatMoney(row.ifWin)}</td>
                  <td className="px-2 py-2 text-right text-red-400">{formatMoney(row.ifLoss)}</td>
                  <td className="px-2 py-2 text-right">{formatMoney(row.expectedBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassPanel>
      )}
    </div>
  );
}