"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { ListingCard } from "@/components/listing/ListingCard";
import { ListingCardSkeleton } from "@/components/listing/ListingCardSkeleton";
import { Alert } from "@/components/ui/Alert";
import { Container } from "@/components/ui/Container";
import { useListings } from "@/hooks/useListings";
import { searchHref } from "@/lib/listing-query";
import { SectionHeader } from "./SectionHeader";

const WEEK = 7 * 24 * 60 * 60 * 1000;
const MAX_ITEMS = 10;

export function DealsCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const { data, loading, error } = useListings({ sort: "maior-desconto", limit: 40 });
  const [cutoff] = useState(() => Date.now() - WEEK);

  // Prioriza os anunciados nos últimos 7 dias; completa com os demais.
  const deals = useMemo(() => {
    const items = data?.items ?? [];
    const thisWeek = items.filter((item) => new Date(item.createdAt).getTime() >= cutoff);
    const older = items.filter((item) => new Date(item.createdAt).getTime() < cutoff);
    return [...thisWeek, ...older].slice(0, MAX_ITEMS);
  }, [data, cutoff]);

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (track) track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  };

  const arrows = (
    <div className="hidden gap-2 md:flex">
      {([-1, 1] as const).map((direction) => (
        <button
          key={direction}
          type="button"
          onClick={() => scroll(direction)}
          aria-label={direction === -1 ? "Ver anteriores" : "Ver próximos"}
          className="flex size-9 items-center justify-center rounded-full border border-border bg-surface text-chrome transition duration-150 hover:border-brand hover:text-brand"
        >
          {direction === -1 ? (
            <ChevronLeft aria-hidden className="size-5" />
          ) : (
            <ChevronRight aria-hidden className="size-5" />
          )}
        </button>
      ))}
    </div>
  );

  return (
    <section className="py-12 lg:py-16" aria-labelledby="deals-title">
      <Container>
        <div id="deals-title">
          <SectionHeader
            title="Maiores descontos da semana"
            description="Ordenados pela diferença entre o preço e a tabela FIPE."
            linkHref={searchHref({ sort: "maior-desconto" })}
            linkLabel="Ver todos"
            aside={arrows}
          />
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <ul
          ref={trackRef}
          className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        >
          {loading && deals.length === 0
            ? Array.from({ length: 4 }, (_, index) => (
                <li key={index} className="w-[78%] shrink-0 snap-start sm:w-[300px]">
                  <ListingCardSkeleton />
                </li>
              ))
            : deals.map((listing) => (
                <li key={listing.id} className="flex w-[78%] shrink-0 snap-start sm:w-[300px]">
                  <ListingCard listing={listing} className="w-full" />
                </li>
              ))}
        </ul>
      </Container>
    </section>
  );
}
