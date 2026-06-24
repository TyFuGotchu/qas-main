"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { useSession } from "@/providers/SessionProvider";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/solutions", label: "Tools" },
  { href: "/offers", label: "Offers" },
  { href: "/lessons", label: "Lessons" },
  { href: "/guides", label: "Guides" },
];

export function PublicNav() {
  const pathname = usePathname();
  const { user } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-slate-800/60 bg-obsidian-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 min-h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
          <Link href="/" className="group flex min-w-0 shrink items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-cyan-500/40 bg-cyan-500/10 transition-colors group-hover:border-cyan-400">
              <Zap className="h-4 w-4 text-cyan-400" />
            </div>
            <span className="truncate font-mono text-xs font-bold tracking-wider text-slate-200 sm:text-sm">
              QUICKSILVER<span className="text-cyan-400">.ALGO</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-mono text-xs uppercase tracking-widest transition-colors",
                  pathname === link.href
                    ? "text-cyan-400"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <Link href="/dashboard/academy" className="hidden sm:block">
                  <Button variant="ghost" size="sm">
                    Chart Academy
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="primary" size="sm">
                    <span className="sm:hidden">Dashboard</span>
                    <span className="hidden sm:inline">My Dashboard</span>
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    <span className="sm:hidden">Join</span>
                    <span className="hidden sm:inline">Get Access</span>
                  </Button>
                </Link>
              </>
            )}
            <button
              type="button"
              className="rounded-lg border border-slate-700/50 p-2 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="absolute right-0 top-14 flex w-full max-w-xs flex-col gap-1 border-b border-l border-slate-800/60 bg-obsidian-950 p-4 shadow-xl sm:top-16">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-3 font-mono text-sm uppercase tracking-widest transition-colors",
                  pathname === link.href
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                )}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/dashboard/academy"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 font-mono text-sm uppercase tracking-widest text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                >
                  Chart Academy
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 font-mono text-sm uppercase tracking-widest text-cyan-400 hover:bg-slate-800/50"
                >
                  My Dashboard
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 font-mono text-sm uppercase tracking-widest text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
}