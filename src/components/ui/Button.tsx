import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary:
        "relative overflow-hidden bg-gradient-to-br from-cyan-500/15 via-cyan-500/8 to-slate-900/40 text-cyan-300 border border-cyan-400/40 hover:border-cyan-300/70 hover:text-cyan-200 shadow-[0_0_20px_rgba(0,229,255,0.12),inset_0_1px_0_rgba(232,244,252,0.08)] hover:shadow-[0_0_32px_rgba(0,229,255,0.22),inset_0_1px_0_rgba(232,244,252,0.12)]",
      secondary:
        "bg-gradient-to-br from-emerald-500/12 to-slate-900/30 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400/60 hover:text-emerald-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
      ghost:
        "bg-transparent text-slate-400 border border-transparent hover:text-cyan-300 hover:bg-slate-800/40 hover:border-slate-700/50",
      danger:
        "bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-mono font-medium tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;