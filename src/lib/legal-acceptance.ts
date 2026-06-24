export const LEGAL_ACCEPTANCE_STORAGE_KEY = "quicksilver_legal_accepted";

export interface LegalAcceptanceRecord {
  accepted: boolean;
  timestamp: number;
}

export function getLegalAcceptance(): LegalAcceptanceRecord | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(LEGAL_ACCEPTANCE_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as LegalAcceptanceRecord;
    if (parsed?.accepted === true && typeof parsed.timestamp === "number") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function hasLegalAcceptance(): boolean {
  return getLegalAcceptance()?.accepted === true;
}

export function saveLegalAcceptance(): LegalAcceptanceRecord {
  const record: LegalAcceptanceRecord = {
    accepted: true,
    timestamp: Date.now(),
  };

  localStorage.setItem(LEGAL_ACCEPTANCE_STORAGE_KEY, JSON.stringify(record));
  return record;
}