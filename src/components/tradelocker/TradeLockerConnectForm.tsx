"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { DEFAULT_TRADELOCKER_SERVERS } from "@/lib/tradelocker/constants";
import { Link2, Loader2 } from "lucide-react";

interface TradeLockerConnectFormProps {
  onConnected?: () => void;
}

export function TradeLockerConnectForm({
  onConnected,
}: TradeLockerConnectFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [useCustomServer, setUseCustomServer] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    server: DEFAULT_TRADELOCKER_SERVERS[0] as string,
    customServer: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const server = useCustomServer ? form.customServer.trim() : form.server;

    try {
      const res = await fetch("/api/tradelocker/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          server,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Connection failed",
          description: data.error ?? "Invalid credentials or server",
          variant: "error",
        });
        return;
      }

      toast({
        title: "TradeLocker connected",
        description: "Your session is secured server-side. Loading accounts…",
        variant: "success",
      });

      setForm((prev) => ({ ...prev, password: "" }));
      onConnected?.();
    } catch {
      toast({
        title: "Network error",
        description: "Could not reach the TradeLocker proxy. Try again.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card glow className="border-cyan-500/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-cyan-400" />
          <h3 className="font-mono text-lg font-semibold text-slate-200">
            Connect TradeLocker Account
          </h3>
        </div>
        <p className="mt-2 font-mono text-xs text-slate-500">
          Credentials are sent only to our secure server proxy — tokens never
          touch the browser.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            required
            autoComplete="username"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="trader@email.com"
          />

          <Input
            label="Password"
            type="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />

          {!useCustomServer ? (
            <Select
              label="Server"
              value={form.server}
              onChange={(e) => setForm({ ...form, server: e.target.value })}
              options={DEFAULT_TRADELOCKER_SERVERS.map((server) => ({
                value: server,
                label: server,
              }))}
            />
          ) : (
            <Input
              label="Server"
              type="text"
              required
              value={form.customServer}
              onChange={(e) =>
                setForm({ ...form, customServer: e.target.value })
              }
              placeholder="HeroFX"
            />
          )}

          <button
            type="button"
            onClick={() => setUseCustomServer((v) => !v)}
            className="font-mono text-[10px] uppercase tracking-widest text-cyan-accent hover:underline"
          >
            {useCustomServer ? "Use server dropdown" : "Enter custom server name"}
          </button>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Authenticating…
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4" />
                Connect Securely
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}