"use client";

import { CalendarCheck, CheckCheck, Eye, MessageCircle, Pause, PencilLine, Play, Trash2 } from "lucide-react";
import Link from "next/link";
import { ListingPhoto } from "@/components/listing/ListingPhoto";
import { StoryDownloadLink } from "@/components/listing/StoryDownloadLink";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { mainPrice } from "@/lib/fipe-math";
import { formatBRL, formatNumber, formatRelativeDate } from "@/lib/format";
import { EXPIRY_WARNING_DAYS, daysUntilExpiry, isExpired } from "@/lib/listing-expiry";
import type { ListingStatus, ListingWithSeller } from "@/types/listing";

const STATUS_BADGE: Record<ListingStatus, { label: string; variant: "brand" | "neutral" | "warning" | "danger" }> = {
  ativo: { label: "Ativo", variant: "brand" },
  pausado: { label: "Pausado", variant: "warning" },
  vendido: { label: "Vendido", variant: "neutral" },
};

interface MyListingRowProps {
  listing: ListingWithSeller;
  busy: boolean;
  onStatus: (status: ListingStatus) => void;
  onConfirm: () => void;
  onDelete: () => void;
}

const actionClass =
  "inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 text-sm font-medium text-chrome transition duration-150 hover:border-chrome-muted/60 disabled:opacity-50";

export function MyListingRow({ listing, busy, onStatus, onConfirm, onDelete }: MyListingRowProps) {
  const title = `${listing.brand} ${listing.model}`;
  const expired = isExpired(listing);
  const daysLeft = daysUntilExpiry(listing);
  const expiringSoon = listing.status === "ativo" && !expired && daysLeft <= EXPIRY_WARNING_DAYS;
  const badge = expired ? { label: "Vencido", variant: "danger" as const } : STATUS_BADGE[listing.status];

  return (
    <li className={cn("rounded-xl border border-border bg-surface p-3 sm:p-4", busy && "opacity-60")}>
      <div className="flex gap-3">
        <Link href={`/carros/${listing.id}`} className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-lg bg-surface-2 sm:w-36">
          <ListingPhoto src={listing.photos[0]} alt={title} sizes="144px" showIllustrativeLabel={false} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/carros/${listing.id}`} className="min-w-0 rounded">
              <p className="truncate font-display font-bold uppercase text-chrome">{title}</p>
              <p className="truncate text-xs text-chrome-muted">{listing.version} · {listing.modelYear}</p>
            </Link>
            <Badge variant={badge.variant} className="shrink-0">
              {badge.label}
            </Badge>
          </div>
          <p className="mt-1 font-display text-lg font-bold text-lime-ink">{formatBRL(mainPrice(listing))}</p>
          <p className="flex flex-wrap items-center gap-x-3 text-xs text-chrome-muted">
            <span className="inline-flex items-center gap-1">
              <Eye aria-hidden className="size-3.5" />
              {formatNumber(listing.views)} visualizações
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle aria-hidden className="size-3.5" />
              {formatNumber(listing.contacts)} {listing.contacts === 1 ? "contato" : "contatos"}
            </span>
            <span>Publicado {formatRelativeDate(listing.createdAt)}</span>
          </p>
          {(expired || expiringSoon) && (
            <p className={cn("mt-1 text-xs font-semibold", expired ? "text-danger-ink" : "text-warning-ink")}>
              {expired
                ? "Saiu da busca: confirme que o carro ainda está à venda."
                : `Vence em ${daysLeft} ${daysLeft === 1 ? "dia" : "dias"}. Confirme para continuar na busca.`}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
        {(expired || expiringSoon) && (
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className={cn(actionClass, "col-span-2 border-lime-ink bg-lime text-ink hover:border-lime-ink sm:order-first")}
          >
            <CalendarCheck aria-hidden className="size-4" />
            Ainda está à venda
          </button>
        )}
        {listing.status === "ativo" && !expired && (
          <StoryDownloadLink listingId={listing.id} label="Instagram" className={actionClass} />
        )}
        <Link href={`/minha-conta/anuncios/${listing.id}/editar`} className={actionClass}>
          <PencilLine aria-hidden className="size-4" />
          Editar
        </Link>
        {listing.status === "ativo" && (
          <button type="button" disabled={busy} onClick={() => onStatus("pausado")} className={actionClass}>
            <Pause aria-hidden className="size-4" />
            Pausar
          </button>
        )}
        {listing.status !== "ativo" && (
          <button type="button" disabled={busy} onClick={() => onStatus("ativo")} className={actionClass}>
            <Play aria-hidden className="size-4" />
            Reativar
          </button>
        )}
        {listing.status !== "vendido" && (
          <button type="button" disabled={busy} onClick={() => onStatus("vendido")} className={actionClass}>
            <CheckCheck aria-hidden className="size-4" />
            Vendido
          </button>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={onDelete}
          className={cn(actionClass, "text-danger-ink hover:border-danger/50")}
          aria-label={`Excluir anúncio do ${title}`}
        >
          <Trash2 aria-hidden className="size-4" />
          Excluir
        </button>
      </div>
    </li>
  );
}
