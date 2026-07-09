import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  GUARANTEE_HEADLINE,
  GUARANTEE_PATH,
  GUARANTEE_SHORT,
  GUARANTEE_TAGLINE,
} from "@/lib/money-back-guarantee";

interface MoneyBackGuaranteeProps {
  variant?: "strip" | "badge" | "panel" | "inline";
  className?: string;
  showLink?: boolean;
}

export function MoneyBackGuarantee({
  variant = "panel",
  className,
  showLink = true,
}: MoneyBackGuaranteeProps) {
  if (variant === "strip") {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-2.5 text-center",
          className
        )}
      >
        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-terminal" />
        <p className="font-mono text-xs text-emerald-200/90">
          <strong>{GUARANTEE_HEADLINE}</strong>
          {" — "}
          {GUARANTEE_TAGLINE}
          {showLink && (
            <>
              {" "}
              <Link href={GUARANTEE_PATH} className="text-cyan-accent hover:underline">
                Details →
              </Link>
            </>
          )}
        </p>
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-emerald-terminal",
          className
        )}
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        {GUARANTEE_HEADLINE}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <p className={cn("font-mono text-xs text-slate-500", className)}>
        <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-emerald-terminal" />
        {GUARANTEE_SHORT}
        {showLink && (
          <>
            {" "}
            <Link href={GUARANTEE_PATH} className="text-cyan-accent hover:underline">
              Read guarantee →
            </Link>
          </>
        )}
      </p>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/5 to-slate-950/80 p-5 sm:p-6",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10">
          <ShieldCheck className="h-6 w-6 text-emerald-terminal" />
        </div>
        <div>
          <h3 className="font-mono text-sm font-bold text-emerald-terminal sm:text-base">
            {GUARANTEE_HEADLINE}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {GUARANTEE_TAGLINE} Complete all 7 playbook days in your dashboard.
            Not satisfied? Full refund of your first month.
          </p>
          {showLink && (
            <Link
              href={GUARANTEE_PATH}
              className="mt-3 inline-block font-mono text-xs text-cyan-accent hover:underline"
            >
              Full guarantee terms →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}