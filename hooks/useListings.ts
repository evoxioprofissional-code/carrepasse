"use client";

import { useCallback, useEffect, useState } from "react";
import { listingRepository } from "@/repositories/listingRepository";
import type { ListingPage, ListingQuery } from "@/types/listing";

interface UseListingsResult {
  /** Mantém a página anterior enquanto recarrega (evita "piscar"). */
  data: ListingPage | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

interface LoadedState {
  /** Consulta a que este resultado corresponde. */
  key: string;
  data: ListingPage | null;
  error: string | null;
}

/**
 * `initial` vem do servidor (página já pronta para o Google); o navegador
 * recarrega em seguida para mostrar os dados mais novos.
 */
export function useListings(query: ListingQuery, initial?: ListingPage): UseListingsResult {
  const [version, setVersion] = useState(0);
  const queryKey = JSON.stringify(query);
  const [loaded, setLoaded] = useState<LoadedState>(() =>
    initial ? { key: `${queryKey}#0`, data: initial, error: null } : { key: "", data: null, error: null },
  );
  const requestKey = `${queryKey}#${version}`;

  const reload = useCallback(() => setVersion((value) => value + 1), []);

  useEffect(() => listingRepository.subscribe(reload), [reload]);

  useEffect(() => {
    let cancelled = false;
    listingRepository
      .list(JSON.parse(queryKey) as ListingQuery)
      .then((page) => {
        if (!cancelled) setLoaded({ key: requestKey, data: page, error: null });
      })
      .catch(() => {
        if (!cancelled) {
          setLoaded((previous) => ({
            key: requestKey,
            data: previous.data,
            error: "Não foi possível carregar os anúncios.",
          }));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [queryKey, requestKey]);

  const isCurrent = loaded.key === requestKey;
  return {
    data: loaded.data,
    loading: !isCurrent,
    error: isCurrent ? loaded.error : null,
    reload,
  };
}
