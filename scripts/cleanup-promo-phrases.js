const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "src");

const phraseFixes = [
  [/code\s+at checkout/gi, "at checkout"],
  [/Checkout \(\s*prefilled when supported\):/gi, "Checkout:"],
  [/Checkout \( prefilled when supported\):/gi, "Checkout:"],
  [/prefilled when supported\.?/gi, ""],
  [/first month with code\s*\)/gi, "/mo)"],
  [/first month with code\s*\./gi, "/mo."],
  [/first month with code\s*/gi, ""],
  [/\$\{PREMIUM_PRICE\} first month with code\s*\)/g, "${PREMIUM_PRICE}/mo)"],
  [/\$\{PREMIUM_PRICE\} first month with code\s*/g, "${PREMIUM_PRICE}/mo"],
  [/ → \$\{PREMIUM_PRICE\} first month/g, " ${PREMIUM_PRICE}/mo"],
  [/ → \$\{PREMIUM_PRICE\} first month \(\$\{PREMIUM_PRICE\}\/mo after\)/g, " ${PREMIUM_PRICE}/mo"],
  [/Code\s+drops month one to/gi, "Premium is"],
  [/Code\s+is limited to the first 100 traders —\s*off month one so you can/gi, "Subscribe so you can"],
  [/use promo code\s+to unlock/gi, "subscribe to unlock"],
  [/promo code\s+for/gi, "at"],
  [/promo code\s+/gi, ""],
  [/Checkout with code\s+→/gi, "Checkout →"],
  [/Checkout with code\s+/gi, "Checkout for Premium at "],
  [/Subscribe —\s*$/gm, "Subscribe"],
  [/Unlock Premium Quant —\s*$/gm, "Unlock Premium Quant"],
  [/Get Premium —\s*$/gm, "Get Premium"],
  [/Go Premium —\s*→/g, "Go Premium →"],
  [/Start challenge —\s*→/g, "Start challenge →"],
  [/limited to the first 100 (traders|users|subscribers|redemptions)/gi, "available now"],
  [/first 100 Premium redemptions/gi, "Premium subscriptions"],
  [/first 100 users/gi, "subscribers"],
  [/first 100 traders/gi, "traders"],
  [/Official launch — limited to the first 100 traders/g, "Official 7-Day Playbook launch"],
  [/Premium tier: \$149\.99\/month, promo code\s+for \$149\.99 first month\./g, "Premium tier: $149.99/month."],
  [/\$149\.99 your first month \(\$149\.99\/mo after\)\./g, "$149.99/mo."],
  [/your first month \(first 100 users\)\.?/gi, ""],
  [/for\s+your first month\./gi, "at $149.99/mo."],
  [/Code may not apply after the 100 redemptions are gone\./gi, ""],
  [/We capped the promo at the[^\n]+/gi, ""],
  [/the\s+first-month offer is almost full\./gi, "Premium is available now."],
  [/Only a few\s+spots left/gi, "Upgrade to Premium"],
  [/Last call:\s+almost gone/gi, "Upgrade to Premium"],
  [/Scarcity promo: first-month discount is nearly gone\. /gi, ""],
  [/Claim\s+at checkout:/gi, "Checkout:"],
  [/drops your first month to \$\{PREMIUM_PRICE\}\./g, "is ${PREMIUM_PRICE}/mo."],
  [/ \(\s*off\)/g, ""],
  [/off month one/gi, ""],
  [/month one/gi, "Premium"],
  [/ — code\s+for\s+your first month\./gi, "."],
  [/Premium unlocks the 7-day prop firm playbook \+ all tools — code\s+for\s+your first month\./gi, "Premium unlocks the 7-day prop firm playbook + all tools."],
  [/code\s*\n\s*for\s+your first month\./gi, ""],
  [/code\s+for\s+your first month/gi, ""],
  [/Upgrades,\s+promo, cancellations/g, "Upgrades, cancellations"],
  [/bot, playbook & tools \(\)/g, "bot, playbook & tools"],
  [/ — only a few spots left/g, " upgrade"],
  [/ — last call \(urgent\)/g, " upgrade reminder"],
];

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (/\.(ts|tsx)$/.test(ent.name)) files.push(p);
  }
  return files;
}

let n = 0;
for (const file of walk(root)) {
  let text = fs.readFileSync(file, "utf8");
  const orig = text;
  for (const [re, rep] of phraseFixes) {
    text = text.replace(re, rep);
  }
  // Remove first100 email templates block entirely if present
  if (file.endsWith("bulk-templates.ts")) {
    text = text.replace(
      /,\s*\{\s*id:\s*"first100-few-spots"[\s\S]*?id:\s*"welcome-premium"/,
      ',\n  {\n    id: "welcome-premium"'
    );
    text = text.replace(
      /,\s*\{\s*id:\s*"first100-last-call"[\s\S]*?id:\s*"welcome-premium"/,
      ',\n  {\n    id: "welcome-premium"'
    );
    // fix duplicate import
    text = text.replace(
      /import \{\s*getPremiumCheckoutUrl,\s*PREMIUM_PRICE,\s*\} from "@\/lib\/pricing-constants";\s*import \{\s*PREMIUM_PRICE,\s*getPremiumCheckoutUrl,\s*\} from "@\/lib\/pricing-constants";/,
      'import {\n  getPremiumCheckoutUrl,\n  PREMIUM_PRICE,\n} from "@/lib/pricing-constants";'
    );
    text = text.replace(
      /FIRST MONTH OFFER\n→ \$\{PREMIUM_PRICE\} your first month\n\(then \$\{PREMIUM_PRICE\}\/mo — cancel anytime\)/,
      "PRICING\n${PREMIUM_PRICE}/mo — cancel anytime"
    );
    text = text.replace(
      /1\. Subscribe to Premium Quant \(code  at checkout\)/,
      "1. Subscribe to Premium Quant at checkout"
    );
    text = text.replace(
      /Access is included with Premium Quant \(\$\{PREMIUM_PRICE\}\/mo — \$\{PREMIUM_PRICE\} first month with code \)\)\./,
      "Access is included with Premium Quant (${PREMIUM_PRICE}/mo)."
    );
    text = text.replace(
      / → \$\{PREMIUM_PRICE\} first month:\n/,
      "${PREMIUM_PRICE}/mo:\n"
    );
    text = text.replace(
      /subject: `Premium Quant — bot, playbook & tools \(\)`/,
      'subject: `Premium Quant — bot, playbook & tools`'
    );
    text = text.replace(
      / → \$\{PREMIUM_PRICE\} first month \(\$\{PREMIUM_PRICE\}\/mo after\)/,
      "${PREMIUM_PRICE}/mo"
    );
  }

  if (text !== orig) {
    fs.writeFileSync(file, text);
    n++;
    console.log("cleaned", path.relative(root, file));
  }
}
console.log("files", n);
