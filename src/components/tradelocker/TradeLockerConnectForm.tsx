"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import type { TradeLockerEnvironment } from "@/lib/tradelocker/constants";
import { Link2, Loader2 } from "lucide-react";

interface TradeLockerConnectFormProps {
  onConnected?: () => void;
}

export function TradeLockerConnectForm({
  onConnected,
}: TradeLockerConnectFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    server: "",
    environment: "live" as TradeLockerEnvironment,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const server = form.server.trim();

    if (!server) {
      toast({
        title: "Server required",
        description:
          "Enter the exact broker server name shown on your TradeLocker login screen.",
        variant: "error",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/tradelocker/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          server,
          environment: form.environment,
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

      const envLabel = data.environment === "demo" ? "Demo" : "Live";

      toast({
        title: "TradeLocker connected",
        description: `Connected via ${envLabel} API. Loading your accounts…`,
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
          Works with any TradeLocker broker (FTMO, HeroFX, funded accounts,
          etc.). Credentials go only to our secure server proxy — tokens never
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

          <Input
            label="Broker server"
            type="text"
            required
            value={form.server}
            onChange={(e) => setForm({ ...form, server: e.target.value })}
            placeholder="Exact name from TradeLocker login"
          />
          <p className="-mt-2 font-mono text-[10px] leading-relaxed text-slate-600">
            Use the exact server name from the TradeLocker app login screen —
            case and spelling must match (e.g. FTMO, HeroFX, AquaFunded).
          </p>

          <Select
            label="Environment"
            value={form.environment}
            onChange={(e) =>
              setForm({
                ...form,
                environment: e.target.value as TradeLockerEnvironment,
              })
            }
            options={[
              { value: "live", label: "Live (real & most funded accounts)" },
              { value: "demo", label: "Demo (practice accounts)" },
            ]}
          />
          <p className="-mt-2 font-mono text-[10px] text-slate-600">
            If login fails on Live, we automatically retry Demo (and vice versa).
          </p>

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