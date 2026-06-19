import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Grid3x3,
  LineChart,
  Settings2,
  Calculator,
  Calendar,
} from "lucide-react";

const tools = [
  {
    href: "/dashboard/tools/drawdown-matrix",
    name: "Prop Firm Drawdown Matrix",
    desc: "Simulate historical volatility against lot sizes to calculate breach risk for prop firm challenges.",
    icon: Grid3x3,
    tag: "Risk Engine",
  },
  {
    href: "/dashboard/tools/correlation-monitor",
    name: "Volatility Correlation Monitor",
    desc: "Visualize real-time correlation between XAUUSD, US30, and NAS100 across custom lookback windows.",
    icon: LineChart,
    tag: "Analytics",
  },
  {
    href: "/dashboard/tools/preset-generator",
    name: "Automated Preset Generator",
    desc: "Generate MQL5/Python configuration blocks based on trading style and current market phase.",
    icon: Settings2,
    tag: "Constructor",
  },
  {
    href: "/dashboard/tools/lot-calculator",
    name: "Lot-Size & R:R Calculator",
    desc: "Advanced position sizing with spread, commission, and risk-to-reward calculations per asset.",
    icon: Calculator,
    tag: "Execution",
  },
  {
    href: "/dashboard/tools/session-volatility",
    name: "Session Volatility Aggregator",
    desc: "London/NY session overlap timeline with hourly ATR data and playbook execution windows.",
    icon: Calendar,
    tag: "Sessions",
  },
];

export default function ToolsIndexPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-mono text-2xl font-bold text-slate-200">
          Trading Tools Suite
        </h2>
        <p className="mt-1 font-mono text-sm text-slate-500">
          5 exclusive internal instruments — Premium Quant & Lifetime Alpha
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.href} href={tool.href}>
              <Card className="h-full transition-all hover:border-cyan-500/30 hover:bg-obsidian-900">
                <CardHeader className="flex flex-row items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded border border-cyan-500/30 bg-cyan-500/10">
                    <Icon className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <Badge variant="success" className="mb-2">
                      {tool.tag}
                    </Badge>
                    <h3 className="font-mono text-sm font-semibold text-slate-200">
                      {tool.name}
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