import { supabase } from "@/lib/supabase/client";
import type { AdminStats, AdminUser } from "@/types/admin";
import type { SellerType } from "@/types/user";

type ProfileRow = {
  id: string;
  name: string;
  phone: string | null;
  seller_type: SellerType;
  store_name: string | null;
  city: string | null;
  state: string | null;
  avatar_url: string | null;
  created_at: string;
  /** Só existe depois da migração 0014; antes dela, vem indefinido. */
  banned_at?: string | null;
};

const PROFILE_COLUMNS_BASE = "id, name, phone, seller_type, store_name, city, state, avatar_url, created_at";

export const adminRepository = {
  /** Números do site; o banco recusa quem não é administrador. */
  async stats(): Promise<AdminStats> {
    const { data, error } = await supabase().rpc("admin_stats");
    if (error) throw new Error(error.message);
    return data as AdminStats;
  },

  /** Contas reais do site (demo fica de fora), mais recentes primeiro. */
  async listUsers(): Promise<AdminUser[]> {
    const profilesQuery = (columns: string) =>
      supabase()
        .from("profiles")
        .select(columns)
        .eq("is_demo", false)
        .order("created_at", { ascending: false });

    const [profilesWithBan, listingsRes] = await Promise.all([
      profilesQuery(`${PROFILE_COLUMNS_BASE}, banned_at`),
      supabase().from("listings").select("seller_id").is("deleted_at", null),
    ]);

    // Antes da migração 0014 a coluna banned_at não existe: recarrega sem ela
    // (todo mundo aparece como "Ativo" até a migração ser aplicada).
    let profilesRes = profilesWithBan;
    if (profilesRes.error && /banned_at/i.test(profilesRes.error.message)) {
      profilesRes = await profilesQuery(PROFILE_COLUMNS_BASE);
    }
    if (profilesRes.error) throw new Error(profilesRes.error.message);
    if (listingsRes.error) throw new Error(listingsRes.error.message);

    const counts = new Map<string, number>();
    for (const row of (listingsRes.data ?? []) as { seller_id: string }[]) {
      counts.set(row.seller_id, (counts.get(row.seller_id) ?? 0) + 1);
    }

    return ((profilesRes.data ?? []) as ProfileRow[]).map((row) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      sellerType: row.seller_type,
      storeName: row.store_name,
      city: row.city,
      state: row.state,
      avatarUrl: row.avatar_url,
      createdAt: row.created_at,
      listingsCount: counts.get(row.id) ?? 0,
      bannedAt: row.banned_at ?? null,
    }));
  },

  /** Banir ou desbanir uma conta (o banco confere se é admin). */
  async setBan(userId: string, banned: boolean): Promise<void> {
    const { error } = await supabase().rpc("admin_set_ban", { target: userId, banned });
    if (error) throw new Error(error.message);
  },
};
