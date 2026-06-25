import { getSessionLabel } from "@/lib/journal/trading-session";
import { cn } from "@/lib/utils";

const SESSION_STYLES: Record<string, string> = {
  asia: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  london: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  "london-ny": "border-violet-500/30 bg-violet-500/10 text-violet-300",
  ny: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  "off-hours": "border-slate-600/40 bg-slate-800/40 text-slate-400",
};

interface SessionBadgeProps {
  sessionId: string;
  className?: string;
}

export function SessionBadge({ sessionId, className }: SessionBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        SESSION_STYLES[sessionId] ?? SESSION_STYLES["off-hours"],
        className
      )}
    >
      {getSessionLabel(sessionId)}
    </span>
  );
}