import { cn } from "@/lib/utils";

interface TerminalPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  status?: "online" | "warning" | "offline";
}

export function TerminalPanel({
  title,
  children,
  className,
  status = "online",
}: TerminalPanelProps) {
  const statusColors = {
    online: "bg-emerald-400",
    warning: "bg-amber-400",
    offline: "bg-red-400",
  };

  return (
    <div
      className={cn(
        "qs-panel-shine overflow-hidden rounded-lg border border-cyan-500/10 bg-obsidian-950/90 font-mono text-sm shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md",
        className
      )}
    >
      <div className="flex items-center gap-3 border-b border-cyan-500/10 bg-gradient-to-r from-cyan-500/[0.06] via-obsidian-900 to-transparent px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <span className="flex-1 text-center text-xs uppercase tracking-widest text-slate-500">
          {title}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", statusColors[status])} />
          {status}
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}