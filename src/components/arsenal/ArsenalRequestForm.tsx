"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export function ArsenalRequestForm() {
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      firm: String(form.get("firm") ?? ""),
      site: String(form.get("site") ?? ""),
      contact: String(form.get("contact") ?? ""),
      platforms: String(form.get("platforms") ?? ""),
      rulesUrl: String(form.get("rulesUrl") ?? ""),
      modules: String(form.get("modules") ?? ""),
      volume: String(form.get("volume") ?? ""),
    };
    try {
      const res = await fetch("/api/arsenal/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(res.ok ? "Request received. We’ll reply from support." : "Could not send. Email supportteam@quicksilveralgo.com.");
    } catch {
      setStatus("Could not send. Email supportteam@quicksilveralgo.com.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-3">
      <Field name="firm" label="Firm name" required />
      <Field name="site" label="Website" />
      <Field name="contact" label="Contact email" required />
      <Field name="platforms" label="Platforms (TradeLocker now; MT5 / cTrader on request)" />
      <Field name="rulesUrl" label="Published rules URL" />
      <Field name="modules" label="Modules wanted" />
      <Field name="volume" label="Account volume (optional)" />
      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "Sending…" : "Request an Arsenal"}
      </Button>
      {status && <p className="text-sm text-[#C9C2D6]">{status}</p>}
    </form>
  );
}

function Field({
  name,
  label,
  required,
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9AA3B2]">
        {label}
      </span>
      <input
        name={name}
        required={required}
        className="mt-1 h-11 w-full rounded-[8px] border border-white/[0.1] bg-[#0B0D12] px-3 text-sm text-white outline-none focus:border-[#7FE7DC]"
      />
    </label>
  );
}
