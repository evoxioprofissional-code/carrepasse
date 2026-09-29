export type ReportReason = "golpe" | "informacao_falsa" | "carro_vendido" | "outro";

export interface Report {
  id: string;
  listingId: string;
  reason: ReportReason;
  details?: string;
  createdAt: string;
}
