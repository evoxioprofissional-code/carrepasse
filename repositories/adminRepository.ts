import { supabase } from "@/lib/supabase/client";
import type { AdminStats, AdminUser } from "@/types/admin";
import type { SellerType } from "@/types/user";

type ProfileRow = {
  id: string;
  name: string;
  seller_type: SellerType;
  store_name: string | null;
  city: string | null;
  state: string | null;
  avatar_url: string | null;
  created_at: string;
  banned_at: string | null;
};

export const adminRepository = {
  /** Números do site; o banco recusa quem não é administrador. */
  async stats(): Promise<AdminStats> {
    const { data, error } = await supabase().rpc("admin_stats");
    if (error) throw new Error(error.message);
    return data as AdminStats;
  },

  /** Contas reais do site (demo fica de fora), mais recentes primeiro. */
  async listUsers(): Promise<AdminUser[]> {
    const { data, error } = await supabase()
      .from("profiles")
      .select("id, name, seller_type, store_name, city, state, avatar_url, created_at, banned_at")
      .eq("is_demo", false)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return ((data ?? []) as ProfileRow[]).map((row) => ({
      id: row.id,
      name: row.name,
      sellerType: row.seller_type,
      storeName: row.store_name,
      city: row.city,
      state: row.state,
      avatarUrl: row.avatar_url,
      createdAt: row.created_at,
      bannedAt: row.banned_at,
    }));
  },

  /** Banir ou desbanir uma conta (o banco confere se é admin). */
  async setBan(userId: string, banned: boolean): Promise<void> {
    const { error } = await supabase().rpc("admin_set_ban", { target: userId, banned });
    if (error) throw new Error(error.message);
  },
};
