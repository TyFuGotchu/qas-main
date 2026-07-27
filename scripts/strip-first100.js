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

const files = walk(root);
let n = 0;

for (const file of files) {
  if (file.endsWith("pricing-constants.ts")) continue;
  let text = fs.readFileSync(file, "utf8");
  const orig = text;

  text = text.replace(
    /Use code FIRST100 for \$60 off your first month \(first 100 users\)/g,
    "Premium is billed monthly at full price."
  );
  text = text.replace(
    /code FIRST100 for \$60 off your first month/g,
    "full Premium access"
  );
  text = text.replace(/FIRST100/g, "Premium");
  text = text.replace(/\$89\.99/g, "$149.99");
  text = text.replace(/([^0-9.])89\.99/g, "$1149.99"); // oops wrong - fix
  // fix the bad replace above - don't do 89.99 that way

  text = text.replace(/PREMIUM_PROMO_FIRST_MONTH/g, "PREMIUM_PRICE");
  text = text.replace(/PREMIUM_PROMO_DISCOUNT/g, '""');
  text = text.replace(
    /PREMIUM_PROMO_NOTE/g,
    "`Premium is ${PREMIUM_PRICE}/mo`"
  );
  text = text.replace(/PREMIUM_PROMO_CODE/g, '"Premium"');
  text = text.replace(/PREMIUM_PROMO_STRIPE_ID/g, '""');
  text = text.replace(/getPremiumCheckoutUrl\(true\)/g, "getPremiumCheckoutUrl()");
  text = text.replace(/getPremiumCheckoutUrl\(false\)/g, "getPremiumCheckoutUrl()");

  // Undo accidental 1149 if any
  text = text.replace(/\$1149\.99/g, "$149.99");

  if (text !== orig) {
    fs.writeFileSync(file, text);
    n++;
    console.log("updated", path.relative(root, file));
  }
}

console.log("files updated:", n);
