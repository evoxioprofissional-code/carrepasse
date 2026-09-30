import type { ListingStatus } from "./listing";

export type ReportReason = "golpe" | "informacao_falsa" | "carro_vendido" | "outro";
export type ReportStatus = "aberta" | "resolvida" | "descartada";

export interface Report {
  id: string;
  listingId: string;
  reason: ReportReason;
  details?: string;
  status: ReportStatus;
  createdAt: string;
  resolvedAt?: string;
}

/** Denúncia com o resumo do anúncio, para o painel de moderação. */
export interface ReportWithListing extends Report {
  listing: {
    id: string;
    title: string;
    status: ListingStatus;
    sellerId: string;
    sellerName: string;
  } | null;
}
