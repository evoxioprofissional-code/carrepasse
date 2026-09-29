"use client";

import { CarFront } from "lucide-react";
import { ListingCard } from "@/components/listing/ListingCard";
import { ListingCardSkeleton } from "@/components/listing/ListingCardSkeleton";
import { Alert } from "@/components/ui/Alert";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { useListings } from "@/hooks/useListings";
import { SectionHeader } from "./SectionHeader";

export function RecentListings() {
  const { data, loading, error } = useListings({ sort: "recentes", limit: 8 });
  const items = data?.items ?? [];

  return (
    <section className="py-12 lg:py-16">
      <Container>
        <SectionHeader
          title="Recém-anunciados"
          description="Os últimos carros que entraram na plataforma."
          linkHref="/carros"
          linkLabel="Ver todos os carros"
        />

        {error && <Alert variant="danger">{error}</Alert>}

        {!error && !loading && items.length === 0 ? (
          <EmptyState
            icon={<CarFront aria-hidden />}
            title="Nenhum carro anunciado ainda"
            description="Seja o primeiro a anunciar. É grátis."
            action={<ButtonLink href="/anunciar">Anunciar grátis</ButtonLink>}
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loading && items.length === 0
              ? Array.from({ length: 8 }, (_, index) => (
                  <li key={index}>
                    <ListingCardSkeleton />
                  </li>
                ))
              : items.map((listing) => (
                  <li key={listing.id} className="flex">
                    <ListingCard listing={listing} className="w-full" />
                  </li>
                ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
