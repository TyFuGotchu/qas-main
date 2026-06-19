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
      isAdmin: true,
      onboardingComplete: true,
    },
    {
      email: "bot@quicksilver.demo",
      name: "Bot Trader",
      accountTier: "Bot Only",
      isAdmin: false,
      onboardingComplete: true,
    },
    {
      email: "quant@quicksilver.demo",
      name: "Premium Quant",
      accountTier: "Premium Quant",
      isAdmin: false,
      onboardingComplete: true,
    },
    {
      email: "alpha@quicksilver.demo",
      name: "Lifetime Alpha",
      accountTier: "Lifetime Alpha",
      isAdmin: false,
      onboardingComplete: true,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        isAdmin: user.isAdmin,
        onboardingComplete: user.onboardingComplete,
        accountTier: user.accountTier,
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

  console.log("Seeded demo users (password: password123)");
  console.log("  admin@quicksilver.demo  → Admin + Lifetime Alpha");
  console.log("  bot@quicksilver.demo    → Bot Only");
  console.log("  quant@quicksilver.demo  → Premium Quant");
  console.log("  alpha@quicksilver.demo  → Lifetime Alpha");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());