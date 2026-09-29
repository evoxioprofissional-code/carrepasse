import { supabase } from "@/lib/supabase/client";
import { readValue, removeValue, writeValue } from "./storage";

// Visitante: favoritos guardados neste navegador. Logado: tabela `favorites`.
// Ao entrar, os favoritos do visitante são levados para a conta.
const GUEST_KEY = "favorites-guest";

let userId: string | null = null;
let ids: string[] = [];
let snapshot = "";
const listeners = new Set<() => void>();

function publish(next: string[]) {
  ids = next;
  snapshot = next.join(",");
  listeners.forEach((listener) => listener());
}

function readGuest(): string[] {
  return readValue<string[]>(GUEST_KEY, () => []);
}

export const favoriteRepository = {
  /** Chamado pelo AuthProvider sempre que a sessão muda. */
  async setUser(nextUserId: string | null): Promise<void> {
    userId = nextUserId;
    if (!nextUserId) {
      publish(readGuest());
      return;
    }

    const guest = readGuest();
    if (guest.length > 0) {
      await supabase()
        .from("favorites")
        .upsert(guest.map((listingId) => ({ user_id: nextUserId, listing_id: listingId })), {
          onConflict: "user_id,listing_id",
          ignoreDuplicates: true,
        });
      removeValue(GUEST_KEY);
    }

    const { data } = await supabase()
      .from("favorites")
      .select("listing_id")
      .eq("user_id", nextUserId)
      .order("created_at", { ascending: false });
    if (userId === nextUserId) publish((data ?? []).map((row: { listing_id: string }) => row.listing_id));
  },

  /** Snapshot estável (string) para useSyncExternalStore. */
  getSnapshot(): string {
    return snapshot;
  },

  listIds(): string[] {
    return ids;
  },

  async toggle(listingId: string): Promise<boolean> {
    const wasFavorite = ids.includes(listingId);
    const next = wasFavorite ? ids.filter((id) => id !== listingId) : [listingId, ...ids];
    publish(next); // otimista: o coração muda na hora

    if (!userId) {
      writeValue(GUEST_KEY, next);
      return !wasFavorite;
    }

    const request = wasFavorite
      ? supabase().from("favorites").delete().eq("user_id", userId).eq("listing_id", listingId)
      : supabase().from("favorites").insert({ user_id: userId, listing_id: listingId });
    const { error } = await request;
    if (error) {
      publish(wasFavorite ? [listingId, ...ids] : ids.filter((id) => id !== listingId));
      throw new Error("Não foi possível salvar o favorito.");
    }
    return !wasFavorite;
  },

  subscribe(callback: () => void): () => void {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
};
