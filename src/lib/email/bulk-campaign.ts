import { prisma } from "@/lib/prisma";
import {
  getDefaultFromAddress,
  plainTextToEmailHtml,
  sendEmailDetailed,
} from "@/lib/email/resend";

export type BulkAudience =
  | "all"
  | "free"
  | "premium"
  | "onboarded"
  | "custom";

const RATE_DELAY_MS = 120; // stay under Resend 10 req/s default

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function resolveBulkRecipients(
  audience: BulkAudience,
  customEmails?: string[]
): Promise<{ email: string; name: string | null }[]> {
  if (audience === "custom") {
    const emails = (customEmails ?? [])
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.includes("@"));
    const unique = Array.from(new Set(emails));
    return unique.map((email) => ({ email, name: null }));
  }

  const users = await prisma.user.findMany({
    where:
      audience === "free"
        ? { subscriptionTier: "FREE" }
        : audience === "premium"
          ? { subscriptionTier: { in: ["TIER_1", "TIER_2", "LIFETIME"] } }
          : audience === "onboarded"
            ? { onboardingComplete: true }
            : {},
    select: { email: true, name: true },
    orderBy: { createdAt: "desc" },
  });

  return users.map((u) => ({ email: u.email, name: u.name }));
}

export async function runBulkEmailCampaign(params: {
  subject: string;
  body: string;
  bodyIsHtml?: boolean;
  audience: BulkAudience;
  customEmails?: string[];
  createdByEmail?: string | null;
  from?: string;
}): Promise<{
  campaignId: string;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  status: string;
  errors: string[];
}> {
  const recipients = await resolveBulkRecipients(
    params.audience,
    params.customEmails
  );

  if (recipients.length === 0) {
    throw new Error("No recipients matched this audience");
  }

  if (recipients.length > 500) {
    throw new Error(
      `Audience has ${recipients.length} recipients. Max 500 per campaign — narrow the filter or split into batches.`
    );
  }

  const html = params.bodyIsHtml
    ? params.body
    : plainTextToEmailHtml(params.body);

  const campaign = await prisma.adminBulkEmailCampaign.create({
    data: {
      subject: params.subject.trim(),
      bodyHtml: html,
      audience: params.audience,
      recipientCount: recipients.length,
      status: "sending",
      createdByEmail: params.createdByEmail ?? null,
    },
  });

  let sentCount = 0;
  let failedCount = 0;
  const errors: string[] = [];

  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i];
    const result = await sendEmailDetailed({
      to: recipient.email,
      subject: params.subject.trim(),
      html,
      from: params.from ?? getDefaultFromAddress(),
      idempotencyKey: `bulk/${campaign.id}/${recipient.email}`,
      tags: [
        { name: "category", value: "bulk-campaign" },
        { name: "campaign_id", value: campaign.id.slice(0, 256) },
        { name: "audience", value: params.audience.slice(0, 256) },
      ],
    });

    if (result.ok) {
      sentCount++;
    } else {
      failedCount++;
      if (errors.length < 25) {
        errors.push(
          `${recipient.email}: ${result.error ?? result.skipped ? "skipped" : "failed"}`
        );
      }
    }

    if (i < recipients.length - 1) {
      await sleep(RATE_DELAY_MS);
    }
  }

  const status =
    failedCount === 0
      ? "completed"
      : sentCount === 0
        ? "failed"
        : "completed_with_errors";

  await prisma.adminBulkEmailCampaign.update({
    where: { id: campaign.id },
    data: {
      sentCount,
      failedCount,
      status,
      errors,
      completedAt: new Date(),
    },
  });

  return {
    campaignId: campaign.id,
    recipientCount: recipients.length,
    sentCount,
    failedCount,
    status,
    errors,
  };
}
