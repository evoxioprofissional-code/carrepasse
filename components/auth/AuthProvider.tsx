"use client";

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { authRepository } from "@/repositories/authRepository";
import { favoriteRepository } from "@/repositories/favoriteRepository";
import { userRepository } from "@/repositories/userRepository";
import type { User } from "@/types/user";

export type AuthState =
  | { status: "loading"; user: null }
  | { status: "anonymous"; user: null }
  | { status: "authenticated"; user: User; isAdmin: boolean };

export interface AuthContextValue {
  state: AuthState;
  /** Recarrega o perfil depois de uma edição. */
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

/** Sessão real (Supabase Auth) + perfil do banco, disponível para o app inteiro. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading", user: null });

  const load = useCallback(async () => {
    const authUser = await authRepository.getCurrentUser();
    void favoriteRepository.setUser(authUser?.id ?? null);
    if (!authUser) {
      setState({ status: "anonymous", user: null });
      return;
    }
    const [profile, isAdmin] = await Promise.all([
      userRepository.getById(authUser.id).catch(() => null),
      userRepository.isAdmin(),
    ]);
    setState(
      profile
        ? { status: "authenticated", user: { ...profile, email: authUser.email }, isAdmin }
        : { status: "anonymous", user: null },
    );
  }, []);

  // A inscrição dispara INITIAL_SESSION logo de cara: serve de carga inicial.
  useEffect(() => authRepository.onChange(() => void load()), [load]);

  const signOut = useCallback(async () => {
    await authRepository.signOut();
    await load();
  }, [load]);

  const value = useMemo(() => ({ state, refresh: load, signOut }), [state, load, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
