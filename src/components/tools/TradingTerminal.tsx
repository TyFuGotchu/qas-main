"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TOOLS, TOOL_COUNT } from "@/lib/tools-registry";

export function TradingTerminal() {
  return (
    <div className="space-y-8">
      <GlassPanel className="p-6" glow>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-mono text-2xl font-bold text-slate-100">
              Quicksilver Systems Toolkit
            </h2>
            <p className="mt-2 max-w-2xl font-mono text-sm text-slate-500">
              {TOOL_COUNT} proprietary institutional engines — exclusive to Quicksilver
              Algo Systems. No external market feeds. No brokerage required. Pure
              QS protocol intelligence.
            </p>
          </div>
          <Badge variant="success" className="shrink-0">
            QS EXCLUSIVE
          </Badge>
        </div>
      </GlassPanel>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Proprietary Engines", value: String(TOOL_COUNT) },
          { label: "External APIs", value: "0" },
          { label: "QS Protocol Layers", value: "7+" },
        ].map((stat) => (
          <GlassPanel key={stat.label} className="p-4 text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-600">
              {stat.label}
            </p>
            <p className="mt-1 font-mono text-2xl font-bold text-cyan-accent">
              {stat.value}
            </p>
          </GlassPanel>
        ))}
      </div>

      <div>
        <h3 className="mb-4 font-mono text-sm font-semibold uppercase tracking-widest text-slate-400">
          QS Institutional Modules
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.href} href={tool.href}>
                <Card className="h-full border-white/5 bg-slate-950/60 backdrop-blur transition-all hover:border-cyan-accent/30 hover:shadow-[0_0_24px_rgba(0,229,255,0.12)]">
                  <CardHeader className="flex flex-row items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-accent/30 bg-cyan-accent/10">
                      <Icon className="h-5 w-5 text-cyan-accent" />
                    </div>
                    <div className="flex-1">
                      <Badge variant="success" className="mb-2">
                        {tool.tag}
                      </Badge>
                      <h3 className="font-mono text-sm font-semibold text-slate-200">
                        {tool.shortName}
                      </h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-500">{tool.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}