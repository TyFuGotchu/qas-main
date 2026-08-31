import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  const variants = {
    default: "border-white/[0.08] bg-transparent text-[#9AA3B2]",
    success: "border-[#7FE7DC]/25 bg-transparent text-[#7FE7DC]",
    warning: "border-[#B7B0D4]/30 bg-transparent text-[#B7B0D4]",
    danger: "border-red-500/30 bg-transparent text-red-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[4px] border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}