"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail, Send, Inbox, History, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface EmailStatus {
  configured: boolean;
  webhookSecretConfigured: boolean;
  from: string;
  supportFrom: string;
  supportInbox: string;
  webhookUrl: string;
  unreadCount: number;
  totalInbound: number;
}

interface Campaign {
  id: string;
  subject: string;
  audience: string;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  status: string;
  createdAt: string;
  completedAt: string | null;
}

interface InboundEmail {
  id: string;
  fromAddress: string;
  toAddresses: unknown;
  subject: string;
  textBody: string | null;
  htmlBody: string | null;
  receivedAt: string;
  read: boolean;
  repliedAt: string | null;
}

const audienceOptions = [
  { value: "all", label: "All registered users" },
  { value: "premium", label: "Premium only (TIER_1 / TIER_2 / Lifetime)" },
  { value: "free", label: "Free tier only" },
  { value: "onboarded", label: "Onboarding complete" },
  { value: "custom", label: "Custom email list" },
];

export function AdminEmailCenter() {
  const [status, setStatus] = useState<EmailStatus | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [inbox, setInbox] = useState<InboundEmail[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [form, setForm] = useState({
    subject: "",
    body: "",
    audience: "all",
    customEmails: "",
  });

  const selected = inbox.find((e) => e.id === selectedId) ?? null;

  const loadAll = useCallback(async () => {
    const [statusRes, campaignsRes, inboxRes] = await Promise.all([
      fetch("/api/admin/email/status"),
      fetch("/api/admin/email/bulk"),
      fetch("/api/admin/email/inbox"),
    ]);
    if (statusRes.ok) setStatus(await statusRes.json());
    if (campaignsRes.ok) {
      const data = await campaignsRes.json();
      setCampaigns(data.campaigns ?? []);
    }
    if (inboxRes.ok) {
      const data = await inboxRes.json();
      setInbox(data.emails ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  async function previewAudience() {
    setMessage("");
    const res = await fetch("/api/admin/email/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: form.subject || "preview",
        body: form.body || "preview",
        audience: form.audience,
        customEmails: form.customEmails,
        previewOnly: true,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setPreviewCount(data.recipientCount);
      setMessage(
        `Preview: ${data.recipientCount} recipient(s)${
          data.sample?.length
            ? ` — e.g. ${data.sample.slice(0, 3).join(", ")}`
            : ""
        }`
      );
    } else {
      setMessage(data.error ?? "Preview failed");
    }
  }

  async function sendBulk(e: React.FormEvent) {
    e.preventDefault();
    if (
      !window.confirm(
        `Send this email to the selected audience${
          previewCount != null ? ` (${previewCount} recipients)` : ""
        }?`
      )
    ) {
      return;
    }
    setSending(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/email/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: form.subject,
          body: form.body,
          audience: form.audience,
          customEmails: form.customEmails,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(
          `Campaign complete — sent ${data.sentCount}/${data.recipientCount} (failed ${data.failedCount})`
        );
        setForm((f) => ({ ...f, subject: "", body: "" }));
        setPreviewCount(null);
        void loadAll();
      } else {
        setMessage(data.error ?? "Send failed");
      }
    } finally {
      setSending(false);
    }
  }

  async function openEmail(id: string) {
    setSelectedId(id);
    setReplyBody("");
    await fetch(`/api/admin/email/inbox/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    void loadAll();
  }

  async function sendReply() {
    if (!selected || !replyBody.trim()) return;
    setSending(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/email/inbox/${selected.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: replyBody }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Reply sent to ${selected.fromAddress}`);
        setReplyBody("");
        void loadAll();
      } else {
        setMessage(data.error ?? "Reply failed");
      }
    } finally {
      setSending(false);
    }
  }

  async function archiveSelected() {
    if (!selected) return;
    await fetch(`/api/admin/email/inbox/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: true }),
    });
    setSelectedId(null);
    void loadAll();
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="flex items-center gap-2 font-mono text-lg font-bold text-slate-200">
          <Mail className="h-5 w-5 text-cyan-400" />
          Email Center
        </h3>
        <p className="mt-1 font-mono text-xs text-slate-500">
          Bulk broadcasts to users + support inbox for{" "}
          <span className="text-cyan-400">
            {status?.supportInbox ?? "supportteam@quicksilveralgo.com"}
          </span>
        </p>
      </div>

      {message && (
        <p className="rounded border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 font-mono text-xs text-cyan-300">
          {message}
        </p>
      )}

      {status && (
        <div className="grid gap-3 font-mono text-xs text-slate-400 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-3">
            <p className="text-slate-600">Resend API</p>
            <p className={status.configured ? "text-emerald-400" : "text-rose-400"}>
              {status.configured ? "Connected" : "Not configured"}
            </p>
          </div>
          <div className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-3">
            <p className="text-slate-600">Broadcast from</p>
            <p className="truncate text-slate-300">{status.from}</p>
          </div>
          <div className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-3">
            <p className="text-slate-600">Support from</p>
            <p className="truncate text-slate-300">{status.supportFrom}</p>
          </div>
          <div className="rounded-lg border border-slate-800/60 bg-slate-950/40 p-3">
            <p className="text-slate-600">Unread inbox</p>
            <p className="text-amber-400">{unreadCount}</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <h4 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
              <Send className="h-4 w-4 text-cyan-400" />
              Mass / bulk email
            </h4>
          </CardHeader>
          <CardContent>
            <form onSubmit={sendBulk} className="space-y-3">
              <Select
                label="Audience"
                options={audienceOptions}
                value={form.audience}
                onChange={(e) => {
                  setForm({ ...form, audience: e.target.value });
                  setPreviewCount(null);
                }}
              />
              {form.audience === "custom" && (
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-slate-400">
                    Emails (one per line or comma-separated)
                  </label>
                  <textarea
                    value={form.customEmails}
                    onChange={(e) =>
                      setForm({ ...form, customEmails: e.target.value })
                    }
                    rows={4}
                    className="w-full rounded border border-slate-700 bg-obsidian-800 px-3 py-2 font-mono text-sm text-slate-200 focus:border-cyan-500/50 focus:outline-none"
                    placeholder="user1@email.com&#10;user2@email.com"
                  />
                </div>
              )}
              <Input
                label="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-slate-400">
                  Message body
                </label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  required
                  rows={8}
                  className="w-full rounded border border-slate-700 bg-obsidian-800 px-3 py-2 font-mono text-sm text-slate-200 focus:border-cyan-500/50 focus:outline-none"
                  placeholder="Write your broadcast in plain text. Line breaks are preserved."
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => void previewAudience()}
                >
                  Preview audience count
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={sending}>
                  {sending ? "Sending…" : "Send bulk email"}
                </Button>
              </div>
              <p className="font-mono text-[10px] text-slate-600">
                Max 500 recipients per campaign. Rate-limited to stay under Resend limits.
              </p>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h4 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
              <Inbox className="h-4 w-4 text-amber-400" />
              Support inbox
              {unreadCount > 0 && (
                <Badge variant="warning">{unreadCount} unread</Badge>
              )}
            </h4>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="max-h-48 space-y-1 overflow-y-auto">
              {inbox.length === 0 ? (
                <p className="font-mono text-xs text-slate-600">
                  No inbound mail yet. Configure Resend receiving + webhook (see setup
                  below).
                </p>
              ) : (
                inbox.map((email) => (
                  <button
                    key={email.id}
                    type="button"
                    onClick={() => void openEmail(email.id)}
                    className={`w-full rounded border px-3 py-2 text-left transition-colors ${
                      selectedId === email.id
                        ? "border-cyan-500/40 bg-cyan-500/10"
                        : "border-slate-800/50 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`truncate font-mono text-xs ${
                          email.read ? "text-slate-400" : "font-semibold text-slate-200"
                        }`}
                      >
                        {email.fromAddress}
                      </p>
                      {!email.read && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                      )}
                    </div>
                    <p className="truncate font-mono text-[11px] text-slate-500">
                      {email.subject}
                    </p>
                  </button>
                ))
              )}
            </div>

            {selected && (
              <div className="space-y-3 rounded-lg border border-slate-800/60 bg-slate-950/50 p-3">
                <div>
                  <p className="font-mono text-xs text-slate-300">{selected.subject}</p>
                  <p className="mt-1 font-mono text-[10px] text-slate-600">
                    From {selected.fromAddress} ·{" "}
                    {new Date(selected.receivedAt).toLocaleString()}
                    {selected.repliedAt && (
                      <span className="ml-2 text-emerald-500">
                        · Replied {new Date(selected.repliedAt).toLocaleString()}
                      </span>
                    )}
                  </p>
                </div>
                <div className="max-h-40 overflow-y-auto rounded border border-slate-800/40 bg-obsidian-950 p-3 text-xs leading-relaxed text-slate-400">
                  {selected.textBody ||
                    (selected.htmlBody
                      ? selected.htmlBody.replace(/<[^>]+>/g, " ").slice(0, 2000)
                      : "(No body retrieved — open in Resend dashboard)")}
                </div>
                <textarea
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  rows={4}
                  placeholder="Type a reply from support team…"
                  className="w-full rounded border border-slate-700 bg-obsidian-800 px-3 py-2 font-mono text-sm text-slate-200 focus:border-cyan-500/50 focus:outline-none"
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => void sendReply()}
                    disabled={sending || !replyBody.trim()}
                  >
                    Send reply
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => void archiveSelected()}>
                    Archive
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h4 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
            <History className="h-4 w-4 text-slate-400" />
            Recent bulk campaigns
          </h4>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <p className="font-mono text-xs text-slate-600">No campaigns yet</p>
          ) : (
            <div className="max-h-56 space-y-2 overflow-y-auto">
              {campaigns.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-800/50 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate font-mono text-xs text-slate-300">{c.subject}</p>
                    <p className="font-mono text-[10px] text-slate-600">
                      {c.audience} · {c.sentCount}/{c.recipientCount} sent ·{" "}
                      {new Date(c.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      c.status === "completed"
                        ? "success"
                        : c.status === "failed"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {c.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-800/60">
        <CardHeader>
          <h4 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Inbound setup (supportteam@)
          </h4>
        </CardHeader>
        <CardContent className="space-y-2 font-mono text-xs leading-relaxed text-slate-500">
          <p>
            1. In Resend → Domains → enable <strong className="text-slate-300">Receiving</strong>{" "}
            for quicksilveralgo.com (add the MX record Resend shows — if you already use Google/Microsoft
            mail on the root domain, use a subdomain like{" "}
            <code className="text-cyan-400">mail.quicksilveralgo.com</code> or forward
            supportteam@ → Resend).
          </p>
          <p>
            2. Resend → Webhooks → Add webhook → event{" "}
            <code className="text-cyan-400">email.received</code>
          </p>
          <p>
            3. Endpoint URL:{" "}
            <code className="break-all text-cyan-400">
              {status?.webhookUrl ?? "https://quicksilveralgo.com/api/webhooks/resend"}
            </code>
          </p>
          <p>
            4. Copy the webhook signing secret into Railway as{" "}
            <code className="text-cyan-400">RESEND_WEBHOOK_SECRET</code>
          </p>
          <p>
            5. Optional:{" "}
            <code className="text-cyan-400">
              RESEND_SUPPORT_FROM=Quicksilver Support &lt;supportteam@quicksilveralgo.com&gt;
            </code>
          </p>
          <p className="text-slate-600">
            Webhook secret configured:{" "}
            {status?.webhookSecretConfigured ? (
              <span className="text-emerald-400">yes</span>
            ) : (
              <span className="text-amber-400">no — set RESEND_WEBHOOK_SECRET</span>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
