"use client";

import { useMemo } from "react";
import { useListings } from "@/hooks/useListings";
import { mainPrice } from "@/lib/fipe-math";
import type { Listing } from "@/types/listing";
import { ListingCard } from "./ListingCard";
import { ListingCardSkeleton } from "./ListingCardSkeleton";

interface SimilarListingsProps {
  listing: Listing;
}

/** Mesmo modelo > mesma marca > mesma faixa de preço (±20%). */
export function SimilarListings({ listing }: SimilarListingsProps) {
  const { data, loading } = useListings({ limit: 100 });

  const similar = useMemo(() => {
    const price = mainPrice(listing);
    return (data?.items ?? [])
      .filter((item) => item.id !== listing.id)
      .map((item) => {
        const priceGap = Math.abs(mainPrice(item) - price) / price;
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
  }, [data, listing]);

  if (!loading && similar.length === 0) return null;

  return (
    <section aria-labelledby="similar-title" className="flex flex-col gap-5">
      <h2 id="similar-title" className="text-2xl text-chrome">
        Anúncios semelhantes
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading && similar.length === 0
          ? Array.from({ length: 4 }, (_, index) => (
              <li key={index}>
                <ListingCardSkeleton />
              </li>
            ))
          : similar.map((item) => (
              <li key={item.id} className="flex">
                <ListingCard listing={item} className="w-full" />
              </li>
            ))}
      </ul>
    </section>
  );
}
