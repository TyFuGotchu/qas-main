"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AccountTier } from "@/types";
import { PREMIUM_PROMO_NOTE, PRICING_TIERS } from "@/lib/pricing-tiers";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useSession } from "@/providers/SessionProvider";
import { Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChooseTierForm() {
  const router = useRouter();
  const { setUser } = useSession();
  const [selectedTier, setSelectedTier] = useState<AccountTier | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function refreshSessionFromDatabase() {
    try {
      const res = await fetch("/api/auth/refresh-session", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.user?.onboardingComplete) {
          router.push("/dashboard");
        }
      }
    } catch {
      // ignore polling errors
    }
  }

  async function handleConfirm() {
    if (!selectedTier) {
      setError("Select a plan to continue");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountTier: selectedTier }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to complete onboarding");
        return;
      }

      setUser(data.user);
      router.refresh();
      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-mono text-3xl font-bold text-slate-100">
          Select Your <span className="text-cyan-terminal">Access Tier</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl font-mono text-sm text-slate-500">
          Choose Free to preview, or Premium for full access. Subscribe via
          Stripe — {PREMIUM_PROMO_NOTE.toLowerCase()}.
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
              <a
                href={tier.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  setTimeout(() => refreshSessionFromDatabase(), 5000);
                }}
                className="block"
              >
                <Button variant="ghost" size="sm" className="w-full">
                  Pay via Stripe
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
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

      {error && (
        <p className="rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-center font-mono text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex justify-center">
        <Button
          variant="primary"
          size="lg"
          disabled={!selectedTier || loading}
          onClick={handleConfirm}
        >
          {loading
            ? "Activating..."
            : selectedTier === "Free"
              ? "Continue with Free Access"
              : "Confirm Plan & Enter Dashboard"}
        </Button>
      </div>
    </div>
  );
}