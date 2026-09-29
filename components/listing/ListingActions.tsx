"use client";

import { Check, Flag, Heart, Share2 } from "lucide-react";
import { useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/cn";
import { ReportModal } from "./ReportModal";

interface ListingActionsProps {
  listingId: string;
  title: string;
  className?: string;
}

const actionClass =
  "inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-2.5 text-sm font-semibold text-chrome transition duration-150 hover:border-chrome-muted/60";

export function ListingActions({ listingId, title, className }: ListingActionsProps) {
  const { isFavorite, toggle } = useFavorites();
  const [copied, setCopied] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const favorite = isFavorite(listingId);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${title} no Car Repasse`, url });
        return;
      } catch {
        // Cancelado pelo usuário: segue para copiar.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copie o link do anúncio:", url);
    }
  };

  return (
    <div className={cn("grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2", className)}>
      <button type="button" onClick={() => void share()} className={actionClass}>
        {copied ? <Check aria-hidden className="size-4 text-brand" /> : <Share2 aria-hidden className="size-4" />}
        <span aria-live="polite" className="truncate">
          {copied ? (
            "Link copiado"
          ) : (
            <>
              <span className="max-[359px]:hidden">Compartilhar</span>
              <span className="min-[360px]:hidden">Enviar</span>
            </>
          )}
        </span>
      </button>
      <button
        type="button"
        onClick={() => toggle(listingId)}
        aria-pressed={favorite}
        className={cn(actionClass, favorite && "border-danger/50 text-danger")}
      >
        <Heart aria-hidden className={cn("size-4 shrink-0", favorite && "fill-current")} />
        <span className="truncate">{favorite ? "Favoritado" : "Favoritar"}</span>
      </button>
      <button
        type="button"
        onClick={() => setReportOpen(true)}
        className={cn(actionClass, "w-11 px-0 text-chrome-muted hover:border-danger/50 hover:text-danger")}
        aria-label="Denunciar anúncio"
        title="Denunciar anúncio"
      >
        <Flag aria-hidden className="size-4" />
      </button>
      <ReportModal listingId={listingId} open={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  );
}
