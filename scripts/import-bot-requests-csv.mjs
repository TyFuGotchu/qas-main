/**
 * One-shot import of TradeLocker bot request contacts into the DB.
 * Usage (from repo root, with DATABASE_URL set):
 *   node scripts/import-bot-requests-csv.mjs "C:\Users\jaspe\Downloads\contacts-xxx.csv"
 *
 * Prefer Admin → Bot requests → Import after deploy if easier.
 */
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const file = process.argv[2];

if (!file || !fs.existsSync(file)) {
  console.error("Usage: node scripts/import-bot-requests-csv.mjs <path-to.csv>");
  process.exit(1);
}

const text = fs.readFileSync(file, "utf8");
const lines = text.split(/\r?\n/).filter(Boolean);
const emails = [];
const start = lines[0]?.toLowerCase().includes("email") ? 1 : 0;

for (let i = start; i < lines.length; i++) {
  const parts = lines[i].split(",");
  let email = "";
  let unsubscribed = false;
  if (parts.length >= 6 && parts[4]?.includes("@")) {
    email = parts[4].trim().toLowerCase();
    unsubscribed = parts[5]?.trim().toLowerCase() === "true";
  } else {
    const found = parts.find((p) => p.includes("@"));
    if (found) email = found.trim().toLowerCase();
  }
  if (email && !unsubscribed) emails.push(email);
}

const unique = [...new Set(emails)];
let created = 0;
let skipped = 0;

for (const email of unique) {
  try {
    await prisma.tradeLockerBotRequest.upsert({
      where: { email },
      create: {
        email,
        status: "pending",
        source: "tradelocker_marketplace",
        notes: "Imported from TradeLocker bot request export",
      },
      update: {},
    });
    // upsert always succeeds; detect create via find — simpler:
    created += 1;
  } catch {
    skipped += 1;
  }
}

// Accurate counts
const total = await prisma.tradeLockerBotRequest.count();
const pending = await prisma.tradeLockerBotRequest.count({
  where: { status: "pending" },
});

console.log(`Processed ${unique.length} unique emails from CSV`);
console.log(`DB total bot requests: ${total} (pending: ${pending})`);
await prisma.$disconnect();
