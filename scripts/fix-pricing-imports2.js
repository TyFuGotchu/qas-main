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

let n = 0;
for (const file of walk(root)) {
  let text = fs.readFileSync(file, "utf8");
  const orig = text;

  text = text.replace(
    /import\s*\{([^}]*)\}\s*from\s*(["']@\/lib\/pricing-(?:constants|tiers)["'])\s*;?/gs,
    (_full, body, from) => {
      const names = body
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((s) => ALLOWED.has(s));
      const uniq = [...new Set(names)];
      if (!uniq.length) return "";
      return `import {\n  ${uniq.join(",\n  ")},\n} from ${from};`;
    }
  );

  // Clean awkward leftover promo phrases
  text = text.replace(/Use code Premium for /g, "");
  text = text.replace(/Checkout with code Premium for /g, "Checkout for ");
  text = text.replace(/enter code Premium at Stripe checkout, and /gi, "");
  text = text.replace(/Code Premium drops monthly to \$\{PREMIUM_PRICE\} \(\$\{""\} off\)\. /g, "");
  text = text.replace(/Code Premium drops monthly to \$\{PREMIUM_PRICE\} \(\s*""\s*off\)\. /g, "");
  text = text.replace(/\$\{`Premium is \$\{PREMIUM_PRICE\}\/mo`\}/g, "");
  text = text.replace(/`Premium is \$\{PREMIUM_PRICE\}\/mo`/g, "`Premium is ${PREMIUM_PRICE}/mo`");
  text = text.replace(/Unlock Premium Quant — "Premium"/g, "Unlock Premium Quant");
  text = text.replace(/Go Premium — Premium →/g, "Go Premium →");
  text = text.replace(/Start challenge — Premium →/g, "Start challenge →");
  text = text.replace(/ · "Premium" — /g, " · ");
  text = text.replace(/\{PREMIUM_PRICE\} Premium/g, "{PREMIUM_PRICE}/mo");
  text = text.replace(/\$\{PREMIUM_PRICE\} Premium/g, "${PREMIUM_PRICE}/mo");
  text = text.replace(/takes \$\{""\} off monthly of /g, "is ");
  text = text.replace(/ \(\$\{""\} off\)/g, "");
  text = text.replace(/Code \*\*Premium\*\* → /g, "");
  text = text.replace(/Premium = \$\{PREMIUM_PRICE\}\/mo/g, "${PREMIUM_PRICE}/mo");
  text = text.replace(/Limited to the all subscribers/g, "Available to all subscribers");
  text = text.replace(/limited to the all subscribers/g, "available to all subscribers");
  text = text.replace(/first-month discount is nearly gone/g, "upgrade anytime");
  text = text.replace(/promoCode:\s*"Premium"/g, 'promoCode: ""');
  text = text.replace(/Badge variant="success">Code \{"Premium"\}/g, 'Badge variant="success">Premium');
  text = text.replace(/Code Premium /g, "Premium ");
  text = text.replace(/code Premium /g, "Premium ");

  // Double spaces / empty template junk
  text = text.replace(/  +/g, " ");
  text = text.replace(/\n\s*\n\s*\n/g, "\n\n");

  if (text !== orig) {
    fs.writeFileSync(file, text);
    n++;
    console.log("fixed", path.relative(root, file));
  }
}
console.log("count", n);
