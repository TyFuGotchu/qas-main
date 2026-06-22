import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  const users = [
    {
      email: "admin@quicksilver.demo",
      name: "System Admin",
      accountTier: "Lifetime Alpha",
      subscriptionTier: "LIFETIME" as const,
      isAdmin: true,
      onboardingComplete: true,
    },
    {
      email: "bot@quicksilver.demo",
      name: "Bot Trader",
      accountTier: "Bot Only",
      subscriptionTier: "TIER_1" as const,
      isAdmin: false,
      onboardingComplete: true,
    },
    {
      email: "quant@quicksilver.demo",
      name: "Premium Quant",
      accountTier: "Premium Quant",
      subscriptionTier: "TIER_2" as const,
      isAdmin: false,
      onboardingComplete: true,
    },
    {
      email: "alpha@quicksilver.demo",
      name: "Lifetime Alpha",
      accountTier: "Lifetime Alpha",
      subscriptionTier: "LIFETIME" as const,
      isAdmin: false,
      onboardingComplete: true,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        passwordHash,
        isAdmin: user.isAdmin,
        onboardingComplete: user.onboardingComplete,
        accountTier: user.accountTier,
        subscriptionTier: user.subscriptionTier,
      },
      create: { ...user, passwordHash },
    });
  }

  const admin = await prisma.user.findUnique({
    where: { email: "admin@quicksilver.demo" },
  });

  if (admin) {
    const existing = await prisma.announcement.findFirst({
      where: { title: "Welcome to Quicksilver Algo" },
    });

    if (!existing) {
      await prisma.announcement.create({
        data: {
          title: "Welcome to Quicksilver Algo",
          content:
            "Connect your TradeLocker account via HeroFX to deploy the Quicksilver Quant Protocol. Premium members unlock the full quant tool suite.",
          authorId: admin.id,
        },
      });
    }
  }

  if (admin) {
    const starterThreads = [
      {
        title: "Welcome — introduce yourself and your markets",
        topic: "general",
        description:
          "Tell us what you trade manually and which sessions you focus on.",
        pinned: true,
      },
      {
        title: "XAUUSD / Gold — London & NY setup discussion",
        topic: "gold",
        description: "Share gold reads, levels, and session plans. Manual trading only.",
        pinned: false,
      },
      {
        title: "Chart & Pattern Help — ask the community",
        topic: "education",
        description: "Post screenshots or describe patterns you are learning.",
        pinned: false,
      },
    ];

    for (const t of starterThreads) {
      const exists = await prisma.forumThread.findFirst({
        where: { title: t.title },
      });
      if (!exists) {
        const thread = await prisma.forumThread.create({
          data: {
            title: t.title,
            topic: t.topic,
            description: t.description,
            pinned: t.pinned,
            authorId: admin.id,
          },
        });
        await prisma.forumMessage.create({
          data: {
            threadId: thread.id,
            authorId: admin.id,
            content:
              "Welcome to Trade Together — use this thread to connect with other manual traders on any platform.",
          },
        });
      }
    }
  }

  console.log("Seeded demo users (password: password123)");
  console.log("  admin@quicksilver.demo  → Admin + LIFETIME");
  console.log("  bot@quicksilver.demo    → TIER_1");
  console.log("  quant@quicksilver.demo  → TIER_2");
  console.log("  alpha@quicksilver.demo  → LIFETIME");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());