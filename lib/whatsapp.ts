import { mainPrice } from "./fipe-math";
import { formatBRL } from "./format";
import type { Listing } from "@/types/listing";

/** Mensagem pronta do SPEC: "Olá! Vi seu [modelo ano] no Car Repasse por R$ X..." */
export function whatsappMessage(listing: Pick<Listing, "brand" | "model" | "modelYear" | "repassePrice" | "finalPrice" | "fipePrice">): string {
  return `Olá! Vi seu ${listing.brand} ${listing.model} ${listing.modelYear} no Car Repasse por ${formatBRL(mainPrice(listing))}. Ainda está disponível?`;
}

/** Link wa.me com DDI do Brasil. */
export function whatsappLink(phoneDigits: string, message: string): string {
  const digits = phoneDigits.replace(/\D/g, "");
  const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`;
}
