"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { type UserSession } from "@/types";

interface SessionContextValue {
  user: UserSession | null;
  setUser: (user: UserSession | null) => void;
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: UserSession | null;
}) {
  const [user, setUser] = useState<UserSession | null>(initialUser);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  return (
    <SessionContext.Provider value={{ user, setUser, refreshSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return context;
}