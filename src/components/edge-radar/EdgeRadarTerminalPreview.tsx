import { Lock } from "lucide-react";
import Button from "@/components/ui/Button";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import {
  EDGE_RADAR_CHECKOUT_URL,
  EDGE_RADAR_SAMPLE_ALERTS,
} from "@/lib/edge-radar";
import { cn } from "@/lib/utils";

const KIND_STYLES = {
  sports: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
  macro: "border-cyan-500/30 bg-cyan-500/5 text-cyan-400",
} as const;

function EdgeRadarAlertRow({
  alert,
  blurred,
}: {
  alert: (typeof EDGE_RADAR_SAMPLE_ALERTS)[number];
  blurred?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid gap-2 border-b border-slate-800/50 px-4 py-3 sm:grid-cols-[4.5rem_1fr_auto] sm:items-center sm:gap-4",
        blurred && "select-none blur-[3px]"
      )}
    >
      <span className="font-mono text-[10px] text-slate-600">{alert.timestamp}</span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-semibold text-slate-200">{alert.asset}</span>
          <span
            className={cn(
              "rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider",
              KIND_STYLES[alert.kind]
            )}
          >
            {alert.signal}
          </span>
        </div>
        <p className="mt-1 font-mono text-[11px] leading-relaxed text-slate-500">{alert.detail}</p>
      </div>
      {alert.ev && (
        <span className="font-mono text-xs font-semibold text-amber-400 sm:text-right">
          {alert.ev}
        </span>
      )}
    </div>
  );
}

interface EdgeRadarTerminalPreviewProps {
  ctaLabel?: string;
}

export function EdgeRadarTerminalPreview({
  ctaLabel = "Subscribe to Unlock Live Dashboard",
}: EdgeRadarTerminalPreviewProps) {
  const visibleAlerts = EDGE_RADAR_SAMPLE_ALERTS.filter((a) => !a.locked);
  const lockedAlerts = EDGE_RADAR_SAMPLE_ALERTS.filter((a) => a.locked);

  return (
    <div className="relative overflow-hidden rounded-lg">
      <TerminalPanel title="QS Edge Radar · Live Feed" status="online" className="!p-0">
        <div className="border-b border-slate-800/60 bg-slate-900/40 px-4 py-2">
          <div className="hidden font-mono text-[10px] uppercase tracking-widest text-slate-600 sm:grid sm:grid-cols-[4.5rem_1fr_auto] sm:gap-4">
            <span>Time</span>
            <span>Alert</span>
            <span className="text-right">Edge</span>
          </div>
        </div>

        {visibleAlerts.map((alert) => (
          <EdgeRadarAlertRow key={alert.id} alert={alert} />
        ))}

        {lockedAlerts.length > 0 && (
          <div className="relative">
            {lockedAlerts.map((alert) => (
              <EdgeRadarAlertRow key={alert.id} alert={alert} blurred />
            ))}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/70 to-slate-950/95" />

            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end px-4 pb-8 pt-16 text-center">
              <div className="pointer-events-auto flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-500/30 bg-slate-950/90 shadow-[0_0_24px_rgba(0,229,255,0.15)]">
                  <Lock className="h-5 w-5 text-cyan-accent" aria-hidden />
                </div>
                <p className="mt-4 font-mono text-sm font-semibold text-slate-200">
                  Live alerts are subscriber-only
                </p>
                <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-500">
                  Unlock the full terminal with real-time sports prop lags and macro sentiment
                  spikes — hosted on-site, no setup required.
                </p>
                <a
                  href={EDGE_RADAR_CHECKOUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5"
                >
                  <Button variant="primary" size="lg">
                    {ctaLabel}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </TerminalPanel>
    </div>
  );
}