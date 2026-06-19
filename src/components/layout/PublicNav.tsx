"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Zap } from "lucide-react";

const navLinks = [{ href: "/", label: "Home" }];

export function PublicNav() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-800/60 bg-obsidian-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded border border-cyan-500/40 bg-cyan-500/10 group-hover:border-cyan-400 transition-colors">
            <Zap className="h-4 w-4 text-cyan-400" />
          </div>
          <span className="font-mono text-sm font-bold tracking-wider text-slate-200">
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

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">
              Get Access
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}