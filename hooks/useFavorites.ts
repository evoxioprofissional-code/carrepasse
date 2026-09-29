"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { favoriteRepository } from "@/repositories/favoriteRepository";

const getServerSnapshot = () => "";

export function useFavorites() {
  const snapshot = useSyncExternalStore(
    favoriteRepository.subscribe,
    favoriteRepository.getSnapshot,
    getServerSnapshot,
  );
  const ids = useMemo(() => (snapshot ? snapshot.split(",") : []), [snapshot]);

  const isFavorite = useCallback((listingId: string) => ids.includes(listingId), [ids]);
  const toggle = useCallback((listingId: string) => {
    void favoriteRepository.toggle(listingId).catch(() => {
      // O coração já voltou ao estado anterior; nada a fazer além disso.
    });
  }, []);

  return { ids, isFavorite, toggle };
}
