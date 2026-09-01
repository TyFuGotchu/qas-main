"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  LineChart,
  Wrench,
  Zap,
  BookOpen,
  Users,
  Target,
  Bot,
  Building2,
  ChevronDown,
  X,
} from "lucide-react";
import { TRADING_BOTS_NAV } from "@/lib/trading-bots";
import { E8_CENTER_TABS, E8_DASHBOARD_PATH } from "@/lib/e8-partner";
import { E8PromoSidebarCard } from "@/components/e8/E8PromoBanners";

interface NavChild {
  href: string;
  label: string;
  tab?: string;
}

interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  featured?: boolean;
  children?: NavChild[];
}

const navItems: NavItem[] = [
  { id: "dashboard", href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    id: "e8",
    href: E8_DASHBOARD_PATH,
    label: "E8 Execution Center",
    icon: Building2,
    badge: "Exclusive",
    featured: true,
    children: E8_CENTER_TABS.map((tab) => ({
      href: `${E8_DASHBOARD_PATH}?tab=${tab.id}`,
      label: tab.label,
      tab: tab.id,
    })),
  },
  { id: "playbook", href: "/dashboard/playbook", label: "7-Day Playbook", icon: Target },
  { id: "academy", href: "/dashboard/academy", label: "Chart Academy", icon: BookOpen },
  { id: "together", href: "/dashboard/trade-together", label: "Trade Together", icon: Users },
  {
    id: "bots",
    href: TRADING_BOTS_NAV.hub,
    label: "Trading Bots",
    icon: Bot,
    children: [
      { href: TRADING_BOTS_NAV.hub, label: "Bots Overview" },
      { href: TRADING_BOTS_NAV.quantProtocol, label: "Quant Protocol" },
    ],
  },
  {
    id: "live",
    href: "/dashboard/bot",
    label: "Live Trading",
    icon: LineChart,
    children: [
      { href: "/dashboard/bot", label: "TradeLocker Terminal" },
      { href: "/dashboard/live-growth", label: "Live Growth" },
      { href: "/dashboard/prop-command", label: "Prop OS" },
      { href: "/dashboard/journal", label: "Journal" },
    ],
  },
  {
    id: "tools",
    href: "/dashboard/tools",
    label: "Tools & Account",
    icon: Wrench,
    children: [
      { href: "/dashboard/tools", label: "Trading Tools" },
      { href: "/dashboard/support", label: "Support" },
      { href: "/dashboard/upgrade", label: "Upgrade Tier" },
    ],
  },
];

function pathActive(pathname: string, href: string): boolean {
  const clean = href.split("?")[0];
  if (clean === "/dashboard") return pathname === "/dashboard";
  return pathname === clean || pathname.startsWith(`${clean}/`);
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const e8Tab = searchParams.get("tab") ?? "overview";

  const [open, setOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setOpen((prev) => {
      const next = { ...prev };
      for (const item of navItems) {
        if (!item.children) continue;
        const childActive = item.children.some((child) => {
          if (item.id === "e8") {
            return pathname.startsWith(E8_DASHBOARD_PATH);
          }
          return pathActive(pathname, child.href);
        });
        if (childActive || (item.id === "e8" && pathname.startsWith(E8_DASHBOARD_PATH))) {
          next[item.id] = true;
        }
      }
      return next;
    });
  }, [pathname]);

  const expanded = useMemo(() => {
    const map: Record<string, boolean> = { ...open };
    if (pathname.startsWith(E8_DASHBOARD_PATH)) map.e8 = true;
    return map;
  }, [open, pathname]);

  function isChildActive(item: NavItem, child: NavChild): boolean {
    if (item.id === "e8") {
      return pathname.startsWith(E8_DASHBOARD_PATH) && e8Tab === (child.tab ?? "overview");
    }
    if (item.id === "bots" && child.href === TRADING_BOTS_NAV.hub) {
      return pathname === TRADING_BOTS_NAV.hub;
    }
    if (item.id === "live" && child.href === "/dashboard/bot") {
      return pathname === "/dashboard/bot";
    }
    if (item.id === "tools" && child.href === "/dashboard/tools") {
      return pathname === "/dashboard/tools" || pathname.startsWith("/dashboard/tools/");
    }
    return pathActive(pathname, child.href);
  }

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto p-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const parentActive =
          item.id === "e8"
            ? pathname.startsWith(E8_DASHBOARD_PATH)
            : item.children
              ? item.children.some((c) => isChildActive(item, c))
              : pathActive(pathname, item.href);
        const isOpen = Boolean(item.children && expanded[item.id]);

        return (
          <div key={item.id}>
            <div className="flex items-center gap-0.5">
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex min-w-0 flex-1 items-center gap-3 rounded-[6px] border-l-2 px-3 py-2 text-[13px] tracking-tight transition-colors",
                  parentActive && item.featured
                    ? "e8-nav-item border-l-[#7DFFC4] bg-[#1a0f27] text-[#F5F3FA]"
                    : parentActive
                      ? "border-l-[#7FE7DC] bg-white/[0.04] text-[#F3F5F7]"
                      : item.featured
                        ? "e8-nav-item border-l-[#1a0f27] text-[#C9C2D6] hover:bg-[#1a0f27]/80 hover:text-[#F5F3FA]"
                        : "border-l-transparent text-[#9AA3B2] hover:bg-white/[0.03] hover:text-[#F3F5F7]"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className="rounded-full border border-[#7DFFC4]/40 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-[#7DFFC4]">
                    {item.badge}
                  </span>
                )}
              </Link>
              {item.children && (
                <button
                  type="button"
                  aria-label={isOpen ? `Collapse ${item.label}` : `Expand ${item.label}`}
                  onClick={() =>
                    setOpen((prev) => ({ ...prev, [item.id]: !expanded[item.id] }))
                  }
                  className="rounded-[4px] p-1.5 text-[#9AA3B2] hover:bg-white/[0.04] hover:text-[#F3F5F7]"
                >
                  <ChevronDown
                    className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")}
                  />
                </button>
              )}
            </div>
            {item.children && isOpen && (
              <div className="mb-2 ml-4 mt-1 space-y-0.5 border-l border-white/[0.08] pl-2">
                {item.children.map((child) => {
                  const childActive = isChildActive(item, child);
                  return (
                    <Link
                      key={child.href + child.label}
                      href={child.href}
                      onClick={onNavigate}
                      className={cn(
                        "block rounded-[4px] px-2 py-1.5 text-[12px] tracking-tight transition-colors",
                        childActive
                          ? item.featured
                            ? "e8-nav-child is-active"
                            : "bg-white/[0.05] text-[#F3F5F7]"
                          : item.featured
                            ? "e8-nav-child text-[#C9C2D6] hover:text-[#F5F3FA]"
                            : "text-[#9AA3B2] hover:text-[#F3F5F7]"
                      )}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

interface SidebarProps {
  mobileOpen?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ mobileOpen = false, onNavigate }: SidebarProps) {
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

      <Suspense
        fallback={<div className="flex-1 p-4 font-mono text-xs text-slate-600">Loading…</div>}
      >
        <SidebarNav onNavigate={onNavigate} />
      </Suspense>

      <div className="space-y-3 border-t border-white/[0.08] p-4">
        <E8PromoSidebarCard />
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
