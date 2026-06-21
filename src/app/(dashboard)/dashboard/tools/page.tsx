import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TOOLS, TOOL_COUNT } from "@/lib/tools-registry";

export default function ToolsIndexPage() {
  return (
    <div className="space-y-8">
      <GlassPanel className="p-6" glow>
        <h2 className="font-mono text-2xl font-bold text-slate-100">
          Institutional Trading Toolkit
        </h2>
        <p className="mt-2 font-mono text-sm text-slate-500">
          {TOOL_COUNT} master instruments — live market data, no brokerage
          connection required. Premium Quant & Lifetime Alpha.
        </p>
      </GlassPanel>

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
  );
}