import { supabase } from "@/lib/supabase/client";
import type { ListingStatus } from "@/types/listing";
import type { Report, ReportReason, ReportStatus, ReportWithListing } from "@/types/report";
import { emitDataChanged } from "./events";

interface ReportRow {
  id: string;
  listing_id: string;
  reason: ReportReason;
  details: string | null;
  status: ReportStatus;
  created_at: string;
  resolved_at: string | null;
  listing: {
    id: string;
    brand: string;
    model: string;
    model_year: number;
    status: ListingStatus;
    seller_id: string;
    seller: { name: string; store_name: string | null } | null;
  } | null;
}

const REPORT_WITH_LISTING = "*, listing:listings(id, brand, model, model_year, status, seller_id, seller:profiles(name, store_name))";

function toReport(row: ReportRow): ReportWithListing {
  return {
    id: row.id,
    listingId: row.listing_id,
    reason: row.reason,
    details: row.details ?? undefined,
    status: row.status,
    createdAt: row.created_at,
    resolvedAt: row.resolved_at ?? undefined,
    listing: row.listing
      ? {
          id: row.listing.id,
          title: `${row.listing.brand} ${row.listing.model} ${row.listing.model_year}`,
          status: row.listing.status,
          sellerId: row.listing.seller_id,
          sellerName: row.listing.seller?.store_name ?? row.listing.seller?.name ?? "Vendedor",
        }
      : null,
  };
}

export const reportRepository = {
  /** Qualquer visitante pode denunciar; só administradores leem (RLS). */
  async create(input: Pick<Report, "listingId" | "reason" | "details">): Promise<void> {
    const { error } = await supabase()
      .from("reports")
      .insert({ listing_id: input.listingId, reason: input.reason, details: input.details ?? null });
    if (error) throw new Error(error.message);
  },

  /** Painel de moderação (só retorna dados para administradores). */
  async list(status: ReportStatus): Promise<ReportWithListing[]> {
    const { data, error } = await supabase()
      .from("reports")
      .select(REPORT_WITH_LISTING)
      .eq("status", status)
      .order("created_at", { ascending: status !== "aberta" ? false : true })
      .limit(200);
    if (error) throw new Error(error.message);
    return ((data ?? []) as ReportRow[]).map(toReport);
  },

  async countOpen(): Promise<number> {
    const { count } = await supabase().from("reports").select("id", { count: "exact", head: true }).eq("status", "aberta");
    return count ?? 0;
  },

  async resolve(id: string, userId: string, status: Exclude<ReportStatus, "aberta">): Promise<void> {
    const { error } = await supabase()
      .from("reports")
      .update({ status, resolved_at: new Date().toISOString(), resolved_by: userId })
      .eq("id", id);
    if (error) throw new Error(error.message);
    emitDataChanged("reports");
  },

  async reopen(id: string): Promise<void> {
    const { error } = await supabase()
      .from("reports")
      .update({ status: "aberta", resolved_at: null, resolved_by: null })
      .eq("id", id);
    if (error) throw new Error(error.message);
    emitDataChanged("reports");
  },
};
