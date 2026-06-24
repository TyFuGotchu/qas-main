import { cn } from "@/lib/utils";
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, children, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-mono uppercase tracking-wider text-slate-400"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full rounded border border-slate-700 bg-obsidian-800 px-3 py-2 font-mono text-sm text-slate-200",
            "focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30",
            "transition-colors duration-200",
            error &&
              "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30",
            className
          )}
          {...props}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          {children}
        </select>
        {error && (
          <span className="text-xs font-mono text-red-400">{error}</span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;