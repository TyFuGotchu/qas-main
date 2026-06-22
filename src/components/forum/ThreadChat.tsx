"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { getTopicLabel } from "@/lib/forum/topics";
import { cn } from "@/lib/utils";

interface ThreadAuthor {
  id: string;
  name: string | null;
  email: string;
}

interface ForumMessage {
  id: string;
  content: string;
  createdAt: string;
  author: ThreadAuthor;
}

interface ForumThread {
  id: string;
  title: string;
  topic: string;
  description: string | null;
  author: ThreadAuthor;
  _count: { messages: number };
}

function displayName(author: ThreadAuthor): string {
  return author.name ?? author.email.split("@")[0];
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ThreadChat({ threadId }: { threadId: string }) {
  const [thread, setThread] = useState<ForumThread | null>(null);
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastFetchRef = useRef<string | null>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadThread = useCallback(async () => {
    const res = await fetch(`/api/forum/threads/${threadId}`);
    if (!res.ok) throw new Error("Thread not found");
    const data = await res.json();
    setThread(data.thread);
  }, [threadId]);

  const loadMessages = useCallback(
    async (initial = false) => {
      const since = initial ? null : lastFetchRef.current;
      const url = since
        ? `/api/forum/threads/${threadId}/messages?since=${encodeURIComponent(since)}`
        : `/api/forum/threads/${threadId}/messages`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load messages");
      const data = await res.json();

      if (initial) {
        setMessages(data.messages);
      } else if (data.messages.length > 0) {
        setMessages((prev) => {
          const ids = new Set(prev.map((m) => m.id));
          const added = data.messages.filter((m: ForumMessage) => !ids.has(m.id));
          return [...prev, ...added];
        });
      }

      if (data.messages.length > 0) {
        lastFetchRef.current = data.messages[data.messages.length - 1].createdAt;
      }
    },
    [threadId]
  );

  useEffect(() => {
    (async () => {
      try {
        await loadThread();
        await loadMessages(true);
      } catch {
        setError("Could not load thread");
      } finally {
        setLoading(false);
      }
    })();
  }, [loadThread, loadMessages]);

  useEffect(() => {
    if (!loading) scrollToBottom();
  }, [messages.length, loading]);

  useEffect(() => {
    const id = setInterval(() => loadMessages(false), 8_000);
    return () => clearInterval(id);
  }, [loadMessages]);

  const handleSend = async () => {
    const text = content.trim();
    if (!text) return;

    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/forum/threads/${threadId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to send");
      }
      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
      lastFetchRef.current = data.message.createdAt;
      setContent("");
      scrollToBottom();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <p className="py-12 text-center font-mono text-sm text-slate-500">
        Loading thread…
      </p>
    );
  }

  if (!thread) {
    return (
      <GlassPanel className="p-8 text-center">
        <p className="font-mono text-sm text-red-400">{error ?? "Thread not found"}</p>
        <Link
          href="/dashboard/trade-together"
          className="mt-4 inline-block font-mono text-xs text-cyan-accent hover:underline"
        >
          ← Back to Trade Together
        </Link>
      </GlassPanel>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <GlassPanel className="shrink-0 p-4">
        <Link
          href="/dashboard/trade-together"
          className="mb-3 inline-flex items-center gap-1 font-mono text-xs text-slate-500 hover:text-cyan-accent"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to threads
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-mono text-xl font-bold text-slate-100">
              {thread.title}
            </h2>
            {thread.description && (
              <p className="mt-1 font-mono text-sm text-slate-500">
                {thread.description}
              </p>
            )}
            <p className="mt-2 font-mono text-[10px] text-slate-600">
              Started by {displayName(thread.author)} · {thread._count.messages}{" "}
              messages
            </p>
          </div>
          <Badge variant="success">{getTopicLabel(thread.topic)}</Badge>
        </div>
      </GlassPanel>

      <GlassPanel className="flex min-h-0 flex-1 flex-col overflow-hidden p-0">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && (
            <p className="py-8 text-center font-mono text-sm text-slate-500">
              No messages yet. Start the conversation.
            </p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="rounded-lg border border-slate-800/60 bg-slate-900/40 px-4 py-3"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-cyan-accent">
                  {displayName(msg.author)}
                </span>
                <span className="font-mono text-[10px] text-slate-600">
                  {formatTime(msg.createdAt)}
                </span>
              </div>
              <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-300">
                {msg.content}
              </p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-slate-700/50 p-4">
          {error && (
            <p className="mb-2 font-mono text-xs text-red-400">{error}</p>
          )}
          <div className="flex gap-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={2}
              placeholder="Share your setup, question, or market read…"
              className={cn(
                "min-h-[52px] flex-1 resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2",
                "font-mono text-sm text-slate-200 placeholder:text-slate-600",
                "focus:border-cyan-accent/40 focus:outline-none"
              )}
            />
            <Button
              variant="primary"
              onClick={handleSend}
              disabled={sending || !content.trim()}
              className="shrink-0 self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 font-mono text-[10px] text-slate-600">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </GlassPanel>
    </div>
  );
}