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
        edgeRadarAccess: user.isAdmin,
        onboardingComplete: user.onboardingComplete,
        accountTier: user.accountTier,
        subscriptionTier: user.subscriptionTier,
      },
      create: { ...user, passwordHash, edgeRadarAccess: user.isAdmin },
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

  try {
    await seedEdgeRadarContent();
  } catch (err) {
    console.warn("[seed] Edge Radar seed skipped (non-fatal):", err);
  }

  console.log("Seeded demo users (password: password123)");
  console.log("  admin@quicksilver.demo  → Admin + LIFETIME");
  console.log("  bot@quicksilver.demo    → TIER_1");
  console.log("  quant@quicksilver.demo  → TIER_2");
  console.log("  alpha@quicksilver.demo  → LIFETIME");
}

async function seedEdgeRadarContent() {
  const alertSeed = [
    {
      sport: "nba",
      player: "Giannis Antetokounmpo",
      propType: "O 28.5 Pts",
      line: "28.5",
      signal: "LINE LAG",
      detail: "DraftKings still 28.5 — FanDuel moved to 30.5 after Middleton OUT",
      evPercent: 4.2,
      books: ["DraftKings", "FanDuel"],
    },
    {
      sport: "nfl",
      player: "Tyreek Hill",
      propType: "U 6.5 Rec",
      line: "6.5",
      signal: "LINE LAG",
      detail: "FanDuel 6.5 · DK still 7.5 after practice report downgrade",
      evPercent: 3.1,
      books: ["DraftKings", "FanDuel"],
    },
    {
      sport: "mlb",
      player: "Shohei Ohtani",
      propType: "O 1.5 Total Bases",
      line: "1.5",
      signal: "LINE LAG",
      detail: "BetMGM bumped to 1.5 — DK still hanging 0.5 after lineup confirmation",
      evPercent: 5.8,
      books: ["DraftKings", "BetMGM"],
    },
  ];

  for (const alert of alertSeed) {
    const exists = await prisma.edgeRadarPropAlert.findFirst({
      where: { player: alert.player, propType: alert.propType },
    });
    if (!exists) {
      await prisma.edgeRadarPropAlert.create({ data: alert });
    }
  }

  const newsSeed = [
    {
      sport: "nba",
      headline: "Bucks: Khris Middleton ruled OUT (knee)",
      summary:
        "Middleton inactive for tonight vs Celtics. Expect Giannis usage bump — points/rebounds props lagging on DK.",
      impactScore: 88,
      source: "Rotowire",
    },
    {
      sport: "nfl",
      headline: "Chiefs WR limited in practice Wednesday",
      summary:
        "Tyreek Hill limited with ankle concern. Receiving yard unders may hold value if downgrade to DNP Friday.",
      impactScore: 72,
      source: "Beat reporter",
    },
    {
      sport: "all",
      headline: "DraftKings adjusting NBA injury prop delays",
      summary:
        "Multiple books showing 2–4 minute lag on OUT tags during early slate. Edge window extended on player points.",
      impactScore: 65,
      source: "QS Monitor",
    },
  ];

  for (const item of newsSeed) {
    const exists = await prisma.edgeRadarNewsItem.findFirst({
      where: { headline: item.headline },
    });
    if (!exists) {
      await prisma.edgeRadarNewsItem.create({ data: item });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error("[seed] Fatal error:", err);
    await prisma.$disconnect();
    process.exit(1);
  });