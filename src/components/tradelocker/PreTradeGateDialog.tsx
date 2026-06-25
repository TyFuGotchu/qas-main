"use client";

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
import { Badge } from "@/components/ui/Badge";
import type { PreTradeGateResult } from "@/lib/pre-trade-gate";
import { riskStatusLabel } from "@/lib/tradelocker/account-tools";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreTradeGateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gate: PreTradeGateResult | null;
  side: "buy" | "sell";
  symbol: string;
  qty: number;
  onConfirm: () => void;
}

export function PreTradeGateDialog({
  open,
  onOpenChange,
  gate,
  side,
  symbol,
  qty,
  onConfirm,
}: PreTradeGateDialogProps) {
  if (!gate) return null;

  const blocked = gate.violations.some((v) => v.severity === "block");
  const canProceed = gate.requiresAcknowledgment && !blocked;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10">
              <ShieldAlert className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <AlertDialogTitle>Pre-Trade Risk Gate</AlertDialogTitle>
              <AlertDialogDescription className="mt-1 text-left">
                {side.toUpperCase()} {qty} lots · {symbol}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase text-slate-500">
              Risk Guard
            </span>
            <Badge variant={gate.riskGuard.status === "safe" ? "success" : "warning"}>
              {riskStatusLabel(gate.riskGuard.status)}
            </Badge>
          </div>

          <ul className="space-y-2">
            {gate.violations.map((v) => (
              <li
                key={v.code}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm",
                  v.severity === "block"
                    ? "border-red-500/30 bg-red-500/10 text-red-300"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-200"
                )}
              >
                {v.message}
              </li>
            ))}
            {gate.violations.length === 0 && (
              <li className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-300">
                All profile checks passed.
              </li>
            )}
          </ul>

          <p className="font-mono text-xs text-slate-500">{gate.summary}</p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {blocked ? (
            <AlertDialogAction disabled>Blocked</AlertDialogAction>
          ) : canProceed ? (
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onConfirm();
              }}
            >
              Acknowledge & Place Order
            </AlertDialogAction>
          ) : (
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onConfirm();
              }}
            >
              Place Order
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}