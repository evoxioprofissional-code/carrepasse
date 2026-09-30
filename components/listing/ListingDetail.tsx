"use client";

import { CarFront } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { useListing } from "@/hooks/useListing";
import type { ListingWithSeller } from "@/types/listing";
import { ListingContent } from "./ListingContent";
import { ListingDetailSkeleton } from "./ListingDetailSkeleton";

export function ListingDetail({ id, initial }: { id: string; initial?: ListingWithSeller }) {
  const state = useListing(id, initial);

  if (state.status === "loading") return <ListingDetailSkeleton />;

  if (state.status === "not-found" || state.status === "error") {
    return (
      <Container className="py-16">
        <EmptyState
          icon={<CarFront aria-hidden />}
          title={state.status === "error" ? "Não foi possível abrir o anúncio" : "Anúncio não encontrado"}
          description={
            state.status === "error"
              ? "Recarregue a página em alguns segundos."
              : "Ele pode ter sido removido pelo vendedor ou o link está incompleto."
          }
          action={<ButtonLink href="/carros">Ver outros carros</ButtonLink>}
        />
      </Container>
    );
  }

  return <ListingContent listing={state.listing} />;
}
