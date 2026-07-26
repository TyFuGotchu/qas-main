"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  Copy,
  Gift,
  Loader2,
  Share2,
  Wallet,
  CreditCard,
} from "lucide-react";

interface ReferralPayload {
  code: string;
  shareUrl: string;
  creditCents: number;
  creditFormatted: string;
  pendingCents: number;
  pendingFormatted: string;
  paypalEmail: string | null;
  stats: { invites: number; paidReferrals: number };
  config: {
    rewardFormatted: string;
    holdDays: number;
    paypalMinCents: number;
    paypalMinFormatted: string;
  };
  rewards: {
    id: string;
    amountCents: number;
    status: string;
    availableAt: string;
    referredEmail: string;
  }[];
  payouts: {
    id: string;
    amountCents: number;
    status: string;
    paypalEmail: string;
    createdAt: string;
  }[];
}

export function InviteEarnPanel() {
  const [data, setData] = useState<ReferralPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/referrals");
      if (res.ok) {
        const json = (await res.json()) as ReferralPayload;
        setData(json);
        if (json.paypalEmail) setPaypalEmail(json.paypalEmail);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function copyLink() {
    if (!data?.shareUrl) return;
    try {
      await navigator.clipboard.writeText(data.shareUrl);
      setMessage("Invite link copied");
    } catch {
      setMessage("Copy failed — select the link manually");
    }
  }

  async function applyCredit() {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/referrals/apply-credit", { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        setMessage(json.message ?? "Credit applied");
        await load();
      } else {
        setMessage(json.error ?? "Could not apply credit");
      }
    } finally {
      setBusy(false);
    }
  }

  async function requestPaypal() {
    if (
      !window.confirm(
        "Request a manual PayPal cash-out of your promotional credit? Premium credit (Stripe invoice credit) is safer and preferred. Continue only if you have at least the minimum balance."
      )
    ) {
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/referrals/request-paypal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paypalEmail }),
      });
      const json = await res.json();
      if (res.ok) {
        setMessage(json.message ?? "Request submitted");
        await load();
      } else {
        setMessage(json.error ?? "Request failed");
      }
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-12 font-mono text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading invite program…
      </div>
    );
  }

  if (!data) {
    return (
      <p className="font-mono text-sm text-slate-500">
        Could not load referral program.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="success" className="mb-2">
          Invite &amp; earn
        </Badge>
        <h2 className="flex items-center gap-2 font-mono text-2xl font-bold text-slate-200">
          <Gift className="h-7 w-7 text-emerald-400" />
          Share Quicksilver
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Earn{" "}
          <strong className="text-emerald-400">
            {data.config.rewardFormatted}
          </strong>{" "}
          in <strong className="text-slate-300">promotional Premium credit</strong>{" "}
          when someone you invite becomes a paid Premium member. Credits prefer
          Stripe invoice balance (not cash wages). Optional PayPal cash-out only
          after {data.config.paypalMinFormatted} credit — manual review, no
          contractor relationship.
        </p>
      </div>

      {message && (
        <p className="rounded border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 font-mono text-xs text-cyan-300">
          {message}
        </p>
      )}

      <Card className="border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 to-slate-950">
        <CardContent className="space-y-4 py-6">
          <div className="flex flex-wrap gap-3">
            <Badge variant="success">{data.stats.invites} invites</Badge>
            <Badge variant="warning">
              {data.stats.paidReferrals} paid rewards
            </Badge>
            <Badge>
              Available {data.creditFormatted}
            </Badge>
            {data.pendingCents > 0 && (
              <Badge variant="default">
                Pending {data.pendingFormatted} ({data.config.holdDays}d hold)
              </Badge>
            )}
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              Your invite link
            </p>
            <p className="mt-1 break-all font-mono text-sm text-cyan-300">
              {data.shareUrl}
            </p>
            <p className="mt-1 font-mono text-xs text-slate-600">
              Code: {data.code}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm" onClick={() => void copyLink()}>
              <Copy className="h-3.5 w-3.5" />
              Copy link
            </Button>
            <a
              href={`mailto:?subject=${encodeURIComponent("Join Quicksilver Algo")}&body=${encodeURIComponent(`I'm using Quicksilver for prop / live trading tools. Sign up with my link:\n\n${data.shareUrl}`)}`}
            >
              <Button variant="secondary" size="sm">
                <Share2 className="h-3.5 w-3.5" />
                Email invite
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
              <CreditCard className="h-4 w-4 text-cyan-400" />
              Apply to Premium (recommended)
            </h3>
            <p className="text-xs text-slate-500">
              Moves promotional credit to your Stripe customer balance for future
              Premium invoices. No cash, no PayPal, simplest path.
            </p>
          </CardHeader>
          <CardContent>
            <Button
              variant="primary"
              size="sm"
              disabled={busy || data.creditCents <= 0}
              onClick={() => void applyCredit()}
            >
              {busy ? "Working…" : `Apply ${data.creditFormatted} to Premium`}
            </Button>
            {data.creditCents <= 0 && (
              <p className="mt-2 font-mono text-[10px] text-slate-600">
                No available credit yet. Rewards unlock {data.config.holdDays}{" "}
                days after a referred friend pays for Premium.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
              <Wallet className="h-4 w-4 text-amber-400" />
              PayPal cash-out (optional)
            </h3>
            <p className="text-xs text-slate-500">
              Only when credit reaches {data.config.paypalMinFormatted}. Manual
              admin PayPal — promotional goodwill, not employment. Prefer Premium
              credit when possible.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              label="PayPal email"
              type="email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              placeholder="you@paypal.com"
            />
            <Button
              variant="secondary"
              size="sm"
              disabled={
                busy ||
                !paypalEmail.trim() ||
                data.creditCents < data.config.paypalMinCents
              }
              onClick={() => void requestPaypal()}
            >
              Request PayPal payout
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-mono text-sm font-semibold text-slate-200">
            Reward history
          </h3>
        </CardHeader>
        <CardContent>
          {data.rewards.length === 0 ? (
            <p className="font-mono text-xs text-slate-600">
              No rewards yet. Share your link — you earn when they pay for
              Premium.
            </p>
          ) : (
            <ul className="space-y-2">
              {data.rewards.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-800/60 px-3 py-2 font-mono text-xs"
                >
                  <span className="text-slate-400">{r.referredEmail}</span>
                  <span className="text-emerald-400">
                    ${(r.amountCents / 100).toFixed(2)}
                  </span>
                  <Badge
                    variant={
                      r.status === "available" || r.status === "applied_to_premium"
                        ? "success"
                        : r.status === "pending"
                          ? "warning"
                          : "default"
                    }
                  >
                    {r.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <p className="font-mono text-[10px] leading-relaxed text-slate-600">
        Program terms: Rewards are promotional account credits for paid Premium
        referrals only (not free signups). A {data.config.holdDays}-day hold
        applies. Self-referrals and abuse may be voided. Premium credit via
        Stripe is the default. PayPal cash-outs are optional, manual, and may be
        declined. Not a job, partnership, or contractor engagement. Tax treatment
        of any cash you request is your responsibility if required in your
        jurisdiction.
      </p>
    </div>
  );
}
