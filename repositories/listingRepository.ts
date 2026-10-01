import { supabase } from "@/lib/supabase/client";
import type { Listing, ListingPage, ListingQuery, ListingWithSeller } from "@/types/listing";
import { expiryCutoff } from "@/lib/listing-expiry";
import { emitDataChanged, subscribeToData } from "./events";
import {
  SELLER_COLUMNS,
  fromListing,
  toListing,
  toListingWithSeller,
  type ListingRow,
  type ListingRowWithSeller,
} from "./mappers";

const DEFAULT_LIMIT = 12;
/** Anúncio + vendedor numa consulta só (inner: sem vendedor, sem anúncio). */
const LISTING_WITH_SELLER = `*, seller:profiles!inner(${SELLER_COLUMNS})`;

export interface FilterOptions {
  brands: { brand: string; count: number }[];
  modelsByBrand: Record<string, string[]>;
  states: string[];
  citiesByState: Record<string, string[]>;
  yearRange: [number, number];
  total: number;
}

export type ListingInput = Omit<Listing, "id" | "views" | "contacts" | "createdAt" | "updatedAt" | "confirmedAt" | "status"> & {
  status?: Listing["status"];
};

/** O mesmo vendedor já tem um anúncio ativo com esta placa (regra do banco). */
export class DuplicatePlateError extends Error {
  constructor() {
    super("Você já tem um anúncio ativo com esta placa. Edite ou reative o anúncio que já existe.");
    this.name = "DuplicatePlateError";
  }
}

const UNIQUE_VIOLATION = "23505";

/** Tira caracteres que quebram a sintaxe do filtro `or` do PostgREST. */
function sanitizeTerm(term: string): string {
  return term.replace(/[,()*%\\":]/g, " ").trim();
}

function mapRows(rows: ListingRowWithSeller[] | null): ListingWithSeller[] {
  return (rows ?? []).flatMap((row) => toListingWithSeller(row) ?? []);
}

export const listingRepository = {
  async list(query: ListingQuery = {}): Promise<ListingPage> {
    const offset = query.offset ?? 0;
    const limit = query.limit ?? DEFAULT_LIMIT;
    let request = supabase().from("listings").select(LISTING_WITH_SELLER, { count: "exact" });

    const status = query.status ?? "ativo";
    if (status !== "todos") request = request.eq("status", status);
    // Ativo e confirmado dentro do prazo; os vencidos só aparecem para o dono ("todos").
    if (status === "ativo") request = request.gte("confirmed_at", expiryCutoff());
    if (query.brand) request = request.eq("brand", query.brand);
    if (query.model) request = request.eq("model", query.model);
    if (query.yearMin) request = request.gte("model_year", query.yearMin);
    if (query.yearMax) request = request.lte("model_year", query.yearMax);
    if (query.priceMin) request = request.gte("main_price", query.priceMin);
    if (query.priceMax) request = request.lte("main_price", query.priceMax);
    if (query.kmMax) request = request.lte("km", query.kmMax);
    if (query.state) request = request.eq("state", query.state);
    if (query.city) request = request.ilike("city", query.city);
    if (query.transmission) request = request.eq("transmission", query.transmission);
    if (query.fuel) request = request.eq("fuel", query.fuel);
    if (query.bodyType) request = request.eq("body_type", query.bodyType);
    if (query.sellerType) request = request.eq("seller.seller_type", query.sellerType);
    if (query.sellerId) request = request.eq("seller_id", query.sellerId);
    if (query.noAuction) request = request.eq("condition->>hasAuctionHistory", "false");
    if (query.noAccident) request = request.eq("condition->>hasAccidentHistory", "false");
    if (query.automatic) request = request.neq("transmission", "manual");
    if (query.belowFipe) request = request.gte("discount_percent", 1);
    if (query.priceMode === "repasse") request = request.neq("price_mode", "final");
    if (query.priceMode === "final") request = request.neq("price_mode", "repasse");
    if (query.text) {
      for (const term of query.text.split(/\s+/).map(sanitizeTerm).filter(Boolean)) {
        request = request.or(`brand.ilike.%${term}%,model.ilike.%${term}%,version.ilike.%${term}%`);
      }
    }

    switch (query.sort) {
      case "menor-preco":
        request = request.order("main_price", { ascending: true });
        break;
      case "maior-desconto":
        request = request.order("discount_percent", { ascending: false, nullsFirst: false });
        break;
      case "menor-km":
        request = request.order("km", { ascending: true });
        break;
      default:
        request = request.order("created_at", { ascending: false });
    }
    request = request.order("id", { ascending: true }).range(offset, offset + limit - 1);

    const { data, count, error } = await request;
    if (error) throw new Error(error.message);
    const total = count ?? 0;
    return { items: mapRows(data as ListingRowWithSeller[]), total, hasMore: offset + limit < total };
  },

  async getById(id: string): Promise<ListingWithSeller | null> {
    const { data, error } = await supabase().from("listings").select(LISTING_WITH_SELLER).eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? toListingWithSeller(data as ListingRowWithSeller) : null;
  },

  async getByIds(ids: string[]): Promise<ListingWithSeller[]> {
    if (ids.length === 0) return [];
    const { data, error } = await supabase().from("listings").select(LISTING_WITH_SELLER).in("id", ids);
    if (error) throw new Error(error.message);
    const byId = new Map(mapRows(data as ListingRowWithSeller[]).map((listing) => [listing.id, listing]));
    return ids.flatMap((id) => byId.get(id) ?? []);
  },

  /** Marcas, modelos, estados e cidades que existem entre os anúncios ativos. */
  async getFilterOptions(): Promise<FilterOptions> {
    const { data, error } = await supabase()
      .from("listings")
      .select("brand, model, state, city, model_year")
      .eq("status", "ativo")
      .gte("confirmed_at", expiryCutoff());
    if (error) throw new Error(error.message);
    const rows = (data ?? []) as Pick<ListingRow, "brand" | "model" | "state" | "city" | "model_year">[];

    const brandCount = new Map<string, number>();
    const models = new Map<string, Set<string>>();
    const cities = new Map<string, Set<string>>();
    let minYear = Infinity;
    let maxYear = -Infinity;
    for (const row of rows) {
      brandCount.set(row.brand, (brandCount.get(row.brand) ?? 0) + 1);
      if (!models.has(row.brand)) models.set(row.brand, new Set());
      models.get(row.brand)?.add(row.model);
      if (!cities.has(row.state)) cities.set(row.state, new Set());
      cities.get(row.state)?.add(row.city);
      minYear = Math.min(minYear, row.model_year);
      maxYear = Math.max(maxYear, row.model_year);
    }

    return {
      brands: [...brandCount.entries()]
        .map(([brand, count]) => ({ brand, count }))
        .sort((a, b) => b.count - a.count || a.brand.localeCompare(b.brand)),
      modelsByBrand: Object.fromEntries([...models.entries()].map(([brand, set]) => [brand, [...set].sort()])),
      states: [...cities.keys()].sort(),
      citiesByState: Object.fromEntries([...cities.entries()].map(([state, set]) => [state, [...set].sort()])),
      yearRange: rows.length ? [minYear, maxYear] : [2010, new Date().getFullYear()],
      total: rows.length,
    };
  },

  // Escritas exigem login (RLS): passam a ser usadas no wizard da Fase 7.
  async create(input: ListingInput): Promise<Listing> {
    const { plate, ...listing } = input;
    const { data, error } = await supabase()
      .from("listings")
      .insert({ ...fromListing(listing), status: input.status ?? "ativo" })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    const created = toListing(data as ListingRow);
    if (plate) {
      const { error: plateError } = await supabase().from("listing_plates").insert({ listing_id: created.id, plate });
      if (plateError) {
        // Desfaz o anúncio: senão, ao tentar de novo, o vendedor publicaria o carro duas vezes.
        await supabase().from("listings").delete().eq("id", created.id);
        throw plateError.code === UNIQUE_VIOLATION ? new DuplicatePlateError() : new Error(plateError.message);
      }
    }
    emitDataChanged("listings");
    return created;
  },

  /** "Ainda está à venda": renova o prazo do anúncio (o banco grava a hora atual). */
  async confirmAvailable(id: string): Promise<Listing> {
    const { data, error } = await supabase()
      .from("listings")
      .update({ confirmed_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    emitDataChanged("listings");
    return toListing(data as ListingRow);
  },

  async update(
    id: string,
    patch: Partial<Omit<Listing, "id" | "sellerId" | "createdAt" | "confirmedAt" | "views" | "contacts">>,
  ): Promise<Listing> {
    const { data, error } = await supabase().from("listings").update(fromListing(patch)).eq("id", id).select("*").single();
    if (error) throw error.code === UNIQUE_VIOLATION ? new DuplicatePlateError() : new Error(error.message);
    emitDataChanged("listings");
    return toListing(data as ListingRow);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase().from("listings").delete().eq("id", id);
    if (error) throw new Error(error.message);
    emitDataChanged("listings");
  },

  /** +1 visualização (função do banco; não recarrega as listas). */
  async incrementViews(id: string): Promise<void> {
    await supabase().rpc("increment_listing_views", { listing_id: id });
  },

  /** +1 contato (toque no WhatsApp). Não espera nem recarrega listas. */
  registerContact(id: string): void {
    void supabase().rpc("register_listing_contact", { listing_id: id }).then(() => undefined, () => undefined);
  },

  subscribe(callback: () => void): () => void {
    return subscribeToData("listings", callback);
  },
};
