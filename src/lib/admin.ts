import type { UserSession } from "@/types";

export function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL ?? "admin@quicksilver.demo";
}

export function isAdminUser(user: Pick<UserSession, "email" | "isAdmin">): boolean {
  return user.isAdmin || user.email === getAdminEmail();
}