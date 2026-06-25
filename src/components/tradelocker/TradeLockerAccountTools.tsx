"use client";

import type {
  TradeLockerDashboardData,
} from "@/lib/tradelocker/types";
import { LiveRiskGuard } from "@/components/tradelocker/tools/LiveRiskGuard";
import { LivePositionSizer } from "@/components/tradelocker/tools/LivePositionSizer";
import { LiveGrowthCoach } from "@/components/tradelocker/tools/LiveGrowthCoach";
import { Badge } from "@/components/ui/Badge";
import { Wrench } from "lucide-react";

interface TradeLockerAccountToolsProps {
  dashboard: TradeLockerDashboardData | null;
  loading?: boolean;
}

export function TradeLockerAccountTools({
  dashboard,
  loading,
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
          Connect an account and select it above to unlock risk guard, position
          sizer, and growth coach.
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
        <Badge variant="success">3 pro tools</Badge>
        <span className="font-mono text-xs text-slate-600">
          Powered by your connected TradeLocker balance & positions
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-3">
        <LiveRiskGuard metrics={dashboard.metrics} />
        <LivePositionSizer
          metrics={dashboard.metrics}
          positions={dashboard.positions}
        />
        <LiveGrowthCoach metrics={dashboard.metrics} />
      </div>
    </section>
  );
}