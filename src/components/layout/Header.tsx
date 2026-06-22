"use client";

import { useEffect } from "react";
import { useSession } from "@/providers/SessionProvider";
import { getTierBadgeColor } from "@/lib/tiers";
import { cn } from "@/lib/utils";
import { LogOut, User, Shield, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

interface HeaderProps {
  onMenuToggle?: () => void;
  menuOpen?: boolean;
}

export function Header({ onMenuToggle, menuOpen = false }: HeaderProps) {
  const { user, setUser, refreshSession } = useSession();
  const router = useRouter();

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 min-h-14 items-center justify-between gap-3 border-b border-slate-800/60 bg-obsidian-950/90 px-4 backdrop-blur-md sm:h-16 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          className="shrink-0 rounded-lg border border-slate-700/50 p-2 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={onMenuToggle}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="min-w-0">
          <h1 className="truncate font-mono text-xs font-semibold text-slate-200 sm:text-sm">
            Quicksilver Algo System
          </h1>
          <p className="hidden font-mono text-[10px] uppercase tracking-widest text-slate-600 sm:block">
            Institutional Terminal v2.4
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {user && (
          <>
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-obsidian-800">
                <User className="h-4 w-4 text-slate-400" />
              </div>
              <div className="max-w-[10rem] text-right lg:max-w-none">
                <p className="truncate font-mono text-xs text-slate-300">
                  {user.name ?? user.email}
                </p>
                <span
                  className={cn(
                    "inline-block rounded border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider",
                    getTierBadgeColor(user.accountTier)
                  )}
                >
                  {user.accountTier}
                </span>
              </div>
            </div>
            {user.isAdmin && (
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <Shield className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}