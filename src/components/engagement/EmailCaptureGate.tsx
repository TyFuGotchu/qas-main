"use client";

import { useState } from "react";
import { Lock, Mail, Sparkles } from "lucide-react";
import {
  getLessonProgress,
  setEmailCaptured,
  syncEngagementToServer,
} from "@/lib/academy/lesson-progress";
import { getStickyBarVariantLabel } from "@/lib/engagement/ab-test";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface EmailCaptureGateProps {
  lessonSlug: string;
  onUnlocked: () => void;
}

export function EmailCaptureGate({ lessonSlug, onUnlocked }: EmailCaptureGateProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email");
      return;
    }
    setLoading(true);
    const ok = await syncEngagementToServer({
      email,
      source: lessonSlug,
      abStickyBucket: getStickyBarVariantLabel(),
    });
    setLoading(false);
    if (ok) {
      setEmailCaptured(email);
      onUnlocked();
    } else {
      setEmailCaptured(email);
      onUnlocked();
    }
  };

  const viewed = getLessonProgress().viewed.length;

  return (
    <div className="relative min-h-[280px]">
      <div className="pointer-events-none select-none blur-sm opacity-40">
        <div className="h-48 rounded-lg bg-gradient-to-br from-cyan-accent/10 to-slate-900" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="max-w-md rounded-xl border border-cyan-accent/30 bg-slate-950/95 p-6 text-center shadow-2xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-cyan-accent/40 bg-cyan-accent/10">
            <Sparkles className="h-6 w-6 text-cyan-accent" />
          </div>
          <h3 className="mt-4 font-mono text-lg font-bold text-slate-100">
            Save your progress & unlock walkthrough
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Get animated walkthroughs, live chart overlays, and a personalized
            lesson drip — free. {viewed > 0 && `We'll save your ${viewed} explored lesson${viewed === 1 ? "" : "s"}.`}
          </p>
          <div className="mt-4 space-y-3 text-left">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            {error && (
              <p className="font-mono text-xs text-red-400">{error}</p>
            )}
            <Button
              variant="primary"
              className="w-full"
              onClick={submit}
              disabled={loading}
            >
              <Mail className="h-4 w-4" />
              {loading ? "Saving…" : "Unlock interactive lesson"}
            </Button>
          </div>
          <p className="mt-3 flex items-center justify-center gap-1 font-mono text-[10px] text-slate-600">
            <Lock className="h-3 w-3" />
            No spam · Unsubscribe anytime
          </p>
        </div>
      </div>
    </div>
  );
}