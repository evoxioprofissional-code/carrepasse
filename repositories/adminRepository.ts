import { supabase } from "@/lib/supabase/client";
import type { AdminStats } from "@/types/admin";

export const adminRepository = {
  /** Números do site; o banco recusa quem não é administrador. */
  async stats(): Promise<AdminStats> {
    const { data, error } = await supabase().rpc("admin_stats");
    if (error) throw new Error(error.message);
    return data as AdminStats;
  },
};
