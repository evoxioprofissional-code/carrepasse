"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { ListingCard } from "@/components/listing/ListingCard";
import { ListingCardSkeleton } from "@/components/listing/ListingCardSkeleton";
import { Alert } from "@/components/ui/Alert";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EmptyState } from "@/components/ui/EmptyState";
import { useFavorites } from "@/hooks/useFavorites";
import { listingRepository } from "@/repositories/listingRepository";
import type { ListingWithSeller } from "@/types/listing";

export function FavoritesList() {
  const { ids } = useFavorites();
  const idsKey = ids.join(",");
  const [loaded, setLoaded] = useState<{ key: string; items: ListingWithSeller[]; error: boolean } | null>(null);

  useEffect(() => {
    let cancelled = false;
    listingRepository
      .getByIds(idsKey ? idsKey.split(",") : [])
      .then((items) => {
        if (!cancelled) setLoaded({ key: idsKey, items, error: false });
      })
      .catch(() => {
        if (!cancelled) setLoaded({ key: idsKey, items: [], error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [idsKey]);

  // Ao desfavoritar, o card some na hora (sem esperar a nova consulta).
  const items = (loaded?.items ?? []).filter((item) => ids.includes(item.id));

  if (!loaded) {
    return (
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <li key={index}>
            <ListingCardSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (loaded.error) return <Alert variant="danger">Não foi possível carregar seus favoritos. Recarregue a página.</Alert>;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Heart aria-hidden />}
        title="Você ainda não favoritou nenhum carro"
        description="Toque no coração dos anúncios para acompanhar aqui."
        action={<ButtonLink href="/carros">Ver carros à venda</ButtonLink>}
      />
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((listing) => (
        <li key={listing.id} className="flex">
          <ListingCard listing={listing} className="w-full" />
        </li>
      ))}
    </ul>
  );
}
