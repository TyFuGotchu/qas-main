"use client";

import { useMemo } from "react";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { Badge } from "@/components/ui/Badge";
import { SESSION_ATR_DATA } from "@/lib/trading-data";

export function SessionVolatility() {
  const analysis = useMemo(() => {
    const peakOverlap = SESSION_ATR_DATA.reduce(
      (max, d) => (d.overlap > max.overlap ? d : max),
      SESSION_ATR_DATA[0]
    );
    const peakLondon = SESSION_ATR_DATA.reduce(
      (max, d) => (d.london > max.london ? d : max),
      SESSION_ATR_DATA[0]
    );
    const peakNY = SESSION_ATR_DATA.reduce(
      (max, d) => (d.newYork > max.newYork ? d : max),
      SESSION_ATR_DATA[0]
    );

    const lowVolHours = SESSION_ATR_DATA.filter(
      (d) => d.overlap === 0 && d.london < 12 && d.newYork < 12
    );

    const executionWindows = SESSION_ATR_DATA.filter(
      (d) => d.overlap >= 40 || d.newYork >= 45
    );

    return { peakOverlap, peakLondon, peakNY, lowVolHours, executionWindows };
  }, []);

  const maxAtr = Math.max(
    ...SESSION_ATR_DATA.map((d) => Math.max(d.london, d.newYork, d.overlap))
  );

  function formatHour(h: number): string {
    return `${h.toString().padStart(2, "0")}:00 UTC`;
  }

  function getBarWidth(value: number): string {
    return `${(value / maxAtr) * 100}%`;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <TerminalPanel title="Peak Overlap ATR" status="online">
          <p className="font-mono text-3xl font-bold text-cyan-terminal">
            {analysis.peakOverlap.overlap}
          </p>
          <p className="mt-1 font-mono text-xs text-slate-500">
            at {formatHour(analysis.peakOverlap.hour)} UTC
          </p>
        </TerminalPanel>
        <TerminalPanel title="London Peak" status="online">
          <p className="font-mono text-3xl font-bold text-blue-400">
            {analysis.peakLondon.london}
          </p>
          <p className="mt-1 font-mono text-xs text-slate-500">
            at {formatHour(analysis.peakLondon.hour)} UTC
          </p>
        </TerminalPanel>
        <TerminalPanel title="New York Peak" status="online">
          <p className="font-mono text-3xl font-bold text-purple-400">
            {analysis.peakNY.newYork}
          </p>
          <p className="mt-1 font-mono text-xs text-slate-500">
            at {formatHour(analysis.peakNY.hour)} UTC
          </p>
        </TerminalPanel>
      </div>

      <TerminalPanel title="24H Session Volatility Timeline" status="online">
        <div className="space-y-1">
          {SESSION_ATR_DATA.map((row) => (
            <div key={row.hour} className="flex items-center gap-2 text-xs">
              <span className="w-16 shrink-0 font-mono text-slate-600">
                {formatHour(row.hour)}
              </span>
              <div className="flex flex-1 items-center gap-1">
                <div
                  className="h-3 rounded-sm bg-blue-500/60 transition-all"
                  style={{ width: getBarWidth(row.london) }}
                  title={`London ATR: ${row.london}`}
                />
                <div
                  className="h-3 rounded-sm bg-purple-500/60 transition-all"
                  style={{ width: getBarWidth(row.newYork) }}
                  title={`NY ATR: ${row.newYork}`}
                />
                {row.overlap > 0 && (
                  <div
                    className="h-3 rounded-sm bg-cyan-500/80 transition-all"
                    style={{ width: getBarWidth(row.overlap) }}
                    title={`Overlap ATR: ${row.overlap}`}
                  />
                )}
              </div>
              <span className="w-8 text-right font-mono text-slate-500">
                {Math.max(row.london, row.newYork, row.overlap)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-4 font-mono text-[10px] text-slate-600">
          <span className="flex items-center gap-1">
            <span className="h-2 w-4 rounded-sm bg-blue-500/60" /> London
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-4 rounded-sm bg-purple-500/60" /> New York
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-4 rounded-sm bg-cyan-500/80" /> Overlap
          </span>
        </div>
      </TerminalPanel>

      <div className="grid gap-6 lg:grid-cols-2">
        <TerminalPanel title="Execution Windows — BOT ON" status="online">
          <div className="space-y-2">
            {analysis.executionWindows.map((window) => (
              <div
                key={window.hour}
                className="flex items-center justify-between rounded border border-emerald-500/20 bg-emerald-500/5 px-3 py-2"
              >
                <span className="font-mono text-sm text-slate-300">
                  {formatHour(window.hour)} – {formatHour((window.hour + 1) % 24)}
                </span>
                <Badge variant="success">ATR {window.overlap || window.newYork}</Badge>
              </div>
            ))}
          </div>
          <p className="mt-3 font-mono text-xs text-slate-600">
            Toggle automated execution ON during high-volatility overlap windows.
          </p>
        </TerminalPanel>

        <TerminalPanel title="Low Volatility — BOT OFF" status="warning">
          <div className="space-y-2">
            {analysis.lowVolHours.slice(0, 6).map((window) => (
              <div
                key={window.hour}
                className="flex items-center justify-between rounded border border-amber-500/20 bg-amber-500/5 px-3 py-2"
              >
                <span className="font-mono text-sm text-slate-300">
                  {formatHour(window.hour)} – {formatHour((window.hour + 1) % 24)}
                </span>
                <Badge variant="warning">
                  ATR {Math.max(window.london, window.newYork)}
                </Badge>
              </div>
            ))}
          </div>
          <p className="mt-3 font-mono text-xs text-slate-600">
            Disable bots during low-ATR periods to avoid spread erosion and false signals.
          </p>
        </TerminalPanel>
      </div>

      <TerminalPanel title="Playbook Aggregator — Monthly Presets" status="online">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              title: "London Open Breakout",
              session: "07:00–09:00 UTC",
              atr: "32–42",
              status: "Active",
            },
            {
              title: "NY Overlap Momentum",
              session: "13:00–15:00 UTC",
              atr: "48–58",
              status: "Active",
            },
            {
              title: "Asian Range Fade",
              session: "00:00–04:00 UTC",
              atr: "6–10",
              status: "Off",
            },
            {
              title: "Friday Close Reduction",
              session: "20:00–22:00 UTC",
              atr: "10–16",
              status: "Caution",
            },
          ].map((playbook) => (
            <div
              key={playbook.title}
              className="rounded border border-slate-700/50 bg-obsidian-950 p-3"
            >
              <p className="font-mono text-sm text-slate-300">{playbook.title}</p>
              <p className="mt-1 font-mono text-xs text-slate-600">
                {playbook.session} · ATR {playbook.atr}
              </p>
              <Badge
                variant={
                  playbook.status === "Active"
                    ? "success"
                    : playbook.status === "Caution"
                    ? "warning"
                    : "default"
                }
                className="mt-2"
              >
                {playbook.status}
              </Badge>
            </div>
          ))}
        </div>
      </TerminalPanel>
    </div>
  );
}