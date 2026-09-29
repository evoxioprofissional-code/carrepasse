"use client";

import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "@/components/auth/AuthProvider";

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro do <AuthProvider>.");
  return context;
}
