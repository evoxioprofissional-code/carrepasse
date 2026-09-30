"use client";

import { useMemo } from "react";
import { useListings } from "@/hooks/useListings";
import { mainPrice } from "@/lib/fipe-math";
import type { Listing } from "@/types/listing";
import { VehicleCard } from "./VehicleCard";
import { VehicleCardSkeleton } from "./VehicleCardSkeleton";

interface SimilarListingsProps {
  listing: Listing;
}

/** Mesmo modelo > mesma marca > mesma faixa de preço (±20%). */
export function SimilarListings({ listing }: SimilarListingsProps) {
  const price = mainPrice(listing);
  // Duas buscas pequenas (mesma marca e mesma faixa de preço) em vez de baixar tudo.
  const sameBrand = useListings({ brand: listing.brand, limit: 12 });
  const samePrice = useListings({ priceMin: Math.floor(price * 0.8), priceMax: Math.ceil(price * 1.2), limit: 12 });
  const loading = sameBrand.loading || samePrice.loading;

  const similar = useMemo(() => {
    const candidates = new Map(
      [...(sameBrand.data?.items ?? []), ...(samePrice.data?.items ?? [])].map((item) => [item.id, item]),
    );
    candidates.delete(listing.id);
    return [...candidates.values()]
      .map((item) => {
        const priceGap = price > 0 ? Math.abs(mainPrice(item) - price) / price : 1;
        const score =
          (item.model === listing.model ? 4 : 0) +
          (item.brand === listing.brand ? 2 : 0) +
          (item.bodyType === listing.bodyType ? 1 : 0) +
          (priceGap <= 0.2 ? 2 : 0);
        return { item, score, priceGap };
      })
      .filter(({ score }) => score >= 2)
      .sort((a, b) => b.score - a.score || a.priceGap - b.priceGap)
      .slice(0, 4)
      .map(({ item }) => item);
  }, [sameBrand.data, samePrice.data, listing, price]);

  if (!loading && similar.length === 0) return null;

  return (
    <section aria-labelledby="similar-title" className="flex flex-col gap-5">
      <h2 id="similar-title" className="text-2xl text-chrome">
        Anúncios semelhantes
      </h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading && similar.length === 0
          ? Array.from({ length: 4 }, (_, index) => (
              <li key={index}>
                <VehicleCardSkeleton />
              </li>
            ))
          : similar.map((item) => (
              <li key={item.id} className="flex">
                <VehicleCard listing={item} className="w-full" />
              </li>
            ))}
      </ul>
    </section>
  );
}
