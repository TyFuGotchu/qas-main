"use client";

import { useEffect } from "react";
import { useSession } from "@/providers/SessionProvider";
import { getTierBadgeColor } from "@/lib/tiers";
import { cn } from "@/lib/utils";
import { LogOut, User, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

export function Header() {
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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800/60 bg-obsidian-950/90 px-6 backdrop-blur-md">
      <div>
        <h1 className="font-mono text-sm font-semibold text-slate-200">
          Quicksilver Algo System
        </h1>
        <p className="font-mono text-[10px] uppercase tracking-widest text-slate-600">
          Institutional Terminal v2.4
        </p>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-obsidian-800">
                <User className="h-4 w-4 text-slate-400" />
              </div>
              <div className="text-right">
                <p className="font-mono text-xs text-slate-300">
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