import { mainPrice } from "./fipe-math";
import type { Listing } from "@/types/listing";

/** Por quantos dias o selo "Baixou o preço" aparece. */
export const PRICE_DROP_DAYS = 14;

const DAY = 24 * 60 * 60 * 1000;

type PricedListing = Pick<Listing, "repassePrice" | "finalPrice" | "fipePrice" | "previousPrice" | "priceDroppedAt">;

/** Quanto o preço caiu, se a queda foi nos últimos 14 dias (senão null). */
export function recentPriceDrop(listing: PricedListing, now: Date = new Date()): number | null {
  if (!listing.previousPrice || !listing.priceDroppedAt) return null;
  if (now.getTime() - new Date(listing.priceDroppedAt).getTime() > PRICE_DROP_DAYS * DAY) return null;
  const amount = listing.previousPrice - mainPrice(listing);
  return amount > 0 ? amount : null;
}
