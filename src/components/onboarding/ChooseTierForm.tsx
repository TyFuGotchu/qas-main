"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { AccountTier } from "@/types";
import {
  PREMIUM_PROMO_FIRST_MONTH,
  PREMIUM_PROMO_NOTE,
  PRICING_TIERS,
  getPremiumCheckoutUrl,
} from "@/lib/pricing-tiers";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useSession } from "@/providers/SessionProvider";
import { Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackBeginCheckout } from "@/lib/analytics/ga-events";

const PREMIUM_CHECKOUT = getPremiumCheckoutUrl(true);

export function ChooseTierForm() {
  const router = useRouter();
  const { setUser } = useSession();
  const [selectedTier, setSelectedTier] = useState<AccountTier | null>(null);
  const [loading, setLoading] = useState(false);
  const [waitingForPayment, setWaitingForPayment] = useState(false);
  const [error, setError] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setWaitingForPayment(false);
  }, []);

  useEffect(() => () => stopPolling(), [stopPolling]);

  async function refreshSessionFromDatabase(): Promise<boolean> {
    try {
      const res = await fetch("/api/auth/refresh-session", { method: "POST" });
      if (!res.ok) return false;

      const data = await res.json();
      setUser(data.user);

      const isPremium =
        data.user?.subscriptionTier === "TIER_2" ||
        data.user?.subscriptionTier === "TIER_1" ||
        data.user?.subscriptionTier === "LIFETIME";

      if (isPremium && data.user?.onboardingComplete) {
        stopPolling();
        router.refresh();
        router.push(
          data.user?.profileComplete ? "/dashboard" : "/onboarding/profile"
        );
        return true;
      }
    } catch {
      // ignore polling errors
    }
    return false;
  }

  function startPaymentPolling() {
    stopPolling();
    setWaitingForPayment(true);
    setError("");

    void refreshSessionFromDatabase();

    pollRef.current = setInterval(() => {
      void refreshSessionFromDatabase();
    }, 3000);

    setTimeout(() => stopPolling(), 120_000);
  }

  function handlePremiumCheckout() {
    setSelectedTier("Premium Quant");
    trackBeginCheckout("onboarding_pricing");
    window.open(PREMIUM_CHECKOUT, "_blank", "noopener,noreferrer");
    startPaymentPolling();
  }

  async function handleFreeContinue() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountTier: "Free" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to complete onboarding");
        return;
      }

      setUser(data.user);
      router.refresh();
      router.push("/onboarding/profile");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    if (!selectedTier) {
      setError("Select a plan to continue");
      return;
    }

    if (selectedTier === "Premium Quant") {
      handlePremiumCheckout();
      return;
    }

    await handleFreeContinue();
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-mono text-3xl font-bold text-slate-100">
          Select Your <span className="text-cyan-terminal">Access Tier</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl font-mono text-sm text-slate-500">
          Premium unlocks instantly after Stripe checkout — {PREMIUM_PROMO_NOTE.toLowerCase()}.
          Or start free and upgrade anytime.
        </p>
      </div>

      <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
        {PRICING_TIERS.map((tier) => (
          <button
            key={tier.id}
            type="button"
            onClick={() => setSelectedTier(tier.tier)}
            className="text-left"
          >
            <Card
              glow={selectedTier === tier.tier}
              className={cn(
                "h-full cursor-pointer transition-all hover:border-cyan-500/40",
                selectedTier === tier.tier && "border-cyan-500/50 ring-1 ring-cyan-500/30",
                tier.recommended && "relative"
              )}
            >
              {tier.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="success">Highly Recommended</Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <h3 className="font-mono text-lg font-bold text-slate-200">
                  {tier.name}
                </h3>
                <div className="mt-3">
                  <span className="font-mono text-3xl font-bold text-cyan-terminal">
                    {tier.price}
                  </span>
                  <span className="ml-1 font-mono text-sm text-slate-500">
                    {tier.period}
                  </span>
                </div>
                {tier.tier === "Premium Quant" && (
                  <p className="mt-2 font-mono text-xs text-emerald-terminal">
                    {PREMIUM_PROMO_FIRST_MONTH} first month with FIRST100
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <ul className="mb-4 space-y-2">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-slate-400"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-terminal" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {tier.ctaLink ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePremiumCheckout();
                    }}
                  >
                    Pay {PREMIUM_PROMO_FIRST_MONTH} via Stripe
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <p className="text-center font-mono text-[10px] uppercase tracking-widest text-slate-600">
                    No payment required
                  </p>
                )}
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {waitingForPayment && (
        <p className="rounded border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-center font-mono text-sm text-cyan-terminal">
          Waiting for Stripe checkout… Complete payment in the other tab. We&apos;ll
          detect it automatically.
        </p>
      )}

      {error && (
        <p className="rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-center font-mono text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button
          variant="primary"
          size="lg"
          disabled={!selectedTier || loading || waitingForPayment}
          onClick={handleConfirm}
        >
          {loading
            ? "Activating..."
            : selectedTier === "Premium Quant"
              ? `Subscribe — ${PREMIUM_PROMO_FIRST_MONTH} First Month`
              : selectedTier === "Free"
                ? "Continue with Free Access"
                : "Select a Plan"}
        </Button>
        {selectedTier !== "Free" && (
          <Button
            variant="ghost"
            size="lg"
            disabled={loading}
            onClick={() => {
              setSelectedTier("Free");
              void handleFreeContinue();
            }}
          >
            Start Free Preview Instead
          </Button>
        )}
      </div>
    </div>
  );
}