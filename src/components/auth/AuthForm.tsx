"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useSession } from "@/providers/SessionProvider";
import Link from "next/link";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIREMENTS_HINT,
  validatePassword,
} from "@/lib/security/password";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectParam = searchParams.get("redirect");

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });

  function getPostAuthRedirect(user: {
    onboardingComplete: boolean;
    isAdmin: boolean;
  }) {
    if (redirectParam) return redirectParam;
    if (!user.onboardingComplete) return "/onboarding/pricing";
    if (user.isAdmin) return "/admin/dashboard";
    return "/dashboard";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "register") {
      const passwordCheck = validatePassword(form.password);
      if (!passwordCheck.valid) {
        setError(passwordCheck.error ?? "Password does not meet requirements");
        setLoading(false);
        return;
      }
    }

    try {
      const endpoint =
        mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        mode === "login"
          ? { email: form.email, password: form.password }
          : form;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "An error occurred");
        return;
      }

      setUser(data.user);
      const destination =
        mode === "register"
          ? "/onboarding/pricing"
          : getPostAuthRedirect(data.user);
      router.push(destination);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card glow className="mx-auto w-full max-w-md">
      <CardHeader className="text-center">
        <h1 className="font-mono text-xl font-bold text-slate-200">
          {mode === "login" ? "System Login" : "Create Profile"}
        </h1>
        <p className="mt-1 font-mono text-xs text-slate-500">
          {mode === "login"
            ? "Quicksilver Algo Terminal Access"
            : "Register your profile to begin onboarding"}
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <Input
              label="Display Name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Trader ID"
            />
          )}

          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="trader@institution.com"
          />

          <Input
            label="Password"
            type="password"
            required
            minLength={mode === "register" ? PASSWORD_MIN_LENGTH : 1}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
          {mode === "register" && (
            <p className="font-mono text-[10px] text-slate-600">
              {PASSWORD_REQUIREMENTS_HINT}
            </p>
          )}

          {error && (
            <p className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-400">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Authenticating..."
              : mode === "login"
              ? "Access Terminal"
              : "Create Profile & Continue"}
          </Button>
        </form>

        <p className="mt-6 text-center font-mono text-xs text-slate-600">
          {mode === "login" ? (
            <>
              No account?{" "}
              <Link href="/register" className="text-cyan-400 hover:underline">
                Register
              </Link>
            </>
          ) : (
            <>
              Already registered?{" "}
              <Link href="/login" className="text-cyan-400 hover:underline">
                Login
              </Link>
            </>
          )}
        </p>
      </CardContent>
    </Card>
  );
}