import type {
  BodyType,
  Fuel,
  Listing,
  ListingStatus,
  ListingWithSeller,
  PriceMode,
  Transmission,
  VehicleCondition,
} from "@/types/listing";
import type { SellerSummary, SellerType, User } from "@/types/user";

// Conversão entre as linhas do Postgres (snake_case) e os tipos do app.

export interface ProfileRow {
  id: string;
  name: string;
  phone: string;
  seller_type: SellerType;
  store_name: string | null;
  city: string;
  state: string;
  avatar_url: string | null;
  is_demo: boolean;
  created_at: string;
}

export interface ListingRow {
  id: string;
  seller_id: string;
  brand: string;
  model: string;
  version: string;
  model_year: number;
  manufacture_year: number;
  fuel: Fuel;
  transmission: Transmission;
  body_type: BodyType;
  km: number;
  color: string;
  city: string;
  state: string;
  fipe_code: string | null;
  fipe_price: number;
  fipe_reference_month: string | null;
  price_mode: PriceMode;
  repasse_price: number | null;
  final_price: number | null;
  description: string;
  condition: Partial<VehicleCondition> | null;
  photos: string[];
  status: ListingStatus;
  views: number;
  contacts: number | null;
  previous_price: number | null;
  price_dropped_at: string | null;
  plate_prefix: string | null;
  created_at: string;
  updated_at: string;
  confirmed_at: string;
}

export type ListingRowWithSeller = ListingRow & { seller: ProfileRow | null };

/** Colunas do perfil que aparecem junto do anúncio. */
export const SELLER_COLUMNS = "id, name, phone, seller_type, store_name, city, state, avatar_url, is_demo, created_at";

const EMPTY_CONDITION: VehicleCondition = {
  hasAuctionHistory: false,
  hasAccidentHistory: false,
  isFinanced: false,
  hasDebts: false,
  singleOwner: false,
  hasServiceRecords: false,
  hasSpareKey: false,
};

export function toUser(row: ProfileRow): User {
  return {
    id: row.id,
    name: row.name,
    // O e-mail fica só no Auth; perfis públicos não o expõem.
    email: "",
    phone: row.phone,
    sellerType: row.seller_type,
    storeName: row.store_name ?? undefined,
    city: row.city,
    state: row.state,
    avatarUrl: row.avatar_url ?? undefined,
    createdAt: row.created_at,
  };
}

export function toSellerSummary(row: ProfileRow): SellerSummary {
  return {
    id: row.id,
    name: row.name,
    storeName: row.store_name ?? undefined,
    sellerType: row.seller_type,
    city: row.city,
    state: row.state,
    phone: row.phone,
    avatarUrl: row.avatar_url ?? undefined,
    createdAt: row.created_at,
  };
}

export function toListing(row: ListingRow): Listing {
  return {
    id: row.id,
    sellerId: row.seller_id,
    platePrefix: row.plate_prefix ?? undefined,
    brand: row.brand,
    model: row.model,
    version: row.version,
    modelYear: row.model_year,
    manufactureYear: row.manufacture_year,
    fuel: row.fuel,
    transmission: row.transmission,
    bodyType: row.body_type,
    km: row.km,
    color: row.color,
    city: row.city,
    state: row.state,
    fipeCode: row.fipe_code ?? undefined,
    fipePrice: row.fipe_price,
    fipeReferenceMonth: row.fipe_reference_month ?? undefined,
    priceMode: row.price_mode,
    repassePrice: row.repasse_price ?? undefined,
    finalPrice: row.final_price ?? undefined,
    description: row.description,
    condition: { ...EMPTY_CONDITION, ...row.condition },
    photos: row.photos ?? [],
    status: row.status,
    views: row.views,
    contacts: row.contacts ?? 0,
    previousPrice: row.previous_price ?? undefined,
    priceDroppedAt: row.price_dropped_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    confirmedAt: row.confirmed_at ?? row.created_at,
  };
}

export function toListingWithSeller(row: ListingRowWithSeller): ListingWithSeller | null {
  if (!row.seller) return null;
  return { ...toListing(row), seller: toSellerSummary(row.seller) };
}

/** Campos do app → colunas do banco (para criar/editar anúncios). */
export function fromListing(listing: Partial<Listing>): Partial<ListingRow> {
  const row: Partial<ListingRow> = {
    seller_id: listing.sellerId,
    brand: listing.brand,
    model: listing.model,
    version: listing.version,
    model_year: listing.modelYear,
    manufacture_year: listing.manufactureYear,
    fuel: listing.fuel,
    transmission: listing.transmission,
    body_type: listing.bodyType,
    km: listing.km,
    color: listing.color,
    city: listing.city,
    state: listing.state,
    fipe_code: listing.fipeCode,
    fipe_price: listing.fipePrice,
    fipe_reference_month: listing.fipeReferenceMonth,
    price_mode: listing.priceMode,
    repasse_price: listing.repassePrice,
    final_price: listing.finalPrice,
    description: listing.description,
    condition: listing.condition,
    photos: listing.photos,
    status: listing.status,
  };
  // Remove chaves não informadas para não sobrescrever com null num update parcial.
  return Object.fromEntries(Object.entries(row).filter(([, value]) => value !== undefined)) as Partial<ListingRow>;
}
