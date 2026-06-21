import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function GlassPanel({ children, className, glow }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/5 bg-slate-950/80 backdrop-blur-xl",
        "shadow-[inset_0_1px_0_0_rgba(0,229,255,0.08)]",
        glow && "border-glow-cyan animate-pulse-glow",
        className
      )}
    >
      {children}
    </div>
  );
}