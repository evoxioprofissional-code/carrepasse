import { simulateLatency } from "@/lib/latency";
import { matchesQuery, sortListings } from "@/lib/listing-filter";
import { createSeedListings } from "@/mocks/listings";
import type { Listing, ListingPage, ListingQuery, ListingWithSeller } from "@/types/listing";
import { createId, readValue, subscribeToKey, writeValue } from "./storage";
import { readUsersSync, toSellerSummary } from "./userRepository";

const KEY = "listings";
const DEFAULT_LIMIT = 12;

function readAll(): Listing[] {
  return readValue<Listing[]>(KEY, () => createSeedListings());
}

function withSellers(listings: Listing[]): ListingWithSeller[] {
  const users = new Map(readUsersSync().map((user) => [user.id, user]));
  return listings.flatMap((listing) => {
    const seller = users.get(listing.sellerId);
    return seller ? [{ ...listing, seller: toSellerSummary(seller) }] : [];
  });
}

export interface FilterOptions {
  brands: { brand: string; count: number }[];
  modelsByBrand: Record<string, string[]>;
  states: string[];
  citiesByState: Record<string, string[]>;
  yearRange: [number, number];
  total: number;
}

export type ListingInput = Omit<Listing, "id" | "views" | "createdAt" | "updatedAt" | "status"> & {
  status?: Listing["status"];
};

export const listingRepository = {
  async list(query: ListingQuery = {}): Promise<ListingPage> {
    await simulateLatency(300, 700);
    const filtered = withSellers(readAll()).filter((listing) => matchesQuery(listing, query));
    const sorted = sortListings(filtered, query.sort);
    const offset = query.offset ?? 0;
    const limit = query.limit ?? DEFAULT_LIMIT;
    return {
      items: sorted.slice(offset, offset + limit),
      total: sorted.length,
      hasMore: offset + limit < sorted.length,
    };
  },

  async getById(id: string): Promise<ListingWithSeller | null> {
    await simulateLatency(300, 700);
    const listing = readAll().find((item) => item.id === id);
    return listing ? (withSellers([listing])[0] ?? null) : null;
  },

  async getByIds(ids: string[]): Promise<ListingWithSeller[]> {
    await simulateLatency(300, 700);
    const byId = new Map(withSellers(readAll()).map((listing) => [listing.id, listing]));
    return ids.flatMap((id) => byId.get(id) ?? []);
  },

  /** Marcas, modelos e estados que existem entre os anúncios ativos. */
  async getFilterOptions(): Promise<FilterOptions> {
    await simulateLatency(150, 350);
    const active = readAll().filter((listing) => listing.status === "ativo");
    const brandCount = new Map<string, number>();
    const models = new Map<string, Set<string>>();
    const states = new Set<string>();
    const cities = new Map<string, Set<string>>();
    let minYear = Infinity;
    let maxYear = -Infinity;

    for (const listing of active) {
      brandCount.set(listing.brand, (brandCount.get(listing.brand) ?? 0) + 1);
      if (!models.has(listing.brand)) models.set(listing.brand, new Set());
      models.get(listing.brand)?.add(listing.model);
      states.add(listing.state);
      if (!cities.has(listing.state)) cities.set(listing.state, new Set());
      cities.get(listing.state)?.add(listing.city);
      minYear = Math.min(minYear, listing.modelYear);
      maxYear = Math.max(maxYear, listing.modelYear);
    }

    return {
      brands: [...brandCount.entries()]
        .map(([brand, count]) => ({ brand, count }))
        .sort((a, b) => b.count - a.count || a.brand.localeCompare(b.brand)),
      modelsByBrand: Object.fromEntries(
        [...models.entries()].map(([brand, set]) => [brand, [...set].sort()]),
      ),
      states: [...states].sort(),
      citiesByState: Object.fromEntries(
        [...cities.entries()].map(([state, set]) => [state, [...set].sort()]),
      ),
      yearRange: active.length ? [minYear, maxYear] : [2010, new Date().getFullYear()],
      total: active.length,
    };
  },

  async create(input: ListingInput): Promise<Listing> {
    await simulateLatency(500, 900);
    const now = new Date().toISOString();
    const listing: Listing = {
      ...input,
      id: createId("l"),
      status: input.status ?? "ativo",
      views: 0,
      createdAt: now,
      updatedAt: now,
    };
    writeValue(KEY, [listing, ...readAll()]);
    return listing;
  },

  async update(id: string, patch: Partial<Omit<Listing, "id" | "sellerId" | "createdAt">>): Promise<Listing> {
    await simulateLatency(300, 700);
    const listings = readAll();
    const current = listings.find((item) => item.id === id);
    if (!current) throw new Error("Anúncio não encontrado.");
    const updated: Listing = { ...current, ...patch, updatedAt: new Date().toISOString() };
    writeValue(
      KEY,
      listings.map((item) => (item.id === id ? updated : item)),
    );
    return updated;
  },

  async remove(id: string): Promise<void> {
    await simulateLatency(300, 700);
    writeValue(
      KEY,
      readAll().filter((item) => item.id !== id),
    );
  },

  async incrementViews(id: string): Promise<void> {
    const listings = readAll();
    writeValue(
      KEY,
      listings.map((item) => (item.id === id ? { ...item, views: item.views + 1 } : item)),
    );
  },

  subscribe(callback: () => void): () => void {
    return subscribeToKey(KEY, callback);
  },
};
