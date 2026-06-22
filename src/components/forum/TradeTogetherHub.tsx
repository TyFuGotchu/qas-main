"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquarePlus, MessagesSquare, Pin } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { FORUM_TOPICS, getTopicLabel } from "@/lib/forum/topics";
import { cn } from "@/lib/utils";

interface ThreadAuthor {
  id: string;
  name: string | null;
  email: string;
}

interface ForumThreadItem {
  id: string;
  title: string;
  topic: string;
  description: string | null;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  author: ThreadAuthor;
  _count: { messages: number };
  messages?: { createdAt: string; content: string }[];
}

function displayName(author: ThreadAuthor): string {
  return author.name ?? author.email.split("@")[0];
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function TradeTogetherHub() {
  const [threads, setThreads] = useState<ForumThreadItem[]>([]);
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("general");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadThreads = useCallback(async () => {
    try {
      const url =
        topicFilter === "all"
          ? "/api/forum/threads"
          : `/api/forum/threads?topic=${topicFilter}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load threads");
      const data = await res.json();
      setThreads(data.threads);
    } catch {
      setError("Could not load threads");
    } finally {
      setLoading(false);
    }
  }, [topicFilter]);

  useEffect(() => {
    setLoading(true);
    loadThreads();
    const id = setInterval(loadThreads, 30_000);
    return () => clearInterval(id);
  }, [loadThreads]);

  const handleCreate = async () => {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/forum/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, topic, description }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create thread");
      }
      setTitle("");
      setDescription("");
      setShowCreate(false);
      await loadThreads();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create thread");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <GlassPanel className="p-6" glow>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <MessagesSquare className="h-5 w-5 text-cyan-accent" />
              <h2 className="font-mono text-2xl font-bold text-slate-100">
                Trade Together
              </h2>
            </div>
            <p className="mt-2 max-w-2xl font-mono text-sm text-slate-500">
              Community threads for every market and topic. Share setups, ask
              questions, and discuss what you are trading — manually, on any
              platform.
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowCreate((v) => !v)}>
            <MessageSquarePlus className="mr-2 inline h-4 w-4" />
            New Thread
          </Button>
        </div>
      </GlassPanel>

      {showCreate && (
        <GlassPanel className="p-6">
          <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-cyan-accent">
            Create Thread
          </h3>
          <div className="mt-4 space-y-4">
            <Input
              label="Thread Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. London open gold setup discussion"
            />
            <label className="block">
              <span className="font-mono text-xs text-slate-500">Topic</span>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-200"
              >
                {FORUM_TOPICS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-mono text-xs text-slate-500">
                Description (optional)
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="What do you want to discuss?"
                className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-200 placeholder:text-slate-600 focus:border-cyan-accent/40 focus:outline-none"
              />
            </label>
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={handleCreate}
                disabled={creating || title.trim().length < 3}
              >
                {creating ? "Creating…" : "Create Thread"}
              </Button>
              <Button variant="ghost" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </GlassPanel>
      )}

      {error && (
        <p className="rounded border border-red-500/30 bg-red-500/10 px-4 py-2 font-mono text-xs text-red-400">
          {error}
        </p>
      )}

      <GlassPanel className="p-3">
        <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-widest text-slate-600">
          Filter by Topic
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTopicFilter("all")}
            className={cn(
              "rounded-md px-3 py-1.5 font-mono text-xs transition-all",
              topicFilter === "all"
                ? "bg-cyan-accent/15 text-cyan-accent"
                : "text-slate-500 hover:bg-slate-800"
            )}
          >
            All Topics
          </button>
          {FORUM_TOPICS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTopicFilter(t.id)}
              className={cn(
                "rounded-md px-3 py-1.5 font-mono text-xs transition-all",
                topicFilter === t.id
                  ? "bg-cyan-accent/15 text-cyan-accent"
                  : "text-slate-500 hover:bg-slate-800"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </GlassPanel>

      <div className="space-y-2">
        {loading && (
          <p className="py-8 text-center font-mono text-sm text-slate-500">
            Loading threads…
          </p>
        )}
        {!loading && threads.length === 0 && (
          <GlassPanel className="p-8 text-center">
            <p className="font-mono text-sm text-slate-500">
              No threads yet. Be the first to start a conversation.
            </p>
          </GlassPanel>
        )}
        {threads.map((thread) => (
          <Link key={thread.id} href={`/dashboard/trade-together/${thread.id}`}>
            <GlassPanel className="p-4 transition-all hover:border-cyan-accent/30">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {thread.pinned && (
                      <Pin className="h-3 w-3 shrink-0 text-amber-400" />
                    )}
                    <h3 className="font-mono text-sm font-semibold text-slate-200">
                      {thread.title}
                    </h3>
                  </div>
                  {thread.description && (
                    <p className="mt-1 line-clamp-2 font-mono text-xs text-slate-500">
                      {thread.description}
                    </p>
                  )}
                  <p className="mt-2 font-mono text-[10px] text-slate-600">
                    by {displayName(thread.author)} · {timeAgo(thread.updatedAt)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <Badge variant="success">{getTopicLabel(thread.topic)}</Badge>
                  <span className="font-mono text-[10px] text-slate-500">
                    {thread._count.messages} replies
                  </span>
                </div>
              </div>
            </GlassPanel>
          </Link>
        ))}
      </div>
    </div>
  );
}