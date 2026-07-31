"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bot, Copy, Loader2, Upload, Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Select from "@/components/ui/Select";

interface BotRequest {
  id: string;
  email: string;
  name: string | null;
  status: string;
  source: string;
  notes: string | null;
  createdAt: string;
  emailedAt: string | null;
}

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "emailed", label: "Emailed" },
  { value: "converted", label: "Converted" },
  { value: "dismissed", label: "Dismissed" },
];

export function AdminBotRequestsPanel() {
  const [requests, setRequests] = useState<BotRequest[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState("pending");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [importText, setImportText] = useState("");
  const [importing, setImporting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = filter ? `?status=${encodeURIComponent(filter)}` : "";
      const res = await fetch(`/api/admin/bot-requests${q}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests ?? []);
        setCounts(data.counts ?? {});
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(
          data.error ??
            "Failed to load bot requests (DB table may need deploy / prisma db push)"
        );
      }
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return requests;
    return requests.filter((r) => r.email.toLowerCase().includes(q));
  }, [requests, query]);

  const pendingEmails = useMemo(
    () =>
      filtered
        .filter((r) => r.status === "pending" || !filter)
        .map((r) => r.email),
    [filtered, filter]
  );

  async function runImport() {
    if (!importText.trim()) return;
    setImporting(true);
    setMessage("");
    try {
      const looksLikeCsv =
        importText.includes("email") || importText.split("\n")[0]?.includes(",");
      const res = await fetch("/api/admin/bot-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          looksLikeCsv
            ? {
                csv: importText,
                source: "tradelocker_marketplace",
                status: "pending",
                notes: "Imported from TradeLocker bot request export",
              }
            : {
                emails: importText,
                source: "tradelocker_marketplace",
                status: "pending",
                notes: "Imported from TradeLocker bot request export",
              }
        ),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(
          `Import done: ${data.created} new pending, ${data.skipped} already existed (${data.total} unique in paste).`
        );
        setImportText("");
        await load();
      } else {
        setMessage(data.error ?? "Import failed");
      }
    } finally {
      setImporting(false);
    }
  }

  async function setStatus(status: string, ids?: string[]) {
    const list = ids ?? Array.from(selected);
    if (list.length === 0) {
      setMessage("Select at least one request");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/bot-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: list, status }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Updated ${data.updated} → ${status}`);
        setSelected(new Set());
        await load();
      } else {
        setMessage(data.error ?? "Update failed");
      }
    } finally {
      setBusy(false);
    }
  }

  async function copyEmailsForBulk() {
    const emails =
      selected.size > 0
        ? filtered.filter((r) => selected.has(r.id)).map((r) => r.email)
        : filter === "pending"
          ? filtered.map((r) => r.email)
          : pendingEmails;

    // Cap 90 for daily send limit
    const batch = emails.slice(0, 90);
    if (batch.length === 0) {
      setMessage("No emails to copy");
      return;
    }
    try {
      await navigator.clipboard.writeText(batch.join("\n"));
      setMessage(
        `Copied ${batch.length} emails to clipboard. Go to Email tab → Custom list → paste. (Capped at 90 for your daily limit.)`
      );
    } catch {
      setMessage("Clipboard failed — select emails manually");
    }
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((r) => r.id)));
    }
  }

  const pendingCount = counts.pending ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="flex items-center gap-2 font-mono text-lg font-bold text-slate-200">
          <Bot className="h-5 w-5 text-cyan-400" />
          TradeLocker bot requests
        </h3>
        <p className="mt-1 font-mono text-xs text-slate-500">
          People who requested Quant Protocol on TradeLocker. Track pending
          leads, mark emailed/converted, copy 90/day for bulk email.
        </p>
        <div className="mt-2 flex flex-wrap gap-2 font-mono text-xs">
          <Badge variant="warning">pending {counts.pending ?? 0}</Badge>
          <Badge variant="default">emailed {counts.emailed ?? 0}</Badge>
          <Badge variant="success">converted {counts.converted ?? 0}</Badge>
          <Badge variant="default">dismissed {counts.dismissed ?? 0}</Badge>
        </div>
      </div>

      {message && (
        <p className="rounded border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 font-mono text-xs text-cyan-300">
          {message}
        </p>
      )}

      <Card className="border-cyan-500/20">
        <CardHeader>
          <h4 className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-200">
            <Upload className="h-4 w-4 text-cyan-400" />
            Import from TradeLocker / CSV export
          </h4>
          <p className="font-mono text-[10px] text-slate-600">
            Paste full CSV (with email column) or one email per line. Duplicates
            are skipped. Status = pending.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={6}
            placeholder="Paste contacts CSV or emails here…"
            className="w-full rounded border border-slate-700 bg-obsidian-800 px-3 py-2 font-mono text-xs text-slate-200 focus:border-cyan-500/50 focus:outline-none"
          />
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={importing || !importText.trim()}
            onClick={() => void runImport()}
          >
            {importing ? "Importing…" : "Import as pending bot requests"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Select
              options={statusOptions}
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setSelected(new Set());
              }}
              className="min-w-[140px]"
            />
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search email…"
                className="rounded border border-slate-700 bg-obsidian-800 py-2 pl-8 pr-3 font-mono text-xs text-slate-200"
              />
            </div>
            <span className="font-mono text-xs text-slate-500">
              showing {filtered.length}
              {pendingCount ? ` · ${pendingCount} pending total` : ""}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => void copyEmailsForBulk()}
            >
              <Copy className="h-3.5 w-3.5" />
              Copy ≤90 for bulk email
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busy || selected.size === 0}
              onClick={() => void setStatus("emailed")}
            >
              Mark emailed
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busy || selected.size === 0}
              onClick={() => void setStatus("converted")}
            >
              Mark converted
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busy || selected.size === 0}
              onClick={() => void setStatus("dismissed")}
            >
              Dismiss
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busy || selected.size === 0}
              onClick={() => void setStatus("pending")}
            >
              Back to pending
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="flex items-center gap-2 font-mono text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </p>
          ) : filtered.length === 0 ? (
            <p className="font-mono text-sm text-slate-500">
              No bot requests yet. Import your TradeLocker CSV above.
            </p>
          ) : (
            <div className="max-h-[28rem] overflow-auto">
              <table className="w-full font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-500">
                    <th className="py-2 text-left">
                      <input
                        type="checkbox"
                        checked={
                          filtered.length > 0 &&
                          selected.size === filtered.length
                        }
                        onChange={toggleAll}
                      />
                    </th>
                    <th className="py-2 text-left">Email</th>
                    <th className="py-2 text-left">Status</th>
                    <th className="py-2 text-left">Source</th>
                    <th className="py-2 text-left">Added</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-slate-800/50 text-slate-300"
                    >
                      <td className="py-2">
                        <input
                          type="checkbox"
                          checked={selected.has(r.id)}
                          onChange={() => toggle(r.id)}
                        />
                      </td>
                      <td className="py-2 text-slate-200">{r.email}</td>
                      <td className="py-2">
                        <Badge
                          variant={
                            r.status === "pending"
                              ? "warning"
                              : r.status === "converted"
                                ? "success"
                                : "default"
                          }
                        >
                          {r.status}
                        </Badge>
                      </td>
                      <td className="py-2 text-slate-500">{r.source}</td>
                      <td className="py-2 text-slate-500">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
