"use client";

import type { SessionStatsResult } from "@/lib/journal/stats";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { SessionBadge } from "@/components/journal/SessionBadge";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface SessionBreakdownProps {
  stats: SessionStatsResult;
}

export function SessionBreakdown({ stats }: SessionBreakdownProps) {
  if (stats.rows.length === 0) return null;

  const maxWinRate = Math.max(...stats.rows.map((r) => r.winRate), 1);

  return (
    <TerminalPanel title="Edge by session" status="online">
      <div className="space-y-4">
        <p className="flex items-start gap-2 font-mono text-xs text-slate-400">
          <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
          {stats.insight}
        </p>

        <div className="space-y-3">
          {stats.rows.map((row) => {
            const isBest = row.session === stats.bestSession;
            const barWidth = Math.round((row.winRate / maxWinRate) * 100);

            return (
              <div
                key={row.session}
                className={cn(
                  "rounded-lg border px-4 py-3",
                  isBest
                    ? "border-cyan-500/30 bg-cyan-500/5"
                    : "border-slate-800/60 bg-slate-900/30"
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <SessionBadge sessionId={row.session} />
                    {isBest && (
                      <span className="font-mono text-[10px] uppercase text-cyan-400">
                        Best edge
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs text-slate-500">
                    {row.trades} trades · {row.closed} closed
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                  <div className="min-w-[140px] flex-1">
                    <div className="mb-1 flex justify-between font-mono text-[10px] text-slate-600">
                      <span>Win rate</span>
                      <span>{row.winRate}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          isBest ? "bg-cyan-500" : "bg-slate-500"
                        )}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <p
                      className={cn(
                        "font-semibold",
                        row.totalPnl >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      )}
                    >
                      ${row.totalPnl.toLocaleString()}
                    </p>
                    <p className="text-slate-600">
                      {row.avgR != null ? `${row.avgR}R avg` : "—"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </TerminalPanel>
  );
}