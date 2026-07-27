const fs = require("fs");
const p =
  "C:/Users/jaspe/3D Objects/quicksilver-algo/src/lib/seo/promo-landing-pages.ts";
let t = fs.readFileSync(p, "utf8");

const reps = [
  [/code\s+for\s+off Premium/gi, "Premium"],
  [/Code\s+for\s+off Premium/gi, "Premium"],
  [/Code\s+for\s+\$\{PREMIUM_PRICE\}/g, "Premium at ${PREMIUM_PRICE}"],
  [/code\s+for\s+\$\{PREMIUM_PRICE\}/g, "Premium at ${PREMIUM_PRICE}"],
  [/Code\s+unlocks Premium/g, "Premium unlocks"],
  [
    /Code\s+saves\s+on your first Premium month \(\$\{PREMIUM_PRICE\}\)/g,
    "Premium is ${PREMIUM_PRICE}/mo",
  ],
  [/Code\s+=\s+off Premium/gi, "Premium"],
  [/code\s+=\s+off Premium/gi, "Premium"],
  [/Limited launch offer: code\s+for\s+off Premium/gi, "Premium"],
  [/off Premium —/g, "Premium —"],
  [/First month \$\{PREMIUM_PRICE\}/g, "${PREMIUM_PRICE}/mo"],
  [/\$\{PREMIUM_PRICE\} first month/g, "${PREMIUM_PRICE}/mo"],
  [/code\s+for\s+/gi, ""],
  [/Code\s+for\s+/g, ""],
  [/Code\s+is limited[^.]*\./g, ""],
  [/is limited to the first 100 traders[^.]*\./g, ""],
  [/Limited to the first 100 subscribers\./g, ""],
  [/ first month\./g, "/mo."],
  [/ your first month/g, ""],
  [/promo code\s+/gi, ""],
  [/  +/g, (m) => (m.includes("\n") ? m : " ")],
];

for (const [re, rep] of reps) t = t.replace(re, rep);
fs.writeFileSync(p, t);
console.log("done");
