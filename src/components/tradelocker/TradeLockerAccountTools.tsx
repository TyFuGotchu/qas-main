"use client";

import type { TradeLockerDashboardData } from "@/lib/tradelocker/types";
import { LiveRiskGuard } from "@/components/tradelocker/tools/LiveRiskGuard";
import { LivePositionSizer } from "@/components/tradelocker/tools/LivePositionSizer";
import { LiveGrowthCoach } from "@/components/tradelocker/tools/LiveGrowthCoach";
import { LiveExposureScanner } from "@/components/tradelocker/tools/LiveExposureScanner";
import { Badge } from "@/components/ui/Badge";
import { Wrench } from "lucide-react";

interface TradeLockerAccountToolsProps {
  dashboard: TradeLockerDashboardData | null;
  loading?: boolean;
  instrumentNames?: Map<string, string>;
}

export function TradeLockerAccountTools({
  dashboard,
  loading,
  instrumentNames,
}: TradeLockerAccountToolsProps) {
  if (loading || !dashboard) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Wrench className="h-4 w-4 text-cyan-400" />
          <h3 className="font-mono text-sm font-semibold uppercase tracking-widest text-slate-500">
            Live Account Tools
          </h3>
        </div>
        <p className="font-mono text-sm text-slate-600">
          Connect an account and select it above to unlock Risk Guard, Position
          Sizer, Growth Coach, and Exposure Scanner.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Wrench className="h-5 w-5 text-cyan-400" />
        <h3 className="font-mono text-sm font-semibold uppercase tracking-widest text-slate-400">
          Live Account Tools
        </h3>
        <Badge variant="success">4 pro tools</Badge>
        <span className="font-mono text-xs text-slate-600">
          Powered by your connected TradeLocker balance & positions
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <LiveRiskGuard metrics={dashboard.metrics} />
        <LivePositionSizer
          metrics={dashboard.metrics}
          positions={dashboard.positions}
        />
        <LiveGrowthCoach metrics={dashboard.metrics} />
        <LiveExposureScanner
          metrics={dashboard.metrics}
          positions={dashboard.positions}
          instrumentNames={instrumentNames}
        />
      </div>
    </section>
  );
}