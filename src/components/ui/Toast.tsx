"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

type ToastVariant = "success" | "error";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (input: {
    title: string;
    description?: string;
    variant?: ToastVariant;
  }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (input: {
      title: string;
      description?: string;
      variant?: ToastVariant;
    }) => {
      const id = crypto.randomUUID();
      const item: ToastItem = {
        id,
        title: input.title,
        description: input.description,
        variant: input.variant ?? "success",
      };
      setItems((prev) => [...prev, item]);
      window.setTimeout(() => dismiss(id), 5000);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2"
      >
        {items.map((item) => {
          const Icon = item.variant === "success" ? CheckCircle2 : AlertCircle;
          return (
            <div
              key={item.id}
              className={cn(
                "pointer-events-auto rounded-lg border px-4 py-3 shadow-xl backdrop-blur-md",
                item.variant === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-red-500/30 bg-red-500/10"
              )}
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    item.variant === "success"
                      ? "text-emerald-400"
                      : "text-red-400"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-sm font-semibold text-slate-100">
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="mt-1 font-mono text-xs text-slate-400">
                      {item.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(item.id)}
                  className="text-slate-500 hover:text-slate-300"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}