/**
 * Remove FIRST100 promo carefully. Never strip () or collapse indentation.
 */
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

function cleanImportList(body) {
  return body
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => {
      const base = s.split(/\s+as\s+/)[0].trim();
      return !base.startsWith("PREMIUM_PROMO_");
    })
    .filter((s, i, arr) => arr.indexOf(s) === i);
}

let count = 0;
for (const file of walk(root)) {
  if (file.endsWith("pricing-constants.ts") || file.endsWith("pricing-tiers.ts")) {
    continue;
  }

  let text = fs.readFileSync(file, "utf8");
  if (
    !/FIRST100|PREMIUM_PROMO_|89\.99|prefilled_promo|\$60 off/.test(text)
  ) {
    continue;
  }

  const orig = text;

  // Clean pricing imports: drop PREMIUM_PROMO_* only
  text = text.replace(
    /import\s*\{([^}]*)\}\s*from\s*(["']@\/lib\/pricing-(?:constants|tiers)["'])\s*;/gs,
    (full, body, from) => {
      let names = cleanImportList(body);
      // If file used promo first month, ensure PREMIUM_PRICE is imported
      if (
        /PREMIUM_PROMO_FIRST_MONTH|PREMIUM_PRICE/.test(orig) &&
        !names.includes("PREMIUM_PRICE")
      ) {
        names.push("PREMIUM_PRICE");
      }
      if (
        /getPremiumCheckoutUrl/.test(orig) &&
        !names.includes("getPremiumCheckoutUrl")
      ) {
        names.push("getPremiumCheckoutUrl");
      }
      names = [...new Set(names)];
      if (!names.length) return "";
      return `import {\n  ${names.join(",\n  ")},\n} from ${from};`;
    }
  );

  // Symbol replacements
  text = text.replace(/\bPREMIUM_PROMO_FIRST_MONTH\b/g, "PREMIUM_PRICE");
  text = text.replace(/\bPREMIUM_PROMO_CODE\b/g, "__REMOVED_PROMO__");
  text = text.replace(/\bPREMIUM_PROMO_NOTE\b/g, "__REMOVED_NOTE__");
  text = text.replace(/\bPREMIUM_PROMO_DISCOUNT\b/g, "__REMOVED_DISCOUNT__");
  text = text.replace(/\bPREMIUM_PROMO_STRIPE_ID\b/g, "__REMOVED_STRIPE__");

  // Template / expression cleanup for removed symbols
  text = text.replace(/\$\{__REMOVED_PROMO__\}/g, "");
  text = text.replace(/\$\{__REMOVED_NOTE__\}/g, "");
  text = text.replace(/\$\{__REMOVED_DISCOUNT__\}/g, "");
  text = text.replace(/\{__REMOVED_PROMO__\}/g, "");
  text = text.replace(/\{__REMOVED_NOTE__\}/g, "");
  text = text.replace(/\{__REMOVED_DISCOUNT__\}/g, "");
  text = text.replace(/__REMOVED_PROMO__/g, '""');
  text = text.replace(/__REMOVED_NOTE__/g, '""');
  text = text.replace(/__REMOVED_DISCOUNT__/g, '""');
  text = text.replace(/__REMOVED_STRIPE__/g, '""');

  // Literal promo strings
  text = text.replace(/FIRST100/g, "");
  text = text.replace(/\$89\.99/g, "$149.99");
  text = text.replace(/(?<![0-9.])89\.99(?![0-9])/g, "149.99");
  text = text.replace(/\$60 off/gi, "");
  text = text.replace(/getPremiumCheckoutUrl\(true\)/g, "getPremiumCheckoutUrl()");
  text = text.replace(/getPremiumCheckoutUrl\(false\)/g, "getPremiumCheckoutUrl()");

  // Soft clean empty promo phrases (do not touch parentheses used for calls)
  text = text.replace(/Use code\s+for\s+/gi, "");
  text = text.replace(/code\s+""\s*/gi, "");
  text = text.replace(/Code\s+""\s*/g, "");
  text = text.replace(/\(\s*""\s*off\)/g, "");
  text = text.replace(/""\s*off/gi, "");
  text = text.replace(/prefilled_promo_code[^"'&\s]*/g, "");
  text = text.replace(/coupon:\s*""\s*,?/g, "");
  text = text.replace(/promoCode:\s*""\s*,?/g, "");

  // Tidy double spaces on single lines only (preserve indent by not matching newlines)
  text = text
    .split("\n")
    .map((line) => {
      // preserve leading indent
      const m = line.match(/^(\s*)(.*)$/);
      if (!m) return line;
      return m[1] + m[2].replace(/ {2,}/g, " ").replace(/ \./g, ".");
    })
    .join("\n");

  if (text !== orig) {
    fs.writeFileSync(file, text);
    count++;
    console.log("updated", path.relative(root, file));
  }
}

console.log("done", count);
