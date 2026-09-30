import type {
  BodyType,
  Fuel,
  ListingQuery,
  ListingSort,
  Transmission,
} from "@/types/listing";
import type { SellerType } from "@/types/user";
import { BODY_TYPE_LABEL, FUEL_LABEL, SELLER_TYPE_LABEL, SORT_LABEL, TRANSMISSION_LABEL } from "./labels";

// Filtros da busca <-> query string em português, para o link ser
// compartilhável: /carros?marca=Fiat&precoMax=60000&semLeilao=1

/** Anúncios mostrados no perfil do vendedor (servidor e navegador usam o mesmo). */
export const SELLER_PAGE_LIMIT = 60;

export type SearchFilters = Omit<ListingQuery, "offset" | "limit" | "status" | "sellerId">;

const PARAM = {
  brand: "marca",
  model: "modelo",
  yearMin: "anoMin",
  yearMax: "anoMax",
  priceMin: "precoMin",
  priceMax: "precoMax",
  kmMax: "kmMax",
  state: "uf",
  city: "cidade",
  transmission: "cambio",
  fuel: "combustivel",
  priceMode: "modalidade",
  sellerType: "vendedor",
  bodyType: "carroceria",
  noAuction: "semLeilao",
  noAccident: "semSinistro",
  automatic: "automatico",
  belowFipe: "abaixoFipe",
  text: "busca",
  sort: "ordem",
} as const satisfies Record<keyof SearchFilters, string>;

type Reader = { get(name: string): string | null };

function readNumber(params: Reader, name: string): number | undefined {
  const value = Number(params.get(name));
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

function readEnum<T extends string>(params: Reader, name: string, allowed: Record<T, string>): T | undefined {
  const value = params.get(name);
  return value && value in allowed ? (value as T) : undefined;
}

function readText(params: Reader, name: string): string | undefined {
  const value = params.get(name)?.trim();
  return value ? value : undefined;
}

export function parseSearchFilters(params: Reader): SearchFilters {
  const priceMode = params.get(PARAM.priceMode);
  return {
    brand: readText(params, PARAM.brand),
    model: readText(params, PARAM.model),
    yearMin: readNumber(params, PARAM.yearMin),
    yearMax: readNumber(params, PARAM.yearMax),
    priceMin: readNumber(params, PARAM.priceMin),
    priceMax: readNumber(params, PARAM.priceMax),
    kmMax: readNumber(params, PARAM.kmMax),
    state: readText(params, PARAM.state)?.toUpperCase(),
    city: readText(params, PARAM.city),
    transmission: readEnum<Transmission>(params, PARAM.transmission, TRANSMISSION_LABEL),
    fuel: readEnum<Fuel>(params, PARAM.fuel, FUEL_LABEL),
    priceMode: priceMode === "repasse" || priceMode === "final" ? priceMode : undefined,
    sellerType: readEnum<SellerType>(params, PARAM.sellerType, SELLER_TYPE_LABEL),
    bodyType: readEnum<BodyType>(params, PARAM.bodyType, BODY_TYPE_LABEL),
    noAuction: params.get(PARAM.noAuction) === "1" || undefined,
    noAccident: params.get(PARAM.noAccident) === "1" || undefined,
    automatic: params.get(PARAM.automatic) === "1" || undefined,
    belowFipe: params.get(PARAM.belowFipe) === "1" || undefined,
    text: readText(params, PARAM.text),
    sort: readEnum<ListingSort>(params, PARAM.sort, SORT_LABEL),
  };
}

export function serializeSearchFilters(filters: SearchFilters): string {
  const params = new URLSearchParams();
  (Object.keys(PARAM) as (keyof SearchFilters)[]).forEach((key) => {
    const value = filters[key];
    if (value === undefined || value === "" || value === false) return;
    if (key === "sort" && value === "recentes") return;
    params.set(PARAM[key], value === true ? "1" : String(value));
  });
  return params.toString();
}

export function searchHref(filters: SearchFilters): string {
  const qs = serializeSearchFilters(filters);
  return qs ? `/carros?${qs}` : "/carros";
}

/** Quantos filtros estão ativos (ordenação não conta). */
export function countActiveFilters(filters: SearchFilters): number {
  return (Object.keys(filters) as (keyof SearchFilters)[]).filter(
    (key) => key !== "sort" && filters[key] !== undefined,
  ).length;
}
