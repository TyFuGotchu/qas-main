import Link from "next/link";
import { Zap } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-obsidian-950">
      <header className="border-b border-slate-800/60 bg-obsidian-950/90 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-cyan-500/40 bg-cyan-500/10">
              <Zap className="h-4 w-4 text-cyan-400" />
            </div>
            <span className="font-mono text-sm font-bold tracking-wider text-slate-200">
              QS<span className="text-cyan-400">.ADMIN</span>
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="font-mono text-xs uppercase tracking-widest text-slate-500 hover:text-cyan-400"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}