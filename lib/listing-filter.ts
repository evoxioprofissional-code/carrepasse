import type { ListingQuery, ListingWithSeller } from "@/types/listing";
import { listingDiscount, mainPrice } from "./fipe-math";

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** Filtro puro: o mesmo código pode rodar no servidor quando houver API. */
export function matchesQuery(listing: ListingWithSeller, query: ListingQuery): boolean {
  const status = query.status ?? "ativo";
  if (status !== "todos" && listing.status !== status) return false;

  const price = mainPrice(listing);

  if (query.brand && listing.brand !== query.brand) return false;
  if (query.model && listing.model !== query.model) return false;
  if (query.yearMin && listing.modelYear < query.yearMin) return false;
  if (query.yearMax && listing.modelYear > query.yearMax) return false;
  if (query.priceMin && price < query.priceMin) return false;
  if (query.priceMax && price > query.priceMax) return false;
  if (query.kmMax && listing.km > query.kmMax) return false;
  if (query.state && listing.state !== query.state) return false;
  if (query.city && normalizeText(listing.city) !== normalizeText(query.city)) return false;
  if (query.transmission && listing.transmission !== query.transmission) return false;
  if (query.fuel && listing.fuel !== query.fuel) return false;
  if (query.bodyType && listing.bodyType !== query.bodyType) return false;
  if (query.sellerType && listing.seller.sellerType !== query.sellerType) return false;
  if (query.sellerId && listing.sellerId !== query.sellerId) return false;
  if (query.noAuction && listing.condition.hasAuctionHistory) return false;
  if (query.noAccident && listing.condition.hasAccidentHistory) return false;

  if (query.priceMode === "repasse" && listing.priceMode === "final") return false;
  if (query.priceMode === "final" && listing.priceMode === "repasse") return false;

  if (query.text) {
    const haystack = normalizeText(`${listing.brand} ${listing.model} ${listing.version}`);
    const terms = normalizeText(query.text).split(/\s+/).filter(Boolean);
    if (!terms.every((term) => haystack.includes(term))) return false;
  }

  return true;
}

export function sortListings(items: ListingWithSeller[], sort: ListingQuery["sort"]): ListingWithSeller[] {
  const sorted = [...items];
  switch (sort) {
    case "menor-preco":
      return sorted.sort((a, b) => mainPrice(a) - mainPrice(b));
    case "maior-desconto":
      return sorted.sort((a, b) => listingDiscount(b) - listingDiscount(a));
    case "menor-km":
      return sorted.sort((a, b) => a.km - b.km);
    case "recentes":
    default:
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}
