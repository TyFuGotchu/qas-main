import { activatePremiumPlaybook } from "@/lib/email/playbook-drip";
import { isPremiumTier } from "@/lib/tiers";
import type { AccountTier } from "@/types";

/** Premium signup — starts 7-day playbook challenge + sends Day 1 email only */
export async function triggerOnboardingSequence(params: {
  userId: string;
  email: string;
  name: string | null;
  accountTier: AccountTier;
}): Promise<{ sent: number; skipped: number }> {
  if (!isPremiumTier(params.accountTier)) {
    return { sent: 0, skipped: 1 };
  }

  const { emailSent } = await activatePremiumPlaybook(params);

  return {
    sent: emailSent ? 1 : 0,
    skipped: emailSent ? 0 : 1,
  };
}