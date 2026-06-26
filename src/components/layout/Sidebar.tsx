"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  LineChart,
  Wrench,
  ArrowUpCircle,
  Zap,
  BookOpen,
  Users,
  HelpCircle,
  Shield,
  BookMarked,
  TrendingUp,
  X,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/academy", label: "Chart Academy", icon: BookOpen },
  { href: "/dashboard/trade-together", label: "Trade Together", icon: Users },
  { href: "/dashboard/bot", label: "Trading", icon: LineChart },
  { href: "/dashboard/live-growth", label: "Live Growth", icon: TrendingUp },
  { href: "/dashboard/prop-command", label: "Prop OS", icon: Shield },
  { href: "/dashboard/journal", label: "Journal", icon: BookMarked },
  { href: "/dashboard/tools", label: "Trading Tools", icon: Wrench },
  { href: "/dashboard/support", label: "Support", icon: HelpCircle },
  { href: "/dashboard/upgrade", label: "Upgrade Tier", icon: ArrowUpCircle },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ mobileOpen = false, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex h-screen w-64 max-w-[min(16rem,85vw)] flex-col border-r border-slate-600/20 bg-obsidian-950/65 shadow-[4px_0_48px_rgba(0,0,0,0.45),4px_0_40px_rgba(0,229,255,0.06)] backdrop-blur-2xl transition-transform duration-300 ease-in-out lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="relative flex h-16 items-center justify-between border-b border-cyan-500/10 bg-gradient-to-r from-cyan-500/[0.06] to-transparent px-4 sm:px-6">
        <div className="absolute inset-x-0 bottom-0 h-px bg-qs-header-line opacity-60" />
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/30 bg-gradient-to-br from-cyan-500/15 to-slate-900/50 shadow-[0_0_20px_rgba(0,229,255,0.15)]">
            <Zap className="h-4 w-4 text-cyan-300" />
          </div>
          <div>
            <span className="block font-mono text-xs font-bold tracking-wider text-slate-200">
              QS<span className="text-cyan-400">.ALGO</span>
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-600">
              Terminal OS
            </span>
          </div>
        </div>
        <button
          type="button"
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 lg:hidden"
          aria-label="Close menu"
          onClick={onNavigate}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-wider transition-all",
                isActive
                  ? "border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.08)]"
                  : "border border-transparent text-slate-500 hover:border-slate-700/50 hover:bg-slate-800/40 hover:text-slate-300"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-cyan-500/10 p-4">
        <div className="qs-glass-panel rounded-lg p-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600">
            System Status
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="font-mono text-xs text-emerald-400">Operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}