"use client";

import { useEffect, useMemo, useState } from "react";
import { ACCOUNT_TIERS, type AccountTier } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { AdminEmailCenter } from "@/components/admin/AdminEmailCenter";
import { AdminReferralsPanel } from "@/components/admin/AdminReferralsPanel";
import {
  Users,
  Megaphone,
  Shield,
  Mail,
  Search,
  Crown,
  KeyRound,
  CheckCircle2,
  Gift,
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  accountTier: string;
  isAdmin: boolean;
  onboardingComplete: boolean;
  createdAt: string;
}

interface AdminAnnouncement {
  id: string;
  title: string;
  content: string;
  active: boolean;
  createdAt: string;
}

type AdminTab = "users" | "email" | "announcements" | "referrals";

function isPremium(tier: string) {
  return tier === ACCOUNT_TIERS.PREMIUM_QUANT;
}

export function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>("users");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"ok" | "err">("ok");

  function flash(text: string, tone: "ok" | "err" = "ok") {
    setMessage(text);
    setMessageTone(tone);
  }

  async function loadData() {
    setLoading(true);
    try {
      const [usersRes, announcementsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/announcements"),
      ]);

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users);
      }

      if (announcementsRes.ok) {
        const data = await announcementsRes.json();
        setAnnouncements(data.announcements);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        (u.name ?? "").toLowerCase().includes(q)
    );
  }, [users, query]);

  const freeCount = users.filter((u) => !isPremium(u.accountTier)).length;
  const premiumCount = users.filter((u) => isPremium(u.accountTier)).length;

  async function patchUser(
    userId: string,
    body: Record<string, unknown>
  ): Promise<{
    ok: boolean;
    data: {
      user?: AdminUser;
      premiumGranted?: boolean;
      accessEmail?: {
        attempted: boolean;
        ok: boolean;
        error?: string;
        skipped?: boolean;
      };
      error?: string;
    };
  }> {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
  }

  /** One-click: Premium + onboarding complete + confirmation email */
  async function grantPremium(user: AdminUser, forceResend = false) {
    const alreadyPremium = isPremium(user.accountTier);
    const label = alreadyPremium
      ? `Resend Premium confirmation email to ${user.email}?`
      : `Grant Premium to ${user.email}?\n\nThey will get full access and a confirmation email.`;

    if (!window.confirm(label)) return;

    setBusyUserId(user.id);
    try {
      const { ok, data } = await patchUser(user.id, {
        accountTier: ACCOUNT_TIERS.PREMIUM_QUANT,
        onboardingComplete: true,
        sendAccessEmail: true,
      });

      if (!ok) {
        flash(data.error ?? "Grant failed", "err");
        return;
      }

      const email = data.accessEmail;
      if (email?.attempted && email.ok) {
        flash(
          alreadyPremium || forceResend
            ? `Confirmation email resent to ${user.email}`
            : `Premium granted — confirmation sent to ${user.email}`
        );
      } else if (email?.attempted && !email.ok) {
        flash(
          `Premium ${alreadyPremium ? "unchanged" : "granted"} but email failed: ${email.error ?? "unknown"}. Check Resend / API key.`,
          "err"
        );
      } else {
        flash(
          alreadyPremium
            ? `Already Premium — no email sent`
            : `Premium granted for ${user.email}`
        );
      }
      await loadData();
    } finally {
      setBusyUserId(null);
    }
  }

  async function setToFree(user: AdminUser) {
    if (
      !window.confirm(
        `Remove Premium for ${user.email}? They lose bot, playbook, and tools access.`
      )
    ) {
      return;
    }
    setBusyUserId(user.id);
    try {
      const { ok, data } = await patchUser(user.id, {
        accountTier: ACCOUNT_TIERS.FREE,
        sendAccessEmail: false,
      });
      if (ok) {
        flash(`Moved ${user.email} to Free`);
        await loadData();
      } else {
        flash(data.error ?? "Update failed", "err");
      }
    } finally {
      setBusyUserId(null);
    }
  }

  async function updateUserTier(userId: string, accountTier: AccountTier) {
    setBusyUserId(userId);
    try {
      const { ok, data } = await patchUser(userId, {
        accountTier,
        // Only auto-email when selecting Premium Quant
        sendAccessEmail: isPremium(accountTier) ? true : false,
      });
      if (ok) {
        if (data.accessEmail?.attempted) {
          flash(
            data.accessEmail.ok
              ? `Tier → ${accountTier}; confirmation emailed`
              : `Tier → ${accountTier}; email failed: ${data.accessEmail.error ?? "unknown"}`,
            data.accessEmail.ok ? "ok" : "err"
          );
        } else {
          flash(`Tier updated to ${accountTier}`);
        }
        await loadData();
      } else {
        flash(data.error ?? "Tier update failed", "err");
      }
    } finally {
      setBusyUserId(null);
    }
  }

  async function toggleAdmin(userId: string, isAdmin: boolean) {
    const { ok } = await patchUser(userId, { isAdmin });
    if (ok) {
      flash(isAdmin ? "Admin granted" : "Admin removed");
      loadData();
    }
  }

  async function resetUserPassword(userId: string, email: string) {
    const password = window.prompt(
      `New password for ${email}\n(min 10 chars, upper, lower, number)`
    );
    if (!password) return;

    const { ok, data } = await patchUser(userId, { password });
    if (ok) {
      flash(`Password reset for ${email}`);
    } else {
      flash(data.error ?? "Password reset failed", "err");
    }
  }

  async function markOnboardingComplete(userId: string, email: string) {
    const { ok } = await patchUser(userId, { onboardingComplete: true });
    if (ok) {
      flash(`Onboarding complete for ${email}`);
      loadData();
    }
  }

  function startEditAnnouncement(item: AdminAnnouncement) {
    setEditingId(item.id);
    setAnnouncementForm({ title: item.title, content: item.content });
    setMessage("");
  }

  function cancelEditAnnouncement() {
    setEditingId(null);
    setAnnouncementForm({ title: "", content: "" });
  }

  async function postAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    setPosting(true);
    setMessage("");

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/announcements/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(announcementForm),
        });
        if (res.ok) {
          setEditingId(null);
          setAnnouncementForm({ title: "", content: "" });
          flash("Announcement updated");
          loadData();
        } else {
          const data = await res.json().catch(() => ({}));
          flash(data.error ?? "Update failed", "err");
        }
      } else {
        const res = await fetch("/api/admin/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(announcementForm),
        });

        if (res.ok) {
          setAnnouncementForm({ title: "", content: "" });
          flash("Announcement posted");
          loadData();
        } else {
          const data = await res.json().catch(() => ({}));
          flash(data.error ?? "Publish failed", "err");
        }
      }
    } finally {
      setPosting(false);
    }
  }

  async function toggleAnnouncementActive(id: string, active: boolean) {
    const res = await fetch(`/api/admin/announcements/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    if (res.ok) {
      flash(active ? "Announcement activated" : "Announcement hidden");
      loadData();
    }
  }

  async function deleteAnnouncement(id: string, title: string) {
    if (
      !window.confirm(`Delete announcement “${title}”? This cannot be undone.`)
    ) {
      return;
    }
    const res = await fetch(`/api/admin/announcements/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      if (editingId === id) cancelEditAnnouncement();
      flash("Announcement deleted");
      loadData();
    } else {
      const data = await res.json().catch(() => ({}));
      flash(data.error ?? "Delete failed", "err");
    }
  }

  const tierOptions = Object.values(ACCOUNT_TIERS).map((tier) => ({
    value: tier,
    label: tier,
  }));

  const tabs: { id: AdminTab; label: string; icon: typeof Users }[] = [
    { id: "users", label: "Users", icon: Users },
    { id: "email", label: "Email", icon: Mail },
    { id: "referrals", label: "Referrals", icon: Gift },
    { id: "announcements", label: "Announcements", icon: Megaphone },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 font-mono text-2xl font-bold text-slate-200">
          <Shield className="h-6 w-6 text-cyan-400" />
          Admin
        </h2>
        <p className="mt-1 font-mono text-sm text-slate-500">
          Grant Premium → confirmation email goes out automatically. Search by
          email when someone pays.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 font-mono text-sm transition-colors ${
              tab === id
                ? "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/40"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
            {id === "users" && (
              <span className="text-xs text-slate-500">
                {users.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {message && (
        <p
          className={`rounded border px-4 py-2 font-mono text-sm ${
            messageTone === "ok"
              ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
              : "border-rose-500/30 bg-rose-500/10 text-rose-300"
          }`}
        >
          {message}
        </p>
      )}

      {tab === "users" && (
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-400" />
              <h3 className="font-mono text-sm font-semibold text-slate-200">
                Users
              </h3>
              <span className="font-mono text-xs text-slate-500">
                {premiumCount} Premium · {freeCount} Free
              </span>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                placeholder="Search email or name…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded border border-slate-700 bg-obsidian-800 py-2 pl-9 pr-3 font-mono text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="font-mono text-sm text-slate-500">Loading users…</p>
            ) : filteredUsers.length === 0 ? (
              <p className="font-mono text-sm text-slate-500">
                No users match “{query}”.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full font-mono text-xs">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-500">
                      <th className="py-2 text-left">User</th>
                      <th className="py-2 text-left">Access</th>
                      <th className="py-2 text-left">Joined</th>
                      <th className="py-2 text-left">Primary action</th>
                      <th className="py-2 text-left">More</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => {
                      const premium = isPremium(user.accountTier);
                      const busy = busyUserId === user.id;
                      return (
                        <tr
                          key={user.id}
                          className="border-b border-slate-800/50 align-top"
                        >
                          <td className="py-3 pr-3">
                            <p className="text-slate-200">
                              {user.name ?? "—"}
                            </p>
                            <p className="text-slate-400">{user.email}</p>
                            {!user.onboardingComplete && (
                              <Badge variant="warning" className="mt-1">
                                Stuck onboarding
                              </Badge>
                            )}
                            {user.isAdmin && (
                              <Badge variant="default" className="mt-1 ml-1">
                                Admin
                              </Badge>
                            )}
                          </td>
                          <td className="py-3 pr-3">
                            {premium ? (
                              <Badge variant="success">Premium</Badge>
                            ) : (
                              <Badge variant="default">
                                {user.accountTier}
                              </Badge>
                            )}
                          </td>
                          <td className="py-3 pr-3 text-slate-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 pr-3">
                            <div className="flex flex-wrap gap-1">
                              {!premium ? (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  disabled={busy}
                                  onClick={() => void grantPremium(user)}
                                >
                                  <Crown className="mr-1 h-3.5 w-3.5" />
                                  {busy ? "Working…" : "Grant Premium"}
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    disabled={busy}
                                    onClick={() => void grantPremium(user, true)}
                                  >
                                    <Mail className="mr-1 h-3.5 w-3.5" />
                                    {busy ? "Sending…" : "Resend email"}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={busy}
                                    onClick={() => void setToFree(user)}
                                  >
                                    Remove Premium
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex flex-col gap-2">
                              <Select
                                options={tierOptions}
                                value={user.accountTier}
                                onChange={(e) =>
                                  void updateUserTier(
                                    user.id,
                                    e.target.value as AccountTier
                                  )
                                }
                                className="min-w-[140px]"
                                disabled={busy}
                              />
                              <div className="flex flex-wrap gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    resetUserPassword(user.id, user.email)
                                  }
                                >
                                  <KeyRound className="mr-1 h-3 w-3" />
                                  Reset PW
                                </Button>
                                {!user.onboardingComplete && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      void markOnboardingComplete(
                                        user.id,
                                        user.email
                                      )
                                    }
                                  >
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                    Complete onboarding
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    void toggleAdmin(user.id, !user.isAdmin)
                                  }
                                >
                                  {user.isAdmin ? "Revoke admin" : "Make admin"}
                                </Button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "email" && <AdminEmailCenter />}

      {tab === "referrals" && <AdminReferralsPanel />}

      {tab === "announcements" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Megaphone className="h-5 w-5 text-amber-400" />
              <h3 className="font-mono text-sm font-semibold text-slate-200">
                {editingId ? "Edit Announcement" : "Post Announcement"}
              </h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={postAnnouncement} className="space-y-4">
                <Input
                  label="Title"
                  value={announcementForm.title}
                  onChange={(e) =>
                    setAnnouncementForm({
                      ...announcementForm,
                      title: e.target.value,
                    })
                  }
                  required
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Content
                  </label>
                  <textarea
                    value={announcementForm.content}
                    onChange={(e) =>
                      setAnnouncementForm({
                        ...announcementForm,
                        content: e.target.value,
                      })
                    }
                    required
                    rows={4}
                    className="w-full rounded border border-slate-700 bg-obsidian-800 px-3 py-2 font-mono text-sm text-slate-200 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" variant="primary" disabled={posting}>
                    {posting
                      ? "Saving..."
                      : editingId
                        ? "Save Changes"
                        : "Publish Announcement"}
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={posting}
                      onClick={cancelEditAnnouncement}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <TerminalPanel title="Manage Announcements" status="online">
            <div className="max-h-80 space-y-3 overflow-y-auto">
              {announcements.length === 0 ? (
                <p className="text-slate-600">No announcements yet</p>
              ) : (
                announcements.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded border p-3 ${
                      editingId === item.id
                        ? "border-cyan-500/40 bg-cyan-500/5"
                        : "border-slate-800/60 bg-obsidian-950"
                    }`}
                  >
                    <p className="font-mono text-sm text-slate-300">
                      {item.title}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-xs text-slate-500">
                      {item.content}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge variant={item.active ? "success" : "default"}>
                        {item.active ? "Active" : "Hidden"}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditAnnouncement(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          void toggleAnnouncementActive(item.id, !item.active)
                        }
                      >
                        {item.active ? "Hide" : "Show"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          void deleteAnnouncement(item.id, item.title)
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TerminalPanel>
        </div>
      )}
    </div>
  );
}
