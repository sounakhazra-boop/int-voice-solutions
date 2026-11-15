"use client";

import { useEffect } from "react";
import type { Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import type { ReactNode } from "react";
import {
  PERMISSIONS_EXPIRY_STORAGE_KEY,
  PERMISSIONS_STORAGE_KEY,
} from "@/lib/permissions";

type AuthProviderProps = {
  children: ReactNode;
  session?: Session | null;
};

export function AuthProvider({ children, session }: AuthProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

export function useAuth() {
  const { data: session, status, update } = useSession();
  const permissions = session?.user?.permissions;

  useEffect(() => {
    if (status === "authenticated" && session?.expires && permissions) {
      localStorage.setItem(
        PERMISSIONS_STORAGE_KEY,
        JSON.stringify(permissions),
      );
      localStorage.setItem(
        PERMISSIONS_EXPIRY_STORAGE_KEY,
        String(new Date(session.expires).getTime()),
      );
    }

    if (status === "unauthenticated") {
      localStorage.removeItem(PERMISSIONS_STORAGE_KEY);
      localStorage.removeItem(PERMISSIONS_EXPIRY_STORAGE_KEY);
    }
  }, [permissions, session?.expires, status]);

  return {
    session,
    user: session?.user ?? null,
    token: session?.user?.token ?? null,
    permissions: permissions ?? [],
    hasPermission: (cardId: string) =>
      permissions?.some((permission) => permission[cardId] === true) ?? false,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    update,
  };
}
