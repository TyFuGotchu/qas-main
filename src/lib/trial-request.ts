import { buildSupportMailto } from "@/lib/support";

export const TRIAL_REQUEST_COPY =
  "3-day trial available on request. Bot not included.";

export const TRIAL_REQUEST_CTA = "Request 3-day trial";

export function getTrialRequestMailto(): string {
  return buildSupportMailto(
    "3-day trial request",
    "I would like a 3-day trial of the Quicksilver workflow stack. I understand the bot is not included."
  );
}
