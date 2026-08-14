/**
 * Generates the $29 7-Day Challenge Kit PDF.
 * Run: node scripts/generate-challenge-kit.mjs
 */
import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(
  __dirname,
  "..",
  "public",
  "products",
  "qs-7-day-challenge-kit.pdf"
);

const ink = rgb(0.08, 0.09, 0.12);
const muted = rgb(0.35, 0.4, 0.48);
const cyan = rgb(0.05, 0.62, 0.72);
const paper = rgb(0.98, 0.98, 0.97);
const line = rgb(0.82, 0.86, 0.88);

const days = [
  {
    d: 1,
    title: "Foundation & First Strike",
    cap: "+1.5%",
    risk: "0.75% / trade",
    max: "2 trades",
    tasks: [
      "Mark HTF bias, liquidity, and session open on one market (XAUUSD or NAS100).",
      "Only A+ setups. Stop the session at +1.5% even if more setups appear.",
      "Screenshot plan (bias, invalidation, R:R) before you click.",
    ],
  },
  {
    d: 2,
    title: "Controlled Build",
    cap: "+1.4%",
    risk: "0.75% / trade",
    max: "2 trades",
    tasks: [
      "One lesson from yesterday's journal (timing or stop).",
      "If day 1 was a full cap day, size down ~10%.",
      "Recalc consistency: best day  / total profit. Start managing the 20% rule.",
    ],
  },
  {
    d: 3,
    title: "Midweek Balance",
    cap: "+1.3%",
    risk: "0.50% / trade",
    max: "2 trades",
    tasks: [
      "Only trade if session bias matches your plan.",
      "No hero trades. Even distribution beats one spike.",
      "Two losses in a row = session over.",
    ],
  },
  {
    d: 4,
    title: "Protect the Curve",
    cap: "+1.2%",
    risk: "0.50% / trade",
    max: "2 trades",
    tasks: [
      "If consistency is tight, take smaller wins and stop early.",
      "Skip the session if the book is messy  - skipping is a valid day.",
      "Log every scratch. Process > P&L today.",
    ],
  },
  {
    d: 5,
    title: "Selective Pressure",
    cap: "+1.2%",
    risk: "0.50% / trade",
    max: "2 trades",
    tasks: [
      "One market only. No revenge after a red open.",
      "If already near target pace, protect daily loss first.",
      "Audit: are you trading the plan or boredom?",
    ],
  },
  {
    d: 6,
    title: "Finish Approach",
    cap: "+1.1%",
    risk: "0.40% / trade",
    max: "2 trades",
    tasks: [
      "Do not need a hero day to finish. Spread the last 1–2%.",
      "If best day is already large, you cannot add a bigger green day.",
      "Prep tomorrow's ‘no new risk if target hit' rule.",
    ],
  },
  {
    d: 7,
    title: "Close Clean",
    cap: "Fill the gap only",
    risk: "0.40% / trade",
    max: "1–2 trades",
    tasks: [
      "If target is hit, stop. Do not give it back.",
      "If short, take only A+ to close the gap  - never all-in.",
      "Export journal. Review consistency math before you submit.",
    ],
  },
];

function ascii(s) {
  return String(s)
    .replace(/[–—]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[≤]/g, "<=")
    .replace(/[≥]/g, ">=")
    .replace(/[×]/g, "x")
    .replace(/[÷]/g, "/")
    .replace(/[→]/g, "->")
    .replace(/[·]/g, "|")
    .replace(/[≈]/g, "~");
}

function wrap(text, font, size, maxW) {
  const words = ascii(text).split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (font.widthOfTextAtSize(test, size) <= maxW) cur = test;
    else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

async function main() {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const W = 612;
  const H = 792;
  const M = 48;

  function page() {
    const p = pdf.addPage([W, H]);
    p.drawRectangle({ x: 0, y: 0, width: W, height: H, color: paper });
    return p;
  }

  function footer(p, n) {
    p.drawLine({
      start: { x: M, y: 36 },
      end: { x: W - M, y: 36 },
      thickness: 0.5,
      color: line,
    });
    p.drawText("Quicksilver Algo Systems   |  Educational only  - not financial advice", {
      x: M,
      y: 22,
      size: 8,
      font,
      color: muted,
    });
    p.drawText(String(n), {
      x: W - M - 12,
      y: 22,
      size: 8,
      font,
      color: muted,
    });
  }

  // Cover
  {
    const p = page();
    p.drawRectangle({ x: 0, y: H - 8, width: W, height: 8, color: cyan });
    p.drawText("QUICKSILVER ALGO SYSTEMS", {
      x: M,
      y: H - 72,
      size: 11,
      font: bold,
      color: cyan,
    });
    p.drawText("7-DAY PROP FIRM", {
      x: M,
      y: H - 160,
      size: 28,
      font: bold,
      color: ink,
    });
    p.drawText("CHALLENGE KIT", {
      x: M,
      y: H - 196,
      size: 28,
      font: bold,
      color: ink,
    });
    p.drawText("$29 companion   |  Printable tracker + daily caps", {
      x: M,
      y: H - 230,
      size: 12,
      font,
      color: muted,
    });
    const blurb = [
      "A one-week execution sheet for funded-account evaluations.",
      "Daily profit caps, consistency math, red-day rules, and a fill-in tracker.",
      "Use it standalone, or upgrade to Premium Quant for the live dashboard",
      "tracker, planning engines, academy, and Quant Protocol on TradeLocker Desktop.",
    ];
    let y = H - 300;
    for (const line of blurb) {
      p.drawText(ascii(line), { x: M, y, size: 11, font, color: ink });
      y -= 18;
    }
    p.drawText("TyFuGotchu   |  Founder", {
      x: M,
      y: 80,
      size: 11,
      font: bold,
      color: ink,
    });
    p.drawText("quicksilveralgo.com", {
      x: M,
      y: 62,
      size: 10,
      font,
      color: cyan,
    });
    footer(p, 1);
  }

  // Rules
  {
    const p = page();
    p.drawText("THE RULES THAT ACTUALLY FAIL ACCOUNTS", {
      x: M,
      y: H - 64,
      size: 14,
      font: bold,
      color: ink,
    });
    const rules = [
      "Consistency: best profitable day / total profit must stay at or under ~20% on most firms. One hero day fails the challenge.",
      "Daily loss: treat 5% as a hard stop unless your firm is stricter. Two losses in a row ends the session.",
      "Risk per trade: 0.4–1.0% of account. Never size for boredom.",
      "Profit caps: bank the day at the cap. Leaving winners on the table is how you stay consistent.",
      "One market, one plan. Switching instruments mid-session is usually tilt.",
      "This kit assumes a typical 8–10% target. Always verify YOUR firm's live rules before you trade.",
      "No strategy guarantees a pass. This is process, not a promise.",
    ];
    let y = H - 100;
    for (const r of rules) {
      const lines = wrap("•  " + r, font, 11, W - 2 * M);
      for (const ln of lines) {
        p.drawText(ln, { x: M, y, size: 11, font, color: ink });
        y -= 16;
      }
      y -= 8;
    }
    p.drawText("Quick math (8% in 7 sessions)", {
      x: M,
      y: y - 8,
      size: 12,
      font: bold,
      color: cyan,
    });
    y -= 32;
    const math = [
      "Average needed ~ 1.15%/day if every day is green (it won't be).",
      "Plan caps of ~1.1–1.5% so no single day becomes 20%+ of the total.",
      "Example fail: +4% day 1 then grind +4% more → best day is 50% of profit. Failed.",
    ];
    for (const r of math) {
      const lines = wrap(r, font, 11, W - 2 * M);
      for (const ln of lines) {
        p.drawText(ln, { x: M, y, size: 11, font, color: ink });
        y -= 16;
      }
      y -= 6;
    }
    footer(p, 2);
  }

  // Daily pages (2 days per page-ish)  - one page per 2 days
  let pageNum = 3;
  for (let i = 0; i < days.length; i += 2) {
    const p = page();
    let y = H - 64;
    p.drawText("DAILY EXECUTION", {
      x: M,
      y,
      size: 14,
      font: bold,
      color: ink,
    });
    y -= 28;
    for (const day of [days[i], days[i + 1]].filter(Boolean)) {
      p.drawText(`DAY ${day.d}   -  ${day.title}`, {
        x: M,
        y,
        size: 12,
        font: bold,
        color: cyan,
      });
      y -= 18;
      p.drawText(`Cap ${day.cap}    |   Risk ${day.risk}    |   ${day.max}`, {
        x: M,
        y,
        size: 10,
        font: bold,
        color: ink,
      });
      y -= 18;
      for (const t of day.tasks) {
        const lines = wrap("•  " + t, font, 10, W - 2 * M);
        for (const ln of lines) {
          p.drawText(ln, { x: M, y, size: 10, font, color: ink });
          y -= 14;
        }
        y -= 4;
      }
      p.drawText("P&L today: ________     Running total: ________     Best day: ________", {
        x: M,
        y,
        size: 10,
        font,
        color: muted,
      });
      y -= 16;
      p.drawText("Consistency % (best  / total): ________     Session end reason: ________________", {
        x: M,
        y,
        size: 10,
        font,
        color: muted,
      });
      y -= 32;
    }
    footer(p, pageNum++);
  }

  // Tracker grid
  {
    const p = page();
    p.drawText("7-DAY TRACKER (PRINT THIS)", {
      x: M,
      y: H - 64,
      size: 14,
      font: bold,
      color: ink,
    });
    const headers = ["Day", "Cap", "P&L %", "Trades", "Best?", "Notes"];
    const colW = [40, 70, 70, 70, 70, 196];
    let x = M;
    let y = H - 100;
    headers.forEach((h, i) => {
      p.drawText(h, { x, y, size: 9, font: bold, color: muted });
      x += colW[i];
    });
    y -= 8;
    p.drawLine({
      start: { x: M, y },
      end: { x: W - M, y },
      thickness: 1,
      color: cyan,
    });
    y -= 22;
    for (let d = 1; d <= 7; d++) {
      p.drawText(String(d), { x: M, y, size: 11, font: bold, color: ink });
      p.drawLine({
        start: { x: M, y: y - 10 },
        end: { x: W - M, y: y - 10 },
        thickness: 0.4,
        color: line,
      });
      y -= 36;
    }
    y -= 12;
    p.drawText("End-of-week audit", {
      x: M,
      y,
      size: 12,
      font: bold,
      color: cyan,
    });
    y -= 22;
    const audit = [
      "Total profit %: ________     Best single day %: ________",
      "Consistency (best  / total  x 100): ________  (must be <= your firm's rule)",
      "Daily loss breaches: ________     Plan followed?  Y / N",
      "If not passed: what broke  - sizing, tilt, hero day, or no setups?",
    ];
    for (const a of audit) {
      p.drawText(ascii(a), { x: M, y, size: 10, font, color: ink });
      y -= 18;
    }
    footer(p, pageNum++);
  }

  // Next step Premium
  {
    const p = page();
    p.drawText("WHEN YOU WANT THE FULL STACK", {
      x: M,
      y: H - 64,
      size: 14,
      font: bold,
      color: ink,
    });
    const next = [
      "This kit is the paper system. Premium Quant ($149.99/mo) unlocks:",
      "• Interactive 7-day tracker in the dashboard + day-complete emails",
      "• Planning engines (risk, survival sims, confluence, more)",
      "• Chart Academy + live terminal tools",
      "• 1-on-1 guidance",
      "• Quant Protocol on TradeLocker Desktop (not web)",
      "",
      "Start: quicksilveralgo.com/quant-protocol",
      "Checkout: quicksilveralgo.com (Premium Quant)",
      "",
      "Need a broker or prop that allows bots and manual?",
      "Tell us bots vs manual first, then: Risen FX, HeroFX, FunderPro.",
      "",
      "Questions: supportteam@quicksilveralgo.com",
      "Founder: TyFuGotchu   |  x.com/tyfugotchu",
    ];
    let y = H - 100;
    for (const line of next) {
      p.drawText(ascii(line || " "), { x: M, y, size: 11, font, color: ink });
      y -= 18;
    }
    footer(p, pageNum);
  }

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, await pdf.save());
  console.log("Wrote", outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
