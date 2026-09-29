"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/cn";

interface FavoriteButtonProps {
  listingId: string;
  listingTitle: string;
  className?: string;
}

export function FavoriteButton({ listingId, listingTitle, className }: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(listingId);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `Remover ${listingTitle} dos favoritos` : `Favoritar ${listingTitle}`}
      onClick={(event) => {
        // O card inteiro é um link; o coração não pode navegar.
        event.preventDefault();
        event.stopPropagation();
        toggle(listingId);
      }}
      className={cn(
        "flex size-9 items-center justify-center rounded-full bg-black/55 backdrop-blur-sm transition duration-150 hover:bg-black/75",
        active ? "text-danger" : "text-white",
        className,
      )}
    >
      <Heart aria-hidden className={cn("size-[18px]", active && "fill-current")} />
    </button>
  );
}
