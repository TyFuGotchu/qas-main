"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function AccordionItem({
  id,
  title,
  subtitle,
  badge,
  defaultOpen = false,
  children,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-700/50 bg-slate-950/60">
      <button
        type="button"
        id={`accordion-${id}`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-900/80"
      >
        <div className="min-w-0 flex-1">
          <p className="font-mono text-sm font-semibold text-slate-200">{title}</p>
          {subtitle && (
            <p className="mt-0.5 truncate font-mono text-[10px] text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
        {badge && (
          <span className="shrink-0 rounded border border-cyan-accent/30 bg-cyan-accent/10 px-2 py-0.5 font-mono text-[10px] text-cyan-accent">
            {badge}
          </span>
        )}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-slate-500 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && <div className="border-t border-slate-700/40 px-4 py-4">{children}</div>}
    </div>
  );
}