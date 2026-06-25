export interface ParsedJournalRow {
  symbol: string;
  direction: "long" | "short";
  entryTime: Date;
  exitTime: Date | null;
  pnl: number | null;
  rMultiple: number | null;
  session: string | null;
  setupType: string | null;
  notes: string | null;
}

export interface CsvParseResult {
  rows: ParsedJournalRow[];
  errors: string[];
  skipped: number;
}

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function parseDirection(value: string): "long" | "short" | null {
  const v = value.trim().toLowerCase();
  if (["long", "buy", "l"].includes(v)) return "long";
  if (["short", "sell", "s"].includes(v)) return "short";
  return null;
}

function parseDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const d = new Date(trimmed);
  return Number.isNaN(d.getTime()) ? null : d;
}

function parseNumber(value: string): number | null {
  const trimmed = value.trim().replace(/[$,]/g, "");
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

const HEADER_ALIASES: Record<string, string> = {
  symbol: "symbol",
  ticker: "symbol",
  pair: "symbol",
  instrument: "symbol",
  direction: "direction",
  side: "direction",
  type: "direction",
  entrytime: "entrytime",
  entrydate: "entrytime",
  opentime: "entrytime",
  entry: "entrytime",
  exittime: "exittime",
  closedate: "exittime",
  closetime: "exittime",
  exit: "exittime",
  pnl: "pnl",
  profit: "pnl",
  pl: "pnl",
  profitloss: "pnl",
  rmultiple: "rmultiple",
  r: "rmultiple",
  rmult: "rmultiple",
  session: "session",
  setup: "setuptype",
  setuptype: "setuptype",
  strategy: "setuptype",
  notes: "notes",
  comment: "notes",
};

export function parseJournalCsv(text: string): CsvParseResult {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return { rows: [], errors: ["CSV must include a header row and data"], skipped: 0 };
  }

  const headerCells = lines[0]!.split(",").map(normalizeHeader);
  const columnIndex: Record<string, number> = {};
  headerCells.forEach((h, i) => {
    const key = HEADER_ALIASES[h];
    if (key && columnIndex[key] === undefined) {
      columnIndex[key] = i;
    }
  });

  if (columnIndex.symbol === undefined || columnIndex.direction === undefined) {
    return {
      rows: [],
      errors: ["CSV must include symbol and direction columns"],
      skipped: 0,
    };
  }

  const rows: ParsedJournalRow[] = [];
  const errors: string[] = [];
  let skipped = 0;

  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i]!.split(",").map((c) => c.trim());
    const symbol = cells[columnIndex.symbol!];
    const directionRaw = cells[columnIndex.direction!];

    if (!symbol || !directionRaw) {
      skipped++;
      continue;
    }

    const direction = parseDirection(directionRaw);
    if (!direction) {
      errors.push(`Row ${i + 1}: invalid direction "${directionRaw}"`);
      skipped++;
      continue;
    }

    const entryIdx = columnIndex.entrytime;
    const entryTime =
      entryIdx !== undefined ? parseDate(cells[entryIdx] ?? "") : null;
    if (!entryTime) {
      errors.push(`Row ${i + 1}: missing or invalid entry time`);
      skipped++;
      continue;
    }

    const exitIdx = columnIndex.exittime;
    const exitTime =
      exitIdx !== undefined ? parseDate(cells[exitIdx] ?? "") : null;

    const pnlIdx = columnIndex.pnl;
    const pnl =
      pnlIdx !== undefined ? parseNumber(cells[pnlIdx] ?? "") : null;

    const rIdx = columnIndex.rmultiple;
    const rMultiple =
      rIdx !== undefined ? parseNumber(cells[rIdx] ?? "") : null;

    const sessionIdx = columnIndex.session;
    const session =
      sessionIdx !== undefined ? cells[sessionIdx]?.trim() || null : null;

    const setupIdx = columnIndex.setuptype;
    const setupType =
      setupIdx !== undefined ? cells[setupIdx]?.trim() || null : null;

    const notesIdx = columnIndex.notes;
    const notes =
      notesIdx !== undefined ? cells[notesIdx]?.trim() || null : null;

    rows.push({
      symbol,
      direction,
      entryTime,
      exitTime,
      pnl,
      rMultiple,
      session,
      setupType,
      notes,
    });
  }

  return { rows, errors, skipped };
}