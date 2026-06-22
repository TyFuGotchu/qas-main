import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env");
const env = fs.readFileSync(envPath, "utf8");
for (const line of env.split(/\r?\n/)) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
}

const { fetchQuotes, fetchCandlesForSymbols } = await import(
  "../src/lib/market-data/provider.ts"
);

console.log("Fetching quotes...");
const quotes = await fetchQuotes();
for (const q of quotes) {
  console.log(`  ${q.symbol}: ${q.price} (${q.changePercent}%)`);
}

console.log("\nFetching candles (sequential)...");
const candles = await fetchCandlesForSymbols(
  ["XAUUSD", "XAGUSD", "NAS100", "US30", "BTCUSD"],
  10,
  "5min"
);

for (const sym of ["XAUUSD", "XAGUSD", "NAS100", "US30", "BTCUSD"]) {
  const arr = candles[sym];
  const last = arr?.at(-1);
  const quote = quotes.find((q) => q.symbol === sym);
  const diff = last && quote ? Math.abs(last.close - quote.price) / quote.price : 0;
  console.log(
    `  ${sym}: ${arr?.length ?? 0} candles, close=${last?.close}, quote=${quote?.price}, drift=${(diff * 100).toFixed(2)}%`
  );
}