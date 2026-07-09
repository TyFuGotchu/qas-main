import Link from "next/link";
import { Sparkles } from "lucide-react";
import {
  PREMIUM_INCLUDES_ANCHOR,
  PREMIUM_INCLUDE_STRIP_ITEMS,
} from "@/lib/premium-includes";

export function PremiumIncludesStrip() {
  const href = `/#${PREMIUM_INCLUDES_ANCHOR}`;

  return (
    <div className="border-b border-cyan-500/15 bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-2 scrollbar-none sm:px-6 lg:px-8">
        <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-cyan-accent">
          <Sparkles className="h-3 w-3" />
          Premium includes
        </span>
        <div className="flex min-w-0 items-center gap-2">
          {PREMIUM_INCLUDE_STRIP_ITEMS.map((item) => (
            <Link
              key={item}
              href={href}
              className="shrink-0 rounded-full border border-slate-700/50 bg-slate-900/60 px-2.5 py-0.5 font-mono text-[10px] text-slate-400 transition-colors hover:border-cyan-accent/30 hover:text-cyan-accent"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}