import { readValue, subscribeToKey, writeValue } from "./storage";

const KEY = "favorites";

// Até a Fase 6 (login) os favoritos ficam no "visitante" deste navegador.
export const GUEST_USER_ID = "guest";

type FavoritesByUser = Record<string, string[]>;

function readAll(): FavoritesByUser {
  return readValue<FavoritesByUser>(KEY, () => ({}));
}

export const favoriteRepository = {
  /** Síncrono: favoritos são lidos a cada render do coração. */
  listIds(userId: string = GUEST_USER_ID): string[] {
    return readAll()[userId] ?? [];
  },

  toggle(listingId: string, userId: string = GUEST_USER_ID): boolean {
    const all = readAll();
    const current = all[userId] ?? [];
    const isFavorite = current.includes(listingId);
    const next = isFavorite ? current.filter((id) => id !== listingId) : [listingId, ...current];
    writeValue(KEY, { ...all, [userId]: next });
    return !isFavorite;
  },

  subscribe(callback: () => void): () => void {
    return subscribeToKey(KEY, callback);
  },
};
