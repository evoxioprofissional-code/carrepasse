"use client";

import { Megaphone, Plus } from "lucide-react";
import { ListingCard } from "@/components/listing/ListingCard";
import { ListingCardSkeleton } from "@/components/listing/ListingCardSkeleton";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EmptyState } from "@/components/ui/EmptyState";
import { useListings } from "@/hooks/useListings";

/** Anúncios do usuário (editar, pausar e excluir chegam com o wizard, na Fase 7). */
export function MyListings({ userId }: { userId: string }) {
  const { data, loading } = useListings({ sellerId: userId, status: "todos", limit: 100 });
  const items = data?.items ?? [];

  if (loading && !data) {
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

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Megaphone aria-hidden />}
        title="Você ainda não tem anúncios"
        description="Digite a placa, descreva o carro e receba contatos no WhatsApp. É grátis."
        action={
          <ButtonLink href="/anunciar">
            <Plus aria-hidden className="size-4" />
            Anunciar grátis
          </ButtonLink>
        }
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
