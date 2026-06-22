"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "@/providers/SessionProvider";
import { canAccessTools } from "@/lib/tiers";
import {
  LayoutDashboard,
  Bot,
  Wrench,
  MessageSquare,
  ArrowUpCircle,
  Zap,
  Lock,
  BookOpen,
  Users,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  premiumOnly?: boolean;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/academy", label: "Chart Academy", icon: BookOpen },
  { href: "/dashboard/trade-together", label: "Trade Together", icon: Users },
  { href: "/dashboard/bot", label: "Bot Activation", icon: Bot },
  { href: "/dashboard/tools", label: "Trading Tools", icon: Wrench, premiumOnly: true },
  { href: "/dashboard/discord", label: "Discord Portal", icon: MessageSquare, premiumOnly: true },
  { href: "/dashboard/upgrade", label: "Upgrade Tier", icon: ArrowUpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useSession();
  const hasPremium = user ? canAccessTools(user.accountTier) : false;

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-800/60 bg-obsidian-950">
      <div className="flex h-16 items-center gap-2 border-b border-slate-800/60 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded border border-cyan-500/40 bg-cyan-500/10">
          <Zap className="h-4 w-4 text-cyan-400" />
        </div>
        <span className="font-mono text-xs font-bold tracking-wider text-slate-200">
          QS<span className="text-cyan-400">.ALGO</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const isLocked = item.premiumOnly && !hasPremium;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={isLocked ? "/dashboard/upgrade" : item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-wider transition-all",
                isActive
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                  : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300 border border-transparent",
                isLocked && "opacity-60"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isLocked && <Lock className="h-3 w-3 text-amber-400" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800/60 p-4">
        <div className="rounded-lg border border-slate-700/50 bg-obsidian-900 p-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600">
            System Status
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs text-emerald-400">Operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}