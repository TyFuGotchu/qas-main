/** Client-safe reCAPTCHA site key only (no secret). */
export function getRecaptchaSiteKey(): string {
  return (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "").trim();
}

export function isRecaptchaSiteKeyPresent(): boolean {
  return Boolean(getRecaptchaSiteKey());
}
