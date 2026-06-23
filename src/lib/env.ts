export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

const MIN_AUTH_SECRET_LENGTH = 32;

export function getAuthSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.JWT_SECRET;

  if (!secret) {
    if (isProduction()) {
      throw new Error(
        "NEXTAUTH_SECRET (or JWT_SECRET) environment variable is required in production"
      );
    }
    return "quicksilver-dev-secret-change-in-production";
  }

  if (isProduction() && secret.length < MIN_AUTH_SECRET_LENGTH) {
    throw new Error(
      `NEXTAUTH_SECRET must be at least ${MIN_AUTH_SECRET_LENGTH} characters in production`
    );
  }

  return secret;
}

export function getHeroFxPartnerLink(): string {
  return (
    process.env.HEROFX_PARTNER_LINK ??
    "https://herofx.co/?partner_code=9149459"
  );
}

export interface EnvValidationResult {
  valid: boolean;
  missing: string[];
  message: string | null;
}

export function validateCoreProductionEnv(): EnvValidationResult {
  if (!isProduction()) {
    return { valid: true, missing: [], message: null };
  }

  const required: Record<string, string | undefined> = {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET:
      process.env.NEXTAUTH_SECRET ?? process.env.JWT_SECRET,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    HEROFX_PARTNER_LINK: process.env.HEROFX_PARTNER_LINK,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value || value.trim() === "")
    .map(([key]) => key);

  if (missing.length > 0) {
    return {
      valid: false,
      missing,
      message: `Missing required production environment variables: ${missing.join(", ")}`,
    };
  }

  return { valid: true, missing: [], message: null };
}

export function validateStripeWebhookEnv(): EnvValidationResult {
  if (!isProduction()) {
    return { valid: true, missing: [], message: null };
  }

  const required: Record<string, string | undefined> = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value || value.trim() === "")
    .map(([key]) => key);

  if (missing.length > 0) {
    return {
      valid: false,
      missing,
      message: `Stripe webhook misconfigured. Missing: ${missing.join(", ")}`,
    };
  }

  return { valid: true, missing: [], message: null };
}