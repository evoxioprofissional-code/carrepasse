"use client";

import { useEffect, useRef, useState } from "react";
import { listingRepository } from "@/repositories/listingRepository";
import type { ListingWithSeller } from "@/types/listing";

type State =
  | { status: "loading" }
  | { status: "ready"; listing: ListingWithSeller }
  | { status: "not-found" }
  | { status: "error" };

interface Loaded {
  id: string;
  state: State;
}

/** Carrega um anúncio e conta uma visualização por abertura da página. */
export function useListing(id: string): State {
  const [loaded, setLoaded] = useState<Loaded>({ id: "", state: { status: "loading" } });
  const countedRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      listingRepository
        .getById(id)
        .then((listing) => {
          if (cancelled) return;
          setLoaded({ id, state: listing ? { status: "ready", listing } : { status: "not-found" } });
        })
        .catch(() => {
          if (!cancelled) setLoaded({ id, state: { status: "error" } });
        });

    load();
    const unsubscribe = listingRepository.subscribe(() => void load());
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [id]);

  useEffect(() => {
    // Ref evita contar duas vezes no StrictMode (efeito roda 2x em dev).
    if (countedRef.current === id) return;
    countedRef.current = id;
    void listingRepository.incrementViews(id);
  }, [id]);

  return loaded.id === id ? loaded.state : { status: "loading" };
}
