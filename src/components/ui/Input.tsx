import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-mono uppercase tracking-wider text-slate-400"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded border border-slate-700 bg-obsidian-800 px-3 py-2 font-mono text-sm text-slate-200 placeholder:text-slate-600",
            "focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30",
            "transition-colors duration-200",
            error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs font-mono text-red-400">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;