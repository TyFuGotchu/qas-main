import { activatePremiumPlaybook } from "@/lib/email/playbook-drip";
import { sendPremiumAccessConfirmation } from "@/lib/email/premium-confirmation";
import { isPremiumTier } from "@/lib/tiers";
import type { AccountTier } from "@/types";

/**
 * Premium activation sequence:
 * 1) Access confirmation ("you're in")
 * 2) Playbook challenge start + Day 1 drip
 */
export async function triggerOnboardingSequence(params: {
  userId: string;
  email: string;
  name: string | null;
  accountTier: AccountTier;
  /** Skip confirmation if admin already sent it in the same request */
  skipConfirmation?: boolean;
}): Promise<{ sent: number; skipped: number }> {
  if (!isPremiumTier(params.accountTier)) {
    return { sent: 0, skipped: 1 };
  }

  let sent = 0;
  let skipped = 0;

  if (!params.skipConfirmation) {
    const confirm = await sendPremiumAccessConfirmation({
      userId: params.userId,
      email: params.email,
      name: params.name,
      accountTier: params.accountTier,
    });
    if (confirm.ok) sent += 1;
    else skipped += 1;
  }

  const { emailSent } = await activatePremiumPlaybook(params);
  if (emailSent) sent += 1;
  else skipped += 1;

  return { sent, skipped };
}
