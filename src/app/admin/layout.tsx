import Link from "next/link";
import { InstitutionalBackdrop } from "@/components/layout/InstitutionalBackdrop";
import { Zap } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="qs-environment relative min-h-screen">
      <InstitutionalBackdrop variant="dashboard" />
      <header className="qs-nav-glass relative z-[1] px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-cyan-500/40 bg-cyan-500/10">
              <Zap className="h-4 w-4 text-cyan-400" />
            </div>
            <span className="font-mono text-sm font-bold tracking-wider text-slate-200">
              QS<span className="text-cyan-400">.ADMIN</span>
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/admin/sprint"
              className="font-mono text-xs uppercase tracking-widest text-slate-500 hover:text-cyan-400"
            >
              Sprint
            </Link>
            <Link
              href="/admin/social-kit"
              className="font-mono text-xs uppercase tracking-widest text-slate-500 hover:text-cyan-400"
            >
              Social kit
            </Link>
            <Link
              href="/admin/dashboard"
              className="font-mono text-xs uppercase tracking-widest text-slate-500 hover:text-cyan-400"
            >
              Admin
            </Link>
            <Link
              href="/dashboard"
              className="font-mono text-xs uppercase tracking-widest text-slate-500 hover:text-cyan-400"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>
      <main className="relative z-[1] mx-auto max-w-7xl overflow-x-hidden p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
}