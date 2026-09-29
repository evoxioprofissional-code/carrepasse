"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { favoriteRepository } from "@/repositories/favoriteRepository";

// O snapshot é uma string para o React comparar por valor (um array novo
// a cada leitura faria o componente renderizar em loop).
const getSnapshot = () => favoriteRepository.listIds().join(",");
const getServerSnapshot = () => "";

export function useFavorites() {
  const snapshot = useSyncExternalStore(favoriteRepository.subscribe, getSnapshot, getServerSnapshot);
  const ids = useMemo(() => (snapshot ? snapshot.split(",") : []), [snapshot]);

  const isFavorite = useCallback((listingId: string) => ids.includes(listingId), [ids]);
  const toggle = useCallback((listingId: string) => favoriteRepository.toggle(listingId), []);

  return { ids, isFavorite, toggle };
}
