"use client";

import { useEffect, useState } from "react";
import { listingRepository, type FilterOptions } from "@/repositories/listingRepository";

export function useFilterOptions(): FilterOptions | null {
  const [options, setOptions] = useState<FilterOptions | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      listingRepository
        .getFilterOptions()
        .then((result) => {
          if (!cancelled) setOptions(result);
        })
        .catch(() => {
          // Sem as opções, os filtros ficam só com as listas fixas; a busca continua funcionando.
        });
    load();
    const unsubscribe = listingRepository.subscribe(load);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return options;
}
