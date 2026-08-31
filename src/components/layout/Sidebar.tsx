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
  Target,
  Bot,
  Cpu,
  Building2,
  X,
} from "lucide-react";
import { TRADING_BOTS_NAV } from "@/lib/trading-bots";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  featured?: boolean;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      {
        href: "/dashboard/e8",
        label: "E8 Execution Center",
        icon: Building2,
        badge: "Exclusive",
        featured: true,
      },
      { href: "/dashboard/playbook", label: "7-Day Playbook", icon: Target },
      { href: "/dashboard/academy", label: "Chart Academy", icon: BookOpen },
      { href: "/dashboard/trade-together", label: "Trade Together", icon: Users },
    ],
  },
  {
    title: "Trading Bots",
    items: [
      { href: TRADING_BOTS_NAV.hub, label: "Bots Overview", icon: Bot },
      {
        href: TRADING_BOTS_NAV.quantProtocol,
        label: "Quant Protocol",
        icon: Cpu,
      },
    ],
  },
  {
    title: "Live Trading",
    items: [
      { href: "/dashboard/bot", label: "TradeLocker Terminal", icon: LineChart },
      { href: "/dashboard/live-growth", label: "Live Growth", icon: TrendingUp },
      { href: "/dashboard/prop-command", label: "Prop OS", icon: Shield },
      { href: "/dashboard/journal", label: "Journal", icon: BookMarked },
    ],
  },
  {
    title: "Tools & Account",
    items: [
      { href: "/dashboard/tools", label: "Trading Tools", icon: Wrench },
      { href: "/dashboard/support", label: "Support", icon: HelpCircle },
      { href: "/dashboard/upgrade", label: "Upgrade Tier", icon: ArrowUpCircle },
    ],
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ mobileOpen = false, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex h-screen w-64 max-w-[min(16rem,85vw)] flex-col border-r border-white/[0.08] bg-[#07080C] transition-transform duration-300 ease-in-out lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="relative flex h-16 items-center justify-between border-b border-white/[0.08] px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-white/[0.08] bg-[#141A24]">
            <Zap className="h-4 w-4 text-[#7FE7DC]" />
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

      <nav className="flex-1 space-y-5 overflow-y-auto p-4">
        {navSections.map((section, sectionIndex) => (
          <div key={section.title ?? `section-${sectionIndex}`}>
            {section.title && (
              <p className="mb-2 px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-[6px] border-l-2 px-3 py-2 text-[13px] tracking-tight transition-colors",
                      active
                        ? "border-l-[#7FE7DC] bg-white/[0.04] text-[#F3F5F7]"
                        : item.featured
                          ? "border-l-[#B7B0D4]/50 text-[#B7B0D4] hover:bg-white/[0.03] hover:text-[#F3F5F7]"
                          : "border-l-transparent text-[#9AA3B2] hover:bg-white/[0.03] hover:text-[#F3F5F7]"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-[4px] border border-[#B7B0D4]/30 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-[#B7B0D4]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/[0.08] p-4">
        <div className="rounded-[6px] border border-white/[0.08] bg-[#141A24] p-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-600">
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
