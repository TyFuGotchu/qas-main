import type { TradeLockerAccount } from "@/lib/tradelocker/types";

export const SELECTED_ACCOUNT_STORAGE_KEY = "qs-tl-selected-account";

const STORAGE_KEY = SELECTED_ACCOUNT_STORAGE_KEY;

export const SELECTED_ACCOUNT_CHANGED_EVENT = "qs-tl-account-changed";

export interface SelectedTradeLockerAccount {
  accountId: string;
  accNum: string;
}

export function readSelectedTradeLockerAccount(): SelectedTradeLockerAccount | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SelectedTradeLockerAccount>;
    if (
      typeof parsed.accountId === "string" &&
      typeof parsed.accNum === "string" &&
      parsed.accountId &&
      parsed.accNum
    ) {
      return { accountId: parsed.accountId, accNum: parsed.accNum };
    }
  } catch {
    // ignore corrupt storage
  }
  return null;
}

export function writeSelectedTradeLockerAccount(
  account: SelectedTradeLockerAccount
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    window.dispatchEvent(new CustomEvent(SELECTED_ACCOUNT_CHANGED_EVENT));
  } catch {
    // storage full or blocked
  }
}

export function clearSelectedTradeLockerAccount(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(SELECTED_ACCOUNT_CHANGED_EVENT));
  } catch {
    // ignore
  }
}

export function resolveTradeLockerAccount(
  accounts: TradeLockerAccount[],
  preferred?: SelectedTradeLockerAccount | null
): TradeLockerAccount | null {
  if (accounts.length === 0) return null;

  const saved = preferred ?? readSelectedTradeLockerAccount();
  if (saved) {
    const match = accounts.find(
      (account) =>
        account.accountId === saved.accountId &&
        account.accNum === saved.accNum
    );
    if (match) return match;
  }

  return accounts[0] ?? null;
}

export function formatTradeLockerAccountLabel(
  account: TradeLockerAccount
): string {
  const parts = [`#${account.accountId}`];
  if (account.currency) parts.push(account.currency);
  if (account.name) parts.push(account.name);
  return parts.join(" · ");
}