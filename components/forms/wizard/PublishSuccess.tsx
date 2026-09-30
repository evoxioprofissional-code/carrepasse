"use client";

import { CircleCheck, MessageCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { formatBRL } from "@/lib/format";
import { mainPrice } from "@/lib/fipe-math";
import type { Listing } from "@/types/listing";

interface PublishSuccessProps {
  listing: Listing;
  onNewListing: () => void;
}

export function PublishSuccess({ listing, onNewListing }: PublishSuccessProps) {
  const url = typeof window !== "undefined" ? `${window.location.origin}/carros/${listing.id}` : `/carros/${listing.id}`;
  const shareText = `${listing.brand} ${listing.model} ${listing.modelYear} por ${formatBRL(mainPrice(listing))} no Car Repasse: ${url}`;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-6 text-center">
      <CircleCheck aria-hidden className="size-16 text-brand" />
      <div>
        <h1 className="text-3xl text-chrome">Anúncio publicado!</h1>
        <p className="mt-2 text-chrome-muted">
          Seu {listing.brand} {listing.model} já aparece na busca. Compartilhe para receber contatos mais rápido.
        </p>
      </div>
      <div className="flex w-full flex-col gap-3">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 font-bold text-[#062b14] transition duration-150 hover:brightness-110"
        >
          <MessageCircle aria-hidden className="size-5" />
          Compartilhar no WhatsApp
        </a>
        <ButtonLink href={`/carros/${listing.id}`} variant="secondary" size="lg" fullWidth>
          Ver anúncio
        </ButtonLink>
        <Button variant="ghost" size="lg" fullWidth onClick={onNewListing}>
          <Plus aria-hidden className="size-5" />
          Anunciar outro carro
        </Button>
      </div>
    </div>
  );
}
