import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  const variants = {
    default: "bg-slate-800 text-slate-300 border-slate-600",
    success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    warning: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    danger: "bg-red-500/20 text-red-400 border-red-500/40",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 text-xs font-mono uppercase tracking-wider",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}