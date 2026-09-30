import type { Listing } from "@/types/listing";

// Anúncio ativo sem confirmação do vendedor por este prazo sai da busca.
export const LISTING_TTL_DAYS = 60;
/** A partir de quantos dias restantes o vendedor recebe o aviso. */
export const EXPIRY_WARNING_DAYS = 7;

const DAY = 24 * 60 * 60 * 1000;

/** Confirmações anteriores a esta data estão vencidas (para filtrar no banco). */
export function expiryCutoff(now: Date = new Date()): string {
  return new Date(now.getTime() - LISTING_TTL_DAYS * DAY).toISOString();
}

export function expiresAt(listing: Pick<Listing, "confirmedAt">): Date {
  return new Date(new Date(listing.confirmedAt).getTime() + LISTING_TTL_DAYS * DAY);
}

/** Dias até vencer (0 ou negativo = vencido). */
export function daysUntilExpiry(listing: Pick<Listing, "confirmedAt">, now: Date = new Date()): number {
  return Math.ceil((expiresAt(listing).getTime() - now.getTime()) / DAY);
}

/** Ativo, mas sem confirmação dentro do prazo: fora da busca e sem contato. */
export function isExpired(listing: Pick<Listing, "status" | "confirmedAt">, now: Date = new Date()): boolean {
  return listing.status === "ativo" && daysUntilExpiry(listing, now) <= 0;
}
