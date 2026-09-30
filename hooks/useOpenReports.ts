"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { reportRepository } from "@/repositories/reportRepository";
import { subscribeToData } from "@/repositories/events";

/** Denúncias abertas (só para administradores; para os demais é sempre 0). */
export function useOpenReports(): number {
  const { state } = useAuth();
  const isAdmin = state.status === "authenticated" && state.isAdmin;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    const load = () =>
      reportRepository
        .countOpen()
        .then((value) => !cancelled && setCount(value))
        .catch(() => {});
    load();
    const unsubscribe = subscribeToData("reports", load);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [isAdmin]);

  return isAdmin ? count : 0;
}
