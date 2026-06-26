import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function Card({ className, glow, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "qs-panel-shine rounded-xl border border-slate-600/20 bg-qs-panel shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-shadow duration-300",
        "hover:shadow-[0_12px_40px_rgba(0,0,0,0.45),0_0_48px_rgba(0,229,255,0.06)]",
        glow &&
          "border-cyan-500/30 shadow-[0_0_60px_rgba(0,229,255,0.18),0_8px_32px_rgba(0,0,0,0.4)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border-b border-slate-700/40 bg-gradient-to-r from-cyan-500/[0.03] via-transparent to-transparent px-6 py-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
}