"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { saveLegalAcceptance } from "@/lib/legal-acceptance";
import { ShieldAlert } from "lucide-react";

const LEGAL_CLAUSES = [
  {
    title: "Software Provider, Not a Financial Advisor",
    body: "Quicksilver Algo Systems provides charting, analytics, and automated trade execution software. We are not a registered broker-dealer, investment advisor, or financial planner.",
  },
  {
    title: "High-Risk Investment Warning",
    body: "Trading foreign exchange, indices, and cryptocurrencies on margin carries a high level of risk and may not be suitable for all investors. You could lose some or all of your initial investment.",
  },
  {
    title: "Execution and API Liability",
    body: "By connecting your broker account (e.g., HeroFX) via the TradeLocker API, you acknowledge that Quicksilver Algo Systems is strictly a software conduit. We hold no liability for API outages, latency, execution delays, broker-side rejections, or financial losses resulting from the use of our automated algorithms.",
  },
  {
    title: "User Control & Responsibility",
    body: "You retain full control over your account and are solely responsible for setting your own risk parameters, monitoring your live positions, and managing your funds directly with your broker.",
  },
] as const;

const SCROLL_THRESHOLD_PX = 12;

interface LegalDisclaimerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccepted: () => void;
}

export function LegalDisclaimerModal({
  open,
  onOpenChange,
  onAccepted,
}: LegalDisclaimerModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const evaluateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const atBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight <= SCROLL_THRESHOLD_PX;
    const noOverflow = el.scrollHeight <= el.clientHeight + SCROLL_THRESHOLD_PX;

    setHasScrolledToBottom(atBottom || noOverflow);
  }, []);

  useEffect(() => {
    if (!open) {
      setHasScrolledToBottom(false);
      return;
    }

    const frame = requestAnimationFrame(evaluateScroll);
    return () => cancelAnimationFrame(frame);
  }, [open, evaluateScroll]);

  function handleAccept() {
    if (!hasScrolledToBottom) return;
    saveLegalAcceptance();
    onOpenChange(false);
    onAccepted();
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="max-h-[90vh] max-w-2xl overflow-hidden"
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10">
              <ShieldAlert className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <AlertDialogTitle>Risk Disclosure &amp; Liability Agreement</AlertDialogTitle>
              <AlertDialogDescription className="mt-1 text-left">
                Required before connecting any TradeLocker broker account.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div
          ref={scrollRef}
          onScroll={evaluateScroll}
          className="max-h-[min(22rem,50vh)] space-y-4 overflow-y-auto rounded-lg border border-slate-800/80 bg-obsidian-900/60 p-4 pr-3"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            Quicksilver Algo Systems — Legal Notice
          </p>

          <ol className="space-y-4">
            {LEGAL_CLAUSES.map((clause, index) => (
              <li key={clause.title} className="space-y-1.5">
                <p className="font-mono text-sm font-semibold text-slate-200">
                  {index + 1}. {clause.title}
                </p>
                <p className="text-sm leading-relaxed text-slate-400">
                  {clause.body}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {!hasScrolledToBottom && (
          <p className="text-center font-mono text-[10px] uppercase tracking-widest text-amber-400/80">
            Scroll to the bottom to enable agreement
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={!hasScrolledToBottom}
            onClick={(e) => {
              e.preventDefault();
              handleAccept();
            }}
          >
            I Understand and Agree
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}