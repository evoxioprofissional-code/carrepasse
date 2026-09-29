import { createSeedListings } from "@/mocks/listings";
import { SEED_USERS } from "@/mocks/users";
import type { Listing } from "@/types/listing";
import type { User } from "@/types/user";

// Leitura dos dados de demonstração no SERVIDOR, só para metadados e
// imagens de compartilhamento (o servidor não enxerga o localStorage).
// Com backend, isto vira uma chamada à API e passa a valer para todo anúncio.

export function getSeedListing(id: string): Listing | undefined {
  return createSeedListings().find((listing) => listing.id === id);
}

export function getSeedListingIds(): string[] {
  return createSeedListings().map((listing) => listing.id);
}

export function getSeedUser(id: string): User | undefined {
  return SEED_USERS.find((user) => user.id === id);
}

export function getSeedUserIds(): string[] {
  return SEED_USERS.map((user) => user.id);
}
