import { supabase } from "@/lib/supabase/client";
import type { Report } from "@/types/report";

export const reportRepository = {
  /** Qualquer visitante pode denunciar; a leitura fica restrita ao painel (futuro). */
  async create(input: Omit<Report, "id" | "createdAt">): Promise<void> {
    const { error } = await supabase()
      .from("reports")
      .insert({ listing_id: input.listingId, reason: input.reason, details: input.details ?? null });
    if (error) throw new Error(error.message);
  },
};
