"use client";

import { useEffect, useState } from "react";
import { ACCOUNT_TIERS, type AccountTier } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TerminalPanel } from "@/components/ui/TerminalPanel";
import { Users, Megaphone, Shield } from "lucide-react";

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

export function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
  });
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState("");

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

  async function updateUserTier(userId: string, accountTier: AccountTier) {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountTier }),
    });

    if (res.ok) {
      setMessage(`Tier updated for user ${userId}`);
      loadData();
    }
  }

  async function toggleAdmin(userId: string, isAdmin: boolean) {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAdmin }),
    });

    if (res.ok) {
      setMessage(`Admin status updated`);
      loadData();
    }
  }

  async function postAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    setPosting(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcementForm),
      });

      if (res.ok) {
        setAnnouncementForm({ title: "", content: "" });
        setMessage("Announcement posted");
        loadData();
      }
    } finally {
      setPosting(false);
    }
  }

  const tierOptions = Object.values(ACCOUNT_TIERS).map((tier) => ({
    value: tier,
    label: tier,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="flex items-center gap-2 font-mono text-2xl font-bold text-slate-200">
          <Shield className="h-6 w-6 text-cyan-400" />
          Admin Control Panel
        </h2>
        <p className="mt-1 font-mono text-sm text-slate-500">
          User management, tier overrides, and system announcements
        </p>
      </div>

      {message && (
        <p className="rounded border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 font-mono text-sm text-cyan-400">
          {message}
        </p>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Users className="h-5 w-5 text-cyan-400" />
          <h3 className="font-mono text-sm font-semibold text-slate-200">
            Registered Users ({users.length})
          </h3>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="font-mono text-sm text-slate-500">Loading users...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-500">
                    <th className="py-2 text-left">Name</th>
                    <th className="py-2 text-left">Email</th>
                    <th className="py-2 text-left">Tier</th>
                    <th className="py-2 text-left">Status</th>
                    <th className="py-2 text-left">Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-800/50">
                      <td className="py-3 text-slate-300">
                        {user.name ?? "—"}
                      </td>
                      <td className="py-3 text-slate-400">{user.email}</td>
                      <td className="py-3">
                        <Select
                          options={tierOptions}
                          value={user.accountTier}
                          onChange={(e) =>
                            updateUserTier(
                              user.id,
                              e.target.value as AccountTier
                            )
                          }
                          className="min-w-[140px]"
                        />
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            user.onboardingComplete ? "success" : "warning"
                          }
                        >
                          {user.onboardingComplete ? "Active" : "Onboarding"}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Button
                          variant={user.isAdmin ? "primary" : "ghost"}
                          size="sm"
                          onClick={() =>
                            toggleAdmin(user.id, !user.isAdmin)
                          }
                        >
                          {user.isAdmin ? "Admin" : "Grant"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Megaphone className="h-5 w-5 text-amber-400" />
            <h3 className="font-mono text-sm font-semibold text-slate-200">
              Post Announcement
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
              <Button type="submit" variant="primary" disabled={posting}>
                {posting ? "Posting..." : "Publish Announcement"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <TerminalPanel title="Recent Announcements" status="online">
          <div className="max-h-80 space-y-3 overflow-y-auto">
            {announcements.length === 0 ? (
              <p className="text-slate-600">No announcements yet</p>
            ) : (
              announcements.map((item) => (
                <div
                  key={item.id}
                  className="rounded border border-slate-800/60 bg-obsidian-950 p-3"
                >
                  <p className="font-mono text-sm text-slate-300">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{item.content}</p>
                  <Badge
                    variant={item.active ? "success" : "default"}
                    className="mt-2"
                  >
                    {item.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </TerminalPanel>
      </div>
    </div>
  );
}