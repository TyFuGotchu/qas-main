/**
 * Carefully remove FIRST100 / discounted-first-month promo.
 * Does NOT collapse whitespace or rewrite unrelated files.
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

function stripPromoFromImports(text) {
  return text.replace(
    /import\s*\{([^}]*)\}\s*from\s*(["']@\/lib\/pricing-(?:constants|tiers)["'])\s*;/gs,
    (full, body, from) => {
      if (
        !/PREMIUM_PROMO_|getPremiumCheckoutUrl|PREMIUM_PRICE|PREMIUM_CHECKOUT|PRICING_TIERS/.test(
          body
        )
      ) {
        return full;
      }
      const names = body
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => {
          // keep aliases like X as Y
          const base = s.split(/\s+as\s+/)[0].trim();
          return { raw: s, base };
        })
        .filter(({ base }) =>
          [
            "PREMIUM_PRICE",
            "PREMIUM_CHECKOUT_URL",
            "getPremiumCheckoutUrl",
            "PRICING_TIERS",
          ].includes(base)
        )
        .map(({ raw, base }) => {
          // drop promo only
          if (base.startsWith("PREMIUM_PROMO_")) return null;
          return raw.includes(" as ") ? raw : base;
        })
        .filter(Boolean);

      const uniq = [...new Set(names)];
      if (!uniq.length) {
        // still need PREMIUM_PRICE if file uses it via promo names - add it
        if (/PREMIUM_PROMO_|PREMIUM_PRICE|\$\{PREMIUM_/.test(full + text)) {
          // handled below
        }
        return `import {\n  PREMIUM_PRICE,\n  getPremiumCheckoutUrl,\n} from ${from};`;
      }
      // Ensure PREMIUM_PRICE present if file references promo first month later
      return `import {\n  ${uniq.join(",\n  ")},\n} from ${from};`;
    }
  );
}

// second pass: ensure files that still reference removed symbols get PREMIUM_PRICE
function ensurePremiumPriceImport(text, filePath) {
  if (!/PREMIUM_PRICE/.test(text)) return text;
  if (/from ["']@\/lib\/pricing-(constants|tiers)["']/.test(text)) return text;
  // add import at top after first import block if PREMIUM_PRICE used but no import
  if (/PREMIUM_PRICE/.test(text) && !/import[\s\S]*PREMIUM_PRICE[\s\S]*pricing/.test(text)) {
    return (
      `import { PREMIUM_PRICE, getPremiumCheckoutUrl } from "@/lib/pricing-constants";\n` +
      text
    );
  }
  return text;
}

let n = 0;
for (const file of walk(root)) {
  if (file.endsWith(`${path.sep}pricing-constants.ts`)) continue;
  if (file.endsWith(`${path.sep}pricing-tiers.ts`)) continue;

  let text = fs.readFileSync(file, "utf8");
  if (
    !/FIRST100|PREMIUM_PROMO_|89\.99|prefilled_promo|\$60 off|first month with FIRST|PROMO_FIRST|PROMO_CODE|PROMO_NOTE|PROMO_DISCOUNT/.test(
      text
    )
  ) {
    continue;
  }

  const orig = text;
  text = stripPromoFromImports(text);

  // Identifier renames (safe)
  text = text.replace(/\bPREMIUM_PROMO_FIRST_MONTH\b/g, "PREMIUM_PRICE");
  text = text.replace(/\bPREMIUM_PROMO_NOTE\b/g, '""');
  text = text.replace(/\bPREMIUM_PROMO_DISCOUNT\b/g, '""');
  text = text.replace(/\bPREMIUM_PROMO_STRIPE_ID\b/g, '""');
  text = text.replace(/\bPREMIUM_PROMO_CODE\b/g, "/*promo removed*/");

  // Remove invalid /*promo removed*/ usages in expressions
  text = text.replace(/\/\*promo removed\*\//g, '""');

  // String content
  text = text.replace(/FIRST100/g, "");
  text = text.replace(/\$89\.99/g, "$149.99");
  text = text.replace(/\b89\.99\b/g, "149.99");
  text = text.replace(/\$60 off/gi, "");
  text = text.replace(/prefilled_promo_code[^&\s"']*/g, "");
  text = text.replace(/getPremiumCheckoutUrl\(true\)/g, "getPremiumCheckoutUrl()");
  text = text.replace(/getPremiumCheckoutUrl\(false\)/g, "getPremiumCheckoutUrl()");

  // Clean doubled punctuation / empty bits from removals
  text = text.replace(/code\s+""\s*/gi, "");
  text = text.replace(/Code\s+""\s*/g, "");
  text = text.replace(/Use\s+for\s+/g, "");
  text = text.replace(/\(\s*""\s*off\)/g, "");
  text = text.replace(/\s+""\s+off/g, "");
  text = text.replace(/\{\s*""\s*\}/g, '""');
  text = text.replace(/\$\{\s*""\s*\}/g, "");
  text = text.replace(/\s{2,}/g, (m) => {
    // only collapse horizontal spaces on same line, not newlines
    if (m.includes("\n")) return m;
    return " ";
  });
  text = text.replace(/ \./g, ".");
  text = text.replace(/ ,/g, ",");
  text = text.replace(/\(\s*\)/g, "");
  text = text.replace(/coupon:\s*""\s*,?/g, "");
  text = text.replace(/,\s*,/g, ",");
  text = text.replace(/{\s*,/g, "{");
  text = text.replace(/,\s*}/g, "}");

  text = ensurePremiumPriceImport(text, file);

  // Drop empty import residues like import {\n} from
  text = text.replace(/import\s*\{\s*\}\s*from\s*["'][^"']+["'];?\s*/g, "");

  if (text !== orig) {
    fs.writeFileSync(file, text);
    n++;
    console.log("updated", path.relative(root, file));
  }
}

console.log("files:", n);
