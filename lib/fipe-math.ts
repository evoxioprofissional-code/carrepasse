import type { Listing } from "@/types/listing";

type PricedListing = Pick<Listing, "fipePrice" | "repassePrice" | "finalPrice">;

/** % abaixo da FIPE (positivo) ou acima (negativo), arredondado. */
export function discountPercent(fipePrice: number, price: number): number {
  if (fipePrice <= 0) return 0;
  return Math.round(((fipePrice - price) / fipePrice) * 100);
}

/** Preço principal: repasse quando existir; senão, o final. */
export function mainPrice(listing: PricedListing): number {
  return listing.repassePrice ?? listing.finalPrice ?? 0;
}

export function listingDiscount(listing: PricedListing): number {
  return discountPercent(listing.fipePrice, mainPrice(listing));
}

export type FipeComparison =
  | { kind: "below"; percent: number }
  | { kind: "equal" }
  | { kind: "above"; percent: number }
  | { kind: "unknown" };

/** Badge "abaixo da FIPE" só a partir de 1%; acima é mostrado sem destaque. */
export function compareWithFipe(fipePrice: number, price: number): FipeComparison {
  // Sem FIPE ou sem preço válidos não há comparação honesta a fazer.
  if (!(fipePrice > 0) || !(price > 0)) return { kind: "unknown" };
  const percent = discountPercent(fipePrice, price);
  if (percent >= 1) return { kind: "below", percent };
  if (percent <= -1) return { kind: "above", percent: Math.abs(percent) };
  return { kind: "equal" };
}
