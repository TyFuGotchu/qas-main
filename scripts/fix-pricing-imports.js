const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "src");

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (/\.(ts|tsx)$/.test(ent.name)) files.push(p);
  }
  return files;
}

const ALLOWED = new Set([
  "PREMIUM_CHECKOUT_URL",
  "PREMIUM_PRICE",
  "getPremiumCheckoutUrl",
  "PRICING_TIERS",
]);

function fixImportBlock(block) {
  // block like: import {\n  a,\n  b,\n} from "..."
  const m = block.match(
    /import\s*\{([^}]*)\}\s*from\s*["'](@\/lib\/pricing-(?:constants|tiers))["']/s
  );
  if (!m) return block;
  const from = m[2];
  const names = m[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/\s+as\s+\w+$/, "").trim())
    .filter((s) => ALLOWED.has(s) || /^[A-Za-z_][A-Za-z0-9_]*$/.test(s));
  // only keep allowed pricing exports
  const kept = [...new Set(names.filter((n) => ALLOWED.has(n)))];
  if (kept.length === 0) {
    // if only pricing import and empty, drop entire import
    return "";
  }
  return `import {\n  ${kept.join(",\n  ")},\n} from "${from}";`;
}

let n = 0;
for (const file of walk(root)) {
  let text = fs.readFileSync(file, "utf8");
  const orig = text;

  // Fix multi-line pricing imports
  text = text.replace(
    /import\s*\{[^}]*\}\s*from\s*["']@\/lib\/pricing-(?:constants|tiers)["'];?/gs,
    (block) => fixImportBlock(block)
  );

  // Collapse duplicate PREMIUM_PRICE in imports left as PREMIUM_PRICE, PREMIUM_PRICE
  text = text.replace(
    /import\s*\{\s*PREMIUM_PRICE\s*,\s*PREMIUM_PRICE\s*\}\s*from/g,
    'import { PREMIUM_PRICE } from'
  );

  // Remove leftover promo wording patterns
  text = text.replace(/\s*first month with\s*\{?"Premium"?\}?/g, "");
  text = text.replace(/Get Premium — \{"Premium"\}/g, "Get Premium");
  text = text.replace(/Get Premium — \{"Premium"\}/g, "Get Premium");
  text = text.replace(/Upgrade — \{"Premium"\}/g, "Upgrade to Premium");
  text = text.replace(/Upgrade to Premium \(\{"Premium"\}\)/g, "Upgrade to Premium");
  text = text.replace(/Premium — \{"Premium"\}/g, "Get Premium");
  text = text.replace(/Claim \{"Premium"\} Launch Offer/g, "Get Premium");
  text = text.replace(/code \{"Premium"\}/gi, "Premium");
  text = text.replace(/Code \{"Premium"\}/g, "Premium");
  text = text.replace(/\$\{"Premium"\}/g, "Premium");
  text = text.replace(/\{\s*"Premium"\s*\}/g, '"Premium"');
  text = text.replace(/Use code Premium for \$60 off → /g, "");
  text = text.replace(/ \(code Premium at checkout\)/g, "");
  text = text.replace(/Checkout \(Premium prefilled when supported\):/g, "Checkout:");
  text = text.replace(
    / — \$\{PREMIUM_PRICE\} first month with code Premium/g,
    ""
  );
  text = text.replace(
    /Premium → \$\{PREMIUM_PRICE\} first month \(\$\{PREMIUM_PRICE\}\/mo after\)/g,
    "${PREMIUM_PRICE}/mo"
  );
  text = text.replace(
    /\$\{"Premium"\} → \$\{PREMIUM_PRICE\} first month \(\$\{PREMIUM_PRICE\}\/mo after\)/g,
    "${PREMIUM_PRICE}/mo"
  );
  text = text.replace(/coupon:\s*"Premium"/g, "");
  text = text.replace(/,\s*\n\s*\n/g, ",\n");

  // first-month discount language cleanup
  text = text.replace(
    /\$\{PREMIUM_PRICE\} first month/g,
    "${PREMIUM_PRICE}/mo"
  );
  text = text.replace(
    /\{PREMIUM_PRICE\} first month/g,
    "{PREMIUM_PRICE}/mo"
  );
  text = text.replace(/your first month/g, "monthly");
  text = text.replace(/month one/gi, "Premium");
  text = text.replace(/Limited offer — first 100 users/g, "Premium Quant");
  text = text.replace(/first 100 (users|subscribers|traders|redemptions)/gi, "all subscribers");

  if (text !== orig) {
    fs.writeFileSync(file, text);
    n++;
    console.log("fixed", path.relative(root, file));
  }
}
console.log("files fixed:", n);
