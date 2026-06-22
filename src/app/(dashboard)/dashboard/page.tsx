import { getFreshSession } from "@/lib/access-control";
import { canAccessTools } from "@/lib/tiers";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { RecommendedBrokerCard } from "@/components/broker/RecommendedBrokerCard";
import { AnnouncementBanner } from "@/components/announcements/AnnouncementBanner";
import { TOOL_COUNT } from "@/lib/tools-registry";
import {
  Bot,
  Wrench,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Users,
} from "lucide-react";

export default async function DashboardPage() {
  const user = await getFreshSession();
  const hasPremium = user ? canAccessTools(user.accountTier) : false;

  const quickLinks = [
    {
      href: "/dashboard/academy",
      label: "Chart Academy",
      icon: BookOpen,
      desc: "Learn charts, candlesticks, Fibonacci, and trading styles",
      locked: false,
    },
    {
      href: "/dashboard/trade-together",
      label: "Trade Together",
      icon: Users,
      desc: "Community threads — discuss setups and markets with other traders",
      locked: false,
    },
    {
      href: "/dashboard/bot",
      label: "Bot Activation",
      icon: Bot,
      desc: "Activate bot via TradeLocker or download MQL5 packages",
      locked: false,
    },
    {
      href: "/dashboard/tools",
      label: "Trading Tools",
      icon: Wrench,
      desc: `${TOOL_COUNT} manual trading planning tools`,
      locked: !hasPremium,
    },
    {
      href: "/dashboard/discord",
      label: "Discord Portal",
      icon: MessageSquare,
      desc: "VIP verification and community access",
      locked: !hasPremium,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-mono text-2xl font-bold text-slate-200">
          Command Center
        </h2>
        <p className="mt-1 font-mono text-sm text-slate-500">
          Welcome back, {user?.name ?? user?.email}
        </p>
      </div>

      <AnnouncementBanner />

      <RecommendedBrokerCard />

      {!hasPremium && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-center gap-4 py-4">
            <AlertTriangle className="h-6 w-6 shrink-0 text-amber-400" />
            <div className="flex-1">
              <p className="font-mono text-sm text-amber-300">
                Bot Only tier active — Premium tools are locked
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Upgrade to Premium Quant or Lifetime Alpha to unlock the full
                trading suite.
              </p>
            </div>
            <Link href="/dashboard/upgrade">
              <Button variant="primary" size="sm">
                Upgrade Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Sessions", value: "1", status: "online" },
          { label: "Bot Status", value: "Ready", status: "online" },
          { label: "Tools Available", value: hasPremium ? String(TOOL_COUNT) : "0", status: hasPremium ? "online" : "warning" },
          { label: "Account Tier", value: user?.accountTier ?? "—", status: "online" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="py-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-600">
                {stat.label}
              </p>
              <p className="mt-2 font-mono text-xl font-bold text-cyan-terminal">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.locked ? "/dashboard/upgrade" : link.href}
            >
              <Card className="h-full transition-all hover:border-cyan-500/30 hover:bg-obsidian-900">
                <CardHeader className="flex flex-row items-center gap-3">
                  <Icon className="h-5 w-5 text-cyan-400" />
                  <div className="flex-1">
                    <h3 className="font-mono text-sm font-semibold text-slate-200">
                      {link.label}
                    </h3>
                    {link.locked && (
                      <Badge variant="warning" className="mt-1">
                        Premium Required
                      </Badge>
                    )}
                  </div>
                  <TrendingUp className="h-4 w-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500">{link.desc}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}