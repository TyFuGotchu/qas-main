"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Gift, Loader2 } from "lucide-react";

interface PayoutRow {
  id: string;
  amountFormatted: string;
  paypalEmail: string;
  status: string;
  userEmail: string;
  userName: string | null;
  createdAt: string;
  adminNote: string | null;
}

interface RewardRow {
  id: string;
  amountCents: number;
  status: string;
  referrerEmail: string;
  referredEmail: string;
  createdAt: string;
}

export function AdminReferralsPanel() {
  const [payouts, setPayouts] = useState<PayoutRow[]>([]);
  const [rewards, setRewards] = useState<RewardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/referrals");
      if (res.ok) {
        const data = await res.json();
        setPayouts(data.payouts ?? []);
        setRewards(data.rewards ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function processPayout(id: string, action: "paid" | "rejected") {
    const note =
      action === "paid"
        ? window.prompt("Optional note (e.g. PayPal transaction id):") ?? ""
        : window.prompt("Reason for rejection (credit returned to user):") ??
          "Rejected";

    if (action === "rejected" && note === null) return;

    setBusyId(id);
    setMessage("");
    try {
      const res = await fetch("/api/admin/referrals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, adminNote: note }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(
          action === "paid"
            ? "Marked paid — send PayPal offline if not already sent"
            : "Rejected — credit returned to user"
        );
        await load();
      } else {
        setMessage(data.error ?? "Update failed");
      }
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <p className="flex items-center gap-2 font-mono text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading referrals…
      </p>
    );
  }

  const pending = payouts.filter((p) => p.status === "pending");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="flex items-center gap-2 font-mono text-lg font-bold text-slate-200">
          <Gift className="h-5 w-5 text-emerald-400" />
          Referrals
        </h3>
        <p className="mt-1 font-mono text-xs text-slate-500">
          $5 promotional Premium credit per paid invite. PayPal requests only
          above $25 — pay offline, then mark paid. Prefer users applying credit
          to Stripe (no tax ops).
        </p>
      </div>

      {message && (
        <p className="rounded border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 font-mono text-xs text-cyan-300">
          {message}
        </p>
      )}

      <Card>
        <CardHeader>
          <h4 className="font-mono text-sm font-semibold text-slate-200">
            PayPal requests ({pending.length} pending)
          </h4>
        </CardHeader>
        <CardContent className="space-y-3">
          {payouts.length === 0 ? (
            <p className="font-mono text-xs text-slate-600">No payout requests yet.</p>
          ) : (
            payouts.map((p) => (
              <div
                key={p.id}
                className="flex flex-col gap-2 rounded border border-slate-800/60 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="font-mono text-xs">
                  <p className="text-slate-200">
                    {p.userName ?? "—"} · {p.userEmail}
                  </p>
                  <p className="text-emerald-400">{p.amountFormatted}</p>
                  <p className="text-slate-500">PayPal: {p.paypalEmail}</p>
                  <Badge
                    variant={
                      p.status === "pending"
                        ? "warning"
                        : p.status === "paid"
                          ? "success"
                          : "default"
                    }
                  >
                    {p.status}
                  </Badge>
                </div>
                {p.status === "pending" && (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={busyId === p.id}
                      onClick={() => void processPayout(p.id, "paid")}
                    >
                      Mark paid
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={busyId === p.id}
                      onClick={() => void processPayout(p.id, "rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h4 className="font-mono text-sm font-semibold text-slate-200">
            Recent rewards
          </h4>
        </CardHeader>
        <CardContent>
          {rewards.length === 0 ? (
            <p className="font-mono text-xs text-slate-600">No rewards yet.</p>
          ) : (
            <ul className="max-h-80 space-y-2 overflow-y-auto">
              {rewards.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-wrap gap-2 border-b border-slate-800/40 py-2 font-mono text-[11px] text-slate-400"
                >
                  <span className="text-slate-300">{r.referrerEmail}</span>
                  <span>→</span>
                  <span>{r.referredEmail}</span>
                  <span className="text-emerald-400">
                    ${(r.amountCents / 100).toFixed(2)}
                  </span>
                  <Badge variant="default">{r.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
