/**
 * Google reCAPTCHA v2 verification for signup.
 *
 * Railway / env:
 * - NEXT_PUBLIC_RECAPTCHA_SITE_KEY  (public, client widget)
 * - RECAPTCHA_SECRET_KEY            (server only)
 *
 * If either key is missing, verification is skipped (dev-friendly) and a warning
 * is logged. In production, set both keys so bots are blocked.
 */

export function getRecaptchaSiteKey(): string {
  return (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "").trim();
}

export function getRecaptchaSecretKey(): string {
  return (process.env.RECAPTCHA_SECRET_KEY ?? "").trim();
}

export function isRecaptchaConfigured(): boolean {
  return Boolean(getRecaptchaSiteKey() && getRecaptchaSecretKey());
}

export interface RecaptchaVerifyResult {
  ok: boolean;
  skipped: boolean;
  error?: string;
  score?: number;
}

export async function verifyRecaptchaToken(
  token: string | undefined | null,
  remoteIp?: string | null
): Promise<RecaptchaVerifyResult> {
  const secret = getRecaptchaSecretKey();
  const siteKey = getRecaptchaSiteKey();

  if (!secret || !siteKey) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[recaptcha] Keys not fully configured — registration captcha skipped. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY and RECAPTCHA_SECRET_KEY."
      );
    }
    return { ok: true, skipped: true };
  }

  if (!token || typeof token !== "string" || token.length < 10) {
    return {
      ok: false,
      skipped: false,
      error: "Please complete the captcha verification",
    };
  }

  try {
    const params = new URLSearchParams();
    params.set("secret", secret);
    params.set("response", token);
    if (remoteIp) params.set("remoteip", remoteIp);

    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = (await res.json()) as {
      success?: boolean;
      "error-codes"?: string[];
      score?: number;
    };

    if (!data.success) {
      return {
        ok: false,
        skipped: false,
        error: "Captcha verification failed. Please try again.",
      };
    }

    return { ok: true, skipped: false, score: data.score };
  } catch (err) {
    console.error("[recaptcha] verify error:", err);
    return {
      ok: false,
      skipped: false,
      error: "Captcha service unavailable. Please try again.",
    };
  }
}

/** Common disposable / throwaway domains — light bot filter. */
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "throwaway.email",
  "yopmail.com",
  "sharklasers.com",
  "trashmail.com",
  "getnada.com",
  "maildrop.cc",
  "dispostable.com",
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) return true;
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}
