import { supabase } from "@/lib/supabase/client";
import type { User } from "@/types/user";
import { emitDataChanged } from "./events";
import { SELLER_COLUMNS, toUser, type ProfileRow } from "./mappers";

export const userRepository = {
  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase().from("profiles").select(SELLER_COLUMNS).eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? toUser(data as ProfileRow) : null;
  },

  // Edição do próprio perfil exige login (RLS): usada na Fase 6.
  async update(
    id: string,
    patch: Partial<Pick<User, "name" | "phone" | "sellerType" | "storeName" | "city" | "state">>,
  ): Promise<User> {
    const { data, error } = await supabase()
      .from("profiles")
      .update({
        name: patch.name,
        phone: patch.phone,
        seller_type: patch.sellerType,
        store_name: patch.storeName ?? null,
        city: patch.city,
        state: patch.state,
      })
      .eq("id", id)
      .select(SELLER_COLUMNS)
      .single();
    if (error) throw new Error(error.message);
    emitDataChanged("profiles");
    return toUser(data as ProfileRow);
  },
};
