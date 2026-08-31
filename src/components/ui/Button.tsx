import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary:
        "bg-[#7FE7DC]/10 text-[#7FE7DC] border border-white/[0.08] hover:border-[#7FE7DC]/40 hover:bg-[#7FE7DC]/15",
      gold:
        "bg-[#141A24] text-[#F3F5F7] border border-white/[0.12] hover:border-[#7FE7DC]/40 hover:text-[#7FE7DC]",
      secondary:
        "bg-transparent text-[#F3F5F7] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.03]",
      ghost:
        "bg-transparent text-[#9AA3B2] border border-transparent hover:text-[#7FE7DC] hover:bg-white/[0.03]",
      danger:
        "bg-transparent text-red-400 border border-red-500/30 hover:bg-red-500/10",
    };

    const sizes = {
      sm: "h-9 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-11 px-5 text-sm",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-[6px] font-medium tracking-tight transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
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