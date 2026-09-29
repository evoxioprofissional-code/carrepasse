"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/cn";

interface FavoriteButtonProps {
  listingId: string;
  listingTitle: string;
  className?: string;
  /** "badge": círculo escuro (tema escuro); "plain": só o coração com sombra (sobre foto clara). */
  variant?: "badge" | "plain";
}

export function FavoriteButton({ listingId, listingTitle, className, variant = "badge" }: FavoriteButtonProps) {
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
        "flex size-9 items-center justify-center rounded-full transition duration-150",
        variant === "badge" && "bg-black/55 backdrop-blur-sm hover:bg-black/75",
        variant === "plain" && "hover:scale-110 [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.6))]",
        active ? "text-danger" : "text-white",
        className,
      )}
    >
      <Heart
        aria-hidden
        className={cn(variant === "plain" ? "size-6" : "size-[18px]", active && "fill-current")}
        strokeWidth={variant === "plain" ? 2 : undefined}
      />
    </button>
  );
}
