"use client";

import { CarFront } from "lucide-react";
import { useEffect, useState } from "react";
import { SignInRequired } from "@/components/auth/SignInRequired";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { listingRepository } from "@/repositories/listingRepository";
import type { Listing } from "@/types/listing";
import { ListingWizard } from "./ListingWizard";

/** Edição: reaproveita as etapas do anúncio, sem refazer a consulta da placa. */
export function EditListingSection({ id }: { id: string }) {
  const { state } = useAuth();
  const [loaded, setLoaded] = useState<{ id: string; listing: Listing | null } | null>(null);

  useEffect(() => {
    let cancelled = false;
    listingRepository
      .getById(id)
      .then((listing) => !cancelled && setLoaded({ id, listing }))
      .catch(() => !cancelled && setLoaded({ id, listing: null }));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.status === "anonymous") {
    return (
      <Container className="max-w-3xl py-16">
        <SignInRequired />
      </Container>
    );
  }

  if (state.status !== "authenticated" || !loaded || loaded.id !== id) {
    return (
      <Container className="max-w-3xl py-8" aria-busy>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-6 h-72 w-full rounded-2xl" />
      </Container>
    );
  }

  // Só o dono edita (o banco também barra: RLS).
  if (!loaded.listing || loaded.listing.sellerId !== state.user.id) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={<CarFront aria-hidden />}
          title="Anúncio não encontrado"
          description="Ele pode ter sido excluído ou não pertence à sua conta."
          action={<ButtonLink href="/minha-conta/anuncios">Voltar para meus anúncios</ButtonLink>}
        />
      </Container>
    );
  }

  return <ListingWizard mode="edit" user={state.user} listing={loaded.listing} />;
}
