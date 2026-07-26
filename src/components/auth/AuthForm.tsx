"use client";

import { useCallback, useState } from "react";
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
import { trackLogin, trackSignUp } from "@/lib/analytics/ga-events";
import { RecaptchaField } from "@/components/auth/RecaptchaField";
import { isRecaptchaSiteKeyPresent } from "@/lib/security/recaptcha-public";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRequired = mode === "register" && isRecaptchaSiteKeyPresent();

  const redirectParam = searchParams.get("redirect");

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });

  const onCaptchaToken = useCallback((token: string | null) => {
    setCaptchaToken(token);
  }, []);

  function getPostAuthRedirect(user: {
    onboardingComplete: boolean;
    profileComplete: boolean;
    isAdmin: boolean;
  }) {
    if (redirectParam) return redirectParam;
    if (!user.onboardingComplete) return "/onboarding/pricing";
    if (!user.profileComplete) return "/onboarding/profile";
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
      if (captchaRequired && !captchaToken) {
        setError("Please complete the captcha verification");
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
          : {
              ...form,
              recaptchaToken: captchaToken ?? undefined,
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 429) {
          const wait = data.retryAfterSeconds
            ? ` Wait ${data.retryAfterSeconds} seconds.`
            : " Please wait a few minutes.";
          setError((data.error as string) ?? `Too many attempts.${wait}`);
          return;
        }
        setError((data.error as string) ?? "An error occurred");
        return;
      }

      if (!data.user) {
        setError("Login succeeded but session was not created. Please try again.");
        return;
      }

      setUser(data.user);
      if (mode === "register") {
        trackSignUp("email");
      } else {
        trackLogin("email");
      }
      const destination =
        mode === "register"
          ? "/onboarding/pricing"
          : getPostAuthRedirect(data.user);
      router.refresh();
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

          {mode === "register" && (
            <RecaptchaField onToken={onCaptchaToken} />
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